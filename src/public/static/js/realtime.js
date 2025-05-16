let ably = null;
let roomId = null;
let channel = null;
let clientId = null;
let connectedPlayers = {};
let playerName = "Anonymous";

const roomInfo = document.getElementById("room-info");
const playerList = document.getElementById("player-list");
const roomLinkInput = document.getElementById("room-link");
const playerCount = document.getElementById("player-count");
const roomIdInput = document.getElementById("room-id-input");
const dialogButton = document.getElementById("dialog-button");
const dialogOverlay = document.getElementById("dialog-overlay");
const roomIndicator = document.getElementById("room-indicator");
const roomStatusBar = document.getElementById("room-status-bar");
const joinRoomButton = document.getElementById("join-room-button");
const copyLinkButton = document.getElementById("copy-link-button");
const playerNameInput = document.getElementById("player-name-input");
const currentRoomIdSpan = document.getElementById("current-room-id");
const showRoomInfoButton = document.getElementById("show-room-info");
const createRoomButton = document.getElementById("create-room-button");

const urlParams = new URLSearchParams(window.location.search);
const roomParam = urlParams.get("room");

roomStatusBar.style.display = "none";

joinRoomButton.addEventListener("click", joinRoom);
dialogButton.addEventListener("click", startPlaying);
createRoomButton.addEventListener("click", createRoom);
copyLinkButton.addEventListener("click", copyRoomLink);
playerNameInput.addEventListener("change", updatePlayerName);
showRoomInfoButton.addEventListener("click", showRoomInfoDialog);

function createRoom() {
    roomId = Math.random().toString(36).substring(2, 10);
    updateURL(roomId);
}

function joinRoom() {
    roomId = roomIdInput.value.trim();
    updateURL(roomId);
}

function updateURL(roomId) {
    const url = new URL(window.location.href);
    url.searchParams.set("room", roomId);
    window.history.pushState({}, "", url);
    connectToAbly(roomId);
}

if (roomParam) {
    roomIdInput.value = roomParam;
    if (!clientId) {
        clientId = "user-" + Math.random().toString(36).substring(2, 10);
    }
    roomId = roomParam;
    connectToAbly(roomParam);
    setTimeout(startPlaying, 1000);
}

function connectToAbly(roomId) {
    playerName = playerNameInput.value.trim() || "Anonymous";
    clientId = "user-" + Math.random().toString(36).substring(2, 10);

    const baseUrl = window.location.origin;
    const authUrl = `${baseUrl}/api/createTokenRequest`;

    ably = new Ably.Realtime({
        logLevel : 4,
        authUrl : authUrl,
        autoConnect : true,
        authParams : { clientId : clientId }
    });

    ably.connection.on("connected", () => {

        channel = ably.channels.get("room:" + roomId);

        channel.presence.subscribe("enter", (member) => {
            addPlayer(member);
            updatePlayerCount();
        });

        channel.presence.subscribe("leave", (member) => {
            removePlayer(member);
            updatePlayerCount();
        });

        channel.presence.subscribe("update", (member) => {
            updatePlayer(member);
        });

        channel.subscribe("card:move", (message) => {
            handleCardMove(message.data);
        });

        channel.subscribe("card:flip", (message) => {
            handleCardFlip(message.data);
        });

        channel.presence.enter({
            name : playerName,
            clientId : clientId
        });

        channel.presence.get((err, members) => {
            
            connectedPlayers = {};
            playerList.innerHTML = "";

            members.forEach(member => {
                addPlayer(member);
            });

            updatePlayerCount();
        });

        showRoomDetails();
    });
}

function addPlayer(member) {
    const data = member.data || {};
    const name = data.name || "Anonymous";
    const id = member.clientId;

    connectedPlayers[id] = {
        name : name,
        id : id
    };
    updatePlayerList();
}

function removePlayer(member) {
    const id = member.clientId;
    delete connectedPlayers[id];
    updatePlayerList();
}

function updatePlayer(member) {
    const data = member.data || {};
    const name = data.name || "Anonymous";
    const id = member.clientId;

    if (connectedPlayers[id]) {
        connectedPlayers[id].name = name;
    } else {
        connectedPlayers[id] = {
            name : name,
            id : id
        };
    }
    updatePlayerList();
}

function updatePlayerList() {
    playerList.innerHTML = "";

    Object.values(connectedPlayers).forEach(player => {
        const li = document.createElement("li");
        li.textContent = player.name;
        if (player.id === clientId) {
            li.textContent +=  " (You)";
            li.style.fontWeight = "bold";
        }
        playerList.appendChild(li);
    });
}

function updatePlayerCount() {
    const count = Object.keys(connectedPlayers).length;
    playerCount.textContent = `${count} player${count !== 1 ? "s" : ""} connected`;
}

function showRoomDetails() {
    try {
        currentRoomIdSpan.textContent = roomId;
        const baseUrl = window.location.origin;
        
        const roomLink = `${baseUrl}?room = ${roomId}`;
        
        roomLinkInput.value = roomLink;
        
        roomInfo.style.display = "block";
        document.getElementById("room-controls").style.display = "none";
        
        dialogButton.style.display = "block";
        
        roomIndicator.textContent = `Room: ${roomId}`;
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("room")) {
            dialogOverlay.style.display = "flex";
            setTimeout(() => {
                startPlaying();
            }, 1500);
        }
    } catch (error) {
        console.error("Error showing room details:", error);
    }
}

function copyRoomLink() {
    roomLinkInput.select();
    document.execCommand("copy");
    
    const originalText = copyLinkButton.textContent;
    copyLinkButton.textContent = "Copied!";
    setTimeout(() => {
        copyLinkButton.textContent = originalText;
    }, 2000);
}

function updatePlayerName() {
    playerName = playerNameInput.value.trim() || "Anonymous";
    
    if (channel && channel.presence) {
        channel.presence.update({
            name : playerName,
            clientId : clientId
        });
    }
}

function startPlaying() {
    dialogOverlay.style.display = "none";
    roomStatusBar.style.display = "flex";
}

function showRoomInfoDialog() {
    dialogOverlay.style.display = "flex";
}

function handleCardMove(data) {
    if (data.clientId === clientId) return;
    const { cardId, x, y } = data;
    const card = document.querySelector(`[data-card-id = "${cardId}"]`);
    
    if (card) {
        gsap.set(card, { x : x, y : y });
    }
}

function handleCardFlip(data) {
    if (data.clientId === clientId) return;
    const { cardId, src, dataFace } = data;
    const card = document.querySelector(`[data-card-id = "${cardId}"]`);
    
    if (card) {
        card.setAttribute("src", src);
        if (dataFace) {
            card.setAttribute("data-face", dataFace);
        } else {
            card.removeAttribute("data-face");
        }
    }
}