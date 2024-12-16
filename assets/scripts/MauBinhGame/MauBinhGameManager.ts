import { MauBinhPlayerManager } from './MauBinhPlayerManager';
import { getDeck, shuffle } from '../utils';
import {
    _decorator, Component, Node, v3, resources,
    SpriteFrame, error, instantiate, Sprite, Prefab
} from 'cc';
import { Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MauBinhGameManager')
export class MauBinhGameManager extends Component {

    @property(Node) player: MauBinhPlayerManager;
    @property(Prefab) cardPrefab: Prefab;
    @property(Button) readyBtn: Button;

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

        this.loadHand(data)
            .then((result) => {
                this.player.setPlayerHand(result);
            })
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
        }

    }

}