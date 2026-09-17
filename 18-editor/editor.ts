/* =====================================================================
   editor.ts. File 5 of 5.

   One job: put the other four to work. It sets Phaser up, loads the
   pictures, turns clicks into painting, reads the keys, and talks to
   the map server.

   editor.html loads this file, and only this file. Every other file
   arrives because of an `import` line at the top.

   Read it to see where your functions get used. Do not change it.
   ===================================================================== */

import Phaser from 'phaser';
import { COLS, HEIGHT, ROWS, SERVER, TILE, WIDTH } from './numbers.ts';
import { BLANK, TERRAIN, TERRAIN_KEYS } from './terrain.ts';
import type { TerrainKey } from './terrain.ts';
import { countTerrain, isInside, linesToMap, makeMap, mapToLines, paintCell, terrainFor } from './map.ts';
import type { GameMap } from './map.ts';
import {
  buildPalette, nameInput, newBtn, saveBtn, say, screenEl, showBrush,
  showCounts, showLines, showMapList, showPencil, showPlate
} from './rack.ts';
import type { MapListing } from './rack.ts';


/* ---------------------------------------------------------------------
   THE MEMORY
   --------------------------------------------------------------------- */

/* The map on the table. It is `null` while `makeMap` is still empty. */
let map: GameMap | null = null;

let brush: TerrainKey = 'water';     // the ground the pencil paints
let changes = 0;                     // cells changed since the last save
let painting = false;                // is the mouse button held down on the map?
let hoverCol = -1;                   // the cell under the mouse
let hoverRow = -1;
let maps: MapListing[] | null = [];  // the maps on the server. `null` means no answer
let newPressedOnce = false;          // New map asks twice before it throws changes away

/* The sounds. The same pattern as every project since the calculator. */
const pickSound = new Audio('assets/pick.wav');
const paintSound = new Audio('assets/paint.wav');
const saveSound = new Audio('assets/save.wav');
const loadSound = new Audio('assets/load.wav');
const newSound = new Audio('assets/new.wav');
const refuseSound = new Audio('assets/refuse.wav');

function playSound(sound: HTMLAudioElement): void {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}


/* ---------------------------------------------------------------------
   WHICH JOB IS NEXT?

   When the page loads, each of your functions is tried once on a tiny
   map of its own. The first one that hands back nothing is the next
   job, and the line under the window names it. Your real map is never
   touched by this.

   `undefined` is what an empty function hands back. The types promise
   something else, which is why the checker counts it as an error.
   --------------------------------------------------------------------- */

type Job = {
  name: string;
  says: string;
};

function nextJob(): Job | null {
  const tiny = makeMap('Tiny', 2, 2);
  if (tiny === undefined) {
    return { name: 'makeMap', says: 'Job 1: makeMap() is still empty, so there is no map to show. Open map.ts.' };
  }
  if (isInside(tiny, 0, 0) === undefined) {
    return { name: 'isInside', says: 'Job 2: isInside() is still empty. Write it, then the pencil panel shows the cell under your mouse.' };
  }
  if (paintCell(tiny, 0, 0, 'water') === undefined) {
    return { name: 'paintCell', says: 'Jobs 3 and 4: write the first test in map.test.ts, then paintCell(). Painting starts working.' };
  }
  if (countTerrain(tiny, 'grass') === undefined) {
    return { name: 'countTerrain', says: 'Job 5: countTerrain() is still empty, so the palette cannot count its cells.' };
  }
  if (mapToLines(tiny) === undefined) {
    return { name: 'mapToLines', says: 'Job 6: mapToLines() is still empty, so the map cannot be written as letters or saved.' };
  }
  if (terrainFor('.') === undefined) {
    return { name: 'terrainFor', says: 'Job 7: terrainFor() is still empty, so pressing a letter picks nothing.' };
  }
  if (linesToMap('Tiny', ['..']) === undefined) {
    return { name: 'linesToMap', says: 'Jobs 8 and 9: write the second test in map.test.ts, then linesToMap(). Loading starts working.' };
  }
  return null;
}

const job = nextJob();

function sayWhatToDo(): void {
  if (job !== null) {
    say(job.says);
    return;
  }
  say('Pick a ground, then click and drag to paint. Give the map a name and press Save.');
}


/* ---------------------------------------------------------------------
   SETTING PHASER UP
   --------------------------------------------------------------------- */

/* Everything Phaser builds once the scene starts. */
type Stage = {
  scene: Phaser.Scene;
  pictures: Phaser.GameObjects.Image[][];   // one picture for each cell. pictures[row][col]
  pencil: Phaser.GameObjects.Graphics;      // the outline round the cell under the mouse
};

let stage: Stage | null = null;

new Phaser.Game({
  type: Phaser.CANVAS,
  canvas: screenEl,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#1b1712',
  scene: { preload: preload, create: create }
});

/* The loader reads the table. One picture for every kind of ground,
   named by its key. A new line in TERRAIN is a new picture here. */
function preload(this: Phaser.Scene): void {
  for (const key of TERRAIN_KEYS) {
    this.load.image(key, 'assets/' + TERRAIN[key].picture);
  }
}

function create(this: Phaser.Scene): void {
  map = makeMap('Untitled', COLS, ROWS) ?? null;

  /* A picture for every cell. Each one starts as grass, and `drawMap`
     changes it to whatever the map says. */
  const pictures: Phaser.GameObjects.Image[][] = [];
  for (let row = 0; row < ROWS; row += 1) {
    const line: Phaser.GameObjects.Image[] = [];
    for (let col = 0; col < COLS; col += 1) {
      line.push(this.add.image(col * TILE, row * TILE, BLANK).setOrigin(0, 0).setVisible(map !== null));
    }
    pictures.push(line);
  }

  drawGrid(this.add.graphics().setDepth(2));
  stage = { scene: this, pictures: pictures, pencil: this.add.graphics().setDepth(3) };

  if (map === null) drawNoMap(this);

  this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    painting = true;
    screenEl.focus();
    pencilAt(pointer.x, pointer.y);
  });
  this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => pencilAt(pointer.x, pointer.y));
  this.input.on('pointerup', () => { painting = false; });
  this.input.on('gameout', () => {
    painting = false;
    hoverCol = -1;
    hoverRow = -1;
    drawPencil();
    showPencil(map, hoverCol, hoverRow);
  });

  drawMap();
  refreshRack();
  sayWhatToDo();
}

/* Faint lines between the cells, drawn once. */
function drawGrid(pen: Phaser.GameObjects.Graphics): void {
  pen.lineStyle(1, 0x1b1712, 0.16);
  for (let col = 1; col < COLS; col += 1) pen.lineBetween(col * TILE, 0, col * TILE, HEIGHT);
  for (let row = 1; row < ROWS; row += 1) pen.lineBetween(0, row * TILE, WIDTH, row * TILE);
}

/* With no map at all, the table shows an empty sheet and says why. */
function drawNoMap(aScene: Phaser.Scene): void {
  aScene.add.text(WIDTH / 2, HEIGHT / 2, 'NO MAP YET\n\nmakeMap() is still empty', {
    fontFamily: "'Courier New', monospace",
    fontSize: '30px',
    color: '#e0b154',
    align: 'center'
  }).setOrigin(0.5).setDepth(4);
}


/* ---------------------------------------------------------------------
   DRAWING

   The map is data. These functions only copy it onto the pictures.
   Nothing here decides what is in a cell.
   --------------------------------------------------------------------- */

/* Every cell's picture is set from the map. Used after a load, or a
   new map. */
function drawMap(): void {
  if (stage === null || map === null) return;
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      stage.pictures[row][col].setTexture(map.cells[row][col]).setVisible(true);
    }
  }
}

/* The outline round the cell under the mouse. */
function drawPencil(): void {
  if (stage === null) return;
  stage.pencil.clear();
  if (map === null || isInside(map, hoverCol, hoverRow) !== true) return;

  const x = hoverCol * TILE;
  const y = hoverRow * TILE;
  stage.pencil.lineStyle(4, 0x1b1712, 0.55);
  stage.pencil.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
  stage.pencil.lineStyle(2, 0xf4e9cc, 1);
  stage.pencil.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
}

/* A quick pale flash on a cell that has just been painted. */
function flash(aStage: Stage, col: number, row: number): void {
  const dab = aStage.scene.add.rectangle(col * TILE, row * TILE, TILE, TILE, 0xfff6dc, 0.55).setOrigin(0, 0).setDepth(1);
  aStage.scene.tweens.add({
    targets: dab,
    alpha: 0,
    duration: 260,
    onComplete: () => dab.destroy()
  });
}

function refreshRack(): void {
  showPlate(map, changes);
  showBrush(brush);
  showCounts(map);
  showLines(map);
  showPencil(map, hoverCol, hoverRow);
  showMapList(maps, map === null ? '' : map.name, loadMap, askForTheList);
}


/* ---------------------------------------------------------------------
   PAINTING
   --------------------------------------------------------------------- */

/* Which cell a spot on the window is in. Project 11's `cellAt`. */
function cellAt(x: number, y: number): { col: number; row: number } {
  return { col: Math.floor(x / TILE), row: Math.floor(y / TILE) };
}

/* The mouse moved, or was pressed. Move the pencil, and paint if the
   button is down. */
function pencilAt(x: number, y: number): void {
  const cell = cellAt(x, y);
  const moved = cell.col !== hoverCol || cell.row !== hoverRow;
  hoverCol = cell.col;
  hoverRow = cell.row;

  if (painting) paintHere();
  if (moved) {
    drawPencil();
    showPencil(map, hoverCol, hoverRow);
  }
}

/* Your `paintCell` does the painting. The picture only changes when
   it says `true`. */
function paintHere(): void {
  if (stage === null || map === null) return;

  const changed = paintCell(map, hoverCol, hoverRow, brush);
  if (changed !== true) return;

  stage.pictures[hoverRow][hoverCol].setTexture(brush);
  flash(stage, hoverCol, hoverRow);
  playSound(paintSound);
  changes += 1;
  newPressedOnce = false;
  refreshRack();
}

function pick(key: TerrainKey): void {
  if (key === brush) return;
  brush = key;
  playSound(pickSound);
  showBrush(brush);
  if (job === null) say(TERRAIN[key].name + ' picked. Its letter is ' + TERRAIN[key].letter + '.');
}

buildPalette(pick);

/* Press a letter to pick the ground it stands for. Your `terrainFor`
   looks the letter up in the table. Typing in the name box is left
   alone. */
document.addEventListener('keydown', (event) => {
  if (event.target === nameInput || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key.length !== 1) return;

  const key = terrainFor(event.key);
  if (key === undefined || key === null) return;
  event.preventDefault();
  pick(key);
});


/* ---------------------------------------------------------------------
   TALKING TO THE MAP SERVER

   Project 15's two lines of `fetch`, three times over. Every answer is
   checked before it is used, because an answer is something arriving.
   --------------------------------------------------------------------- */

/* GET /maps. Which maps does the server have? */
async function askForTheList(): Promise<void> {
  try {
    const response = await fetch(SERVER + '/maps');
    const answer: unknown = await response.json();
    maps = isMapList(answer) ? answer.maps : [];
  } catch (error) {
    maps = null;
  }
  refreshRack();
}

function isMapList(thing: unknown): thing is { maps: MapListing[] } {
  return thing !== null && typeof thing === 'object' && 'maps' in thing && Array.isArray(thing.maps);
}

/* GET /maps/island. Your `linesToMap` turns the letters back into a
   map. */
async function loadMap(file: string): Promise<void> {
  let answer: unknown = null;
  try {
    const response = await fetch(SERVER + '/maps/' + file);
    answer = await response.json();
  } catch (error) {
    maps = null;
    refreshRack();
    say('The map server did not answer. Start it with npm run server.');
    playSound(refuseSound);
    return;
  }

  if (answer === null || typeof answer !== 'object' || !('name' in answer) || !('lines' in answer)
      || typeof answer.name !== 'string' || !Array.isArray(answer.lines)) {
    say('The server did not send back a map.');
    playSound(refuseSound);
    return;
  }

  const loaded = linesToMap(answer.name, answer.lines);
  if (loaded === undefined) {
    say('linesToMap() is still empty, so the letters cannot become a map yet. That is job 9.');
    playSound(refuseSound);
    return;
  }
  if (loaded === null) {
    say('linesToMap() says ' + file + '.json is not a map. Open the file and look for a letter the table does not know.');
    playSound(refuseSound);
    return;
  }
  if (loaded.cols !== COLS || loaded.rows !== ROWS) {
    say('That map is ' + loaded.cols + ' by ' + loaded.rows + '. The editor only holds maps ' + COLS + ' by ' + ROWS + '.');
    playSound(refuseSound);
    return;
  }

  map = loaded;
  changes = 0;
  newPressedOnce = false;
  nameInput.value = loaded.name;
  drawMap();
  refreshRack();
  playSound(loadSound);
  say('Loaded ' + loaded.name + '.');
}

/* POST /maps. Your `mapToLines` writes the map as letters, and the
   server checks them with your `linesToMap` before it keeps them. */
async function saveMap(): Promise<void> {
  if (map === null) return;

  const name = nameInput.value.trim();
  if (name === '') {
    say('Give the map a name first.');
    playSound(refuseSound);
    nameInput.focus();
    return;
  }

  const lines = mapToLines(map);
  if (lines === undefined) {
    say('mapToLines() is still empty, so there is nothing to send. That is job 6.');
    playSound(refuseSound);
    return;
  }

  let answer: unknown = null;
  try {
    const response = await fetch(SERVER + '/maps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, lines: lines })
    });
    answer = await response.json();
  } catch (error) {
    maps = null;
    refreshRack();
    say('The map server did not answer. Start it with npm run server.');
    playSound(refuseSound);
    return;
  }

  if (answer !== null && typeof answer === 'object' && 'stub' in answer) {
    say('The server says linesToMap() is still empty, so it will not keep the map. That is job 9.');
    playSound(refuseSound);
    return;
  }
  if (answer !== null && typeof answer === 'object' && 'error' in answer) {
    say('The server refused: ' + String(answer.error));
    playSound(refuseSound);
    return;
  }

  map.name = name;
  changes = 0;
  if (isMapList(answer)) maps = answer.maps;
  refreshRack();
  playSound(saveSound);
  say('Saved ' + name + '. Open the maps folder to read the file.');
}

saveBtn.addEventListener('click', () => { saveMap(); });

/* A fresh map, covered in grass. With changes on the table, the first
   press only warns you. */
newBtn.addEventListener('click', () => {
  if (map !== null && changes > 0 && !newPressedOnce) {
    newPressedOnce = true;
    say('You have ' + changes + (changes === 1 ? ' unsaved change' : ' unsaved changes') + '. Press New map again to throw them away.');
    playSound(refuseSound);
    return;
  }

  const fresh = makeMap('Untitled', COLS, ROWS);
  if (fresh === undefined) return;
  map = fresh;
  changes = 0;
  newPressedOnce = false;
  nameInput.value = 'Untitled';
  drawMap();
  refreshRack();
  playSound(newSound);
  askForTheList();
  sayWhatToDo();
});

askForTheList();
