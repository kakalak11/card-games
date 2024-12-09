import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { TimerManager } from './TimerManager';
import { BlackJackGameManager, TURN_DURATION } from './BlackJackGameManager';
import { Label } from 'cc';
import { calculateWinnings, checkBlackJack, getTotalHandValue } from './utils';
import { ToastManager } from './ToastManager';
import { resources } from 'cc';
import { SpriteFrame, error, instantiate, Sprite } from 'cc';
import { BetManager } from './BetManager';
import { WalletManager } from './WalletManager';
const { ccclass, property } = _decorator;
const debugCards = [{ value: "A", suit: "heart", numberValue: 10 }, { value: "K", suit: "heart", numberValue: 10 }];

@ccclass('BlackJackPlayerManager')
export class BlackJackPlayerManager extends Component {

    @property(Node) playerTable: Node;
    @property(Button) hitButton: Button;
    @property(Button) endButton: Button;
    @property(Button) doubleDownButton: Button;

    @property(Label) handInfo: Label;
    @property(Label) handShoutOut: Label;

    @property(ToastManager) toast: ToastManager;
    @property(BetManager) playerBet: BetManager;
    @property(WalletManager) playerWallet: WalletManager;

    hasBlackJack: boolean;
    playerHand: any[] = [];
    playerHandValue: number = 0;
    isDoubleDown: boolean;

    protected start(): void {
        this.disableButtons();
    }

    onGameStart() {
        this.updateWalletOnStart();
    }

    startTurn() {
        if (this.hasBlackJack) {
            this.onEndTurn();
        } else if (this.playerHand.length <= 1) {
            this.dealOneCardPlayer();
            this.disableButtons();
        } else {
            this.enableButtons();
        }
        console.log(this.playerHand);
    }

    dealOneCardPlayer() {
        this.playerHand.push(BlackJackGameManager.instance.dealOneCard());
        // this.playerHand.push(debugCards.pop());

        this.loadHand(this.playerHand)
            .then(() => {
                this.updateHand(this.playerHand);
                BlackJackGameManager.instance.endPlayerTurn();
            });
    }

    disableButtons() {
        this.hitButton.interactable = false;
        this.endButton.interactable = false;
        this.doubleDownButton.interactable = false;
    }

    enableButtons() {
        this.hitButton.interactable = true;
        this.endButton.interactable = true;
        this.doubleDownButton.interactable = true;
    }

    updateHand(playerHand) {
        this.playerHandValue = getTotalHandValue(playerHand);
        this.handInfo.string = `Total value: ${this.playerHandValue}`;
        this.hasBlackJack = checkBlackJack(playerHand);

        if (this.hasBlackJack) {
            this.disableButtons();
            this.handInfo.string += `\nWow! Black Jack !!!`;
            this.handShoutOut.string = "BLACK JACK !!!";
            this.toast.showToast("You have hit a black jack !!!", "blackJack");
        } else if (this.playerHandValue > 21) {
            this.handInfo.string += `\nYou are busted !`;
            this.onEndTurn();
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

                        const node = instantiate(BlackJackGameManager.instance.cardPrefab);
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

    onHit() {
        this.playerHand.push(BlackJackGameManager.instance.dealOneCard());
        if (this.playerHand.length > 2) {
            this.doubleDownButton.interactable = false;
        }

        this.loadHand(this.playerHand)
            .then(() => {
                this.updateHand(this.playerHand);
            });
    }

    onEndTurn() {
        this.disableButtons();
        BlackJackGameManager.instance.endPlayerTurn();
    }

    onDoubleDown() {
        this.isDoubleDown = true;
        this.handShoutOut.string = "DOUBLE DOWN !!!";
        this.playerWallet.subMoney(this.playerBet.playerBetAmount);
        this.playerBet.onDoubleDown();
        this.dealOneCardPlayer();
    }

    endGame(result) {
        this.disableButtons();

        switch (result) {
            case "win":
                const winAmount = this.playerBet.playerBetAmount + calculateWinnings(this.playerBet.playerBetAmount, this.hasBlackJack);
                this.playerWallet.addMoney(winAmount);
                break;
            case "draw":
                this.playerWallet.addMoney(this.playerBet.playerBetAmount);
                break;
            case "lose":
            default:
                break;
        }
    }

    updateWalletOnStart() {
        this.playerBet.resetBet();
        this.playerWallet.subMoney(this.playerBet.playerBetAmount);
    }

    reset() {
        this.playerTable.removeAllChildren();
        this.hasBlackJack = false;
        this.isDoubleDown = false;
        this.playerHand = [];
        this.handShoutOut.string = "";
        this.enableButtons();
    }

}

