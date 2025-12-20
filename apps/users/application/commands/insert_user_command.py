from shared.communication_bus.command_bus.command_dto import CommandDTO


class InsertUserCommand(CommandDTO):
    """
    InsertUserCommand: Command to insert a new user.

    Class Attributes:
        name (str): The name of the user.
        email (str): The email of the user.
        password (str): The password of the user.
        role (str): The role of the user.
        status (str): The status of the user.
    """
    name: str
    email: str
    password: str
    role: str
    status: str
