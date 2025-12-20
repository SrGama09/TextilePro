from shared.exceptions import InfrastructureException


class UsersOrmRepositoryException(InfrastructureException):
    """Base exception for Users ORM Repository errors."""
    pass


class UsersOrmRepositoryNotFoundException(UsersOrmRepositoryException):
    """Raised when a user is not found in the database."""
    pass


class UsersOrmRepositoryDBException(UsersOrmRepositoryException):
    """Raised when there is a database error in the Users ORM Repository."""
    pass
