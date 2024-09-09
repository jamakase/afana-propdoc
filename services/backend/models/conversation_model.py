from models import db
import uuid

class ConversationModel(db.Model):
    __tablename__ = 'conversations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50))

    def __repr__(self):
        return f"<Conversation(id={self.id}, user_id={self.user_id})>"
