from marshmallow import Schema, fields


class CheckTaskResultSchema(Schema):
    task_id = fields.Str(allow_none=True, description="ID задачи")
    id = fields.Int(allow_none=True, description="ID сообщения в таблице messages")
    role = fields.Str(allow_none=True, description="Роль отправителя сообщения (1 - система, 2 - пользователь)")
    text = fields.Str(allow_none=True, description="Текст сообщения")


get_message_swagger = {
    'tags': ['Message'],
    'description': 'Получить сообщения беседы по ID беседы',
    'parameters': [
        {
            'name': 'conversation_id',
            'in': 'path',
            'required': True,
            'description': 'ID беседы, для которой нужно получить сообщения',
            'schema': {
                'type': 'integer'
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Сообщения в беседе',
            'content': {
                'application/json': {
                    'schema': {
                        'type': 'object',
                        'properties': {
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
                                            'description': 'ID сообщения в таблице messages'
                                        },
                                        'role': {
                                            'type': 'string',
                                            'description': 'Роль отправителя сообщения (1 - система, 2 - пользователь)'
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
        },
        404: {
            'description': 'ID беседы не найдено',
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
