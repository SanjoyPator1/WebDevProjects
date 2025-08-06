# User service for database operations.

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["sha256_crypt"],
    deprecated="auto"
)

class UserService:
    """
    Service for user operations.

    this class contains all the business logic for users
    """

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a plain text password

        Args:
            password (str): Plain text password

        Returns:
            str: Hashed password to store in db
        """

        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """verify a password against its hash

        Args:
            plain_password (str): password to check
            hashed_password (str): Hash from db

        Returns:
            bool: true if password matches else false
        """

        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    async def create_user(
        db: AsyncSession,
        email: str,
        username: str,
        password: str,  # plain text password
        full_name: Optional[str] = None
    ) -> User:
        """create a new user

        Args:
            db: Database session
            email: User's email
            username: User's username
            password: Plain text password (will be hashed)
            full_name: Optional full name

        Returns:
            User: created user
        """

        hashed_password = UserService.hash_password(password)

        user = User(
            email=email,
            username=username,
            hashed_password=hashed_password,
            full_name=full_name
        )

        db.add(user)

        try:
            await db.commit()

            await db.refresh(user)

            return user

        except IntegrityError:
            await db.rollback()
            raise ValueError("User with this email or username already exists")
    
    @staticmethod
    async def get_user_by_email(
        db: AsyncSession,
        email: str
    ) -> Optional[User]:
        """
        Get user by email
        """

        query = select(User).where(User.email==email)

        result = await db.execute(query)

        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_by_id(
        db: AsyncSession,
        user_id: int
    ) -> Optional[User]:
        """
        Get user by ID
        """

        return await db.get(User, user_id)
    
    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        email: str,
        password: str
    ) -> Optional[User]:
        """
        Authenticate a user with email and password
        """

        user = await UserService.get_user_by_email(db, email)

        if not user:
            return None
        
        if not UserService.verify_password(password, user.hashed_password):
            return None
        
        if not user.is_active:
            return None
        
        return user
    

    @staticmethod
    async def get_all_users(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20
    ) -> List[User]: 
        """
        Get all users with pagination
        """

        query = select(User).offset(skip).limit(limit)
        result = await db.execute(query)

        return result.scalars().all()
    

    @staticmethod
    async def update_user(
        db: AsyncSession,
        user_id: int,
        **kwargs
    ) -> Optional[User]:
        """Update user fields

        Args:
            db (AsyncSession): db session
            user_id (int): users id to update
            **kwargs: fields to update

        Returns:
            Optional[User]: updated user or none
        """

        user = await db.get(User, user_id)

        if not user:
            return None
        
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)

        await db.commit()
        await db.refresh(user)

        return user

