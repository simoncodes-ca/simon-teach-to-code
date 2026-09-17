/* =====================================================================
   rack.ts. File 9 of 10.

   One job: everything you read on the page. The plate across the top,
   the Build card, the Queue card, the Refinery card, the squad list,
   the list of maps, and the line under the window.

   It never builds anything, and it never moves a unit. It only looks.

   The Build card is the part worth reading. Every button on it is
   drawn from one line of `catalogue.ts`, and whether it is grey comes
   straight from your `canBuild`. Nothing in here decides anything, and
   nothing in here knows what a power plant is.
   ===================================================================== */

import { CATALOGUE, ITEM_KEYS } from './catalogue.ts';
import type { ItemKey } from './catalogue.ts';
import type { Verdict } from './build.ts';
import type { Unit } from './units.ts';


/* --- Finding the page's elements ---

   The same checks as project 21's rack. */

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
const unitsReadEl = findElement('unitsRead');
const buildListEl = findElement('buildList');
const makingReadEl = findElement('makingRead');
const waitReadEl = findElement('waitRead');
const queueEl = findElement('queue');
const rateReadEl = findElement('rateRead');
const leftReadEl = findElement('leftRead');
const diggersReadEl = findElement('diggersRead');
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

/* A number of seconds, written the way a clock writes it. 74 becomes
   '1:14'. Under a second is '0:00', not a blank. */
function clock(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds)) return '—';
  const whole = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return minutes + ':' + String(rest).padStart(2, '0');
}


/* --- The line under the window --- */

export function say(text: string): void {
  write(statusEl, text);
}


/* --- The plate across the top --- */

export function showPlate(mapName: string, credits: number, units: number): void {
  write(mapReadEl, mapName);
  write(creditsReadEl, String(Math.floor(credits)));
  write(unitsReadEl, String(units));
}


/* --- The Build card ---

   One button for each line of the catalogue, built once when the page
   opens, in the order the table lists them.

   Each button shows what it is, what it costs, how long it takes, and
   one word saying what your `canBuild` thinks of it. A button whose
   word is anything but 'ok' is switched off, so the browser itself
   refuses the click. */

type BuildRow = {
  key: ItemKey;
  button: HTMLButtonElement;
  why: HTMLElement;
};

let buildRows: BuildRow[] = [];

/* The word under each button, for every verdict your `canBuild` can
   hand back. 'ok' says what clicking does. The rest say why it will
   not. */
function verdictWords(key: ItemKey, verdict: Verdict | undefined): string {
  if (verdict === undefined) return '—';
  if (verdict === 'ok') return 'Build';
  if (verdict === 'built') return 'Built';
  if (verdict === 'ordered') return 'On order';
  if (verdict === 'too dear') return 'Too dear';
  if (verdict === 'busy') return 'Yard busy';

  const needs = CATALOGUE[key].needs;
  if (needs === null) return 'Locked';
  return 'Needs ' + CATALOGUE[needs as ItemKey].name.toLowerCase();
}

export function buildCatalogue(onPick: (key: ItemKey) => void): void {
  buildListEl.textContent = '';
  buildRows = [];

  for (const key of ITEM_KEYS) {
    const item = CATALOGUE[key];
    const listItem = document.createElement('li');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'build-pick';
    button.style.setProperty('--tint', item.colour);
    button.title = item.note;
    button.addEventListener('click', () => onPick(key));

    const name = document.createElement('span');
    name.className = 'build-name';
    name.textContent = item.name;

    const cost = document.createElement('span');
    cost.className = 'build-cost';
    cost.textContent = item.cost + ' · ' + item.seconds + 's';

    const why = document.createElement('span');
    why.className = 'build-why';

    button.append(name, cost, why);
    listItem.appendChild(button);
    buildListEl.appendChild(listItem);
    buildRows.push({ key: key, button: button, why: why });
  }
}

/* `verdicts` holds one answer for each line of the catalogue, in the
   same order. Each one is `undefined` while `canBuild` is empty. */
export function showCatalogue(verdicts: (Verdict | undefined)[]): void {
  for (let i = 0; i < buildRows.length; i += 1) {
    const row = buildRows[i];
    const verdict = verdicts[i];
    const words = verdictWords(row.key, verdict);

    write(row.why, words);
    row.button.disabled = verdict !== 'ok';
    row.button.setAttribute('aria-label', CATALOGUE[row.key].name + '. ' + words);
    row.button.dataset.verdict = verdict === undefined ? 'unknown' : verdict.replace(/ /g, '-');
  }
}


/* --- The Queue card ---

   One docket for each thing waiting, front first. The front one has a
   bar, because it is the only one anybody is working on. */

export type QueueRow = {
  name: string;         // what it is
  part: number | null;  // how far along it is, from 0 to 1, or null for the ones waiting
};

export type QueueReport = {
  making: string;              // what is being built now, or a dash
  wait: number | null;         // seconds until the queue is empty, from your `waitTime`
  rows: QueueRow[];            // one for each thing in the queue, front first
};

export function showQueue(report: QueueReport): void {
  write(makingReadEl, report.making);
  write(waitReadEl, clock(report.wait));

  /* The queue changes a few times a minute, not sixty times a second,
     so it is only rebuilt when it is actually different. */
  const signature = report.rows.map((row) => row.name).join('|');
  if (queueEl.dataset.signature !== signature) {
    queueEl.dataset.signature = signature;
    queueEl.textContent = '';

    if (report.rows.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'queue-empty';
      empty.textContent = 'Nothing on order.';
      queueEl.appendChild(empty);
    } else {
      for (let i = 0; i < report.rows.length; i += 1) {
        const item = document.createElement('li');
        if (i === 0) item.classList.add('front');

        const name = document.createElement('span');
        name.className = 'queue-name';
        name.textContent = (i + 1) + '. ' + report.rows[i].name;

        const fill = document.createElement('span');
        const track = document.createElement('span');
        track.className = 'bar';
        track.append(fill);

        item.append(name, track);
        queueEl.appendChild(item);
      }
    }
  }

  /* The bars move every frame, so they are set every frame. */
  const tracks = queueEl.querySelectorAll('.bar > span');
  for (let i = 0; i < tracks.length && i < report.rows.length; i += 1) {
    const fill = tracks[i];
    if (fill instanceof HTMLElement) setBar(fill, report.rows[i].part);
  }
}


/* --- The Refinery card --- */

export type RefineryReport = {
  rate: number | null;        // ore a minute since the run began
  left: number;               // ore still in the ground
  diggers: number;            // how many harvesters are out working
};

export function showRefinery(report: RefineryReport): void {
  write(rateReadEl, numberOrDash(report.rate));
  write(leftReadEl, numberOrDash(report.left));
  write(diggersReadEl, String(report.diggers));
}


/* --- The squad ---

   The same rows as project 21, with two differences. The list is built
   again every time a unit rolls out of the yard, and each row says
   which kind of unit it is. */

type SquadRow = {
  item: HTMLLIElement;
  doing: HTMLElement;
  load: HTMLElement;
  bar: HTMLElement;
};

let squadRows: SquadRow[] = [];

export function buildSquad(units: Unit[], onPick: (unit: Unit) => void): void {
  squadEl.textContent = '';
  squadRows = [];

  for (const unit of units) {
    const item = document.createElement('li');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'squad-pick';
    button.setAttribute('aria-label', 'Pick ' + unit.name + ', a ' + unit.kind);
    button.addEventListener('click', () => onPick(unit));

    const lamp = document.createElement('span');
    lamp.className = 'lamp';
    lamp.setAttribute('aria-hidden', 'true');

    const name = document.createElement('span');
    name.className = 'squad-name';
    name.textContent = unit.name;

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

export function showSquad(units: Unit[], bars: number[]): void {
  for (let i = 0; i < units.length && i < squadRows.length; i += 1) {
    const unit = units[i];
    const row = squadRows[i];

    row.item.classList.toggle('picked', unit.selected);
    row.item.dataset.doing = unit.job.replace(/ /g, '-');
    write(row.doing, unit.job);
    write(row.load, unit.kind === 'tank' ? 'tank' : Math.floor(unit.load) + ' ore');
    setBar(row.bar, bars[i]);
  }
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
