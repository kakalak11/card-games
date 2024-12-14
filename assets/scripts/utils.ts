import { Canvas, Node } from "cc";
import { CardManager } from "./CardManager";
import { EventMouse } from "cc";
import { UITransform } from "cc";
import { Vec3 } from "cc";

export const MAX_CARDS = 52;
export const SUITS = ["spade", "diamond", "club", "heart"];
export const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
export const ROYAL_VALUES = { "J": 11, "Q": 12, "K": 13, "A": 14 };

export function getDeck(isMauBinh = false) {
    let deckOfCards = [];
    for (let suitIndex = 0; suitIndex < SUITS.length; suitIndex++) {
        for (let valueIndex = 0; valueIndex < VALUES.length; valueIndex++) {
            let card = {
                value: VALUES[valueIndex],
                suit: SUITS[suitIndex],
                numberValue: Number(VALUES[valueIndex]) || (isMauBinh ? ROYAL_VALUES[VALUES[valueIndex]] : 10),
            };
            deckOfCards.push(card);
        }
    }
    return deckOfCards;
}

export function getTotalHandValue(playerHand) {
    return playerHand.reduce((acc, curr) => {
        if (!curr.cardNode) {
            debugger;
            return;
        }
        if (curr.cardNode.getComponent(CardManager).isShowingBackCard()) return acc;
        return acc + curr.numberValue;
    }, 0)
}

export function checkBlackJack(playerHand) {
    if (playerHand.length > 2) return;
    let hasRoyalOr10;
    let hasAce;
    playerHand.forEach(card => {
        if (card.value == "A") {
            hasAce = true;
        } else if (!Number(card.value) || card.value == 10) {
            hasRoyalOr10 = true;
        }
    });
    return hasRoyalOr10 && hasAce;
}

export function shuffle(deck) {
    // for 1000 turns
    // switch the values of two random cards
    for (let i = 0; i < 1000; i++) {
        let location1 = Math.floor((Math.random() * deck.length));
        let location2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

let canvasNode;
export function getCanvasNode(node: Node) {
    if (canvasNode) return canvasNode;
    let _node = node;
    while (!_node.getComponent(Canvas)) {
        _node = node.parent;

    }
    canvasNode = _node;
    return _node;
}

export function calculateWinnings(betAmount, isBlackjack) {
    if (isBlackjack) {
        return betAmount * 1.5; // 3:2 payout for blackjack
    } else {
        return betAmount; // 1:1 payout for regular win
    }
}

export function getLocalPosFromEvent(evt: EventMouse, targetNode) {
    const worldPos = new Vec3(evt.getUILocation().x, evt.getUILocation().y, 0);
    const nodePos = targetNode.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
    return nodePos;
}

export function changeParent(node: any, newParent: any) {
    if (node.parent === newParent) return;
    const getWorldRotation = function (node: any) {
        let currNode = node;
        let resultRot = currNode.angle || 0;
        do {
            currNode = currNode.parent;
            resultRot += currNode.angle || 0;
        } while (currNode.parent != null);
        resultRot = resultRot % 360;
        return resultRot;
    };

    const oldWorRot = getWorldRotation(node);
    const newParentWorRot = getWorldRotation(newParent);
    const newLocRot = oldWorRot - newParentWorRot;

    if (!node.getComponent(UITransform)) {
        node.addComponent(UITransform);
    }
    if (!newParent.getComponent(UITransform)) {
        newParent.addComponent(UITransform);
    }
    const oldWorPos = node.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, 0, 0));
    const newLocPos = newParent.getComponent(UITransform).convertToNodeSpaceAR(oldWorPos);

    node.parent = newParent;
    node.position = newLocPos;
    node.angle = newLocRot;
};

export function findCardByValue(chi, numberValue, cacheCard = []) {
    return chi.find(card => {
        if (card.numberValue == numberValue && cacheCard.findIndex(_card => _card === card) === -1) {
            return card;
        }
    });
}

export function detectSanh(chi) {
    let foundSanh;
    let aceHigh;

    for (let i = 0; i < chi.length; i++) {
        let currCard = chi[i];
        let countCard = 0;

        while (currCard) {
            currCard = findCardByValue(chi, currCard.numberValue + 1);
            countCard++;
        }

        foundSanh = countCard == 5;
        if (foundSanh) {
            aceHigh = chi.pop().numberValue == 13;
            break;
        }
    }

    return { foundSanh, aceHigh };
}

export function findCardBySuit(chi, suit, cacheCard) {
    return chi.find(card => {
        if (card.suit == suit && cacheCard.findIndex(_card => _card === card) === -1) {
            return card;
        }
    });
}

export function detectThung(chi) {
    let foundThung;

    for (let i = 0; i < chi.length; i++) {
        let currCard = chi[i];
        let countCard = 0;
        let cacheCard = [];

        while (currCard) {
            cacheCard.push(currCard);
            currCard = findCardBySuit(chi, currCard.suit, cacheCard);
            countCard++;
        }

        foundThung = countCard == 5;
        if (foundThung) break;
    }

    return foundThung;
}

export function detectDoi(chi) {
    let foundDoi;
    let foundSam;
    let foundThu;
    let foundTuQuy;
    let foundCuLu;
    let seen = {};

    for (let i = 0; i < chi.length; i++) {
        let currCard = chi[i];
        let countCard = 0;
        let cacheCard = [];

        if (seen[currCard.numberValue]) continue;
        seen[currCard.numberValue] = true;

        while (currCard) {
            cacheCard.push(currCard);
            currCard = findCardByValue(chi, currCard.numberValue, cacheCard);
            countCard++;
        }


        switch (countCard) {
            case 2:
                if (foundDoi) {
                    foundThu = true;
                } else {
                    foundDoi = true;
                }
                break;
            case 3:
                foundSam = true;
                break;
            case 4:
                foundTuQuy = true;
                break;
        }
    }

    if (foundDoi && foundSam) {
        foundCuLu = true;
        foundDoi = false;
        foundSam = false;
    }

    return { foundDoi, foundSam, foundThu, foundTuQuy, foundCuLu };
}