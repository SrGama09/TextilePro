# Standard library imports
import os

# Related third party imports
from dotenv import load_dotenv
from apps.users.infrastructure.adapters.primary.framework.flask_app import create_app

# Load environment variables from .env file
load_dotenv()

# Create the Flask application with the environment specified in the FLASK_ENV variable
# If the FLASK_ENV variable is not set, the default environment is used
app = create_app(os.getenv('FLASK_ENV', 'default'))

if __name__ == "__main__":
    """
    Main entry point of the application when run directly.

    Starts the Flask development server at http://127.0.0.1:5000/.
    The server is only accessible from the local machine (localhost).
    """
    app.run()
