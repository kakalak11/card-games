import { _decorator, Component, EventMouse, Node, UITransform, v3 } from 'cc';
import { MauBinhPlayerManager } from '../MauBinhGame/MauBinhPlayerManager';
import { Vec3 } from 'cc';
import { Prefab } from 'cc';
import { getLocalPosFromEvent } from '../utils';
const { ccclass, property } = _decorator;

@ccclass('DragAndDrop')
export class DragAndDrop extends Component {

    @property(Node) target: Node;
    @property(Prefab) dragCard: Prefab;

    _isDragging: boolean;
    _playerManager: MauBinhPlayerManager;
    _parent: Node;
    _cloneProps: any;

    protected onLoad(): void {
        if (!this.target) {
            this.target = this.node;
        }
        this._parent = this.node.parent;
    }

    protected start(): void {
        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.node.on(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    init(playerManager: MauBinhPlayerManager) {
        this._playerManager = playerManager;
    }

    onMouseLeave(event: EventMouse) {
        if (this._isDragging) {

            this._isDragging = false;
            this.node.setParent(this._cloneProps.parent);
            this.node.setSiblingIndex(this._cloneProps.siblingIndex);
            this.node.setPosition(this._cloneProps.position);
        }
    }

    onMouseDown(event: EventMouse) {
        this._isDragging = true;
        this._cloneProps = Object.assign({}, { position: this.node.getPosition(), parent: this.node.parent, siblingIndex: this.node.getSiblingIndex() });

        const worldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        const nodePos = this._playerManager.dragHolder.getComponent(UITransform).convertToNodeSpaceAR(worldPos);

        this.target.setParent(this._playerManager.dragHolder);
        this.target.setPosition(nodePos);

        console.log(event.getLocation());
    }

    onMouseMove(event: EventMouse) {
        if (this._isDragging) {
            this.dragNode(event);
        }
    }

    onMouseUp(event: EventMouse) {
        if (this._isDragging) {
            this._isDragging = false;
            this.node.setParent(this._cloneProps.parent);
            this.node.setSiblingIndex(this._cloneProps.siblingIndex);
            this.node.setPosition(this._cloneProps.position);
        }
    }

    setPositionTarget(worldPos) {
        const mouseWorldPos = v3(worldPos.x, worldPos.y, 0);
        this.target.setWorldPosition(mouseWorldPos);
    }

    dragNode(event: EventMouse) {
        const delta = event.getUIDelta();
        const moveX = this.node.getPosition().x + delta.x;
        const moveY = this.node.getPosition().y + delta.y;

        this.node.setPosition(moveX, moveY);
    }

}

