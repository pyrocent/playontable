import {initRoom} from "./room.js";
import {startTutorial} from "./tutorial.js";
import {nanoid} from "https://cdn.jsdelivr.net/npm/nanoid@5.1.5/+esm";

const roomCode = nanoid(5);
const mainMenu = document.getElementById("main-menu");
const waitRoom = document.getElementById("wait-room");
const waitHost = document.getElementById("wait-host");
const joinCode = document.getElementById("join-code");
const showCode = document.getElementById("show-code");
const copyCode = document.getElementById("copy-code");

startTutorial(() => mainMenu.showModal());

mainMenu.addEventListener("close", () => {
    if (mainMenu.returnValue === "wait-room") {
        showCode.innerText = roomCode;
        copyCode.onclick = () => {
            showCode.innerText = "Copied!";
            navigator.clipboard.writeText(roomCode);
            setTimeout(() => showCode.innerText = roomCode, 2000);
        };
        waitRoom.showModal();
    } else if (mainMenu.returnValue === "wait-host") {
        initRoom(joinCode.value);
        waitHost.showModal();
    }
});

waitRoom.addEventListener("close", () => {
    initRoom(roomCode).send("play");
});