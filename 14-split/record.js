/* =====================================================================
   record.js. File 2 of 6.

   One job: the best score. This file owns the record, reads it back
   when the page opens, and writes it down at the end of a run.

   No other file says the word localStorage. If the saved score ever
   goes wrong, this is the only file you open, and its 63 lines hold
   the whole story. That is the whole argument for splitting, in one file.
   ===================================================================== */

/* The name the browser files the record under. It stays 'rooftop-run',
   so this page and project 13 share one best score. */
const RECORD_KEY = 'rooftop-run';

/* The record itself: your best run in metres, and how many runs you
   have had. It lives here, in the file whose job it is. */
let record = { best: 0, runs: 0 };

/* Some browsers refuse to save anything on a page you opened by
   double-clicking. The rack says so when that happens. */
let storageWorks = true;

function seeWhetherTheBrowserWillSave() {
  try {
    localStorage.setItem(RECORD_KEY + '-test', '1');
    localStorage.removeItem(RECORD_KEY + '-test');
    storageWorks = true;
  } catch (error) {
    storageWorks = false;
  }
}

function loadRecord() {
  if (!storageWorks) return { best: 0, runs: 0 };
  const saved = localStorage.getItem(RECORD_KEY);
  if (saved === null) return { best: 0, runs: 0 };
  return JSON.parse(saved);
}

function saveRecord(theRecord) {
  localStorage.setItem(RECORD_KEY, JSON.stringify(theRecord));
}

/* The page has just opened. Fetch whatever is written down. */
function readTheRecord() {
  record = loadRecord();
  didWork('record');
}

/* A run has just ended. Take the metres, keep the record up to date,
   write it down, and say whether it was a new best. */
function countThisRun(metres, allowedToSave) {
  const isBest = metres > record.best;

  record.runs += 1;
  if (isBest) record.best = metres;

  if (allowedToSave && storageWorks) saveRecord(record);
  didWork('record');

  return isBest;
}
