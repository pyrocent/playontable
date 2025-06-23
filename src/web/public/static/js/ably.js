import * as Ably from "ably";

export class Room {
    constructor(roomCode) {
        this.ably = new Ably.Realtime({authUrl: "https://playontable.com/api/auth", authMethod: "POST"});
        this.room = this.ably.channels.get(roomCode);
    }

    on(eventName, callback) {this.room.subscribe(eventName, callback);}
    send(eventName, message = {}) {this.room.publish(eventName, message);}
}