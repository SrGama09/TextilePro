class LoggerException(Exception):
    """Raised when an error occurs in the logger."""
    pass


class LoggerConfigError(LoggerException):
    """Raised when an error occurs in the logger configuration."""
    pass


class LoggerWriteError(LoggerException):
    """Raised when an error occurs while writing to the logger."""
    pass
