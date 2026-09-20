/* =====================================================================
   commander.ts. File 10 of 12.

   One job: the enemy's commander. How many of a thing a side has, how
   strong its army is, what it is saving up for, when to buy the thing,
   when to attack, who marches, and who has won.

   Every file before this one is finished work. The ore run is project
   21, the yard is project 22, and the brain in a tank is project 23,
   all copied from their answer keys. This file is the only one with
   anything missing in it, and it is the last one you write.

   A tank's brain decides where to point a gun. This is the brain above
   it. It never moves a tank and it never fires a shot. It decides what
   an army spends its money on and when it goes.

   This file never draws anything, the same as every file before it
   except rack.ts and game.ts. Every function takes values and hands
   values back.

   Your jobs, in this order. Two of them are tests, in commander.test.ts:

       1. countKind     how many of this kind has that side got?
       2. armyStrength  how much fight is left in that side?
       3. wantNext      what is the enemy saving up for?
       4. a test        it saves up rather than buying something cheaper
       5. spendStep     buy the thing it wants, if it can
       6. wantsAttack   is it strong enough to come for you?
       7. attackOrders  who marches, and who stays at home
       8. a test        a game is over when a refinery is gone
       9. whoWon        has anybody won yet?

   Before you start, the checker shows 7 errors, one for each empty
   function. The count goes down as you fill them in.

   Your own side works from the moment the page opens. Your harvesters
   dig, and the Build card spends what they bring home. The enemy sits
   in its corner and does nothing at all until job 5.

   Keep `npm test` running in a second terminal while you work.
   ===================================================================== */

import { ATTACK_EDGE, ATTACK_TANKS, GUARDS } from './numbers.ts';
import { CATALOGUE, RED_PLAN } from './catalogue.ts';
import type { ItemKey } from './catalogue.ts';
import { canBuild, isBuilt, startBuild } from './build.ts';
import type { Yard } from './build.ts';
import type { Refinery } from './ore.ts';
import { foeOf } from './units.ts';
import type { Side, Unit, UnitKind } from './units.ts';
import { wrecked } from './enemy.ts';


/* ---------------------------------------------------------------------
   1. THE ONE THAT IS ALREADY WRITTEN

   Your `wantNext` asks this one, so it is given.
   --------------------------------------------------------------------- */

/* How many of one line of the catalogue has a side got already?

   A plan asks for things by their catalogue key, like 'harvester' or
   'barracks'. Those are two different questions, so this function asks
   the table which kind of thing it is:

       a unit       count them on the map. That is your `countKind`
       a building   there is either one or there is not, so the answer
                      is 1 or 0. Project 22's `isBuilt` knows

   It is here rather than in your list of jobs because it is bookkeeping
   and not a decision. */
export function howMany(yard: Yard, units: Unit[], side: Side, key: ItemKey): number {
  if (CATALOGUE[key].kind === 'building') return isBuilt(yard, key) ? 1 : 0;
  return countKind(units, side, key as UnitKind);
}


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Seven functions and two tests. Each one has two hints next to it.
   The answers sit at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * 1. How many of this kind has that side got?
 *
 * `units` is every unit in the game, both sides and all three kinds.
 * Count the ones that are on `side`, are of `kind`, and are still in
 * one piece.
 *
 * So `countKind(units, 'red', 'tank')` is how many tanks the enemy has
 * left, and `countKind(units, 'blue', 'base')` is 1 while your refinery
 * stands and 0 once it is gone.
 *
 * **Skip the wrecks.** A burnt-out tank is still in the list, and this
 * is the number the enemy decides whether to attack on. Counting
 * wrecks as soldiers is how an army walks into a fight it has already
 * lost. The given `wrecked` from project 23 answers that question.
 *
 * It is the same shape as project 21's counting: a total that starts at
 * 0, a `for ... of` loop, and a `continue` for the ones that do not
 * count.
 *
 * Gentle hint: four lines. A total, a loop, one `if` that skips, and
 *   the total handed back.
 * Stronger hint: `if (unit.side !== side || unit.kind !== kind) continue;`
 *   skips the ones on the wrong side or of the wrong kind, and
 *   `if (wrecked(unit)) continue;` skips the wrecks.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The Forces card fills in: harvesters, tanks and
 * refineries, for you and for the enemy, side by side. Both columns
 * come out of this one function, because a red unit and a blue unit are
 * the same shape of object. Watch your harvester count go up when one
 * rolls out of your yard.
 */
export function countKind(units: Unit[], side: Side, kind: UnitKind): number {
  // TODO: how many living units on `side` are of `kind`?
}

/**
 * 2. How much fight is left in that side?
 *
 * Add up the health of every tank a side still has. A side with four
 * fresh tanks is 400 strong. The same four tanks, all of them half shot
 * away, are 200.
 *
 * Only tanks count. A harvester carries ore and a refinery is a
 * shed, so neither one can win a fight or lose one.
 *
 * This is one number standing in for a whole army, and job 6 is the
 * decision that reads it. That is why health belongs in it and a plain
 * count of tanks does not: two tanks with 10 health each should not
 * frighten anybody.
 *
 * Gentle hint: project 22's `waitTime` is the shape. A total, a loop
 *   over the units, and one `if` about who counts.
 * Stronger hint: `total += unit.health;` is the line inside the loop,
 *   and the `if` above it skips anything that is not this side's tank.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Two strength bars appear on the plate at the top, one
 * for each side. Yours is empty until you build a tank, and so is the
 * enemy's. Send a tank into a fight and watch a bar go down as it takes
 * damage.
 */
export function armyStrength(units: Unit[], side: Side): number {
  // TODO: the total health of every living tank on `side`.
}

/**
 * 3. What is the enemy saving up for?
 *
 * `RED_PLAN` in catalogue.ts is the enemy's shopping list. Ten lines,
 * in order, and each one says "keep buying this until you have `upTo`
 * of them":
 *
 *     { key: 'harvester', upTo: 3 }
 *     { key: 'power', upTo: 1 }
 *     { key: 'harvester', upTo: 4 }
 *     ...
 *
 * Walk the list from the top. Hand back the key of the first line the
 * enemy has not finished yet, or `null` when it has bought the lot.
 *
 * The given `howMany` above says how many it has. You compare that with
 * the line's `upTo`.
 *
 * **From the top every time, and stop at the first one.** That is what
 * makes it a plan rather than a shopping basket. A commander that
 * skipped a line it could not afford yet would buy four harvesters and
 * never build a war factory, because a harvester is always cheaper than
 * a factory. Job 4's test is about exactly that.
 *
 * Gentle hint: three lines. A `for ... of` over `RED_PLAN`, one `if`
 *   inside it, and `return null;` at the end.
 * Stronger hint: `if (howMany(yard, units, side, line.key) < line.upTo) return line.key;`
 *   is the line inside the loop.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The Enemy card's Saving for well names what the enemy
 * wants, and it changes as the game goes on. It still has not spent a
 * credit, so it wants a harvester for ever. That is job 5.
 */
export function wantNext(yard: Yard, units: Unit[], side: Side): ItemKey | null {
  // TODO: the first line of RED_PLAN that is not finished yet, or null.
}

/**
 * 4. Write a test first. See commander.test.ts.
 */

/**
 * 5. Buy the thing it wants, if it can.
 *
 * Write its test first. See commander.test.ts.
 *
 * The page calls this once a second. Three steps:
 *
 *     a. Ask `wantNext` what the side is after. `null` means the plan
 *          is finished, so hand back `null`
 *     b. Ask project 22's `canBuild` about it. Anything but 'ok' and you
 *          hand back `null` and buy nothing at all
 *     c. Otherwise `startBuild` it, and hand its key back
 *
 * Step b is the whole lesson, and it is one word long: **nothing**.
 *
 * 'too dear' means the enemy has not got the money yet. The wrong thing
 * to do then is to look down the list for something cheaper, and it is
 * wrong even though it feels thrifty. Money spent on a harvester is
 * money not spent on the war factory, and the war factory is the only
 * door to a tank. So a commander that always spends is a commander with
 * nine harvesters and no army.
 *
 * Saving up looks like doing nothing. It is the most useful thing this
 * function ever does.
 *
 * `canBuild` and `startBuild` are both in build.ts, and `startBuild`
 * asks `canBuild` again itself. Asking first anyway is what lets you
 * hand the key back only when something was really bought.
 *
 * Gentle hint: four lines. The want, the `null` check, the `canBuild`
 *   check, then `startBuild`.
 * Stronger hint: `if (canBuild(yard, key, refinery.credits) !== 'ok') return null;`
 *   is the middle of it, and the last two lines are
 *   `startBuild(yard, key, refinery);` and `return key;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file, and then watch the other corner of the map for a
 * minute. The enemy's credits start to move. A harvester rolls out of
 * its yard and drives to a patch. A power plant lands beside its
 * refinery, then a barracks, then a war factory, and then the first
 * tank you did not build comes out of the gate. It sits by its refinery
 * and guards it, because nobody has told it to go anywhere. That is
 * jobs 6 and 7.
 */
export function spendStep(yard: Yard, refinery: Refinery, units: Unit[], side: Side): ItemKey | null {
  // TODO: buy what `wantNext` asked for, but only when canBuild says 'ok'.
}

/**
 * 6. Is it strong enough to come for you?
 *
 * Two questions, and both have to say yes:
 *
 *     a. Has it got at least ATTACK_TANKS tanks? One tank on its own
 *          is a present, not an attack
 *     b. Is its strength at least ATTACK_EDGE times yours?
 *
 * ATTACK_EDGE is 1.2, so the enemy waits until it is a fifth stronger
 * than you before it moves. Both numbers are in numbers.ts, and both
 * are worth changing once the game works.
 *
 * `armyStrength` from job 2 answers question b, asked twice: once about
 * `side`, and once about the other side. The given `foeOf` in units.ts
 * hands you the other side, so `foeOf('red')` is `'blue'`.
 *
 * Question a is about `countKind` from job 1.
 *
 * Gentle hint: three lines. One `if` that hands back false, then one
 *   comparison handed back.
 * Stronger hint:
 *   `return armyStrength(units, side) >= armyStrength(units, foeOf(side)) * ATTACK_EDGE;`
 *   is the last line.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The Enemy card's Orders well starts saying `massing`
 * or `attack`, and the plate's two strength bars are the reason why.
 * Nothing has moved yet. The word is right and nobody is acting on it,
 * which is job 7.
 */
export function wantsAttack(units: Unit[], side: Side): boolean {
  // TODO: true when this side has enough tanks and enough strength.
}

/**
 * 7. Who marches, and who stays at home?
 *
 * Hand back the list of tanks that should go. The page gives every tank
 * in that list a route to your refinery and sends it.
 *
 * Two rules:
 *
 *     every living tank on that side is in the force
 *     GUARDS of them stay behind, and GUARDS is 1
 *
 * So a side with four tanks marches with three. A side with one tank
 * marches with nobody, and hands back an empty list.
 *
 * Leaving a guard at home is the oldest idea in war and it costs one
 * line. An army that all goes at once wins the battle at your refinery
 * and comes home to a wreck.
 *
 * `slice` cuts the front off a list and hands back the rest.
 * `force.slice(1)` is everybody except the first one. You met it in
 * project 20, where it took the first cell off a route.
 *
 * Careful with a short list. `slice` on a list of one hands back an
 * empty list, which is right, so this needs no `if` for that at all.
 *
 * Gentle hint: build the force with a loop and a `continue`, the same
 *   way as job 1, then hand back a `slice` of it.
 * Stronger hint: `if (unit.side !== side || unit.kind !== 'tank') continue;`
 *   is the skip, and `return force.slice(GUARDS);` is the last line.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The first wave rolls. Every enemy tank but one drives
 * out of its corner, finds a route round the rock with project 20's
 * pathfinder, and comes at your refinery. The one left behind circles
 * its own. You have a war on, and the game still cannot end.
 */
export function attackOrders(units: Unit[], side: Side): Unit[] {
  // TODO: every living tank on `side`, except the first GUARDS of them.
}

/**
 * 8. Write a test first. See commander.test.ts.
 */

/**
 * 9. Has anybody won yet?
 *
 * Write its test first. See commander.test.ts.
 *
 * This is the last function in the repository, and it is four lines.
 *
 * A side is finished when its refinery is gone. Count the refineries
 * each side has left with `countKind` from job 1, and then:
 *
 *     yours standing and theirs gone        'blue'. You won
 *     theirs standing and yours gone        'red'. You lost
 *     anything else                         `null`. Play on
 *
 * `null` is the answer almost every frame, and it is the answer at the
 * start, when both refineries stand. It is also the answer if both go
 * at once, which is a draw and rare enough to be a surprise. The page
 * shows all three.
 *
 * Question order matters here too, though it is gentler than project
 * 23's. Ask "is theirs gone?" on its own, without asking whether yours
 * still stands, and a fight that wrecks both refineries in the same
 * second says you won.
 *
 * Gentle hint: two counts in two variables, then two `if`s, then
 *   `return null;`
 * Stronger hint: `if (blue > 0 && red === 0) return 'blue';` is the
 *   first `if`, and the second is that line with the sides swapped.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Now the game is a game. Send everything you have at
 * the enemy refinery and a banner comes down over the map when it
 * falls. Lose yours and the same banner says so.
 *
 * That is the last stub in this project, and the last one in the list.
 * Twenty-four projects, and the thing you have built is a strategy
 * game: a map, two armies, ore, a build queue, tanks that hunt, and a
 * way to win. Go and play it.
 */
export function whoWon(units: Unit[]): Side | null {
  // TODO: 'blue', 'red', or null while both refineries stand.
}


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the lines that go inside the seven functions in this file.

   The answers to the two tests are at the bottom of commander.test.ts.
   One file never gives away the other.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- countKind(units, side, kind) ---

     let count = 0;
     for (const unit of units) {
       if (unit.side !== side || unit.kind !== kind) continue;
       if (wrecked(unit)) continue;
       count += 1;
     }
     return count;


   --- armyStrength(units, side) ---

     let total = 0;
     for (const unit of units) {
       if (unit.side !== side || unit.kind !== 'tank') continue;
       total += unit.health;
     }
     return total;

   A wreck is on 0 health, so it adds nothing and needs no `if` of its
   own here.


   --- wantNext(yard, units, side) ---

     for (const line of RED_PLAN) {
       if (howMany(yard, units, side, line.key) < line.upTo) return line.key;
     }
     return null;


   --- spendStep(yard, refinery, units, side) ---

     const key = wantNext(yard, units, side);
     if (key === null) return null;
     if (canBuild(yard, key, refinery.credits) !== 'ok') return null;

     startBuild(yard, key, refinery);
     return key;


   --- wantsAttack(units, side) ---

     if (countKind(units, side, 'tank') < ATTACK_TANKS) return false;
     return armyStrength(units, side) >= armyStrength(units, foeOf(side)) * ATTACK_EDGE;


   --- attackOrders(units, side) ---

     const force: Unit[] = [];
     for (const unit of units) {
       if (unit.side !== side || unit.kind !== 'tank') continue;
       if (wrecked(unit)) continue;
       force.push(unit);
     }
     return force.slice(GUARDS);


   --- whoWon(units) ---

     const blue = countKind(units, 'blue', 'base');
     const red = countKind(units, 'red', 'base');

     if (blue > 0 && red === 0) return 'blue';
     if (red > 0 && blue === 0) return 'red';
     return null;

   --------------------------------------------------------------------- */
