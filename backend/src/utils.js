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
    shuffle(deckOfCards);
    return deckOfCards;
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

export function calculateWinnings(betAmount, isBlackjack) {
    if (isBlackjack) {
        return betAmount * 1.5; // 3:2 payout for blackjack
    } else {
        return betAmount; // 1:1 payout for regular win
    }
}

export function findCardByValue(chi, numberValue, cacheCard = []) {
    return chi.find(card => {
        if (card.numberValue == numberValue && cacheCard.findIndex(_card => _card === card) === -1) {
            return card;
        }
    });
}

export function findCardBySuit(chi, suit, cacheCard) {
    return chi.find(card => {
        if (card.suit == suit && cacheCard.findIndex(_card => _card === card) === -1) {
            return card;
        }
    });
}

export function detectAllCombinations(chi = []) {
    let result = {};
    let cardList = [];
    let seen = {};

    for (let i = 0; i < chi.length; i++) {
        let currCard = chi[i];
        cardList = [];

        while (currCard) {
            cardList.push(currCard);
            currCard = findCardByValue(chi, currCard.numberValue + 1);
        }

        if (cardList.length == 5) {
            result = Object.assign(result, {
                aceHigh: [...chi].pop().numberValue == 13,
                foundStraight: true,
                title: "Sảnh",
                cardList: cardList.slice(),
                cardRank: 5
            });

            break;
        }
    }

    for (let i = 0; i < chi.length; i++) {
        let currCard = chi[i];
        cardList = [];

        while (currCard) {
            cardList.push(currCard);
            currCard = findCardBySuit(chi, currCard.suit, cardList);
        }

        if (cardList.length == 5) {
            result = Object.assign(result, {
                foundFlush: true,
                title: "Thùng",
                cardList: cardList.slice(),
                cardRank: 6
            });

            break;
        }
    }

    if (result.foundFlush && result.foundStraight) {
        const aceHigh = result.aceHigh;
        if (aceHigh) {
            result = Object.assign(result, {
                foundRoyalFlush: true,
                title: "Sảnh Rồng",
                cardList: cardList.slice(),
                cardRank: 10
            });
        } else {
            result = Object.assign(result, {
                foundStraightFlush: true,
                title: "Thùng Phá Sảnh",
                cardList: cardList.slice(),
                cardRank: 9
            });
        }
        delete result.foundFlush;
        delete result.foundStraight;
    }

    cardList = [];
    for (let i = 0; i < chi.length; i++) {
        let currCard = chi[i];
        let cache = [];

        if (seen[currCard.numberValue]) continue;
        seen[currCard.numberValue] = true;

        while (currCard) {
            cache.push(currCard);
            currCard = findCardByValue(chi, currCard.numberValue, cache);
        }

        switch (cache.length) {
            case 2:
                if (result.foundPair) {
                    result = Object.assign(result, {
                        found2Pairs: true,
                        title: "Thú",
                        cardList: cardList.concat(cache),
                        cardRank: 3
                    });
                    delete result.foundPair;
                } else {
                    result = Object.assign(result, {
                        foundPair: true,
                        title: "Đôi",
                        cardList: cardList.concat(cache),
                        cardRank: 2
                    });
                }
                cardList = result.cardList.slice();
                break;
            case 3:
                result = Object.assign(result, {
                    found3Kinds: true,
                    title: "Sám",
                    cardList: cardList.concat(cache),
                    cardRank: 4
                });
                cardList = result.cardList.slice();
                break;
            case 4:
                result = Object.assign(result, {
                    found4Kinds: true,
                    title: "Tứ Quý",
                    cardList: cardList.concat(cache),
                    cardRank: 8
                });
                cardList = result.cardList.slice();
                break;
        }
    }

    if (result.foundPair && result.found3Kinds) {
        result = Object.assign(result, {
            foundFullHouse: true,
            title: "Cù Lũ",
            cardList: cardList.slice(),
            cardRank: 7
        });
        delete result.foundPair;
        delete result.found3Kinds;
    }

    if (Object.keys(result).length == 0) {
        result = Object.assign(result, {
            cardList: [[...chi].pop()],
            title: "Mậu Thầu",
            isHighCard: true,
            cardRank: 1
        });
    }

    return result;
}