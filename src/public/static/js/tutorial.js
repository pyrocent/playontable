import {driver} from "https://cdn.jsdelivr.net/npm/driver.js@1.3.6/+esm";

export function startTutorial(onDestroyedCallback = () => {}) {

    const tutorial = driver({
        prevBtnText: "⬅️",
        nextBtnText: "➡️",
        doneBtnText: "❌",
        steps: [
            {
                element: "#table",
                popover: {
                    title: "Table",
                    description: `
                        <ul>
                            <li><strong>Drag anything to move anywhere</strong></li>
                            <li><strong>Hold down it to take in your hand</strong></li>
                            <li><strong>Things in hand have a red border</strong></li>
                            <li><strong>Only you can see your own hand</strong></li>
                        </ul>
                    `,
                    side: "bottom",
                    align: "center"
                }
            },
            {
                element: "#decks-tutorial",
                popover: {
                    title: "Decks",
                    description: `
                        <ul>
                            <li><strong>Decks have already pre-shuffled</strong></li>
                            <li><strong>Click cards to turn face up/down</strong></li>
                        </ul>
                    `,
                    side: "bottom",
                    align: "center"
                }
            },
            {
                element: "#jolly-tutorial",
                popover: {
                    title: "Jolly Decks",
                    description: `
                        <ul>
                            <li><strong>Each has 1 red and 1 blue jolly</strong></li>
                        </ul>
                    `,
                    side: "bottom",
                    align: "center"
                }
            },
            {
                element: "#chips-tutorial",
                popover: {
                    title: "Chips",
                    description: `
                        <ul>
                            <li><strong>Use as many chips as you want</strong></li>
                        </ul>
                    `,
                    side: "right",
                    align: "center"
                }
            }
        ],
        onDestroyed() {
            onDestroyedCallback();
        }
    });

    tutorial.drive();
}