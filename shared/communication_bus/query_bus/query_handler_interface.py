from abc import abstractmethod

from shared.communication_bus.communication_handler_interface import CommunicationHandlerInterface
from shared.communication_bus.query_bus.query_dto import QueryDTO


class QueryHandlerInterface(CommunicationHandlerInterface):

    @abstractmethod
    def ask(self, query: QueryDTO, trace_id: str = None):
        """
        Abstract method to ask the query.

        This method should be implemented by all subclasses of QueryHandlerInterface.
        The implementation should contain the logic to handle the query.

        Args:
            query (QueryDTO): The query to be asked.
            trace_id (str, optional): Identifier to trace the request. Defaults to None.
        """
        pass
