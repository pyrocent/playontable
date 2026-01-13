import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {customBackHandling } from "https://cdn.jsdelivr.net/npm/webtonative@1.0.84/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";

const {
    menu, code, send, room, join, solo, hand, fall, draw, roll, flip, trash, table, panel
} = Object.fromEntries(
    ["menu", "code", "send", "room", "join", "solo", "hand", "fall", "draw", "roll", "flip", "trash", "table", "panel"].map(id => [id, document.getElementById(id)]
));

const socket = new WebSocket("wss://api.playontable.com/websocket/");

gsap.registerPlugin(Draggable);
Draggable.create("#table > *", {
    bounds: {top: 10, left: 10},
    onClick() {
        if (this.target.classList.contains("clone")) {
            table.querySelectorAll(".selected").forEach(item => item.classList.remove("selected"));
            this.target.classList.add("selected");
            panel.className = this.target.className;
        }
    },
    onDrag() {
        socket.send(JSON.stringify({
            hook: "drag",
            data: {x: this.x, y: this.y},
            item: Array.from(table.children).indexOf(this.target)
        }));
    },
    onDragStart() {
        this.target.classList.add("dragging");
        if (!this.target.classList.contains("clone")) {
            const clone = this.target.cloneNode(true);
            table.prepend(clone);
            Draggable.create(clone, this.vars);
            this.target.classList.add("clone");
        }
    },
    onDragEnd() {this.target.classList.remove("dragging");}
});

menu.showModal();
customBackHandling({
    enable: true
});
menu.addEventListener("keydown", (event) => {if (event.key === "Escape") event.preventDefault();});

let trapActive = false;
let rePushLock = false;

function enableBackTrap() {
  if (trapActive) return;
  trapActive = true;

  // crea una "barriera" nella history
  history.pushState({ backTrap: true }, "");

  const onPopState = (e) => {
    if (!trapActive) return;

    // Evita loop in alcuni browser
    if (rePushLock) return;
    rePushLock = true;

    // L'utente ha premuto indietro: rimetti la barriera subito,
    // così NON si torna indietro e NON chiudi il menu.
    history.pushState({ backTrap: true }, "");

    // sblocca nel prossimo tick
    setTimeout(() => { rePushLock = false; }, 0);
  };

  window.addEventListener("popstate", onPopState);

  // restituisco una funzione di cleanup
  return () => {
    trapActive = false;
    window.removeEventListener("popstate", onPopState);
  };
}

let disableTrap = null;

function openMenu() {
  menu.showModal();

  // opzionale: blocca Escape
  menu.addEventListener("keydown", onKeydown, { passive: false });

  disableTrap = enableBackTrap();
}

function closeMenu() {
  if (menu.open) menu.close();

  menu.removeEventListener("keydown", onKeydown);

  // disabilita trap
  if (disableTrap) {
    disableTrap();
    disableTrap = null;

    // ripulisci l'entry fittizio UNA volta (torna allo stato precedente)
    // Nota: questo fa "consumare" un back, ma ora il menu è chiuso.
    history.back();
  }
}

function onKeydown(e) {
  if (e.key === "Escape") e.preventDefault();
}

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

table.addEventListener("click", (event) => {if (event.target === event.currentTarget) {
    panel.removeAttribute("class");
    const item = getSelectedItem();
    if (item) item.classList.remove("selected");
}});

trash.addEventListener("click", () => {
    getSelectedItem().remove();
    panel.removeAttribute("class");
});

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
            menu.close();
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