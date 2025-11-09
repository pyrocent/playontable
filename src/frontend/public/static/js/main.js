import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";

let currentPiece;
const hand = document.getElementById("hand");
const roll = document.getElementById("roll");
const flip = document.getElementById("flip");
const table = document.getElementById("table");
const panel = document.getElementById("panel");

function tools(piece, state) {

    gsap.killTweensOf("*"); gsap.set("*", {filter: "none"});

    if (currentPiece === piece && panel.className !== "") panel.className = "";
    else {
        currentPiece = piece;
        panel.className = `open ${state}`;
        gsap.fromTo(piece,
            {
                filter: "drop-shadow(0 0 0 rgb(255, 230, 120)) brightness(1)"
            },
            {
                yoyo: true,
                repeat: -1,
                duration: 0.75,
                ease: "power1.inOut",
                filter: "drop-shadow(0 0 5px rgba(255, 230, 120, 0.9)) brightness(1.2)"
            }
        );
    }
}

gsap.registerPlugin(Draggable);
Draggable.create(".cubes", {bounds: {top: 10, left: 10}, onClick() {tools(this.target, "cubes");}});
Draggable.create(".cards", {bounds: {top: 10, left: 10}, onClick() {tools(this.target, "cards");}});
Draggable.create(".chips", {bounds: {top: 10, left: 10}, onClick() {tools(this.target, "chips");}});
Draggable.create("#board", {bounds: {top: 10, left: 10}, onClick() {tools(this.target, "board");}});
Draggable.create(".chess", {bounds: {top: 10, left: 10}, onClick() {tools(this.target, "chess");}});
Draggable.create(".dames", {bounds: {top: 10, left: 10}, onClick() {tools(this.target, "dames");}});

table.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {panel.className = ""; gsap.killTweensOf("*"); gsap.set("*", {filter: "none"})};
});

hand.addEventListener("click", () => {
});

roll.addEventListener("click", () => {
});

flip.addEventListener("click", () => {
});