import { _decorator, Component, Node } from 'cc';
import { MauBinhPlayerManager } from './MauBinhPlayerManager';
import { UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CardMauBinh')
export class CardMauBinh extends Component {

    isSelected: boolean;
    _playerManager: MauBinhPlayerManager;

    start() {
        this.node.on("INIT", this.init, this);

        
    }

    init(playerManager: MauBinhPlayerManager) {
        this._playerManager = playerManager;

        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);


    }

    onMouseDown() {
        this.isSelected = !this.isSelected;

        let pos = this.node.getPosition();
        if (this.isSelected) {
            pos.y = 20;
            this._playerManager.onSelectCard(this.node);
        } else {
            pos.y = 0
            this._playerManager.onUnselectCard(this.node);
        }

        this.node.setPosition(pos);
    }
}

