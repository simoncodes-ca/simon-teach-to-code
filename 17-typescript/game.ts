/* =====================================================================
   game.ts. File 6 of 6.

   One job: put the other five to work. It sets Phaser up, loads the
   pictures, reads the keys, runs the clock, draws the tanks and the
   shells, and decides when a round is over.

   tanks.html loads this file, and only this file:

       <script type="module" src="game.ts"></script>

   Every other file arrives because of an `import` line at the top of
   this one. So the order of the files is written in the files
   themselves, and project 14's list of script tags is gone.

   Read it to see where your types get checked. Do not change it.
   ===================================================================== */

import Phaser from 'phaser';
import { ARENAS, CONTROLS, HEIGHT, MAX_BOUNCES, MAX_HEALTH, TURRET_SPEED, WIDTH, WINS_NEEDED, BARREL } from './numbers';
import { loadArena } from './arena';
import { aimOf, blue, placeTank, red, stepAlong, tanks, turnTank, driveTank } from './tank';
import type { Name, Tank } from './tank';
import { fireShell, forgetAllShells, forgetSpentShells, landHits, moveShell, shells } from './shells';
import type { Hit } from './shells';
import {
  againBtn, buildCurtain, buildRoundCard, COLOUR_OF, duelLine, say,
  screenEl, showRoundCard, startBtn, updateCurtain, updateRack
} from './rack';


/* ---------------------------------------------------------------------
   THE SHAPES FOR THIS FILE
   --------------------------------------------------------------------- */

/* Which part of a duel we are in. Only these five words are allowed.
   Write `phase = 'playng'` and the computer catches the spelling. */
export type Phase = 'waiting' | 'playing' | 'paused' | 'between' | 'over';

/* Everything about the duel that is not a tank or a shell. rack.ts
   reads it to fill in the readouts. */
export type Duel = {
  phase: Phase;
  round: number;            // which round of the duel this is
  bounces: number;          // bounces this duel, for the rack
  hits: number;             // hits this duel, for the rack
};

/* The seven keys one tank listens to. Phaser calls a key on the
   keyboard a `Key`. */
type Key = Phaser.Input.Keyboard.Key;
type Pad = {
  forward: Key;
  back: Key;
  left: Key;
  right: Key;
  turretLeft: Key;
  turretRight: Key;
  fire: Key;
};

/* The hull and turret pictures for one tank. */
type Look = {
  hull: Phaser.GameObjects.Image;
  turret: Phaser.GameObjects.Image;
};

/* Everything Phaser builds once the scene starts. It is all in one
   object, because until the scene starts none of it exists. */
type Stage = {
  scene: Phaser.Scene;
  pen: Phaser.GameObjects.Graphics;     // draws the arrows, the gun sights and the small health bars
  pads: Record<Name, Pad>;              // the keys for each tank
  looks: Record<Name, Look>;            // the pictures for each tank
  shellPictures: Phaser.GameObjects.Image[];
};


/* ---------------------------------------------------------------------
   THE MEMORY
   --------------------------------------------------------------------- */

const duel: Duel = { phase: 'waiting', round: 1, bounces: 0, hits: 0 };

/* `null` until Phaser has built the scene. Every function that needs
   the stage checks for `null` first, and the computer makes sure it
   does. */
let stage: Stage | null = null;

let roundTimer: Phaser.Time.TimerEvent | null = null;   // the wait between one round and the next

/* The sounds. The same pattern as every project since the calculator. */
const fireSound = new Audio('assets/fire.wav');
const bounceSound = new Audio('assets/bounce.wav');
const hitSound = new Audio('assets/hit.wav');
const wreckSound = new Audio('assets/wreck.wav');
const startSound = new Audio('assets/start.wav');
const roundSound = new Audio('assets/round.wav');
const winSound = new Audio('assets/win.wav');

function playSound(sound: HTMLAudioElement): void {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* Blue starts facing right. Red starts facing left, which is half a
   turn, and half a turn is Math.PI radians. */
const START_ANGLE: Record<Name, number> = { blue: 0, red: Math.PI };


/* ---------------------------------------------------------------------
   SETTING PHASER UP

   Phaser now comes from npm, so it is imported like any other file.
   Project 9 needed two settings to keep a double-clicked page working.
   A page served by `npm run dev` does not need the second one, so it
   is gone. The first stays, because we hand Phaser our own canvas.
   --------------------------------------------------------------------- */

new Phaser.Game({
  type: Phaser.CANVAS,
  canvas: screenEl,
  width: WIDTH,
  height: HEIGHT,
  scene: { preload: preload, create: create, update: update }
});

/* `this: Phaser.Scene` says what `this` means inside the function. */
function preload(this: Phaser.Scene): void {
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

function create(this: Phaser.Scene): void {
  this.add.image(0, 0, 'arena').setOrigin(0, 0).setDepth(-10);

  const starts = loadArena(this, 0);
  placeTank(blue, starts.blue, START_ANGLE.blue);
  placeTank(red, starts.red, START_ANGLE.red);

  /* Phaser's keyboard is `null` on a machine with no keyboard. The
     computer will not let us forget that, so we stop here with a
     message. */
  const keyboard = this.input.keyboard;
  if (keyboard === null) throw new Error('Tank Duel needs a keyboard.');

  stage = {
    scene: this,
    pen: this.add.graphics().setDepth(7),

    /* Phaser cannot know which keys `addKeys` was asked for, so it
       hands back a plain `object`. `as Pad` tells the computer "trust
       me, it is a Pad". The computer believes you and checks nothing,
       so use `as` only when you are sure. */
    pads: {
      blue: keyboard.addKeys(CONTROLS.blue) as Pad,
      red: keyboard.addKeys(CONTROLS.red) as Pad
    },

    /* The turret picture turns round the middle of its dome, which is
       20 pixels in from its left edge. That point sits on the middle
       of the tank. */
    looks: {
      blue: makeLook(this, blue),
      red: makeLook(this, red)
    },
    shellPictures: []
  };

  buildRoundCard(this);
  buildCurtain(this, duel);
  say('Press Enter to start the duel.');
}

function makeLook(aScene: Phaser.Scene, tank: Tank): Look {
  return {
    hull: aScene.add.image(tank.x, tank.y, 'hull-' + tank.name).setDepth(4),
    turret: aScene.add.image(tank.x, tank.y, 'turret-' + tank.name).setOrigin(20 / 64, 0.5).setDepth(5)
  };
}

/* One frame of the game.

   Phaser hands you the time since the last frame in milliseconds, and
   dividing by 1000 gives the `seconds` you have used since project 7.
   A slow frame is treated as a twentieth of a second at most, so a
   tank never jumps through a block after the page has been hidden. */
function update(this: Phaser.Scene, time: number, delta: number): void {
  if (stage === null) return;
  const seconds = Math.min(delta / 1000, 0.05);

  if (duel.phase === 'playing') {
    for (const tank of tanks) driveByKeys(tank, stage.pads[tank.name], seconds);
    flyShells(seconds);

    for (const hit of landHits()) burst(stage, hit);
    forgetSpentShells();

    roundCheck(stage);
  }

  if (duel.phase === 'playing' || duel.phase === 'between') puffSmoke(stage, seconds);
  draw(stage);
  updateRack(duel);
  if (duel.phase === 'playing') say(duelLine(duel));
}

/* One tank, one frame. The keys are turned into -1, 0 or 1, and then
   your functions do the rest. */
function driveByKeys(tank: Tank, pad: Pad, seconds: number): void {
  if (tank.wrecked) return;

  tank.reload = Math.max(0, tank.reload - seconds);

  const turn = (pad.right.isDown ? 1 : 0) - (pad.left.isDown ? 1 : 0);
  const drive = (pad.forward.isDown ? 1 : 0) - (pad.back.isDown ? 1 : 0);
  const swing = (pad.turretRight.isDown ? 1 : 0) - (pad.turretLeft.isDown ? 1 : 0);

  turnTank(tank, turn, seconds);
  driveTank(tank, drive, seconds);

  /* The turret swings round on top of the tank. */
  tank.turret += swing * TURRET_SPEED * seconds;

  if (pad.fire.isDown) {
    const before = shells.length;
    fireShell(tank);
    if (shells.length > before) playSound(fireSound);
  }
}

/* Every shell, every frame, through your `moveShell`. A bounce is
   spotted by `bounces` going up, and makes the ping. */
function flyShells(seconds: number): void {
  for (const shell of shells) {
    const before = shell.bounces;
    moveShell(shell, seconds);
    if (shell.bounces > before) {
      duel.bounces += shell.bounces - before;
      if (shell.bounces <= MAX_BOUNCES) playSound(bounceSound);
    }
  }
}

/* A shell reached a tank. `landHits` in shells.ts has already called
   your `damageTank`. This is only the picture and the sound. */
function burst(on: Stage, hit: Hit): void {
  duel.hits += 1;
  playSound(hitSound);
  const spark = on.scene.add.image(hit.x, hit.y, 'spark').setDepth(8).setScale(0.3);
  on.scene.tweens.add({
    targets: spark,
    scale: 1.2,
    alpha: 0,
    duration: 320,
    onComplete: () => spark.destroy()
  });
}

/* Smoke rises off a wrecked tank. */
function puffSmoke(on: Stage, seconds: number): void {
  for (const tank of tanks) {
    if (!tank.wrecked || Math.random() > seconds * 10) continue;
    const puff = on.scene.add.image(tank.x + Math.random() * 16 - 8, tank.y, 'smoke').setDepth(6).setScale(0.6);
    on.scene.tweens.add({
      targets: puff,
      y: tank.y - 50,
      scale: 1.6,
      alpha: 0,
      duration: 1100,
      onComplete: () => puff.destroy()
    });
  }
}


/* ---------------------------------------------------------------------
   ROUNDS

   A round ends as soon as a tank is wrecked. `damageTank` is the only
   thing that ever sets `wrecked`, so it is the only way a round can
   end.
   --------------------------------------------------------------------- */

function roundCheck(on: Stage): void {
  if (!blue.wrecked && !red.wrecked) return;

  duel.phase = 'between';
  forgetAllShells();
  playSound(wreckSound);

  /* `Tank | null` is a tank, or nobody. Both wrecked means nobody. */
  let winner: Tank | null = null;
  if (blue.wrecked && !red.wrecked) winner = red;
  if (red.wrecked && !blue.wrecked) winner = blue;

  if (winner === null) {
    showRoundCard(on.scene, 'BOTH WRECKED', '#ffc53d');
    say('Both tanks wrecked at once. Round ' + duel.round + ' is played again.');
    roundTimer = on.scene.time.delayedCall(2200, () => startRound(on, duel.round));
    return;
  }

  winner.wins += 1;
  showRoundCard(on.scene, winner.name.toUpperCase() + ' TAKES ROUND ' + duel.round, COLOUR_OF[winner.name]);

  if (winner.wins >= WINS_NEEDED) {
    say(winner.name === 'blue' ? 'Blue wins the duel. Press Play again.' : 'Red wins the duel. Press Play again.');
    roundTimer = on.scene.time.delayedCall(1800, () => {
      duel.phase = 'over';
      playSound(winSound);
      updateCurtain(duel);
    });
    return;
  }

  say((winner.name === 'blue' ? 'Blue' : 'Red') + ' takes round ' + duel.round + '.');
  roundTimer = on.scene.time.delayedCall(2200, () => startRound(on, duel.round + 1));
}

/* A fresh round: the next arena, both tanks back at the start with
   full health, and no shells in the air. The wins stay. */
function startRound(on: Stage, which: number): void {
  duel.round = which;
  const starts = loadArena(on.scene, (duel.round - 1) % ARENAS.length);
  placeTank(blue, starts.blue, START_ANGLE.blue);
  placeTank(red, starts.red, START_ANGLE.red);
  forgetAllShells();
  roundTimer = null;
  duel.phase = 'playing';
  playSound(roundSound);
  showRoundCard(on.scene, 'ROUND ' + duel.round, '#ffc53d');
}


/* ---------------------------------------------------------------------
   DRAWING

   Nothing here changes a tank. It copies the numbers onto the
   pictures, sixty times a second.
   --------------------------------------------------------------------- */

function draw(on: Stage): void {
  on.pen.clear();

  for (const tank of tanks) {
    const look = on.looks[tank.name];
    const aim = aimOf(tank);
    look.hull.setPosition(tank.x, tank.y).setRotation(tank.angle);
    look.turret.setPosition(tank.x, tank.y).setRotation(aim);
    look.hull.setTint(tank.wrecked ? 0x3a3630 : 0xffffff);
    look.turret.setTint(tank.wrecked ? 0x3a3630 : 0xffffff);

    if (!tank.wrecked) {
      drawArrow(on.pen, tank);
      drawSight(on.pen, tank, aim);
    }
    drawHealth(on.pen, tank);
  }

  while (on.shellPictures.length < shells.length) {
    on.shellPictures.push(on.scene.add.image(0, 0, 'shell').setDepth(9).setScale(1.5));
  }
  for (let i = 0; i < on.shellPictures.length; i += 1) {
    const show = i < shells.length;
    on.shellPictures[i].setVisible(show);
    if (show) on.shellPictures[i].setPosition(shells[i].x, shells[i].y);
  }
}

/* The small arrow in front of a tank. Every point of it comes from
   `stepAlong`. */
function drawArrow(pen: Phaser.GameObjects.Graphics, tank: Tank): void {
  const tip = stepAlong(tank.angle, 42);
  const leftWing = stepAlong(tank.angle + 2.5, 9);
  const rightWing = stepAlong(tank.angle - 2.5, 9);

  const x = tank.x + tip.x;
  const y = tank.y + tip.y;
  pen.fillStyle(0xfff4d6, 0.85);
  pen.fillTriangle(x, y, x + leftWing.x, y + leftWing.y, x + rightWing.x, y + rightWing.y);
}

/* The dotted gun sight, in the tank's own colour. */
function drawSight(pen: Phaser.GameObjects.Graphics, tank: Tank, aim: number): void {
  pen.fillStyle(tank.name === 'blue' ? 0x2f7fd0 : 0xd03a2c, 0.7);
  for (let along = BARREL + 16; along < BARREL + 170; along += 16) {
    const dot = stepAlong(aim, along);
    pen.fillCircle(tank.x + dot.x, tank.y + dot.y, 2.5);
  }
}

/* The small health bar that floats above a tank. */
function drawHealth(pen: Phaser.GameObjects.Graphics, tank: Tank): void {
  const width = 44;
  const left = tank.x - width / 2;
  const top = tank.y - 40;
  const full = Math.max(0, Math.min(1, tank.health / MAX_HEALTH));

  pen.fillStyle(0x15190f, 0.7);
  pen.fillRect(left - 2, top - 2, width + 4, 9);
  pen.fillStyle(full > 0.25 ? 0x7ee07a : 0xff5e4d, 1);
  pen.fillRect(left, top, width * full, 5);
}


/* ---------------------------------------------------------------------
   THE KEYS
   --------------------------------------------------------------------- */

startBtn.addEventListener('click', () => {
  if (stage === null) return;

  if (duel.phase === 'playing') {
    duel.phase = 'paused';
    say('Paused.');
  } else if (duel.phase === 'waiting' || duel.phase === 'paused') {
    if (duel.phase === 'waiting') {
      playSound(startSound);
      showRoundCard(stage.scene, 'ROUND 1', '#ffc53d');
    }
    duel.phase = 'playing';
    handOverToTheGame();
  }
  updateCurtain(duel);
});

againBtn.addEventListener('click', () => {
  if (stage === null) return;
  if (roundTimer !== null) roundTimer.remove();
  blue.wins = 0;
  red.wins = 0;
  duel.bounces = 0;
  duel.hits = 0;
  startRound(stage, 1);
  playSound(startSound);
  say('A fresh duel. Round 1.');
  handOverToTheGame();
  updateCurtain(duel);
});

/* Move the keyboard onto the window once a game starts. Project 10
   explains why a game that reads the keyboard needs this. */
function handOverToTheGame(): void {
  screenEl.focus();
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Enter' && !startBtn.disabled) {
    event.preventDefault();
    startBtn.click();
  }
});
