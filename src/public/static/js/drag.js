import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/Draggable/+esm";

export function makeDraggable(what, room) {

    gsap.registerPlugin(Draggable);
    Draggable.create(what, {
        bounds: {top: 10, left: 10},
        onPress() {
            if (!this.target.classList.contains("clone")) {
                this._holdCall = gsap.delayedCall(0.5, () => {
                    this._justHeld = true;
                    const hand = this.target.classList.toggle("hand");
                    room.send("hide", {hand, index: [...this.target.parentElement.children].indexOf(this.target)});
                });
            }
        },
        onRelease() {
            if (this._holdCall) this._holdCall.kill();
        },
        onClick() {
            if (this.target.classList.contains("card")) {
                if (this._justHeld) this._justHeld = false;
                else room.send("turn", {random: Math.random(), index: [...this.target.parentElement.children].indexOf(this.target)});
            }
        },
        onDragStart() {
            if (this._holdCall) this._holdCall.kill();
            else if (this.target.classList.contains("clone")) {
                room.send("chip", {src: this.target.src, classes: this.target.className, alt: this.target.alt});
                this.target.classList.remove("clone");
            }
        },
        onDrag() {
            room.send("drag", {
                x: this.x, y: this.y, zIndex: getComputedStyle(this.target).zIndex,
                index: [...this.target.parentElement.children].indexOf(this.target)
            });
        }
    });
}