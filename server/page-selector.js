export class PageSelector extends HTMLElement {
  static get observedAttributes() { return ['current-page', 'total-pages']; }

  /** @type {(page: number) => void} */
  setPage;

  attributeChangedCallback() {
    this.updateValue();
  }

  updateValue() {
    const currentPage = parseInt(this.getAttribute('current-page')) || 0;
    const totalPages = parseInt(this.getAttribute('total-pages')) || 0;

    // Buttons to navigate between pages
    const previousButton = document.createElement('button');
    previousButton.disabled = currentPage === 1;
    previousButton.textContent = '<';
    previousButton.onclick = () => {
      this.setPage(currentPage - 1);
    };

    const nextButton = document.createElement('button');
    nextButton.disabled = currentPage === totalPages;
    nextButton.textContent = '>';
    nextButton.onclick = () => {
      this.setPage(currentPage + 1);
    };

    // Current page indicator
    const pageIndicator = document.createElement('span');
    pageIndicator.innerText = `${currentPage} / ${totalPages}`;

    // Place elements in DOM
    this.#content.replaceChildren(previousButton, pageIndicator, nextButton);
  }

  /** @type {HTMLDivElement} */
  #content;

  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    // Create table with scores
    this.#content = document.createElement('div');

    // Button style
    const style = document.createElement('style');
    style.textContent = `
      button {
          background: none !important;
          border: none;
          padding: 0!important;
          /*optional*/
          font-family: arial, sans-serif;
          /*input has OS specific font-family*/
          color: #069;
          text-decoration: underline;
          cursor: pointer;
      }

      button[disabled] {
        color: gray;
        cursor: not-allowed;
      }

      div {
        width: 100px;
        display: flex;
        justify-content: space-between;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.#content);
  }
}
