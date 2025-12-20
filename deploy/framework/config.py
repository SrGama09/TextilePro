import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """
    Base configuration class.
    Defines the common configuration used in all environments.
    """


class DevelopmentConfig(Config):
    """
    Development configuration class.
    Inherits from the base configuration and overrides the properties specific to the development environment.
    """
    DEBUG = True
    TESTING = True
    DATABASE_URI = os.getenv("DEV_DATABASE_URI", "sqlite:///dev_database.db")


class ProductionConfig(Config):
    """
    Production configuration class.
    Inherits from the base configuration and overrides the properties specific to the production environment.
    """
    DEBUG = False
    TESTING = False
    DATABASE_URI = os.getenv("PROD_DATABASE_URI", "sqlite:///database.db")


# Dictionary mapping the configuration name to the configuration class
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
