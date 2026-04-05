"""Token (Queue Entry) model"""
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Token(Base):
    __tablename__ = "tokens"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    token_number = Column(String, nullable=False, unique=True)
    patient_id = Column(String, ForeignKey("users.id"), nullable=True)
    patient_name = Column(String, nullable=False)
    doctor_id = Column(String, ForeignKey("doctors.id"), nullable=False)
    department_id = Column(String, ForeignKey("departments.id"), nullable=False)
    position = Column(Integer, default=0)
    status = Column(String, default="waiting")  # waiting | near_turn | called | completed | cancelled
    eta = Column(Integer, default=0)  # estimated minutes
    priority = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)

class QueueLog(Base):
    __tablename__ = "queue_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    token_id = Column(String, ForeignKey("tokens.id"), nullable=False)
    action = Column(String, nullable=False)  # created | called | completed | delayed | cancelled
    source = Column(String, default="system")  # patient | doctor | admin | system
    details = Column(String, default="")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
