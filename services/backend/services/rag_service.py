import requests
from celery import shared_task, Task

from services.message_service import MessageService, SaveMessageOptions, Role

rag_url = 'http://127.0.0.1:5001/process'


class QuestionTask(Task):
    def on_success(self, retval, task_id, args, kwargs):
        print('on_success called')

        message = MessageService.from_task_id(task_id).model

        MessageService.save_message(
            SaveMessageOptions(text=retval['answer'], task_id=task_id, conversation_id=message.conversation_id, role=Role.SYSTEM)
        )

        super().on_success(retval, task_id, args, kwargs)


class RagService:
    @staticmethod
    def create_task(question: str) -> str:
        return run_question_task.delay(question).id


@shared_task(base = QuestionTask,ignore_result=False)
def run_question_task(question: str):
    try:
        data = {"question": question}
        response = requests.post(rag_url, json=data)
        response.raise_for_status()

        result = response.json()

        return result

    except requests.exceptions.RequestException as e:
        return {'error': str(e)}