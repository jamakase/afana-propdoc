from marshmallow import Schema, fields


class ConversationSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)


create_conversation_swagger = {
    'tags': ['Conversation'],
    'description': 'Создать новую беседу. Не требует ввода данных.',
    'parameters': [],
    'responses': {
        201: {
            'description': 'Беседа успешно создана',
            'schema': {
                'type': 'object',
                'properties': {
                    'conversation_id': {
                        'type': 'integer',
                        'description': 'ID созданной беседы'
                    }
                }
            }
        }
    }
}
