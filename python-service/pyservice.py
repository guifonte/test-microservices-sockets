import os
import sys
import time
import json
import redis
import json
from flask import Flask, request
from celery import Celery
from flask_celery import make_celery


app = Flask(__name__)

app.config.update(
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379'),
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379') 
)

celery = make_celery(app)
r = redis.Redis(host='redis',port=6379, db=0)

@app.route("/", methods=['GET', 'POST'])
def basic():
    if request.method =='POST':
        return iseeyou(request.json['id'])
    else:
        return hello()

def hello():
    print("hello", file=sys.stdout)
    sys.stdout.flush()
    return "Hello World from Flask!"

def iseeyou(id):
    print("iseeyou " + id, file=sys.stdout)
    sys.stdout.flush()
    r.publish('counter-update', json.dumps({"id": id,"progress": "STARTING"}))
    celery.send_task('pyservice.run', args=[id], kwargs={})
    
    return json.dumps({"id": id,"message": "Flask sees you: "})


if __name__ == "__main__":
    app.run()

