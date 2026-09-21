/* =====================================================================
   game.ts. File 7 of 7.

   One job: put the other six to work. It sets Phaser up, loads the
   maps and the pictures, turns the mouse into picking and orders, plays
   the search out on the map, and drives the tanks on every frame.

   paths.html loads this file, and only this file. Every other file
   arrives because of an `import` line at the top.

   Read it to see where your functions get used. Do not change it.
   ===================================================================== */

import Phaser from 'phaser';
import { COLS, DRAG_START, HEIGHT, ROWS, SEARCH_SPEED, TANK_REACH, TILE, WIDTH } from './numbers.ts';
import { BLANK, TERRAIN, TERRAIN_KEYS } from './terrain.ts';
import { cellAt, isInside, linesToMap, makeMap, middleOf } from './map.ts';
import type { Cell, GameMap } from './map.ts';
import {
  bestIndex, findRoute, guess, neighbours, routeBack, searchStep, startSearch
} from './paths.ts';
import type { Search, Step, Way } from './paths.ts';
import {
  boxFrom, driveTank, isInBox, makeTank, orderMove, selectedTanks,
  selectInBox, selectOnly, tankAt
} from './units.ts';
import type { Box, Tank } from './units.ts';
import {
  buildMapList, buildSquad, onWay, say, screenEl, showMapList,
  showMouse, showPlate, showSearch, showSquad
} from './rack.ts';
import type { Report } from './rack.ts';


/* ---------------------------------------------------------------------
   THE MAPS

   The same as project 19. Every map file in the `maps` folder is read
   when the page starts, and checked before it is used.
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

let mapIndex = 0;                    // which map in `maps` is on the board
let map: GameMap = maps[0];

let tanks: Tank[] = [];              // the six tanks, in squad order
let reports: Report[] = [];          // what each tank did last, in the same order

let way: Way = 'breadth';            // which way the searches work

/* The search you watch on the map. It belongs to the first tank of the
   last order. The page takes a few steps of it every frame, so you can
   see it spread. The tanks do not wait for it: each one already has
   its route from your `findRoute`. */
let lastOrder: { name: string; start: Cell; goal: Cell } | null = null;
let shown: Search | null = null;
let shownStep: Step | 'waiting' = 'waiting';
let shownRoute: Cell[] | null = null;
let stepsOwed = 0;                   // steps the search may take, saved up between frames

let mouseX = -1;                     // the mouse, in pixels on the map. -1 means off the map
let mouseY = -1;
let pressing = false;                // is the mouse button held down on the map?
let pressX = 0;                      // where it was pressed
let pressY = 0;
let dragging = false;                // has it moved far enough to be a box?

/* A red ring where a tank found no route. Each one fades after a moment. */
type Mark = { x: number; y: number; until: number };
let marks: Mark[] = [];

const NAMES = ['Able', 'Baker', 'Charlie', 'Dog', 'Easy', 'Fox'];

/* The sounds. The same pattern as every project since the calculator. */
const selectSound = new Audio('assets/select.wav');
const boxSound = new Audio('assets/box.wav');
const orderSound = new Audio('assets/order.wav');
const foundSound = new Audio('assets/found.wav');
const arriveSound = new Audio('assets/arrive.wav');
const noRouteSound = new Audio('assets/blocked.wav');
const mapSound = new Audio('assets/map.wav');

function playSound(sound: HTMLAudioElement): void {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}


/* ---------------------------------------------------------------------
   WHICH JOB IS NEXT?

   The same as projects 18 and 19. When the page loads, each of your
   functions is tried once on a tiny map of its own: two cells of grass,
   side by side. The first one that hands back nothing is the next job.

   `job` is the number of that job, or 10 when every job is done. The
   page only uses a function once its job is done.
   --------------------------------------------------------------------- */

function nextJob(): { number: number; text: string } {
  const tinyMap = makeMap('Tiny', 2, 1);
  const here = { col: 0, row: 0 };
  const there = { col: 1, row: 0 };

  if (neighbours(tinyMap, here) === undefined) {
    return { number: 1, text: 'Job 1: neighbours() is still empty, so no cell knows its ways out. Open paths.ts.' };
  }
  const tiny = startSearch(tinyMap, here, there, 'breadth');
  if (tiny === undefined) {
    return { number: 2, text: 'Job 2: startSearch() is still empty. Write it, then an order puts a 0 on the tank.' };
  }
  if (searchStep(tiny) === undefined) {
    return { number: 3, text: 'Job 3: searchStep() is still empty, so the search never spreads.' };
  }
  searchStep(tiny);
  if (routeBack(tiny) === undefined) {
    return { number: 4, text: 'Job 4: routeBack() is still empty, so a found goal draws no route.' };
  }
  if (findRoute(tinyMap, here, there, 'breadth') === undefined) {
    return { number: 5, text: 'Jobs 5 and 6: write the first test in paths.test.ts, then findRoute(). The tanks start to drive.' };
  }
  if (guess(here, there) === undefined) {
    return { number: 7, text: 'Job 7: guess() is still empty, so A* has nothing to aim with.' };
  }
  if (bestIndex(startSearch(tinyMap, here, there, 'star')) === undefined) {
    return { number: 8, text: 'Jobs 8 and 9: write the second test in paths.test.ts, then bestIndex(). The A* button starts to work.' };
  }
  return { number: 10, text: 'Pick some tanks and click the ground. Then press Breadth-first or A* to watch the search again.' };
}

const job = nextJob();

/* Is this job done? */
function done(number: number): boolean {
  return job.number > number;
}


/* ---------------------------------------------------------------------
   SETTING PHASER UP
   --------------------------------------------------------------------- */

/* The two pictures that make one tank. */
type Look = {
  hull: Phaser.GameObjects.Image;
  turret: Phaser.GameObjects.Image;
};

/* Everything Phaser builds once the scene starts. */
type Stage = {
  scene: Phaser.Scene;
  pictures: Phaser.GameObjects.Image[][];   // one picture for each cell. pictures[row][col]
  numbers: Phaser.GameObjects.Text[][];     // one number for each cell, for the search's steps
  looks: Look[];                            // one look for each tank, in squad order
  search: Phaser.GameObjects.Graphics;      // the shaded cells and the frontier
  routes: Phaser.GameObjects.Graphics;      // the routes and the goals
  over: Phaser.GameObjects.Graphics;        // over the tanks: rings, corners, dots and the box
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

/* The loader reads the terrain table, the same as project 18. */
function preload(this: Phaser.Scene): void {
  for (const key of TERRAIN_KEYS) {
    this.load.image(key, 'assets/' + TERRAIN[key].picture);
  }
  this.load.image('hull', 'assets/hull-blue.png');
  this.load.image('turret', 'assets/turret-blue.png');
}

function create(this: Phaser.Scene): void {
  const pictures: Phaser.GameObjects.Image[][] = [];
  const numbers: Phaser.GameObjects.Text[][] = [];
  for (let row = 0; row < ROWS; row += 1) {
    const pictureLine: Phaser.GameObjects.Image[] = [];
    const numberLine: Phaser.GameObjects.Text[] = [];
    for (let col = 0; col < COLS; col += 1) {
      pictureLine.push(this.add.image(col * TILE, row * TILE, BLANK).setOrigin(0, 0));
      numberLine.push(this.add.text(col * TILE + TILE / 2, row * TILE + TILE / 2, '', {
        fontFamily: '"Courier New", Consolas, monospace',
        fontSize: '17px',
        fontStyle: 'bold',
        color: '#f4f8f8',
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
    search: this.add.graphics().setDepth(2),
    routes: this.add.graphics().setDepth(2.7),
    over: this.add.graphics().setDepth(5)
  };

  /* The right button lets go of every tank, so its menu stays shut. */
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
   A MAP, AND A SQUAD ON IT

   The same as project 19.
   --------------------------------------------------------------------- */

const HOME_COL = 4;
const HOME_ROW = 10;

function placeSquad(aMap: GameMap): Tank[] {
  const spots: { col: number; row: number; far: number }[] = [];
  for (let row = 0; row < aMap.rows; row += 2) {
    for (let col = 0; col < aMap.cols; col += 2) {
      if (!TERRAIN[aMap.cells[row][col]].walkable) continue;
      const across = col - HOME_COL;
      const down = row - HOME_ROW;
      spots.push({ col: col, row: row, far: across * across + down * down });
    }
  }
  spots.sort((a, b) => a.far - b.far);

  const squad: Tank[] = [];
  for (let i = 0; i < NAMES.length && i < spots.length; i += 1) {
    const middle = middleOf({ col: spots[i].col, row: spots[i].row });
    squad.push(makeTank(NAMES[i], middle.x, middle.y));
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

  for (const look of stage.looks) {
    look.hull.destroy();
    look.turret.destroy();
  }
  tanks = placeSquad(map);
  reports = [];
  stage.looks = [];
  for (const tank of tanks) {
    reports.push('waiting');
    stage.looks.push({
      hull: stage.scene.add.image(tank.x, tank.y, 'hull').setScale(0.7).setDepth(3),
      turret: stage.scene.add.image(tank.x, tank.y, 'turret').setScale(0.7).setOrigin(20 / 64, 0.5).setDepth(4)
    });
  }
  marks = [];
  lastOrder = null;
  shown = null;
  shownStep = 'waiting';
  shownRoute = null;

  buildSquad(tanks, pickOne);
  showMapList(mapIndex);
}

buildMapList(maps.map((each) => each.name), (index) => {
  if (index === mapIndex) return;
  putMapOnTheBoard(index);
  playSound(mapSound);
  say(map.name + '. The squad is waiting for orders.');
});


/* ---------------------------------------------------------------------
   PICKING AND ORDERS

   Picking is project 19's, and nothing about it changed. An order is
   new: straight after `orderMove`, every picked tank asks your
   `findRoute` for a route.
   --------------------------------------------------------------------- */

function pickOne(tank: Tank): void {
  selectOnly(tanks, tank);
  playSound(selectSound);
  say(tank.name + ' picked. Click the ground to send it.');
}

function letGoOfAll(): void {
  selectOnly(tanks, null);
  say('Every tank let go.');
}

function clickAt(x: number, y: number): void {
  const tank = tankAt(tanks, x, y);
  if (tank !== null) {
    pickOne(tank);
    return;
  }

  const picked = selectedTanks(tanks);
  if (picked.length === 0) {
    say('No tank is picked. Click a tank first, or drag a box round some.');
    return;
  }

  orderMove(tanks, x, y);
  playSound(orderSound);
  const lead = picked[0];
  lastOrder = { name: lead.name, start: cellAt(lead.x, lead.y), goal: cellAt(lead.goalX, lead.goalY) };
  watchSearch();
  giveRoutes(picked);
}

/* Every picked tank searches for its own route, from the cell it is in
   to the cell of its goal. */
function giveRoutes(picked: Tank[]): void {
  if (!done(6)) {
    for (const tank of picked) tank.moving = false;
    say(job.text);
    return;
  }

  const stuck: string[] = [];
  for (const tank of picked) {
    const route = findRoute(map, cellAt(tank.x, tank.y), cellAt(tank.goalX, tank.goalY), way);
    const index = tanks.indexOf(tank);
    if (route === null) {
      tank.moving = false;
      reports[index] = 'no route';
      stuck.push(tank.name);
      marks.push({ x: tank.x, y: tank.y, until: performance.now() + 1400 });
      continue;
    }
    tank.route = route.slice(1);          // the first cell is the one the tank is already in
    reports[index] = 'driving';
  }

  const sent = picked.length - stuck.length;
  let words = 'Sent ' + sent + (sent === 1 ? ' tank.' : ' tanks.');
  if (stuck.length > 0) {
    playSound(noRouteSound);
    words += ' No route for ' + stuck.join(' and ') + '. Nothing joins where ' + (stuck.length === 1 ? 'it is' : 'they are') + ' to where you clicked.';
  }
  say(words);
}

function finishBox(): void {
  const box = boxFrom(pressX, pressY, mouseX, mouseY);
  const count = selectInBox(tanks, box);
  if (count === 0) {
    say('The box held no tanks, so nothing is picked.');
    return;
  }
  playSound(boxSound);
  say('Picked ' + count + (count === 1 ? ' tank' : ' tanks') + '. Click the ground to send them.');
}

/* The two buttons on the Search card. Changing the way plays the last
   order's search again, so you can compare the two. */
onWay((chosen) => {
  if (chosen === 'star' && !done(9)) {
    say(job.text);
    return;
  }
  way = chosen;
  if (lastOrder === null) {
    say((way === 'star' ? 'A*' : 'Breadth-first') + ' is on. Send some tanks to watch it search.');
    return;
  }
  watchSearch();
  say((way === 'star' ? 'A*' : 'Breadth-first') + ' is on. Watch ' + lastOrder.name + "'s search again.");
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  letGoOfAll();
});


/* ---------------------------------------------------------------------
   THE SEARCH YOU WATCH

   `watchSearch` starts a fresh search for the last order. Then, on
   every frame, `playSearch` takes as many of your `searchStep`s as
   SEARCH_SPEED allows.
   --------------------------------------------------------------------- */

function watchSearch(): void {
  shown = null;
  shownStep = 'waiting';
  shownRoute = null;
  stepsOwed = 0;
  if (lastOrder === null || !done(2)) return;
  shown = startSearch(map, lastOrder.start, lastOrder.goal, way);
  shownStep = 'searching';
}

function playSearch(seconds: number): void {
  if (shown === null || shownStep !== 'searching' || !done(3)) return;

  stepsOwed += seconds * SEARCH_SPEED;
  while (stepsOwed >= 1 && shownStep === 'searching') {
    stepsOwed -= 1;
    shownStep = searchStep(shown);
  }

  if (shownStep === 'found') {
    shownRoute = done(4) ? routeBack(shown) : null;
    playSound(foundSound);
  }
  if (shownStep === 'stuck') {
    playSound(noRouteSound);
    say('The frontier is empty, and the goal was never found. There is no route from ' + (lastOrder?.name ?? 'the tank') + ' to that cell.');
  }
}

/* The four numbers on the Search card. */
function searchResult(): string {
  if (shownStep === 'found') return 'found';
  if (shownStep === 'stuck') return 'no route';
  if (shownStep === 'searching' && done(3)) return 'searching';
  return '—';
}


/* ---------------------------------------------------------------------
   EVERY FRAME
   --------------------------------------------------------------------- */

function update(this: Phaser.Scene, time: number, delta: number): void {
  if (stage === null) return;
  const seconds = Math.min(delta / 1000, 0.05);

  playSearch(seconds);

  let arrived = 0;
  for (let i = 0; i < tanks.length; i += 1) {
    const result = driveTank(tanks[i], map, seconds);
    if (result === 'arrived') {
      reports[i] = 'arrived';
      arrived += 1;
    }
  }
  if (arrived > 0) playSound(arriveSound);
  marks = marks.filter((mark) => mark.until > performance.now());

  for (let i = 0; i < tanks.length; i += 1) {
    const tank = tanks[i];
    stage.looks[i].hull.setPosition(tank.x, tank.y).setRotation(tank.angle);
    stage.looks[i].turret.setPosition(tank.x, tank.y).setRotation(tank.angle);
  }

  const box = dragging ? boxFrom(pressX, pressY, mouseX, mouseY) : null;
  const hovered = mouseX < 0 ? null : cellAt(mouseX, mouseY);

  drawSearch(stage);
  drawRoutes(stage.routes);
  drawOver(stage.over, box, hovered);

  showPlate(map.name, selectedTanks(tanks).length, way);
  showSquad(tanks, reports);
  showMouse(
    map,
    hovered,
    hovered !== null && done(1) && isInside(map, hovered.col, hovered.row) ? neighbours(map, hovered).length : undefined,
    hovered !== null && shown !== null && isInside(map, hovered.col, hovered.row) && shown.steps[hovered.row][hovered.col] >= 0 ? shown.steps[hovered.row][hovered.col] : null,
    hovered !== null && shown !== null && done(7) ? guess(hovered, shown.goal) : null
  );
  showSearch(way, {
    looked: shown === null ? null : shown.looked,
    frontier: shown === null ? null : shown.frontier.length,
    route: shownRoute === null ? null : shownRoute.length,
    result: searchResult()
  });
}


/* ---------------------------------------------------------------------
   DRAWING

   Nothing here decides anything. It only draws what the search and
   the tanks already say.
   --------------------------------------------------------------------- */

const ORANGE = 0xff9a2e;
const BLUE = 0x57d0e0;
const RED = 0xe04a3a;
const INK = 0x0d1216;

/* Every cell the search found gets a dark shade and its number of
   steps. The cells in the frontier get a blue square. */
function drawSearch(onStage: Stage): void {
  const pen = onStage.search;
  pen.clear();

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const steps = shown === null ? -1 : shown.steps[row][col];
      const label = steps >= 0 ? String(steps) : '';
      const number = onStage.numbers[row][col];
      if (number.text !== label) number.setText(label);
      if (steps < 0) continue;
      pen.fillStyle(INK, 0.4);
      pen.fillRect(col * TILE, row * TILE, TILE, TILE);
    }
  }

  if (shown === null) return;
  for (const cell of shown.frontier) {
    pen.fillStyle(BLUE, 0.22);
    pen.fillRect(cell.col * TILE + 3, cell.row * TILE + 3, TILE - 6, TILE - 6);
    pen.lineStyle(2.5, BLUE, 1);
    pen.strokeRect(cell.col * TILE + 3, cell.row * TILE + 3, TILE - 6, TILE - 6);
  }
}

/* The route the search found, thick. Every moving tank's own route,
   thin. A cross on every goal. */
function drawRoutes(pen: Phaser.GameObjects.Graphics): void {
  pen.clear();

  for (const tank of tanks) {
    if (!tank.moving) continue;
    const points = [{ x: tank.x, y: tank.y }];
    for (const cell of tank.route) points.push(middleOf(cell));
    points.push({ x: tank.goalX, y: tank.goalY });
    line(pen, points, 2, ORANGE, 0.55);
    cross(pen, tank.goalX, tank.goalY, 7, ORANGE);
  }

  if (lastOrder !== null && shown !== null) {
    const goal = middleOf(lastOrder.goal);
    cross(pen, goal.x, goal.y, 11, shownStep === 'stuck' ? RED : ORANGE);
  }
  if (shownRoute !== null) {
    line(pen, shownRoute.map(middleOf), 5, ORANGE, 1);
  }
}

/* Over the tanks: no-route rings, the dots next door to the mouse, the
   ring under the mouse, the corners round picked tanks, and the box. */
function drawOver(pen: Phaser.GameObjects.Graphics, box: Box | null, hovered: Cell | null): void {
  pen.clear();

  for (const mark of marks) {
    const fade = Math.min(1, (mark.until - performance.now()) / 600);
    pen.lineStyle(4, INK, 0.5 * fade);
    pen.strokeCircle(mark.x, mark.y, TANK_REACH + 4);
    pen.lineStyle(2, RED, fade);
    pen.strokeCircle(mark.x, mark.y, TANK_REACH + 4);
  }

  if (!dragging && hovered !== null && isInside(map, hovered.col, hovered.row)) {
    pen.lineStyle(2, 0xffffff, 0.7);
    pen.strokeRect(hovered.col * TILE + 1, hovered.row * TILE + 1, TILE - 2, TILE - 2);
    if (done(1)) {
      for (const next of neighbours(map, hovered)) {
        const middle = middleOf(next);
        pen.fillStyle(INK, 0.6);
        pen.fillCircle(middle.x, middle.y, 7);
        pen.fillStyle(BLUE, 1);
        pen.fillCircle(middle.x, middle.y, 5);
      }
    }
    const tank = tankAt(tanks, mouseX, mouseY);
    if (tank !== null) {
      pen.lineStyle(3, INK, 0.45);
      pen.strokeCircle(tank.x, tank.y, TANK_REACH + 1);
      pen.lineStyle(1.5, 0xffffff, 0.9);
      pen.strokeCircle(tank.x, tank.y, TANK_REACH + 1);
    }
  }

  for (const tank of tanks) {
    if (tank.selected) corners(pen, tank.x, tank.y, TANK_REACH + 2);
  }

  if (box !== null) {
    for (const tank of tanks) {
      if (isInBox(box, tank.x, tank.y)) {
        pen.fillStyle(ORANGE, 0.28);
        pen.fillCircle(tank.x, tank.y, TANK_REACH);
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

/* Four orange corners round a picked tank. */
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
