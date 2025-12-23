from secrets import choice
from fastapi import FastAPI, WebSocket

def get_id():
    while (new_id := "".join(choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for _ in range(5))) in users: pass
    else: return new_id

class User:
    def __init__(self, id, websocket, /):
        self.id = id
        self.room = {self}
        self.websocket = websocket

    async def __aenter__(self):
        await self.websocket.accept()
        await self.websocket.send_json({"hook": "room", "data": self.id})
        return self

    async def __aexit__(self, exc_type, exc, tb):
        self.room.discard(self)
        await self.websocket.close()

    async def broadcast(self, message, /, *, exclude = None):
        for recipient in [user for user in self.room if user is not exclude]: await recipient.websocket.send_json(message)

async def handle_message(current_user, message, /):
    match message:
        case {"hook": "join", "data": id}:
            if (host := users.pop(id, None)) is not None and host is not current_user:
                merged = current_user.room | host.room
                for user in merged: user.room = merged
        case {"hook": hook, "data": _} if hook in {"drag", "hand", "fall"}: await current_user.broadcast(message, exclude = current_user)
        case {"hook": hook, "data": _} if hook in {"play", "roll", "flip"}: await current_user.broadcast(message)

users = {}
app = FastAPI(openapi_url = None)

@app.websocket("/websocket/")
async def websocket(websocket: WebSocket):
    async with User(get_id(), websocket) as user:
        users[user.id] = user
        while True: await handle_message(user, await websocket.receive_json())