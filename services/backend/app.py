import os
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
from routes.conversation.delete_conversation import delete_message
from routes.conversation.get_conversations import get_conversation

broker_url = os.environ.get('BROKER_URL')
result_backend = os.environ.get('RESULT_BACKEND')
rag_url = os.environ.get('HOST')


def create_app():
    app = Flask(__name__)

    swagger = Swagger(app)

    CORS(app, supports_credentials=True)

    with app.app_context():
        app.config.from_object(Config)

        db.init_app(app)

        app.config.from_mapping(
            CELERY=dict(
                broker_url=broker_url,
                result_backend=result_backend,
                task_ignore_result=True,
            ),
        )

        app.config.from_prefixed_env()
        celery = celery_init_app(app)

        db.create_all()

    app.secret_key = os.environ.get('APP_SECRET_KEY')

    app.add_url_rule('/message', view_func=send_message, methods=['POST'])
    app.add_url_rule('/conversation/create', view_func=create_conversation, methods=['POST'])
    app.add_url_rule('/conversations/get', view_func=get_conversation, methods=['POST'])
    app.add_url_rule('/task/<id>', view_func=task_result, methods=['GET'])
    app.add_url_rule('/messages/<conversation_id>', view_func=get_user_messages, methods=['GET'])
    app.add_url_rule('/conversation/delete/<conversation_id>', view_func=delete_message, methods=['DELETE'])

    return app, celery
