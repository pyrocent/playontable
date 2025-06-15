import {nanoid} from "nanoid";
import {initRoom} from "./room.js";
import {startTutorial} from "./tutorial.js";

export function onLoad() {

    const roomCode = nanoid(5);
    const mainMenu = document.getElementById("main-menu");
    const waitRoom = document.getElementById("wait-room");
    const waitHost = document.getElementById("wait-host");
    const joinCode = document.getElementById("join-code");
    const showCode = document.getElementById("show-code");
    const copyCode = document.getElementById("copy-code");

    startTutorial(() => {
        mainMenu.showModal();
        mainMenu.querySelector("button").focus();
    });

    mainMenu.addEventListener("close", () => {
        if (mainMenu.returnValue === "wait-room") {
            showCode.innerText = roomCode;
            copyCode.onclick = () => {
                showCode.innerText = "Copied!";
                navigator.clipboard.writeText(roomCode);
                setTimeout(() => showCode.innerText = roomCode, 2000);
            };
            waitRoom.showModal();
            waitRoom.querySelector("button").focus();
        } else if (mainMenu.returnValue === "wait-host") {
            initRoom(joinCode.value);
            waitHost.showModal();
        }
    });

    waitRoom.addEventListener("close", () => {
        initRoom(roomCode).send("play");
    });
}