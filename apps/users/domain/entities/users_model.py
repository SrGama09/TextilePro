import enum
import uuid
from datetime import datetime, UTC
from pydantic import Field
from typing import Optional

from shared.models import TPBaseModel, TPGetBaseModel, TPInsertBaseModel, TPUpdateBaseModel
from shared import constants


class UserRole(enum.Enum):
    ADMIN = constants.USER_ROLE_ADMIN
    USER = constants.USER_ROLE


class UserStatus(enum.Enum):
    ACTIVE = constants.USER_STATUS_ACTIVE
    INACTIVE = constants.USER_STATUS_INACTIVE
    DELETED = constants.USER_STATUS_DELETED
    BLOCKED = constants.USER_STATUS_BLOCKED


class UsersModel(TPBaseModel):
    """
    UsersModel: Entity to represent a user

    Class Attributes:
        id (int): The ID of the user.
        uuid (str): The UUID of the user.
        name (str): The name of the user.
        email (str): The email of the user.
        password (str): The password of the user.
        role (UserRole): The role of the user, using UserRole enum.
        status (UserStatus): The status of the user, using UserStatus enum.
        created_at (datetime): The creation date of the record.
        updated_at (datetime): The update date of the record.
    """
    id: int
    uuid: str
    name: str
    email: str
    password: str
    role: UserRole
    status: UserStatus
    created_at: datetime
    updated_at: datetime


class GetUsersByFilterModel(TPGetBaseModel):
    """
    GetUsersByFilterModel: Entity to represent the filter for getting users.

    """
    id: Optional[list[int]] = None
    uuid: Optional[list[str]] = None
    name: Optional[list[str]] = None
    email: Optional[list[str]] = None
    role: Optional[list[UserRole]] = None
    status: Optional[list[UserStatus]] = None


class InsertUsersModel(TPInsertBaseModel):
    """
    InsertUsersModel: Entity to represent the insertion of a user.
    """
    uuid: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    password: str
    role: UserRole
    status: UserStatus
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(UTC), alias='createdAt')
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(UTC), alias="updatedAt")


class UpdateUsersModel(TPUpdateBaseModel):
    """
    UpdateUsersModel: Entity to represent the update of a user.
    """
    id: int
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(UTC), alias="updatedAt")
