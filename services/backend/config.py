import os

database_url = os.environ.get('DATABASE_URL')
celery_broker_url = os.environ.get('CELERY_BROKER_URL')
celery_result_backend = os.environ.get('CELERY_RESULT_BACKEND')


class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', database_url)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', celery_broker_url)
    CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', celery_result_backend)
