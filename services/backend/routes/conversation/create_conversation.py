import uuid
from functools import wraps

from flasgger import swag_from
from flask import jsonify, Blueprint, g, session, request, make_response
from services.conversation_service import  ConversationService
from schemas.create_conversation_schema import ConversationSchema, create_conversation_swagger

from utils.user_required import user_required

api = Blueprint('api', __name__)

conversation_schema = ConversationSchema()


@api.route('/conversation/create', methods=['POST'])
@swag_from(create_conversation_swagger)
@user_required
def create_conversation():
    """
    Создает новую беседу.
    Возвращает ID созданной беседы.
    """
    user_id = request.cookies.get('user_id')

    new_conversation = ConversationService.create_conversation(user_id)

    resp = make_response(jsonify({'conversation_id': new_conversation.id}), 201)

    return resp

