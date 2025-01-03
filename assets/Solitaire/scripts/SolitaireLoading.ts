import { ProgressBar } from 'cc';
import { Button } from 'cc';
import { v3 } from 'cc';
import { UITransform } from 'cc';
import { Size } from 'cc';
import { UIOpacity } from 'cc';
import { Vec3 } from 'cc';
import { Tween } from 'cc';
import { tween } from 'cc';
import { director } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SolitaireLoading')
export class SolitaireLoading extends Component {


    @property(Node) persistTransitionNode: Node;

    @property(Label) loadingPercent: Label;
    @property(ProgressBar) loadingBar: ProgressBar;
    @property(Button) startGameButton: Button;

    _isGameStart: boolean;

    protected start(): void {

        this.startGameButton.interactable = false;
        director.preloadScene("Solitaire",
            this.onProgressLoading.bind(this),
            () => {
                console.log('Next scene preloaded');
                this.startGameButton.interactable = true;
                this.showStartGameCTA();
            }
        );
        this.persistTransitionNode.emit("SHOW_LOADING_ANIMATION");
    }

    clickStartGame() {
        Tween.stopAllByTarget(this.startGameButton.node);
        this._isGameStart = true;
        this.persistTransitionNode.emit("SHOW_TRANSITION_TO_GAME");
        this.node.children.forEach(node => {
            if (node.name.startsWith("Persist") || node.name.startsWith("Camera")) return;

            tween(node.addComponent(UIOpacity))
                .to(0.3, { opacity: 0 })
                .start();
        })
    }

    onProgressLoading(completedCount: number, totalCount: number) {
        const ratio = completedCount / totalCount;
        this.loadingBar.progress = ratio;
        this.loadingPercent.string = Math.round(ratio * 100) + "%";
    }

    showStartGameCTA() {
        tween(this.startGameButton.node)
            .repeatForever(
                tween()
                    .to(0.2, { scale: v3(1.5, 1.5, 1) })
                    .to(0.2, { scale: v3(1, 1, 1) })
                    .delay(0.5)
            )
            .start();
    }

}

