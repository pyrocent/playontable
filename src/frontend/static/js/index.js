import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";

let highlighting;
const menu = document.getElementById("menu");
const code = document.getElementById("code");
const send = document.getElementById("send");
const room = document.getElementById("room");
const join = document.getElementById("join");
const solo = document.getElementById("solo");
const hand = document.getElementById("hand");
const fall = document.getElementById("fall");
const roll = document.getElementById("roll");
const flip = document.getElementById("flip");
const table = document.getElementById("table");
const panel = document.getElementById("panel");
const socket = new WebSocket("wss://api.playontable.com/websocket/");

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
            index: Array.from(table.children).indexOf(this.target),
            data: {x: this.x, y: this.y}
        }));
    }
});

menu.showModal();
send.addEventListener("click", () => {navigator.share({text: code.innerText});});
room.addEventListener("click", () => {socket.send(JSON.stringify({hook: "room"}));});
join.addEventListener("input", () => {if (join.value.length === 5) socket.send(JSON.stringify({hook: "join", data: join.value}));});
solo.addEventListener("click", () => {socket.send(JSON.stringify({hook: "solo"}));});

hand.addEventListener("click", () => {
    let item = highlighting.effect.target
    item.classList.toggle("hand");
    panel.className = item.className;
    socket.send(JSON.stringify({
        hook: "hand",
        index: Array.from(table.children).indexOf(item)
    }));
});

fall.addEventListener("click", () => {
    let item = highlighting.effect.target
    item.classList.toggle("hand");
    panel.className = item.className;
    socket.send(JSON.stringify({
        hook: "fall",
        index: Array.from(table.children).indexOf(item)
    }));
});

roll.addEventListener("click", () => {
    const rollAnimation = setInterval(() => {
        socket.send(JSON.stringify({
            hook: "roll",
            index: Array.from(table.children).indexOf(highlighting.effect.target),
            data: Math.floor(Math.random() * 6) + 1
        }));
    }, 100);
    setTimeout(() => {clearInterval(rollAnimation);}, 1000);
});

flip.addEventListener("click", () => {
});

table.addEventListener("click", (event) => {if (event.target === event.currentTarget && highlighting) {highlighting.cancel(); panel.removeAttribute("class");}});

socket.addEventListener("message", (json) => {
    const {hook, index, data} = JSON.parse(json.data);
    const child = (index !== undefined && index !== null) ? table.children[index] : null;
    switch (hook) {
        case "code":
            code.innerText = data
            break;
        case "fail":
            room.classList.toggle("shake");
            room.textContent = "YOU ARE ALONE!";
            setTimeout(() => {
                room.classList.toggle("shake");
                room.textContent = "START ROOM";
            }, 1500);
            break;
        case "room":
        case "solo":
            menu.close();
            break;
        case "drag":
            gsap.to(child, data);
            break;
        case "hand":
        case "fall":
            child.classList.toggle("hide");
            break;
        case "roll":
            child.setAttribute("src", `static/assets/dices/${child.classList[1]}/${data}.webp`);
            break;
    }
});