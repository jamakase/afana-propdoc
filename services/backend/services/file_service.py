import os
from werkzeug.utils import secure_filename
from models import db
from models.file_model import FileModel

UPLOAD_FOLDER = 'uploads'

class FileService:

    @staticmethod
    def check_upload_folder(self):
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)


    @staticmethod
    def save_file(file):

        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        new_file_message = FileModel(
            file_path=filepath
        )

        db.session.add(new_file_message)
        db.session.commit()

        return new_file_message