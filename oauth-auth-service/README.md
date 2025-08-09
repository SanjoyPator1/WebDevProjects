# OAuth Auth Service

A comprehensive FastAPI-based OAuth 2.0 + OpenID Connect authentication service with PostgreSQL database, multi-tenant organization support, and complete scope management.

## Features

- **OAuth 2.0 + OpenID Connect** compliant authorization server
- **Multi-tenant organization** support with role-based access control
- **JWT access tokens** with database-stored refresh tokens (hybrid approach)
- **Comprehensive scope system** with 11 predefined scopes
- **Audit logging** for security monitoring and compliance
- **PKCE support** for public clients (mobile/SPA security)
- **Docker-based development** environment
- **Alembic migrations** for database schema management

## Quick Start

### Prerequisites

- Python 3.11+
- Docker and Docker Compose
- `uv` package manager (recommended) or `pip`

### For New Users (First Time Setup)

1. **Clone the repository:**

   ```sh
   git clone https://github.com/SanjoyPator1/WebDevProjects/tree/auth-service
   cd oauth-auth-service
   ```

2. **Set up virtual environment:**

   ```sh
   # Create virtual environment
   uv venv

   # Activate virtual environment
   source .venv/bin/activate  # On macOS/Linux
   # OR
   .venv\Scripts\activate     # On Windows
   ```

3. **Install dependencies:**

   ```sh
   uv sync
   ```

4. **Set up environment variables:**

   ```sh
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your configuration
   # (Optional - Docker will use its own environment variables)
   ```

5. **Start with Docker:**

   ```sh
   # Build and start all services
   docker-compose up --build
   ```

6. **Run database migrations:**

   ```sh
   # Apply all migrations
   docker-compose run --rm migrate
   ```

7. **Populate default OAuth scopes:**
   ```sh
   # Create the default OAuth 2.0 and chat application scopes
   docker-compose run --rm app uv run python scripts/populate_default_scopes.py
   ```

## 📊 Database Schema

### OAuth 2.0 Database Architecture

The service uses a hybrid token approach:

- **Access Tokens**: JWT format (stateless, no database storage)
- **Refresh Tokens**: Database storage (for revocation capability)
- **UUIDs**: For business entities (security)
- **Auto-increment IDs**: For high-volume audit logs (performance)

### Core Tables

| Table                 | Purpose                 | Key Features                                   |
| --------------------- | ----------------------- | ---------------------------------------------- |
| `users`               | User authentication     | UUID primary keys, OpenID Connect claims       |
| `organizations`       | Multi-tenant support    | Organization isolation, domain-based auto-join |
| `user_organizations`  | User membership         | Role-based access (ADMIN/MEMBER/GUEST)         |
| `oauth_clients`       | Registered applications | CONFIDENTIAL/PUBLIC client types               |
| `authorization_codes` | Temporary auth codes    | PKCE support, 5-10 minute expiration           |
| `refresh_tokens`      | Long-lived tokens       | Token rotation, revocation support             |
| `scopes`              | Permission definitions  | 11 predefined scopes, categorized              |
| `audit_logs`          | Security monitoring     | Comprehensive event tracking                   |

### Entity Relationships

```
Users ←→ Organizations (Many-to-Many via user_organizations)
├── Organizations → OAuth Clients (One-to-Many)
├── Users → Refresh Tokens (One-to-Many)
├── OAuth Clients → Authorization Codes (One-to-Many)
└── Authorization Codes → Refresh Tokens (One-to-One exchange)
```

For detailed schema information, see [`docs/database/schema.md`](docs/database/schema.md).

## 🏗️ System Architecture

### OAuth 2.0 Authorization Flow

```mermaid
sequenceDiagram
    participant User as User/Browser
    participant Client as Client App
    participant AuthServer as OAuth Auth Server
    participant ResourceServer as Chat API
    participant DB as Database

    Note over User, DB: OAuth 2.0 Authorization Code Flow with PKCE

    %% 1. Authorization Request
    User->>Client: 1. Login to App
    Client->>Client: 2. Generate PKCE code_verifier & code_challenge
    Client->>User: 3. Redirect to authorization endpoint
    User->>AuthServer: 4. GET /oauth/authorize?client_id=...&code_challenge=...

    %% 2. User Authentication & Consent
    AuthServer->>DB: 5. Validate client_id & redirect_uri
    AuthServer->>User: 6. Show login form (if not authenticated)
    User->>AuthServer: 7. POST credentials
    AuthServer->>DB: 8. Authenticate user
    AuthServer->>User: 9. Show consent screen with scopes
    User->>AuthServer: 10. Approve permissions

    %% 3. Authorization Code Issuance
    AuthServer->>DB: 11. Store authorization_code with PKCE challenge
    AuthServer->>User: 12. Redirect to callback with authorization code
    User->>Client: 13. Authorization code received

    %% 4. Token Exchange
    Client->>AuthServer: 14. POST /oauth/token with code & code_verifier
    AuthServer->>DB: 15. Verify authorization code & PKCE
    AuthServer->>AuthServer: 16. Generate JWT access token
    AuthServer->>DB: 17. Store refresh token (hashed)
    AuthServer->>Client: 18. Return access_token & refresh_token

    %% 5. API Access
    Client->>ResourceServer: 19. API request with Bearer token
    ResourceServer->>ResourceServer: 20. Validate JWT signature & claims
    ResourceServer->>Client: 21. Return protected resource

    %% 6. Token Refresh (when access token expires)
    Client->>AuthServer: 22. POST /oauth/token with refresh_token
    AuthServer->>DB: 23. Verify refresh token
    AuthServer->>AuthServer: 24. Generate new JWT access token
    AuthServer->>DB: 25. Update refresh token usage
    AuthServer->>Client: 26. Return new access_token

```

### Multi-Tenant Organization Flow

```mermaid
flowchart TD
    A[User Signs Up] --> B{Email Domain Check}
    B -->|Domain matches org| C[Auto-join Organization]
    B -->|No domain match| D[Create Personal Account]
    B -->|Invite Link| E[Join Specific Organization]

    C --> F[Assign MEMBER role]
    D --> G[Create new Organization]
    E --> H[Pending invitation status]

    F --> I[Access Org Resources]
    G --> J[Assign ADMIN role]
    H --> K{Admin Approval?}

    K -->|Approved| L[Activate Membership]
    K -->|Denied| M[Remove Invitation]

    L --> I
    J --> I

    I --> N[User can access:]
    N --> O[Org-specific OAuth clients]
    N --> P[Org-scoped permissions]
    N --> Q[Chat channels & messages]

    style C fill:#0084bc
    style E fill:#844f00
    style G fill:#b500d1
    style I fill:#009e00

```

### Token Security Model

```mermaid
flowchart LR
    subgraph "Access Tokens (JWT)"
        A1[Self-contained] --> A2[Stateless validation]
        A2 --> A3[15-60 min lifetime]
        A3 --> A4[Cannot be revoked*]
    end

    subgraph "Refresh Tokens (Database)"
        B1[Database stored] --> B2[Hashed values]
        B2 --> B3[30+ day lifetime]
        B3 --> B4[Instant revocation]
        B4 --> B5[Token rotation]
    end

    subgraph "Security Features"
        C1[PKCE for public clients] --> C2[UUID-based IDs]
        C2 --> C3[Comprehensive audit logs]
        C3 --> C4[Organization isolation]
    end

    A4 -.->|Optional blacklist| C5[Revoked JWT Table]
    B5 --> C6[Track usage patterns]
    C4 --> C7[Multi-tenant security]

    style A1 fill:#0084bc
    style B1 fill:#b500d1
    style C1 fill:#009e00

```

## 🔐 OAuth Scopes

The system includes 11 predefined scopes organized by category:

### OpenID Connect (Auto-granted)

- `openid` - Basic authentication
- `profile` - User profile information

### Profile Information

- `email` - Email address access (requires consent)

### Chat Application

- `read:messages` - Read chat messages
- `write:messages` - Send messages
- `read:channels` - View channel information
- `write:channels` - Manage channels

### Administrative (Sensitive)

- `admin:organization` - Full organization admin
- `admin:users` - User management
- `admin:clients` - OAuth client management
- `read:analytics` - Usage analytics

## Docker Commands

### Basic Operations

```sh
# Build all services
docker-compose build

# Start all services in background
docker-compose up -d

# Start specific services
docker-compose up -d db app

# View running containers
docker-compose ps

# View logs
docker-compose logs
docker-compose logs app
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f app

# Stop all services
docker-compose down

# Stop and remove volumes (deletes all data)
docker-compose down -v
```

### Development Workflow

```sh
# Start database only
docker-compose up -d db

# Run migrations
docker-compose run --rm migrate

# Populate OAuth scopes
docker-compose run --rm app uv run python scripts/populate_default_scopes.py

# Start application
docker-compose up -d app

# Restart a specific service
docker-compose restart app

# Rebuild and restart everything
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Database Management

### Running Migrations

```sh
# Apply all pending migrations
docker-compose run --rm migrate

# Generate a new migration (after model changes)
docker-compose run --rm app uv run alembic revision --autogenerate -m "Describe your change"

# Check current migration version
docker-compose run --rm app uv run alembic current

# View migration history
docker-compose run --rm app uv run alembic history
```

### Scope Management

```sh
# Populate default scopes (run once after migrations)
docker-compose run --rm app uv run python scripts/populate_default_scopes.py

# List existing scopes
docker-compose run --rm app uv run python scripts/populate_default_scopes.py --list

# Re-running the populate script will skip if scopes already exist
```

### Database Access

```sh
# Connect to database via psql
docker-compose exec db psql -U postgres -d oauth_db

# List all tables
docker-compose exec db psql -U postgres -d oauth_db -c "\dt"

# View table structure
docker-compose exec db psql -U postgres -d oauth_db -c "\d users"

# Check OAuth scopes
docker-compose exec db psql -U postgres -d oauth_db -c "SELECT id, display_name, category FROM scopes ORDER BY category;"

# Check database version
docker-compose exec db psql -U postgres -d oauth_db -c "SELECT version();"
```

### Database Connection Details

- **Host**: `localhost`
- **Port**: `5433` (to avoid conflicts with local PostgreSQL)
- **Database**: `oauth_db`
- **Username**: `postgres`
- **Password**: `postgres`

## Development Workflow

### Making Model Changes

1. **Edit your models** in `app/models/`

2. **Import new models** in `app/models/__init__.py` (required for Alembic detection)

3. **Generate a new migration:**

   ```sh
   docker-compose run --rm app uv run alembic revision --autogenerate -m "Add new field to users table"
   ```

4. **Review the generated migration** in `alembic/versions/`

5. **Apply the migration:**

   ```sh
   docker-compose run --rm migrate
   ```

6. **Restart the application:**
   ```sh
   docker-compose restart app
   ```

### Adding New OAuth Scopes

1. **Edit the scope data** in `scripts/populate_default_scopes.py`

2. **Add your custom scopes** to the `default_scopes_data` list

3. **Clear existing scopes** (if needed):

   ```sh
   docker-compose exec db psql -U postgres -d oauth_db -c "TRUNCATE scopes;"
   ```

4. **Re-populate scopes:**
   ```sh
   docker-compose run --rm app uv run python scripts/populate_default_scopes.py
   ```

### Local Development (Without Docker)

```sh
# Activate virtual environment
source .venv/bin/activate

# Install dependencies
uv sync

# Set up local database (if you have PostgreSQL installed)
# Update .env with your local database URL

# Run migrations
uv run alembic upgrade head

# Populate scopes
uv run python scripts/populate_default_scopes.py

# Start the application
uv run uvicorn app.main:app --reload
```

## 📁 Project Structure

```
oauth-auth-service/
├── alembic/                 # Database migrations
│   ├── versions/           # Migration files
│   └── env.py             # Alembic configuration
├── app/                    # Application code
│   ├── models/            # SQLAlchemy models
│   │   ├── user.py        # User authentication model
│   │   ├── organization.py # Multi-tenant organizations
│   │   ├── oauth_client.py # OAuth 2.0 clients
│   │   ├── refresh_token.py # Token storage
│   │   ├── scope.py       # Permission definitions
│   │   └── audit_log.py   # Security audit trail
│   ├── routers/           # FastAPI routes (TODO)
│   ├── schemas/           # Pydantic schemas (TODO)
│   ├── services/          # Business logic
│   └── main.py           # FastAPI application
├── scripts/               # Utility scripts
│   └── populate_default_scopes.py # OAuth scope setup
├── docs/                  # Documentation
│   └── database/         # Database schema docs
├── docker-compose.yml     # Docker services
├── Dockerfile            # Application container
├── alembic.ini          # Alembic configuration
└── pyproject.toml       # Python dependencies
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database URLs (for local development)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@127.0.0.1:5433/oauth_db
DATABASE_SYNC_URL=postgresql://postgres:postgres@127.0.0.1:5433/oauth_db

# App settings
APP_NAME=OAuth Auth Service
APP_VERSION=0.1.0
DEBUG=True

# Security (update these for production!)
SECRET_KEY=your-very-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OAuth Configuration
REFRESH_TOKEN_EXPIRE_DAYS=30
AUTHORIZATION_CODE_EXPIRE_MINUTES=10
```

### OAuth Client Types

The system supports two OAuth 2.0 client types:

- **CONFIDENTIAL**: Server-side applications that can securely store client secrets
- **PUBLIC**: Mobile apps and SPAs that cannot securely store secrets (must use PKCE)

## Troubleshooting

### Common Issues

#### Port Conflicts

If you get port conflicts:

```sh
# Check what's using the port
lsof -i :5433
lsof -i :8000

# Stop conflicting services
brew services stop postgresql  # If using Homebrew
```

#### Database Connection Issues

```sh
# Check if database container is running
docker-compose ps

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

#### Migration Issues

```sh
# Reset database completely
docker-compose down -v
docker-compose up -d db
docker-compose run --rm migrate

# Check migration files
ls alembic/versions/
```

#### Scope Population Issues

```sh
# Check if scopes were created
docker-compose run --rm app uv run python scripts/populate_default_scopes.py --list

# Clear and re-populate scopes
docker-compose exec db psql -U postgres -d oauth_db -c "TRUNCATE scopes;"
docker-compose run --rm app uv run python scripts/populate_default_scopes.py
```

#### Build Issues

```sh
# Clean rebuild
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### Reset Everything

```sh
# Complete reset (deletes all data)
docker-compose down -v
docker system prune -af
docker-compose build --no-cache
docker-compose up -d

# Re-run setup
docker-compose run --rm migrate
docker-compose run --rm app uv run python scripts/populate_default_scopes.py
```

## 🧪 Testing

```sh
# Run tests (if available)
uv run pytest

# Run tests with coverage
uv run pytest --cov=app

# Test database connection
docker-compose run --rm app uv run python -c "from app.database import SessionLocal; print('✅ Database connection works')"

# Test model imports
docker-compose run --rm app uv run python -c "from app.models import *; print('✅ All models imported successfully')"
```

## 📖 API Documentation

Once the application is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 License

Will write later :)

## 📚 Additional Resources

- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)

---

For more detailed information about the database schema, see the [Database Documentation](docs/database/schema.md).
