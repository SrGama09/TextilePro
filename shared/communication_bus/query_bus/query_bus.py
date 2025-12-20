from shared.communication_bus.communication_dto import CommunicationDTO
from shared.communication_bus.communication_handler_interface import CommunicationHandlerInterface


class QueryBus:
    def __init__(self):
        """
        Constructor for the QueryBus class.
        Initializes the handlers' dictionary.
        """
        self.handlers = {}

    def register_handler(self, query_type, handler: CommunicationHandlerInterface):
        """
        Registers a handler for a specific query type.

        Args:
            query_type: The type of the query for which the handler is being registered.
            handler (CommunicationHandlerInterface): The handler to be registered.
        """
        self.handlers[query_type] = handler

    def ask(self, query: CommunicationDTO, trace_id: str = None):
        """
        Asks the handler for a specific query.

        Args:
            query (CommunicationDTO): The query to be asked.
            trace_id (str, optional): Identifier to trace the request. Defaults to None.

        Raises:
            Exception: If no handler is registered for the query type.
        """
        query_type = type(query)
        if query_type in self.handlers:
            return self.handlers[query_type].ask(query, trace_id=trace_id)
        raise Exception(f"No handler registered for ask {query_type}")
