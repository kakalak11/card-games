import { _decorator, Component, Label, Node, resources, SpriteFrame, error, instantiate, Sprite } from 'cc';
import { BlackJackGameManager, TURN_DURATION } from './BlackJackGameManager';
import { checkBlackJack, getTotalHandValue } from "./utils";
import { TimerManager } from './TimerManager';
import { CardManager } from './CardManager';
const { ccclass, property } = _decorator;

@ccclass('BlackJackDealerManager')
export class BlackJackDealerManager extends Component {

    @property(Node) dealerTable: Node;
    @property(Label) dealerInfo: Label;

    dealerHand: any[] = [];
    dealerHandValue: number = 0;
    _dealerTurn: boolean;
    hasBlackJack: boolean;

    startTurn() {
        this._dealerTurn = true;
        this.nextMove();
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

                        const node = instantiate(BlackJackGameManager.instance.cardPrefab);
                        node.getComponent(Sprite).spriteFrame = asset;
                        card.cardNode = node;
                        card.cardNode.setParent(this.dealerTable);
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

    updateHand(playerHand) {
        this.dealerHandValue = getTotalHandValue(playerHand);
        this.dealerInfo.string = `Dealer value: ${this.dealerHandValue}`;
        const isBlackJack = checkBlackJack(playerHand);

        if (isBlackJack) {
            this.hasBlackJack = true;
        } else if (this.dealerHandValue > 21) {
            this.dealerInfo.string += `\nDealer are busted !`;
        }
    }

    dealOneCardDealer() {
        this.dealerHand.push(BlackJackGameManager.instance.dealOneCard());
        this.loadHand(this.dealerHand)
            .then(() => {
                if (this.dealerHand.length == 2) {
                    this.dealerHand[1]!
                        .cardNode
                        .getComponent(CardManager).showBackCard();
                }
                this.updateHand(this.dealerHand);
                this._dealerTurn = false;
                this.nextMove();
            });
    }

    nextMove() {
        if (this._dealerTurn) {
            if (this.dealerHand.length < 2) {
                this.dealOneCardDealer();

            } else {
                this.dealerHand[1]!
                    .cardNode
                    .getComponent(CardManager).showFaceCard();

                this.updateHand(this.dealerHand);
                if (this.dealerHandValue < 17) {
                    this.dealerHit();
                } else {
                    this.dealerInfo.string += `\nDealer End Turn !`;
                    BlackJackGameManager.instance.endDealerTurn(true);
                }
            }
        } else {
            BlackJackGameManager.instance.endDealerTurn();
        }
    }

    dealerHit() {
        this.dealerHand.push(BlackJackGameManager.instance.dealOneCard());

        this.loadHand(this.dealerHand)
            .then(() => {
                this.updateHand(this.dealerHand);
                TimerManager.instance._scheduleOnce(this.nextMove.bind(this), TURN_DURATION);
            });
    }

    reset() {
        this.dealerTable.removeAllChildren();
        this.dealerHand = [];

        this.dealerHandValue = 0;
        this._dealerTurn = false;
        this.hasBlackJack = false;
        this.dealerInfo.string = "Dealer value: 0";
    }

}

