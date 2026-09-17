/* =====================================================================
   Alien Raid — the first new game you build on Phaser.

   Project 9 was a game you had already written, translated. This one
   is new. There is nothing to compare it with, and nothing to copy
   from an older file.

   Two things are new in the game itself.

   The first is the **keyboard**. Every game so far has waited for a
   mouse. This one reads the arrow keys and the space bar, so both
   hands are on the machine.

   The second is the swarm. Twenty-four aliens march across the screen
   in lock-step, turn at the wall together, and drop together. They are
   not twenty-four things that happen to move alike. They are **one
   block**, and you move the block.

   Write the functions in this order:
      1. steerShip     — the arrow keys fly the ship
      2. fireBolt      — the space bar sends a bolt up
      3. buildWave     — fill the sky with rows of aliens
      4. marchAliens   — walk the block sideways, turn it at the wall
      5. alienFires    — one alien drops a bomb
      6. watchForHits  — notice a bolt hitting an alien
      7. loseLife      — a bomb got you. Count it, and fly again
      8. nextWave      — the sky is clear, so send a bigger swarm

   Each one makes something new happen on the screen. Do them in order
   and you can watch the game arrive, one piece at a time.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   The numbers first, then the handful of things that change while the
   game runs.

   Groups work exactly as they did in project 9: a group makes its
   sprites, keeps them, and hands the whole lot to the collision code
   in one go. Three groups here, and one lone sprite for your ship.

   One number is worth stopping on. `blockSize` is how many aliens the
   wave **started** with. `aliens.getLength()` is how many are still
   alive. Those two numbers together are the whole difficulty curve of
   this game, and `marchAliens` is where they meet.
   --------------------------------------------------------------------- */

const WIDTH = 1024;              // the screen is always this wide, whatever size it looks
const HEIGHT = 768;              // and always this tall
const DECK = 722;                // the glowing line your ship flies along

const SHIP_Y = 686;              // how high above the bottom the ship sits
const SHIP_SPEED = 340;          // how fast the ship flies, in pixels per second
const BOLT_SPEED = 640;          // how fast your bolt goes up
const BOMB_SPEED = 250;          // how fast an alien bomb comes down
const RELOAD = 0.35;             // seconds between one bolt and the next

const COLUMNS = 8;               // how many aliens stand in a row
const FIRST_ROWS = 3;            // how many rows wave 1 has
const MAX_ROWS = 5;              // the most rows any wave has
const BLOCK_X = 178;             // where the middle of the leftmost column sits
const BLOCK_Y = 132;             // where the middle of the top row sits
const GAP_X = 96;                // the space from one column to the next
const GAP_Y = 68;                // the space from one row to the next

const MARCH_SLOW = 30;           // how fast a full block marches, in pixels per second
const MARCH_FAST = 260;          // and the fastest a nearly-empty one may go
const STEP_DOWN = 26;            // how far the block drops when it turns
const SWARM_EDGE = 46;           // how close to the wall the block may march

const BOMB_EVERY = 1.3;          // seconds between one alien bomb and the next
const START_LIVES = 3;           // how many ships you get

let aliens = null;               // the group of aliens still alive
let bolts = null;                // the group of your bolts, going up
let bombs = null;                // the group of alien bombs, coming down
let ship = null;                 // your ship. One sprite, not a group

let score = 0;                   // one point an alien, ten a cleared wave
let lives = START_LIVES;         // ships left
let wave = 1;                    // which wave is on the screen
let blockSize = 0;               // how many aliens this wave started with
let marchDir = 1;                // which way the block is marching. 1 is right, -1 is left


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Eight small functions, top to bottom.

   Each one gives you two hints. Read the gentle one first. All the
   answers sit in one block at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * Fly the ship. The arrow keys say which way.
 *
 * This runs every frame, and it is the one function in the file that
 * has to. A key can go down or come up at any moment, so the ship asks
 * again on every frame.
 *
 * `keys` is made for you in the given wiring. It holds one thing per
 * arrow key, and each one knows whether it is being held down right
 * now:
 *
 *     keys.left.isDown       true while the left arrow is held
 *     keys.right.isDown      true while the right arrow is held
 *
 * `isDown` is a true-or-false value, so it goes straight into an `if`.
 *
 * Three cases, and the third is the one people forget:
 *
 *     left held      fly left        ship.setVelocityX(-SHIP_SPEED)
 *     right held     fly right       ship.setVelocityX(SHIP_SPEED)
 *     neither held   stop            ship.setVelocityX(0)
 *
 * Leave the last one out and the ship keeps drifting after you let go,
 * because a velocity you set once stays set. That is the rule from
 * project 9, being helpful and unhelpful at the same time.
 *
 * The walls are looked after for you. The wiring told the ship to stop
 * at the edge of the screen, so you never have to check.
 *
 * Gentle hint: an `if`, an `else if`, and an `else`.
 * Stronger hint: `if (keys.left.isDown) ship.setVelocityX(-SHIP_SPEED);`
 *   then the same for right, then `else ship.setVelocityX(0);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press Start, then hold an arrow key. The ship flies along the deck
 * and stops the moment you let go.
 */
function steerShip(ship, keys) {
  // TODO: left, right, or neither.
}

/**
 * Send one bolt up out of the nose of the ship. Hand it back.
 *
 * The wiring watches the space bar and calls this, no more than once
 * every RELOAD seconds. So this function never has to ask whether
 * firing is allowed. It only has to make the bolt.
 *
 * It is the same three steps as every sprite you have made since
 * project 9. Make it in the group, give it a velocity, hand it back.
 *
 * The nose of the ship is at `ship.y - 26`, and straight up is a
 * **negative** velocity, because y grows downwards.
 *
 * Gentle hint: three lines. `bolts.create(...)`, then
 *   `setVelocityY`, then `return`.
 * Stronger hint: `const bolt = bolts.create(ship.x, ship.y - 26,
 *   'bolt');` then `bolt.setVelocityY(-BOLT_SPEED);` then
 *   `return bolt;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Tap the space bar and a bolt streaks up the screen. It has nothing
 * to hit yet.
 */
function fireBolt(scene, ship) {
  // TODO: make a bolt at the nose of the ship and send it up.
  return null;
}

/**
 * Fill the top of the screen with `rows` rows of aliens.
 *
 * This is the first time you have built something in a **grid** since
 * battleship, and it is built the same way: a loop inside a loop. The
 * outer loop counts rows, the inner loop counts columns, and the
 * inside of the pair runs once per alien.
 *
 * With rows of 3 and COLUMNS of 8, that inside runs 24 times.
 *
 * Where does alien number (row, column) go? Start at the top left
 * corner of the block and step across and down:
 *
 *     x = BLOCK_X + column * GAP_X
 *     y = BLOCK_Y + row * GAP_Y
 *
 * Column 0 sits at BLOCK_X exactly, column 1 one gap to the right, and
 * so on. Multiplying by the gap is what turns two counters into a
 * shape.
 *
 * Make each one in the `aliens` group, with the key 'alien-a':
 *
 *     const alien = aliens.create(x, y, 'alien-a');
 *
 * Then one more line, and it is the line that makes them look alive:
 *
 *     alien.play('wiggle');
 *
 * 'wiggle' is an animation, set up for you in the wiring. It swaps
 * between two pictures twice a second, for ever, the same way the
 * walking trooper did in project 9.
 *
 * Nothing is returned. The group is holding them.
 *
 * Gentle hint: a `for` loop over rows, with a `for` loop over columns
 *   inside it. Two lines in the middle.
 * Stronger hint: `for (let row = 0; row < rows; row += 1) {` then
 *   `for (let column = 0; column < COLUMNS; column += 1) {` then
 *   `const alien = aliens.create(BLOCK_X + column * GAP_X, BLOCK_Y +
 *   row * GAP_Y, 'alien-a');` and `alien.play('wiggle');`
 * Stuck? The answer key is at the bottom of this file.
 *
 * The swarm appears, in neat rows, wiggling. It does not move yet, and
 * your bolts go straight through it.
 */
function buildWave(scene, rows) {
  // TODO: two loops. One alien per square of the grid.
}

/**
 * March the whole block sideways. Turn it round at the wall.
 *
 * Read this comment all the way through before you write anything. It
 * is the idea the project exists to teach.
 *
 * Every moving thing since project 7 has moved by its own velocity.
 * The aliens do not. They move as **one block**, and the block has to
 * stay square: they all turn on the same frame, and they all drop on
 * the same frame. Give each alien a velocity of its own and the block
 * slowly falls apart, because they turn one at a time as each one
 * reaches the wall.
 *
 * So this is a job Phaser will not do for you, and you are back to
 * moving things by hand, every frame:
 *
 *     alien.x += marchDir * speed * seconds
 *
 * That is project 7's rule, unchanged. Speed multiplied by the time
 * that passed, never a fixed number of pixels.
 *
 * **How fast?** Here is the whole difficulty of the game, in one line:
 *
 *     const speed = Math.min(MARCH_FAST, MARCH_SLOW * blockSize / aliens.getLength());
 *
 * Read the middle of it. `blockSize` is how many aliens the wave
 * started with, and `aliens.getLength()` is how many are left. Full
 * block: 24 divided by 24 is 1, so the speed is MARCH_SLOW. Half shot
 * away: 24 divided by 12 is 2, so they march twice as fast. One left:
 * 24 times as fast, which is why `Math.min` caps it at MARCH_FAST.
 *
 * Nobody wrote a difficulty curve. It falls out of the sum, and the
 * game gets frightening near the end of every wave on its own.
 *
 * **Turning at the wall.** One helper is written for you:
 *
 *     blockAtEdge()    true when any alien has reached a wall
 *
 * When it says true, two things happen to every alien at once:
 *
 *     the block turns round      marchDir = -marchDir
 *     the block drops            alien.y += STEP_DOWN
 *
 * Turn the direction round **before** you drop them, and do the drop
 * in a loop over all of them.
 *
 * Gentle hint: work out the speed, loop over the aliens and move each
 *   one, then ask `blockAtEdge()` and, if it says true, turn and drop
 *   them in a second loop.
 * Stronger hint: `for (const alien of aliens.getChildren()) alien.x +=
 *   marchDir * speed * seconds;` then `if (blockAtEdge()) { marchDir =
 *   -marchDir; for (const alien of aliens.getChildren()) alien.y +=
 *   STEP_DOWN; }`
 * Stuck? The answer key is at the bottom of this file.
 *
 * The swarm marches, turns at both walls, and comes down a step each
 * time. Shoot some, and watch the March speed bar on the rack climb.
 */
function marchAliens(seconds) {
  // TODO: move every alien, then turn and drop the block at the wall.
}

/**
 * One alien drops a bomb. Hand it back.
 *
 * The wiring calls this on a timer, and only while there are aliens
 * left to do the dropping. Which alien? Any of them, chosen fresh each
 * time, so the bombs come from all over the swarm.
 *
 * Picking a random one out of a list is the pattern from blackjack:
 *
 *     const list = aliens.getChildren();
 *     const alien = list[Math.floor(Math.random() * list.length)];
 *
 * `Math.random()` gives a number from 0 up to just under 1. Multiply
 * by the length and round down, and you have a position in the list.
 *
 * Then it is a sprite like any other. Make the bomb just under him, at
 * `alien.y + 22`, send it down at BOMB_SPEED, and hand it back.
 *
 * Gentle hint: four lines. Pick an alien, make a bomb below him, set
 *   its velocity, return it.
 * Stronger hint: the two lines above, then `const bomb =
 *   bombs.create(alien.x, alien.y + 22, 'bomb');` then
 *   `bomb.setVelocityY(BOMB_SPEED);` then `return bomb;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Bombs start falling out of the swarm. They go straight through your
 * ship, because nothing is watching yet.
 */
function alienFires(scene) {
  // TODO: pick an alien at random and drop a bomb from him.
  return null;
}

/**
 * Ask Phaser to tell you when things touch.
 *
 * You wrote this in project 9. Two lines, said once when the game
 * starts, and Phaser checks every pair on every frame from then on.
 * Two things can touch here:
 *
 *     a bolt overlapping an alien    →   boltHitsAlien
 *     a bomb overlapping your ship   →   bombHitsShip
 *
 * Both of those are written for you further down. They score the hit,
 * destroy what was hit, and set off the explosion.
 *
 * Remember the two traps from last time. Pass the function by name,
 * with no brackets after it. And name the groups in the order the
 * function name reads.
 *
 * Gentle hint: two lines, both `scene.physics.add.overlap(...)`.
 * Stronger hint: `scene.physics.add.overlap(bolts, aliens,
 *   boltHitsAlien);` and `scene.physics.add.overlap(bombs, ship,
 *   bombHitsShip);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Aliens blow up when you hit them, and a bomb that reaches your ship
 * blows that up too. Losing the ship costs you nothing yet.
 */
function watchForHits(scene) {
  // TODO: watch for a bolt hitting an alien, then a bomb hitting the ship.
}

/**
 * A bomb got your ship. Count it, and decide what happens next.
 *
 * This is the first time a game of yours has given you more than one
 * go. The rule is small, and it is a decision rather than a movement.
 *
 *     take one ship away                 lives -= 1
 *     clear the sky of bombs             bombs.clear(true, true)
 *     none left? the game is over        gameOver()
 *     otherwise, fly again               respawnShip(scene)
 *
 * `gameOver` and `respawnShip` are both written for you further down.
 * `respawnShip` puts a fresh ship in the middle and flashes it for a
 * moment, so you are not shot the instant you arrive.
 *
 * Two things are worth thinking about before you write it.
 *
 * Clearing the bombs matters. `bombs.clear(true, true)` throws every
 * bomb in the group away. Leave that line out and the bomb that was
 * falling behind the first one takes your next ship half a second
 * later, and the one behind that takes your last one. Three lives,
 * gone in a blink, and it will look like a bug in something else.
 *
 * And once the game is over, stop. Use `return;` straight after
 * `gameOver()`, so a ship is never brought back into a finished game.
 *
 * Gentle hint: subtract one, clear the bombs, then an `if` with a
 *   `return` in it, then the respawn.
 * Stronger hint: `lives -= 1;` then `bombs.clear(true, true);` then
 *   `if (lives <= 0) { gameOver(); return; }` then
 *   `respawnShip(scene);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * The ships on the rack go out one at a time, a new ship flashes in
 * after each hit, and running out ends the game.
 */
function loseLife(scene) {
  // TODO: one ship fewer, clear the bombs, then either end it or fly again.
}

/**
 * The sky is clear. Send the next wave, and make it worse.
 *
 * This one runs every frame, and almost every frame the answer is "not
 * yet". So the first line is a **guard**: if there are aliens left,
 * leave straight away and do nothing.
 *
 *     if (aliens.getLength() > 0) return;
 *
 * Everything after that line only runs on the one frame the last alien
 * dies.
 *
 * Then the wave goes up by one, and the swarm gets a row deeper.
 * Wave 1 has FIRST_ROWS rows. Wave 2 has one more. Wave 3 has one more
 * again, up to MAX_ROWS, and after that it stops growing:
 *
 *     const rows = Math.min(MAX_ROWS, FIRST_ROWS + wave - 1);
 *
 * `Math.min` is the ceiling. Without it the swarm eventually starts
 * below your ship, which is not a harder game, just a broken one.
 *
 * Then hand the number to `startWave(scene, rows)`, written for you
 * further down. It calls your `buildWave`, remembers the new
 * `blockSize`, faces the block to the right again, and puts the wave
 * card on the screen.
 *
 * Gentle hint: the guard first, then `wave += 1`, then the rows sum,
 *   then `startWave`.
 * Stronger hint: all four lines are written above, in order.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Clear the swarm and a bigger one arrives. The game is finished:
 * every wave is deeper than the last, and every wave speeds up as you
 * empty it.
 */
function nextWave(scene) {
  // TODO: only when the sky is clear. Then a deeper swarm.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is finished already. It sets Phaser up, loads the
   pictures, reads the keys, runs the clock, and keeps the rack up to
   date.

   Read it, because it shows you where your eight functions get used.
   Do not change it.
   --------------------------------------------------------------------- */

const scoreReadEl = document.getElementById('scoreRead');
const waveReadEl = document.getElementById('waveRead');
const livesEl = document.getElementById('lives');
const alienCountEl = document.getElementById('alienCount');
const rowCountEl = document.getElementById('rowCount');
const marchBarEl = document.getElementById('marchBar');
const alienGroupEl = document.getElementById('alienGroup');
const boltCountEl = document.getElementById('boltCount');
const bombCountEl = document.getElementById('bombCount');
const screenEl = document.getElementById('screen');
const startBtn = document.getElementById('start');
const againBtn = document.getElementById('again');
const statusEl = document.getElementById('status');

/* The sounds. The same pattern as every project since the calculator:
   one Audio object per sound, made once and used again. */
const fireSound = new Audio('assets/fire.wav');
const alienSound = new Audio('assets/alien.wav');
const hitSound = new Audio('assets/hit.wav');
const waveSound = new Audio('assets/wave.wav');
const overSound = new Audio('assets/over.wav');
const startSound = new Audio('assets/start.wav');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* Things the game needs that are not part of the game itself. */
const DEMO = location.hash === '#demo' || location.hash === '#demo-over';
let scene = null;               // the one scene, once Phaser has built it
let keys = null;                // the arrow keys
let fireKey = null;             // the space bar
let curtain = null;             // the card before, between and after games
let waveCard = null;            // the WAVE 2 flash in the middle of the screen
let phase = 'waiting';          // 'waiting', 'playing', 'paused' or 'over'
let rowsNow = FIRST_ROWS;       // how deep the wave on the screen is
let cooldown = 0;               // seconds until the gun can fire again
let bombTimer = BOMB_EVERY;     // seconds until an alien drops the next bomb
let marchSeen = 0;              // how fast the block really moved, in pixels per second
let probing = false;            // true only while the demo is testing your functions
let message = '';

/* One flag per function you have to write. The wiring sets these as it
   goes, and the status line under the screen reads them. */
const missing = {
  steerShip: false,
  fireBolt: false,
  buildWave: false,
  marchAliens: false,
  alienFires: false,
  watchForHits: false,
  loseLife: false,
  nextWave: false
};

function say(text) {
  if (text === message) return;
  message = text;
  statusEl.textContent = text;
}

/* --- Small helpers your functions can use --- */

/* Has the block reached a wall? True when any alien has, which is what
   makes all of them turn on the same frame. */
function blockAtEdge() {
  for (const alien of aliens.getChildren()) {
    if (alien.x <= SWARM_EDGE && marchDir < 0) return true;
    if (alien.x >= WIDTH - SWARM_EDGE && marchDir > 0) return true;
  }
  return false;
}

/* Did that function really hand back a sprite? An empty one hands back
   null instead, and the status line says so. */
function isSprite(thing) {
  return thing instanceof Phaser.GameObjects.Sprite;
}

/* How many things is Phaser watching for overlaps? Counted before and
   after watchForHits, to see whether it did anything. */
function watchCount(aScene) {
  aScene.physics.world.colliders.update();
  return aScene.physics.world.colliders.getActive().length;
}

/* --- Setting Phaser up ---

   The same three functions as project 9. `preload` fetches the
   pictures, `create` builds the scene once, and `update` runs every
   frame. */
new Phaser.Game({
  /* Both of these settings are here to keep the page double-clickable,
     and project 9 explains them. */
  type: Phaser.CANVAS,
  canvas: document.getElementById('screen'),
  width: WIDTH,
  height: HEIGHT,
  loader: { imageLoadType: 'HTMLImageElement' },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } }
  },
  scene: { preload: preload, create: create, update: update }
});

/* All the pictures, loaded for you this time. Project 9 made you write
   these five lines, so this file spends its stubs on the game
   instead. */
function preload() {
  this.load.image('stars', 'assets/stars.png');
  this.load.image('ship', 'assets/ship.png');
  this.load.image('alien-a', 'assets/alien-a.png');
  this.load.image('alien-b', 'assets/alien-b.png');
  this.load.image('bolt', 'assets/bolt.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.image('boom', 'assets/boom.png');
}

function create() {
  scene = this;

  this.add.image(0, 0, 'stars').setOrigin(0, 0).setDepth(-10);

  /* The three groups. `physics.add.group` gives every sprite it makes
     a body, so it can move and collide. */
  aliens = this.physics.add.group();
  bolts = this.physics.add.group();
  bombs = this.physics.add.group();

  /* Your ship. It is one sprite rather than a group, because there is
     only ever one. `setCollideWorldBounds` is the line that keeps it
     on the screen, so `steerShip` never has to check the walls. */
  ship = this.physics.add.sprite(WIDTH / 2, SHIP_Y, 'ship');
  ship.setCollideWorldBounds(true);

  /* The alien animation: two pictures, swapped twice a second, for
     ever. `buildWave` starts it with alien.play('wiggle'). */
  this.anims.create({
    key: 'wiggle',
    frames: [{ key: 'alien-a' }, { key: 'alien-b' }],
    frameRate: 2,
    repeat: -1
  });

  /* The keyboard. `createCursorKeys` hands back the four arrows in one
     object, and `addKey` picks out one key by name. */
  keys = this.input.keyboard.createCursorKeys();
  fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  /* The space bar and the arrows scroll a web page by default. This
     stops the page moving under the game. */
  this.input.keyboard.addCapture(['SPACE', 'LEFT', 'RIGHT']);

  buildCurtain(this);
  waveCard = this.add.text(WIDTH / 2, 300, '', {
    fontFamily: "'Impact', 'Trebuchet MS', sans-serif",
    fontSize: '64px',
    color: '#7ef29a'
  }).setOrigin(0.5).setDepth(18).setVisible(false);

  if (DEMO) standInForEmptyFunctions(this);

  /* Your watch function, called once, here at the start. The count
     before and after says whether it did anything. */
  const watching = watchCount(this);
  watchForHits(this);
  missing.watchForHits = watchCount(this) === watching;
  if (DEMO && missing.watchForHits) {
    this.physics.add.overlap(bolts, aliens, boltHitsAlien);
    this.physics.add.overlap(bombs, ship, bombHitsShip);
    missing.watchForHits = false;
  }

  startWave(this, FIRST_ROWS);

  if (DEMO) setUpDemo(this);
  else say('Press Enter. Then hold an arrow key: steerShip() decides whether the ship moves.');
}

/* One step of the game.

   Phaser hands you the time since the last frame, in milliseconds.
   Dividing by 1000 gives the `seconds` you have used since project 7. */
function update(time, delta) {
  const seconds = delta / 1000;

  updateRack();

  if (phase !== 'playing') return;

  /* The ship, every frame, because a key can change at any moment. A
     held arrow key that moves nothing means the function is empty. */
  steerShip(ship, keys);
  if (keys.left.isDown || keys.right.isDown) {
    missing.steerShip = ship.body.velocity.x === 0;
  }

  /* The space bar, read the same way as the arrows. Holding it down is
     allowed: RELOAD is what stops the whole magazine leaving at once. */
  cooldown -= seconds;
  if (fireKey.isDown && cooldown <= 0) {
    missing.fireBolt = !isSprite(fireBolt(this, ship));
    if (!missing.fireBolt) {
      cooldown = RELOAD;
      playSound(fireSound);
    }
  }

  /* The swarm. Measure how far the block really travelled, so the bar
     on the rack shows what happened rather than what should have. */
  const lead = aliens.getLength() > 0 ? aliens.getChildren()[0] : null;
  const wasAt = lead ? lead.x : 0;
  marchAliens(seconds);
  if (lead !== null && lead.active) {
    marchSeen = seconds > 0 ? Math.abs(lead.x - wasAt) / seconds : 0;
    missing.marchAliens = lead.x === wasAt;
  }

  /* An alien bomb, now and then. */
  bombTimer -= seconds;
  if (bombTimer <= 0 && aliens.getLength() > 0) {
    bombTimer = BOMB_EVERY;
    missing.alienFires = !isSprite(alienFires(this));
  }

  /* Bolts leave the top of the screen and bombs leave the bottom.
     Phaser has no opinion about the edge of the world, so this is
     still a loop of ours — the same one, walked backwards, since
     project 7. */
  retire(bolts, (bolt) => bolt.y < -30);
  retire(bombs, (bomb) => bomb.y > HEIGHT + 30);

  /* The swarm reaching the deck ends the game, however many ships are
     left. */
  for (const alien of aliens.getChildren()) {
    if (alien.y + 16 >= DECK) {
      lives = 0;
      gameOver();
      break;
    }
  }

  /* And the next wave, once the sky is clear. */
  if (phase === 'playing' && !missing.buildWave) {
    const emptyBefore = aliens.getLength() === 0;
    nextWave(this);
    if (emptyBefore) missing.nextWave = aliens.getLength() === 0;
  }

  reportEmptyFunctions();
}

/* Throw away everything in a group that answers true. Walked
   backwards, for the reason project 7 gave. */
function retire(group, finished) {
  const list = group.getChildren();
  for (let i = list.length - 1; i >= 0; i -= 1) {
    if (finished(list[i]) === true) list[i].destroy();
  }
}

/* --- Starting a wave ---

   Your `nextWave` calls this with the number of rows it wants. It
   calls your `buildWave`, then remembers everything the swarm needs to
   march. */
function startWave(aScene, howManyRows) {
  rowsNow = howManyRows;
  marchDir = 1;
  buildWave(aScene, howManyRows);
  missing.buildWave = aliens.getLength() === 0;
  if (DEMO && missing.buildWave) {
    standInForBuildWave(aScene, howManyRows);
    missing.buildWave = false;
  }
  blockSize = Math.max(1, aliens.getLength());
  if (wave > 1 && !probing) {
    playSound(waveSound);
    showWaveCard(aScene);
  }
}

function showWaveCard(aScene) {
  waveCard.setText('WAVE ' + wave);
  waveCard.setAlpha(1);
  waveCard.setVisible(true);
  aScene.tweens.add({
    targets: waveCard,
    alpha: 0,
    duration: 1100,
    onComplete: () => waveCard.setVisible(false)
  });
}

/* --- What happens when things touch ---

   Phaser hands these the pair it found. */
function boltHitsAlien(bolt, alien) {
  bolt.destroy();
  alien.destroy();
  score += 1;
  playSound(alienSound);
  boom(scene, alien.x, alien.y);
  if (aliens.getLength() === 0) score += 10;
}

/* An overlap between a group and a lone sprite arrives in whichever
   order suits Phaser, so this line asks which of the two is the ship
   rather than trusting the order. */
function bombHitsShip(one, other) {
  const bomb = one === ship ? other : one;
  if (!ship.active || ship.alpha < 1) return;
  bomb.destroy();
  boom(scene, ship.x, ship.y);
  playSound(hitSound);
  const before = lives;
  loseLife(scene);
  missing.loseLife = lives === before;
}

/* The explosion. One picture and one tween, exactly as you wrote it in
   project 9, so this file does not ask you for it again. */
function boom(aScene, x, y) {
  const fire = aScene.add.image(x, y, 'boom').setScale(0.4).setDepth(6);
  aScene.tweens.add({
    targets: fire,
    scale: 1.3,
    alpha: 0,
    duration: 420,
    onComplete: () => fire.destroy()
  });
}

/* A fresh ship, in the middle, flashing for a moment. While it flashes
   `bombHitsShip` leaves it alone. */
function respawnShip(aScene) {
  ship.setPosition(WIDTH / 2, SHIP_Y);
  ship.setVelocityX(0);
  ship.setAlpha(0.35);
  aScene.tweens.add({
    targets: ship,
    alpha: 1,
    duration: 1400,
    ease: 'Linear'
  });
}

function gameOver() {
  phase = 'over';
  playSound(overSound);
  say('All ships lost. Press Play again.');
  updateCurtain();
}

function reportEmptyFunctions() {
  if (missing.steerShip) say('steerShip() is still empty, so the arrow keys do nothing.');
  else if (missing.fireBolt) say('fireBolt() is still empty, so the space bar fires nothing.');
  else if (missing.buildWave) say('buildWave() is still empty, so the sky has no aliens in it.');
  else if (missing.marchAliens) say('marchAliens() is still empty, so the swarm just hangs there.');
  else if (missing.alienFires) say('alienFires() is still empty, so no alien ever drops a bomb.');
  else if (missing.watchForHits) say('watchForHits() is still empty, so everything passes through everything.');
  else if (missing.loseLife) say('loseLife() is still empty, so a bomb costs you nothing.');
  else if (missing.nextWave) say('nextWave() is still empty, so a cleared sky stays empty.');
  else say(scoreLine());
}

function scoreLine() {
  if (score === 0) return 'Wave ' + wave + '. Arrows to fly, space to fire.';
  return score === 1 ? '1 point.' : score + ' points on wave ' + wave + '.';
}

/* --- The card over the screen --- */
function buildCurtain(aScene) {
  const display = "'Impact', 'Haettenschweiler', 'Trebuchet MS', sans-serif";
  const label = "'Trebuchet MS', sans-serif";
  const back = aScene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x0b0715, 0.72).setOrigin(0, 0);
  const title = aScene.add.text(WIDTH / 2, 286, '', {
    fontFamily: display, fontSize: '62px', color: '#4ee0ff'
  }).setOrigin(0.5);
  const lines = aScene.add.text(WIDTH / 2, 382, '', {
    fontFamily: label, fontSize: '26px', color: '#f6efff', align: 'center'
  }).setOrigin(0.5).setLineSpacing(14);
  const key = aScene.add.text(WIDTH / 2, 476, '', {
    fontFamily: label, fontSize: '26px', color: '#ffd45e'
  }).setOrigin(0.5);

  curtain = { group: aScene.add.container(0, 0, [back, title, lines, key]).setDepth(20), title, lines, key };
  updateCurtain();
}

function updateCurtain() {
  if (!curtain) return;
  curtain.group.setVisible(phase !== 'playing');
  if (phase === 'waiting') {
    curtain.title.setText('ALIEN RAID');
    curtain.lines.setText('Arrow keys to fly. Space to fire.\nClear every wave.');
    curtain.key.setText('Press Enter');
  } else if (phase === 'paused') {
    curtain.title.setText('PAUSED');
    curtain.lines.setText('');
    curtain.key.setText('');
  } else if (phase === 'over') {
    curtain.title.setText('GAME OVER');
    curtain.lines.setText((score === 1 ? '1 point' : score + ' points') + '\nWave ' + wave);
    curtain.key.setText('Press Play again');
  }
}

/* --- The rack down the side --- */
function updateRack() {
  scoreReadEl.textContent = score;
  waveReadEl.textContent = wave;
  alienCountEl.textContent = aliens.getLength();
  rowCountEl.textContent = rowsNow;
  alienGroupEl.textContent = aliens.getLength();
  boltCountEl.textContent = bolts.getLength();
  bombCountEl.textContent = bombs.getLength();

  /* The bar shows how fast the block really moved this frame, so an
     empty marchAliens leaves it flat. */
  marchBarEl.style.width = Math.min(100, (marchSeen / MARCH_FAST) * 100) + '%';

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

/* --- The keys --- */

function resetGame() {
  aliens.clear(true, true);
  bolts.clear(true, true);
  bombs.clear(true, true);
  score = 0;
  lives = START_LIVES;
  wave = 1;
  cooldown = 0;
  bombTimer = BOMB_EVERY;
  marchSeen = 0;
  ship.setAlpha(1);
  ship.setPosition(WIDTH / 2, SHIP_Y);
  ship.setVelocityX(0);
  missing.steerShip = false;
  missing.fireBolt = false;
  missing.marchAliens = false;
  missing.alienFires = false;
  missing.loseLife = false;
  missing.nextWave = false;
  startWave(scene, FIRST_ROWS);
}

startBtn.addEventListener('click', () => {
  if (phase === 'playing') {
    phase = 'paused';
    say('Paused.');
  } else {
    if (phase === 'waiting') playSound(startSound);
    phase = 'playing';
    say('Arrows to fly, space to fire.');
    handOverToTheGame();
  }
  updateCurtain();
});

againBtn.addEventListener('click', () => {
  resetGame();
  phase = 'playing';
  playSound(startSound);
  say('A fresh machine. Wave 1.');
  handOverToTheGame();
  updateCurtain();
});

/* Move the keyboard onto the screen once a game starts.

   Without this line the Start button keeps the keyboard, and the space
   bar presses Start again instead of firing, because that is what the
   space bar does to a button. A game that reads the keyboard has to
   say which part of the page the keyboard is talking to. */
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
function standInForBuildWave(aScene, howManyRows) {
  for (let row = 0; row < howManyRows; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const alien = aliens.create(BLOCK_X + column * GAP_X, BLOCK_Y + row * GAP_Y, 'alien-a');
      alien.play('wiggle');
    }
  }
}

function standInForEmptyFunctions(aScene) {
  probing = true;

  const probeShip = { moved: false, setVelocityX: (v) => { if (v !== 0) probeShip.moved = true; } };
  steerShip(probeShip, { left: { isDown: true }, right: { isDown: false } });
  if (!probeShip.moved) {
    steerShip = (theShip, theKeys) => {
      if (theKeys.left.isDown) theShip.setVelocityX(-SHIP_SPEED);
      else if (theKeys.right.isDown) theShip.setVelocityX(SHIP_SPEED);
      else theShip.setVelocityX(0);
    };
  }

  const probeBolt = fireBolt(aScene, ship);
  if (isSprite(probeBolt)) probeBolt.destroy();
  else {
    fireBolt = (scn, theShip) => {
      const bolt = bolts.create(theShip.x, theShip.y - 26, 'bolt');
      bolt.setVelocityY(-BOLT_SPEED);
      return bolt;
    };
  }

  /* One alien, borrowed for two probes, then thrown away. marchAliens
     needs something to move, and alienFires needs somebody to drop the
     bomb. */
  const probeAlien = aliens.create(320, 200, 'alien-a');
  blockSize = 1;
  const wasAt = probeAlien.x;
  marchAliens(0.5);
  if (probeAlien.x === wasAt) {
    marchAliens = (seconds) => {
      const speed = Math.min(MARCH_FAST, MARCH_SLOW * blockSize / aliens.getLength());
      for (const alien of aliens.getChildren()) alien.x += marchDir * speed * seconds;
      if (blockAtEdge()) {
        marchDir = -marchDir;
        for (const alien of aliens.getChildren()) alien.y += STEP_DOWN;
      }
    };
  }
  probeAlien.x = wasAt;

  const probeBomb = alienFires(aScene);
  if (isSprite(probeBomb)) probeBomb.destroy();
  else {
    alienFires = (scn) => {
      const list = aliens.getChildren();
      const alien = list[Math.floor(Math.random() * list.length)];
      const bomb = bombs.create(alien.x, alien.y + 22, 'bomb');
      bomb.setVelocityY(BOMB_SPEED);
      return bomb;
    };
  }
  probeAlien.destroy();
  bombs.clear(true, true);

  const livesWere = lives;
  loseLife(aScene);
  if (lives === livesWere) {
    loseLife = (scn) => {
      lives -= 1;
      bombs.clear(true, true);
      if (lives <= 0) {
        gameOver();
        return;
      }
      respawnShip(scn);
    };
  }
  lives = livesWere;
  phase = 'waiting';
  ship.setAlpha(1);

  /* nextWave is probed on an empty sky, which is the one case it acts
     on. Whatever it builds is cleared away again straight after. */
  const waveWas = wave;
  nextWave(aScene);
  const nextWaveWorks = wave !== waveWas || aliens.getLength() > 0;
  aliens.clear(true, true);
  wave = waveWas;
  if (!nextWaveWorks) {
    nextWave = (scn) => {
      if (aliens.getLength() > 0) return;
      wave += 1;
      startWave(scn, Math.min(MAX_ROWS, FIRST_ROWS + wave - 1));
    };
  }

  probing = false;
}

function setUpDemo(aScene) {
  if (location.hash === '#demo-over') {
    score = 46;
    wave = 3;
    lives = 0;
    aliens.clear(true, true);
    phase = 'over';
    updateCurtain();
    say('Demo: the game after the last ship went.');
    return;
  }

  /* A wave part-way through: a gap shot in the middle, bolts on their
     way up, bombs on their way down. */
  const list = aliens.getChildren().slice();
  for (let i = 0; i < list.length; i += 3) list[i].destroy();
  blockSize = Math.max(1, blockSize);
  for (const alien of aliens.getChildren()) alien.y += 34;

  bolts.create(430, 520, 'bolt').setVelocityY(-BOLT_SPEED);
  bolts.create(690, 360, 'bolt').setVelocityY(-BOLT_SPEED);
  bombs.create(560, 300, 'bomb').setVelocityY(BOMB_SPEED);
  bombs.create(268, 470, 'bomb').setVelocityY(BOMB_SPEED);

  boom(aScene, 620, 250);
  score = 17;
  lives = 2;
  phase = 'playing';
  updateCurtain();
  say('Demo: the finished game. Arrows to fly, space to fire.');
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the functions you have to write.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- steerShip(ship, keys) ---

     if (keys.left.isDown) ship.setVelocityX(-SHIP_SPEED);
     else if (keys.right.isDown) ship.setVelocityX(SHIP_SPEED);
     else ship.setVelocityX(0);


   --- fireBolt(scene, ship) ---

     const bolt = bolts.create(ship.x, ship.y - 26, 'bolt');
     bolt.setVelocityY(-BOLT_SPEED);
     return bolt;


   --- buildWave(scene, rows) ---

     for (let row = 0; row < rows; row += 1) {
       for (let column = 0; column < COLUMNS; column += 1) {
         const alien = aliens.create(BLOCK_X + column * GAP_X, BLOCK_Y + row * GAP_Y, 'alien-a');
         alien.play('wiggle');
       }
     }


   --- marchAliens(seconds) ---

     const speed = Math.min(MARCH_FAST, MARCH_SLOW * blockSize / aliens.getLength());
     for (const alien of aliens.getChildren()) {
       alien.x += marchDir * speed * seconds;
     }
     if (blockAtEdge()) {
       marchDir = -marchDir;
       for (const alien of aliens.getChildren()) {
         alien.y += STEP_DOWN;
       }
     }


   --- alienFires(scene) ---

     const list = aliens.getChildren();
     const alien = list[Math.floor(Math.random() * list.length)];
     const bomb = bombs.create(alien.x, alien.y + 22, 'bomb');
     bomb.setVelocityY(BOMB_SPEED);
     return bomb;


   --- watchForHits(scene) ---

     scene.physics.add.overlap(bolts, aliens, boltHitsAlien);
     scene.physics.add.overlap(bombs, ship, bombHitsShip);


   --- loseLife(scene) ---

     lives -= 1;
     bombs.clear(true, true);
     if (lives <= 0) {
       gameOver();
       return;
     }
     respawnShip(scene);


   --- nextWave(scene) ---

     if (aliens.getLength() > 0) return;
     wave += 1;
     const rows = Math.min(MAX_ROWS, FIRST_ROWS + wave - 1);
     startWave(scene, rows);

   --------------------------------------------------------------------- */
