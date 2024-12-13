import { UITransform } from 'cc';
import { Intersection2D } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('testDropScript')
export class testDropScript extends Component {

    _dragTarget: Node;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

    }

    onTouchEnd(event) {
        console.log(event);
    }

    setDragTarget(dragTarget) {
        this._dragTarget = dragTarget;
    }

    protected update(dt: number): void {
        if (this._dragTarget) {
            if (this.isIntersectWithTarget(this._dragTarget)) {
                console.log("is intersected", this.node.name);
            }
        }
    }

    isIntersectWithTarget(dragTarget) {
        return Intersection2D.rectRect(dragTarget.getComponent(UITransform).getBoundingBoxToWorld(), this.node.getComponent(UITransform).getBoundingBoxToWorld())
    }

}

