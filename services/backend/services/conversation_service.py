import os
import uuid
from flask import jsonify
from models import db
from models.conversation_model import ConversationModel
from models.file_model import FileModel
from services.message_service import MessageService, SaveMessageOptions, Role
from services.rag_service import RagService

project_root = os.path.dirname(os.path.abspath(__file__))

class ConversationService:
    """
    Сервис для работы с беседами.

    Предоставляет методы для создания беседы, обработки сообщений и файлов,
    удаления беседы и получения всех бесед пользователя.
    """

    def __init__(self, model: ConversationModel = None):
        """
        Инициализирует ConversationService с данным объектом ConversationModel.

        :param model: Экземпляр ConversationModel, с которым будет работать сервис.
        """
        self.model = model

    @staticmethod
    def from_id(conversation_id: int):
        """
        Создает ConversationService на основе идентификатора беседы.

        :param conversation_id: Идентификатор беседы.
        :return: Экземпляр ConversationService.
        :raises Exception: Если беседа с указанным идентификатором не найдена.
        """
        conversation = ConversationModel.query.get(conversation_id)

        if not conversation:
            raise Exception('Conversation not found')

        return ConversationService(conversation)


    @staticmethod
    def create_conversation(user_id: uuid) -> ConversationModel:
        """
        Создает новую беседу.

        :param user_id: Идентификатор пользователя, создающего беседу.
        :return: Созданный экземпляр ConversationModel.
        """

        new_conversation = ConversationModel(user_id = user_id)

        db.session.add(new_conversation)
        db.session.commit()

        return new_conversation

    def handle_message(self, text: str) -> str:
        """
        Обрабатывает сообщение и сохраняет его в базе данных.

        Создает задачу для обработки сообщения и сохраняет сообщение с этой задачей.

        :param text: Текст сообщения.
        :return: Идентификатор задачи, созданной для обработки сообщения.
        """

        task_id = RagService.create_task(text)

        MessageService.save_message(
            SaveMessageOptions(text = text, task_id = task_id, conversation_id = self.model.id, role = Role.USER)
        )

        return task_id

    def handle_file(self, file: FileModel, text: str) -> str:
        """
        Обрабатывает файл и сохраняет сообщение с файлом в базе данных.

        Создает задачу для обработки файла и сообщения и сохраняет сообщение с этой задачей и файлом.

        :param file: Экземпляр FileModel, представляющий загруженный файл.
        :param text: Текст сообщения.
        :return: Идентификатор задачи, созданной для обработки файла и сообщения.
        """

        task_id = RagService.create_file_question_task(file, text)

        MessageService.save_message(
            SaveMessageOptions(text=text, task_id=task_id, conversation_id=self.model.id,
                               role=Role.USER, file_id=file.id)
        )

        return task_id

    def delete_conversation(self):
        """
        Удаляет беседу и связанные с ней сообщения.
        """

        delete_result, code = MessageService.delete_message(self.model.id)

        if code != 200:
            return delete_result

        db.session.delete(self.model)
        db.session.commit()

    @staticmethod
    def get_conversations(user_id):
        """
        Получает список идентификаторов бесед для указанного пользователя.

        :param user_id: Идентификатор пользователя.
        :return: Список идентификаторов бесед или сообщение об ошибке, если беседы не найдены.
        """
        conversations = ConversationModel.query.filter_by(user_id=user_id).all()
        print(conversations)
        if not conversations:
            return jsonify({'error': 'No conversations found for this user'}), 404

        conversation_ids = [conversation.id for conversation in conversations]

        return conversation_ids