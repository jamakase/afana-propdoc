import json
import os
import requests
from celery import shared_task, Task
from models.file_model import FileModel
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

        message = MessageService.from_task_id(task_id).model

        MessageService.save_message(
            SaveMessageOptions(text=retval['output']['result'], task_id=task_id, conversation_id=message.conversation_id, role=Role.SYSTEM)
        )

        super().on_success(retval, task_id, args, kwargs)

class QuestionTaskWithFile(Task):
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
        """
        Создает задачу для обработки вопроса.

        :param question: Вопрос для обработки.
        :return: Идентификатор созданной задачи.
        """

        return run_question_task.delay(question).id

    @staticmethod
    def create_file_question_task(file: FileModel, question: str) -> str:
        """
        Создает задачу для обработки вопроса с файлом.

        :param file: Объект FileModel.
        :param question: Вопрос для обработки.
        :return: Идентификатор созданной задачи.
        """

        return run_file_question_task.delay(file.id, file.file_path, question).id



@shared_task(base = QuestionTask,ignore_result=False)
def run_question_task(question: str):
    """
    Обрабатывает вопрос.

    :param question: Вопрос для обработки.
    :return: Результат обработки вопроса.
    """

    try:
        data = {
                "question": question,
        }
        response = requests.post(rag_url, json=data)
        response.raise_for_status()

        result = response.json()

        return result

    except requests.exceptions.RequestException as e:
        return {'error': str(e)}


@shared_task(base = QuestionTaskWithFile,ignore_result=False)
def run_file_question_task(file_id, file_path, question: str) -> dict:
    """
    Обрабатывает вопрос с загруженным файлом.

    :param file_id: Идентификатор файла.
    :param file_path: Путь к файлу.
    :param question: Вопрос для обработки.
    :return: Результат обработки вопроса.
    """
    pass

    # with open(file_path, 'rb') as file:
    #     files = {'file': file}
    #     data = {'text': question}
    #
    #     response = requests.post(rag_url, files=files, data=data)
    #     response.raise_for_status()
    #
    #     result = response.json()
    #     return result

