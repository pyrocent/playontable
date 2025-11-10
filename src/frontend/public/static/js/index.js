import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {inject} from "https://cdn.jsdelivr.net/npm/@vercel/analytics@1.5.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";
import {injectSpeedInsights} from "https://cdn.jsdelivr.net/npm/@vercel/speed-insights@1.2.0/+esm";

let currentPiece;
const hand = document.getElementById("hand");
const roll = document.getElementById("roll");
const flip = document.getElementById("flip");
const fall = document.getElementById("fall");
const table = document.getElementById("table");
const panel = document.getElementById("panel");
const start = document.getElementById("start");
const enter = document.getElementById("enter");

inject();
injectSpeedInsights();
gsap.registerPlugin(Draggable);

Draggable.create("#table > *", {
    bounds: {top: 10, left: 10},
    onClick() {
        if (!this.target.classList.contains("clone")) {
            gsap.killTweensOf("*"); gsap.set("*", {filter: "none"});
            currentPiece = this.target;
            panel.className = currentPiece.className;
            gsap.fromTo(this.target,
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
    },
    onDragStart() {
        if (this.target.classList.contains("clone")) {
            const clone = this.target.cloneNode(true);
            table.appendChild(clone);
            Draggable.create(clone, this.vars);
            this.target.classList.remove("clone");
        }
    }
});

table.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {panel.className = ""; gsap.killTweensOf("*"); gsap.set("*", {filter: "none"})};
});

start.addEventListener("click", () => {
});

enter.addEventListener("click", () => {
});

[hand, fall].forEach(button => {
  button.addEventListener("click", () => {
    currentPiece.classList.toggle("hand");
    panel.className = currentPiece.className;
  });
});

roll.addEventListener("click", () => {
    const rollAnimation = setInterval(() => {
        currentPiece.setAttribute("src", `https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/dices/${currentPiece.classList[1]}/${Math.floor(Math.random() * 6) + 1}.png`);
    }, 100);
    setTimeout(() => {clearInterval(rollAnimation);}, 1000);
});

flip.addEventListener("click", () => {
});