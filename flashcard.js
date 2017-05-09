/*
 * Controls the display and interaction behavior of a single flashcard.
 *
 * Author: Amy Chou
 * May 8, 2017
 */

class Flashcard {
  constructor(containerElement, frontText, backText, app) {

    this.containerElement = containerElement;
    this.app = app;
    this.word = frontText;
    this.definition = backText;

    /* Create flashcard object in DOM */
    this.flashcardElement = this._createFlashcardDOM(frontText, backText);
    this.containerElement.append(this.flashcardElement);

    /* Event listeners and binding for actions */
    this._flipCard = this._flipCard.bind(this);
    this._dragStart = this._dragStart.bind(this);
    this._dragMove = this._dragMove.bind(this);
    this._dragEnd = this._dragEnd.bind(this);

    this.flashcardElement.addEventListener('pointerup', this._flipCard);
    this.flashcardElement.addEventListener('pointerdown', this._dragStart);
    this.flashcardElement.addEventListener('pointerup', this._dragEnd);
    this.flashcardElement.addEventListener('pointermove', this._dragMove);

    /* State of flashcard */
    this.originX = null;
    this.originY = null;
    this.currentX = null;
    this.currentY = null;
    this.dragStarted = false;
    this.correct = false;
    this.incorrect = false;

    this.hide(); // Hide by default
  }

  destroy() {
    this.flashcardElement.remove();
  }

  _dragStart(event) {
    this.originX = event.clientX;
    this.originY = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
    this.dragStarted = true;
  }

  _dragMove(event) {
    if (!this.dragStarted) {
      return;
    }
    event.preventDefault();

    // Deactivate bouncing back
    event.currentTarget.classList.remove("bounce");

    // Flashcard transform
    this.currentX = event.clientX - this.originX;
    this.currentY = event.clientY - this.originY;
    const rotateDeg = 0.2*this.currentX;
    event.currentTarget.style.transform =
      'translate(' + this.currentX + 'px, ' + this.currentY + 'px)' +
      ' rotate(' + rotateDeg + 'deg)';

    // Update background color and status depending on current mouse position
    const appContainer = document.querySelector('body');
    if (this.currentX >= 150) {         // 150 px to the right
      appContainer.style.backgroundColor = "#97b7b7";
      if (!this.correct) {
        this.app.updateStatus(1, 0);
        this.correct = true;
      }
    }
    else if (this.currentX <= -150) {   // 150 px to the left
      appContainer.style.backgroundColor = "#97b7b7";
      if (!this.incorrect){
        this.app.updateStatus(0, 1);
        this.incorrect = true;
      }
    }
    else {                              // In the middle
      appContainer.style.backgroundColor = "#d0e6df";
      if (this.correct) {
        this.app.updateStatus(-1, 0);
        this.correct = false;
      }
      if (this.incorrect){
        this.app.updateStatus(0, -1);
        this.incorrect = false;
      }
    }
  }

  _dragEnd(event) {
    this.dragStarted = false;
    if (this.currentX < 150 && this.currentX > -150) {
      event.currentTarget.classList.add("bounce");
    }
    else {
      this.app.nextCard(this.correct);
      const appContainer = document.querySelector('body');
      appContainer.style.backgroundColor = "#d0e6df";
    }
  }

  show() {
    this.flashcardElement.classList.remove('inactive');
  }

  hide() {
    this.flashcardElement.classList.add('inactive');
  }

  // Creates the DOM object representing a flashcard with the given
  // |frontText| and |backText| strings to display on the front and
  // back of the card. Returns a reference to root of this DOM
  // snippet. Does not attach this to the page.
  //
  // More specifically, this creates the following HTML snippet in JS
  // as a DOM object:
  // <div class="flashcard-box show-word">
  //   <div class="flashcard word">frontText</div>
  //   <div class="flashcard definition">backText</div>
  // </div>
  // and returns a reference to the root of that snippet, i.e. the
  // <div class="flashcard-box">
  _createFlashcardDOM(frontText, backText) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('flashcard-box');
    cardContainer.classList.add('show-word');

    const wordSide = document.createElement('div');
    wordSide.classList.add('flashcard');
    wordSide.classList.add('word');
    wordSide.textContent = frontText;

    const definitionSide = document.createElement('div');
    definitionSide.classList.add('flashcard');
    definitionSide.classList.add('definition');
    definitionSide.textContent= backText;

    cardContainer.appendChild(wordSide);
    cardContainer.appendChild(definitionSide);
    return cardContainer;
  }

  _flipCard(event) {
    this.flashcardElement.classList.toggle('show-word');
  }
}
