from flask import Flask


def register_blueprints(app: Flask):
    """
    Register Flask blueprints for the application.

    Args:
        app (Flask): The Flask application instance.

    """
    app.register_blueprint(mas_consigliere_service_blueprint)
    app.register_blueprint(mas_consigliere_company_users_blueprint)
    app.register_blueprint(mas_consigliere_customer_info_blueprint)
    app.register_blueprint(mas_consigliere_customer_lead_filters_blueprint)
    app.register_blueprint(mas_consigliere_company_strategic_data_blueprint)
    app.register_blueprint(mas_consigliere_ipex_customer_config_blueprint)
    app.register_blueprint(mas_consigliere_dashboard_blueprint)
