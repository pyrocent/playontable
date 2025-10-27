from fastapi import FastAPI
from routers.auth import router as auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_methods = ["POST"],
    allow_origins = ["https://playontable.com"]
)

app.include_router(auth)