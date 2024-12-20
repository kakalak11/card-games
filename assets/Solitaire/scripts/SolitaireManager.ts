import { resources } from 'cc';
import { instantiate } from 'cc';
import { error } from 'cc';
import { Prefab } from 'cc';
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { SolitaireCard } from './SolitaireCard';
import { changeParent, getDeck } from '../../scripts/utils';
import { Label } from 'cc';
import { Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SolitaireManager')
export class SolitaireManager extends Component {

    @property(Prefab) cardPrefab: Prefab;

    @property(Node) stockCardsNode: Node;
    @property(Label) stockInfo: Label;
    @property(Button) getStockButton: Button;

    @property(Node) wasteCardsNode: Node;

    @property(Node) tableau: Node;
    @property(Node) foundations: Node;

    cards: SolitaireCard[] = [];
    stockCards: SolitaireCard[] = [];
    wasteCards: SolitaireCard[] = [];

    protected start(): void {
        this.loadCards(getDeck())
            .then(cards => {
                this.cards = cards;

                this.gameStart();
            });
    }

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
                        cardComponent.showFaceDown();
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

    gameStart() {
        const slicedCards = this.cards.slice();
        const tableauPiles = this.tableau.children.slice();
        let poppedCard;
        // deal cards to tableau
        for (let col = 0; col < tableauPiles.length; col++) {
            poppedCard = slicedCards.pop();

            poppedCard.showFaceUp();
            poppedCard.node.setParent(tableauPiles[col]);

            for (let _col = col + 1; _col < tableauPiles.length; _col++) {
                poppedCard = slicedCards.pop();
                poppedCard.showFaceDown();
                poppedCard.node.setParent(tableauPiles[_col]);
            }
        }
        // the remaining is the stock
        this.stockCards = this.stockCardsNode.children.map(card => card.getComponent(SolitaireCard));
        this.stockInfo.string = `Number of Cards: ${this.stockCards.length}`;
    }

    getStock() {
        if (this.stockCards.length == 0) {
            const distance = this.stockCardsNode.getPosition().subtract(this.wasteCardsNode.getPosition());

            this.stockCards = this.wasteCards;
            this.wasteCards = [];

            this.stockCards.forEach(card => {
                card.slideFaceDownTo(distance, 0.3, this.stockCardsNode);
            });
        } else {
            const popCard = this.stockCards.pop();
            const distance = this.wasteCardsNode.getPosition().subtract(this.stockCardsNode.getPosition());

            this.wasteCards.unshift(popCard);
            popCard.slideFaceUpTo(distance, 0.3, this.wasteCardsNode);
        }

        this.scheduleOnce(() => {
            this.getStockButton.interactable = true;
        }, 0.3);
        this.getStockButton.interactable = false;
        this.stockInfo.string = `Number of Cards: ${this.stockCards.length}`;
    }
}

