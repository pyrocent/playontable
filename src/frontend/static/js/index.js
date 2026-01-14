import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";

const {
    lobby, table, panel, code, send, room, join, solo, hand, fall, draw, roll, flip, wipe
} = Object.fromEntries(
    ["lobby", "table", "panel", "code", "send", "room", "join", "solo", "hand", "fall", "draw", "roll", "flip", "wipe"].map(id => [id, document.getElementById(id)]
));

const socket = new WebSocket("wss://api.playontable.com/websocket/");
const config = {
    bounds: {top: 10, left: 10},
    onClick() {
        if (this.target.classList.contains("copy")) {
            table.querySelectorAll(".selected").forEach(item => item.classList.remove("selected"));
            this.target.classList.add("selected");
            panel.className = this.target.className;
        }
    },
    onRelease() {
        if (!this.target.classList.contains("copy")) {
            socket.send(JSON.stringify({
                hook: "copy",
                data: {x: this.startX, y: this.startY},
                item: Array.from(table.children).indexOf(this.target)
            }));
        }
    },
    onDrag() {
        socket.send(JSON.stringify({
            hook: "drag",
            data: {x: this.x, y: this.y},
            item: Array.from(table.children).indexOf(this.target)
        }));
    },
    onDragStart() {this.target.classList.add("dragging");},
    onDragEnd() {this.target.classList.remove("dragging");}
}

gsap.registerPlugin(Draggable);
Draggable.create("#table > *", config);

lobby.showModal();
lobby.addEventListener("keydown", (event) => {if (event.key === "Escape") event.preventDefault();});

send.addEventListener("click", () => {navigator.share({text: code.innerText});});
room.addEventListener("click", () => {socket.send(JSON.stringify({hook: "room"}));});
join.addEventListener("input", () => {if (join.value.length === 5) socket.send(JSON.stringify({hook: "join", data: join.value}));});
solo.addEventListener("click", () => {socket.send(JSON.stringify({hook: "solo"}));});

const getSelectedItem = () => table.querySelector("#table > .selected");
const toggleHandAndSend = (hook) => {
    const item = getSelectedItem();
    item.classList.toggle("hand");
    panel.className = item.className;
    socket.send(JSON.stringify({hook, item: Array.from(table.children).indexOf(item)}));
};

hand.addEventListener("click", () => toggleHandAndSend("hand"));
fall.addEventListener("click", () => toggleHandAndSend("fall"));
roll.addEventListener("click", () => {
    const rollAnimation = setInterval(() => {
        socket.send(JSON.stringify({
            hook: "roll",
            data: Math.floor(Math.random() * 6) + 1,
            item: Array.from(table.children).indexOf(getSelectedItem())
        }));
    }, 100);
    setTimeout(() => {clearInterval(rollAnimation);}, 1000);
});

draw.addEventListener("click", () => {
});

flip.addEventListener("click", () => {
});

wipe.addEventListener("click", () => {
    getSelectedItem().remove();
    panel.removeAttribute("class");
});

table.addEventListener("click", (event) => {if (event.target === event.currentTarget) {
    panel.removeAttribute("class");
    const item = getSelectedItem();
    if (item) item.classList.remove("selected");
}});

socket.addEventListener("message", (({data: json}) => {
    const {hook, data, item} = JSON.parse(json);
    const child = (item !== undefined && item !== null) ? table.children[item] : null;
    switch (hook) {
        case "code":
            code.innerText = data
            break;
        case "fail":
            room.disabled = true;
            room.classList.toggle("shake");
            room.textContent = "YOU ARE ALONE!";
            setTimeout(() => {
                room.disabled = false;
                room.classList.toggle("shake");
                room.textContent = "START ROOM";
            }, 3000);
            break;
        case "room":
        case "solo":
            lobby.close();
            break;
        case "copy":
            const clone = child.cloneNode(true);
            clone.classList.add("copy");
            table.append(clone);
            gsap.to(child, data);
            Draggable.create(clone, config);
            break;
        case "drag":
            gsap.to(child, data);
            break;
        case "hand":
        case "fall":
            child.classList.toggle("hide");
            if (child === getSelectedItem()) {
                panel.removeAttribute("class");
                child.classList.remove("selected");
            }
            break;
        case "roll":
            child.setAttribute("src", `static/assets/dices/${child.classList[1]}/${data}.webp`);
            break;
        case "flip":
            break;
    }
}));