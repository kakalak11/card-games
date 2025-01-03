import { v3 } from 'cc';
import { director, Vec3, UIOpacity } from 'cc';
import { Scene } from 'cc';
import { Director } from 'cc';
import { UITransform } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SolitairePersistTransition')
export class SolitairePersistTransition extends Component {

    @property(Node) layoutCards: Node;
    @property(Node) foundationBG: Node;

    _isGameStart: boolean;

    protected onLoad(): void {
        this.node.on("SHOW_LOADING_ANIMATION", () => this._isGameStart, this);
        this.node.on("SHOW_TRANSITION_TO_GAME", this.showTranstionToGame, this);
    }

    showLoadingAnimation() {
        let currIndex = 0;
        const time = 0.4;
        const tweenAnim = tween()
            .by(time / 2, { position: v3(0, 20, 0) }, { easing: "sineIn" })
            .by(time / 2, { position: v3(0, -20, 0) }, { easing: "sineOut" })

        const nextCardAnim = () => {
            if (currIndex > 3) currIndex = 0;
            if (this._isGameStart) {
                this.showTranstionToGame();
                return;
            }
            const cardNode = this.layoutCards.children[currIndex];

            tweenAnim.clone(cardNode)
                .call(() => {
                    currIndex++;
                    nextCardAnim();
                })
                .start();
        }

        nextCardAnim();
    }

    showTranstionToGame() {

        const time = 0.3;

        function moveTo(node: Node, target: Node) {
            const nodeWorldPos = node.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO);
            const targetWorldPos = target.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO);
            const moveVec = targetWorldPos.subtract(nodeWorldPos);

            tween(node.getComponent(UITransform))
                .to(time, { contentSize: target.getComponent(UITransform).contentSize })
                .start();
            tween(node.getComponent(UIOpacity)).to(time, { opacity: 150 }).start();

            tween(node).by(time, { position: moveVec }).start();
        }

        let tweenAnim = tween(this);
        let index = 0;

        tweenAnim
            .repeat(this.layoutCards.children.length,
                tween()
                    .call(() => {
                        moveTo(this.layoutCards.children[index], this.foundationBG.children[index]);
                        index++;
                    })
                    .delay(time)
            )
            .call(() => {
                this.node.removeFromParent();
                director.addPersistRootNode(this.node);

                director.loadScene("Solitaire", () => {
                    this.node.setParent(this.node.scene.getChildByName("Canvas"));
                    tween(this.node.addComponent(UIOpacity))
                        .to(0.3, { opacity: 0 })
                        .call(() => {
                            director.removePersistRootNode(this.node);
                            this.node.destroy();
                        })
                        .start();
                });
            })
            .start()

    }
}

