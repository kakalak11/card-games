import { _decorator, Component, Node, Layout, UITransform } from 'cc';
import { CardMauBinh } from './CardMauBinh';
import { detectAllCombinations, detectDoi, detectSanh, detectThung } from '../utils';
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
    result: any;

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
                        this._calculateHand();
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

        this._calculateHand();
    }

    _calculateHand() {
        this.result = {};

        const chi1 = this.playerHand.filter(({ cardNode }) => cardNode.parent.name == 'Chi1').sort((a, b) => a.numberValue - b.numberValue);
        const chi2 = this.playerHand.filter(({ cardNode }) => cardNode.parent.name == 'Chi2').sort((a, b) => a.numberValue - b.numberValue);
        const chi3 = this.playerHand.filter(({ cardNode }) => cardNode.parent.name == 'Chi3').sort((a, b) => a.numberValue - b.numberValue);

        [chi1, chi2, chi3].forEach((chi, index) => {
            const handResult = detectAllCombinations(chi);
            console.log("chi ", index + 1, " : ", handResult);
        })

    }

}

