from abc import abstractmethod

from shared.communication_bus.command_bus.command_dto import CommandDTO
from shared.communication_bus.communication_handler_interface import CommunicationHandlerInterface


class CommandHandlerInterface(CommunicationHandlerInterface):

    @abstractmethod
    def execute(self, command: CommandDTO, trace_id: str = None):
        """
        Abstract method to execute the command.

        This method should be implemented by all subclasses of CommandHandlerInterface.
        The implementation should contain the logic to handle the command.

        Args:
            command (CommandDTO): The command to be executed.
            trace_id (str, optional): Identifier to trace the request. Defaults to None.
        """
        pass
