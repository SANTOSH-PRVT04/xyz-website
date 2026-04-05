"""AI Recommendation Routes — Dynamic analysis of queue state"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import require_role
from app.models.token import Token
from app.models.department import Department, Doctor
from app.schemas import AIRecommendation
from typing import List

router = APIRouter(prefix="/api/ai", tags=["AI Engine"])

@router.get("/recommendations", response_model=List[AIRecommendation])
def get_recommendations(user=Depends(require_role("admin")), db: Session = Depends(get_db)):
    recs = []
    departments = db.query(Department).all()
    
    # Build load data
    dept_loads = []
    for dept in departments:
        active = db.query(Token).filter(Token.department_id == dept.id, Token.status.notin_(["completed", "cancelled"])).count()
        doc_count = db.query(Doctor).filter(Doctor.department_id == dept.id).count()
        capacity = doc_count * 5
        load = min(100, round((active / capacity) * 100)) if capacity > 0 else 0
        dept_loads.append({"id": dept.id, "name": dept.name, "active": active, "docs": doc_count, "load": load})

    # 1. Overloaded departments (>60%)
    overloaded = [d for d in dept_loads if d["load"] > 60]
    underloaded = [d for d in dept_loads if d["load"] < 20]
    for dept in overloaded:
        suggestion = f"Route patients to {underloaded[0]['name']} ({underloaded[0]['load']}%)" if underloaded else "Alert on-call staff."
        recs.append(AIRecommendation(
            id=f"ai-overload-{dept['id']}", department_id=dept["id"], type="overload",
            message=f"{dept['name']} is at {dept['load']}% capacity with {dept['active']} patients.",
            suggestion=suggestion, severity="critical" if dept["load"] > 80 else "high", metric=f"{dept['load']}%"
        ))

    # 2. Doctor queue imbalance
    doctors = db.query(Doctor).filter(Doctor.available == True).all()
    for doc in doctors:
        queue_count = db.query(Token).filter(Token.doctor_id == doc.id, Token.status.notin_(["completed", "cancelled"])).count()
        if queue_count >= 4:
            dept = next((d for d in dept_loads if d["id"] == doc.department_id), None)
            recs.append(AIRecommendation(
                id=f"ai-queue-{doc.id}", department_id=doc.department_id, type="rebalance",
                message=f"{doc.name} has {queue_count} patients queued.",
                suggestion=f"Check if another doctor in {dept['name'] if dept else 'department'} can absorb overflow.",
                severity="medium", metric=f"{queue_count} patients"
            ))

    # 3. Idle departments 
    for dept in dept_loads:
        if dept["load"] == 0 and dept["docs"] > 0:
            busiest = max(dept_loads, key=lambda d: d["load"])
            if busiest["load"] > 30:
                recs.append(AIRecommendation(
                    id=f"ai-idle-{dept['id']}", department_id=dept["id"], type="optimization",
                    message=f"{dept['name']} has {dept['docs']} doctors but 0 patients.",
                    suggestion=f"Accept overflow from {busiest['name']} ({busiest['load']}% load).",
                    severity="low", metric="0%"
                ))

    if not recs:
        recs.append(AIRecommendation(
            id="ai-clear", department_id=None, type="all_clear",
            message="All departments operating normally.", suggestion="No action required.",
            severity="none", metric="✓"
        ))
    
    return recs
