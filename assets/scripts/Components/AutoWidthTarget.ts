import { UITransform } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AutoWidthTarget')
export class AutoWidthTarget extends Component {

    @property(Node) labelNode: Node;

    protected start(): void {
        if (!this.labelNode) return;
        this.labelNode.on(Node.EventType.SIZE_CHANGED, this.onSizeChanged, this);
        this.onSizeChanged();
    }

    onSizeChanged() {
        const width = this.labelNode.getComponent(UITransform).width;

        this.node.getComponent(UITransform).width = width;
    }

}

