import { director } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameList')
export class GameList extends Component {

    onClick(evt, sceneName) {
        director.loadScene(sceneName, (err) => {
            if (err) return console.error(err);
            console.log("=== Load scene successfully ===");
        });
    }

}

