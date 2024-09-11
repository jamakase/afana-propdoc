import os
import requests
from celery import shared_task, Task
from services.message_service import MessageService, SaveMessageOptions, Role

rag_url = os.environ.get('HOST')

class QuestionTask(Task):
    def before_start(self, task_id, args, kwargs):
        print('before_start called')
        super().before_start(task_id, args, kwargs)

    def after_return(self, status, retval, task_id, args, kwargs, einfo):
        print('after_return called')
        super().after_return(status, retval, task_id, args, kwargs, einfo)

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        print('on_failure called')
        super().on_failure(exc, task_id, args, kwargs, einfo)

    def on_success(self, retval, task_id, args, kwargs):
        print('on_success called')
        print(retval)

        message = MessageService.from_task_id(task_id).model

        MessageService.save_message(
            SaveMessageOptions(text=retval['output']['result'], task_id=task_id, conversation_id=message.conversation_id, role=Role.SYSTEM)
        )

        super().on_success(retval, task_id, args, kwargs)


class RagService:
    @staticmethod
    def create_task(question: str) -> str:
        return run_question_task.delay(question).id


@shared_task(base = QuestionTask,ignore_result=False)
def run_question_task(question: str):

    try:

        data = {
            "input":{
                "question": "Какие документы по строительству объектов есть в базе?",
                "context": "Контекст"
            }
        }
        response = requests.post(rag_url, json=data)
        response.raise_for_status()

        result = response.json()

        return result

    except requests.exceptions.RequestException as e:
        return {'error': str(e)}
