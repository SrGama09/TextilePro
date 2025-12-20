from shared.exceptions import HandlerException


class FetchUserByEmailHandlerException(HandlerException):
    """ Base exception for FetchUserByEmailHandler """
    pass


class InsertUserHandlerException(HandlerException):
    """ Base exception for InsertUserHandler """
    pass
