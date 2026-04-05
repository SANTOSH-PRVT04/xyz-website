"""Department & Doctor Routes"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.department import Department, Doctor
from app.schemas import DepartmentResponse, DoctorResponse
from typing import List

router = APIRouter(prefix="/api", tags=["Hospital"])

@router.get("/departments", response_model=List[DepartmentResponse])
def list_departments(db: Session = Depends(get_db)):
    return db.query(Department).filter(Department.active == True).all()

@router.get("/doctors", response_model=List[DoctorResponse])
def list_doctors(department_id: str = None, db: Session = Depends(get_db)):
    q = db.query(Doctor)
    if department_id:
        q = q.filter(Doctor.department_id == department_id, Doctor.available == True)
    return q.all()
