/* =====================================================================
   units.test.ts. The tests.

   The same kind of tests as project 18. Run them from a terminal, in
   this folder, and leave that terminal running:

       npm test

   Four tests are finished. Two are yours, and they are jobs 4 and 9
   in units.ts. Write each test before the function it checks.

   Every test here has project 18's three steps: make, call, expect.
   ===================================================================== */

import { expect, test } from 'vitest';
import { boxFrom, driveTank, makeTank, orderMove, selectedTanks, selectInBox, selectOnly, tankAt } from './units.ts';
import { makeMap } from './map.ts';


/* ---------------------------------------------------------------------
   1. FOUR FINISHED TESTS

   Read these first. Yours look just like them.

   Two checks are new here.

   `expect(something).not.toBe(value)` fails when `something` IS
   `value`. The `.not` turns any check round. The last finished test
   uses it.

   `expect(something).toBeLessThan(value)` fails unless `something` is
   a smaller number than `value`. `toBeGreaterThan` is the other way
   round. Your second test needs both, because a tank that stops at
   the water never stops at one exact number.
   --------------------------------------------------------------------- */

test('tankAt finds the tank under the mouse, or hands back null', () => {
  const able = makeTank('Able', 100, 100);
  const baker = makeTank('Baker', 300, 100);
  const tanks = [able, baker];

  expect(tankAt(tanks, 100, 100)).toBe(able);     // right on its middle
  expect(tankAt(tanks, 310, 95)).toBe(baker);     // a little way off its middle
  expect(tankAt(tanks, 200, 100)).toBe(null);     // on the ground between them
});

test('selectOnly leaves exactly one tank picked', () => {
  const tanks = [makeTank('Able', 100, 100), makeTank('Baker', 200, 100), makeTank('Charlie', 300, 100)];

  selectOnly(tanks, tanks[0]);
  const count = selectOnly(tanks, tanks[2]);

  expect(count).toBe(1);
  expect(tanks[0].selected).toBe(false);
  expect(tanks[1].selected).toBe(false);
  expect(tanks[2].selected).toBe(true);
});

test('selectInBox picks the tanks inside the box, and lets go of the rest', () => {
  const inside = makeTank('Able', 150, 150);
  const outside = makeTank('Baker', 400, 150);
  const tanks = [inside, outside];
  outside.selected = true;

  const count = selectInBox(tanks, { left: 100, top: 100, right: 200, bottom: 200 });

  expect(count).toBe(1);
  expect(selectedTanks(tanks)).toEqual([inside]);
});

test('orderMove gives every picked tank its own goal, and leaves the rest alone', () => {
  const tanks = [makeTank('Able', 100, 100), makeTank('Baker', 200, 100), makeTank('Charlie', 300, 100)];
  tanks[0].selected = true;
  tanks[1].selected = true;

  const count = orderMove(tanks, 500, 500);

  expect(count).toBe(2);
  expect(tanks[0].moving).toBe(true);
  expect(tanks[1].moving).toBe(true);
  expect(tanks[2].moving).toBe(false);
  expect(tanks[0].goalX).not.toBe(tanks[1].goalX);
});


/* ---------------------------------------------------------------------
   2. YOUR TWO TESTS

   Change each `test.todo('sentence')` into a real test, the same shape
   as the four above.
   --------------------------------------------------------------------- */

/**
 * Job 4. A box dragged backwards is the same box.
 *
 * Write this before `boxFrom`.
 *
 * Make two boxes over the same corners. Drag the first one down and to
 * the right: from 10, 20 to 110, 220. Drag the second one up and to
 * the left: from 110, 220 back to 10, 20.
 *
 * Then expect two things:
 *
 *     the first box is left 10, top 20, right 110, bottom 220
 *     the second box is equal to the first
 *
 * Gentle hint: `toEqual` compares every part of two objects.
 * Stronger hint: `expect(backwards).toEqual(forwards);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The terminal lists one more test, and it is red. Now
 * write `boxFrom` and watch it go green.
 */
test.todo('a box dragged backwards is the same box');

/**
 * Job 9. A tank stops at the edge of the water.
 *
 * Write this before `driveTank`.
 *
 * Make a map 4 cells across and 1 down with `makeMap`. It is all grass.
 * Paint the last cell water: `map.cells[0][3] = 'water';`. A cell is
 * 48 pixels, so the water starts at x = 144.
 *
 * Make a tank in the middle of the first cell, at 24, 24. Give it a
 * goal in the middle of the water, at 168, 24, and set `moving` to
 * `true`.
 *
 * Now drive it many times, a tenth of a second each time, the way the
 * page would. A loop of 50 is plenty.
 *
 * Then expect three things:
 *
 *     the tank is not moving any more
 *     its x is still less than 144, so it never entered the water
 *     its x is more than 100, so it really drove
 *
 * Gentle hint: a `for` loop that counts to 50, with one call to
 *   `driveTank(tank, map, 0.1)` inside it.
 * Stronger hint: `expect(tank.x).toBeLessThan(144);` and
 *   `expect(tank.x).toBeGreaterThan(100);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The new test is red. Now write `driveTank`.
 */
test.todo('a tank stops at the edge of the water');


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the two tests. The answers to the functions are at the
   bottom of units.ts. One file never gives away the other.


   --- a box dragged backwards is the same box ---

     test('a box dragged backwards is the same box', () => {
       const forwards = boxFrom(10, 20, 110, 220);
       const backwards = boxFrom(110, 220, 10, 20);

       expect(forwards).toEqual({ left: 10, top: 20, right: 110, bottom: 220 });
       expect(backwards).toEqual(forwards);
     });


   --- a tank stops at the edge of the water ---

     test('a tank stops at the edge of the water', () => {
       const map = makeMap('Test', 4, 1);
       map.cells[0][3] = 'water';
       const tank = makeTank('Able', 24, 24);
       tank.goalX = 168;
       tank.goalY = 24;
       tank.moving = true;

       for (let i = 0; i < 50; i += 1) {
         driveTank(tank, map, 0.1);
       }

       expect(tank.moving).toBe(false);
       expect(tank.x).toBeLessThan(144);
       expect(tank.x).toBeGreaterThan(100);
     });

   --------------------------------------------------------------------- */
