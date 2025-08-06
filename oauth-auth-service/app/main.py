from fastapi import FastAPI
from app.routers.health import health_router

app = FastAPI(
    title="oauth auth service",
    description="auth service - oauth",
    version="0.1.0"
)

app.include_router(health_router,prefix="/api")

@app.get("/")
async def root():
    return {
        "message":"Hello World!"
    }

