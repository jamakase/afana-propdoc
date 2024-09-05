import traceback

from flask import request, jsonify, Blueprint
from services.backend.services.conversation_service import ConversationService

api = Blueprint('api', __name__)


@api.route('/message', methods=['POST'])
def send_message():
    conversation_id = request.json.get('conversation_id')
    message = request.json.get('message')

    try:
        task_id = ConversationService.from_id(conversation_id).handle_message(message)

        return jsonify({"task_id": task_id}), 202

    except Exception as e:
        print(traceback.format_exc())

        return jsonify({"error": str(e)}), 400


