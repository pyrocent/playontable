import Ably from "https://cdn.jsdelivr.net/npm/ably@2.2.0/+esm";

export class Room {
    constructor(code) {this.room = new Ably.Realtime({ authUrl: "/api/auth" }).channels.get(code);}
    on(event, cb) {this.room.subscribe(event, cb);}
    send(event, msg = {}) {this.room.publish(event, msg);}
}