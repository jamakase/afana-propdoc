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






