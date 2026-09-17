/* =====================================================================
   ore.ts. File 6 of 10.

   One job: the ore. It is finished.

   It is project 21, copied from that project's answer key. How much
   ore is left in each cell, how much a harvester is carrying, how much
   the refinery has been paid, and what each harvester should do next.

   Two things changed, and neither one is an idea:

       the type is called `Unit` now, because tanks exist too
       a fresh refinery starts with some credits in it, so the yard has
         something to spend on its first build

   The harvesters run themselves from the moment the page opens. The
   credits climb whether you do anything or not. Your job this time is
   build.ts, which spends them.

   Like build.ts, this file never draws anything.
   ===================================================================== */

import {
  BASE_COL, BASE_ROW, CAPACITY, DIG_RATE, START_CREDITS, UNLOAD_RATE
} from './numbers.ts';
import { TERRAIN } from './terrain.ts';
import { cellAt, isInside, sameCell } from './map.ts';
import type { Cell, GameMap } from './map.ts';
import { guess } from './paths.ts';
import type { Job, Unit } from './units.ts';


/* --- The shapes --- */

/* The ore on a map. The map says where ore grows and never changes.
   This says how much is left, and it changes all game. */
export type OreField = {
  map: GameMap;           // the map the ore grows on
  amount: number[][];     // amount[row][col]: how much ore is left in that cell
  started: number;        // how much ore the whole field held when it was new
};

/* The refinery. It stands on one cell, and it holds the credits. The
   yard spends out of the same pile. */
export type Refinery = {
  cell: Cell;             // where it stands
  credits: number;        // the counter on the page
};

/* Build the ore field for a map, from the terrain table's `holds`
   column. Project 21's, unchanged. */
export function makeField(map: GameMap): OreField {
  const amount: number[][] = [];
  let started = 0;
  for (let row = 0; row < map.rows; row += 1) {
    const line: number[] = [];
    for (let col = 0; col < map.cols; col += 1) {
      const holds = TERRAIN[map.cells[row][col]].holds;
      line.push(holds);
      started += holds;
    }
    amount.push(line);
  }
  return { map: map, amount: amount, started: started };
}

/* A new refinery, standing on the cell numbers.ts names, with enough
   credits in it to buy one thing straight away. */
export function makeRefinery(): Refinery {
  return { cell: { col: BASE_COL, row: BASE_ROW }, credits: START_CREDITS };
}


/* --- Project 21's seven functions --- */

/* How full is it, from 0 to 1? Every bar on the page reads this one,
   including the build queue's. */
export function fullness(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.min(1, Math.max(0, part / whole));
}

/* How much ore is left in one cell. */
export function oreAt(field: OreField, cell: Cell): number {
  if (!isInside(field.map, cell.col, cell.row)) return 0;
  return field.amount[cell.row][cell.col];
}

/* The cell of the closest patch with ore left, or null when the field
   is finished. */
export function nearestOre(field: OreField, from: Cell): Cell | null {
  let best: Cell | null = null;
  let bestFar = 0;
  for (let row = 0; row < field.map.rows; row += 1) {
    for (let col = 0; col < field.map.cols; col += 1) {
      const here = { col: col, row: row };
      if (oreAt(field, here) <= 0) continue;
      const far = guess(from, here);
      if (best === null || far < bestFar) {
        best = here;
        bestFar = far;
      }
    }
  }
  return best;
}

/* Take up to `wanted` ore out of a cell, and hand back how much you
   got. Never more than is there. */
export function takeOre(field: OreField, cell: Cell, wanted: number): number {
  const got = Math.min(wanted, oreAt(field, cell));
  if (got <= 0) return 0;
  field.amount[cell.row][cell.col] -= got;
  return got;
}

/* Dig for `seconds`. A rate times the seconds, kept inside the room
   the harvester has left. */
export function digStep(field: OreField, unit: Unit, seconds: number): number {
  const room = CAPACITY - unit.load;
  const wanted = Math.min(DIG_RATE * seconds, room);
  const got = takeOre(field, cellAt(unit.x, unit.y), wanted);
  unit.load += got;
  return got;
}

/* Tip ore into the refinery for `seconds`. Every scrap that leaves the
   harvester arrives in the credits. */
export function unloadStep(unit: Unit, refinery: Refinery, seconds: number): number {
  const moved = Math.min(UNLOAD_RATE * seconds, unit.load);
  unit.load -= moved;
  refinery.credits += moved;
  return moved;
}

/* What should this harvester do now? Four questions, in this order. */
export function nextJob(unit: Unit, field: OreField, refinery: Refinery): Job {
  const here = cellAt(unit.x, unit.y);

  if (unit.load >= CAPACITY) {
    if (sameCell(here, refinery.cell)) return 'unloading';
    return 'home';
  }
  if (oreAt(field, here) > 0) return 'digging';
  if (nearestOre(field, here) === null) {
    if (unit.load > 0) return 'home';
    return 'waiting';
  }
  return 'to ore';
}
