import { Animation } from 'cc';
import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

const PREFIX = "Wallet: ";

@ccclass('WalletManager')
export class WalletManager extends Component {

    @property(Node) amountEffect: Node;

    playerWalletAmount: number = 100000;
    label: Label;
    ledger: string = "";

    protected start(): void {
        this.label = this.getComponent(Label);
        this.label.string = PREFIX + this.playerWalletAmount.toString();

        this.node.on(Node.EventType.MOUSE_DOWN, () => console.log(this.ledger), this);
    }

    addMoney(value = 0) {
        this.playerWalletAmount += value;
        this.label.string = PREFIX + this.playerWalletAmount.toString();

        this.ledger += `+ ${value}\n`;
        this.showEffect(value);
    }

    subMoney(value = 0) {
        this.playerWalletAmount -= value;
        this.label.string = PREFIX + this.playerWalletAmount.toString();

        this.ledger += `- ${value}\n`;
        this.showEffect(value * -1);
    }

    showEffect(value) {
        this.amountEffect.getComponent(Label).string = value.toString();
        this.amountEffect.getComponent(Animation).play();
    }

}

