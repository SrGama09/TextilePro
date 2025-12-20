# Standard library imports
import os
import yaml
from flask import Flask, jsonify
from flasgger import Swagger
from prometheus_flask_exporter import PrometheusMetrics

from apps.users.infrastructure.adapters.primary.bus.bus_config import BusConfig
from apps.users.infrastructure.adapters.primary.framework.routes import register_blueprints
from deploy.framework.config import config
from shared.constants import USERS_SERVICE
from shared.logger import LoggerService


def create_app(config_name='default'):
    """
    Create a Flask application using the given configuration.

    This function initializes a Flask application with the specified configuration.
    It sets up the command and query bus, registers blueprints, and defines error handlers.

    Args:
        config_name (str, optional): The name of the configuration to use. Defaults to 'default'.

    Returns:
        Flask: The initialized Flask application.
    """
    origin = "users_flask_app"
    user = USERS_SERVICE
    app = Flask(__name__)

    metrics: PrometheusMetrics = PrometheusMetrics(app)
    metrics.info('users_metrics',
                 'Metrics for the Users service', version='0.0.1')

    app.config.from_object(config[config_name])

    swagger_config_path = os.path.join(os.path.dirname(__file__), 'templates/swagger/swagger_config.yml')
    components_config_path = os.path.join(os.path.dirname(__file__), 'templates/swagger/components.yml')
    try:
        with open(swagger_config_path, 'r') as file:
            swagger_template = yaml.safe_load(file)
    except FileNotFoundError as e:
        LoggerService.insert_error(origin, f'File {swagger_config_path} not found: {str(e)}', user)

    try:
        with open(components_config_path, 'r') as file:
            components = yaml.safe_load(file)
            swagger_template['components'] = components['components']
    except FileNotFoundError as e:
        LoggerService.insert_error(origin, f'File {components_config_path} not found: {str(e)}', user)

    bus_config = BusConfig()
    app.config['command_bus'] = bus_config.get_command_bus()
    app.config['query_bus'] = bus_config.get_query_bus()
    app.config['event_bus'] = bus_config.get_event_bus()

    register_blueprints(app)
    Swagger(app, template=swagger_template)

    @app.route("/")
    def helloworld():
        return "Welcome to the Users service API!"

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found', 'message': error.description}), 404

    @app.errorhandler(400)
    def bad_request(error):
        error_messages = error.description.split('\n')
        return jsonify({'error': 'Bad request', 'messages': error_messages}), 400

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({'error': 'Internal server error', 'message': error.description}), 500

    return app


# Run the application in port 5000
if __name__ == '__main__':
    application = create_app()
    application.run(host='0.0.0.0', port=5000, debug=application.config['DEBUG'])
