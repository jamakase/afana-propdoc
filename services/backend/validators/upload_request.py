from django.db.models import IntegerField
from wtforms import Form, TextAreaField, StringField, validators


class UploadForm(Form):
    conversation_id = IntegerField('conversation_id')
    question = StringField('question', [validators.Length(min=1)])
