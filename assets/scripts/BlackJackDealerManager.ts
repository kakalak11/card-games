import { _decorator, Component, Label, Node, resources, SpriteFrame, error, instantiate, Sprite } from 'cc';
import { BlackJackGameManager, TURN_DURATION } from './BlackJackGameManager';
import { checkBlackJack, getTotalHandValue } from "./utils";
import { TimerManager } from './TimerManager';
import { CardManager } from './CardManager';
import { UITransform } from 'cc';
import { Size } from 'cc';
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

        BlackJackGameManager.instance.loadHand(this.dealerHand, this.dealerTable)
            .then(() => {
                if (this.dealerHand.length == 2) {
                    this.dealerHand[1]
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
                this.dealerHand[1]
                    .cardNode
                    .getComponent(CardManager).showFaceCard();

                this.updateHand(this.dealerHand);
                if (this.dealerHandValue < 17) {
                    this.dealerHit();
                } else {
                    this.dealerInfo.string += `\nDealer end turn`;
                    BlackJackGameManager.instance.endDealerTurn(true);
                }
            }
        } else {
            BlackJackGameManager.instance.endDealerTurn();
        }
    }

    dealerHit() {
        this.dealerHand.push(BlackJackGameManager.instance.dealOneCard());

        BlackJackGameManager.instance.loadHand(this.dealerHand, this.dealerTable)
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

