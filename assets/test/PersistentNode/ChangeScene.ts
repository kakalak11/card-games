import { Scene } from 'cc';
import { director } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChangeScene')
export class ChangeScene extends Component {

    @property(Node) persistNode: Node;

    changeScene() {
        this.persistNode.removeFromParent();
        director.addPersistRootNode(this.persistNode)
        console.log(director.isPersistRootNode(this.persistNode));

        director.loadScene("scene2", (err, scene: Scene) => {
            console.log(scene);
            this.persistNode.setParent(scene.getChildByName("Canvas"))
        });
    }
}

