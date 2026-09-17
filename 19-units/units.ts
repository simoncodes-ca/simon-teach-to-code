/* =====================================================================
   units.ts. File 4 of 6.

   One job: the tanks. Which tank is under the mouse, which tanks are
   picked, and where they drive when you give an order.

   This file never draws anything, the same as project 18's map.ts.
   Every function takes values and hands values back, or changes a
   tank. The page draws the tanks, and the tests check them.

   Your jobs, in this order. Two of them are tests, in units.test.ts:

       1. tankAt          which tank is under the mouse?
       2. selectOnly      pick one tank, and let go of all the others
       3. selectedTanks   a list of the tanks that are picked
       4. a test          a box dragged backwards is still the same box
       5. boxFrom         the box between two corners
       6. isInBox         is this spot inside the box?
       7. selectInBox     pick every tank inside the box
       8. orderMove       send the picked tanks to a spot
       9. a test          a tank stops at the edge of the water
      10. driveTank       move a tank a little way towards its goal

   Before you start, the checker shows 8 errors, one for each empty
   function. The count goes down as you fill them in.

   Keep `npm test` running in a second terminal while you work.
   ===================================================================== */

import { SPACING, TANK_REACH, TANK_SPEED } from './numbers.ts';
import { canDrive, speedAt } from './map.ts';
import type { GameMap } from './map.ts';


/* ---------------------------------------------------------------------
   1. THE SHAPES

   These are finished.
   --------------------------------------------------------------------- */

/* One tank. */
export type Tank = {
  name: string;          // what the page calls it, like 'Able'
  x: number;             // where its middle is, in pixels across the map
  y: number;             // and in pixels down the map
  angle: number;         // which way it faces. 0 is to the right
  selected: boolean;     // is it picked right now?
  moving: boolean;       // does it have somewhere to go?
  goalX: number;         // where it is going, when `moving` is true
  goalY: number;
};

/* A new tank, standing still at a spot, not picked. */
export function makeTank(name: string, x: number, y: number): Tank {
  return { name: name, x: x, y: y, angle: 0, selected: false, moving: false, goalX: x, goalY: y };
}

/* The box you drag with the mouse. Its four edges, in pixels.
   `left` is always the smaller x, and `top` is always the smaller y. */
export type Box = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/* What happened when a tank tried to drive. Only these four words are
   allowed, the same as project 17's `Phase`.

       'still'      it had nowhere to go, so it did nothing
       'driving'    it moved a little way, and has further to go
       'arrived'    it reached its goal, and stopped
       'blocked'    the next step was water, rock, or off the map, so it stopped */
export type Drive = 'still' | 'driving' | 'arrived' | 'blocked';

/* Where a tank parks, next to the others, when several are sent to
   one spot together.

   Hand it which tank this is in the list (0, 1, 2 and so on) and how
   many tanks there are. It hands back how far across and down from the
   spot this tank should park. The tanks end up in a neat square block,
   with the spot in the middle.

   `orderMove` uses this. You do not need to change it. */
export function parkingSpot(index: number, count: number): { across: number; down: number } {
  const perRow = Math.ceil(Math.sqrt(count));      // 4 tanks is 2 a row, 6 tanks is 3 a row
  const rowCount = Math.ceil(count / perRow);
  const col = index % perRow;                      // what is left over after dividing
  const row = Math.floor(index / perRow);
  return {
    across: (col - (perRow - 1) / 2) * SPACING,
    down: (row - (rowCount - 1) / 2) * SPACING
  };
}


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Eight functions and two tests. Each one has two hints next to it.
   The answers sit at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * 1. Which tank is under the mouse?
 *
 * `x` and `y` are a spot on the map, in pixels. Walk through the
 * tanks. Hand back the first tank whose middle is closer to the spot
 * than TANK_REACH. If no tank is that close, hand back `null`.
 *
 * You measured the distance between two points in the balloon stall,
 * with `Math.sqrt`.
 *
 * Gentle hint: a loop over `tanks`. For each one, work out how far
 *   across and how far down the spot is from the tank's middle.
 * Stronger hint: `const distance = Math.sqrt(across * across + down * down);`
 *   then `if (distance < TANK_REACH) return tank;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Move the mouse over a tank. A thin ring appears round
 * it, and the panel called Under the mouse says its name.
 */
export function tankAt(tanks: Tank[], x: number, y: number): Tank | null {
  // TODO: the first tank close enough to the spot, or null.
}

/**
 * 2. Pick one tank, and let go of all the others.
 *
 * Set `selected` to `false` on every tank. Then set it to `true` on
 * `chosen`.
 *
 * `chosen` can be `null`. That means "let go of everything", so no
 * tank ends up picked. Pressing Escape does that.
 *
 * Hand back how many tanks are picked now. That is 1, or 0 when
 * `chosen` is `null`.
 *
 * Gentle hint: first a loop that lets go of every tank. Then an `if`
 *   that picks `chosen`, when there is one.
 * Stronger hint: `if (chosen !== null) { chosen.selected = true; return 1; }`
 *   and `return 0;` after it.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Click a tank. Yellow corners close round it. Click
 * another tank, and the corners jump to that one.
 */
export function selectOnly(tanks: Tank[], chosen: Tank | null): number {
  // TODO: let go of every tank, then pick `chosen`. Hand back how many are picked.
}

/**
 * 3. A list of the tanks that are picked.
 *
 * Walk through the tanks, and put every tank whose `selected` is
 * `true` into a new list. Hand back the new list.
 *
 * Do not take the tanks out of `tanks`. They stay on the map whether
 * they are picked or not. The new list only points at them.
 *
 * Gentle hint: an empty list first, a loop, and `push` inside an `if`.
 * Stronger hint: `const picked: Tank[] = [];` before the loop, and
 *   `if (tank.selected) picked.push(tank);` inside it.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The label across the top counts the picked tanks.
 * Clicking the ground now tries to send them, and the line under the
 * map tells you what is next.
 */
export function selectedTanks(tanks: Tank[]): Tank[] {
  // TODO: a new list holding only the picked tanks.
}

/**
 * 4. Write a test first. See units.test.ts.
 */

/**
 * 5. The box between two corners.
 *
 * Write its test first. See units.test.ts.
 *
 * You press the mouse at one corner, and let go at the other. So
 * `fromX, fromY` is where you pressed, and `toX, toY` is where the
 * mouse is now.
 *
 * A person can drag in any direction. Drag up and to the left, and
 * `toX` is smaller than `fromX`. The box must still come out with
 * `left` smaller than `right`, and `top` smaller than `bottom`.
 *
 * Gentle hint: the left edge is whichever x is smaller. The right edge
 *   is whichever x is bigger. The same goes for top and bottom.
 * Stronger hint: `left: Math.min(fromX, toX)` and
 *   `right: Math.max(fromX, toX)`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Press on the ground and drag. A yellow box follows
 * the mouse, in every direction.
 */
export function boxFrom(fromX: number, fromY: number, toX: number, toY: number): Box {
  // TODO: the four edges of the box, smallest first.
}

/**
 * 6. Is this spot inside the box?
 *
 * Hand back `true` when the spot is inside the box, or exactly on its
 * edge. Hand back `false` when it is outside.
 *
 * This is project 18's `isInside`, with pixels and a box instead of
 * cells and a map.
 *
 * Gentle hint: four things must all be true. The spot is not left of
 *   the box, not above it, not right of it and not below it.
 * Stronger hint: `x >= box.left && x <= box.right && ...` and two more.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Drag a box round some tanks. Each tank inside the
 * box lights up while you drag.
 */
export function isInBox(box: Box, x: number, y: number): boolean {
  // TODO: true when the spot is inside the box or on its edge.
}

/**
 * 7. Pick every tank inside the box.
 *
 * A tank is inside when its middle is inside. Every tank inside gets
 * picked. Every tank outside gets let go, so a new box starts a new
 * choice.
 *
 * Hand back how many tanks you picked.
 *
 * Your `selectOnly` can already let go of every tank, if you hand it
 * `null`. Then your `isInBox` says which ones to pick.
 *
 * Gentle hint: let go of everything first. Then one loop, and a count
 *   that goes up each time you pick a tank.
 * Stronger hint: `selectOnly(tanks, null);` first. Then
 *   `if (isInBox(box, tank.x, tank.y))` inside the loop.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Drag a box round three tanks and let go. All three
 * are picked.
 */
export function selectInBox(tanks: Tank[], box: Box): number {
  // TODO: let go of everything, then pick the tanks inside the box. Hand back how many.
}

/**
 * 8. Send the picked tanks to a spot.
 *
 * This is the order. You click the ground, and every picked tank gets
 * a goal.
 *
 * If every tank drove to exactly the spot you clicked, they would all
 * end up on top of each other. So each tank gets its own parking spot
 * near it. `parkingSpot`, in section 1, works out where. Hand it which
 * tank this is in the picked list, and how long the list is.
 *
 * For each picked tank: set `goalX` and `goalY` to the spot plus its
 * parking spot, and set `moving` to `true`. Leave the tanks that are
 * not picked alone.
 *
 * Hand back how many tanks you sent.
 *
 * Gentle hint: ask your `selectedTanks` for the list. Loop over it
 *   with a counting loop, because `parkingSpot` needs the number.
 * Stronger hint: `const park = parkingSpot(i, picked.length);` then
 *   `picked[i].goalX = x + park.across;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Pick some tanks and click the ground. A yellow cross
 * marks where each one is going. They do not drive yet.
 */
export function orderMove(tanks: Tank[], x: number, y: number): number {
  // TODO: give every picked tank its own goal near the spot. Hand back how many.
}

/**
 * 9. Write a test first. See units.test.ts.
 */

/**
 * 10. Move a tank a little way towards its goal.
 *
 * Write its test first. See units.test.ts.
 *
 * The page calls this for every tank, on every frame. `seconds` is how
 * long the last frame took. Project 7 said it: move by speed times the
 * time that passed.
 *
 * Here are the steps, in order. Each one hands back a word from `Drive`
 * in section 1.
 *
 *     a. Not moving? Hand back 'still'.
 *     b. Work out how far across and down the goal is, and the distance.
 *     c. The step is TANK_SPEED times `speedAt` the tank, times `seconds`.
 *        So a tank on road drives faster than a tank in the forest.
 *     d. Work out the next spot. If the goal is closer than one step,
 *        the next spot is the goal itself. Otherwise it is one step
 *        along the line to the goal.
 *     e. Ask `canDrive` about the next spot. If the answer is no, stop
 *        the tank and hand back 'blocked'. It does not move.
 *     f. Move the tank to the next spot, and turn it to face the goal.
 *     g. Reached the goal? Stop the tank and hand back 'arrived'.
 *        Otherwise hand back 'driving'.
 *
 * Gentle hint: one step along the line is `across / distance * step`
 *   across, and `down / distance * step` down.
 * Stronger hint: facing the goal is `Math.atan2(down, across)`, from
 *   the balloon stall. It takes the down distance first.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Pick some tanks and send them across the map. They
 * drive, slow down in the forest and on sand, and stop at the water.
 */
export function driveTank(tank: Tank, map: GameMap, seconds: number): Drive {
  // TODO: follow steps a to g above.
}


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the lines that go inside the eight functions in this file.

   The answers to the two tests are at the bottom of units.test.ts. One
   file never gives away the other.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- tankAt(tanks, x, y) ---

     for (const tank of tanks) {
       const across = x - tank.x;
       const down = y - tank.y;
       const distance = Math.sqrt(across * across + down * down);
       if (distance < TANK_REACH) return tank;
     }
     return null;


   --- selectOnly(tanks, chosen) ---

     for (const tank of tanks) {
       tank.selected = false;
     }
     if (chosen !== null) {
       chosen.selected = true;
       return 1;
     }
     return 0;


   --- selectedTanks(tanks) ---

     const picked: Tank[] = [];
     for (const tank of tanks) {
       if (tank.selected) picked.push(tank);
     }
     return picked;


   --- boxFrom(fromX, fromY, toX, toY) ---

     return {
       left: Math.min(fromX, toX),
       top: Math.min(fromY, toY),
       right: Math.max(fromX, toX),
       bottom: Math.max(fromY, toY)
     };


   --- isInBox(box, x, y) ---

     return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;


   --- selectInBox(tanks, box) ---

     selectOnly(tanks, null);
     let count = 0;
     for (const tank of tanks) {
       if (isInBox(box, tank.x, tank.y)) {
         tank.selected = true;
         count += 1;
       }
     }
     return count;


   --- orderMove(tanks, x, y) ---

     const picked = selectedTanks(tanks);
     for (let i = 0; i < picked.length; i += 1) {
       const park = parkingSpot(i, picked.length);
       picked[i].goalX = x + park.across;
       picked[i].goalY = y + park.down;
       picked[i].moving = true;
     }
     return picked.length;


   --- driveTank(tank, map, seconds) ---

     if (!tank.moving) return 'still';

     const across = tank.goalX - tank.x;
     const down = tank.goalY - tank.y;
     const distance = Math.sqrt(across * across + down * down);
     const step = TANK_SPEED * speedAt(map, tank.x, tank.y) * seconds;

     let nextX = tank.goalX;
     let nextY = tank.goalY;
     if (distance > step) {
       nextX = tank.x + across / distance * step;
       nextY = tank.y + down / distance * step;
     }

     if (!canDrive(map, nextX, nextY)) {
       tank.moving = false;
       return 'blocked';
     }

     tank.x = nextX;
     tank.y = nextY;
     if (distance > 0) tank.angle = Math.atan2(down, across);

     if (distance > step) return 'driving';
     tank.moving = false;
     return 'arrived';

   --------------------------------------------------------------------- */
