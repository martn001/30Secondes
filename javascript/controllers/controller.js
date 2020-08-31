import Word from '../models/word.js';
import Result from '../models/result.js';

export default class Controller {
  constructor() {
    this.result = new Result();

    this.clearGameButton = document.querySelector('#clear-game-button');
    this.resumeGameButton = document.querySelector('#resume-game-button');
    this.randomWordButton = document.querySelector('#random-word-button');

    this.mainmenu = document.querySelector('#mainmenu');
    this.game = document.querySelector('#game');
    this.historyOverview = document.querySelector('#history-overview');

    this.beforeGame();
  }

  beforeGame() {
    this.clearGameButton.addEventListener('click', () => {
      this.result.reload();
      this.loadGame();
    });

    this.resumeGameButton.addEventListener('click', () => {
      this.result.load();
      this.loadGame();
    });

    this.randomWordButton.addEventListener('click', () => {
      this.handleRandomWordsAction();
    });

    if (this.result.hasStorage()) {
      this.resumeGameButton.style.display = 'block';
    }
  }

  loadGame() {
    this.randomWordButton.disabled = false;
    this.mainmenu.style.display = 'none';
    this.game.style.display = 'block';

    this.updateHistoryOverview();
  }

  clearGame() {
    this.result.reload();
  }

  handleRandomWordsAction() {
    let result = '';

    // Generate 5 random words
    for (let x = 0; x < 5; x++) {
      result += this.getRandomWord();
      result += '<br/>';
    }

    this.result.setHistoryWords();
    this.result.setFutureWords();

    this.displaySelectedRandomWords(result);
  }

  handleEndGame() {
    this.randomWordButton.disabled = true;
  }

  getRandomWord() {
    if (this.result.future.length <= 0) {
      this.handleEndGame();
      return '...';
    }

    const index = Math.floor(Math.random() * this.result.future.length);
    const word = new Word(this.result.future[index]['id'], this.result.future[index]['name']);

    this.result.history.push(word);
    this.result.future.splice(index, 1);

    this.displayWordInHistory(this.result.history.length - 1);
    return word.name;
  }

  displaySelectedRandomWords(text) {
    document.querySelector('#random-word-display').innerHTML = text;
  }

  updateHistoryOverview() {
    this.historyOverview.innerHTML = '';

    for (const index in this.result.history) {
      this.displayWordInHistory(index);
    }
  }

  displayWordInHistory(index) {
    let htmlElement = document.createElement('li');
    htmlElement.innerHTML = this.result.history[index]['name'];

    this.historyOverview.appendChild(htmlElement);
  }
}
