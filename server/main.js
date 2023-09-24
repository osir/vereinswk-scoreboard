//import { scores } from './scores.js';
import { Settings } from './settings.js'; const settings = new Settings();
import { RankingTable } from './ranking-table.js';
import { PageSelector } from './page-selector.js';
import { ProgressTimer } from './progress-timer.js';

// Define custom elements
customElements.define('ranking-table', RankingTable);
customElements.define('page-selector', PageSelector);
customElements.define('progress-timer', ProgressTimer, { extends: 'progress' });

/** @type {RankingTable} */
const rankingTable = document.querySelector('ranking-table');

/** @type {PageSelector} */
const pageSelector = document.querySelector('page-selector');

/** @type {ProgressTimer} */
const progressTimer = document.querySelector('progress');

/**
 * Split array into a new array of arrays of given size
 * @param {unknown[]} arr
 * @param {number} size
 * @returns {unknown[][]}
 */
const paginate = (arr, size) => {
  return arr.reduce((acc, val, i) => {
    const idx = Math.floor(i / size);
    const page = acc[idx] ?? (acc[idx] = []);
    page.push(val);

    return acc;
  }, []);
};

/**
 * Fetch new Score as CSV from server and parse it.
 * Warning: Can't actually parse CSV reliably, contains hardcoded assumptions about format.
 */
const fetchScores = async () => {
  console.log('Fetching new scores...');
  const scores = [];

  // Prevent caching when getting new data
  var cacheHeaders = new Headers();
  cacheHeaders.append('pragma', 'no-cache');
  cacheHeaders.append('cache-control', 'no-cache');

  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#processing_a_text_file_line_by_line
  const decoder = new TextDecoder(settings.csvEncoding);
  const res = await fetch(settings.fetchScoresUrl, { method: 'GET', headers: cacheHeaders});
  console.log('Got:', res.status, res.statusText, 'from', res.url);
  const reader = res.body.getReader();

  //const re = /\n|\r|\r\n/gm;
  const re = /\r\n/gm; // Only expect Windows line ending.
  let startIndex = 0;
  let result;
  let { value: chunk, done: readerDone } = await reader.read();
  chunk = chunk ? decoder.decode(chunk) : '';
  console.log('Parsing CSV in format', settings.csvFormat);

  let lineNumber = 0
  while (true) {
    let result = re.exec(chunk);
    if (!result) {
      if (readerDone) break;
      let remainder = chunk.substr(startIndex);
      ({ value: chunk, done: readerDone } = await reader.read());
      chunk = remainder + (chunk ? decoder.decode(chunk) : '');
      startIndex = re.lastIndex = 0;
      continue;
    }

    // Split lines into CSV fields
    let line = chunk.substring(startIndex, result.index);
    lineNumber += 1;
    console.log('Parsing line', lineNumber);
    let fields = line.slice(1, line.length-1).split('","');

    if (settings.csvFormat === 'Custom') {
      // Expect headers on first line
      if (lineNumber === 1) {
        console.log('Got custom headers:', fields);
        rankingTable.headers = fields;
        startIndex = re.lastIndex;
        continue;
      }

      console.log(fields);
      scores.push(fields);

    } else if (settings.csvFormat === 'VereinsWK') {
      // Expected CSV: Rank, Name, Year (space) Cat, Town (comma) Assoc, Weapon, Score, Empty (unknown)
      if (fields.length != 7) {
        console.log('Line contains incorrect amount fields:', fields.length);
        continue;
      }
      scores.push({
        position: fields[0],           competitor: fields[1],
        year: fields[2].split(' ')[0], category: fields[2].split(' ')[1],
        town: fields[3].split(',')[0], association: fields[3].split(',')[1],
        weapon_type: fields[4],        score: fields[5]
      });
    } else {
      console.log('Unknown CSV Format', settings.csvFormat)
    }
    startIndex = re.lastIndex;
  }
  console.log('Parsed scores:', scores.length);
  return paginate(scores, settings.rowsPerPage);
}

/* Wrap in main because Chrome 88 does not support global async */
const main = async () => {
  rankingTable.setAttribute('CSVFormat', settings.csvFormat)

  progressTimer.setAttribute('max', settings.secondsPerPage);
  let pagedScores = await fetchScores();
  //console.log(pagedScores)
  let currentPage = 1;

  /**
   * @param {number} page
   */
  const updatePage = (page) => {
      currentPage = page;
      rankingTable.rankings = pagedScores[page - 1];
      pageSelector.setAttribute('current-page', page.toString());
      progressTimer.resetTimer();
  }

  pageSelector.setPage = updatePage;
  pageSelector.setAttribute('total-pages', pagedScores.length);

  progressTimer.elapsed = async () => {
    // If last page is reached, get updated scores
    console.log('Timer elapsed. currentPage: ' + currentPage + ', total pages: ' + pagedScores.length);
    if (currentPage >= pagedScores.length) {
      progressTimer.stopTimer();
      pagedScores = await fetchScores();
      pageSelector.setAttribute('total-pages', pagedScores.length);
      updatePage(1); // Start at page one again
    } else {
      updatePage(1 + (currentPage % pagedScores.length));
    }
  }

  updatePage(1);

}
main();
