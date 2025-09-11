import {initRoom} from "./room.js";
import {startTutorial} from "./tutorial.js";
import {PixiGameRenderer} from "./pixiRenderer.js";
import {nanoid} from "https://cdn.jsdelivr.net/npm/nanoid@5.1.5/+esm";
// Vercel Analytics rimosso temporaneamente per debug PIXI

const roomCode = nanoid(6);
const mainMenu = document.getElementById("menu");
const waitRoom = document.getElementById("wait-room");
const waitHost = document.getElementById("wait-host");
const joinCode = document.getElementById("join-code");
const showCode = document.getElementById("show-code");
const copyCode = document.getElementById("copy-code");

// Mostra il menu principale all'avvio
mainMenu.showModal();

// Aggiunge l'evento per il tutorial
document.getElementById("start-tutorial").addEventListener("click", () => {
    mainMenu.close();
    startTutorial();
});

mainMenu.addEventListener("close", () => {
    if (mainMenu.returnValue === "wait-room") {
        showCode.innerText = roomCode;
        copyCode.onclick = () => {
            // Animate the copy button
            copyCode.classList.add('copied');
            copyCode.innerHTML = '✓';
            
            // Animate the code text
            showCode.classList.add('copying');
            showCode.innerText = "Copied!";
            
            // Copy to clipboard
            navigator.clipboard.writeText(roomCode);
            
            // Reset after animation
            setTimeout(() => {
                copyCode.classList.remove('copied');
                copyCode.innerHTML = '📋';
                showCode.classList.remove('copying');
                showCode.innerText = roomCode;
            }, 1500);
        };
        waitRoom.showModal();
    } else if (mainMenu.returnValue === "join-room") {
        // Inizializza PIXI in background per join room
        (async () => {
            try {
                const gameContainer = document.getElementById("game-container");
                const pixiRenderer = new PixiGameRenderer(gameContainer);
                await pixiRenderer.init();
                window.pixiRenderer = pixiRenderer;
            } catch (error) {
                console.error("Errore inizializzazione PIXI per join:", error);
            }
        })();
        
        // Avvia il tutorial prima di entrare nella stanza
        startTutorial(() => {
            const roomConnection = initRoom(joinCode.value);
            if (roomConnection && roomConnection.send) {
                // Aspetta che la connessione sia stabilita prima di inviare
                setTimeout(() => waitHost.showModal(), 100);
            } else {
                waitHost.showModal();
            }
        });
    }
});

waitRoom.addEventListener("close", async () => {
    try {
        // Inizializza il renderer PIXI e attende che sia pronto
        const gameContainer = document.getElementById("game-container");
        const pixiRenderer = new PixiGameRenderer(gameContainer);
        await pixiRenderer.init(); // Attende inizializzazione
        window.pixiRenderer = pixiRenderer; // Rende disponibile globalmente
        
        startTutorial(() => {
            const roomConnection = initRoom(roomCode);
            if (roomConnection && roomConnection.send) {
                roomConnection.send("play");
            }
        });
    } catch (error) {
        console.error("Errore inizializzazione PIXI:", error);
    }
});