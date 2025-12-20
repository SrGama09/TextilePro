# Import local modules
from shared.communication_bus.command_bus.command_dto import CommandDTO
from shared.communication_bus.command_bus.command_handler_interface import CommandHandlerInterface


class CommandBus:
    def __init__(self):
        """
        Constructor for the CommandBus class.
        Initializes the handlers' dictionary.
        """
        self.handlers = {}
        self._initialize_general_handlers()

    def _initialize_general_handlers(self):
        """
        Initializes the general handlers for the CommandBus.
        """
        pass

    def register_handler(self, command_type, handler: CommandHandlerInterface):
        """
        Registers a handler for a specific command type.

        Args:
            command_type: The type of the command for which the handler is being registered.
            handler (CommandHandlerInterface): The handler to be registered.
        """
        self.handlers[command_type] = handler

    def execute(self, command: CommandDTO, trace_id: str = None):
        """
        Executes the handler for a specific command.

        Args:
            command (CommandDTO): The command to be executed.
            trace_id (Optional[str]): The trace ID for the request.

        Raises:
            Exception: If no handler is registered for the command type.
        """
        command_type = type(command)
        if command_type in self.handlers:
            return self.handlers[command_type].execute(command, trace_id=trace_id)
        raise Exception(f"No handler registered for command {command_type}")
