import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimerManager')
export class TimerManager extends Component {

    isTicking: boolean;
    _delay: number = 0;
    label: Label;

    static instance: TimerManager;

    protected onLoad(): void {
        TimerManager.instance = this;
        this.label = this.getComponent(Label);
    }

    _scheduleOnce(callback, delay) {
        TimerManager.instance.startCount(delay);
        return this.scheduleOnce(callback, delay);
    }

    startCount(delay) {
        this.isTicking = true;
        this._delay = delay;
    }

    stopCount() {
        this.isTicking = false;
    }

    protected update(dt: number): void {
        if (!this.isTicking) return;
        if (this._delay > 0) {
            this._delay -= dt;
        } else {
            this._delay = 0;
            this.label.string = "Time: 0";
            return;
        }

        this.label.string = "Time: " + Math.abs(this._delay + 1).toFixed(0);
    }

}

