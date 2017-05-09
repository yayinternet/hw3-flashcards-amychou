/*
 * Menu Screen allows the user to select a deck of flashcards.
 *
 * Author: Amy Chou
 * May 8, 2017
 */

class MenuScreen {
  constructor(containerElement, selectDeck) {
    this.containerElement = containerElement;
    this.update = this.update.bind(this);

    /* Populate choices menu with MenuButtons */
    const choicesMenu = containerElement.querySelector("#choices");
    this.menuButtons = [];
    for (let i = 0; i < FLASHCARD_DECKS.length; i ++) {
      let deck = FLASHCARD_DECKS[i];
      this.menuButtons.push(new MenuButton(choicesMenu, deck, selectDeck));
    }
  }

 /* Receives updates from the app and updates menu screen accordingly */
  update(notification) {
    if (notification === 'deck selected') {
      this.hide();
    }
    if (notification === 'reset to menu') {
      this.show();
    }
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }
}

class MenuButton {
  constructor(choicesMenu, deck, onClickedCallback) {
    this.choicesMenu = choicesMenu;
    this.text = deck.title;
    this.deck = deck;

    const button = document.createElement('div');
    button.textContent = this.text;
    choicesMenu.append(button);

    this.onClickedCallback = onClickedCallback;
    this.onClick = this.onClick.bind(this);
    button.addEventListener('click', this.onClick);
  }

  onClick(){
    this.onClickedCallback(this.deck);
  }
}
