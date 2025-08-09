from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  String, Text, Boolean
from app.models.base import BaseModel
from typing import Optional
import enum

class ScopeCategoryEnum(enum.Enum):
    """
    scope categories for organizing permissions.

    categories help group related scopes and organize consent screens.
    """
    OPENID = "OPENID"      # OpenID Connect standard scopes
    PROFILE = "PROFILE"    # User profile information
    CHAT = "CHAT"          # Chat application features
    ADMIN = "ADMIN"        # Administrative functions

class Scope(BaseModel):
    """
    Global scope definitions for OAuth 2.0 permissions.
    """
    __tablename__ = "scopes"
    
    id: Mapped[str] = mapped_column(
        String(100),
        primary_key=True,
        comment="Technical scope identifier (e.g., 'read:messages', 'admin:organization')"
    )

    display_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    
    description: Mapped[Optional[str]] = mapped_column(
        Text,
    )
    
    category: Mapped[ScopeCategoryEnum] = mapped_column(
        nullable=False,
    )
    
    is_default: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        server_default='false',
    )
    
    requires_consent: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        server_default='true',
    )
    
    organization_specific: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        server_default='false',
    )
    
    is_sensitive: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        server_default='false',
    )
    
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        server_default='true',
        comment="Whether this scope is available for use"
    )
    
    @property
    def scope_name(self) -> str:
        """OAuth 2.0 scope name (alias for id)"""
        return self.id
    
    @scope_name.setter
    def scope_name(self, value: str) -> None:
        self.id = value
    
    def __repr__(self) -> str:
        return f"<Scope(scope_name='{self.scope_name}', category='{self.category.value}', display_name='{self.display_name}')>"
    
