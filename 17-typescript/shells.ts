/* =====================================================================
   shells.ts. File 4 of 6.

   One job: shells. This file owns the list of shells in the air. It
   fires them, flies them, bounces them off the blocks, and works out
   what a hit does to a tank.

   Write tank.ts first. Every type here leans on it.

   Then write these, in this order:
      4. Shell     everything a shell holds
      5. Hit       a shell that reached a tank
      6. the four shell functions, signed with types

   The numbers carry on from tank.ts, because it is one list of six
   jobs split across two files.
   ===================================================================== */

import Phaser from 'phaser';
import { BARREL, MAX_BOUNCES, RELOAD_TIME, SHELL_DAMAGE, SHELL_SPEED, TANK_RADIUS } from './numbers';
import { isWallAt } from './arena';
import { aimOf, stepAlong, tanks } from './tank';
import type { Name, Tank } from './tank';


/* ---------------------------------------------------------------------
   1. THE SHAPES
   --------------------------------------------------------------------- */

/**
 * 4. A shell.
 *
 * Project 16 listed what a shell holds in a comment:
 *
 *     x, y        where it is, in pixels
 *     vx, vy      how fast it goes across and down, in pixels per second
 *     bounces     how many blocks it has bounced off so far
 *     owner       the name of the tank that fired it, 'blue' or 'red'
 *
 * Turn it into a type, the way you did for Tank.
 *
 * Look hard at `owner`. It is not any string. It is the name of a
 * tank, and tank.ts already has a type for that.
 *
 * Gentle hint: six lines. Five are numbers.
 * Stronger hint: the last line is `owner: Name;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The list of errors gets shorter.
 */
export type Shell = {
  // TODO: one line for each thing a shell holds.
};

/**
 * 5. A hit.
 *
 * `landHits` below hands back a list of these, and game.ts draws a
 * burst of sparks at each one. A hit is one of these:
 *
 *     { x: 412, y: 230, tank: red }
 *
 * `x` and `y` are where the shell was. `tank` is the tank it reached.
 *
 * That last part is not a number. It is a whole tank. A type can hold
 * another type, the same as `Starts` in arena.ts holds two Points.
 *
 * Gentle hint: three lines. The third one uses a type you wrote.
 * Stronger hint: the last line is `tank: Tank;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The list of errors gets shorter.
 */
export type Hit = {
  // TODO: where the hit was, and which tank it reached.
};


/* ---------------------------------------------------------------------
   2. THE MEMORY
   --------------------------------------------------------------------- */

/* Every shell in the air. `Shell[]` means "a list of shells", so only
   a Shell can ever be pushed onto it. */
export const shells: Shell[] = [];


/* ---------------------------------------------------------------------
   3. THE FUNCTIONS

   Your four shell functions from project 16. They work. Leave the
   insides alone, and add the types to the first line of each.
   --------------------------------------------------------------------- */

/**
 * 6. Sign the four shell functions.
 *
 * The same job as number 3 in tank.ts. Ask the same two questions of
 * every function: what kind is each input, and what comes back?
 *
 * One of these hands back true or false. That type is `boolean`.
 *
 * Gentle hint: `tank` is a Tank, `shell` is a Shell, and `seconds`
 *   and `amount` are numbers.
 * Stronger hint: three of the four hand back nothing, so they end in
 *   `: void`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save after each function. When all four are done, the list of
 * errors is empty.
 */

/* Fire a shell from the end of the barrel, if the gun has reloaded.
   Hands back nothing. */
export function fireShell(tank) {
  // TODO: add the types to the line above.
  if (tank.reload > 0) return;

  const aim = aimOf(tank);
  const barrel = stepAlong(aim, BARREL);
  const speed = stepAlong(aim, SHELL_SPEED);

  shells.push({
    x: tank.x + barrel.x,
    y: tank.y + barrel.y,
    vx: speed.x,
    vy: speed.y,
    bounces: 0,
    owner: tank.name
  });

  tank.reload = RELOAD_TIME;
}

/* Move a shell across, then down, and bounce it off blocks. `seconds`
   is the time since the last frame. Hands back nothing. */
export function moveShell(shell, seconds) {
  // TODO: add the types to the line above.
  shell.x += shell.vx * seconds;
  if (isWallAt(shell.x, shell.y)) {
    shell.x -= shell.vx * seconds;
    shell.vx = -shell.vx;
    shell.bounces += 1;
  }

  shell.y += shell.vy * seconds;
  if (isWallAt(shell.x, shell.y)) {
    shell.y -= shell.vy * seconds;
    shell.vy = -shell.vy;
    shell.bounces += 1;
  }
}

/* Has this shell reached this tank? Hands back true or false. */
export function shellHitsTank(shell, tank) {
  // TODO: add the types to the line above.
  if (shell.owner === tank.name && shell.bounces === 0) return false;

  const gap = Phaser.Math.Distance.Between(shell.x, shell.y, tank.x, tank.y);
  return gap < TANK_RADIUS;
}

/* Take `amount` of health away, never below 0, and wreck the tank at
   0. Hands back nothing. */
export function damageTank(tank, amount) {
  // TODO: add the types to the line above.
  tank.health = Math.max(0, tank.health - amount);
  if (tank.health === 0) tank.wrecked = true;
}


/* ---------------------------------------------------------------------
   4. THE GIVEN WIRING

   Three functions that game.ts calls. Two take things out of the list,
   so they count backwards, the way project 7 explains.
   --------------------------------------------------------------------- */

/* Throw away every shell that has bounced too often. */
export function forgetSpentShells(): void {
  for (let i = shells.length - 1; i >= 0; i -= 1) {
    if (shells[i].bounces > MAX_BOUNCES) shells.splice(i, 1);
  }
}

/* Empty the sky, at the end of a round.

   Project 16 wrote `shells = []` in game.js. That cannot work any more.
   A name another file imports is read-only over there, so only this
   file may change the list. Setting its length to 0 empties it. */
export function forgetAllShells(): void {
  shells.length = 0;
}

/* Ask your `shellHitsTank` about every shell and every tank that is
   still fighting. A shell that hits is taken out of the list, and
   `damageTank` is called for the tank.

   Hands back a list of the hits, so game.ts can draw a burst at each
   one. */
export function landHits(): Hit[] {
  const hits: Hit[] = [];
  for (let i = shells.length - 1; i >= 0; i -= 1) {
    for (const tank of tanks) {
      if (tank.wrecked) continue;
      if (!shellHitsTank(shells[i], tank)) continue;
      hits.push({ x: shells[i].x, y: shells[i].y, tank: tank });
      shells.splice(i, 1);
      damageTank(tank, SHELL_DAMAGE);
      break;
    }
  }
  return hits;
}


/* ---------------------------------------------------------------------
   5. THE ANSWER KEY

   These are the lines for the shapes and signatures in this file. The
   answers for tank.ts are at the bottom of tank.ts.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- type Shell ---

     export type Shell = {
       x: number;
       y: number;
       vx: number;
       vy: number;
       bounces: number;
       owner: Name;
     };


   --- type Hit ---

     export type Hit = {
       x: number;
       y: number;
       tank: Tank;
     };


   --- the four signatures ---

     export function fireShell(tank: Tank): void {

     export function moveShell(shell: Shell, seconds: number): void {

     export function shellHitsTank(shell: Shell, tank: Tank): boolean {

     export function damageTank(tank: Tank, amount: number): void {

   --------------------------------------------------------------------- */
