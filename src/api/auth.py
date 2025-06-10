from os import getenv
from ably import AblyRest
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

if not (api_key := getenv("ABLY_API_KEY")): raise RuntimeError("❌ ABLY_API_KEY not found")
else: ably = AblyRest(api_key)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_headers = [],
    allow_methods = ["GET"],
    allow_credentials = True,
    allow_origins = []
)

@app.get("/api/auth")
async def auth():
    response = await ably.auth.request_token()
    return response.to_dict()