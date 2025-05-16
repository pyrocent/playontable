let ably = null;
let channel = null;
let roomId = null;
let clientId = null;
let playerName = "Anonymous";
let connectedPlayers = {};

const createRoomButton = document.getElementById("create-room-button");
const joinRoomButton = document.getElementById("join-room-button");
const roomIdInput = document.getElementById("room-id-input");
const playerNameInput = document.getElementById("player-name-input");
const dialogButton = document.getElementById("dialog-button");
const dialogOverlay = document.getElementById("dialog-overlay");
const roomInfo = document.getElementById("room-info");
const currentRoomIdSpan = document.getElementById("current-room-id");
const roomLinkInput = document.getElementById("room-link");
const copyLinkButton = document.getElementById("copy-link-button");
const playerList = document.getElementById("player-list");
const roomIndicator = document.getElementById("room-indicator");
const playerCount = document.getElementById("player-count");
const showRoomInfoButton = document.getElementById("show-room-info");
const roomStatusBar = document.getElementById("room-status-bar");

const urlParams = new URLSearchParams(window.location.search);
const roomParam = urlParams.get("room");

// Hide the room status bar initially
roomStatusBar.style.display = "none";

// Add event listeners
createRoomButton.addEventListener("click", createRoom);
joinRoomButton.addEventListener("click", joinRoom);
dialogButton.addEventListener("click", startPlaying);
playerNameInput.addEventListener("change", updatePlayerName);
copyLinkButton.addEventListener("click", copyRoomLink);
showRoomInfoButton.addEventListener("click", showRoomInfoDialog);

// If we have a room parameter in the URL, automatically join that room
if (roomParam) {
    roomIdInput.value = roomParam;
    // Generate a client ID if we don"t have one yet
    if (!clientId) {
        clientId = "user-" + Math.random().toString(36).substring(2, 10);
    }
    // Set the room ID
    roomId = roomParam;
    // Connect to Ably and join the room
    connectToAbly(roomParam);
    // Start playing automatically after a short delay to allow connection
    setTimeout(startPlaying, 1000);
}

// Create a new room
function createRoom() {
    // Generate a random room ID
    roomId = Math.random().toString(36).substring(2, 10);
    
    // Update the URL with the room ID
    updateURL(roomId);
    
    // Connect to Ably and join the room
    connectToAbly(roomId);
}

// Join an existing room
function joinRoom() {
    // Get the room ID from the input
    roomId = roomIdInput.value.trim();
    
    if (!roomId) {
        alert("Please enter a valid Room ID");
        return;
    }
    
    // Update the URL with the room ID
    updateURL(roomId);
    
    // Connect to Ably and join the room
    connectToAbly(roomId);
}

// Update the URL with the room ID
function updateURL(roomId) {
    const url = new URL(window.location.href);
    url.searchParams.set("room", roomId);
    window.history.pushState({}, "", url);
}

// Connect to Ably and join the room
function connectToAbly(roomId) {
    // Get the player name
    playerName = playerNameInput.value.trim() || "Anonymous";
    
    // Generate a unique client ID
    clientId = "user-" + Math.random().toString(36).substring(2, 10);
    
    // Initialize Ably with token authentication
    try {
        console.log("Connecting to Ably with client ID:", clientId);
        
        // Get the base URL for the API
        const baseUrl = window.location.origin;
        const authUrl = `${baseUrl}/api/createTokenRequest`;
        
        console.log("Using auth URL:", authUrl);
        
        ably = new Ably.Realtime({
            authUrl : authUrl,
            authParams : { clientId : clientId },
            autoConnect : true,
            logLevel : 4 // Verbose logging
        });
    } catch (error) {
        console.error("Error initializing Ably:", error);
        alert("Failed to connect to Ably. Please try again.");
    }
    
    // When connected to Ably
    ably.connection.on("connected", ()  = > {
        console.log("Connected to Ably!");
        
        // Subscribe to the room channel
        channel = ably.channels.get("room:" + roomId);
        
        // Subscribe to presence events
        channel.presence.subscribe("enter", (member)  = > {
            console.log("Member entered:", member);
            addPlayer(member);
            updatePlayerCount();
        });
        
        channel.presence.subscribe("leave", (member)  = > {
            console.log("Member left:", member);
            removePlayer(member);
            updatePlayerCount();
        });
        
        channel.presence.subscribe("update", (member)  = > {
            console.log("Member updated:", member);
            updatePlayer(member);
        });
        
        // Subscribe to card movement messages
        channel.subscribe("card:move", (message)  = > {
            handleCardMove(message.data);
        });
        
        // Subscribe to card flip messages
        channel.subscribe("card:flip", (message)  = > {
            handleCardFlip(message.data);
        });
        
        // Enter the presence set
        channel.presence.enter({
            name : playerName,
            clientId : clientId
        });
        
        // Get the current members in the room
        channel.presence.get((err, members)  = > {
            if (err) {
                console.error("Error getting presence members:", err);
                return;
            }
            
            // Clear the player list
            connectedPlayers = {};
            playerList.innerHTML = "";
            
            // Add each member to the player list
            members.forEach(member  = > {
                addPlayer(member);
            });
            
            updatePlayerCount();
        });
        
        // Show the room info
        showRoomDetails();
    });
    
    // Handle connection events
    ably.connection.on("failed", (err)  = > {
        console.error("Connection failed:", err);
        alert("Failed to connect to the room. Please try again.");
    });
    
    ably.connection.on("error", (err)  = > {
        console.error("Connection error:", err);
    });
    
    ably.connection.on("disconnected", ()  = > {
        console.log("Disconnected from Ably");
    });
    
    ably.connection.on("suspended", ()  = > {
        console.log("Connection suspended");
    });
}

// Add a player to the list
function addPlayer(member) {
    const data = member.data || {};
    const name = data.name || "Anonymous";
    const id = member.clientId;
    
    // Add to the connected players object
    connectedPlayers[id] = {
        name : name,
        id : id
    };
    
    // Update the player list
    updatePlayerList();
}

// Remove a player from the list
function removePlayer(member) {
    const id = member.clientId;
    
    // Remove from the connected players object
    delete connectedPlayers[id];
    
    // Update the player list
    updatePlayerList();
}

// Update a player"s information
function updatePlayer(member) {
    const data = member.data || {};
    const name = data.name || "Anonymous";
    const id = member.clientId;
    
    // Update the connected players object
    if (connectedPlayers[id]) {
        connectedPlayers[id].name = name;
    } else {
        connectedPlayers[id] = {
            name : name,
            id : id
        };
    }
    
    // Update the player list
    updatePlayerList();
}

// Update the player list in the UI
function updatePlayerList() {
    playerList.innerHTML = "";
    
    Object.values(connectedPlayers).forEach(player  = > {
        const li = document.createElement("li");
        li.textContent = player.name;
        if (player.id = = = clientId) {
            li.textContent + =  " (You)";
            li.style.fontWeight = "bold";
        }
        playerList.appendChild(li);
    });
}

// Update the player count in the UI
function updatePlayerCount() {
    const count = Object.keys(connectedPlayers).length;
    playerCount.textContent = `${count} player${count ! = = 1 ? "s" : ""} connected`;
}

// Show the room details in the UI
function showRoomDetails() {
    try {
        // Update the room ID display
        currentRoomIdSpan.textContent = roomId;
        
        // Update the room link
        // Use the runtime URL instead of the current window location
        const baseUrl = window.location.origin;
        console.log("Base URL for room link:", baseUrl);
        
        const roomLink = `${baseUrl}?room = ${roomId}`;
        console.log("Generated room link:", roomLink);
        
        roomLinkInput.value = roomLink;
        
        // Show the room info and hide the room controls
        roomInfo.style.display = "block";
        document.getElementById("room-controls").style.display = "none";
        
        // Show the start button
        dialogButton.style.display = "block";
        
        // Update the room indicator
        roomIndicator.textContent = `Room: ${roomId}`;
        
        // If we"re joining from a URL, automatically close the dialog after a short delay
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("room")) {
            console.log("Auto-starting game since room was specified in URL");
            // Force the dialog to be visible first to ensure it"s in the DOM
            dialogOverlay.style.display = "flex";
            // Then hide it after a short delay
            setTimeout(()  = > {
                console.log("Auto-closing dialog...");
                startPlaying();
            }, 1500);
        }
    } catch (error) {
        console.error("Error showing room details:", error);
    }
}

// Copy the room link to the clipboard
function copyRoomLink() {
    roomLinkInput.select();
    document.execCommand("copy");
    
    // Show a temporary message
    const originalText = copyLinkButton.textContent;
    copyLinkButton.textContent = "Copied!";
    setTimeout(()  = > {
        copyLinkButton.textContent = originalText;
    }, 2000);
}

// Update the player name
function updatePlayerName() {
    playerName = playerNameInput.value.trim() || "Anonymous";
    
    // Update the presence data if connected
    if (channel && channel.presence) {
        channel.presence.update({
            name : playerName,
            clientId : clientId
        });
    }
}

// Start playing the game
function startPlaying() {
    // Hide the dialog
    dialogOverlay.style.display = "none";
    
    // Show the room status bar
    roomStatusBar.style.display = "flex";
    
    console.log("Game started - dialog hidden");
}

// Show the room info dialog
function showRoomInfoDialog() {
    dialogOverlay.style.display = "flex";
    console.log("Room info dialog shown");
}

// Handle card movement from other players
function handleCardMove(data) {
    if (data.clientId = = = clientId) return; // Ignore our own movements
    
    const { cardId, x, y } = data;
    const card = document.querySelector(`[data-card-id = "${cardId}"]`);
    
    if (card) {
        gsap.set(card, { x : x, y : y });
    }
}

// Handle card flip from other players
function handleCardFlip(data) {
    if (data.clientId = = = clientId) return; // Ignore our own flips
    
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