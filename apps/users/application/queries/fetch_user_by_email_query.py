from shared.communication_bus.query_bus.query_dto import QueryDTO


class FetchUserByEmailQuery(QueryDTO):
    """
    Query to fetch the user by email.

    Class Attributes:
        email (str): The email of the user to fetch.
    """
    email: str
