import {initRoom} from "./room.js";
import {nanoid} from "https://cdn.jsdelivr.net/npm/nanoid@5.1.5/+esm";

const roomCode = nanoid(6);
const mainMenu = document.getElementById("main-menu");
const waitRoom = document.getElementById("wait-room");
const waitHost = document.getElementById("wait-host");
const joinCode = document.getElementById("join-code");
const showCode = document.getElementById("show-code");
const copyCode = document.getElementById("copy-code");

const URLparam = new URLSearchParams(window.location.search);
const shortcut = URLparam.get("shortcut");

function waitRoomSetup() {
    showCode.innerText = roomCode;
    copyCode.onclick = () => {
        showCode.innerText = "Copied!";
        showCode.style.color = "#007649";
        navigator.clipboard.writeText(roomCode);
        setTimeout(() => {
            showCode.innerText = roomCode;
            showCode.style.color = "#646464";
        }, 2000);
    };
    waitRoom.showModal();
}

if (shortcut === "true") {
    waitRoomSetup();
} else {
    mainMenu.showModal();
}

mainMenu.addEventListener("close", () => {
    if (mainMenu.returnValue === "wait-room") {
        waitRoomSetup();
    } else if (mainMenu.returnValue === "wait-host") {
        initRoom(joinCode.value);
        waitHost.showModal();
    }
});

waitRoom.addEventListener("close", () => {
    initRoom(roomCode).send("play");
});