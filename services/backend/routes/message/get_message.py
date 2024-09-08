from flask import jsonify, Blueprint
from flasgger import swag_from
from schemas.get_message_schema import messages_swagger
from services.conversation_service import ConversationService


api = Blueprint('api', __name__)

@api.route('/messages/<user_id>', methods=['GET'])
@swag_from(messages_swagger)
def get_user_messages(user_id):
    try:
        messages = ConversationService.get_conversations(user_id)
        return messages

    except Exception as e:
        return jsonify({'error': str(e)}), 500
