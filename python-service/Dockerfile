FROM python:latest

WORKDIR /app

COPY . /app

RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 80

CMD ["gunicorn", "-b", "0.0.0.0:5000", "wsgi:app"]
