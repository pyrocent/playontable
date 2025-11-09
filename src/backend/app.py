from quart import Quart, websocket

app = Quart(__name__)

@app.websocket("/ws/<room>")
async def ws(room):
    while True: pass