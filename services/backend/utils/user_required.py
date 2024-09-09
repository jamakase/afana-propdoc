import os
import uuid
from flask import make_response, request


access_control_allow_origin = os.environ.get('ACCESS_CONTROL_ALLOW_ORIGIN')

def user_required(f):
    def decorated_function(*args, **kws):
        response = f(*args, **kws)
        response = make_response(response)
        if not request.cookies.get('user_id'):
            response.set_cookie('user_id', value=str(uuid.uuid4()), max_age=60 * 60 * 24 * 365 * 2, httponly = True)
        response.headers.add('Access-Control-Allow-Origin', access_control_allow_origin)
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    return decorated_function