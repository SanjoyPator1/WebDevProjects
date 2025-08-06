from fastapi import FastAPI
from app.routers.health import health_router
from app.routers.users import user_router
from contextlib import asynccontextmanager
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle manager
    """
    print("Starting up OAuth Auth Service...")
    print(f"Database URL: {settings.database_url}")
    print(f"Debug mode: {settings.debug}")

    yield

    print("Shutting down OAuth Auth Service...")

app = FastAPI(
    title=settings.app_name,
    description="OAuth 2.0 Authentication Service",
    version=settings.app_version,
    leftspan=lifespan
)

from app.config import settings
print("Database URL:", settings.database_url)

app.include_router(health_router,prefix="/api")
app.include_router(user_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message":"Hello World!"
    }

