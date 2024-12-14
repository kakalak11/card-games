import { _decorator, Component, EventMouse, Node, UITransform, v3 } from 'cc';
import { MauBinhPlayerManager } from '../MauBinhGame/MauBinhPlayerManager';
import { EventTouch } from 'cc';
import { tween } from 'cc';
import { changeParent } from '../utils';
import { Event } from 'cc';
import { Intersection2D } from 'cc';
import { Color } from 'cc';
import { UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

const DIM_COLOR = new Color(100, 100, 100);
const UNDIM_COLOR = Color.WHITE;

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

        this._playerManager.setDragTarget(this.node);
    }

    onTouchMove(event: EventTouch) {
        const delta = event.getUIDelta();
        const moveX = this.node.getPosition().x + delta.x;
        const moveY = this.node.getPosition().y + delta.y;

        this.node.setPosition(moveX, moveY);
    }

    onTouchEnd(event: EventTouch) {
        this._playerManager.setDragTarget(null);
        if (this._originalPos) {
            tween(this.node)
                .to(0.3, { position: this._originalPos.clone() })
                .call(() => {
                    changeParent(this.node, this._parent);
                    this._canDrag = true;
                })
                .start();
        }
        this._originalPos = null;
    }

    protected update(dt: number): void {
        if (this._playerManager.dragTarget && this._playerManager.dragTarget !== this.node) {
            if (this.isIntersectWithTarget(this._playerManager.dragTarget)) {
                this.node.getComponent(UIOpacity).opacity = 100;
            } else {
                this.node.getComponent(UIOpacity).opacity = 255;
            }
        } else {
            this.node.getComponent(UIOpacity).opacity = 255;
        }
    }

    isIntersectWithTarget(dragTarget) {
        const dragTargetBoundingBox = dragTarget.getComponent(UITransform).getBoundingBoxToWorld();
        const nodeBoundingBox = this.node.getComponent(UITransform).getBoundingBoxToWorld();
        const isIntersectOverHalfX = Math.abs(dragTargetBoundingBox.x - nodeBoundingBox.x) <= this.node.getComponent(UITransform).width / 2;
        const isIntersectOverHalfY = Math.abs(dragTargetBoundingBox.y - nodeBoundingBox.y) <= this.node.getComponent(UITransform).height / 2;

        return Intersection2D.rectRect(dragTargetBoundingBox, nodeBoundingBox) && isIntersectOverHalfX && isIntersectOverHalfY;
    }

}

