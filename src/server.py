# main.py
import os
import uuid
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import ably

load_dotenv()                                 # read .env if present
PORT           = int(os.getenv("PORT", 12000))
ABLY_API_KEY   = os.getenv("ABLY_API_KEY", "ABLY_API_KEY_PLACEHOLDER")

print("Using Ably API key:", ABLY_API_KEY)

# Ably REST client
try:
    ably_rest = ably.Rest(key=ABLY_API_KEY)
except Exception as exc:
    # Fail fast if the key format is clearly wrong
    raise RuntimeError(f"Invalid Ably key: {exc}") from exc

# ---------------------------------------------------------------------------
# FastAPI setup
# ---------------------------------------------------------------------------
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# Static files  (./public/*  just like Express)
public_dir = Path(__file__).parent / "public"
app.mount("/static", StaticFiles(directory=public_dir), name="static")

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/createTokenRequest")
async def create_token_request(clientId: str | None = None):
    """
    Create an Ably token request.  
    GET /api/createTokenRequest?clientId=xxx
    """
    client_id = clientId or uuid.uuid4().hex
    try:
        token_request = ably_rest.auth.create_token_request(
            {"client_id": client_id}
        )
    except Exception as exc:
        # Mirror the Express behaviour: 500 + message
        raise HTTPException(status_code=500, detail=f"Error creating Ably token request: {exc}") from exc

    return JSONResponse(content=token_request)

@app.get("/")
async def root():
    """Serve the SPA entry point"""
    return FileResponse(public_dir / "templates" / "index.html")

@app.get("/room/{room_id}")
async def room(room_id: str):
    """Serve the same SPA for any room (routing handled client-side)"""
    return FileResponse(public_dir / "templates" / "index.html")

# ---------------------------------------------------------------------------
# Local dev launch
# ---------------------------------------------------------------------------
if __name__ == "__main__":            # `python main.py` for local development
    import uvicorn
    base_url = (
        "https://work-1-eirybuzybuedukdu.prod-runtime.all-hands.dev"
        if PORT == 12000
        else "https://work-2-eirybuzybuedukdu.prod-runtime.all-hands.dev"
    )
    print(f"Server running at {base_url}")
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)