import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
// import io from 'socket.io-client';

// const socket = io('http://localhost:8000'); // Replace with your server URL
@ccclass('testServer')
export class testServer extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
}

console.log(window);