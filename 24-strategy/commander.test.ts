/* =====================================================================
   commander.test.ts. The tests.

   The same kind of tests as projects 18 to 23. Run them from a
   terminal, in this folder, and leave that terminal running:

       npm test

   Four tests are finished. Two are yours, and they are jobs 4 and 8 in
   commander.ts. Write each test before the function it checks.

   Every unit here is made by the little `unit` helper below, so you can
   read a test from top to bottom and know exactly what each side has
   got. No map, no page, no Phaser, and no ore. Just numbers going in
   and numbers coming out.

   The numbers the tests lean on come from `numbers.ts`, and the plan
   comes from `catalogue.ts`. Look there when a number surprises you.
   ===================================================================== */

import { expect, test } from 'vitest';
import { armyStrength, countKind, wantNext, wantsAttack } from './commander.ts';
import { ATTACK_TANKS, MAX_HEALTH } from './numbers.ts';
import { makeYard } from './build.ts';
import { makeUnit } from './units.ts';
import type { Side, Unit, UnitKind } from './units.ts';


/* One unit standing somewhere, for a test to push around. Nothing here
   drives, so they all stand on the same cell. */
function unit(side: Side, kind: UnitKind, name: string): Unit {
  return makeUnit(side, kind, name, 0, 0, { col: 0, row: 0 });
}

/* A side's whole force in one line. `army('red', 2, 3)` is two red
   harvesters, three red tanks and one red refinery. */
function army(side: Side, harvesters: number, tanks: number): Unit[] {
  const made: Unit[] = [unit(side, 'base', side + ' refinery')];
  for (let i = 0; i < harvesters; i += 1) made.push(unit(side, 'harvester', 'HRV ' + i));
  for (let i = 0; i < tanks; i += 1) made.push(unit(side, 'tank', 'TNK ' + i));
  return made;
}


/* ---------------------------------------------------------------------
   1. FOUR FINISHED TESTS

   Read these first. Yours look just like them.
   --------------------------------------------------------------------- */

test('countKind counts one side, one kind, and no wrecks', () => {
  const units = [...army('blue', 2, 1), ...army('red', 3, 0)];

  expect(countKind(units, 'blue', 'harvester')).toBe(2);
  expect(countKind(units, 'red', 'harvester')).toBe(3);   // the other side, same question
  expect(countKind(units, 'blue', 'tank')).toBe(1);
  expect(countKind(units, 'red', 'tank')).toBe(0);        // none at all is 0, not nothing
  expect(countKind(units, 'blue', 'base')).toBe(1);       // a refinery counts like anything else

  units[0].health = 0;                                    // the blue refinery is wrecked

  expect(countKind(units, 'blue', 'base')).toBe(0);       // and a wreck is not a refinery
});

test('armyStrength adds up the health of the tanks, and only the tanks', () => {
  const units = army('red', 4, 3);

  expect(armyStrength(units, 'red')).toBe(MAX_HEALTH * 3);   // three fresh tanks
  expect(armyStrength(units, 'blue')).toBe(0);               // blue has nobody at all

  // Four harvesters and a refinery are worth nothing in a fight.
  expect(armyStrength(army('red', 9, 0), 'red')).toBe(0);

  const hurt = army('red', 0, 2);
  hurt[1].health = 30;
  hurt[2].health = 10;

  expect(armyStrength(hurt, 'red')).toBe(40);   // two tanks, and both nearly gone

  hurt[2].health = 0;

  expect(armyStrength(hurt, 'red')).toBe(30);   // a wreck adds nothing
});

test('wantNext walks the plan from the top and stops at the first unfinished line', () => {
  const yard = makeYard();

  /* RED_PLAN starts: three harvesters, then a power plant, then a
     fourth harvester. Each side starts a map with three. */
  expect(wantNext(yard, army('red', 2, 0), 'red')).toBe('harvester');
  expect(wantNext(yard, army('red', 3, 0), 'red')).toBe('power');

  yard.built.push('power');

  expect(wantNext(yard, army('red', 3, 0), 'red')).toBe('harvester');  // the fourth one
  expect(wantNext(yard, army('red', 4, 0), 'red')).toBe('barracks');

  yard.built.push('barracks');

  expect(wantNext(yard, army('red', 4, 0), 'red')).toBe('factory');

  yard.built.push('factory');

  expect(wantNext(yard, army('red', 4, 0), 'red')).toBe('tank');

  /* Everything the plan ever asks for: six harvesters, twelve tanks,
     and all three buildings. Then there is nothing left to want. */
  expect(wantNext(yard, army('red', 6, 12), 'red')).toBe(null);
});

test('wantsAttack needs enough tanks and enough strength', () => {
  expect(ATTACK_TANKS).toBe(3);   // this test is written around that number

  // Two tanks is not an attack, however empty the other side is.
  expect(wantsAttack(army('red', 4, 2), 'red')).toBe(false);

  // Three fresh tanks against nobody at all is plenty.
  expect(wantsAttack(army('red', 0, 3), 'red')).toBe(true);

  // Three against three is even, and ATTACK_EDGE is 1.2, so it waits.
  const even = [...army('red', 0, 3), ...army('blue', 0, 3)];

  expect(wantsAttack(even, 'red')).toBe(false);
  expect(wantsAttack(even, 'blue')).toBe(false);   // the same question, asked about you

  // Four against three is a fifth stronger and more, so it goes.
  const four = [...army('red', 0, 4), ...army('blue', 0, 3)];

  expect(wantsAttack(four, 'red')).toBe(true);

  // The same four tanks, shot to pieces, are weaker than three fresh ones.
  four[1].health = 20;
  four[2].health = 20;
  four[3].health = 20;
  four[4].health = 20;

  expect(wantsAttack(four, 'red')).toBe(false);
});


/* ---------------------------------------------------------------------
   2. YOUR TWO TESTS

   Change each `test.todo('sentence')` into a real test, the same shape
   as the four above.
   --------------------------------------------------------------------- */

/**
 * Job 4. It saves up rather than buying something cheaper.
 *
 * Write this before `spendStep`. You will need to add `spendStep` to
 * the `import` line from `./commander.ts`, and `makeRefinery` to a new
 * `import` line from `./ore.ts`.
 *
 * A refinery for a test is one line:
 *
 *     const refinery = makeRefinery({ col: 0, row: 0 });
 *
 * It starts with START_CREDITS in it, so set `refinery.credits` to
 * whatever number the test needs.
 *
 * Make a fresh yard and a red side of two harvesters, so the plan still
 * wants a third one. A harvester costs 400 and a power plant costs 300,
 * and the plan wants harvesters before buildings.
 *
 * Then expect these:
 *
 *     with 200 credits it buys nothing. `spendStep` hands back null,
 *       the credits stay at 200, and the queue stays empty
 *     with 350 credits it still buys nothing, even though a power plant
 *       costs 300 and it could have one. The plan says harvester
 *     with 400 credits it buys the harvester. `spendStep` hands back
 *       'harvester', the credits land on exactly 0, and the queue holds
 *       one job
 *
 * The middle one is the test worth writing. A commander that spends
 * every credit it has looks busy and never builds an army, and nothing
 * on the page tells you why. This is the bug caught in three lines.
 *
 * Gentle hint: check the return value, `refinery.credits` and
 *   `yard.queue.length` after every single call.
 * Stronger hint: `expect(spendStep(yard, refinery, units, 'red')).toBe(null);`
 *   is the first line, and `expect(refinery.credits).toBe(200);` is the
 *   second.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The terminal lists one more test, and it is red. Now
 * write `spendStep` and the enemy starts spending.
 */
test.todo('spendStep saves up for what the plan wants instead of buying something cheaper');

/**
 * Job 8. A game is over when a refinery is gone.
 *
 * Write this before `whoWon`. Add `whoWon` to the `import` line from
 * `./commander.ts`.
 *
 * `army` gives each side a refinery, so two armies in one list is the
 * start of a game. Wreck a refinery by setting its health to 0. The
 * refinery is the first unit `army` makes, so `blue[0]` is yours.
 *
 * Then expect these:
 *
 *     with both refineries standing, nobody has won. It is `null`
 *     with the red refinery wrecked, it is 'blue'
 *     with the blue one wrecked instead, it is 'red'
 *     with both of them wrecked, nobody has won. It is `null` again
 *     a side with no tanks and no harvesters left has still not lost,
 *       as long as its refinery stands
 *
 * The fourth one is the one that catches a lazy answer. A `whoWon` that
 * only looks at the enemy's refinery says you won a fight that killed
 * you too.
 *
 * The fifth one says what this game is about. Losing every tank you own
 * is not losing. The refinery is the only thing that matters, and while
 * it stands you can build another army.
 *
 * Gentle hint: build the two armies in two variables, so you can reach
 *   a refinery by name, then join them for the call.
 * Stronger hint: `const blue = army('blue', 2, 1);` then
 *   `expect(whoWon([...blue, ...red])).toBe(null);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The new test is red. Now write `whoWon`, and the game
 * can be won and lost.
 */
test.todo('whoWon waits for a refinery to fall, and calls two wrecks a draw');


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the two tests. The answers to the functions are at the
   bottom of commander.ts. One file never gives away the other.

   The import lines at the top need two more names, and one new line:

     import { armyStrength, countKind, spendStep, wantNext, wantsAttack, whoWon } from './commander.ts';
     import { makeRefinery } from './ore.ts';


   --- spendStep saves up for what the plan wants instead of buying something cheaper ---

     test('spendStep saves up for what the plan wants instead of buying something cheaper', () => {
       const yard = makeYard();
       const refinery = makeRefinery({ col: 0, row: 0 });
       const units = army('red', 2, 0);

       refinery.credits = 200;

       expect(spendStep(yard, refinery, units, 'red')).toBe(null);
       expect(refinery.credits).toBe(200);
       expect(yard.queue.length).toBe(0);

       refinery.credits = 350;

       expect(spendStep(yard, refinery, units, 'red')).toBe(null);
       expect(refinery.credits).toBe(350);
       expect(yard.queue.length).toBe(0);

       refinery.credits = 400;

       expect(spendStep(yard, refinery, units, 'red')).toBe('harvester');
       expect(refinery.credits).toBe(0);
       expect(yard.queue.length).toBe(1);
     });


   --- whoWon waits for a refinery to fall, and calls two wrecks a draw ---

     test('whoWon waits for a refinery to fall, and calls two wrecks a draw', () => {
       const blue = army('blue', 2, 1);
       const red = army('red', 2, 1);

       expect(whoWon([...blue, ...red])).toBe(null);

       red[0].health = 0;

       expect(whoWon([...blue, ...red])).toBe('blue');

       red[0].health = MAX_HEALTH;
       blue[0].health = 0;

       expect(whoWon([...blue, ...red])).toBe('red');

       red[0].health = 0;

       expect(whoWon([...blue, ...red])).toBe(null);

       // A side with nothing left but its refinery has not lost.
       expect(whoWon([...army('blue', 0, 0), ...army('red', 3, 3)])).toBe(null);
     });

   --------------------------------------------------------------------- */
