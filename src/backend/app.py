from asyncio import Lock
from secrets import choice
from fastapi import FastAPI, WebSocket

def get_id(context, /):
    while (new_id := "".join(choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for _ in range(5))) in context: pass
    else: return new_id

class Room:
    def __init__(self, *, id):
        self.id = id
        self.users = set()
        self.lock = Lock()

    async def broadcast(self, message, /, *, exclude = None):
        async with self.lock: users = [user for user in self.users if user is not exclude]
        for user in users: await user.websocket.send_json(message)

class User:
    def __init__(self, room, websocket, /):
        self.room = room
        self.websocket = websocket

    async def __aenter__(self):
        await self.websocket.accept()
        self.room.users.add(self)
        await self.websocket.send_json({"type": "room", "data": self.room.id})
        return self

    async def __aexit__(self, exc_type, exc, tb):
        async with self.room.lock: self.room.users.discard(self)
        await self.websocket.close()

async def handle_message(user, message, /):
    match message:
        case {"hook": "play", "data": room_id}:
            del rooms[room_id]
            for user in list(users.keys()):
                if users[user] == room_id:
                    del users[user]

            await user.room.broadcast(message)
        case {"hook": "join", "data": room_id}:
            if room := rooms.get(room_id):
                user.room = room
                users[user] = room_id
                room.users.add(user)
        case {"hook": hook, "data": data} if hook in ("hand", "fall"):
            await user.room.broadcast(message, exclude = user)
        case {"hook": "roll", "data": data}:
            await user.room.broadcast(message)

users, rooms = {}, {}
app = FastAPI(docs_url = None, redoc_url = None, openapi_url = None)

@app.websocket("/websocket/")
async def websocket(websocket: WebSocket):
    async with User(room := Room(id = get_id(rooms.keys())), websocket) as user:
        users[user] = room.id
        rooms[room.id] = room
        while True: await handle_message(user, await websocket.receive_json())