from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session


class DataBaseManager:
    """
    Class that manages the database connection.
    """

    def __init__(self, database_url: str):
        """
        Constructor for the DataBaseManager class.

        Args:
            database_url (str): URL of the database.
        """
        self.origin = self.__class__.__name__
        self.engine = create_engine(
            database_url,
            echo=False,
            pool_size=10,
            max_overflow=20,
            pool_recycle=60 * 5,
            pool_pre_ping=True,
        )
        self.Session = sessionmaker(bind=self.engine, expire_on_commit=True)

    def get_session(self):
        """
        Method that returns a session.

        Returns:
            Session: SQLAlchemy session.
        """
        return self.Session()

    @staticmethod
    def close_session(session: Session):
        """
        Method that closes a session.

        Args:
            session (Session): SQLAlchemy session.
        """
        session.close()

    def dispose_engine(self):
        """
        Method that disposes the engine.
        """
        self.engine.dispose()
