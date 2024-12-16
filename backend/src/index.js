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

io.on('connection', (socket) => {
    console.log('Client connected!');
    if (gameResultTimeOutId) {
        clearTimeout(gameResultTimeOutId);
    }

    socket.on('client_event', (response) => {
        console.log('Received response from client:', response);
        const { event } = response;
        switch (event) {
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

    socket.emit('server_event', { message: 'Welcome!' });
});

io.on("disconnect", (socket) => {
    console.log('Client disconnected!');

    if (gameResultTimeOutId) {
        clearTimeout(gameResultTimeOutId);
    }
})

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
