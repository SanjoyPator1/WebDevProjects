# User Pydantic schemas
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    """Schema for creating a new user"""
    email: EmailStr
    username: str
    password: str
    full_name: str

class UserResponse(BaseModel):
    """Schema for user response -  password not included"""
    id: int
    email: str
    username: str
    full_name: str
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str