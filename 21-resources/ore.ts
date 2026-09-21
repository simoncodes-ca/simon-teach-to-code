/* =====================================================================
   ore.ts. File 6 of 8.

   One job: the ore. How much is left in each cell, how much a
   harvester is carrying, how much the refinery has been paid, and what
   each harvester should do next.

   This file never draws anything, the same as project 20's paths.ts.
   Every function takes values and hands values back. The page draws the
   bars and the counter, and the tests check the sums.

   Your jobs, in this order. Two of them are tests, in ore.test.ts:

       1. fullness     how full is it, from 0 to 1? Every bar reads this
       2. oreAt        how much ore is left in one cell?
       3. nearestOre   which patch is closest?
       4. a test       a cell never gives up more ore than it holds
       5. takeOre      take some ore out of a cell
       6. digStep      dig for a little while
       7. a test       unloading moves the whole load, and never more
       8. unloadStep   tip some ore into the refinery
       9. nextJob      what should this harvester do now?

   Before you start, the checker shows 7 errors, one for each empty
   function. The count goes down as you fill them in.

   Keep `npm test` running in a second terminal while you work.
   ===================================================================== */

import { BASE_COL, BASE_ROW, CAPACITY, DIG_RATE, UNLOAD_RATE } from './numbers.ts';
import { TERRAIN } from './terrain.ts';
import { cellAt, isInside, sameCell } from './map.ts';
import type { Cell, GameMap } from './map.ts';
import { guess } from './paths.ts';
import type { Harvester, Job } from './units.ts';


/* ---------------------------------------------------------------------
   1. THE SHAPES

   These are finished.
   --------------------------------------------------------------------- */

/* The ore on a map.

   The map says where ore grows, and it never changes. This says how
   much is left, and it changes all game. So a cell has two facts about
   it, kept in two grids, the same as the ships and the shots in
   project 5.

   `amount` is the same shape as `map.cells`, so you read it row first:
   `field.amount[row][col]`. */
export type OreField = {
  map: GameMap;           // the map the ore grows on
  amount: number[][];     // amount[row][col]: how much ore is left in that cell
  started: number;        // how much ore the whole field held when it was new
};

/* The refinery. It stands on one cell, and it counts every scrap of
   ore that has ever been tipped into it. */
export type Refinery = {
  cell: Cell;             // where it stands
  credits: number;        // the counter on the page
};

/* Build the ore field for a map.

   Each kind of ground says how much ore one fresh cell of it holds, in
   the terrain table's `holds` column. Grass holds 0. Ore holds 240. So
   this reads the table and never names a kind of ground.

   The page calls it once for each map. You do not need to change it. */
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

/* A new refinery, standing on the cell numbers.ts names.

   You do not need to change it. */
export function makeRefinery(): Refinery {
  return { cell: { col: BASE_COL, row: BASE_ROW }, credits: 0 };
}


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Seven functions and two tests. Each one has two hints next to it.
   The answers sit at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * 1. How full is it, from 0 to 1?
 *
 * Every bar on the page is one number between 0 and 1. A bar at 0 is
 * empty, a bar at 0.5 is half full, and a bar at 1 is full. So this one
 * small function draws the load bar of all six harvesters, the
 * refinery bar, and the shading on every patch.
 *
 * `part` divided by `whole` is the answer. Two things can go wrong with
 * that, and both of them are your job:
 *
 *     a whole of 0 would divide by nothing, and hand back a mess.
 *       Hand back 0 instead.
 *     a part bigger than the whole would hand back more than 1, and
 *       draw a bar past the end of its track. Keep it at 1.
 *
 * `Math.min` and `Math.max` are from projects 12 and 16. `Math.min(1, n)`
 * never goes above 1. `Math.max(0, n)` never goes below 0.
 *
 * Gentle hint: check for a whole of 0 first, on its own line, and hand
 *   back 0. Then divide, and keep the answer between 0 and 1.
 * Stronger hint: `if (whole <= 0) return 0;` then
 *   `return Math.min(1, Math.max(0, part / whole));`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Every bar on the page stops being flat. The six load
 * bars are still empty, because nothing has been dug yet, but the
 * Field card's bar fills in.
 */
export function fullness(part: number, whole: number): number {
  // TODO: part divided by whole, kept between 0 and 1. A whole of 0 means 0.
}

/**
 * 2. How much ore is left in one cell?
 *
 * Look the cell up in `field.amount`. Remember that the grid is rows of
 * columns, so the row comes first.
 *
 * A cell off the edge of the map has no ore, and it has no square in
 * the grid either. Looking it up would hand back nothing at all, so
 * ask `isInside` first and hand back 0.
 *
 * Gentle hint: this is two lines. The first one is the edge check.
 * Stronger hint: `if (!isInside(field.map, cell.col, cell.row)) return 0;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Move the mouse over the map. The Ore number says how
 * much is left in that cell, and every patch shows its number.
 */
export function oreAt(field: OreField, cell: Cell): number {
  // TODO: the ore left in that cell, or 0 when the cell is off the map.
}

/**
 * 3. Which patch is closest?
 *
 * Walk over every cell of the field. Skip the ones with no ore left.
 * Hand back the cell of the closest one to `from`.
 *
 * Hand back `null` when no ore is left anywhere. That is how the page
 * knows the field is finished.
 *
 * "Closest" here means the `guess` you wrote in project 20: the steps
 * across plus the steps down. It is already imported at the top of
 * this file. A real route may be longer, because rock and water get in
 * the way, and that is fine. A harvester asks `findRoute` afterwards.
 *
 * Gentle hint: a loop inside a loop, like project 18's `makeMap`. Keep
 *   the best cell so far in a variable that starts as `null`.
 * Stronger hint: `if (oreAt(field, here) <= 0) continue;` skips a cell.
 *   Then `const far = guess(from, here);` and swap when `best === null ||
 *   far < bestFar`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Move the mouse over the map. The Nearest patch number
 * names the closest patch to the mouse, and an amber ring marks it.
 */
export function nearestOre(field: OreField, from: Cell): Cell | null {
  // TODO: the cell of the closest patch with ore left, or null when there is none.
}

/**
 * 4. Write a test first. See ore.test.ts.
 */

/**
 * 5. Take some ore out of a cell.
 *
 * Write its test first. See ore.test.ts.
 *
 * Somebody asks for `wanted` ore from a cell. Take it out of the cell,
 * and hand back how much you actually gave them.
 *
 * You cannot give more than the cell holds. Asking for 30 when 12 are
 * left gives 12, and the cell is then empty. It never goes below 0.
 *
 * So: work out the smaller of `wanted` and what is there. Take that
 * much out of the grid, and hand it back.
 *
 * Careful with a cell off the map, and with a cell that is already
 * empty. Both give 0, and neither one may be written to.
 *
 * Gentle hint: `oreAt` already tells you what is there. `Math.min` picks
 *   the smaller of two numbers.
 * Stronger hint: `const got = Math.min(wanted, oreAt(field, cell));`
 *   then `if (got <= 0) return 0;` and
 *   `field.amount[cell.row][cell.col] -= got;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Nothing moves yet, because nothing calls it until job
 * 6. The test you wrote in job 4 goes green.
 */
export function takeOre(field: OreField, cell: Cell, wanted: number): number {
  // TODO: take up to `wanted` out of the cell, and hand back how much you got.
}

/**
 * 6. Dig for a little while.
 *
 * The page calls this on every frame, for every harvester whose job is
 * 'digging'. `seconds` is how long the last frame took, the same
 * `seconds` as project 7's balloons.
 *
 * A harvester digs `DIG_RATE` ore a second. So in `seconds` it digs
 * `DIG_RATE * seconds` ore. That is project 7's rule again: a rate
 * times the time that passed, never a fixed amount a frame.
 *
 * Two limits, and both are `Math.min`:
 *
 *     it cannot carry more than `CAPACITY`, so it may only ask for the
 *       room it has left
 *     the cell may hold less than it asked for, and `takeOre` already
 *       deals with that
 *
 * Add what you got to `harvester.load`, and hand that number back. The
 * page uses it to decide whether the harvester is getting anywhere.
 *
 * `cellAt(harvester.x, harvester.y)` is the cell it is standing in.
 *
 * Gentle hint: three lines. The room left, then `takeOre`, then add it
 *   on and hand it back.
 * Stronger hint: `const room = CAPACITY - harvester.load;` and
 *   `const wanted = Math.min(DIG_RATE * seconds, room);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Pick a harvester and click a patch. Its load bar fills
 * up while it sits there, and the patch fades as the ore comes out.
 */
export function digStep(field: OreField, harvester: Harvester, seconds: number): number {
  // TODO: dig DIG_RATE a second into the room it has left, and hand back how much.
}

/**
 * 7. Write a test first. See ore.test.ts.
 */

/**
 * 8. Tip some ore into the refinery.
 *
 * The page calls this on every frame, for every harvester whose job is
 * 'unloading'. It is `digStep` backwards, and it is the moment the
 * counter on the page moves.
 *
 * A harvester tips `UNLOAD_RATE` ore a second. It can never tip more
 * than it is carrying, so `Math.min` again.
 *
 * Every scrap that leaves the harvester arrives in the refinery. Take
 * it off `harvester.load` and add it to `refinery.credits`. Hand back
 * how much moved.
 *
 * The two lines must agree. Take 40 off the load and add 30 to the
 * credits, and ore disappears on the way. Nothing on the page would
 * tell you, which is why job 7's test checks the sum.
 *
 * Gentle hint: one `Math.min`, then one line down and one line up.
 * Stronger hint: `const moved = Math.min(UNLOAD_RATE * seconds, harvester.load);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Send a full harvester to the refinery. Its load bar
 * empties, the credits counter climbs, and the test from job 7 goes
 * green.
 */
export function unloadStep(harvester: Harvester, refinery: Refinery, seconds: number): number {
  // TODO: move up to UNLOAD_RATE a second from the load into the credits.
}

/**
 * 9. What should this harvester do now?
 *
 * This is the last job, and it uses three of the others. It decides
 * nothing about pixels and moves nobody. It reads where the harvester
 * is and what it carries, and hands back one of the job words from
 * units.ts.
 *
 * The page calls it whenever a harvester finishes something, and it
 * does what the word says: a driving word sends the harvester off with
 * a route, and the other words leave it where it is.
 *
 * Four questions, in this order:
 *
 *     a. Is it full? `harvester.load >= CAPACITY`.
 *          Standing on the refinery already? 'unloading'.
 *          Otherwise 'home'.
 *     b. Is there ore in the cell it is standing in? 'digging'.
 *     c. Is there no patch left anywhere on the map?
 *          Carrying something? 'home'. Take that last bit back.
 *          Carrying nothing? 'waiting'. There is nothing left to do.
 *     d. Otherwise 'to ore'.
 *
 * Get the order wrong and the run still looks almost right, for a
 * while. Ask b before a, and a full harvester keeps digging on a patch
 * it cannot empty, for ever.
 *
 * `cellAt` gives the cell it is standing in, and `sameCell` compares
 * two cells. Both are imported already.
 *
 * Gentle hint: four `if`s, in the order above, and a `return` at the
 *   end for 'to ore'.
 * Stronger hint: `const here = cellAt(harvester.x, harvester.y);` on the
 *   first line, then every question is one line about `here`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Now watch. Every harvester picks its own job, and the
 * run goes round on its own: out to the ore, dig, home, tip it in, and
 * out again. The credits counter never stops.
 */
export function nextJob(harvester: Harvester, field: OreField, refinery: Refinery): Job {
  // TODO: answer the four questions above, and hand back one job word.
}


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the lines that go inside the seven functions in this file.

   The answers to the two tests are at the bottom of ore.test.ts. One
   file never gives away the other.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- fullness(part, whole) ---

     if (whole <= 0) return 0;
     return Math.min(1, Math.max(0, part / whole));


   --- oreAt(field, cell) ---

     if (!isInside(field.map, cell.col, cell.row)) return 0;
     return field.amount[cell.row][cell.col];


   --- nearestOre(field, from) ---

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


   --- takeOre(field, cell, wanted) ---

     const got = Math.min(wanted, oreAt(field, cell));
     if (got <= 0) return 0;
     field.amount[cell.row][cell.col] -= got;
     return got;


   --- digStep(field, harvester, seconds) ---

     const room = CAPACITY - harvester.load;
     const wanted = Math.min(DIG_RATE * seconds, room);
     const got = takeOre(field, cellAt(harvester.x, harvester.y), wanted);
     harvester.load += got;
     return got;


   --- unloadStep(harvester, refinery, seconds) ---

     const moved = Math.min(UNLOAD_RATE * seconds, harvester.load);
     harvester.load -= moved;
     refinery.credits += moved;
     return moved;


   --- nextJob(harvester, field, refinery) ---

     const here = cellAt(harvester.x, harvester.y);

     if (harvester.load >= CAPACITY) {
       if (sameCell(here, refinery.cell)) return 'unloading';
       return 'home';
     }
     if (oreAt(field, here) > 0) return 'digging';
     if (nearestOre(field, here) === null) {
       if (harvester.load > 0) return 'home';
       return 'waiting';
     }
     return 'to ore';

   --------------------------------------------------------------------- */
