import { resources } from 'cc';
import { instantiate } from 'cc';
import { error } from 'cc';
import { Prefab } from 'cc';
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { SolitaireCard } from './SolitaireCard';
import { getDeck } from '../../scripts/utils';
const { ccclass, property } = _decorator;

@ccclass('SolitaireManager')
export class SolitaireManager extends Component {

    @property(Prefab) cardPrefab: Prefab;

    @property(Node) stockCardsNode: Node;

    cards: SolitaireCard[] = [];

    loadCards(cards) {
        let allPromises = [];

        cards.forEach(card => {
            const { value, suit } = card;
            let assetName = value + "_" + suit;
            allPromises.push(
                new Promise((resolve, reject) => {
                    resources.load(`solitaire/${suit}/${assetName}/spriteFrame`, SpriteFrame, (err, asset) => {
                        if (err) return reject(error(err.message));

                        const cardNode = instantiate(this.cardPrefab);
                        cardNode.setParent(this.stockCardsNode);
                        const cardComponent = cardNode.getComponent(SolitaireCard);
                        cardComponent.initCard(asset, value, suit);
                        resolve(cardComponent);
                    });
                })
            )
        })

        return Promise.all(allPromises)
            .then((result) => {
                return result;
            });
    }

    protected start(): void {
        this.loadCards(getDeck())
            .then(cards => {
                this.cards = cards;

                this.cards.forEach(card => card.showFaceDown());
                this.gameStart();
            });
    }

    gameStart() {
        
    }

}

