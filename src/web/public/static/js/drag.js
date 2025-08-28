import {getRoom} from "./room.js";
import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";

gsap.registerPlugin(Draggable);

export function makeDraggable(toBeDrag) {

    const room = getRoom();

    Draggable.create(toBeDrag, {
        bounds: {top: 10, left: 10},
        onPress() {
            if (!this.target.classList.contains("clone")) {
                this._holdCall = gsap.delayedCall(0.5, () => {
                    this._justHeld = true;
                    room.send("hide", {hand: this.target.classList.toggle("hand"), hideIndex: [...this.target.parentElement.children].indexOf(this.target)});
                });
            }
        },
        onRelease() {
            if (this._holdCall) this._holdCall.kill();
        },
        onClick() {
            if (this.target.classList.contains("card")) {
                if (this._justHeld) this._justHeld = false
                else room.send("turn", {randomNumber: Math.random(), cardIndex: [...this.target.parentElement.children].indexOf(this.target)})
            }
        },
        onDragStart() {
            if (this._holdCall) this._holdCall.kill()
            else if (this.target.classList.contains("clone")) {
                room.send("chip", {src: this.target.src, classes: this.target.className, alt: this.target.alt});
                this.target.classList.remove("clone");
            }
        },
        onDrag() {
            room.send("drag", {
                x: this.x, y: this.y, z: getComputedStyle(this.target).zIndex,
                dragIndex: [...this.target.parentElement.children].indexOf(this.target)
            });
        }
    });
}