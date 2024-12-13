import { _decorator, Component, EventMouse, Node, UITransform, v3 } from 'cc';
import { MauBinhPlayerManager } from '../MauBinhGame/MauBinhPlayerManager';
import { EventTouch } from 'cc';
import { tween } from 'cc';
import { changeParent } from '../utils';
const { ccclass, property } = _decorator;

@ccclass('DragAndDrop')
export class DragAndDrop extends Component {

    _playerManager: MauBinhPlayerManager;
    _parent: Node;
    _originalPos: any;
    _canDrag: boolean = true;

    protected onLoad(): void {
        this._parent = this.node.parent;
    }

    protected start(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    init(playerManager: MauBinhPlayerManager) {
        this._playerManager = playerManager;
    }

    onTouchStart(event: EventTouch) {
        if (!this._canDrag) return;
        this._canDrag = false;
        changeParent(this.node, this._playerManager.dragHolder);
        this._originalPos = this.node.getPosition();
    }

    onTouchMove(event: EventTouch) {
        const delta = event.getUIDelta();
        const moveX = this.node.getPosition().x + delta.x;
        const moveY = this.node.getPosition().y + delta.y;

        this.node.setPosition(moveX, moveY);
    }

    onTouchEnd(event: EventTouch) {
        if (this._originalPos) {
            tween(this.node)
                .to(0.3, { position: this._originalPos.clone() })
                .call(() => {
                    changeParent(this.node, this._parent);
                    this._parent.children.sort((a, b) => a.getPosition().x - b.getPosition().x);
                    this._canDrag = true;
                })
                .start();
        }
        this._originalPos = null;
    }

}

