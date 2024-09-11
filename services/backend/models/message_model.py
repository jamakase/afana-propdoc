from models import db


class MessageModel(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)

    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    file_id = db.Column(db.Integer, db.ForeignKey('files.id'), nullable=True)
    task_id = db.Column(db.String, nullable=True)

    role = db.Column(db.Integer, nullable=False)  # 1 - 'system' или 2 - 'user'
    text = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f"<Message(id={self.id}, conversation_id={self.conversation_id}, file_id={self.file_id}, role={self.role}, text={self.text})>"
