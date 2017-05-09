/*
 * Flashcard Screen displays the flashcards and the status bar.
 *
 * Author: Amy Chou
 * May 8, 2017
 */

class FlashcardScreen {
  constructor(containerElement, app) {
    this.containerElement = containerElement;
    this.app = app;
  }

  /* Receives updates from the app and updates flashcard screen accordingly */
  update(notification) {
    if (notification === 'deck selected') {
      this.updateStatusBar();
      this.show();
    }
    if (notification === 'update stats') {
      this.updateStatusBar();
    }
    if (notification === 'reset to menu') {
      this.hide();
    }
    if (notification === 'show results') {
      this.hide();
    }
  }

  /* Updates start bar with number of correct and incorrect answers */
  updateStatusBar() {
    const correctFields = document.querySelectorAll('.correct');
    const wrongFields = document.querySelectorAll('.incorrect');

    const numCorrect = this.app.correct;
    const numWrong = this.app.wrong;
    for (const correctField of correctFields) {
      correctField.textContent = numCorrect;
    }
    for (const wrongField of wrongFields) {
      wrongField.textContent = numWrong;
    }
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }
}
