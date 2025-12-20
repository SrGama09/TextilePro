from pydantic import ValidationError

from shared.exceptions import ServiceException


class UsersServiceException(ServiceException):
    """ Base exception for the service layer."""
    pass


class UsersServiceNotFoundException(UsersServiceException):
    """Raised when a user is not found in the database."""
    pass


class UsersServiceValidationException(UsersServiceException, ValidationError):
    """Raised when a user validation error occurs."""
    pass
