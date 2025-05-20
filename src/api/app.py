from os import getenv
from ably import AblyRest
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

ably = AblyRest(getenv("ABLY_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_headers = ["*"],
    allow_methods = ["GET"],
    allow_credentials = True,
    allow_origins = ["https://playontable.com"]
)

@app.get("/api/auth")
async def auth():
    token = ably.auth.create_token_request({
        "clientId": "guest",
        "capability": {
            "channel1": ["publish", "subscribe"],
        },
        'ttl': 3600 * 1000
    })
    return JSONResponse(token)