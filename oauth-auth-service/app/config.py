"""
Application configuration using Pydantic Settings.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    """
    Application settings with automatic loading and validation.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore"
    )

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/oauth_db"
    database_sync_url: str = "postgresql://postgres:postgres@localhost:5432/oauth_db"

    app_name: str = "OAuth Auth Service"
    app_version: str = "0.1.0"
    debug: bool = False # True for logs of sql and others

    secret_key: str = "your secret key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

@lru_cache()
def get_settings() -> Settings:
    """
    Gets cached settings instance
    """
    return Settings()

settings = get_settings()