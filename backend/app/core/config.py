"""
QTrack Backend — Configuration
"""
from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./qtrack.db"
    SECRET_KEY: str = "qtrack-dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    
    class Config:
        env_file = Path(__file__).resolve().parent.parent / ".env"

settings = Settings()
