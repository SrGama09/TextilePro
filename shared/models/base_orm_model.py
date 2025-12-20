from sqlalchemy import Column, Integer, UUID
from sqlalchemy.ext.declarative import declarative_base

# Define the base model for SQLAlchemy
Base = declarative_base()


class TextileProBaseOrmModel(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True, autoincrement=True)
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False)
