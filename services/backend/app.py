from flask import Flask
from services.backend.config import Config
from services.backend.celery_init import celery_init_app
from services.backend.models import db
from services.backend.routes.message.send_message import send_message
from services.backend.routes.task.check_task_result import task_result
from services.backend.routes.conversation.create_conversation import  create_conversation


def create_app():
    app = Flask(__name__)


    with app.app_context():
        app.config.from_object(Config)

        db.init_app(app)

        app.config.from_mapping(
            CELERY=dict(
                broker_url="redis://localhost",
                result_backend="redis://localhost",
                task_ignore_result=True,
            ),
        )

        app.config.from_prefixed_env()
        celery = celery_init_app(app)

        db.create_all()

    app.add_url_rule('/message', view_func=send_message, methods=['POST'])
    app.add_url_rule('/task/<id>', view_func=task_result, methods=['GET'])
    app.add_url_rule('/conversation/create', view_func=create_conversation, methods=['POST'])

    return app, celery
