from celery.result import AsyncResult
from services.backend.routes import api



@api.route("/task/<id>", methods=['GET'])
def task_result(id):
    result = AsyncResult(id)

    return {
        "ready": result.ready(),
        "successful": result.successful(),
        "value": result.result if result.ready() else None,
    }

