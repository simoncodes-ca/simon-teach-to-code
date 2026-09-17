/* =====================================================================
   game.ts. File 8 of 8.

   One job: put the other seven to work. It sets Phaser up, loads the
   maps and the pictures, turns the mouse into picking and orders, hands
   every harvester its next job, and draws the whole yard on every
   frame.

   ore.html loads this file, and only this file. Every other file
   arrives because of an `import` line at the top.

   Read it to see where your functions get used. Do not change it.
   ===================================================================== */

import Phaser from 'phaser';
import {
  CAPACITY, COLS, DRAG_START, HEIGHT, ROWS, TANK_REACH, TILE, WIDTH
} from './numbers.ts';
import { BLANK, TERRAIN, TERRAIN_KEYS } from './terrain.ts';
import { cellAt, isInside, linesToMap, makeMap, middleOf, sameCell } from './map.ts';
import type { Cell, GameMap } from './map.ts';
import { findRoute, guess } from './paths.ts';
import {
  boxFrom, driveHarvester, harvesterAt, isInBox, makeHarvester, orderMove,
  selectedHarvesters, selectInBox, selectOnly, sendTo
} from './units.ts';
import type { Box, Harvester, Job } from './units.ts';
import {
  digStep, fullness, makeField, makeRefinery, nearestOre, nextJob, oreAt,
  takeOre, unloadStep
} from './ore.ts';
import type { OreField, Refinery } from './ore.ts';
import {
  buildMapList, buildSquad, say, screenEl, showField, showMapList,
  showMouse, showPlate, showRefinery, showSquad
} from './rack.ts';


/* ---------------------------------------------------------------------
   THE MAPS

   The same as projects 19 and 20. Every map file in the `maps` folder
   is read when the page starts, and checked before it is used.
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

let harvesters: Harvester[] = [];      // the six harvesters, in squad order
let field: OreField = makeField(map);  // the ore left in every cell
let refinery: Refinery = makeRefinery();
let loads = 0;                         // how many full loads have been tipped in

/* When this map's run began, so the Refinery card can turn the credits
   into ore a minute. */
let runStarted = 0;

let mouseX = -1;                       // the mouse, in pixels on the map. -1 means off the map
let mouseY = -1;
let pressing = false;                  // is the mouse button held down on the map?
let pressX = 0;                        // where it was pressed
let pressY = 0;
let dragging = false;                  // has it moved far enough to be a box?
let askAgainIn = 0;                    // seconds until idle harvesters ask for a job again

/* A red ring where a harvester found no route. Each one fades. */
type Mark = { x: number; y: number; until: number };
let marks: Mark[] = [];

const NAMES = ['Able', 'Baker', 'Charlie', 'Dog', 'Easy', 'Fox'];

/* The sounds. The same seven as project 20, and the same pattern as
   every project since the calculator. */
const selectSound = new Audio('assets/select.wav');
const boxSound = new Audio('assets/box.wav');
const orderSound = new Audio('assets/order.wav');
const tippedSound = new Audio('assets/found.wav');
const arriveSound = new Audio('assets/arrive.wav');
const noRouteSound = new Audio('assets/blocked.wav');
const mapSound = new Audio('assets/map.wav');

function playSound(sound: HTMLAudioElement): void {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}


/* ---------------------------------------------------------------------
   WHICH JOB IS NEXT?

   The same as projects 18, 19 and 20. When the page loads, each of your
   functions is tried once on a field of its own: two cells, with 240
   ore in the second one. The first function that hands back nothing is
   the next job.

   `job` is the number of that job, or 10 when every job is done. The
   page only uses a function once its job is done.
   --------------------------------------------------------------------- */

function whichJob(): { number: number; text: string } {
  const tinyMap = makeMap('Tiny', 2, 1);
  const tiny = makeField(tinyMap);
  const here = { col: 0, row: 0 };
  const there = { col: 1, row: 0 };
  tiny.amount[0][1] = 240;
  tiny.started = 240;
  const spot = middleOf(there);
  const tinyHarvester = makeHarvester('Tiny', spot.x, spot.y);
  const tinyRefinery = makeRefinery();

  if (fullness(1, 2) === undefined) {
    return { number: 1, text: 'Job 1: fullness() is still empty, so every bar on the page is flat. Open ore.ts.' };
  }
  if (oreAt(tiny, there) === undefined) {
    return { number: 2, text: 'Job 2: oreAt() is still empty, so no patch knows how much is left in it.' };
  }
  if (nearestOre(tiny, here) === undefined) {
    return { number: 3, text: 'Job 3: nearestOre() is still empty, so nothing can find a patch.' };
  }
  if (takeOre(tiny, there, 1) === undefined) {
    return { number: 4, text: 'Jobs 4 and 5: write the first test in ore.test.ts, then takeOre().' };
  }
  if (digStep(tiny, tinyHarvester, 0.1) === undefined) {
    return { number: 6, text: 'Job 6: digStep() is still empty. Write it, and a harvester on a patch starts to fill.' };
  }
  tinyHarvester.load = 10;
  if (unloadStep(tinyHarvester, tinyRefinery, 0.1) === undefined) {
    return { number: 7, text: 'Jobs 7 and 8: write the second test in ore.test.ts, then unloadStep(). The credits start to climb.' };
  }
  if (nextJob(tinyHarvester, tiny, tinyRefinery) === undefined) {
    return { number: 9, text: 'Job 9: nextJob() is still empty, so every harvester waits for your orders.' };
  }
  return { number: 10, text: 'The run goes round on its own. Pick a harvester and click the ground to send it somewhere else.' };
}

const job = whichJob();

/* Is this job done? */
function done(number: number): boolean {
  return job.number > number;
}


/* ---------------------------------------------------------------------
   SETTING PHASER UP
   --------------------------------------------------------------------- */

/* The two pictures that make one harvester. */
type Look = {
  hull: Phaser.GameObjects.Image;
  drum: Phaser.GameObjects.Image;
};

/* Everything Phaser builds once the scene starts. */
type Stage = {
  scene: Phaser.Scene;
  pictures: Phaser.GameObjects.Image[][];   // one picture for each cell. pictures[row][col]
  numbers: Phaser.GameObjects.Text[][];     // one number for each cell, for the ore left in it
  looks: Look[];                            // one look for each harvester, in squad order
  patches: Phaser.GameObjects.Graphics;     // the amber shading on the ore
  base: Phaser.GameObjects.Graphics;        // the refinery
  baseName: Phaser.GameObjects.Text;        // its label
  routes: Phaser.GameObjects.Graphics;      // the routes the harvesters are driving
  over: Phaser.GameObjects.Graphics;        // over the harvesters: rings, bars, corners, the box
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

/* The loader reads the terrain table, the same as projects 18 to 20.
   The new ore tile arrives because the table has a new line. */
function preload(this: Phaser.Scene): void {
  for (const key of TERRAIN_KEYS) {
    this.load.image(key, 'assets/' + TERRAIN[key].picture);
  }
  this.load.image('hull', 'assets/hull-blue.png');
  this.load.image('drum', 'assets/turret-blue.png');
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
    baseName: this.add.text(0, 0, 'REFINERY', {
      fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ffbe5c',
      stroke: '#0d1216',
      strokeThickness: 4
    }).setOrigin(0.5, 1).setDepth(2.3),
    routes: this.add.graphics().setDepth(2.7),
    over: this.add.graphics().setDepth(5)
  };

  /* The right button lets go of every harvester, so its menu stays shut. */
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
   A MAP, A REFINERY, AND A SQUAD AROUND IT

   Project 20's `placeSquad`, with one line added: the refinery's own
   cell is left free.
   --------------------------------------------------------------------- */

function placeSquad(aMap: GameMap): Harvester[] {
  const spots: { col: number; row: number; far: number }[] = [];
  for (let row = 0; row < aMap.rows; row += 2) {
    for (let col = 0; col < aMap.cols; col += 2) {
      if (!TERRAIN[aMap.cells[row][col]].walkable) continue;
      if (sameCell({ col: col, row: row }, refinery.cell)) continue;
      const across = col - refinery.cell.col;
      const down = row - refinery.cell.row;
      spots.push({ col: col, row: row, far: across * across + down * down });
    }
  }
  spots.sort((a, b) => a.far - b.far);

  const squad: Harvester[] = [];
  for (let i = 0; i < NAMES.length && i < spots.length; i += 1) {
    const middle = middleOf({ col: spots[i].col, row: spots[i].row });
    squad.push(makeHarvester(NAMES[i], middle.x, middle.y));
  }
  return squad;
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
  loads = 0;
  runStarted = performance.now();

  for (const look of stage.looks) {
    look.hull.destroy();
    look.drum.destroy();
  }
  harvesters = placeSquad(map);
  stage.looks = [];
  for (const harvester of harvesters) {
    stage.looks.push({
      hull: stage.scene.add.image(harvester.x, harvester.y, 'hull').setScale(0.7).setDepth(3),
      /* The tank's turret, tinted amber: it stands in for the drum the
         ore goes into. */
      drum: stage.scene.add.image(harvester.x, harvester.y, 'drum')
        .setScale(0.7).setOrigin(20 / 64, 0.5).setDepth(4).setTint(0xffbe5c)
    });
  }
  marks = [];
  askAgainIn = 0;

  drawRefinery(stage);
  buildSquad(harvesters, pickOne);
  showMapList(mapIndex);
}

buildMapList(maps.map((each) => each.name), (index) => {
  if (index === mapIndex) return;
  putMapOnTheBoard(index);
  playSound(mapSound);
  say(map.name + '. A fresh field, and the credits start again at 0.');
});


/* ---------------------------------------------------------------------
   PICKING AND ORDERS

   Picking is project 19's, and nothing about it changed. An order
   searches for a route, the same as project 20. A harvester you send
   somewhere asks your `nextJob` for its next job when it arrives.
   --------------------------------------------------------------------- */

function pickOne(harvester: Harvester): void {
  selectOnly(harvesters, harvester);
  playSound(selectSound);
  say(harvester.name + ' picked. Click the ground to send it.');
}

function letGoOfAll(): void {
  selectOnly(harvesters, null);
  say('Every harvester let go. They keep working on their own.');
}

function clickAt(x: number, y: number): void {
  const harvester = harvesterAt(harvesters, x, y);
  if (harvester !== null) {
    pickOne(harvester);
    return;
  }

  const picked = selectedHarvesters(harvesters);
  if (picked.length === 0) {
    say('No harvester is picked. Click one first, or drag a box round some.');
    return;
  }

  orderMove(harvesters, x, y);
  playSound(orderSound);

  const stuck: string[] = [];
  for (const each of picked) {
    if (giveRoute(each, cellAt(each.goalX, each.goalY), true)) each.job = 'driving';
    else stuck.push(each.name);
  }

  const sent = picked.length - stuck.length;
  let words = 'Sent ' + sent + (sent === 1 ? ' harvester.' : ' harvesters.');
  if (stuck.length > 0) {
    words += ' No route for ' + stuck.join(' and ') + '.';
  }
  say(words);
}

function finishBox(): void {
  const box = boxFrom(pressX, pressY, mouseX, mouseY);
  const count = selectInBox(harvesters, box);
  if (count === 0) {
    say('The box held no harvesters, so nothing is picked.');
    return;
  }
  playSound(boxSound);
  say('Picked ' + count + (count === 1 ? ' harvester' : ' harvesters') + '. Click the ground to send them.');
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  letGoOfAll();
});


/* ---------------------------------------------------------------------
   HANDING OUT THE JOBS

   `giveRoute` asks project 20's `findRoute` for a route to a cell, and
   sends the harvester along it. A harvester with no route stops and
   says so.

   `takeNextJob` asks your `nextJob` what to do, and then does what the
   word says. Those two functions are the whole loop.
   --------------------------------------------------------------------- */

function giveRoute(harvester: Harvester, goal: Cell, loud: boolean): boolean {
  const route = findRoute(map, cellAt(harvester.x, harvester.y), goal, 'star');
  if (route === null) {
    harvester.moving = false;
    harvester.route = [];
    harvester.job = 'no route';
    if (loud) {
      marks.push({ x: harvester.x, y: harvester.y, until: performance.now() + 1400 });
      playSound(noRouteSound);
    }
    return false;
  }
  sendTo(harvester, goal, route.slice(1));   // the first cell is the one it is already in
  return true;
}

function takeNextJob(harvester: Harvester): void {
  if (!done(9)) {
    harvester.job = harvester.moving ? 'driving' : 'waiting';
    return;
  }

  const word = nextJob(harvester, field, refinery);

  if (word === 'to ore') {
    const patch = nearestOre(field, cellAt(harvester.x, harvester.y));
    if (patch === null) {
      harvester.job = 'waiting';
      return;
    }
    if (giveRoute(harvester, patch, false)) harvester.job = 'to ore';
    return;
  }

  if (word === 'home') {
    if (giveRoute(harvester, refinery.cell, false)) harvester.job = 'home';
    return;
  }

  harvester.job = word;
}


/* ---------------------------------------------------------------------
   EVERY FRAME
   --------------------------------------------------------------------- */

function update(this: Phaser.Scene, time: number, delta: number): void {
  if (stage === null) return;
  const seconds = Math.min(delta / 1000, 0.05);

  /* Everybody drives. A harvester that arrives asks for its next job. */
  let arrived = 0;
  for (const harvester of harvesters) {
    if (driveHarvester(harvester, map, seconds) === 'arrived') {
      arrived += 1;
      takeNextJob(harvester);
    }
  }
  if (arrived > 0) playSound(arriveSound);

  /* Everybody works. Digging and unloading are the two jobs that stand
     still and change a number instead. */
  for (const harvester of harvesters) {
    if (!done(9)) {
      workWhereItStands(harvester, seconds);
      continue;
    }
    /* Past job 9, every function exists, so these two call yours
       straight out. */
    if (harvester.job === 'digging') {
      const got = digStep(field, harvester, seconds);
      if (got <= 0 || harvester.load >= CAPACITY) takeNextJob(harvester);
      continue;
    }
    if (harvester.job === 'unloading') {
      const moved = unloadStep(harvester, refinery, seconds);
      if (harvester.load <= 0) {
        if (moved > 0) {
          loads += 1;
          playSound(tippedSound);
        }
        takeNextJob(harvester);
      }
    }
  }

  /* A harvester with nothing to do asks again once a second, and that
     is also what starts the whole run when the page opens. */
  askAgainIn -= seconds;
  if (askAgainIn <= 0) {
    askAgainIn = 1;
    for (const harvester of harvesters) {
      if (!harvester.moving && (harvester.job === 'waiting' || harvester.job === 'no route')) {
        takeNextJob(harvester);
      }
    }
  }

  marks = marks.filter((mark) => mark.until > performance.now());

  for (let i = 0; i < harvesters.length; i += 1) {
    const harvester = harvesters[i];
    stage.looks[i].hull.setPosition(harvester.x, harvester.y).setRotation(harvester.angle);
    stage.looks[i].drum.setPosition(harvester.x, harvester.y).setRotation(harvester.angle);
  }

  const box = dragging ? boxFrom(pressX, pressY, mouseX, mouseY) : null;
  const hovered = mouseX < 0 ? null : cellAt(mouseX, mouseY);
  const onMap = hovered !== null && isInside(map, hovered.col, hovered.row);
  const nearest = onMap && done(3) ? nearestOre(field, hovered) : undefined;

  drawPatches(stage);
  drawRoutes(stage.routes);
  drawOver(stage.over, box, onMap ? hovered : null, nearest ?? null);

  showPlate(map.name, refinery.credits, working());
  showSquad(harvesters, harvesters.map((each) => done(1) ? fullness(each.load, CAPACITY) : 0));
  showRefinery(refineryReport());
  showField(fieldReport());

  /* The four facts under the mouse that come from your functions. Each
     one stays `undefined` while the function that finds it is empty. */
  let cellOre: number | undefined;
  let cellFull: number | undefined;
  let steps: number | null = null;
  if (onMap && hovered !== null) {
    if (done(2)) cellOre = oreAt(field, hovered);
    if (cellOre !== undefined && done(1)) {
      cellFull = fullness(cellOre, TERRAIN[map.cells[hovered.row][hovered.col]].holds);
    }
    if (nearest !== undefined && nearest !== null) steps = guess(hovered, nearest);
  }
  showMouse(map, hovered, cellOre, cellFull, nearest, steps);
}

/* Until job 9 there is no `nextJob` to hand work out, so a harvester
   standing still works where it stands. It digs if there is ore under
   it, and it tips its load in if it is at the refinery.

   That is how jobs 6 and 8 show on the page: send a harvester to a
   patch yourself, and watch its bar fill. Once job 9 is done, this is
   never called again. */
function workWhereItStands(harvester: Harvester, seconds: number): void {
  if (harvester.moving) return;
  let word: Job = 'waiting';

  if (done(6) && digStep(field, harvester, seconds) > 0) word = 'digging';

  if (done(8) && sameCell(cellAt(harvester.x, harvester.y), refinery.cell)) {
    const moved = unloadStep(harvester, refinery, seconds);
    if (moved > 0) {
      word = 'unloading';
      if (harvester.load <= 0) {
        loads += 1;
        playSound(tippedSound);
      }
    }
  }
  harvester.job = word;
}


/* How many harvesters have something to do. */
function working(): number {
  let count = 0;
  for (const harvester of harvesters) {
    if (harvester.job !== 'waiting' && harvester.job !== 'no route') count += 1;
  }
  return count;
}

/* The Refinery card. The rate is every credit so far, shared out over
   the minutes the run has been going. */
function refineryReport(): { rate: number | null; loads: number; tipping: string; bar: number | null } {
  const minutes = (performance.now() - runStarted) / 60000;

  let tipping = '—';
  let bar: number | null = null;
  for (const harvester of harvesters) {
    if (harvester.job !== 'unloading') continue;
    tipping = harvester.name;
    bar = done(1) ? fullness(harvester.load, CAPACITY) : null;
  }

  return {
    rate: done(8) && minutes > 0.08 ? refinery.credits / minutes : null,
    loads: loads,
    tipping: tipping,
    bar: bar
  };
}

/* The Field card. Both numbers come from your `oreAt`. */
function fieldReport(): { patches: number | null; left: number | null; taken: number | null; bar: number | null } {
  if (!done(2)) return { patches: null, left: null, taken: null, bar: null };

  let patches = 0;
  let left = 0;
  for (let row = 0; row < map.rows; row += 1) {
    for (let col = 0; col < map.cols; col += 1) {
      const here = oreAt(field, { col: col, row: row });
      if (here <= 0) continue;
      patches += 1;
      left += here;
    }
  }
  const taken = field.started - left;
  return {
    patches: patches,
    left: left,
    taken: taken,
    bar: done(1) ? fullness(taken, field.started) : null
  };
}


/* ---------------------------------------------------------------------
   DRAWING

   Nothing here decides anything. It only draws what the field and the
   harvesters already say.
   --------------------------------------------------------------------- */

const AMBER = 0xffbe5c;
const ORANGE = 0xff9a2e;
const RED = 0xe04a3a;
const INK = 0x0d1216;

/* Every patch with ore left glows, and the glow fades as it empties.
   The number on the cell is the ore still in it.

   Both come from your functions, so before job 2 the cells are bare. */
function drawPatches(onStage: Stage): void {
  const pen = onStage.patches;
  pen.clear();

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const holds = TERRAIN[map.cells[row][col]].holds;
      const here = done(2) ? oreAt(field, { col: col, row: row }) : 0;
      const number = onStage.numbers[row][col];
      const label = holds > 0 && here > 0 ? String(Math.ceil(here)) : '';
      if (number.text !== label) number.setText(label);
      if (holds <= 0) continue;

      /* A patch that has been dug out keeps its picture, so it goes
         grey instead. The ore is gone, and the ground stays. */
      if (here <= 0) {
        pen.fillStyle(INK, 0.42);
        pen.fillRect(col * TILE, row * TILE, TILE, TILE);
        continue;
      }

      const share = done(1) ? fullness(here, holds) : 0;
      pen.fillStyle(AMBER, 0.12 + 0.3 * share);
      pen.fillRect(col * TILE + 2, row * TILE + 2, TILE - 4, TILE - 4);
      pen.lineStyle(2, AMBER, 0.35 + 0.5 * share);
      pen.strokeRect(col * TILE + 2, row * TILE + 2, TILE - 4, TILE - 4);
    }
  }
}

/* The refinery: a dark pad with an amber hopper on it. Drawn once for
   each map, because it never moves. */
function drawRefinery(onStage: Stage): void {
  const pen = onStage.base;
  pen.clear();

  const left = refinery.cell.col * TILE;
  const top = refinery.cell.row * TILE;
  pen.fillStyle(INK, 0.86);
  pen.fillRect(left + 2, top + 2, TILE - 4, TILE - 4);
  pen.lineStyle(2.5, AMBER, 0.9);
  pen.strokeRect(left + 2, top + 2, TILE - 4, TILE - 4);

  /* The hopper: a wide mouth narrowing to a chute. */
  pen.fillStyle(AMBER, 0.9);
  pen.beginPath();
  pen.moveTo(left + 10, top + 14);
  pen.lineTo(left + TILE - 10, top + 14);
  pen.lineTo(left + TILE / 2 + 5, top + 30);
  pen.lineTo(left + TILE / 2 - 5, top + 30);
  pen.closePath();
  pen.fillPath();
  pen.fillRect(left + TILE / 2 - 5, top + 30, 10, 8);

  onStage.baseName.setPosition(left + TILE / 2, top - 2);
}

/* The route every driving harvester is following, and a cross on where
   it is going. */
function drawRoutes(pen: Phaser.GameObjects.Graphics): void {
  pen.clear();

  for (const harvester of harvesters) {
    if (!harvester.moving) continue;
    const points = [{ x: harvester.x, y: harvester.y }];
    for (const cell of harvester.route) points.push(middleOf(cell));
    points.push({ x: harvester.goalX, y: harvester.goalY });
    line(pen, points, 2, ORANGE, 0.5);
    cross(pen, harvester.goalX, harvester.goalY, 7, ORANGE);
  }
}

/* Over the harvesters: the load bars, the no-route rings, the cell
   under the mouse, the ring on the nearest patch, the corners round
   picked harvesters, and the drag box. */
function drawOver(pen: Phaser.GameObjects.Graphics, box: Box | null, hovered: Cell | null, nearest: Cell | null): void {
  pen.clear();

  for (const mark of marks) {
    const fade = Math.min(1, (mark.until - performance.now()) / 600);
    pen.lineStyle(4, INK, 0.5 * fade);
    pen.strokeCircle(mark.x, mark.y, TANK_REACH + 4);
    pen.lineStyle(2, RED, fade);
    pen.strokeCircle(mark.x, mark.y, TANK_REACH + 4);
  }

  /* One load bar over each harvester, straight across whatever way it
     faces. Its width is your `fullness`. */
  for (const harvester of harvesters) {
    const share = done(1) ? fullness(harvester.load, CAPACITY) : 0;
    const barLeft = harvester.x - 14;
    const barTop = harvester.y - 25;
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

    if (nearest !== null) {
      const middle = middleOf(nearest);
      pen.lineStyle(5, INK, 0.45);
      pen.strokeCircle(middle.x, middle.y, TILE / 2 - 5);
      pen.lineStyle(2.5, AMBER, 1);
      pen.strokeCircle(middle.x, middle.y, TILE / 2 - 5);
    }

    const harvester = harvesterAt(harvesters, mouseX, mouseY);
    if (harvester !== null) {
      pen.lineStyle(3, INK, 0.45);
      pen.strokeCircle(harvester.x, harvester.y, TANK_REACH + 1);
      pen.lineStyle(1.5, 0xffffff, 0.9);
      pen.strokeCircle(harvester.x, harvester.y, TANK_REACH + 1);
    }
  }

  for (const harvester of harvesters) {
    if (harvester.selected) corners(pen, harvester.x, harvester.y, TANK_REACH + 2);
  }

  if (box !== null) {
    for (const harvester of harvesters) {
      if (isInBox(box, harvester.x, harvester.y)) {
        pen.fillStyle(ORANGE, 0.28);
        pen.fillCircle(harvester.x, harvester.y, TANK_REACH);
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

/* Four orange corners round a picked harvester. */
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
