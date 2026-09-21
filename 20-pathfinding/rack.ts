/* =====================================================================
   rack.ts. File 6 of 7.

   One job: everything you read on the page. The label across the top,
   the squad list, the panel under the mouse, the Search card, the list
   of maps, and the line under the window.

   It never moves a tank, and it never searches. It only looks.
   ===================================================================== */

import { TERRAIN } from './terrain.ts';
import { isInside } from './map.ts';
import type { Cell, GameMap } from './map.ts';
import type { Way } from './paths.ts';
import type { Tank } from './units.ts';


/* --- Finding the page's elements ---

   The same checks as project 19's rack. */

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

function findButton(id: string): HTMLButtonElement {
  const found = findElement(id);
  if (!(found instanceof HTMLButtonElement)) throw new Error(id + ' is not a button');
  return found;
}

export const screenEl = findCanvas('screen');

const mapReadEl = findElement('mapRead');
const pickedReadEl = findElement('pickedRead');
const wayReadEl = findElement('wayRead');
const squadEl = findElement('squad');
const cellReadEl = findElement('cellRead');
const groundReadEl = findElement('groundRead');
const waysReadEl = findElement('waysRead');
const stepsReadEl = findElement('stepsRead');
const guessReadEl = findElement('guessRead');
const totalReadEl = findElement('totalRead');
const lookedReadEl = findElement('lookedRead');
const frontierReadEl = findElement('frontierRead');
const routeReadEl = findElement('routeRead');
const resultReadEl = findElement('resultRead');
const breadthButton = findButton('wayBreadth');
const starButton = findButton('wayStar');
const mapListEl = findElement('mapList');
const statusEl = findElement('status');


/* Change the words in an element only when they are different. The
   page asks sixty times a second, and most of the time nothing changed. */
function write(element: HTMLElement, text: string): void {
  if (element.textContent !== text) element.textContent = text;
}

/* A number, or a dash while it is unknown. Your empty functions hand
   back `undefined`, so that shows a dash too. */
function numberOrDash(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : String(value);
}


/* --- The line under the window --- */

export function say(text: string): void {
  write(statusEl, text);
}


/* --- The label across the top --- */

export function showPlate(mapName: string, picked: number, way: Way): void {
  write(mapReadEl, mapName);
  write(pickedReadEl, String(picked));
  write(wayReadEl, way === 'star' ? 'A*' : 'breadth');
}


/* --- The squad ---

   One row for each tank: a lamp, its name, what it is doing, and how
   many cells are left on its route. The lamp is lit when the tank's
   `selected` is true.

   'no route' is what a tank says when your `findRoute` handed back
   `null` for it. */

export type Report = 'waiting' | 'driving' | 'arrived' | 'no route';

type SquadRow = {
  item: HTMLLIElement;
  doing: HTMLElement;
  left: HTMLElement;
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

    const left = document.createElement('span');
    left.className = 'squad-left';

    item.append(button, doing, left);
    squadEl.appendChild(item);
    squadRows.push({ item: item, doing: doing, left: left });
  }
}

export function showSquad(tanks: Tank[], reports: Report[]): void {
  for (let i = 0; i < tanks.length && i < squadRows.length; i += 1) {
    const tank = tanks[i];
    const row = squadRows[i];
    const report = reports[i];

    row.item.classList.toggle('picked', tank.selected);
    row.item.dataset.doing = report.replace(' ', '-');
    write(row.doing, report);
    write(row.left, tank.moving ? tank.route.length + ' cells' : '—');
  }
}


/* --- Under the mouse ---

   The cell and the ground come from the map. `ways` comes from your
   `neighbours`. `steps` and `guess` come from the search on the map,
   and they are `null` when that cell has no number yet. */

export function showMouse(map: GameMap, cell: Cell | null, ways: number | undefined, steps: number | null, guess: number | null | undefined): void {
  if (cell === null || !isInside(map, cell.col, cell.row)) {
    for (const element of [cellReadEl, groundReadEl, waysReadEl, stepsReadEl, guessReadEl, totalReadEl]) {
      write(element, '—');
    }
    return;
  }

  write(cellReadEl, cell.col + ', ' + cell.row);
  write(groundReadEl, TERRAIN[map.cells[cell.row][cell.col]].name);
  write(waysReadEl, numberOrDash(ways));
  write(stepsReadEl, numberOrDash(steps));
  write(guessReadEl, numberOrDash(guess));
  const hasBoth = steps !== null && guess !== null && guess !== undefined;
  write(totalReadEl, hasBoth ? String(steps + guess) : '—');
}


/* --- The Search card ---

   The two way buttons, and four numbers about the search on the map. */

export type SearchReport = {
  looked: number | null;         // how many cells it looked round
  frontier: number | null;       // how many cells wait in the frontier
  route: number | null;          // how many cells are on the route, once it is found
  result: string;                // 'searching', 'found', 'no route', or a dash
};

export function onWay(choose: (way: Way) => void): void {
  breadthButton.addEventListener('click', () => choose('breadth'));
  starButton.addEventListener('click', () => choose('star'));
}

export function showSearch(way: Way, report: SearchReport): void {
  breadthButton.setAttribute('aria-pressed', String(way === 'breadth'));
  starButton.setAttribute('aria-pressed', String(way === 'star'));
  write(lookedReadEl, numberOrDash(report.looked));
  write(frontierReadEl, numberOrDash(report.frontier));
  write(routeReadEl, numberOrDash(report.route));
  write(resultReadEl, report.result);
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
