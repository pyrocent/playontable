from ably import Rest
from uuid import uuid4
from pathlib import Path
from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

load_dotenv()
ably = Rest("RSbNow.VG6faw:GXG7jxAOIfxwTkYQaEmho1WX5g096yZnMB7TnmCeMgI")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["GET", "POST"],
    allow_headers = ["Content-Type", "Authorization"],
)

public_dir = Path(__file__).parent / "public"
app.mount("/static", StaticFiles(directory=public_dir), name="static")

@app.get("/api/token")
async def create_token_request(clientId: str | None = None):
    client_id = clientId or uuid4().hex
    token_request = ably.auth.create_token_request({"client_id": client_id})
    return JSONResponse(token_request)

@app.get("/room/{room_id}")
async def room(): return FileResponse(public_dir / "templates" / "index.html")

if __name__ == "__main__": import uvicorn; uvicorn.run("app:app", reload = True)