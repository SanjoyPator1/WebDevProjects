# OAuth 2.0 Database Schema - Hybrid Approach

## Architecture Overview

- **IDs**: UUIDs for business entities, integers for logs
- **Access Tokens**: JWT format (stateless, no database storage)
- **Refresh Tokens**: Database storage (for revocation and security)
- **Scopes**: Global definitions (not linked to specific entities)

## Complete OAuth 2.0 Database Schema

```mermaid
erDiagram
    %% Core User Management
    users {
        varchar id PK "UUID - prevents enumeration attacks"
        varchar email UK "Unique email address"
        varchar username UK "Unique username"
        varchar hashed_password "Bcrypt hashed password"
        varchar full_name "Display name"
        varchar given_name "First name (OpenID)"
        varchar family_name "Last name (OpenID)"
        varchar picture_url "Profile picture URL"
        boolean email_verified "Email verification status"
        varchar phone_number "Phone number"
        boolean phone_verified "Phone verification status"
        varchar locale "User locale (en, es, etc)"
        varchar timezone "User timezone"
        timestamp last_login_at "Last successful login"
        boolean is_active "Account active status"
        boolean is_superuser "System admin flag"
        timestamp created_at "Record creation time"
        timestamp updated_at "Last update time"
    }

    %% Multi-tenant Organizations
    organizations {
        varchar id PK "UUID identifier"
        varchar name "Organization display name"
        varchar slug UK "URL-friendly identifier"
        varchar domain "Email domain for auto-join"
        text description "Organization description"
        json settings "Flexible configuration storage"
        boolean is_active "Organization active status"
        timestamp created_at "Record creation time"
        timestamp updated_at "Last update time"
    }

    %% User-Organization Many-to-Many
    user_organizations {
        varchar user_id PK,FK "User identifier"
        varchar organization_id PK,FK "Organization identifier"
        varchar role "User role (admin, member, guest)"
        json permissions "Granular permissions array"
        timestamp invited_at "Invitation timestamp"
        timestamp joined_at "Acceptance timestamp"
        varchar invited_by FK "Who sent the invitation"
        boolean is_active "Membership active status"
        timestamp created_at "Record creation time"
        timestamp updated_at "Last update time"
    }

    %% OAuth Client Applications
    oauth_clients {
        varchar client_id PK "Public client identifier"
        varchar client_secret "Secret for confidential clients"
        varchar client_name "Human readable name"
        varchar client_type "confidential or public"
        json grant_types "Allowed OAuth flows array"
        json response_types "Allowed response formats array"
        json redirect_uris "Whitelisted callback URLs array"
        json allowed_scopes "Maximum permissions array"
        json default_scopes "Default permissions array"
        varchar token_endpoint_auth_method "Authentication method"
        text description "Client description"
        varchar organization_id FK "Owning organization"
        varchar created_by FK "User who registered client"
        boolean is_active "Client active status"
        timestamp created_at "Record creation time"
        timestamp updated_at "Last update time"
    }

    %% Temporary Authorization Codes
    authorization_codes {
        varchar code PK "Random authorization code"
        varchar client_id FK "Requesting client"
        varchar user_id FK "Authorizing user"
        varchar redirect_uri "Callback URL for this request"
        varchar scope "Requested permissions"
        varchar code_challenge "PKCE challenge (SHA256)"
        varchar code_challenge_method "PKCE method (S256 or plain)"
        varchar state "CSRF protection token"
        varchar nonce "OpenID Connect nonce"
        varchar organization_id FK "Organization context"
        timestamp expires_at "Code expiration (5-10 min)"
        timestamp used_at "When code was exchanged"
        timestamp created_at "Record creation time"
    }

    %% Refresh Tokens (Database Storage Only)
    refresh_tokens {
        varchar token_id PK "UUID identifier"
        varchar token_hash "Hashed random token string"
        varchar client_id FK "Owning client"
        varchar user_id FK "Token subject (user)"
        varchar scope "Permissions for token refresh"
        varchar organization_id FK "Organization context"
        int rotation_count "Usage counter for security"
        timestamp last_used_at "Last usage time"
        timestamp expires_at "Token expiration (30+ days)"
        timestamp revoked_at "NULL = active, timestamp = revoked"
        timestamp created_at "Record creation time"
    }

    %% Optional JWT Blacklist
    revoked_access_tokens {
        varchar jti PK "JWT Token ID from payload"
        varchar reason "Revocation reason (security, logout, etc)"
        timestamp revoked_at "When token was revoked"
        timestamp expires_at "Original JWT expiration for cleanup"
        varchar revoked_by FK "User who revoked (admin action)"
        timestamp created_at "Record creation time"
    }

    %% Global Scope Definitions
    scopes {
        varchar scope_name PK "Technical identifier (read:messages)"
        varchar display_name "Human readable name"
        text description "Detailed explanation"
        varchar category "Scope category (openid, chat, admin)"
        boolean is_default "Auto-included scope"
        boolean requires_consent "Explicit user approval needed"
        boolean organization_specific "Can be customized per org"
        timestamp created_at "Record creation time"
        timestamp updated_at "Last update time"
    }

    %% Audit Trail
    audit_logs {
        int id PK "Auto-increment for performance"
        varchar event_type "Event category (login, token_issued, etc)"
        varchar user_id FK "Subject user (nullable)"
        varchar client_id FK "Involved client (nullable)"
        varchar organization_id FK "Organization context (nullable)"
        varchar ip_address "Request IP address"
        varchar user_agent "Browser/app information"
        json event_data "Flexible event details"
        varchar status "success, failure, warning"
        timestamp created_at "Event timestamp"
    }

    %% Relationships
    users ||--o{ user_organizations : "belongs to"
    organizations ||--o{ user_organizations : "has members"
    users ||--o{ user_organizations : "invited by"

    organizations ||--o{ oauth_clients : "owns"
    users ||--o{ oauth_clients : "created by"

    oauth_clients ||--o{ authorization_codes : "requests"
    users ||--o{ authorization_codes : "authorizes"
    organizations ||--o{ authorization_codes : "context"

    authorization_codes ||--o{ refresh_tokens : "exchanges for refresh token"
    oauth_clients ||--o{ refresh_tokens : "owns"
    users ||--o{ refresh_tokens : "subject"
    organizations ||--o{ refresh_tokens : "context"

    users ||--o{ revoked_access_tokens : "revoked by"

    users ||--o{ audit_logs : "subject"
    oauth_clients ||--o{ audit_logs : "involves"
    organizations ||--o{ audit_logs : "context"
```

## Simplified Hybrid Token Approach

For the recommended hybrid approach (JWT access tokens + database refresh tokens):

```mermaid
erDiagram
    users {
        varchar id PK
        varchar email UK
        varchar username UK
        varchar hashed_password
        varchar full_name
        boolean is_active
        timestamp created_at
    }

    organizations {
        varchar id PK
        varchar name
        varchar slug UK
        varchar domain
        json settings
        boolean is_active
    }

    oauth_clients {
        varchar client_id PK
        varchar client_secret
        varchar client_name
        varchar client_type
        json redirect_uris
        varchar organization_id FK
    }

    authorization_codes {
        varchar code PK
        varchar client_id FK
        varchar user_id FK
        varchar scope
        varchar code_challenge
        timestamp expires_at
    }

    refresh_tokens {
        varchar token_id PK
        varchar token_hash
        varchar client_id FK
        varchar user_id FK
        varchar scope
        timestamp expires_at
        timestamp revoked_at
    }

    revoked_access_tokens {
        varchar jti PK
        varchar reason
        timestamp revoked_at
        timestamp expires_at
    }

    scopes {
        varchar scope_name PK
        varchar display_name
        text description
        varchar category
        boolean is_default
    }

    %% Key Relationships
    organizations ||--o{ oauth_clients : "owns"
    oauth_clients ||--o{ authorization_codes : "requests"
    users ||--o{ authorization_codes : "authorizes"
    authorization_codes ||--o{ refresh_tokens : "exchanges for"
    oauth_clients ||--o{ refresh_tokens : "owns"
    users ||--o{ refresh_tokens : "subject"
```

## Hybrid Token Flow Diagram

Shows the recommended JWT + Database hybrid approach:

```mermaid
erDiagram
    oauth_clients {
        varchar client_id PK
        varchar client_secret
        json redirect_uris
        json grant_types
    }

    authorization_codes {
        varchar code PK
        varchar client_id FK
        varchar user_id FK
        varchar code_challenge
        timestamp expires_at
    }

    refresh_tokens {
        varchar token_id PK
        varchar token_hash
        varchar client_id FK
        varchar user_id FK
        timestamp expires_at
        timestamp revoked_at
    }

    revoked_access_tokens {
        varchar jti PK
        varchar reason
        timestamp revoked_at
        timestamp expires_at
    }

    %% Hybrid Token Flow
    oauth_clients ||--o{ authorization_codes : "1- requests auth code"
    authorization_codes }|--|| refresh_tokens : "2- exchanges for JWT + refresh token"
    refresh_tokens ||--o{ revoked_access_tokens : "3- JWT can be blacklisted if needed"
```

## Key Architecture Changes

### **Access Tokens (JWT Format)**

**Not stored in database** - Self-contained JSON Web Tokens:

```json
{
  "sub": "user-uuid-123",
  "client_id": "chatapp_web",
  "scope": "read:messages write:messages",
  "org_id": "org-uuid-456",
  "exp": 1642680000,
  "iat": 1642676400,
  "jti": "unique-token-id-123"
}
```

### **Refresh Tokens (Database Storage)**

- **Format**: Random string (256 bits)
- **Storage**: Hashed in database with bcrypt
- **Lifetime**: 30+ days
- **Revocation**: `revoked_at` timestamp (NULL = active)
- **No is_active field**: Single source of truth via `revoked_at`

### **UUID Strategy**

- **Business Entities**: users, organizations, oauth_clients use UUIDs
- **Security Benefit**: Prevents enumeration attacks
- **Audit Logs**: Use auto-increment integers for performance

### **Scopes as Global Definitions**

- **Not linked**: Scopes are reference definitions, not assigned
- **Connection**: Happens through client allowed_scopes, auth codes, and tokens
- **Flexibility**: Clients can request any valid combination
- **Future**: Can add organization_scopes table later if needed

### **Optional Revocation Table**

- **Only for critical security scenarios**: Store JWT IDs that need immediate invalidation
- **Cleanup job needed**: Remove expired JWTs from blacklist
- **Most tokens**: Expire naturally (15-60 minutes)

## Benefits of This Hybrid Approach

- ✅ **Fast API calls** - No database lookup for access token validation
- ✅ **Secure refresh** - Can revoke long-lived tokens instantly
- ✅ **Scalable** - Stateless JWTs reduce database load
- ✅ **Flexible** - Can add revocation blacklist if needed
- ✅ **Simple start** - Begin with pure JWTs, add complexity later
- ✅ **Security focused** - UUIDs prevent user enumeration
- ✅ **Performance optimized** - Auto-increment IDs for high-volume audit logs
