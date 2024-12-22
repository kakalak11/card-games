import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SolitaireShuffleData')
export class SolitaireShuffleData extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
}

/*
Here's an easy shuffle for Ascending Tableau Solitaire:

Tableau Piles:

    Column 1: Ace of Spades
    Column 2: 2 of Hearts, Ace of Hearts
    Column 3: 3 of Diamonds, 2 of Diamonds, Ace of Diamonds
    Column 4: 4 of Clubs, 3 of Clubs, 2 of Clubs, Ace of Clubs
    Column 5: 5 of Spades, 4 of Spades, 3 of Spades, 2 of Spades, Ace of Spades
    Column 6: 6 of Hearts, 5 of Hearts, 4 of Hearts, 3 of Hearts, 2 of Hearts, Ace of Hearts
    Column 7: 7 of Diamonds, 6 of Diamonds, 5 of Diamonds, 4 of Diamonds, 3 of Diamonds, 2 of Diamonds, Ace of Diamonds

Stock Pile:

    8 of Clubs, 9 of Clubs, 10 of Clubs, Jack of Clubs, Queen of Clubs, King of Clubs, 8 of Spades, 9 of Spades, 10 of Spades,
     Jack of Spades, Queen of Spades, King of Spades, 8 of Hearts, 9 of Hearts, 10 of Hearts, Jack of Hearts, Queen of Hearts,
      King of Hearts, 8 of Diamonds, 9 of Diamonds, 10 of Diamonds, Jack of Diamonds, Queen of Diamonds, King of Diamonds, 7 of Hearts, 7 of Spades, 6 of Clubs, 5 of Clubs

turn this AI gen shuffle into a deck
*/
