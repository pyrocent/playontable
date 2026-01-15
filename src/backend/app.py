from secrets import choice
from asyncio import gather
from fastapi import FastAPI, WebSocket

users = {}

class User:
    def __init__(self, websocket, /):
        while users.setdefault(code := "".join(choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for _ in range(5)), self) is not self: pass
        self.code = code
        self.room = {self}
        self.websocket = websocket

    async def __aenter__(self):
        await self.websocket.accept()
        await self.websocket.send_json({"hook": "code", "data": self.code})
        return self

    async def __aexit__(self, exc_type, exc, tb):
        self.room.discard(self)
        if users.get(self.code) is self: users.pop(self.code, None)
        await self.websocket.close()

    async def broadcast(self, json, /, *, exclude = None): await self.websocket.send_json({"hook": "fail"}) if json.get("hook") == "room" and len(self.room) <= 1 else await gather(*(user.websocket.send_json(json) for user in self.room if user is not exclude), return_exceptions = True)

async def handle(user, json = None, /):
    if (hook := json.get("hook")) != "join": await user.broadcast(json, exclude = user if hook in {"drag", "hand", "fall"} else None)
    elif (host := users.get(json.get("data"))) is not None and host is not user:
        for user in (merged := user.room | host.room): user.room = merged

@(app := FastAPI(openapi_url = None)).websocket("/websocket/")
async def websocket(websocket: WebSocket):
    async with User(websocket) as user:
        async for json in websocket.iter_json(): await handle(user, json)