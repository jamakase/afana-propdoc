from marshmallow import Schema, fields


class CheckTaskResultSchema(Schema):
    ready = fields.Bool(required=True, description="Флаг, указывающий, готова ли задача")
    successful = fields.Bool(required=True, description="Флаг, указывающий, была ли задача успешной")
    value = fields.Str(allow_none=True, description="Результат задачи, если она готова")


check_task_result_swagger = {
    'tags': ['Task'],
    'description': 'Получить результат задачи по её ID.',
    'parameters': [
        {
            'name': 'id',
            'required': True,
            'description': 'ID задачи, для которой нужно получить результат',
            'schema': {
                'type': 'string'
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Результат задачи',
            'content': {
                'application/json': {
                    'schema': {
                        'type': 'object',
                        'properties': {
                            'ready': {
                                'type': 'boolean',
                                'description': 'Флаг, указывающий, готова ли задача'
                            },
                            'successful': {
                                'type': 'boolean',
                                'description': 'Флаг, указывающий, была ли задача успешной'
                            },
                            'value': {
                                'type': 'string',
                                'description': 'Результат задачи, если она готова'
                            }
                        }
                    }
                }
            }
        },
        404: {
            'description': 'Задача не найдена',
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