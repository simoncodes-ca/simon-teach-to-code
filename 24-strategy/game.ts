/* =====================================================================
   game.ts. File 12 of 12.

   One job: put the other eleven to work. It sets Phaser up, loads the
   maps and the pictures, stands a refinery and three harvesters in each
   corner, runs the ore for both sides, turns a click on the Build card
   into a call to project 22's `startBuild`, asks your commander what
   the enemy should do, and asks it who has won.

   strategy.html loads this file, and only this file. Every other file
   arrives because of an `import` line at the top.

   Two parts are worth reading. `runUnit` is project 23's nine lines,
   and it still runs both sides. `runCommander` is new, it is fifteen
   lines, and it is the only place any of your seven functions is
   called.

   Read them to see where your functions get used. Do not change them.
   ===================================================================== */

import Phaser from 'phaser';
import {
  BASE_HEALTH, BEAT, BLUE_BASE, CAPACITY, COLS, DRAG_START, GUN_RANGE,
  HEIGHT, MARCH_EVERY, MAX_HEALTH, RED_BASE, ROWS, START_HARVESTERS,
  TANK_REACH, THINK_EVERY, TILE, WIDTH
} from './numbers.ts';
import { BLANK, TERRAIN, TERRAIN_KEYS } from './terrain.ts';
import { cellAt, isInside, linesToMap, makeMap, middleOf, sameCell } from './map.ts';
import type { Cell, GameMap } from './map.ts';
import { findRoute } from './paths.ts';
import { CATALOGUE, ITEM_KEYS } from './catalogue.ts';
import type { ItemKey } from './catalogue.ts';
import {
  boxFrom, driveUnit, foeOf, halt, isInBox, makeUnit, orderMove, otherSide,
  parkingSpot, selectedUnits, selectInBox, selectOnly, sendTo, sendToSpot,
  unitAt
} from './units.ts';
import type { Box, Mode, Side, Unit, UnitKind } from './units.ts';
import {
  digStep, fullness, makeField, makeRefinery, nearestOre, nextJob, oreAt,
  unloadStep
} from './ore.ts';
import type { OreField, Refinery } from './ore.ts';
import {
  buildStep, canBuild, makeYard, startBuild, takeFinished, waitTime
} from './build.ts';
import type { Verdict, Yard } from './build.ts';
import {
  aimAt, armed, nearestTarget, nextMode, nextPost, shootStep, wrecked
} from './enemy.ts';
import {
  armyStrength, attackOrders, countKind, spendStep, wantNext, wantsAttack,
  whoWon
} from './commander.ts';
import {
  buildCatalogue, buildMapList, buildSquad, say, screenEl, showBanner,
  showCatalogue, showEnemy, showForces, showMapList, showPlate, showQueue,
  showSquad
} from './rack.ts';
import type { QueueRow, SideReport, SquadRowReport } from './rack.ts';


/* ---------------------------------------------------------------------
   THE MAPS

   The same as projects 19 to 23. Every map file in the `maps` folder is
   read when the page starts, and checked before it is used.

   Both maps in the folder are built so that turning one round gives you
   the other. Your corner and the enemy's corner hold the same ground,
   the same ore and the same room to build.
   --------------------------------------------------------------------- */

const MAP_FILES: Record<string, unknown> = import.meta.glob('./maps/*.json', { eager: true, import: 'default' });

function isSavedMap(thing: unknown): thing is { name: string; lines: string[] } {
  return thing !== null && typeof thing === 'object' && 'name' in thing && 'lines' in thing
    && typeof thing.name === 'string' && Array.isArray(thing.lines)
    && thing.lines.every((line) => typeof line === 'string');
}

function readMaps(): GameMap[] {
  const found: GameMap[] = [];
  for (const file of Object.keys(MAP_FILES).sort()) {
    const saved = MAP_FILES[file];
    if (!isSavedMap(saved)) continue;
    const loaded = linesToMap(saved.name, saved.lines);
    if (loaded === null || loaded.cols !== COLS || loaded.rows !== ROWS) continue;
    found.push(loaded);
  }
  if (found.length === 0) found.push(makeMap('Open Field', COLS, ROWS));
  return found;
}

const maps = readMaps();


/* ---------------------------------------------------------------------
   THE MEMORY
   --------------------------------------------------------------------- */

/* Everything one side owns. There are two of these, and they are the
   same shape, because the two sides play the same game. Yours is worked
   by the Build card. The enemy's is worked by your commander. */
type Base = {
  side: Side;
  unit: Unit;                              // the refinery standing on the map
  refinery: Refinery;                      // its credits
  yard: Yard;                              // what it has built, and what is on order
  plots: Cell[];                           // free cells near it, nearest first
  placed: { key: ItemKey; cell: Cell }[];   // the buildings it has finished
  named: number;                           // how many of its units have been named
  thinkIn: number;                         // seconds until the commander decides again
  marchIn: number;                         // seconds until it gives marching orders again
  marching: number;                        // tanks it sent last time
};

let mapIndex = 0;                      // which map in `maps` is on the board
let map: GameMap = maps[0];

let units: Unit[] = [];                // every unit, both sides, all three kinds
let field: OreField = makeField(map);  // the ore left in every cell. Both sides dig it
let bases: Base[] = [];                // one for each side, blue first

let replanIn: number[] = [];           // seconds until each unit works out a fresh route
let shots = 0;                         // how many times `shootStep` has said true
let wrecks = 0;                        // how many units have reached 0 health
let won: Side | 'draw' | null = null;  // what `whoWon` said, once it said anything

let mouseX = -1;                       // the mouse, in pixels on the map. -1 means off the map
let mouseY = -1;
let pressing = false;                  // is the mouse button held down on the map?
let pressX = 0;                        // where it was pressed
let pressY = 0;
let dragging = false;                  // has it moved far enough to be a box?
let askAgainIn = 0;                    // seconds until idle harvesters ask for a job again

/* A ring that fades: red where a unit found no route, white where one
   blew up. */
type Mark = { x: number; y: number; big: boolean; until: number };
let marks: Mark[] = [];

/* A gun flash: a line from a barrel to whatever it just hit. */
type Flash = { fromX: number; fromY: number; toX: number; toY: number; until: number };
let flashes: Flash[] = [];

const BLUE_NAMES = [
  'Able', 'Baker', 'Charlie', 'Dog', 'Easy', 'Fox', 'George', 'How',
  'Item', 'Jig', 'King', 'Love'
];
const RED_NAMES = [
  'Wolf', 'Bear', 'Kite', 'Adder', 'Hawk', 'Boar', 'Lynx', 'Raven',
  'Shark', 'Stoat', 'Viper', 'Weasel'
];

/* The sounds. The eight from projects 22 and 23, and the same pattern
   as every project since the calculator. */
const selectSound = new Audio('assets/select.wav');
const boxSound = new Audio('assets/box.wav');
const orderSound = new Audio('assets/order.wav');
const readySound = new Audio('assets/found.wav');
const arriveSound = new Audio('assets/arrive.wav');
const refusedSound = new Audio('assets/blocked.wav');
const mapSound = new Audio('assets/map.wav');
const shotSound = new Audio('assets/shot.wav');
const boomSound = new Audio('assets/boom.wav');

function playSound(sound: HTMLAudioElement): void {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}


/* ---------------------------------------------------------------------
   WHICH JOB IS NEXT?

   The same as projects 18 to 23. When the page loads, each of your
   functions is tried once on a yard and a pair of tanks of its own. The
   first one that hands back nothing is the next job.

   `job` is the number of that job, or 10 when every job is done. The
   page only uses a function once its job is done.
   --------------------------------------------------------------------- */

/* An empty function hands back `undefined`, whatever its type says it
   hands back. TypeScript will not compare the two, so the answer takes
   one step through `unknown` on its way here. */
function missing(answer: unknown): boolean {
  return answer === undefined;
}

function whichJob(): { number: number; text: string } {
  const here: Cell = { col: 0, row: 0 };
  const tinyYard = makeYard();
  const tinyRefinery = makeRefinery(here);
  tinyRefinery.credits = 9000;
  const pair = [
    makeUnit('red', 'tank', 'Test', 0, 0, here),
    makeUnit('blue', 'tank', 'Test', 100, 0, here)
  ];

  if (missing(countKind(pair, 'red', 'tank'))) {
    return { number: 1, text: 'Job 1: countKind() is still empty, so nobody can count what either side has. Open commander.ts.' };
  }
  if (missing(armyStrength(pair, 'red'))) {
    return { number: 2, text: 'Job 2: armyStrength() is still empty, so the two strength bars have nothing to measure.' };
  }
  if (missing(wantNext(tinyYard, pair, 'red'))) {
    return { number: 3, text: 'Job 3: wantNext() is still empty, so the enemy commander wants nothing at all.' };
  }
  if (missing(spendStep(tinyYard, tinyRefinery, pair, 'red'))) {
    return { number: 4, text: 'Jobs 4 and 5: write the first test in commander.test.ts, then spendStep(). Then the enemy starts spending.' };
  }
  if (missing(wantsAttack(pair, 'red'))) {
    return { number: 6, text: 'Job 6: wantsAttack() is still empty, so the enemy never decides it is strong enough.' };
  }
  if (missing(attackOrders(pair, 'red'))) {
    return { number: 7, text: 'Job 7: attackOrders() is still empty, so the enemy tanks sit at home guarding their refinery.' };
  }
  if (missing(whoWon(pair))) {
    return { number: 8, text: 'Jobs 8 and 9: write the second test in commander.test.ts, then whoWon(). Then the game can be won.' };
  }
  return { number: 10, text: 'The game is finished, and so is the list. Wreck the enemy refinery before it wrecks yours.' };
}

const job = whichJob();

/* Is this job done? */
function done(number: number): boolean {
  return job.number > number;
}


/* ---------------------------------------------------------------------
   SETTING PHASER UP
   --------------------------------------------------------------------- */

/* The two pictures that make one unit: a hull, and a top that is either
   a gun or an ore drum. A refinery has a look of its own, drawn with
   lines, so both of its pictures are switched off. */
type Look = {
  hull: Phaser.GameObjects.Image;
  top: Phaser.GameObjects.Image;
};

/* Everything Phaser builds once the scene starts. */
type Stage = {
  scene: Phaser.Scene;
  pictures: Phaser.GameObjects.Image[][];   // one picture for each cell. pictures[row][col]
  numbers: Phaser.GameObjects.Text[][];     // the ore left in each cell
  patches: Phaser.GameObjects.Graphics;     // the amber shading on the ore
  base: Phaser.GameObjects.Graphics;        // both refineries and every building
  labels: Phaser.GameObjects.Text[];        // the words on them
  beats: Phaser.GameObjects.Graphics;       // the ring a guard walks
  routes: Phaser.GameObjects.Graphics;      // the routes the units are driving
  discs: Phaser.GameObjects.Graphics;       // a coloured disc under each unit
  looks: Look[];                            // one look for each unit, in `units` order
  over: Phaser.GameObjects.Graphics;        // over the units: bars, rings, the box
};

let stage: Stage | null = null;

new Phaser.Game({
  type: Phaser.CANVAS,
  canvas: screenEl,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#0d1216',
  scene: { preload: preload, create: create, update: update }
});

/* The loader reads the terrain table, the same as projects 18 to 23. */
function preload(this: Phaser.Scene): void {
  for (const key of TERRAIN_KEYS) {
    this.load.image(key, 'assets/' + TERRAIN[key].picture);
  }
  this.load.image('hull', 'assets/hull-blue.png');
  this.load.image('top', 'assets/turret-blue.png');
}

function create(this: Phaser.Scene): void {
  const pictures: Phaser.GameObjects.Image[][] = [];
  const numbers: Phaser.GameObjects.Text[][] = [];
  for (let row = 0; row < ROWS; row += 1) {
    const pictureLine: Phaser.GameObjects.Image[] = [];
    const numberLine: Phaser.GameObjects.Text[] = [];
    for (let col = 0; col < COLS; col += 1) {
      pictureLine.push(this.add.image(col * TILE, row * TILE, BLANK).setOrigin(0, 0));
      numberLine.push(this.add.text(col * TILE + TILE / 2, row * TILE + TILE - 9, '', {
        fontFamily: '"Courier New", Consolas, monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ffe0a8',
        stroke: '#0d1216',
        strokeThickness: 4
      }).setOrigin(0.5, 0.5).setDepth(2.5));
    }
    pictures.push(pictureLine);
    numbers.push(numberLine);
  }

  drawGrid(this.add.graphics().setDepth(1));

  stage = {
    scene: this,
    pictures: pictures,
    numbers: numbers,
    patches: this.add.graphics().setDepth(2),
    base: this.add.graphics().setDepth(2.2),
    labels: [],
    beats: this.add.graphics().setDepth(2.6),
    routes: this.add.graphics().setDepth(2.7),
    discs: this.add.graphics().setDepth(2.8),
    looks: [],
    over: this.add.graphics().setDepth(5)
  };

  /* The right button lets go of every unit, so its menu stays shut. */
  this.input.mouse?.disableContextMenu();

  this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    screenEl.focus();
    if (pointer.rightButtonDown()) {
      letGoOfAll();
      return;
    }
    pressing = true;
    dragging = false;
    pressX = pointer.x;
    pressY = pointer.y;
  });
  this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    mouseX = pointer.x;
    mouseY = pointer.y;
    if (pressing && !dragging && Math.abs(mouseX - pressX) + Math.abs(mouseY - pressY) >= DRAG_START) {
      dragging = true;
    }
  });
  /* Letting go outside the window still finishes the box. */
  const letGo = (pointer: Phaser.Input.Pointer) => {
    if (!pressing) return;
    pressing = false;
    if (dragging) {
      dragging = false;
      mouseX = Phaser.Math.Clamp(pointer.x, 0, WIDTH - 1);
      mouseY = Phaser.Math.Clamp(pointer.y, 0, HEIGHT - 1);
      finishBox();
    } else {
      clickAt(pointer.x, pointer.y);
    }
  };
  this.input.on('pointerup', letGo);
  this.input.on('pointerupoutside', letGo);
  this.input.on('gameout', () => {
    mouseX = -1;
    mouseY = -1;
  });

  putMapOnTheBoard(0);
  say(job.text);
}

/* Faint lines between the cells, drawn once. */
function drawGrid(pen: Phaser.GameObjects.Graphics): void {
  pen.lineStyle(1, 0x0d1216, 0.16);
  for (let col = 1; col < COLS; col += 1) pen.lineBetween(col * TILE, 0, col * TILE, HEIGHT);
  for (let row = 1; row < ROWS; row += 1) pen.lineBetween(0, row * TILE, WIDTH, row * TILE);
}


/* ---------------------------------------------------------------------
   TWO CORNERS, THE SAME WAY ROUND

   Each side gets a refinery on its own cell, two harvesters beside it,
   and a list of free plots for the buildings it puts up. Neither corner
   has anything the other one has not.
   --------------------------------------------------------------------- */

/* Every walkable cell with no ore in it, nearest to a cell first. The
   buildings never land on ore a harvester wants. */
function freeSpots(aMap: GameMap, near: Cell, taken: Cell[]): Cell[] {
  const found: { col: number; row: number; far: number }[] = [];
  for (let row = 0; row < aMap.rows; row += 1) {
    for (let col = 0; col < aMap.cols; col += 1) {
      const ground = TERRAIN[aMap.cells[row][col]];
      if (!ground.walkable || ground.holds > 0) continue;
      let already = false;
      for (const cell of taken) {
        if (sameCell(cell, { col: col, row: row })) already = true;
      }
      if (already) continue;
      const across = col - near.col;
      const down = row - near.row;
      found.push({ col: col, row: row, far: across * across + down * down });
    }
  }
  found.sort((a, b) => a.far - b.far);
  return found.map((each) => ({ col: each.col, row: each.row }));
}

/* The nearest cell to this one that a unit can drive on. Project 23's,
   unchanged, so a map painted in project 18's editor still works. */
function nearestWalkable(aMap: GameMap, col: number, row: number): Cell {
  const fromCol = Phaser.Math.Clamp(col, 0, aMap.cols - 1);
  const fromRow = Phaser.Math.Clamp(row, 0, aMap.rows - 1);

  for (let ring = 0; ring < aMap.cols + aMap.rows; ring += 1) {
    for (let down = -ring; down <= ring; down += 1) {
      for (let across = -ring; across <= ring; across += 1) {
        if (Math.max(Math.abs(down), Math.abs(across)) !== ring) continue;
        const cell = { col: fromCol + across, row: fromRow + down };
        if (!isInside(aMap, cell.col, cell.row)) continue;
        if (TERRAIN[aMap.cells[cell.row][cell.col]].walkable) return cell;
      }
    }
  }
  return { col: fromCol, row: fromRow };
}

/* The four corners of a square round a refinery, each slid onto ground
   a tank can drive on. A guard walks this for ever. Project 23's. */
function beatAround(aMap: GameMap, post: Cell): Cell[] {
  const corners: Cell[] = [
    { col: post.col - BEAT, row: post.row - BEAT },
    { col: post.col + BEAT, row: post.row - BEAT },
    { col: post.col + BEAT, row: post.row + BEAT },
    { col: post.col - BEAT, row: post.row + BEAT }
  ];

  const beat: Cell[] = [];
  for (const corner of corners) {
    const cell = nearestWalkable(aMap, corner.col, corner.row);
    let already = false;
    for (const had of beat) {
      if (sameCell(had, cell)) already = true;
    }
    if (!already) beat.push(cell);
  }
  if (beat.length === 0) beat.push(post);
  return beat;
}

function baseOf(side: Side): Base {
  return bases[0].side === side ? bases[0] : bases[1];
}

function nextName(base: Base): string {
  const list = base.side === 'blue' ? BLUE_NAMES : RED_NAMES;
  const name = base.named < list.length ? list[base.named] : 'Unit ' + (base.named + 1);
  base.named += 1;
  return name;
}

function addUnit(base: Base, kind: UnitKind, x: number, y: number, post: Cell): Unit {
  const unit = makeUnit(base.side, kind, nextName(base), x, y, post);
  if (kind === 'tank') unit.beat = beatAround(map, base.refinery.cell);
  units.push(unit);
  replanIn.push(0);

  if (stage !== null) {
    const shown = kind !== 'base';
    const tint = kind === 'harvester'
      ? 0xffbe5c
      : (base.side === 'blue' ? 0xa8c4e0 : 0xe04a3a);
    stage.looks.push({
      hull: stage.scene.add.image(x, y, 'hull').setScale(0.7).setDepth(3).setVisible(shown)
        .setTint(base.side === 'blue' ? 0xffffff : 0xd8a09a),
      top: stage.scene.add.image(x, y, 'top')
        .setScale(0.7).setOrigin(20 / 64, 0.5).setDepth(4).setVisible(shown)
        .setTint(tint)
    });
  }
  return unit;
}

function startBase(side: Side, cell: Cell, taken: Cell[]): Base {
  const middle = middleOf(cell);
  const base: Base = {
    side: side,
    unit: makeUnit(side, 'base', side === 'blue' ? 'Your refinery' : 'Enemy refinery', middle.x, middle.y, cell),
    refinery: makeRefinery(cell),
    yard: makeYard(),
    plots: freeSpots(map, cell, taken),
    placed: [],
    named: 0,
    thinkIn: 0,
    marchIn: 0,
    marching: 0
  };

  /* The refinery goes in the list of units like anything else, so the
     guns can find it. It is put there by hand rather than by `addUnit`,
     because `addUnit` needs the base to exist first. */
  units.push(base.unit);
  replanIn.push(0);
  if (stage !== null) {
    stage.looks.push({
      hull: stage.scene.add.image(middle.x, middle.y, 'hull').setVisible(false),
      top: stage.scene.add.image(middle.x, middle.y, 'top').setVisible(false)
    });
  }
  return base;
}

function putMapOnTheBoard(index: number): void {
  if (stage === null) return;

  mapIndex = index;
  map = maps[index];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      stage.pictures[row][col].setTexture(map.cells[row][col]);
    }
  }

  for (const look of stage.looks) {
    look.hull.destroy();
    look.top.destroy();
  }
  stage.looks = [];
  units = [];
  replanIn = [];
  marks = [];
  flashes = [];
  shots = 0;
  wrecks = 0;
  won = null;
  askAgainIn = 0;
  field = makeField(map);

  const blueCell = nearestWalkable(map, BLUE_BASE.col, BLUE_BASE.row);
  const redCell = nearestWalkable(map, RED_BASE.col, RED_BASE.row);
  bases = [
    startBase('blue', blueCell, [blueCell, redCell]),
    startBase('red', redCell, [blueCell, redCell])
  ];

  for (const base of bases) {
    for (let i = 0; i < START_HARVESTERS && i < base.plots.length; i += 1) {
      const spot = middleOf(base.plots[i]);
      addUnit(base, 'harvester', spot.x, spot.y, base.plots[i]);
    }
  }

  showBanner(null);
  drawBase(stage);
  drawBeats(stage);
  rebuildSquad();
  showMapList(mapIndex);
}

buildMapList(maps.map((each) => each.name), (index) => {
  putMapOnTheBoard(index);
  playSound(mapSound);
  say(map.name + '. Two refineries, two harvesters each, and nobody hurt yet.');
});


/* ---------------------------------------------------------------------
   YOUR BUILD CARD

   A click calls project 22's `startBuild`, and that is the whole of it.
   Your side of the game works from the moment the page opens, whatever
   is still empty in commander.ts.
   --------------------------------------------------------------------- */

buildCatalogue((key) => {
  const base = baseOf('blue');
  const item = CATALOGUE[key];
  if (!startBuild(base.yard, key, base.refinery)) {
    playSound(refusedSound);
    say('No ' + item.name.toLowerCase() + ' yet. The button says why.');
    return;
  }

  playSound(orderSound);
  say(item.name + ' on order. ' + item.cost + ' credits gone, and ' + item.seconds + ' seconds to wait.');
});

/* What comes out of a yard when `takeFinished` hands a key over. A unit
   rolls onto the map. A building takes the next free plot.

   Both sides come through here, and the only difference is which base
   is handed in. */
function rollOut(base: Base, key: ItemKey): void {
  const item = CATALOGUE[key];

  if (item.kind === 'unit') {
    const gate = middleOf(base.refinery.cell);
    const unit = addUnit(base, key === 'tank' ? 'tank' : 'harvester', gate.x, gate.y, base.refinery.cell);
    if (unit.kind === 'harvester') takeNextJob(unit);
    if (base.side === 'blue') {
      rebuildSquad();
      say(unit.name + ' rolled out of your yard.');
    }
    return;
  }

  /* The first few free plots are where the starting harvesters stood,
     so the buildings begin after them. */
  const plot = base.plots[START_HARVESTERS + base.placed.length]
    ?? base.plots[base.placed.length]
    ?? base.refinery.cell;
  base.placed.push({ key: key, cell: plot });
  if (stage !== null) drawBase(stage);
  if (base.side === 'blue') say(item.name + ' finished. ' + item.note + '.');
}


/* ---------------------------------------------------------------------
   PICKING AND ORDERS

   Project 19's picking and project 20's routes. A wreck cannot be
   picked, and neither can a refinery.
   --------------------------------------------------------------------- */

/* Your harvesters and tanks, in the order they were built. The
   refinery is left out, because you cannot send it anywhere. */
function mySquad(): Unit[] {
  const mine: Unit[] = [];
  for (const unit of units) {
    if (unit.side === 'blue' && unit.kind !== 'base') mine.push(unit);
  }
  return mine;
}

function rebuildSquad(): void {
  buildSquad(mySquad(), pickOne);
}

function pickOne(unit: Unit): void {
  if (wrecked(unit)) {
    say(unit.name + ' is a wreck. It is not going anywhere.');
    playSound(refusedSound);
    return;
  }
  selectOnly(units, unit);
  playSound(selectSound);
  say(unit.name + ' picked. Click the ground to send it.');
}

function letGoOfAll(): void {
  selectOnly(units, null);
  say('Every unit let go. The harvesters keep working, and the tanks keep firing.');
}

function clickAt(x: number, y: number): void {
  const unit = unitAt(units, x, y);
  if (unit !== null) {
    pickOne(unit);
    return;
  }

  const picked = selectedUnits(units);
  if (picked.length === 0) {
    say('No unit is picked. Click one first, or drag a box round some.');
    return;
  }

  orderMove(units, x, y);
  playSound(orderSound);

  const stuck: string[] = [];
  for (const each of picked) {
    if (giveRoute(each, cellAt(each.goalX, each.goalY), true)) each.job = 'driving';
    else stuck.push(each.name);
  }

  const sent = picked.length - stuck.length;
  let words = 'Sent ' + sent + (sent === 1 ? ' unit.' : ' units.');
  if (stuck.length > 0) {
    words += ' No route for ' + stuck.join(' and ') + '.';
  }
  say(words);
}

function finishBox(): void {
  const box = boxFrom(pressX, pressY, mouseX, mouseY);
  const count = selectInBox(units, box);
  if (count === 0) {
    say('The box held none of your units, so nothing is picked.');
    return;
  }
  playSound(boxSound);
  say('Picked ' + count + (count === 1 ? ' unit' : ' units') + '. Click the ground to send them.');
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  letGoOfAll();
});

/* Project 20's pathfinder, asked for a route and given one. */
function giveRoute(unit: Unit, goal: Cell, loud: boolean): boolean {
  const route = findRoute(map, cellAt(unit.x, unit.y), goal, 'star');
  if (route === null) {
    halt(unit);
    if (unit.kind === 'harvester') unit.job = 'no route';
    if (loud) {
      marks.push({ x: unit.x, y: unit.y, big: false, until: performance.now() + 1400 });
      playSound(refusedSound);
    }
    return false;
  }
  sendTo(unit, goal, route.slice(1));   // the first cell is the one it is already in
  return true;
}


/* ---------------------------------------------------------------------
   THE ORE RUN

   All of this is project 21, finished, and it runs for both sides from
   the moment the page opens. One field, two refineries, and the
   harvesters cannot tell whose side they are on.
   --------------------------------------------------------------------- */

function takeNextJob(unit: Unit): void {
  if (unit.kind !== 'harvester' || wrecked(unit)) return;

  const base = baseOf(unit.side);
  const word = nextJob(unit, field, base.refinery);

  if (word === 'to ore') {
    const patch = nearestOre(field, cellAt(unit.x, unit.y));
    if (patch === null) {
      unit.job = 'waiting';
      return;
    }
    if (giveRoute(unit, patch, false)) unit.job = 'to ore';
    return;
  }

  if (word === 'home') {
    /* Already standing on the refinery, with the last of the ore in it.
       Project 21's `nextJob` only says 'unloading' for a full drum, so a
       harvester that comes home part full once the field is finished
       would hold on to its load for ever. One line tips it in. */
    if (sameCell(cellAt(unit.x, unit.y), base.refinery.cell)) {
      unit.job = 'unloading';
      return;
    }
    if (giveRoute(unit, base.refinery.cell, false)) unit.job = 'home';
    return;
  }

  unit.job = word;
}


/* ---------------------------------------------------------------------
   ONE UNIT, ONE FRAME

   Project 23's nine lines, and they still run both sides. A harvester
   and a refinery go through them too, and the given `armed` is what
   keeps their guns quiet.

   The last line is where the sides differ, exactly as it did last
   project. Your tanks go where you sent them. The enemy's go where the
   commander and their own mode send them.
   --------------------------------------------------------------------- */

function runUnit(unit: Unit, index: number, seconds: number): void {
  const foes = otherSide(units, unit.side);

  unit.target = armed(unit) ? nearestTarget(unit, foes) : null;
  unit.mode = nextMode(unit, foes);

  if (wrecked(unit)) {
    halt(unit);
    return;
  }

  if (armed(unit) && unit.target !== null) {
    aimAt(unit, unit.target);
    if (shootStep(unit, unit.target, seconds)) recordShot(unit, unit.target);
  }

  if (unit.side === 'red' && unit.kind === 'tank') steerRed(unit, index, seconds);
}

/* A shot has just left a barrel. The page draws it and counts it. */
function recordShot(shooter: Unit, target: Unit): void {
  shots += 1;
  flashes.push({
    fromX: shooter.x, fromY: shooter.y,
    toX: target.x, toY: target.y,
    until: performance.now() + 70
  });
  playSound(shotSound);

  if (!wrecked(target)) return;

  wrecks += 1;
  marks.push({ x: target.x, y: target.y, big: true, until: performance.now() + 1200 });
  playSound(boomSound);
  target.selected = false;
  if (target.kind === 'base') {
    say(target.name + ' has been wrecked.');
    return;
  }
  if (target.side === 'blue') rebuildSquad();
  say(target.name + ' is wrecked. ' + living('blue') + ' of yours left, ' + living('red') + ' of theirs.');
}

/* Where an enemy tank drives. It reads the word project 23's `nextMode`
   handed back, and does the one thing that word means.

   The only line your commander added is the marching one. A tank with
   marching orders keeps driving at your refinery, and a tank without
   them walks a beat round its own. */
function steerRed(unit: Unit, index: number, seconds: number): void {
  replanIn[index] -= seconds;

  /* Close enough to shoot: stop and shoot. */
  if (unit.mode === 'attacking') {
    halt(unit);
    return;
  }

  /* Seen somebody, too far to hit: drive at them, and work the route
     out again a few times a second, because the target keeps moving. */
  if (unit.mode === 'chasing' && unit.target !== null) {
    if (unit.moving && replanIn[index] > 0) return;
    replanIn[index] = 0.5;
    giveRoute(unit, cellAt(unit.target.x, unit.target.y), false);
    return;
  }

  /* Already on its way somewhere: let it get there. */
  if (unit.moving) return;

  /* Marching, and stopped: point it at your refinery again. */
  if (unit.marching) {
    marchOne(unit, 0, 1);
    return;
  }

  /* Nobody about, and no orders: walk the beat. */
  headForNextPost(unit);
}

/* Ask project 23's `nextPost` for somewhere to go, and go there. A
   corner with no route to it is skipped. */
function headForNextPost(unit: Unit): void {
  for (let tries = 0; tries < unit.beat.length; tries += 1) {
    const cell = nextPost(unit);
    if (missing(cell)) return;
    if (giveRoute(unit, cell, false)) return;
  }
}

/* Send one marching tank at the other side's refinery, to a parking
   spot of its own so the wave arrives as a line and not a heap. */
function marchOne(unit: Unit, place: number, count: number): void {
  const aim = baseOf(foeOf(unit.side)).unit;
  const park = parkingSpot(place, count);
  const goalX = aim.x + park.across;
  const goalY = aim.y + park.down;
  const goal = nearestWalkable(map, cellAt(goalX, goalY).col, cellAt(goalX, goalY).row);

  const route = findRoute(map, cellAt(unit.x, unit.y), goal, 'star');
  if (route === null) {
    unit.marching = false;
    return;
  }
  sendToSpot(unit, goalX, goalY, route.slice(1));
}

function living(side: Side): number {
  let count = 0;
  for (const unit of units) {
    if (unit.side === side && unit.kind !== 'base' && !wrecked(unit)) count += 1;
  }
  return count;
}

/* Is this side's refinery still standing? The banner needs to know
   about a fight that wrecked both of them, and your `whoWon` calls that
   `null`, the same as a game still being played. */
function baseStanding(side: Side): boolean {
  return !wrecked(baseOf(side).unit);
}


/* ---------------------------------------------------------------------
   THE COMMANDER

   Fifteen lines, and every one of your seven functions is in them or
   under them.

   It is called once a frame and it decides twice: what to buy, once a
   second, and who marches, once every few seconds. The enemy yard then
   works exactly as yours does, because it is project 22's yard.
   --------------------------------------------------------------------- */

function runCommander(base: Base, seconds: number): void {
  /* Spending. Your `spendStep` asks your `wantNext` what the plan wants
     and buys it when the yard says 'ok'. */
  base.thinkIn -= seconds;
  if (done(5) && base.thinkIn <= 0) {
    base.thinkIn = THINK_EVERY;
    spendStep(base.yard, base.refinery, units, base.side);
  }

  /* Attacking. Your `wantsAttack` decides whether to go, and your
     `attackOrders` decides who. The tanks it hands back are given
     routes here. */
  base.marchIn -= seconds;
  if (done(7) && base.marchIn <= 0) {
    base.marchIn = MARCH_EVERY;
    const going = done(6) && wantsAttack(units, base.side) ? attackOrders(units, base.side) ?? [] : [];

    for (const unit of units) {
      if (unit.side === base.side && unit.kind === 'tank') unit.marching = false;
    }
    for (let i = 0; i < going.length; i += 1) {
      going[i].marching = true;
      marchOne(going[i], i, going.length);
    }
    base.marching = going.length;
  }
}


/* ---------------------------------------------------------------------
   EVERY FRAME
   --------------------------------------------------------------------- */

function update(this: Phaser.Scene, time: number, delta: number): void {
  if (stage === null) return;
  const seconds = Math.min(delta / 1000, 0.05);
  const playing = won === null;

  if (playing) {
    /* Everybody drives. A harvester that arrives asks for its next job. */
    let arrived = 0;
    for (const unit of units) {
      if (driveUnit(unit, map, seconds) === 'arrived') {
        if (unit.side === 'blue') arrived += 1;
        takeNextJob(unit);
      }
    }
    if (arrived > 0) playSound(arriveSound);

    /* Project 21's two standing-still jobs, for both sides. */
    for (const unit of units) {
      if (wrecked(unit)) continue;
      if (unit.job === 'digging') {
        const got = digStep(field, unit, seconds);
        if (got <= 0 || unit.load >= CAPACITY) takeNextJob(unit);
        continue;
      }
      if (unit.job === 'unloading') {
        unloadStep(unit, baseOf(unit.side).refinery, seconds);
        if (unit.load <= 0) takeNextJob(unit);
      }
    }

    /* A harvester with nothing to do asks again once a second, and that
       is also what starts both ore runs when the page opens. */
    askAgainIn -= seconds;
    if (askAgainIn <= 0) {
      askAgainIn = 1;
      for (const unit of units) {
        if (!unit.moving && (unit.job === 'waiting' || unit.job === 'no route')) {
          takeNextJob(unit);
        }
      }
    }

    /* Everybody thinks. */
    for (let i = 0; i < units.length; i += 1) {
      runUnit(units[i], i, seconds);
    }

    /* Both yards work, and the enemy's commander decides. */
    for (const base of bases) {
      buildStep(base.yard, seconds);
      const finished = takeFinished(base.yard);
      if (finished !== null) {
        if (base.side === 'blue') playSound(readySound);
        rollOut(base, finished);
      }
      if (base.side === 'red') runCommander(base, seconds);
    }

    /* Has anybody won? Your `whoWon` is asked every frame, and almost
       every frame the answer is `null`. */
    if (done(9)) {
      const result = whoWon(units) ?? null;
      const ended = result === null && !baseStanding('blue') && !baseStanding('red')
        ? 'draw'
        : result;
      if (ended !== null) {
        won = ended;
        playSound(boomSound);
        say(ended === 'blue'
          ? 'You won. The enemy refinery is gone, and so is its whole war.'
          : ended === 'red'
            ? 'You lost. Pick a map and start again.'
            : 'A draw. Both refineries fell in the same fight.');
      }
    }
  }

  const now = performance.now();
  marks = marks.filter((mark) => mark.until > now);
  flashes = flashes.filter((flash) => flash.until > now);

  for (let i = 0; i < units.length && i < stage.looks.length; i += 1) {
    const unit = units[i];
    const look = stage.looks[i];
    if (unit.kind === 'base') continue;
    look.hull.setPosition(unit.x, unit.y).setRotation(unit.angle);
    look.top.setPosition(unit.x, unit.y)
      .setRotation(unit.kind === 'tank' ? unit.turret : unit.angle);
    if (wrecked(unit)) {
      look.hull.setTint(0x2a3138);
      look.top.setTint(0x2a3138).setRotation(unit.turret + 0.6);
    }
  }

  const box = dragging ? boxFrom(pressX, pressY, mouseX, mouseY) : null;
  const hovered = mouseX < 0 ? null : cellAt(mouseX, mouseY);
  const onMap = hovered !== null && isInside(map, hovered.col, hovered.row);

  drawPatches(stage);
  drawRoutes(stage.routes);
  drawDiscs(stage.discs);
  drawOver(stage.over, box, onMap ? hovered : null);

  const mine = baseOf('blue');
  showPlate({
    mapName: map.name,
    credits: mine.refinery.credits,
    blue: done(1) ? countKind(units, 'blue', 'harvester') + countKind(units, 'blue', 'tank') : undefined,
    red: done(1) ? countKind(units, 'red', 'harvester') + countKind(units, 'red', 'tank') : undefined
  });
  showForces({ blue: sideReport('blue'), red: sideReport('red') });
  showCatalogue(verdicts());
  showQueue(queueReport());
  showEnemy(enemyReport());
  showSquad(mySquad().map(squadRow));
  showBanner(won);
}

/* One column of the Forces card. Every number in it is one of your
   functions, asked about one side. */
function sideReport(side: Side): SideReport {
  return {
    harvesters: done(1) ? countKind(units, side, 'harvester') : undefined,
    tanks: done(1) ? countKind(units, side, 'tank') : undefined,
    base: done(1) ? countKind(units, side, 'base') : undefined,
    strength: done(2) ? armyStrength(units, side) : undefined
  };
}

/* One answer for each line of the catalogue, in the table's own order.
   This is your yard, so it works from the first frame. */
function verdicts(): (Verdict | undefined)[] {
  const base = baseOf('blue');
  return ITEM_KEYS.map((key) => canBuild(base.yard, key, base.refinery.credits));
}

function queueReport(): { making: string; wait: number | null; rows: QueueRow[] } {
  const yard = baseOf('blue').yard;
  const rows: QueueRow[] = yard.queue.map((each) => ({
    name: CATALOGUE[each.key].name,
    part: fullness(each.done, each.seconds)
  }));

  return {
    making: yard.queue.length === 0 ? '—' : CATALOGUE[yard.queue[0].key].name,
    wait: waitTime(yard),
    rows: rows
  };
}

/* The Enemy card. Four wells, and every one of them is your commander
   saying what it is thinking. */
function enemyReport(): { credits: number; wants: string; orders: string; marching: number | undefined } {
  const base = baseOf('red');

  let wants = '—';
  if (done(3)) {
    const key = wantNext(base.yard, units, 'red') ?? null;
    wants = key === null ? 'nothing' : CATALOGUE[key].name;
  }

  let orders = '—';
  if (done(6)) orders = wantsAttack(units, 'red') ? 'attack' : 'massing';

  return {
    credits: base.refinery.credits,
    wants: wants,
    orders: orders,
    marching: done(7) ? base.marching : undefined
  };
}

/* The words a mode is printed as. Project 23's table, for your side
   only, because the Enemy card does not list tanks one by one. */
const MODE_WORDS: Record<Mode, string> = {
  dead: 'wrecked',
  attacking: 'firing',
  chasing: 'spotted',
  patrolling: 'holding'
};

function squadRow(unit: Unit): SquadRowReport {
  const harvester = unit.kind === 'harvester';
  return {
    doing: wrecked(unit) ? 'wrecked' : (harvester ? unit.job : MODE_WORDS[unit.mode]),
    note: harvester ? Math.floor(unit.load) + ' ore' : Math.round(unit.health) + ' hp',
    health: unit.health / MAX_HEALTH,
    picked: unit.selected
  };
}


/* ---------------------------------------------------------------------
   DRAWING

   Nothing here decides anything. It only draws what the field, the
   units, the yards and your commander already say.
   --------------------------------------------------------------------- */

const AMBER = 0xffbe5c;
const ORANGE = 0xff9a2e;
const RED = 0xe04a3a;
const BLUE = 0x8fb7e8;
const INK = 0x0d1216;

function sideColour(side: Side): number {
  return side === 'blue' ? BLUE : RED;
}

/* Every patch with ore left glows, and the glow fades as it empties.
   Project 21's, unchanged. */
function drawPatches(onStage: Stage): void {
  const pen = onStage.patches;
  pen.clear();

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const holds = TERRAIN[map.cells[row][col]].holds;
      const here = oreAt(field, { col: col, row: row });
      const number = onStage.numbers[row][col];
      const label = holds > 0 && here > 0 ? String(Math.ceil(here)) : '';
      if (number.text !== label) number.setText(label);
      if (holds <= 0) continue;

      if (here <= 0) {
        pen.fillStyle(INK, 0.42);
        pen.fillRect(col * TILE, row * TILE, TILE, TILE);
        continue;
      }

      const share = fullness(here, holds);
      pen.fillStyle(AMBER, 0.12 + 0.3 * share);
      pen.fillRect(col * TILE + 2, row * TILE + 2, TILE - 4, TILE - 4);
      pen.lineStyle(2, AMBER, 0.35 + 0.5 * share);
      pen.strokeRect(col * TILE + 2, row * TILE + 2, TILE - 4, TILE - 4);
    }
  }
}

/* Both refineries, and every building either side has finished. Drawn
   again each time something new lands, because none of them moves. */
function drawBase(onStage: Stage): void {
  const pen = onStage.base;
  pen.clear();
  for (const label of onStage.labels) label.destroy();
  onStage.labels = [];

  for (const base of bases) {
    const colour = sideColour(base.side);
    const left = base.refinery.cell.col * TILE;
    const top = base.refinery.cell.row * TILE;

    pen.fillStyle(INK, 0.86);
    pen.fillRect(left + 2, top + 2, TILE - 4, TILE - 4);
    pen.lineStyle(2.5, colour, 0.9);
    pen.strokeRect(left + 2, top + 2, TILE - 4, TILE - 4);

    /* The hopper: the same shape in both corners, in each side's own
       colour. */
    pen.fillStyle(colour, 0.85);
    pen.beginPath();
    pen.moveTo(left + 10, top + 14);
    pen.lineTo(left + TILE - 10, top + 14);
    pen.lineTo(left + TILE / 2 + 5, top + 30);
    pen.lineTo(left + TILE / 2 - 5, top + 30);
    pen.closePath();
    pen.fillPath();
    pen.fillRect(left + TILE / 2 - 5, top + 30, 10, 8);

    onStage.labels.push(nameTag(
      onStage, left + TILE / 2, top - 2,
      base.side === 'blue' ? 'YOURS' : 'THEIRS',
      base.side === 'blue' ? '#8fb7e8' : '#e04a3a'
    ));

    for (const building of base.placed) {
      const item = CATALOGUE[building.key];
      const tint = Phaser.Display.Color.HexStringToColor(item.colour).color;
      const x = building.cell.col * TILE;
      const y = building.cell.row * TILE;

      pen.fillStyle(INK, 0.86);
      pen.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
      pen.lineStyle(2.5, tint, 0.9);
      pen.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4);
      pen.fillStyle(tint, 0.25);
      pen.fillRect(x + 7, y + 7, TILE - 14, TILE - 14);
      pen.lineStyle(2, colour, 0.7);
      pen.strokeRect(x + 5, y + 5, TILE - 10, TILE - 10);

      onStage.labels.push(nameTag(onStage, x + TILE / 2, y + TILE / 2, item.tag, item.colour, 0.5));
    }
  }
}

function nameTag(onStage: Stage, x: number, y: number, words: string, colour: string, originY = 1): Phaser.GameObjects.Text {
  return onStage.scene.add.text(x, y, words, {
    fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
    fontSize: '11px',
    fontStyle: 'bold',
    color: colour,
    stroke: '#0d1216',
    strokeThickness: 4
  }).setOrigin(0.5, originY).setDepth(2.3);
}

/* The beat each enemy guard walks, drawn once per map. */
function drawBeats(onStage: Stage): void {
  const pen = onStage.beats;
  pen.clear();

  const beat = beatAround(map, baseOf('red').refinery.cell);
  for (let i = 0; i < beat.length; i += 1) {
    const from = middleOf(beat[i]);
    const to = middleOf(beat[(i + 1) % beat.length]);
    dotted(pen, from, to, RED, 0.3);
  }
}

/* A disc under every unit, saying whose it is. */
function drawDiscs(pen: Phaser.GameObjects.Graphics): void {
  pen.clear();

  for (const unit of units) {
    if (unit.kind === 'base') continue;
    const colour = sideColour(unit.side);
    const alive = !wrecked(unit);
    const size = TANK_REACH + 6;

    pen.fillStyle(INK, alive ? 0.5 : 0.3);
    pen.fillCircle(unit.x, unit.y, size + 1);
    pen.fillStyle(colour, alive ? 0.5 : 0.15);
    pen.fillCircle(unit.x, unit.y, size);
    pen.lineStyle(2, colour, alive ? 0.9 : 0.3);
    pen.strokeCircle(unit.x, unit.y, size);
  }
}

/* The route every driving unit is following. Yours are orange, because
   you chose them. Theirs are red, because your commander did. */
function drawRoutes(pen: Phaser.GameObjects.Graphics): void {
  pen.clear();

  for (const unit of units) {
    if (!unit.moving || wrecked(unit)) continue;
    const points = [{ x: unit.x, y: unit.y }];
    for (const cell of unit.route) points.push(middleOf(cell));
    points.push({ x: unit.goalX, y: unit.goalY });
    const mine = unit.side === 'blue';
    line(pen, points, 2, mine ? ORANGE : RED, mine ? 0.5 : 0.3);
    if (mine && unit.selected) cross(pen, unit.goalX, unit.goalY, 7, ORANGE);
  }
}

/* Over the units: the health bars, the load bars, the gun flashes, the
   rings round a picked tank, the marks and the drag box. */
function drawOver(pen: Phaser.GameObjects.Graphics, box: Box | null, hovered: Cell | null): void {
  pen.clear();
  const now = performance.now();

  /* How far a picked tank of yours can shoot. */
  for (const unit of units) {
    if (!unit.selected || unit.kind !== 'tank' || wrecked(unit)) continue;
    pen.lineStyle(2, ORANGE, 0.5);
    pen.strokeCircle(unit.x, unit.y, GUN_RANGE);
  }

  /* A shot, for seventy milliseconds. */
  for (const flash of flashes) {
    const fade = Math.min(1, (flash.until - now) / 70);
    pen.lineStyle(5, INK, 0.5 * fade);
    pen.lineBetween(flash.fromX, flash.fromY, flash.toX, flash.toY);
    pen.lineStyle(2, 0xfff0c0, fade);
    pen.lineBetween(flash.fromX, flash.fromY, flash.toX, flash.toY);
  }

  /* A health bar over everything still standing. A refinery gets a wide
     one, because it is the thing the whole game is about. */
  for (const unit of units) {
    if (wrecked(unit)) continue;
    const isBase = unit.kind === 'base';
    const whole = isBase ? BASE_HEALTH : MAX_HEALTH;
    const share = Math.max(0, Math.min(1, unit.health / whole));
    const width = isBase ? 40 : 28;
    const barLeft = unit.x - width / 2;
    const barTop = unit.y - (isBase ? 30 : 25);

    pen.fillStyle(INK, 0.65);
    pen.fillRect(barLeft - 1, barTop - 1, width + 2, 7);
    pen.fillStyle(share > 0.35 ? sideColour(unit.side) : AMBER, 0.95);
    pen.fillRect(barLeft, barTop, width * share, 5);
    pen.lineStyle(1, INK, 0.5);
    pen.strokeRect(barLeft - 0.5, barTop - 0.5, width + 1, 6);
  }

  /* A load bar under every harvester that is carrying anything. */
  for (const unit of units) {
    if (unit.kind !== 'harvester' || wrecked(unit) || unit.load <= 0) continue;
    const share = fullness(unit.load, CAPACITY);
    pen.fillStyle(INK, 0.6);
    pen.fillRect(unit.x - 15, unit.y + 18, 30, 6);
    pen.fillStyle(AMBER, 0.95);
    pen.fillRect(unit.x - 14, unit.y + 19, 28 * share, 4);
  }

  /* A ring where somebody found no route, and a bigger one where
     somebody blew up. */
  for (const mark of marks) {
    const fade = Math.min(1, (mark.until - now) / 600);
    const size = mark.big ? TANK_REACH + 4 + (1 - fade) * 26 : TANK_REACH + 4;
    pen.lineStyle(4, INK, 0.5 * fade);
    pen.strokeCircle(mark.x, mark.y, size);
    pen.lineStyle(2, mark.big ? AMBER : RED, fade);
    pen.strokeCircle(mark.x, mark.y, size);
  }

  if (!dragging && hovered !== null) {
    pen.lineStyle(2, 0xffffff, 0.7);
    pen.strokeRect(hovered.col * TILE + 1, hovered.row * TILE + 1, TILE - 2, TILE - 2);

    const unit = unitAt(units, mouseX, mouseY);
    if (unit !== null) {
      pen.lineStyle(3, INK, 0.45);
      pen.strokeCircle(unit.x, unit.y, TANK_REACH + 1);
      pen.lineStyle(1.5, 0xffffff, 0.9);
      pen.strokeCircle(unit.x, unit.y, TANK_REACH + 1);
    }
  }

  for (const unit of units) {
    if (unit.selected) corners(pen, unit.x, unit.y, TANK_REACH + 2);
  }

  if (box !== null) {
    for (const unit of units) {
      if (unit.side === 'blue' && unit.kind !== 'base' && !wrecked(unit) && isInBox(box, unit.x, unit.y)) {
        pen.fillStyle(ORANGE, 0.28);
        pen.fillCircle(unit.x, unit.y, TANK_REACH);
      }
    }
    pen.fillStyle(ORANGE, 0.1);
    pen.fillRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
    pen.lineStyle(3, INK, 0.4);
    pen.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
    pen.lineStyle(1.5, ORANGE, 1);
    pen.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
  }
}

/* A line drawn as a row of short dashes. */
function dotted(
  pen: Phaser.GameObjects.Graphics,
  from: { x: number; y: number },
  to: { x: number; y: number },
  colour: number,
  alpha: number
): void {
  const across = to.x - from.x;
  const down = to.y - from.y;
  const far = Math.sqrt(across * across + down * down);
  if (far < 1) return;

  pen.lineStyle(2, colour, alpha);
  for (let along = 0; along < far; along += 12) {
    const end = Math.min(along + 6, far);
    pen.lineBetween(
      from.x + across * (along / far), from.y + down * (along / far),
      from.x + across * (end / far), from.y + down * (end / far)
    );
  }
}

/* A line through several points, with a dark edge under it. */
function line(pen: Phaser.GameObjects.Graphics, points: { x: number; y: number }[], width: number, colour: number, alpha: number): void {
  if (points.length < 2) return;
  for (const [lineWidth, lineColour, lineAlpha] of [[width + 3, INK, 0.45 * alpha], [width, colour, alpha]]) {
    pen.lineStyle(lineWidth, lineColour, lineAlpha);
    pen.beginPath();
    pen.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) pen.lineTo(points[i].x, points[i].y);
    pen.strokePath();
  }
}

/* A small X. */
function cross(pen: Phaser.GameObjects.Graphics, x: number, y: number, size: number, colour: number): void {
  pen.lineStyle(5, INK, 0.45);
  pen.lineBetween(x - size, y - size, x + size, y + size);
  pen.lineBetween(x - size, y + size, x + size, y - size);
  pen.lineStyle(2.5, colour, 1);
  pen.lineBetween(x - size, y - size, x + size, y + size);
  pen.lineBetween(x - size, y + size, x + size, y - size);
}

/* Four orange corners round a picked unit. */
function corners(pen: Phaser.GameObjects.Graphics, x: number, y: number, half: number): void {
  const arm = half * 0.45;
  for (const width of [5, 2.5]) {
    pen.lineStyle(width, width === 5 ? INK : ORANGE, width === 5 ? 0.45 : 1);
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const cx = x + sx * half;
        const cy = y + sy * half;
        pen.lineBetween(cx, cy, cx - sx * arm, cy);
        pen.lineBetween(cx, cy, cx, cy - sy * arm);
      }
    }
  }
}
