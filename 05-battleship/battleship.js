/* =====================================================================
   Simon's Battleship — the game's brain.

   This file is a learning scaffold. The plotting table is built and the
   pegs know how to go into the board, but there is no sea to fire into
   until you fill in the TODO functions below.

   A good order to work in:
      1. makeGrid           — build a ten by ten grid
      2. cellName           — turn a row and a column into 'C7'
      3. shipCells          — which squares would a ship cover?
      4. canPlace           — would it actually fit there?
      5. placeShip          — put the ship on the sea
      6. placeFleetAtRandom — scatter a whole fleet
      7. fireAt             — fire one shot and say what happened
      8. isSunk             — has this ship lost all of its squares?
      9. allSunk            — has a whole fleet gone down?
     10. enemyChoice        — pick the enemy's next square
     11. handleEnemyShot    — the enemy's whole turn

   Each one you finish makes something new happen on the table.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   A grid is a list of rows, and each row is a list of squares. That is
   the whole idea of this project, and everything below is built on it.

       grid[row][col]

   Read that as two steps. grid[row] picks one row out of the list. Then
   [col] picks one square out of that row. Row first, column second, in
   that order, every time.

   A sea holds two grids of exactly that shape:

       sea.ships   what is floating here — a ship's name, or null
       sea.shots   what has been fired here — 'hit', 'miss', or ''

   Two grids, not one, because a square can hold a ship AND a shot at
   the same time. That is what a hit is.
   --------------------------------------------------------------------- */

const SIZE = 10;                     // ten rows and ten columns
const COLUMNS = 'ABCDEFGHIJ';        // the letter across the top of each column

/* The fleet. Each ship is an object with a name and a length, the same
   way a card was an object with a rank and a suit. 17 squares in all. */
const FLEET = [
  { name: 'Carrier',    length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Cruiser',    length: 3 },
  { name: 'Submarine',  length: 3 },
  { name: 'Destroyer',  length: 2 }
];

let enemySea = { ships: [], shots: [] };  // their ships, and the shots you fired
let yourSea  = { ships: [], shots: [] };  // your ships, and the shots they fired
let phase = 'placing';      // 'placing', 'yourTurn', 'enemyTurn' or 'finished'
let nextShip = 0;           // which ship in FLEET you are placing right now
let across = true;          // true lays a ship left to right, false top to bottom
let enemyAim = null;        // the square the enemy is about to fire at


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Eleven small functions. Fill them in from the top down. Each comment
   gives you two hints — read only as far as you need. The answers are
   in one block at the very bottom of this file, when you want them.
   --------------------------------------------------------------------- */

/**
 * Build one ten by ten grid, with the same value in every square.
 *
 * It hands back a list of SIZE rows, and each row is a list of SIZE
 * squares. So makeGrid('') gives a grid of 100 empty pieces of text,
 * and makeGrid(null) gives a grid of 100 nothings.
 *
 * Gentle hint: you are building a list of lists. The outer loop makes
 *   one row at a time. The inner loop fills that row before it is added.
 * Stronger hint: inside the outer loop, start with `const row = [];`
 *   then push `fill` into it SIZE times, then push `row` onto `rows`.
 *   Making the row inside the loop matters — one row made outside would
 *   be the same row ten times over, and changing one square would change
 *   a whole column.
 * Stuck? The answer key is at the bottom of this file.
 *
 * This is the first thing to write, because nothing else can happen
 * without it. Right now both charts are empty frames. Finish this and
 * two hundred squares appear, a hundred in each sea.
 */
function makeGrid(fill) {
  const rows = [];
  // TODO: add SIZE rows, each holding SIZE copies of `fill`.
  return rows;
}

/**
 * Turn a row number and a column number into the name of that square.
 *
 *   cellName(0, 0)   is 'A1'
 *   cellName(6, 2)   is 'C7'
 *   cellName(9, 9)   is 'J10'
 *
 * The letter comes from the column and the number comes from the row.
 * People count from 1, but a list counts from 0, so row 6 is called 7.
 *
 * Gentle hint: COLUMNS is a piece of text, and you can pick one letter
 *   out of it by position, exactly the way you pick one item out of a
 *   list. Row 0 has to come out as 1.
 * Stronger hint: joining text to a number with + turns the number into
 *   text, which is what you want here.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The brass plate at the top right shows the square under your cursor.
 * It says two dashes until this works. Move the mouse across a chart and
 * watch it read out A1, B1, C1 — that is this function, live.
 */
function cellName(row, col) {
  // TODO: return the letter for this column joined to the number for this row.
  return '';
}

/**
 * Work out which squares a ship would cover, and return them as a list.
 *
 * Each square in the list is a small object: { row: 3, col: 5 }. The
 * ship starts at the square you are given and runs `ship.length` squares
 * from there — to the right when `across` is true, downwards when it is
 * false.
 *
 * Do not check whether it fits. That is the very next function's job, so
 * this one is allowed to hand back squares that fall off the edge.
 *
 * Gentle hint: one loop that runs ship.length times. Each time round,
 *   one of row or col moves on by one and the other stays put.
 * Stronger hint: with `for (let i = 0; i < ship.length; i += 1)`, the
 *   square across is { row: row, col: col + i } and the square down is
 *   { row: row + i, col: col }.
 * Stuck? The answer key is at the bottom of this file.
 *
 * As soon as this works, move the mouse over your own chart. A ghost of
 * the ship follows the cursor, as long as the ship as you have it. It
 * will be red everywhere, because canPlace still says no to everything
 * — that is the next function, and the ghost turns green when you write
 * it. Press Rotate and the ghost turns to run downwards instead.
 */
function shipCells(ship, row, col, across) {
  const cells = [];
  // TODO: add one { row: ..., col: ... } for each square the ship covers.
  return cells;
}

/**
 * Could a ship really go on these squares? Return true or false.
 *
 * Two things have to be true of every square in the list:
 *   1. it is on the board at all, and
 *   2. nothing is floating there already.
 *
 * One bad square is enough to spoil the whole placement, so the answer
 * is only true if every single square passes.
 *
 * `isOnBoard(row, col)` is written for you in the wiring below. A square
 * is empty when `sea.ships[row][col]` is null.
 *
 * Gentle hint: walk the list. The moment you find a square that fails,
 *   you already know the answer and there is no reason to keep looking.
 * Stronger hint: return false from inside the loop, and true after it.
 *   Check isOnBoard first — asking sea.ships[12][3] about a row that
 *   does not exist is an error, not a false.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The ghost on your chart turns green where the ship fits and stays red
 * where it does not. Push a ship off the edge, or across one you have
 * already placed, and watch it go red.
 */
function canPlace(sea, cells) {
  // TODO: return true only if every square is on the board and empty.
  return false;
}

/**
 * Put a ship on the sea: write its name into every square it covers.
 *
 * This one changes the sea it is given instead of returning anything, so
 * there is no `return` at the end.
 *
 * Gentle hint: walk the list of squares and write into the ships grid at
 *   each one. The name of a ship is `ship.name`.
 * Stronger hint: `sea.ships[cell.row][cell.col] = ship.name;` — row
 *   first, then column, the same order every time.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The name, not the whole ship object. Storing the name keeps the grid
 * small enough to read in the console, and the wiring can look a ship up
 * by name whenever it needs the length.
 *
 * Now clicking your own chart actually lays a ship down in grey steel,
 * the roster moves on to the next one, and after five ships the battle
 * starts.
 */
function placeShip(sea, ship, cells) {
  // TODO: write ship.name into every square in `cells`.
}

/**
 * Scatter a whole fleet across a sea, at random.
 *
 * For each ship: pick a random row, a random column and a random
 * direction, ask canPlace whether it fits, and place it if it does. If
 * it does not, throw that guess away and pick again.
 *
 * Guessing until something works sounds wasteful, and for 17 squares on
 * a board of 100 it is completely fine. It is also far less code than
 * working out every legal position first.
 *
 * The loop that counts tries is already written, so a mistake somewhere
 * above cannot freeze the page. 400 tries is far more than this needs.
 *
 * Gentle hint: the random-number pattern is the one you shuffled the
 *   deck with in blackjack. For the direction you want true or false,
 *   which is a different question: Math.random() < 0.5.
 * Stronger hint: build the squares with shipCells, ask canPlace about
 *   them, and if the answer is yes call placeShip and set placed to true
 *   so the trying stops.
 * Stuck? The answer key is at the bottom of this file.
 *
 * This is also how the enemy fleet gets to sea, so until it works there
 * is nothing out there to sink. Press Scatter to watch it happen on your
 * own chart — five ships, in a different arrangement every time.
 */
function placeFleetAtRandom(sea) {
  for (const ship of FLEET) {
    let placed = false;
    for (let tries = 0; tries < 400 && !placed; tries += 1) {
      // TODO: pick a random square and direction. If the ship fits
      //       there, place it and set placed to true.
    }
  }
}

/**
 * Fire one shot into a sea. Return one of exactly three pieces of text:
 *   'hit'     there was a ship there
 *   'miss'    there was not
 *   'again'   that square has already been fired at
 *
 * The shot has to be recorded in `sea.shots` as well as reported, or the
 * peg never appears and the same square can be fired at for ever.
 *
 * The cases, in this order:
 *   1. this square already holds a shot   -> 'again', and change nothing
 *   2. no ship here                       -> write 'miss', return 'miss'
 *   3. otherwise                          -> write 'hit', return 'hit'
 *
 * Gentle hint: an untouched square holds '', an empty piece of text.
 *   A square with no ship holds null.
 * Stronger hint: `return` leaves the function at once, so each case is
 *   one or two lines and none of them needs an `else`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Order matters here the same way it did when blackjack settled a round.
 * Put the 'again' case second and a second shot at a hit square counts
 * as a fresh hit, and a three-square ship sinks to one lucky peg.
 *
 * This is the one you have been waiting for. Click enemy waters and a
 * peg goes in — white for a miss, red for a hit.
 */
function fireAt(sea, row, col) {
  // TODO: record the shot and return 'hit', 'miss' or 'again'.
  return '';
}

/**
 * Has this ship lost every one of its squares? Return true or false.
 *
 * Count the squares that hold this ship's name AND have been hit. The
 * ship is sunk when that count reaches `ship.length`.
 *
 * Gentle hint: you have to look at all 100 squares, so this is a loop
 *   inside a loop — the same shape as makeGrid.
 * Stronger hint: `sea.ships[row][col] === ship.name` and
 *   `sea.shots[row][col] === 'hit'` both have to be true of a square
 *   before you count it.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Counting is safer here than checking that no square is left unhit. A
 * ship that was never placed has no unhit squares either, so that
 * version would report a fleet that does not exist as sunk, and every
 * game would end on the first shot.
 *
 * When this works the roster crosses a ship off the moment it goes down,
 * the signal log says so, and your own sunk ships turn from grey steel
 * to burnt red.
 */
function isSunk(sea, ship) {
  let hits = 0;
  // TODO: count the hit squares belonging to this ship, then compare
  //       that count with ship.length.
  return false;
}

/**
 * Has a whole fleet gone down? Return true or false.
 *
 * Gentle hint: walk FLEET and ask isSunk about each ship. One ship still
 *   afloat is enough to make the answer false.
 * Stronger hint: this is the same shape as canPlace — return false from
 *   inside the loop, and true after it.
 * Stuck? The answer key is at the bottom of this file.
 *
 * This is what ends the game. Sink all five enemy ships and the plaque
 * comes up over the chart. Until you write it the game never finishes,
 * however many red pegs are in the board.
 */
function allSunk(sea) {
  // TODO: return whether every ship in FLEET is sunk in this sea.
  return false;
}

/**
 * Pick the enemy's next square, and return it as { row: ..., col: ... }.
 *
 * The enemy fires at random, but it is not allowed to waste a turn on a
 * square it has already fired at. So keep guessing until you find one
 * where `sea.shots[row][col]` is still ''.
 *
 * Return null if there is nowhere left. The last line does that already,
 * and the counted loop makes sure you reach it instead of spinning for
 * ever once the board is full.
 *
 * Gentle hint: the same random pattern as placeFleetAtRandom, but you
 *   are looking for an empty square instead of room for a ship.
 * Stronger hint: `return { row: row, col: col };` from inside the loop
 *   the moment you find one. Returning leaves the function, so there is
 *   nothing to keep track of.
 * Stuck? The answer key is at the bottom of this file.
 *
 * A real opponent would hunt around its last hit. This one does not, and
 * that is on purpose — a random enemy is one function, and it makes the
 * game work end to end. Making it clever is a good thing to try once
 * everything else runs.
 *
 * When this works a red ring appears on your chart the moment your turn
 * ends: the enemy has chosen, and the shell is on its way.
 */
function enemyChoice(sea) {
  for (let tries = 0; tries < 400; tries += 1) {
    // TODO: pick a random square, and return it if nothing has been
    //       fired there yet.
  }
  return null;
}

/**
 * The enemy's whole turn, which runs after the red ring has been showing
 * for a moment. `enemyAim` already holds the square it chose.
 *
 * Four jobs, in this order:
 *   1. Fire into yourSea at enemyAim.row and enemyAim.col, and keep what
 *      fireAt hands back.
 *   2. Report it: addShot('Enemy', yourSea, enemyAim.row, enemyAim.col,
 *      result) writes the log line, plays the sound, and announces any
 *      ship that has just gone down.
 *   3. If allSunk(yourSea) is true, set phase to 'finished' and call
 *      finish('enemy'). Stop there — the turn does not come back to you.
 *   4. Otherwise set phase back to 'yourTurn', clear enemyAim by setting
 *      it to null, and call render().
 *
 * Gentle hint: `takeShot`, in the wiring below, is your half of exactly
 *   this and is already written. Read it first — this is the same four
 *   jobs with the seas the other way round.
 * Stronger hint: `return` after finish('enemy') is what stops jobs 3 and
 *   4 both running. Without it the game ends and then hands you a turn.
 * Stuck? The answer key is at the bottom of this file.
 *
 * enemyChoice never picks a square twice, so this one never has to deal
 * with an 'again'.
 *
 * Notice you never switch a single button on or off. render() reads the
 * phase and works the buttons out, so setting phase is the only thing
 * you have to get right. This is the last function, and when it works
 * the game plays all the way to a winner.
 */
function handleEnemyShot() {
  // TODO: do the four jobs listed above.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is deliberately finished. It draws both charts, keeps the
   log, runs the enemy's turn on a timer, and starts each game. Read it —
   it shows how your eleven functions get used — but leave it alone.
   --------------------------------------------------------------------- */

let statusMessage = '';
let logLines = [];              // newest first
let hoverSide = '';             // which chart your cursor is on: 'home', 'target' or neither
let hoverRow = -1;              // the square your cursor is on, or -1
let hoverCol = -1;
let reportedSunk = [];          // ships already announced, so we say it once
let freshPeg = null;            // the one peg allowed to drop into place
let freshTimer = null;
let enemyTimer = null;

const targetGridEl = document.getElementById('targetGrid');
const homeGridEl = document.getElementById('homeGrid');
const targetColsEl = document.getElementById('targetCols');
const targetRowsEl = document.getElementById('targetRows');
const homeColsEl = document.getElementById('homeCols');
const homeRowsEl = document.getElementById('homeRows');
const bearingEl = document.getElementById('bearing');
const rosterEl = document.getElementById('roster');
const rosterTitleEl = document.getElementById('rosterTitle');
const logEl = document.getElementById('log');
const phaseEl = document.getElementById('phase');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const rotateBtn = document.getElementById('rotate');
const scatterBtn = document.getElementById('scatter');
const newGameBtn = document.getElementById('newGame');

const PHASE_LABELS = {
  placing: 'Placing your fleet',
  yourTurn: 'Your turn',
  enemyTurn: "Enemy's turn",
  finished: 'Game over'
};

/* The sounds. One Audio element is made for each, once, and reused. */
const placeSound = new Audio('assets/place.wav');
const splashSound = new Audio('assets/splash.wav');
const hitSound = new Audio('assets/hit.wav');
const sunkSound = new Audio('assets/sunk.wav');
const winSound = new Audio('assets/win.wav');
const loseSound = new Audio('assets/lose.wav');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* --- Small helpers your functions are meant to use --- */

/* Is this row and column inside the board at all? canPlace needs this. */
function isOnBoard(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

/* The ship object with this name, so the grid can store just the name. */
function shipByName(name) {
  for (const ship of FLEET) {
    if (ship.name === name) return ship;
  }
  return null;
}

/* Is this square one of the ones in the list? Used to draw the ghost. */
function inCells(cells, row, col) {
  for (const cell of cells) {
    if (cell.row === row && cell.col === col) return true;
  }
  return false;
}

/* How many squares of this sea hold a ship. A full fleet is 17. */
function fleetSize(sea) {
  let count = 0;
  for (let row = 0; row < sea.ships.length; row += 1) {
    for (let col = 0; col < sea.ships[row].length; col += 1) {
      if (sea.ships[row][col] !== null) count += 1;
    }
  }
  return count;
}

function fleetIsPlaced(sea) {
  let squares = 0;
  for (const ship of FLEET) squares += ship.length;
  return fleetSize(sea) === squares;
}

/* --- Painting the table --- */

function render() {
  renderBoard(targetGridEl, enemySea, false);
  renderBoard(homeGridEl, yourSea, true);
  renderBearing();
  renderRoster();
  renderLog();
  renderPhase();
  renderStatus();
  renderActions();
}

function renderBoard(el, sea, showShips) {
  el.textContent = '';
  const side = showShips ? 'home' : 'target';
  const firing = !showShips && phase === 'yourTurn';
  const laying = showShips && phase === 'placing';
  el.classList.toggle('live', firing || laying);

  // The ghost of the ship you are about to lay down.
  let ghost = [];
  let ghostFits = false;
  // Only the chart the cursor is actually on gets a ghost. Both charts
  // share one hovered square, so without this the ship would follow a
  // cursor that was away over in enemy waters.
  if (laying && hoverSide === side && hoverRow >= 0 && nextShip < FLEET.length) {
    ghost = shipCells(FLEET[nextShip], hoverRow, hoverCol, across);
    ghostFits = ghost.length > 0 && canPlace(sea, ghost);
  }

  for (let row = 0; row < sea.shots.length; row += 1) {
    for (let col = 0; col < sea.shots[row].length; col += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.disabled = !firing && !laying;

      const name = sea.ships[row] ? sea.ships[row][col] : null;
      const mark = sea.shots[row][col];
      let says = cellName(row, col) || (row + 1) + ' across, ' + (col + 1) + ' down';

      // Your own ships are visible. Theirs are not, and that is the game.
      if (showShips && name) {
        cell.classList.add('ship');
        says = says + ', ' + name;
        if (isSunk(sea, shipByName(name))) {
          cell.classList.add('dead');
          says = says + ' sunk';
        }
      }
      if (mark === 'hit') { cell.classList.add('hit'); says = says + ', hit'; }
      if (mark === 'miss') { cell.classList.add('miss'); says = says + ', miss'; }
      if (freshPeg && freshPeg.side === side && freshPeg.row === row && freshPeg.col === col) {
        cell.classList.add('fresh');
      }
      if (inCells(ghost, row, col)) cell.classList.add(ghostFits ? 'ghost-ok' : 'ghost-bad');
      if (showShips && enemyAim && enemyAim.row === row && enemyAim.col === col) {
        cell.classList.add('aim');
      }

      cell.setAttribute('aria-label', says);
      cell.addEventListener('click', () => {
        if (firing) takeShot(row, col);
        if (laying) handlePlace(row, col);
      });
      cell.addEventListener('mouseenter', () => setHover(side, row, col));
      el.appendChild(cell);
    }
  }
}

function setHover(side, row, col) {
  if (hoverSide === side && hoverRow === row && hoverCol === col) return;
  hoverSide = side;
  hoverRow = row;
  hoverCol = col;
  render();
}

/* Written once at the bottom of this file, not on every render — the
   letters and numbers around a chart never change. */
function renderLabels() {
  const fill = (el, texts) => {
    el.textContent = '';
    for (const text of texts) {
      const span = document.createElement('span');
      span.textContent = text;
      el.appendChild(span);
    }
  };
  const letters = [];
  const numbers = [];
  for (let i = 0; i < SIZE; i += 1) {
    letters.push(COLUMNS[i]);
    numbers.push(String(i + 1));
  }
  fill(targetColsEl, letters);
  fill(homeColsEl, letters);
  fill(targetRowsEl, numbers);
  fill(homeRowsEl, numbers);
}

/* The brass plate: your cellName, read out loud. */
function renderBearing() {
  const name = hoverRow >= 0 ? cellName(hoverRow, hoverCol) : '';
  bearingEl.textContent = name || '——';
}

/* While you are placing, the roster is your fleet and the next ship is
   lit. Once the battle starts it becomes the enemy fleet, and the only
   thing it can honestly tell you is which ships have gone down. */
function renderRoster() {
  const battle = phase !== 'placing';
  rosterTitleEl.textContent = battle ? 'Enemy fleet' : 'Ships to place';
  rosterEl.textContent = '';
  FLEET.forEach((ship, index) => {
    const li = document.createElement('li');
    if (battle) {
      if (isSunk(enemySea, ship)) li.classList.add('gone');
    } else if (index === nextShip) {
      li.classList.add('next');
    } else if (index < nextShip) {
      li.classList.add('done');
    }
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = ship.name;
    const hull = document.createElement('span');
    hull.className = 'hull';
    for (let i = 0; i < ship.length; i += 1) hull.appendChild(document.createElement('i'));
    li.append(name, hull);
    rosterEl.appendChild(li);
  });
}

function renderLog() {
  logEl.textContent = '';
  logLines.slice(0, 6).forEach((line) => {
    const li = document.createElement('li');
    if (line.kind) li.className = line.kind;
    li.textContent = line.text;
    logEl.appendChild(li);
  });
}

function renderPhase() {
  phaseEl.textContent = '';
  const label = document.createElement('span');
  label.textContent = 'phase';
  const value = document.createElement('b');
  value.textContent = PHASE_LABELS[phase] || phase;
  phaseEl.append(label, value);
}

function renderStatus() {
  statusEl.textContent = statusMessage;
  statusEl.classList.toggle('bad', statusMessage.startsWith('Fill in'));
}

function renderActions() {
  rotateBtn.disabled = phase !== 'placing';
  scatterBtn.disabled = phase !== 'placing';
}

/* Every render builds all 200 squares again, and moving the mouse
   renders — so a peg that animated whenever it was drawn would jump
   about under the cursor. Instead one peg is marked as just-fired, and
   only that one drops into place. The mark clears itself a moment later,
   which is long enough for the animation and short enough that a render
   in between cannot cut it off. */
function dropPeg(side, row, col) {
  clearTimeout(freshTimer);
  freshPeg = { side: side, row: row, col: col };
  freshTimer = setTimeout(() => { freshPeg = null; }, 300);
}

function addLog(text, kind) {
  logLines.unshift({ text: text, kind: kind || '' });
}

/* One shot, written into the log and played out loud, then any ship that
   has just gone down is announced — once, however many times we ask. */
function addShot(who, sea, row, col, result) {
  const where = cellName(row, col) || 'a square';
  dropPeg(who === 'You' ? 'target' : 'home', row, col);
  if (result === 'hit') {
    addLog(who + ' fired at ' + where + ' — HIT', 'hit');
    playSound(hitSound);
  } else {
    addLog(who + ' fired at ' + where + ' — miss', '');
    playSound(splashSound);
  }
  for (const ship of FLEET) {
    const key = who + ':' + ship.name;
    if (reportedSunk.indexOf(key) === -1 && isSunk(sea, ship)) {
      reportedSunk.push(key);
      addLog((who === 'You' ? 'Enemy ' : 'Your ') + ship.name + ' SUNK', 'sunk');
      playSound(sunkSound);
    }
  }
}

/* --- Playing a game --- */

/* Laying one ship down, when you click your own chart. */
function handlePlace(row, col) {
  if (nextShip >= FLEET.length) return;
  const ship = FLEET[nextShip];
  const cells = shipCells(ship, row, col, across);
  if (cells.length === 0) {
    statusMessage = 'Fill in shipCells() so a ship knows which squares it covers.';
    render();
    return;
  }
  if (!canPlace(yourSea, cells)) {
    statusMessage = 'The ' + ship.name + ' will not fit there. Try another square, or press R to rotate it.';
    render();
    return;
  }
  placeShip(yourSea, ship, cells);
  if (yourSea.ships[cells[0].row][cells[0].col] !== ship.name) {
    statusMessage = 'Fill in placeShip() so the ship stays where you put it.';
    render();
    return;
  }
  playSound(placeSound);
  nextShip += 1;
  if (nextShip >= FLEET.length) {
    startBattle();
    return;
  }
  statusMessage = 'Now place your ' + FLEET[nextShip].name + '. Press R to turn it.';
  render();
}

function scatterYourFleet() {
  yourSea.ships = makeGrid(null);
  placeFleetAtRandom(yourSea);
  if (!fleetIsPlaced(yourSea)) {
    statusMessage = 'Fill in placeFleetAtRandom() to scatter your fleet.';
    nextShip = 0;
    render();
    return;
  }
  playSound(placeSound);
  nextShip = FLEET.length;
  startBattle();
}

function startBattle() {
  enemySea.ships = makeGrid(null);
  placeFleetAtRandom(enemySea);
  phase = 'yourTurn';
  hoverSide = '';
  hoverRow = -1;
  hoverCol = -1;
  if (fleetIsPlaced(enemySea)) {
    addLog('Battle stations. Enemy fleet is at sea.', 'sunk');
    statusMessage = 'Click a square in enemy waters to fire.';
  } else {
    statusMessage = 'Fill in placeFleetAtRandom() so the enemy has a fleet to sink.';
  }
  render();
}

/* Your half of a turn, written out as an example. handleEnemyShot is the
   same four jobs with the two seas the other way round. */
function takeShot(row, col) {
  const result = fireAt(enemySea, row, col);
  if (result === 'again') {
    statusMessage = 'You have already fired at ' + cellName(row, col) + '.';
    render();
    return;
  }
  if (result !== 'hit' && result !== 'miss') {
    statusMessage = 'Fill in fireAt() so your shots land.';
    render();
    return;
  }
  addShot('You', enemySea, row, col, result);
  if (allSunk(enemySea)) {
    phase = 'finished';
    finish('you');
    return;
  }
  phase = 'enemyTurn';
  statusMessage = '';
  render();
  runEnemyTurn();
}

/* The enemy chooses first, so the red ring can show for a moment before
   the shell lands, then handleEnemyShot fires it. */
function runEnemyTurn() {
  clearTimeout(enemyTimer);
  enemyAim = enemyChoice(yourSea);
  if (!enemyAim) {
    statusMessage = 'Fill in enemyChoice() so the enemy can pick a square.';
    phase = 'yourTurn';
    render();
    return;
  }
  statusMessage = 'Enemy is aiming at ' + (cellName(enemyAim.row, enemyAim.col) || 'you') + '…';
  render();
  enemyTimer = setTimeout(() => {
    if (phase !== 'enemyTurn') return;
    handleEnemyShot();
    if (phase === 'enemyTurn') {
      // handleEnemyShot has not been written yet, so the turn is handed
      // back rather than left hanging.
      statusMessage = 'Fill in handleEnemyShot() so the enemy can fire.';
      phase = 'yourTurn';
      enemyAim = null;
      render();
    }
  }, 850);
}

function finish(winner) {
  clearTimeout(enemyTimer);
  enemyAim = null;
  if (winner === 'you') {
    resultEl.textContent = 'Enemy fleet sunk — you win';
    resultEl.className = 't-result win';
    playSound(winSound);
  } else {
    resultEl.textContent = 'Your fleet is gone — you lose';
    resultEl.className = 't-result lose';
    playSound(loseSound);
  }
  resultEl.hidden = false;
  statusMessage = 'Press New game to play again.';
  render();
}

function newGame() {
  clearTimeout(enemyTimer);
  enemySea = { ships: makeGrid(null), shots: makeGrid('') };
  yourSea = { ships: makeGrid(null), shots: makeGrid('') };
  phase = 'placing';
  nextShip = 0;
  across = true;
  enemyAim = null;
  hoverSide = '';
  hoverRow = -1;
  hoverCol = -1;
  logLines = [];
  reportedSunk = [];
  clearTimeout(freshTimer);
  freshPeg = null;
  resultEl.hidden = true;

  if (yourSea.shots.length !== SIZE) {
    statusMessage = 'Fill in makeGrid() in battleship.js to draw the charts!';
  } else {
    addLog('New game. Place your fleet.', '');
    statusMessage = 'Place your ' + FLEET[0].name + '. Rotate — or the R key — turns it, Scatter places them all.';
  }
  render();
}

/* The arrows matter: they look your function up at the moment of the
   click, so a button keeps working however you choose to write it. */
rotateBtn.addEventListener('click', () => { across = !across; render(); });
scatterBtn.addEventListener('click', () => scatterYourFleet());
newGameBtn.addEventListener('click', () => newGame());

/* R also rotates, because a hand on the mouse does not want to travel. */
document.addEventListener('keydown', (event) => {
  if (event.key === 'r' || event.key === 'R') {
    if (phase === 'placing') { across = !across; render(); }
  }
});

/* Leaving a chart clears the bearing plate and the ghost. */
targetGridEl.addEventListener('mouseleave', () => setHover('', -1, -1));
homeGridEl.addEventListener('mouseleave', () => setHover('', -1, -1));

/* Typing a #demo hash onto an already-open page only changes the address;
   the script does not run again. Reloading makes the demos work whether
   you edit the address bar or open the link fresh. */
window.addEventListener('hashchange', () => location.reload());

renderLabels();

/* Demo states keep the finished look inspectable before the stubs are
   filled in. The picture is drawn by nearly every function in this file,
   so the demo needs working ones — these stand-ins are for the picture
   only, never for the game. */
if (['#demo', '#demo-placing', '#demo-win', '#demo-lose'].includes(location.hash)) {
  if (makeGrid(0).length !== SIZE) {
    makeGrid = (fill) => {
      const rows = [];
      for (let r = 0; r < SIZE; r += 1) {
        const row = [];
        for (let c = 0; c < SIZE; c += 1) row.push(fill);
        rows.push(row);
      }
      return rows;
    };
  }
  if (cellName(6, 2) !== 'C7') cellName = (row, col) => COLUMNS[col] + (row + 1);
  if (shipCells(FLEET[2], 0, 0, true).length !== 3) {
    shipCells = (ship, row, col, going) => {
      const cells = [];
      for (let i = 0; i < ship.length; i += 1) {
        cells.push(going ? { row: row, col: col + i } : { row: row + i, col: col });
      }
      return cells;
    };
  }
  const emptySea = { ships: makeGrid(null), shots: makeGrid('') };
  if (canPlace(emptySea, shipCells(FLEET[0], 0, 0, true)) !== true) {
    canPlace = (sea, cells) => {
      for (const cell of cells) {
        if (!isOnBoard(cell.row, cell.col)) return false;
        if (sea.ships[cell.row][cell.col] !== null) return false;
      }
      return true;
    };
  }
  placeShip(emptySea, FLEET[0], shipCells(FLEET[0], 0, 0, true));
  if (emptySea.ships[0][0] !== FLEET[0].name) {
    placeShip = (sea, ship, cells) => {
      for (const cell of cells) sea.ships[cell.row][cell.col] = ship.name;
    };
  }
  const scatterSea = { ships: makeGrid(null), shots: makeGrid('') };
  placeFleetAtRandom(scatterSea);
  if (!fleetIsPlaced(scatterSea)) {
    placeFleetAtRandom = (sea) => {
      for (const ship of FLEET) {
        let placed = false;
        for (let tries = 0; tries < 400 && !placed; tries += 1) {
          const row = Math.floor(Math.random() * SIZE);
          const col = Math.floor(Math.random() * SIZE);
          const going = Math.random() < 0.5;
          const cells = shipCells(ship, row, col, going);
          if (canPlace(sea, cells)) { placeShip(sea, ship, cells); placed = true; }
        }
      }
    };
  }
  const shotSea = { ships: makeGrid(null), shots: makeGrid('') };
  if (fireAt(shotSea, 0, 0) !== 'miss' || fireAt(shotSea, 0, 0) !== 'again') {
    fireAt = (sea, row, col) => {
      if (sea.shots[row][col] !== '') return 'again';
      if (sea.ships[row][col] === null) { sea.shots[row][col] = 'miss'; return 'miss'; }
      sea.shots[row][col] = 'hit';
      return 'hit';
    };
  }
  const sunkSea = { ships: makeGrid(null), shots: makeGrid('') };
  placeShip(sunkSea, FLEET[4], shipCells(FLEET[4], 0, 0, true));
  fireAt(sunkSea, 0, 0);
  fireAt(sunkSea, 0, 1);
  if (isSunk(sunkSea, FLEET[4]) !== true) {
    isSunk = (sea, ship) => {
      let hits = 0;
      for (let row = 0; row < SIZE; row += 1) {
        for (let col = 0; col < SIZE; col += 1) {
          if (sea.ships[row][col] === ship.name && sea.shots[row][col] === 'hit') hits += 1;
        }
      }
      return hits === ship.length;
    };
  }

  // A game a few turns in, so every part of the table has something in it.
  enemySea = { ships: makeGrid(null), shots: makeGrid('') };
  yourSea = { ships: makeGrid(null), shots: makeGrid('') };
  placeFleetAtRandom(enemySea);
  placeFleetAtRandom(yourSea);
  logLines = [];
  reportedSunk = [];
  phase = 'yourTurn';
  nextShip = FLEET.length;

  const demoShots = (sea, who, count) => {
    for (let i = 0; i < count; i += 1) {
      const pick = enemyChoiceDemo(sea);
      if (!pick) return;
      const result = fireAt(sea, pick.row, pick.col);
      addShot(who, sea, pick.row, pick.col, result);
    }
  };
  const enemyChoiceDemo = (sea) => {
    for (let tries = 0; tries < 400; tries += 1) {
      const row = Math.floor(Math.random() * SIZE);
      const col = Math.floor(Math.random() * SIZE);
      if (sea.shots[row][col] === '') return { row: row, col: col };
    }
    return null;
  };

  if (location.hash === '#demo') {
    demoShots(enemySea, 'You', 16);
    demoShots(yourSea, 'Enemy', 15);
    statusMessage = 'Click a square in enemy waters to fire.';
  }
  if (location.hash === '#demo-placing') {
    yourSea = { ships: makeGrid(null), shots: makeGrid('') };
    placeShip(yourSea, FLEET[0], shipCells(FLEET[0], 1, 2, true));
    placeShip(yourSea, FLEET[1], shipCells(FLEET[1], 5, 6, false));
    phase = 'placing';
    nextShip = 2;
    hoverSide = 'home';
    hoverRow = 7;
    hoverCol = 1;
    logLines = [];
    addLog('New game. Place your fleet.', '');
    statusMessage = 'Now place your ' + FLEET[2].name + '. Press R to turn it.';
  }
  if (location.hash === '#demo-win' || location.hash === '#demo-lose') {
    const loser = location.hash === '#demo-win' ? enemySea : yourSea;
    const who = location.hash === '#demo-win' ? 'You' : 'Enemy';
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        if (loser.ships[row][col] !== null) {
          const result = fireAt(loser, row, col);
          addShot(who, loser, row, col, result);
        }
      }
    }
    demoShots(location.hash === '#demo-win' ? yourSea : enemySea, who === 'You' ? 'Enemy' : 'You', 14);
    phase = 'finished';
    resultEl.textContent = location.hash === '#demo-win'
      ? 'Enemy fleet sunk — you win'
      : 'Your fleet is gone — you lose';
    resultEl.className = location.hash === '#demo-win' ? 't-result win' : 't-result lose';
    resultEl.hidden = false;
    statusMessage = 'Press New game to play again.';
  }
  render();
} else {
  newGame();
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   Only worth reading once you have tried. Each block is one function,
   in the same order as the TODOs above.


   --- makeGrid(fill) ---

     for (let row = 0; row < SIZE; row += 1) {
       const cells = [];
       for (let col = 0; col < SIZE; col += 1) {
         cells.push(fill);
       }
       rows.push(cells);
     }


   --- cellName(row, col) ---

     return COLUMNS[col] + (row + 1);


   --- shipCells(ship, row, col, across) ---

     for (let i = 0; i < ship.length; i += 1) {
       if (across) {
         cells.push({ row: row, col: col + i });
       } else {
         cells.push({ row: row + i, col: col });
       }
     }


   --- canPlace(sea, cells) ---

     for (const cell of cells) {
       if (!isOnBoard(cell.row, cell.col)) return false;
       if (sea.ships[cell.row][cell.col] !== null) return false;
     }
     return true;


   --- placeShip(sea, ship, cells) ---

     for (const cell of cells) {
       sea.ships[cell.row][cell.col] = ship.name;
     }


   --- placeFleetAtRandom(sea) ---

     (inside the tries loop)
     const row = Math.floor(Math.random() * SIZE);
     const col = Math.floor(Math.random() * SIZE);
     const going = Math.random() < 0.5;
     const cells = shipCells(ship, row, col, going);
     if (canPlace(sea, cells)) {
       placeShip(sea, ship, cells);
       placed = true;
     }


   --- fireAt(sea, row, col) ---

     if (sea.shots[row][col] !== '') return 'again';
     if (sea.ships[row][col] === null) {
       sea.shots[row][col] = 'miss';
       return 'miss';
     }
     sea.shots[row][col] = 'hit';
     return 'hit';


   --- isSunk(sea, ship) ---

     for (let row = 0; row < SIZE; row += 1) {
       for (let col = 0; col < SIZE; col += 1) {
         if (sea.ships[row][col] === ship.name && sea.shots[row][col] === 'hit') {
           hits = hits + 1;
         }
       }
     }
     return hits === ship.length;


   --- allSunk(sea) ---

     for (const ship of FLEET) {
       if (!isSunk(sea, ship)) return false;
     }
     return true;


   --- enemyChoice(sea) ---

     (inside the tries loop)
     const row = Math.floor(Math.random() * SIZE);
     const col = Math.floor(Math.random() * SIZE);
     if (sea.shots[row][col] === '') {
       return { row: row, col: col };
     }


   --- handleEnemyShot() ---

     const result = fireAt(yourSea, enemyAim.row, enemyAim.col);
     addShot('Enemy', yourSea, enemyAim.row, enemyAim.col, result);
     if (allSunk(yourSea)) {
       phase = 'finished';
       finish('enemy');
       return;
     }
     phase = 'yourTurn';
     enemyAim = null;
     render();

   --------------------------------------------------------------------- */
