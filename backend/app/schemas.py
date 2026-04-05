"""Pydantic schemas for request/response validation"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# --- AUTH ---
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "patient"
    phone: str = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    phone: str
    doctor_id: Optional[str] = None

# --- DEPARTMENT / DOCTOR ---
class DepartmentResponse(BaseModel):
    id: str
    name: str
    description: str
    avg_consult_time: int
    active: bool

class DoctorResponse(BaseModel):
    id: str
    name: str
    department_id: str
    specialization: str
    room: str
    available: bool

# --- QUEUE TOKEN ---
class GenerateTokenRequest(BaseModel):
    doctor_id: str
    department_id: str

class QueueTokenResponse(BaseModel):
    id: str
    token_number: str
    patient_id: Optional[str]
    patient_name: str
    doctor_id: str
    department_id: str
    position: int
    status: str
    eta: int
    priority: int
    created_at: datetime
    expires_at: Optional[datetime]
    doctor_name: Optional[str] = None
    department_name: Optional[str] = None
    room: Optional[str] = None

# --- STATS ---
class StatsResponse(BaseModel):
    active_patients: int
    avg_wait_time: int
    available_doctors: int
    emergency_cases: int

class DepartmentLoadResponse(BaseModel):
    id: str
    name: str
    active_tokens: int
    doctor_count: int
    load_percent: int

# --- AI ---
class AIRecommendation(BaseModel):
    id: str
    department_id: Optional[str]
    type: str
    message: str
    suggestion: str
    severity: str
    metric: Optional[str] = None
