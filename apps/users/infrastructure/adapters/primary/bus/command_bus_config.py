from apps.users.infrastructure.adapters.secondary.orm.repositories.users_orm_repository import UsersOrmRepository
from shared.communication_bus.command_bus.command_bus import CommandBus
from shared.database import DataBaseManager


class CommandBusConfig:
    """
    CommandBusConfig is a class that encapsulates the configuration of the command bus.
    """

    def __init__(self, database_manager: DataBaseManager, users_orm_repository: UsersOrmRepository):
        self.command_bus = CommandBus()
        self.users_orm_repository = users_orm_repository
        self.database_manager = database_manager
        self.instance_command_bus()

    def get_command_bus(self):
        """
        Return the instance of the command bus.
        """
        return self.command_bus

    def instance_command_bus(self):
        self.command_bus.register_handler(UpdateLeadsRecommendedCommand,
                                          HandlerFactory.update_leads_recommended_handler(self.leads_mapping, self.database_manager))

        self.command_bus.register_handler(InsertCustomerInfoCommand,
                                          HandlerFactory.insert_customer_info_handler(
                                              self.mapping_repositories["customer_info"], self.database_manager))
