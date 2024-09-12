from routes.message.send_message import api


def register_blueprints(app):
    """
    Регистрирует все Blueprints в приложении Flask.

    :param app: Экземпляр приложения Flask, к которому будут привязаны Blueprints.
    """
    app.register_blueprint(api)


