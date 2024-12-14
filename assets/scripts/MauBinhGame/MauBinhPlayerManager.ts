import { _decorator, Component, Node, Layout, UITransform } from 'cc';
import { CardMauBinh } from './CardMauBinh';
import { detectDoi, detectSanh, detectThung } from '../utils';
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
        const chi1 = this.playerHand.filter(({ cardNode }) => cardNode.parent.name == 'Chi1').sort((a, b) => a.numberValue - b.numberValue);
        console.log(chi1);

        
        const mauThau = chi1.slice().pop();
        // detect Sảnh
        const { foundSanh, aceHigh } = detectSanh(chi1);
        // detect Thùng
        const foundThung = detectThung(chi1);
        // detect Thùng Phá Sảnh
        const foundThungPhaSanh = foundThung && foundSanh;
        // detect Đôi / Thú / Sám / Cù Lũ / Tứ Quý
        const { foundDoi, foundSam, foundThu, foundTuQuy, foundCuLu } = detectDoi(chi1);
        const foundSanhRong = foundThungPhaSanh && aceHigh;


    }

}

