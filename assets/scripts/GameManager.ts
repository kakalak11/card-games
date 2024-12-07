import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { _decorator, Component, error, Node, resources, Sprite, SpriteFrame, UITransform, v3 } from 'cc';
const { ccclass, property } = _decorator;

const MAX_CARDS = 52;
const SUITS = ["spade", "diamond", "club", "heart"];
const SUITS_SPRITE = { "spade": 5, "diamond": 4, "club": 7, "heart": 2 };
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "J", "Q", "K"];

function getDeck() {
    let deckOfCards = [];

    for (let suitIndex = 0; suitIndex < SUITS.length; suitIndex++) {
        for (let valueIndex = 0; valueIndex < VALUES.length; valueIndex++) {
            let card = {
                value: VALUES[valueIndex],
                suit: SUITS[suitIndex]
            };
            deckOfCards.push(card);
        }
    }

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

    static instance: GameManager;

    playerHand: any[] = [];
    selectedHand: any[] = [];

    protected start(): void {
        GameManager.instance = this;
        this.gameStart();
    }

    gameStart() {
        const deck = getDeck();
        let shuffledDeck = deck.slice();
        shuffle(shuffledDeck)

        return this.loadDeck(shuffledDeck)
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
                playerHand.forEach(card => {
                    card.cardNode.setParent(this.playerDeck);
                    const position = card.cardNode.getPosition();
                    card.cardNode.setPosition(v3(position.x, 0, position.z));
                });

                this.playerHand = playerHand;
            });
    }

    loadDeck(deck) {
        let allPromises = []
        deck.forEach(card => {
            const { value, suit } = card;
            let assetName = value + "_" + suit;
            allPromises.push(
                new Promise((resolve, reject) => {
                    resources.load(`face-cards/${assetName}/spriteFrame`, SpriteFrame, (err, asset) => {
                        if (err) return reject(error(err.message));

                        const node = instantiate(this.cardPrefab);
                        node.getComponent(Sprite).spriteFrame = asset;
                        node.setParent(this.cardTable);

                        card.cardNode = node;
                        resolve(card);
                    });
                })
            )

        })

        return Promise.all(allPromises)
            .then(() => {
                // deck.forEach((card, index) => {
                //     card.cardNode.setSiblingIndex(index);
                // });
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

}

