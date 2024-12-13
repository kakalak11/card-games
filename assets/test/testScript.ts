import { Intersection2D } from 'cc';
import { v3 } from 'cc';
import { Event } from 'cc';
import { EventTouch } from 'cc';
import { UITransform } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('testScript')
export class testScript extends Component {

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event) {
        // Handle touch start event
        const customEvent = new Event("ON_DRAG_BEGIN", true);
        this.node.dispatchEvent(customEvent);
    };

    onTouchMove(event: EventTouch) {
        let delta = event.getUIDelta();
        this.node.setPosition(this.node.position.add(v3(delta.x, delta.y, 0)));
    };

    onTouchEnd(event) {
        let draggedRect = this.node.getComponent(UITransform).getBoundingBoxToWorld();
    };

}