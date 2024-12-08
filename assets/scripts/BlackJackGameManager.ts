import { Prefab } from 'cc';
import { Label } from 'cc';
import { Button } from 'cc';
import { instantiate } from 'cc';
import { _decorator, Component, error, Node, resources, Sprite, SpriteFrame, UITransform, v3 } from 'cc';
const { ccclass, property } = _decorator;

const MAX_CARDS = 52;
const SUITS = ["spade", "diamond", "club", "heart"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function getDeck() {
    let deckOfCards = [];

    for (let suitIndex = 0; suitIndex < SUITS.length; suitIndex++) {
        for (let valueIndex = 0; valueIndex < VALUES.length; valueIndex++) {
            let cardPower = valueIndex * SUITS.length + suitIndex;
            let card = {
                value: VALUES[valueIndex],
                suit: SUITS[suitIndex],
                numberValue: Number(VALUES[valueIndex]) || 10,
                cardPower
            };
            deckOfCards.push(card);
        }
    }
    // console.log(deckOfCards.slice().sort((a,b) => a.cardPower - b.cardPower));
    return deckOfCards
}

function getTotalHandValue(playerHand) {
    return playerHand.reduce((acc, curr) => {
        return acc + curr.numberValue;
    }, 0)
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

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node) cardTable: Node;
    @property(Node) playerDeck: Node;
    @property(Prefab) cardPrefab: Prefab;
    @property(Button) hitButton: Button;
    @property(Button) endButton: Button;
    @property(Label) handInfo: Label;

    static instance: GameManager;

    playerHand: any[] = [];
    selectedHand: any[] = [];
    cardDeck: any[] = [];
    totalValue: number = 0;
    isBust: boolean;

    protected start(): void {
        GameManager.instance = this;
        this.gameStart();
    }

    gameStart() {
        this.hitButton.interactable = true;
        this.endButton.interactable = true;

        const deck = getDeck();
        shuffle(deck)

        return this.loadDeck(deck)
            .then((resultDeck) => {
                let playerHand = [];
                this.cardDeck = resultDeck;

                for (let i = 0; i < MAX_CARDS; i++) {
                    if (playerHand.length < 2) {
                        playerHand.push(this.cardDeck.pop());
                    } else {
                        break;
                    }
                }

                playerHand.forEach(card => {
                    card.cardNode.setParent(this.playerDeck);
                });
                this.playerHand = playerHand;
            });
    }

    loadDeck(deck) {
        let allPromises = [];

        deck.forEach(card => {
            const { value, suit } = card;
            let assetName = value + "_" + suit;
            allPromises.push(
                new Promise((resolve, reject) => {
                    resources.load(`face-cards/${assetName}/spriteFrame`, SpriteFrame, (err, asset) => {
                        if (err) return reject(error(err.message));

                        const node = instantiate(this.cardPrefab);
                        node.getComponent(Sprite).spriteFrame = asset;
                        card.cardNode = node;
                        resolve(card);
                    });
                })
            )
        })

        return Promise.all(allPromises)
            .then(() => {
                return deck;
            })
    }

    onHit() {
        const card = this.cardDeck.pop();

        card.cardNode.setParent(this.playerDeck);
        this.playerHand.push(card);
        this.updateHand(this.playerHand);
    }

    onEndTurn() {
        this.hitButton.interactable = false;

    }

    updateHand(playerHand) {
        this.totalValue = getTotalHandValue(playerHand);
        this.handInfo.string = `Total value: ${this.totalValue}`;
        if (this.totalValue > 21) {
            this.isBust = true;
            this.hitButton.interactable = false;
            this.endButton.interactable = false;
            this.handInfo.string += `\nYou are busted !`;
        }
    }

}
