/* =====================================================================
   Rooftop Run. The first game that builds itself, and never ends.

   You are a courier running across the rooftops at sunset. You never
   stop, and you never slow down. All you can do is jump. Crates,
   vents and stacked boxes are in the way, and they keep coming.

   Every game before this one was finished when you wrote it. The cave
   in project 12 was 72 columns long, typed out by hand, with an end
   you could reach. This one has no map at all. The rooftops in front
   of you do not exist until a moment before you get there, and the
   ones behind you are thrown away.

   Two new ideas, and they are the whole project:

       1. A world that is made while you play, just ahead of the
          window, and forgotten just behind it.

       2. A best score that is still there tomorrow, because the
          browser wrote it down.

   Write the functions in this order:
      1. runSpeed            how fast the runner is going by now
      2. startJump           the jump key, and the one rule about it
      3. nextGap             how far along to put the next obstacle
      4. pickObstacle        what that obstacle is
      5. growTheWorld        keep the world built ahead of the window
      6. forgetOldObstacles  throw away what is behind you
      7. loadRecord          read the saved best score
      8. saveRecord          write it down

   Each one changes something you can see. Do them in order.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   The numbers first, then the kinds of obstacle, then the things that
   change while you run.
   --------------------------------------------------------------------- */

const WIDTH = 1024;                // the window is always this wide, whatever size it looks
const HEIGHT = 768;                // and always this tall
const GROUND_Y = 560;              // the top of the rooftop, in world pixels
const RUNNER_SCREEN_X = 250;       // the runner stays this far from the left edge of the window

const RUN_W = 40;                  // the runner's box, for touching an obstacle. It is a
const RUN_H = 56;                  // little smaller than the picture, so a near miss is a miss
const ROOF_CENTRE = GROUND_Y - RUN_H / 2;   // the runner's y while his feet are on the roof

const GRAVITY = 2000;              // every second, the runner falls this much faster
const JUMP_SPEED = 900;            // a jump starts by throwing him upwards this fast

const START_SPEED = 300;           // pixels a second at the start of a run
const SPEED_GROWTH = 0.01;         // and this much faster for every pixel he has run
const TOP_SPEED = 700;             // he never goes faster than this

const START_GAP_TIME = 1.55;       // seconds between obstacles at the start of a run
const MIN_GAP_TIME = 1.05;         // they never get closer together than this
const GAP_QUICKEN = 0.0000125;     // and they close up by this much for every pixel run
const GAP_SPREAD = 0.85;           // up to this many seconds of extra gap, picked at random

const AHEAD = WIDTH;               // build the world this far past the right edge of the window
const BEHIND = 200;                // forget an obstacle once it is this far past the left edge

const METRE = 32;                  // 32 pixels of rooftop is one metre on the readout

/* The kinds of obstacle, written as data rather than as code. Each one
   says what picture to use, how big its box is, and how far into a run
   it starts turning up.

   A table like this is worth more than it looks. Adding a fourth kind
   of obstacle is one more line here, and no change anywhere else. */
const KINDS = [
  { name: 'crate', w: 48,  h: 48, from: 0 },     // a single box. Easy.
  { name: 'vent',  w: 112, h: 48, from: 250 },   // low but wide. You have to jump early.
  { name: 'stack', w: 48,  h: 96, from: 600 }    // two boxes. The tall one.
];

/* The runner. x and y are the middle of him, in world pixels. `vy` is
   how fast he is moving up or down, the way every moving thing has
   kept its speed since project 7. */
const runner = { x: 0, y: ROOF_CENTRE, vy: 0, onRoof: true };

/* Everything in the way, in the order it was made. Each one is

       { kind, x, y, w, h, sprite }

   with x and y in world pixels, exactly the shape of object project 8
   used for its sprites. */
let obstacles = [];

let distance = 0;                  // how far this run has gone, in world pixels
let builtTo = 0;                   // the world x of the last obstacle put down

/* The record the browser keeps for you. `best` is your best run in
   metres, and `runs` counts how many times you have played. */
let record = { best: 0, runs: 0 };

/* The name the browser files that record under. Give it something
   nobody else will use. */
const RECORD_KEY = 'rooftop-run';


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Eight small functions, top to bottom.

   Each one gives you two hints. Read the gentle one first. All the
   answers sit in one block at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * How fast is the runner going, after running `distance` pixels?
 *
 * This is the difficulty curve, and it is one line. He starts at
 * START_SPEED. Every pixel he runs adds a tiny bit, SPEED_GROWTH. And
 * he never goes faster than TOP_SPEED, or the game becomes silly.
 *
 * SPEED_GROWTH is 0.01, which looks far too small to matter. It is not.
 * After 10000 pixels it has added 100 pixels a second. After 40000 it
 * has run out of room, and TOP_SPEED takes over.
 *
 * `Math.min` picks the smaller of two numbers, which is how you put a
 * lid on something. You used it on the elevator and on the swarm.
 *
 * Hand back the speed in pixels per second.
 *
 * Gentle hint: start at START_SPEED, add a little for every pixel run,
 *   then put a lid on the answer.
 * Stronger hint: `return Math.min(START_SPEED + distance * SPEED_GROWTH, TOP_SPEED);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press Enter. The runner sets off, the rooftop scrolls past, and the
 * Speed marker on the rack leaves the left-hand end.
 */
function runSpeed(distance) {
  // TODO: a starting speed, a little more for every pixel, and a lid.
}

/**
 * The jump key has just been pressed. Decide what that means.
 *
 * A jump is one line. Throw the runner upwards by setting his speed to
 * minus JUMP_SPEED, because y grows downwards:
 *
 *     runner.vy = -JUMP_SPEED;
 *
 * But there is a rule, and the rule is the point of this function. He
 * may only jump when his feet are on the roof. `runner.onRoof` is
 * already true or false, and the wiring keeps it up to date.
 *
 * Leave the rule out and the game still works. It just lets you press
 * the key again in mid air, and again, and fly over everything. Try it
 * once on purpose, then put the rule back.
 *
 * Gravity is not your job here. The wiring already pulls him down and
 * stands him back on the roof.
 *
 * Gentle hint: check `runner.onRoof` first, and do nothing if he is in
 *   the air.
 * Stronger hint: `if (!runner.onRoof) return;` then the one line above.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press the up arrow. He jumps, the In the air lamp comes on, and a
 * puff of dust appears where he lands.
 */
function startJump() {
  // TODO: only from the roof, then throw him upwards.
}

/**
 * How far along should the next obstacle go?
 *
 * The honest way to space obstacles is in seconds, not in pixels. The
 * runner speeds up all run, so 500 pixels is a comfortable gap at the
 * start and an impossible one later.
 *
 * So work out how many seconds of running the gap should be, and turn
 * that into pixels with the speed. That is `speed × seconds` again,
 * the rule from project 7, used to build the world instead of to move
 * something through it.
 *
 * The seconds come from three numbers:
 *
 *     START_GAP_TIME   the gap at the very start of a run
 *     GAP_QUICKEN      how much closer they get for every pixel run
 *     MIN_GAP_TIME     they never get closer together than this
 *
 * That is the same shape as `runSpeed`, with `Math.max` instead of
 * `Math.min`, because this number shrinks instead of growing.
 *
 * Then add some randomness, or every run looks the same. `Math.random()`
 * gives a number from 0 up to 1, so `Math.random() * GAP_SPREAD` is up
 * to GAP_SPREAD extra seconds.
 *
 * Hand back a number of pixels.
 *
 * Gentle hint: work out the seconds first, add a random extra, then
 *   multiply the lot by `runSpeed(distance)`.
 * Stronger hint: `const seconds = Math.max(MIN_GAP_TIME, START_GAP_TIME - distance * GAP_QUICKEN);`
 *   then `return runSpeed(distance) * (seconds + Math.random() * GAP_SPREAD);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Gap on the rack stops showing a dash and starts showing a number
 * that changes every time it is asked.
 */
function nextGap(distance) {
  // TODO: seconds of gap, a random extra, then seconds into pixels.
}

/**
 * Make one obstacle, to stand at `worldX`.
 *
 * `kindsAllowed(distance)` is already written, down in the wiring. It
 * hands you the list of kinds that have started turning up by now: one
 * kind at the start of a run, two after 250 metres, three after 600.
 * That is the difficulty curve again, in a second place.
 *
 * Pick one of them at random. Phaser has a helper for exactly this:
 *
 *     Phaser.Utils.Array.GetRandom(theList)
 *
 * Then hand back the obstacle as an object. The wiring needs all five
 * of these:
 *
 *     kind    the kind's name, which is also the name of its picture
 *     x       worldX, where it is standing
 *     y       the middle of it
 *     w, h    its box, straight off the kind
 *
 * x and y are the middle of the picture, as they have been since
 * project 8. The obstacle stands on the roof, so its middle is half
 * its height above the roof: `GROUND_Y - kind.h / 2`.
 *
 * Nothing appears on screen yet. The wiring puts the picture there,
 * and `growTheWorld` is what calls you.
 *
 * Gentle hint: one line to pick a kind, then one object with five
 *   things in it.
 * Stronger hint: `const kind = Phaser.Utils.Array.GetRandom(kindsAllowed(distance));`
 *   then `return { kind: kind.name, x: worldX, y: GROUND_Y - kind.h / 2, w: kind.w, h: kind.h };`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Kind on the rack stops showing a dash and starts naming a real
 * obstacle.
 */
function pickObstacle(worldX, distance) {
  // TODO: pick a kind that is allowed, then describe one of them.
}

/**
 * Keep the world built, just ahead of the window.
 *
 * This is the idea the project exists to teach. A game with no end
 * cannot have its world written down in advance, because there is no
 * end to write. So it makes the world a little at a time, always just
 * out of sight, and the player never catches it happening.
 *
 * `builtTo` is the world x of the last obstacle put down. Two helpers
 * in the wiring tell you where the window is:
 *
 *     whereTheWindowStarts()   the world x of the left edge
 *     whereTheWindowEnds()     the world x of the right edge
 *
 * So: if `builtTo` is already more than AHEAD past the right edge,
 * there is nothing to do this frame. Stop.
 *
 * Otherwise, move `builtTo` along by your own `nextGap(distance)`, and
 * put an obstacle there with your own `pickObstacle`. `addObstacle`
 * is in the wiring, and it makes the picture for you:
 *
 *     addObstacle(pickObstacle(builtTo, distance));
 *
 * One obstacle a frame is plenty. The frames go past sixty times a
 * second, and the wiring calls this function forty times before a run
 * starts, so the first rooftops are ready before you see them.
 *
 * Gentle hint: an `if` that gives up early, then two lines.
 * Stronger hint: `if (builtTo > whereTheWindowEnds() + AHEAD) return;`
 *   then `builtTo += nextGap(distance);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * The rooftops fill up with crates, and the run becomes a game.
 */
function growTheWorld() {
  // TODO: stop if the world is built far enough, or put one more down.
}

/**
 * Throw away the obstacles that are behind you.
 *
 * You have already run past them. They can never be jumped, drawn or
 * touched again, and they are still in the list, and the list is still
 * growing. Watch Obstacles in memory on the rack climb: 20, 60, 200.
 * A game left running all afternoon would fill the computer.
 *
 * An obstacle is finished when it is BEHIND pixels past the left edge
 * of the window. `whereTheWindowStarts()` gives you that edge.
 *
 * `removeObstacle(i)` is in the wiring. It throws away the picture and
 * takes the obstacle out of the list.
 *
 * Count backwards through the list. Taking a thing out moves everything
 * after it down one, which is why project 7 counted its darts
 * backwards and every list since has done the same.
 *
 * Gentle hint: a backwards loop, one `if` about x, and `removeObstacle`.
 * Stronger hint: `for (let i = obstacles.length - 1; i >= 0; i -= 1) {`
 *   then `if (obstacles[i].x < whereTheWindowStarts() - BEHIND) removeObstacle(i);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Obstacles in memory stops climbing and settles at about eight.
 * Behind, underneath it, stays at zero or one.
 */
function forgetOldObstacles() {
  // TODO: count backwards, and throw away anything past the left edge.
}

/**
 * Read the record the browser saved last time.
 *
 * This is the first time a program of yours remembers anything after
 * the page closes. `localStorage` is a small notebook the browser
 * keeps for each page. It holds text, and nothing else:
 *
 *     localStorage.setItem('name', 'some text')     writes it down
 *     localStorage.getItem('name')                  reads it back
 *
 * It hands back `null` if nothing was ever written under that name.
 * That happens the very first time anybody plays, so this function has
 * to cope with it. Hand back a fresh record when it does:
 *
 *     { best: 0, runs: 0 }
 *
 * Our record is an object, not text, so it cannot go in as it is.
 * `JSON.parse` turns the saved text back into the object:
 *
 *     JSON.parse('{"best":812,"runs":14}')     is  { best: 812, runs: 14 }
 *
 * JSON is a way of writing an object down as text. Programs use it
 * every time they save something or send it somewhere. Project 15 uses
 * it again, to talk to a server.
 *
 * Use RECORD_KEY as the name. Hand back an object with a `best` and a
 * `runs` in it, whatever happens.
 *
 * Gentle hint: read the text, deal with `null` first, then parse it.
 * Stronger hint: `const saved = localStorage.getItem(RECORD_KEY);` then
 *   `if (saved === null) return { best: 0, runs: 0 };`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Best on the plate stops showing a dash. It still says 0, because
 * nothing has been saved yet. That is the next function.
 */
function loadRecord() {
  // TODO: read the text, cope with nothing being there, then parse it.
}

/**
 * Write the record down, so it is still there tomorrow.
 *
 * The wiring calls this at the end of every run, with the record
 * already brought up to date.
 *
 * It is the other half of `loadRecord`. `localStorage` only holds
 * text, so turn the object into text first. `JSON.stringify` is
 * `JSON.parse` backwards:
 *
 *     JSON.stringify({ best: 812, runs: 14 })     is  '{"best":812,"runs":14}'
 *
 * Use the same RECORD_KEY, or you will write the record somewhere
 * `loadRecord` never looks.
 *
 * Gentle hint: one line. Turn it into text, and set it under the key.
 * Stronger hint: `localStorage.setItem(RECORD_KEY, JSON.stringify(record));`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Beat your best, then press the refresh button in the browser. The
 * score is still there. Nothing you have written before this has ever
 * survived a refresh.
 */
function saveRecord(record) {
  // TODO: object into text, text into the browser's notebook.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is finished already. It sets Phaser up, loads the
   pictures, runs the clock, reads the keys, draws the rooftops and
   keeps the rack up to date.

   Read it, because it shows you where your eight functions get used.
   Do not change it.
   --------------------------------------------------------------------- */

const distReadEl = document.getElementById('distRead');
const bestReadEl = document.getElementById('bestRead');
const metreReadEl = document.getElementById('metreRead');
const speedReadEl = document.getElementById('speedRead');
const speedMarkEl = document.getElementById('speedMark');
const roofLampEl = document.getElementById('roofLamp');
const airLampEl = document.getElementById('airLamp');
const gapReadEl = document.getElementById('gapRead');
const kindReadEl = document.getElementById('kindRead');
const memReadEl = document.getElementById('memRead');
const aheadReadEl = document.getElementById('aheadRead');
const behindReadEl = document.getElementById('behindRead');
const recBestEl = document.getElementById('recBest');
const recRunsEl = document.getElementById('recRuns');
const recNoteEl = document.getElementById('recNote');
const screenEl = document.getElementById('screen');
const startBtn = document.getElementById('start');
const againBtn = document.getElementById('again');
const statusEl = document.getElementById('status');

/* The sounds. The same pattern as every project since the calculator:
   one Audio object per sound, made once and used again. */
const startSound = new Audio('assets/start.wav');
const jumpSound = new Audio('assets/jump.wav');
const crashSound = new Audio('assets/crash.wav');
const bestSound = new Audio('assets/best.wav');
const overSound = new Audio('assets/over.wav');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* Things the game needs that are not part of the game itself. */
const DEMO = location.hash === '#demo' || location.hash === '#demo-over';
const FORGIVE = 7;               // this much of each box is given away, so a near miss is a miss
const PRIME = 40;                // how many times growTheWorld is called before a run starts

let scene = null;                // the one scene, once Phaser has built it
let keys = null;                 // the arrow keys and the space bar
let sky = null;                  // the four layers behind and under the runner
let farCity = null;
let nearCity = null;
let roofBand = null;
let runnerSprite = null;
let curtain = null;              // the card before and after a run
let phase = 'waiting';           // 'waiting', 'playing', 'paused' or 'over'
let crashed = false;             // true once this run has ended in a crash
let stepTimer = 0;               // swaps the two running pictures over
let stepFrame = true;
let sampleClock = 0;             // the rack asks nextGap and pickObstacle twice a second
let gapSample = null;
let kindSample = null;
let ahead = 0;                   // how many obstacles are in front of the window
let behind = 0;                  // and how many are behind it
let storageWorks = true;         // some browsers refuse to save on a double-clicked page
let newBest = false;
let message = '';

/* One flag per function you have to write. The wiring sets these as it
   goes, and the line under the screen reads them. */
const missing = {
  runSpeed: false,
  startJump: false,
  nextGap: false,
  pickObstacle: false,
  growTheWorld: false,
  forgetOldObstacles: false,
  loadRecord: false,
  saveRecord: false
};

function say(text) {
  if (text === message) return;
  message = text;
  statusEl.textContent = text;
}

/* --- Small helpers --- */

/* The world x of the two edges of the window. Phaser's camera knows
   where it is looking, and `scrollX` is the world x of its left edge.

   In project 12 you did this subtraction yourself, for every picture
   in the cave. Phaser has a camera that does it for you, and this
   project lets it. That is why `toScreen` is nowhere in this file. */
function whereTheWindowStarts() {
  return scene === null ? 0 : scene.cameras.main.scrollX;
}

function whereTheWindowEnds() {
  return whereTheWindowStarts() + WIDTH;
}

/* The kinds of obstacle that have started turning up by now. */
function kindsAllowed(distance) {
  const metres = distance / METRE;
  return KINDS.filter((kind) => metres >= kind.from);
}

/* Did `pickObstacle` hand back something the wiring can use? */
function isObstacle(thing) {
  return thing !== null && typeof thing === 'object'
    && typeof thing.x === 'number' && typeof thing.y === 'number'
    && typeof thing.w === 'number' && typeof thing.h === 'number'
    && typeof thing.kind === 'string';
}

/* And did `loadRecord` hand back a record? */
function isRecord(thing) {
  return thing !== null && typeof thing === 'object'
    && typeof thing.best === 'number' && typeof thing.runs === 'number';
}

function metresNow() {
  return Number.isFinite(distance) ? Math.floor(distance / METRE) : 0;
}

/* Put one obstacle into the world, with a picture to match. Your
   `growTheWorld` calls this. */
function addObstacle(obstacle) {
  if (!isObstacle(obstacle)) return;
  obstacle.sprite = scene.add.image(obstacle.x, obstacle.y, obstacle.kind).setDepth(0);
  obstacles.push(obstacle);
}

/* Take obstacle number `i` out of the world. Your `forgetOldObstacles`
   calls this. */
function removeObstacle(i) {
  if (i < 0 || i >= obstacles.length) return;
  obstacles[i].sprite.destroy();
  obstacles.splice(i, 1);
}

/* Two boxes touching, which is project 8's rule and has not changed.
   FORGIVE shaves a little off both boxes, so a jump that only just
   clears a crate counts as clearing it. */
function hitsRunner(obstacle) {
  return Math.abs(runner.x - obstacle.x) * 2 < RUN_W + obstacle.w - FORGIVE * 2
    && Math.abs(runner.y - obstacle.y) * 2 < RUN_H + obstacle.h - FORGIVE * 2;
}

/* --- Setting Phaser up ---

   The same three functions as projects 9 to 12. `preload` fetches the
   pictures, `create` builds the scene once, and `update` runs every
   frame. */
new Phaser.Game({
  /* Both of these settings are here to keep the page double-clickable,
     and project 9 explains them. */
  type: Phaser.CANVAS,
  canvas: document.getElementById('screen'),
  width: WIDTH,
  height: HEIGHT,
  /* Every picture lands on a whole pixel, so no thin lines open up
     between the roof tiles. */
  render: { roundPixels: true },
  scene: { preload: preload, create: create, update: update },
  loader: { imageLoadType: 'HTMLImageElement' }
});

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('city-far', 'assets/city-far.png');
  this.load.image('city-near', 'assets/city-near.png');
  this.load.image('roof', 'assets/roof.png');
  this.load.image('run1', 'assets/run1.png');
  this.load.image('run2', 'assets/run2.png');
  this.load.image('jump', 'assets/jump.png');
  this.load.image('crate', 'assets/crate.png');
  this.load.image('stack', 'assets/stack.png');
  this.load.image('vent', 'assets/vent.png');
  this.load.image('puff', 'assets/puff.png');
}

function create() {
  scene = this;

  /* Four layers behind the runner, and none of them scrolls with the
     world. They are stuck to the window, and slid along by hand in
     `drawWorld` instead.

     The two rows of buildings slide more slowly than the roof. Far
     things look slower than near ones, which is what makes the city
     look deep. It was a good thing to try at the end of project 12,
     and here it is, given. */
  sky = this.add.image(0, 0, 'sky').setOrigin(0, 0).setScrollFactor(0).setDepth(-30);
  farCity = this.add.tileSprite(0, 260, WIDTH, 300, 'city-far')
    .setOrigin(0, 0).setScrollFactor(0).setDepth(-25);
  nearCity = this.add.tileSprite(0, 330, WIDTH, 260, 'city-near')
    .setOrigin(0, 0).setScrollFactor(0).setDepth(-20);
  roofBand = this.add.tileSprite(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y, 'roof')
    .setOrigin(0, 0).setScrollFactor(0).setDepth(-10);

  keys = this.input.keyboard.createCursorKeys();

  runnerSprite = this.add.image(0, 0, 'run1').setDepth(5);

  buildCurtain(this);
  seeWhetherTheBrowserWillSave();
  resetRun();

  if (DEMO) {
    standInForYourFunctions();
    setUpDemo();
    return;
  }

  readTheRecord();
  say(missing.runSpeed
    ? 'Press Enter. The runner stays put until runSpeed() tells him how fast to go.'
    : 'Press Enter to run.');
}

/* One step of the game.

   Phaser hands you the time since the last frame, in milliseconds.
   Dividing by 1000 gives the `seconds` you have used since project 7. */
function update(time, delta) {
  /* A frame longer than a twentieth of a second is cut short, so a
     browser that stalls for a moment cannot throw the runner through
     a crate. */
  const seconds = Math.min(delta / 1000, 0.05);

  if (phase === 'playing') {
    if (jumpPressed()) {
      const wasOnRoof = runner.onRoof;
      startJump();
      if (wasOnRoof && runner.vy < 0) {
        playSound(jumpSound);
        puff(this);
      }
    }
    runOneFrame(this, seconds);
  }

  drawWorld();
  updateRack(seconds);
}

function jumpPressed() {
  return Phaser.Input.Keyboard.JustDown(keys.up) || Phaser.Input.Keyboard.JustDown(keys.space);
}

/* Everything that happens in one frame of running, in order. */
function runOneFrame(aScene, seconds) {
  checkYourFunctions();

  /* Your speed, used for real. An empty `runSpeed` hands back nothing,
     which is not a number, so nobody moves. */
  const speed = runSpeed(distance);
  if (Number.isFinite(speed)) {
    runner.x += speed * seconds;
    distance += speed * seconds;
    stepTimer += seconds * speed / START_SPEED;
    if (stepTimer > 0.16) {
      stepTimer = 0;
      stepFrame = !stepFrame;
    }
  }

  /* Gravity, and the roof under his feet. Project 7 wrote this line,
     and project 12 used it again, so this time it is given. */
  const wasInTheAir = !runner.onRoof;
  runner.vy += GRAVITY * seconds;
  runner.y += runner.vy * seconds;
  if (runner.y >= ROOF_CENTRE) {
    runner.y = ROOF_CENTRE;
    runner.vy = 0;
    runner.onRoof = true;
    if (wasInTheAir) puff(aScene);
  } else {
    runner.onRoof = false;
  }

  /* Phaser's camera, told once a frame where to look. */
  aScene.cameras.main.setScroll(runner.x - RUNNER_SCREEN_X, 0);

  /* A `nextGap` that goes wrong can leave `builtTo` as NaN, and NaN
     never compares bigger or smaller than anything, so the world would
     stop growing for ever. Put it back where the runner is. */
  if (!Number.isFinite(builtTo)) builtTo = runner.x + WIDTH;

  growTheWorld();
  missing.growTheWorld = obstacles.length === 0;

  forgetOldObstacles();
  countTheList();
  missing.forgetOldObstacles = behind > 6;

  for (const obstacle of obstacles) {
    if (hitsRunner(obstacle) === true) {
      crash(aScene);
      return;
    }
  }

  reportEmptyFunctions();
}

/* How many obstacles are in front of the window, and how many behind.
   The rack shows both, because the one behind is the one your
   `forgetOldObstacles` is supposed to be throwing away. */
function countTheList() {
  const left = whereTheWindowStarts();
  ahead = 0;
  behind = 0;
  for (const obstacle of obstacles) {
    if (obstacle.x < left) behind += 1;
    else ahead += 1;
  }
}

/* --- Checking your functions ---

   Each of your functions is asked one question, with an answer that
   cannot be argued with. The runner is put back exactly as he was
   afterwards, so the checks never move anybody.

   `growTheWorld` and `forgetOldObstacles` are not asked anything. They
   change the world, so asking them a question would change it too.
   Those two are judged on what the list looks like after they have
   run, up in `runOneFrame`. */
function checkYourFunctions() {
  missing.runSpeed = !Number.isFinite(runSpeed(0));

  const was = Object.assign({}, runner);
  runner.onRoof = true;
  runner.vy = 0;
  startJump();
  missing.startJump = !(runner.vy < 0);
  Object.assign(runner, was);

  const gap = nextGap(distance);
  missing.nextGap = !Number.isFinite(gap) || gap <= 0;

  missing.pickObstacle = !isObstacle(pickObstacle(0, distance));
}

/* The two record functions are checked on their own, and only when a
   run starts or ends. Writing to the browser's notebook sixty times a
   second would be rude. */
function checkTheRecordFunctions() {
  missing.loadRecord = !isRecord(loadRecord());

  if (!storageWorks) {
    missing.saveRecord = false;
    return;
  }

  /* Ask `saveRecord` to write a record that could never be real, and
     see whether it turns up. Whatever was there before is put back
     afterwards, so this never costs you your best score. */
  let before = null;
  try {
    before = localStorage.getItem(RECORD_KEY);
    saveRecord({ best: -1, runs: -1 });
    const after = localStorage.getItem(RECORD_KEY);
    missing.saveRecord = after === null || after === before;
    if (before === null) localStorage.removeItem(RECORD_KEY);
    else localStorage.setItem(RECORD_KEY, before);
  } catch (error) {
    missing.saveRecord = false;
    storageWorks = false;
  }
}

/* Will this browser let the page save anything at all? A few of them
   refuse on a page opened by double-clicking. That is the browser's
   rule, not a mistake of yours, so the rack says so out loud. */
function seeWhetherTheBrowserWillSave() {
  try {
    localStorage.setItem(RECORD_KEY + '-test', '1');
    localStorage.removeItem(RECORD_KEY + '-test');
    storageWorks = true;
  } catch (error) {
    storageWorks = false;
  }
}

function readTheRecord() {
  checkTheRecordFunctions();
  const got = loadRecord();
  record = isRecord(got) ? got : { best: 0, runs: 0 };
}

/* --- Starting a run --- */

function resetRun() {
  for (const obstacle of obstacles) obstacle.sprite.destroy();
  obstacles = [];

  runner.x = 0;
  runner.y = ROOF_CENTRE;
  runner.vy = 0;
  runner.onRoof = true;
  distance = 0;
  crashed = false;
  newBest = false;
  builtTo = runner.x + WIDTH * 0.8;

  if (scene !== null) scene.cameras.main.setScroll(runner.x - RUNNER_SCREEN_X, 0);

  /* Build the first rooftops before anybody sees them. Your
     `growTheWorld` puts down one obstacle per call, so it is called a
     good few times here. */
  for (let i = 0; i < PRIME; i += 1) {
    if (!Number.isFinite(builtTo)) break;
    growTheWorld();
  }
  countTheList();
}

/* --- What happens as you run --- */

function crash(aScene) {
  crashed = true;
  phase = 'over';
  playSound(crashSound);
  burst(aScene, runner.x, runner.y);
  aScene.cameras.main.shake(240, 0.011);
  endTheRun(aScene);
}

function endTheRun(aScene) {
  const metres = metresNow();
  newBest = metres > record.best;

  record.runs += 1;
  if (newBest) record.best = metres;

  /* The demo is a picture of a finished game, so it never writes over
     a real best score. */
  if (!DEMO) {
    if (storageWorks) saveRecord(record);
    checkTheRecordFunctions();
  }

  updateCurtain();
  say(newBest
    ? 'A new best: ' + metres + ' metres. Press Run again.'
    : metres + ' metres. Your best is ' + record.best + '. Press Run again.');

  aScene.time.delayedCall(520, () => {
    if (phase !== 'over') return;
    playSound(newBest ? bestSound : overSound);
  });
}

/* A puff of dust under the runner's feet, at a take-off and a landing.
   It lives in the world, so it slides backwards with the rooftop. */
function puff(aScene) {
  const dust = aScene.add.image(runner.x - 10, GROUND_Y - 6, 'puff').setDepth(3);
  aScene.tweens.add({
    targets: dust,
    x: dust.x - 60,
    scale: 1.7,
    alpha: 0,
    duration: 420,
    ease: 'Cubic.easeOut',
    onComplete: () => dust.destroy()
  });
}

/* The crash: an orange ring that grows and fades. */
function burst(aScene, x, y) {
  const ring = aScene.add.circle(x, y, 26, 0xe8552f).setDepth(6);
  aScene.tweens.add({
    targets: ring,
    scale: 2.8,
    alpha: 0,
    duration: 560,
    ease: 'Cubic.easeOut',
    onComplete: () => ring.destroy()
  });
}

/* --- Drawing --- */
function drawWorld() {
  const scroll = whereTheWindowStarts();

  /* The parallax. The far buildings slide a quarter as fast as the
     roof, the near ones half as fast. */
  farCity.tilePositionX = scroll * 0.25;
  nearCity.tilePositionX = scroll * 0.5;
  roofBand.tilePositionX = scroll;

  runnerSprite.setVisible(!crashed);
  if (crashed) return;

  runnerSprite.setPosition(runner.x, Number.isFinite(runner.y) ? runner.y : ROOF_CENTRE);
  if (!runner.onRoof) runnerSprite.setTexture('jump');
  else runnerSprite.setTexture(stepFrame ? 'run1' : 'run2');
}

function reportEmptyFunctions() {
  if (missing.runSpeed) say('runSpeed() is still empty, so the runner never sets off.');
  else if (missing.startJump) say('startJump() is still empty, so the jump key does nothing.');
  else if (missing.nextGap) say('nextGap() is still empty, so nothing knows how far apart the obstacles go.');
  else if (missing.pickObstacle) say('pickObstacle() is still empty, so there is nothing to put in the world.');
  else if (missing.growTheWorld) say('growTheWorld() is still empty, so the rooftops stay bare.');
  else if (missing.forgetOldObstacles) say('forgetOldObstacles() is still empty, so the list only ever grows.');
  else if (missing.loadRecord) say('loadRecord() is still empty, so the best score starts at nothing every time.');
  else if (missing.saveRecord) say('saveRecord() is still empty, so a best score is lost on the next refresh.');
  else say(runLine());
}

function runLine() {
  const metres = metresNow();
  if (metres < 5) return 'Up or space to jump.';
  return metres + ' metres. Best ' + record.best + '.';
}

/* --- The card over the screen --- */
function buildCurtain(aScene) {
  const display = "'Impact', 'Haettenschweiler', 'Trebuchet MS', sans-serif";
  const label = "'Trebuchet MS', sans-serif";
  const back = aScene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x1b1030, 0.74)
    .setOrigin(0, 0).setScrollFactor(0);
  const title = aScene.add.text(WIDTH / 2, 286, '', {
    fontFamily: display, fontSize: '62px', color: '#ffb03a'
  }).setOrigin(0.5).setScrollFactor(0);
  const lines = aScene.add.text(WIDTH / 2, 382, '', {
    fontFamily: label, fontSize: '26px', color: '#fff3df', align: 'center'
  }).setOrigin(0.5).setLineSpacing(14).setScrollFactor(0);
  const key = aScene.add.text(WIDTH / 2, 476, '', {
    fontFamily: label, fontSize: '26px', color: '#2fd4c9'
  }).setOrigin(0.5).setScrollFactor(0);

  curtain = {
    group: aScene.add.container(0, 0, [back, title, lines, key]).setDepth(20).setScrollFactor(0),
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
    curtain.title.setText('ROOFTOP RUN');
    curtain.lines.setText('Up or space to jump. You never stop running.\nThe rooftops are built as you go, and they never run out.');
    curtain.key.setText('Press Enter');
  } else if (phase === 'paused') {
    curtain.title.setText('PAUSED');
    curtain.lines.setText('');
    curtain.key.setText('');
  } else if (phase === 'over') {
    curtain.title.setText(newBest ? 'NEW BEST' : 'YOU TRIPPED');
    curtain.lines.setText(metresNow() + ' metres\nbest ' + record.best + ' · run ' + record.runs);
    curtain.key.setText('Press Run again');
  }
}

/* --- The rack down the side --- */
function updateRack(seconds) {
  const metres = metresNow();
  distReadEl.textContent = metres;
  metreReadEl.textContent = metres;
  bestReadEl.textContent = record.best;
  recBestEl.textContent = missing.loadRecord ? '—' : record.best;
  recRunsEl.textContent = missing.loadRecord ? '—' : record.runs;

  const speed = runSpeed(distance);
  speedReadEl.textContent = Number.isFinite(speed) ? Math.round(speed) : '—';
  showSpeed(speed);

  roofLampEl.className = runner.onRoof ? 'lamp lamp-roof' : 'lamp';
  airLampEl.className = runner.onRoof ? 'lamp' : 'lamp lamp-air';

  /* The rack asks your `nextGap` and `pickObstacle` twice a second,
     just to show you what they are saying. Their answers change every
     time, because both of them use `Math.random`. */
  sampleClock += seconds;
  if (sampleClock >= 0.5) {
    sampleClock = 0;
    const gap = nextGap(distance);
    gapSample = Number.isFinite(gap) ? Math.round(gap) : null;
    const obstacle = pickObstacle(0, distance);
    kindSample = isObstacle(obstacle) ? obstacle.kind : null;
  }
  gapReadEl.textContent = gapSample === null ? '—' : gapSample;
  kindReadEl.textContent = kindSample === null ? '—' : kindSample;

  memReadEl.textContent = obstacles.length;
  aheadReadEl.textContent = ahead;
  behindReadEl.textContent = behind;

  if (!storageWorks) {
    recNoteEl.textContent = 'This browser will not let a double-clicked page save anything, so the best score only lasts while the page is open.';
  }

  startBtn.disabled = phase === 'over';
  startBtn.firstChild.nodeValue = phase === 'playing' ? 'Pause ' : 'Start ';
  againBtn.disabled = phase === 'waiting';
}

/* The speed marker slides from the starting speed to the top speed,
   and turns orange once there is nothing left to give. */
function showSpeed(speed) {
  if (!Number.isFinite(speed)) {
    speedMarkEl.className = '';
    speedMarkEl.style.left = '0%';
    return;
  }
  const share = Phaser.Math.Clamp((speed - START_SPEED) / (TOP_SPEED - START_SPEED), 0, 1);
  speedMarkEl.className = speed >= TOP_SPEED ? 'flat-out' : 'going';
  speedMarkEl.style.left = share * 100 + '%';
}

/* --- The keys --- */

startBtn.addEventListener('click', () => {
  if (phase === 'playing') {
    phase = 'paused';
    say('Paused.');
  } else {
    if (phase === 'waiting') playSound(startSound);
    phase = 'playing';
    checkTheRecordFunctions();
    say('Up or space to jump.');
    handOverToTheGame();
  }
  updateCurtain();
});

againBtn.addEventListener('click', () => {
  resetRun();
  phase = 'playing';
  checkTheRecordFunctions();
  playSound(startSound);
  say('New rooftops. Up or space to jump.');
  handOverToTheGame();
  updateCurtain();
});

/* Move the keyboard onto the screen once a run starts. Project 10
   explains why a game that reads the keyboard has to say this. */
function handOverToTheGame() {
  screenEl.focus();
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Enter' && !startBtn.disabled) {
    event.preventDefault();
    startBtn.click();
  }
  /* The space bar jumps, so stop the page scrolling on it as well. */
  if (event.code === 'Space') event.preventDefault();
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
  checkTheRecordFunctions();

  if (missing.runSpeed) {
    runSpeed = (howFar) => Math.min(START_SPEED + howFar * SPEED_GROWTH, TOP_SPEED);
  }
  if (missing.startJump) {
    startJump = () => {
      if (!runner.onRoof) return;
      runner.vy = -JUMP_SPEED;
    };
  }
  if (missing.nextGap) {
    nextGap = (howFar) => {
      const gapSeconds = Math.max(MIN_GAP_TIME, START_GAP_TIME - howFar * GAP_QUICKEN);
      return runSpeed(howFar) * (gapSeconds + Math.random() * GAP_SPREAD);
    };
  }
  if (missing.pickObstacle) {
    pickObstacle = (worldX, howFar) => {
      const kind = Phaser.Utils.Array.GetRandom(kindsAllowed(howFar));
      return { kind: kind.name, x: worldX, y: GROUND_Y - kind.h / 2, w: kind.w, h: kind.h };
    };
  }
  growTheWorld = () => {
    if (builtTo > whereTheWindowEnds() + AHEAD) return;
    builtTo += nextGap(distance);
    addObstacle(pickObstacle(builtTo, distance));
  };
  forgetOldObstacles = () => {
    for (let i = obstacles.length - 1; i >= 0; i -= 1) {
      if (obstacles[i].x < whereTheWindowStarts() - BEHIND) removeObstacle(i);
    }
  };

  /* The demo keeps a record of its own, in memory, and never reads or
     writes the real one. So these two are stood in for every time, and
     the line under the screen stops asking for them. */
  loadRecord = () => ({ best: 0, runs: 0 });
  saveRecord = () => {};
  missing.loadRecord = false;
  missing.saveRecord = false;
}

function setUpDemo() {
  /* A run already 400 metres old, with a saved record of its own. The
     demo never touches the real one. */
  resetRun();
  runner.x = 400 * METRE;
  distance = 400 * METRE;
  builtTo = runner.x + WIDTH * 0.8;
  scene.cameras.main.setScroll(runner.x - RUNNER_SCREEN_X, 0);
  for (let i = 0; i < PRIME; i += 1) growTheWorld();
  countTheList();

  record = { best: 812, runs: 14 };

  if (location.hash === '#demo-over') {
    crashed = true;
    newBest = false;
    phase = 'over';
    burst(scene, runner.x, runner.y);
    updateCurtain();
    say('Demo: the card at the end of a run.');
    return;
  }

  phase = 'playing';
  updateCurtain();
  say('Demo: the finished game. Up or space to jump.');
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the functions you have to write.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- runSpeed(distance) ---

     return Math.min(START_SPEED + distance * SPEED_GROWTH, TOP_SPEED);


   --- startJump() ---

     if (!runner.onRoof) return;
     runner.vy = -JUMP_SPEED;


   --- nextGap(distance) ---

     const seconds = Math.max(MIN_GAP_TIME, START_GAP_TIME - distance * GAP_QUICKEN);
     return runSpeed(distance) * (seconds + Math.random() * GAP_SPREAD);


   --- pickObstacle(worldX, distance) ---

     const kind = Phaser.Utils.Array.GetRandom(kindsAllowed(distance));

     return {
       kind: kind.name,
       x: worldX,
       y: GROUND_Y - kind.h / 2,
       w: kind.w,
       h: kind.h
     };


   --- growTheWorld() ---

     if (builtTo > whereTheWindowEnds() + AHEAD) return;

     builtTo += nextGap(distance);
     addObstacle(pickObstacle(builtTo, distance));


   --- forgetOldObstacles() ---

     for (let i = obstacles.length - 1; i >= 0; i -= 1) {
       if (obstacles[i].x < whereTheWindowStarts() - BEHIND) removeObstacle(i);
     }


   --- loadRecord() ---

     const saved = localStorage.getItem(RECORD_KEY);
     if (saved === null) return { best: 0, runs: 0 };
     return JSON.parse(saved);


   --- saveRecord(record) ---

     localStorage.setItem(RECORD_KEY, JSON.stringify(record));

   --------------------------------------------------------------------- */
