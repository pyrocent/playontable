export function otherConfig() {
    return {
        bounds: {top: 10, left: 10},
        onRelease() {if (this.PressTimer) this.PressTimer.kill();},
        onPress() {
            this.PressTimer = gsap.delayedCall(0.75, () => {
                this.Press = true;
                this.target.classList.toggle("hand");
            });
        },
        onClick() {if (this.Press) this.Press = false;},
        onDrag() {
            if (this.PressTimer) this.PressTimer.kill();
            if (room) room.send("drag", {x: this.x, y: this.y, zIndex: getComputedStyle(this.target).zIndex, dragIndex: [...this.target.parentElement.children].indexOf(this.target)});
        }
    };
}