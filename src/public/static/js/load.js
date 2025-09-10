import {initRoom} from "./room.js";
import {startTutorial} from "./tutorial.js";
import {nanoid} from "https://cdn.jsdelivr.net/npm/nanoid@5.1.5/+esm";
import {inject} from "https://cdn.jsdelivr.net/npm/@vercel/analytics@1.5.0/+esm";
import {injectSpeedInsights} from "https://cdn.jsdelivr.net/npm/@vercel/speed-insights@1.2.0/+esm";

inject();
injectSpeedInsights();

const roomCode = nanoid(6);
const mainMenu = document.getElementById("main-menu");
const waitRoom = document.getElementById("wait-room");
const waitHost = document.getElementById("wait-host");
const joinCode = document.getElementById("join-code");
const showCode = document.getElementById("show-code");
const copyCode = document.getElementById("copy-code");

startTutorial(() => {mainMenu.showModal();});

mainMenu.addEventListener("close", () => {
    if (mainMenu.returnValue === "wait-room") {
        showCode.innerText = roomCode;
        copyCode.onclick = () => {
            // Animate the copy button
            copyCode.classList.add('copied');
            copyCode.innerHTML = '✓';
            
            // Animate the code text
            showCode.classList.add('copying');
            showCode.innerText = "Copied!";
            
            // Copy to clipboard
            navigator.clipboard.writeText(roomCode);
            
            // Reset after animation
            setTimeout(() => {
                copyCode.classList.remove('copied');
                copyCode.innerHTML = '📋';
                showCode.classList.remove('copying');
                showCode.innerText = roomCode;
            }, 1500);
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