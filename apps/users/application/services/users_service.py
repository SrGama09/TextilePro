import uuid
from typing import Optional
from pydantic import ValidationError

from apps.users.domain.entities.users_model import UsersModel, GetUsersByFilterModel, InsertUsersModel, UpdateUsersModel
from apps.users.domain.repositories.users_db_interface import UsersDBInterface
from apps.users.exceptions.application.services.users_service_exceptions import UsersServiceValidationException, \
    UsersServiceException
from shared.constants import USERS_SERVICE
from shared.database import DataBaseManager
from shared.decorators import with_scoped_session
from shared.exceptions import InfrastructureException
from shared.logger import LoggerService


class UsersService:
    """
    Service to handle the users
    """
    def __init__(self, db_repository: UsersDBInterface, database_manager: DataBaseManager):
        """
        Constructor for the UsersService class.

        Args:
            db_repository (UsersDBInterface): The repository to handle the database operations.
            database_manager (DataBaseManager): The database manager to manage the database connections.
        """
        self.origin = self.__class__.__name__
        self.user: str = USERS_SERVICE
        self.db_repository = db_repository
        self.database_manager = database_manager

    @with_scoped_session
    def fetch_user_by_email(self, session, email: str, trace_id: str = None) -> Optional[UsersModel]:
        """
        Fetches a user by email.

        Args:
            session: Database session provided by the decorator.
            email (str): The email of the user to fetch.
            trace_id (Optional[str]): The trace ID for the request.

        Returns:
            Optional[UsersModel]: The user with the provided email, or None if not found.

        Raises:
            UsersServiceException: If an error occurs while fetching the user.
            UsersServiceValidationException: If the provided email is invalid.
        """
        if not trace_id:
            trace_id = str(uuid.uuid4())
        try:
            return self.db_repository.get_by_email(session, email, trace_id)
        except ValidationError as e:
            LoggerService.insert_error(self.origin, f"Error validating email: {str(e)}", self.user, trace_id)
            raise UsersServiceValidationException(e)
        except InfrastructureException as e:
            raise UsersServiceException(e)
        except Exception as e:
            error_message = f"Unexpected error fetching user by email {email}"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersServiceException(error_message) from e

    @with_scoped_session
    def insert_user(self, session, user: dict, trace_id: str = None) -> UsersModel:
        """
        Inserts a new user.

        Args:
            session: Database session provided by the decorator.
            user (dict): The user to insert.
            trace_id (Optional[str]): The trace ID for the request.

        Returns:
            UsersModel: The inserted user.

        Raises:
            UsersServiceException: If an error occurs while inserting the user.
            UsersServiceValidationException: If the provided user is invalid.
        """
        if not trace_id:
            trace_id = str(uuid.uuid4())
        try:
            insert_model = InsertUsersModel(**user)
            is_inserted = self.db_repository.insert(session, insert_model, trace_id)
            session.commit()
            return is_inserted
        except ValidationError as e:
            LoggerService.insert_error(self.origin, f"Error validating user: {str(e)}", self.user, trace_id)
            raise UsersServiceValidationException(e)
        except InfrastructureException as e:
            raise UsersServiceException(e)
        except Exception as e:
            error_message = f"Unexpected error inserting user"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersServiceException(error_message) from e

    @with_scoped_session
    def update_user(self, session, user: dict, trace_id: str = None) -> UsersModel:
        """
        Updates an existing user.

        Args:
            session: Database session provided by the decorator.
            user (dict): The user to update.
            trace_id (Optional[str]): The trace ID for the request.

        Returns:
            UsersModel: The updated user.

        Raises:
            UsersServiceException: If an error occurs while updating the user.
            UsersServiceValidationException: If the provided user is invalid.
        """
        if not trace_id:
            trace_id = str(uuid.uuid4())
        try:
            update_model = UpdateUsersModel(**user)
            is_updated = self.db_repository.update(session, update_model, trace_id)
            session.commit()
            return is_updated
        except ValidationError as e:
            LoggerService.insert_error(self.origin, f"Error validating user: {str(e)}", self.user, trace_id)
            raise UsersServiceValidationException(e)
        except InfrastructureException as e:
            raise UsersServiceException(e)
        except Exception as e:
            error_message = f"Unexpected error updating user"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersServiceException(error_message) from e
