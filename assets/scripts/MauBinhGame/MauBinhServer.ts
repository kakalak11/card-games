import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MauBinhServer')
export class MauBinhServer extends Component {

    _socket: any;

    protected onLoad(): void {
        // @ts-ignore
        this._socket = window.io('http://localhost:3000');
    }

    start() {
        if (!this._socket) throw new Error("Socket was not inited");

        this._socket.on('connect', this.onConnect.bind(this));
        this._socket.on('server_event', this.onServerEvent.bind(this));
    }

    onConnect() {
        console.log('Connected to server!');

        // Emit events to the server
        this._socket.emit('client_event', { someData: 'value', user: "kakalak" });
    }

    onServerEvent(data) {
        console.log('Received data from server:', data);

    }
}
