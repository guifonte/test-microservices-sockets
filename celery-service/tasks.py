import os
import time
import redis
import json
from celery import Celery


CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379'),
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379')

celery = Celery('pyservice', broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)

r = redis.Redis(host='redis',port=6379, db=0)

@celery.task(name='pyservice.run')
def run(id) -> None:
    for i in range(0,10):
        r.publish('counter-update', json.dumps({"id": id,"progress": i}))
        time.sleep(1)
    r.publish('counter-update', json.dumps({"id": id,"progress": "COMPLETE"}))
    return None
    