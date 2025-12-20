import uuid

from apps.users.exceptions.application.handlers.users_handlers_exceptions import InsertUserHandlerException
from shared.communication_bus.command_bus.command_handler_interface import CommandHandlerInterface
from apps.users.application.commands.insert_user_command import InsertUserCommand
from apps.users.application.services.users_service import UsersService
from apps.users.domain.entities.users_model import UsersModel
from shared.exceptions import ServiceException
from shared.constants import USERS_SERVICE
from shared.logger import LoggerService


class InsertUserHandler(CommandHandlerInterface):
    """Handler for inserting users."""

    def __init__(self, users_service: UsersService):
        """
        Constructor for the InsertUserHandler class.

        Args:
            users_service (UsersService): The service to handle user operations.
        """
        self.origin = self.__class__.__name__
        self.user: str = USERS_SERVICE
        self.insert_service = users_service

    def execute(self, command: InsertUserCommand, trace_id: str = None) -> UsersModel:
        """
        Handles the InsertUserCommand.

        Args:
            command (InsertUserCommand): The command to insert a user.
            trace_id (str, optional): The trace ID for the request.

        Returns:
            UsersModel: The inserted user.

        Raises:
            InsertUserHandlerException: If an error occurs while inserting the user.
        """
        if not trace_id:
            trace_id = str(uuid.uuid4())
        try:
            return self.insert_service.insert_user(command.model_dump())
        except ServiceException as e:
            raise InsertUserHandlerException(e)
        except Exception as e:
            error_message = f"Unexpected error inserting user"
            LoggerService.insert_error(self.origin, f"{error_message}: {str(e)}", self.user, trace_id)
            raise InsertUserHandlerException(error_message) from e
