from flasgger import Swagger
from flask import Flask
from flask_cors import CORS
from config import Config
from celery_init import celery_init_app
from models import db
from routes.message.send_message import send_message
from routes.task.check_task_result import task_result
from routes.conversation.create_conversation import  create_conversation
from routes.message.get_message import get_user_messages
from routes.message.delete_message import delete_message


def create_app():
    app = Flask(__name__)

    swagger = Swagger(app)

    CORS(app)

    with app.app_context():
        app.config.from_object(Config)

        db.init_app(app)

        app.config.from_mapping(
            CELERY=dict(
                broker_url="redis://redis",
                result_backend="redis://redis",
                task_ignore_result=True,
            ),
        )

        app.config.from_prefixed_env()
        celery = celery_init_app(app)

        db.create_all()

    app.add_url_rule('/message', view_func=send_message, methods=['POST'])
    app.add_url_rule('/conversation/create', view_func=create_conversation, methods=['POST'])
    app.add_url_rule('/task/<id>', view_func=task_result, methods=['GET'])
    app.add_url_rule('/messages/<user_id>', view_func=get_user_messages, methods=['GET'])
    app.add_url_rule('/delete/<conversation_id>', view_func=delete_message, methods=['DELETE'])

    return app, celery
