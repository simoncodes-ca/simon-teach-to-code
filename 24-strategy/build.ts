/* =====================================================================
   build.ts. File 8 of 12.

   One job: a build yard. It is finished.

   It is project 22, copied from that project's answer key. What a yard
   is allowed to buy, what it costs, what is in its queue, how far along
   the front one is, and what rolls out when it is done.

   Nothing in it changed, and there are two yards using it now. Yours
   is worked by the buttons on the Build card. The enemy's is worked by
   the file you write, commander.ts, and neither yard knows about the
   other.

   `canBuild` is worth reading again before you start. Your `spendStep`
   asks it one question and obeys the answer, so the six words it hands
   back are the whole of what the commander is allowed to do.
   ===================================================================== */

import { QUEUE_MAX } from './numbers.ts';
import { CATALOGUE } from './catalogue.ts';
import type { ItemKey } from './catalogue.ts';
import type { Refinery } from './ore.ts';


/* --- The shapes --- */

/* One thing being built. It knows what it is, how many seconds it needs
   altogether, and how many seconds of work it has had so far. */
export type Job = {
  key: ItemKey;        // which line of the catalogue it is
  seconds: number;     // how long it takes altogether
  done: number;        // how many of those seconds are behind it
};

/* One yard. Two lists, and that is the whole of it. */
export type Yard = {
  built: string[];     // the keys of the buildings that exist
  queue: Job[];        // what is waiting, front first
};

/* Why a button is grey, or 'ok' when it is not grey at all.

       'ok'         it may be built now
       'built'      it is a building, and there is one already
       'ordered'    it is a building, and one is in the queue right now
       'locked'     the thing it needs does not exist yet
       'too dear'   the refinery cannot afford it
       'busy'       the queue is full                                    */
export type Verdict = 'ok' | 'built' | 'ordered' | 'locked' | 'too dear' | 'busy';

/* An empty yard. Nothing built, nothing queued. */
export function makeYard(): Yard {
  return { built: [], queue: [] };
}


/* --- Project 22's seven functions --- */

/* Is this thing in the queue right now? */
export function queued(yard: Yard, key: string): boolean {
  for (const job of yard.queue) {
    if (job.key === key) return true;
  }
  return false;
}

/* Have we built this already? */
export function isBuilt(yard: Yard, key: string): boolean {
  return yard.built.includes(key);
}

/* Is the thing it needs built yet? */
export function needsMet(yard: Yard, key: ItemKey): boolean {
  const item = CATALOGUE[key];
  if (item.needs === null) return true;
  return isBuilt(yard, item.needs);
}

/* May we build it, and if not, why not? Five questions in one order,
   and the order is why the answer is never a lie. */
export function canBuild(yard: Yard, key: ItemKey, credits: number): Verdict {
  const item = CATALOGUE[key];

  if (item.kind === 'building' && isBuilt(yard, key)) return 'built';
  if (item.kind === 'building' && queued(yard, key)) return 'ordered';
  if (!needsMet(yard, key)) return 'locked';
  if (credits < item.cost) return 'too dear';
  if (yard.queue.length >= QUEUE_MAX) return 'busy';
  return 'ok';
}

/* Pay for it, and put it on the back of the queue. The only place
   credits ever leave a refinery. */
export function startBuild(yard: Yard, key: ItemKey, refinery: Refinery): boolean {
  if (canBuild(yard, key, refinery.credits) !== 'ok') return false;
  const item = CATALOGUE[key];
  refinery.credits -= item.cost;
  yard.queue.push({ key: key, seconds: item.seconds, done: 0 });
  return true;
}

/* Build the front one for a little while. */
export function buildStep(yard: Yard, seconds: number): number {
  if (yard.queue.length === 0) return 0;
  const job = yard.queue[0];
  const moved = Math.min(seconds, job.seconds - job.done);
  job.done += moved;
  return moved;
}

/* How long until the queue is empty? */
export function waitTime(yard: Yard): number {
  let total = 0;
  for (const job of yard.queue) {
    total += job.seconds - job.done;
  }
  return total;
}

/* Hand over the front one, once it is done. A building goes into
   `built` on its way out, so the next padlock comes off. */
export function takeFinished(yard: Yard): ItemKey | null {
  if (yard.queue.length === 0) return null;
  const job = yard.queue[0];
  if (job.done < job.seconds) return null;

  yard.queue.shift();
  if (CATALOGUE[job.key].kind === 'building') yard.built.push(job.key);
  return job.key;
}
