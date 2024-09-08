from flask import jsonify
from models import db
from models.conversation_model import ConversationModel
from services.message_service import MessageService, SaveMessageOptions, Role
from services.rag_service import RagService


class ConversationService:

    def __init__(self, model: ConversationModel = None):
        self.model = model

    @staticmethod
    def from_id(conversation_id: int):
        conversation = ConversationModel.query.get(conversation_id)

        if not conversation:
            raise Exception('Conversation not found')

        return ConversationService(conversation)


    @staticmethod
    def create_conversation() -> ConversationModel:
        new_conversation = ConversationModel()

        db.session.add(new_conversation)
        db.session.commit()

        return new_conversation

    def handle_message(self, text: str) -> str:
        task_id = RagService.create_task(text)

        MessageService.save_message(
            SaveMessageOptions(text = text, task_id = task_id, conversation_id = self.model.id, role = Role.USER)
        )

        return task_id

    def delete_conversation(self):

        delete_result, code = MessageService.delete_message(self.model.id)

        if code != 200:
            return delete_result

        db.session.delete(self.model)
        db.session.commit()

    @staticmethod
    def get_conversations(user_id):
        conversations = ConversationModel.query.filter_by(user_id=user_id).all()
        if not conversations:
            return jsonify({'error': 'No conversations found for this user'}), 404

        conversation_ids = [conv.id for conv in conversations]
        messages = MessageService.get_message(conversation_ids)
        return messages
