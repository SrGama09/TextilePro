from abc import abstractmethod

from shared.communication_bus.communication_handler_interface import CommunicationHandlerInterface
from shared.communication_bus.event_bus.event_dto import EventDTO


class EventHandlerInterface(CommunicationHandlerInterface):

    @abstractmethod
    def publish(self, event: EventDTO, trace_id: str = None):
        """
        Abstract method to publish the event.

        This method should be implemented by all subclasses of EventHandlerInterface.
        The implementation should contain the logic to handle the event.

        Args:
            event (EventDTO): The event to be published.
            trace_id (str, optional): The trace ID for the request.
        """
        pass
