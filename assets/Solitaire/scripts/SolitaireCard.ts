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
        this.value = value == "A" ? 1 : (ROYAL_VALUES[value] || Number(value));
        this.suit = suit;
        this._canDrag = true;
        this._originalPos = v3(0, 0, 0);

        this.initEvent();
        this.node.once(Node.EventType.PARENT_CHANGED, () => this._parent = this.node.parent, this);
    }

    isCardFromWaste() {
        return this._parent.name.startsWith("WasteCards");
    }

    getParent() {
        return this._parent;
    }

    showFaceDown() {
        this.faceDown.active = true;
        this.disableEvent();
    }

    showFaceUp() {
        this.faceDown.active = false;
        this.enableEvent();
    }

    showFaceUpAnim(time = 0.5) {
        this.disableEvent();
        return tween(this.node)
            .to(time / 2, { scale: v3(0, 1, 1) })
            .call(() => this.showFaceUp())
            .to(time / 2, { scale: v3(1, 1, 1) })
            .call(() => {
                this.enableEvent();
            })
    }

    showFaceDownAnim(time = 0.5) {
        this.disableEvent();
        return tween(this.node)
            .to(time / 2, { scale: v3(0, 1, 1) })
            .call(() => this.showFaceDown())
            .to(time / 2, { scale: v3(1, 1, 1) })
            .call(() => {
                this.enableEvent();
            })
    }

    slideFaceUpTo(position, time, wasteHolder) {
        this.disableEvent();
        changeParent(this.node, wasteHolder);
        return new Promise<void>(resolve => {
            tween(this.node)
                .parallel(
                    tween().by(time, { position }),
                    this.showFaceUpAnim(time)
                        .call(() => {
                            this.enableEvent();
                            this.setOriginalPos(true);
                            this._canDrag = true;
                            resolve();
                        })
                )
                .start()
        });
    }

    slideFaceDownTo(position, time, stockHolder) {
        this.disableEvent();
        changeParent(this.node, stockHolder);
        return new Promise<void>(resolve => {
            tween(this.node)
                .parallel(
                    tween().by(time, { position }),
                    this.showFaceDownAnim(time)
                        .call(() => {
                            this.disableEvent();
                            this.setOriginalPos(true);
                            this._canDrag = false;
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
        console.log("Drag");
    }

    onTouchStart(event: EventTouch) {
        // console.log(`click node ${this.node.name}`);
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
        if (this._canDrag) {
            this.unschedule(this._dragStart);
            const tapEvent = new Event("ON_TAP_CARD", true);
            this.node.dispatchEvent(tapEvent);
            console.log("Tap");
            return;
        }
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
        this.disableEvent();

        return new Promise<void>(resolve => {
            tween(this.node)
                .by(0.2, { position: moveVec })
                .call(() => {
                    changeParent(this.node, this._parent);
                    this.enableEvent();
                    resolve();
                })
                .start();
        })
    }

    transferToPile(pileNode, childNum) {
        let worldPos = pileNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));

        const currWorldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        worldPos.y -= this.node.getComponent(UITransform).height / 2;
        worldPos.y -= childNum * 44;

        const moveVec = worldPos.subtract(currWorldPos);
        this._parent = pileNode;
        this.disableEvent();

        return new Promise<void>(resolve => {
            tween(this.node)
                .by(0.2, { position: moveVec })
                .call(() => {
                    changeParent(this.node, pileNode);
                    this.setOriginalPos();
                    this.enableEvent();
                    resolve();
                })
                .start();
        });
    }

    dealToPile(pileNode, childNum = 0, time, showFaceUp?) {
        const currWorldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        let worldPos = pileNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        worldPos.y -= this.node.getComponent(UITransform).height / 2;
        worldPos.y -= childNum * 44;
        const moveVec = worldPos.subtract(currWorldPos);

        this._parent = pileNode;
        this.disableEvent();

        tween(this.node)
            .parallel(
                tween().by(time, { position: moveVec }),
                showFaceUp && tween()
                    .to(time / 2, { scale: v3(0, 1, 1) })
                    .call(() => this.showFaceUp())
                    .to(time / 2, { scale: v3(1, 1, 1) })
            )
            .call(() => {
                changeParent(this.node, pileNode);
                this.setOriginalPos();
            })
            .start();
    }

    transferToFoundation(foundationNode, childNum) {
        const currWorldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        let worldPos = foundationNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        worldPos.y += childNum * 2;
        const moveVec = worldPos.subtract(currWorldPos);

        this._parent = foundationNode;
        this.disableEvent();

        return new Promise<void>(resolve => {
            tween(this.node)
                .by(0.2, { position: moveVec })
                .call(() => {
                    changeParent(this.node, foundationNode);
                    this.setOriginalPos();
                    this.enableEvent();
                    resolve();
                })
                .start();
        });
    }

    setOriginalPos(isForce = false) {
        if (isForce) {
            this._originalPos = this.node.getPosition();
            this._originalWorldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        } else {
            this.node.once(Node.EventType.TRANSFORM_CHANGED, () => {
                this._originalPos = this.node.getPosition();
                this._originalWorldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
            });
        }
    }

    initEvent() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    enableEvent() {
        this.node.resumeSystemEvents(false);
    }

    disableEvent() {
        this.node.pauseSystemEvents(false);
    }

    reset() {
        this.node.setPosition(0, 0);
        this._cardSprite.spriteFrame = null;
        this.valueName = "";
        this.value = 0
        this.suit = "";
        this._canDrag = true;
        this._originalPos = v3(0, 0, 0);
        this._originalWorldPos = v3(0, 0, 0);

        return true;
    }

}

