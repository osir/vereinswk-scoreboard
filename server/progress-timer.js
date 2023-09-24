export class ProgressTimer extends HTMLProgressElement {
  static get observedAttributes() { return ['max', 'increment']; }

  /** @type {number | undefined} */
  #interval = undefined;

  /** @type {() => void} */
  elapsed;

  attributeChangedCallback() {
    this.resetTimer();
  }

  disconnectedCallback() {
    clearInterval(this.#interval);
    this.#interval = undefined;
  }

  stopTimer() {
    clearInterval(this.#interval)
  }

  resetTimer() {
    const max = parseInt(this.getAttribute('max')) || 0;
    const increment = parseInt(this.getAttribute('increment')) || 0;
    this.setAttribute('value', '0');

    clearInterval(this.#interval);
    this.#interval = setInterval(() => {
      const value = parseInt(this.getAttribute('value')) || 0;

      if (value >= max) {
        this.elapsed();
        this.setAttribute('value', '0');
      } else {
        this.setAttribute('value', (value + increment).toString());
      }
    }, 1_000);
  }

  constructor() {
    super();
  }
}
