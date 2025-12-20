# Standard library imports
from flasgger import swag_from
from flask import Blueprint, jsonify, request, current_app, make_response

# Local application/library specific imports
from refactor.apps.masConsigliere.infrastructure.primary_adapters.flask.validator.ipex.ipex_customer_config_validator \
    import InsertIpexCustomerConfigValidator, GetIpexCustomerConfigValidator, UpdateIpexCustomerConfigValidator

from refactor.apps.masConsigliere.application.commands.ipex.insert_ipex_customer_config_command import \
    InsertIpexCustomerConfigCommand
from refactor.apps.masConsigliere.application.commands.ipex.update_ipex_customer_config_command import \
    UpdateIpexCustomerConfigCommand
from refactor.apps.masConsigliere.application.queries.ipex.fetch_ipex_customer_config_query import \
    FetchIpexCustomerconfigQuery
from refactor.apps.shared.decorators.handle_exceptions import handle_exceptions


# Create a new Blueprint for the registration process manager service
mas_consigliere_ipex_customer_config_blueprint = Blueprint('mas_consigliere_ipex_customer_config', __name__)
ORIGIN = 'mas_consigliere_ipex_customer_config_urls'


@mas_consigliere_ipex_customer_config_blueprint.route('/ipex/customer/config/insert', methods=['POST'])
@handle_exceptions
@swag_from('../templates/swagger/ipex/insert_ipex_customer_config.yml')
def post_ipex_customer_config():
    """
    Insert a new ipex customer config.
    """
    validated_model = InsertIpexCustomerConfigValidator(**request.json)
    inserted_ipex_customer_config = current_app.config['command_bus'].execute(
        InsertIpexCustomerConfigCommand(**validated_model.model_dump())
    )

    return make_response(jsonify(
        {"message": f"Ipex customer config with id [{inserted_ipex_customer_config.id}] inserted"}), 201)


@mas_consigliere_ipex_customer_config_blueprint.route('/ipex/customer/config', methods=['GET'])
@handle_exceptions
@swag_from('../templates/swagger/ipex/get_ipex_customer_config.yml')
def get_ipex_customer_config():
    """
    Get the ipex customer config.
    """
    validated_model = GetIpexCustomerConfigValidator(**request.args.to_dict())
    ipex_customer_config = current_app.config['query_bus'].ask(
        FetchIpexCustomerconfigQuery(**validated_model.model_dump())
    )
    if ipex_customer_config:
        return make_response(jsonify({"IpexCustomerConfig": ipex_customer_config.to_clean_dict()}), 200)
    return make_response(jsonify({"message": "Ipex customer config not found"}), 404)


@mas_consigliere_ipex_customer_config_blueprint.route('/ipex/customer/config/update', methods=['PUT'])
@handle_exceptions
@swag_from('../templates/swagger/ipex/update_ipex_customer_config.yml')
def put_ipex_customer_config():
    """
    Update the ipex customer config.
    """
    validated_model = UpdateIpexCustomerConfigValidator(**request.json)
    command = UpdateIpexCustomerConfigCommand(**validated_model.model_dump())
    current_app.config['command_bus'].execute(command)

    return make_response(jsonify({"result": 'OK'}), 200)

