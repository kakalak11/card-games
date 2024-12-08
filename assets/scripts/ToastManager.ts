import {
    _decorator, Component, Node, UITransform,
    Label, UIOpacity, tween, Widget, Sprite, Color
} from 'cc';
import { find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ToastManager')
export class ToastManager extends Component {

    @property(Color) winColor: Color = new Color("#1BAA00");
    @property(Color) loseColor: Color = new Color("#AA1400");
    @property(Color) drawColor: Color = new Color("#00A6CF");
    @property(Color) blackJackColor: Color = new Color("#00A6CF");

    _originalBottom: number = 0;

    protected onLoad(): void {
        const canvasNode = find("Canvas");
        this.getComponent(Widget).target = canvasNode;
        this._originalBottom = this.getComponent(Widget).bottom;
    }

    showToast(msg = "Your message", type = "win") {
        const height = this.getComponent(UITransform).contentSize.height;
        const widgetComponent = this.getComponent(Widget);

        this.getComponentInChildren(Label).string = msg;
        this.getComponent(UIOpacity).opacity = 255;

        if (this[type + "Color"]) this.getComponent(Sprite).color = this[type + "Color"];
        if (widgetComponent) {
            widgetComponent.bottom = -height;

            tween(widgetComponent)
                .to(0.5, { bottom: this._originalBottom }, { easing: "backOut" })
                .delay(2)
                .to(0.5, { bottom: -height }, { easing: "backIn" })
                .call(() => {
                    this.getComponent(UIOpacity).opacity = 0;
                })
                .start();
        }
    }
}

