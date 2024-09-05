from flask import  jsonify, Blueprint
from services.backend.services.conversation_service import  ConversationService

api = Blueprint('api', __name__)

@api.route('/conversation/create', methods=['POST'])
def create_conversation():
    new_conversation = ConversationService.create_conversation()

    return jsonify({'conversation_id': new_conversation.id}), 201