"""
import all models in here for alembic to detect them

alembic needs all models imported to detect changes.
when you create a new model import it here and add it or else alembic won't create migrations for it
"""

from app.models.base import BaseModel

from app.models.user import User
from app.models.organization import Organization
from app.models.user_organization import UserOrganization, RoleEnum

from app.models.oauth_client import OAuthClient, ClientTypeEnum
from app.models.authorization_code import AuthorizationCode
from app.models.refresh_token import RefreshToken
from app.models.audit_log import AuditLog, AuditEventType, AuditStatus
from app.models.scope import Scope, ScopeCategoryEnum

__all__ = [
    # base classes
    "BaseModel", 
    
    # core models
    "User",
    "Organization", 
    "UserOrganization",
    
    # OAuth models
    "OAuthClient",
    "AuthorizationCode", 
    "RefreshToken",
    
    # system models
    "AuditLog",
    "Scope",
    
    # enums
    "RoleEnum",
    "ClientTypeEnum", 
    "AuditEventType",
    "AuditStatus",
    "ScopeCategoryEnum"
]