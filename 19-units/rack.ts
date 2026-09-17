/* =====================================================================
   rack.ts. File 5 of 6.

   One job: everything you read on the page. The label across the top,
   the squad list, the panel under the mouse, the box numbers, the list
   of maps, and the line under the window.

   It never moves a tank or picks one. It only looks.
   ===================================================================== */

import { TILE } from './numbers.ts';
import { TERRAIN } from './terrain.ts';
import { groundAt, isInside } from './map.ts';
import type { GameMap } from './map.ts';
import type { Box, Tank } from './units.ts';


/* --- Finding the page's elements ---

   The same checks as project 18's rack. */

function findElement(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (found === null) throw new Error('The page has no element with the id ' + id);
  return found;
}

function findCanvas(id: string): HTMLCanvasElement {
  const found = findElement(id);
  if (!(found instanceof HTMLCanvasElement)) throw new Error(id + ' is not a canvas');
  return found;
}

export const screenEl = findCanvas('screen');

const mapReadEl = findElement('mapRead');
const pickedReadEl = findElement('pickedRead');
const squadEl = findElement('squad');
const cellReadEl = findElement('cellRead');
const groundReadEl = findElement('groundRead');
const tankReadEl = findElement('tankRead');
const speedReadEl = findElement('speedRead');
const boxReadEl = findElement('boxRead');
const mapListEl = findElement('mapList');
const statusEl = findElement('status');


/* Change the words in an element only when they are different. The
   squad list is asked sixty times a second, and most of the time
   nothing in it changed. */
function write(element: HTMLElement, text: string): void {
  if (element.textContent !== text) element.textContent = text;
}


/* --- The line under the window --- */

export function say(text: string): void {
  write(statusEl, text);
}


/* --- The label across the top ---

   `picked` comes from your `selectedTanks`. While that is empty, it
   is `undefined`, and the label shows a dash. */

export function showPlate(mapName: string, picked: number | undefined): void {
  write(mapReadEl, mapName);
  write(pickedReadEl, picked === undefined ? '—' : String(picked));
}


/* --- The squad ---

   One row for each tank: a lamp, its name, what it is doing, and the
   ground under it. The lamp is lit when the tank's `selected` is true.

   What a tank is doing is the last word your `driveTank` handed back.
   'still' is never shown. A tank that is still keeps saying what
   happened last. Two more words come from the page itself: 'waiting'
   before any order, and 'ordered' when `orderMove` has given it a goal. */

export type Report = 'waiting' | 'ordered' | 'driving' | 'arrived' | 'blocked';

type SquadRow = {
  item: HTMLLIElement;
  doing: HTMLElement;
  ground: HTMLElement;
};

let squadRows: SquadRow[] = [];

export function buildSquad(tanks: Tank[], onPick: (tank: Tank) => void): void {
  squadEl.textContent = '';
  squadRows = [];

  for (const tank of tanks) {
    const item = document.createElement('li');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'squad-pick';
    button.setAttribute('aria-label', 'Pick ' + tank.name);
    button.addEventListener('click', () => onPick(tank));

    const lamp = document.createElement('span');
    lamp.className = 'lamp';
    lamp.setAttribute('aria-hidden', 'true');

    const name = document.createElement('span');
    name.className = 'squad-name';
    name.textContent = tank.name;

    button.append(lamp, name);

    const doing = document.createElement('span');
    doing.className = 'squad-doing';

    const ground = document.createElement('span');
    ground.className = 'squad-ground';

    item.append(button, doing, ground);
    squadEl.appendChild(item);
    squadRows.push({ item: item, doing: doing, ground: ground });
  }
}

export function showSquad(tanks: Tank[], reports: Report[], map: GameMap): void {
  for (let i = 0; i < tanks.length && i < squadRows.length; i += 1) {
    const tank = tanks[i];
    const row = squadRows[i];
    const report = reports[i];

    row.item.classList.toggle('picked', tank.selected);
    row.item.dataset.doing = report;
    write(row.doing, report);

    const key = groundAt(map, tank.x, tank.y);
    write(row.ground, key === null ? '—' : TERRAIN[key].name);
  }
}


/* --- Under the mouse ---

   The cell and the ground come from the map. The tank comes from your
   `tankAt`, which is `undefined` while it is empty. */

export function showMouse(map: GameMap, x: number, y: number, tank: Tank | null | undefined): void {
  const col = Math.floor(x / TILE);
  const row = Math.floor(y / TILE);
  if (x < 0 || !isInside(map, col, row)) {
    write(cellReadEl, '—');
    write(groundReadEl, '—');
    write(tankReadEl, '—');
    write(speedReadEl, '—');
    return;
  }

  const ground = TERRAIN[map.cells[row][col]];
  write(cellReadEl, col + ', ' + row);
  write(groundReadEl, ground.name);
  write(tankReadEl, tank === undefined || tank === null ? '—' : tank.name);
  write(speedReadEl, ground.walkable ? '×' + ground.speed : 'blocked');
}


/* --- The box ---

   The four edges of the box you are dragging, from your `boxFrom`. */

export function showBox(box: Box | null): void {
  if (box === null) {
    write(boxReadEl, '—');
    return;
  }
  write(boxReadEl, Math.round(box.left) + ', ' + Math.round(box.top) + '  to  ' + Math.round(box.right) + ', ' + Math.round(box.bottom));
}


/* --- The list of maps --- */

const mapButtons: HTMLButtonElement[] = [];

export function buildMapList(names: string[], onPick: (index: number) => void): void {
  for (let i = 0; i < names.length; i += 1) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'map-pick';
    button.textContent = names[i];
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => onPick(i));
    item.appendChild(button);
    mapListEl.appendChild(item);
    mapButtons.push(button);
  }
}

export function showMapList(current: number): void {
  for (let i = 0; i < mapButtons.length; i += 1) {
    mapButtons[i].setAttribute('aria-pressed', String(i === current));
  }
}
