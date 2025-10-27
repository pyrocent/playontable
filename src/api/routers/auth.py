from os import getenv
from ably import AblyRest
from fastapi import APIRouter

router = APIRouter(prefix = "/auth")
ably = AblyRest(getenv("ABLY_API_KEY"))

@router.post("/")
async def auth():
    response = await ably.auth.request_token()
    return response.to_dict()