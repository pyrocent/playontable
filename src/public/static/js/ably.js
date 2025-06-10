import Ably from "https://cdn.jsdelivr.net/npm/ably@2.2.0/+esm";

export class Room {
    constructor(code) {this.room = new Ably.Realtime({authUrl: "https://www.playontable.com/api/auth"}).channels.get(code);}
    on(event, callback) {this.room.subscribe(event, callback);}
    send(event, message = {}) {this.room.publish(event, message);}
}