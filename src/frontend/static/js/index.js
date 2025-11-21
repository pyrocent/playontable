import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";

let highlighting;
const hand = document.getElementById("hand");
const fall = document.getElementById("fall");
const roll = document.getElementById("roll");
const flip = document.getElementById("flip");
const table = document.getElementById("table");
const panel = document.getElementById("panel");
const start = document.getElementById("start");
const enter = document.getElementById("enter");

gsap.registerPlugin(Draggable);

Draggable.create("#table > *", {
    bounds: {top: 10, left: 10},
    onClick() {
        if (!this.target.classList.contains("clone")) {
            if (highlighting) highlighting.cancel();
            panel.className = this.target.className;
            highlighting = this.target.animate(
                [
                    {filter: "drop-shadow(0 0 0 rgb(255, 230, 120)) brightness(1)"},
                    {filter: "drop-shadow(0 0 5px rgba(255, 230, 120, 0.9)) brightness(1.2)"}
                ],
                {
                    duration: 750,
                    iterations: Infinity,
                    easing: "ease-in-out",
                    direction: "alternate"
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
    if (event.target === event.currentTarget && highlighting) {highlighting.cancel(); panel.removeAttribute("class");}
});

start.addEventListener("click", () => {
});

enter.addEventListener("click", () => {
});

[hand, fall].forEach(button => {
  button.addEventListener("click", () => {
    highlighting.effect.target.classList.toggle("hand");
    panel.className = highlighting.effect.target.className;
  });
});

roll.addEventListener("click", () => {
    const rollAnimation = setInterval(() => {
        highlighting.effect.target.setAttribute("src", `../assets/dices/${highlighting.effect.target.classList[1]}/${Math.floor(Math.random() * 6) + 1}.png`);
    }, 100);
    setTimeout(() => {clearInterval(rollAnimation);}, 1000);
});

flip.addEventListener("click", () => {
});