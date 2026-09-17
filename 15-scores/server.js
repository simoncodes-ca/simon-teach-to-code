/* =====================================================================
   The score server. This is the other program.

   Everything you have written so far was one program, running in a
   browser. This file is not a webpage. It has no buttons, no pictures
   and no screen. You start it in a terminal, and it sits there waiting
   to be asked something.

   What it is for: your best scores and mine have always been stuck on
   the computer that made them. Project 13 saved a record in the
   browser's own notebook, and that notebook belongs to one browser on
   one machine. Nobody else can ever see it.

   A server fixes that, because it is one program that everybody talks
   to. It holds the list. Both computers ask it the same two questions:

       GET  /scores     what is on the list?
       POST /scores     here is a new score, put it on the list

   Start it like this, from a terminal, in this folder:

       node server.js

   Then leave that terminal alone. While it is running, the server is
   listening. Press Ctrl and C together to stop it.

   Write the functions in this order:
      1. sortedTop     the list, best first, and only the top ten
      2. isGoodScore   is this thing the browser sent us really a score?
      3. addScore      put a new score on the list and save it

   Write these three before you open scores.js. The webpage has nothing
   to talk to until they exist.
   ===================================================================== */

const http = require('node:http');          // the thing that listens
const fs = require('node:fs');              // reading and writing files
const os = require('node:os');              // asking what this computer is called
const path = require('node:path');          // building a file name


/* ---------------------------------------------------------------------
   1. THE MEMORY

   A few settings, then the one list this whole program is about.
   --------------------------------------------------------------------- */

const PORT = 4000;                          // the door number other programs knock on
const TOP_HOW_MANY = 10;                    // how many scores the board shows
const LONGEST_NAME = 12;                    // longer names are cut down to this
const BIGGEST_BODY = 4000;                  // a message longer than this is thrown away

/* Where the list is kept between runs. `__dirname` is the folder this
   file is in, so the server finds its list wherever you start it from. */
const SCORES_FILE = path.join(__dirname, 'scores.json');

/* Every score anybody has ever sent, in the order they arrived. The
   sorting happens when somebody asks for the list, not now. */
let scores = [];


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Three small functions. None of them knows anything about the network.
   They take values and hand values back, exactly like the functions in
   every project before this one.

   Each one gives you two hints. All the answers sit in one block at the
   very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * Hand back the scores in the right order for a scoreboard.
 *
 * Highest score at the top, and only the best TOP_HOW_MANY of them.
 *
 * `sort` puts a list in order. You give it a rule, and the rule is a
 * function that takes two of the things and says which goes first:
 *
 *     list.sort((a, b) => b.score - a.score);
 *
 * If that number comes out positive, `b` goes first. So this rule means
 * biggest first. Swap `a` and `b` and you get smallest first.
 *
 * `sort` changes the list it is given, which is not what you want here.
 * `slice()` with nothing in the brackets makes a copy first, so the
 * real list is left alone.
 *
 * `slice(0, TOP_HOW_MANY)` then takes the first ten of them. A list
 * with three scores in it is fine, and you get all three back.
 *
 * Hand back an array. The wiring checks that you did.
 *
 * Gentle hint: copy the list, put it in order, then take the first few.
 * Stronger hint: `return scores.slice().sort((a, b) => b.score - a.score).slice(0, TOP_HOW_MANY);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Start the server, open the page, and the board fills with the three
 * scores that came with this project.
 */
function sortedTop(scores) {
  // TODO: a copy, in order, cut down to the top ten.
}

/**
 * Is this really a score?
 *
 * The webpage sends us an object that should look like this:
 *
 *     { name: 'Simon', score: 24 }
 *
 * Should. Anything at all can arrive here. A different program, a typo,
 * somebody being funny with a score of one million, or nothing at all.
 * This is the first program of yours that strangers can talk to, and
 * that changes what you have to check.
 *
 * **Never trust what arrives.** It is the whole rule.
 *
 * So say `true` only when all of this is true:
 *
 *     it is an object, and it is not `null`
 *     `name` is a string with something in it
 *     `score` is a real number, and it is not below zero
 *
 * `typeof thing` tells you what something is: `'string'`, `'number'`,
 * `'object'`. `Number.isFinite(x)` is true only for a real number, so
 * it says no to text, to nothing at all, and to the strange value you
 * get when a sum goes wrong.
 *
 * `'   '.trim()` is `''`, so trimming first catches a name made only of
 * spaces.
 *
 * Hand back `true` or `false`, and nothing else.
 *
 * Gentle hint: give up early on each thing that is wrong, and `return
 *   true` at the end.
 * Stronger hint: `if (sent === null || typeof sent !== 'object') return false;`
 *   then one line for the name and one for the score.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The Line panel on the page stops saying stub. Empty the Name box on
 * the page and send a score: the answer comes back as refused, which
 * is this function saying no.
 */
function isGoodScore(sent) {
  // TODO: an object, a real name, a real number that is not negative.
}

/**
 * Put a new score on the list, and hand the board back.
 *
 * The wiring has already checked `sent` with your `isGoodScore`, so by
 * the time you get here it really is `{ name, score }`.
 *
 * Three jobs:
 *
 *     1. push a tidy copy of it onto `scores`
 *     2. `saveScores()`, which is in the wiring below
 *     3. hand back `sortedTop(scores)`, so whoever sent the score sees
 *        the new board straight away
 *
 * Tidy means two things. Trim the spaces off the name and cut it to
 * LONGEST_NAME, or somebody types a name a mile long and the board
 * falls apart. And `Math.round` the score, so it is a whole number.
 *
 * Store only what you need. `{ name: ..., score: ... }` and no more.
 * Never keep anything about a person that your program does not use.
 *
 * Gentle hint: push a tidy object, save, then hand back your own
 *   `sortedTop`.
 * Stronger hint: `scores.push({ name: sent.name.trim().slice(0, LONGEST_NAME), score: Math.round(sent.score) });`
 *   then `saveScores();` then `return sortedTop(scores);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Play a round and press Send. Your name appears on the board, and it
 * is still there after you stop the server and start it again.
 */
function addScore(sent) {
  // TODO: push a tidy copy, save the file, hand back the new board.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is finished. It reads and writes the file, listens for
   other programs, works out what they are asking for, and calls your
   three functions.

   Read it, because it shows you where your functions get used. Do not
   change it.
   --------------------------------------------------------------------- */

/* --- The file the list lives in --- */

/* Read the list off the disk when the server starts. It is JSON, the
   same as project 13's saved record, only in a file instead of in the
   browser's notebook. */
function loadScores() {
  try {
    const text = fs.readFileSync(SCORES_FILE, 'utf8');
    const got = JSON.parse(text);
    scores = Array.isArray(got) ? got : [];
  } catch (error) {
    /* No file yet, or a file we cannot read. Start with an empty list
       rather than falling over. */
    scores = [];
  }
}

/* Write the whole list back out. Your `addScore` calls this. */
function saveScores() {
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
}

/* --- Talking to the browser --- */

/* A browser will not let a page talk to a program on a different
   address unless that program says it is allowed. These three lines are
   how a server says yes.

   Your page is opened by double-clicking, so as far as the browser is
   concerned it comes from nowhere at all, and this server is somewhere
   else. Take these lines out and every request fails. */
function allowTheBrowser(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

/* Send an answer back as JSON. `status` is the code that says how it
   went: 200 means fine, 400 means you sent me rubbish, 404 means I do
   not know what you are asking for. */
function sendJson(response, status, thing) {
  const text = JSON.stringify(thing);
  allowTheBrowser(response);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(text)
  });
  response.end(text);
}

/* Gather up the message a browser sent us and turn it back into an
   object. It arrives in pieces, so we collect the pieces first.

   This hands back a promise, which is why the code that calls it says
   `await`. Reading from the network takes time, and nothing else can
   happen until it has finished. */
function readBody(request) {
  return new Promise((resolve) => {
    let text = '';
    request.on('data', (piece) => {
      text += piece;
      if (text.length > BIGGEST_BODY) {
        text = '';
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(text));
      } catch (error) {
        resolve(null);          // not JSON at all. Your isGoodScore says no to it.
      }
    });
    request.on('error', () => resolve(null));
  });
}

/* A line in the terminal for every request, so you can watch the two
   programs talking to each other. */
function log(request, status, note) {
  const method = request.method.padEnd(7, ' ');
  console.log(method + ' ' + request.url + '   ->   ' + status + '   ' + note);
}

/* --- The two questions this server answers --- */

/* GET /scores. Somebody wants the board. */
function handleGet(request, response) {
  const board = sortedTop(scores);

  /* An empty `sortedTop` hands back nothing, which is not a list. Say
     so plainly, so the page can name the function instead of showing an
     empty board and leaving you guessing. */
  if (!Array.isArray(board)) {
    sendJson(response, 200, { stub: 'sortedTop' });
    log(request, 200, 'sortedTop() is still empty');
    return;
  }

  sendJson(response, 200, { scores: board });
  log(request, 200, '(' + board.length + ' scores)');
}

/* POST /scores. Somebody has finished a round and wants on the board. */
async function handlePost(request, response) {
  const sent = await readBody(request);

  const verdict = isGoodScore(sent);
  if (verdict !== true && verdict !== false) {
    sendJson(response, 200, { stub: 'isGoodScore' });
    log(request, 200, 'isGoodScore() is still empty');
    return;
  }

  if (verdict === false) {
    sendJson(response, 400, { error: 'That does not look like a score.' });
    log(request, 400, 'refused');
    return;
  }

  const board = addScore(sent);
  if (!Array.isArray(board)) {
    sendJson(response, 200, { stub: 'addScore' });
    log(request, 200, 'addScore() is still empty');
    return;
  }

  sendJson(response, 200, { scores: board });
  log(request, 200, sent.name + ' ' + sent.score);
}

/* --- The server itself --- */

const server = http.createServer(async (request, response) => {
  /* The address can carry extra bits after a `?`. We only want the path. */
  const where = request.url.split('?')[0];

  /* Before a browser sends a real POST it sends a small question of its
     own: am I allowed? This is the yes. */
  if (request.method === 'OPTIONS') {
    allowTheBrowser(response);
    response.writeHead(204);
    response.end();
    return;
  }

  if (where === '/scores' && request.method === 'GET') {
    handleGet(request, response);
    return;
  }

  if (where === '/scores' && request.method === 'POST') {
    await handlePost(request, response);
    return;
  }

  sendJson(response, 404, { error: 'This server only knows about /scores.' });
  log(request, 404, 'no idea');
});

/* The address other computers on your wifi can use. `localhost` only
   works on this machine, so a second computer needs this one instead. */
function addressOnTheWifi() {
  const cards = os.networkInterfaces();
  for (const name of Object.keys(cards)) {
    for (const card of cards[name]) {
      if (card.family === 'IPv4' && !card.internal) return card.address;
    }
  }
  return null;
}

loadScores();

server.listen(PORT, () => {
  const wifi = addressOnTheWifi();
  console.log('');
  console.log('The score server is listening. It knows ' + scores.length + ' scores.');
  console.log('');
  console.log('  On this computer:  http://localhost:' + PORT);
  if (wifi !== null) {
    console.log('  On your wifi:      http://' + wifi + ':' + PORT);
  }
  console.log('');
  console.log('  GET  /scores   hand back the board');
  console.log('  POST /scores   put a new score on it');
  console.log('');
  console.log('Press Ctrl and C together to stop.');
  console.log('');
});


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the three functions in this file.

   The answers for the webpage are in scores.js, at the bottom of that
   file. One file never gives away the other.


   --- sortedTop(scores) ---

     return scores
       .slice()
       .sort((a, b) => b.score - a.score)
       .slice(0, TOP_HOW_MANY);


   --- isGoodScore(sent) ---

     if (sent === null || typeof sent !== 'object') return false;
     if (typeof sent.name !== 'string' || sent.name.trim() === '') return false;
     if (!Number.isFinite(sent.score) || sent.score < 0) return false;
     return true;


   --- addScore(sent) ---

     scores.push({
       name: sent.name.trim().slice(0, LONGEST_NAME),
       score: Math.round(sent.score)
     });
     saveScores();
     return sortedTop(scores);

   --------------------------------------------------------------------- */
