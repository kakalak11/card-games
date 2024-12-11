import {
    _decorator, Component, error, Node, resources, Sprite, SpriteFrame,
    UITransform, v3, Prefab, Label, Button, instantiate
} from 'cc';
import { BlackJackDealerManager } from './BlackJackDealerManager';
import { ToastManager } from './ToastManager';
import { checkBlackJack, getDeck, getTotalHandValue, shuffle } from './utils';
import { TimerManager } from './TimerManager';
import { BlackJackPlayerManager } from './BlackJackPlayerManager';
import { Size } from 'cc';
const { ccclass, property } = _decorator;

export const TURN_DURATION = 0.5;

@ccclass('BlackJackGameManager')
export class BlackJackGameManager extends Component {

    @property(Node) cardTable: Node;
    @property(Prefab) cardPrefab: Prefab;

    @property(Button) gameStartButton: Button;

    @property(Node) dealer: BlackJackDealerManager;
    @property(Node) player: BlackJackPlayerManager;
    @property(ToastManager) toast: ToastManager;

    static instance: BlackJackGameManager;

    cardDeck: any[] = [];
    playerTurn: boolean;
    cardSize: Size = new Size(68, 100);

    protected onLoad(): void {
        BlackJackGameManager.instance = this;
        this.dealer = this.dealer?.getComponent(BlackJackDealerManager);
        this.player = this.player?.getComponent(BlackJackPlayerManager);
    }

    protected start(): void {
        // this.gameStart();
    }

    gameStart() {
        const deck = getDeck().concat(getDeck()).concat(getDeck());
        shuffle(deck);
        this.cardDeck = deck;
        this.gameStartButton.interactable = false;
        this.playerTurn = true;
        this.player.onGameStart();
        this.nextMove();
    }

    nextMove() {
        if (this.playerTurn) {
            this.player.startTurn();
        } else {
            this.dealer.startTurn();
        }
    }

    dealOneCard() {
        if (this.cardDeck.length == 0) return;
        return this.cardDeck.pop();
    }

    endDealerTurn(isFinshed?) {
        this.playerTurn = true;
        if (isFinshed) {
            this.showResult();
        } else {
            TimerManager.instance._scheduleOnce(this.nextMove.bind(this), TURN_DURATION);
        }
    }

    endPlayerTurn() {
        this.playerTurn = false;
        TimerManager.instance._scheduleOnce(this.nextMove.bind(this), TURN_DURATION);
    }

    showResult() {
        const playerHandValue = this.player.playerHandValue;
        const dealerHandValue = this.dealer.dealerHandValue;
        const playerHasBlackJack = this.player.hasBlackJack;
        const dealerHasBlackJack = this.dealer.hasBlackJack;
        const isPlayerBust = playerHandValue > 21;
        const isDealerBust = dealerHandValue > 21;
        let result;

        if (isPlayerBust) {
            if (isDealerBust) {
                this.toast.showToast("Draw !!", "draw");
                result = "draw";
            } else {
                this.toast.showToast("You have lost", "lose");
                result = "lose";
            }
        } else if (isDealerBust) {
            this.toast.showToast("You have won", "win");
            result = "win";
        } else {
            if (playerHasBlackJack) {
                if (dealerHasBlackJack) {
                    this.toast.showToast("Draw !!", "draw");
                    result = "draw";
                } else {
                    this.toast.showToast("You have won", "win");
                    result = "win";
                }
            } else if (playerHandValue > dealerHandValue) {
                this.toast.showToast("You have won", "win");
                result = "win";
            } else if (playerHandValue === dealerHandValue) {
                this.toast.showToast("Draw !!", "draw");
                result = "draw";
            } else {
                this.toast.showToast("You have lost", "lose");
                result = "lose";
            }
        }

        this.player.endGame(result);
        this.gameStartButton.interactable = true;
    }

    onGameRestart() {
        this.dealer.reset();
        this.player.reset();

        this.gameStart();
    }



    loadHand(hand, table) {
        let allPromises = [];

        hand.forEach(card => {
            const { value, suit, cardNode } = card;
            if (cardNode) return;
            let assetName = `${suit}_${value}`;
            allPromises.push(
                new Promise((resolve, reject) => {
                    resources.load(`cards/${suit}/${assetName}/spriteFrame`, SpriteFrame, (err, asset) => {
                        if (err) return reject(error(err.message));

                        const node = instantiate(this.cardPrefab);
                        node.getComponent(Sprite).spriteFrame = asset;
                        node.getComponent(UITransform).setContentSize(this.cardSize);
                        card.cardNode = node;
                        card.cardNode.setParent(table);
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

}
