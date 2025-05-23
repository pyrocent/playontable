import {Room} from "./ably.js";
import {makeDraggable} from "./drag.js";
import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {getItaDeck, getBlueFraDeck, getRedFraDeck, getBlueFraDeckJolly, getRedFraDeckJolly} from "./decks.js";

let room;
let itaDeck = getItaDeck();
let blueFraDeck = getBlueFraDeck();
let redFraDeck = getRedFraDeck();
let blueFraDeckJolly = getBlueFraDeckJolly();
let redFraDeckJolly = getRedFraDeckJolly();
const table = document.getElementById("table");

export function initRoom(roomCode) {

    room = new Room(roomCode);

    room.on("play", () => {
        document.getElementById("wait-host").close();
    });

    room.on("drag", message => {
        const {x, y, z, cardIndex} = message.data;
        gsap.set(table.children[cardIndex], {x: x, y: y, zIndex: z});
    });

    room.on("chip", message => {
        const {src, alt, classes} = message.data;
        const img = document.createElement("img");

        img.src = src;
        img.alt = alt;
        img.className = classes;

        table.appendChild(img);
        makeDraggable(img);
    });

    room.on("turn", message => {
        const {randomNumber, cardIndex} = message.data;
        let deckType;
        let cardBack;
        let randomCard;
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
            };
        }

        if (card.getAttribute("src") !== cardBack) {
            card.setAttribute("src", cardBack);
        } else {
            const cardFront = card.getAttribute("data-face");
            if (cardFront) {
                card.setAttribute("src", cardFront);
            } else {
                if (deckType === "ita") {
                    cardIndex = Math.floor(randomNumber * itaDeck.length);
                    randomCard = itaDeck[cardIndex];
                } else if (deckType === "fra/blue") {
                    cardIndex = Math.floor(randomNumber * blueFraDeck.length);
                    randomCard = blueFraDeck[cardIndex];
                } else if (deckType === "fra/red") {
                    cardIndex = Math.floor(randomNumber * redFraDeck.length);
                    randomCard = redFraDeck[cardIndex];
                } else if (deckType === "fra/blue/jolly") {
                    cardIndex = Math.floor(randomNumber * blueFraDeckJolly.length);
                    randomCard = blueFraDeckJolly[cardIndex];
                } else if (deckType === "fra/red/jolly") {
                    cardIndex = Math.floor(randomNumber * redFraDeckJolly.length);
                    randomCard = redFraDeckJolly[cardIndex];
                };
                card.setAttribute("src", randomCard);
                card.setAttribute("data-face", randomCard);
                room.send("draw", {deckType: deckType, cardIndex: cardIndex});
            };
        };
    });

    room.on("draw", message => {
        const {deckType, cardIndex} = message.data;

        if (deckType === "ita") itaDeck.splice(cardIndex, 1)[0];
        else if (deckType === "fra/blue") blueFraDeck.splice(cardIndex, 1)[0];
        else if (deckType === "fra/red") redFraDeck.splice(cardIndex, 1)[0];
        else if (deckType === "fra/blue/jolly") blueFraDeckJolly.splice(cardIndex, 1)[0];
        else if (deckType === "fra/red/jolly") redFraDeckJolly.splice(cardIndex, 1)[0];

        console.log(itaDeck, blueFraDeck, redFraDeck, blueFraDeckJolly, redFraDeckJolly);
    });

    room.on("hide", message => {
        if (message.connectionId === room.ably.connection.id) return;
        const {hand, cardIndex} = message.data;
        const item = table.children[cardIndex];

        if (hand) item.classList.add("hide");
        else item.classList.remove("hide");
    });

    makeDraggable("#table *:not(.info)");

    return room;
}

export function getRoom() {
    return room;
}