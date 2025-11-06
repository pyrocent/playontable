export class Room {
    constructor(code) {
        this.code = code;
        this.ably = new ably.Realtime({authUrl: "http://127.0.0.1:8000/auth", echoMessages: false});
        this.room = this.ably.channels.get(code);

        this.ably.connection.once("connected", () => {
            this.room.subscribe("drag", ({data: {x, y, zIndex, dragIndex}}) => {
                const target = table && table.children ? table.children[dragIndex] : null;
                if (target) {
                    gsap.set(target, {x, y, zIndex});
                }
            });

            this.room.subscribe("dice", ({data: {randomNumber}}) => {
                const dice = document.getElementById("dice");
                if (dice) {
                    dice.setAttribute("src", `https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/dice/${randomNumber}.png`);
                }
            });
        });
    }
    send(eventName, message = {}) {this.room.publish(eventName, message);}
}
