import os
from flask import Flask
from celery import Celery
from flask_socketio import SocketIO
from flask_celery import make_celery

app = Flask(__name__)

app.config.update(
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379'),
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379') 
)

celery = make_celery(app)

socketio = SocketIO(app, message_queue='redis://redis:6379/0')

@app.route("/")
def hello():
    print("hello")
    return "Hello World from Flask!"


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)

