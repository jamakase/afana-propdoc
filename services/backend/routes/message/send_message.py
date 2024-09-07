import traceback
from flasgger import swag_from
from flask import request, jsonify, Blueprint
from services.conversation_service import ConversationService
from schemas.send_message_schema import send_message_swagger


api = Blueprint('api', __name__)

@api.route('/message', methods=['POST'])
@swag_from(send_message_swagger)
def send_message():
    """
    Создает задачу с учетом контекста вопроса пользователя.
    Принимает conversation_id и message.
    Возвращает ID созданной задачи.
    """
    conversation_id = request.json.get('conversation_id')
    message = request.json.get('message')

    try:
        task_id = ConversationService.from_id(conversation_id).handle_message(message)

        return jsonify({"task_id": task_id}), 202

    except Exception as e:
        print(traceback.format_exc())

        return jsonify({"error": str(e)}), 400
