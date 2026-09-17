/* =====================================================================
   game.ts. File 6 of 6.

   One job: put the other five to work. It sets Phaser up, loads the
   maps and the pictures, turns the mouse into picking and orders, and
   drives the tanks on every frame.

   units.html loads this file, and only this file. Every other file
   arrives because of an `import` line at the top.

   Read it to see where your functions get used. Do not change it.
   ===================================================================== */

import Phaser from 'phaser';
import { COLS, DRAG_START, HEIGHT, ROWS, TANK_REACH, TILE, WIDTH } from './numbers.ts';
import { BLANK, TERRAIN, TERRAIN_KEYS } from './terrain.ts';
import { canDrive, groundAt, linesToMap, makeMap } from './map.ts';
import type { GameMap } from './map.ts';
import {
  boxFrom, driveTank, isInBox, makeTank, orderMove, selectedTanks,
  selectInBox, selectOnly, tankAt
} from './units.ts';
import type { Box, Tank } from './units.ts';
import {
  buildMapList, buildSquad, say, screenEl, showBox, showMapList,
  showMouse, showPlate, showSquad
} from './rack.ts';
import type { Report } from './rack.ts';


/* ---------------------------------------------------------------------
   THE MAPS

   Every map file in the `maps` folder. `import.meta.glob` is Vite's.
   It finds every file whose name matches the pattern, and reads them
   all in before the page starts.

   So a map you saved in project 18 turns up here if you copy its file
   from `18-editor/maps` into `19-units/maps`. Nothing else changes.

   Each file is checked before it is used, the same as project 18's
   server. Project 15 said it: never trust what arrives.
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

let mouseX = -1;                     // the mouse, in pixels on the map. -1 means off the map
let mouseY = -1;
let pressing = false;                // is the mouse button held down on the map?
let pressX = 0;                      // where it was pressed
let pressY = 0;
let dragging = false;                // has it moved far enough to be a box?

/* A red cross where a tank was blocked. Each one fades after a moment. */
type Mark = { x: number; y: number; until: number };
let marks: Mark[] = [];

const NAMES = ['Able', 'Baker', 'Charlie', 'Dog', 'Easy', 'Fox'];

/* The sounds. The same pattern as every project since the calculator. */
const selectSound = new Audio('assets/select.wav');
const boxSound = new Audio('assets/box.wav');
const orderSound = new Audio('assets/order.wav');
const arriveSound = new Audio('assets/arrive.wav');
const blockedSound = new Audio('assets/blocked.wav');
const mapSound = new Audio('assets/map.wav');

function playSound(sound: HTMLAudioElement): void {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}


/* ---------------------------------------------------------------------
   WHICH JOB IS NEXT?

   The same as project 18. When the page loads, each of your functions
   is tried once on a tiny tank of its own. The first one that hands
   back nothing is the next job, and the line under the map names it.
   --------------------------------------------------------------------- */

function nextJob(): string | null {
  const tiny = [makeTank('Tiny', 24, 24)];
  if (tankAt(tiny, 24, 24) === undefined) {
    return 'Job 1: tankAt() is still empty, so the mouse cannot find a tank. Open units.ts.';
  }
  if (selectOnly(tiny, null) === undefined) {
    return 'Job 2: selectOnly() is still empty. Write it, then clicking a tank picks it.';
  }
  if (selectedTanks(tiny) === undefined) {
    return 'Job 3: selectedTanks() is still empty, so nothing knows which tanks are picked.';
  }
  const box = boxFrom(0, 0, 48, 48);
  if (box === undefined) {
    return 'Jobs 4 and 5: write the first test in units.test.ts, then boxFrom(). Dragging draws a box.';
  }
  if (isInBox(box, 24, 24) === undefined) {
    return 'Job 6: isInBox() is still empty, so no tank lights up inside the box.';
  }
  if (selectInBox(tiny, box) === undefined) {
    return 'Job 7: selectInBox() is still empty, so letting go of the box picks nothing.';
  }
  if (orderMove(tiny, 24, 24) === undefined) {
    return 'Job 8: orderMove() is still empty, so clicking the ground sends nobody.';
  }
  if (driveTank(tiny[0], makeMap('Tiny', 1, 1), 0) === undefined) {
    return 'Jobs 9 and 10: write the second test in units.test.ts, then driveTank(). The tanks start to drive.';
  }
  return null;
}

const job = nextJob();

function sayWhatToDo(): void {
  say(job ?? 'Click a tank to pick it, or drag a box round several. Then click the ground to send them.');
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
  looks: Look[];                            // one look for each tank, in squad order
  under: Phaser.GameObjects.Graphics;       // under the tanks: goals and the lines to them
  over: Phaser.GameObjects.Graphics;        // over the tanks: rings, corners and the box
};

let stage: Stage | null = null;

new Phaser.Game({
  type: Phaser.CANVAS,
  canvas: screenEl,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#1a1d12',
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
  for (let row = 0; row < ROWS; row += 1) {
    const line: Phaser.GameObjects.Image[] = [];
    for (let col = 0; col < COLS; col += 1) {
      line.push(this.add.image(col * TILE, row * TILE, BLANK).setOrigin(0, 0));
    }
    pictures.push(line);
  }

  drawGrid(this.add.graphics().setDepth(1));
  stage = {
    scene: this,
    pictures: pictures,
    looks: [],
    under: this.add.graphics().setDepth(2),
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
  sayWhatToDo();
}

/* Faint lines between the cells, drawn once. */
function drawGrid(pen: Phaser.GameObjects.Graphics): void {
  pen.lineStyle(1, 0x1a1d12, 0.14);
  for (let col = 1; col < COLS; col += 1) pen.lineBetween(col * TILE, 0, col * TILE, HEIGHT);
  for (let row = 1; row < ROWS; row += 1) pen.lineBetween(0, row * TILE, WIDTH, row * TILE);
}


/* ---------------------------------------------------------------------
   A MAP, AND A SQUAD ON IT
   --------------------------------------------------------------------- */

/* Where the squad starts: near this cell, in the bottom left. */
const HOME_COL = 4;
const HOME_ROW = 10;

/* Six starting spots, on the drivable cells nearest to home. Only
   every other cell is used, so the tanks start with a gap between them. */
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
    squad.push(makeTank(NAMES[i], spots[i].col * TILE + TILE / 2, spots[i].row * TILE + TILE / 2));
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

   A click and a drag both start with the button going down. What
   happens when it comes up depends on how far the mouse moved.
   --------------------------------------------------------------------- */

/* A click on a tank, or on its name in the squad list. */
function pickOne(tank: Tank): void {
  const count = selectOnly(tanks, tank);
  if (count === undefined) {
    say(job ?? '');
    return;
  }
  playSound(selectSound);
  say(tank.name + ' picked. Click the ground to send it.');
}

/* Escape, or the right button. */
function letGoOfAll(): void {
  if (selectOnly(tanks, null) === undefined) return;
  say('Every tank let go.');
}

/* The button came up without the mouse moving far. */
function clickAt(x: number, y: number): void {
  const tank = tankAt(tanks, x, y);
  if (tank === undefined) {
    say(job ?? '');
    return;
  }
  if (tank !== null) {
    pickOne(tank);
    return;
  }

  /* The click was on the ground. */
  const picked = selectedTanks(tanks);
  if (picked === undefined) {
    letGoOfAll();
    return;
  }
  if (picked.length === 0) {
    say('No tank is picked. Click a tank first, or drag a box round some.');
    return;
  }

  const sent = orderMove(tanks, x, y);
  if (sent === undefined) {
    say(job ?? '');
    return;
  }
  for (let i = 0; i < tanks.length; i += 1) {
    if (tanks[i].moving && reports[i] !== 'driving') reports[i] = 'ordered';
  }
  playSound(orderSound);

  const ground = groundAt(map, x, y);
  if (ground !== null && !canDrive(map, x, y)) {
    say('Sent ' + sent + ' to the ' + TERRAIN[ground].name.toLowerCase() + '. Tanks cannot drive on it, so watch where they stop.');
  } else {
    say('Sent ' + sent + (sent === 1 ? ' tank.' : ' tanks.'));
  }
}

/* The button came up at the end of a drag. */
function finishBox(): void {
  const box = boxFrom(pressX, pressY, mouseX, mouseY);
  if (box === undefined) {
    say(job ?? '');
    return;
  }
  const count = selectInBox(tanks, box);
  if (count === undefined) {
    say(job ?? '');
    return;
  }
  if (count === 0) {
    say('The box held no tanks, so nothing is picked.');
    return;
  }
  playSound(boxSound);
  say('Picked ' + count + (count === 1 ? ' tank' : ' tanks') + '. Click the ground to send them.');
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  letGoOfAll();
});


/* ---------------------------------------------------------------------
   EVERY FRAME

   Your `driveTank` moves each tank. Then the pictures are moved to
   match, and everything on top is drawn again.
   --------------------------------------------------------------------- */

function update(this: Phaser.Scene, time: number, delta: number): void {
  if (stage === null) return;
  const seconds = Math.min(delta / 1000, 0.05);

  let arrived = 0;
  const blocked: string[] = [];
  for (let i = 0; i < tanks.length; i += 1) {
    const result = driveTank(tanks[i], map, seconds);
    if (result === undefined) break;
    if (result === 'still') continue;
    reports[i] = result;
    if (result === 'arrived') arrived += 1;
    if (result === 'blocked') {
      blocked.push(tanks[i].name);
      marks.push({ x: tanks[i].x, y: tanks[i].y, until: time + 1400 });
    }
  }
  if (arrived > 0) playSound(arriveSound);
  if (blocked.length > 0) {
    playSound(blockedSound);
    say(blocked.join(' and ') + (blocked.length === 1 ? ' is' : ' are') + ' blocked. A tank drives in a straight line, and something is in the way.');
  }
  marks = marks.filter((mark) => mark.until > time);

  for (let i = 0; i < tanks.length; i += 1) {
    const tank = tanks[i];
    stage.looks[i].hull.setPosition(tank.x, tank.y).setRotation(tank.angle);
    stage.looks[i].turret.setPosition(tank.x, tank.y).setRotation(tank.angle);
  }

  const box = dragging ? boxFrom(pressX, pressY, mouseX, mouseY) : null;
  if (dragging && box === undefined) say(job ?? '');

  drawUnder(stage.under);
  drawOver(stage.over, box ?? null, time);

  const picked = selectedTanks(tanks);
  showPlate(map.name, picked === undefined ? undefined : picked.length);
  showSquad(tanks, reports, map);
  showMouse(map, mouseX, mouseY, mouseX < 0 ? null : tankAt(tanks, mouseX, mouseY));
  showBox(box ?? null);
}


/* ---------------------------------------------------------------------
   DRAWING

   Nothing here decides anything. It only draws what the tanks and the
   box already say.
   --------------------------------------------------------------------- */

const YELLOW = 0xf3c62b;
const RED = 0xd64a2e;
const INK = 0x14160d;

/* Under the tanks: a line from each moving tank to its goal, and a
   yellow cross on the goal. */
function drawUnder(pen: Phaser.GameObjects.Graphics): void {
  pen.clear();
  for (const tank of tanks) {
    if (!tank.moving) continue;
    pen.lineStyle(2, YELLOW, 0.45);
    pen.lineBetween(tank.x, tank.y, tank.goalX, tank.goalY);
    cross(pen, tank.goalX, tank.goalY, 7, YELLOW);
  }
}

/* Over the tanks: blocked marks, the ring under the mouse, the corners
   round picked tanks, and the box you are dragging. */
function drawOver(pen: Phaser.GameObjects.Graphics, box: Box | null, time: number): void {
  pen.clear();

  for (const mark of marks) {
    const fade = Math.min(1, (mark.until - time) / 600);
    pen.lineStyle(4, INK, 0.5 * fade);
    pen.strokeCircle(mark.x, mark.y, TANK_REACH + 4);
    pen.lineStyle(2, RED, fade);
    pen.strokeCircle(mark.x, mark.y, TANK_REACH + 4);
  }

  if (!dragging && mouseX >= 0) {
    const hovered = tankAt(tanks, mouseX, mouseY);
    if (hovered !== undefined && hovered !== null) {
      pen.lineStyle(3, INK, 0.45);
      pen.strokeCircle(hovered.x, hovered.y, TANK_REACH + 1);
      pen.lineStyle(1.5, 0xffffff, 0.9);
      pen.strokeCircle(hovered.x, hovered.y, TANK_REACH + 1);
    }
  }

  for (const tank of tanks) {
    if (tank.selected) corners(pen, tank.x, tank.y, TANK_REACH + 2);
  }

  if (box !== null) {
    for (const tank of tanks) {
      if (isInBox(box, tank.x, tank.y) === true) {
        pen.fillStyle(YELLOW, 0.28);
        pen.fillCircle(tank.x, tank.y, TANK_REACH);
      }
    }
    pen.fillStyle(YELLOW, 0.1);
    pen.fillRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
    pen.lineStyle(3, INK, 0.4);
    pen.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
    pen.lineStyle(1.5, YELLOW, 1);
    pen.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
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

/* Four yellow corners round a picked tank. */
function corners(pen: Phaser.GameObjects.Graphics, x: number, y: number, half: number): void {
  const arm = half * 0.45;
  for (const width of [5, 2.5]) {
    pen.lineStyle(width, width === 5 ? INK : YELLOW, width === 5 ? 0.45 : 1);
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
