import { MauBinhPlayerManager } from './MauBinhPlayerManager';
import { getDeck, shuffle } from '../utils';
import {
    _decorator, Component, Node, v3, resources,
    SpriteFrame, error, instantiate, Sprite, Prefab,
    Label, Button
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MauBinhGameManager')
export class MauBinhGameManager extends Component {

    @property(Node) player: MauBinhPlayerManager;
    @property(Prefab) cardPrefab: Prefab;
    @property(Button) readyBtn: Button;
    @property(Label) countDownTimer: Label;

    _socket: any;

    protected onLoad(): void {
        this.player = this.player?.getComponent(MauBinhPlayerManager);
        // @ts-ignore
        this._socket = window.io('http://localhost:3000');
    }

    protected start(): void {
        try {
            this.initSocket();
            this.readyBtn.interactable = true;
        } catch (err) {
            if (err) console.log("Go Offline mode");
            this.readyBtn.interactable = false;
            this.gameStart(getDeck(true));
        }
    }

    gameStart(data) {
        const { gameStartTimeout, playerHand } = data;

        this.startCountDown(gameStartTimeout);
        this.loadHand(playerHand)
            .then((result) => {
                this.player.setPlayerHand(result);
            })
    }

    startCountDown(time) {
        let _time = time;
        this.countDownTimer.string = `Time: ${_time}`;

        const updateTime = () => {
            _time--;
            this.countDownTimer.string = `Time: ${_time}`;
        }

        this.schedule(() => {
            if (_time <= 0) {
                this.unschedule(updateTime);
            } else {
                updateTime();
            }
        }, 1);

    }

    loadHand(hand) {
        let allPromises = [];

        hand.forEach(card => {
            const { value, suit } = card;
            let assetName = suit + "_" + value;
            allPromises.push(
                new Promise((resolve, reject) => {
                    resources.load(`cards/${suit}/${assetName}/spriteFrame`, SpriteFrame, (err, asset) => {
                        if (err) return reject(error(err.message));

                        const node = instantiate(this.cardPrefab);
                        node.getComponent(Sprite).spriteFrame = asset;
                        node.name = assetName;
                        card.cardNode = node;
                        resolve(card);
                    });
                })
            )
        })

        return Promise.all(allPromises)
            .then((result) => {
                return result;
            });
    }

    onClickReady() {
        this._socket.emit('client_event', { event: "game-ready" });
        this.readyBtn.interactable = false;
    }

    initSocket() {
        if (!this._socket) throw new Error("Socket was not inited");

        this._socket.on('connect', this.onConnect.bind(this));
        this._socket.on('server_event', this.onServerEvent.bind(this));
    }

    onConnect() {
        console.log('Connected to server!');
        this._socket.emit('client_event', { user: "kakalak" });
    }

    onServerEvent(data) {
        const { event, eventData } = data;

        switch (event) {
            case "game-start":
                console.log("[ServerEvent] game start", data);
                this.gameStart(eventData);
                break;
            case "game-start-timeout":
                console.log("[ServerEvent] game start timeout", data);
                this.sendPlayerHandData();
                break;
        }

    }

    sendPlayerHandData() {
        const handData = this.player.getHandData();
        const request = { event: "game-result", data: { handData } };

        this._socket.emit("client_event", request);
    }

}