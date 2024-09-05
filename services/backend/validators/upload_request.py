from wtforms import Form, StringField, validators, IntegerField


class UploadForm(Form):
    conversation_id = IntegerField('conversation_id')
    question = StringField('question', [validators.Length(min=1)])
