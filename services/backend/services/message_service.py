from collections import defaultdict
from dataclasses import dataclass
from enum import Enum
from typing import Optional
from models import db
from models.message_model import MessageModel


class Role(Enum):
    SYSTEM = 1
    USER = 2

@dataclass
class SaveMessageOptions:
    """
    Класс для хранения параметров сохранения сообщения.

    :param text: Текст сообщения.
    :param conversation_id: Идентификатор беседы.
    :param task_id: Идентификатор задачи.
    :param role: Роль отправителя сообщения.
    :param file_id: Идентификатор файла.
    """

    text: str
    conversation_id: int
    task_id: str
    role: Role = Role.SYSTEM
    file_id: Optional[int] = None


class MessageService:
    """
    Класс для работы с сообщениями.
    """

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
        """
        Сохраняет сообщение в базе данных.
        """

        new_message = MessageModel(
            text = options.text,
            conversation_id = options.conversation_id,
            task_id = options.task_id,
            role = options.role.value,
            file_id = options.file_id
        )

        db.session.add(new_message)
        db.session.commit()

        return new_message

    @staticmethod
    def delete_message(conversation_id):
        """
        Удаляет сообщения по идентификатору беседы.

        :param conversation_id: Идентификатор беседы.
        :return: Сообщение об успешном удалении или ошибке.
        """

        if not conversation_id:
            return 'Conversation ID not found', 400

        MessageModel.query.filter_by(conversation_id=conversation_id).delete()

        db.session.commit()
        return 'Messages deleted successfully', 200

    @staticmethod
    def get_message(conversation_id):
        """
        Получает все сообщения для заданного идентификатора беседы.

        :param conversation_id: Идентификатор беседы.
        :return: Словарь с сообщениями, сгруппированными по идентификатору беседы, код ответа.
        """

        messages = MessageModel.query.filter(MessageModel.conversation_id.in_([conversation_id])).all()

        if not messages:
            return {
                'messages': [
                    {conversation_id: [{'task_id': None, 'id': None, 'role': None, 'text': None}]}
                ]
            }, 200

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

        return result, 200


    @staticmethod
    def get_message_for_ml(conversation_id):
        """
        Получает только сообщения и роли отправителей для заданного идентификатора беседы.

        :param conversation_id: Идентификатор беседы.
        :return: Словарь с сообщениями, и ролями отправителей.
        """

        messages = MessageModel.query.filter(MessageModel.conversation_id.in_([conversation_id])).all()

        if not messages:
            return [
                {
                    "text": None,
                    "role": None
                }
            ]

        formatted_messages = [
            {
                "text": message.text,
                "role": message.role,
            }
            for message in messages
        ]

        return formatted_messages