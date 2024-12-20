import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { changeParent } from '../../scripts/utils';
const { ccclass, property } = _decorator;

@ccclass('SolitaireCard')
export class SolitaireCard extends Component {

    @property(Node) faceDown: Node;
    _cardSprite: Sprite;

    value: number;
    suit: string;

    protected onLoad(): void {
        this._cardSprite = this.node.getComponent(Sprite);
    }

    initCard(cardAsset, value, suit) {
        this._cardSprite.spriteFrame = cardAsset;
        this.value = value;
        this.suit = suit;
    }

    showFaceDown() {
        this.faceDown.active = true;
    }

    showFaceUp() {
        this.faceDown.active = false;
    }

}

