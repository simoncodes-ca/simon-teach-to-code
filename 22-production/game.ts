/* =====================================================================
   game.ts. File 10 of 10.

   One job: put the other nine to work. It sets Phaser up, loads the
   maps and the pictures, runs project 21's ore harvesting, turns a
   click on the Build card into a call to your `startBuild`, works the
   queue on every frame, and puts whatever rolls out onto the map.

   build.html loads this file, and only this file. Every other file
   arrives because of an `import` line at the top.

   Read it to see where your functions get used. Do not change it.
   ===================================================================== */

import Phaser from 'phaser';
import {
  CAPACITY, COLS, DRAG_START, HEIGHT, ROWS, START_HARVESTERS, TANK_REACH,
  TILE, WIDTH
} from './numbers.ts';
import { BLANK, TERRAIN, TERRAIN_KEYS } from './terrain.ts';
import { cellAt, isInside, linesToMap, makeMap, middleOf, sameCell } from './map.ts';
import type { Cell, GameMap } from './map.ts';
import { findRoute } from './paths.ts';
import { CATALOGUE, ITEM_KEYS } from './catalogue.ts';
import type { ItemKey } from './catalogue.ts';
import {
  boxFrom, driveUnit, isInBox, makeUnit, orderMove, selectedUnits,
  selectInBox, selectOnly, sendTo, unitAt
} from './units.ts';
import type { Box, Unit } from './units.ts';
import {
  digStep, fullness, makeField, makeRefinery, nearestOre, nextJob, oreAt,
  unloadStep
} from './ore.ts';
import type { OreField, Refinery } from './ore.ts';
import {
  buildStep, canBuild, isBuilt, makeYard, needsMet, startBuild, takeFinished,
  waitTime
} from './build.ts';
import type { Verdict, Yard } from './build.ts';
import {
  buildCatalogue, buildMapList, buildSquad, say, screenEl, showCatalogue,
  showMapList, showPlate, showQueue, showRefinery, showSquad
} from './rack.ts';
import type { QueueRow } from './rack.ts';


/* ---------------------------------------------------------------------
   THE MAPS

   The same as projects 19, 20 and 21. Every map file in the `maps`
   folder is read when the page starts, and checked before it is used.
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

let mapIndex = 0;                      // which map in `maps` is on the board
let map: GameMap = maps[0];

let units: Unit[] = [];                // every harvester and tank, in squad order
let field: OreField = makeField(map);  // the ore left in every cell
let refinery: Refinery = makeRefinery();
let yard: Yard = makeYard();           // what is built, and what is on order

/* Where each finished building stands. The yard does not choose a spot,
   because placing a building by hand is project 24's job. It takes the
   next free cell near the refinery from this list. */
let spots: Cell[] = [];
let placed: { key: ItemKey; cell: Cell }[] = [];

/* When this map's run began, so the Refinery card can turn the credits
   into ore a minute. */
let runStarted = 0;
let spent = 0;                         // credits the yard has taken, for the ore a minute sum

let mouseX = -1;                       // the mouse, in pixels on the map. -1 means off the map
let mouseY = -1;
let pressing = false;                  // is the mouse button held down on the map?
let pressX = 0;                        // where it was pressed
let pressY = 0;
let dragging = false;                  // has it moved far enough to be a box?
let askAgainIn = 0;                    // seconds until idle harvesters ask for a job again
let named = 0;                         // how many units have been named on this map

/* A red ring where a harvester found no route. Each one fades. */
type Mark = { x: number; y: number; until: number };
let marks: Mark[] = [];

const NAMES = [
  'Able', 'Baker', 'Charlie', 'Dog', 'Easy', 'Fox', 'George', 'How',
  'Item', 'Jig', 'King', 'Love', 'Mike', 'Nan', 'Oboe', 'Peter'
];

function nextName(): string {
  const name = named < NAMES.length ? NAMES[named] : 'Unit ' + (named + 1);
  named += 1;
  return name;
}

/* The sounds. The same seven as projects 20 and 21, and the same
   pattern as every project since the calculator. */
const selectSound = new Audio('assets/select.wav');
const boxSound = new Audio('assets/box.wav');
const orderSound = new Audio('assets/order.wav');
const readySound = new Audio('assets/found.wav');
const arriveSound = new Audio('assets/arrive.wav');
const refusedSound = new Audio('assets/blocked.wav');
const mapSound = new Audio('assets/map.wav');

function playSound(sound: HTMLAudioElement): void {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}


/* ---------------------------------------------------------------------
   WHICH JOB IS NEXT?

   The same as projects 18 to 21. When the page loads, each of your
   functions is tried once on a yard of its own. The first one that
   hands back nothing is the next job.

   `job` is the number of that job, or 10 when every job is done. The
   page only uses a function once its job is done.
   --------------------------------------------------------------------- */

function whichJob(): { number: number; text: string } {
  const tinyYard = makeYard();
  const tinyRefinery = makeRefinery();
  tinyRefinery.credits = 9000;

  if (isBuilt(tinyYard, 'power') === undefined) {
    return { number: 1, text: 'Job 1: isBuilt() is still empty, so the yard cannot tell what it has already built. Open build.ts.' };
  }
  if (needsMet(tinyYard, 'harvester') === undefined) {
    return { number: 2, text: 'Job 2: needsMet() is still empty, so no padlock can ever come off.' };
  }
  if (canBuild(tinyYard, 'harvester', 9000) === undefined) {
    return { number: 3, text: 'Job 3: canBuild() is still empty, so every button on the Build card is dead.' };
  }
  if (startBuild(tinyYard, 'harvester', tinyRefinery) === undefined) {
    return { number: 4, text: 'Jobs 4 and 5: write the first test in build.test.ts, then startBuild(). Then a click buys something.' };
  }
  if (buildStep(tinyYard, 0.1) === undefined) {
    return { number: 6, text: 'Job 6: buildStep() is still empty, so the front of the queue never gets any work done on it.' };
  }
  if (waitTime(tinyYard) === undefined) {
    return { number: 7, text: 'Job 7: waitTime() is still empty, so the Ready in well has nothing to count down.' };
  }
  if (takeFinished(tinyYard) === undefined) {
    return { number: 8, text: 'Jobs 8 and 9: write the second test in build.test.ts, then takeFinished(). Then the queue starts to move.' };
  }
  return { number: 10, text: 'The yard runs on its own. Buy a harvester, then a power plant, and work your way down the list.' };
}

const job = whichJob();

/* Is this job done? */
function done(number: number): boolean {
  return job.number > number;
}


/* ---------------------------------------------------------------------
   SETTING PHASER UP
   --------------------------------------------------------------------- */

/* The two pictures that make one unit. A harvester is a truck with an
   amber load in its bed. A tank is a hull with a turret, left the
   colour it came in. */
type Look = {
  hull: Phaser.GameObjects.Image;
  top: Phaser.GameObjects.Image;
};

/* Everything Phaser builds once the scene starts. */
type Stage = {
  scene: Phaser.Scene;
  pictures: Phaser.GameObjects.Image[][];   // one picture for each cell. pictures[row][col]
  numbers: Phaser.GameObjects.Text[][];     // one number for each cell, for the ore left in it
  looks: Look[];                            // one look for each unit, in squad order
  patches: Phaser.GameObjects.Graphics;     // the amber shading on the ore
  base: Phaser.GameObjects.Graphics;        // the refinery and the buildings
  labels: Phaser.GameObjects.Text[];        // the words on them
  slabs: Phaser.GameObjects.Image[];        // one picture for each finished building
  routes: Phaser.GameObjects.Graphics;      // the routes the units are driving
  over: Phaser.GameObjects.Graphics;        // over the units: rings, bars, corners, the box
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

/* The loader reads the terrain table, the same as projects 18 to 21. */
function preload(this: Phaser.Scene): void {
  for (const key of TERRAIN_KEYS) {
    this.load.image(key, 'assets/' + TERRAIN[key].picture);
  }
  this.load.image('hull', 'assets/hull-blue.png');
  this.load.image('top', 'assets/turret-blue.png');
  this.load.image('truck', 'assets/truck-blue.png');
  this.load.image('load', 'assets/load-ore.png');
  /* One picture for each building in the table, under its own key. A
     unit has no picture here, because it is drawn as a hull and a top. */
  for (const key of ITEM_KEYS) {
    const picture = CATALOGUE[key].picture;
    if (picture !== null) this.load.image(key, 'assets/' + picture);
  }
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
        fontSize: '15px',
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
    looks: [],
    patches: this.add.graphics().setDepth(2),
    base: this.add.graphics().setDepth(2.2),
    labels: [],
    slabs: [],
    routes: this.add.graphics().setDepth(2.7),
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
   A MAP, A REFINERY, AND THREE HARVESTERS

   Project 21 started with six. This one starts with three, so that
   buying a fourth is worth doing.
   --------------------------------------------------------------------- */

/* Every walkable cell that is not the refinery and has no ore in it,
   nearest to the refinery first. The first few become building plots,
   and the buildings never land on ore a harvester wants. */
function freeSpots(aMap: GameMap): Cell[] {
  const found: { col: number; row: number; far: number }[] = [];
  for (let row = 0; row < aMap.rows; row += 1) {
    for (let col = 0; col < aMap.cols; col += 1) {
      const ground = TERRAIN[aMap.cells[row][col]];
      if (!ground.walkable || ground.holds > 0) continue;
      if (sameCell({ col: col, row: row }, refinery.cell)) continue;
      const across = col - refinery.cell.col;
      const down = row - refinery.cell.row;
      found.push({ col: col, row: row, far: across * across + down * down });
    }
  }
  found.sort((a, b) => a.far - b.far);
  return found.map((each) => ({ col: each.col, row: each.row }));
}

/* Where a unit appears when it rolls out of the yard: the plot of the
   building it needed, so a tank drives out of the war factory that
   opened it. A unit that needed nothing, or whose building is somehow
   not there, starts at the refinery instead.

   The `needs` column says which building that is, so this function
   never names one. */
function gateSpot(key: ItemKey): { x: number; y: number } {
  const needs = CATALOGUE[key].needs;
  const gate = placed.find((each) => each.key === needs);
  return middleOf(gate?.cell ?? refinery.cell);
}

function addUnit(kind: 'harvester' | 'tank', x: number, y: number): Unit {
  const unit = makeUnit(kind, nextName(), x, y);
  units.push(unit);
  if (stage !== null) {
    const harvests = kind === 'harvester';
    const top = stage.scene.add.image(x, y, harvests ? 'load' : 'top')
      .setScale(0.7).setDepth(4);
    /* A turret turns about its middle, which sits a fifth of the way
       along its picture. A load sits in the bed, so it turns with the
       truck and keeps the middle it came with. */
    if (!harvests) top.setOrigin(20 / 64, 0.5).setTint(0xa8c4e0);
    stage.looks.push({
      hull: stage.scene.add.image(x, y, harvests ? 'truck' : 'hull').setScale(0.7).setDepth(3),
      top
    });
  }
  return unit;
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

  field = makeField(map);
  refinery = makeRefinery();
  yard = makeYard();
  placed = [];
  spent = 0;
  runStarted = performance.now();
  named = 0;

  for (const look of stage.looks) {
    look.hull.destroy();
    look.top.destroy();
  }
  stage.looks = [];
  units = [];

  spots = freeSpots(map);
  for (let i = 0; i < START_HARVESTERS && i < spots.length; i += 1) {
    const middle = middleOf(spots[i]);
    addUnit('harvester', middle.x, middle.y);
  }

  marks = [];
  askAgainIn = 0;

  drawBase(stage);
  buildSquad(units, pickOne);
  showMapList(mapIndex);
}

buildMapList(maps.map((each) => each.name), (index) => {
  if (index === mapIndex) return;
  putMapOnTheBoard(index);
  playSound(mapSound);
  say(map.name + '. A fresh field, an empty yard, and the credits start again.');
});


/* ---------------------------------------------------------------------
   THE BUILD CARD

   A click on a button calls your `startBuild`, and that is the whole of
   it. The page never checks the price itself, and it never touches the
   credits. It asks, and it does what it is told.
   --------------------------------------------------------------------- */

buildCatalogue((key) => {
  if (!done(5)) {
    say('Job 5: startBuild() is still empty, so a click cannot buy anything yet.');
    playSound(refusedSound);
    return;
  }

  const item = CATALOGUE[key];
  if (!startBuild(yard, key, refinery)) {
    playSound(refusedSound);
    say('No ' + item.name.toLowerCase() + ' yet. The button says why.');
    return;
  }

  spent += item.cost;
  playSound(orderSound);
  say(item.name + ' on order. ' + item.cost + ' credits gone, and ' + item.seconds + ' seconds to wait.');
});

/* What comes out of the yard when your `takeFinished` hands a key over.
   A unit rolls onto the map. A building takes the next free plot. */
function rollOut(key: ItemKey): void {
  const item = CATALOGUE[key];

  if (item.kind === 'unit') {
    const gate = gateSpot(key);
    const unit = addUnit(key === 'tank' ? 'tank' : 'harvester', gate.x, gate.y);
    buildSquad(units, pickOne);
    if (unit.kind === 'harvester') takeNextJob(unit);
    say(unit.name + ' rolled out of the yard. That is ' + units.length + ' units.');
    return;
  }

  /* The first few free cells are where the starting harvesters stood, so
     the buildings begin after them and never land on top of one. */
  const plot = spots[START_HARVESTERS + placed.length] ?? spots[placed.length] ?? refinery.cell;
  placed.push({ key: key, cell: plot });
  if (stage !== null) drawBase(stage);
  say(item.name + ' finished. ' + item.note + '.');
}


/* ---------------------------------------------------------------------
   PICKING AND ORDERS

   Project 19's picking and project 20's routes, with nothing changed
   but the word `unit`. A harvester you send somewhere asks project 21's
   `nextJob` for its next job when it arrives. A tank just stops.
   --------------------------------------------------------------------- */

function pickOne(unit: Unit): void {
  selectOnly(units, unit);
  playSound(selectSound);
  say(unit.name + ' picked. Click the ground to send it.');
}

function letGoOfAll(): void {
  selectOnly(units, null);
  say('Every unit let go. The harvesters keep working on their own.');
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
    say('The box held no units, so nothing is picked.');
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


/* ---------------------------------------------------------------------
   HANDING OUT THE ORE JOBS

   All of this is project 21, finished. It runs from the moment the page
   opens, so the credits climb while you write build.ts.
   --------------------------------------------------------------------- */

function giveRoute(unit: Unit, goal: Cell, loud: boolean): boolean {
  const route = findRoute(map, cellAt(unit.x, unit.y), goal, 'star');
  if (route === null) {
    unit.moving = false;
    unit.route = [];
    unit.job = 'no route';
    if (loud) {
      marks.push({ x: unit.x, y: unit.y, until: performance.now() + 1400 });
      playSound(refusedSound);
    }
    return false;
  }
  sendTo(unit, goal, route.slice(1));   // the first cell is the one it is already in
  return true;
}

function takeNextJob(unit: Unit): void {
  if (unit.kind === 'tank') {
    unit.job = unit.moving ? 'driving' : 'waiting';
    return;
  }

  const word = nextJob(unit, field, refinery);

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
    if (giveRoute(unit, refinery.cell, false)) unit.job = 'home';
    return;
  }

  unit.job = word;
}


/* ---------------------------------------------------------------------
   EVERY FRAME
   --------------------------------------------------------------------- */

function update(this: Phaser.Scene, time: number, delta: number): void {
  if (stage === null) return;
  const seconds = Math.min(delta / 1000, 0.05);

  /* Everybody drives. A unit that arrives asks for its next job. */
  let arrived = 0;
  for (const unit of units) {
    if (driveUnit(unit, map, seconds) === 'arrived') {
      arrived += 1;
      takeNextJob(unit);
    }
  }
  if (arrived > 0) playSound(arriveSound);

  /* Project 21's two standing-still jobs. */
  for (const unit of units) {
    if (unit.job === 'digging') {
      const got = digStep(field, unit, seconds);
      if (got <= 0 || unit.load >= CAPACITY) takeNextJob(unit);
      continue;
    }
    if (unit.job === 'unloading') {
      unloadStep(unit, refinery, seconds);
      if (unit.load <= 0) takeNextJob(unit);
    }
  }

  /* A harvester with nothing to do asks again once a second, and that
     is also what starts the whole run when the page opens. */
  askAgainIn -= seconds;
  if (askAgainIn <= 0) {
    askAgainIn = 1;
    for (const unit of units) {
      if (!unit.moving && (unit.job === 'waiting' || unit.job === 'no route')) {
        takeNextJob(unit);
      }
    }
  }

  /* The yard. Two lines, and they are jobs 6 and 9. */
  if (done(6)) buildStep(yard, seconds);
  if (done(9)) {
    const finished = takeFinished(yard);
    if (finished !== null) {
      playSound(readySound);
      rollOut(finished);
    }
  }

  marks = marks.filter((mark) => mark.until > performance.now());

  for (let i = 0; i < units.length && i < stage.looks.length; i += 1) {
    const unit = units[i];
    stage.looks[i].hull.setPosition(unit.x, unit.y).setRotation(unit.angle);
    stage.looks[i].top.setPosition(unit.x, unit.y).setRotation(unit.angle);
  }

  const box = dragging ? boxFrom(pressX, pressY, mouseX, mouseY) : null;
  const hovered = mouseX < 0 ? null : cellAt(mouseX, mouseY);
  const onMap = hovered !== null && isInside(map, hovered.col, hovered.row);

  drawPatches(stage);
  drawRoutes(stage.routes);
  drawOver(stage.over, box, onMap ? hovered : null);

  showPlate(map.name, refinery.credits, units.length);
  showCatalogue(verdicts());
  showQueue(queueReport());
  showRefinery(refineryReport());
  showSquad(units, units.map((each) => fullness(each.load, CAPACITY)));
}


/* One answer for each line of the catalogue, in the table's own order.
   Before job 3 there is nothing to ask, so every button stays dead. */
function verdicts(): (Verdict | undefined)[] {
  return ITEM_KEYS.map((key) => done(3) ? canBuild(yard, key, refinery.credits) : undefined);
}

/* The Queue card. The bars are project 21's `fullness`, given here,
   fed by your `buildStep`. The countdown is your `waitTime`. */
function queueReport(): { making: string; wait: number | null; rows: QueueRow[] } {
  const rows: QueueRow[] = yard.queue.map((each) => ({
    name: CATALOGUE[each.key].name,
    part: fullness(each.done, each.seconds)
  }));

  return {
    making: yard.queue.length === 0 ? '—' : CATALOGUE[yard.queue[0].key].name,
    wait: done(7) ? waitTime(yard) : null,
    rows: rows
  };
}

/* The Refinery card. The rate is every credit the run has produced,
   spent or not, shared out over the minutes it has lasted. */
function refineryReport(): { rate: number | null; left: number; diggers: number } {
  const minutes = (performance.now() - runStarted) / 60000;

  let left = 0;
  for (let row = 0; row < map.rows; row += 1) {
    for (let col = 0; col < map.cols; col += 1) {
      left += oreAt(field, { col: col, row: row });
    }
  }

  let diggers = 0;
  for (const unit of units) {
    if (unit.kind === 'harvester') diggers += 1;
  }

  return {
    rate: minutes > 0.08 ? (field.started - left) / minutes : null,
    left: left,
    diggers: diggers
  };
}


/* ---------------------------------------------------------------------
   DRAWING

   Nothing here decides anything. It only draws what the field, the
   units and the yard already say.
   --------------------------------------------------------------------- */

const AMBER = 0xffbe5c;
const ORANGE = 0xff9a2e;
const RED = 0xe04a3a;
const INK = 0x0d1216;

/* Every patch with ore left glows, and the glow fades as it empties.
   All of it is project 21, finished. */
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

/* The refinery, and every building the yard has finished. Drawn again
   each time something new lands, because none of them ever moves.

   A building is a coloured pad with its own picture on it and its
   three letters over the top. The picture, the letters and the colour
   all come from `catalogue.ts`, so this function never names one. */
function drawBase(onStage: Stage): void {
  const pen = onStage.base;
  pen.clear();
  for (const label of onStage.labels) label.destroy();
  onStage.labels = [];
  for (const slab of onStage.slabs) slab.destroy();
  onStage.slabs = [];

  /* The refinery: a dark pad with an amber hopper on it. */
  const left = refinery.cell.col * TILE;
  const top = refinery.cell.row * TILE;
  pen.fillStyle(INK, 0.86);
  pen.fillRect(left + 2, top + 2, TILE - 4, TILE - 4);
  pen.lineStyle(2.5, AMBER, 0.9);
  pen.strokeRect(left + 2, top + 2, TILE - 4, TILE - 4);

  pen.fillStyle(AMBER, 0.9);
  pen.beginPath();
  pen.moveTo(left + 10, top + 14);
  pen.lineTo(left + TILE - 10, top + 14);
  pen.lineTo(left + TILE / 2 + 5, top + 30);
  pen.lineTo(left + TILE / 2 - 5, top + 30);
  pen.closePath();
  pen.fillPath();
  pen.fillRect(left + TILE / 2 - 5, top + 30, 10, 8);

  onStage.labels.push(nameTag(onStage, left + TILE / 2, top - 2, 'REFINERY', '#ffbe5c'));

  for (const building of placed) {
    const item = CATALOGUE[building.key];
    const colour = Phaser.Display.Color.HexStringToColor(item.colour).color;
    const x = building.cell.col * TILE;
    const y = building.cell.row * TILE;

    pen.fillStyle(INK, 0.86);
    pen.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
    pen.lineStyle(2.5, colour, 0.9);
    pen.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4);
    /* Its own picture, from the table. A line with no picture falls
       back to a wash of its colour, so a sixth line still shows up. */
    if (item.picture === null) {
      pen.fillStyle(colour, 0.25);
      pen.fillRect(x + 7, y + 7, TILE - 14, TILE - 14);
    } else {
      onStage.slabs.push(onStage.scene.add
        .image(x + TILE / 2, y + TILE / 2, building.key)
        .setDepth(2.25));
    }

    onStage.labels.push(nameTag(onStage, x + TILE / 2, y - 2, item.tag, item.colour));
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

/* The route every driving unit is following, and a cross on where it
   is going. */
function drawRoutes(pen: Phaser.GameObjects.Graphics): void {
  pen.clear();

  for (const unit of units) {
    if (!unit.moving) continue;
    const points = [{ x: unit.x, y: unit.y }];
    for (const cell of unit.route) points.push(middleOf(cell));
    points.push({ x: unit.goalX, y: unit.goalY });
    line(pen, points, 2, ORANGE, 0.5);
    cross(pen, unit.goalX, unit.goalY, 7, ORANGE);
  }
}

/* Over the units: the load bars, the no-route rings, the cell under the
   mouse, the corners round picked units, and the drag box. */
function drawOver(pen: Phaser.GameObjects.Graphics, box: Box | null, hovered: Cell | null): void {
  pen.clear();

  for (const mark of marks) {
    const fade = Math.min(1, (mark.until - performance.now()) / 600);
    pen.lineStyle(4, INK, 0.5 * fade);
    pen.strokeCircle(mark.x, mark.y, TANK_REACH + 4);
    pen.lineStyle(2, RED, fade);
    pen.strokeCircle(mark.x, mark.y, TANK_REACH + 4);
  }

  /* One load bar over each harvester. A tank carries nothing, so it
     gets no bar. */
  for (const unit of units) {
    if (unit.kind !== 'harvester') continue;
    const share = fullness(unit.load, CAPACITY);
    const barLeft = unit.x - 14;
    const barTop = unit.y - 25;
    pen.fillStyle(INK, 0.65);
    pen.fillRect(barLeft - 1, barTop - 1, 30, 7);
    pen.fillStyle(AMBER, 0.95);
    pen.fillRect(barLeft, barTop, 28 * share, 5);
    pen.lineStyle(1, AMBER, 0.55);
    pen.strokeRect(barLeft - 0.5, barTop - 0.5, 29, 6);
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
      if (isInBox(box, unit.x, unit.y)) {
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
