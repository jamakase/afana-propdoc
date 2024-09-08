from marshmallow import Schema, fields


class MessageSchema(Schema):
    task_id = fields.Str(required=True)
    id = fields.Int(required=True)
    role = fields.Str(required=True)
    text = fields.Str(required=True)


messages_swagger = {
    'tags': ['Messages'],
    'description': 'Получить все беседы для указанного пользователя, включая сообщения бесед',
    'parameters': [
        {
            'name': 'user_id',
            'type': 'string',
            'required': True,
            'description': 'ID пользователя для получения сообщений'
        }
    ],
    'responses': {
        '200': {
            'description': 'Список сообщений, сгруппированных по conversation_id',
            'schema': {
                'type': 'object',
                'properties': {
                    'messages': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'conversation_id': {
                                    'type': 'integer',
                                    'description': 'ID беседы'
                                },
                                'messages': {
                                    'type': 'array',
                                    'items': {
                                        'type': 'object',
                                        'properties': {
                                            'task_id': {
                                                'type': 'string',
                                                'description': 'ID задачи'
                                            },
                                            'id': {
                                                'type': 'integer',
                                                'description': 'ID сообщения'
                                            },
                                            'role': {
                                                'type': 'string',
                                                'description': 'Роль отправителя сообщения (1 - "system", 2 - "user")'
                                            },
                                            'text': {
                                                'type': 'string',
                                                'description': 'Текст сообщения'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '404': {
            'description': 'Не найдены беседы или сообщения для указанного пользователя'
        }
    }
}