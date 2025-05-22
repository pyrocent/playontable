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
                            <li>Drag anything to move anywhere</li>
                            <li>Hold down it to take in your hand</li>
                            <li>Things in hand have a red border</li>
                            <li>Only you can see your own hand</li>
                        </ul>
                    `,
                    side: "bottom",
                    align: "center"
                },
            },
            {
                element: "#decks",
                popover: {
                    title: "Decks",
                    description: `
                        <ul>
                            <li>Decks are already pre-shuffled</li>
                            <li>Tap cards to turn face up/down</li>
                        </ul>
                    `,
                    side: "right",
                    align: "center"
                },
            },
            {
                element: "#chips",
                popover: {
                    title: "Chips",
                    description: `
                        <ul>
                            <li>Use as many chips as you want</li>
                        </ul>
                    `,
                    side: "right",
                    align: "center"
                },
            },
        ],
        onDestroyed() {
            onDestroyedCallback();
        }
    });

    tutorial.drive();
}