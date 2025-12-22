import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";

let highlighting;
const room = document.getElementById("room");
const a = document.getElementById("a");
const b = document.getElementById("b");
const c = document.getElementById("c");
const d = document.getElementById("d");
const hand = document.getElementById("hand");
const fall = document.getElementById("fall");
const roll = document.getElementById("roll");
const flip = document.getElementById("flip");
const table = document.getElementById("table");
const panel = document.getElementById("panel");
const start = document.getElementById("start");
const enter = document.getElementById("enter");
let socket = new WebSocket("ws://api.playontable.com/websocket/");

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
    a.showModal();
});

enter.addEventListener("click", () => {
    c.showModal();
});

b.addEventListener("click", () => {
    socket.send(JSON.stringify({type: "play", data: room.innerText}));
});

d.addEventListener("input", () => {
    if (d.value.length === 5) socket.send(JSON.stringify({type: "join", data: d.value}));
});

hand.addEventListener("click", () => {
    let item = highlighting.effect.target
    item.classList.toggle("hand");
    panel.className = item.className;
    socket.send(JSON.stringify({
        type: "hand",
        data: [Array.from(table.children).indexOf(item)]
    }));
});

fall.addEventListener("click", () => {
    let item = highlighting.effect.target
    item.classList.toggle("hand");
    panel.className = item.className;
    socket.send(JSON.stringify({
        type: "fall",
        data: [Array.from(table.children).indexOf(item)]
    }));
});

roll.addEventListener("click", () => {
    const rollAnimation = setInterval(() => {
        socket.send(JSON.stringify({
            type: "roll",
            data: [Array.from(table.children).indexOf(highlighting.effect.target), Math.floor(Math.random() * 6) + 1]
        }));
    }, 100);
    setTimeout(() => {clearInterval(rollAnimation);}, 1000);
});

flip.addEventListener("click", () => {
});

socket.addEventListener("message", (json) => {
    const {type, data} = JSON.parse(json.data);
    const item = table.children[data[0]];
    switch (type) {
        case "room":
            room.innerText = data
            break;
        case "play":
            a.close();
            c.close();
            break;
        case "hide":
        case "show":
            item.classList.toggle("hide");
            break;
        case "roll":
            console.log(data);
            item.setAttribute("src", `static/assets/dices/${item.classList[1]}/${data[1]}.webp`);
            break;
    }
});