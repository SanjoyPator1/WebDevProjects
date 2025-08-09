from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  String, Text, ForeignKey, Integer, JSON
from app.models.base import BaseModel
from typing import Optional
import enum

class AuditEventType(enum.Enum):
    """
    types of events that can be audited in the OAuth system
    """

    # quthentication events
    USER_LOGIN = "USER_LOGIN"
    USER_LOGOUT = "USER_LOGOUT"
    USER_REGISTRATION = "USER_REGISTRATION"
    LOGIN_FAILED = "LOGIN_FAILED"
    
    # OAuth events
    TOKEN_ISSUED = "TOKEN_ISSUED"
    TOKEN_REFRESHED = "TOKEN_REFRESHED"
    TOKEN_REVOKED = "TOKEN_REVOKED"
    AUTHORIZATION_GRANTED = "AUTHORIZATION_GRANTED"
    AUTHORIZATION_DENIED = "AUTHORIZATION_DENIED"
    
    # administrative events
    CLIENT_REGISTERED = "CLIENT_REGISTERED"
    CLIENT_UPDATED = "CLIENT_UPDATED"
    CLIENT_DELETED = "CLIENT_DELETED"
    USER_ROLE_CHANGED = "USER_ROLE_CHANGED"
    
    # security events
    PASSWORD_RESET = "PASSWORD_RESET"
    EMAIL_VERIFIED = "EMAIL_VERIFIED"
    ACCOUNT_LOCKED = "ACCOUNT_LOCKED"
    SECURITY_BREACH = "SECURITY_BREACH"
    SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY"

class AuditStatus(enum.Enum):
    """Status/outcome of audited events"""
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE" 
    WARNING = "WARNING"

class AuditLog(BaseModel):
    """
    comprehensive audit logging for security and compliance.
    """
    __tablename__ = "audit_logs"
    
    # use integer for performance in high-volume logging
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    
    event_type: Mapped[AuditEventType] = mapped_column(
        nullable=False,
        index=True,
    )
    
    status: Mapped[AuditStatus] = mapped_column(
        nullable=False,
    )
    
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36),  # UUID length
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
    )
    
    client_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        ForeignKey("oauth_clients.id", ondelete="SET NULL"),
    )
    
    organization_id: Mapped[Optional[str]] = mapped_column(
        String(36),  # UUID length
        ForeignKey("organizations.id", ondelete="SET NULL"),
    )
    
    ip_address: Mapped[Optional[str]] = mapped_column(
        String(45),  # IPv6 addresses can be up to 45 characters
    )
    
    user_agent: Mapped[Optional[str]] = mapped_column(
        String(500),
    )
    
    event_data: Mapped[Optional[dict]] = mapped_column(
        JSON,
    )
    # Example event_data structures:
    # LOGIN_SUCCESS: {"method": "password", "remember_me": true}
    # TOKEN_ISSUED: {"grant_type": "authorization_code", "scope": "openid profile", "expires_in": 3600}
    # ROLE_CHANGED: {"old_role": "MEMBER", "new_role": "ADMIN", "changed_by": "admin_user_id"}
    
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
    )
    
    # relationships
    
    user: Mapped[Optional["User"]] = relationship(foreign_keys=[user_id])
    client: Mapped[Optional["OAuthClient"]] = relationship(foreign_keys=[client_id])
    organization: Mapped[Optional["Organization"]] = relationship(foreign_keys=[organization_id])
    
    def __repr__(self) -> str:
        return f"<AuditLog(id={self.id}, event_type='{self.event_type.value}', status='{self.status.value}')>"
