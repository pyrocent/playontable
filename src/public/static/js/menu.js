import {initRoom} from "./room.js";
import {nanoid} from "https://cdn.jsdelivr.net/npm/nanoid@5.1.5/+esm";
import {inject} from "https://cdn.jsdelivr.net/npm/@vercel/analytics@1.5.0/+esm";
import {injectSpeedInsights} from "https://cdn.jsdelivr.net/npm/@vercel/speed-insights@1.2.0/+esm";

inject();
injectSpeedInsights();

const roomCode = nanoid(6);
const mainMenu = document.getElementById("main-menu");
const hostMenu = document.getElementById("host-menu");
const waitMenu = document.getElementById("wait-menu");
const joinCode = document.getElementById("join-code");
const showCode = document.getElementById("show-code");
const copyCode = document.getElementById("copy-code");

const URLparam = new URLSearchParams(window.location.search);
const shortcut = URLparam.get("shortcut");

function hostMenuSetup() {
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
    hostMenu.showModal();
}

if (shortcut === "true") {
    hostMenuSetup();
} else {
    mainMenu.showModal();
}

mainMenu.addEventListener("close", () => {
    if (mainMenu.returnValue === "host-menu") {
        hostMenuSetup();
    } else if (mainMenu.returnValue === "wait-menu") {
        initRoom(joinCode.value);
        waitMenu.showModal();
    }
});

hostMenu.addEventListener("close", () => {
    initRoom(roomCode).send("play");
});