from dataclasses import dataclass
from enum import Enum

from services.backend.models import db
from services.backend.models.message_model import MessageModel

class Role(Enum):
    SYSTEM = 1
    USER = 2

@dataclass
class SaveMessageOptions:
    text: str
    conversation_id: int
    task_id: str
    role: Role = Role.SYSTEM


class MessageService:

    def __init__(self, model: MessageModel = None):
        self.model = model

    @staticmethod
    def set_model(model):
        return MessageService(model)

    @staticmethod
    def from_task_id(task_id):
        message = MessageModel.query.filter_by(task_id=task_id).first()

        return MessageService(message)

    @staticmethod
    def save_message(options: SaveMessageOptions) -> MessageModel:
        new_message = MessageModel(
            text = options.text,
            conversation_id = options.conversation_id,
            task_id = options.task_id,
            role = options.role.value
        )

        db.session.add(new_message)
        db.session.commit()

        return new_message
