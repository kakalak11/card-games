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

    protected onLoad(): void {
        console.log(this.dragHolder.getComponent(UITransform).convertToNodeSpaceAR(v3(1280 / 2, 720 / 2, 0)));
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

            // cardNode.getComponent(CardMauBinh).init(this);
            cardNode.getComponent(DragAndDrop).init(this);
            cardNode.active = true;
        });

        // this.scheduleOnce(() => {
        //     let width1 = this.firstChi.getComponent(UITransform).width;
        //     let width3 = this.thirdChi.getComponent(UITransform).width;

        //     this.firstChi.getComponent(Layout).resizeMode = Layout.ResizeMode.NONE;
        //     this.secondChi.getComponent(Layout).resizeMode = Layout.ResizeMode.NONE;
        //     this.thirdChi.getComponent(Layout).resizeMode = Layout.ResizeMode.NONE;

        //     this.firstChi.getComponent(UITransform).width = width1;
        //     this.secondChi.getComponent(UITransform).width = width1;
        //     this.thirdChi.getComponent(UITransform).width = width3;
        // });

        this.firstChi.getComponent(Layout).enabled = false
        this.secondChi.getComponent(Layout).enabled = false
        this.thirdChi.getComponent(Layout).enabled = false
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

