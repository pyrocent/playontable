from os import getenv
from ably import AblyRest
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

if not (api_key := getenv("ABLY_API_KEY")): raise RuntimeError("❌ ABLY_API_KEY not found")
else: ably = AblyRest(api_key)

origins = [
    "http://localhost",
    "capacitor://localhost",
    "http://localhost:8100",
    "https://playontable.com",
    "https://www.playontable.com"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_headers = [],
    allow_origins = origins,
    allow_methods = ["GET"],
    allow_credentials = True
)

@app.get("/api/auth")
async def auth():
    response = await ably.auth.request_token()
    return response.to_dict()