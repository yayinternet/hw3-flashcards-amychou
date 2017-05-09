/*
 * Displays the number of correctly and incorrectly answered items in the deck.
 * Shows options for continuing with the current deck or resetting to menu.
 *
 * Author: Amy Chou
 * May 8, 2017
 */

class ResultsScreen {
  constructor(containerElement, app) {
    this.containerElement = containerElement;
    this.app = app;

    /* Bind methods */
    this.continueDeck = this.continueDeck.bind(this);
    this.reset = this.reset.bind(this);

    /* Event listeners for menu items */
    const toMenu = document.querySelector(".to-menu");
    toMenu.addEventListener('click', this.reset);

    const continueBox = document.querySelector(".continue");
    continueBox.addEventListener('click', this.continueDeck);
  }

  /* Receives updates from the app and updates results screen accordingly */
  update(notification) {
    if (notification === 'reset to menu') {
      this.hide();
    }
    if (notification === 'update stats'){
      const percentBox = document.querySelector(".percent");
      percentBox.textContent = this.app.percentage;
    }
    if (notification === 'show results') {
      this.show();
      const continueBox = document.querySelector(".continue");
      const percent = document.querySelector(".percent").textContent;
      if (percent === '100') {
        continueBox.textContent = "Start over?";
      }
      else {
        continueBox.textContent = "Continue";
      }
    }
  }

  /* Continue with current deck */
  continueDeck(event) {
    this.app.continueDeck();
    this.hide();
  }

  /* Reset to menu */
  reset(event) {
    this.app.resetToMenu();
  }

  show(numberCorrect, numberWrong) {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }
}
