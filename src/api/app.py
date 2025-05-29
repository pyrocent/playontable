from os import getenv
from ably import AblyRest
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from logging import basicConfig, getLogger, Logger, WARNING, INFO

basicConfig(level = INFO, format = "%(asctime)s | %(levelname)s | %(name)s | %(message)s")
getLogger("ably").setLevel(WARNING)
getLogger("httpx").setLevel(WARNING)
getLogger("urllib3").setLevel(WARNING)
getLogger("uvicorn.error").setLevel(WARNING)
getLogger("uvicorn.access").setLevel(WARNING)

fastapi = getLogger("fastapi")

if not (api_key := getenv("ABLY_API_KEY")):
    raise RuntimeError("❌ ABLY_API_KEY not found")

ably = AblyRest(api_key)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_headers = ["*"],
    allow_methods = ["GET"],
    allow_credentials = True,
    allow_origins = ["https://www.playontable.com"]
)

@app.on_event("startup")
async def on_startup():
    fastapi.info("✅ FastAPI server is up and running")

@app.get("/api/auth")
async def auth():
    response = await ably.auth.request_token()
    return response.to_dict()