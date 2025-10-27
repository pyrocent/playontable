from fastapi import FastAPI
from api.routers.auth import router as auth

app = FastAPI()

app.include_router(auth)