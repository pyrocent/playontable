from json import dumps
from asyncio import Lock
from secrets import choice
from dataclasses import dataclass, field
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

@dataclass
class Room:
    id: str
    users: list = field(default_factory = list)
    lock: Lock = field(default_factory = Lock, repr = False)

    def __post_init__(self): rooms[self.id] = self

    async def broadcast(self, message):
        async with self.lock: users = list(self.users)
        for user in users: await user.websocket.send_json(message)

@dataclass
class User:
    id: str
    room: Room
    websocket: WebSocket

    async def __aenter__(self):
        await self.websocket.accept()
        async with self.room.lock: self.room.users.append(self)
        await self.websocket.send_json({"type": "room", "data": self.room.id})
        return self

    async def __aexit__(self, exc_type, exc, tb):
        async with self.room.lock: self.room.users.remove(self)
        await self.websocket.close()
        if not self.room.users: rooms.pop(self.room.id, None)

def get_id(context) -> str:
    while (new_id := "".join(choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for _ in range(5))) in context: pass
    else: return new_id

async def handle_message(room: Room, user: User, message: dict):
    type = message.get("type")
    data = message.get("data")
    match type:
        case "hand" | "fall":
            print(data)
            await room.broadcast(dumps({
                "type": type,
                "data": data
            }))
        case _: pass

async def handle_websocket(websocket: WebSocket, room: Room):
    async with room.lock: user_id = get_id([user.id for user in room.users])
    async with User(user_id, room, websocket) as user:
        try:
            while True: await handle_message(room, user, await websocket.receive_json())
        except WebSocketDisconnect: pass

rooms: dict[str, Room] = {}
app: FastAPI = FastAPI(docs_url = None, redoc_url = None, openapi_url = None)

@app.websocket("/websocket/start")
async def websocket_start_room(websocket: WebSocket):
    await handle_websocket(websocket, Room(get_id(rooms)))

@app.websocket("/websocket/enter/{room_id}")
async def websocket_enter_room(websocket: WebSocket, room_id: str):
    if room_id in rooms: await handle_websocket(websocket, rooms[room_id])
    else: await websocket.close(code = 1008, reason = "Try To Join A Non-existent Room")