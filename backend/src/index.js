import { createServer } from "http";
import { Server } from "socket.io";
import { getDeck, shuffle } from "./utils.js";

const httpServer = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!');
});

const io = new Server(httpServer);
httpServer.listen(3000, () => console.log('Server listening on port 3000'));

io.on('connection', (socket) => {
    console.log('Client connected!');

    socket.on('client_event', (data) => {
        console.log('Received data from client:', data);
        const { event } = data;
        switch (event) {
            case "game-ready":
                console.log("[ClientEvent] game ready");
                socket.emit('server_event', handleGameReady());
                break;
        }

    });

    socket.emit('server_event', { message: 'Welcome!' });
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

    return { event: "game-start", eventData: playerHand };
}
