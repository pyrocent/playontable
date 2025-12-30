from secrets import choice
from asyncio import gather
from fastapi import FastAPI, WebSocket

def get_code():
    while (code := "".join(choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for _ in range(5))) in users: pass
    else: return code

class User:
    def __init__(self, code, websocket, /):
        self.code = code
        self.room = {self}
        self.websocket = websocket

    async def __aenter__(self):
        await self.websocket.accept()
        await self.websocket.send_json({"hook": "code", "data": self.code})
        return self

    async def __aexit__(self, exc_type, exc, tb):
        self.room.discard(self)
        users.pop(self.code, None)
        await self.websocket.close()

    async def broadcast(self, message, /, *, exclude): await gather(*(user.websocket.send_json(message) for user in self.room if user is not exclude), return_exceptions = True)

async def handle_message(current_user, message, /):
    if (message.get("hook") == "join") and ((host := users.get(message.get("data"))) is not None) and (host is not current_user):
        merged = current_user.room | host.room
        for user in merged: user.room = merged
    elif message.get("hook") != "join": await current_user.broadcast(message, exclude = current_user if message.get("hook") in {"drag", "hand", "fall"} else None)

users = {}

@(app := FastAPI(openapi_url = None)).websocket("/websocket/")
async def websocket(websocket: WebSocket):
    async with User(get_code(), websocket) as user:
        while True: await handle_message(users.setdefault(user.code, user), await websocket.receive_json())