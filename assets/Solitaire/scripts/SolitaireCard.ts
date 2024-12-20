import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { changeParent } from '../../scripts/utils';
import { tween } from 'cc';
import { v3 } from 'cc';
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

    slideFaceUpTo(position, time, wasteHolder) {
        changeParent(this.node, wasteHolder);
        tween(this.node)
            .parallel(
                tween().by(time, { position }),
                tween(this.node)
                    .to(time / 2, { scale: v3(0, 1, 1) })
                    .call(() => this.showFaceUp())
                    .to(time / 2, { scale: v3(1, 1, 1) })
            )
            .start()
    }

    slideFaceDownTo(position, time, stockHolder) {
        changeParent(this.node, stockHolder);
        tween(this.node)
            .parallel(
                tween().by(time, { position }),
                tween(this.node)
                    .to(time / 2, { scale: v3(0, 1, 1) })
                    .call(() => this.showFaceDown())
                    .to(time / 2, { scale: v3(1, 1, 1) })
            )
            .start()
    }

}

