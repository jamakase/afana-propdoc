import traceback
from flask import jsonify, Blueprint
from services.message_service import MessageService
from flasgger import swag_from
from schemas.get_message_schema import get_message_swagger, CheckTaskResultSchema


api = Blueprint('api', __name__)

@api.route('/messages/<conversation_id>', methods=['GET'])
@swag_from(get_message_swagger)
def get_user_messages(conversation_id):
    """
    Получает список сообщений для заданной беседы.

    :param conversation_id:Идентификатор беседы
    :return:JSON-ответ со списком сообщений для указанной беседы или сообщение об ошибке.
    """
    try:
        result = MessageService.get_message(conversation_id)

        return jsonify(result)

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400

