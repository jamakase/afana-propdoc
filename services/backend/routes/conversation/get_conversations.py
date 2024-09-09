import json
import traceback
from flasgger import swag_from
from flask import Blueprint, request, jsonify
from services.conversation_service import  ConversationService
from schemas.get_conversation_schema import get_conversation_swagger


api = Blueprint('api', __name__)

@api.route('/conversations/get', methods=['POST'])
@swag_from(get_conversation_swagger)
def get_conversation():
    try:
        print('AAAAAAAAA')
        user_id = request.cookies.get('user_id')
        result = ConversationService.get_conversations(user_id)

        return json.dumps({"data": result})

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400
