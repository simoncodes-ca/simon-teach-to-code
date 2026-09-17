/* =====================================================================
   tank.ts. File 3 of 6.

   One job: a tank. Which way it faces, how it drives, how it stops at
   a wall, and where its gun is pointing.

   Every function in this file already works. You wrote them all in
   project 16, and here they are again. What is missing is the types.

   A type is a written-down shape. It says what a thing holds, and what
   kind of value each part is. Once a thing has a type, the computer
   checks every line that uses it, before the game even starts.

   Write these in this order:
      1. Point     a spot, or a step, across and down
      2. Tank      everything a tank holds
      3. the four tank functions, signed with types

   Then go on to shells.ts.

   The game runs while these are empty. Your job shows up in the list
   of errors. `npm run dev` prints that list in the terminal, and in a
   box over the game. Every type you finish makes the list shorter.
   ===================================================================== */

import { MAX_HEALTH, TANK_SPEED, TURN_SPEED } from './numbers';
import { blocked } from './arena';


/* ---------------------------------------------------------------------
   1. THE SHAPES

   One shape is finished, as an example. Two are yours.
   --------------------------------------------------------------------- */

/* The name of a tank. This one is finished.

   It is not any string. It is exactly 'blue' or exactly 'red', and the
   `|` means "or". Write `'green'` where a Name belongs, and the
   computer refuses it. */
export type Name = 'blue' | 'red';

/**
 * 1. A point: a spot on the arena, or a step across it.
 *
 * Your `stepAlong` hands one of these back. `middleOf` in arena.ts
 * hands one back too. Both look like this:
 *
 *     { x: 30, y: 0 }
 *
 * So a Point holds two things, and both of them are numbers.
 *
 * Write each part on its own line: its name, a colon, its type, and a
 * semicolon.
 *
 * Gentle hint: two lines, one for x and one for y.
 * Stronger hint: the first line is `x: number;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The list of errors gets shorter.
 */
export type Point = {
  // TODO: two parts, both numbers.
};

/**
 * 2. A tank.
 *
 * This is the comment that sat above `let blue` in project 16. It
 * lists what a tank holds:
 *
 *     name        'blue' or 'red'
 *     x, y        the middle of the tank, in pixels
 *     angle       the way the tank faces, in radians. 0 is right
 *     turret      how far the gun is turned away from the front
 *     health      from MAX_HEALTH down to 0
 *     reload      seconds until it can fire again. 0 means ready
 *     wrecked     true once its health has run out
 *     wins        rounds won so far
 *
 * Turn that comment into a type. A comment is for people. A type is
 * for people and for the computer.
 *
 * Three kinds of value are in there:
 *
 *     number      x, y, angle, and most of the others
 *     boolean     true or false
 *     Name        the finished type just above this one
 *
 * Gentle hint: nine lines, one for each part. Only two of them are
 *   not numbers.
 * Stronger hint: `name: Name;` then `x: number;` and so on, with
 *   `wrecked: boolean;` near the end.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. This one makes the list of errors much shorter,
 * because game.ts and rack.ts use tanks everywhere.
 */
export type Tank = {
  // TODO: one line for each thing a tank holds.
};


/* ---------------------------------------------------------------------
   2. THE MEMORY

   Two tanks, and a list that holds both of them.

   Project 16 started them as `null` and built them later. Here they
   are built straight away, at the corner of the arena, and game.ts
   moves them to their starting spots. That way `blue` is always a
   Tank and never `null`.
   --------------------------------------------------------------------- */

export const blue: Tank = makeTank('blue', 0);
export const red: Tank = makeTank('red', Math.PI);
export const tanks: Tank[] = [blue, red];


/* ---------------------------------------------------------------------
   3. THE FUNCTIONS

   These are your four functions from project 16. They work. Leave the
   insides alone.

   What they lack is a signature. Look at the first line of `isWallAt`
   in arena.ts:

       export function isWallAt(x: number, y: number): boolean {

   Every input has a colon and a type after it. After the brackets
   comes one more colon, and the type of what the function hands back.
   A function that hands nothing back gets `: void`.

   Right now these four inputs have no type. The computer calls that
   "implicitly has an 'any' type". `any` means "could be anything",
   and a thing that could be anything cannot be checked.
   --------------------------------------------------------------------- */

/**
 * 3. Sign the four tank functions.
 *
 * Do the four functions below, one at a time. For each one, ask two
 * questions:
 *
 *     What kind of value is each input?
 *     What kind of value comes back?
 *
 * The comments above each function answer both. `tank` is a Tank.
 * `seconds` is a number. `stepAlong` hands back a Point.
 *
 * Gentle hint: every input gets a type, and every function gets one
 *   after its brackets. Two of the four hand back nothing.
 * Stronger hint: copy the shape of `isWallAt` in arena.ts. Hands back
 *   nothing? Write `: void`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save after each function. Two errors or so go away every time.
 */

/* An angle and a distance, turned into a step across and a step down.
   `angle` is in radians, `distance` in pixels. Hands back a Point. */
export function stepAlong(angle, distance) {
  // TODO: add the types to the line above.
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance
  };
}

/* Turn the tank. `turn` is -1, 0 or 1, from the keys, and `seconds` is
   the time since the last frame. Hands back nothing. */
export function turnTank(tank, turn, seconds) {
  // TODO: add the types to the line above.
  tank.angle += turn * TURN_SPEED * seconds;
}

/* Drive the tank forward or back, and slide along walls. `drive` is
   -1, 0 or 1, from the keys. Hands back nothing. */
export function driveTank(tank, drive, seconds) {
  // TODO: add the types to the line above.
  const step = stepAlong(tank.angle, drive * TANK_SPEED * seconds);

  tank.x += step.x;
  if (blocked(tank, tanks)) tank.x -= step.x;

  tank.y += step.y;
  if (blocked(tank, tanks)) tank.y -= step.y;
}

/* The way the gun points: the tank's angle plus the turret's. Hands
   back an angle. */
export function aimOf(tank) {
  // TODO: add the types to the line above.
  return tank.angle + tank.turret;
}


/* ---------------------------------------------------------------------
   4. THE GIVEN WIRING

   This part is finished. It makes a tank, and puts it back at the
   start of each round. Both are typed already.
   --------------------------------------------------------------------- */

function makeTank(name: Name, angle: number): Tank {
  return {
    name: name,
    x: 0,
    y: 0,
    angle: angle,
    turret: 0,
    health: MAX_HEALTH,
    reload: 0,
    wrecked: false,
    wins: 0
  };
}

/* A new round. Everything goes back to the start except the wins. */
export function placeTank(tank: Tank, start: Point, angle: number): void {
  tank.x = start.x;
  tank.y = start.y;
  tank.angle = angle;
  tank.turret = 0;
  tank.health = MAX_HEALTH;
  tank.reload = 0;
  tank.wrecked = false;
}


/* ---------------------------------------------------------------------
   5. THE ANSWER KEY

   These are the lines for the shapes and signatures in this file.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- type Point ---

     export type Point = {
       x: number;
       y: number;
     };


   --- type Tank ---

     export type Tank = {
       name: Name;
       x: number;
       y: number;
       angle: number;
       turret: number;
       health: number;
       reload: number;
       wrecked: boolean;
       wins: number;
     };


   --- the four signatures ---

     export function stepAlong(angle: number, distance: number): Point {

     export function turnTank(tank: Tank, turn: number, seconds: number): void {

     export function driveTank(tank: Tank, drive: number, seconds: number): void {

     export function aimOf(tank: Tank): number {

   --------------------------------------------------------------------- */
