from os import getenv
from ably import AblyRest
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ably = AblyRest(getenv("ABLY_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_methods = ["POST"],
    allow_origins = ["https://playontable.com", "https://62fd9b30-5372-459d-a305-d178d979c6e7-00-3c0ndf7ynjmid.spock.replit.dev", "http://localhost:5000"]
)

@app.post("/api/auth")
async def auth():
    response = await ably.auth.request_token()
    return response.to_dict()