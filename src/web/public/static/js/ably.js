import Ably from "https://cdn.jsdelivr.net/npm/ably@2.2.0/+esm";

export class Room {
    constructor(roomCode) {
        this.ably = new Ably.Realtime({authUrl: "https://playontable.com/api/auth"});
        this.room = this.ably.channels.get(roomCode);
    }

    on(eventName, callback) {this.room.subscribe(eventName, callback);}
    send(eventName, message = {}) {this.room.publish(eventName, message);}
}