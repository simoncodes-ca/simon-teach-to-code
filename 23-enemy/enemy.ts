/* =====================================================================
   enemy.ts. File 6 of 8.

   One job: the brain in a tank. How far away somebody is, who is worth
   shooting at, where to point the gun, when to pull the trigger, where
   to walk when nobody is about, and which of those four things a tank
   should be doing right now.

   This file never draws anything, the same as project 22's build.ts.
   Every function takes values and hands values back. The page draws the
   rings and the bars, and the tests check the sums.

   Your jobs, in this order. Two of them are tests, in enemy.test.ts:

       1. farApart      how far apart are two tanks?
       2. inRange       is one close enough to the other?
       3. nearestTarget who is the closest one worth shooting at?
       4. aimAt         point the gun at somebody
       5. a test        a shot takes exactly the damage it should
       6. shootStep     fire, if the gun is loaded and they are close
       7. nextPost      the next cell on a red tank's beat
       8. a test        the questions in nextMode, asked in order
       9. nextMode      what is this tank doing right now?

   Before you start, the checker shows 7 errors, one for each empty
   function. The count goes down as you fill them in.

   The red tanks sit still until job 7, and they do not come after you
   until job 9. Everything before that is the tank learning to look.

   Keep `npm test` running in a second terminal while you work.
   ===================================================================== */

import { GUN_RANGE, RELOAD, SEE_RANGE, SHOT_DAMAGE } from './numbers.ts';
import type { Cell } from './map.ts';
import type { Mode, Unit } from './units.ts';


/* ---------------------------------------------------------------------
   1. THE ONE THAT IS ALREADY WRITTEN

   Your functions ask this one a lot, so it is given.
   --------------------------------------------------------------------- */

/* Is this tank finished? Health never goes below 0, so 0 is the end.

   A wreck is still in the list of units. It stays on the map as a black
   hulk, because a battlefield does not tidy itself up. It just never
   drives, never shoots, and is never worth shooting at again. */
export function wrecked(unit: Unit): boolean {
  return unit.health <= 0;
}


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Seven functions and two tests. Each one has two hints next to it.
   The answers sit at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * 1. How far apart are two tanks?
 *
 * In pixels, in a straight line, ignoring everything in the way.
 *
 * This is the oldest sum in the repository. You wrote it in project 7
 * to tell whether a dart had hit a balloon, and again in project 19 to
 * tell whether you had clicked on a tank. Pythagoras: square the gap
 * across, square the gap down, add them, take the square root.
 *
 *     const across = b.x - a.x;
 *     const down = b.y - a.y;
 *
 * Which way round you take them does not matter here. A distance is
 * never negative, because squaring a negative number makes it positive.
 *
 * Gentle hint: three lines. The gap across, the gap down, then
 *   `Math.sqrt` of the two squares added together.
 * Stronger hint: `return Math.sqrt(across * across + down * down);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Pick one of your tanks. A faint line reaches from it
 * to every red tank on the map, with the distance written along it, and
 * the Nearest red well fills in. Drive about and watch the numbers move.
 * That is your ruler, and the next eight jobs are measured with it.
 */
export function farApart(a: Unit, b: Unit): number {
  // TODO: the straight-line distance between the two tanks, in pixels.
}

/**
 * 2. Is one tank close enough to the other?
 *
 * `reach` is how close counts. Hand back true when they are that close
 * or closer.
 *
 * One line, and it is the only function in this file that gets used for
 * two completely different questions:
 *
 *     inRange(me, you, SEE_RANGE)   have I spotted you?
 *     inRange(me, you, GUN_RANGE)   can I hit you?
 *
 * Both are in `numbers.ts`, and SEE_RANGE is the bigger of the two. A
 * tank can see much further than it can shoot. Keep that in your head,
 * because job 9 is built on it.
 *
 * Gentle hint: one line. Ask `farApart`, and compare its answer with
 *   `reach`.
 * Stronger hint: `return farApart(a, b) <= reach;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Every red tank grows two rings: a wide faint one for
 * how far it can see, and a tight bright one for how far it can shoot.
 * A ring lights up the moment one of your tanks is inside it. Drive
 * one in slowly and watch the outer ring wake up long before the inner
 * one does.
 */
export function inRange(a: Unit, b: Unit, reach: number): boolean {
  // TODO: true when `a` and `b` are `reach` pixels apart or less.
}

/**
 * 3. Who is the closest one worth shooting at?
 *
 * `foes` is every tank on the other side. The page works that list out
 * for you, so this function never has to ask whose side anybody is on.
 *
 * Walk the list, keep the closest one, and hand it back. An empty list,
 * or a list of nothing but wrecks, means `null`.
 *
 * **Skip the wrecks.** A burnt-out tank is still in the list, and a
 * tank that picks one as its target will sit and shoot at a wreck for
 * ever while a live enemy drives past behind it. The given `wrecked`
 * above answers that question.
 *
 * This is the same shape as `nearestOre` in project 21: a `best` that
 * starts as `null`, a `bestFar` beside it, and a `continue` for the
 * ones that do not count.
 *
 * Gentle hint: a `for ... of` over `foes`, a `continue` for the wrecks,
 *   and `farApart` for the rest. Keep the closest in a variable.
 * Stronger hint: `if (best === null || far < bestFar)` is the test
 *   inside the loop, and both variables change together when it is true.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. A thin red thread joins every tank to whoever it has
 * picked, and the Enemy card's Target column starts naming names. Both
 * sides do it, so your tanks pick targets too. Nobody has fired a shot
 * yet, and nobody is pointing the right way.
 */
export function nearestTarget(unit: Unit, foes: Unit[]): Unit | null {
  // TODO: the closest foe that is not wrecked, or null when there is none.
}

/**
 * 4. Point the gun at somebody.
 *
 * Turn the turret so it faces the target, and hand the angle back.
 *
 * `Math.atan2(down, across)` gives the angle from one point to another.
 * It is the same call that ends `driveUnit` in `units.ts`, where it
 * turns the hull to face the way the tank is going. The order of the
 * two numbers looks wrong and is not: `down` first, then `across`.
 *
 * Set `unit.turret` to that angle, and return it as well, so the page
 * can use the answer without reading the field.
 *
 * The turret is the angle itself here, not a turn away from the hull.
 * Project 16 did it the other way round, and `units.ts` says why.
 *
 * Gentle hint: three lines. The gap down, the gap across, then one
 *   `Math.atan2`. Store it on `unit.turret` before you return it.
 * Stronger hint: `unit.turret = Math.atan2(down, across);` then
 *   `return unit.turret;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Every turret on the map swings round and locks on.
 * Drive a tank in a circle round a red one and its gun follows you the
 * whole way. Still nobody has fired.
 */
export function aimAt(unit: Unit, target: Unit): number {
  // TODO: turn `unit.turret` to face the target, and hand that angle back.
}

/**
 * 5. Write a test first. See enemy.test.ts.
 */

/**
 * 6. Fire, if the gun is loaded and they are close enough.
 *
 * Write its test first. See enemy.test.ts.
 *
 * The page calls this on every frame, for every tank that has a target,
 * whether that target is near enough to hit or not. So this function
 * decides, and the page does not. Four steps:
 *
 *     a. Count `seconds` off the reload, and never let it go below 0
 *     b. Still reloading? Hand back false. Nothing else happens
 *     c. Out of GUN_RANGE? Hand back false
 *     d. Otherwise take SHOT_DAMAGE off the target's health, start the
 *          reload again at RELOAD, and hand back true
 *
 * Hand back true only on the frame a shot actually leaves the barrel.
 * That is what the page draws the flash and plays the bang from, so a
 * function that returns true every frame gives you a machine gun.
 *
 * Two numbers need holding down, and both are `Math.max` this time
 * rather than project 21's `Math.min`, because they are being stopped
 * from going *below* something:
 *
 *     the reload must not go below 0
 *     health must not go below 0
 *
 * A health of -3 would draw its bar off the wrong end of the track,
 * and `wrecked` would still say true, so nothing would look broken for
 * a while. Those are the bugs worth spending a `Math.max` on.
 *
 * Gentle hint: the reload line first, then two `if`s that hand back
 *   false, then the damage, then the reload again.
 * Stronger hint: `shooter.reload = Math.max(0, shooter.reload - seconds);`
 *   is the first line, and
 *   `target.health = Math.max(0, target.health - SHOT_DAMAGE);` is the
 *   one that does the harm.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The map turns into a battle. Anything close enough to
 * anything else starts firing, health bars crawl down, and the first
 * tank to reach zero becomes a black hulk and stops. Your four are
 * standing in a corner where nothing can reach them, so nothing happens
 * until you drive somebody out there. Drive one at a red tank and watch
 * who wins.
 */
export function shootStep(shooter: Unit, target: Unit, seconds: number): boolean {
  // TODO: tick the reload down, and fire when it is ready and the target is in GUN_RANGE.
}

/**
 * 7. The next cell on a red tank's beat.
 *
 * A red tank guards a post, and it walks a ring of cells round it for
 * ever. That ring is `unit.beat`, worked out from the map when the game
 * starts, and `unit.beatAt` says which of them it is heading for now.
 *
 * The page calls this when a red tank has arrived and needs somewhere
 * new to go. So: move `beatAt` on by one, and hand back the cell it now
 * points at.
 *
 * The catch is the end of the list. A beat of four cells has a `beatAt`
 * of 0, 1, 2, 3, and then it has to be 0 again, not 4. The remainder
 * operator `%` does exactly that, and it is why the ring never ends:
 *
 *     (3 + 1) % 4   is 0
 *
 * You have met `%` since project 4, where it dealt cards round a table.
 *
 * Gentle hint: two lines. Change `unit.beatAt` first, then hand back
 *   `unit.beat` at that place.
 * Stronger hint: `unit.beatAt = (unit.beatAt + 1) % unit.beat.length;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The three red tanks get up and start walking their
 * beats, round and round, one cell at a time, and the dotted ring on
 * the map shows the route each one is walking. They still take no
 * notice of you whatsoever. Drive right past one and it will not look
 * up. That is job 9.
 */
export function nextPost(unit: Unit): Cell {
  // TODO: move `beatAt` on by one, wrapping round with `%`, and hand back that cell.
}

/**
 * 8. Write a test first. See enemy.test.ts.
 */

/**
 * 9. What is this tank doing right now?
 *
 * Write its test first. See enemy.test.ts.
 *
 * This is the one the whole project has been building towards, and it
 * is five lines. Every tank on the map is asked this question sixty
 * times a second, and the word it hands back is what the page acts on.
 *
 * Ask five questions, and the first one that says yes wins:
 *
 *     a. Is it wrecked?                      'dead'
 *     b. Is there nobody to pick?            'patrolling'
 *     c. Is the target within GUN_RANGE?     'attacking'
 *     d. Is the target within SEE_RANGE?     'chasing'
 *     e. Otherwise                           'patrolling'
 *
 * Question b is `nearestTarget` handing back `null`. Keep that answer
 * in a variable, because questions c and d both want it.
 *
 * **The order of c and d is the hour that goes into this project.**
 *
 * GUN_RANGE is 130 and SEE_RANGE is 250. So anybody close enough to
 * shoot is also close enough to see — every single time, with no
 * exceptions. That means asking `chasing` before `attacking` is not a
 * near miss. It is a red tank that drives at you and never, ever fires,
 * because by the time it is close enough to shoot, the answer 'chasing'
 * has already won. Nothing crashes. The guns just never go off, and you
 * could stare at that for an hour.
 *
 * It is the same trap as project 22's `canBuild`, where asking about
 * the money before the padlock made a button tell lies, and the same
 * as project 21's `nextJob`. Three projects in a row, because it is the
 * mistake that costs the most and shows the least.
 *
 * Question a is worth a thought too. Ask it last and a burning wreck
 * goes on shooting from the grave.
 *
 * Gentle hint: five lines, in the order above. `nearestTarget` goes in
 *   a variable, and then it is two `inRange` calls with two different
 *   reaches.
 * Stronger hint: `if (inRange(unit, target, GUN_RANGE)) return 'attacking';`
 *   comes before the same line with `SEE_RANGE` and `'chasing'`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file, and then keep away from the keyboard for a minute.
 *
 * The three red tanks walk their beats until one of yours comes into
 * sight. Then it turns, works out a route round the rock with your
 * project 20 pathfinder, drives until it is close enough, stops, and
 * opens fire. Lose it and it goes back to its beat. Send four tanks at
 * one and you will win. Send one at three and you will not.
 *
 * Nobody wrote that. It is five lines of questions, asked over and over.
 */
export function nextMode(unit: Unit, foes: Unit[]): Mode {
  // TODO: 'dead', 'patrolling', 'attacking', 'chasing'. In that order.
}


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the lines that go inside the seven functions in this file.

   The answers to the two tests are at the bottom of enemy.test.ts. One
   file never gives away the other.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- farApart(a, b) ---

     const across = b.x - a.x;
     const down = b.y - a.y;
     return Math.sqrt(across * across + down * down);


   --- inRange(a, b, reach) ---

     return farApart(a, b) <= reach;


   --- nearestTarget(unit, foes) ---

     let best: Unit | null = null;
     let bestFar = 0;
     for (const foe of foes) {
       if (wrecked(foe)) continue;
       const far = farApart(unit, foe);
       if (best === null || far < bestFar) {
         best = foe;
         bestFar = far;
       }
     }
     return best;


   --- aimAt(unit, target) ---

     const across = target.x - unit.x;
     const down = target.y - unit.y;
     unit.turret = Math.atan2(down, across);
     return unit.turret;


   --- shootStep(shooter, target, seconds) ---

     shooter.reload = Math.max(0, shooter.reload - seconds);
     if (shooter.reload > 0) return false;
     if (!inRange(shooter, target, GUN_RANGE)) return false;

     target.health = Math.max(0, target.health - SHOT_DAMAGE);
     shooter.reload = RELOAD;
     return true;


   --- nextPost(unit) ---

     unit.beatAt = (unit.beatAt + 1) % unit.beat.length;
     return unit.beat[unit.beatAt];


   --- nextMode(unit, foes) ---

     if (wrecked(unit)) return 'dead';

     const target = nearestTarget(unit, foes);
     if (target === null) return 'patrolling';

     if (inRange(unit, target, GUN_RANGE)) return 'attacking';
     if (inRange(unit, target, SEE_RANGE)) return 'chasing';
     return 'patrolling';

   --------------------------------------------------------------------- */
