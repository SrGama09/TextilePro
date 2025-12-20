from shared.database import DataBaseManager


class BusConfig:
    def __init__(self):
        s3_data_getter_service: S3DataGetterService = S3DataGetterService()
        self.database_manager = DataBaseManager(s3_data_getter_service.get_database_user_url("MAS_CONSIGLIERE"))
        self.mapping_repositories = {
            "company_users": CompanyUsersMysqlRepository(),
            "company_strategic_data": CompanyStrateticDataMysqlRepository(),
            "customer_info": CustomerInfoMysqlRepository(),
            "customer_lead_filters": CustomerLeadFiltersMysqlRepository(),
            "customer_companies": CustomerCompaniesMysqlRepository(),
            "leads_lookalike": LeadsLookalikeMysqlRepository(),
            "lookalike_companies": LookALikeCompaniesMysqlRepository(),
            "halcon_pagination": HalconPaginationMysqlRepository(),
            "ipex_companies": IpexCompaniesMysqlRepository(),
            "ipex_ips": IpexIPSMysqlRepository(),
            "ipex_leads": LeadsIpexMysqlRepository(),
            "ipex_customer_config": IpexCustomerConfigMysqlRepository(),
            MasLeadsConstants.SOURCE_LEAD_REPLICA: LeadsLookalikeMysqlRepository(),
            MasLeadsConstants.SOURCE_LEAD_HALCON: LeadsHalconMysqlRepository(),
        }
        self.leads_mapping = {
            MasLeadsConstants.SOURCE_LEAD_REPLICA: LeadsLookalikeMysqlRepository(),
            MasLeadsConstants.SOURCE_LEAD_HALCON: LeadsHalconMysqlRepository(),
            MasLeadsConstants.SOURCE_LEAD_IPEX: LeadsIpexMysqlRepository()
        }
        self.lookalike_leads_provider = ApolloRepository()
        self.ipex_leads_provider = IpexApolloRepository()
        self.leads_from_target_provider = HalconApolloRepository()
        self.lookalike_companies_provider = OceanRepository()
        self.ip_matcher_provider = LeadFeederRepository()
        self.parser_provider = ParserTagsRepository()
        self.bubble_repository = BubbleRepository(url="https://app.masleads.es/api/1.1/wf/refresh_copilot_leads")
        self.bubble_front_repository = BubbleFrontRepository(url="https://app.masleads.es/api/1.1")
        self.notifications_repository = NotificationsRepository()
        self.slack_repository = SlackRepository(url=MasLeadsUrlsConstants.SLACK_WEBHOOK_URL)

        self.repositories_recommendator = [
            LeadsLookalikeMysqlRepository(),
            LeadsHalconMysqlRepository(),
            LeadsIpexMysqlRepository()
        ]

        self.command_bus_config = CommandBusConfig(
            self.mapping_repositories,
            self.leads_mapping,
            self.parser_provider,
            self.bubble_repository,
            self.database_manager
        )
        self.query_bus_config = QueryBusConfig(self.repositories_recommendator,
                                               self.mapping_repositories,
                                               self.parser_provider,
                                               self.database_manager)

        self.event_bus_config = EventBusConfig(self.mapping_repositories,
                                               self.lookalike_leads_provider,
                                               self.ipex_leads_provider,
                                               self.lookalike_companies_provider,
                                               self.parser_provider,
                                               self.bubble_repository,
                                               self.slack_repository,
                                               self.leads_from_target_provider,
                                               self.bubble_front_repository,
                                               self.ip_matcher_provider,
                                               self.notifications_repository,
                                               self.database_manager)

    def get_command_bus(self):
        return self.command_bus_config.get_command_bus()

    def get_query_bus(self):
        return self.query_bus_config.get_query_bus()

    def get_event_bus(self):
        return self.event_bus_config.get_event_bus()

    def get_leads_mapping_repository(self):
        return self.leads_mapping
