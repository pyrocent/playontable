from secrets import choice
from fastapi import FastAPI

app = FastAPI()
rooms = {}

def get_id(length): return "".join(choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for _ in range(length))

class Room:
    def __init__(self, room_id):
        self.room_users = {}
        self.room_id = room_id

    def user_enter(self, user_id, user_websocket):
        self.room_users[user_id] = user_websocket

    def user_exit(self, user_id):
        self.room_users.pop(user_id, None)
        if not self.room_users: rooms.pop(self.room_id, None)

class User:
    def __init__(self, user_room, user_websocket):
        self.user_id = get_id(5)
        self.user_room = user_room
        self.user_websocket = user_websocket

    async def __aenter__(self):
        await self.user_websocket.accept()
        self.user_room.user_enter(self.user_id, self.user_websocket)
        return self

    async def __aexit__(self, exc_type, exc, tb):
        self.user_room.user_exit(self.user_id)
        await self.user_websocket.close()

async def handle_message(user_room, user, message): pass

async def handle_websocket(websocket, room_id):
    async with User(rooms.setdefault(room_id, Room(room_id)), websocket) as user:
        while True:
            await handle_message(user.user_room, user, await websocket.receive_json())

@app.websocket("/websocket")
async def websocket(websocket):
    while True:
        if (room_id := get_id(5)) not in rooms: await handle_websocket(websocket, room_id)

@app.websocket("/websocket/{room_id}")
async def websocket(websocket, room_id):
    if room_id in rooms: await handle_websocket(websocket, room_id)