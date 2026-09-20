/* =====================================================================
   enemy.ts. File 9 of 12.

   One job: the brain in a tank. It is finished.

   It is project 23, copied from that project's answer key. How far
   apart two units are, who is worth shooting at, where to point the
   gun, when to fire, and which of four things a tank is doing.

   Two lines of `shootStep` ask the kind how hard it hits and how long
   it reloads, so infantry fire quicker and hit softer than a tank. That
   is the only change in the file besides `armed`.

   Two things are worth noticing, and neither one is a change to this
   file.

   `nearestTarget` walks a list of units and never asks what kind they
   are. So a tank now picks the closest of your harvesters, your tanks
   and your refinery, whichever it is. A refinery parked in a list of
   tanks turns out to be a target, and nobody had to say so.

   `nextMode` is still five lines. It is the brain of one tank. The file
   you write this time is the brain above it, and it has no idea which
   tank is which.
   ===================================================================== */

import { GUN_RANGE, SEE_RANGE } from './numbers.ts';
import { damageFor, reloadFor } from './units.ts';
import type { Mode, Unit } from './units.ts';


/* Is this unit finished? Health never goes below 0, so 0 is the end.

   A wreck stays on the map as a black hulk, because a battlefield does
   not tidy itself up. It never drives, never shoots, and is never worth
   shooting at again. */
export function wrecked(unit: Unit): boolean {
  return unit.health <= 0;
}

/* Can this kind of unit fire at all? A harvester carries ore and a
   refinery is a shed, so neither one ever shoots back. A tank and a
   rifleman both do. */
export function armed(unit: Unit): boolean {
  return unit.kind === 'tank' || unit.kind === 'infantry';
}


/* --- Project 23's seven functions --- */

/* How far apart are two units, in pixels, in a straight line? */
export function farApart(a: Unit, b: Unit): number {
  const across = b.x - a.x;
  const down = b.y - a.y;
  return Math.sqrt(across * across + down * down);
}

/* Is one close enough to the other? */
export function inRange(a: Unit, b: Unit, reach: number): boolean {
  return farApart(a, b) <= reach;
}

/* The closest foe that is not wrecked, or null when there is none. */
export function nearestTarget(unit: Unit, foes: Unit[]): Unit | null {
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
}

/* Point the gun at somebody, and hand that angle back. */
export function aimAt(unit: Unit, target: Unit): number {
  const across = target.x - unit.x;
  const down = target.y - unit.y;
  unit.turret = Math.atan2(down, across);
  return unit.turret;
}

/* Fire, if the gun is loaded and they are close enough. True only on
   the frame a shot actually leaves the barrel. */
export function shootStep(shooter: Unit, target: Unit, seconds: number): boolean {
  shooter.reload = Math.max(0, shooter.reload - seconds);
  if (shooter.reload > 0) return false;
  if (!inRange(shooter, target, GUN_RANGE)) return false;

  target.health = Math.max(0, target.health - damageFor(shooter.kind));
  shooter.reload = reloadFor(shooter.kind);
  return true;
}

/* The next cell on a guard's beat. */
export function nextPost(unit: Unit): Unit['post'] {
  unit.beatAt = (unit.beatAt + 1) % unit.beat.length;
  return unit.beat[unit.beatAt];
}

/* What is this tank doing right now? Five questions, in this order, and
   the order is the whole of project 23. */
export function nextMode(unit: Unit, foes: Unit[]): Mode {
  if (wrecked(unit)) return 'dead';

  const target = nearestTarget(unit, foes);
  if (target === null) return 'patrolling';

  if (inRange(unit, target, GUN_RANGE)) return 'attacking';
  if (inRange(unit, target, SEE_RANGE)) return 'chasing';
  return 'patrolling';
}
