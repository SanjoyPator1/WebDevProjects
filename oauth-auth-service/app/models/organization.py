from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  String, Boolean, Text, JSON
from app.models.base import BaseModel
from typing import Optional, List
from app.models.user_organization import RoleEnum

class Organization(BaseModel):
    """
    multi-tenant organization model
    """

    __tablename__ = "organizations"

    # identity fields

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    # optional identity

    domain: Mapped[Optional[str]] = mapped_column(
        String(255),
        index=True,
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text
    )

    # configuration
    settings: Mapped[Optional[dict]] = mapped_column(
        JSON
    )

    # status
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        server_default="true",
        index=True
    )

    # relationships

    # many to many with users through associative object
    user_memberships: Mapped[List["UserOrganization"]] = relationship(
        back_populates="organization",
        cascade="all, delete-orphan",
        lazy="select"   # Don't auto-load all members
    )

    # one to many with OAuth clients
    oauth_clients: Mapped[List["OAuthClient"]] = relationship(
        foreign_keys="OAuthClient.organization_id",
        back_populates="organization",
        cascade="all, delete-orphan",
        lazy="selectin"
    )


    # indexes
    # __table_args__ = (
        
    # )

    def __repr__(self) -> str:
        return f"<Organization(id='{self.id}', slug='{self.slug}', name='{self.name}')>"
    



