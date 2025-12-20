import logging
import platform
from logging.handlers import RotatingFileHandler
from pythonjsonlogger import json

from shared.constants import TEXTILE_PRO_UNIX_LOGS, TEXTILE_PRO_WINDOWS_LOGS


class LoggerConfig:
    """
    Config class for logger.
    """

    @staticmethod
    def get_path_logger():
        log_file = TEXTILE_PRO_UNIX_LOGS

        if platform.system() == "Windows":
            log_file = TEXTILE_PRO_WINDOWS_LOGS

        return log_file

    @staticmethod
    def setup_logger(
        log_level=logging.INFO,
        log_file=None,
        max_bytes=10 * 1024 * 1024,
        backup_count=2,
    ):
        """
        Configures the logger with the given parameters.

        Args:
            log_level (int): The logging level.
            log_file (str): The log file path.
            max_bytes (int): The maximum size of the log file.
            backup_count (int): The number of backup log files to keep.

        Returns:
            logging.Logger: The configured logger.
        """
        logger = logging.getLogger("LogUtil")
        logger.setLevel(log_level)
        logger.propagate = False

        if log_file is None:
            log_file = LoggerConfig.get_path_logger()

        # Create a rotating file handler
        fh = RotatingFileHandler(
            log_file, maxBytes=max_bytes, backupCount=backup_count, encoding="utf-8"
        )
        formatter = json.JsonFormatter(
            fmt="%(asctime)s %(levelname)s %(origin)s %(user_id)s %(trace_id)s %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        fh.setFormatter(formatter)
        logger.addHandler(fh)

        # Handler to print logs to the console
        console_handler = logging.StreamHandler()
        console_handler.setLevel(log_level)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

        return logger
