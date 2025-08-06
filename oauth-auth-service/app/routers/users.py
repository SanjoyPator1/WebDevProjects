"""
User API routes
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr

from app.database import get_db
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserLogin, UserResponse

user_router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@user_router.post(
    "/register",
    response_model = UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="register a new user",
    description="create a new user account with email and password"
)
async def register_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """register a new user

    Args:
        user_data (UserCreate): user registration data
        db (AsyncSession, optional): _description_. Defaults to Depends(get_db).
    """

    try:
        user = await UserService.create_user(
            db=db,
            email=user_data.email,
            username=user_data.username,
            password=user_data.password,
            full_name=user_data.full_name
        )

        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
@user_router.post(
    "/login",
    response_model=UserResponse,
    summary="Login user",
    description="Authenticate user with email and password"
)
async def login_user(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Login user

    Args:
        credentials (UserLogin): _description_
        db (AsyncSession, optional): _description_. Defaults to Depends(get_db).
    """

    user = await UserService.authenticate_user(
        db=db,
        email=credentials.email,
        password=credentials.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    return user

@user_router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get user by id",
    description="Retrieves a specific user by their ID"
)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get user by id

    Args:
        user_id (int): _description_
        db (AsyncSession, optional): _description_. Defaults to Depends(get_db).
    """

    user = await UserService.get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    
    return user

@user_router.get(
    "/",
    response_model=List[UserResponse],
    summary="List all users",
    description="get a paginated list of all users"
)
async def list_users(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """List all users with paginated

    Args:
        skip (int, optional): _description_. Defaults to 0.
        limit (int, optional): _description_. Defaults to 20.
        db (AsyncSession, optional): _description_. Defaults to Depends(get_db).
    """

    users = await UserService.get_all_users(db, skip, limit)

    return users
