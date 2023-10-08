FROM python:3.8-slim as builder

RUN python3 -m venv /venv && /venv/bin/pip install -U pip wheel setuptools && mkdir /src

COPY pyproject.toml /src/
COPY src /src/src

RUN /venv/bin/pip install '/src[bot]'

FROM python:3.8-slim

WORKDIR /src
COPY --from=builder /venv /venv

CMD  ["/venv/bin/python", "-m", "medsyncapp.tgbot.bot"]
