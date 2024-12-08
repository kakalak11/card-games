import { Prefab } from 'cc';
import { Label } from 'cc';
import { Button } from 'cc';
import { instantiate } from 'cc';
import { _decorator, Component, error, Node, resources, Sprite, SpriteFrame, UITransform, v3 } from 'cc';
import { BlackJackDealerManager } from './BlackJackDealerManager';
const { ccclass, property } = _decorator;

const MAX_CARDS = 52;
const SUITS = ["spade", "diamond", "club", "heart"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function getDeck() {
    let deckOfCards = [];
    for (let suitIndex = 0; suitIndex < SUITS.length; suitIndex++) {
        for (let valueIndex = 0; valueIndex < VALUES.length; valueIndex++) {
            let card = {
                value: VALUES[valueIndex],
                suit: SUITS[suitIndex],
                numberValue: Number(VALUES[valueIndex]) || 10,
            };
            deckOfCards.push(card);
        }
    }
    return deckOfCards
}

export function getTotalHandValue(playerHand) {
    return playerHand.reduce((acc, curr) => {
        return acc + curr.numberValue;
    }, 0)
}

export function checkBlackJack(playerHand) {
    if (playerHand.length > 2) return;
    let hasRoyalOr10;
    let hasAce;
    playerHand.forEach(card => {
        if (card.value == "A") {
            hasAce = true;
        } else if (!Number(card.value) || card.value == 10) {
            hasRoyalOr10 = true;
        }
    });
    return hasRoyalOr10 && hasAce;
}

function shuffle(deck) {
    // for 1000 turns
    // switch the values of two random cards
    for (let i = 0; i < 1000; i++) {
        let location1 = Math.floor((Math.random() * deck.length));
        let location2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

@ccclass('BlackJackGameManager')
export class BlackJackGameManager extends Component {

    @property(Node) cardTable: Node;
    @property(Node) playerTable: Node;
    @property(Prefab) cardPrefab: Prefab;
    @property(Button) hitButton: Button;
    @property(Button) endButton: Button;
    @property(Label) handInfo: Label;

    @property(BlackJackDealerManager) dealer: BlackJackDealerManager;

    static instance: BlackJackGameManager;

    playerHand: any[] = [];
    selectedHand: any[] = [];
    cardDeck: any[] = [];
    totalValue: number = 0;
    isBust: boolean;
    playerTurn: boolean;

    turnDuration: number = 0.5;

    protected start(): void {
        BlackJackGameManager.instance = this;
        this.gameStart();
    }

    gameStart() {
        this.disableButtons();
        const deck = getDeck().concat(getDeck()).concat(getDeck());
        shuffle(deck);
        this.cardDeck = deck;
        this.playerTurn = true;

        this.scheduleOnce(this.nextMove, this.turnDuration);
    }

    nextMove() {
        if (this.playerTurn) {
            if (this.playerHand.length < 2) {
                this.dealOneCardPlayer();
            } else {
                this.enableButtons();
            }
        } else {
            this.dealer.startTurn();
        }
    }

    loadHand(hand) {
        let allPromises = [];

        hand.forEach(card => {
            const { value, suit, cardNode } = card;
            if (cardNode) return;
            let assetName = value + "_" + suit;
            allPromises.push(
                new Promise((resolve, reject) => {
                    resources.load(`face-cards/${assetName}/spriteFrame`, SpriteFrame, (err, asset) => {
                        if (err) return reject(error(err.message));

                        const node = instantiate(this.cardPrefab);
                        node.getComponent(Sprite).spriteFrame = asset;
                        card.cardNode = node;
                        card.cardNode.setParent(this.playerTable);
                        resolve(card);
                    });
                })
            )
        })

        return Promise.all(allPromises)
            .then(() => {
                return hand;
            })
    }

    dealOneCardPlayer() {
        this.playerHand.push(this.dealOneCard());

        this.loadHand(this.playerHand)
            .then(() => {
                this.enableButtons();
                this.updateHand(this.playerHand);
                this.playerTurn = false;
                this.scheduleOnce(this.nextMove, this.turnDuration);
            });
    }

    dealOneCard() {
        if (this.cardDeck.length == 0) return;
        return this.cardDeck.pop();
    }

    onHit() {
        const card = this.cardDeck.pop();

        this.playerHand.push(card);
        this.updateHand(this.playerHand);
        this.loadHand(this.playerHand);
    }

    onEndTurn() {
        this.disableButtons();
        this.handInfo.string += `\nPlayer end turn !`;
        this.dealer.startTurn();
    }

    updateHand(playerHand) {
        this.totalValue = getTotalHandValue(playerHand);
        this.handInfo.string = `Total value: ${this.totalValue}`;
        const isBlackJack = checkBlackJack(playerHand);

        if (isBlackJack) {
            this.disableButtons();
            this.handInfo.string += `\nWow! Black Jack !!!`;
        } else if (this.totalValue > 21) {
            this.disableButtons();
            this.isBust = true;
            this.handInfo.string += `\nYou are busted !`;
            this.onEndTurn();
        }
    }

    disableButtons() {
        this.hitButton.interactable = false;
        this.endButton.interactable = false;
    }

    enableButtons() {
        this.hitButton.interactable = true;
        this.endButton.interactable = true;
    }

    endDealerTurn(isFinish = false) {
        this.playerTurn = true;
        if (isFinish) {
            this.enableButtons();
        } else {
            this.scheduleOnce(this.nextMove, this.turnDuration);
        }
    }

}
