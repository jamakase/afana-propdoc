from schemas.task_result_schema import CheckTaskResultSchema, check_task_result_swagger
from celery.result import AsyncResult
from flasgger import swag_from
from routes import api


@api.route("/task/<id>", methods=['GET'])
@swag_from(check_task_result_swagger)
def task_result(id):
    """
    Принимает ID задачи.
    Возвращает результат задачи.
    """
    result = AsyncResult(id)

    return {
        "ready": result.ready(),
        "successful": result.successful(),
        "value": result.result if result.ready() else None,
    }
