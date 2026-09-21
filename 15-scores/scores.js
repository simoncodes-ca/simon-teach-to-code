/* =====================================================================
   Star Catch, and the board everybody shares.

   The game is small on purpose. Stars fall into a meadow for thirty
   seconds, you catch them in a net, and gold ones are worth 1 while
   blue ones are worth 3. That is the whole game, and it is given to
   you finished.

   The project is the other half. When the round ends, your score goes
   to a second program called a server, and the server keeps one list
   for everybody. My scores and yours, on one board, from two
   computers. Nothing you have written before could do that, because
   everything you have written so far ran alone in one browser.

   Two programs, two files:

       server.js    the program in the terminal. It holds the list
       scores.js    this file. The webpage that talks to it

   Write the three functions in server.js first. This page has nothing
   to talk to until they exist.

   Then write these, in this order:
      1. getScores    ask the server for the board
      2. showScores   put the board on the page
      3. sendScore    send your own score to the server

   Before you start, open a terminal in this folder and run:

       node server.js

   Leave it running while you play.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   The address of the server first, then the numbers the game is made
   of, then the things that change while you play.
   --------------------------------------------------------------------- */

/* Where the server is. `localhost` means this computer, and 4000 is the
   door number server.js listens at.

   To play against somebody else, put their address in the Server box on
   the page instead. server.js prints the right one when it starts. */
const SERVER = 'http://localhost:4000';

const WIDTH = 1024;                // the window is always this wide, whatever size it looks
const HEIGHT = 768;                // and always this tall
const GROUND_Y = 640;              // the top of the grass

const NET_Y = 600;                 // the middle of the net, which never moves up or down
const NET_SPEED = 620;             // pixels a second, left or right
const MOUTH_HALF = 50;             // half the width of the opening at the top of the net
const RIM_UP = 20;                 // the rim sits this far above the middle of the net

const ROUND_SECONDS = 30;          // how long a round lasts

const SPAWN_START = 0.62;          // seconds between stars at the start of a round
const SPAWN_END = 0.34;            // and at the end of it
const FALL_START = 250;            // how fast a star falls at the start, in pixels a second
const FALL_END = 430;              // and at the end
const BLUE_CHANCE = 0.18;          // this much of the time, the next star is a blue one
const BLUE_SPEED = 1.3;            // and a blue one falls this much faster

const GOLD_WORTH = 1;
const BLUE_WORTH = 3;

const NAME_KEY = 'star-catch-name';      // your name, kept in this browser
const SERVER_KEY = 'star-catch-server';  // and the server address you last used

/* The net. x is the middle of it. */
const net = { x: WIDTH / 2 };

/* Every star in the air. Each one is

       { worth, x, y, vy, sprite }

   which is the same shape of object every moving thing has had since
   project 8. */
let stars = [];

let caught = 0;                    // your score this round
let missed = 0;                    // stars that reached the grass
let timeLeft = ROUND_SECONDS;      // seconds left in this round

/* The board, exactly as the server last gave it to us. Each score in it
   is `{ name, score }`. */
let board = [];


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Three small functions. All three are about talking to the server.

   Two of them are `async`, which is the new word in this project. An
   `async` function is one that is allowed to wait. Inside it you may
   write `await`, and `await` means: stop here, let the rest of the page
   carry on, and pick this up again when the answer arrives.

   Talking over a network takes time. A few thousandths of a second on
   your own computer, much longer over wifi. `await` is how you write
   that down without freezing the page while it happens.

   Each function gives you two hints. All the answers sit in one block
   at the very bottom of this file. The answers for the server are in
   server.js, at the bottom of that file.
   --------------------------------------------------------------------- */

/**
 * Ask the server for the board.
 *
 * `fetch` is how a page asks another program for something:
 *
 *     const response = await fetch('http://localhost:4000/scores');
 *
 * That is a GET, which means "hand me that, please". It is the same
 * thing the browser does when you open any page at all.
 *
 * `fetch` hands back a response, and the response is not the words yet.
 * It is an envelope. Opening it takes time too, so that is a second
 * `await`:
 *
 *     const answer = await response.json();
 *
 * `response.json()` is `JSON.parse` from project 13, done for you. The
 * server sends text, and this turns it back into an object.
 *
 * Use `whereTheServerIs()` for the address. It is in the wiring below,
 * and it reads the Server box on the page, so you never have to edit
 * this file to play against somebody else. The path is `/scores`.
 *
 * Hand back whatever the server said. The wiring looks inside it.
 *
 * Gentle hint: two lines, and both of them start with `await`.
 * Stronger hint: fetch the server's `/scores` path. Await the response,
 *   then await its `json()` result and return that object.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press Ask for the board. The Line panel lights up and the raw answer
 * appears under it, word for word as the server sent it. The board
 * itself stays empty, because drawing it is the next function.
 */
async function getScores() {
  // TODO: fetch the address, then open the envelope.
}

/**
 * Put the board on the page.
 *
 * `list` is an array of scores, best first, straight from the server:
 *
 *     [{ name: 'Anna', score: 21 }, { name: 'Dad', score: 17 }]
 *
 * This one has nothing to do with the network. It is the same job as
 * the calculator's display and hangman's row of letters: take what is
 * in memory, and make the page show it.
 *
 * Two things are already written for you in the wiring:
 *
 *     tableEl            the <ol> on the page that holds the rows
 *     makeRow(place, score)   makes one <li>, ready to go in
 *
 * So: empty the list out first, or every ask would add the board on
 * again underneath the old one. `tableEl.textContent = ''` clears it.
 *
 * Then walk the list and put a row in for each score. `place` is where
 * it came, so the first one is 1, not 0.
 *
 * An empty list needs a word of its own, or the panel just looks
 * broken. `sayNobodyHasPlayed()` is in the wiring for that.
 *
 * Gentle hint: clear it, deal with an empty list, then one row per
 *   score.
 * Stronger hint: clear `tableEl`. For each item, call `makeRow` with a
 *   one-based place and append the returned row.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The board fills with the three scores this project came with. That is
 * data that has travelled from another program into your page.
 */
function showScores(list) {
  // TODO: clear the old rows, then add one row per score.
}

/**
 * Send your score to the server.
 *
 * This one is a POST, which means "here is something, keep it". A GET
 * only asks. A POST carries.
 *
 * A POST needs three more things than a GET, and they go in an object
 * after the address:
 *
 *     method    'POST', because fetch does a GET unless you say
 *     headers   { 'Content-Type': 'application/json' }, which tells the
 *               server the message is JSON and not plain words
 *     body      the message itself, as text
 *
 * The body has to be text, exactly like `localStorage` in project 13.
 * So `JSON.stringify` again, on an object with the two things the
 * server wants:
 *
 *     JSON.stringify({ name: name, score: score })
 *
 * The answer comes back the same way as before: `await` the fetch, then
 * `await response.json()`. The server sends back the whole new board,
 * with you on it, so the page can show it straight away.
 *
 * Hand that answer back.
 *
 * Gentle hint: the same two lines as `getScores`, with an object of
 *   three things in the middle of the first one.
 * Stronger hint: fetch `/scores` with method `'POST'`. Set the JSON
 *   content type, stringify the name and score, then await the JSON reply.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Play a round and press Send my score. Your name arrives on the board,
 * the terminal running the server prints a line about you, and the
 * score is still there tomorrow, on any computer that asks.
 */
async function sendScore(name, score) {
  // TODO: POST the name and the score as JSON, then open the envelope.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is finished already. It runs the game, keeps the rack up to
   date, and calls your three functions.

   Read it, because it shows you where they get used. Do not change it.
   --------------------------------------------------------------------- */

const caughtReadEl = document.getElementById('caughtRead');
const clockReadEl = document.getElementById('clockRead');
const clockBoxEl = clockReadEl.parentElement;
const tableEl = document.getElementById('table');
const boardNoteEl = document.getElementById('boardNote');
const askLampEl = document.getElementById('askLamp');
const answerLampEl = document.getElementById('answerLamp');
const pulseEl = document.getElementById('pulse');
const askReadEl = document.getElementById('askRead');
const statusReadEl = document.getElementById('statusRead');
const rawReadEl = document.getElementById('rawRead');
const whoEl = document.getElementById('who');
const whereEl = document.getElementById('where');
const screenEl = document.getElementById('screen');
const startBtn = document.getElementById('start');
const sendBtn = document.getElementById('send');
const refreshBtn = document.getElementById('refresh');
const statusEl = document.getElementById('status');

/* The sounds. The same pattern as every project since the calculator:
   one Audio object per sound, made once and used again. */
const startSound = new Audio('assets/start.wav');
const catchSound = new Audio('assets/catch.wav');
const missSound = new Audio('assets/miss.wav');
const overSound = new Audio('assets/over.wav');
const sendSound = new Audio('assets/send.wav');
const backSound = new Audio('assets/back.wav');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

const DEMO = location.hash === '#demo' || location.hash === '#demo-over';

let scene = null;                  // the one scene, once Phaser has built it
let keys = null;                   // the arrow keys
let netSprite = null;
let groundBand = null;
let curtain = null;                // the card before and after a round
let phase = 'waiting';             // 'waiting', 'playing' or 'over'
let spawnClock = 0;                // counts down to the next star
let sent = false;                  // has this round's score gone to the server yet?
let busy = false;                  // true while we are waiting for the server
let message = '';

/* One flag per function you have to write. The wiring sets these as it
   finds out, and the line under the screen reads them. */
const missing = {
  getScores: false,
  showScores: false,
  sendScore: false
};

function say(text) {
  if (text === message) return;
  message = text;
  statusEl.textContent = text;
}

/* --- Small helpers --- */

/* The address to talk to. The Server box on the page wins, so a second
   computer only has to type an address rather than edit this file. */
function whereTheServerIs() {
  const typed = whereEl.value.trim();
  return typed === '' ? SERVER : typed.replace(/\/+$/, '');
}

/* The name to send. */
function whoIsPlaying() {
  const typed = whoEl.value.trim();
  return typed === '' ? 'Player' : typed;
}

/* One row of the board, ready to go on the page. Your `showScores`
   calls this. `place` is 1 for the winner. */
function makeRow(place, score) {
  const row = document.createElement('li');
  if (place === 1) row.classList.add('top');
  if (String(score.name) === whoIsPlaying()) row.classList.add('mine');

  const rank = document.createElement('span');
  rank.className = 'rank';
  rank.textContent = place;

  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = score.name;

  const points = document.createElement('span');
  points.className = 'score';
  points.textContent = score.score;

  row.appendChild(rank);
  row.appendChild(name);
  row.appendChild(points);
  return row;
}

/* The one row an empty board gets. Your `showScores` calls this. */
function sayNobodyHasPlayed() {
  tableEl.textContent = '';
  const row = document.createElement('li');
  row.className = 'empty';
  row.textContent = 'Nobody is on the board yet. Be first.';
  tableEl.appendChild(row);
}

function howFarThroughTheRound() {
  return 1 - timeLeft / ROUND_SECONDS;
}

/* --- Talking to the server ---

   Both jobs below have the same four steps: light the lamp, call your
   function, work out what came back, and tell the rack about it. */

function markAsked(what) {
  busy = true;
  askReadEl.textContent = what;
  askLampEl.className = 'lamp lamp-ask';
  answerLampEl.className = 'lamp';
  statusReadEl.textContent = '...';
  statusReadEl.className = '';
  runThePulse('there');
}

function markAnswered(words, good, raw, millis) {
  busy = false;
  askLampEl.className = 'lamp';
  answerLampEl.className = good ? 'lamp lamp-answer' : 'lamp lamp-bad';
  statusReadEl.textContent = words;
  statusReadEl.className = good ? 'good' : 'bad';
  rawReadEl.textContent = raw + '   (' + Math.round(millis) + ' ms)';
  runThePulse('back');
}

/* A blip of light running along the cable, so the two lamps are not the
   only sign that anything happened. */
function runThePulse(way) {
  pulseEl.className = '';
  void pulseEl.offsetWidth;
  pulseEl.className = way;
}

/* GET the board, then draw it. */
async function askForTheBoard() {
  if (busy) return;
  markAsked('GET /scores');
  const began = performance.now();

  let answer = null;
  try {
    answer = await getScores();
  } catch (error) {
    theServerIsNotThere(performance.now() - began);
    return;
  }

  if (answer === undefined) {
    missing.getScores = true;
    markAnswered('nothing', false, 'getScores() handed nothing back.', performance.now() - began);
    reportEmptyFunctions();
    return;
  }

  missing.getScores = false;
  useTheAnswer(answer, performance.now() - began);
}

/* POST this round's score, and draw the board that comes back. */
async function sendMyScore() {
  if (busy || sent) return;
  markAsked('POST /scores');
  playSound(sendSound);
  const began = performance.now();

  let answer = null;
  try {
    answer = await sendScore(whoIsPlaying(), caught);
  } catch (error) {
    theServerIsNotThere(performance.now() - began);
    return;
  }

  if (answer === undefined) {
    missing.sendScore = true;
    markAnswered('nothing', false, 'sendScore() handed nothing back.', performance.now() - began);
    reportEmptyFunctions();
    return;
  }

  missing.sendScore = false;
  if (useTheAnswer(answer, performance.now() - began)) {
    sent = true;
    sendBtn.disabled = true;
    playSound(backSound);
  }
}

/* What came back can be one of four things, and the rack says which. */
function useTheAnswer(answer, millis) {
  const raw = JSON.stringify(answer);

  /* The server says one of its own functions is still empty. */
  if (answer !== null && typeof answer === 'object' && typeof answer.stub === 'string') {
    markAnswered('stub', false, raw, millis);
    say('server.js ' + answer.stub + '() is still empty. Write it, then start the server again.');
    return false;
  }

  /* The server refused what we sent it. */
  if (answer !== null && typeof answer === 'object' && typeof answer.error === 'string') {
    markAnswered('refused', false, raw, millis);
    say('The server refused it: ' + answer.error);
    return false;
  }

  if (answer === null || !Array.isArray(answer.scores)) {
    markAnswered('odd', false, raw, millis);
    say('That answer had no scores in it. Look at the raw line on the rack.');
    return false;
  }

  board = answer.scores;
  markAnswered(board.length + (board.length === 1 ? ' score' : ' scores'), true, raw, millis);
  drawTheBoard();
  reportEmptyFunctions();
  return true;
}

function theServerIsNotThere(millis) {
  markAnswered('no answer', false, 'The line is dead.', millis);
  boardNoteEl.textContent = 'The server is not answering.';
  say('No answer from ' + whereTheServerIs() + '. Start the server: node server.js');
}

/* Hand the board to your `showScores`, then see whether anything
   arrived on the page. A function that draws nothing is the one thing
   the rack cannot work out for itself. */
function drawTheBoard() {
  showScores(board);

  /* Did any real rows arrive on the page? The one row that says nobody
     has played is not a score, so it does not count. */
  const rows = tableEl.querySelectorAll('li:not(.empty)').length;
  missing.showScores = board.length > 0 && rows === 0;

  if (missing.showScores) {
    boardNoteEl.textContent = 'The scores are here. Nothing is drawing them.';
    return;
  }
  boardNoteEl.textContent = board.length === 0
    ? 'The list is empty, and that is a real answer.'
    : 'Everybody who plays is on this one list.';
}

function reportEmptyFunctions() {
  if (missing.getScores) say('getScores() is still empty, so the page never asks the server anything.');
  else if (missing.showScores) say('showScores() is still empty, so the board arrives and nothing draws it.');
  else if (missing.sendScore) say('sendScore() is still empty, so your score never leaves this computer.');
  else if (phase === 'over' && !sent) say('You caught ' + caught + '. Press Send my score.');
  else if (phase === 'waiting') say('Press Enter to play. Thirty seconds.');
}

/* --- Setting Phaser up ---

   The same three functions as projects 9 to 14. `preload` fetches the
   pictures, `create` builds the scene once, and `update` runs every
   frame. */
new Phaser.Game({
  /* Both of these settings are here to keep the page double-clickable,
     and project 9 explains them. */
  type: Phaser.CANVAS,
  canvas: document.getElementById('screen'),
  width: WIDTH,
  height: HEIGHT,
  scene: { preload: preload, create: create, update: update },
  loader: { imageLoadType: 'HTMLImageElement' }
});

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/ground.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('star-big', 'assets/star-big.png');
  this.load.image('net', 'assets/net.png');
  this.load.image('sparkle', 'assets/sparkle.png');
}

function create() {
  scene = this;

  this.add.image(0, 0, 'sky').setOrigin(0, 0).setDepth(-30);
  groundBand = this.add.tileSprite(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y, 'ground')
    .setOrigin(0, 0).setDepth(-10);

  netSprite = this.add.image(net.x, NET_Y, 'net').setDepth(5);
  keys = this.input.keyboard.createCursorKeys();

  buildCurtain(this);
  rememberedName();
  resetRound();

  if (DEMO) {
    standInForYourFunctions();
    setUpDemo();
    return;
  }

  /* One ask, as soon as the page opens. If the server is running, the
     board is on the page before anybody touches anything. */
  askForTheBoard();
  say('Press Enter to play. Thirty seconds.');
}

/* One step of the game.

   Phaser hands you the time since the last frame, in milliseconds.
   Dividing by 1000 gives the `seconds` you have used since project 7. */
function update(time, delta) {
  const seconds = Math.min(delta / 1000, 0.05);

  if (phase === 'playing') {
    moveTheNet(seconds);
    spawnClock -= seconds;
    if (spawnClock <= 0) {
      dropAStar(this);
      spawnClock = SPAWN_START + (SPAWN_END - SPAWN_START) * howFarThroughTheRound();
    }
    moveTheStars(this, seconds);

    timeLeft -= seconds;
    if (timeLeft <= 0) {
      timeLeft = 0;
      endTheRound();
    }
  }

  netSprite.setPosition(net.x, NET_Y);
  updateRack();
}

/* The keys. A key is a state, so it is asked about on every frame. That
   is project 10's lesson, and it has not changed. */
function moveTheNet(seconds) {
  if (keys.left.isDown) net.x -= NET_SPEED * seconds;
  else if (keys.right.isDown) net.x += NET_SPEED * seconds;
  net.x = Phaser.Math.Clamp(net.x, MOUTH_HALF, WIDTH - MOUTH_HALF);
}

/* One more star, somewhere along the top. */
function dropAStar(aScene) {
  const blue = Math.random() < BLUE_CHANCE;
  const fall = FALL_START + (FALL_END - FALL_START) * howFarThroughTheRound();
  const star = {
    worth: blue ? BLUE_WORTH : GOLD_WORTH,
    x: 60 + Math.random() * (WIDTH - 120),
    y: -40,
    vy: blue ? fall * BLUE_SPEED : fall
  };
  star.sprite = aScene.add.image(star.x, star.y, blue ? 'star-big' : 'star').setDepth(2);
  stars.push(star);
}

/* Move them all, catch what lands in the net, and throw away what
   reaches the grass. The loop counts backwards, because it takes things
   out of the list, the same as every list since project 7. */
function moveTheStars(aScene, seconds) {
  const rimY = NET_Y - RIM_UP;

  for (let i = stars.length - 1; i >= 0; i -= 1) {
    const star = stars[i];
    star.y += star.vy * seconds;
    star.sprite.setPosition(star.x, star.y);
    star.sprite.rotation += seconds * 1.6;

    const inTheMouth = Math.abs(star.x - net.x) < MOUTH_HALF
      && star.y > rimY - 14 && star.y < rimY + 42;

    if (inTheMouth) {
      caught += star.worth;
      sparkle(aScene, star.x, rimY);
      playSound(catchSound);
      star.sprite.destroy();
      stars.splice(i, 1);
      continue;
    }

    if (star.y > HEIGHT + 40) {
      missed += 1;
      playSound(missSound);
      star.sprite.destroy();
      stars.splice(i, 1);
    }
  }
}

function sparkle(aScene, x, y) {
  const spark = aScene.add.image(x, y, 'sparkle').setDepth(6);
  aScene.tweens.add({
    targets: spark,
    scale: 2.2,
    alpha: 0,
    duration: 380,
    ease: 'Cubic.easeOut',
    onComplete: () => spark.destroy()
  });
}

/* --- A round --- */

function resetRound() {
  for (const star of stars) star.sprite.destroy();
  stars = [];
  net.x = WIDTH / 2;
  caught = 0;
  missed = 0;
  timeLeft = ROUND_SECONDS;
  spawnClock = 0.4;
  sent = false;
}

function startRound() {
  resetRound();
  phase = 'playing';
  playSound(startSound);
  updateCurtain();
  screenEl.focus();
  say('Left and right. Catch the blue ones.');
}

function endTheRound() {
  phase = 'over';
  for (const star of stars) star.sprite.destroy();
  stars = [];
  playSound(overSound);
  updateCurtain();
  say('You caught ' + caught + '. Press Send my score.');
}

/* --- The card over the screen --- */
function buildCurtain(aScene) {
  const display = "'Impact', 'Haettenschweiler', 'Trebuchet MS', sans-serif";
  const label = "'Trebuchet MS', sans-serif";
  const back = aScene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x0a1030, 0.72).setOrigin(0, 0);
  const title = aScene.add.text(WIDTH / 2, 280, '', {
    fontFamily: display, fontSize: '62px', color: '#f4dfa4'
  }).setOrigin(0.5);
  const lines = aScene.add.text(WIDTH / 2, 380, '', {
    fontFamily: label, fontSize: '26px', color: '#f6f1e4', align: 'center'
  }).setOrigin(0.5).setLineSpacing(14);
  const key = aScene.add.text(WIDTH / 2, 476, '', {
    fontFamily: label, fontSize: '26px', color: '#6fe3a6'
  }).setOrigin(0.5);

  curtain = {
    group: aScene.add.container(0, 0, [back, title, lines, key]).setDepth(20),
    title: title,
    lines: lines,
    key: key
  };
  updateCurtain();
}

function updateCurtain() {
  if (curtain === null) return;
  curtain.group.setVisible(phase !== 'playing');
  if (phase === 'waiting') {
    curtain.title.setText('STAR CATCH');
    curtain.lines.setText('Thirty seconds. Left and right to move the net.\nGold is worth 1. Blue is worth 3.');
    curtain.key.setText('Press Enter');
  } else if (phase === 'over') {
    curtain.title.setText('TIME');
    curtain.lines.setText(caught + ' caught · ' + missed + ' missed\nSend it to the board, and see where you came.');
    curtain.key.setText('Press Send my score');
  }
}

/* --- The rack down the side --- */
function updateRack() {
  caughtReadEl.textContent = caught;
  clockReadEl.textContent = Math.ceil(timeLeft);
  clockBoxEl.className = timeLeft <= 5 && phase === 'playing' ? 'plate-read plate-clock low' : 'plate-read plate-clock';

  startBtn.disabled = phase === 'playing';
  sendBtn.disabled = phase !== 'over' || sent || busy;
  refreshBtn.disabled = busy;
}

/* --- The keys and the boxes --- */

startBtn.addEventListener('click', startRound);
sendBtn.addEventListener('click', sendMyScore);
refreshBtn.addEventListener('click', askForTheBoard);

/* Your name and the server address are kept in this browser, so you
   type them once. That is project 13's `localStorage`, used for
   something small. */
function rememberedName() {
  try {
    whoEl.value = localStorage.getItem(NAME_KEY) || '';
    whereEl.value = localStorage.getItem(SERVER_KEY) || '';
  } catch (error) {
    /* A browser that refuses to save on a double-clicked page. The game
       works, the boxes just start empty every time. */
  }
}

function rememberThem() {
  try {
    localStorage.setItem(NAME_KEY, whoEl.value.trim());
    localStorage.setItem(SERVER_KEY, whereEl.value.trim());
  } catch (error) {
    /* Nothing to do. Nothing depends on it. */
  }
}

whoEl.addEventListener('change', rememberThem);
whereEl.addEventListener('change', () => {
  rememberThem();
  askForTheBoard();
});

document.addEventListener('keydown', (event) => {
  /* Enter starts a round, unless you are typing your name at the time. */
  const typing = event.target === whoEl || event.target === whereEl;
  if (event.code === 'Enter' && !typing && !startBtn.disabled) {
    event.preventDefault();
    startBtn.click();
  }
  /* The arrows move the net, so stop them scrolling the page as well. */
  if (!typing && (event.code === 'ArrowLeft' || event.code === 'ArrowRight')) {
    event.preventDefault();
  }
});

/* Typing #demo onto a page that is already open changes the address
   only. The script does not run again, so the page reloads itself. */
window.addEventListener('hashchange', () => location.reload());

/* --- The demos ---

   Add #demo or #demo-over to the end of the address in the browser and
   the page works properly, so you can see what you are building. The
   stand-ins below fill in whichever functions are still empty.

   A demo never talks to the real server, and never puts anything on the
   real board. It makes up a board of its own. */
function standInForYourFunctions() {
  const pretendBoard = [
    { name: 'Anna', score: 31 },
    { name: 'Simon', score: 27 },
    { name: 'Dad', score: 22 },
    { name: 'Nan', score: 14 },
    { name: 'Sam', score: 9 }
  ];

  getScores = async () => ({ scores: pretendBoard });
  sendScore = async (name, score) => {
    const withYou = pretendBoard.concat([{ name: name, score: score }]);
    withYou.sort((a, b) => b.score - a.score);
    return { scores: withYou };
  };
  showScores = (list) => {
    tableEl.textContent = '';
    if (list.length === 0) {
      sayNobodyHasPlayed();
      return;
    }
    for (let i = 0; i < list.length; i += 1) tableEl.appendChild(makeRow(i + 1, list[i]));
  };
}

async function setUpDemo() {
  whoEl.value = 'Simon';
  whereEl.value = SERVER;

  /* Wait for the made-up board before saying anything, or the answer
     arrives late and writes over the demo's own line. */
  await askForTheBoard();

  if (location.hash === '#demo-over') {
    caught = 27;
    missed = 6;
    timeLeft = 0;
    phase = 'over';
    updateCurtain();
    say('Demo: the end of a round, with a board to join.');
    return;
  }

  phase = 'waiting';
  updateCurtain();
  say('Demo: the finished page. Press Enter to play a round.');
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the three functions in this file.

   The answers for the server are in server.js, at the bottom of that
   file. One file never gives away the other.


   --- getScores() ---

     const response = await fetch(whereTheServerIs() + '/scores');
     return await response.json();


   --- showScores(list) ---

     tableEl.textContent = '';

     if (list.length === 0) {
       sayNobodyHasPlayed();
       return;
     }

     for (let i = 0; i < list.length; i += 1) {
       tableEl.appendChild(makeRow(i + 1, list[i]));
     }


   --- sendScore(name, score) ---

     const response = await fetch(whereTheServerIs() + '/scores', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ name: name, score: score })
     });
     return await response.json();

   --------------------------------------------------------------------- */
