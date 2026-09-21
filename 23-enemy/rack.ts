/* =====================================================================
   rack.ts. File 7 of 8.

   One job: everything you read on the page. The summary across the top,
   the Enemy card, the Battle card, the squad list, the list of maps,
   and the line under the window.

   It never moves a tank and it never fires a gun. It only looks.

   The two lists are the part worth reading. A red row and a blue row
   are the same row, built by the same function, because a red tank and
   a blue tank are the same shape of object. The only difference is the
   word each side prints for a mode, and that is four lines at the top
   of this file.
   ===================================================================== */

import type { Mode, Side, Unit } from './units.ts';


/* --- Finding the page's elements ---

   The same checks as project 22's rack. */

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
const blueReadEl = findElement('blueRead');
const redReadEl = findElement('redRead');
const enemyEl = findElement('enemy');
const nearReadEl = findElement('nearRead');
const shotsReadEl = findElement('shotsRead');
const wrecksReadEl = findElement('wrecksRead');
const squadEl = findElement('squad');
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

/* Set a bar from a number between 0 and 1. Anything else, including an
   `undefined`, leaves the bar flat. */
function setBar(element: HTMLElement, part: number | null | undefined): void {
  const width = typeof part === 'number' && Number.isFinite(part)
    ? Math.round(Math.min(1, Math.max(0, part)) * 100)
    : 0;
  const style = width + '%';
  if (element.style.width !== style) element.style.width = style;
}


/* --- The words a mode is printed as ---

   Your `nextMode` hands back the same four words about both sides. What
   those words mean to a person depends on whose tank it is, because a
   red tank acts on all four and a blue tank only ever acts on two. You
   drive yours.

   So the card translates. It decides nothing: there is one word in and
   one word out, and the word in is always your function's. */

const RED_WORDS: Record<Mode, string> = {
  dead: 'wrecked',
  attacking: 'firing',
  chasing: 'chasing',
  patrolling: 'on patrol'
};

const BLUE_WORDS: Record<Mode, string> = {
  dead: 'wrecked',
  attacking: 'firing',
  chasing: 'spotted',
  patrolling: 'clear'
};

function modeWords(side: Side, mode: Mode | undefined): string {
  if (mode === undefined) return '—';
  return side === 'red' ? RED_WORDS[mode] : BLUE_WORDS[mode];
}


/* --- The line under the window --- */

export function say(text: string): void {
  write(statusEl, text);
}


/* --- The summary across the top --- */

export function showPlate(mapName: string, blue: number, red: number): void {
  write(mapReadEl, mapName);
  write(blueReadEl, String(blue));
  write(redReadEl, String(red));
}


/* --- The two rosters ---

   One row for each tank: a lamp, its name, what it is doing, who it has
   picked, and a health bar.

   The blue rows are buttons, because you can click a name to pick that
   tank. The red rows are not, because you cannot have those. */

export type ForceRow = {
  mode: Mode | undefined;      // straight from your `nextMode`
  target: string;              // the name your `nearestTarget` picked, or a dash
  health: number;              // from 0 to 1
  picked: boolean;             // is it one of the ones you have selected?
};

type RosterRow = {
  item: HTMLLIElement;
  doing: HTMLElement;
  target: HTMLElement;
  bar: HTMLElement;
  side: Side;
};

function buildRoster(
  into: HTMLElement,
  units: Unit[],
  onPick: ((unit: Unit) => void) | null
): RosterRow[] {
  into.textContent = '';
  const rows: RosterRow[] = [];

  for (const unit of units) {
    const item = document.createElement('li');

    const lamp = document.createElement('span');
    lamp.className = 'lamp';
    lamp.setAttribute('aria-hidden', 'true');

    const name = document.createElement('span');
    name.className = 'force-name';
    name.textContent = unit.name;

    let head: HTMLElement;
    if (onPick === null) {
      head = document.createElement('span');
      head.className = 'force-head';
    } else {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'force-head force-pick';
      button.setAttribute('aria-label', 'Pick ' + unit.name);
      button.addEventListener('click', () => onPick(unit));
      head = button;
    }
    head.append(lamp, name);

    const doing = document.createElement('span');
    doing.className = 'force-doing';

    const target = document.createElement('span');
    target.className = 'force-target';

    const bar = document.createElement('span');
    const track = document.createElement('span');
    track.className = 'bar';
    track.append(bar);

    item.append(head, doing, target, track);
    into.appendChild(item);
    rows.push({ item: item, doing: doing, target: target, bar: bar, side: unit.side });
  }

  return rows;
}

function showRoster(rows: RosterRow[], reports: ForceRow[]): void {
  for (let i = 0; i < rows.length && i < reports.length; i += 1) {
    const row = rows[i];
    const report = reports[i];
    const words = modeWords(row.side, report.mode);

    row.item.classList.toggle('picked', report.picked);
    row.item.dataset.doing = report.mode === undefined ? 'unknown' : report.mode;
    write(row.doing, words);
    write(row.target, report.target);
    setBar(row.bar, report.health);
  }
}

let enemyRows: RosterRow[] = [];
let squadRows: RosterRow[] = [];

export function buildEnemy(units: Unit[]): void {
  enemyRows = buildRoster(enemyEl, units, null);
}

export function showEnemy(reports: ForceRow[]): void {
  showRoster(enemyRows, reports);
}

export function buildSquad(units: Unit[], onPick: (unit: Unit) => void): void {
  squadRows = buildRoster(squadEl, units, onPick);
}

export function showSquad(reports: ForceRow[]): void {
  showRoster(squadRows, reports);
}


/* --- The Battle card --- */

export type BattleReport = {
  near: number | null;        // pixels to the closest red tank, from your `farApart`
  shots: number;              // how many times your `shootStep` has said true
  wrecks: number;             // how many tanks have reached 0 health
};

export function showBattle(report: BattleReport): void {
  write(nearReadEl, numberOrDash(report.near));
  write(shotsReadEl, String(report.shots));
  write(wrecksReadEl, String(report.wrecks));
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
