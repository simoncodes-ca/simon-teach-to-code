/* =====================================================================
   Cave Flyer. The first world that is bigger than the window.

   You fly a little mining ship through a long cave. Gravity pulls it
   down the whole time. The engine pushes it up while you hold the up
   arrow. Pick up the crystals, and reach the gate at the far end.
   Touch the rock and the ship breaks.

   The cave is four and a half windows long and one and a half windows
   tall. The window can only show one part of it at a time. Something
   has to decide which part, and that something is the camera.

   The new idea fits on one line:

       screen position = world position - camera position

   Every rock, every crystal and the ship has a world position. That is
   where it lives in the cave. It does not change when the camera moves.
   The camera has a world position too. Take the camera away from the
   world position, and you have the spot in the window.

   Write the functions in this order:
      1. toScreen       a spot in the cave, turned into a spot in the window
      2. steerShip      the arrow keys set the engine and the sideways speed
      3. flyShip        gravity pulls, the engine pushes, the ship moves
      4. aimCamera      keep the ship in the middle of the window
      5. isOnScreen     can the window see this spot?
      6. isRock         is this spot inside the rock?
      7. shipHitsRock   is any corner of the ship inside the rock?

   Each one changes something you can see. Do them in order.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   The numbers first, then the cave, then the things that change while
   the game runs.

   Two sizes matter more than the rest, and this project is about the
   gap between them. The window is 1024 by 768 pixels. The cave is 4608
   by 1152.
   --------------------------------------------------------------------- */

const WIDTH = 1024;                // the window is always this wide, whatever size it looks
const HEIGHT = 768;                // and always this tall
const TILE = 64;                   // one cell of the cave is this many pixels across
const COLS = 72;                   // how many cells across the whole cave
const ROWS = 18;                   // and how many down it
const WORLD_WIDTH = COLS * TILE;   // the whole cave in pixels: 4608 across
const WORLD_HEIGHT = ROWS * TILE;  // and 1152 down

const GRAVITY = 300;               // every second, the ship falls this much faster
const THRUST = 640;                // every second the engine is on, it pushes this much upwards
const SIDE_SPEED = 220;            // how fast the ship flies left or right, in pixels per second
const TOP_SPEED = 360;             // the fastest the ship may climb or fall
const SHIP_W = 44;                 // the ship's box, for touching rock. It is a little
const SHIP_H = 28;                 // smaller than the picture, so a near miss is a miss

const CRYSTAL_POINTS = 5;          // five points a crystal
const GATE_POINTS = 50;            // fifty for reaching the gate
const START_LIVES = 3;             // how many ships you get

/* The cave, drawn as rows of characters, the same way as the vaults in
   project 11.

      #  rock
      *  a crystal
      S  where the ship starts
      P  a lamp. Fly past it, and a crashed ship comes back here
      E  the gate at the far end

   Every row is 72 characters long, so it runs off the side of your
   editor. That is the point of this project. The window only ever shows
   16 columns and 12 rows of it.

   The wiring takes the '*', 'S', 'P' and 'E' out when it builds the
   cave. By the time your functions look, the map holds only '#' and
   ' '. */
const CAVE = [
  '########################################################################',
  '########################################################################',
  '#        ######  ################################  #####################',
  '#        *   #     ########################### *     ################  #',
  '#  S         # *     ########################          ############    #',
  '#                     #####################             ##########     #',
  '#                      ###################              # #######      #',
  '#              ##       #################        P# *      #####     E #',
  '#########    #####       ###############         ####        ##*       #',
  '####################      #############        ########  *             #',
  '#####################       ##########   *  ############              ##',
  '######################         #####        ############           *####',
  '######################*         *          ##############          #####',
  '#######################             *     ################      ########',
  '########################                 ##################     ########',
  '##########################P*   #       ######################  #########',
  '########################################################################',
  '########################################################################'
];

/* The cave being flown, one list per row, so `grid[row][col]` is one
   cell. Exactly the vault's grid from project 11. */
let grid = null;

/* The camera. Its x and y are the world position of the window's top
   left corner.

   Camera x 1000 means the left edge of the window is showing the part
   of the cave 1000 pixels from the start. Camera 0,0 shows the very
   top left of the cave. */
const camera = { x: 0, y: 0 };

/* The ship. x and y are its middle, in world pixels. vx and vy are its
   speed in pixels per second, the way project 7's darts kept theirs.
   `thrust` is true while the engine is on. */
const ship = { x: 0, y: 0, vx: 0, vy: 0, thrust: false };

/* Every picture that lives in the cave: every rock, every crystal, the
   lamps and the gate. Each one is

       { kind, sprite, x, y }

   with x and y in world pixels. The sprite is only the picture. Where
   the thing really lives is x and y. */
let things = [];

let score = 0;                     // five a crystal, fifty for the gate
let lives = START_LIVES;           // ships left


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Seven small functions, top to bottom.

   Each one gives you two hints. Read the gentle one first. All the
   answers sit in one block at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * Turn a spot in the cave into a spot in the window.
 *
 * `worldX` and `worldY` say where something lives in the cave. The
 * camera says which part of the cave the window is showing. Its x and
 * y are the world position of the window's top left corner.
 *
 * Say a crystal lives at world x 1300, and the camera is at x 1000.
 * The window starts 1000 pixels into the cave. So the crystal is 300
 * pixels from the left edge of the window, because 1300 - 1000 = 300.
 *
 * y works the same way, with camera.y.
 *
 * Hand back an object with an x and a y in it, like this:
 *
 *     { x: 300, y: 250 }
 *
 * Every picture in the cave goes into the window through this function.
 * Phaser has a camera of its own that does this subtraction for you.
 * This project leaves Phaser's camera alone, so that you write the
 * subtraction once and know exactly what it does.
 *
 * Gentle hint: take the camera away from the world position.
 * Stronger hint: return an object with each world coordinate minus its
 *   matching camera coordinate.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press Start. The cave and the ship appear in the window, and the
 * Screen readout on the rack starts working.
 */
function toScreen(worldX, worldY) {
  // TODO: world in, screen out.
}

/**
 * Read the arrow keys, and set the engine and the sideways speed.
 *
 * Keys work the way they did in projects 10 and 11. This function
 * moves nobody. It only sets two things on the ship:
 *
 *     ship.vx        -SIDE_SPEED for left, SIDE_SPEED for right, 0 for neither
 *     ship.thrust    true while the up arrow is held, false when it is not
 *
 * The sideways part is project 10's steering again, `else` and all.
 * Leave the `else` out and the ship keeps drifting after you let go.
 *
 * The engine is one line. `keys.up.isDown` is already true or false,
 * so it can go straight into `ship.thrust`.
 *
 * There is no down key. Gravity is the down key.
 *
 * Gentle hint: an `if`, an `else if` and an `else` for vx, then one
 *   line for thrust.
 * Stronger hint: choose negative speed for left, positive for right,
 *   and zero otherwise. Copy the up key into `ship.thrust`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Hold the up arrow. The ship still hangs in the air, but a flame
 * lights under it, and the Engine lamp on the rack comes on.
 */
function steerShip(keys) {
  // TODO: sideways speed from left and right, the engine from up.
}

/**
 * Fly the ship for `seconds` worth of time.
 *
 * Two things push on the ship, and they fight each other.
 *
 * Gravity is the dart's gravity from project 7. Every second, the ship
 * falls GRAVITY pixels per second faster:
 *
 *     ship.vy += GRAVITY * seconds;
 *
 * The engine is the same line, pointing the other way. y grows
 * downwards, so pushing up means taking away. Only do it while
 * `ship.thrust` is true:
 *
 *     ship.vy -= THRUST * seconds;
 *
 * THRUST is bigger than GRAVITY. With the engine on, the ship slows its
 * fall, stops for a moment, then climbs. Let go, and gravity wins again.
 *
 * Nothing stops vy growing for ever, so put a lid on it.
 * `Phaser.Math.Clamp` keeps a number between a smallest and a biggest
 * value. It is `Math.min` and `Math.max` in one go:
 *
 *     Phaser.Math.Clamp(15, 0, 10)     is 10
 *     Phaser.Math.Clamp(-4, 0, 10)     is 0
 *     Phaser.Math.Clamp(7, 0, 10)      is 7
 *
 * Keep vy between -TOP_SPEED and TOP_SPEED.
 *
 * Last, move the ship by its speed, the way everything has moved since
 * project 7. Both x and y.
 *
 * Gentle hint: change vy twice, clamp it, then move x and y.
 * Stronger hint: add gravity first. Subtract engine force when thrusting,
 *   clamp `vy`, then add velocity times seconds to x and y.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press an arrow key. The ship drops, and the engine holds it up. Fly
 * right, and the ship leaves the window, because nothing moves the
 * camera yet.
 */
function flyShip(seconds) {
  // TODO: gravity, engine, a lid on the speed, then move.
}

/**
 * Point the camera so the ship sits in the middle of the window.
 *
 * The camera is the window's top left corner. For the ship to be in
 * the middle, that corner has to be half a window to the left of the
 * ship, and half a window above it:
 *
 *     camera.x = ship.x - WIDTH / 2;
 *     camera.y = ship.y - HEIGHT / 2;
 *
 * Try only those two lines first, and fly back to the start. The window
 * shows black space past the end of the cave. The camera went to a part
 * of the world where there is no cave, and the Camera limits markers on
 * the rack turn red.
 *
 * So the camera needs limits:
 *
 *     camera.x    no smaller than 0, no bigger than WORLD_WIDTH - WIDTH
 *     camera.y    no smaller than 0, no bigger than WORLD_HEIGHT - HEIGHT
 *
 * Why WORLD_WIDTH - WIDTH? The right edge of the window is at
 * camera.x + WIDTH. That edge must stop at the end of the cave.
 *
 * `Phaser.Math.Clamp` does this, the same as in `flyShip`.
 *
 * Near the ends of the cave, the ship will not be in the middle of the
 * window any more. That is correct. The camera stops, and the ship
 * carries on.
 *
 * Gentle hint: two lines to aim, and a clamp on each one.
 * Stronger hint: subtract half the window from each ship coordinate.
 *   Clamp x to the world width and y to the world height.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The cave scrolls. The ship stays in the window wherever you fly, and
 * the white box on the cave map slides along with you.
 */
function aimCamera() {
  // TODO: aim at the ship, then keep the camera inside the cave.
}

/**
 * Can the window see this spot right now?
 *
 * The cave holds about 900 pictures. The window only shows about 130 of
 * them at a time. Moving the rest every frame is wasted work. So the
 * wiring asks this function first, and skips every picture the window
 * cannot see.
 *
 * Use your `toScreen` to find where the spot would land in the window.
 * The window runs from 0 to WIDTH across, and from 0 to HEIGHT down.
 * A spot inside both of those can be seen.
 *
 * Leave a margin of one TILE on every side. A rock whose middle is just
 * past the edge still has half of itself showing. Without the margin,
 * rocks pop in late at the edges of the window.
 *
 * Hand back true or false.
 *
 * Gentle hint: find the screen spot, then check four edges with `&&`.
 * Stronger hint: accept x between one tile before the left edge and one
 *   tile after the right edge. Apply the same test to y.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Pictures drawn, on the rack, drops. It stops counting every picture
 * in the cave, and only counts the ones in the window.
 */
function isOnScreen(worldX, worldY) {
  // TODO: toScreen, then four edges and a margin.
}

/**
 * Is this spot in the cave inside the rock?
 *
 * This is project 11's `cellAt` and `isWall` in one function. The spot
 * arrives in world pixels, and the map counts in cells. So turn the
 * spot into a column and a row first, then look the cell up.
 *
 * The edge counts as rock, the same as the edge of the vault did.
 * Everything outside the cave is solid.
 *
 * Use world pixels here, never screen pixels. The rock lives in the
 * cave, and it stays where it is when the camera moves.
 *
 * Gentle hint: divide by TILE and round down, check the four edges,
 *   then compare with '#'.
 * Stronger hint: floor both coordinates divided by `TILE`. Return true
 *   outside the row and column limits, otherwise compare with `'#'`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Nothing crashes yet. But fly into the rock and watch the Corners on
 * the rack. Each lamp turns red while that corner of the ship is inside
 * the rock.
 */
function isRock(worldX, worldY) {
  // TODO: pixels to a cell, off the map is rock, then look it up.
}

/**
 * Is any part of the ship touching the rock?
 *
 * The ship is a box SHIP_W wide and SHIP_H tall, and ship.x and ship.y
 * are its middle. So its four edges are:
 *
 *     const left = ship.x - SHIP_W / 2;
 *     const right = ship.x + SHIP_W / 2;
 *     const top = ship.y - SHIP_H / 2;
 *     const bottom = ship.y + SHIP_H / 2;
 *
 * Ask your `isRock` about each of the four corners. If any one of them
 * is rock, the ship has hit.
 *
 * Why only the corners? A cell of rock is 64 pixels square. The ship is
 * 44 by 28, which is smaller. So a cell of rock cannot touch the ship
 * without covering a corner.
 *
 * Hand back true or false.
 *
 * Gentle hint: work out the four edges, then call `isRock` four times,
 *   joined with `||`.
 * Stronger hint: use `isRock` for left and right at the top, then left
 *   and right at the bottom. Join the four answers with `||`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Touch the rock and the ship breaks. You lose a ship, and the next one
 * appears at the last lamp you flew past.
 */
function shipHitsRock() {
  // TODO: four corners, four questions.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is finished already. It sets Phaser up, loads the
   pictures, builds the cave, reads the keys, runs the clock, and keeps
   the rack up to date.

   Read it, because it shows you where your seven functions get used.
   Do not change it.
   --------------------------------------------------------------------- */

const scoreReadEl = document.getElementById('scoreRead');
const crystalReadEl = document.getElementById('crystalRead');
const livesEl = document.getElementById('lives');
const worldReadEl = document.getElementById('worldRead');
const cameraReadEl = document.getElementById('cameraRead');
const screenReadEl = document.getElementById('screenRead');
const caveMapEl = document.getElementById('caveMap');
const drawnReadEl = document.getElementById('drawnRead');
const totalReadEl = document.getElementById('totalRead');
const thrustLampEl = document.getElementById('thrustLamp');
const climbBarEl = document.getElementById('climbBar');
const limitXEl = document.getElementById('limitX');
const limitYEl = document.getElementById('limitY');
const cornerEls = [
  document.getElementById('cornerTL'),
  document.getElementById('cornerTR'),
  document.getElementById('cornerBL'),
  document.getElementById('cornerBR')
];
const screenEl = document.getElementById('screen');
const startBtn = document.getElementById('start');
const againBtn = document.getElementById('again');
const statusEl = document.getElementById('status');

/* The sounds. The same pattern as every project since the calculator:
   one Audio object per sound, made once and used again. */
const startSound = new Audio('assets/start.wav');
const crystalSound = new Audio('assets/crystal.wav');
const lampSound = new Audio('assets/lamp.wav');
const crashSound = new Audio('assets/crash.wav');
const gateSound = new Audio('assets/gate.wav');
const overSound = new Audio('assets/over.wav');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* Things the game needs that are not part of the game itself. */
const DEMO = location.hash === '#demo' || location.hash === '#demo-over';
const GRAB_GAP = 40;             // this close to a crystal and you have it
const GATE_GAP = 48;             // this close to the gate and you are through
const MAP_PIXEL = 16;            // one pixel of the cave map on the rack is this many pixels of cave

let scene = null;                // the one scene, once Phaser has built it
let keys = null;                 // the arrow keys
let shipSprite = null;           // the ship's picture
let flame = null;                // the flame under it
let curtain = null;              // the card before, between and after games
let phase = 'waiting';           // 'waiting', 'playing', 'paused' or 'over'
let hanging = true;              // the ship hangs still until an arrow key is pressed
let crashing = false;            // true between a crash and the next ship appearing
let crashCount = 0;              // so a ship from an old game never appears in a new one
let start = { x: 0, y: 0 };      // the S on the map, in world pixels
let restart = { x: 0, y: 0 };    // where the next ship appears: the start, then the last lamp
let crystals = [];               // the crystals still in the cave
let lamps = [];                  // the two lamps
let gate = null;                 // the gate at the far end
let crystalsTotal = 0;           // how many crystals the cave began with
let drawnCount = 0;              // how many pictures went into the window this frame
let caveMapPicture = null;       // the rock on the cave map, drawn once
let message = '';

/* One flag per function you have to write. The wiring sets these as it
   goes, and the line under the window reads them. */
const missing = {
  toScreen: false,
  steerShip: false,
  flyShip: false,
  aimCamera: false,
  isOnScreen: false,
  isRock: false,
  shipHitsRock: false
};

function say(text) {
  if (text === message) return;
  message = text;
  statusEl.textContent = text;
}

/* --- Small helpers --- */

/* Cells in, world pixels out. You wrote this in project 11, so this
   time it is given. */
function middleOf(col, row) {
  return { x: col * TILE + TILE / 2, y: row * TILE + TILE / 2 };
}

/* Did a function hand back an object with an x and a y in it? An empty
   function hands back nothing at all. */
function isPoint(thing) {
  return thing !== null && typeof thing === 'object'
    && typeof thing.x === 'number' && typeof thing.y === 'number';
}

/* Two numbers for the rack. A function that went wrong can make NaN,
   which means "not a number", and the rack shows it rather than
   hiding it. */
function pair(x, y) {
  return Math.round(x) + ',' + Math.round(y);
}

function anyArrowDown() {
  return keys.left.isDown || keys.right.isDown || keys.up.isDown;
}

/* --- Setting Phaser up ---

   The same three functions as projects 9, 10 and 11. `preload` fetches
   the pictures, `create` builds the scene once, and `update` runs every
   frame. */
new Phaser.Game({
  /* Both of these settings are here to keep the page double-clickable,
     and project 9 explains them. */
  type: Phaser.CANVAS,
  canvas: document.getElementById('screen'),
  width: WIDTH,
  height: HEIGHT,
  /* Every picture lands on a whole pixel, so no thin lines open up
     between the rocks. */
  render: { roundPixels: true },
  scene: { preload: preload, create: create, update: update },
  loader: { imageLoadType: 'HTMLImageElement' }
});

function preload() {
  this.load.image('back', 'assets/back.png');
  this.load.image('rock', 'assets/rock.png');
  this.load.image('deep', 'assets/deep.png');
  this.load.image('crystal', 'assets/crystal.png');
  this.load.image('lamp', 'assets/lamp.png');
  this.load.image('lamp-lit', 'assets/lamp-lit.png');
  this.load.image('gate', 'assets/gate.png');
  this.load.image('ship', 'assets/ship.png');
  this.load.image('flame', 'assets/flame.png');
}

function create() {
  scene = this;

  /* The background is stuck to the window, not to the cave, so it
     never goes through toScreen. The title card below is the same. */
  this.add.image(0, 0, 'back').setOrigin(0, 0).setDepth(-10);

  keys = this.input.keyboard.createCursorKeys();

  buildCave(this);
  drawCaveMapPicture();

  flame = this.add.image(0, 0, 'flame').setDepth(4).setVisible(false);
  shipSprite = this.add.image(0, 0, 'ship').setDepth(5).setVisible(false);

  buildCurtain(this);
  putShipBack();

  if (DEMO) {
    standInForYourFunctions();
    setUpDemo();
    return;
  }

  checkYourFunctions();
  say(missing.toScreen
    ? 'Press Enter. The window stays dark until toScreen() puts the cave in it.'
    : 'Press Enter to fly.');
}

/* One step of the game.

   Phaser hands you the time since the last frame, in milliseconds.
   Dividing by 1000 gives the `seconds` you have used since project 7. */
function update(time, delta) {
  /* A frame longer than a twentieth of a second is cut short. So a
     browser that stalls for a moment cannot throw the ship through a
     wall. */
  const seconds = Math.min(delta / 1000, 0.05);

  if (phase === 'playing' && !crashing) flyOneFrame(this, seconds);

  drawWorld();
  updateRack();
}

/* Everything that happens in one frame of flying, in order. */
function flyOneFrame(aScene, seconds) {
  checkYourFunctions();

  steerShip(keys);

  /* A new ship hangs still until an arrow key is pressed. That gives
     you a moment to find it. */
  if (hanging && anyArrowDown()) hanging = false;
  if (!hanging) flyShip(seconds);

  aimCamera();

  if (fellOutOfTheCave()) {
    putShipBack();
    return;
  }

  grabCrystals();
  passLamps();

  if (shipHitsRock() === true) {
    crash(aScene);
    return;
  }

  if (Phaser.Math.Distance.Between(ship.x, ship.y, gate.x, gate.y) < GATE_GAP) {
    score += GATE_POINTS;
    gameOver(true);
    return;
  }

  reportEmptyFunctions();
}

/* --- Checking your functions ---

   Each of your functions is asked one question, with an answer that
   cannot be argued with. The ship and the camera are put back exactly
   as they were afterwards, so the checks never move anything. */

/* Pretend keys for the check: left and up held down. */
const LEFT_AND_UP = {
  left: { isDown: true },
  right: { isDown: false },
  up: { isDown: true },
  down: { isDown: false }
};

function checkYourFunctions() {
  const shipWas = Object.assign({}, ship);
  const cameraWas = Object.assign({}, camera);

  missing.toScreen = !isPoint(toScreen(10, 10));

  ship.vx = 0;
  ship.thrust = false;
  steerShip(LEFT_AND_UP);
  missing.steerShip = !(ship.vx < 0) || ship.thrust !== true;

  ship.vx = 0;
  ship.vy = 0;
  ship.thrust = false;
  flyShip(0.1);
  missing.flyShip = ship.y === shipWas.y;

  ship.x = WORLD_WIDTH / 2;
  ship.y = WORLD_HEIGHT / 2;
  camera.x = 0;
  camera.y = 0;
  aimCamera();
  missing.aimCamera = camera.x === 0 && camera.y === 0;

  camera.x = 0;
  camera.y = 0;
  missing.isOnScreen = isOnScreen(100, 100) !== true || isOnScreen(WORLD_WIDTH - 10, 10) !== false;

  missing.isRock = isRock(-10, -10) !== true || isRock(start.x, start.y) !== false;

  ship.x = TILE / 2;
  ship.y = TILE / 2;
  const inRock = shipHitsRock();
  ship.x = start.x;
  ship.y = start.y;
  const inAir = shipHitsRock();
  missing.shipHitsRock = inRock !== true || inAir !== false;

  Object.assign(ship, shipWas);
  Object.assign(camera, cameraWas);
}

/* --- Building the cave ---

   Project 11 made you write this loop, so here it is given. It reads
   every character of the map, and puts a picture wherever the map asks
   for one. */
function buildCave(aScene) {
  for (const thing of things) thing.sprite.destroy();
  things = [];
  crystals = [];
  lamps = [];

  grid = [];
  for (let row = 0; row < ROWS; row += 1) grid.push(CAVE[row].split(''));

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const spot = middleOf(col, row);
      const ch = grid[row][col];

      if (ch === '#') {
        /* Rock next to air gets the lit face. Rock buried deep inside
           gets the dark one. */
        addThing(aScene, 'rock', touchesAir(col, row) ? 'rock' : 'deep', spot.x, spot.y);
      } else if (ch === '*') {
        crystals.push(addThing(aScene, 'crystal', 'crystal', spot.x, spot.y));
      } else if (ch === 'P') {
        /* A lamp stands on the floor, and the next ship appears in the
           middle of the air above it. */
        const lamp = addThing(aScene, 'lamp', 'lamp', spot.x, spot.y + 8);
        lamp.lit = false;
        lamp.restart = { x: spot.x, y: middleOfTheAir(col, row) };
        lamps.push(lamp);
      } else if (ch === 'E') {
        gate = addThing(aScene, 'gate', 'gate', spot.x, spot.y);
      } else if (ch === 'S') {
        start = spot;
      }

      if (ch !== '#') grid[row][col] = ' ';
    }
  }

  /* The map is read row by row, so the lamps are found in any order.
     Sort them from the start of the cave to the end. */
  lamps.sort((a, b) => a.x - b.x);

  crystalsTotal = crystals.length;
  restart = start;
}

function addThing(aScene, kind, picture, x, y) {
  const thing = { kind: kind, sprite: aScene.add.image(0, 0, picture).setVisible(false), x: x, y: y };
  things.push(thing);
  return thing;
}

/* Is there air in any of the four cells next to this one? */
function touchesAir(col, row) {
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const c = col + dx;
    const r = row + dy;
    if (c >= 0 && r >= 0 && c < COLS && r < ROWS && CAVE[r][c] !== '#') return true;
  }
  return false;
}

/* The world y halfway between the floor and the roof, above one cell. */
function middleOfTheAir(col, row) {
  let top = row;
  while (top > 0 && CAVE[top - 1][col] !== '#') top -= 1;
  return (middleOf(col, top).y + middleOf(col, row).y) / 2;
}

/* --- Drawing ---

   Every picture in the cave goes into the window through your
   `isOnScreen` and your `toScreen`. Nothing is put there any other way. */
function drawWorld() {
  drawnCount = 0;
  for (const thing of things) {
    if (placeInWindow(thing.sprite, thing.x, thing.y)) drawnCount += 1;
  }

  const shipShown = !crashing && placeInWindow(shipSprite, ship.x, ship.y);
  if (shipShown) {
    drawnCount += 1;
    /* The ship leans the way it is flying. */
    shipSprite.setAngle(Number.isFinite(ship.vx) ? ship.vx / SIDE_SPEED * 8 : 0);
  }

  if (shipShown && ship.thrust === true && placeInWindow(flame, ship.x, ship.y + 26)) {
    flame.setScale(1, 0.8 + Math.random() * 0.4);
  } else {
    flame.setVisible(false);
  }
}

/* Put one picture in the window, or hide it if the window cannot see
   it. Hands back true if it was drawn. */
function placeInWindow(sprite, worldX, worldY) {
  if (isOnScreen(worldX, worldY) === false) {
    sprite.setVisible(false);
    return false;
  }
  const spot = toScreen(worldX, worldY);
  if (!isPoint(spot)) {
    sprite.setVisible(false);
    return false;
  }
  sprite.setPosition(spot.x, spot.y);
  sprite.setVisible(true);
  return true;
}

/* --- What happens as you fly --- */

/* A ship that leaves the cave altogether is put back. That can only
   happen before shipHitsRock() works, while nothing stops a ship
   flying through the rock. */
function fellOutOfTheCave() {
  if (!Number.isFinite(ship.x) || !Number.isFinite(ship.y)) return true;
  return ship.x < -TILE || ship.x > WORLD_WIDTH + TILE
    || ship.y < -TILE || ship.y > WORLD_HEIGHT + TILE;
}

/* A crystal close enough to the ship is picked up. The loop counts
   backwards because picking one up takes it out of the list, the same
   as project 7's darts. */
function grabCrystals() {
  for (let i = crystals.length - 1; i >= 0; i -= 1) {
    const crystal = crystals[i];
    if (Phaser.Math.Distance.Between(ship.x, ship.y, crystal.x, crystal.y) > GRAB_GAP) continue;
    crystal.sprite.destroy();
    crystals.splice(i, 1);
    things.splice(things.indexOf(crystal), 1);
    score += CRYSTAL_POINTS;
    playSound(crystalSound);
  }
}

/* Fly past a lamp and it lights. The next ship appears at the last lamp
   you lit. */
function passLamps() {
  for (const lamp of lamps) {
    if (lamp.lit || ship.x < lamp.x) continue;
    lamp.lit = true;
    lamp.sprite.setTexture('lamp-lit');
    restart = lamp.restart;
    playSound(lampSound);
  }
}

/* One ship gone. Project 10 made you write lives, so this file gives
   them to you. */
function crash(aScene) {
  crashing = true;
  crashCount += 1;
  const thisCrash = crashCount;
  lives -= 1;
  playSound(crashSound);
  boom(aScene, ship.x, ship.y);

  if (lives <= 0) {
    gameOver(false);
    return;
  }

  say('Crashed. The next ship appears at the last lamp.');
  aScene.time.delayedCall(1000, () => {
    if (thisCrash !== crashCount) return;
    putShipBack();
    crashing = false;
  });
}

/* A burst of orange that grows and fades. It lives in the cave like
   everything else, so it scrolls with the rock. */
function boom(aScene, x, y) {
  const thing = { kind: 'boom', sprite: aScene.add.circle(0, 0, 22, 0xff6a2b).setDepth(6), x: x, y: y };
  things.push(thing);
  aScene.tweens.add({
    targets: thing.sprite,
    scale: 2.6,
    alpha: 0,
    duration: 520,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      thing.sprite.destroy();
      const at = things.indexOf(thing);
      if (at >= 0) things.splice(at, 1);
    }
  });
}

/* A new ship, standing still at the restart spot, with the engine off. */
function putShipBack() {
  ship.x = restart.x;
  ship.y = restart.y;
  ship.vx = 0;
  ship.vy = 0;
  ship.thrust = false;
  hanging = true;
  aimCamera();
}

function gameOver(won) {
  phase = 'over';
  playSound(won ? gateSound : overSound);
  say(won ? 'Through the gate. Press Play again.' : 'Out of ships. Press Play again.');
  updateCurtain(won);
}

function reportEmptyFunctions() {
  if (missing.toScreen) say('toScreen() is still empty, so nothing knows where to go in the window.');
  else if (missing.steerShip) say('steerShip() is still empty, so the arrow keys do nothing.');
  else if (missing.flyShip) say('flyShip() is still empty, so the ship hangs in the air.');
  else if (missing.aimCamera) say('aimCamera() is still empty, so the window never moves.');
  else if (missing.isOnScreen) say('isOnScreen() is still empty, so every picture in the cave is moved every frame.');
  else if (missing.isRock) say('isRock() is still empty, so the ship cannot tell air from rock.');
  else if (missing.shipHitsRock) say('shipHitsRock() is still empty, so the ship flies straight through rock.');
  else say(scoreLine());
}

function scoreLine() {
  if (hanging) return 'Hold an arrow key to fly.';
  const got = crystalsTotal - crystals.length;
  return score + ' points. ' + got + ' of ' + crystalsTotal + ' crystals.';
}

/* --- The card over the window --- */
function buildCurtain(aScene) {
  const display = "'Impact', 'Haettenschweiler', 'Trebuchet MS', sans-serif";
  const label = "'Trebuchet MS', sans-serif";
  const back = aScene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x07090b, 0.72).setOrigin(0, 0);
  const title = aScene.add.text(WIDTH / 2, 286, '', {
    fontFamily: display, fontSize: '62px', color: '#f5b40a'
  }).setOrigin(0.5);
  const lines = aScene.add.text(WIDTH / 2, 382, '', {
    fontFamily: label, fontSize: '26px', color: '#f1ead6', align: 'center'
  }).setOrigin(0.5).setLineSpacing(14);
  const key = aScene.add.text(WIDTH / 2, 476, '', {
    fontFamily: label, fontSize: '26px', color: '#62e8ff'
  }).setOrigin(0.5);

  curtain = { group: aScene.add.container(0, 0, [back, title, lines, key]).setDepth(20), title, lines, key };
  updateCurtain(false);
}

function updateCurtain(won) {
  if (!curtain) return;
  curtain.group.setVisible(phase !== 'playing');
  if (phase === 'waiting') {
    curtain.title.setText('CAVE FLYER');
    curtain.lines.setText('Up fires the engine. Left and right fly sideways.\nPick up the crystals. Reach the gate at the far end.');
    curtain.key.setText('Press Enter');
  } else if (phase === 'paused') {
    curtain.title.setText('PAUSED');
    curtain.lines.setText('');
    curtain.key.setText('');
  } else if (phase === 'over') {
    const got = crystalsTotal - crystals.length;
    curtain.title.setText(won ? 'THROUGH THE GATE' : 'OUT OF SHIPS');
    curtain.lines.setText(score + ' points\n' + got + ' of ' + crystalsTotal + ' crystals');
    curtain.key.setText('Press Play again');
  }
}

/* --- The rack down the side --- */
function updateRack() {
  scoreReadEl.textContent = score;
  crystalReadEl.textContent = (crystalsTotal - crystals.length) + '/' + crystalsTotal;

  if (livesEl.children.length !== START_LIVES) {
    livesEl.textContent = '';
    for (let i = 0; i < START_LIVES; i += 1) {
      livesEl.appendChild(document.createElement('span'));
    }
  }
  for (let i = 0; i < START_LIVES; i += 1) {
    livesEl.children[i].className = i < lives ? 'life' : 'life life-gone';
  }

  /* The three wells are the one big idea, with real numbers in it.
     Screen comes from your own toScreen, so it shows a dash until that
     works. */
  worldReadEl.textContent = pair(ship.x, ship.y);
  cameraReadEl.textContent = pair(camera.x, camera.y);
  const spot = toScreen(ship.x, ship.y);
  screenReadEl.textContent = isPoint(spot) ? pair(spot.x, spot.y) : '—';

  drawnReadEl.textContent = drawnCount;
  totalReadEl.textContent = things.length + 1;

  thrustLampEl.className = ship.thrust === true ? 'lamp lamp-on' : 'lamp';

  /* The climb gauge grows left from the middle when the ship climbs,
     and right when it falls. */
  const share = Number.isFinite(ship.vy) ? Phaser.Math.Clamp(ship.vy / TOP_SPEED, -1, 1) : 0;
  climbBarEl.className = share < 0 ? 'climbing' : 'falling';
  climbBarEl.style.left = (share < 0 ? 50 + share * 50 : 50) + '%';
  climbBarEl.style.width = Math.abs(share) * 50 + '%';

  showLimit(limitXEl, camera.x, WORLD_WIDTH - WIDTH);
  showLimit(limitYEl, camera.y, WORLD_HEIGHT - HEIGHT);

  showCorners();
  drawCaveMap();

  startBtn.disabled = phase === 'over';
  startBtn.firstChild.nodeValue = phase === 'playing' ? 'Pause ' : 'Start ';
  againBtn.disabled = phase === 'waiting';
}

/* One camera limit. The marker slides between 0 and the biggest value
   the camera may have, and turns red if the camera goes past either
   end. */
function showLimit(el, value, biggest) {
  if (!Number.isFinite(value)) {
    el.className = '';
    el.style.left = '0%';
    return;
  }
  el.className = value < 0 || value > biggest ? 'past' : 'inside';
  el.style.left = Phaser.Math.Clamp(value / biggest, 0, 1) * 100 + '%';
}

/* The four corner lamps ask your isRock about the ship's own corners,
   so they work before shipHitsRock does. */
function showCorners() {
  const mapReady = isRock(-10, -10) === true;
  const corners = [
    [ship.x - SHIP_W / 2, ship.y - SHIP_H / 2],
    [ship.x + SHIP_W / 2, ship.y - SHIP_H / 2],
    [ship.x - SHIP_W / 2, ship.y + SHIP_H / 2],
    [ship.x + SHIP_W / 2, ship.y + SHIP_H / 2]
  ];
  for (let i = 0; i < 4; i += 1) {
    if (!mapReady || crashing) {
      cornerEls[i].className = '';
    } else {
      cornerEls[i].className = isRock(corners[i][0], corners[i][1]) === true ? 'corner-rock' : 'corner-air';
    }
  }
}

const caveMapPen = caveMapEl.getContext('2d');

/* The rock on the cave map never changes, so it is drawn once and
   kept. One cell of the cave is one small square of the map. */
function drawCaveMapPicture() {
  const cell = TILE / MAP_PIXEL;
  caveMapPicture = document.createElement('canvas');
  caveMapPicture.width = COLS * cell;
  caveMapPicture.height = ROWS * cell;
  const pen = caveMapPicture.getContext('2d');
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      pen.fillStyle = grid[row][col] === '#' ? '#54443a' : '#0c0f12';
      pen.fillRect(col * cell, row * cell, cell, cell);
    }
  }
}

function drawCaveMap() {
  caveMapPen.drawImage(caveMapPicture, 0, 0);

  caveMapPen.fillStyle = '#62e8ff';
  for (const crystal of crystals) {
    caveMapPen.fillRect(crystal.x / MAP_PIXEL - 1, crystal.y / MAP_PIXEL - 1, 2, 2);
  }
  for (const lamp of lamps) {
    caveMapPen.fillStyle = lamp.lit ? '#4fe089' : '#b0493a';
    caveMapPen.fillRect(lamp.x / MAP_PIXEL - 1, lamp.y / MAP_PIXEL - 2, 2, 3);
  }
  caveMapPen.fillStyle = '#f1ead6';
  caveMapPen.fillRect(gate.x / MAP_PIXEL - 1, gate.y / MAP_PIXEL - 3, 3, 6);

  /* The box is the camera: exactly the part of the cave the window
     shows. */
  if (Number.isFinite(camera.x) && Number.isFinite(camera.y)) {
    caveMapPen.strokeStyle = 'rgba(241, 234, 214, 0.9)';
    caveMapPen.lineWidth = 1;
    caveMapPen.strokeRect(camera.x / MAP_PIXEL + 0.5, camera.y / MAP_PIXEL + 0.5,
      WIDTH / MAP_PIXEL - 1, HEIGHT / MAP_PIXEL - 1);
  }

  if (!crashing && Number.isFinite(ship.x) && Number.isFinite(ship.y)) {
    caveMapPen.fillStyle = '#f5b40a';
    caveMapPen.fillRect(ship.x / MAP_PIXEL - 2, ship.y / MAP_PIXEL - 1, 4, 3);
  }
}

/* --- The keys --- */

function resetGame() {
  score = 0;
  lives = START_LIVES;
  crashing = false;
  crashCount += 1;
  buildCave(scene);
  camera.x = 0;
  camera.y = 0;
  putShipBack();
}

startBtn.addEventListener('click', () => {
  if (phase === 'playing') {
    phase = 'paused';
    say('Paused.');
  } else {
    if (phase === 'waiting') playSound(startSound);
    phase = 'playing';
    say('Hold an arrow key to fly.');
    handOverToTheGame();
  }
  updateCurtain(false);
});

againBtn.addEventListener('click', () => {
  resetGame();
  phase = 'playing';
  playSound(startSound);
  say('A fresh cave. Hold an arrow key to fly.');
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
function standInForYourFunctions() {
  checkYourFunctions();

  if (missing.toScreen) {
    toScreen = (worldX, worldY) => ({ x: worldX - camera.x, y: worldY - camera.y });
  }
  if (missing.steerShip) {
    steerShip = (theKeys) => {
      if (theKeys.left.isDown) ship.vx = -SIDE_SPEED;
      else if (theKeys.right.isDown) ship.vx = SIDE_SPEED;
      else ship.vx = 0;
      ship.thrust = theKeys.up.isDown;
    };
  }
  if (missing.flyShip) {
    flyShip = (seconds) => {
      ship.vy += GRAVITY * seconds;
      if (ship.thrust) ship.vy -= THRUST * seconds;
      ship.vy = Phaser.Math.Clamp(ship.vy, -TOP_SPEED, TOP_SPEED);
      ship.x += ship.vx * seconds;
      ship.y += ship.vy * seconds;
    };
  }
  if (missing.aimCamera) {
    aimCamera = () => {
      camera.x = Phaser.Math.Clamp(ship.x - WIDTH / 2, 0, WORLD_WIDTH - WIDTH);
      camera.y = Phaser.Math.Clamp(ship.y - HEIGHT / 2, 0, WORLD_HEIGHT - HEIGHT);
    };
  }
  if (missing.isOnScreen) {
    isOnScreen = (worldX, worldY) => {
      const spot = toScreen(worldX, worldY);
      return spot.x > -TILE && spot.x < WIDTH + TILE && spot.y > -TILE && spot.y < HEIGHT + TILE;
    };
  }
  if (missing.isRock) {
    isRock = (worldX, worldY) => {
      const col = Math.floor(worldX / TILE);
      const row = Math.floor(worldY / TILE);
      if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return true;
      return grid[row][col] === '#';
    };
  }
  if (missing.shipHitsRock) {
    shipHitsRock = () => {
      const left = ship.x - SHIP_W / 2;
      const right = ship.x + SHIP_W / 2;
      const top = ship.y - SHIP_H / 2;
      const bottom = ship.y + SHIP_H / 2;
      return isRock(left, top) || isRock(right, top) || isRock(left, bottom) || isRock(right, bottom);
    };
  }

  checkYourFunctions();
}

/* Take away every crystal before this world x, as if you had flown
   past and picked them up. */
function takeCrystalsBefore(worldX) {
  for (let i = crystals.length - 1; i >= 0; i -= 1) {
    if (crystals[i].x > worldX) continue;
    crystals[i].sprite.destroy();
    things.splice(things.indexOf(crystals[i]), 1);
    crystals.splice(i, 1);
    score += CRYSTAL_POINTS;
  }
}

function setUpDemo() {
  /* Half way along the cave, with the first lamp lit and the crystals
     before it picked up. */
  const lamp = lamps[0];
  lamp.lit = true;
  lamp.sprite.setTexture('lamp-lit');
  restart = lamp.restart;
  takeCrystalsBefore(lamp.x);
  putShipBack();

  if (location.hash === '#demo-over') {
    lives = 0;
    crashing = true;
    phase = 'over';
    updateCurtain(false);
    say('Demo: the game after the last ship crashed.');
    return;
  }

  lives = 2;
  phase = 'playing';
  updateCurtain(false);
  say('Demo: the finished game. Hold an arrow key to fly.');
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the functions you have to write.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- toScreen(worldX, worldY) ---

     return {
       x: worldX - camera.x,
       y: worldY - camera.y
     };


   --- steerShip(keys) ---

     if (keys.left.isDown) ship.vx = -SIDE_SPEED;
     else if (keys.right.isDown) ship.vx = SIDE_SPEED;
     else ship.vx = 0;

     ship.thrust = keys.up.isDown;


   --- flyShip(seconds) ---

     ship.vy += GRAVITY * seconds;
     if (ship.thrust) ship.vy -= THRUST * seconds;
     ship.vy = Phaser.Math.Clamp(ship.vy, -TOP_SPEED, TOP_SPEED);

     ship.x += ship.vx * seconds;
     ship.y += ship.vy * seconds;


   --- aimCamera() ---

     camera.x = Phaser.Math.Clamp(ship.x - WIDTH / 2, 0, WORLD_WIDTH - WIDTH);
     camera.y = Phaser.Math.Clamp(ship.y - HEIGHT / 2, 0, WORLD_HEIGHT - HEIGHT);


   --- isOnScreen(worldX, worldY) ---

     const spot = toScreen(worldX, worldY);
     return spot.x > -TILE && spot.x < WIDTH + TILE
       && spot.y > -TILE && spot.y < HEIGHT + TILE;


   --- isRock(worldX, worldY) ---

     const col = Math.floor(worldX / TILE);
     const row = Math.floor(worldY / TILE);
     if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return true;
     return grid[row][col] === '#';


   --- shipHitsRock() ---

     const left = ship.x - SHIP_W / 2;
     const right = ship.x + SHIP_W / 2;
     const top = ship.y - SHIP_H / 2;
     const bottom = ship.y + SHIP_H / 2;

     return isRock(left, top) || isRock(right, top)
       || isRock(left, bottom) || isRock(right, bottom);

   --------------------------------------------------------------------- */
