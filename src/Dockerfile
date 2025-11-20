FROM node:24 AS frontend

WORKDIR /app

COPY ./frontend ./frontend

RUN npx sass ./frontend/static/style/index.sass:frontend/static/style/index.min.css --style=compressed --no-source-map

FROM astral/uv:python3.14-trixie

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY ./backend/requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

COPY ./backend .

COPY --from=frontend /app/frontend ./frontend

EXPOSE 8080

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]