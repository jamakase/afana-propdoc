from services.backend.models import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class ConversationModel(db.Model):
    __tablename__ = 'conversations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=True)

    def __repr__(self):
        return f"<Conversation(id={self.id}, user_id={self.user_id})>"
