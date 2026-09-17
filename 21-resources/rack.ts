/* =====================================================================
   rack.ts. File 7 of 8.

   One job: everything you read on the page. The plate across the top,
   the squad list, the Refinery card, the Field card, the panel under
   the mouse, the list of maps, and the line under the window.

   It never digs, and it never moves a harvester. It only looks.

   Every bar on the page is set here, and every one of them is set from
   a number between 0 and 1. game.ts works those numbers out with your
   `fullness`, so an empty `fullness` leaves every bar flat.
   ===================================================================== */

import { TERRAIN } from './terrain.ts';
import { isInside } from './map.ts';
import type { Cell, GameMap } from './map.ts';
import type { Harvester } from './units.ts';


/* --- Finding the page's elements ---

   The same checks as project 20's rack. */

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
const creditsReadEl = findElement('creditsRead');
const workingReadEl = findElement('workingRead');
const squadEl = findElement('squad');
const rateReadEl = findElement('rateRead');
const loadsReadEl = findElement('loadsRead');
const tippingReadEl = findElement('tippingRead');
const refineryBarEl = findElement('refineryBar');
const patchesReadEl = findElement('patchesRead');
const leftReadEl = findElement('leftRead');
const takenReadEl = findElement('takenRead');
const fieldBarEl = findElement('fieldBar');
const cellReadEl = findElement('cellRead');
const groundReadEl = findElement('groundRead');
const cellOreReadEl = findElement('cellOreRead');
const cellFullReadEl = findElement('cellFullRead');
const nearestReadEl = findElement('nearestRead');
const nearStepsReadEl = findElement('nearStepsRead');
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
  return value === null || value === undefined ? '—' : String(Math.round(value));
}

/* Set a bar from a number between 0 and 1. Anything else, including the
   `undefined` an empty `fullness` hands back, leaves the bar flat. */
function setBar(element: HTMLElement, part: number | null | undefined): void {
  const width = typeof part === 'number' && Number.isFinite(part)
    ? Math.round(Math.min(1, Math.max(0, part)) * 100)
    : 0;
  const style = width + '%';
  if (element.style.width !== style) element.style.width = style;
}


/* --- The line under the window --- */

export function say(text: string): void {
  write(statusEl, text);
}


/* --- The plate across the top --- */

export function showPlate(mapName: string, credits: number, working: number): void {
  write(mapReadEl, mapName);
  write(creditsReadEl, String(Math.floor(credits)));
  write(workingReadEl, String(working));
}


/* --- The squad ---

   One row for each harvester: a lamp, its name, the job it is doing,
   how much ore it holds, and a bar of the same number. The lamp is lit
   when the harvester's `selected` is true.

   The job word comes straight from `harvester.job`, which your
   `nextJob` decides. */

type SquadRow = {
  item: HTMLLIElement;
  doing: HTMLElement;
  load: HTMLElement;
  bar: HTMLElement;
};

let squadRows: SquadRow[] = [];

export function buildSquad(harvesters: Harvester[], onPick: (harvester: Harvester) => void): void {
  squadEl.textContent = '';
  squadRows = [];

  for (const harvester of harvesters) {
    const item = document.createElement('li');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'squad-pick';
    button.setAttribute('aria-label', 'Pick ' + harvester.name);
    button.addEventListener('click', () => onPick(harvester));

    const lamp = document.createElement('span');
    lamp.className = 'lamp';
    lamp.setAttribute('aria-hidden', 'true');

    const name = document.createElement('span');
    name.className = 'squad-name';
    name.textContent = harvester.name;

    button.append(lamp, name);

    const doing = document.createElement('span');
    doing.className = 'squad-doing';

    const load = document.createElement('span');
    load.className = 'squad-load';

    const bar = document.createElement('span');
    const track = document.createElement('span');
    track.className = 'bar';
    track.append(bar);

    item.append(button, doing, load, track);
    squadEl.appendChild(item);
    squadRows.push({ item: item, doing: doing, load: load, bar: bar });
  }
}

export function showSquad(harvesters: Harvester[], bars: number[]): void {
  for (let i = 0; i < harvesters.length && i < squadRows.length; i += 1) {
    const harvester = harvesters[i];
    const row = squadRows[i];

    row.item.classList.toggle('picked', harvester.selected);
    row.item.dataset.doing = harvester.job.replace(/ /g, '-');
    write(row.doing, harvester.job);
    write(row.load, Math.floor(harvester.load) + ' ore');
    setBar(row.bar, bars[i]);
  }
}


/* --- The Refinery card --- */

export type RefineryReport = {
  rate: number | null;        // ore a minute over the last few seconds
  loads: number;              // how many full loads have been tipped in
  tipping: string;            // the name of the harvester unloading now, or a dash
  bar: number | null;         // how full that harvester still is, from 0 to 1
};

export function showRefinery(report: RefineryReport): void {
  write(rateReadEl, numberOrDash(report.rate));
  write(loadsReadEl, String(report.loads));
  write(tippingReadEl, report.tipping);
  setBar(refineryBarEl, report.bar);
}


/* --- The Field card --- */

export type FieldReport = {
  patches: number | null;     // cells with ore still in them
  left: number | null;        // ore left on the whole map
  taken: number | null;       // ore already dug out of it
  bar: number | null;         // the share that has been dug, from 0 to 1
};

export function showField(report: FieldReport): void {
  write(patchesReadEl, numberOrDash(report.patches));
  write(leftReadEl, numberOrDash(report.left));
  write(takenReadEl, numberOrDash(report.taken));
  setBar(fieldBarEl, report.bar);
}


/* --- Under the mouse ---

   The cell and the ground come from the map. `ore` comes from your
   `oreAt`, `full` from your `fullness`, and `nearest` from your
   `nearestOre`. Each one is `undefined` while its function is empty. */

export function showMouse(
  map: GameMap,
  cell: Cell | null,
  ore: number | undefined,
  full: number | undefined,
  nearest: Cell | null | undefined,
  steps: number | null | undefined
): void {
  if (cell === null || !isInside(map, cell.col, cell.row)) {
    for (const element of [cellReadEl, groundReadEl, cellOreReadEl, cellFullReadEl, nearestReadEl, nearStepsReadEl]) {
      write(element, '—');
    }
    return;
  }

  write(cellReadEl, cell.col + ', ' + cell.row);
  write(groundReadEl, TERRAIN[map.cells[cell.row][cell.col]].name);
  write(cellOreReadEl, numberOrDash(ore));
  write(cellFullReadEl, full === undefined ? '—' : Math.round(full * 100) + '%');
  write(nearestReadEl, nearest === undefined ? '—' : nearest === null ? 'none' : nearest.col + ', ' + nearest.row);
  write(nearStepsReadEl, numberOrDash(steps));
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
