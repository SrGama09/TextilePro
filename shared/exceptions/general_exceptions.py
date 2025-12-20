class TextileProException(Exception):
    """Base exception for the TextilePro app."""
    pass


class ApplicationException(TextileProException):
    """ Base exception for the infrastructure layer."""
    pass


class ServiceException(ApplicationException):
    """ Base exception for the service layer."""
    pass


class HandlerException(ApplicationException):
    """ Base exception for the handler layer."""
    pass


class InfrastructureException(TextileProException):
    """ Base exception for the infrastructure layer."""
    pass


class RepositoryException(InfrastructureException):
    """ Base exception for the repository layer."""
    pass


class DomainException(TextileProException):
    """ Base exception for the domain layer."""
    pass
