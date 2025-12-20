import logging
import sys
import threading
import traceback
import uuid
from typing import Literal

from shared.constants import USER_LOGGER_SERVICE
from shared.logger import LoggerConfig


class LoggerService:
    """
    Class to handle logging operations.
    """

    _logger = None
    _lock = threading.Lock()
    _user = USER_LOGGER_SERVICE

    @classmethod
    def _get_logger(cls, level: Literal[20, 30, 40] = logging.INFO):
        """
        Get the logger instance.

        Args:
            level (int): The logging level.

        Returns:
            logging.Logger: The logger instance configured with the given level.
        """
        with cls._lock:
            if cls._logger is None:
                cls._logger = LoggerConfig.setup_logger(log_level=level)
            else:
                cls._logger.setLevel(level)
        return cls._logger

    @classmethod
    def insert_log(
        cls,
        origin: str,
        message: str,
        user: str,
        trace_id: str | None = None,
    ) -> None:
        """
        Insert a log of level INFO.

        Args:
            origin (str): The origin of the log message.
            message (str): The log message.
            user (str): The user associated with the log.
            trace_id (str, optional): Identifier to trace the request. Defaults to None.
        """
        logger = cls._get_logger(20)  # logging.INFO
        trace = trace_id or str(uuid.uuid4())
        extra = {
            "user": user if user is not None else cls._user,
            "origin": origin,
            "trace_id": trace,
        }
        logger.log(logging.INFO, message, extra=extra)

    @classmethod
    def insert_error(
        cls,
        origin: str,
        message: str,
        user: str,
        trace_id: str | None = None,
    ) -> None:
        """
        Insert a log of level ERROR.

        Args:
            origin (str): The origin of the log message.
            message (str): The log message.
            user (str): The user associated with the log.
            trace_id (str, optional): Identifier to trace the request. Defaults to None.
        """
        logger = cls._get_logger(40)  # logging.ERROR
        has_active_exception = sys.exc_info()[0] is not None
        trace = trace_id or str(uuid.uuid4())
        extra = {
            "user": user if user is not None else cls._user,
            "origin": origin,
            "trace_id": trace,
        }
        if has_active_exception:
            extra["traceback"] = traceback.format_exc()
        logger.log(logging.ERROR, message, extra=extra)

    @classmethod
    def insert_warning(
        cls,
        origin: str,
        message: str,
        user: str,
        trace_id: str | None = None,
    ) -> None:
        """
        Insert a log of level WARNING.

        Args:
            origin (str): The origin of the log message.
            message (str): The log message.
            user (str): The user associated with the log.
            trace_id (str, optional): Identifier to trace the request. Defaults to None.
        """
        logger = cls._get_logger(30)  # logging.WARNING
        trace = trace_id or str(uuid.uuid4())
        extra = {
            "user": user if user is not None else cls._user,
            "origin": origin,
            "trace_id": trace,
        }
        logger.log(logging.WARNING, message, extra=extra)
