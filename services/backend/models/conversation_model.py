from models import db

class ConversationModel(db.Model):
    """
    Модель для хранения данных о беседах (разговорах).

    Таблица: conversations

    Атрибуты:
    - id (int): Идентификатор беседы (целое число, первичный ключ).
    - user_id (str): Идентификатор пользователя, связанный с беседой (строка до 50 символов).
    """
    __tablename__ = 'conversations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50))

    def __repr__(self):
        """
        :return: Строка, представляющая объект беседы, включая её идентификатор и идентификатор пользователя.
        """
        return f"<Conversation(id={self.id}, user_id={self.user_id})>"
