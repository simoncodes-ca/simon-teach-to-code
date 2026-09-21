/* =====================================================================
   The Cheese Vault — the first game with a map you can read.

   You are a mouse inside a bank vault. The vault is full of cheese
   crumbs. Cats live in it. Eat every crumb and the next vault opens.

   Every game so far had a sky. Anything could be anywhere in it, and
   nothing was ever in the way. This one has walls, and walls change
   everything.

   The new idea is that **the map is data**. The vault is not a picture.
   It is a list of rows, and every row is a line of characters:

       '################'
       '#@.#.####.####.#'

   A '#' is a wall. A '.' is a crumb. A space is bare floor. That is the
   whole vault. The walls you see are built from those characters, the
   cats ask them before they turn, and eating a crumb changes one of
   them from '.' to ' '.

   Because the map is data, the game can ask it questions. Is that cell
   a wall? Which ways lead out of here? Is there any cheese left? None
   of those questions could be asked of a picture.

   Write the functions in this order:
      1. middleOf      — a column and a row, turned into a spot
      2. cellAt        — a spot, turned back into a column and a row
      3. buildVault    — read the map, and build what it says
      4. isWall        — ask the map about one cell
      5. steerMouse    — the arrow keys pick a way to go
      6. startStep     — may we go that way? Then aim at the next cell
      7. moveThing     — slide along until we arrive
      8. eatCheese     — eat the crumb you are standing on
      9. chooseCatWay  — a cat picks its next turning

   Each one changes something you can see. Do them in order and watch
   the vault arrive, one piece at a time.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   The numbers first, then the maps, then the handful of things that
   change while the game runs.

   One number matters more than the rest. TILE is 64, and every cell in
   the vault is 64 pixels square. That single number is what lets the
   game turn a spot on the screen into a cell on the map, and back
   again.
   --------------------------------------------------------------------- */

const WIDTH = 1024;              // the window is always this wide, whatever size it looks
const HEIGHT = 768;              // and always this tall
const TILE = 64;                 // one cell of the map is this many pixels across
const COLS = 16;                 // how many cells fit across the vault
const ROWS = 12;                 // and how many fit down it

const MOUSE_SPEED = 200;         // how fast you run, in pixels per second
const CAT_SPEED = 120;           // how fast a cat prowls
const CAT_EXTRA = 16;            // and how much faster the cats get each level
const CAUGHT_GAP = 34;           // this close to a cat and it has you

const CRUMB_POINTS = 1;          // one point a crumb
const VAULT_POINTS = 10;         // ten for emptying a whole vault
const START_LIVES = 3;           // how many lives you get

/* The four ways you can go from any cell. Nothing else is allowed:
   a mouse in this game never moves diagonally. */
const WAYS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 }
];

/* The three vaults, drawn as rows of characters.

      #  a wall
      .  a crumb of cheese
      @  where the mouse starts
      C  where a cat starts

   The '@' and the 'C' are only there so a person can read the map. The
   given wiring takes them out when it loads a level and leaves plain
   floor behind, so by the time your functions see the map it holds
   nothing but '#', '.' and ' '. */
const LEVELS = [
  [
    '################',
    '#....#....#....#',
    '#.##.#.##.#.##.#',
    '#.#..........#.#',
    '#.#.####.###.#.#',
    '#......C#......#',
    '#.####.###.###.#',
    '#....#.....#...#',
    '#.##.#.###.#.#.#',
    '#.#........#...#',
    '#@.#.####.####.#',
    '################'
  ],
  [
    '################',
    '#........#.....#',
    '#.######.#.###.#',
    '#.#....#.#...#.#',
    '#.#.##.#.###.#.#',
    '#...##C....#.#.#',
    '#.#######.##.#.#',
    '#.#.....#......#',
    '#.#.###.#.####.#',
    '#.#.#C#...#....#',
    '#@....#####.##.#',
    '################'
  ],
  [
    '################',
    '#...#.....#....#',
    '#.#.#.###.#.##.#',
    '#.#.#...#....#.#',
    '#.#.###.####...#',
    '#.#...C...#..#.#',
    '#.###.###.#.##.#',
    '#...#..C#.#....#',
    '###.#.##.#.###.#',
    '#...#....#...C.#',
    '#@.##.###...##.#',
    '################'
  ]
];

/* The map of the level being played. One list per row, and one
   character per cell, so `grid[row][col]` is one cell of the vault.
   That is battleship's sea again, with characters instead of ships. */
let grid = null;

let walls = null;                // the group of wall blocks
let crumbs = null;               // the group of cheese crumbs

/* Everything that moves in this game is one of these:

       {
         sprite,          the picture on the screen
         wantX, wantY,    the way it would like to go next
         goX, goY,        the way it is going right now. 0 and 0 means still
         toCol, toRow,    the cell it is sliding towards
         speed            pixels per second
       }

   The mouse is one. Every cat is one. They are the same shape of
   object on purpose, so one `startStep` and one `moveThing` move all
   of them. That is project 8's lesson, back again. */
let mouse = null;
let cats = [];

let score = 0;                   // one point a crumb, ten a vault
let lives = START_LIVES;         // lives left
let level = 1;                   // which of the three vaults is open


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Nine small functions, top to bottom.

   Each one gives you two hints. Read the gentle one first. All the
   answers sit in one block at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * Turn a column and a row into a spot on the screen.
 *
 * The map thinks in cells. Cell 3,5 means the fourth column and the
 * sixth row, and it has no idea what a pixel is. The screen thinks in
 * pixels and has no idea what a cell is. This function is the bridge
 * between the two, and almost everything below uses it.
 *
 * A cell is TILE pixels wide and TILE pixels tall. So the left edge of
 * column 3 is at 3 * TILE. But a sprite sits at its middle, not at its
 * corner, so add another half a tile to land in the centre.
 *
 * Hand back an object with an x and a y in it, like this:
 *
 *     { x: 224, y: 352 }
 *
 * Gentle hint: the left edge is `col * TILE`, and the middle is half a
 *   tile further along.
 * Stronger hint: return an object. Add half a tile to each multiplied
 *   coordinate.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press Start. The mouse stops hiding in the top corner and appears in
 * its own square, and the Middle readout on the rack starts working.
 */
function middleOf(col, row) {
  // TODO: cells in, pixels out.
}

/**
 * Turn a spot on the screen back into a column and a row.
 *
 * This is `middleOf` run backwards, and it is the question the game
 * asks most often: which cell am I standing in?
 *
 * If a cell is TILE pixels wide, then x divided by TILE says how many
 * cells along you are. That division gives you something like 3.7,
 * and there is no such column as 3.7. `Math.floor` throws the bit
 * after the dot away and leaves the column you are really in.
 *
 * Hand back an object with a col and a row in it:
 *
 *     { col: 3, row: 5 }
 *
 * Gentle hint: divide by TILE, then round down.
 * Stronger hint: make both properties the floored result of dividing
 *   the matching pixel coordinate by `TILE`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The Cell readout on the rack starts counting as you move, and it
 * changes the moment you cross a line on the floor.
 */
function cellAt(x, y) {
  // TODO: pixels in, cells out.
}

/**
 * Read the map, and build what it says.
 *
 * `grid` holds the level: 12 rows, 16 characters each. Walk every cell
 * of it with a loop inside a loop, the way battleship built its sea,
 * and look at the character you find:
 *
 *     '#'    make a wall block there
 *     '.'    make a crumb of cheese there
 *     ' '    bare floor. Make nothing
 *
 * `grid[row][col]` is the character at that cell.
 *
 * The two groups are made for you: `walls` and `crumbs`. A group makes
 * a sprite and keeps it, exactly as in projects 9 and 10:
 *
 *     walls.create(x, y, 'wall');
 *     crumbs.create(x, y, 'crumb');
 *
 * Those want pixels, and the map speaks in cells, so this is the first
 * function that leans on `middleOf`.
 *
 * Gentle hint: one loop for the rows, one loop inside it for the
 *   columns, and an `if` for each of the two characters.
 * Stronger hint: find the pixel middle for each cell. Test the character
 *   before creating either a wall or a crumb sprite.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The empty floor fills up with steel blocks and cheese. This is the
 * moment the map stops being text and becomes a place.
 */
function buildVault(scene) {
  // TODO: 12 rows, 16 columns, and a block or a crumb for each.
}

/**
 * Is that cell a wall?
 *
 * Two things count as a wall, and the second one catches people out.
 *
 * The first is easy: the cell holds a '#'.
 *
 * The second is the edge of the map. Ask about column 16 and
 * `grid[row][16]` is `undefined`, because the row only has columns 0
 * to 15. A cell that is not on the map at all has to count as a wall,
 * or the mouse walks out of the vault and off the screen.
 *
 * So check the four edges first, and only then look the cell up.
 *
 * Hand back true or false. Nothing else in the file will need to know
 * how you decided.
 *
 * Gentle hint: one `if` for anything off the map, then one line that
 *   compares the character with '#'.
 * Stronger hint: return true for a column or row outside its limit.
 *   Otherwise compare the map character with `'#'`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The four ways out light up on the rack: green for a way you can go,
 * red for a wall. Nothing moves yet, but the game can finally see.
 */
function isWall(col, row) {
  // TODO: off the map, or a '#'. Both are walls.
}

/**
 * Read the arrow keys, and remember the way they are asking for.
 *
 * Keys work exactly as they did in project 10. A key is a state, so
 * you ask about it every frame:
 *
 *     keys.left.isDown       true while the left arrow is held
 *     keys.up.isDown         true while the up arrow is held
 *
 * This function does not move anybody. All it does is set two numbers
 * on the mouse, and each one is -1, 0 or 1:
 *
 *     left     mouse.wantX = -1    mouse.wantY = 0
 *     right    mouse.wantX = 1     mouse.wantY = 0
 *     up       mouse.wantX = 0     mouse.wantY = -1
 *     down     mouse.wantX = 0     mouse.wantY = 1
 *
 * y grows downwards on a screen, which is why up is -1.
 *
 * There is no `else` here, and that is on purpose. Project 10 needed
 * one, because a ship that is told nothing keeps flying. This mouse
 * keeps running the way it was already going until a wall stops it,
 * which is what makes the game playable with one thumb.
 *
 * Gentle hint: four `if`s, or an `if` and three `else if`s. Two lines
 *   inside each.
 * Stronger hint: for each arrow, set one wanted direction to `-1` or
 *   `1` and set the other direction to `0`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Hold an arrow. The mouse still does not move, but the gold square on
 * the floor jumps to the cell you are asking for.
 */
function steerMouse(keys) {
  // TODO: which way is being asked for?
}

/**
 * Start one step, if the map allows it.
 *
 * This is the heart of the project. It is where the map stops being
 * scenery and starts being a rule.
 *
 * A thing is either sliding between two cells or standing still. It
 * may only start a new step when it is standing still, so the first
 * job is to leave if it is already on its way. `thing.goX` and
 * `thing.goY` are both 0 when it is still.
 *
 * Then work out the cell it wants to move into. That is the cell it is
 * standing in, plus the way it wants to go:
 *
 *     const here = cellAt(thing.sprite.x, thing.sprite.y);
 *     here.col + thing.wantX      the column it is asking for
 *     here.row + thing.wantY      and the row
 *
 * Now ask the map. If `isWall` says yes, leave without doing anything,
 * and the thing simply stays where it is. That one `if` is every wall
 * in the game.
 *
 * If it is not a wall, remember the cell being aimed at, and copy the
 * wanted way into the way it is really going:
 *
 *     thing.toCol   thing.toRow      the cell it is heading for
 *     thing.goX     thing.goY        the way it is going now
 *
 * `thing` is the mouse when you steer, and a cat when a cat turns. One
 * function, both of them, because they are the same shape of object.
 *
 * Gentle hint: three guards that `return` early, then four lines that
 *   set the step up.
 * Stronger hint: guard while moving, guard with no wanted direction,
 *   then guard when the next cell is a wall.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The gold square stops jumping into walls. It only ever lands on a
 * cell the mouse is really allowed to enter.
 */
function startStep(thing) {
  // TODO: still? Wants to go somewhere? Not a wall? Then aim at it.
}

/**
 * Slide a thing towards the cell it is aiming at.
 *
 * Nothing here knows about the map. `startStep` already decided the
 * step was allowed. This function only carries it out, and it moves by
 * time, the way everything has since project 7:
 *
 *     const step = thing.speed * seconds;
 *
 * Leave straight away if the thing is standing still.
 *
 * Otherwise work out where it is going, in pixels:
 *
 *     const target = middleOf(thing.toCol, thing.toRow);
 *
 * Then there are two cases, and the first one is what keeps the game
 * tidy. If this step would carry it the rest of the way, put it
 * exactly on the middle of the cell and stop it. Exactly, not nearly:
 * every cell the mouse ever stands in has to line up with the grid, or
 * a hundred small errors add up until it walks through a corner.
 *
 *     Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y)
 *
 * gives you the gap between two spots. If that gap is `step` or less,
 * you have arrived: set x and y from `target`, set `goX` and `goY`
 * back to 0, and leave.
 *
 * Otherwise it is a plain move, one step in the direction it is going.
 *
 * Gentle hint: an `if` for arriving, and an `else` for still going.
 * Stronger hint: compare the remaining distance with `step`. Snap both
 *   coordinates and clear both movement values when it fits.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The mouse runs. It stops dead at walls, turns cleanly at junctions,
 * and never ends up half in a square.
 */
function moveThing(thing, seconds) {
  // TODO: arrive, or keep sliding.
}

/**
 * Eat the crumb you are standing on, if there is one.
 *
 * This runs every frame and almost always does nothing, so it starts
 * with a guard, the same shape as `nextWave` in project 10.
 *
 * Find the cell the mouse is in. If that cell is not a '.', there is
 * nothing to eat, so leave.
 *
 * If there is a crumb, three things have to happen, and the first is
 * the one that matters:
 *
 *   1. Change the map. `grid[row][col] = ' ';` The cell is now bare
 *      floor, and it stays that way for the rest of the level.
 *   2. Take the picture away. `crumbAt(col, row)` finds the crumb
 *      sprite in that cell, or hands back null if there is none.
 *      `crumb.destroy()` removes it.
 *   3. Call `nibble()`, which is given. It scores the point and makes
 *      the sound.
 *
 * Step 1 is the lesson of this whole project. The map is not a picture
 * of the level. It is the level, and a game that changes what happens
 * changes the map first. Everything else is a consequence: the counter
 * on the rack, the bar filling up, the level ending. All of them
 * simply count what the map says.
 *
 * Gentle hint: a guard, then one line for the map, one for the sprite,
 *   and one for the point.
 * Stronger hint: return unless the cell has `'.'`. Replace that map
 *   character with a space, destroy its crumb, then call `nibble()`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Crumbs vanish as you run over them, the score climbs, and the
 * emptied bar on the rack starts to fill.
 */
function eatCheese() {
  // TODO: standing on cheese? Then eat it, and change the map.
}

/**
 * Pick the way a cat turns next.
 *
 * The wiring calls this whenever a cat arrives in a cell and has to
 * decide what to do. Hand back one of the four ways, and the cat's own
 * `startStep` and `moveThing` do the rest. The cat runs on the code
 * you have already written.
 *
 * `waysOut(col, row)` is given, and it hands you a list of the ways
 * that are not walls. It is built out of your `isWall`, so a cat can
 * only ever see what your map function tells it.
 *
 * A cat that picks any of those at random turns round on the spot
 * every few seconds, which looks silly and is far too easy to escape.
 * So throw away the way it has just come from, unless that leaves it
 * with nothing, which is what happens in a dead end.
 *
 * The way it came from is the opposite of the way it went last:
 *
 *     way.x === -cat.wantX && way.y === -cat.wantY
 *
 * Then pick one of the ways that are left, at random. Blackjack's line
 * for picking a card out of a list works here without a change:
 *
 *     list[Math.floor(Math.random() * list.length)]
 *
 * Gentle hint: get the list, build a shorter list without the way
 *   back, and pick one of those.
 * Stronger hint: use a `for` loop and `push` to build the shorter
 *   list, then `if (shorter.length === 0) shorter = ways;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * The cats start prowling. They pick their way through the same walls
 * you do, and now the vault is a game rather than a maze.
 */
function chooseCatWay(cat) {
  // TODO: the ways out, minus the way back, then one at random.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is finished already. It sets Phaser up, loads the
   pictures, loads a level, reads the keys, runs the clock, and keeps
   the rack up to date.

   Read it, because it shows you where your nine functions get used.
   Do not change it.
   --------------------------------------------------------------------- */

const scoreReadEl = document.getElementById('scoreRead');
const levelReadEl = document.getElementById('levelRead');
const livesEl = document.getElementById('lives');
const cellReadEl = document.getElementById('cellRead');
const pixelReadEl = document.getElementById('pixelRead');
const wayEls = {
  up: document.getElementById('wayUp'),
  down: document.getElementById('wayDown'),
  left: document.getElementById('wayLeft'),
  right: document.getElementById('wayRight')
};
const cheeseLeftEl = document.getElementById('cheeseLeft');
const wallCountEl = document.getElementById('wallCount');
const catCountEl = document.getElementById('catCount');
const clearBarEl = document.getElementById('clearBar');
const screenEl = document.getElementById('screen');
const startBtn = document.getElementById('start');
const againBtn = document.getElementById('again');
const statusEl = document.getElementById('status');

/* The sounds. The same pattern as every project since the calculator:
   one Audio object per sound, made once and used again. */
const nibbleSound = new Audio('assets/nibble.wav');
const caughtSound = new Audio('assets/caught.wav');
const levelSound = new Audio('assets/level.wav');
const startSound = new Audio('assets/start.wav');
const overSound = new Audio('assets/over.wav');

function playSound(sound) {
  if (probing) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* Things the game needs that are not part of the game itself. */
const DEMO = location.hash === '#demo' || location.hash === '#demo-over';
let scene = null;               // the one scene, once Phaser has built it
let keys = null;                // the four arrow keys
let aim = null;                 // the gold square on the cell you are heading for
let curtain = null;             // the card before, between and after games
let levelCard = null;           // the LEVEL 2 flash in the middle of the window
let phase = 'waiting';          // 'waiting', 'playing', 'paused' or 'over'
let cheeseAtStart = 1;          // how many crumbs this level began with
let probing = false;            // true only while the demo is testing your functions
let message = '';

/* One flag per function you have to write. The wiring sets these as it
   goes, and the line under the window reads them. */
const missing = {
  middleOf: false,
  cellAt: false,
  buildVault: false,
  isWall: false,
  steerMouse: false,
  startStep: false,
  moveThing: false,
  eatCheese: false,
  chooseCatWay: false
};

function say(text) {
  if (text === message) return;
  message = text;
  statusEl.textContent = text;
}

/* --- Small helpers your functions can use --- */

/* Which ways lead out of this cell? Built from your `isWall`, and used
   by the cats. */
function waysOut(col, row) {
  const found = [];
  for (const way of WAYS) {
    if (isWall(col + way.x, row + way.y) !== true) found.push(way);
  }
  return found;
}

/* The crumb sprite sitting in one cell, or null if that cell is bare. */
function crumbAt(col, row) {
  for (const crumb of crumbs.getChildren()) {
    if (Math.floor(crumb.x / TILE) === col && Math.floor(crumb.y / TILE) === row) return crumb;
  }
  return null;
}

/* One crumb eaten: the point and the sound. `eatCheese` calls this
   once it has changed the map. */
function nibble() {
  score += CRUMB_POINTS;
  playSound(nibbleSound);
}

/* How much cheese is left in the vault? Counted from the map itself,
   never from a number kept beside it. The map is the truth. */
function countCheese() {
  let found = 0;
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (grid[row][col] === '.') found += 1;
    }
  }
  return found;
}

/* --- Checks the status line uses ---

   These ask whether a function handed back the shape of answer it was
   asked for. An empty function hands back nothing at all. */
function isPoint(thing) {
  return thing !== null && typeof thing === 'object'
    && typeof thing.x === 'number' && typeof thing.y === 'number';
}

function isCell(thing) {
  return thing !== null && typeof thing === 'object'
    && typeof thing.col === 'number' && typeof thing.row === 'number';
}

function isWay(thing) {
  return isPoint(thing) && (thing.x !== 0 || thing.y !== 0);
}

/* The character under a thing, worked out here rather than through
   your `cellAt`, so the checks below stay honest. */
function charUnder(thing) {
  const col = Math.floor(thing.sprite.x / TILE);
  const row = Math.floor(thing.sprite.y / TILE);
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return '#';
  return grid[row][col];
}

/* --- Setting Phaser up ---

   The same three functions as projects 9 and 10. `preload` fetches the
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

/* All the pictures. Nothing moves by itself in this game, so there is
   no physics here at all: the mouse and the cats are moved by your own
   `moveThing`, a pixel at a time. */
function preload() {
  this.load.image('vault', 'assets/vault.png');
  this.load.image('wall', 'assets/wall.png');
  this.load.image('crumb', 'assets/crumb.png');
  this.load.image('mouse', 'assets/mouse.png');
  this.load.image('cat', 'assets/cat.png');
}

function create() {
  scene = this;

  this.add.image(0, 0, 'vault').setOrigin(0, 0).setDepth(-10);

  walls = this.add.group();
  crumbs = this.add.group();

  /* The gold square that shows the cell the mouse is heading for. It
     is here so that `startStep` has something to show before
     `moveThing` exists. */
  aim = this.add.rectangle(0, 0, TILE - 8, TILE - 8)
    .setStrokeStyle(3, 0xffc93c, 0.85)
    .setDepth(3)
    .setVisible(false);

  keys = this.input.keyboard.createCursorKeys();

  levelCard = this.add.text(WIDTH / 2, HEIGHT / 2, '', {
    fontFamily: "'Impact', 'Haettenschweiler', 'Trebuchet MS', sans-serif",
    fontSize: '72px',
    color: '#ffc93c'
  }).setOrigin(0.5).setDepth(15).setVisible(false);

  /* The demo fills in the three map functions before the level is
     loaded, because everything else in the file needs them. */
  if (DEMO) standInForTheMap();

  loadLevel(this, 1);
  buildCurtain(this);

  if (DEMO) setUpDemo(this);
  else say('Press Enter. The mouse is hiding in the corner until middleOf() puts it somewhere.');
}

/* One step of the game.

   Phaser hands you the time since the last frame, in milliseconds.
   Dividing by 1000 gives the `seconds` you have used since project 7. */
function update(time, delta) {
  const seconds = delta / 1000;

  updateRack();

  if (phase !== 'playing') {
    aim.setVisible(false);
    return;
  }

  checkTheMapFunctions();

  /* The keys, every frame, because a key can change at any moment. */
  steerMouse(keys);
  if (anyArrowDown()) {
    missing.steerMouse = mouse.wantX === 0 && mouse.wantY === 0;
  }

  /* One step, if the map allows it. Checked only when the mouse is
     standing still and asking for a cell that is not a wall. */
  const wasStill = mouse.goX === 0 && mouse.goY === 0;
  const wanting = mouse.wantX !== 0 || mouse.wantY !== 0;
  startStep(mouse);
  if (wasStill && wanting && !missing.cellAt && !missing.isWall) {
    const here = cellAt(mouse.sprite.x, mouse.sprite.y);
    const free = isWall(here.col + mouse.wantX, here.row + mouse.wantY) !== true;
    missing.startStep = free && mouse.goX === 0 && mouse.goY === 0;
  }

  /* The sliding, which knows nothing about walls. */
  const wasX = mouse.sprite.x;
  const wasY = mouse.sprite.y;
  moveThing(mouse, seconds);
  if (mouse.goX !== 0 || mouse.goY !== 0) {
    missing.moveThing = mouse.sprite.x === wasX && mouse.sprite.y === wasY;
  }

  /* The crumb underfoot. */
  const wasUnder = charUnder(mouse);
  eatCheese();
  if (wasUnder === '.') missing.eatCheese = charUnder(mouse) === '.';

  moveCats(seconds);
  showAim();
  catchCheck();
  clearedCheck(this);

  /* Only while the game is still running. A game that has just ended
     has its own line to say, and this would talk over it. */
  if (phase === 'playing') reportEmptyFunctions();
}

/* Every cat, every frame. A cat that has arrived somewhere picks its
   next turning, and then it steps and slides through your own two
   functions. */
function moveCats(seconds) {
  for (const cat of cats) {
    if (cat.goX === 0 && cat.goY === 0) {
      const way = chooseCatWay(cat);
      missing.chooseCatWay = !isWay(way);
      if (isWay(way)) {
        cat.wantX = way.x;
        cat.wantY = way.y;
      }
    }
    startStep(cat);
    moveThing(cat, seconds);
  }
}

/* Is any arrow key held down right now? */
function anyArrowDown() {
  return keys.left.isDown || keys.right.isDown || keys.up.isDown || keys.down.isDown;
}

/* The three functions that read the map are asked one question each,
   with an answer that cannot be argued with. */
function checkTheMapFunctions() {
  missing.middleOf = !isPoint(middleOf(1, 1));
  missing.cellAt = !isCell(cellAt(TILE + 4, TILE + 4));
  missing.isWall = isWall(0, 0) !== true;
}

/* The gold square, on the cell the mouse is heading for. */
function showAim() {
  const heading = mouse.goX !== 0 || mouse.goY !== 0;
  const spot = heading ? middleOf(mouse.toCol, mouse.toRow) : null;
  if (!isPoint(spot)) {
    aim.setVisible(false);
    return;
  }
  aim.setPosition(spot.x, spot.y);
  aim.setVisible(true);
}

/* --- Loading a level ---

   The map is turned into a grid of characters here, and the '@' and
   the 'C' are read out and taken away. Your functions never see them. */
function loadLevel(aScene, which) {
  walls.clear(true, true);
  crumbs.clear(true, true);
  for (const cat of cats) cat.sprite.destroy();
  cats = [];

  const lines = LEVELS[which - 1];
  const catCells = [];
  let start = { col: 1, row: ROWS - 2 };

  grid = [];
  for (let row = 0; row < ROWS; row += 1) {
    const line = lines[row].split('');
    for (let col = 0; col < COLS; col += 1) {
      if (line[col] === '@') {
        start = { col: col, row: row };
        line[col] = ' ';
      }
      if (line[col] === 'C') {
        catCells.push({ col: col, row: row });
        line[col] = ' ';
      }
    }
    grid.push(line);
  }

  buildVault(aScene);
  missing.buildVault = walls.getLength() === 0;
  if (DEMO && missing.buildVault) {
    standInForBuildVault(aScene);
    missing.buildVault = false;
  }

  cheeseAtStart = Math.max(1, countCheese());

  if (mouse === null) mouse = makeThing(aScene, 'mouse', start.col, start.row, MOUSE_SPEED);
  else placeThing(mouse, start.col, start.row);
  mouse.startCol = start.col;
  mouse.startRow = start.row;

  for (const cell of catCells) {
    const cat = makeThing(aScene, 'cat', cell.col, cell.row, CAT_SPEED + (level - 1) * CAT_EXTRA);
    cats.push(cat);
  }
}

/* One moving thing: the picture, plus the six numbers that say where
   it is going. */
function makeThing(aScene, key, col, row, speed) {
  const spot = middleOf(col, row);
  const thing = {
    sprite: aScene.add.image(0, 0, key).setDepth(4),
    wantX: 0,
    wantY: 0,
    goX: 0,
    goY: 0,
    toCol: col,
    toRow: row,
    speed: speed,
    startCol: col,
    startRow: row
  };
  thing.sprite.setPosition(isPoint(spot) ? spot.x : 32, isPoint(spot) ? spot.y : 32);
  return thing;
}

/* Put a thing back on a cell, standing still. */
function placeThing(thing, col, row) {
  const spot = middleOf(col, row);
  thing.sprite.setPosition(isPoint(spot) ? spot.x : 32, isPoint(spot) ? spot.y : 32);
  thing.wantX = 0;
  thing.wantY = 0;
  thing.goX = 0;
  thing.goY = 0;
  thing.toCol = col;
  thing.toRow = row;
}

/* --- What happens when things touch --- */

/* A cat close enough counts as caught. The mouse is left alone while
   it is flashing back in. */
function catchCheck() {
  if (mouse.sprite.alpha < 1) return;
  for (const cat of cats) {
    const gap = Phaser.Math.Distance.Between(mouse.sprite.x, mouse.sprite.y, cat.sprite.x, cat.sprite.y);
    if (gap < CAUGHT_GAP) {
      loseLife(scene);
      return;
    }
  }
}

/* One life gone. Project 10 made you write this one, so this file
   gives it to you. The eaten cheese stays eaten. */
function loseLife(aScene) {
  lives -= 1;
  playSound(caughtSound);
  if (lives <= 0) {
    gameOver(false);
    return;
  }
  backToTheStart(aScene);
}

/* Everybody back to their own starting cell, and the mouse flashes for
   a moment so a cat standing on the spot cannot take a second life. */
function backToTheStart(aScene) {
  placeThing(mouse, mouse.startCol, mouse.startRow);
  for (const cat of cats) placeThing(cat, cat.startCol, cat.startRow);
  mouse.sprite.setAlpha(0.35);
  aScene.tweens.add({
    targets: mouse.sprite,
    alpha: 1,
    duration: 1200,
    ease: 'Linear'
  });
}

/* An empty vault opens the next one. Counted from the map, so an
   `eatCheese` that only hides the picture never gets here. */
function clearedCheck(aScene) {
  if (countCheese() > 0) return;
  score += VAULT_POINTS;
  level += 1;
  if (level > LEVELS.length) {
    gameOver(true);
    return;
  }
  playSound(levelSound);
  loadLevel(aScene, level);
  showLevelCard(aScene);
}

function showLevelCard(aScene) {
  levelCard.setText('LEVEL ' + level);
  levelCard.setAlpha(1);
  levelCard.setVisible(true);
  aScene.tweens.add({
    targets: levelCard,
    alpha: 0,
    duration: 1100,
    onComplete: () => levelCard.setVisible(false)
  });
}

function gameOver(cleared) {
  phase = 'over';
  playSound(cleared ? levelSound : overSound);
  say(cleared ? 'Every vault emptied. Press Play again.' : 'The cats got you. Press Play again.');
  updateCurtain(cleared);
}

function reportEmptyFunctions() {
  if (missing.middleOf) say('middleOf() is still empty, so nothing knows where a cell sits.');
  else if (missing.cellAt) say('cellAt() is still empty, so nothing knows which cell you are in.');
  else if (missing.buildVault) say('buildVault() is still empty, so the map has not been built.');
  else if (missing.isWall) say('isWall() is still empty, so the map has no walls in it yet.');
  else if (missing.steerMouse) say('steerMouse() is still empty, so the arrow keys ask for nothing.');
  else if (missing.startStep) say('startStep() is still empty, so no step ever begins.');
  else if (missing.moveThing) say('moveThing() is still empty, so nothing slides anywhere.');
  else if (missing.eatCheese) say('eatCheese() is still empty, so the crumbs stay where they are.');
  else if (missing.chooseCatWay) say('chooseCatWay() is still empty, so the cats never turn.');
  else say(scoreLine());
}

function scoreLine() {
  const left = countCheese();
  if (score === 0) return 'Level ' + level + '. Arrow keys to run.';
  const points = score === 1 ? '1 point' : score + ' points';
  return points + ', and ' + left + (left === 1 ? ' crumb left.' : ' crumbs left.');
}

/* --- The card over the window --- */
function buildCurtain(aScene) {
  const display = "'Impact', 'Haettenschweiler', 'Trebuchet MS', sans-serif";
  const label = "'Trebuchet MS', sans-serif";
  const back = aScene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x0d1219, 0.74).setOrigin(0, 0);
  const title = aScene.add.text(WIDTH / 2, 286, '', {
    fontFamily: display, fontSize: '62px', color: '#ffc93c'
  }).setOrigin(0.5);
  const lines = aScene.add.text(WIDTH / 2, 382, '', {
    fontFamily: label, fontSize: '26px', color: '#fff4dc', align: 'center'
  }).setOrigin(0.5).setLineSpacing(14);
  const key = aScene.add.text(WIDTH / 2, 476, '', {
    fontFamily: label, fontSize: '26px', color: '#8ef0c9'
  }).setOrigin(0.5);

  curtain = { group: aScene.add.container(0, 0, [back, title, lines, key]).setDepth(20), title, lines, key };
  updateCurtain(false);
}

function updateCurtain(cleared) {
  if (!curtain) return;
  curtain.group.setVisible(phase !== 'playing');
  if (phase === 'waiting') {
    curtain.title.setText('CHEESE VAULT');
    curtain.lines.setText('Arrow keys to run.\nEat every crumb. Keep away from the cats.');
    curtain.key.setText('Press Enter');
  } else if (phase === 'paused') {
    curtain.title.setText('PAUSED');
    curtain.lines.setText('');
    curtain.key.setText('');
  } else if (phase === 'over') {
    curtain.title.setText(cleared ? 'VAULT EMPTY' : 'GAME OVER');
    curtain.lines.setText((score === 1 ? '1 point' : score + ' points') + '\nLevel ' + Math.min(level, LEVELS.length));
    curtain.key.setText('Press Play again');
  }
}

/* --- The rack down the side --- */
function updateRack() {
  scoreReadEl.textContent = score;
  levelReadEl.textContent = Math.min(level, LEVELS.length);
  wallCountEl.textContent = walls === null ? 0 : walls.getLength();
  catCountEl.textContent = cats.length;

  const left = grid === null ? 0 : countCheese();
  cheeseLeftEl.textContent = left;
  clearBarEl.style.width = ((cheeseAtStart - left) / cheeseAtStart) * 100 + '%';

  /* The two readouts and the compass are your own functions, shown
     back to you. Until they work they show a dash. */
  const cell = mouse === null ? null : cellAt(mouse.sprite.x, mouse.sprite.y);
  cellReadEl.textContent = isCell(cell) ? cell.col + ',' + cell.row : '—';

  const spot = isCell(cell) ? middleOf(cell.col, cell.row) : null;
  pixelReadEl.textContent = isPoint(spot) ? Math.round(spot.x) + ',' + Math.round(spot.y) : '—';

  const mapReady = isCell(cell) && isWall(0, 0) === true;
  showWay('up', mapReady, cell, 0, -1);
  showWay('down', mapReady, cell, 0, 1);
  showWay('left', mapReady, cell, -1, 0);
  showWay('right', mapReady, cell, 1, 0);

  if (livesEl.children.length !== START_LIVES) {
    livesEl.textContent = '';
    for (let i = 0; i < START_LIVES; i += 1) {
      livesEl.appendChild(document.createElement('span'));
    }
  }
  for (let i = 0; i < START_LIVES; i += 1) {
    livesEl.children[i].className = i < lives ? 'life' : 'life life-gone';
  }

  startBtn.disabled = phase === 'over';
  startBtn.firstChild.nodeValue = phase === 'playing' ? 'Pause ' : 'Start ';
  againBtn.disabled = phase === 'waiting';
}

function showWay(name, mapReady, cell, dx, dy) {
  if (!mapReady) {
    wayEls[name].className = 'way';
    return;
  }
  const shut = isWall(cell.col + dx, cell.row + dy) === true;
  wayEls[name].className = shut ? 'way way-shut' : 'way way-open';
}

/* --- The keys --- */

function resetGame() {
  score = 0;
  lives = START_LIVES;
  level = 1;
  missing.steerMouse = false;
  missing.startStep = false;
  missing.moveThing = false;
  missing.eatCheese = false;
  missing.chooseCatWay = false;
  mouse.sprite.setAlpha(1);
  loadLevel(scene, 1);
}

startBtn.addEventListener('click', () => {
  if (phase === 'playing') {
    phase = 'paused';
    say('Paused.');
  } else {
    if (phase === 'waiting') playSound(startSound);
    phase = 'playing';
    say('Arrow keys to run.');
    handOverToTheGame();
  }
  updateCurtain(false);
});

againBtn.addEventListener('click', () => {
  resetGame();
  phase = 'playing';
  playSound(startSound);
  say('A fresh vault. Level 1.');
  handOverToTheGame();
  updateCurtain(false);
});

/* Move the keyboard onto the window once a game starts. Project 10
   explains why a game that reads the keyboard has to say this. */
function handOverToTheGame() {
  screenEl.focus();
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Enter' && !startBtn.disabled) {
    event.preventDefault();
    startBtn.click();
  }
});

/* Typing #demo onto a page that is already open changes the address
   only. The script does not run again, so the page reloads itself. */
window.addEventListener('hashchange', () => location.reload());

/* --- The demos ---

   Add #demo or #demo-over to the end of the address in the browser and
   the game plays properly, so you can see what you are building. The
   stand-ins below fill in whichever functions are still empty. They
   are for the demo picture only. They are never for you. */
function standInForBuildVault(aScene) {
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const spot = { x: col * TILE + TILE / 2, y: row * TILE + TILE / 2 };
      if (grid[row][col] === '#') walls.create(spot.x, spot.y, 'wall');
      if (grid[row][col] === '.') crumbs.create(spot.x, spot.y, 'crumb');
    }
  }
}

/* The three map functions, filled in before a level is loaded, because
   everything else needs them. */
function standInForTheMap() {
  if (!isPoint(middleOf(1, 1))) {
    middleOf = (col, row) => ({ x: col * TILE + TILE / 2, y: row * TILE + TILE / 2 });
  }
  if (!isCell(cellAt(TILE + 4, TILE + 4))) {
    cellAt = (x, y) => ({ col: Math.floor(x / TILE), row: Math.floor(y / TILE) });
  }
  if (isWall(0, 0) !== true) {
    isWall = (col, row) => {
      if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return true;
      return grid[row][col] === '#';
    };
  }
}

/* And the five that move things, filled in once there is a mouse to
   test them on. Everything they disturb is put back. */
function standInForTheMoving() {
  probing = true;

  mouse.wantX = 0;
  mouse.wantY = 0;
  steerMouse({
    left: { isDown: true }, right: { isDown: false },
    up: { isDown: false }, down: { isDown: false }
  });
  if (mouse.wantX === 0 && mouse.wantY === 0) {
    steerMouse = (theKeys) => {
      if (theKeys.left.isDown) { mouse.wantX = -1; mouse.wantY = 0; }
      else if (theKeys.right.isDown) { mouse.wantX = 1; mouse.wantY = 0; }
      else if (theKeys.up.isDown) { mouse.wantX = 0; mouse.wantY = -1; }
      else if (theKeys.down.isDown) { mouse.wantX = 0; mouse.wantY = 1; }
    };
  }

  const here = cellAt(mouse.sprite.x, mouse.sprite.y);
  const free = waysOut(here.col, here.row)[0];
  mouse.wantX = free.x;
  mouse.wantY = free.y;
  startStep(mouse);
  if (mouse.goX === 0 && mouse.goY === 0) {
    startStep = (thing) => {
      if (thing.goX !== 0 || thing.goY !== 0) return;
      if (thing.wantX === 0 && thing.wantY === 0) return;
      const at = cellAt(thing.sprite.x, thing.sprite.y);
      const col = at.col + thing.wantX;
      const row = at.row + thing.wantY;
      if (isWall(col, row) === true) return;
      thing.toCol = col;
      thing.toRow = row;
      thing.goX = thing.wantX;
      thing.goY = thing.wantY;
    };
    startStep(mouse);
  }

  const wasX = mouse.sprite.x;
  const wasY = mouse.sprite.y;
  moveThing(mouse, 0.05);
  if (mouse.sprite.x === wasX && mouse.sprite.y === wasY) {
    moveThing = (thing, seconds) => {
      if (thing.goX === 0 && thing.goY === 0) return;
      const target = middleOf(thing.toCol, thing.toRow);
      const step = thing.speed * seconds;
      if (Phaser.Math.Distance.Between(thing.sprite.x, thing.sprite.y, target.x, target.y) <= step) {
        thing.sprite.x = target.x;
        thing.sprite.y = target.y;
        thing.goX = 0;
        thing.goY = 0;
        return;
      }
      thing.sprite.x += thing.goX * step;
      thing.sprite.y += thing.goY * step;
    };
  }
  mouse.sprite.setPosition(wasX, wasY);
  placeThing(mouse, here.col, here.row);

  grid[here.row][here.col] = '.';
  const probeCrumb = crumbs.create(mouse.sprite.x, mouse.sprite.y, 'crumb');
  const scoreWas = score;
  eatCheese();
  if (grid[here.row][here.col] === '.') {
    eatCheese = () => {
      const at = cellAt(mouse.sprite.x, mouse.sprite.y);
      if (grid[at.row][at.col] !== '.') return;
      grid[at.row][at.col] = ' ';
      const crumb = crumbAt(at.col, at.row);
      if (crumb !== null) crumb.destroy();
      nibble();
    };
    eatCheese();
  }
  if (probeCrumb.active) probeCrumb.destroy();
  score = scoreWas;

  if (!isWay(chooseCatWay(cats[0]))) {
    chooseCatWay = (cat) => {
      const at = cellAt(cat.sprite.x, cat.sprite.y);
      const ways = waysOut(at.col, at.row);
      const forward = [];
      for (const way of ways) {
        if (way.x === -cat.wantX && way.y === -cat.wantY) continue;
        forward.push(way);
      }
      const list = forward.length > 0 ? forward : ways;
      return list[Math.floor(Math.random() * list.length)];
    };
  }

  probing = false;
}

function setUpDemo(aScene) {
  standInForTheMoving();

  if (location.hash === '#demo-over') {
    score = 34;
    level = 2;
    lives = 0;
    phase = 'over';
    updateCurtain(false);
    say('Demo: the game after the cats took the last life.');
    return;
  }

  /* A vault half emptied, with the mouse part-way down a corridor. */
  const list = crumbs.getChildren().slice();
  for (let i = 0; i < list.length; i += 2) {
    grid[Math.floor(list[i].y / TILE)][Math.floor(list[i].x / TILE)] = ' ';
    list[i].destroy();
  }

  score = 41;
  lives = 2;
  phase = 'playing';
  updateCurtain(false);
  say('Demo: the finished game. Arrow keys to run.');
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the functions you have to write.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- middleOf(col, row) ---

     return {
       x: col * TILE + TILE / 2,
       y: row * TILE + TILE / 2
     };


   --- cellAt(x, y) ---

     return {
       col: Math.floor(x / TILE),
       row: Math.floor(y / TILE)
     };


   --- buildVault(scene) ---

     for (let row = 0; row < ROWS; row += 1) {
       for (let col = 0; col < COLS; col += 1) {
         const spot = middleOf(col, row);
         if (grid[row][col] === '#') walls.create(spot.x, spot.y, 'wall');
         if (grid[row][col] === '.') crumbs.create(spot.x, spot.y, 'crumb');
       }
     }


   --- isWall(col, row) ---

     if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return true;
     return grid[row][col] === '#';


   --- steerMouse(keys) ---

     if (keys.left.isDown) { mouse.wantX = -1; mouse.wantY = 0; }
     else if (keys.right.isDown) { mouse.wantX = 1; mouse.wantY = 0; }
     else if (keys.up.isDown) { mouse.wantX = 0; mouse.wantY = -1; }
     else if (keys.down.isDown) { mouse.wantX = 0; mouse.wantY = 1; }


   --- startStep(thing) ---

     if (thing.goX !== 0 || thing.goY !== 0) return;
     if (thing.wantX === 0 && thing.wantY === 0) return;

     const here = cellAt(thing.sprite.x, thing.sprite.y);
     const col = here.col + thing.wantX;
     const row = here.row + thing.wantY;
     if (isWall(col, row) === true) return;

     thing.toCol = col;
     thing.toRow = row;
     thing.goX = thing.wantX;
     thing.goY = thing.wantY;


   --- moveThing(thing, seconds) ---

     if (thing.goX === 0 && thing.goY === 0) return;

     const target = middleOf(thing.toCol, thing.toRow);
     const step = thing.speed * seconds;

     if (Phaser.Math.Distance.Between(thing.sprite.x, thing.sprite.y, target.x, target.y) <= step) {
       thing.sprite.x = target.x;
       thing.sprite.y = target.y;
       thing.goX = 0;
       thing.goY = 0;
       return;
     }

     thing.sprite.x += thing.goX * step;
     thing.sprite.y += thing.goY * step;


   --- eatCheese() ---

     const here = cellAt(mouse.sprite.x, mouse.sprite.y);
     if (grid[here.row][here.col] !== '.') return;

     grid[here.row][here.col] = ' ';
     const crumb = crumbAt(here.col, here.row);
     if (crumb !== null) crumb.destroy();
     nibble();


   --- chooseCatWay(cat) ---

     const here = cellAt(cat.sprite.x, cat.sprite.y);
     const ways = waysOut(here.col, here.row);

     const forward = [];
     for (const way of ways) {
       if (way.x === -cat.wantX && way.y === -cat.wantY) continue;
       forward.push(way);
     }

     const list = forward.length > 0 ? forward : ways;
     return list[Math.floor(Math.random() * list.length)];

   --------------------------------------------------------------------- */
