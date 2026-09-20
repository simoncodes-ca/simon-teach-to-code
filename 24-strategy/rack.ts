/* =====================================================================
   rack.ts. File 11 of 12.

   One job: everything you read on the page. The plate across the top,
   the Forces card, the Build card, the Queue card, the Enemy card, the
   squad list, the list of maps, the line under the window, and the
   banner that comes down when somebody wins.

   It never builds anything, it never moves a unit, and it never
   decides who won. It only looks.

   Two cards are worth reading. The Forces card is one function of
   yours, `countKind`, asked six times, three times about each side. The
   Enemy card is four wells, and every one of them is a word or a number
   your commander handed back. Nothing in this file works anything out
   for itself.
   ===================================================================== */

import { CATALOGUE, ITEM_KEYS } from './catalogue.ts';
import type { ItemKey } from './catalogue.ts';
import type { Verdict } from './build.ts';
import type { Side, Unit } from './units.ts';


/* --- Finding the page's elements ---

   The same checks as projects 21, 22 and 23. */

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
const blueReadEl = findElement('blueRead');
const redReadEl = findElement('redRead');

const forceCellEls: Record<string, HTMLElement> = {
  blueHarvesters: findElement('blueHarvesters'),
  redHarvesters: findElement('redHarvesters'),
  blueInfantry: findElement('blueInfantry'),
  redInfantry: findElement('redInfantry'),
  blueTanks: findElement('blueTanks'),
  redTanks: findElement('redTanks'),
  blueBase: findElement('blueBase'),
  redBase: findElement('redBase'),
  blueStrength: findElement('blueStrength'),
  redStrength: findElement('redStrength')
};
const blueBarEl = findElement('blueBar');
const redBarEl = findElement('redBar');

const buildListEl = findElement('buildList');
const makingReadEl = findElement('makingRead');
const waitReadEl = findElement('waitRead');
const queueEl = findElement('queue');

const enemyCreditsEl = findElement('enemyCredits');
const enemyWantsEl = findElement('enemyWants');
const enemyOrdersEl = findElement('enemyOrders');
const enemyMarchingEl = findElement('enemyMarching');

const squadEl = findElement('squad');
const mapListEl = findElement('mapList');
const statusEl = findElement('status');
const bannerEl = findElement('banner');
const bannerWordsEl = findElement('bannerWords');


/* Change the words in an element only when they are different. The page
   asks sixty times a second, and most of the time nothing changed. */
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

export type PlateReport = {
  mapName: string;
  credits: number;                    // yours, out of your refinery
  blue: number | null | undefined;    // living blue units, from your `countKind`
  red: number | null | undefined;     // and living red ones
};

export function showPlate(report: PlateReport): void {
  write(mapReadEl, report.mapName);
  write(creditsReadEl, String(Math.floor(report.credits)));
  write(blueReadEl, numberOrDash(report.blue));
  write(redReadEl, numberOrDash(report.red));
}


/* --- The Forces card ---

   Six numbers from your `countKind`, and two from your `armyStrength`.
   The two bars are scaled against the stronger side, so the longer bar
   is always full. That is what makes the pair of them answer the only
   question that matters: who would win a fight right now. */

export type SideReport = {
  harvesters: number | null | undefined;
  infantry: number | null | undefined;
  tanks: number | null | undefined;
  base: number | null | undefined;
  strength: number | null | undefined;
};

export type ForcesReport = {
  blue: SideReport;
  red: SideReport;
};

function strengthOf(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function showForces(report: ForcesReport): void {
  write(forceCellEls.blueHarvesters, numberOrDash(report.blue.harvesters));
  write(forceCellEls.redHarvesters, numberOrDash(report.red.harvesters));
  write(forceCellEls.blueInfantry, numberOrDash(report.blue.infantry));
  write(forceCellEls.redInfantry, numberOrDash(report.red.infantry));
  write(forceCellEls.blueTanks, numberOrDash(report.blue.tanks));
  write(forceCellEls.redTanks, numberOrDash(report.red.tanks));
  write(forceCellEls.blueBase, baseWords(report.blue.base));
  write(forceCellEls.redBase, baseWords(report.red.base));
  write(forceCellEls.blueStrength, numberOrDash(report.blue.strength));
  write(forceCellEls.redStrength, numberOrDash(report.red.strength));

  const blue = strengthOf(report.blue.strength);
  const red = strengthOf(report.red.strength);
  const most = Math.max(blue, red, 1);
  setBar(blueBarEl, report.blue.strength === undefined ? undefined : blue / most);
  setBar(redBarEl, report.red.strength === undefined ? undefined : red / most);
}

/* A refinery is there or it is not, so the Forces card says so in a
   word instead of printing 1 and 0. */
function baseWords(count: number | null | undefined): string {
  if (count === null || count === undefined) return '—';
  return count > 0 ? 'standing' : 'wrecked';
}


/* --- The Build card ---

   Project 22's card, unchanged. One button for each line of the
   catalogue, and whether it is grey comes straight from `canBuild`. */

type BuildRow = {
  key: ItemKey;
  button: HTMLButtonElement;
  why: HTMLElement;
};

let buildRows: BuildRow[] = [];

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

   Project 22's card, unchanged, and it shows your queue only. The
   enemy's queue is its own business, and the Enemy card says what it is
   saving for instead. */

export type QueueRow = {
  name: string;         // what it is
  part: number | null;  // how far along it is, from 0 to 1
};

export type QueueReport = {
  making: string;              // what is being built now, or a dash
  wait: number | null;         // seconds until the queue is empty
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


/* --- The Enemy card ---

   Four wells, and all four of them are your commander thinking out
   loud. Saving for is `wantNext`. Orders is `wantsAttack`. Marching is
   how many tanks `attackOrders` handed over. */

export type EnemyReport = {
  credits: number;                       // in the enemy refinery
  wants: string;                         // the name of what `wantNext` asked for
  orders: string;                        // 'massing' or 'attack', or a dash
  marching: number | null | undefined;   // tanks `attackOrders` sent
};

export function showEnemy(report: EnemyReport): void {
  write(enemyCreditsEl, String(Math.floor(report.credits)));
  write(enemyWantsEl, report.wants);
  write(enemyOrdersEl, report.orders);
  enemyOrdersEl.dataset.orders = report.orders.replace(/ /g, '-');
  write(enemyMarchingEl, numberOrDash(report.marching));
}


/* --- The squad ---

   Your units, one row each, rebuilt whenever something rolls out of
   your yard or is wrecked. A harvester's row says what it is digging.
   A tank's row says what project 23's `nextMode` calls it. */

type SquadRow = {
  item: HTMLLIElement;
  doing: HTMLElement;
  note: HTMLElement;
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

    const note = document.createElement('span');
    note.className = 'squad-load';

    const bar = document.createElement('span');
    const track = document.createElement('span');
    track.className = 'bar';
    track.append(bar);

    item.append(button, doing, note, track);
    squadEl.appendChild(item);
    squadRows.push({ item: item, doing: doing, note: note, bar: bar });
  }
}

export type SquadRowReport = {
  doing: string;     // the job for a harvester, the mode for a tank
  note: string;      // ore carried, or the health left
  health: number;    // from 0 to 1
  picked: boolean;
};

export function showSquad(reports: SquadRowReport[]): void {
  for (let i = 0; i < squadRows.length && i < reports.length; i += 1) {
    const row = squadRows[i];
    const report = reports[i];

    row.item.classList.toggle('picked', report.picked);
    row.item.dataset.doing = report.doing.replace(/ /g, '-');
    write(row.doing, report.doing);
    write(row.note, report.note);
    setBar(row.bar, report.health);
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


/* --- The banner ---

   The one thing on the page that only appears once. `whoWon` hands back
   a side or `null`, and `null` keeps the banner off the map. */

export function showBanner(won: Side | 'draw' | null): void {
  const on = won !== null;
  if (bannerEl.classList.contains('on') === on && bannerEl.dataset.won === String(won)) return;

  bannerEl.classList.toggle('on', on);
  bannerEl.dataset.won = String(won);
  bannerEl.setAttribute('aria-hidden', String(!on));

  if (won === 'blue') write(bannerWordsEl, 'The enemy refinery is gone. You won.');
  else if (won === 'red') write(bannerWordsEl, 'Your refinery is gone. You lost.');
  else if (won === 'draw') write(bannerWordsEl, 'Both refineries are gone. Nobody won.');
}
