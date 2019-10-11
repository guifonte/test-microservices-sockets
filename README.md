# Docker Nodejs Flask Celery Redis

This repository contain an example code which shows the integration between a [Nodejs](https://nodejs.org/en/), [Socket.io](https://socket.io), [Flask](https://palletsprojects.com/p/flask/) with [Gunicorn](https://gunicorn.org/), [Celery](http://www.celeryproject.org/) with [Flower](https://flower.readthedocs.io/en/latest/) and [Redis Pub/Sub](https://redis.io/topics/pubsub) within microservices architecture using [Docker Compose](https://docs.docker.com/compose/). The application uses the basic Socket.io example of a chat app, but uses a Nodejs server to orchestrate http requests to the Flask server, that calls Celery workers to do time-consuming process. The Celery workers uses Redis Pub/Sub to send feedback to the Nodejs server, that redirects the messages to the right user socket. Flower is also utilized as a monitoring tool for the celery workers. Everything runs in separated containers, that allows easy scaling.

### Installation

```bash
git clone http://github.com/guifonte/test-microservices-sockets
```

### Build & Launch

```bash
docker-compose up -d --build
```

This will expose the Nodejs application's endpoints on port `4000` as well as a [Flower](https://github.com/mher/flower) server for monitoring workers on port `5555`

To add more workers:

```bash
docker-compose up -d --scale celery=5 --no-recreate
```

To shut down:

```bash
docker-compose down
```

---

adapted from [https://github.com/mattkohl/docker-flask-celery-redis](https://github.com/mattkohl/docker-flask-celery-redis)
