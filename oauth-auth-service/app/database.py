# Database connection setup

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine
)

from sqlalchemy.orm import declarative_base
from app.config import settings

# this engine manages the connection pool and handles all communication with the database
engine = create_async_engine(
    settings.database_url,

    echo=settings.debug,
    future=True,

    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
)

# this creates a factory that produces database session.
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_= AsyncSession,
    expire_on_commit=False,

    autocommit=False,
    autoflush=False
)

Base = declarative_base()

# dependency injection - creates a new database session, yields it to the endpoint and closes it when the request is done
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
