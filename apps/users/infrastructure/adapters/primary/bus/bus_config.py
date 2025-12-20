from apps.users.infrastructure.adapters.primary.bus.command_bus_config import CommandBusConfig
from apps.users.infrastructure.adapters.primary.bus.event_bus_config import EventBusConfig
from apps.users.infrastructure.adapters.primary.bus.query_bus_config import QueryBusConfig
from apps.users.infrastructure.adapters.secondary.orm.repositories.users_orm_repository import UsersOrmRepository
from shared.database import DataBaseManager


class BusConfig:
    def __init__(self, database_url: str):

        # Database
        self.database_manager = DataBaseManager(database_url)

        # Repositories
        self.users_orm_repository = UsersOrmRepository()

        self.command_bus_config = CommandBusConfig(
            self.database_manager,
            self.users_orm_repository,
        )
        self.query_bus_config = QueryBusConfig(
            self.database_manager,
            self.users_orm_repository,
        )

        self.event_bus_config = EventBusConfig(
            self.database_manager,
            self.users_orm_repository,
        )

    def get_command_bus(self):
        return self.command_bus_config.get_command_bus()

    def get_query_bus(self):
        return self.query_bus_config.get_query_bus()

    def get_event_bus(self):
        return self.event_bus_config.get_event_bus()
