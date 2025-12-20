# Importing the required modules for the handle_exceptions
from functools import wraps
from flask import current_app, jsonify
from pydantic import ValidationError
from werkzeug.exceptions import BadRequest, InternalServerError, NotFound
import traceback

# Importing local modules
from shared.constants import USER_HANDLE_EXCEPTIONS
from shared.logger import LoggerService


def handle_exceptions(func):
    """
    Decorator to handle exceptions in the wrapped function.

    Args:
        func (callable): The function to be wrapped.

    Returns:
        callable: The wrapped function.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        origin = func.__name__
        user = USER_HANDLE_EXCEPTIONS

        try:
            return func(*args, **kwargs)
        except ValidationError as e:
            LoggerService.insert_error(origin, f'Invalid request: {build_bad_request_exception(e.errors())}', user)
            raise BadRequest(description='\n'.join(build_bad_request_exception(e.errors())))
        except NotFound as e:
            LoggerService.insert_error(origin, str(e.description), user)
            raise NotFound(description=str(e.description))
        except Exception as e:
            error_message = f'Error: {str(e)}'
            traceback_str = ''.join(traceback.format_exception(None, e, e.__traceback__))
            LoggerService.insert_error(origin, f'{error_message}\nTraceback: {traceback_str}', user)

            if current_app.config['DEBUG']:
                response = {
                    'error': 'Internal server error',
                    'message': error_message,
                    'traceback': traceback_str
                }
                return jsonify(response), 500
            else:
                raise InternalServerError(description=str(e))

    return wrapper


def build_bad_request_exception(errors):
    """
    Builds a list of error messages from a list of validation errors.

    Args:
        errors (list): A list of validation errors.

    Returns:
        list: A list of error messages.
    """
    messages = []
    for error in errors:
        field = error.get('loc', ('unknown field',))[0]
        message = error.get('msg', 'unknown message')
        value = error.get('input', 'unknown value')
        readable_message = f"Error in the field '{field}': {message}. Value provided: '{value}'"
        messages.append(readable_message)
    return messages
