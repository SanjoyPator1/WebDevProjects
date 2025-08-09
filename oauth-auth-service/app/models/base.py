# Base model with common fields
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class BaseModel(Base):
    """
    Abstract base model with common fields for all business entities

    Design decisions:
    - UUIDs for primary keys (security and distribution purpose)
    - Automatic timestamps
    - Timezone-aware dates (for global users)

    all other models inherit from this and get all this fields
    """

    # no need to create table for this, just a template for other modules
    __abstract__ = True

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        server_onupdate=func.now(),
        nullable=False,
    )
