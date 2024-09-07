from marshmallow import Schema, fields


class SendMessageSchema(Schema):
    conversation_id = fields.Int(required=True, description="ID беседы, в которую отправляется сообщение")
    message = fields.Str(required=True, description="Текст сообщения")


send_message_swagger = {
    'tags': ['Message'],
    'description': 'Создает задачу с учетом контекста вопроса пользователя.',
    'requestBody': {
        'required': True,
        'content': {
            'application/json': {
                'schema': {
                    'type': 'object',
                    'properties': {
                        'conversation_id': {
                            'type': 'integer',
                            'description': 'ID беседы, в которую отправляется сообщение'
                        },
                        'message': {
                            'type': 'string',
                            'description': 'Текст сообщения'
                        }
                    },
                    'required': ['conversation_id', 'message']
                }
            }
        }
    },
    'responses': {
        202: {
            'description': 'Задача создана',
            'content': {
                'application/json': {
                    'schema': {
                        'type': 'object',
                        'properties': {
                            'task_id': {
                                'type': 'string',
                                'description': 'ID задачи обработки сообщения'
                            }
                        }
                    }
                }
            }
        },
        400: {
            'description': 'Ошибка в запросе',
            'content': {
                'application/json': {
                    'schema': {
                        'type': 'object',
                        'properties': {
                            'error': {
                                'type': 'string',
                                'description': 'Описание ошибки'
                            }
                        }
                    }
                }
            }
        }
    }
}