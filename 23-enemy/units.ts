/* =====================================================================
   units.ts. File 5 of 8.

   One job: the things that drive about. It is finished.

   It is project 22's units.ts, with the ore taken out and the fight
   put in. Picking, the drag box, orders and driving have not changed a
   line since project 19.

   What is new is five fields on a tank. Every one of them is something
   the functions you write this time will read or change:

       side      'blue', which is yours, or 'red', which is not
       turret    which way the gun points
       health    how much damage it has left in it
       reload    seconds until it can fire again
       mode      what it is doing, from your `nextMode`

   and two more that only a red tank uses, for the beat it walks:

       beat      the ring of cells it patrols, in order
       beatAt    which of them it is heading for now

   Like `enemy.ts`, this file never draws anything.
   ===================================================================== */

import { MAX_HEALTH, SPACING, TANK_REACH, TANK_SPEED } from './numbers.ts';
import { middleOf, speedAt } from './map.ts';
import type { Cell, GameMap } from './map.ts';


/* --- The shapes --- */

/* The two sides. Yours is blue. */
export type Side = 'blue' | 'red';

/* What a tank is doing. Only these four words are allowed, and your
   `nextMode` is what picks one.

       'dead'         it is wrecked. It does nothing ever again
       'attacking'    somebody is close enough to shoot at
       'chasing'      somebody has been spotted, but is still too far
       'patrolling'   nobody in sight

   Every tank on the map is asked this question, both sides. What the
   page does with the answer is where the sides differ. A red tank
   drives itself at whatever it is chasing. A blue tank only ever goes
   where you sent it, so the page reads its mode and drives it
   nowhere. Both sides shoot. */
export type Mode = 'dead' | 'attacking' | 'chasing' | 'patrolling';

/* One tank on the map. */
export type Unit = {
  name: string;          // what the page calls it, like 'Able'
  side: Side;            // 'blue' or 'red'
  x: number;             // where its middle is, in pixels across the map
  y: number;             // and in pixels down the map
  angle: number;         // which way the hull faces. 0 is to the right
  turret: number;        // which way the gun points. 0 is to the right
  selected: boolean;     // is it picked right now?
  moving: boolean;       // does it have somewhere to go?
  goalX: number;         // where it is going, when `moving` is true
  goalY: number;
  route: Cell[];         // the cells still to drive through, nearest first
  health: number;        // MAX_HEALTH when it is fresh, 0 when it is wrecked
  reload: number;        // seconds until the gun is ready again. 0 means ready
  mode: Mode;            // what your `nextMode` last said about it
  target: Unit | null;   // who your `nearestTarget` last picked for it
  post: Cell;            // the cell it guards. A blue tank never leaves its own alone
  beat: Cell[];          // the ring of cells a red tank walks round, in order
  beatAt: number;        // which cell of `beat` it is heading for now
};

/* The turret is the angle itself here, not a turn away from the hull.

   Project 16 kept `tank.turret` as the turn from the hull, so the gun
   pointed along `tank.angle + tank.turret`. A turret that tracks a
   target does not care which way the hull ended up facing, so this
   time the number is the angle on the map, and the hull is ignored. */

export function makeUnit(side: Side, name: string, x: number, y: number, post: Cell): Unit {
  return {
    name: name, side: side, x: x, y: y, angle: 0, turret: 0,
    selected: false, moving: false, goalX: x, goalY: y, route: [],
    health: MAX_HEALTH, reload: 0, mode: 'patrolling', target: null,
    post: post, beat: [], beatAt: 0
  };
}

/* The box you drag with the mouse. The same as projects 19 to 22. */
export type Box = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/* What happened when a unit tried to drive. */
export type Drive = 'still' | 'driving' | 'arrived';

export function parkingSpot(index: number, count: number): { across: number; down: number } {
  const perRow = Math.ceil(Math.sqrt(count));
  const rowCount = Math.ceil(count / perRow);
  const col = index % perRow;
  const row = Math.floor(index / perRow);
  return {
    across: (col - (perRow - 1) / 2) * SPACING,
    down: (row - (rowCount - 1) / 2) * SPACING
  };
}

/* Every tank on the other side. The page hands this list to your
   `nearestTarget`, so that function never has to ask which side
   anybody is on. */
export function otherSide(units: Unit[], side: Side): Unit[] {
  const others: Unit[] = [];
  for (const unit of units) {
    if (unit.side !== side) others.push(unit);
  }
  return others;
}


/* --- Picking, from project 19. A wreck cannot be picked --- */

export function unitAt(units: Unit[], x: number, y: number): Unit | null {
  for (const unit of units) {
    if (unit.side !== 'blue' || unit.health <= 0) continue;
    const across = x - unit.x;
    const down = y - unit.y;
    const distance = Math.sqrt(across * across + down * down);
    if (distance < TANK_REACH) return unit;
  }
  return null;
}

export function selectOnly(units: Unit[], chosen: Unit | null): number {
  for (const unit of units) {
    unit.selected = false;
  }
  if (chosen !== null) {
    chosen.selected = true;
    return 1;
  }
  return 0;
}

export function selectedUnits(units: Unit[]): Unit[] {
  const picked: Unit[] = [];
  for (const unit of units) {
    if (unit.selected) picked.push(unit);
  }
  return picked;
}

export function boxFrom(fromX: number, fromY: number, toX: number, toY: number): Box {
  return {
    left: Math.min(fromX, toX),
    top: Math.min(fromY, toY),
    right: Math.max(fromX, toX),
    bottom: Math.max(fromY, toY)
  };
}

export function isInBox(box: Box, x: number, y: number): boolean {
  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
}

export function selectInBox(units: Unit[], box: Box): number {
  selectOnly(units, null);
  let count = 0;
  for (const unit of units) {
    if (unit.side !== 'blue' || unit.health <= 0) continue;
    if (isInBox(box, unit.x, unit.y)) {
      unit.selected = true;
      count += 1;
    }
  }
  return count;
}


/* --- Orders and driving, from projects 19 and 20 --- */

/* Send every picked unit to a spot, each one to its own parking place.
   game.ts gives each one its route straight after. */
export function orderMove(units: Unit[], x: number, y: number): number {
  const picked = selectedUnits(units);
  for (let i = 0; i < picked.length; i += 1) {
    const park = parkingSpot(i, picked.length);
    picked[i].goalX = x + park.across;
    picked[i].goalY = y + park.down;
    picked[i].moving = true;
    picked[i].route = [];
  }
  return picked.length;
}

/* Send one unit to the middle of one cell, along a route. */
export function sendTo(unit: Unit, cell: Cell, route: Cell[]): void {
  const middle = middleOf(cell);
  unit.goalX = middle.x;
  unit.goalY = middle.y;
  unit.moving = true;
  unit.route = route;
}

/* Stop where you are. A wrecked tank is stopped this way, and so is a
   red tank the moment it gets close enough to shoot. */
export function halt(unit: Unit): void {
  unit.moving = false;
  unit.route = [];
  unit.goalX = unit.x;
  unit.goalY = unit.y;
}

/* Move a unit a little way along its route. Project 20's `driveTank`,
   with nothing changed but the name. */
export function driveUnit(unit: Unit, map: GameMap, seconds: number): Drive {
  if (!unit.moving) return 'still';

  let aimX = unit.goalX;
  let aimY = unit.goalY;
  if (unit.route.length > 0) {
    const middle = middleOf(unit.route[0]);
    aimX = middle.x;
    aimY = middle.y;
  }

  const across = aimX - unit.x;
  const down = aimY - unit.y;
  const distance = Math.sqrt(across * across + down * down);
  const step = TANK_SPEED * speedAt(map, unit.x, unit.y) * seconds;

  if (distance > step) {
    unit.x += across / distance * step;
    unit.y += down / distance * step;
    unit.angle = Math.atan2(down, across);
    return 'driving';
  }

  unit.x = aimX;
  unit.y = aimY;
  if (distance > 0) unit.angle = Math.atan2(down, across);
  if (unit.route.length > 0) {
    unit.route.shift();
    return 'driving';
  }
  unit.moving = false;
  return 'arrived';
}
