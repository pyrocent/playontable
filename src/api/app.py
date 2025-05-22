from os import getenv
from ably import AblyRest
from fastapi import FastAPI, Form
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

ably: AblyRest = AblyRest(getenv("ABLY_API_KEY"))

app: FastAPI = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_headers = ["*"],
    allow_methods = ["GET"],
    allow_credentials = True,
    allow_origins = ["https://www.playontable.com"]
)

@app.get("/api/auth")
async def auth():
    response = await ably.auth.request_token()
    return response.to_dict()