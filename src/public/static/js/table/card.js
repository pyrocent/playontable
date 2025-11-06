export function cardConfig() {
    return {
        bounds: {top: 10, left: 10},
        onRelease() {if (this.PressTimer) this.PressTimer.kill();},
        onPress() {
            this.PressTimer = gsap.delayedCall(0.75, () => {
                this.Press = true;
                this.target.classList.toggle("hand");
            });
        },
        onClick() {
            if (this.Press) this.Press = false;
            else {}
        },
        onDrag() {
            if (this.PressTimer) this.PressTimer.kill();
            if (room) room.send("drag", {x: this.x, y: this.y, zIndex: getComputedStyle(this.target).zIndex, dragIndex: [...this.target.parentElement.children].indexOf(this.target)});
        },
        onDragStart() {
            console.log("ww");
            this.target.classList.toggle("dragging");},
        onDragEnd() {this.target.classList.toggle("dragging");}
    };
}