from models import db


class MessageModel(db.Model):
    """
    Модель для хранения данных о сообщениях.

    Таблица: messages

    Атрибуты:
    - id (int): Идентификатор сообщения (целое число, первичный ключ).
    - conversation_id (int): Идентификатор беседы, к которой относится сообщение (целое число, внешний ключ на таблицу conversations).
    - file_id (int): Идентификатор файла, связанного с сообщением (целое число, внешний ключ на таблицу files, может быть пустым).
    - task_id (str): Идентификатор задачи.
    - role (int): Роль отправителя сообщения (1 - 'system', 2 - 'user').
    - text (str): Текст сообщения.
    - created_at (datetime): Дата и время создания сообщения.
    - updated_at (datetime): Дата и время последнего обновления сообщения.
    """
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
        """
        :return:Строка, представляющая объект сообщения, включая его идентификатор,
        идентификатор беседы, идентификатор файла, роль отправителя и текст сообщения.
        """
        return f"<Message(id={self.id}, conversation_id={self.conversation_id}, file_id={self.file_id}, role={self.role}, text={self.text})>"
