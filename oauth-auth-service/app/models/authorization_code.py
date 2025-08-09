from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  String, DateTime, JSON, ForeignKey, CheckConstraint
from app.models.base import BaseModel
from typing import Optional
from datetime import datetime

class AuthorizationCode(BaseModel):
    """
    temporary authorization codes for OAuth 2.0 authorization code flow
    
    lifecycle:
    1. created when user authorizes client
    2. short-lived (5-10 minutes)
    3. exchanged for access/refresh tokens
    4. marked as used and expires
    """

    __tablename__ = "authorization_codes"

    # authorization code value - cryptographically random
    id: Mapped[str] = mapped_column(
        String(255),
        primary_key=True,
    )

    # request context

    client_id: Mapped[str] = mapped_column(
        String(255),
        ForeignKey("oauth_clients.id", ondelete="CASCADE"),
        nullable=False,
    )

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    organization_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )

    redirect_uri: Mapped[str] = mapped_column(
        String(2048),
        nullable=False
    )

    # granted scopes (space-separated)
    scope: Mapped[str] = mapped_column(
        String(1000),
        nullable=False
    )

    # PKCE (proof key for code exchange)
    # required for public clients, optional for confidential

    # PKCE code challenge (SHA256 hash)
    code_challenge: Mapped[Optional[str]] = mapped_column(
        String(255),
    )

    # PKCE code challenge method ('S256' or 'plain')
    code_challenge_method: Mapped[Optional[str]] = mapped_column(
        String(10)
    )

    # SECURITY TOKENS
    # for preventing CSRF and replay attacks

    # OAuth state parameter for CSRF protection
    state: Mapped[Optional[str]] = mapped_column(
        String(255)
    )

    # OpenID Connect nonce for replay protection
    nonce: Mapped[Optional[str]] = mapped_column(
        String(255)
    )

    # lifecycle

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    used_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True)
    )

    # relationship

    client: Mapped["OAuthClient"] = relationship(
        foreign_keys=[client_id]
    )

    user: Mapped["User"] = relationship(
        foreign_keys=user_id
    )
    
    organization: Mapped["Organization"] = relationship(
        foreign_keys=organization_id
    )

    # performance

    __table_args__ = (

        # date integrity constraints
        CheckConstraint(
            "expires_at > created_at",
            name = "ck_auth_codes_valid_expiry"
        ),

        CheckConstraint(
            "(code_challenge IS NULL AND code_challenge_method IS NULL) OR "
            "(code_challenge IS NOT NULL AND code_challenge_method IS NOT NULL)",
            name="ck_auth_codes_pkce_consistency"
        ),
    )

    @property
    def code(self) -> str:
        """OAuth 2.0 authorization code (alias for id)"""
        return self.id
    
    @code.setter
    def code(self, value: str) -> None:
        self.id = value

    def __repr__(self) -> str:
        return f"<AuthorizationCode(code='{self.code[:8]}...', client_id='{self.client_id}')>"
