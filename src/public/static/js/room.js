import Ably from "https://cdn.jsdelivr.net/npm/ably@2.2.0/+esm";

export class Room {
    constructor(roomCode) {
        this.ably = new Ably.Realtime({key: "RSbNow.VG6faw:GXG7jxAOIfxwTkYQaEmho1WX5g096yZnMB7TnmCeMgI"});
        this.room = this.ably.channels.get(roomCode);
    }

    on(eventName, callback) {
        this.room.subscribe(eventName, callback);
    }

    send(eventName, data = {}) {
        this.room.publish(eventName, data);
    }
}