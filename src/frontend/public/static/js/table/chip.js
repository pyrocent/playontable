export function chipConfig() {
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
        },
        onDragEnd() {
            const chip = this.target;
            const clone = document.createElement("img");
            clone.src = chip.src;
            clone.alt = chip.alt;
            clone.classList = chip.classList;
            clone.draggable = false;

            table.appendChild(clone);
            Draggable.create(clone, this.vars);

            this.target.classList.remove("clone");
            Draggable.create(this.target, {
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
                },
                onDragStart() {this.target.draggable = false;}
            });
        }
    };
}