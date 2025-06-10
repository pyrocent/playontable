from os import getenv
from ably import AblyRest
from fastapi import FastAPI

if not (api_key := getenv("ABLY_API_KEY")): raise RuntimeError("❌ ABLY_API_KEY not found")
else: ably = AblyRest(api_key)

app = FastAPI()

@app.get("/api/auth")
async def auth():
    response = await ably.auth.request_token()
    return response.to_dict()