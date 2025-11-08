from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_methods = ["GET"],
    allow_origins = ["https://playontable.com"]
)