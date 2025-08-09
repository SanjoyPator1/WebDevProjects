from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  String, DateTime, ForeignKey, CheckConstraint, Integer, UniqueConstraint
from app.models.base import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class RefreshToken(BaseModel):
    """
    long-lived refresh tokens for OAuth 2.0 token refresh flow
    """

    __tablename__ = "refresh_tokens"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    # token data

    token_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )

    # ownership

    client_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("oauth_clients.id", ondelete="CASCADE"),
        nullable=False
    )

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    organization_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )

    # permissions
    scope: Mapped[str] = mapped_column(
        String(1000),
        nullable=False
    )

    # security tracking

    # number of times this token has been refreshed
    rotation_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    last_used_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True)
    )

    # lifecycle
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    revoked_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
    )

    # relationships

    client: Mapped["OAuthClient"] = relationship(
        foreign_keys=[client_id]
    )

    user: Mapped["User"] = relationship(
        foreign_keys=[user_id],
        back_populates="refresh_tokens"
    )

    organization: Mapped["Organization"] = relationship(
        foreign_keys=[organization_id]
    )

    # index and constraints
    __table_args__ = (

        # data integrity
        CheckConstraint("rotation_count >= 0", name="ck_refresh_tokens_rotation_count"),
        CheckConstraint("expires_at > created_at", name="ck_refresh_tokens_valid_expiry"),
        UniqueConstraint("token_hash", name="uq_refresh_tokens_token_hash"),
    )

    @property
    def token_id(self) -> str:
        """Refresh token ID (alias for id)"""
        return self.id
    
    @token_id.setter
    def token_id(self, value: str) -> None:
        self.id = value

    def __repr__(self) -> str:
        return f"<RefreshToken(token_id='{self.token_id}', client_id='{self.client_id}', user_id='{self.user_id[:8]}...')>"
