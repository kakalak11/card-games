import { UITransform } from 'cc';
import { Color } from 'cc';
import { Graphics } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OutlineNode')
export class OutlineNode extends Component {

    start() {
        const graphics = this.getComponent(Graphics) || this.addComponent(Graphics);
        const width = this.node.getComponent(UITransform).width;
        const height = this.node.getComponent(UITransform).height;

        graphics.lineWidth = 4; // Adjust outline thickness
        graphics.strokeColor = Color.BLACK; // Adjust outline color

        graphics.moveTo(0, 0);
        graphics.lineTo(width, 0);
        graphics.lineTo(width, height);
        graphics.lineTo(0, height);
        graphics.lineTo(0, 0);
        graphics.stroke();
    }

}

