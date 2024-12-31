import { resources, v3 } from 'cc';
import { instantiate } from 'cc';
import { error } from 'cc';
import { Prefab } from 'cc';
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { SolitaireCard } from './SolitaireCard';
import { BLACK_SUITS, changeParent, getDeck, RED_SUITS } from "../../scripts/utils"
import { Label } from 'cc';
import { Button } from 'cc';
import { Layout } from 'cc';
import { UITransform } from 'cc';
import { Intersection2D } from 'cc';
import { Event } from 'cc';
import { NodePool } from 'cc';
import { tween } from 'cc';
import { DebugMode } from 'cc';
import { game } from 'cc';
import { Tween } from 'cc';
import { UIOpacity } from 'cc';
import { BlockInputEvents } from 'cc';
import { DataStorage } from '../../../@types/packages/scene/@types/cce/utils/ipc/utils';
import { sys } from 'cc';

const { ccclass, property } = _decorator;
const CARD_SCALE_FACTOR = 3 / 4;
const CARD_HEIGHT = 144 * CARD_SCALE_FACTOR, CARD_WIDTH = 100 * CARD_SCALE_FACTOR;
const CARD_SPACING_Y = CARD_HEIGHT / 8;
const CARD_FACE_UP_SPACING_Y = CARD_HEIGHT / 3.2;
const SESSION_KEY = Date.now();


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
    @property(Button) autoResolveButton: Button;
    @property(Button) undoButton: Button;
    @property(BlockInputEvents) blockAll: BlockInputEvents;

    @property(Label) moveInfoLabel: Label;
    @property(Label) scoreInfoLabel: Label;
    @property(Label) timeInfoLabel: Label;

    cards: SolitaireCard[] = [];
    stockCards: SolitaireCard[] = [];
    wasteCards: SolitaireCard[] = [];
    followCards: SolitaireCard[] = [];

    _poolCard: NodePool = new NodePool();
    _isAuto: boolean;
    _sessionData: any[] = [];
    _score: number = 0;
    _updateTime: () => void;

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
        // deck = JSON.parse(`[{"value":"8","suit":"diamond","numberValue":8},{"value":"Q","suit":"heart","numberValue":10},{"value":"9","suit":"club","numberValue":9},{"value":"A","suit":"spade","numberValue":10},{"value":"Q","suit":"club","numberValue":10},{"value":"K","suit":"heart","numberValue":10},{"value":"10","suit":"club","numberValue":10},{"value":"2","suit":"heart","numberValue":2},{"value":"K","suit":"diamond","numberValue":10},{"value":"4","suit":"spade","numberValue":4},{"value":"5","suit":"club","numberValue":5},{"value":"5","suit":"heart","numberValue":5},{"value":"4","suit":"club","numberValue":4},{"value":"3","suit":"spade","numberValue":3},{"value":"J","suit":"club","numberValue":10},{"value":"2","suit":"diamond","numberValue":2},{"value":"A","suit":"diamond","numberValue":10},{"value":"J","suit":"spade","numberValue":10},{"value":"5","suit":"diamond","numberValue":5},{"value":"K","suit":"spade","numberValue":10},{"value":"10","suit":"diamond","numberValue":10},{"value":"6","suit":"heart","numberValue":6},{"value":"7","suit":"spade","numberValue":7},{"value":"8","suit":"heart","numberValue":8},{"value":"6","suit":"spade","numberValue":6},{"value":"9","suit":"diamond","numberValue":9},{"value":"5","suit":"spade","numberValue":5},{"value":"Q","suit":"diamond","numberValue":10},{"value":"Q","suit":"spade","numberValue":10},{"value":"A","suit":"heart","numberValue":10},{"value":"2","suit":"club","numberValue":2},{"value":"7","suit":"club","numberValue":7},{"value":"6","suit":"diamond","numberValue":6},{"value":"4","suit":"heart","numberValue":4},{"value":"9","suit":"heart","numberValue":9},{"value":"4","suit":"diamond","numberValue":4},{"value":"2","suit":"spade","numberValue":2},{"value":"3","suit":"heart","numberValue":3},{"value":"J","suit":"diamond","numberValue":10},{"value":"6","suit":"club","numberValue":6},{"value":"8","suit":"club","numberValue":8},{"value":"7","suit":"diamond","numberValue":7},{"value":"J","suit":"heart","numberValue":10},{"value":"K","suit":"club","numberValue":10},{"value":"9","suit":"spade","numberValue":9},{"value":"8","suit":"spade","numberValue":8},{"value":"7","suit":"heart","numberValue":7},{"value":"10","suit":"spade","numberValue":10},{"value":"3","suit":"diamond","numberValue":3},{"value":"10","suit":"heart","numberValue":10},{"value":"A","suit":"club","numberValue":10},{"value":"3","suit":"club","numberValue":3}]`)
        // deck = JSON.parse(`[{"value":"A","suit":"club","numberValue":10},{"value":"10","suit":"heart","numberValue":10},{"value":"6","suit":"spade","numberValue":6},{"value":"5","suit":"club","numberValue":5},{"value":"J","suit":"spade","numberValue":10},{"value":"4","suit":"heart","numberValue":4},{"value":"J","suit":"club","numberValue":10},{"value":"J","suit":"diamond","numberValue":10},{"value":"9","suit":"diamond","numberValue":9},{"value":"9","suit":"spade","numberValue":9},{"value":"K","suit":"spade","numberValue":10},{"value":"10","suit":"club","numberValue":10},{"value":"3","suit":"diamond","numberValue":3},{"value":"2","suit":"club","numberValue":2},{"value":"A","suit":"spade","numberValue":10},{"value":"2","suit":"diamond","numberValue":2},{"value":"7","suit":"club","numberValue":7},{"value":"7","suit":"heart","numberValue":7},{"value":"10","suit":"spade","numberValue":10},{"value":"6","suit":"diamond","numberValue":6},{"value":"7","suit":"diamond","numberValue":7},{"value":"7","suit":"spade","numberValue":7},{"value":"5","suit":"diamond","numberValue":5},{"value":"A","suit":"diamond","numberValue":10},{"value":"Q","suit":"heart","numberValue":10},{"value":"J","suit":"heart","numberValue":10},{"value":"4","suit":"club","numberValue":4},{"value":"K","suit":"heart","numberValue":10},{"value":"3","suit":"spade","numberValue":3},{"value":"4","suit":"diamond","numberValue":4},{"value":"9","suit":"club","numberValue":9},{"value":"5","suit":"heart","numberValue":5},{"value":"3","suit":"club","numberValue":3},{"value":"4","suit":"spade","numberValue":4},{"value":"8","suit":"spade","numberValue":8},{"value":"3","suit":"heart","numberValue":3},{"value":"Q","suit":"spade","numberValue":10},{"value":"Q","suit":"diamond","numberValue":10},{"value":"5","suit":"spade","numberValue":5},{"value":"Q","suit":"club","numberValue":10},{"value":"2","suit":"spade","numberValue":2},{"value":"K","suit":"club","numberValue":10},{"value":"6","suit":"heart","numberValue":6},{"value":"10","suit":"diamond","numberValue":10},{"value":"2","suit":"heart","numberValue":2},{"value":"6","suit":"club","numberValue":6},{"value":"K","suit":"diamond","numberValue":10},{"value":"8","suit":"diamond","numberValue":8},{"value":"9","suit":"heart","numberValue":9},{"value":"8","suit":"club","numberValue":8},{"value":"A","suit":"heart","numberValue":10},{"value":"8","suit":"heart","numberValue":8}]`)
        // deck = JSON.parse(`[{"value":"9","suit":"heart","numberValue":9},{"value":"7","suit":"heart","numberValue":7},{"value":"2","suit":"spade","numberValue":2},{"value":"K","suit":"club","numberValue":10},{"value":"5","suit":"diamond","numberValue":5},{"value":"10","suit":"club","numberValue":10},{"value":"Q","suit":"heart","numberValue":10},{"value":"8","suit":"club","numberValue":8},{"value":"6","suit":"spade","numberValue":6},{"value":"2","suit":"diamond","numberValue":2},{"value":"10","suit":"diamond","numberValue":10},{"value":"J","suit":"spade","numberValue":10},{"value":"A","suit":"diamond","numberValue":10},{"value":"7","suit":"diamond","numberValue":7},{"value":"Q","suit":"diamond","numberValue":10},{"value":"K","suit":"diamond","numberValue":10},{"value":"A","suit":"heart","numberValue":10},{"value":"10","suit":"heart","numberValue":10},{"value":"5","suit":"club","numberValue":5},{"value":"4","suit":"spade","numberValue":4},{"value":"A","suit":"club","numberValue":10},{"value":"3","suit":"diamond","numberValue":3},{"value":"10","suit":"spade","numberValue":10},{"value":"5","suit":"spade","numberValue":5},{"value":"8","suit":"heart","numberValue":8},{"value":"K","suit":"heart","numberValue":10},{"value":"8","suit":"spade","numberValue":8},{"value":"7","suit":"spade","numberValue":7},{"value":"9","suit":"diamond","numberValue":9},{"value":"J","suit":"club","numberValue":10},{"value":"6","suit":"heart","numberValue":6},{"value":"2","suit":"club","numberValue":2},{"value":"2","suit":"heart","numberValue":2},{"value":"4","suit":"club","numberValue":4},{"value":"J","suit":"heart","numberValue":10},{"value":"6","suit":"club","numberValue":6},{"value":"4","suit":"heart","numberValue":4},{"value":"3","suit":"heart","numberValue":3},{"value":"5","suit":"heart","numberValue":5},{"value":"Q","suit":"club","numberValue":10},{"value":"3","suit":"spade","numberValue":3},{"value":"3","suit":"club","numberValue":3},{"value":"9","suit":"club","numberValue":9},{"value":"7","suit":"club","numberValue":7},{"value":"4","suit":"diamond","numberValue":4},{"value":"6","suit":"diamond","numberValue":6},{"value":"Q","suit":"spade","numberValue":10},{"value":"9","suit":"spade","numberValue":9},{"value":"J","suit":"diamond","numberValue":10},{"value":"K","suit":"spade","numberValue":10},{"value":"8","suit":"diamond","numberValue":8},{"value":"A","suit":"spade","numberValue":10}]`)
        // deck = JSON.parse(`[{"value":"2","suit":"spade","numberValue":2},{"value":"8","suit":"club","numberValue":8},{"value":"6","suit":"heart","numberValue":6},{"value":"9","suit":"heart","numberValue":9},{"value":"6","suit":"spade","numberValue":6},{"value":"K","suit":"club","numberValue":10},{"value":"9","suit":"diamond","numberValue":9},{"value":"4","suit":"diamond","numberValue":4},{"value":"6","suit":"diamond","numberValue":6},{"value":"J","suit":"spade","numberValue":10},{"value":"10","suit":"spade","numberValue":10},{"value":"K","suit":"spade","numberValue":10},{"value":"6","suit":"club","numberValue":6},{"value":"7","suit":"heart","numberValue":7},{"value":"A","suit":"spade","numberValue":10},{"value":"Q","suit":"diamond","numberValue":10},{"value":"3","suit":"club","numberValue":3},{"value":"4","suit":"club","numberValue":4},{"value":"Q","suit":"club","numberValue":10},{"value":"10","suit":"diamond","numberValue":10},{"value":"2","suit":"diamond","numberValue":2},{"value":"A","suit":"club","numberValue":10},{"value":"7","suit":"spade","numberValue":7},{"value":"3","suit":"spade","numberValue":3},{"value":"8","suit":"diamond","numberValue":8},{"value":"2","suit":"heart","numberValue":2},{"value":"4","suit":"spade","numberValue":4},{"value":"4","suit":"heart","numberValue":4},{"value":"5","suit":"heart","numberValue":5},{"value":"10","suit":"club","numberValue":10},{"value":"Q","suit":"heart","numberValue":10},{"value":"5","suit":"spade","numberValue":5},{"value":"5","suit":"diamond","numberValue":5},{"value":"J","suit":"diamond","numberValue":10},{"value":"K","suit":"diamond","numberValue":10},{"value":"3","suit":"heart","numberValue":3},{"value":"K","suit":"heart","numberValue":10},{"value":"J","suit":"club","numberValue":10},{"value":"2","suit":"club","numberValue":2},{"value":"5","suit":"club","numberValue":5},{"value":"7","suit":"club","numberValue":7},{"value":"3","suit":"diamond","numberValue":3},{"value":"8","suit":"spade","numberValue":8},{"value":"8","suit":"heart","numberValue":8},{"value":"Q","suit":"spade","numberValue":10},{"value":"10","suit":"heart","numberValue":10},{"value":"J","suit":"heart","numberValue":10},{"value":"A","suit":"heart","numberValue":10},{"value":"7","suit":"diamond","numberValue":7},{"value":"9","suit":"club","numberValue":9},{"value":"9","suit":"spade","numberValue":9},{"value":"A","suit":"diamond","numberValue":10}]`)
        // deck = JSON.parse(`[{"value":"9","suit":"club","numberValue":9},{"value":"6","suit":"diamond","numberValue":6},{"value":"7","suit":"diamond","numberValue":7},{"value":"J","suit":"club","numberValue":10},{"value":"J","suit":"diamond","numberValue":10},{"value":"10","suit":"spade","numberValue":10},{"value":"6","suit":"club","numberValue":6},{"value":"2","suit":"heart","numberValue":2},{"value":"A","suit":"diamond","numberValue":10},{"value":"Q","suit":"club","numberValue":10},{"value":"J","suit":"spade","numberValue":10},{"value":"4","suit":"heart","numberValue":4},{"value":"2","suit":"spade","numberValue":2},{"value":"K","suit":"spade","numberValue":10},{"value":"8","suit":"diamond","numberValue":8},{"value":"2","suit":"club","numberValue":2},{"value":"3","suit":"club","numberValue":3},{"value":"K","suit":"heart","numberValue":10},{"value":"3","suit":"diamond","numberValue":3},{"value":"K","suit":"club","numberValue":10},{"value":"5","suit":"spade","numberValue":5},{"value":"8","suit":"spade","numberValue":8},{"value":"9","suit":"diamond","numberValue":9},{"value":"5","suit":"club","numberValue":5},{"value":"8","suit":"heart","numberValue":8},{"value":"Q","suit":"diamond","numberValue":10},{"value":"7","suit":"heart","numberValue":7},{"value":"7","suit":"spade","numberValue":7},{"value":"6","suit":"spade","numberValue":6},{"value":"6","suit":"heart","numberValue":6},{"value":"4","suit":"diamond","numberValue":4},{"value":"7","suit":"club","numberValue":7},{"value":"9","suit":"spade","numberValue":9},{"value":"10","suit":"club","numberValue":10},{"value":"3","suit":"spade","numberValue":3},{"value":"A","suit":"heart","numberValue":10},{"value":"5","suit":"diamond","numberValue":5},{"value":"5","suit":"heart","numberValue":5},{"value":"K","suit":"diamond","numberValue":10},{"value":"4","suit":"spade","numberValue":4},{"value":"3","suit":"heart","numberValue":3},{"value":"Q","suit":"spade","numberValue":10},{"value":"8","suit":"club","numberValue":8},{"value":"10","suit":"diamond","numberValue":10},{"value":"A","suit":"club","numberValue":10},{"value":"2","suit":"diamond","numberValue":2},{"value":"10","suit":"heart","numberValue":10},{"value":"4","suit":"club","numberValue":4},{"value":"9","suit":"heart","numberValue":9},{"value":"J","suit":"heart","numberValue":10},{"value":"Q","suit":"heart","numberValue":10},{"value":"A","suit":"spade","numberValue":10}]`)
        this.loadCards(deck)
            .then(cards => {
                this.cards = cards;
                this.gameStart();
                // this.gameStartTestAutoPlay();
                this.updateTableauHeight();
                this.undoButton.interactable = this._sessionData.length > 0;
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
        const stockInfo = this.stockInfo;
        const getStockBtn = this.getStockButton;

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
                    stockInfo.string = slicedCards.length.toString();
                })

            for (let _col = col + 1; _col < tableauPiles.length; _col++) {
                tweenDealCard
                    .delay(0.1)
                    .call(() => {
                        poppedCard = slicedCards.pop();
                        changeParent(poppedCard.node, this.dragHolder);
                        poppedCard.dealToPile(tableauPiles[_col], temp[_col], 0.4);
                        temp[_col]++;
                        stockInfo.string = slicedCards.length.toString();
                    })

            }
        }
        this.blockAll.enabled = true;
        getStockBtn.interactable = false;
        tweenDealCard
            .call(() => {
                this.cards.forEach(card => card.setOriginalPos());
                this.cards.filter(card => !card?.faceDown.active).forEach(card => card.enableEvent());
                this.stockCards = this.stockCardsNode.children.map(card => card.getComponent(SolitaireCard));
                this.stockCards.forEach(card => card?.setCardParent?.(this.stockCardsNode));
                stockInfo.string = `${this.stockCards.length}`;
                getStockBtn.interactable = true;
                this.blockAll.enabled = false;
                this.startTimer();
            })
            .start();
    }

    gameStartTestAutoPlay() {
        const slicedCards = this.cards.slice();
        const tableauPiles = this.tableau.children.slice();
        const stockInfo = this.stockInfo;
        const getStockBtn = this.getStockButton;

        let poppedCard: SolitaireCard;
        let tweenDealCard = tween(this);
        let temp = [0, 0, 0, 0, 0, 0, 0];
        for (let col = 0; col < tableauPiles.length; col++) {

            if (col == 0) {
                tweenDealCard
                    .delay(0.1)
                    .call(() => {
                        poppedCard = slicedCards.pop();
                        changeParent(poppedCard.node, this.dragHolder);
                        poppedCard.dealToPile(tableauPiles[col], temp[col], 0.2);
                        temp[col]++;
                        stockInfo.string = slicedCards.length.toString();
                    })
            }
            tweenDealCard
                .delay(0.1)
                .call(() => {
                    poppedCard = slicedCards.pop();
                    changeParent(poppedCard.node, this.dragHolder);
                    poppedCard.dealToPile(tableauPiles[col], temp[col], 0.2, true);
                    temp[col]++;
                    stockInfo.string = slicedCards.length.toString();
                })
        }
        tweenDealCard
            .call(() => {
                this.cards.forEach(card => card.setOriginalPos());
                this.cards.filter(card => !card?.faceDown.active).forEach(card => card.enableEvent());
                this.stockCards = this.stockCardsNode.children.map(card => card.getComponent(SolitaireCard));
                this.stockCards.forEach(card => card.setCardParent(this.stockCardsNode));

                stockInfo.string = this.stockCards.length.toString();
                getStockBtn.interactable = true;
            })
            .start();
        getStockBtn.interactable = false;
    }

    gameRestart() {
        this.cards.forEach(card => card.reset() && this._poolCard.put(card.node));
        this.cards = [];
        this.stockCards = [];
        this.wasteCards = [];
        this.followCards = [];
        this._isAuto = false;
        this._score = 0;

        this.hideAutoResolveButton();
        this.hideWinCutscene();
        this.unschedule(this._updateTime);

        this.scheduleOnce(() => this.start(), 0.5);
    }

    getStock() {
        const time = 0.2;
        const stockWorldPos = this.stockCardsNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        const wasteWorldPos = this.wasteCardsNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        let popCard: SolitaireCard;
        let fromParent;
        let allPromises = [];

        if (this.stockCards.length == 0) {

            const moveVec = stockWorldPos.subtract(wasteWorldPos);
            this.stockCards = this.wasteCards;
            this.wasteCards = [];

            this.stockCards.forEach(card => {
                allPromises.push(card.slideFaceDownTo(moveVec, time, this.stockCardsNode));
                card.setCardParent(this.stockCardsNode);
            });
        } else {
            const moveVec = wasteWorldPos.subtract(stockWorldPos);
            popCard = this.stockCards.pop();
            fromParent = popCard?.getCardParent()?.name;

            this.wasteCards.unshift(popCard);
            allPromises.push(popCard.slideFaceUpTo(moveVec, time, this.wasteCardsNode));

            // const secondWasteCard = this.wasteCards[1];
            // secondWasteCard?.moveAsideWaste(time);
            // const thirdWasteCard = this.wasteCards[2];
            // thirdWasteCard?.moveAsideWaste(time);
        }

        this.getStockButton.interactable = false;
        this.stockInfo.string = `${this.stockCards.length}`;
        Promise.all(allPromises)
            .then(() => {
                this.getStockButton.interactable = true;
                this.storeMoveData(popCard, fromParent);
            });
    }

    onDragCardEnd(event: Event, targetPile?, followCards?) {
        const dragCard: SolitaireCard = event.target.getComponent(SolitaireCard);
        const intersectedPile: Node = targetPile || this.checkCardIntersection(event.target);
        const _followCards = followCards || this.followCards
        const cardStack: SolitaireCard[] = [dragCard, ..._followCards];
        const isCardFromWaste = dragCard.isCardFromWaste();
        const fromParent = dragCard?.getCardParent()?.name;

        let allPromises = [];
        let hasTransfer;
        let score = this._score;

        if (dragCard.node.parent !== this.dragHolder) {
            changeParent(dragCard.node, this.dragHolder);
            if (dragCard.faceDown.active) dragCard?.showFaceUpAnim(0.2).start();
        }

        function _returnCard() {
            return cardStack.map(card => card.returnCard());
        }

        if (intersectedPile) {
            const isFoundation = intersectedPile.name.startsWith("Foundation");
            const topCard = intersectedPile.getComponentsInChildren(SolitaireCard).pop();
            let countFaceDownChild = intersectedPile.children.filter(card => card.getComponent(SolitaireCard).faceDown.active).length;
            let countFaceUpChild = intersectedPile.children.filter(card => !card.getComponent(SolitaireCard).faceDown.active).length;

            function _transferToFoundation() {
                score += 10;
                return cardStack.map(card => {
                    let promise = card.transferToFoundation(intersectedPile, countFaceDownChild + countFaceUpChild);
                    countFaceUpChild++;
                    return promise;
                });
            }

            function _transferToTableau() {
                if (fromParent.startsWith("WasteCards")) score += 5;
                return cardStack.map(card => {
                    let promise = card.transferToPile(intersectedPile, countFaceDownChild, countFaceUpChild);
                    countFaceUpChild++;
                    return promise;
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

        if (hasTransfer) {
            let revealPromises = this.revealTopCardEachPile()
            allPromises.push(...revealPromises);

            if (revealPromises.length > 0) score += 5;
            if (isCardFromWaste) {
                this.wasteCards.shift();
            }
        }
        if (fromParent.startsWith("Foundation")) {
            score -= 15;
        }

        Promise.all(allPromises)
            .then(() => {
                this._score = score;
                this.scoreInfoLabel.string = this._score.toString();

                if (hasTransfer) {
                    this.storeMoveData(dragCard, fromParent);
                }
                this.followCards = [];
                this.updateTableauHeight();
                const allTabCards = this.tableau.getComponentsInChildren(SolitaireCard);
                const isRevealAllCards = allTabCards.filter(card => !card.faceDown.active).length == allTabCards.length - 1;

                if (this.foundations.children.every(pile => pile.children.length == 13)) {
                    // Win game
                    this.showWinCutscene();
                } else if (isRevealAllCards && !this._isAuto) {
                    this.showAutoResolveButton();
                } else if (this._isAuto) {
                    this.onAutoPlay();
                }
            });
    }

    onDragCardBegin(event: Event) {
        const currPile = event.target.parent?.name.startsWith("Pile_") && event.target.parent;

        if (currPile) {
            this.followCards = currPile.children.slice(event.target.getSiblingIndex() + 1).map(o => o.getComponent(SolitaireCard));
        } else {
            // changeParent(event.target, this.dragHolder);
        }
    }

    onDragCardMove(event: Event) {
        if (event["moveEvent"] && this.followCards.length > 0) {
            this.followCards.forEach(card => card.follow(event["moveEvent"]));

            changeParent(event.target, this.dragHolder);
            this.followCards.forEach(card => changeParent(card.node, this.dragHolder));
        }
    }

    onTapCard(event: Event) {
        // auto-play the possible move
        const tapCard: SolitaireCard = event.target.getComponent(SolitaireCard);
        const isFoundation = tapCard.getCardParent().name.startsWith("Foundation");
        // const isWaste = tapCard.getCardParent().name.startsWith("WasteCards");
        const isPile = tapCard.getCardParent().name.startsWith("Pile");
        const followCards: SolitaireCard[] = isPile && event.target.parent.children.slice(event.target.getSiblingIndex() + 1).map(o => o.getComponent(SolitaireCard));

        // get available cards, which are the piles or the foundation top card.
        const availCard = [...this.foundations.children, ...this.tableau.children]
            .map(pile => {
                if (tapCard.getCardParent() === pile) return;
                return pile.children.slice().pop()?.getComponent(SolitaireCard);
            })
            .filter(o => o)
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
        } else {
            tapCard.returnCard(true);
            tapCard.shake();
            followCards && followCards.forEach(card => card.returnCard(true));
            this.followCards = [];
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

    revealTopCardEachPile() {
        let allPromises = [];
        this.tableau.children.forEach(pile => {
            // check top card, if face down then reveal
            const topCard = pile.getComponentsInChildren(SolitaireCard).pop();
            if (topCard?.faceDown.active) {
                allPromises.push(new Promise(resolve => {
                    topCard.showFaceUpAnim(undefined, resolve).start();
                }))
            }
        });
        return allPromises;
    }

    isValidMove(currCard: SolitaireCard, targetCard: SolitaireCard) {
        let isValidValue: boolean;
        let isValidSuit: boolean;
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

    updateTableauHeight() {
        this.tableau.children.forEach(pile => {
            const transform = pile.getComponent(UITransform);
            transform.width = CARD_WIDTH, transform.height = CARD_WIDTH;
            let countFaceDownChild = pile.children.filter(card => card.getComponent(SolitaireCard).faceDown.active).length;
            let countFaceUpChild = pile.children.filter(card => !card.getComponent(SolitaireCard).faceDown.active).length;

            transform.height += countFaceDownChild * CARD_SPACING_Y + countFaceUpChild * CARD_FACE_UP_SPACING_Y;
        });
    }

    onAutoPlay() {
        // Feature: auto-solve when all the face down card in the tableau is revealed
        // find possible move from tableau to foundation
        this._isAuto = true;
        this.unschedule(this._updateTime);

        for (let col = 0; col < this.tableau.children.length; col++) {
            const tabPile = this.tableau.children[col]
            const topCard: SolitaireCard = [...tabPile.children].pop()?.getComponent(SolitaireCard);
            if (!topCard) continue;
            for (let i = 0; i < this.foundations.children.length; i++) {
                const currPile = this.foundations.children[i];
                const currCard: SolitaireCard = [...currPile.children].pop()?.getComponent(SolitaireCard);
                // test purpose, but who knows, auto solve before building any foundations is crazy
                if (!currCard) {
                    if (topCard.valueName == "A" && currPile.name.endsWith("_" + topCard.suit)) {
                        this.onDragCardEnd({ target: topCard.node } as any, currPile);
                        return;
                    }
                    continue;
                }

                if (this.isValidMove(topCard, currCard)) {
                    this.onDragCardEnd({ target: topCard.node } as any, currPile);
                    return;
                }
            }
        }

        // find possible move from stock to foundation
        const stockCards = [...this.wasteCards, ...this.stockCards];
        for (let i = 0; i < stockCards.length; i++) {
            const card = stockCards[i];
            if (!card) continue;
            for (let col = 0; col < this.foundations.children.length; col++) {
                const currPile = this.foundations.children[col];
                const currCard: SolitaireCard = [...currPile.children].pop()?.getComponent(SolitaireCard);

                if (!currCard) {
                    if (card.valueName == "A" && currPile.name.endsWith("_" + card.suit)) {
                        this.onDragCardEnd({ target: card.node } as any, currPile);
                        return;
                    }
                    continue;
                }

                if (this.isValidMove(card, currCard)) {
                    this.onDragCardEnd({ target: card.node } as any, currPile);
                    return;
                }
            }
        }

        // no more available move
        this._isAuto = false;
    }

    showAutoResolveButton() {
        this.autoResolveButton.node.active = true;
        this.cards.forEach(card => card.disableEvent());

        tween(this.autoResolveButton.node)
            .repeatForever(
                tween()
                    .to(0.2, { scale: v3(1.5, 1.5, 1) })
                    .to(0.2, { scale: v3(1, 1, 1) })
            )
            .start();
    }

    hideAutoResolveButton() {
        this.autoResolveButton.node.active = false;
        Tween.stopAllByTarget(this.autoResolveButton.node);
    }

    showWinCutscene() {
        this.winScene.active = true;
        this.winScene.getComponent(UIOpacity).opacity = 0;
        this.winScene.getComponentInChildren(BlockInputEvents).enabled = false;

        tween(this.winScene.getComponent(UIOpacity))
            .to(0.5, { opacity: 255 })
            .call(() => {
                this.winScene.getComponentInChildren(BlockInputEvents).enabled = true;
            })
            .start();
    }

    hideWinCutscene() {
        this.winScene.active = false;
    }

    storeMoveData(target?: SolitaireCard, fromParent = "") {

        try {
            let data = { fromParent, toParent: target?.node.parent.name, targetName: target?.node.name, score: this._score };

            this._sessionData.push(data);
            sys.localStorage.setItem(SESSION_KEY, JSON.stringify(this._sessionData));
        } catch (err) {
            throw new Error(err);
        }

        this.undoButton.interactable = this._sessionData.length > 0;
        this.moveInfoLabel.string = this._sessionData.length.toString();
    }

    onUndo() {
        const data = this._sessionData.pop();
        const targetCard = this.cards.find(card => card.node.name == data.targetName);
        const allChildren = [...this.tableau.children, ...this.foundations.children, this.stockCardsNode, this.wasteCardsNode];
        const fromParent = allChildren.find(node => node.name == data.fromParent);
        const toParent = allChildren.find(node => node.name == data.toParent);

        let allPromises = [];
        let endStock;

        if (data.score) this.scoreInfoLabel.string = data.score.toString();
        if (!fromParent) {
            // this move is the end of stock pile, return all stock cards to the waste pile
            this.wasteCards = this.stockCards;
            this.stockCards = [];

            this.wasteCards.forEach(card => {
                card?.showFaceUpAnim(0.2).start();
                allPromises.push(card?.transferToPile(this.wasteCardsNode, 0, 0));
            });
            endStock = true;
        } else if (fromParent.name.startsWith("Pile_")) {
            const allFaceUp = fromParent.getComponentsInChildren(SolitaireCard)?.filter(card => !card?.faceDown?.active);
            const isPrevTopCard = allFaceUp.length == 1;
            let faceDownNums = fromParent.children.length - allFaceUp.length;

            if (isPrevTopCard) {
                const currTopCard = allFaceUp.pop();
                currTopCard?.showFaceDownAnim(0.2)?.start();
                faceDownNums++;
            }
            let faceUpNums = allFaceUp.length;
            const followCards = toParent.children.slice(targetCard.node.getSiblingIndex() + 1).map(o => o.getComponent(SolitaireCard));

            [targetCard, ...followCards].forEach(card => {
                changeParent(card.node, this.dragHolder);
                allPromises.push(card?.transferToPile(fromParent, faceDownNums, faceUpNums));
                faceUpNums++;
            });
        } else if (fromParent === this.wasteCardsNode) {
            this.wasteCards.unshift(targetCard);

            changeParent(targetCard.node, this.dragHolder);
            allPromises.push(targetCard?.transferToPile(fromParent, 0, 0));
        } else if (fromParent === this.stockCardsNode) {
            this.stockCards.push(targetCard);
            this.wasteCards.shift();

            changeParent(targetCard.node, this.dragHolder);
            targetCard?.showFaceDownAnim(0.2).start();
            allPromises.push(targetCard?.transferToPile(fromParent, 0, 0));
        }
        this.blockAll.enabled = true;
        this.undoButton.interactable = false;
        Promise.all(allPromises)
            .then(() => {
                if (endStock) {
                    [...this.wasteCards].reverse().forEach((card, index) => card.node.setSiblingIndex(index));
                }
                this.blockAll.enabled = false;
                this.stockInfo.string = `${this.stockCards.length}`;
                this.undoButton.interactable = this._sessionData.length > 0;
                this.moveInfoLabel.string = this._sessionData.length.toString();
                sys.localStorage.setItem(SESSION_KEY, JSON.stringify(this._sessionData));
            });
    }

    startTimer() {
        let seconds = 0;
        let minutes = 0;

        this._updateTime = () => {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
            }
            this.timeInfoLabel.string = `${minutes >= 10 ? "" : "0"}${minutes}:${seconds >= 10 ? "" : "0"}${seconds}`;
        }

        this.schedule(this._updateTime, 1);
    }

    protected onDestroy(): void {
        sys.localStorage.removeItem(SESSION_KEY);
    }
}