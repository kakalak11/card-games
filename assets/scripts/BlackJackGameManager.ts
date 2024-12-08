import {
    _decorator, Component, error, Node, resources, Sprite, SpriteFrame,
    UITransform, v3, Prefab, Label, Button, instantiate
} from 'cc';
import { BlackJackDealerManager } from './BlackJackDealerManager';
import { ToastManager } from './ToastManager';
import { checkBlackJack, getDeck, getTotalHandValue, shuffle } from './utils';
import { TimerManager } from './TimerManager';
const { ccclass, property } = _decorator;

export const TURN_DURATION = 2;

@ccclass('BlackJackGameManager')
export class BlackJackGameManager extends Component {

    @property(Node) cardTable: Node;
    @property(Node) playerTable: Node;
    @property(Prefab) cardPrefab: Prefab;
    @property(Button) hitButton: Button;
    @property(Button) endButton: Button;
    @property(Button) gameRestartButton: Button;
    @property(Label) handInfo: Label;

    @property(Node) dealer: BlackJackDealerManager;
    @property(ToastManager) toast: ToastManager;

    static instance: BlackJackGameManager;

    playerHand: any[] = [];
    selectedHand: any[] = [];
    cardDeck: any[] = [];
    playerHandValue: number = 0;
    isBust: boolean;
    hasBlackJack: boolean;
    playerTurn: boolean;

    turnDuration: number = 0.5;

    protected onLoad(): void {
        BlackJackGameManager.instance = this;
        this.dealer = this.dealer?.getComponent(BlackJackDealerManager);
    }

    protected start(): void {
        this.gameStart();
    }

    gameStart() {
        this.disableButtons();
        const deck = getDeck().concat(getDeck()).concat(getDeck());
        shuffle(deck);
        this.cardDeck = deck;
        this.playerTurn = true;
        this.hasBlackJack = false;
        this.isBust = false;
        this.playerHand = [];
        this.gameRestartButton.interactable = false;

        this.nextMove();
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
        // this.playerHand.push({
        //     value: "A",
        //     suit: "heart",
        //     numberValue: 10,
        // });
        // this.playerHand.push({
        //     value: "K",
        //     suit: "heart",
        //     numberValue: 10,
        // });

        this.loadHand(this.playerHand)
            .then(() => {
                this.updateHand(this.playerHand);
                this.playerTurn = false;
                TimerManager.instance._scheduleOnce(this.nextMove.bind(this), TURN_DURATION);
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
        this.playerHandValue = getTotalHandValue(playerHand);
        this.handInfo.string = `Total value: ${this.playerHandValue}`;
        this.hasBlackJack = checkBlackJack(playerHand);

        if (this.hasBlackJack) {
            this.disableButtons();
            this.handInfo.string += `\nWow! Black Jack !!!`;
            this.toast.showToast("You have hit a black jack !!!", "blackJack");
        } else if (this.playerHandValue > 21) {
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

    endDealerTurn(dealerValue?) {
        this.playerTurn = true;
        if (dealerValue) {
            this.disableButtons();
            this.showResult(dealerValue);
            this.gameRestartButton.interactable = true;
        } else {
            TimerManager.instance._scheduleOnce(this.nextMove.bind(this), TURN_DURATION);
        }
    }

    showResult(dealerValue) {
        const isLost = (this.isBust || dealerValue > this.playerHandValue) && dealerValue <= 21 && !this.hasBlackJack;
        const isDraw = (dealerValue > 21 && this.isBust) || (!this.isBust && dealerValue == this.playerHandValue && !this.hasBlackJack);


        if (isLost) {
            this.toast.showToast("You have lost", "lose");
        } else if (isDraw) {
            this.toast.showToast("Draw !!", "draw");
        } else {
            this.toast.showToast("You have won", "win");
        }
    }

    onGameRestart() {
        this.playerTable.removeAllChildren();
        this.dealer.reset();

        this.gameStart();
        this.handInfo.string = `Total value: ${this.playerHandValue}`;
    }

}
