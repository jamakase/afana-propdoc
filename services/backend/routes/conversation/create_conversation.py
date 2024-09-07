from flasgger import swag_from
from flask import jsonify, Blueprint
from services.conversation_service import  ConversationService
from schemas.conversation_schema import ConversationSchema, create_conversation_swagger


api = Blueprint('api', __name__)

conversation_schema = ConversationSchema()

@api.route('/conversation/create', methods=['POST'])
@swag_from(create_conversation_swagger)
def create_conversation():
    """
    Создает новую беседу.
    Возвращает ID созданной беседы.
    """
    new_conversation = ConversationService.create_conversation()
    return jsonify({'conversation_id': new_conversation.id}), 201
