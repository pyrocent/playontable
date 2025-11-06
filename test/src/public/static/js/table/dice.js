export function diceConfig() {
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
            else {
                const rollAnimation = setInterval(() => {
                    const randomNumber = Math.floor(Math.random() * 6) + 1
                    this.target.setAttribute("src", `https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/dice/${randomNumber}.png`);
                    if (room) room.send("dice", {randomNumber});
                }, 100);
                setTimeout(() => {clearInterval(rollAnimation);}, 1000);
            }
        },
        onDrag() {
            if (this.PressTimer) this.PressTimer.kill();
            if (room) room.send("drag", {x: this.x, y: this.y, zIndex: getComputedStyle(this.target).zIndex, dragIndex: [...this.target.parentElement.children].indexOf(this.target)});
        }
    };
}