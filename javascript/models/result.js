const historyListName = 'history';
const futureListName = 'future';

import words from '../words.json';

export default class Result {
  /* Return all previous words */
  getHistoryWords() {
    return JSON.parse(localStorage.getItem(historyListName));
  }

  /* Return all future words */
  getFutureWords() {
    return JSON.parse(localStorage.getItem(futureListName));
  }

  setHistoryWords() {
    localStorage.setItem(historyListName, JSON.stringify(this.history));
  }

  setFutureWords() {
    localStorage.setItem(futureListName, JSON.stringify(this.future));
  }

  /* Return all existing words */
  getEverything() {
    return words
  }

  load() {
    this.history = this.getHistoryWords();
    this.future = this.getFutureWords();
  }

  /* Clear history */
  reload() {
    this.history = [];
    this.future = this.getEverything();

    this.emptyStorage();

    this.setHistoryWords();
    this.setFutureWords();
  }

  emptyStorage() {
    localStorage.clear();
  }

  hasStorage() {
    return localStorage.getItem(historyListName) !== null && localStorage.getItem(futureListName) !== null;
  }
}
