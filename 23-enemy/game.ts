/* =====================================================================
   game.ts. File 8 of 8.

   One job: put the other seven to work. It sets Phaser up, loads the
   maps and the pictures, stands four blue tanks in the corner and three
   red ones out on their posts, asks your `nextMode` about every tank on
   every frame, and does whatever it says.

   enemy.html loads this file, and only this file. Every other file
   arrives because of an `import` line at the top.

   The part worth reading is `runTank`, near the bottom. It is nine
   lines, it is the same nine lines for both sides, and it is where all
   seven of your functions get used.

   Read it to see where your functions get used. Do not change it.
   ===================================================================== */

import Phaser from 'phaser';
import {
  BEAT, BLUE_TANKS, COLS, DRAG_START, GUN_RANGE, HEIGHT, MAX_HEALTH,
  RED_POSTS, RED_TANKS, ROWS, SEE_RANGE, TANK_REACH, TILE, WIDTH
} from './numbers.ts';
import { BLANK, TERRAIN, TERRAIN_KEYS } from './terrain.ts';
import { cellAt, isInside, linesToMap, makeMap, middleOf, sameCell } from './map.ts';
import type { Cell, GameMap } from './map.ts';
import { findRoute } from './paths.ts';
import {
  boxFrom, driveUnit, halt, isInBox, makeUnit, orderMove, otherSide,
  selectedUnits, selectInBox, selectOnly, sendTo, unitAt
} from './units.ts';
import type { Box, Side, Unit } from './units.ts';
import {
  aimAt, farApart, inRange, nearestTarget, nextMode, nextPost, shootStep, wrecked
} from './enemy.ts';
import {
  buildEnemy, buildMapList, buildSquad, say, screenEl, showBattle, showEnemy,
  showMapList, showPlate, showSquad
} from './rack.ts';
import type { ForceRow } from './rack.ts';


/* ---------------------------------------------------------------------
   THE MAPS

   The same as projects 19 to 22. Every map file in the `maps` folder is
   read when the page starts, and checked before it is used.
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

let units: Unit[] = [];                // every tank, both sides, blue first
let blues: Unit[] = [];                // the same tanks, split by side, so the
let reds: Unit[] = [];                 //   two cards can be built from them

/* Seconds until the page works out a fresh route for each tank. A
   chasing tank re-plans a few times a second rather than sixty, because
   its target keeps moving. It is one number per unit, in the same order
   as `units`, like the pictures below. */
let replanIn: number[] = [];

let shots = 0;                         // how many times your `shootStep` has said true
let wrecks = 0;                        // how many tanks have reached 0 health

let mouseX = -1;                       // the mouse, in pixels on the map. -1 means off the map
let mouseY = -1;
let pressing = false;                  // is the mouse button held down on the map?
let pressX = 0;                        // where it was pressed
let pressY = 0;
let dragging = false;                  // has it moved far enough to be a box?

/* A ring that fades: red where a tank found no route, white where one
   blew up. */
type Mark = { x: number; y: number; big: boolean; until: number };
let marks: Mark[] = [];

/* A gun flash: a line from a barrel to whatever it just hit, for a
   fraction of a second. */
type Flash = { fromX: number; fromY: number; toX: number; toY: number; until: number };
let flashes: Flash[] = [];

const BLUE_NAMES = ['Able', 'Baker', 'Charlie', 'Dog', 'Easy', 'Fox'];
const RED_NAMES = ['Wolf', 'Bear', 'Kite', 'Adder', 'Hawk'];

/* The sounds. The same seven as projects 20 to 22, and two new ones for
   the fight. The same pattern as every project since the calculator. */
const selectSound = new Audio('assets/select.wav');
const boxSound = new Audio('assets/box.wav');
const orderSound = new Audio('assets/order.wav');
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

   The same as projects 18 to 22. When the page loads, each of your
   functions is tried once on a pair of tanks of its own. The first one
   that hands back nothing is the next job.

   `job` is the number of that job, or 10 when every job is done. The
   page only draws a thing once the job behind it is done.
   --------------------------------------------------------------------- */

/* An empty function hands back `undefined`, whatever its type says it
   hands back. TypeScript will not compare the two, so the answer takes
   one step through `unknown` on its way here. */
function missing(answer: unknown): boolean {
  return answer === undefined;
}

function whichJob(): { number: number; text: string } {
  const here: Cell = { col: 0, row: 0 };
  const one = makeUnit('blue', 'Test', 0, 0, here);
  const two = makeUnit('red', 'Test', 100, 0, here);
  two.beat = [here, { col: 1, row: 0 }];

  if (missing(farApart(one, two))) {
    return { number: 1, text: 'Job 1: farApart() is still empty, so nothing on the map knows how far away anything is. Open enemy.ts.' };
  }
  if (missing(inRange(one, two, 200))) {
    return { number: 2, text: 'Job 2: inRange() is still empty, so no tank can tell whether somebody is near enough to see or to shoot.' };
  }
  if (missing(nearestTarget(one, [two]))) {
    return { number: 3, text: 'Job 3: nearestTarget() is still empty, so nobody has picked anybody to shoot at.' };
  }
  if (missing(aimAt(one, two))) {
    return { number: 4, text: 'Job 4: aimAt() is still empty, so every gun on the map is pointing east.' };
  }
  if (missing(shootStep(one, two, 0.1))) {
    return { number: 5, text: 'Jobs 5 and 6: write the first test in enemy.test.ts, then shootStep(). Then the shooting starts.' };
  }
  if (missing(nextPost(two))) {
    return { number: 7, text: 'Job 7: nextPost() is still empty, so the red tanks have nowhere to walk and are standing about.' };
  }
  if (missing(nextMode(one, [two]))) {
    return { number: 8, text: 'Jobs 8 and 9: write the second test in enemy.test.ts, then nextMode(). Then the red tanks come for you.' };
  }
  return { number: 10, text: 'The red tanks hunt on their own. Drive a tank at a post and see what happens, then try it with all four.' };
}

const job = whichJob();

/* Is this job done? */
function done(number: number): boolean {
  return job.number > number;
}


/* ---------------------------------------------------------------------
   SETTING PHASER UP
   --------------------------------------------------------------------- */

/* The two pictures that make one tank: a hull that faces the way it is
   driving, and a gun that faces whatever it is shooting at. Both sides
   use the same two files, tinted. */
type Look = {
  hull: Phaser.GameObjects.Image;
  gun: Phaser.GameObjects.Image;
};

/* Everything Phaser builds once the scene starts. */
type Stage = {
  scene: Phaser.Scene;
  pictures: Phaser.GameObjects.Image[][];   // one picture for each cell. pictures[row][col]
  beats: Phaser.GameObjects.Graphics;       // the ring of cells each red tank walks
  discs: Phaser.GameObjects.Graphics;       // a coloured disc under each tank, saying whose it is
  looks: Look[];                            // one look for each unit, in `units` order
  routes: Phaser.GameObjects.Graphics;      // the routes the tanks are driving
  over: Phaser.GameObjects.Graphics;        // over the tanks: rings, bars, corners, the box
  tags: Phaser.GameObjects.Text[];          // the distance labels on the measuring lines
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

/* The loader reads the terrain table, the same as projects 18 to 22. */
function preload(this: Phaser.Scene): void {
  for (const key of TERRAIN_KEYS) {
    this.load.image(key, 'assets/' + TERRAIN[key].picture);
  }
  this.load.image('hull', 'assets/hull-blue.png');
  this.load.image('gun', 'assets/turret-blue.png');
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

  const tags: Phaser.GameObjects.Text[] = [];
  for (let i = 0; i < RED_NAMES.length; i += 1) {
    tags.push(this.add.text(0, 0, '', {
      fontFamily: '"Courier New", Consolas, monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ffe0a8',
      stroke: '#0d1216',
      strokeThickness: 4
    }).setOrigin(0.5, 0.5).setDepth(6).setVisible(false));
  }

  stage = {
    scene: this,
    pictures: pictures,
    beats: this.add.graphics().setDepth(2),
    discs: this.add.graphics().setDepth(2.8),
    looks: [],
    routes: this.add.graphics().setDepth(2.7),
    over: this.add.graphics().setDepth(5),
    tags: tags
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
   A MAP, FOUR BLUE TANKS, AND THREE RED POSTS

   Nothing here is written down in a map file. The posts are the
   fractions in `numbers.ts`, slid onto ground a tank can drive on, and
   each beat is a square round its post, slid the same way. So a map you
   paint in project 18's editor works here with no extra work.
   --------------------------------------------------------------------- */

/* The nearest cell to this one that a tank can actually drive on. It
   looks at the cell itself first, then the eight round it, then the
   sixteen round those, and so on. */
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

/* The three posts, worked out from the fractions in `numbers.ts`. */
function redPosts(aMap: GameMap): Cell[] {
  const posts: Cell[] = [];
  for (const share of RED_POSTS) {
    posts.push(nearestWalkable(
      aMap,
      Math.round(share.acrossPart * (aMap.cols - 1)),
      Math.round(share.downPart * (aMap.rows - 1))
    ));
  }
  return posts;
}

/* The four corners of a square round a post, each slid onto ground a
   tank can drive on, with any repeats dropped. That is the beat your
   `nextPost` walks round. */
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

/* Every walkable cell, nearest to a cell first. The blue tanks take the
   first few, so they start together in their own corner. */
function spotsNear(aMap: GameMap, near: Cell): Cell[] {
  const found: { col: number; row: number; far: number }[] = [];
  for (let row = 0; row < aMap.rows; row += 1) {
    for (let col = 0; col < aMap.cols; col += 1) {
      if (!TERRAIN[aMap.cells[row][col]].walkable) continue;
      const across = col - near.col;
      const down = row - near.row;
      found.push({ col: col, row: row, far: across * across + down * down });
    }
  }
  found.sort((a, b) => a.far - b.far);
  return found.map((each) => ({ col: each.col, row: each.row }));
}

function addUnit(side: Side, name: string, cell: Cell): Unit {
  const middle = middleOf(cell);
  const unit = makeUnit(side, name, middle.x, middle.y, cell);
  units.push(unit);
  replanIn.push(0);

  if (stage !== null) {
    stage.looks.push({
      hull: stage.scene.add.image(middle.x, middle.y, 'hull')
        .setScale(0.7).setDepth(3),
      gun: stage.scene.add.image(middle.x, middle.y, 'gun')
        .setScale(0.7).setOrigin(20 / 64, 0.5).setDepth(4)
        .setTint(side === 'red' ? 0xe04a3a : 0xa8c4e0)
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

  for (const look of stage.looks) {
    look.hull.destroy();
    look.gun.destroy();
  }
  stage.looks = [];
  units = [];
  replanIn = [];
  marks = [];
  flashes = [];
  shots = 0;
  wrecks = 0;

  const corner = spotsNear(map, { col: 4, row: 10 });
  for (let i = 0; i < BLUE_TANKS && i < corner.length; i += 1) {
    addUnit('blue', BLUE_NAMES[i] ?? 'Blue ' + (i + 1), corner[i]);
  }

  const posts = redPosts(map);
  for (let i = 0; i < RED_TANKS && i < posts.length; i += 1) {
    const red = addUnit('red', RED_NAMES[i] ?? 'Red ' + (i + 1), posts[i]);
    red.beat = beatAround(map, posts[i]);
  }

  blues = [];
  reds = [];
  for (const unit of units) {
    if (unit.side === 'blue') blues.push(unit);
    else reds.push(unit);
  }

  drawBeats(stage);
  buildEnemy(reds);
  buildSquad(blues, pickOne);
  showMapList(mapIndex);
}

buildMapList(maps.map((each) => each.name), (index) => {
  if (index === mapIndex) return;
  putMapOnTheBoard(index);
  playSound(mapSound);
  say(map.name + '. Four fresh tanks, three fresh posts, and nobody hurt yet.');
});


/* ---------------------------------------------------------------------
   PICKING AND ORDERS

   Project 19's picking and project 20's routes, unchanged except that a
   wreck can no longer be picked or ordered anywhere.
   --------------------------------------------------------------------- */

function pickOne(unit: Unit): void {
  if (unit.health <= 0) {
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
  say('Every tank let go. They hold where they are, and they keep shooting.');
}

function clickAt(x: number, y: number): void {
  const unit = unitAt(units, x, y);
  if (unit !== null) {
    pickOne(unit);
    return;
  }

  const picked = selectedUnits(units);
  if (picked.length === 0) {
    say('No tank is picked. Click one first, or drag a box round some.');
    return;
  }

  orderMove(units, x, y);
  playSound(orderSound);

  const stuck: string[] = [];
  for (const each of picked) {
    if (!giveRoute(each, cellAt(each.goalX, each.goalY), true)) stuck.push(each.name);
  }

  const sent = picked.length - stuck.length;
  let words = 'Sent ' + sent + (sent === 1 ? ' tank.' : ' tanks.');
  if (stuck.length > 0) {
    words += ' No route for ' + stuck.join(' and ') + '.';
  }
  say(words);
}

function finishBox(): void {
  const box = boxFrom(pressX, pressY, mouseX, mouseY);
  const count = selectInBox(units, box);
  if (count === 0) {
    say('The box held none of your tanks, so nothing is picked.');
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

/* Your project 20 pathfinder, asked for a route and given one. */
function giveRoute(unit: Unit, goal: Cell, loud: boolean): boolean {
  const route = findRoute(map, cellAt(unit.x, unit.y), goal, 'star');
  if (route === null) {
    halt(unit);
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
   ONE TANK, ONE FRAME

   This is the whole of the project, and every one of your seven
   functions is in it.

   Both sides go through the same nine lines. A blue tank and a red tank
   look for a target the same way, point the gun the same way and fire
   the same way. The only thing the sides do differently is drive, and
   that is the last line: yours go where you sent them, and theirs go
   where your `nextMode` says.
   --------------------------------------------------------------------- */

function runTank(unit: Unit, index: number, seconds: number): void {
  const foes = otherSide(units, unit.side);

  unit.target = nearestTarget(unit, foes) ?? null;
  unit.mode = nextMode(unit, foes);

  if (unit.health <= 0) {
    halt(unit);
    return;
  }

  if (unit.target !== null) {
    aimAt(unit, unit.target);
    if (shootStep(unit, unit.target, seconds)) recordShot(unit, unit.target);
  }

  if (unit.side === 'red') steerRed(unit, index, seconds);
}

/* A shot has just left a barrel. The page draws it, counts it, and
   checks whether it was the last one anybody needed. */
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
  say(target.name + ' is wrecked. ' + standing('blue') + ' blue left, ' + standing('red') + ' red.');
}

/* Where a red tank drives, and nothing else. It reads the word your
   `nextMode` handed back, and does the one thing that word means.

   While `nextMode` is still empty the word is `undefined`, so every red
   tank falls through to the last line and walks its beat. That is why
   job 7 shows up on the map before job 9 does. */
function steerRed(unit: Unit, index: number, seconds: number): void {
  replanIn[index] -= seconds;

  /* Close enough to shoot: stop and shoot. Driving on would only take
     it past its target and out the other side. */
  if (unit.mode === 'attacking') {
    halt(unit);
    return;
  }

  /* Seen somebody, too far to hit: drive at them. The target keeps
     moving, so the route is worked out again a few times a second
     rather than sixty. */
  if (unit.mode === 'chasing' && unit.target !== null) {
    if (unit.moving && replanIn[index] > 0) return;
    replanIn[index] = 0.5;
    giveRoute(unit, cellAt(unit.target.x, unit.target.y), false);
    return;
  }

  /* Nobody about: walk the beat. */
  if (unit.moving) return;
  headForNextPost(unit);
}

/* Ask your `nextPost` for somewhere to go, and go there. A corner with
   no route to it is skipped, so a beat broken by a river still turns. */
function headForNextPost(unit: Unit): void {
  for (let tries = 0; tries < unit.beat.length; tries += 1) {
    const cell = nextPost(unit);
    if (missing(cell)) return;
    if (giveRoute(unit, cell, false)) return;
  }
}

function standing(side: Side): number {
  let count = 0;
  for (const unit of units) {
    if (unit.side === side && unit.health > 0) count += 1;
  }
  return count;
}


/* ---------------------------------------------------------------------
   EVERY FRAME
   --------------------------------------------------------------------- */

function update(this: Phaser.Scene, time: number, delta: number): void {
  if (stage === null) return;
  const seconds = Math.min(delta / 1000, 0.05);

  /* Everybody drives. */
  let arrived = 0;
  for (const unit of units) {
    if (driveUnit(unit, map, seconds) === 'arrived' && unit.side === 'blue') arrived += 1;
  }
  if (arrived > 0) playSound(arriveSound);

  /* Everybody thinks. */
  for (let i = 0; i < units.length; i += 1) {
    runTank(units[i], i, seconds);
  }

  const now = performance.now();
  marks = marks.filter((mark) => mark.until > now);
  flashes = flashes.filter((flash) => flash.until > now);

  for (let i = 0; i < units.length && i < stage.looks.length; i += 1) {
    const unit = units[i];
    const look = stage.looks[i];
    look.hull.setPosition(unit.x, unit.y).setRotation(unit.angle);
    look.gun.setPosition(unit.x, unit.y).setRotation(unit.turret);
    if (unit.health <= 0) {
      look.hull.setTint(0x2a3138);
      look.gun.setTint(0x2a3138).setRotation(unit.turret + 0.6);
    }
  }

  const box = dragging ? boxFrom(pressX, pressY, mouseX, mouseY) : null;
  const hovered = mouseX < 0 ? null : cellAt(mouseX, mouseY);
  const onMap = hovered !== null && isInside(map, hovered.col, hovered.row);

  drawDiscs(stage.discs);
  drawRoutes(stage.routes);
  drawOver(stage.over, box, onMap ? hovered : null);
  drawTags(stage);

  showPlate(map.name, standing('blue'), standing('red'));
  showEnemy(reds.map(report));
  showSquad(blues.map(report));
  showBattle({ near: nearestRed(), shots: shots, wrecks: wrecks });
}

/* One row of a card, straight from the fields your functions set. */
function report(unit: Unit): ForceRow {
  return {
    mode: done(9) ? unit.mode : undefined,
    target: done(3) && unit.target !== null ? unit.target.name : '—',
    health: unit.health / MAX_HEALTH,
    picked: unit.selected
  };
}

/* How far the closest red tank is from the tank you have picked, or
   from your whole squad when nothing is picked. */
function nearestRed(): number | null {
  if (!done(1)) return null;
  const from = selectedUnits(units);
  const looking = from.length > 0 ? from : blues;

  let best: number | null = null;
  for (const mine of looking) {
    if (mine.health <= 0) continue;
    for (const theirs of reds) {
      if (theirs.health <= 0) continue;
      const far = farApart(mine, theirs);
      if (best === null || far < best) best = far;
    }
  }
  return best;
}


/* ---------------------------------------------------------------------
   DRAWING

   Nothing here decides anything. It only draws what the tanks already
   say about themselves.
   --------------------------------------------------------------------- */

const AMBER = 0xffbe5c;
const ORANGE = 0xff9a2e;
const RED = 0xe04a3a;
const BLUE = 0x8fb7e8;
const INK = 0x0d1216;

/* The beat each red tank walks: a dotted ring joining its corners.
   Drawn once per map, because a beat never changes. */
function drawBeats(onStage: Stage): void {
  const pen = onStage.beats;
  pen.clear();

  for (const red of reds) {
    if (red.beat.length < 2) continue;
    for (let i = 0; i < red.beat.length; i += 1) {
      const from = middleOf(red.beat[i]);
      const to = middleOf(red.beat[(i + 1) % red.beat.length]);
      dotted(pen, from, to, RED, 0.45);
    }
    for (const cell of red.beat) {
      const middle = middleOf(cell);
      pen.lineStyle(2, RED, 0.6);
      pen.strokeCircle(middle.x, middle.y, 6);
    }
  }
}

/* A disc under every tank, saying whose it is. Both sides drive the
   same two pictures, so without this the map is a guessing game. */
function drawDiscs(pen: Phaser.GameObjects.Graphics): void {
  pen.clear();

  for (const unit of units) {
    const colour = unit.side === 'blue' ? BLUE : RED;
    const alive = unit.health > 0;
    const size = TANK_REACH + 6;

    pen.fillStyle(INK, alive ? 0.5 : 0.3);
    pen.fillCircle(unit.x, unit.y, size + 1);
    pen.fillStyle(colour, alive ? 0.55 : 0.15);
    pen.fillCircle(unit.x, unit.y, size);
    pen.lineStyle(2, colour, alive ? 0.95 : 0.3);
    pen.strokeCircle(unit.x, unit.y, size);
  }
}

/* The route every driving tank is following. Yours are orange, because
   you chose them. Theirs are red, because your `nextMode` did. */
function drawRoutes(pen: Phaser.GameObjects.Graphics): void {
  pen.clear();

  for (const unit of units) {
    if (!unit.moving || unit.health <= 0) continue;
    const points = [{ x: unit.x, y: unit.y }];
    for (const cell of unit.route) points.push(middleOf(cell));
    points.push({ x: unit.goalX, y: unit.goalY });
    const colour = unit.side === 'blue' ? ORANGE : RED;
    line(pen, points, 2, colour, unit.side === 'blue' ? 0.5 : 0.35);
    if (unit.side === 'blue') cross(pen, unit.goalX, unit.goalY, 7, ORANGE);
  }
}

/* Over the tanks: the rings, the health bars, the threads to targets,
   the gun flashes, the corners round picked tanks, and the drag box. */
function drawOver(pen: Phaser.GameObjects.Graphics, box: Box | null, hovered: Cell | null): void {
  pen.clear();
  const now = performance.now();

  /* Job 2's payoff. Two rings on every red tank: what it can see, and
     what it can hit. A ring lights up when something is inside it. */
  if (done(2)) {
    for (const red of reds) {
      if (red.health <= 0) continue;
      const seen = red.target !== null && inRange(red, red.target, SEE_RANGE);
      const reached = red.target !== null && inRange(red, red.target, GUN_RANGE);

      pen.lineStyle(1.5, RED, seen ? 0.5 : 0.14);
      pen.strokeCircle(red.x, red.y, SEE_RANGE);
      pen.lineStyle(2, RED, reached ? 0.85 : 0.22);
      pen.strokeCircle(red.x, red.y, GUN_RANGE);
      if (reached) {
        pen.fillStyle(RED, 0.06);
        pen.fillCircle(red.x, red.y, GUN_RANGE);
      }
    }
  }

  /* Job 3's payoff. A thread from every tank to whoever it has picked. */
  if (done(3)) {
    for (const unit of units) {
      if (unit.health <= 0 || unit.target === null) continue;
      pen.lineStyle(1, unit.side === 'blue' ? BLUE : RED, 0.4);
      pen.lineBetween(unit.x, unit.y, unit.target.x, unit.target.y);
    }
  }

  /* Job 6's payoff. A shot, for seventy milliseconds. */
  for (const flash of flashes) {
    const fade = Math.min(1, (flash.until - now) / 70);
    pen.lineStyle(5, INK, 0.5 * fade);
    pen.lineBetween(flash.fromX, flash.fromY, flash.toX, flash.toY);
    pen.lineStyle(2, 0xfff0c0, fade);
    pen.lineBetween(flash.fromX, flash.fromY, flash.toX, flash.toY);
  }

  /* A health bar over every tank still in the fight. */
  for (const unit of units) {
    if (unit.health <= 0) continue;
    const share = Math.max(0, Math.min(1, unit.health / MAX_HEALTH));
    const barLeft = unit.x - 14;
    const barTop = unit.y - 25;
    pen.fillStyle(INK, 0.65);
    pen.fillRect(barLeft - 1, barTop - 1, 30, 7);
    pen.fillStyle(share > 0.35 ? (unit.side === 'blue' ? BLUE : RED) : AMBER, 0.95);
    pen.fillRect(barLeft, barTop, 28 * share, 5);
    pen.lineStyle(1, INK, 0.5);
    pen.strokeRect(barLeft - 0.5, barTop - 0.5, 29, 6);
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
    for (const unit of blues) {
      if (unit.health > 0 && isInBox(box, unit.x, unit.y)) {
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

/* Job 1's payoff, and the ruler for the whole project. Pick one of your
   tanks and a measuring line reaches to every red tank, with your
   `farApart` written along it. */
function drawTags(onStage: Stage): void {
  for (const tag of onStage.tags) tag.setVisible(false);
  if (!done(1)) return;

  const picked = selectedUnits(units);
  if (picked.length !== 1 || picked[0].health <= 0) return;
  const mine = picked[0];

  const pen = onStage.over;
  for (let i = 0; i < reds.length && i < onStage.tags.length; i += 1) {
    const theirs = reds[i];
    if (theirs.health <= 0) continue;
    const far = farApart(mine, theirs);

    dotted(pen, { x: mine.x, y: mine.y }, { x: theirs.x, y: theirs.y }, AMBER, 0.45);
    onStage.tags[i]
      .setPosition((mine.x + theirs.x) / 2, (mine.y + theirs.y) / 2)
      .setText(String(Math.round(far)))
      .setVisible(true);
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
