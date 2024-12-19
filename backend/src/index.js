import { createServer } from "http";
import { Server } from "socket.io";
import { detectAllCombinations, getDeck, shuffle } from "./utils.js";

const httpServer = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!');
});

const io = new Server(httpServer);
httpServer.listen(3000, () => console.log('Server listening on port 3000'));

let gameResultTimeOutId;
let _roomName = "MauBinhForever";
let rooms = {
    "MauBinhForever": {
        players: [],
    }
}

let players = []

console.clear();
io.on('connection', (socket) => {
    console.log('=== New Socket Init ===');

    socket.on("new_user", (playerName) => {
        console.log(`Player ${playerName} has connected !`);
        const player = {
            name: playerName,
            id: socket.id,
            isReady: false,
            hand: []
        };
        players.push(player);
    });

    socket.on("disconnect", (reason) => {
        const player = players.find(o => o.id === socket.id);

        console.log(`=== Player ${player?.name} has disconnected ===`);
        console.log(`=== Reason: ${reason} ===`);

        if (socket.rooms.has(_roomName)) {
            handleUserLeaveRoom(player, _roomName);
        }
    });

    socket.on("join_room", (roomName, callbackError) => {

        const player = players.find(player => player.id === socket.id);

        if (socket.rooms.has(roomName)) {
            return callbackError("=== Player already in this room ===");
        }

        if (rooms[roomName]) {
            rooms[roomName].players.push(player);
            player.room = roomName;
        }
        socket.join(roomName);
        const roomInfo = getRoomInfo(roomName);
        console.log(roomInfo);

        io.to(roomName).emit("on_user_join_room", { roomInfo, player });
    });

    socket.on("leave_room", (roomName) => {
        const player = players.find(_player => _player.id === socket.id);
        player.room = null;
        handleUserLeaveRoom(player, roomName);
    });

    socket.on("user_ready_game", (callbackError) => {
        const player = players.find(_player => _player.id === socket.id);

        if (player.room == null) {
            return callbackError("=== Player is not in any game room ===");
        } else {
            player.isReady = true;
        }

        const minReadyNums = 2;
        const readyNums = rooms[player.room].players.filter(player => player.isReady).length;

        if (readyNums >= minReadyNums) {
            handleGameStart(player.room);
        } else {
            io.to(player.room).emit("on_notify_game_state", `=== Waiting for ${minReadyNums - readyNums} more players for game to start ===`);
        }
    });

});

function handleGameStart(roomName) {
    const mauBinhDeck = getDeck(true);
    const deckLength = mauBinhDeck.length;
    const roomPlayers = rooms[roomName].players;

    for (let i = 0; i < deckLength; i++) {
        const currIndex = i % 4;
        if (currIndex > roomPlayers.length - 1) {
            mauBinhDeck.pop()
            continue;
        }
        roomPlayers[currIndex].hand.push(mauBinhDeck.pop());
    }

    io.in(roomName).fetchSockets().then(sockets => {
        sockets.forEach(socket => {
            const playerHand = roomPlayers.find(player => player.id == socket.id).hand;
            socket.emit("on_user_deal_cards", playerHand);
        })
    })
}

function handleGameReady() {
    const mauBinhDeck = getDeck(true);
    const deckLength = mauBinhDeck.length;

    let playerHand = [];


    return { event: "game-start", eventData: { playerHand } };
}

function handleUserLeaveRoom(player, roomName) {
    const roomMsg = `=== Player ${player?.name} has left the room ===`;

    players = players.filter(o => o.id !== player.id);
    rooms[roomName].players = rooms[roomName].players.filter(o => o.id !== player.id);

    io.to(_roomName).emit("on_user_leave_room", { roomInfo: getRoomInfo(_roomName), roomMsg, player });
}

function handleGameResult(response) {
    const { data } = response;


    data.handData.forEach(chi => {
        console.log(detectAllCombinations(chi));
    })
}

function getRoomInfo(roomName) {
    const players = rooms[roomName].players.map(player => player?.name);
    const roomInfo = Object.assign({}, { roomName, players });
    return roomInfo;
}

/*
socket.on('client_event', (response) => {
        console.log('Received response from client:', response, socket.id);
        const { event } = response;
        switch (event) {
            case "player-ready":
                countReady++;
                console.log("[ClientEvent] player ready ", countReady);
                if (countReady !== roomSize) {
                    break;
                }

            case "game-ready":
                console.log("[ClientEvent] game ready");
                const gameStartTimeout = 5;
                const _response = handleGameReady();

                _response.eventData = Object.assign(_response.eventData, { gameStartTimeout });

                socket.emit('server_event', _response);
                gameResultTimeOutId = setTimeout(() => {
                    socket.emit('server_event', { event: "game-start-timeout" });
                }, gameStartTimeout * 1000);
                break;

            case "game-result":
                console.log("[ClientEvent] game result");
                handleGameResult(response);
                break;
        }

    });
*/