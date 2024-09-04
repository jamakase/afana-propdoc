from services.backend.routes.message.send_message import api


def register_blueprints(app):
    app.register_blueprint(api)


