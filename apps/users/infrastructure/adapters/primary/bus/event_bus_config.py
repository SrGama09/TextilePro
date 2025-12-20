from typing import Dict, Any

from refactor.apps.masConsigliere.application.events.halcon_recommendator_event import HalconRecommendatorEvent
from refactor.apps.masConsigliere.application.events.ipex.ipex_ip_processor_event import IpexIpProcessorEvent
from refactor.apps.masConsigliere.application.events.lookalike_recommendator_event import LookALikeRecommendatorEvent
from refactor.apps.masConsigliere.domain.repositories.ipex.ip_matcher_provider_interface import IpMatcherProviderInterface
from refactor.apps.masConsigliere.domain.repositories.ipex.ipex_providers_interface import IpexProvidersInterface
from refactor.apps.masConsigliere.domain.repositories.lookalike_providers_interface import LookALikeProvidersInterface
from refactor.apps.masConsigliere.domain.repositories.notify_interface import NotifyInterface
from refactor.apps.masConsigliere.domain.repositories.parser_interface import ParserInterface
from refactor.apps.masConsigliere.infrastructure.primary_adapters.config.bus.handler_factory import HandlerFactory
from refactor.apps.masConsigliere.infrastructure.secondary_adapters.bubble_front_repository import BubbleFrontRepository
from refactor.apps.masConsigliere.infrastructure.secondary_adapters.halcon_providers.apollo_repository import HalconApolloRepository
from refactor.apps.shared.communicationBus.eventBus.event_bus import EventBus
from refactor.apps.shared.utils.database_manager import DataBaseManager


class EventBusConfig:
    def __init__(self, mapping_repositories: Dict[str, Any],
                 lookalike_leads_provider: LookALikeProvidersInterface,
                 ipex_leads_provider: IpexProvidersInterface,
                 lookalike_companies_provider: LookALikeProvidersInterface,
                 parser_provider: ParserInterface,
                 bubble_repository: NotifyInterface,
                 slack_repository: NotifyInterface,
                 leads_from_target_provider: HalconApolloRepository,
                 bubble_frontend_repository: BubbleFrontRepository,
                 ip_matcher_provider: IpMatcherProviderInterface,
                 notifications_repository: NotifyInterface,
                 database_manager: DataBaseManager):

        self.event_bus = EventBus()
        self.mapping_repositories_ = mapping_repositories
        self.lookalike_leads_provider = lookalike_leads_provider
        self.ipex_leads_provider = ipex_leads_provider
        self.lookalike_companies_provider = lookalike_companies_provider
        self.parser_provider = parser_provider
        self.bubble_repository = bubble_repository
        self.leads_from_target_provider = leads_from_target_provider
        self.bubble_frontend_reposirory_ = bubble_frontend_repository
        self.ip_matcher_provider_ = ip_matcher_provider
        self.notifications_repository_ = notifications_repository
        self.slack_repository_ = slack_repository
        self.database_manager = database_manager
        self.instance_event_bus()

    def instance_event_bus(self):
        """
        Initializes the services and use cases for the event bus.
        """
        self.event_bus.register_handler(LookALikeRecommendatorEvent,
                                        HandlerFactory.lookalike_recommendator_handler(
                                            self.mapping_repositories_,
                                            self.lookalike_leads_provider,
                                            self.lookalike_companies_provider,
                                            self.parser_provider,
                                            self.bubble_repository,
                                            self.database_manager))

        self._register_halcon_handler()
        self._register_ipex_handlers()

    def _register_halcon_handler(self):
        halcon_recommendator_handler = HandlerFactory.halcon_recommendator_handler(
            mapping_repositories=self.mapping_repositories_,
            halcon_parser_provider=self.parser_provider,
            halcon_provider=self.leads_from_target_provider,
            database_manager=self.database_manager
        )

        self.event_bus.register_handler(HalconRecommendatorEvent, halcon_recommendator_handler)

    def _register_ipex_handlers(self):
        """
        Registers the Ipex IP processor handler.
        """
        self._register_ip_processor_handler()

    def _register_ip_processor_handler(self):
        """
        Registers the Ipex IP processor handler with the event bus.
        """
        ipex_recommendator_handler = HandlerFactory.ipex_ip_processor_handler(
            front_end_repository=self.bubble_frontend_reposirory_,
            mapping_repositories=self.mapping_repositories_,
            ip_matcher_provider=self.ip_matcher_provider_,
            notifications_repository=self.notifications_repository_,
            ipex_leads_provider=self.ipex_leads_provider,
            ipex_parser_provider=self.parser_provider,
            slack_repository=self.slack_repository_,
            database_manager=self.database_manager
        )

        self.event_bus.register_handler(IpexIpProcessorEvent, ipex_recommendator_handler)

    def get_event_bus(self):
        return self.event_bus
