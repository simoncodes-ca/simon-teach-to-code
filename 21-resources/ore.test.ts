/* =====================================================================
   ore.test.ts. The tests.

   The same kind of tests as projects 18, 19 and 20. Run them from a
   terminal, in this folder, and leave that terminal running:

       npm test

   Four tests are finished. Two are yours, and they are jobs 4 and 7 in
   ore.ts. Write each test before the function it checks.

   Every map here is tiny, and made with `makeMap`, so you can draw it
   on paper. A new map is all grass, and grass holds no ore. The tests
   paint ore on it where they want a patch.

   Paint the ore before you call `makeField`. The field counts the ore
   once, when it is built, so ore painted afterwards is never seen.
   ===================================================================== */

import { expect, test } from 'vitest';
import { digStep, fullness, makeField, nearestOre, oreAt } from './ore.ts';
import { makeMap, middleOf } from './map.ts';
import { makeHarvester } from './units.ts';


/* ---------------------------------------------------------------------
   1. FOUR FINISHED TESTS

   Read these first. Yours look just like them.
   --------------------------------------------------------------------- */

test('fullness is a number from 0 to 1, whatever it is given', () => {
  expect(fullness(0, 100)).toBe(0);
  expect(fullness(25, 100)).toBe(0.25);
  expect(fullness(100, 100)).toBe(1);

  expect(fullness(140, 100)).toBe(1);        // never past the end of the bar
  expect(fullness(-20, 100)).toBe(0);        // and never behind the start
  expect(fullness(30, 0)).toBe(0);           // a whole of 0 is an empty bar
});

test('oreAt reads the patch, the bare ground, and the edge', () => {
  //  . * .     one patch, in the middle
  const map = makeMap('Test', 3, 1);
  map.cells[0][1] = 'ore';
  const field = makeField(map);

  expect(oreAt(field, { col: 1, row: 0 })).toBe(240);    // a fresh patch
  expect(oreAt(field, { col: 0, row: 0 })).toBe(0);      // grass holds no ore
  expect(oreAt(field, { col: 9, row: 9 })).toBe(0);      // off the map
});

test('nearestOre picks the closer patch, and says null when the ore runs out', () => {
  //  . * . . *     patches at column 1 and column 4
  const map = makeMap('Test', 5, 1);
  map.cells[0][1] = 'ore';
  map.cells[0][4] = 'ore';
  const field = makeField(map);

  expect(nearestOre(field, { col: 3, row: 0 })).toEqual({ col: 4, row: 0 });
  expect(nearestOre(field, { col: 0, row: 0 })).toEqual({ col: 1, row: 0 });

  const empty = makeField(makeMap('Empty', 5, 1));       // all grass, so no ore at all
  expect(nearestOre(empty, { col: 0, row: 0 })).toBe(null);
});

test('digStep digs 25 a second, and stops when the harvester is full', () => {
  const map = makeMap('Test', 3, 1);
  map.cells[0][1] = 'ore';
  const field = makeField(map);

  const patch = { col: 1, row: 0 };
  const spot = middleOf(patch);
  const able = makeHarvester('Able', spot.x, spot.y);    // standing on the patch

  expect(digStep(field, able, 1)).toBe(25);              // one second, 25 ore
  expect(able.load).toBe(25);
  expect(oreAt(field, patch)).toBe(215);                 // and 25 less in the ground

  digStep(field, able, 10);                              // ten seconds is plenty
  expect(able.load).toBe(100);                           // it holds 100, and no more
  expect(oreAt(field, patch)).toBe(140);                 // only the 75 it had room for
});


/* ---------------------------------------------------------------------
   2. YOUR TWO TESTS

   Change each `test.todo('sentence')` into a real test, the same shape
   as the four above.
   --------------------------------------------------------------------- */

/**
 * Job 4. A cell never gives up more ore than it holds.
 *
 * Write this before `takeOre`. You will need to add `takeOre` to the
 * `import` line at the top.
 *
 * Make a map 2 cells across and 1 down, and paint the second cell ore.
 * Then build the field. The patch holds 240.
 *
 * Then expect four things:
 *
 *     asking for 40 hands back 40, and 200 are left in the cell
 *     asking for 1000 hands back only 200, and the cell is then 0
 *     asking again hands back 0, and the cell is still 0
 *     asking the grass cell hands back 0
 *
 * That third one is the one a hand forgets. An empty patch must never
 * go below 0, or a harvester digs ore that was never there.
 *
 * Gentle hint: `const patch = { col: 1, row: 0 };` saves you writing it
 *   five times. `oreAt` is already imported.
 * Stronger hint: `expect(takeOre(field, patch, 1000)).toBe(200);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The terminal lists one more test, and it is red. Now
 * write `takeOre` and watch it go green.
 */
test.todo('a cell never gives up more ore than it holds');

/**
 * Job 7. Unloading moves the whole load, and never more.
 *
 * Write this before `unloadStep`. Add `unloadStep` and `makeRefinery`
 * to the `import` line at the top.
 *
 * No map is needed here. Make a refinery with `makeRefinery()`, and a
 * harvester anywhere, and then fill it by hand:
 *
 *     able.load = 100;
 *
 * A harvester tips 60 ore a second, and it is carrying 100. So two
 * seconds, one at a time, empty it.
 *
 * Then expect these:
 *
 *     the first second moves 60. The load is 40 and the credits are 60
 *     the second second moves only 40, not 60. The load is 0 and the
 *       credits are 100
 *     a third second moves 0, and the credits stay at 100
 *
 * Every one of those checks the same thing from a different side. The
 * load and the credits always add up to 100, because ore only ever
 * moves from one to the other.
 *
 * Gentle hint: call `unloadStep(able, refinery, 1)` inside the
 *   `expect`, the same way the digging test calls `digStep`.
 * Stronger hint: `expect(unloadStep(able, refinery, 1)).toBe(40);` is
 *   the second one. Check `able.load` and `refinery.credits` after each.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The new test is red. Now write `unloadStep`.
 */
test.todo('unloading moves the whole load, and never more');


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the two tests. The answers to the functions are at the
   bottom of ore.ts. One file never gives away the other.

   The import line at the top needs three more names:

     import { digStep, fullness, makeField, makeRefinery, nearestOre, oreAt, takeOre, unloadStep } from './ore.ts';


   --- a cell never gives up more ore than it holds ---

     test('a cell never gives up more ore than it holds', () => {
       //  . *
       const map = makeMap('Test', 2, 1);
       map.cells[0][1] = 'ore';
       const field = makeField(map);
       const patch = { col: 1, row: 0 };

       expect(takeOre(field, patch, 40)).toBe(40);
       expect(oreAt(field, patch)).toBe(200);

       expect(takeOre(field, patch, 1000)).toBe(200);
       expect(oreAt(field, patch)).toBe(0);

       expect(takeOre(field, patch, 40)).toBe(0);
       expect(oreAt(field, patch)).toBe(0);

       expect(takeOre(field, { col: 0, row: 0 }, 40)).toBe(0);
     });


   --- unloading moves the whole load, and never more ---

     test('unloading moves the whole load, and never more', () => {
       const refinery = makeRefinery();
       const able = makeHarvester('Able', 100, 100);
       able.load = 100;

       expect(unloadStep(able, refinery, 1)).toBe(60);
       expect(able.load).toBe(40);
       expect(refinery.credits).toBe(60);

       expect(unloadStep(able, refinery, 1)).toBe(40);
       expect(able.load).toBe(0);
       expect(refinery.credits).toBe(100);

       expect(unloadStep(able, refinery, 1)).toBe(0);
       expect(refinery.credits).toBe(100);
     });

   --------------------------------------------------------------------- */
