"""Seed the database with initial departments, doctors, and demo users"""
from sqlalchemy.orm import Session
from app.models.department import Department, Doctor
from app.models.user import User
from app.core.security import hash_password

def seed_database(db: Session):
    # Only seed if DB is empty
    if db.query(Department).count() > 0:
        return

    # Departments
    departments = [
        Department(id="dept-1", name="Cardiology", description="Heart and cardiovascular system", avg_consult_time=12),
        Department(id="dept-2", name="General Medicine", description="Primary care and general consultation", avg_consult_time=8),
        Department(id="dept-3", name="Pediatrics", description="Child and adolescent healthcare", avg_consult_time=10),
        Department(id="dept-4", name="Orthopedics", description="Bones, joints, and musculoskeletal system", avg_consult_time=15),
        Department(id="dept-5", name="Dermatology", description="Skin, hair, and nail conditions", avg_consult_time=8),
        Department(id="dept-6", name="Neurology", description="Brain and nervous system disorders", avg_consult_time=18),
        Department(id="dept-7", name="Radiology", description="Medical imaging and diagnostics", avg_consult_time=20),
    ]
    db.add_all(departments)

    # Doctors
    doctors = [
        Doctor(id="doc-1", name="Dr. Sarah Jenkins", department_id="dept-1", specialization="Interventional Cardiology", room="C-101"),
        Doctor(id="doc-2", name="Dr. Michael Chen", department_id="dept-1", specialization="Electrophysiology", room="C-102"),
        Doctor(id="doc-3", name="Dr. Emily Roberts", department_id="dept-2", specialization="Internal Medicine", room="G-201"),
        Doctor(id="doc-4", name="Dr. James Wilson", department_id="dept-2", specialization="Family Medicine", room="G-202", available=False),
        Doctor(id="doc-5", name="Dr. Aisha Patel", department_id="dept-3", specialization="Neonatology", room="P-301"),
        Doctor(id="doc-6", name="Dr. Robert Kim", department_id="dept-4", specialization="Joint Replacement", room="O-401"),
        Doctor(id="doc-7", name="Dr. Lisa Chang", department_id="dept-5", specialization="Cosmetic Dermatology", room="D-501"),
        Doctor(id="doc-8", name="Dr. Raj Mehta", department_id="dept-6", specialization="Stroke & Epilepsy", room="N-601"),
        Doctor(id="doc-9", name="Dr. Anna Torres", department_id="dept-7", specialization="Diagnostic Imaging", room="R-701"),
    ]
    db.add_all(doctors)

    # Demo Users (same credentials as frontend mock)
    users = [
        User(id="user-p1", name="Santosh Kumar", email="patient@xyz.com", password_hash=hash_password("pass123"), role="patient", phone="9876543210"),
        User(id="user-p2", name="Priya Sharma", email="priya@xyz.com", password_hash=hash_password("pass123"), role="patient", phone="9876543211"),
        User(id="user-d1", name="Dr. Sarah Jenkins", email="doctor@xyz.com", password_hash=hash_password("pass123"), role="doctor", phone="9876543220", doctor_id="doc-1"),
        User(id="user-d2", name="Dr. Emily Roberts", email="emily@xyz.com", password_hash=hash_password("pass123"), role="doctor", phone="9876543221", doctor_id="doc-3"),
        User(id="user-a1", name="Admin User", email="admin@xyz.com", password_hash=hash_password("pass123"), role="admin", phone="9876543230"),
    ]
    db.add_all(users)

    db.commit()
    print("✅ Database seeded with departments, doctors, and demo users.")
