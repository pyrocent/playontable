import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";

const {
    menu, code, send, room, join, solo, hand, fall, roll, flip, table, panel
} = Object.fromEntries(
    ["menu", "code", "send", "room", "join", "solo", "hand", "fall", "roll", "flip", "table", "panel"].map(id => [id, document.getElementById(id)
]));

const socket = new WebSocket("wss://api.playontable.com/websocket/");

gsap.registerPlugin(Draggable);
Draggable.create("#table > *", {
    bounds: {top: 10, left: 10},
    onClick() {
        if (!this.target.classList.contains("clone")) {
            if (highlighting) highlighting.cancel();
            panel.className = this.target.className;
            let highlighting = this.target.animate(
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
            data: {x: this.x, y: this.y},
            item: Array.from(table.children).indexOf(this.target)
        }));
    }
});

menu.showModal();
send.addEventListener("click", () => {navigator.share({text: code.innerText});});
room.addEventListener("click", () => {socket.send(JSON.stringify({hook: "room"}));});
join.addEventListener("input", () => {if (join.value.length === 5) socket.send(JSON.stringify({hook: "join", data: join.value}));});
solo.addEventListener("click", () => {socket.send(JSON.stringify({hook: "solo"}));});

const toggleHandAndSend = (hook) => {
    const item = highlighting?.effect?.target;
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
            item: Array.from(table.children).indexOf(highlighting?.effect?.target)
        }));
    }, 100);
    setTimeout(() => {clearInterval(rollAnimation);}, 1000);
});

flip.addEventListener("click", () => {
});

table.addEventListener("click", (event) => {if (event.target === event.currentTarget && highlighting) {highlighting.cancel(); panel.removeAttribute("class");}});

socket.addEventListener("message", (({data: json}) => {
    const {hook, data, item} = JSON.parse(json);
    const child = (item !== undefined && item !== null) ? table.children[item] : null;
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
        case "flip":
            break;
    }
}));