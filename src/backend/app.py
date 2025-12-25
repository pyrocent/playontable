from secrets import choice
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
        await self.websocket.close()

    async def broadcast(self, message, /, *, exclude):
        for recipient in [user for user in self.room if user is not exclude]: await recipient.websocket.send_json(message)

async def handle_message(current_user, message, /):
    if message.hook == "join":
        if (host := users.pop(message.data, None)) is not None and host is not current_user:
            merged = current_user.room | host.room
            for user in merged: user.room = merged
    else: await current_user.broadcast(message, exclude = current_user if message.hook in {"play", "roll", "flip"} else None)

users = {}
app = FastAPI(openapi_url = None)

@app.websocket("/websocket/")
async def websocket(websocket: WebSocket):
    async with User(get_code(), websocket) as user:
        users[user.code] = user
        while True: await handle_message(user, await websocket.receive_json())