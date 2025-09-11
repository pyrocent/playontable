import * as Ably from "https://cdn.jsdelivr.net/npm/ably@2.12.0/build/ably.min.js";

export class Room {
    constructor(roomCode) {
        this.ably = new Ably.Realtime({authUrl: "https://playontable.com/api/auth", authMethod: "POST"});
        this.room = this.ably.channels.get(roomCode);
    }

    on(eventName, callback) {this.room.subscribe(eventName, callback);}
    send(eventName, message = {}) {this.room.publish(eventName, message);}
}