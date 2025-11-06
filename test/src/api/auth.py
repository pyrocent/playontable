from ably import AblyRest
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ably = AblyRest("")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_methods = ["POST"],
    allow_origins = ["http://127.0.0.1:3000"]
)

@app.post("/api/auth")
async def auth():
    response = await ably.auth.request_token()
    return response.to_dict()