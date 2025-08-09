"""
populate default OAuth scopes after migration

this script creates the standard OAuth 2.0 and OpenID Connect scopes
plus custom scopes for the chat application.
"""

import sys
from pathlib import Path

# add project root to Python path so we can import our models
sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models.scope import Scope, ScopeCategoryEnum

def populate_default_scopes():
    """create default OAuth scopes for the system"""
    session = SessionLocal()
    
    try:
        # check if scopes already exist
        existing_count = session.query(Scope).count()
        if existing_count > 0:
            print(f"scopes already exist ({existing_count} found). skipping population")
            return
        
        print("creating default OAuth scopes")
        
        # define default scopes
        default_scopes_data = [
            # OpenID Connect Standard Scopes 
            {
                "id": "openid",
                "display_name": "OpenID Connect",
                "description": "Authenticate your identity using OpenID Connect",
                "category": ScopeCategoryEnum.OPENID,
                "is_default": True,
                "requires_consent": False,
                "is_sensitive": False
            },
            {
                "id": "profile",
                "display_name": "Profile Information",
                "description": "Access your basic profile information (name, picture, etc.)",
                "category": ScopeCategoryEnum.PROFILE,
                "is_default": True,
                "requires_consent": False,
                "is_sensitive": False
            },
            {
                "id": "email",
                "display_name": "Email Address",
                "description": "Access your email address",
                "category": ScopeCategoryEnum.PROFILE,
                "is_default": False,
                "requires_consent": True,
                "is_sensitive": True
            },
            
            # Chat Application Scopes
            {
                "id": "read:messages",
                "display_name": "Read Messages",
                "description": "Read messages in channels you have access to",
                "category": ScopeCategoryEnum.CHAT,
                "is_default": False,
                "requires_consent": True,
                "is_sensitive": False
            },
            {
                "id": "write:messages",
                "display_name": "Send Messages",
                "description": "Send messages to channels you have access to",
                "category": ScopeCategoryEnum.CHAT,
                "is_default": False,
                "requires_consent": True,
                "is_sensitive": False
            },
            {
                "id": "read:channels",
                "display_name": "Read Channel Information",
                "description": "View channel information and member lists",
                "category": ScopeCategoryEnum.CHAT,
                "is_default": False,
                "requires_consent": True,
                "is_sensitive": False
            },
            {
                "id": "write:channels",
                "display_name": "Manage Channels",
                "description": "Create and modify channels you have permission to manage",
                "category": ScopeCategoryEnum.CHAT,
                "is_default": False,
                "requires_consent": True,
                "is_sensitive": False
            },
            
            # Administrative Scopes
            {
                "id": "admin:organization",
                "display_name": "Organization Administration",
                "description": "Full administrative access to organization settings and members",
                "category": ScopeCategoryEnum.ADMIN,
                "is_default": False,
                "requires_consent": True,
                "is_sensitive": True
            },
            {
                "id": "admin:users",
                "display_name": "User Management",
                "description": "Manage organization users (invite, remove, change roles)",
                "category": ScopeCategoryEnum.ADMIN,
                "is_default": False,
                "requires_consent": True,
                "is_sensitive": True
            },
            {
                "id": "admin:clients",
                "display_name": "OAuth Client Management",
                "description": "Manage OAuth applications and their configurations",
                "category": ScopeCategoryEnum.ADMIN,
                "is_default": False,
                "requires_consent": True,
                "is_sensitive": True
            },
            {
                "id": "read:analytics",
                "display_name": "View Analytics",
                "description": "Access usage analytics and reports",
                "category": ScopeCategoryEnum.ADMIN,
                "is_default": False,
                "requires_consent": True,
                "is_sensitive": True
            }
        ]
        
        # create scope objects
        scopes_created = []
        for scope_data in default_scopes_data:
            scope = Scope(**scope_data)
            session.add(scope)
            scopes_created.append(scope)
        
        # commit all scopes
        session.commit()
        
        print(f"successfully created {len(scopes_created)} default scopes:")
        print()
        
        # group and display scopes by category
        categories = {}
        for scope in scopes_created:
            category = scope.category.value
            if category not in categories:
                categories[category] = []
            categories[category].append(scope)
        
        for category, scopes in categories.items():
            print(f"📂 {category} Scopes:")
            for scope in scopes:
                consent = "✋ Requires consent" if scope.requires_consent else "✅ Auto-granted"
                sensitive = "🔒 Sensitive" if scope.is_sensitive else "📖 Public"
                print(f"   • {scope.id:<20} - {scope.display_name} ({consent}, {sensitive})")
            print()
            
    except Exception as e:
        session.rollback()
        print(f"❌ Error creating scopes: {e}")
        print("Rolling back changes...")
        raise
    finally:
        session.close()

def list_existing_scopes():
    """List all existing scopes in the database"""
    session = SessionLocal()
    
    try:
        scopes = session.query(Scope).order_by(Scope.category, Scope.id).all()
        
        if not scopes:
            print("📭 No scopes found in database.")
            return
        
        print(f"📋 Found {len(scopes)} scopes in database:")
        print()
        
        current_category = None
        for scope in scopes:
            if scope.category != current_category:
                current_category = scope.category
                print(f"📂 {current_category.value} Scopes:")
            
            status = "🟢 Active" if scope.is_active else "🔴 Inactive"
            default = "⭐ Default" if scope.is_default else ""
            sensitive = "🔒 Sensitive" if scope.is_sensitive else ""
            
            flags = " ".join(filter(None, [status, default, sensitive]))
            print(f"   • {scope.id:<20} - {scope.display_name} ({flags})")
        print()
        
    except Exception as e:
        print(f"❌ Error listing scopes: {e}")
        raise
    finally:
        session.close()

def main():
    """Main function to handle command line arguments"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Manage OAuth scopes")
    parser.add_argument(
        "--list", 
        action="store_true", 
        help="List existing scopes instead of creating them"
    )
    
    args = parser.parse_args()
    
    if args.list:
        list_existing_scopes()
    else:
        populate_default_scopes()

if __name__ == "__main__":
    main()