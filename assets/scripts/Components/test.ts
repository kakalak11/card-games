import { view } from 'cc';
import { input } from 'cc';
import { Vec3 } from 'cc';
import { Vec2 } from 'cc';
import { UITransform } from 'cc';
import { EventMouse } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {

    @property(Node) testTarget: Node;

    start() {
        this.node.getComponent(UITransform).setContentSize(view.getDesignResolutionSize());
        console.log(view.getDesignResolutionSize());

        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.node.on(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onMouseDown(evt: EventMouse) {

    }

    onMouseUp(evt: EventMouse) {

    }

    onMouseMove(evt: EventMouse) {

    }

}

