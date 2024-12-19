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
    @property(Label) countDownTimer: Label;

    @property(Button) readyBtn: Button;
    @property(Button) joinRoomBtn: Button;
    @property(Button) leaveRoomBtn: Button;


    _socket: any;
    _playerName: string;

    protected onLoad(): void {
        this.player = this.player?.getComponent(MauBinhPlayerManager);
        this.roomInfo = this.roomInfo?.getComponent(MauBinhRoomInfo);
        // @ts-ignore
        this._socket = window.io('http://localhost:3000');
        const randomNames = ["kakalak", "hihi", "haha", "foo", "bar"];
        this._playerName = randomNames[Math.floor(Math.random() * randomNames.length)];
    }

    protected start(): void {
        this.joinRoomBtn.interactable = true;
        this.leaveRoomBtn.interactable = false;
        this.readyBtn.interactable = true;
        this.initSocket();
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

    readyClick() {
        this._socket.emit("user_ready_game");
        this.readyBtn.interactable = false;
    }

    joinRoomClick() {
        this._socket.emit("join_room", ROOM_NAME, (reason) => {
            console.log(reason);
            this.joinRoomBtn.interactable = true;
            this.leaveRoomBtn.interactable = false;
        });
        this.joinRoomBtn.interactable = false;
    }

    leaveRoomClick() {
        this._socket.emit("leave_room", ROOM_NAME);
        this.leaveRoomBtn.interactable = false;
    }

    onUserJoinRoom({ roomInfo, player }) {
        const isMe = player.name == this._playerName;
        if (isMe) {
            this.leaveRoomBtn.interactable = true;
            this.joinRoomBtn.interactable = false;
        } else {
            console.log(`=== Player ${player.name} has entered the room ===`);
        }

        this.roomInfo.updateRoomInfo(roomInfo);
    }

    onUserLeaveRoom({ roomInfo, roomMsg, player }) {
        const isMe = player.name == this._playerName;
        if (isMe) {
            this.leaveRoomBtn.interactable = false;
            this.joinRoomBtn.interactable = true;
            this.roomInfo.resetRoomInfo();
        } else {
            console.log(`=== Player ${player.name} has left the room ===`);
            this.roomInfo.updateRoomInfo(roomInfo);
        }

        console.log(roomMsg);
    }



    initSocket() {
        if (!this._socket) throw new Error("Socket was not inited");

        this._socket.on('on_user_join_room', this.onUserJoinRoom.bind(this));
        this._socket.on("on_user_leave_room", this.onUserLeaveRoom.bind(this));

        this._socket.on("on_user_deal_cards", this.onUserDealCards.bind(this));
        this._socket.on("on_game_result", this.onGameResult.bind(this))
        this._socket.on("on_notify_game_state", this.onNotifyGameState.bind(this))
        

        this._socket.emit("new_user", this._playerName);
    }

    onNotifyGameState(message) {
        console.log(message);
    }

    protected onDestroy(): void {
        if (this._socket) this._socket.disconnect();
    }

    /** Game Logic */

    onUserDealCards(hand) {

        this.loadHand(hand)
            .then((result) => {
                this.player.setPlayerHand(result);
                let countDownTime = 10;

                this.startCountDown(countDownTime);
                this.scheduleOnce(() => {
                    this.sendPlayerHandData();
                }, countDownTime);
            });
    }

    sendPlayerHandData() {
        const handData = this.player.getHandData();

        this._socket.emit("user_send_hand", handData);
    }

    onGameResult(winnerEachChi) {
        console.log(winnerEachChi);
    }

}