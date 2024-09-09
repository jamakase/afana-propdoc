import json
import traceback
from flask import Blueprint, request, jsonify
from services.conversation_service import  ConversationService


api = Blueprint('api', __name__)

@api.route('/conversations/get', methods=['POST'])
def get_conversation():
    try:
        user_id = request.cookies.get('user_id')
        result = ConversationService.get_conversations(user_id)

        return json.dumps({"data": result})

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400
