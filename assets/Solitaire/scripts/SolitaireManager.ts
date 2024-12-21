import { resources } from 'cc';
import { instantiate } from 'cc';
import { error } from 'cc';
import { Prefab } from 'cc';
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { SolitaireCard } from './SolitaireCard';
import { BLACK_SUITS, changeParent, getDeck, RED_SUITS } from '../../scripts/utils';
import { Label } from 'cc';
import { Button } from 'cc';
import { Layout } from 'cc';
import { UITransform } from 'cc';
import { Intersection2D } from 'cc';
import { Event } from 'cc';

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

    @property(Node) dragHolder: Node;

    cards: SolitaireCard[] = [];
    stockCards: SolitaireCard[] = [];
    wasteCards: SolitaireCard[] = [];

    _followCards: SolitaireCard[] = [];

    protected onLoad(): void {
        this.node.on("ON_DRAG_CARD_END", this.onDragCardEnd, this);
        this.node.on("ON_DRAG_CARD_BEGIN", this.onDragCardBegin, this);
        this.node.on("ON_DRAG_CARD_MOVE", this.onDragCardMove, this);
    }

    protected start(): void {
        let deck = getDeck();
        // console.log(JSON.stringify(deck));

        deck = JSON.parse(`[{"value":"2","suit":"heart","numberValue":2},{"value":"4","suit":"heart","numberValue":4},{"value":"K","suit":"spade","numberValue":10},{"value":"5","suit":"diamond","numberValue":5},{"value":"6","suit":"heart","numberValue":6},{"value":"A","suit":"spade","numberValue":10},{"value":"3","suit":"heart","numberValue":3},{"value":"8","suit":"heart","numberValue":8},{"value":"Q","suit":"heart","numberValue":10},{"value":"J","suit":"spade","numberValue":10},{"value":"8","suit":"diamond","numberValue":8},{"value":"9","suit":"diamond","numberValue":9},{"value":"5","suit":"spade","numberValue":5},{"value":"2","suit":"diamond","numberValue":2},{"value":"Q","suit":"spade","numberValue":10},{"value":"8","suit":"spade","numberValue":8},{"value":"6","suit":"spade","numberValue":6},{"value":"2","suit":"spade","numberValue":2},{"value":"7","suit":"club","numberValue":7},{"value":"9","suit":"spade","numberValue":9},{"value":"7","suit":"heart","numberValue":7},{"value":"4","suit":"club","numberValue":4},{"value":"7","suit":"diamond","numberValue":7},{"value":"A","suit":"diamond","numberValue":10},{"value":"J","suit":"club","numberValue":10},{"value":"K","suit":"diamond","numberValue":10},{"value":"3","suit":"diamond","numberValue":3},{"value":"4","suit":"spade","numberValue":4},{"value":"10","suit":"diamond","numberValue":10},{"value":"Q","suit":"diamond","numberValue":10},{"value":"J","suit":"diamond","numberValue":10},{"value":"7","suit":"spade","numberValue":7},{"value":"5","suit":"heart","numberValue":5},{"value":"9","suit":"club","numberValue":9},{"value":"3","suit":"spade","numberValue":3},{"value":"10","suit":"spade","numberValue":10},{"value":"K","suit":"club","numberValue":10},{"value":"9","suit":"heart","numberValue":9},{"value":"10","suit":"heart","numberValue":10},{"value":"6","suit":"club","numberValue":6},{"value":"8","suit":"club","numberValue":8},{"value":"6","suit":"diamond","numberValue":6},{"value":"10","suit":"club","numberValue":10},{"value":"J","suit":"club","numberValue":10},{"value":"3","suit":"club","numberValue":3},{"value":"A","suit":"club","numberValue":10},{"value":"A","suit":"heart","numberValue":10},{"value":"5","suit":"club","numberValue":5},{"value":"J","suit":"heart","numberValue":10},{"value":"K","suit":"heart","numberValue":10},{"value":"2","suit":"club","numberValue":2},{"value":"4","suit":"diamond","numberValue":4}]`);

        this.loadCards(deck)
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
                        cardNode.name = assetName;
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

            poppedCard.node.setParent(tableauPiles[col]);
            poppedCard.showFaceUp();
            poppedCard.setOriginalPos();

            for (let _col = col + 1; _col < tableauPiles.length; _col++) {
                poppedCard = slicedCards.pop();
                poppedCard.node.setParent(tableauPiles[_col]);
                poppedCard.showFaceDown();
                poppedCard.setOriginalPos();
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

    onDragCardEnd(event: Event) {
        // console.log(event);
        const dragCard: SolitaireCard = event.target.getComponent(SolitaireCard);
        // console.log(dragCard);
        const intersectedPile = this.checkCardIntersection(event.target);
        let allPromises = [];

        if (intersectedPile) {
            // console.log(intersectedPile);
            const topCard = intersectedPile.getComponentsInChildren(SolitaireCard).pop();
            const isValidValue = (topCard.value - 1) == dragCard.value;
            const isValidSuit = BLACK_SUITS.includes(topCard.suit) && RED_SUITS.includes(dragCard.suit)
                || RED_SUITS.includes(topCard.suit) && BLACK_SUITS.includes(dragCard.suit);

            if (isValidSuit && isValidValue) {
                let _childList = [...intersectedPile.children];

                [dragCard, ...this._followCards]
                    .forEach(card => {
                        allPromises.push(card.transferToPile(intersectedPile, _childList));
                    });
            } else {
                [dragCard, ...this._followCards]
                    .forEach(card => {
                        allPromises.push(card.returnCard());
                    });
            }

        } else {
            [dragCard, ...this._followCards]
                .forEach(card => {
                    allPromises.push(card.returnCard());
                });
        }

        Promise.all(allPromises)
            .then(() => {
                this._followCards = [];
                intersectedPile && this.displayChildrenName(intersectedPile);
            });
    }

    onDragCardBegin(event: Event) {
        const currPile = event.target.parent?.name.startsWith("Pile_") && event.target.parent;

        if (currPile) {
            this._followCards = currPile.children.slice(event.target.getSiblingIndex() + 1).map(o => o.getComponent(SolitaireCard));

            changeParent(event.target, this.dragHolder);
            this._followCards.forEach(card => changeParent(card.node, this.dragHolder));
        }
    }

    onDragCardMove(event: Event) {
        if (event["moveEvent"] && this._followCards.length > 0) {
            this._followCards.forEach(card => card.follow(event["moveEvent"]));
        }
    }

    checkCardIntersection(dragTarget) {
        return this.tableau.children.find(node => {
            return this.isNodeIntersectWithTarget(node, dragTarget)
        });
    }

    isNodeIntersectWithTarget(node, dragTarget) {
        const dragTargetBoundingBox = dragTarget.getComponent(UITransform).getBoundingBoxToWorld();
        const nodeBoundingBox = node.getComponent(UITransform).getBoundingBoxToWorld();
        const isIntersectOverHalfX = Math.abs(dragTargetBoundingBox.x - nodeBoundingBox.x) <= node.getComponent(UITransform).width / 2;
        const isIntersectOverHalfY = Math.abs(dragTargetBoundingBox.y - nodeBoundingBox.y) <= node.getComponent(UITransform).height / 2;

        return isIntersectOverHalfX && isIntersectOverHalfY && Intersection2D.rectRect(dragTargetBoundingBox, nodeBoundingBox);
    }

    displayChildrenName(node) {
        console.log(node.getComponentsInChildren(SolitaireCard).map(card => {
            if (!card.faceDown.active) {
                return card.name;
            } else {
                return null
            }
        }).filter(o => o));
    }

}

