from collections import defaultdict
from dataclasses import dataclass
from enum import Enum

from flask import jsonify
from models import db
from models.message_model import MessageModel


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

    @staticmethod
    def delete_message(conversation_id):
        if not conversation_id:
            return 'Conversation ID not found', 400


        num_deleted = MessageModel.query.filter_by(conversation_id=conversation_id).delete()

        if num_deleted == 0:
            return 'No messages found for this conversation', 404

        db.session.commit()
        return 'Messages deleted successfully', 200

    @staticmethod
    def get_message(conversation_ids):
        messages = MessageModel.query.filter(MessageModel.conversation_id.in_(conversation_ids)).all()
        if not messages:
            return jsonify({'error': 'No messages found for these conversations'}), 404

        grouped_messages = defaultdict(list)
        for message in messages:
            grouped_messages[message.conversation_id].append({
                'task_id': message.task_id,
                'id': message.id,
                'role': message.role,
                'text': message.text
            })

        result = {
            'messages': [
                {conv_id: msgs}
                for conv_id, msgs in grouped_messages.items()
            ]
        }

        return jsonify(result), 200
