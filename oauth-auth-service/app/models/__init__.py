"""
Import all models in here for alembic to detect them

Alembic needs all models imported to detect changes.
when you create a new model import it here and add it or else alembic won't create migrations for it
"""

from app.models.base import BaseModel
from app.models.user import User

__all__ = ["BaseModel", "User"]