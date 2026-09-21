/* =====================================================================
   build.ts. File 8 of 10.

   One job: the build yard. What you are allowed to buy, what it costs,
   what is in the queue, how far along the front one is, and what rolls
   out when it is finished.

   This file never draws anything, the same as ore.ts and paths.ts.
   Every function takes values and hands values back. The page draws the
   buttons and the bars, and the tests check the sums.

   Your jobs, in this order. Two of them are tests, in build.test.ts:

       1. isBuilt      have we built this already?
       2. needsMet     is the thing it needs built yet?
       3. canBuild     may we build it, and if not, why not?
       4. a test       buying charges exactly the price
       5. startBuild   pay for it, and put it in the queue
       6. buildStep    build the front one for a little while
       7. waitTime     how long until the queue is empty?
       8. a test       the queue builds one at a time, in order
       9. takeFinished hand over the front one, once it is done

   Before you start, the checker shows 7 errors, one for each empty
   function. The count goes down as you fill them in.

   The harvesters already work. The credits climb on their own while
   you write this file, so there is always something to spend.

   Keep `npm test` running in a second terminal while you work.
   ===================================================================== */

import { QUEUE_MAX } from './numbers.ts';
import { CATALOGUE } from './catalogue.ts';
import type { ItemKey } from './catalogue.ts';
import type { Refinery } from './ore.ts';


/* ---------------------------------------------------------------------
   1. THE SHAPES

   These are finished.
   --------------------------------------------------------------------- */

/* One thing being built. It knows what it is, how many seconds it
   needs altogether, and how many seconds of work it has had so far.

   When `done` reaches `seconds` it is ready, and your `takeFinished`
   hands it over. */
export type Job = {
  key: ItemKey;        // which line of the catalogue it is
  seconds: number;     // how long it takes altogether
  done: number;        // how many of those seconds are behind it
};

/* The yard itself. Two lists, and that is the whole of it.

   `built` holds the key of every building finished so far, so the
   padlocks can come off. `queue` holds what is being built now, front
   first. The front one is the only one anybody works on. */
export type Yard = {
  built: string[];     // the keys of the buildings that exist
  queue: Job[];        // what is waiting, front first
};

/* Why a button is grey, or 'ok' when it is not grey at all. The page
   writes the word straight under the button.

       'ok'         you may build it now
       'built'      it is a building, and you have one already
       'ordered'    it is a building, and one is in the queue right now
       'locked'     the thing it needs does not exist yet
       'too dear'   you cannot afford it
       'busy'       the queue is full                                    */
export type Verdict = 'ok' | 'built' | 'ordered' | 'locked' | 'too dear' | 'busy';

/* An empty yard. Nothing built, nothing queued.

   You do not need to change it. */
export function makeYard(): Yard {
  return { built: [], queue: [] };
}

/* Is this thing in the queue right now? Buying a second power plant
   while the first one is still being built would be money thrown away,
   so `canBuild` asks this as well as `isBuilt`.

   You do not need to change it. */
export function queued(yard: Yard, key: string): boolean {
  for (const job of yard.queue) {
    if (job.key === key) return true;
  }
  return false;
}


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Seven functions and two tests. Each one has two hints next to it.
   The answers sit at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * 1. Have we built this already?
 *
 * `yard.built` is a list of keys, like `['power', 'barracks']`. Say
 * whether `key` is one of them.
 *
 * A list knows how to answer this in one word. You have used it on
 * arrays since project 3.
 *
 * Gentle hint: one line. Arrays have a method that hands back true or
 *   false for "is this in here?".
 * Stronger hint: `return yard.built.includes(key);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Nothing is built yet, so nothing changes on screen
 * until job 9 puts something in that list. The first test goes green,
 * and that is the point of writing the test first.
 */
export function isBuilt(yard: Yard, key: string): boolean {
  // TODO: is `key` in the yard's list of finished buildings?
}

/**
 * 2. Is the thing it needs built yet?
 *
 * Every line of the catalogue has a `needs` column. It holds the key of
 * the thing you must build first, or `null` when there is nothing to
 * wait for.
 *
 *     CATALOGUE.harvester.needs   is null. Build it whenever you like
 *     CATALOGUE.barracks.needs    is 'power'. Build a power plant first
 *
 * So: look the item up in the table. A `needs` of `null` means yes.
 * Otherwise ask `isBuilt` about it.
 *
 * `CATALOGUE[key]` reads one line of the table, the same way project 18
 * read `TERRAIN[key]`.
 *
 * Gentle hint: two lines. Get the item, then one `if` about `needs`
 *   before you ask `isBuilt`.
 * Stronger hint: `const item = CATALOGUE[key];` then
 *   `if (item.needs === null) return true;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Still nothing on screen. The next job is where every
 * button on the page wakes up at once.
 */
export function needsMet(yard: Yard, key: ItemKey): boolean {
  // TODO: true when this item needs nothing, or when what it needs is built.
}

/**
 * 3. May we build it, and if not, why not?
 *
 * This is the one the whole Build card is drawn from. Every button on
 * it asks this question about itself, sixty times a second, and then
 * greys itself out and prints the answer underneath.
 *
 * Nothing on the page decides anything. The page only shows what this
 * function said. That is what people mean by an interface driven by
 * state.
 *
 * Five things can be wrong, and then it is 'ok'. Ask them in this
 * order:
 *
 *     a. Is it a building we have already? 'built'
 *     b. Is it a building that is in the queue right now? 'ordered'.
 *          The given `queued` answers that one
 *     c. Is what it needs still missing? 'locked'
 *     d. Do we have fewer credits than it costs? 'too dear'
 *     e. Is the queue already `QUEUE_MAX` long? 'busy'
 *     f. Otherwise 'ok'
 *
 * Questions a and b are about buildings only. A unit is built over and
 * over, so one harvester on the map, or three in the queue, never stops
 * you ordering another.
 *
 * The order decides which reason the button gives, and a wrong order
 * tells lies. Ask d before c, and a barracks you cannot build yet says
 * "Too dear" when the real answer is that you have no power plant. Ask
 * d before a, and a finished power plant says "Too dear" instead of
 * "Built".
 *
 * Gentle hint: five `if`s in the order above, then `return 'ok';` at
 *   the end. It is the shape of project 21's `nextJob`.
 * Stronger hint: the first one is
 *   `if (item.kind === 'building' && isBuilt(yard, key)) return 'built';`
 *   and the second is the same line with `queued` and `'ordered'`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The whole Build card comes alive. Every button says
 * what it costs and how long it takes, the ones you cannot have go
 * grey with a reason under them, and the harvester's button lights up
 * the moment the credits reach 400. Clicking still does nothing.
 */
export function canBuild(yard: Yard, key: ItemKey, credits: number): Verdict {
  // TODO: 'built', 'ordered', 'locked', 'too dear', 'busy', or 'ok'. In that order.
}

/**
 * 4. Write a test first. See build.test.ts.
 */

/**
 * 5. Pay for it, and put it in the queue.
 *
 * Write its test first. See build.test.ts.
 *
 * Somebody clicked a button. Three things happen, in this order, and
 * only if they are allowed to happen at all:
 *
 *     a. Ask `canBuild`. Anything but 'ok' and you hand back `false`
 *          and change nothing. Not the credits, not the queue
 *     b. Take the price off `refinery.credits`
 *     c. Put a new job on the back of the queue, and hand back `true`
 *
 * A new job starts with no work done on it:
 *
 *     { key: key, seconds: item.seconds, done: 0 }
 *
 * `push` puts it on the back, which is what makes this a queue. The
 * back is where you join, and the front is where you are served. That
 * is the lift's queue from project 2, and the same words: "first in,
 * first out".
 *
 * Step a matters more than it looks. This function is the only place
 * credits ever leave the refinery, so a missing check is a way to buy
 * things you cannot afford.
 *
 * Gentle hint: four lines. The check, the item, the charge, the push.
 * Stronger hint: `if (canBuild(yard, key, refinery.credits) !== 'ok') return false;`
 *   then `refinery.credits -= item.cost;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Now click a button. The credits drop by exactly the
 * price, and a row appears in the Queue card. Its bar does not move
 * yet, because nobody is building it. That is job 6.
 */
export function startBuild(yard: Yard, key: ItemKey, refinery: Refinery): boolean {
  // TODO: if canBuild says 'ok', charge the credits and push a new job on the back.
}

/**
 * 6. Build the front one for a little while.
 *
 * The page calls this on every frame. `seconds` is how long the last
 * frame took, the same `seconds` as project 21's digging.
 *
 * The yard works on the front of the queue and nothing else. So:
 *
 *     an empty queue means there is nothing to do. Hand back 0
 *     otherwise add `seconds` to the front job's `done`
 *
 * It must never go past `seconds`, or a bar draws off the end of its
 * track and the countdown in job 7 goes backwards. That is the same
 * clamp as `takeOre` and `unloadStep` last project, and it is the same
 * `Math.min`.
 *
 * Hand back how much time you actually put in, so the page can tell a
 * working yard from a stopped one.
 *
 * Gentle hint: four lines. The empty check, the front job, the
 *   `Math.min`, then add it on and hand it back.
 * Stronger hint: `const job = yard.queue[0];` then
 *   `const moved = Math.min(seconds, job.seconds - job.done);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The front row's bar fills up, and stops full. Nothing
 * ever leaves the queue, so everything behind it waits for ever. Job 9
 * is what lets the queue move.
 */
export function buildStep(yard: Yard, seconds: number): number {
  // TODO: put up to `seconds` of work into the front job, and hand back how much.
}

/**
 * 7. How long until the queue is empty?
 *
 * Add up the time still left on every job in the queue, front to back.
 * One job with 18 seconds to go behind one with 3 is 21 seconds.
 *
 * Nobody is ever built at the same time as somebody else, which is why
 * this is a plain total and not something cleverer.
 *
 * An empty queue is 0 seconds.
 *
 * Gentle hint: a total that starts at 0, and a `for ... of` loop over
 *   `yard.queue`.
 * Stronger hint: `total += job.seconds - job.done;` is the line inside
 *   the loop.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The Queue card's Ready in number counts down while the
 * yard works, and jumps up every time you buy something else.
 */
export function waitTime(yard: Yard): number {
  // TODO: the seconds still left on the whole queue, added up.
}

/**
 * 8. Write a test first. See build.test.ts.
 */

/**
 * 9. Hand over the front one, once it is done.
 *
 * This is the last job, and it is the one that makes the queue move.
 * The page calls it every frame and does whatever comes back: a unit
 * rolls out of the yard onto the map, a building appears next to the
 * refinery, and the lamp on its card turns into a tick.
 *
 * Three answers, and two of them are `null`:
 *
 *     a. An empty queue? `null`. There is nothing to hand over
 *     b. The front job not finished yet? `null`. It is still being built
 *     c. Otherwise take it off the front and hand back its key
 *
 * "Finished" means `done` has reached `seconds`.
 *
 * Taking it off the front is `shift`, the other half of the queue. It
 * is `push` backwards, and it is what makes the second thing you
 * clicked start as soon as the first one leaves.
 *
 * One more thing before you hand the key back. A building has to go
 * into `yard.built`, or the padlock never comes off the next line of
 * the table and `isBuilt` goes on saying no for ever. A unit does not:
 * you can build as many as you like.
 *
 * Gentle hint: two `null` answers first, then `shift`, then the `if`
 *   about buildings, then hand back the key.
 * Stronger hint: `if (job.done < job.seconds) return null;` is the
 *   second answer, and
 *   `if (CATALOGUE[job.key].kind === 'building') yard.built.push(job.key);`
 *   is the line before the last one.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Now watch. A harvester rolls out of the yard and
 * drives straight off to the ore. A power plant lands beside the
 * refinery and the barracks stops being grey. The queue empties itself,
 * one thing at a time, and the whole yard runs without you.
 */
export function takeFinished(yard: Yard): ItemKey | null {
  // TODO: null while the front job is unfinished. Otherwise take it off and return its key.
}


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the lines that go inside the seven functions in this file.

   The answers to the two tests are at the bottom of build.test.ts. One
   file never gives away the other.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- isBuilt(yard, key) ---

     return yard.built.includes(key);


   --- needsMet(yard, key) ---

     const item = CATALOGUE[key];
     if (item.needs === null) return true;
     return isBuilt(yard, item.needs);


   --- canBuild(yard, key, credits) ---

     const item = CATALOGUE[key];

     if (item.kind === 'building' && isBuilt(yard, key)) return 'built';
     if (item.kind === 'building' && queued(yard, key)) return 'ordered';
     if (!needsMet(yard, key)) return 'locked';
     if (credits < item.cost) return 'too dear';
     if (yard.queue.length >= QUEUE_MAX) return 'busy';
     return 'ok';


   --- startBuild(yard, key, refinery) ---

     if (canBuild(yard, key, refinery.credits) !== 'ok') return false;
     const item = CATALOGUE[key];
     refinery.credits -= item.cost;
     yard.queue.push({ key: key, seconds: item.seconds, done: 0 });
     return true;


   --- buildStep(yard, seconds) ---

     if (yard.queue.length === 0) return 0;
     const job = yard.queue[0];
     const moved = Math.min(seconds, job.seconds - job.done);
     job.done += moved;
     return moved;


   --- waitTime(yard) ---

     let total = 0;
     for (const job of yard.queue) {
       total += job.seconds - job.done;
     }
     return total;


   --- takeFinished(yard) ---

     if (yard.queue.length === 0) return null;
     const job = yard.queue[0];
     if (job.done < job.seconds) return null;

     yard.queue.shift();
     if (CATALOGUE[job.key].kind === 'building') yard.built.push(job.key);
     return job.key;

   --------------------------------------------------------------------- */
