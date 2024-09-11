from models import db

class FileModel(db.Model):
    __tablename__ = 'files'

    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String, nullable=False)  # Путь к файлу

    def __repr__(self):
        return f"<FileMessage(id={self.id}, filepath={self.filepath})>"
