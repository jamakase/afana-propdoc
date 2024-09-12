from models import db

class FileModel(db.Model):
    """
    Модель для хранения данных о файлах.

    Таблица: files

    Атрибуты:
    - id (int): Идентификатор файла (целое число, первичный ключ).
    - file_path (str): Путь к файлу.
    """
    __tablename__ = 'files'

    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String, nullable=False)  # Путь к файлу

    def __repr__(self):
        """
        :return:Строка, представляющая объект файла, включая его идентификатор и путь к файлу.
        """
        return f"<FileMessage(id={self.id}, filepath={self.filepath})>"
