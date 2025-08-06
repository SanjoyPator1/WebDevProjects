from fastapi import APIRouter

health_router = APIRouter()

@health_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "oauth-auth-service",
        "version": "0.1.0"
    }