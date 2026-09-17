/* =====================================================================
   paths.ts. File 4 of 8.

   One job: finding a route. It is project 20, finished, copied from
   that project's answer key. Nothing about it changed.

   You hand it a map, a start cell and a goal cell. It hands back every
   cell on a route from one to the other, or `null` when no route
   exists. The harvesters use it four times a minute each, and you
   never have to think about it again.

   The page searches with A*, because A* looks at fewer cells. Read
   `20-pathfinding/README.md` again for the whole story.
   ===================================================================== */

import { TERRAIN } from './terrain.ts';
import { isInside, sameCell } from './map.ts';
import type { Cell, GameMap } from './map.ts';


/* --- The shapes --- */

/* The two ways to search. 'breadth' spreads out evenly. 'star' is A*,
   and it heads for the goal. */
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
                             //   when it found this one
  looked: number;            // how many cells it has looked round so far
};

/* What happened when the search took one step. 'stuck' means the
   frontier is empty, so no route exists. */
export type Step = 'searching' | 'found' | 'stuck';


/* --- The search --- */

/* Take the next cell out of the frontier. Breadth-first takes the
   front. A* takes the cell with the smallest steps plus guess. */
export function takeNext(search: Search): Cell {
  const index = search.way === 'star' ? bestIndex(search) : 0;
  return search.frontier.splice(index, 1)[0];
}

/* The cells up, right, down and left that are on the map and walkable. */
export function neighbours(map: GameMap, cell: Cell): Cell[] {
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
}

/* A new search. Every cell is -1 steps, which means not found yet,
   except the start. The frontier holds the start on its own. */
export function startSearch(map: GameMap, start: Cell, goal: Cell, way: Way): Search {
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
}

/* Look round one cell, and add the cells next door that nobody has
   found yet. */
export function searchStep(search: Search): Step {
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
}

/* Follow `came` back from the goal to the start. `unshift` puts each
   cell at the front, so the route reads start first. */
export function routeBack(search: Search): Cell[] {
  const route: Cell[] = [];
  let cell: Cell | null = search.goal;
  while (cell !== null) {
    route.unshift(cell);
    cell = search.came[cell.row][cell.col];
  }
  return route;
}

/* Search until it ends. The route, or `null` when there is none. */
export function findRoute(map: GameMap, start: Cell, goal: Cell, way: Way): Cell[] | null {
  const search = startSearch(map, start, goal, way);
  let step = searchStep(search);
  while (step === 'searching') {
    step = searchStep(search);
  }
  if (step === 'stuck') return null;
  return routeBack(search);
}

/* How far apart two cells are, if nothing is in the way. */
export function guess(from: Cell, to: Cell): number {
  return Math.abs(to.col - from.col) + Math.abs(to.row - from.row);
}

/* A*'s choice: the frontier cell with the smallest steps plus guess.
   On a tie, the one with fewer steps. */
export function bestIndex(search: Search): number {
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
}
