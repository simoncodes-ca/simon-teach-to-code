/* =====================================================================
   enemy.test.ts. The tests.

   The same kind of tests as projects 18 to 22. Run them from a
   terminal, in this folder, and leave that terminal running:

       npm test

   Four tests are finished. Two are yours, and they are jobs 5 and 8 in
   enemy.ts. Write each test before the function it checks.

   Every tank here is made by the little `tank` helper below, so you can
   read a test from top to bottom and know exactly where everybody is
   standing and how healthy they are. No map, no page, no Phaser. Just
   numbers going in and numbers coming out.

   The ranges and the damage come from `numbers.ts`. Look there when a
   number in a test surprises you.
   ===================================================================== */

import { expect, test } from 'vitest';
import { aimAt, farApart, inRange, nearestTarget } from './enemy.ts';
import { GUN_RANGE, MAX_HEALTH, SEE_RANGE } from './numbers.ts';
import { makeUnit } from './units.ts';
import type { Side, Unit } from './units.ts';


/* A tank standing at a spot, for a test to push around. The post is
   the same cell for all of them, because nothing here walks a beat. */
function tank(side: Side, name: string, x: number, y: number): Unit {
  return makeUnit(side, name, x, y, { col: 0, row: 0 });
}


/* ---------------------------------------------------------------------
   1. FOUR FINISHED TESTS

   Read these first. Yours look just like them.
   --------------------------------------------------------------------- */

test('farApart measures a straight line, whichever way round you ask', () => {
  const able = tank('blue', 'Able', 0, 0);
  const brick = tank('red', 'Brick', 30, 40);

  expect(farApart(able, brick)).toBe(50);      // the 3, 4, 5 triangle, ten times over
  expect(farApart(brick, able)).toBe(50);      // a distance is never negative
  expect(farApart(able, able)).toBe(0);        // nobody is any distance from themselves

  const close = tank('red', 'Close', 0, 9);
  expect(farApart(able, close)).toBe(9);       // straight down is just the gap down
});

test('inRange counts the edge as close enough, and uses whatever reach you give it', () => {
  const able = tank('blue', 'Able', 0, 0);
  const brick = tank('red', 'Brick', 200, 0);

  expect(inRange(able, brick, 200)).toBe(true);     // exactly 200 away, and 200 is the reach
  expect(inRange(able, brick, 199)).toBe(false);    // one pixel too far
  expect(inRange(able, brick, 9000)).toBe(true);

  // The same two tanks, and two different questions about them.
  expect(inRange(able, brick, SEE_RANGE)).toBe(true);    // 200 is inside 250. Spotted
  expect(inRange(able, brick, GUN_RANGE)).toBe(false);   // 200 is outside 130. Out of reach
});

test('nearestTarget takes the closest, ignores wrecks, and gives null for nobody', () => {
  const able = tank('blue', 'Able', 0, 0);
  const near = tank('red', 'Near', 100, 0);
  const far = tank('red', 'Far', 400, 0);

  expect(nearestTarget(able, [])).toBe(null);          // an empty list is nobody
  expect(nearestTarget(able, [far, near])).toBe(near); // the closest, not the first
  expect(nearestTarget(able, [near, far])).toBe(near); // and the order of the list changes nothing

  near.health = 0;

  expect(nearestTarget(able, [near, far])).toBe(far);  // a wreck is not worth shooting at

  far.health = 0;

  expect(nearestTarget(able, [near, far])).toBe(null); // and a list of wrecks is nobody at all
});

test('aimAt turns the turret to face the target', () => {
  const able = tank('blue', 'Able', 100, 100);

  /* Angles are in radians, and a radian rarely comes out a round
     number, so `toBeCloseTo` asks "near enough" instead of "exactly".
     0 points right, and the angle grows clockwise, because down the
     screen counts as a bigger y. */

  expect(aimAt(able, tank('red', 'East', 300, 100))).toBeCloseTo(0);
  expect(aimAt(able, tank('red', 'South', 100, 300))).toBeCloseTo(Math.PI / 2);
  expect(aimAt(able, tank('red', 'North', 100, 20))).toBeCloseTo(-Math.PI / 2);

  aimAt(able, tank('red', 'Corner', 200, 200));

  expect(able.turret).toBeCloseTo(Math.PI / 4);   // it wrote the angle down as well
});


/* ---------------------------------------------------------------------
   2. YOUR TWO TESTS

   Change each `test.todo('sentence')` into a real test, the same shape
   as the four above.
   --------------------------------------------------------------------- */

/**
 * Job 5. A shot takes exactly the damage it should.
 *
 * Write this before `shootStep`. You will need to add `shootStep` to
 * the `import` line at the top, and `RELOAD` and `SHOT_DAMAGE` to the
 * one from `./numbers.ts`.
 *
 * Make two tanks 100 pixels apart, which is inside GUN_RANGE, and a
 * third one 500 pixels away, which is a long way outside it.
 *
 * Then expect these:
 *
 *     the first shot hands back true, and takes the target from
 *       MAX_HEALTH down to MAX_HEALTH - SHOT_DAMAGE
 *     firing again straight away hands back false, and the target's
 *       health does not move, because the gun is still reloading
 *     waiting RELOAD seconds and firing again hands back true
 *     shooting at the far tank hands back false, however long you wait,
 *       and its health stays at MAX_HEALTH
 *     a target already on 4 health takes one more shot and lands on
 *       exactly 0, never below it
 *
 * To let the reload run down without a real second passing, just call
 * it with the seconds you want:
 *
 *     shootStep(able, brick, RELOAD);
 *
 * That last expectation is the one worth writing. Health that slides
 * past 0 into -5 breaks nothing you can see for a while, and then a
 * health bar draws off the wrong end of its track.
 *
 * Gentle hint: check the return value and the target's health after
 *   every single call, not just at the end.
 * Stronger hint: `expect(shootStep(able, brick, 0.1)).toBe(true);` is
 *   the first line, and `expect(brick.health).toBe(MAX_HEALTH - SHOT_DAMAGE);`
 *   is the second.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The terminal lists one more test, and it is red. Now
 * write `shootStep` and watch the map turn into a battle.
 */
test.todo('a shot takes exactly SHOT_DAMAGE, never below zero, and never before it has reloaded');

/**
 * Job 8. The questions in nextMode, asked in order.
 *
 * Write this before `nextMode`. Add `nextMode` to the `import` line.
 *
 * This test is the whole lesson of the project, written down. Make one
 * blue tank at 0, 0 and move one red tank closer and closer to it,
 * asking after every move:
 *
 *     with nobody on the other side at all, it is 'patrolling'
 *     with a foe 400 pixels away, which is outside SEE_RANGE, it is
 *       still 'patrolling'
 *     with a foe 200 away, inside SEE_RANGE but outside GUN_RANGE, it
 *       is 'chasing'
 *     with a foe 100 away, inside both, it is 'attacking'
 *     with that same foe 100 away and the tank itself on 0 health, it
 *       is 'dead'
 *
 * Move a tank by setting `brick.x = 200;` between the expectations.
 *
 * The fourth one is the one that matters. A foe 100 pixels away is
 * inside GUN_RANGE *and* inside SEE_RANGE, both at once, so both
 * questions would say yes. A `nextMode` that asks about SEE_RANGE
 * first answers 'chasing', and the red tanks drive at you for ever
 * without firing a shot. This test is what catches that.
 *
 * The fifth one catches a wreck that goes on fighting.
 *
 * Gentle hint: one blue tank, one red tank, and `nextMode(red, [blue])`
 *   asked over and over with the red tank in different places.
 * Stronger hint: `expect(nextMode(brick, [able])).toBe('chasing');` is
 *   the shape of every line, and `expect(nextMode(brick, [])).toBe('patrolling');`
 *   is the one with nobody on the other side.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The new test is red. Now write `nextMode`, and the
 * red tanks start hunting.
 */
test.todo('nextMode asks its questions in the right order');


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the two tests. The answers to the functions are at the
   bottom of enemy.ts. One file never gives away the other.

   The import lines at the top need three more names:

     import { aimAt, farApart, inRange, nearestTarget, nextMode, shootStep } from './enemy.ts';
     import { GUN_RANGE, MAX_HEALTH, RELOAD, SEE_RANGE, SHOT_DAMAGE } from './numbers.ts';


   --- a shot takes exactly SHOT_DAMAGE, never below zero, and never before it has reloaded ---

     test('a shot takes exactly SHOT_DAMAGE, never below zero, and never before it has reloaded', () => {
       const able = tank('blue', 'Able', 0, 0);
       const brick = tank('red', 'Brick', 100, 0);
       const distant = tank('red', 'Distant', 500, 0);

       expect(shootStep(able, brick, 0.1)).toBe(true);
       expect(brick.health).toBe(MAX_HEALTH - SHOT_DAMAGE);

       expect(shootStep(able, brick, 0.1)).toBe(false);
       expect(brick.health).toBe(MAX_HEALTH - SHOT_DAMAGE);

       expect(shootStep(able, brick, RELOAD)).toBe(true);
       expect(brick.health).toBe(MAX_HEALTH - SHOT_DAMAGE * 2);

       expect(shootStep(able, distant, RELOAD)).toBe(false);
       expect(shootStep(able, distant, RELOAD)).toBe(false);
       expect(distant.health).toBe(MAX_HEALTH);

       brick.health = 4;

       expect(shootStep(able, brick, RELOAD)).toBe(true);
       expect(brick.health).toBe(0);
     });


   --- nextMode asks its questions in the right order ---

     test('nextMode asks its questions in the right order', () => {
       const able = tank('blue', 'Able', 0, 0);
       const brick = tank('red', 'Brick', 400, 0);

       expect(nextMode(brick, [])).toBe('patrolling');      // nobody on the other side
       expect(nextMode(brick, [able])).toBe('patrolling');  // 400 is outside SEE_RANGE

       brick.x = 200;

       expect(nextMode(brick, [able])).toBe('chasing');     // inside SEE_RANGE, outside GUN_RANGE

       brick.x = 100;

       expect(nextMode(brick, [able])).toBe('attacking');   // inside both, and shooting wins

       brick.health = 0;

       expect(nextMode(brick, [able])).toBe('dead');        // a wreck does nothing at all
     });

   --------------------------------------------------------------------- */
