import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";

let highlighting;
const hand = document.getElementById("hand");
const fall = document.getElementById("fall");
const roll = document.getElementById("roll");
const flip = document.getElementById("flip");
const table = document.getElementById("table");
const panel = document.getElementById("panel");
const start = document.getElementById("start");
const enter = document.getElementById("enter");
const socket = new WebSocket(`wss://api.playontable.com/websocket/start`);

gsap.registerPlugin(Draggable);

Draggable.create("#table > *", {
    bounds: {top: 10, left: 10},
    onClick() {
        if (!this.target.classList.contains("clone")) {
            if (highlighting) highlighting.cancel();
            panel.className = this.target.className;
            highlighting = this.target.animate(
                [
                    {filter: "drop-shadow(0 0 0 rgb(255, 230, 120)) brightness(1)"},
                    {filter: "drop-shadow(0 0 5px rgba(255, 230, 120, 0.9)) brightness(1.2)"}
                ],
                {
                    duration: 750,
                    iterations: Infinity,
                    easing: "ease-in-out",
                    direction: "alternate"
                }
            );
        }
    },
    onDragStart() {
        if (this.target.classList.contains("clone")) {
            const clone = this.target.cloneNode(true);
            table.appendChild(clone);
            Draggable.create(clone, this.vars);
            this.target.classList.remove("clone");
        }
    }
});

table.addEventListener("click", (event) => {
    if (event.target === event.currentTarget && highlighting) {highlighting.cancel(); panel.removeAttribute("class");}
});

start.addEventListener("click", () => {
});

enter.addEventListener("click", () => {
});

hand.addEventListener("click", () => {
    panel.className = highlighting.effect.target.className;
    socket.send(JSON.stringify({
        type: "hand",
        data: Array.from(table.children).indexOf(highlighting.effect.target)
    }));
});

fall.addEventListener("click", () => {
    panel.className = highlighting.effect.target.className;
    socket.send(JSON.stringify({
        type: "fall",
        data: Array.from(table.children).indexOf(highlighting.effect.target)
    }));
});

roll.addEventListener("click", () => {
    socket.send(JSON.stringify({
        type: "roll",
        data: Array.from(table.children).indexOf(highlighting.effect.target)
    }));
});

flip.addEventListener("click", () => {
});

socket.addEventListener("message", (json) => {
    const {type, data} = JSON.parse(json.data);
    const item = table.children[data];
    switch (type) {
        case "room":
            console.log(data);
            break;
        case "hand":
        case "fall":
            console.log(item);
            item.classList.toggle("hand");
            break;
        case "rool":
            const rollAnimation = setInterval(() => {
                highlighting.effect.target.setAttribute("src", `static/assets/dices/${item.classList[1]}/${Math.floor(Math.random() * 6) + 1}.webp`);
            }, 100);
            setTimeout(() => {clearInterval(rollAnimation);}, 1000);
            break;
    }
});