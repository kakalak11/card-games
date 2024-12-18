import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MauBinhRoomInfo')
export class MauBinhRoomInfo extends Component {

    @property(Label) roomName: Label;
    @property(Label) roomPlayers: Label;

    updateRoomInfo({ roomName, players }) {
        this.roomName.string = roomName;
        this.roomPlayers.string = ""
        players.forEach(playerName => {
            this.roomPlayers.string += `${playerName}\n`;
        });
    }
}

