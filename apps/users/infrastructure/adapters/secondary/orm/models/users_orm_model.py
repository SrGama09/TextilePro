from sqlalchemy import Column, String, DateTime, func
from shared.models import TextileProBaseOrmModel


class UsersOrmModel(TextileProBaseOrmModel):
    """
    SQLAlchemy model for the user table.

    Class Attributes:
        id (Column): Primary key column for the user ID.
        uuid (Column): Unique identifier column for the user.
        name (Column): Name column for the user.
        email (Column): Email column for the user.
        password (Column): Password column for the user.
        role (Column): Role column for the user, using UserRole enum.
        status (Column): Status column for the user, using UserStatus enum.
        created_at (Column): Created at column for the user, using DateTime.
        updated_at (Column): Updated at column for the user, using DateTime.
    """

    __tablename__ = "users"
    name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False, unique=True, index=True)
    password = Column(String(200), nullable=False)
    role = Column(String(100), nullable=False)
    status = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
