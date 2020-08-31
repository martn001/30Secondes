import Word from '../models/word.js';
import Result from '../models/result.js';

export default class Controller {
  constructor() {
    this.result = new Result();

    this.clearGameButton = document.querySelector('#clear-game-button');
    this.resumeGameButton = document.querySelector('#resume-game-button');
    this.randomWordButton = document.querySelector('#random-word-button');

    this.slider = document.querySelector('#slider');

    this.mainmenu = document.querySelector('#mainmenu');
    this.game = document.querySelector('#game');
    this.historyOverview = document.querySelector('#history-overview');

    this.coolDownTimer = null;
    this.animationTimer = null;

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
      clearInterval(this.coolDownTimer);
      clearInterval(this.animationTimer);
      this.handleRandomWordsAction();
      this.handleCoolDownTimer();
    });

    if (this.result.hasStorage()) {
      this.resumeGameButton.style.display = 'block';
    }
  }

  loadGame() {
    this.randomWordButton.disabled = false;
    this.mainmenu.style.display = 'none';
    this.game.style.display = 'block';

    if (this.result.future.length <= 0) {
      this.handleEndGame();
    }

    this.updateHistoryOverview();
  }

  handleCoolDownTimer() {
    this.randomWordButton.disabled = true;
    this.randomWordButton.innerHTML = 'Beurt bezig...';
    this.slider.style.width = '0';
    this.slider.style.backgroundPositionX = '0px';
    this.slider.style.transition = 'all 30s linear 0s';

    this.animationTimer = setTimeout(() => {
      this.slider.style.width = '100%';
      this.slider.style.backgroundPositionX = '-500px';
    }, 50);

    this.coolDownTimer = setTimeout(() => {
      this.randomWordButton.disabled = false;
      this.randomWordButton.innerHTML = 'Ontdek nog meer willekeurige woorden!';
      this.slider.style.transition = '0s';

      this.slider.style.width = '0';
      this.slider.style.backgroundPositionX = '0px';

      if (this.result.future.length <= 0) {
        this.handleEndGame();
      }

      this.displaySelectedRandomWords('');
    }, 30 * 1000 + 50);
  }

  handleRandomWordsAction() {
    let result = '';

    if (this.result.future.length <= 0) {
      this.handleEndGame();
      return;
    }

    // Generate 5 random words
    for (let x = 0; x < 5; x++) {
      result += this.getRandomWord();
      result += '<br/>';

      if (this.result.future.length <= 0) {
        this.handleEndGame();
        break;
      }
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
