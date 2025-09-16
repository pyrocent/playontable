from os import getenv
from ably import AblyRest
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ably = AblyRest(getenv("ABLY_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_headers = ["*"],
    allow_credentials = True,
    allow_methods = ["POST", "OPTIONS"],
    allow_origins = ["https://playontable.com"]
)

@app.post("/auth")
async def auth():
    response = await ably.auth.request_token()
    return response.to_dict()