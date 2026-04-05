"""Queue / Token Routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models.user import User
from app.models.token import Token, QueueLog
from app.models.department import Department, Doctor
from app.schemas import GenerateTokenRequest, QueueTokenResponse, StatsResponse, DepartmentLoadResponse
from typing import List
import uuid

router = APIRouter(prefix="/api/queue", tags=["Queue"])

def _next_token_number(db: Session) -> str:
    count = db.query(Token).count()
    return f"TKN-{str(count + 1).zfill(3)}"

def _enrich_token(token: Token, db: Session) -> dict:
    doc = db.query(Doctor).filter(Doctor.id == token.doctor_id).first()
    dept = db.query(Department).filter(Department.id == token.department_id).first()
    return {
        **{c.name: getattr(token, c.name) for c in token.__table__.columns},
        "doctor_name": doc.name if doc else None,
        "department_name": dept.name if dept else None,
        "room": doc.room if doc else None,
    }

@router.post("/generate", response_model=QueueTokenResponse)
def generate_token(req: GenerateTokenRequest, user: User = Depends(require_role("patient")), db: Session = Depends(get_db)):
    # Check if patient already has an active token
    existing = db.query(Token).filter(
        Token.patient_id == user.id,
        Token.status.notin_(["completed", "cancelled"])
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have an active token. Cancel it first.")

    dept = db.query(Department).filter(Department.id == req.department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    consult_time = dept.avg_consult_time or 10
    active_for_doctor = db.query(Token).filter(
        Token.doctor_id == req.doctor_id,
        Token.status.notin_(["completed", "cancelled"])
    ).count()

    now = datetime.now(timezone.utc)
    token = Token(
        id=str(uuid.uuid4()),
        token_number=_next_token_number(db),
        patient_id=user.id,
        patient_name=user.name,
        doctor_id=req.doctor_id,
        department_id=req.department_id,
        position=active_for_doctor,
        status="called" if active_for_doctor == 0 else "waiting",
        eta=active_for_doctor * consult_time,
        priority=1,
        created_at=now,
        expires_at=now + timedelta(hours=2),
    )
    db.add(token)
    db.add(QueueLog(token_id=token.id, action="created", source="patient", details=f"Token for {user.name}"))
    db.commit()
    db.refresh(token)
    return _enrich_token(token, db)

@router.get("/my-token", response_model=QueueTokenResponse)
def get_my_token(user: User = Depends(require_role("patient")), db: Session = Depends(get_db)):
    token = db.query(Token).filter(
        Token.patient_id == user.id,
        Token.status.notin_(["completed", "cancelled"])
    ).first()
    if not token:
        raise HTTPException(status_code=404, detail="No active token")
    return _enrich_token(token, db)

@router.delete("/cancel/{token_id}")
def cancel_token(token_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    token = db.query(Token).filter(Token.id == token_id).first()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    token.status = "cancelled"
    db.add(QueueLog(token_id=token.id, action="cancelled", source=user.role))
    db.commit()
    return {"message": "Token cancelled"}

@router.get("/doctor/{doctor_id}", response_model=List[QueueTokenResponse])
def get_doctor_queue(doctor_id: str, user: User = Depends(require_role("doctor", "admin")), db: Session = Depends(get_db)):
    tokens = db.query(Token).filter(
        Token.doctor_id == doctor_id,
        Token.status.notin_(["completed", "cancelled"])
    ).order_by(Token.position).all()
    return [_enrich_token(t, db) for t in tokens]

@router.post("/call-next/{doctor_id}")
def call_next(doctor_id: str, user: User = Depends(require_role("doctor")), db: Session = Depends(get_db)):
    dept = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    consult_time = 10
    if dept:
        d = db.query(Department).filter(Department.id == dept.department_id).first()
        if d: consult_time = d.avg_consult_time or 10

    current = db.query(Token).filter(Token.doctor_id == doctor_id, Token.status == "called").first()
    if current:
        current.status = "completed"
        db.add(QueueLog(token_id=current.id, action="completed", source="doctor"))

    waiting = db.query(Token).filter(
        Token.doctor_id == doctor_id,
        Token.status.in_(["waiting", "near_turn"])
    ).order_by(Token.position).all()

    if waiting:
        waiting[0].status = "called"
        waiting[0].eta = 0
        waiting[0].position = 0
        for i, t in enumerate(waiting[1:], 1):
            t.position = i
            t.eta = i * consult_time
            t.status = "near_turn" if i == 1 else "waiting"
        db.add(QueueLog(token_id=waiting[0].id, action="called", source="doctor"))

    db.commit()
    return {"message": "Next patient called"}

@router.post("/complete/{doctor_id}")
def mark_complete(doctor_id: str, user: User = Depends(require_role("doctor")), db: Session = Depends(get_db)):
    current = db.query(Token).filter(Token.doctor_id == doctor_id, Token.status == "called").first()
    if not current:
        raise HTTPException(status_code=404, detail="No active patient")
    current.status = "completed"
    db.add(QueueLog(token_id=current.id, action="completed", source="doctor"))
    
    # Auto-promote next
    dept = db.query(Department).filter(Department.id == current.department_id).first()
    consult_time = dept.avg_consult_time if dept else 10
    waiting = db.query(Token).filter(Token.doctor_id == doctor_id, Token.status.in_(["waiting", "near_turn"])).order_by(Token.position).all()
    if waiting:
        waiting[0].status = "called"
        waiting[0].eta = 0
        waiting[0].position = 0
        for i, t in enumerate(waiting[1:], 1):
            t.position = i
            t.eta = i * consult_time
            t.status = "near_turn" if i == 1 else "waiting"
    
    db.commit()
    return {"message": "Patient marked as completed"}

@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    active = db.query(Token).filter(Token.status.notin_(["completed", "cancelled"])).all()
    avg_eta = round(sum(t.eta for t in active) / len(active)) if active else 0
    docs = db.query(Doctor).filter(Doctor.available == True).count()
    emergency = len([t for t in active if t.priority >= 3])
    return StatsResponse(active_patients=len(active), avg_wait_time=avg_eta, available_doctors=docs, emergency_cases=emergency)

@router.get("/live", response_model=List[QueueTokenResponse])
def get_live_queue(db: Session = Depends(get_db)):
    tokens = db.query(Token).filter(
        Token.status.notin_(["completed", "cancelled"])
    ).order_by(Token.position).limit(6).all()
    return [_enrich_token(t, db) for t in tokens]

@router.get("/department-load", response_model=List[DepartmentLoadResponse])
def get_department_load(db: Session = Depends(get_db)):
    departments = db.query(Department).all()
    result = []
    for dept in departments:
        active = db.query(Token).filter(Token.department_id == dept.id, Token.status.notin_(["completed", "cancelled"])).count()
        doc_count = db.query(Doctor).filter(Doctor.department_id == dept.id).count()
        capacity = doc_count * 5
        load = min(100, round((active / capacity) * 100)) if capacity > 0 else 0
        result.append(DepartmentLoadResponse(id=dept.id, name=dept.name, active_tokens=active, doctor_count=doc_count, load_percent=load))
    return result
