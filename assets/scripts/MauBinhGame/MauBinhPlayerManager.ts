import { _decorator, Component, Node } from 'cc';
import { CardMauBinh } from './CardMauBinh';
import { DragAndDrop } from '../Components/DragAndDrop';
import { Layout } from 'cc';
import { UI } from 'cc';
import { UITransform } from 'cc';
import { v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MauBinhPlayerManager')
export class MauBinhPlayerManager extends Component {

    @property(Node) playerTable: Node;

    @property(Node) firstChi: Node;
    @property(Node) secondChi: Node;
    @property(Node) thirdChi: Node;

    @property(Node) dragHolder: Node;

    playerHand: any = [];
    selectedHand: any = [];
    dragTarget: Node;

    setDragTarget(dragTarget) {
        if (dragTarget) {
            this.dragTarget = dragTarget;
        } else {
            const intersectedCard = this.getComponentsInChildren(CardMauBinh).find(card => card.isIntersected);
            const dragCard = this.dragTarget.getComponent(CardMauBinh);
            let allPromises = [];
            if (intersectedCard) {
                allPromises.push(dragCard.switchChi(intersectedCard.node));
                allPromises.push(intersectedCard.switchChi(this.dragTarget))
            } else {
                dragCard.returnToOriginal();
            }
            if (allPromises.length > 0) {
                Promise.all(allPromises)
                    .then(() => {
                        this.dragTarget = null;

                        this.firstChi.children.sort((a, b) => a.getPosition().x - b.getPosition().x);
                        this.secondChi.children.sort((a, b) => a.getPosition().x - b.getPosition().x);
                        this.thirdChi.children.sort((a, b) => a.getPosition().x - b.getPosition().x);

                        this.playerHand.forEach(({ cardNode }) => {
                            cardNode.getComponent(CardMauBinh).setProps();
                        });
                    });
            }
        }
    }

    setPlayerHand(hand) {
        this.playerHand = hand;
        this.playerHand.sort((a, b) => a.numberValue - b.numberValue);
        this.playerHand.forEach(({ cardNode }) => {
            if (this.firstChi.children.length < 5) {
                cardNode.setParent(this.firstChi);
            } else if (this.secondChi.children.length < 5) {
                cardNode.setParent(this.secondChi);
            } else {
                cardNode.setParent(this.thirdChi);
            }

            cardNode.getComponent(CardMauBinh).init(this);
            cardNode.active = true;
        });

        this.scheduleOnce(() => {
            let width5 = this.firstChi.getComponent(UITransform).width;
            let width3 = this.thirdChi.getComponent(UITransform).width;

            this.firstChi.getComponent(UITransform).width = width5;
            this.secondChi.getComponent(UITransform).width = width5;
            this.thirdChi.getComponent(UITransform).width = width3;

            this.firstChi.getComponent(Layout).enabled = false;
            this.secondChi.getComponent(Layout).enabled = false;
            this.thirdChi.getComponent(Layout).enabled = false;

            this.playerHand.forEach(({ cardNode }) => {
                cardNode.getComponent(CardMauBinh).setProps();
            });
        });
    }

    onSelectCard(card) {
        const cardInfo = this.playerHand.find(({ cardNode }) => cardNode === card);
        const isSelected = this.selectedHand.find(({ cardNode }) => cardNode === card);
        if (!cardInfo || isSelected) return;

        this.selectedHand.push(cardInfo);
        console.log("Selected hand: ", this.selectedHand);
    }

    onUnselectCard(card) {
        const selectedIndex = this.selectedHand.findIndex(({ cardNode }) => cardNode === card);
        if (selectedIndex == -1) return;

        this.selectedHand.splice(selectedIndex, 1);
        console.log("Selected hand: ", this.selectedHand);
    }

}

