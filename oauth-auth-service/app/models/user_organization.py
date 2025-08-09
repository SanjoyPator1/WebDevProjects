import enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  String, Boolean, DateTime, JSON, ForeignKey, func
from app.models.base import BaseModel
from typing import Optional
from datetime import datetime


class RoleEnum(enum.Enum):
    """
    User roles within an organization

    Role hierarchy (most to least privileged)
    - ADMIN: Full organization management
    - MEMBER: Standard access to org resources 
    - GUEST: Limited read-only access
    """
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"
    GUEST = "GUEST"

class UserOrganization(BaseModel):
    """
    Association object for many to many user <-> organization relationship
    This is a simple junction table because it contains:
    - role and permission information
    - invitation and membership lifecycle tracking
    """

    __tablename__ = "user_organizations"

    # composite primary key - together these two fields form the primary key

    user_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )

    organization_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("organizations.id", ondelete="CASCADE"),
        primary_key=True,
    )

    # access control
    # User's role within the organization
    role: Mapped[RoleEnum] = mapped_column(
        default=RoleEnum.MEMBER,
        nullable=False
    )

    # Granular permissions beyond role (e.g., ['manage:billing', 'read:analytics'])
    permissions: Mapped[Optional[dict]] = mapped_column(
        JSON
    )
    # Example permissions:
    # {
    #   "scopes": ["manage:users", "read:billing", "manage:oauth_clients"],
    #   "restrictions": {"ip_whitelist": ["192.168.1.0/24"]},
    #   "expires_at": "2024-12-31T23:59:59Z"
    # }

    # membership lifecycle

    invited_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
    )

    invited_by: Mapped[Optional[str]] = mapped_column(
        String,
        ForeignKey("users.id"),
    )

    # status
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        server_default="true"
    )

    # override inherited id and timestamps since we use composite PK
    id = None
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        server_onupdate=func.now(),
        nullable=False
    )

    # relationships
    user: Mapped["User"] = relationship(
        foreign_keys=[user_id],
        back_populates="organization_memberships"
    )

    organization: Mapped["Organization"] = relationship(
        foreign_keys=[organization_id],
        back_populates="user_memberships"
    )

    inviter: Mapped[Optional["User"]] = relationship(
        foreign_keys=[invited_by],
        overlaps="invited_memberships" 
    )

    def __repr__(self) -> str:
        return f"<UserOrganization(user_id='{self.user_id}', org_id='{self.org_id}', role='{self.role.value}')>"
    