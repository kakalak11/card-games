import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('CardManager')
export class CardManager extends Component {

    isSelected: boolean;

    start() {
        this.node.on("INIT", this.init, this);
    }

    init() {
        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    onMouseDown() {
        this.isSelected = !this.isSelected;

        let pos = this.node.getPosition();
        if (this.isSelected) {
            pos.y = 20;
            GameManager.instance.onSelectCard(this.node);
        } else {
            pos.y = 0
            GameManager.instance.onUnselectCard(this.node);
        }

        this.node.setPosition(pos);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

}

