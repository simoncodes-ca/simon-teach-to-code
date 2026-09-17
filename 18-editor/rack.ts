/* =====================================================================
   rack.ts. File 4 of 5.

   One job: everything you read on the page. The palette of ground,
   the panel under the pencil, the saved map, the list of maps, and the
   line under the window.

   It never changes the map. It only looks at it.

   Look at `buildPalette`. It makes one button for every line in the
   TERRAIN table, and it never names a single kind of ground itself.
   Add a line to the table, and a new button turns up here without
   anybody touching this file.
   ===================================================================== */

import { TERRAIN, TERRAIN_KEYS } from './terrain.ts';
import type { TerrainKey } from './terrain.ts';
import { countTerrain, isInside, mapToLines } from './map.ts';
import type { GameMap } from './map.ts';


/* --- Finding the page's elements ---

   The same checks as project 17's rack. Each one stops with a clear
   message if an id is wrong. */

function findElement(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (found === null) throw new Error('The page has no element with the id ' + id);
  return found;
}

function findButton(id: string): HTMLButtonElement {
  const found = findElement(id);
  if (!(found instanceof HTMLButtonElement)) throw new Error(id + ' is not a button');
  return found;
}

function findInput(id: string): HTMLInputElement {
  const found = findElement(id);
  if (!(found instanceof HTMLInputElement)) throw new Error(id + ' is not a text box');
  return found;
}

function findCanvas(id: string): HTMLCanvasElement {
  const found = findElement(id);
  if (!(found instanceof HTMLCanvasElement)) throw new Error(id + ' is not a canvas');
  return found;
}

export const screenEl = findCanvas('screen');
export const saveBtn = findButton('save');
export const newBtn = findButton('new');
export const nameInput = findInput('mapName');

const paletteEl = findElement('palette');
const mapReadEl = findElement('mapRead');
const changesReadEl = findElement('changesRead');
const cellReadEl = findElement('cellRead');
const groundReadEl = findElement('groundRead');
const tanksReadEl = findElement('tanksRead');
const speedReadEl = findElement('speedRead');
const linesEl = findElement('lines');
const mapListEl = findElement('mapList');
const serverNoteEl = findElement('serverNote');
const statusEl = findElement('status');


/* --- The line under the window --- */

let message = '';

export function say(text: string): void {
  if (text === message) return;
  message = text;
  statusEl.textContent = text;
}


/* --- The palette ---

   One button for every kind of ground in the table. Each button shows
   the ground's picture, its name, its letter, and how many cells of it
   are on the map. */

type PaletteButton = {
  button: HTMLButtonElement;
  count: HTMLElement;
};

/* `Partial` means "some of these keys, maybe not all yet". The buttons
   are added one at a time, so for a moment the list is not complete. */
const paletteButtons: Partial<Record<TerrainKey, PaletteButton>> = {};

export function buildPalette(onPick: (key: TerrainKey) => void): void {
  for (const key of TERRAIN_KEYS) {
    const ground = TERRAIN[key];

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ground';
    button.style.setProperty('--edge', ground.colour);
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-keyshortcuts', ground.letter);

    const swatch = document.createElement('span');
    swatch.className = 'swatch';
    swatch.style.backgroundImage = 'url(assets/' + ground.picture + ')';

    const name = document.createElement('span');
    name.className = 'ground-name';
    name.textContent = ground.name;

    const letter = document.createElement('kbd');
    letter.textContent = ground.letter;

    const count = document.createElement('span');
    count.className = 'ground-count';
    count.textContent = '—';

    button.append(swatch, name, letter, count);
    button.addEventListener('click', () => onPick(key));
    paletteEl.appendChild(button);
    paletteButtons[key] = { button: button, count: count };
  }
}

export function showBrush(brush: TerrainKey): void {
  for (const key of TERRAIN_KEYS) {
    const entry = paletteButtons[key];
    if (entry !== undefined) entry.button.setAttribute('aria-pressed', String(key === brush));
  }
}

/* The numbers on the palette come from your `countTerrain`. While it
   is empty they stay as dashes. */
export function showCounts(map: GameMap | null): void {
  for (const key of TERRAIN_KEYS) {
    const entry = paletteButtons[key];
    if (entry === undefined) continue;
    const count = map === null ? undefined : countTerrain(map, key);
    entry.count.textContent = count === undefined ? '—' : String(count);
  }
}


/* --- The plate across the top --- */

export function showPlate(map: GameMap | null, changes: number): void {
  mapReadEl.textContent = map === null ? '—' : map.name;
  changesReadEl.textContent = String(changes);
}


/* --- Under the pencil ---

   Which cell the mouse is over, and what the table says about the
   ground in it. Your `isInside` decides whether there is a cell under
   the mouse at all. */

export function showPencil(map: GameMap | null, col: number, row: number): void {
  const inside = map === null ? undefined : isInside(map, col, row);
  if (map === null || inside !== true) {
    cellReadEl.textContent = '—';
    groundReadEl.textContent = '—';
    tanksReadEl.textContent = '—';
    speedReadEl.textContent = '—';
    return;
  }

  const ground = TERRAIN[map.cells[row][col]];
  cellReadEl.textContent = col + ', ' + row;
  groundReadEl.textContent = ground.name;
  tanksReadEl.textContent = ground.walkable ? 'drive' : 'blocked';
  speedReadEl.textContent = ground.walkable ? '×' + ground.speed : '—';
}


/* --- The saved map ---

   Your `mapToLines`, shown as it is. These letters are exactly what
   Save sends to the server, and exactly what the file will hold. */

export function showLines(map: GameMap | null): void {
  const lines = map === null ? undefined : mapToLines(map);
  if (lines === undefined) {
    linesEl.textContent = 'mapToLines()\nis still empty';
    linesEl.classList.add('lines-empty');
    return;
  }
  linesEl.textContent = lines.join('\n');
  linesEl.classList.remove('lines-empty');
}


/* --- The list of maps on the server --- */

export type MapListing = {
  file: string;
  name: string;
};

export function showMapList(maps: MapListing[] | null, current: string, onLoad: (file: string) => void, onRetry: () => void): void {
  mapListEl.textContent = '';

  if (maps === null) {
    serverNoteEl.textContent = 'server not running';
    serverNoteEl.classList.add('note-bad');
    const item = document.createElement('li');
    item.className = 'map-none';
    const words = document.createElement('span');
    words.textContent = 'Start it with npm run server.';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'load';
    button.textContent = 'Ask again';
    button.addEventListener('click', onRetry);
    item.append(words, button);
    mapListEl.appendChild(item);
    return;
  }

  serverNoteEl.textContent = maps.length + (maps.length === 1 ? ' map on the server' : ' maps on the server');
  serverNoteEl.classList.remove('note-bad');

  for (const listing of maps) {
    const item = document.createElement('li');
    if (listing.name === current) item.classList.add('map-current');

    const name = document.createElement('span');
    name.textContent = listing.name;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'load';
    button.textContent = 'Load';
    button.setAttribute('aria-label', 'Load ' + listing.name);
    button.addEventListener('click', () => onLoad(listing.file));

    item.append(name, button);
    mapListEl.appendChild(item);
  }
}
