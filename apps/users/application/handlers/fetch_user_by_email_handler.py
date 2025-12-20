import uuid
from typing import Optional

from apps.users.application.queries.fetch_user_by_email_query import FetchUserByEmailQuery
from apps.users.application.services.users_service import UsersService
from apps.users.domain.entities.users_model import UsersModel
from apps.users.exceptions.application.handlers.users_handlers_exceptions import FetchUserByEmailHandlerException
from shared.communication_bus.query_bus.query_handler_interface import QueryHandlerInterface
from shared.constants import USERS_SERVICE
from shared.exceptions import ServiceException
from shared.logger import LoggerService


class FetchUserByEmailHandler(QueryHandlerInterface):
    """Handler to fetch user by email."""

    def __init__(self, users_service: UsersService):
        """
        Constructor for the FetchUserByEmailHandler class.

        Args:
            users_service (UsersService): The service to fetch user by email.
        """
        self.origin = self.__class__.__name__
        self.user: str = USERS_SERVICE
        self.fetch_service = users_service

    def ask(self, query: FetchUserByEmailQuery, trace_id: str = None) -> Optional[UsersModel]:
        """
        Handles the command to fetch the user by email.

        Args:
            query (FetchUserByEmailQuery): The query command containing the filter criteria.
            trace_id (str, optional): The trace ID for the request.

        Returns:
            Optional[UsersModel]: The user with the provided email, or None if not found.

        Raises:
            FetchUserByEmailHandlerException: If an error occurs while fetching the user.
        """
        if not trace_id:
            trace_id = str(uuid.uuid4())
        try:
            return self.fetch_service.fetch_user_by_email(query.email)
        except ServiceException as e:
            raise FetchUserByEmailHandlerException(e)
        except Exception as e:
            error_message = f"Unexpected error fetching user by email {query.email}"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise FetchUserByEmailHandlerException(error_message) from e
