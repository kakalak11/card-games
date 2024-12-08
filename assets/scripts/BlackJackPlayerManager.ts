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

@ccclass('BlackJackPlayerManager')
export class BlackJackPlayerManager extends Component {

    @property(Node) playerTable: Node;

    @property(Button) hitButton: Button;
    @property(Button) endButton: Button;
    @property(Label) handInfo: Label;

    @property(ToastManager) toast: ToastManager;

    hasBlackJack: boolean;
    playerHand: any[] = [];
    playerHandValue: number = 0;

    startTurn() {
        if (this.playerHand.length <= 1) {
            this.dealOneCardPlayer();
            this.disableButtons();
        } else {
            this.enableButtons();
        }
        console.log(this.playerHand);
    }

    dealOneCardPlayer() {
        this.playerHand.push(BlackJackGameManager.instance.dealOneCard());
        // this.playerHand.push({ value: "A", suit: "heart", numberValue: 10, }); this.playerHand.push({ value: "K", suit: "heart", numberValue: 10, });

        this.loadHand(this.playerHand)
            .then(() => {
                this.updateHand(this.playerHand);
                BlackJackGameManager.instance.endPlayerTurn();
            });
    }

    disableButtons() {
        this.hitButton.interactable = false;
        this.endButton.interactable = false;
    }

    enableButtons() {
        this.hitButton.interactable = true;
        this.endButton.interactable = true;
    }

    updateHand(playerHand) {
        this.playerHandValue = getTotalHandValue(playerHand);
        this.handInfo.string = `Total value: ${this.playerHandValue}`;
        this.hasBlackJack = checkBlackJack(playerHand);

        if (this.hasBlackJack) {
            this.disableButtons();
            this.handInfo.string += `\nWow! Black Jack !!!`;
            this.toast.showToast("You have hit a black jack !!!", "blackJack");
            BlackJackGameManager.instance.endPlayerTurn();
        } else if (this.playerHandValue > 21) {
            this.disableButtons();
            this.handInfo.string += `\nYou are busted !`;
            BlackJackGameManager.instance.endPlayerTurn();
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

        this.updateHand(this.playerHand);
        this.loadHand(this.playerHand);
    }

    onEndTurn() {
        this.disableButtons();
        BlackJackGameManager.instance.endPlayerTurn();
    }

    endGame() {
        this.disableButtons();
    }

    reset() {
        this.playerTable.removeAllChildren();
        this.hasBlackJack = false;
        this.playerHand = [];
        this.enableButtons();
    }

}
