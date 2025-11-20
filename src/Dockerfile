FROM node:20 AS css-builder

WORKDIR /app

COPY ./frontend/static/style ./static/style

RUN npx sass static/style/index.sass:static/style/index.min.css --style=compressed --no-source-map

FROM python:3.14-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY --from=css-builder /app/static/styles/index.min.css ./static/styles/index.min.css

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]