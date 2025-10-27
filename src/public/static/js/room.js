import {Room} from "./ably.js";
import {makeDraggable} from "./drag.js";
import {startTutorial} from "./tutorial.js";
import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {getItaDeck, getBlueFraDeck, getRedFraDeck, getBlueFraDeckJolly, getRedFraDeckJolly} from "./decks.js";

let room;
let itaDeck = getItaDeck();
let redFraDeck = getRedFraDeck();
let blueFraDeck = getBlueFraDeck();
let redFraDeckJolly = getRedFraDeckJolly();
let blueFraDeckJolly = getBlueFraDeckJolly();

export function initRoom(roomCode) {

    room = new Room(roomCode);
    const table = document.getElementById("table");

    room.on("play", () => {
        document.getElementById("wait-menu").close();
        startTutorial();
    });

    room.on("drag", ({data: {x, y, z, dragIndex}}) => {
        gsap.set(table.children[dragIndex], {x, y, zIndex: z});
    });

    room.on("chip", ({data: {src, alt, classes}}) => {
        const img = Object.assign(document.createElement("img"), {src, alt, className: classes});
        table.appendChild(img);
        makeDraggable(img);
    });

    room.on("turn", ({data: {randomNumber, cardIndex}}) => {
        let deckType;
        let cardBack;
        let randomCard;
        let randomCardIndex;
        const card = table.children[cardIndex];

        if (card.classList.contains("ita")) {
            deckType = "ita";
            cardBack = "https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/decks/back/ita-v16M4k51oPsbykjlDkP2QC12a2ZlC9.png";
        } else if (card.classList.contains("fra") && card.classList.contains("blue")) {
            cardBack = "https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/decks/back/fra/blue-QGgTJ0hBDa3mmldXMJOAh4qGWzcWJd.png";
            if (card.classList.contains("no-jolly")) {
                deckType = "fra/blue";
            } else {
                deckType = "fra/blue/jolly";
            }
        } else if (card.classList.contains("fra") && card.classList.contains("red")) {
            cardBack = "https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/decks/back/fra/red-0Wy1fwzHybNsgqCW99k7WtZ998hOjv.png";
            if (card.classList.contains("no-jolly")) {
                deckType = "fra/red";
            } else {
                deckType = "fra/red/jolly";
            }
        }

        if (card.getAttribute("src") !== cardBack) {
            card.setAttribute("src", cardBack);
        } else {
            const cardFront = card.getAttribute("data-face");
            if (cardFront) {
                card.setAttribute("src", cardFront);
            } else {
                if (deckType === "ita") {
                    randomCardIndex = Math.floor(randomNumber * itaDeck.length);
                    randomCard = itaDeck[randomCardIndex];
                } else if (deckType === "fra/blue") {
                    randomCardIndex = Math.floor(randomNumber * blueFraDeck.length);
                    randomCard = blueFraDeck[randomCardIndex];
                } else if (deckType === "fra/red") {
                    randomCardIndex = Math.floor(randomNumber * redFraDeck.length);
                    randomCard = redFraDeck[randomCardIndex];
                } else if (deckType === "fra/blue/jolly") {
                    randomCardIndex = Math.floor(randomNumber * blueFraDeckJolly.length);
                    randomCard = blueFraDeckJolly[randomCardIndex];
                } else if (deckType === "fra/red/jolly") {
                    randomCardIndex = Math.floor(randomNumber * redFraDeckJolly.length);
                    randomCard = redFraDeckJolly[randomCardIndex];
                }
                card.setAttribute("src", randomCard);
                card.setAttribute("data-face", randomCard);
                room.send("draw", {deckType, cardIndex});
            }
        }
    });

    room.on("draw", ({data: {deckType, cardIndex}}) => {
        if (deckType === "ita") itaDeck.splice(cardIndex, 1)[0];
        else if (deckType === "fra/blue") blueFraDeck.splice(cardIndex, 1)[0];
        else if (deckType === "fra/red") redFraDeck.splice(cardIndex, 1)[0];
        else if (deckType === "fra/blue/jolly") blueFraDeckJolly.splice(cardIndex, 1)[0];
        else if (deckType === "fra/red/jolly") redFraDeckJolly.splice(cardIndex, 1)[0];
    });

    room.on("hide", ({connectionId, data: {hand, hideIndex}}) => {
        if (connectionId === room.ably.connection.id) return;
        const item = table.children[hideIndex];
        if (hand) item.classList.add("hide");
        else item.classList.remove("hide");
    });

    room.on("dice", ({data: {number}}) => {
        const dice = document.getElementById("dice");

        const interval = setInterval(() => {
            const randomNum = Math.floor(Math.random() * 6) + 1;
            dice.setAttribute("src", `https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/dice/${randomNum}.png`);
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            dice.setAttribute("src", `https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/dice/${number}.png`);
        }, 2000);
    });

    makeDraggable("#table *");

    return room;
}

export function getRoom() {return room;}