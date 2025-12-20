from abc import ABC, abstractmethod
from typing import Optional, TypeVar
from sqlalchemy.orm import Session

from shared.models import TPBaseModel, TPGetBaseModel, TPInsertBaseModel, TPUpdateBaseModel

TPBaseModelType = TypeVar("TPBaseModelType", bound=TPBaseModel)


class UsersDBInterface(ABC):
    """
    DBInterface is an interface that defines the method to connect to a database
    """

    @abstractmethod
    def get_by_filter(self, session: Session, filters: TPGetBaseModel, trace_id: str = None
                      ) -> Optional[list[TPBaseModelType]]:
        """
        get_by_filter is a method that gets data by filter

        Args:
            session (Session): SQLAlchemy session
            filters (TPGetBaseModel): Filters to get data
            trace_id (Optional[str]): The id of the trace

        Returns:
            Optional[list[TPBaseModelType]]: List of TPBaseModelType
        """
        pass

    @abstractmethod
    def get_one_by_filter(self, session: Session, filters: TPGetBaseModel, trace_id: str = None
                          ) -> Optional[TPBaseModelType]:
        """
        get_one_by_filter is a method that gets one data by filter

        Args:
            session (Session): SQLAlchemy session
            filters (TPGetBaseModel): Filters to get data
            trace_id (Optional[str]): The id of the trace

        Returns:
            Optional[TPBaseModelType]: Data of the database
        """
        pass

    @abstractmethod
    def get_by_email(self, session: Session, email: str, trace_id: str = None) -> Optional[TPBaseModelType]:
        """
        get_by_email is a method that gets data by email

        Args:
            session (Session): SQLAlchemy session
            email (str): Email to get data
            trace_id (Optional[str]): The id of the trace

        Returns:
            Optional[TPBaseModelType]: Data of the database
        """
        pass

    @abstractmethod
    def insert(self, session: Session, params: TPInsertBaseModel, trace_id: str = None) -> TPBaseModelType:
        """
        insert is a method that inserts data in the database

        Args:
            session (Session): SQLAlchemy session
            params (TPInsertBaseModel): Data to insert in the database
            trace_id (Optional[str]): The id of the trace

        Returns:
            TPBaseModelType: Data inserted in the database
        """
        pass

    @abstractmethod
    def update(self, session: Session, params: TPUpdateBaseModel, trace_id: str = None) -> TPBaseModelType:
        """
        update is a method that updates a phone in the database

        Args:
            session (Session): SQLAlchemy session
            params (TPUpdateBaseModel): Data to update in the database
            trace_id (Optional[str]): The id of the trace

        Returns:
            TPBaseModelType: Data updated in the database
        """
        pass
