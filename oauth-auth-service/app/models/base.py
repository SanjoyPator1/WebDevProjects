# Base model with common fields

from datetime import datetime
from sqlalchemy import Column, DateTime, Integer
from sqlalchemy.sql import func

from app.database import Base

class BaseModel(Base):
    """
    Abstract base model with common fields
    It provides:
        Auto increment ID field
        Automatic created_at timestamp
        Automatic updated_at timestamp

    all other models inherit from this and get all this fields
    """

    # no need to create table for this, just a template for other modules
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),  # set on INSERT
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),  # set on INSERT
        onupdate=func.now(),    # Update on UPDATE
        nullable=False
    )
