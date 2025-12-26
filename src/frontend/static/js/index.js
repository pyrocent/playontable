import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";

let highlighting;
const menu = document.getElementById("menu");
const code = document.getElementById("code");
const join = document.getElementById("join");
const hand = document.getElementById("hand");
const fall = document.getElementById("fall");
const roll = document.getElementById("roll");
const flip = document.getElementById("flip");
const table = document.getElementById("table");
const panel = document.getElementById("panel");
let socket = new WebSocket("wss://api.playontable.com/websocket/");

menu.showModal();

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
    },
    onDrag() {
        socket.send(JSON.stringify({
            hook: "drag",
            data: [Array.from(table.children).indexOf(this.target), [this.x, this.y]]
        }));
    }
});

document.querySelectorAll(".play").forEach(play => {
    play.addEventListener("click", () => {socket.send(JSON.stringify({hook: "play", data: code.innerText}));});
});

join.addEventListener("input", () => {
    if (join.value.length === 5) socket.send(JSON.stringify({hook: "join", data: join.value}));
});

table.addEventListener("click", (event) => {
    if (event.target === event.currentTarget && highlighting) {highlighting.cancel(); panel.removeAttribute("class");}
});

hand.addEventListener("click", () => {
    let item = highlighting.effect.target
    item.classList.toggle("hand");
    panel.className = item.className;
    socket.send(JSON.stringify({
        hook: "hand",
        data: [Array.from(table.children).indexOf(item)]
    }));
});

fall.addEventListener("click", () => {
    let item = highlighting.effect.target
    item.classList.toggle("hand");
    panel.className = item.className;
    socket.send(JSON.stringify({
        hook: "fall",
        data: [Array.from(table.children).indexOf(item)]
    }));
});

roll.addEventListener("click", () => {
    const rollAnimation = setInterval(() => {
        socket.send(JSON.stringify({
            hook: "roll",
            data: [Array.from(table.children).indexOf(highlighting.effect.target), Math.floor(Math.random() * 6) + 1]
        }));
    }, 100);
    setTimeout(() => {clearInterval(rollAnimation);}, 1000);
});

flip.addEventListener("click", () => {
});

socket.addEventListener("message", (json) => {
    const {hook, data} = JSON.parse(json.data);
    const item = table.children[data[0]];
    switch (hook) {
        case "code":
            code.innerText = data
            break;
        case "play":
            menu.close();
            break;
        case "drag":
            gsap.to(item, {x: data[1][0], y: data[1][1]});
            break;
        case "hand":
        case "fall":
            item.classList.toggle("hide");
            break;
        case "roll":
            item.setAttribute("src", `static/assets/dices/${item.classList[1]}/${data[1]}.webp`);
            break;
    }
});