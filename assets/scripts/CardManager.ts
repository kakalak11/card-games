import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CardManager')
export class CardManager extends Component {

    @property(Node) backCard: Node;

    showBackCard() {
        this.backCard.active = true;
    }

    isShowingBackCard() {
        return !!this.backCard.active;
    }

    showFaceCard() {
        this.backCard.active = false;
    }

}

