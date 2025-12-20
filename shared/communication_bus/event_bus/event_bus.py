from shared.communication_bus.event_bus.event_dto import EventDTO
from shared.communication_bus.event_bus.event_handler_interface import EventHandlerInterface


class EventBus:
    def __init__(self):
        """
        Constructor for the EventBus class.
        Initializes the handlers' dictionary.
        """
        self.handlers = {}

    def register_handler(self, event_type, handler: EventHandlerInterface):
        """
        Registers a handler for a specific event type.

        Args:
            event_type: The type of the event for which the handler is being registered.
            handler (EventHandlerInterface): The handler to be registered.
        """
        if event_type not in self.handlers:
            self.handlers[event_type] = []
        self.handlers[event_type].append(handler)

    def publish(self, event: EventDTO, trace_id: str = None):
        """
        Publishes the event to the appropriate handler.

        Args:
            event (EventDTO): The event to be published.
            trace_id (str, optional): The trace ID for the request.

        Raises:
            Exception: If no handler is registered for the event type.
        """
        event_type = type(event)
        if event_type in self.handlers:
            for handler in self.handlers[event_type]:
                handler.publish(event, trace_id=trace_id)
        else:
            raise Exception(f"No handler registered for dispatch event {event_type}")
