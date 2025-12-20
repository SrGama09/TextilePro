

class HandlerFactory:
    """
    HandlerFactory is a class that encapsulates the logic to create handlers based on the command type.
    """

    @staticmethod
    def check_quantity_leads_handler(mapping_repository, database_manager) -> CheckQuantityLeadsHandler:
        """
        Creates a CheckQuantityLeadsHandler instance.

        Args:
            mapping_repository: The repository to be used by the handler.
            database_manager: The database manager to be used by the handler.

        Returns:
            CheckQuantityLeadsHandler: The handler instance.
        """
        check_quantity_leads_service = CheckQuantityLeadsService(mapping_repository, database_manager)
        return CheckQuantityLeadsHandler(check_quantity_leads_service=check_quantity_leads_service)

    @staticmethod
    def fetch_leads_recommended_by_filter_handler(repositories: list[DBRecommendatorInterface],
                                                  mapping_repositories: dict, database_manager) -> (
            FetchLeadsRecommendedByFilterHandler):
        """
        Creates a fetch lead recommended by the filter handler.

        Args:
            repositories: The repositories to be used by the handler.
            mapping_repositories: The mapping repositories to be used by the handler.
            database_manager: The database manager to be used by the handler.

        Returns:
            FetchLeadsRecommendedByFilterHandler: The handler instance.
        """
        fetch_leads_recommended_by_filter_service = FetchLeadsRecommendedByFilterService(repositories,
                                                                                         mapping_repositories,
                                                                                         database_manager)
        return FetchLeadsRecommendedByFilterHandler(fetch_leads_recommended_by_filter_service)
