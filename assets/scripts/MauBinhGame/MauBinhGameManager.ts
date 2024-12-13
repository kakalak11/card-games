import { MauBinhPlayerManager } from './MauBinhPlayerManager';
import { getDeck, shuffle } from '../utils';
import {
    _decorator, Component, Node, v3, resources,
    SpriteFrame, error, instantiate, Sprite, Prefab
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MauBinhGameManager')
export class MauBinhGameManager extends Component {

    @property(Node) player: MauBinhPlayerManager;
    @property(Prefab) cardPrefab: Prefab;

    protected onLoad(): void {
        this.player = this.player?.getComponent(MauBinhPlayerManager);
    }

    protected start(): void {
        this.gameStart();
    }

    gameStart() {
        const deck = getDeck(true);
        const deckLength = deck.length;
        shuffle(deck);

        let playerHand = [];
        for (let i = 0; i < deckLength; i++) {
            if (i % 4 == 0) {
                playerHand.push(deck.pop());
            }
        }

        this.loadHand(playerHand)
            .then((result) => {
                this.player.setPlayerHand(result);
            })
    }

    loadHand(hand) {
        let allPromises = [];

        hand.forEach(card => {
            const { value, suit } = card;
            let assetName = suit + "_" + value;
            allPromises.push(
                new Promise((resolve, reject) => {
                    resources.load(`cards/${suit}/${assetName}/spriteFrame`, SpriteFrame, (err, asset) => {
                        if (err) return reject(error(err.message));

                        const node = instantiate(this.cardPrefab);
                        node.getComponent(Sprite).spriteFrame = asset;
                        card.cardNode = node;
                        resolve(card);
                    });
                })
            )
        })

        return Promise.all(allPromises)
            .then((result) => {
                return result;
            });
    }

}