# OAuth Auth Service

A FastAPI-based OAuth 2.0 authentication service with PostgreSQL database, SQLAlchemy ORM, and Alembic migrations.

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

### Database Access

```sh
# Connect to database via psql
docker-compose exec db psql -U postgres -d oauth_db

# List all tables
docker-compose exec db psql -U postgres -d oauth_db -c "\dt"

# View table structure
docker-compose exec db psql -U postgres -d oauth_db -c "\d users"

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

2. **Generate a new migration:**

   ```sh
   docker-compose run --rm app uv run alembic revision --autogenerate -m "Add new field to users table"
   ```

3. **Review the generated migration** in `alembic/versions/`

4. **Apply the migration:**

   ```sh
   docker-compose run --rm migrate
   ```

5. **Restart the application:**
   ```sh
   docker-compose restart app
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

# Start the application
uv run uvicorn app.main:app --reload
```

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
```

## Project Structure

```
oauth-auth-service/
├── alembic/                 # Database migrations
│   ├── versions/           # Migration files
│   └── env.py             # Alembic configuration
├── app/                    # Application code
│   ├── models/            # SQLAlchemy models
│   ├── routers/           # FastAPI routes
│   ├── schemas/           # Pydantic schemas
│   ├── services/          # Business logic
│   └── main.py           # FastAPI application
├── docker-compose.yml     # Docker services
├── Dockerfile            # Application container
├── alembic.ini          # Alembic configuration
└── pyproject.toml       # Python dependencies
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Database URLs (for local development)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@127.0.0.1:5433/oauth_db
DATABASE_SYNC_URL=postgresql://postgres:postgres@127.0.0.1:5433/oauth_db

# App settings
APP_NAME=OAuth Auth Service
APP_VERSION=0.1.0
DEBUG=True

# Security
SECRET_KEY=your-very-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Testing

```sh
# Run tests (if available)
uv run pytest

# Run tests with coverage
uv run pytest --cov=app
```

## API Documentation

Once the application is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

will write later :)

For more detailed information, check the individual configuration files and the FastAPI documentation.
