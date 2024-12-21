import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { changeParent, ROYAL_VALUES } from '../../scripts/utils';
import { tween } from 'cc';
import { v3 } from 'cc';
import { EventTouch } from 'cc';
import { Event } from 'cc';
import { Vec3 } from 'cc';
import { UIOpacity } from 'cc';
import { UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SolitaireCard')
export class SolitaireCard extends Component {

    @property(Node) faceDown: Node;

    _cardSprite: Sprite;
    _canDrag: boolean;
    _originalPos: Vec3;
    _originalWorldPos: Vec3;
    _parent: Node;

    value: number;
    suit: string;
    valueName: string; // incaseof royal


    protected onLoad(): void {
        this._cardSprite = this.node.getComponent(Sprite);
    }

    initCard(cardAsset, value, suit) {
        this._cardSprite.spriteFrame = cardAsset;
        this.valueName = value;
        this.value = ROYAL_VALUES[value] || value;
        this.suit = suit;
        this._canDrag = true;
        this._originalPos = v3(0, 0, 0);

        this.enableEvent();
    }

    showFaceDown() {
        this.faceDown.active = true;
        this.disableEvent();
    }

    showFaceUp() {
        this.faceDown.active = false;
        this.enableEvent();
    }

    slideFaceUpTo(position, time, wasteHolder) {
        changeParent(this.node, wasteHolder);
        return new Promise<void>(resolve => {
            tween(this.node)
                .parallel(
                    tween().by(time, { position }),
                    tween(this.node)
                        .to(time / 2, { scale: v3(0, 1, 1) })
                        .call(() => this.showFaceUp())
                        .to(time / 2, { scale: v3(1, 1, 1) })
                        .call(() => {
                            this.enableEvent();
                            resolve();
                        })
                )
                .start()
        });
    }

    slideFaceDownTo(position, time, stockHolder) {
        changeParent(this.node, stockHolder);
        return new Promise<void>(resolve => {
            tween(this.node)
                .parallel(
                    tween().by(time, { position }),
                    tween(this.node)
                        .to(time / 2, { scale: v3(0, 1, 1) })
                        .call(() => this.showFaceDown())
                        .to(time / 2, { scale: v3(1, 1, 1) })
                        .call(() => {
                            this.disableEvent();
                            resolve();
                        })
                )
                .start()
        })
    }

    _dragStart() {
        this._canDrag = false;
        this._parent = this.node.parent;
        const dragBeginEvent = new Event("ON_DRAG_CARD_BEGIN", true);
        this.node.dispatchEvent(dragBeginEvent);
    }

    onTouchStart(event: EventTouch) {
        console.log(`click node ${this.node.name}`);
        if (!this._canDrag) return;

        this.scheduleOnce(this._dragStart, 0.05);
    }

    onTouchMove(event: EventTouch) {
        if (this._canDrag) return;
        this.follow(event);

        const dragBeginEvent = new Event("ON_DRAG_CARD_MOVE", true);
        dragBeginEvent["moveEvent"] = event;
        this.node.dispatchEvent(dragBeginEvent);
    }

    onTouchEnd(event: EventTouch) {
        this.unschedule(this._dragStart);
        if (this._canDrag) return;
        this._canDrag = true;

        const dragEndEvent = new Event("ON_DRAG_CARD_END", true);
        this.node.dispatchEvent(dragEndEvent);
    }

    follow(event: EventTouch) {
        const delta = event.getUIDelta();
        const moveX = this.node.getPosition().x + delta.x;
        const moveY = this.node.getPosition().y + delta.y;

        this.node.setPosition(moveX, moveY);
    }

    returnCard() {
        const currWorldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        const moveVec = this._originalWorldPos.clone().subtract(currWorldPos);

        return new Promise<void>(resolve => {
            tween(this.node)
                .by(0.2, { position: moveVec })
                .call(() => {
                    changeParent(this.node, this._parent);
                    resolve();
                })
                .start();
        })
    }

    transferToPile(pileNode, childList) {
        const topCard = [...childList].shift();
        childList.push(this.node);
        const worldPos = topCard.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        const currWorldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));

        worldPos.y -= (childList.length - 1) * 44;
        const moveVec = worldPos.subtract(currWorldPos);
        this._parent = pileNode;

        return new Promise<void>(resolve => {
            tween(this.node)
                .by(0.2, { position: moveVec })
                .call(() => {
                    changeParent(this.node, pileNode);
                    this.setOriginalPos();
                    resolve();
                })
                .start();
        });
    }

    setOriginalPos() {
        this.node.once(Node.EventType.TRANSFORM_CHANGED, () => {
            this._originalPos = this.node.getPosition();
            this._originalWorldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        });
    }

    enableEvent() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    disableEvent() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

}

