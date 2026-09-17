/* =====================================================================
   arena.ts. File 2 of 6.

   One job: the yard the tanks fight in. This file owns the map, builds
   the concrete blocks, and answers one question for everybody else:
   is this spot inside something solid?

   The code is project 16's arena.js with types added. Nothing here is
   yours to write. Read it anyway, because every function in it is
   already typed, and it shows you what a finished type looks like.
   ===================================================================== */

import Phaser from 'phaser';
import { ARENAS, COLS, ROWS, TANK_SIZE, TILE } from './numbers';
import type { Point, Tank } from './tank';

/* That last line says `import type`. It brings in shapes only, and
   shapes are thrown away before the game runs. So this file can use
   `Tank` without loading tank.ts. */

/* Where the two tanks start in an arena. A type can be built out of
   other types. This one is two `Point`s, and `Point` is yours to
   write in tank.ts. */
export type Starts = {
  blue: Point;
  red: Point;
};

/* The arena being played. One list per row, one character per cell,
   so `grid[row][col]` is one cell. The '1' and the '2' are taken out
   when the arena loads, so this only ever holds '#' and '.'.

   `string[][]` reads as "a list of lists of strings". */
let grid: string[][] = [];

/* The group of concrete block pictures. It is `null` until the first
   arena loads. The `|` means "or", so this is a group or nothing. */
let blocks: Phaser.GameObjects.Group | null = null;


/* Is this spot, in pixels, inside a concrete block?

   The edge of the map counts as a block, the same as the edge of the
   vault did. A spot off the arena is always solid.

   Read the first line of the function. `x: number` means x must be a
   number. The `: boolean` after the brackets means the function hands
   back true or false. That line is the function's signature.

   Your `moveShell` in shells.ts calls this. */
export function isWallAt(x: number, y: number): boolean {
  const col = Math.floor(x / TILE);
  const row = Math.floor(y / TILE);
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return true;
  return grid[row][col] === '#';
}

/* Is this tank somewhere it must not be?

   Two things block a tank. One is a concrete block under any of the
   four corners of its box. The other is another tank's box, because
   two tanks cannot sit on top of each other.

   The box is TANK_SIZE square and it never turns, even when the
   picture of the tank does. It is close enough, and it keeps the check
   to four corners.

   In project 16 this function used `tanks` straight from another file.
   Here the list comes in as a second input, `others`. tank.ts already
   imports `blocked` from this file. Two files that load each other
   are hard to follow, so the list is handed over instead.

   `Tank[]` reads as "a list of tanks". */
export function blocked(tank: Tank, others: Tank[]): boolean {
  const half = TANK_SIZE / 2;
  const left = tank.x - half;
  const right = tank.x + half;
  const top = tank.y - half;
  const bottom = tank.y + half;

  if (isWallAt(left, top) || isWallAt(right, top)) return true;
  if (isWallAt(left, bottom) || isWallAt(right, bottom)) return true;

  for (const other of others) {
    if (other === tank) continue;
    const apartX = Math.abs(other.x - tank.x);
    const apartY = Math.abs(other.y - tank.y);
    if (apartX < TANK_SIZE && apartY < TANK_SIZE) return true;
  }
  return false;
}

/* The middle of a cell, in pixels. Project 11's `middleOf`. */
export function middleOf(col: number, row: number): Point {
  return { x: col * TILE + TILE / 2, y: row * TILE + TILE / 2 };
}

/* Read one arena out of ARENAS, build its blocks, and say where the
   two tanks start. */
export function loadArena(aScene: Phaser.Scene, which: number): Starts {
  if (blocks === null) blocks = aScene.add.group();
  else blocks.clear(true, true);

  const lines = ARENAS[which];
  const starts: Starts = { blue: middleOf(2, 2), red: middleOf(13, 9) };

  grid = [];
  for (let row = 0; row < ROWS; row += 1) {
    const line = lines[row].split('');
    for (let col = 0; col < COLS; col += 1) {
      if (line[col] === '1') {
        starts.blue = middleOf(col, row);
        line[col] = '.';
      }
      if (line[col] === '2') {
        starts.red = middleOf(col, row);
        line[col] = '.';
      }
      if (line[col] === '#') {
        const spot = middleOf(col, row);
        blocks.create(spot.x, spot.y, 'block');
      }
    }
    grid.push(line);
  }
  return starts;
}
