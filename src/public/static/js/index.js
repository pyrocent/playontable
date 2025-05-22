import {Room} from "./room.js";
import { makeDraggable } from "./drag.js";
import {startTutorial} from "./tutorial.js";
import {initRoomHandlers} from "./handlers.js";
import {nanoid} from "https://cdn.jsdelivr.net/npm/nanoid@5.1.5/+esm";

const menu = document.getElementById("menu");
const load = document.getElementById("load");
const wait = document.getElementById("wait");
const join = document.getElementById("join");
const copy = document.getElementById("copy");
const roomText = document.getElementById("room");
const table = document.getElementById("table");

startTutorial(() => menu.showModal());

menu.addEventListener("close", () => {

    let roomCode;

    if (menu.returnValue === "wait") {
        roomCode = join.value;
        wait.showModal();
    } else {
        roomCode = nanoid(6);
        roomText.innerText = roomCode;
        copy.addEventListener("click", (e) => {
            navigator.clipboard.writeText(roomCode);
            roomText.innerText = "Copied!";
            setTimeout(() => roomText.innerText = roomCode, 2000);
        });
        load.showModal();
    }

    const room = new Room(roomCode);
    initRoomHandlers(room, table);
    makeDraggable("#table *:not(.info)", room);

    load.addEventListener("close", () => {
        room.send("play");
    });
});