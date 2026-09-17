/* =====================================================================
   rack.ts. File 5 of 6.

   One job: everything you read. The readouts down the side, the line
   under the window, and the cards that cover the arena between games.

   It never changes a tank or a shell. It only looks at them.

   This file also finds the page's elements, and that is where types
   make the code a little longer. Read `findElement` below to see why.
   ===================================================================== */

import Phaser from 'phaser';
import { HEIGHT, MAX_HEALTH, RELOAD_TIME, SHELL_DAMAGE, WIDTH, WINS_NEEDED } from './numbers';
import { aimOf, blue, red, tanks } from './tank';
import type { Name } from './tank';
import { shells } from './shells';
import type { Duel } from './game';


/* --- Finding the page's elements ---

   `document.getElementById` hands back an element, or `null` when no
   element has that id. JavaScript let you forget the `null`. The page
   crashed later, somewhere else, with a confusing error.

   TypeScript does not let you forget. So each of these checks once,
   right here, and stops with a clear message if the id is wrong. After
   the check, the computer knows the element is really there. */

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

function findCanvas(id: string): HTMLCanvasElement {
  const found = findElement(id);
  if (!(found instanceof HTMLCanvasElement)) throw new Error(id + ' is not a canvas');
  return found;
}

export const screenEl = findCanvas('screen');
export const startBtn = findButton('start');
export const againBtn = findButton('again');

const blueWinsEl = findElement('blueWins');
const redWinsEl = findElement('redWins');
const roundReadEl = findElement('roundRead');
const shellCountEl = findElement('shellCount');
const bounceCountEl = findElement('bounceCount');
const hitCountEl = findElement('hitCount');
const statusEl = findElement('status');

/* The readouts for one tank. */
type Readouts = {
  healthBar: HTMLElement;
  health: HTMLElement;
  heading: HTMLElement;
  aim: HTMLElement;
  reload: HTMLElement;
};

function readoutsFor(name: Name): Readouts {
  return {
    healthBar: findElement(name + 'HealthBar'),
    health: findElement(name + 'Health'),
    heading: findElement(name + 'Heading'),
    aim: findElement(name + 'Aim'),
    reload: findElement(name + 'Reload')
  };
}

/* `Record<Name, Readouts>` means "an object with one Readouts for each
   Name". Leave out `red`, and the computer says so. */
const readouts: Record<Name, Readouts> = { blue: readoutsFor('blue'), red: readoutsFor('red') };

let message = '';

export function say(text: string): void {
  if (text === message) return;
  message = text;
  statusEl.textContent = text;
}

/* An angle in radians, written as whole degrees from 0 to 359. */
function degrees(angle: number): string {
  const whole = Math.round(angle * 180 / Math.PI) % 360;
  return (whole + 360) % 360 + '°';
}

/* --- The line under the window --- */

export function duelLine(duel: Duel): string {
  if (blue.wins === 0 && red.wins === 0) return 'Round ' + duel.round + '. First to ' + WINS_NEEDED + ' rounds wins.';
  return 'Round ' + duel.round + '. Blue ' + blue.wins + ', Red ' + red.wins + '.';
}

/* --- The rack down the side ---

   `textContent` only takes a string. Project 16 handed it numbers, and
   JavaScript quietly turned them into strings. TypeScript wants you to
   say so, which is what `String(...)` does. */
export function updateRack(duel: Duel): void {
  blueWinsEl.textContent = String(blue.wins);
  redWinsEl.textContent = String(red.wins);
  roundReadEl.textContent = String(duel.round);
  shellCountEl.textContent = String(shells.length);
  bounceCountEl.textContent = String(duel.bounces);
  hitCountEl.textContent = String(duel.hits);

  for (const tank of tanks) {
    const read = readouts[tank.name];
    read.health.textContent = String(Math.round(tank.health));
    read.healthBar.style.width = Math.max(0, tank.health) / MAX_HEALTH * 100 + '%';
    const barBox = read.healthBar.parentElement;
    if (barBox !== null) barBox.classList.toggle('bar-low', tank.health <= SHELL_DAMAGE);
    read.heading.textContent = degrees(tank.angle);
    read.aim.textContent = degrees(aimOf(tank));
    read.reload.style.width = (1 - tank.reload / RELOAD_TIME) * 100 + '%';
  }

  startBtn.disabled = duel.phase === 'between' || duel.phase === 'over';
  const startWords = startBtn.firstChild;
  if (startWords !== null) startWords.nodeValue = duel.phase === 'playing' ? 'Pause ' : 'Start ';
  againBtn.disabled = duel.phase === 'waiting';
}

/* --- The cards over the arena --- */

const DISPLAY_FONT = "'Impact', 'Haettenschweiler', 'Arial Narrow', sans-serif";
const LABEL_FONT = "'Trebuchet MS', sans-serif";
export const COLOUR_OF: Record<Name, string> = { blue: '#6cc0ff', red: '#ff7a6b' };

type Curtain = {
  group: Phaser.GameObjects.Container;
  title: Phaser.GameObjects.Text;
  lines: Phaser.GameObjects.Text;
  key: Phaser.GameObjects.Text;
};

/* Both cards are `null` until Phaser has built the scene. */
let curtain: Curtain | null = null;
let roundCard: Phaser.GameObjects.Text | null = null;

export function buildCurtain(aScene: Phaser.Scene, duel: Duel): void {
  const back = aScene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x15190f, 0.78).setOrigin(0, 0);
  const title = aScene.add.text(WIDTH / 2, 270, '', {
    fontFamily: DISPLAY_FONT, fontSize: '68px', color: '#ffc53d'
  }).setOrigin(0.5);
  const lines = aScene.add.text(WIDTH / 2, 385, '', {
    fontFamily: LABEL_FONT, fontSize: '26px', color: '#f3e6c4', align: 'center'
  }).setOrigin(0.5).setLineSpacing(14);
  const key = aScene.add.text(WIDTH / 2, 500, '', {
    fontFamily: LABEL_FONT, fontSize: '26px', color: '#ffc53d'
  }).setOrigin(0.5);

  curtain = { group: aScene.add.container(0, 0, [back, title, lines, key]).setDepth(20), title, lines, key };
  updateCurtain(duel);
}

export function updateCurtain(duel: Duel): void {
  if (curtain === null) return;
  curtain.group.setVisible(duel.phase === 'waiting' || duel.phase === 'paused' || duel.phase === 'over');

  if (duel.phase === 'waiting') {
    curtain.title.setText('TANK DUEL');
    curtain.lines.setText('Blue drives with W A S D. Red drives with the arrows.\nHit the other tank four times to take the round.');
    curtain.key.setText('Press Enter');
  } else if (duel.phase === 'paused') {
    curtain.title.setText('PAUSED');
    curtain.lines.setText('');
    curtain.key.setText('');
  } else if (duel.phase === 'over') {
    const winner = blue.wins > red.wins ? blue : red;
    curtain.title.setText(winner.name.toUpperCase() + ' WINS THE DUEL');
    curtain.title.setColor(COLOUR_OF[winner.name]);
    curtain.lines.setText('Blue ' + blue.wins + ', Red ' + red.wins);
    curtain.key.setText('Press Play again');
    return;
  }
  curtain.title.setColor('#ffc53d');
}

export function buildRoundCard(aScene: Phaser.Scene): void {
  roundCard = aScene.add.text(WIDTH / 2, HEIGHT / 2, '', {
    fontFamily: DISPLAY_FONT, fontSize: '64px', color: '#ffc53d',
    stroke: '#15190f', strokeThickness: 8
  }).setOrigin(0.5).setDepth(15).setVisible(false);
}

/* Words in the middle of the arena that fade away by themselves. */
export function showRoundCard(aScene: Phaser.Scene, text: string, colour: string): void {
  const card = roundCard;
  if (card === null) return;
  card.setText(text);
  card.setColor(colour);
  card.setAlpha(1);
  card.setVisible(true);
  aScene.tweens.killTweensOf(card);
  aScene.tweens.add({
    targets: card,
    alpha: 0,
    delay: 900,
    duration: 700,
    onComplete: () => card.setVisible(false)
  });
}
