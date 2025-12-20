from typing import Optional
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from apps.users.domain.entities.users_model import GetUsersByFilterModel, UsersModel, InsertUsersModel, UpdateUsersModel
from apps.users.domain.repositories.users_db_interface import UsersDBInterface, TPBaseModelType
from apps.users.exceptions.infrastructure.orm.users_orm_repository_exceptions import UsersOrmRepositoryException, \
    UsersOrmRepositoryDBException, UsersOrmRepositoryNotFoundException
from apps.users.infrastructure.adapters.secondary.orm.models.users_orm_model import UsersOrmModel
from shared.constants import USERS_SERVICE
from shared.logger import LoggerService


class UsersOrmRepository(UsersDBInterface):

    def __init__(self):
        """
        Constructor for the UsersDBRepository class.
        Initializes the SQLAlchemy engine and session and connects to the database.
        """
        self.origin = self.__class__.__name__
        self.user: str = USERS_SERVICE

    def get_one_by_filter(self, session: Session, filters: GetUsersByFilterModel, trace_id: str = None
                          ) -> Optional[UsersModel]:
        """
        get_one_by_filter is a method that gets one data by filter

        Args:
            session (Session): SQLAlchemy session.
            filters (GetUsersByFilterModel): Filters to retrieve user.
            trace_id (Optional[str]): The id of the trace.
            
        Returns:
            Optional[UsersModel]: User data.
        
        Raises:
            UsersOrmRepositoryDBException: If there is a database error.
            UsersOrmRepositoryException: If there is an unexpected error.
        """
        try:
            filters_dict = filters.to_db_dict()

            user_query = (
                session.query(UsersOrmModel)
                .filter_by(**filters_dict)
                .order_by(UsersOrmModel.id.asc())
                .first()
            )

            if not user_query:
                LoggerService.insert_log(self.origin,
                                         f"User with filters {filters_dict} not found", self.user, trace_id)
                return None

            return UsersModel(**user_query.__dict__)

        except SQLAlchemyError as e:
            error_message = "Database error getting user by filters"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersOrmRepositoryDBException(error_message) from e
        except UsersOrmRepositoryException:
            raise
        except Exception as e:
            error_message = "Unexpected error getting user by filters"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersOrmRepositoryException(error_message) from e

    def get_by_filter(self, session: Session, filters: GetUsersByFilterModel, trace_id: str = None
                      ) -> list[Optional[UsersModel]]:
        """
        Retrieves user based on the provided filters.

        Args:
            session (Session): SQLAlchemy session.
            filters (GetUsersByFilterModel): Filters to retrieve users.
            trace_id (Optional[str]): The id of the trace.

        Returns:
            Optional[list[UsersModel]]: List of users.

        Raises:
            UsersOrmRepositoryDBException: If there is a database error.
            UsersOrmRepositoryException: If there is an unexpected error.
        """
        try:
            users_query = session.query(UsersOrmModel).filter_by(
                **filters.to_db_dict()).all()
            if not users_query:
                LoggerService.insert_log(self.origin, "Users with filters: "
                                                      f"{filters.to_db_dict()} not found", self.user, trace_id)
                return []

            return [UsersModel(**user.__dict__) for user in users_query]

        except SQLAlchemyError as e:
            error_message = "Database error getting users by filters"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersOrmRepositoryDBException(error_message) from e
        except UsersOrmRepositoryException:
            raise
        except Exception as e:
            error_message = "Unexpected error getting users by filters"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersOrmRepositoryException(error_message) from e

    def get_by_email(self, session: Session, email: str, trace_id: str = None) -> Optional[TPBaseModelType]:
        pass

    def insert(self, session: Session, params: InsertUsersModel, trace_id: str = None) -> UsersModel:
        """
        Insert the user in the database.

        Args:
            session (Session): SQLAlchemy session.
            params (InsertUsersModel): The user to insert in the database.
            trace_id (Optional[str]): The id of the trace.

        Returns:
            UsersModel: The inserted user.

        Raises:
            UsersOrmRepositoryDBException: If there is a database error, insert the user.
            UsersOrmRepositoryException: If there is an unexpected error, insert the user.
        """
        try:
            user_to_insert = UsersOrmModel(**params.to_db_dict())
            session.add(user_to_insert)
            return UsersModel(**user_to_insert.__dict__)
        except SQLAlchemyError as e:
            error_message = "Database error inserting user"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersOrmRepositoryDBException(error_message) from e
        except UsersOrmRepositoryException:
            raise
        except Exception as e:
            error_message = "Unexpected error inserting user"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersOrmRepositoryException(error_message) from e

    def update(self, session: Session, params: UpdateUsersModel, trace_id: str = None) -> UsersModel:
        """
        Update the user in the database.

        Args:
            session (Session): SQLAlchemy session.
            params (UpdateUsersModel): The user to update in the database.
            trace_id (Optional[str]): The id of the trace.

        Returns:
            UsersModel: The updated user.

        Raises:
            UsersOrmRepositoryDBException: If there is a database error, update the user.
            UsersOrmRepositoryException: If there is an unexpected error, update the user.
        """
        try:
            user_to_update = session.query(UsersOrmModel).filter_by(id=params.id).first()
            if not user_to_update:
                error_message = f"User with ID {params.id} not found"
                LoggerService.insert_error(self.origin, error_message, self.user, trace_id)
                raise UsersOrmRepositoryNotFoundException(error_message)

            for key, value in params.to_db_dict().items():
                setattr(user_to_update, key, value)

            return UsersModel(**user_to_update.__dict__)
        except SQLAlchemyError as e:
            error_message = f"Database error updating user"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersOrmRepositoryDBException(error_message) from e
        except UsersOrmRepositoryException:
            raise
        except Exception as e:
            error_message = f"Unexpected error updating user"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise UsersOrmRepositoryException(error_message) from e
