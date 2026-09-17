/* =====================================================================
   paths.test.ts. The tests.

   The same kind of tests as projects 18 and 19. Run them from a
   terminal, in this folder, and leave that terminal running:

       npm test

   Four tests are finished. Two are yours, and they are jobs 5 and 8
   in paths.ts. Write each test before the function it checks.

   Every map here is tiny, and made with `makeMap`, so you can draw it
   on paper. A new map is all grass. The tests paint water on it where
   they need some.
   ===================================================================== */

import { expect, test } from 'vitest';
import { neighbours, routeBack, searchStep, startSearch } from './paths.ts';
import { makeMap } from './map.ts';


/* ---------------------------------------------------------------------
   1. FOUR FINISHED TESTS

   Read these first. Yours look just like them.

   One check is new here. `expect(list).toContainEqual(thing)` fails
   unless something in the list is equal to `thing`. It is `toEqual`
   for one item somewhere in a list.
   --------------------------------------------------------------------- */

test('neighbours leaves out the edge of the map and the water', () => {
  //  . . .
  //  . . ~
  //  . . .
  const map = makeMap('Test', 3, 3);
  map.cells[1][2] = 'water';

  const corner = neighbours(map, { col: 0, row: 0 });
  expect(corner.length).toBe(2);                           // up and left are off the map
  expect(corner).toContainEqual({ col: 1, row: 0 });
  expect(corner).toContainEqual({ col: 0, row: 1 });

  const middle = neighbours(map, { col: 1, row: 1 });
  expect(middle.length).toBe(3);                           // right is water
  expect(middle).not.toContainEqual({ col: 2, row: 1 });
});

test('startSearch has found only the start', () => {
  const map = makeMap('Test', 4, 3);
  const search = startSearch(map, { col: 1, row: 2 }, { col: 3, row: 0 }, 'breadth');

  expect(search.frontier).toEqual([{ col: 1, row: 2 }]);
  expect(search.looked).toBe(0);
  expect(search.steps[2][1]).toBe(0);                      // the start. Row first, then column
  expect(search.steps[0][3]).toBe(-1);                     // the goal, not found yet
  expect(search.came[2][1]).toBe(null);
});

test('searchStep looks round one cell, and finds the cells next door', () => {
  const map = makeMap('Test', 3, 3);
  const search = startSearch(map, { col: 1, row: 1 }, { col: 0, row: 0 }, 'breadth');

  const step = searchStep(search);

  expect(step).toBe('searching');
  expect(search.looked).toBe(1);
  expect(search.frontier.length).toBe(4);                  // up, right, down and left
  expect(search.steps[0][1]).toBe(1);                      // the cell above is 1 step away
  expect(search.came[0][1]).toEqual({ col: 1, row: 1 });   // and it came from the middle
  expect(search.steps[0][0]).toBe(-1);                     // a corner is 2 steps, so not found yet
});

test('routeBack follows the trail from the goal to the start', () => {
  //  S . G     start at the left, goal at the right
  const map = makeMap('Test', 3, 1);
  const search = startSearch(map, { col: 0, row: 0 }, { col: 2, row: 0 }, 'breadth');
  search.came[0][1] = { col: 0, row: 0 };                  // the trail a search would leave
  search.came[0][2] = { col: 1, row: 0 };

  const route = routeBack(search);

  expect(route).toEqual([{ col: 0, row: 0 }, { col: 1, row: 0 }, { col: 2, row: 0 }]);
});


/* ---------------------------------------------------------------------
   2. YOUR TWO TESTS

   Change each `test.todo('sentence')` into a real test, the same shape
   as the four above.
   --------------------------------------------------------------------- */

/**
 * Job 5. No route across a river with no bridge.
 *
 * Write this before `findRoute`. You will need to add `findRoute` to
 * the `import` line at the top.
 *
 * Make a map 5 cells across and 3 down. Paint the middle column water,
 * so a river runs from top to bottom:
 *
 *     . . ~ . .
 *     . . ~ . .
 *     . . ~ . .
 *
 * Then expect two things:
 *
 *     a route from { col: 0, row: 1 } to { col: 4, row: 1 } is null
 *     after you paint { col: 2, row: 1 } road, as a bridge, the same
 *     route has 5 cells in it
 *
 * Gentle hint: a `for` loop over the rows paints the river:
 *   `map.cells[row][2] = 'water';`
 * Stronger hint: `expect(findRoute(map, from, to, 'breadth')).toBe(null);`
 *   For the second check, keep the route in a variable. The checker
 *   knows it could be null, so write `route?.length`. The `?.` means
 *   "the length, unless route is null".
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The terminal lists one more test, and it is red. Now
 * write `findRoute` and watch it go green.
 */
test.todo('no route across a river with no bridge');

/**
 * Job 8. A* finds as short a route, and looks at fewer cells.
 *
 * Write this before `bestIndex`.
 *
 * `findRoute` hands back only the route, and this test also needs
 * `looked`. So run both searches yourself, with the same loop as your
 * `findRoute`.
 *
 * Make an open map 10 cells across and 10 down. Start both searches at
 * { col: 0, row: 5 }, with the goal at { col: 9, row: 5 }. Make one
 * search 'breadth' and one 'star'. Step each one until it stops
 * saying 'searching'.
 *
 * Then expect two things:
 *
 *     the A* route has the same number of cells as the breadth-first route
 *     the A* search looked at fewer cells than the breadth-first search
 *
 * Gentle hint: `routeBack` gives each route, once its search has
 *   found the goal.
 * Stronger hint: `expect(star.looked).toBeLessThan(breadth.looked);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The new test is red. Now write `bestIndex`.
 */
test.todo('A* finds as short a route, and looks at fewer cells');


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the two tests. The answers to the functions are at the
   bottom of paths.ts. One file never gives away the other.

   The import line at the top also needs `findRoute`:

     import { findRoute, neighbours, routeBack, searchStep, startSearch } from './paths.ts';


   --- no route across a river with no bridge ---

     test('no route across a river with no bridge', () => {
       const map = makeMap('Test', 5, 3);
       for (let row = 0; row < 3; row += 1) {
         map.cells[row][2] = 'water';
       }
       const from = { col: 0, row: 1 };
       const to = { col: 4, row: 1 };

       expect(findRoute(map, from, to, 'breadth')).toBe(null);

       map.cells[1][2] = 'road';
       const route = findRoute(map, from, to, 'breadth');
       expect(route?.length).toBe(5);
     });


   --- A* finds as short a route, and looks at fewer cells ---

     test('A* finds as short a route, and looks at fewer cells', () => {
       const map = makeMap('Test', 10, 10);
       const from = { col: 0, row: 5 };
       const to = { col: 9, row: 5 };
       const breadth = startSearch(map, from, to, 'breadth');
       const star = startSearch(map, from, to, 'star');

       // Each loop has nothing inside the { }. Asking the question
       // takes the step, so the loop keeps stepping until it is done.
       while (searchStep(breadth) === 'searching') {}
       while (searchStep(star) === 'searching') {}

       expect(routeBack(star).length).toBe(routeBack(breadth).length);
       expect(star.looked).toBeLessThan(breadth.looked);
     });

   --------------------------------------------------------------------- */
