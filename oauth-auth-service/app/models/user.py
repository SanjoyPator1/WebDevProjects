"""
User model for authentication
"""
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  String, Boolean, DateTime, Index
from app.models.base import BaseModel
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    """
    User model for authentication system.
    """

    __tablename__ = "users"

    # authentication fields

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    # OPENID connect profile - optional
    # these fields support OpenID connect standard clients

    given_name: Mapped[Optional[str]] = mapped_column(
        String(100)
    )

    family_name: Mapped[Optional[str]] = mapped_column(
        String(100)
    )

    picture_url: Mapped[Optional[str]] = mapped_column(
        String(500)
    )

    # contact and verification

    email_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        server_default='false'
    )

    phone_number: Mapped[Optional[str]] = mapped_column(
        String(20)
    )

    phone_verified: Mapped[bool] = mapped_column(
        Boolean,
        default= False,
        nullable= False,
        server_default="false"
    )

    # user preference
    locale: Mapped[str] = mapped_column(
        String(10),
        default="en",
        nullable=False,
        server_default='en'
    )

    timezone: Mapped[Optional[str]] = mapped_column(
        String(50)
    )

    # status and activity
    last_login_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        server_default="true",
        index=True
    )

    is_superuser: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        server_default='false'
    )

    # relationships
    # many to many relationship with organizations through association object
    # organizations this user belongs to
    organization_memberships: Mapped[List["UserOrganization"]] = relationship(
        foreign_keys="UserOrganization.user_id",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    # One-to-many: Users this user invited (separate relationship)
    invited_memberships: Mapped[List["UserOrganization"]] = relationship(
        foreign_keys="UserOrganization.invited_by",  # Fix: Use the other FK
        lazy="select",
    )
    
    # one to many with refresh tokens
    # Active refresh tokens for this user
    refresh_tokens: Mapped[List["RefreshToken"]] = relationship( # type: ignore
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="select",  # Don't load tokens unless specifically needed
    )

    # one to many with OAuth clients created by this user
    created_oauth_clients: Mapped[List["OAuthClient"]] = relationship( # type: ignore
        foreign_keys = "OAuthClient.created_by",
        back_populates="creator",
        lazy="select"
    )

    def __repr__(self) -> str:
        return f"User(id='{self.id}', email='{self.email}', active={self.is_active})>"
    
    def get_display_name(self) -> str:
        """Get the best available display name for the user"""
        if self.given_name and self.family_name:
            return f"{self.given_name} {self.family_name}"
        return self.full_name
