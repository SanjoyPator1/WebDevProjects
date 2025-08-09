import enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  String, Boolean, DateTime, JSON, ForeignKey, func, Text
from app.models.base import BaseModel
from typing import Optional, List
from datetime import datetime

class ClientTypeEnum(enum.Enum):
    """
    OAuth 2.0 client types

    confidential : can securely store credentials (server side apps)
    public: cannot securely store credentials (mobile/ spa apps)
    """

    CONFIDENTIAL = "CONFIDENTIAL"
    PUBLIC = "PUBLIC"

class OAuthClient(BaseModel):
    """
    Oauth 2.0 client application registration

    represents an application that can request authorization from users
    contains all OAuth 2.0 configuration and security settings
    """

    __tablename__ = "oauth_clients"

    # override base class id field
    id: Mapped[str] = mapped_column(
        String(36),  # UUID length
        primary_key=True,
    )

    # client identity - null for public clients, required for confidential
    client_secret: Mapped[Optional[str]] = mapped_column(
        String(255)
    )

    client_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    client_type: Mapped[ClientTypeEnum] = mapped_column(
        nullable=False
    )

    # allowed OAuth grant types (e.g., ['authorization_code', 'refresh_token'])
    grant_types: Mapped[List[str]] = mapped_column(
        JSON,
        nullable=False
    )

    # allowed OAuth response types (e.g., ["code", "token", "id_token"])
    response_types: Mapped[List[str]] = mapped_column(
        JSON,
        nullable=False
    )

    redirect_uris: Mapped[List[str]] = mapped_column(
        JSON,
        nullable=False
    )

    # maximum scopes this client can request (e.g, ["openid", "profile", "email", "read:messages", "write:messages"])
    allowed_scopes: Mapped[List[str]] = mapped_column(
        JSON, 
        nullable=False
    )

    # scopes granted automatically without user consent
    default_scopes: Mapped[Optional[List[str]]] = mapped_column(JSON)

    # how client authenticates at token endpoint - values: "client_secret_post", "client_secret_basic", "none", "private_key_jwt"
    token_endpoint_auth_method: Mapped[str] = mapped_column(
        String(50),
        default="client_secret_post",
        nullable=False,
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text,
    )

    # ownership and lifecycle
    # organization that owns this OAuth client
    organization_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )

    created_by: Mapped[str] = mapped_column(
        String,
        ForeignKey("users.id"),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        server_default="true"
    )

    # relationships

    # relationship to the user who created this client
    creator: Mapped["User"] = relationship(
        foreign_keys=[created_by],
        back_populates="created_oauth_clients"
    )

    # relationship to the organization that owns this client
    organization: Mapped["Organization"] = relationship(
        foreign_keys=[organization_id]
    )

    # one to many relationships with tokens
    authorization_codes: Mapped[List["AuthorizationCode"]] = relationship(
        back_populates="client",
        cascade="all, delete-orphan",
        lazy="select"
    )

    refresh_tokens: Mapped[List["RefreshToken"]] = relationship(
        back_populates="client",
        cascade="all, delete-orphan",
        lazy="select"
    )

    @property
    def client_id(self) -> str:
        """OAuth 2.0 client_id (alias for id)"""
        return self.id
    
    @client_id.setter
    def client_id(self, value: str) -> None:
        self.id = value
    
    def __repr__(self) -> str:
        return f"<OAuthClient(client_id='{self.id}', name='{self.client_name}')>"
    
    def is_public_client(self) -> bool:
        """Check if this is a public client"""
        return self.client_type == ClientTypeEnum.PUBLIC
    
    def is_confidential_client(self) -> bool:
        """Check if this is a confidential client"""
        return self.client_type == ClientTypeEnum.CONFIDENTIAL
    
    def can_use_grant_type(self, grant_type: str) -> bool:
        """Check if client is allowed to use a specific grant type"""
        return grant_type in self.grant_types
    
    def can_request_scope(self, scope: str) -> bool:
        """Check if client is allowed to request a specific scope"""
        return scope in self.allowed_scopes
    
    def get_default_scopes(self) -> List[str]:
        """Get scopes that are granted by default"""
        return self.default_scopes or []
