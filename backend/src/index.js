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
        players: []
    }
}

let players = []

console.clear();
io.on('connection', (socket) => {
    console.log('=== New Socket Init ===');

    // const roomSize = io.sockets.adapter.rooms.get(roomId).size;
    // console.log(`Room ${roomId} has ${roomSize} sockets.`);

    socket.on("new_user", (playerName) => {
        console.log(`Player ${playerName} has connected !`);
        const player = {
            name: playerName,
            id: socket.id
        };
        players.push(player);
        console.log(players);
    });

    socket.on("disconnect", () => {
        const player = players.find(player => player.id === socket.id);
        players = players.filter(player => player.id !== socket.id);

        const roomPlayers = rooms[_roomName].players.slice();
        rooms[_roomName].players = roomPlayers.filter(player => player.id !== socket.id);

        const roomMsg = `=== Player ${player?.name} has left the room ===`;

        console.log(`Player ${player?.name} has disconnected !`);
        io.to(_roomName).emit("on_user_leave_room", { roomInfo: getRoomInfo(_roomName), roomMsg, player });
    });

    socket.on("join_room", (roomName, callback) => {
        let roomSize

        try {
            roomSize = io.sockets.adapter.rooms.get(roomName).size;
        } catch (err) {
            console.log(`There is no room ${roomName}`);
        }

        const player = players.find(player => player.id === socket.id);
        if (rooms[roomName]) {
            rooms[roomName].players.push(player);
        }

        let roomMsg = "";
        if (roomSize == 2) {
            roomMsg = "=== Game can start now ===";
        } else {
            roomMsg = "=== Waiting for players ===";
        }
        socket.join(roomName);

        io.to(roomName).emit("on_user_join_room", { roomInfo: getRoomInfo(_roomName), roomMsg, player });
    });

});

function handleGameReady() {
    const mauBinhDeck = getDeck(true);

    const deckLength = mauBinhDeck.length;
    shuffle(mauBinhDeck);

    let playerHand = [];
    for (let i = 0; i < deckLength; i++) {
        if (i % 4 == 0) {
            playerHand.push(mauBinhDeck.pop());
        }
    }

    return { event: "game-start", eventData: { playerHand } };
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