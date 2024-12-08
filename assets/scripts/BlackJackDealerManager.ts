import { _decorator, Component, Label, Node, resources, SpriteFrame, error, instantiate, Sprite } from 'cc';
import { BlackJackGameManager, checkBlackJack, getTotalHandValue } from './BlackJackGameManager';
const { ccclass, property } = _decorator;

@ccclass('BlackJackDealerManager')
export class BlackJackDealerManager extends Component {

    @property(Node) dealerTable: Node;
    @property(Label) dealerInfo: Label;

    _dealerHand: any[] = [];
    _dealerValue: number = 0;
    _dealerTurn: boolean;

    startTurn() {
        this._dealerTurn = true;
        this.scheduleOnce(this.nextMove, BlackJackGameManager.instance.turnDuration);
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
        this._dealerValue = getTotalHandValue(playerHand);
        this.dealerInfo.string = `Dealer value: ${this._dealerValue}`;
        const isBlackJack = checkBlackJack(playerHand);

        if (isBlackJack) {
            this.dealerInfo.string += `\nWow! Black Jack !!!`;
        } else if (this._dealerValue > 21) {
            this.dealerInfo.string += `\nDealer are busted !`;
        }
    }

    dealOneCardDealer() {
        this._dealerHand.push(BlackJackGameManager.instance.dealOneCard());
        this.updateHand(this._dealerHand);
        this.loadHand(this._dealerHand)
            .then(() => {
                this._dealerTurn = false;
                this.scheduleOnce(this.nextMove, BlackJackGameManager.instance.turnDuration);
            });
    }

    nextMove() {
        if (this._dealerTurn) {
            if (this._dealerHand.length < 2) {
                this.dealOneCardDealer();
            } else {
                if (this._dealerValue < 17) {
                    this.dealerHit();
                } else {
                    this.dealerInfo.string += `\nDealer End Turn !`;
                    BlackJackGameManager.instance.endDealerTurn(true)
                }
            }
        } else {
            BlackJackGameManager.instance.endDealerTurn();
        }
    }

    dealerHit() {
        this._dealerHand.push(BlackJackGameManager.instance.dealOneCard());

        this.updateHand(this._dealerHand);
        this.loadHand(this._dealerHand)
            .then(() => {
                this.scheduleOnce(this.nextMove, BlackJackGameManager.instance.turnDuration);
            });
    }

}

