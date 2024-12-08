import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { TimerManager } from './TimerManager';
import { BlackJackGameManager, TURN_DURATION } from './BlackJackGameManager';
import { Label } from 'cc';
import { checkBlackJack, getTotalHandValue } from './utils';
import { ToastManager } from './ToastManager';
import { resources } from 'cc';
import { SpriteFrame, error, instantiate, Sprite } from 'cc';
const { ccclass, property } = _decorator;
const debugCards = [{ value: "A", suit: "heart", numberValue: 10 }, { value: "K", suit: "heart", numberValue: 10 }];

@ccclass('BlackJackPlayerManager')
export class BlackJackPlayerManager extends Component {

    @property(Node) playerTable: Node;

    @property(Node) buttonLayout: Node;
    @property(Label) handInfo: Label;
    @property(Label) handShoutOut: Label;

    @property(ToastManager) toast: ToastManager;

    hasBlackJack: boolean;
    playerHand: any[] = [];
    playerHandValue: number = 0;
    isDoubleDown: boolean;

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
        this.buttonLayout.getComponentsInChildren(Button).forEach(button => {
            button.interactable = false;
        });
    }

    enableButtons() {
        this.buttonLayout.getComponentsInChildren(Button).forEach(button => {
            button.interactable = true;
        });
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
        this.dealOneCardPlayer();
    }

    endGame() {
        this.disableButtons();
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

