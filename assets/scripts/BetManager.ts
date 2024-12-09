import { _decorator, Component, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

const BETS = [5, 10, 50, 100, 500, 1000, 5000];

@ccclass('BetManager')
export class BetManager extends Component {

    @property(Button) increaseBetBtn: Button;
    @property(Button) decreaseBetBtn: Button;
    @property(Label) betLabel: Label;

    currIndex: number = 0;
    playerBetAmount: number = 0;

    protected start(): void {
        this.betLabel.string = BETS[this.currIndex].toString();
        this.playerBetAmount = BETS[this.currIndex];
    }

    resetBet() {
        this.playerBetAmount = BETS[this.currIndex];
    }

    onDoubleDown() {
        this.playerBetAmount *= 2;
    }

    onIncreaseBet() {
        this.currIndex++;
        if (this.currIndex > BETS.length - 1) this.currIndex = 0;
        this.betLabel.string = BETS[this.currIndex].toString();
        this.playerBetAmount = BETS[this.currIndex];
    }

    onDecreaseBet() {
        this.currIndex--;
        if (this.currIndex < 0) this.currIndex = BETS.length - 1;
        this.betLabel.string = BETS[this.currIndex].toString();
        this.playerBetAmount = BETS[this.currIndex];
    }

}

