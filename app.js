/*
 * Controls the main app behavior and communicates with the MenuScreen,
 * FlashcardScreen, and ResultsScreen views.
 *
 * Author: Amy Chou
 * May 8, 2017
 */

class App {
  constructor() {
    /* Deck */
    this.deck = {};
    this.cards = [];
    this.cardNum = 0;

    /* Session stats */
    this.correct = 0;
    this.wrong = 0;
    this.percentage = null;

    /* Bind methods */
    this.selectDeck = this.selectDeck.bind(this);

    /* Create screens */
    const menuElement = document.querySelector('#menu');
    this.menu = new MenuScreen(menuElement, this.selectDeck);

    const mainElement = document.querySelector('#main');
    this.flashcards = new FlashcardScreen(mainElement, this);

    const resultElement = document.querySelector('#results');
    this.results = new ResultsScreen(resultElement, this);
  }


 /* Communicates with the MenuScreen, FlashcardScreen, and ResultsScreen
  * for any updates to the screen views.
  */
  notifyScreens(notification) {
    this.menu.update(notification);
    this.flashcards.update(notification);
    this.results.update(notification);
  }

  /* Updates the count of the number of correct and wrong answers with the
   * given parameters deltaC and deltaW, respectively. Calculates the new
   * percentage correct. Notifies the view screens of the updated status. */
  updateStatus(deltaC, deltaW) {
    this.correct += deltaC;
    this.wrong += deltaW;
    this.percentage =  Math.round(100 * this.correct / (this.correct + this.wrong));
    this.notifyScreens('update stats');
  }

  /* Sets the app's deck to the deck passed by parameter */
  selectDeck(deck) {
    this.deck = deck;
    this.createCards();
    this.notifyScreens('deck selected');
  }

  /* Creates the array of flashcards used for a flashcard session */
  createCards() {
    const flashcardContainer = document.querySelector('#flashcard-container');
    const words = this.deck.words;
    for (const word in words) {
      const definition = words[word];
      const card = new Flashcard(flashcardContainer, word, definition, this);
      this.cards.push(card);
    }
    this.cards[this.cardNum].show();
  }

  /* Processes the card the user just answered */
  processCurrent(correct) {
    let card = this.cards[this.cardNum];
    card.destroy(); // Remove flashcard object from DOM

    if (correct) { // If user answered current card correctly
      // Remove Flashcard object from array entirely
      this.cards.splice(this.cardNum--, 1);
    }
    else {
      const flashcardContainer = document.querySelector('#flashcard-container');
      // Replace with new Flashcard object
      this.cards.splice(this.cards.indexOf(card), 1,
          new Flashcard(flashcardContainer, card.word, card.definition, this));
    }
  }

  /* Moves to the next card */
  nextCard(correct) {
    this.processCurrent(correct);
    // Move to next card
    this.cardNum ++;
    if (this.cardNum < this.cards.length){
      this.cards[this.cardNum].show();
    }
    else {
      this.notifyScreens('show results');
    }
  }

  /* Continues a session of flashcards */
  continueDeck(){
    // No more incorrect cards in deck -- start over.
    if (this.cards.length === 0) {
      this.restartDeck();
    }
    else {
      this.cardNum = 0;
      this.wrong = 0;
      this.notifyScreens('update stats');
      this.cards[0].show();
      this.flashcards.show();
    }
  }

  /* Restarts the app with the same deck of flashcards */
  restartDeck(){
    this.createCards();
    this.correct = 0;
    this.wrong = 0;
    this.percentage = null;
    this.flashcards.show();
    this.notifyScreens('update stats');
  }

  /* Resets app entirely */
  resetToMenu() {
    /* Deck */
    this.deck = {};
    this.cards = [];
    this.cardNum = 0;

    /* Session stats */
    this.correct = 0;
    this.wrong = 0;
    this.percentage = null;
    this.notifyScreens('reset to menu');
  }

}
