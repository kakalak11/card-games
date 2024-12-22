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
import { NodePool } from 'cc';
import { tween } from 'cc';

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

    @property(Node) winScene: Node;

    cards: SolitaireCard[] = [];
    stockCards: SolitaireCard[] = [];
    wasteCards: SolitaireCard[] = [];

    followCards: SolitaireCard[] = [];
    _poolCard: NodePool = new NodePool();

    protected onLoad(): void {
        this.node.on("ON_DRAG_CARD_END", this.onDragCardEnd, this);
        this.node.on("ON_DRAG_CARD_BEGIN", this.onDragCardBegin, this);
        this.node.on("ON_DRAG_CARD_MOVE", this.onDragCardMove, this);
        this.node.on("ON_TAP_CARD", this.onTapCard, this);

        for (let i = 0; i < 52; i++) {
            this._poolCard.put(instantiate(this.cardPrefab));
        }
    }

    protected start(): void {
        let deck = getDeck();
        console.warn(JSON.stringify(deck));
        // deck = JSON.parse(`[{"value":"9","suit":"heart","numberValue":9},{"value":"7","suit":"heart","numberValue":7},{"value":"2","suit":"spade","numberValue":2},{"value":"K","suit":"club","numberValue":10},{"value":"5","suit":"diamond","numberValue":5},{"value":"10","suit":"club","numberValue":10},{"value":"Q","suit":"heart","numberValue":10},{"value":"8","suit":"club","numberValue":8},{"value":"6","suit":"spade","numberValue":6},{"value":"2","suit":"diamond","numberValue":2},{"value":"10","suit":"diamond","numberValue":10},{"value":"J","suit":"spade","numberValue":10},{"value":"A","suit":"diamond","numberValue":10},{"value":"7","suit":"diamond","numberValue":7},{"value":"Q","suit":"diamond","numberValue":10},{"value":"K","suit":"diamond","numberValue":10},{"value":"A","suit":"heart","numberValue":10},{"value":"10","suit":"heart","numberValue":10},{"value":"5","suit":"club","numberValue":5},{"value":"4","suit":"spade","numberValue":4},{"value":"A","suit":"club","numberValue":10},{"value":"3","suit":"diamond","numberValue":3},{"value":"10","suit":"spade","numberValue":10},{"value":"5","suit":"spade","numberValue":5},{"value":"8","suit":"heart","numberValue":8},{"value":"K","suit":"heart","numberValue":10},{"value":"8","suit":"spade","numberValue":8},{"value":"7","suit":"spade","numberValue":7},{"value":"9","suit":"diamond","numberValue":9},{"value":"J","suit":"club","numberValue":10},{"value":"6","suit":"heart","numberValue":6},{"value":"2","suit":"club","numberValue":2},{"value":"2","suit":"heart","numberValue":2},{"value":"4","suit":"club","numberValue":4},{"value":"J","suit":"heart","numberValue":10},{"value":"6","suit":"club","numberValue":6},{"value":"4","suit":"heart","numberValue":4},{"value":"3","suit":"heart","numberValue":3},{"value":"5","suit":"heart","numberValue":5},{"value":"Q","suit":"club","numberValue":10},{"value":"3","suit":"spade","numberValue":3},{"value":"3","suit":"club","numberValue":3},{"value":"9","suit":"club","numberValue":9},{"value":"7","suit":"club","numberValue":7},{"value":"4","suit":"diamond","numberValue":4},{"value":"6","suit":"diamond","numberValue":6},{"value":"Q","suit":"spade","numberValue":10},{"value":"9","suit":"spade","numberValue":9},{"value":"J","suit":"diamond","numberValue":10},{"value":"K","suit":"spade","numberValue":10},{"value":"8","suit":"diamond","numberValue":8},{"value":"A","suit":"spade","numberValue":10}]`)
        deck = JSON.parse(`[{"value":"2","suit":"spade","numberValue":2},{"value":"8","suit":"club","numberValue":8},{"value":"6","suit":"heart","numberValue":6},{"value":"9","suit":"heart","numberValue":9},{"value":"6","suit":"spade","numberValue":6},{"value":"K","suit":"club","numberValue":10},{"value":"9","suit":"diamond","numberValue":9},{"value":"4","suit":"diamond","numberValue":4},{"value":"6","suit":"diamond","numberValue":6},{"value":"J","suit":"spade","numberValue":10},{"value":"10","suit":"spade","numberValue":10},{"value":"K","suit":"spade","numberValue":10},{"value":"6","suit":"club","numberValue":6},{"value":"7","suit":"heart","numberValue":7},{"value":"A","suit":"spade","numberValue":10},{"value":"Q","suit":"diamond","numberValue":10},{"value":"3","suit":"club","numberValue":3},{"value":"4","suit":"club","numberValue":4},{"value":"Q","suit":"club","numberValue":10},{"value":"10","suit":"diamond","numberValue":10},{"value":"2","suit":"diamond","numberValue":2},{"value":"A","suit":"club","numberValue":10},{"value":"7","suit":"spade","numberValue":7},{"value":"3","suit":"spade","numberValue":3},{"value":"8","suit":"diamond","numberValue":8},{"value":"2","suit":"heart","numberValue":2},{"value":"4","suit":"spade","numberValue":4},{"value":"4","suit":"heart","numberValue":4},{"value":"5","suit":"heart","numberValue":5},{"value":"10","suit":"club","numberValue":10},{"value":"Q","suit":"heart","numberValue":10},{"value":"5","suit":"spade","numberValue":5},{"value":"5","suit":"diamond","numberValue":5},{"value":"J","suit":"diamond","numberValue":10},{"value":"K","suit":"diamond","numberValue":10},{"value":"3","suit":"heart","numberValue":3},{"value":"K","suit":"heart","numberValue":10},{"value":"J","suit":"club","numberValue":10},{"value":"2","suit":"club","numberValue":2},{"value":"5","suit":"club","numberValue":5},{"value":"7","suit":"club","numberValue":7},{"value":"3","suit":"diamond","numberValue":3},{"value":"8","suit":"spade","numberValue":8},{"value":"8","suit":"heart","numberValue":8},{"value":"Q","suit":"spade","numberValue":10},{"value":"10","suit":"heart","numberValue":10},{"value":"J","suit":"heart","numberValue":10},{"value":"A","suit":"heart","numberValue":10},{"value":"7","suit":"diamond","numberValue":7},{"value":"9","suit":"club","numberValue":9},{"value":"9","suit":"spade","numberValue":9},{"value":"A","suit":"diamond","numberValue":10}]`)
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

                        const cardNode = this._poolCard.get();
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
        let poppedCard: SolitaireCard;
        let tweenDealCard = tween(this);
        let temp = [0, 0, 0, 0, 0, 0, 0];
        for (let col = 0; col < tableauPiles.length; col++) {

            tweenDealCard
                .delay(0.1)
                .call(() => {
                    poppedCard = slicedCards.pop();
                    changeParent(poppedCard.node, this.dragHolder);
                    poppedCard.dealToPile(tableauPiles[col], temp[col], 0.4, true);
                    temp[col]++;
                    this.stockInfo.string = `Number of Cards: ${slicedCards.length}`;

                })

            for (let _col = col + 1; _col < tableauPiles.length; _col++) {

                tweenDealCard
                    .delay(0.1)
                    .call(() => {
                        poppedCard = slicedCards.pop();
                        changeParent(poppedCard.node, this.dragHolder);
                        poppedCard.dealToPile(tableauPiles[_col], temp[_col], 0.4);
                        temp[_col]++;
                        this.stockInfo.string = `Number of Cards: ${slicedCards.length}`;
                    })
            }
        }
        tweenDealCard
            .call(() => {
                this.cards.filter(card => !card?.faceDown.active).forEach(card => card.enableEvent());
                this.stockCards = this.stockCardsNode.children.map(card => card.getComponent(SolitaireCard));
                this.stockInfo.string = `Number of Cards: ${this.stockCards.length}`;
                this.getStockButton.interactable = true;
            })
            .start();
        this.getStockButton.interactable = false;
    }

    gameRestart() {
        this.cards.forEach(card => card.reset() && this._poolCard.put(card.node));
        this.cards = [];
        this.stockCards = [];
        this.wasteCards = [];
        this.followCards = [];

        this.scheduleOnce(() => this.start(), 0.5);
    }

    getStock() {
        const time = 0.2;
        if (this.stockCards.length == 0) {
            const distance = this.stockCardsNode.getPosition().subtract(this.wasteCardsNode.getPosition());
            this.stockCards = this.wasteCards;
            this.wasteCards = [];

            this.stockCards.forEach(card => {
                card.slideFaceDownTo(distance, time, this.stockCardsNode);
            });
        } else {
            const popCard = this.stockCards.pop();
            const distance = this.wasteCardsNode.getPosition().subtract(this.stockCardsNode.getPosition());

            this.wasteCards.unshift(popCard);
            popCard.slideFaceUpTo(distance, time, this.wasteCardsNode);
        }

        this.scheduleOnce(() => {
            this.getStockButton.interactable = true;
        }, time);
        this.getStockButton.interactable = false;
        this.stockInfo.string = `Number of Cards: ${this.stockCards.length}`;
    }

    onDragCardEnd(event: Event, targetPile?, followCards?) {
        const dragCard: SolitaireCard = event.target.getComponent(SolitaireCard);
        const intersectedPile = targetPile || this.checkCardIntersection(event.target);
        const _followCards = followCards || this.followCards
        const cardStack: SolitaireCard[] = [dragCard, ..._followCards];
        const isCardFromWaste = dragCard.isCardFromWaste();
        let allPromises = [];
        let hasTransfer;

        function _returnCard() {
            return cardStack.map(card => card.returnCard());
        }

        if (intersectedPile) {
            const isFoundation = intersectedPile.name.startsWith("Foundation");
            const topCard = intersectedPile.getComponentsInChildren(SolitaireCard).pop();
            let countChild = intersectedPile.children.length;

            function _transferToFoundation() {
                return cardStack.map(card => {
                    card.transferToFoundation(intersectedPile, countChild);
                    countChild++;
                });
            }

            function _transferToTableau() {
                return cardStack.map(card => {
                    card.transferToPile(intersectedPile, countChild);
                    countChild++;
                });
            }

            cardStack.forEach(card => changeParent(card.node, this.dragHolder));
            if (!topCard) {
                const isValidSuit = intersectedPile.name.endsWith("_" + dragCard.suit);

                if (isFoundation) {
                    if (isValidSuit && dragCard.valueName == "A" && cardStack.length == 1) {
                        hasTransfer = true;
                        allPromises.push(..._transferToFoundation());
                    } else {
                        allPromises.push(..._returnCard());
                    }
                } else {
                    if (dragCard.valueName == "K") {
                        hasTransfer = true;
                        allPromises.push(..._transferToTableau());
                    } else {
                        allPromises.push(..._returnCard());
                    }
                }


            } else if (this.isValidMove(dragCard, topCard)) {
                hasTransfer = true;

                if (isFoundation) {
                    allPromises.push(..._transferToFoundation());
                } else {
                    allPromises.push(..._transferToTableau());
                }

            } else {
                allPromises.push(..._returnCard());
            }
        } else {
            allPromises.push(..._returnCard());
        }

        Promise.all(allPromises)
            .then(() => {
                this.followCards = [];
                // intersectedPile && this.displayChildrenName(intersectedPile);
                if (hasTransfer) {
                    this.checkPiles();
                    if (isCardFromWaste) {
                        this.wasteCards.shift();
                    }
                }
                if (this.foundations.children.every(pile => pile.children.length == 13)) {
                    // Win game
                }
            });
    }

    onDragCardBegin(event: Event) {
        const currPile = event.target.parent?.name.startsWith("Pile_") && event.target.parent;

        if (currPile) {
            this.followCards = currPile.children.slice(event.target.getSiblingIndex() + 1).map(o => o.getComponent(SolitaireCard));

            changeParent(event.target, this.dragHolder);
            this.followCards.forEach(card => changeParent(card.node, this.dragHolder));
        }
    }

    onDragCardMove(event: Event) {
        if (event["moveEvent"] && this.followCards.length > 0) {
            this.followCards.forEach(card => card.follow(event["moveEvent"]));
        }
    }

    onTapCard(event: Event) {
        // auto-play the possible move
        const tapCard = event.target.getComponent(SolitaireCard);
        const isFoundation = tapCard.getParent().name.startsWith("Foundation");
        // const isWaste = tapCard.getParent().name.startsWith("WasteCards");
        const isPile = tapCard.getParent().name.startsWith("Pile");
        const followCards = isPile && event.target.parent.children.slice(event.target.getSiblingIndex() + 1).map(o => o.getComponent(SolitaireCard));

        // get available cards, which are the piles or the foundation top card.
        const availCard = [...this.foundations.children, ...this.tableau.children]
            .map(pile => {
                return pile.children.slice().pop()?.getComponent(SolitaireCard);
            }).filter(o => o)
            .find(card => {
                return this.isValidMove(tapCard, card);
            });

        const foundationPile = [...this.foundations.children].find(foundPile => foundPile.name.endsWith("_" + tapCard.suit));
        if (tapCard.valueName == "A" && !isFoundation) {
            const foundationPile = [...this.foundations.children].find(foundPile => foundPile.name.endsWith("_" + tapCard.suit));
            this.onDragCardEnd(event, foundationPile);
        } else if (tapCard.valueName == "K") {
            const availPile = [...this.tableau.children].find(o => o.children.length == 0);

            if (foundationPile.children.length == 12) {
                this.onDragCardEnd(event, foundationPile);
            } else if (availPile) {
                this.onDragCardEnd(event, availPile, followCards);
            }
        } else if (availCard) {
            this.onDragCardEnd(event, availCard.node.parent, followCards);
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

    isValidMove(currCard: SolitaireCard, targetCard: SolitaireCard) {
        let isValidValue;
        let isValidSuit;
        const isFoundation = targetCard.node.parent.name.startsWith("Foundation");

        if (isFoundation) {
            isValidValue = currCard.value - targetCard.value == 1;
            isValidSuit = targetCard.suit == currCard.suit;
        } else {
            isValidSuit = RED_SUITS.includes(targetCard.suit) && BLACK_SUITS.includes(currCard.suit)
                || BLACK_SUITS.includes(targetCard.suit) && RED_SUITS.includes(currCard.suit);
            isValidValue = targetCard.value - currCard.value == 1;
        }

        return isValidSuit && isValidValue;

    }
}