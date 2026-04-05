"""Department and Doctor models"""
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    description = Column(String, default="")
    avg_consult_time = Column(Integer, default=10)  # minutes
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    department_id = Column(String, ForeignKey("departments.id"), nullable=False)
    specialization = Column(String, default="")
    room = Column(String, default="")
    available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
