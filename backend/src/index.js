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
        countSentData: 0
    }
}

let players = [];

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

    socket.on("user_send_hand", (handData) => {
        const player = players.find(_player => _player.id === socket.id);
        console.log(`=== Player ${player?.name} has send hand data ===`);

        player.handResult = [];
        handData.forEach((chi) => {
            player.handResult.push(detectAllCombinations(chi));
        });

        const playerRoom = rooms[player.room]
        playerRoom.countSentData++;
        if (playerRoom.countSentData == playerRoom.players.length) {
            handleGameResult(player.room);
        }
    });

});

function handleGameResult(roomName) {
    const roomPlayers = rooms[roomName].players;
    let result = [];

    let allFirstChi = roomPlayers.map(player => ({ cardRank: player.handResult[0].cardRank, id: player.id })).sort((a, b) => a.cardRank - b.cardRank);
    let allSecondChi = roomPlayers.map(player => ({ cardRank: player.handResult[1].cardRank, id: player.id })).sort((a, b) => a.cardRank - b.cardRank);
    let allThirdChi = roomPlayers.map(player => ({ cardRank: player.handResult[2].cardRank, id: player.id })).sort((a, b) => a.cardRank - b.cardRank);

    result = [allFirstChi.pop(), allSecondChi.pop(), allThirdChi.pop()];

    let winnerEachChi = result.map(({ id }) => { return roomPlayers.find(_player => _player.id === id) });

    io.in(roomName).emit("on_game_result", winnerEachChi);
}

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

function handleUserLeaveRoom(player, roomName) {
    const roomMsg = `=== Player ${player?.name} has left the room ===`;

    players = players.filter(o => o.id !== player.id);
    rooms[roomName].players = rooms[roomName].players.filter(o => o.id !== player.id);

    io.to(_roomName).emit("on_user_leave_room", { roomInfo: getRoomInfo(_roomName), roomMsg, player });
}

function getRoomInfo(roomName) {
    const players = rooms[roomName].players.map(player => player?.name);
    const roomInfo = Object.assign({}, { roomName, players });
    return roomInfo;
}