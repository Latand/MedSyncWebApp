FROM python:3.11-slim as builder

RUN python3 -m venv /venv && /venv/bin/pip install -U pip wheel setuptools && mkdir /src && mkdir /src/src

COPY pyproject.toml /src/

RUN /venv/bin/pip install '/src[web]'

FROM python:3.11-slim

WORKDIR /src
COPY --from=builder /venv /venv
COPY src /src/src

CMD ["/venv/bin/uvicorn", "medsyncapp.webhook.app:app", "--host", "0.0.0.0", "--port", "8000"]