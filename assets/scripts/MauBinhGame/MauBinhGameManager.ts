import { MauBinhPlayerManager } from './MauBinhPlayerManager';
import { getDeck, shuffle } from '../utils';
import {
    _decorator, Component, Node, v3, resources,
    SpriteFrame, error, instantiate, Sprite, Prefab,
    Label, Button
} from 'cc';
import { MauBinhRoomInfo } from './MauBinhRoomInfo';
const { ccclass, property } = _decorator;

const ROOM_NAME = "MauBinhForever";

@ccclass('MauBinhGameManager')
export class MauBinhGameManager extends Component {

    @property(Node) player: MauBinhPlayerManager;
    @property(Node) roomInfo: MauBinhRoomInfo;
    @property(Prefab) cardPrefab: Prefab;
    @property(Button) readyBtn: Button;
    @property(Label) countDownTimer: Label;

    _socket: any;
    _playerName: string;

    protected onLoad(): void {
        this.player = this.player?.getComponent(MauBinhPlayerManager);
        this.roomInfo = this.roomInfo?.getComponent(MauBinhRoomInfo);
        // @ts-ignore
        this._socket = window.io('http://localhost:3000');
        const randomNames = ["kakalak", "hihi", "haha", "foo", "bar"];
        this._playerName = randomNames[Math.floor(Math.random() * randomNames.length)] ;
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
        this._socket.emit('client_event', { event: "player-ready" });
        this.readyBtn.interactable = false;
    }

    onJoinRoom() {
        this._socket.emit("join_room", ROOM_NAME);
    }

    onUserJoinRoom({ roomInfo, roomMsg, player }) {
        if (player.name !== this._playerName) {
            console.log(`=== Player ${player.name} has entered the room ===`);
        }
        console.log(roomMsg);
        this.roomInfo.updateRoomInfo(roomInfo);
    }

    onUserLeaveRoom({ roomInfo, roomMsg, player }) {
        if (player.name !== this._playerName) {
            console.log(`=== Player ${player.name} has left the room ===`);
        }
        console.log(roomMsg);
        this.roomInfo.updateRoomInfo(roomInfo);
    }

    initSocket() {
        if (!this._socket) throw new Error("Socket was not inited");

        this._socket.on('server_event', this.onServerEvent.bind(this));
        this._socket.on('on_user_join_room', this.onUserJoinRoom.bind(this));
        this._socket.on("on_user_leave_room", this.onUserLeaveRoom.bind(this));

        this._socket.emit("new_user", this._playerName);
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

    protected onDestroy(): void {
        if (this._socket) this._socket.disconnect();
    }
}