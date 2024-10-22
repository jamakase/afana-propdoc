import traceback
from flask import Blueprint, jsonify
from services.conversation_service import ConversationService


api = Blueprint('api', __name__)

@api.route('/conversation/delete/<conversation_id>', methods=['DELETE'])
def delete_message(conversation_id):
    """
    Удаляет беседу по идентификатору беседы.

    :param conversation_id: Идентификатор беседы
    :return:JSON-ответ с сообщением об успешном удалении или ошибке
    """
    try:
        ConversationService.from_id(conversation_id).delete_conversation()
        return jsonify({'message': 'Conversation deleted successfully'}), 200

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400
