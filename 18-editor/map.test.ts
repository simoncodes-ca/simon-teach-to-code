/* =====================================================================
   map.test.ts. The tests.

   A test is a very small program that checks one of your functions.
   It hands the function some values, and says what should come back.
   If something else comes back, the test fails and tells you.

   Run them from a terminal, in this folder:

       npm test

   Leave that terminal running. Every time you save map.ts or this
   file, the tests run again by themselves. Press Ctrl and C to stop.

   Four tests are finished. Two are yours, and they are jobs 3 and 8
   in map.ts. Write each test before the function it checks. That way
   the test is red first, and you watch your function turn it green.

   Every test in this file has the same three steps:

       make       the values the function needs
       call       the function
       expect     the answer it should hand back
   ===================================================================== */

import { expect, test } from 'vitest';
import { isInside, linesToMap, makeMap, mapToLines, paintCell, terrainFor } from './map.ts';


/* ---------------------------------------------------------------------
   1. FOUR FINISHED TESTS

   Read these first. Yours look just like them.

   `test` takes two things: a sentence saying what should be true, and
   a function that checks it. The sentence is what `npm test` prints.

   `expect(something).toBe(value)` fails unless `something` is exactly
   `value`. Use it for a number, a string, `true`, `false` or `null`.

   `expect(something).toEqual(value)` looks inside lists and objects,
   and compares every part. Two lists with the same things in them are
   equal, even though they are two different lists.
   --------------------------------------------------------------------- */

test('a new map is the size you asked for, and all grass', () => {
  const map = makeMap('Test', 3, 2);

  expect(map.name).toBe('Test');
  expect(map.cols).toBe(3);
  expect(map.rows).toBe(2);
  expect(map.cells).toEqual([
    ['grass', 'grass', 'grass'],
    ['grass', 'grass', 'grass']
  ]);
});

test('isInside says no to every edge of the map', () => {
  const map = makeMap('Test', 3, 2);

  expect(isInside(map, 0, 0)).toBe(true);     // the top left corner
  expect(isInside(map, 2, 1)).toBe(true);     // the bottom right corner
  expect(isInside(map, -1, 0)).toBe(false);   // one too far left
  expect(isInside(map, 0, -1)).toBe(false);   // one too far up
  expect(isInside(map, 3, 0)).toBe(false);    // one too far right
  expect(isInside(map, 0, 2)).toBe(false);    // one too far down
});

test('mapToLines writes each cell as its letter from the table', () => {
  const map = makeMap('Test', 3, 2);
  map.cells[0][0] = 'water';
  map.cells[1][2] = 'rock';

  expect(mapToLines(map)).toEqual([
    '~..',
    '..#'
  ]);
});

test('terrainFor finds a letter in the table, or hands back null', () => {
  expect(terrainFor('~')).toBe('water');
  expect(terrainFor('.')).toBe('grass');
  expect(terrainFor('?')).toBe(null);
});


/* ---------------------------------------------------------------------
   2. YOUR TWO TESTS

   `test.todo` is a test with a sentence and nothing else. `npm test`
   lists it as a job still to do. It never passes and never fails.

   To write one, change `test.todo('sentence')` into a real test, with
   a function after the sentence, the same shape as the four above.
   --------------------------------------------------------------------- */

/**
 * Job 3. Painting outside the map changes nothing.
 *
 * Write this before `paintCell`. It will be red at first, because
 * `paintCell` is still empty. That is right. A test that is red before
 * the function exists is a test that really checks something.
 *
 * Make a small map. Paint one cell that is off the map. Then expect
 * two things:
 *
 *     paintCell handed back false
 *     the cells are all still grass
 *
 * The first finished test shows you how to check the cells.
 *
 * Gentle hint: keep what `paintCell` hands back in a `const`, then
 *   `expect` it.
 * Stronger hint: `const changed = paintCell(map, 5, 0, 'water');`
 *   then `expect(changed).toBe(false);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The terminal lists one more test, and it is red. Now
 * write `paintCell` and watch it go green.
 */
test.todo('painting outside the map changes nothing');

/**
 * Job 8. linesToMap undoes mapToLines.
 *
 * Write this before `linesToMap`.
 *
 * This is a round trip. Make a map and paint a few cells. Turn it into
 * lines with `mapToLines`, then turn the lines back into a map with
 * `linesToMap`. You should get back exactly the map you started with.
 *
 * A round trip is a strong test. It checks that saving and loading
 * agree about every letter in the table, and you only write it once.
 *
 * Gentle hint: `toEqual` compares two whole maps, cell by cell.
 * Stronger hint: `const back = linesToMap('Test', mapToLines(map));`
 *   then `expect(back).toEqual(map);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The new test is red. Now write `linesToMap`.
 */
test.todo('linesToMap undoes mapToLines');


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the two tests. The answers to the functions are at the
   bottom of map.ts. One file never gives away the other.


   --- painting outside the map changes nothing ---

     test('painting outside the map changes nothing', () => {
       const map = makeMap('Test', 3, 2);

       const changed = paintCell(map, 5, 0, 'water');

       expect(changed).toBe(false);
       expect(map.cells).toEqual([
         ['grass', 'grass', 'grass'],
         ['grass', 'grass', 'grass']
       ]);
     });


   --- linesToMap undoes mapToLines ---

     test('linesToMap undoes mapToLines', () => {
       const map = makeMap('Test', 4, 3);
       paintCell(map, 0, 0, 'water');
       paintCell(map, 3, 2, 'forest');
       paintCell(map, 1, 1, 'road');

       const back = linesToMap('Test', mapToLines(map));

       expect(back).toEqual(map);
     });

   --------------------------------------------------------------------- */
