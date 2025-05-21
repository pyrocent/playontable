from os import getenv
from ably import AblyRest
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse

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
    return JSONResponse(content = getattr(response, "to_dict", lambda: response)())

@app.post("/api/room")
async def room(room: str = Form(...)):
    response = RedirectResponse("/", status_code = 303)
    response.set_cookie(
        path = "/",
        key = "room",
        value = room,
        secure = True,
        samesite = "lax",
        max_age = 60 * 60 * 24
    )
    return response