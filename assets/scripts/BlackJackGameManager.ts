import {
    _decorator, Component, error, Node, resources, Sprite, SpriteFrame,
    UITransform, v3, Prefab, Label, Button, instantiate
} from 'cc';
import { BlackJackDealerManager } from './BlackJackDealerManager';
import { ToastManager } from './ToastManager';
import { checkBlackJack, getDeck, getTotalHandValue, shuffle } from './utils';
import { TimerManager } from './TimerManager';
import { BlackJackPlayerManager } from './BlackJackPlayerManager';
const { ccclass, property } = _decorator;

export const TURN_DURATION = 0.5;

@ccclass('BlackJackGameManager')
export class BlackJackGameManager extends Component {

    @property(Node) cardTable: Node;
    @property(Prefab) cardPrefab: Prefab;

    @property(Button) gameRestartButton: Button;

    @property(Node) dealer: BlackJackDealerManager;
    @property(Node) player: BlackJackPlayerManager;
    @property(ToastManager) toast: ToastManager;

    static instance: BlackJackGameManager;

    cardDeck: any[] = [];
    playerTurn: boolean;

    protected onLoad(): void {
        BlackJackGameManager.instance = this;
        this.dealer = this.dealer?.getComponent(BlackJackDealerManager);
        this.player = this.player?.getComponent(BlackJackPlayerManager);
    }

    protected start(): void {
        this.gameStart();
    }

    gameStart() {
        const deck = getDeck().concat(getDeck()).concat(getDeck());
        shuffle(deck);
        this.cardDeck = deck;
        this.gameRestartButton.interactable = false;
        this.playerTurn = true;

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

    endDealerTurn(dealerValue?) {
        this.playerTurn = true;
        if (dealerValue) {
            this.showResult(dealerValue);
            this.gameRestartButton.interactable = true;
            this.player.endGame();
        } else {
            TimerManager.instance._scheduleOnce(this.nextMove.bind(this), TURN_DURATION);
        }
    }

    endPlayerTurn() {
        this.playerTurn = false;
        TimerManager.instance._scheduleOnce(this.nextMove.bind(this), TURN_DURATION);
    }

    showResult(dealerValue) {
        const isLost = (this.player.isBust || dealerValue > this.player.playerHandValue) && dealerValue <= 21 && !this.player.hasBlackJack;
        const isDraw = (dealerValue > 21 && this.player.isBust) || (!this.player.isBust && dealerValue == this.player.playerHandValue && !this.player.hasBlackJack);

        if (isLost) {
            this.toast.showToast("You have lost", "lose");
        } else if (isDraw) {
            this.toast.showToast("Draw !!", "draw");
        } else {
            this.toast.showToast("You have won", "win");
        }
    }

    onGameRestart() {
        this.dealer.reset();
        this.player.reset();

        this.gameStart();
    }

}
