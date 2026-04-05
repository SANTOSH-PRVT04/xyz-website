"""
QTrack Backend — FastAPI Application
=====================================
Hospital Queue Management System Backend

Run: uvicorn main:app --reload --port 8000
Docs: http://localhost:8000/docs
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.department import Department, Doctor
from app.models.token import Token, QueueLog
from app.routes import auth, queue, hospital, ai
from app.seed import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    Base.metadata.create_all(bind=engine)
    # Seed demo data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="QTrack API",
    description="AI-Powered Hospital Queue Management System",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(auth.router)
app.include_router(queue.router)
app.include_router(hospital.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {
        "service": "QTrack API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "auth": "/api/auth",
            "queue": "/api/queue",
            "departments": "/api/departments",
            "doctors": "/api/doctors",
            "ai": "/api/ai",
        }
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
