from marshmallow import Schema, fields


class ConversationSchema(Schema):
    user_id = fields.Str(dump_only=True)
    result = fields.Str(required=True)


get_conversation_swagger = {
    'tags': ['Get Conversation'],
    'description': 'Получить список бесед пользователя',
    'parameters': [],
    'responses': {
        200: {
            'description': 'Беседы получены',
            'content': {
                'application/json': {
                    'schema': {
                        'type': 'object',
                        'properties': {
                            'result': {
                                'type': 'array',
                                'items': {
                                    'type': 'object',
                                    'description': 'Список бесед пользователя',
                                    'properties': {
                                        'conversation_id': {'type': 'string'},
                                        'conversation_title': {'type': 'string'}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        404: {
            'description': 'Пользователь не найден'
        }
    }
}
