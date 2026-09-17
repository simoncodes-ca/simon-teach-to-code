/* =====================================================================
   game.js. File 6 of 6.

   One job: put the other five to work. It sets Phaser up, loads the
   pictures, reads the keys, runs the clock, draws the tanks and the
   shells, and decides when a round is over.

   It goes last because it needs everybody.

   Read it to see where your eight functions get used. Do not change
   it.
   ===================================================================== */

/* Add #demo or #demo-over to the address to see a duel part way
   through, or the card at the end of one. */
const DEMO = location.hash === '#demo' || location.hash === '#demo-over';

const screenEl = document.getElementById('screen');
const startBtn = document.getElementById('start');
const againBtn = document.getElementById('again');

let scene = null;                // the one scene, once Phaser has built it
let pads = {};                   // the keys for each tank, found by the tank's name
let looks = {};                  // the hull and turret pictures for each tank
let shellPictures = [];          // one picture for each shell in the air
let pen = null;                  // draws the arrows, the gun sights and the small health bars

let phase = 'waiting';           // 'waiting', 'playing', 'paused', 'between' or 'over'
let round = 1;                   // which round of the duel this is
let bounceTotal = 0;             // bounces this duel, for the rack
let hitTotal = 0;                // hits this duel, for the rack
let roundTimer = null;           // the wait between one round and the next
let probing = false;             // true only while the wiring is testing your functions

/* The sounds. The same pattern as every project since the calculator. */
const fireSound = new Audio('assets/fire.wav');
const bounceSound = new Audio('assets/bounce.wav');
const hitSound = new Audio('assets/hit.wav');
const wreckSound = new Audio('assets/wreck.wav');
const startSound = new Audio('assets/start.wav');
const roundSound = new Audio('assets/round.wav');
const winSound = new Audio('assets/win.wav');

function playSound(sound) {
  if (probing) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* Blue starts facing right. Red starts facing left, which is half a
   turn, and half a turn is Math.PI radians. */
const START_ANGLE = { blue: 0, red: Math.PI };

/* --- Setting Phaser up --- */

new Phaser.Game({
  /* Both of these settings keep the page double-clickable, and
     project 9 explains them. */
  type: Phaser.CANVAS,
  canvas: screenEl,
  width: WIDTH,
  height: HEIGHT,
  scene: { preload: preload, create: create, update: update },
  loader: { imageLoadType: 'HTMLImageElement' }
});

function preload() {
  this.load.image('arena', 'assets/arena.jpg');
  this.load.image('block', 'assets/block.png');
  this.load.image('hull-blue', 'assets/hull-blue.png');
  this.load.image('hull-red', 'assets/hull-red.png');
  this.load.image('turret-blue', 'assets/turret-blue.png');
  this.load.image('turret-red', 'assets/turret-red.png');
  this.load.image('shell', 'assets/shell.png');
  this.load.image('spark', 'assets/spark.png');
  this.load.image('smoke', 'assets/smoke.png');
}

function create() {
  scene = this;

  this.add.image(0, 0, 'arena').setOrigin(0, 0).setDepth(-10);
  blocks = this.add.group();
  pen = this.add.graphics().setDepth(7);

  /* Each tank gets its own set of keys, named the same way for both.
     So `pads.blue.fire` and `pads.red.fire` are the two fire keys. */
  pads.blue = this.input.keyboard.addKeys(CONTROLS.blue);
  pads.red = this.input.keyboard.addKeys(CONTROLS.red);

  /* The demo fills in your empty functions before anything uses them. */
  if (DEMO) standInForYourFunctions();

  const starts = loadArena(this, 0);
  blue = makeTank('blue', starts.blue, START_ANGLE.blue);
  red = makeTank('red', starts.red, START_ANGLE.red);
  tanks = [blue, red];

  /* The turret picture turns round the middle of its dome, which is
     20 pixels in from its left edge. That point sits on the middle of
     the tank. */
  for (const tank of tanks) {
    looks[tank.name] = {
      hull: this.add.image(tank.x, tank.y, 'hull-' + tank.name).setDepth(4),
      turret: this.add.image(tank.x, tank.y, 'turret-' + tank.name).setOrigin(20 / 64, 0.5).setDepth(5)
    };
  }

  buildRoundCard(this);
  buildCurtain(this);

  if (DEMO) setUpDemo();
  else say('Press Enter. Then try W, A, S and D, and read this line again.');
}

/* One frame of the game.

   Phaser hands you the time since the last frame in milliseconds, and
   dividing by 1000 gives the `seconds` you have used since project 7.
   A slow frame is treated as a twentieth of a second at most, so a
   tank never jumps through a block after the page has been hidden. */
function update(time, delta) {
  const seconds = Math.min(delta / 1000, 0.05);

  if (phase === 'playing') {
    testYourFunctions();

    for (const tank of tanks) driveByKeys(tank, pads[tank.name], seconds);
    flyShells(seconds);

    for (const hit of landHits()) burst(hit);
    forgetSpentShells();

    roundCheck();
  }

  if (phase === 'playing' || phase === 'between') puffSmoke(seconds);
  draw();
  updateRack();

  /* Only while the round is running. An ending has its own words, and
     this would talk over them. */
  if (phase === 'playing') reportEmptyFunctions();
}

/* One tank, one frame. The keys are turned into -1, 0 or 1, and then
   your functions do the rest. */
function driveByKeys(tank, pad, seconds) {
  if (tank.wrecked) return;

  tank.reload = Math.max(0, tank.reload - seconds);

  const turn = (pad.right.isDown ? 1 : 0) - (pad.left.isDown ? 1 : 0);
  const drive = (pad.forward.isDown ? 1 : 0) - (pad.back.isDown ? 1 : 0);
  const swing = (pad.turretRight.isDown ? 1 : 0) - (pad.turretLeft.isDown ? 1 : 0);

  turnTank(tank, turn, seconds);
  driveTank(tank, drive, seconds);

  /* The turret swings round on top of the tank. Your `aimOf` is what
     turns this number into the way the gun really points. */
  tank.turret += swing * TURRET_SPEED * seconds;

  if (pad.fire.isDown) {
    const before = shells.length;
    fireShell(tank);
    if (shells.length > before) playSound(fireSound);
  }
}

/* Every shell, every frame, through your `moveShell`. A bounce is
   spotted by `bounces` going up, and makes the ping. */
function flyShells(seconds) {
  for (const shell of shells) {
    const before = shell.bounces;
    moveShell(shell, seconds);
    if (shell.bounces > before) {
      bounceTotal += shell.bounces - before;
      if (shell.bounces <= MAX_BOUNCES) playSound(bounceSound);
    }
  }
}

/* A shell reached a tank. `landHits` in shells.js has already called
   your `damageTank`. This is only the picture and the sound. */
function burst(hit) {
  hitTotal += 1;
  playSound(hitSound);
  const spark = scene.add.image(hit.x, hit.y, 'spark').setDepth(8).setScale(0.3);
  scene.tweens.add({
    targets: spark,
    scale: 1.2,
    alpha: 0,
    duration: 320,
    onComplete: () => spark.destroy()
  });
}

/* Smoke rises off a wrecked tank. */
function puffSmoke(seconds) {
  for (const tank of tanks) {
    if (!tank.wrecked || Math.random() > seconds * 10) continue;
    const puff = scene.add.image(tank.x + Math.random() * 16 - 8, tank.y, 'smoke').setDepth(6).setScale(0.6);
    scene.tweens.add({
      targets: puff,
      y: tank.y - 50,
      scale: 1.6,
      alpha: 0,
      duration: 1100,
      onComplete: () => puff.destroy()
    });
  }
}

/* --- Rounds ---

   A round ends as soon as a tank is wrecked. Your `damageTank` is the
   only thing that ever sets `wrecked`, so it is the only way a round
   can end. */
function roundCheck() {
  if (!blue.wrecked && !red.wrecked) return;

  phase = 'between';
  shells = [];
  playSound(wreckSound);

  let winner = null;
  if (blue.wrecked && !red.wrecked) winner = red;
  if (red.wrecked && !blue.wrecked) winner = blue;

  if (winner === null) {
    showRoundCard(scene, 'BOTH WRECKED', '#ffc53d');
    say('Both tanks wrecked at once. Round ' + round + ' is played again.');
    roundTimer = scene.time.delayedCall(2200, () => startRound(round));
    return;
  }

  winner.wins += 1;
  showRoundCard(scene, winner.name.toUpperCase() + ' TAKES ROUND ' + round, COLOUR_OF[winner.name]);

  if (winner.wins >= WINS_NEEDED) {
    say(winner.name === 'blue' ? 'Blue wins the duel. Press Play again.' : 'Red wins the duel. Press Play again.');
    roundTimer = scene.time.delayedCall(1800, () => {
      phase = 'over';
      playSound(winSound);
      updateCurtain();
    });
    return;
  }

  say((winner.name === 'blue' ? 'Blue' : 'Red') + ' takes round ' + round + '.');
  roundTimer = scene.time.delayedCall(2200, () => startRound(round + 1));
}

/* A fresh round: the next arena, both tanks back at the start with
   full health, and no shells in the air. The wins stay. */
function startRound(which) {
  round = which;
  const starts = loadArena(scene, (round - 1) % ARENAS.length);
  placeTank(blue, starts.blue, START_ANGLE.blue);
  placeTank(red, starts.red, START_ANGLE.red);
  shells = [];
  roundTimer = null;
  phase = 'playing';
  playSound(roundSound);
  showRoundCard(scene, 'ROUND ' + round, '#ffc53d');
}

/* --- Drawing ---

   Nothing here changes a tank. It copies the numbers onto the
   pictures, sixty times a second. */
function draw() {
  pen.clear();

  for (const tank of tanks) {
    const look = looks[tank.name];
    look.hull.setPosition(tank.x, tank.y).setRotation(tank.angle);
    look.turret.setPosition(tank.x, tank.y);
    look.hull.setTint(tank.wrecked ? 0x3a3630 : 0xffffff);
    look.turret.setTint(tank.wrecked ? 0x3a3630 : 0xffffff);

    /* Until your `aimOf` works, the gun just points the way the tank
       faces. */
    const aim = aimOf(tank);
    look.turret.setRotation(isAngle(aim) ? aim : tank.angle);

    if (!tank.wrecked) {
      drawArrow(tank);
      if (isAngle(aim)) drawSight(tank, aim);
    }
    drawHealth(tank);
  }

  while (shellPictures.length < shells.length) {
    shellPictures.push(scene.add.image(0, 0, 'shell').setDepth(9).setScale(1.5));
  }
  for (let i = 0; i < shellPictures.length; i += 1) {
    const shell = shells[i];
    const show = i < shells.length && isPoint(shell);
    shellPictures[i].setVisible(show);
    if (show) shellPictures[i].setPosition(shell.x, shell.y);
  }
}

/* The small arrow in front of a tank. Every point of it comes from
   your `stepAlong`, so it only appears once that works. */
function drawArrow(tank) {
  const tip = stepAlong(tank.angle, 42);
  const leftWing = stepAlong(tank.angle + 2.5, 9);
  const rightWing = stepAlong(tank.angle - 2.5, 9);
  if (!isPoint(tip) || !isPoint(leftWing) || !isPoint(rightWing)) return;

  const x = tank.x + tip.x;
  const y = tank.y + tip.y;
  pen.fillStyle(0xfff4d6, 0.85);
  pen.fillTriangle(x, y, x + leftWing.x, y + leftWing.y, x + rightWing.x, y + rightWing.y);
}

/* The dotted gun sight, in the tank's own colour. */
function drawSight(tank, aim) {
  pen.fillStyle(tank.name === 'blue' ? 0x2f7fd0 : 0xd03a2c, 0.7);
  for (let along = BARREL + 16; along < BARREL + 170; along += 16) {
    const dot = stepAlong(aim, along);
    if (!isPoint(dot)) return;
    pen.fillCircle(tank.x + dot.x, tank.y + dot.y, 2.5);
  }
}

/* The small health bar that floats above a tank. */
function drawHealth(tank) {
  const width = 44;
  const left = tank.x - width / 2;
  const top = tank.y - 40;
  const full = Math.max(0, Math.min(1, tank.health / MAX_HEALTH));

  pen.fillStyle(0x15190f, 0.7);
  pen.fillRect(left - 2, top - 2, width + 4, 9);
  pen.fillStyle(full > 0.25 ? 0x7ee07a : 0xff5e4d, 1);
  pen.fillRect(left, top, width * full, 5);
}

/* --- Testing your functions ---

   Every frame, each of your functions is given one small job with an
   answer that cannot be argued with. The rack uses these to name the
   first empty one. The tests use their own made-up tanks and shells,
   so nothing in the real game is touched. */
function testYourFunctions() {
  probing = true;
  const open = openSpot();

  missing.stepAlong = !isPoint(stepAlong(0, 10));

  const spinner = { angle: 0 };
  turnTank(spinner, 1, 1);
  missing.turnTank = !isAngle(spinner.angle) || spinner.angle === 0;

  const driver = { name: 'test', x: open.x, y: open.y, angle: 0 };
  driveTank(driver, 1, 0.05);
  missing.driveTank = driver.x === open.x;

  missing.aimOf = !isAngle(aimOf({ angle: 1, turret: 0.5 }));

  const shooter = { name: 'test', x: open.x, y: open.y, angle: 0, turret: 0, reload: 0 };
  const before = shells.length;
  fireShell(shooter);
  missing.fireShell = shells.length === before;
  shells.length = before;

  const flyer = { x: open.x, y: open.y, vx: 100, vy: 0, bounces: 0, owner: 'test' };
  moveShell(flyer, 0.05);
  missing.moveShell = flyer.x === open.x;

  const near = { x: 100, y: 100, vx: 0, vy: 0, bounces: 1, owner: 'blue' };
  missing.shellHitsTank = shellHitsTank(near, { name: 'red', x: 104, y: 100 }) !== true;

  const target = { health: 50, wrecked: false };
  damageTank(target, 25);
  missing.damageTank = target.health !== 25;

  probing = false;
}

/* A spot on open sand, with open sand to its right and nowhere near
   either tank, for the tests to drive and fire in. */
function openSpot() {
  for (let row = 1; row < ROWS - 1; row += 1) {
    for (let col = 1; col < COLS - 2; col += 1) {
      if (grid[row][col] !== '.' || grid[row][col + 1] !== '.') continue;
      const spot = middleOf(col, row);
      let clear = true;
      for (const tank of tanks) {
        if (Math.abs(tank.x - spot.x) < TILE * 2 && Math.abs(tank.y - spot.y) < TILE * 2) clear = false;
      }
      if (clear) return spot;
    }
  }
  return middleOf(7, 1);
}

/* --- The keys --- */

startBtn.addEventListener('click', () => {
  if (phase === 'playing') {
    phase = 'paused';
    say('Paused.');
  } else if (phase === 'waiting' || phase === 'paused') {
    if (phase === 'waiting') {
      playSound(startSound);
      showRoundCard(scene, 'ROUND 1', '#ffc53d');
    }
    phase = 'playing';
    handOverToTheGame();
  }
  updateCurtain();
});

againBtn.addEventListener('click', () => {
  if (roundTimer !== null) roundTimer.remove();
  blue.wins = 0;
  red.wins = 0;
  bounceTotal = 0;
  hitTotal = 0;
  startRound(1);
  playSound(startSound);
  say('A fresh duel. Round 1.');
  handOverToTheGame();
  updateCurtain();
});

/* Move the keyboard onto the window once a game starts. Project 10
   explains why a game that reads the keyboard needs this. */
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

   Add #demo or #demo-over to the end of the address and the duel plays
   properly, so you can see what you are building. The stand-ins below
   fill in whichever of your functions are still empty. They are for
   the demo only. They are never for you. */
function standInForYourFunctions() {
  if (!isPoint(stepAlong(0, 10))) {
    stepAlong = (angle, distance) => ({ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance });
  }

  const spinner = { angle: 0 };
  turnTank(spinner, 1, 1);
  if (spinner.angle === 0) {
    turnTank = (tank, turn, seconds) => { tank.angle += turn * TURN_SPEED * seconds; };
  }

  /* driveTank needs an arena to be tested in, so it is swapped in
     without a test. A finished driveTank does the same job. */
  const yours = driveTank;
  driveTank = (tank, drive, seconds) => {
    const x = tank.x;
    const y = tank.y;
    yours(tank, drive, seconds);
    if (tank.x !== x || tank.y !== y || drive === 0) return;
    const step = stepAlong(tank.angle, drive * TANK_SPEED * seconds);
    tank.x += step.x;
    if (blocked(tank)) tank.x -= step.x;
    tank.y += step.y;
    if (blocked(tank)) tank.y -= step.y;
  };

  if (!isAngle(aimOf({ angle: 1, turret: 0.5 }))) {
    aimOf = (tank) => tank.angle + tank.turret;
  }

  const before = shells.length;
  fireShell({ name: 'test', x: 100, y: 100, angle: 0, turret: 0, reload: 0 });
  if (shells.length === before) {
    fireShell = (tank) => {
      if (tank.reload > 0) return;
      const aim = aimOf(tank);
      const barrel = stepAlong(aim, BARREL);
      const speed = stepAlong(aim, SHELL_SPEED);
      shells.push({ x: tank.x + barrel.x, y: tank.y + barrel.y, vx: speed.x, vy: speed.y, bounces: 0, owner: tank.name });
      tank.reload = RELOAD_TIME;
    };
  }
  shells = [];

  /* moveShell is swapped in the same way as driveTank. */
  const yourMove = moveShell;
  moveShell = (shell, seconds) => {
    const x = shell.x;
    const y = shell.y;
    yourMove(shell, seconds);
    if (shell.x !== x || shell.y !== y) return;
    shell.x += shell.vx * seconds;
    if (isWallAt(shell.x, shell.y)) {
      shell.x -= shell.vx * seconds;
      shell.vx = -shell.vx;
      shell.bounces += 1;
    }
    shell.y += shell.vy * seconds;
    if (isWallAt(shell.x, shell.y)) {
      shell.y -= shell.vy * seconds;
      shell.vy = -shell.vy;
      shell.bounces += 1;
    }
  };

  const near = { x: 100, y: 100, vx: 0, vy: 0, bounces: 1, owner: 'blue' };
  if (shellHitsTank(near, { name: 'red', x: 104, y: 100 }) !== true) {
    shellHitsTank = (shell, tank) => {
      if (shell.owner === tank.name && shell.bounces === 0) return false;
      return Phaser.Math.Distance.Between(shell.x, shell.y, tank.x, tank.y) < TANK_RADIUS;
    };
  }

  const target = { health: 50, wrecked: false };
  damageTank(target, 25);
  if (target.health !== 25) {
    damageTank = (tank, amount) => {
      tank.health = Math.max(0, tank.health - amount);
      if (tank.health === 0) tank.wrecked = true;
    };
  }
}

function setUpDemo() {
  if (location.hash === '#demo-over') {
    blue.wins = 3;
    red.wins = 1;
    round = 4;
    red.health = 0;
    red.wrecked = true;
    blue.health = 50;
    phase = 'over';
    updateCurtain();
    say('Demo: the end of a duel. Blue took three rounds.');
    return;
  }

  /* Round 2, part way through, with both tanks hurt. */
  startRound(2);
  blue.wins = 1;
  blue.health = 75;
  red.health = 50;
  blue.turret = -0.5;
  red.turret = 0.4;
  updateCurtain();
  say('Demo: the finished duel. Both players can drive.');
}
