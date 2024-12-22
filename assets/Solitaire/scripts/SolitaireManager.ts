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
                        cardNode.name = assetName;

                        resolve({ cardNode, asset, value, suit });
                    });
                })
            )
        })

        return Promise.all(allPromises)
            .then((result) => {
                result = result.map(({ cardNode, asset, value, suit }) => {
                    cardNode.setParent(this.stockCardsNode);
                    const cardComponent = cardNode.getComponent(SolitaireCard);
                    cardComponent.initCard(asset, value, suit);
                    cardComponent.showFaceDown();
                    return cardComponent;
                })
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
        this.stockCardsNode.removeAllChildren();
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
        const dragCard: SolitaireCard = event.target.getComponent(SolitaireCard);
        const intersectedPile = this.checkCardIntersection(event.target);
        const cardStack = [dragCard, ...this._followCards];
        const isCardFromWaste = dragCard.isCardFromWaste();
        let allPromises = [];
        let hasTransfer;

        if (intersectedPile) {
            const isFoundation = intersectedPile.name.startsWith("Foundation");
            const topCard = intersectedPile.getComponentsInChildren(SolitaireCard).pop();
            let _childList = [...intersectedPile.children];

            if (!topCard) {
                const isValidSuit = intersectedPile.name.endsWith("_" + dragCard.suit);

                if (isFoundation) {
                    if (isValidSuit && dragCard.valueName == "A" && cardStack.length == 1) {
                        hasTransfer = true;
                        cardStack
                            .forEach(card => {
                                allPromises.push(card.transferToFoundation(intersectedPile, _childList));
                            });
                    } else {
                        cardStack
                            .forEach(card => {
                                allPromises.push(card.returnCard());
                            });
                    }
                } else {
                    if (dragCard.valueName == "K") {
                        hasTransfer = true;
                        cardStack
                            .forEach(card => {
                                allPromises.push(card.transferToPile(intersectedPile));
                            });
                    } else {
                        cardStack
                            .forEach(card => {
                                allPromises.push(card.returnCard());
                            });
                    }
                }


            } else {
                let isValidValue = (topCard.value - 1) == dragCard.value;
                let isValidSuit = BLACK_SUITS.includes(topCard.suit) && RED_SUITS.includes(dragCard.suit)
                    || RED_SUITS.includes(topCard.suit) && BLACK_SUITS.includes(dragCard.suit);

                if (isFoundation) {
                    isValidSuit = BLACK_SUITS.includes(topCard.suit) && BLACK_SUITS.includes(dragCard.suit)
                        || RED_SUITS.includes(topCard.suit) && RED_SUITS.includes(dragCard.suit);
                    isValidValue = (topCard.value + 1) == dragCard.value;

                    if (isValidSuit && isValidValue) {
                        hasTransfer = true;
                        cardStack
                            .forEach(card => {
                                allPromises.push(card.transferToFoundation(intersectedPile, _childList));
                            });
                    } else {
                        cardStack
                            .forEach(card => {
                                allPromises.push(card.returnCard());
                            });
                    }

                } else {
                    if (isValidSuit && isValidValue) {
                        hasTransfer = true;
                        cardStack
                            .forEach(card => {
                                allPromises.push(card.transferToPile(intersectedPile, _childList));
                            });
                    } else {
                        cardStack
                            .forEach(card => {
                                allPromises.push(card.returnCard());
                            });
                    }
                }
            }
        } else {
            cardStack
                .forEach(card => {
                    allPromises.push(card.returnCard());
                });
        }

        Promise.all(allPromises)
            .then(() => {
                this._followCards = [];
                intersectedPile && this.displayChildrenName(intersectedPile);
                if (hasTransfer) {
                    this.checkPiles();
                    if (isCardFromWaste) {
                        this.wasteCards.shift();
                    }
                }
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
        return [...this.tableau.children, ...this.foundations.children].find(node => {
            return this.isNodeIntersectWithTarget(node, dragTarget)
        });
    }

    isNodeIntersectWithTarget(node, dragTarget) {
        const dragTargetBoundingBox = dragTarget.getComponent(UITransform).getBoundingBoxToWorld();
        const nodeTransform = node.getComponent(UITransform);
        const nodeBoundingBox = nodeTransform.getBoundingBoxToWorld();
        const isIntersectOverHalfX = Math.abs(dragTargetBoundingBox.x - nodeBoundingBox.x) <= nodeTransform.width / 2;
        const isIntersectOverHalfY = Math.abs(dragTargetBoundingBox.y - nodeBoundingBox.y) <= nodeTransform.height / 2;
        // isIntersectOverHalfX && isIntersectOverHalfY &&
        return Intersection2D.rectRect(dragTargetBoundingBox, nodeBoundingBox);
    }

    displayChildrenName(node) {
        console.log(node.getComponentsInChildren(SolitaireCard).map(card => {
            if (!card.faceDown.active) {
                return card.name;
            } else {
                return null;
            }
        }).filter(o => o));
    }

    checkPiles() {
        this.tableau.children.forEach(pile => {
            // check top card, if face down then reveal
            const topCard = pile.getComponentsInChildren(SolitaireCard).pop();
            if (topCard?.faceDown.active) {
                topCard.showFaceUpAnim().start();
            }
        })
    }

}

