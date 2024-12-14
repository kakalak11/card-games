import {
    _decorator, Component, EventMouse, Node, UITransform, v3, EventTouch,
    tween, Event, Intersection2D, Color, UIOpacity, Sprite
} from 'cc';
import { MauBinhPlayerManager } from '../MauBinhGame/MauBinhPlayerManager';
import { changeParent } from '../utils';
const { ccclass, property } = _decorator;

const DIM_COLOR = new Color(200, 200, 200);
const UNDIM_COLOR = Color.WHITE;

@ccclass('CardMauBinh')
export class CardMauBinh extends Component {

    _playerManager: MauBinhPlayerManager;
    originalParent: Node;
    originalPos: any;
    _canDrag: boolean = true;
    _spriteComp: Sprite;
    isIntersected: boolean;

    protected onLoad(): void {
        this._spriteComp = this.node.getComponent(Sprite);
    }

    protected start(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    init(playerManager: MauBinhPlayerManager) {
        this._playerManager = playerManager;
    }

    setProps() {
        this.originalPos = this.node.getPosition();
        this.originalParent = this.node.getParent();
    }

    onTouchStart(event: EventTouch) {
        if (!this._canDrag) return;
        this._canDrag = false;
        changeParent(this.node, this._playerManager.dragHolder);

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
    }

    switchChi(card) {
        const cardComp = card.getComponent(CardMauBinh);
        const targetParent = cardComp.originalParent;
        const targetPos = cardComp.originalPos.clone();

        changeParent(this.node, targetParent);

        this._canDrag = false;
        return new Promise<void>(resolve => {
            tween(this.node)
                .to(0.3, { position: targetPos })
                .call(() => {
                    this._canDrag = true;

                    this.originalPos = targetPos;
                    this.originalParent = targetParent;
                    resolve();
                })
                .start();
        })
    }

    returnToOriginal() {
        const cardComp = this;

        const targetParent = cardComp.originalParent;
        const targetPos = cardComp.originalPos.clone();

        changeParent(this.node, targetParent);
        this._canDrag = false;

        return new Promise<void>(resolve => {
            tween(this.node)
                .to(0.3, { position: targetPos })
                .call(() => {
                    this._canDrag = true;

                    this.originalPos = targetPos;
                    this.originalParent = targetParent;
                    resolve();
                })
                .start();
        })
    }

    protected update(dt: number): void {
        if (this._playerManager.dragTarget && this._playerManager.dragTarget !== this.node) {
            this.isIntersected = this.isIntersectWithTarget(this._playerManager.dragTarget);
            if (this.isIntersected) {
                this._spriteComp.color = DIM_COLOR
            } else {
                this._spriteComp.color = UNDIM_COLOR
            }
        } else if (this.isIntersected) {
            this.isIntersected = false;
            this._spriteComp.color = UNDIM_COLOR;
        }
    }

    isIntersectWithTarget(dragTarget) {
        const dragTargetBoundingBox = dragTarget.getComponent(UITransform).getBoundingBoxToWorld();
        const nodeBoundingBox = this.node.getComponent(UITransform).getBoundingBoxToWorld();
        const isIntersectOverHalfX = Math.abs(dragTargetBoundingBox.x - nodeBoundingBox.x) <= this.node.getComponent(UITransform).width / 2;
        const isIntersectOverHalfY = Math.abs(dragTargetBoundingBox.y - nodeBoundingBox.y) <= this.node.getComponent(UITransform).height / 2;

        return isIntersectOverHalfX && isIntersectOverHalfY && Intersection2D.rectRect(dragTargetBoundingBox, nodeBoundingBox);
    }

}

