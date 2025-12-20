from shared.communication_bus.query_bus.query_bus import QueryBus


class QueryBusConfig:
    def __init__(self, repositories_recommendator, mapping_repositories, parser_provider: ParserInterface, database_manager: DataBaseManager):
        self.query_bus = QueryBus()
        self.repositories_recommendator = repositories_recommendator
        self.mapping_repositories = mapping_repositories
        self.parser_provider = parser_provider,
        self.database_manager = database_manager
        self.instance_query_bus()

    def instance_query_bus(self):
        """
        Initializes the services and use cases for the query bus.
        """
        self.query_bus.register_handler(FetchLeadsRecommendedByFilterQuery,
                                        HandlerFactory.fetch_leads_recommended_by_filter_handler(
                                            self.repositories_recommendator,
                                            self.mapping_repositories, self.database_manager))

        self.query_bus.register_handler(FetchCustomerInfoQuery,
                                        HandlerFactory.fetch_customer_info_handler(
                                            self.mapping_repositories["customer_info"], self.database_manager))

        self.query_bus.register_handler(FetchCustomerLeadsFiltersQuery,
                                        HandlerFactory.fetch_customer_lead_filters_handler(
                                            self.mapping_repositories["customer_lead_filters"],
                                            self.parser_provider, self.database_manager))

        self.query_bus.register_handler(FetchCompanyUserQuery,
                                        HandlerFactory.fetch_company_user_handler(
                                            self.mapping_repositories["company_users"], self.database_manager))

        self.query_bus.register_handler(GetByFilterCompanyUserQuery,
                                        HandlerFactory.get_by_filter_company_user_handler(
                                            self.mapping_repositories["company_users"], self.database_manager))

        self.query_bus.register_handler(GetCompanyStrategicDataQuery,
                                        HandlerFactory.get_company_strategic_data_handler(
                                            self.mapping_repositories["company_strategic_data"], self.database_manager))

        self.query_bus.register_handler(FetchDomainsByFilterQuery,
                                        HandlerFactory.fetch_domains_list_by_filter_handler(
                                            self.mapping_repositories["ipex_companies"], self.database_manager))

        self.query_bus.register_handler(FetchQuantityJobTitlesQuery,
                                        HandlerFactory.fetch_quantity_job_titles_handler(
                                            self.mapping_repositories["customer_lead_filters"],
                                            self.parser_provider,
                                            self.database_manager))

        self.query_bus.register_handler(FetchIpexCustomerconfigQuery,
                                        HandlerFactory.fetch_ipex_customer_config_handler(
                                            self.mapping_repositories["ipex_customer_config"],
                                            self.database_manager
                                        ))

        self.query_bus.register_handler(GetLeadsByDateByFilterQuery,
                                        HandlerFactory.get_leads_by_date_by_filter_handler(self.database_manager))
        self.query_bus.register_handler(GetFiltersByIdsQuery,
                                        HandlerFactory.get_filters_by_ids_handler(self.database_manager))
        self.query_bus.register_handler(GetCompanyDomainByLookalikeQuery,
                                        HandlerFactory.get_company_domain_by_lookalike_handler(self.database_manager))
        self.query_bus.register_handler(GetCustomerCompanyDomainQuery,
                                        HandlerFactory.get_customer_company_domain_handler(self.database_manager))

    def get_query_bus(self):
        return self.query_bus
