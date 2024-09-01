from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from app.schemas.beach import BeachOut


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    preferred_language: Optional[str] = "en"
    notification_preferences: Optional[str] = "email"

    @validator("password")
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(char.isdigit() for char in v):
            raise ValueError("Password must contain at least one digit")
        if not any(char.isupper() for char in v):
            raise ValueError("Password must contain at least one uppercase letter")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserInDB(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime]
    last_login: Optional[datetime]
    phone_number: Optional[str]
    preferred_language: str
    notification_preferences: str
    favorite_beaches: List[BeachOut] = []

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    full_name: Optional[str]
    phone_number: Optional[str]
    preferred_language: Optional[str]
    notification_preferences: Optional[str]
