FROM python:3.11-slim

WORKDIR /usr/src/app/medsync_bot

COPY requirements.txt /usr/src/app/medsync_bot
RUN pip install -r /usr/src/app/medsync_bot/requirements.txt
COPY . /usr/src/app/medsync_bot
