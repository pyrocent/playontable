from fastapi import FastAPI
from routers.auth import router as auth
from routers.card import router as card
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_methods = ["POST"],
    allow_origins = ["https://playontable.com"]
)

app.include_router(auth)
app.include_router(card)