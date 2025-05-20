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

@app.get("/")
async def auth(client_id: str | None = Query(None)):
    token = ably.auth.create_token_request({
        "client_id": client_id or "guest",
        "ttl": 60 * 60 * 1000,
        "capability": {"room:*": ["publish", "subscribe"]}
    })
    return JSONResponse(token)