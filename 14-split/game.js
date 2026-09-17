/* =====================================================================
   game.js. File 6 of 6.

   One job: put the other five to work. It sets Phaser up, loads the
   pictures, runs the clock, reads the keys, draws the city, and says
   what happens when a run starts, ends or crashes.

   It goes last because it needs everybody. A file that uses other
   files has to be loaded after them, which is why the six script tags
   at the bottom of split.html are in the order they are in.

   Nothing in this file is new. Every line of it was in project 13.
   ===================================================================== */

/* Add #demo or #demo-over to the address to see the game part way
   through a run, or the card at the end of one. */
const DEMO = location.hash === '#demo' || location.hash === '#demo-over';

let scene = null;                  // the one scene, once Phaser has built it
let keys = null;                   // the arrow keys and the space bar
let sky = null;                    // the four layers behind and under the runner
let farCity = null;
let nearCity = null;
let roofBand = null;
let runnerSprite = null;

let phase = 'waiting';             // 'waiting', 'playing', 'paused' or 'over'
let crashed = false;               // true once this run has ended in a crash
let newBest = false;

/* The sounds. The same pattern as every project since the calculator. */
const startSound = new Audio('assets/start.wav');
const jumpSound = new Audio('assets/jump.wav');
const crashSound = new Audio('assets/crash.wav');
const bestSound = new Audio('assets/best.wav');
const overSound = new Audio('assets/over.wav');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* --- Setting Phaser up --- */

new Phaser.Game({
  /* Both of these settings keep the page double-clickable, and
     project 9 explains them. */
  type: Phaser.CANVAS,
  canvas: document.getElementById('screen'),
  width: WIDTH,
  height: HEIGHT,
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

  /* Four layers behind the runner. None of them scrolls by itself.
     They are stuck to the window and slid along by hand in
     `drawWorld`, which is what makes the parallax. */
  sky = this.add.image(0, 0, 'sky').setOrigin(0, 0).setScrollFactor(0).setDepth(-30);
  farCity = this.add.tileSprite(0, 260, WIDTH, 300, 'city-far')
    .setOrigin(0, 0).setScrollFactor(0).setDepth(-25);
  nearCity = this.add.tileSprite(0, 330, WIDTH, 260, 'city-near')
    .setOrigin(0, 0).setScrollFactor(0).setDepth(-20);
  roofBand = this.add.tileSprite(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y, 'roof')
    .setOrigin(0, 0).setScrollFactor(0).setDepth(-10);

  keys = this.input.keyboard.createCursorKeys();
  runnerSprite = this.add.image(0, 0, 'run1').setDepth(5);

  buildCurtain(this);              // rack.js
  seeWhetherTheBrowserWillSave();  // record.js
  readTheRecord();                 // record.js
  resetRun();

  if (DEMO) {
    setUpDemo();
    return;
  }

  say('Press Enter to run.');
}

/* One step of the game. Phaser hands you the time since the last
   frame, in milliseconds. */
function update(time, delta) {
  /* A frame longer than a twentieth of a second is cut short, so a
     browser that stalls for a moment cannot throw the runner through
     a crate. */
  const seconds = Math.min(delta / 1000, 0.05);

  if (phase === 'playing') {
    if (jumpPressed()) {
      const wasOnRoof = runner.onRoof;
      startJump();                 // runner.js
      if (wasOnRoof) {
        playSound(jumpSound);
        puff(this);
      }
    }
    playOneFrame(this, seconds);
  }

  drawWorld();
  updateRack(seconds);             // rack.js
}

function jumpPressed() {
  return Phaser.Input.Keyboard.JustDown(keys.up) || Phaser.Input.Keyboard.JustDown(keys.space);
}

/* Everything that happens in one frame of running, in order. Read it
   as a list of the other files being asked to do their jobs. */
function playOneFrame(aScene, seconds) {
  didWork('game');

  const landed = moveRunner(seconds);          // runner.js
  if (landed) puff(aScene);

  aScene.cameras.main.setScroll(runner.x - RUNNER_SCREEN_X, 0);

  growTheWorld();                              // world.js
  forgetOldObstacles();                        // world.js
  countTheList();                              // world.js

  if (whatTheRunnerHit() !== null) crash(aScene);   // runner.js
}

/* --- Starting and ending a run --- */

function resetRun() {
  putTheRunnerBack();              // runner.js
  crashed = false;
  newBest = false;
  resetFileCounts();               // rack.js

  scene.cameras.main.setScroll(runner.x - RUNNER_SCREEN_X, 0);
  startTheWorld(runner.x);         // world.js
}

function crash(aScene) {
  crashed = true;
  phase = 'over';
  playSound(crashSound);
  burst(aScene, runner.x, runner.y);
  aScene.cameras.main.shake(240, 0.011);
  didWork('game');
  endTheRun(aScene);
}

function endTheRun(aScene) {
  const metres = metresNow();

  /* record.js keeps the record and writes it down. The demo is a
     picture of a finished game, so it is never allowed to save. */
  newBest = countThisRun(metres, !DEMO);

  updateCurtain();
  say(newBest
    ? 'A new best: ' + metres + ' metres. Press Run again.'
    : metres + ' metres. Your best is ' + record.best + '. Press Run again.');

  aScene.time.delayedCall(520, () => {
    if (phase !== 'over') return;
    playSound(newBest ? bestSound : overSound);
  });
}

/* --- The two little bursts --- */

/* A puff of dust under the runner's feet, at a take-off and a
   landing. It lives in the world, so it slides backwards with the
   rooftop. */
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

/* The crash: a coral ring that grows and fades. */
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
  const scroll = whereTheWindowStarts();       // world.js

  /* The parallax. The far buildings slide a quarter as fast as the
     roof, the near ones half as fast. */
  farCity.tilePositionX = scroll * 0.25;
  nearCity.tilePositionX = scroll * 0.5;
  roofBand.tilePositionX = scroll;

  runnerSprite.setVisible(!crashed);
  if (crashed) return;

  runnerSprite.setPosition(runner.x, runner.y);
  if (!runner.onRoof) runnerSprite.setTexture('jump');
  else runnerSprite.setTexture(stepFrame ? 'run1' : 'run2');
}

/* --- The keys --- */

startBtn.addEventListener('click', () => {
  if (phase === 'playing') {
    phase = 'paused';
    say('Paused.');
  } else {
    if (phase === 'waiting') playSound(startSound);
    phase = 'playing';
    didWork('game');
    say('Up or space to jump.');
    handOverToTheGame();
  }
  updateCurtain();
});

againBtn.addEventListener('click', () => {
  resetRun();
  phase = 'playing';
  playSound(startSound);
  say('New rooftops. Up or space to jump.');
  handOverToTheGame();
  updateCurtain();
});

/* Move the keyboard onto the screen once a run starts. Project 10
   explains why a game that reads the keyboard has to say this. */
function handOverToTheGame() {
  document.getElementById('screen').focus();
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

/* --- The demos --- */

function setUpDemo() {
  /* A run already 400 metres old, with a record of its own. The demo
     never writes to the real one. */
  runner.x = 400 * METRE;
  distance = 400 * METRE;
  scene.cameras.main.setScroll(runner.x - RUNNER_SCREEN_X, 0);
  startTheWorld(runner.x);
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
