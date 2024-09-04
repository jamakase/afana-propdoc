from services.backend.models import db


class ConversationModel(db.Model):
    __tablename__ = 'conversations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        return f"<Conversation(id={self.id}, user_id={self.user_id})>"
