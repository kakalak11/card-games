import { _decorator, Component, Node } from 'cc';
import { testDropScript } from './testDropScript';
const { ccclass, property } = _decorator;

@ccclass('testManager')
export class testManager extends Component {

    protected onLoad(): void {
        this.node.on("ON_DRAG_BEGIN", this.onDragBegin, this);
    }

    onDragBegin(evt) {
        this.node.getComponentsInChildren(testDropScript).forEach(comp => {
            comp.setDragTarget(evt.target);
        });
    }

}

