from flask import Blueprint


api = Blueprint('api', __name__)

@api.route('conversation/create', methods=['POST'])
def create_conversation():
    pass