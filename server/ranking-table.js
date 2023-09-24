export class RankingTable extends HTMLElement {
  /** @type {unknown[]} */
  #rankings;
  /** @type {string[]} */
  #headers;
  /** @type {HTMLTableElement} */
  #thead;
  /** @type {HTMLTableElement} */
  #tbody;

  get headers() {
    return this.#headers;
  }

  set headers(value) {
    this.#headers = value;
  }

  get rankings() {
    return this.#rankings;
  }

  set rankings(value) {
    this.#rankings = value;

    console.log('Creating table element in CSV Format', this.getAttribute('CSVFormat'))
    const headerRow = document.createElement('tr');
    let rows;
    if (this.getAttribute('CSVFormat') === 'Custom') {
      // Custom Format expects an array
      rows = value.map((ranking) => {
        const row = document.createElement('tr');
        for (const col of ranking) {
          row.innerHTML += `<td>${ col }</td>`
        }
        return row;
      });
    } else if (this.getAttribute('CSVFormat') === 'VereinsWK') {
      this.#headers = ['Rang', 'Teilnehmer', 'Jahrgang', 'Verein', 'Spg', 'Punkte'];
      // VereinsWK Format expects a dictionary with these fields
      rows = value.map((ranking) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="position">${ ranking.position }.</td>
          <td class="competitor">${ ranking.competitor }</td>
          <td>
              <span class="year">${ ranking.year }</span>
              <span class="category">${ ranking.category }</span>
          </td>
          <td>
              <span class="town">${ ranking.town }</span>,
              <span class="association">${ ranking.association }</span>
          </td>
          <td class="weapon-type">${ ranking.weapon_type }</td>
          <td class="score">${ ranking.score }</td>
        `;
        return row;
      });
    } else {
      console.log('Unknown CSV Format', this.getAttribute('CSVFormat'))
    }

    this.#headers.forEach(
      (header) => {
        const columnHeader = document.createElement('th');
        columnHeader.setAttribute('scope', 'col');
        columnHeader.innerText = header;
        headerRow.appendChild(columnHeader);
      }
    );
    this.#thead.replaceChildren(headerRow);
    this.#tbody.replaceChildren(...rows);
  }

  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    // Create table with scores
    const table = document.createElement('table');

    // Create static thead
    this.#thead = document.createElement('thead');
    table.appendChild(this.#thead);

    // Create empty tbody -> content will be filled once rankings are set
    this.#tbody = document.createElement('tbody');
    table.appendChild(this.#tbody);

    // Table style
    const style = document.createElement('style');
    style.textContent = `
      table {
          width: 100%;
          text-align: left;
          border-collapse: collapse;
      }

      thead,
      tfoot {
          background: #1C6EA4;
          background: linear-gradient(to bottom, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
      }

      th {
          font-size: 3vh;
          font-weight: bold;
          font-variant-caps: small-caps;
          color: #FFFFFF;
      }

      td {
          padding: 0 0;
          font-size: 4.3vh;
      }

      th > span,
      td > span{
          padding: 0;
          font-size: inherit;
      }

      .year,
      .category,
      .town,
      .association {
          font-size: 3vh;
      }

      .competitor,
      .score {
          font-weight: bold;
      }

      .position,
      .score {
          text-align: right;
      }

      tbody tr:nth-child(even) {
          background: #D0E4F5;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(table);
  }
}
