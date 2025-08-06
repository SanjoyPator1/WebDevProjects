"""
User model for authentication
"""

from sqlalchemy import Column, String, Boolean
from app.models.base import BaseModel

class User(BaseModel):
    """
    User model for authentication
    """

    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    full_name = Column(String, nullable=False)

    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    is_superuser = Column(Boolean, default=False)
