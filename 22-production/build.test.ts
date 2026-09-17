/* =====================================================================
   build.test.ts. The tests.

   The same kind of tests as projects 18 to 21. Run them from a
   terminal, in this folder, and leave that terminal running:

       npm test

   Four tests are finished. Two are yours, and they are jobs 4 and 8 in
   build.ts. Write each test before the function it checks.

   Every yard here is made with `makeYard`, so it starts with nothing
   built and nothing queued. The tests then put things in by hand, so
   you can read each one from top to bottom and know exactly what the
   yard holds.

   The prices and the times come from `catalogue.ts`. Look there when a
   number in a test surprises you.
   ===================================================================== */

import { expect, test } from 'vitest';
import { buildStep, canBuild, isBuilt, makeYard, needsMet } from './build.ts';
import { QUEUE_MAX } from './numbers.ts';


/* ---------------------------------------------------------------------
   1. FOUR FINISHED TESTS

   Read these first. Yours look just like them.
   --------------------------------------------------------------------- */

test('isBuilt says no about an empty yard, and yes once a building is in the list', () => {
  const yard = makeYard();

  expect(isBuilt(yard, 'power')).toBe(false);
  expect(isBuilt(yard, 'barracks')).toBe(false);

  yard.built.push('power');

  expect(isBuilt(yard, 'power')).toBe(true);
  expect(isBuilt(yard, 'barracks')).toBe(false);    // one building is not the other
});

test('needsMet is true for a thing that needs nothing, and waits for the rest', () => {
  const yard = makeYard();

  expect(needsMet(yard, 'harvester')).toBe(true);   // needs is null
  expect(needsMet(yard, 'power')).toBe(true);       // needs is null
  expect(needsMet(yard, 'barracks')).toBe(false);   // needs the power plant
  expect(needsMet(yard, 'tank')).toBe(false);       // needs the war factory

  yard.built.push('power');

  expect(needsMet(yard, 'barracks')).toBe(true);    // now it is there
  expect(needsMet(yard, 'factory')).toBe(false);    // but the barracks still is not
});

test('canBuild gives the right reason, and gives it in the right order', () => {
  const yard = makeYard();

  expect(canBuild(yard, 'harvester', 1000)).toBe('ok');
  expect(canBuild(yard, 'harvester', 100)).toBe('too dear');    // it costs 400
  expect(canBuild(yard, 'barracks', 9000)).toBe('locked');      // no power plant
  expect(canBuild(yard, 'barracks', 100)).toBe('locked');       // locked beats too dear

  yard.built.push('power');

  expect(canBuild(yard, 'power', 9000)).toBe('built');          // you only need one
  expect(canBuild(yard, 'power', 0)).toBe('built');             // built beats too dear
  expect(canBuild(yard, 'barracks', 9000)).toBe('ok');

  yard.queue.push({ key: 'barracks', seconds: 10, done: 0 });

  expect(canBuild(yard, 'barracks', 9000)).toBe('ordered');     // one is on order already
  expect(canBuild(yard, 'harvester', 9000)).toBe('ok');         // but units are built over and over

  while (yard.queue.length < QUEUE_MAX) {
    yard.queue.push({ key: 'harvester', seconds: 8, done: 0 });
  }

  expect(canBuild(yard, 'harvester', 9000)).toBe('busy');       // the queue is full
});

test('buildStep works on the front job only, and stops when it is done', () => {
  const yard = makeYard();

  expect(buildStep(yard, 1)).toBe(0);               // an empty queue has nothing to build

  yard.queue.push({ key: 'power', seconds: 6, done: 0 });
  yard.queue.push({ key: 'harvester', seconds: 8, done: 0 });

  expect(buildStep(yard, 2)).toBe(2);
  expect(yard.queue[0].done).toBe(2);
  expect(yard.queue[1].done).toBe(0);               // the one behind waits its turn

  expect(buildStep(yard, 100)).toBe(4);             // only the 4 seconds it still needed
  expect(yard.queue[0].done).toBe(6);               // and never a second more
  expect(buildStep(yard, 100)).toBe(0);             // a finished job takes no more work
});


/* ---------------------------------------------------------------------
   2. YOUR TWO TESTS

   Change each `test.todo('sentence')` into a real test, the same shape
   as the four above.
   --------------------------------------------------------------------- */

/**
 * Job 4. Buying charges exactly the price.
 *
 * Write this before `startBuild`. You will need to add `startBuild` to
 * the `import` line at the top, and `makeRefinery` from `./ore.ts`.
 *
 * Make a yard and a refinery, and set the credits by hand so the test
 * does not depend on what a new refinery starts with:
 *
 *     refinery.credits = 1000;
 *
 * A harvester costs 400 and a power plant costs 300. Look them up in
 * `catalogue.ts` if you want to check.
 *
 * Then expect these:
 *
 *     buying a harvester hands back true, leaves 600 credits, and puts
 *       one job in the queue
 *     buying a power plant hands back true, leaves 300, and makes the
 *       queue two long
 *     then set the credits to 10 and buy a harvester. It hands back
 *       false, the credits stay at 10, and the queue stays two long
 *
 * That last one is the one worth writing. A `startBuild` that charges
 * for something it refused to build loses money every time somebody
 * clicks a grey button.
 *
 * Gentle hint: check `refinery.credits` and `yard.queue.length` after
 *   every single buy, not just at the end.
 * Stronger hint: `expect(startBuild(yard, 'harvester', refinery)).toBe(true);`
 *   is the first line, and `expect(refinery.credits).toBe(600);` is the
 *   second.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The terminal lists one more test, and it is red. Now
 * write `startBuild` and watch it go green.
 */
test.todo('buying charges exactly the price, and a refused buy charges nothing');

/**
 * Job 8. The queue builds one at a time, in the order you clicked.
 *
 * Write this before `takeFinished`. Add `takeFinished` and `waitTime`
 * to the `import` line too.
 *
 * Make a yard and a refinery with plenty of credits, and buy two
 * things, in this order:
 *
 *     a power plant, which takes 6 seconds
 *     a harvester, which takes 8
 *
 * Then walk the whole queue through, checking it at every step:
 *
 *     `waitTime` is 14 seconds, because nothing has been built yet
 *     `takeFinished` is null. The front one is not done
 *     build for 6 seconds. `takeFinished` is now 'power'
 *     `yard.built` is `['power']`, because a building is remembered
 *     `waitTime` is 8. The harvester is the front one now
 *     build for 8 seconds. `takeFinished` is 'harvester'
 *     `yard.built` is still `['power']`, because a unit is not remembered
 *     `waitTime` is 0, and `takeFinished` is null again
 *
 * Those two lines about `yard.built` are the ones a hand forgets. A
 * `takeFinished` that remembers units as well would put 'harvester' in
 * the built list, and then every harvester after the first would say
 * "Built" and you could never make another one.
 *
 * Gentle hint: `toEqual` compares the insides of a list. `toBe` would
 *   ask whether it is the very same list, which it never is.
 * Stronger hint: `expect(yard.built).toEqual(['power']);` after the
 *   power plant, and the same line again after the harvester.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The new test is red. Now write `takeFinished`, and
 * the yard starts running on its own.
 */
test.todo('the queue builds one at a time, in the order you clicked');


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the two tests. The answers to the functions are at the
   bottom of build.ts. One file never gives away the other.

   The import lines at the top need four more names:

     import { buildStep, canBuild, isBuilt, makeYard, needsMet, startBuild, takeFinished, waitTime } from './build.ts';
     import { makeRefinery } from './ore.ts';


   --- buying charges exactly the price, and a refused buy charges nothing ---

     test('buying charges exactly the price, and a refused buy charges nothing', () => {
       const yard = makeYard();
       const refinery = makeRefinery();
       refinery.credits = 1000;

       expect(startBuild(yard, 'harvester', refinery)).toBe(true);
       expect(refinery.credits).toBe(600);
       expect(yard.queue.length).toBe(1);

       expect(startBuild(yard, 'power', refinery)).toBe(true);
       expect(refinery.credits).toBe(300);
       expect(yard.queue.length).toBe(2);

       refinery.credits = 10;

       expect(startBuild(yard, 'harvester', refinery)).toBe(false);
       expect(refinery.credits).toBe(10);
       expect(yard.queue.length).toBe(2);
     });


   --- the queue builds one at a time, in the order you clicked ---

     test('the queue builds one at a time, in the order you clicked', () => {
       const yard = makeYard();
       const refinery = makeRefinery();
       refinery.credits = 9000;

       startBuild(yard, 'power', refinery);
       startBuild(yard, 'harvester', refinery);

       expect(waitTime(yard)).toBe(14);
       expect(takeFinished(yard)).toBe(null);

       buildStep(yard, 6);
       expect(takeFinished(yard)).toBe('power');
       expect(yard.built).toEqual(['power']);
       expect(waitTime(yard)).toBe(8);

       buildStep(yard, 8);
       expect(takeFinished(yard)).toBe('harvester');
       expect(yard.built).toEqual(['power']);
       expect(waitTime(yard)).toBe(0);
       expect(takeFinished(yard)).toBe(null);
     });

   --------------------------------------------------------------------- */
