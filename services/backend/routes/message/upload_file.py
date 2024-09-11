import traceback
from flask import request, jsonify, Blueprint
from services.conversation_service import ConversationService

from services.file_service import FileService

api = Blueprint('api', __name__)


@api.route('/message/upload', methods=['POST'])
def send_message_with_file():
    """
    Создает задачу с учетом контекста вопроса пользователя к отправленному файлу.
    Принимает conversation_id, message и файл.
    Возвращает ID созданной задачи.
    """

    conversation_id = request.form.get('conversation_id')
    message = request.form.get('message')
    file = request.files.get('file')

    if not conversation_id or not message or not file:
        return jsonify({"error": "Missing required fields"}), 400


    file = FileService.save_file(file)

    try:
        task_id = ConversationService.from_id(int(conversation_id)).handle_file(file, message)
        return jsonify({"task_id": task_id}), 202

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400
