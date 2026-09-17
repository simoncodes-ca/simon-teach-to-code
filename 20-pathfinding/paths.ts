/* =====================================================================
   paths.ts. File 4 of 7.

   One job: finding a route. You hand it a map, a start cell and a goal
   cell. It hands back every cell on a route from one to the other, or
   `null` when no route exists.

   This file never draws anything, the same as project 19's units.ts.
   Every function takes values and hands values back. The page draws
   the search as it happens, and the tests check it.

   Your jobs, in this order. Two of them are tests, in paths.test.ts:

       1. neighbours    the cells next door that a tank can drive on
       2. startSearch   a new search, before it has looked anywhere
       3. searchStep    look round one cell, and add what you find
       4. routeBack     follow the trail back from the goal to the start
       5. a test        no route across a river with no bridge
       6. findRoute     search until the end, then hand back the route
       7. guess         how far is it to the goal, if nothing is in the way?
       8. a test        A* finds as short a route, and looks at fewer cells
       9. bestIndex     A*'s way to choose the next cell

   Before you start, the checker shows 7 errors, one for each empty
   function. The count goes down as you fill them in.

   Keep `npm test` running in a second terminal while you work.
   ===================================================================== */

import { TERRAIN } from './terrain.ts';
import { isInside, sameCell } from './map.ts';
import type { Cell, GameMap } from './map.ts';


/* ---------------------------------------------------------------------
   1. THE SHAPES

   These are finished.
   --------------------------------------------------------------------- */

/* The two ways to search. Only these two words are allowed.

       'breadth'   breadth-first. Look round the cells in the order you
                   found them. The search spreads out evenly, like a
                   ripple on a pond.
       'star'      A*, said "A star". Look round the cell that seems
                   closest to the goal first. The search heads for the
                   goal, and goes round things when it has to. */
export type Way = 'breadth' | 'star';

/* Everything a search remembers while it runs. */
export type Search = {
  map: GameMap;              // the map it is searching
  start: Cell;               // where the route starts
  goal: Cell;                // where the route must end
  way: Way;                  // breadth-first or A*
  frontier: Cell[];          // cells found, but not looked round yet
  steps: number[][];         // steps[row][col]: how many steps that cell is from the start.
                             //   -1 means the search has not found it yet
  came: (Cell | null)[][];   // came[row][col]: the cell the search was looking round
                             //   when it found this one. null for the start, and for
                             //   every cell not found yet
  looked: number;            // how many cells it has looked round so far
};

/* What happened when the search took one step. Only these three words
   are allowed.

       'searching'   it looked round one more cell, and is not done yet
       'found'       the cell it took was the goal
       'stuck'       the frontier is empty, so there is nowhere left to look.
                     No route exists */
export type Step = 'searching' | 'found' | 'stuck';

/* Take the next cell out of the frontier, and hand it back.

   Breadth-first takes the cell at the front, index 0. That is a queue:
   first in, first out, the same as the lift's waiting list in project 2.

   A* asks your `bestIndex` which cell to take. That is job 9, and it
   is the only difference between the two ways.

   `splice(index, 1)` takes one thing out of a list at that index, the
   same as in the balloon stall. It hands back a list of what it took
   out, so `[0]` picks the one cell inside.

   `searchStep` uses this. You do not need to change it. */
export function takeNext(search: Search): Cell {
  const index = search.way === 'star' ? bestIndex(search) : 0;
  return search.frontier.splice(index, 1)[0];
}


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Seven functions and two tests. Each one has two hints next to it.
   The answers sit at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * 1. The cells next door that a tank can drive on.
 *
 * Every cell has four cells next door: up, right, down and left. Hand
 * back a list of the ones a tank may drive on. Keep them in that order.
 *
 * Leave a cell out when it is off the edge of the map. Leave it out
 * when its ground is not `walkable` in the terrain table.
 *
 * Up is one row less. Left is one column less.
 *
 * Gentle hint: make a list of the four cells first. Then loop over it,
 *   and `push` each good one into a second list.
 * Stronger hint: `isInside(map, next.col, next.row)` checks the edge.
 *   `TERRAIN[map.cells[next.row][next.col]].walkable` checks the ground.
 *   Ask `isInside` first, because a cell off the map has no ground.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Move the mouse over the map. Small blue dots mark the
 * cells next door, and the Ways out well counts them. Try it beside
 * the water.
 */
export function neighbours(map: GameMap, cell: Cell): Cell[] {
  // TODO: the cells up, right, down and left that are on the map and walkable.
}

/**
 * 2. A new search, before it has looked anywhere.
 *
 * Build a `Search` from section 1, and hand it back.
 *
 * `steps` is a grid with one number for every cell, the same shape as
 * `map.cells`. Fill every cell with -1, because nothing is found yet.
 * Then set the start cell to 0, because the start is 0 steps from the
 * start.
 *
 * `came` is a grid the same shape, full of `null`.
 *
 * The frontier holds one cell: the start. `looked` is 0.
 *
 * Gentle hint: you built a grid with a loop inside a loop in project
 *   18's `makeMap`. Here you build two grids in the same two loops.
 * Stronger hint: inside the inner loop, `stepLine.push(-1);` and
 *   `cameLine.push(null);`. After the loops, `steps[start.row][start.col] = 0;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Pick a tank and click the ground. A 0 appears on the
 * tank's cell, with a blue square round it. That square is the frontier.
 */
export function startSearch(map: GameMap, start: Cell, goal: Cell, way: Way): Search {
  // TODO: a search with every step -1 except the start, and the start in the frontier.
}

/**
 * 3. Look round one cell, and add what you find.
 *
 * This is the heart of the search. The page calls it again and again,
 * and each call looks round one cell.
 *
 *     a. Is the frontier empty? Hand back 'stuck'.
 *     b. Take the next cell with `takeNext` from section 1. Add 1 to
 *        `looked`.
 *     c. Is that cell the goal? Hand back 'found'. `sameCell` checks.
 *     d. Ask your `neighbours` for the cells next door. For each one
 *        the search has not found yet:
 *          its steps are this cell's steps, plus 1
 *          it came from this cell
 *          it goes on the back of the frontier
 *     e. Hand back 'searching'.
 *
 * "Not found yet" means its steps are still -1. Skip that check, and
 * the search finds the same cells again and again, for ever.
 *
 * Gentle hint: steps a, b and c are one line each. Step d is a loop
 *   with one `if` inside it.
 * Stronger hint: `if (search.steps[next.row][next.col] === -1)`, then
 *   `search.came[next.row][next.col] = cell;` and `search.frontier.push(next);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Pick a tank and click the ground. The search spreads
 * out from the tank one cell at a time. Every cell it finds shows how
 * many steps it is from the tank.
 */
export function searchStep(search: Search): Step {
  // TODO: follow steps a to e above.
}

/**
 * 4. Follow the trail back from the goal to the start.
 *
 * The page only calls this after the search said 'found'.
 *
 * Every cell the search found remembers, in `came`, the cell it came
 * from. So start at the goal, and ask where it came from. Then ask that
 * cell. Keep going until the answer is `null`. Only the start says
 * `null`.
 *
 * Put each cell at the FRONT of the route as you go. Then the route
 * reads from the start to the goal, and not backwards.
 *
 * `unshift` is new. It is `push` for the front of a list:
 *
 *     const list = [2, 3];
 *     list.unshift(1);        // the list is now [1, 2, 3]
 *
 * Gentle hint: a `while` loop that runs while the cell is not `null`.
 *   Its first line is `route.unshift(cell);`
 * Stronger hint: `let cell: Cell | null = search.goal;` before the loop.
 *   The last line inside is `cell = search.came[cell.row][cell.col];`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Send a tank. When the search reaches the goal, an
 * orange line draws the route back to the tank.
 */
export function routeBack(search: Search): Cell[] {
  // TODO: follow `came` from the goal back to the start. Hand back the route, start first.
}

/**
 * 5. Write a test first. See paths.test.ts.
 */

/**
 * 6. Search until the end, then hand back the route.
 *
 * Write its test first. See paths.test.ts.
 *
 * Your last three functions already do all the work. This one puts
 * them in order:
 *
 *     a. Start a search.
 *     b. Call `searchStep` again and again, while it says 'searching'.
 *     c. It said 'found'? Hand back `routeBack`.
 *        It said 'stuck'? Hand back `null`. There is no route.
 *
 * Gentle hint: keep what `searchStep` says in a variable, and loop
 *   while it is 'searching'.
 * Stronger hint: `let step = searchStep(search);` then
 *   `while (step === 'searching') { step = searchStep(search); }`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Send the tanks. Every tank finds its own route, and
 * drives along it, round the rock and the water.
 */
export function findRoute(map: GameMap, start: Cell, goal: Cell, way: Way): Cell[] | null {
  // TODO: start a search, step until it ends, and hand back the route or null.
}

/**
 * 7. How far is it to the goal, if nothing is in the way?
 *
 * Count the steps across, and the steps down, and add them up. Tanks
 * never drive corner to corner, so that is the fewest steps a route can
 * take. A real route with rock in the way takes more, never fewer.
 *
 * It is only a guess, because it ignores the rock and the water. That
 * is fine. A* only needs to know which cells seem closer.
 *
 * Across can come out below zero, when the goal is to the left.
 * `Math.abs` turns -3 into 3, and leaves 3 alone.
 *
 * Gentle hint: `to.col - from.col` is the steps across.
 * Stronger hint: `return Math.abs(to.col - from.col) + Math.abs(to.row - from.row);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Send a tank, then move the mouse over the cells the
 * search found. The Guess well says how far each one is from the goal.
 */
export function guess(from: Cell, to: Cell): number {
  // TODO: the steps across plus the steps down, both counted as positive numbers.
}

/**
 * 8. Write a test first. See paths.test.ts.
 */

/**
 * 9. A*'s way to choose the next cell.
 *
 * Write its test first. See paths.test.ts.
 *
 * Breadth-first always takes the cell at the front of the frontier.
 * A* takes the cell with the smallest total instead:
 *
 *     total = the steps it took to get there + the guess to the goal
 *
 * A small total means "this cell is near the start AND near the goal",
 * so it is probably on a short route.
 *
 * Walk through the frontier, and hand back the INDEX of the cell with
 * the smallest total. Not the cell. `takeNext` needs the index.
 *
 * When two cells have the same total, pick the one with fewer steps.
 * Without that rule, A* sometimes hands back a route a little longer
 * than it needs to be.
 *
 * Gentle hint: keep the index of the best cell so far, starting at 0.
 *   Loop from index 1, and swap when a cell beats the best one.
 * Stronger hint: `const total = search.steps[cell.row][cell.col] + guess(cell, search.goal);`
 *   A cell beats the best when `total < bestTotal`, or when the totals
 *   are equal and its steps are smaller.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Press A* on the Search card. The search stops
 * spreading like a ripple, and heads for the goal. Watch the Looked at
 * well, then press Breadth-first and compare.
 */
export function bestIndex(search: Search): number {
  // TODO: the index in the frontier with the smallest steps + guess. Ties go to fewer steps.
}


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the lines that go inside the seven functions in this file.

   The answers to the two tests are at the bottom of paths.test.ts. One
   file never gives away the other.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- neighbours(map, cell) ---

     const around: Cell[] = [
       { col: cell.col, row: cell.row - 1 },
       { col: cell.col + 1, row: cell.row },
       { col: cell.col, row: cell.row + 1 },
       { col: cell.col - 1, row: cell.row }
     ];
     const found: Cell[] = [];
     for (const next of around) {
       if (isInside(map, next.col, next.row) && TERRAIN[map.cells[next.row][next.col]].walkable) {
         found.push(next);
       }
     }
     return found;


   --- startSearch(map, start, goal, way) ---

     const steps: number[][] = [];
     const came: (Cell | null)[][] = [];
     for (let row = 0; row < map.rows; row += 1) {
       const stepLine: number[] = [];
       const cameLine: (Cell | null)[] = [];
       for (let col = 0; col < map.cols; col += 1) {
         stepLine.push(-1);
         cameLine.push(null);
       }
       steps.push(stepLine);
       came.push(cameLine);
     }
     steps[start.row][start.col] = 0;

     return {
       map: map,
       start: start,
       goal: goal,
       way: way,
       frontier: [start],
       steps: steps,
       came: came,
       looked: 0
     };


   --- searchStep(search) ---

     if (search.frontier.length === 0) return 'stuck';

     const cell = takeNext(search);
     search.looked += 1;
     if (sameCell(cell, search.goal)) return 'found';

     for (const next of neighbours(search.map, cell)) {
       if (search.steps[next.row][next.col] === -1) {
         search.steps[next.row][next.col] = search.steps[cell.row][cell.col] + 1;
         search.came[next.row][next.col] = cell;
         search.frontier.push(next);
       }
     }
     return 'searching';


   --- routeBack(search) ---

     const route: Cell[] = [];
     let cell: Cell | null = search.goal;
     while (cell !== null) {
       route.unshift(cell);
       cell = search.came[cell.row][cell.col];
     }
     return route;


   --- findRoute(map, start, goal, way) ---

     const search = startSearch(map, start, goal, way);
     let step = searchStep(search);
     while (step === 'searching') {
       step = searchStep(search);
     }
     if (step === 'stuck') return null;
     return routeBack(search);


   --- guess(from, to) ---

     return Math.abs(to.col - from.col) + Math.abs(to.row - from.row);


   --- bestIndex(search) ---

     let best = 0;
     for (let i = 1; i < search.frontier.length; i += 1) {
       const cell = search.frontier[i];
       const champ = search.frontier[best];
       const steps = search.steps[cell.row][cell.col];
       const bestSteps = search.steps[champ.row][champ.col];
       const total = steps + guess(cell, search.goal);
       const bestTotal = bestSteps + guess(champ, search.goal);
       if (total < bestTotal || (total === bestTotal && steps < bestSteps)) {
         best = i;
       }
     }
     return best;

   --------------------------------------------------------------------- */
