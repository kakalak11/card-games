import { Prefab } from 'cc';
import { Size } from 'cc';
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
                cardPower
            };
            deckOfCards.push(card);
        }
    }
    // console.log(deckOfCards.slice().sort((a,b) => a.cardPower - b.cardPower));
    return deckOfCards
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
    @property(Button) playHandButton: Button;

    static instance: GameManager;

    playerHand: any[] = [];
    selectedHand: any[] = [];
    cardDeck: any[] = [];


    protected start(): void {
        GameManager.instance = this;
        this.gameStart();
    }

    gameStart() {
        const deck = getDeck();
        shuffle(deck)
        this.cardDeck = deck;

        return this.loadDeck(deck)
            .then((resultDeck) => {
                let playerHand = [];
                for (let i = 0; i < MAX_CARDS; i++) {
                    if (i % 4 == 0) {
                        playerHand.push(resultDeck.pop());
                    } else {
                        const removedCard = resultDeck.pop();
                        removedCard.cardNode.destroy();
                    }
                }
                this.findHandBestCombinations(playerHand);
                playerHand.forEach(card => {
                    card.cardNode.setParent(this.playerDeck);
                    card.cardNode.emit("INIT");
                    const position = card.cardNode.getPosition();
                    card.cardNode.setPosition(v3(position.x, 0, position.z));
                });

                this.playerHand = playerHand;
            });
    }

    loadDeck(deck) {
        let allPromises = [];

        deck.forEach(card => {
            const { value, suit } = card;
            let assetName = suit + "_" + value;
            allPromises.push(
                new Promise((resolve, reject) => {
                    resources.load(`cards/${suit}/${assetName}/spriteFrame`, SpriteFrame, (err, asset) => {
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

    onSelectCard(card) {
        const cardInfo = this.playerHand.find(({ cardNode }) => cardNode === card);
        const isSelected = this.selectedHand.find(({ cardNode }) => cardNode === card);
        if (!cardInfo || isSelected) return;

        this.selectedHand.push(cardInfo);
        console.log("Selected hand: ", this.selectedHand);
    }

    onUnselectCard(card) {
        const selectedIndex = this.selectedHand.findIndex(({ cardNode }) => cardNode === card);
        if (selectedIndex == -1) return;

        this.selectedHand.splice(selectedIndex, 1);
        console.log("Selected hand: ", this.selectedHand);
    }

    onPlayHand() {
        if (!this.selectedHand.length) {
            console.log("No selected hand to play");
            return;
        }

        this.selectedHand.forEach(card => {
            const { cardNode } = card;
            cardNode.setParent(this.cardTable);
        });

        this.selectedHand = [];
        this.playHandButton.interactable = false;
        this.scheduleOnce(this.nextTurn, 1);
    }

    nextTurn() {
        this.playHandButton.interactable = true;
        this.cardTable.removeAllChildren();
    }

    findHandBestCombinations(hand) {

    }

}
