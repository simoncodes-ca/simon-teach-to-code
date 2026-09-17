/* =====================================================================
   units.ts. File 5 of 10.

   One job: the things that drive about. It is finished.

   It is project 21's units.ts with one word changed and one field
   added. There are two kinds of unit on the map now, so the type is
   called `Unit` instead of `Harvester`, and every unit says which kind
   it is:

       kind   'harvester', which digs ore, or 'tank', which does not

   A tank drives exactly as a harvester drives. You can pick it, drag a
   box round it and send it somewhere. It has nothing to shoot at, and
   nothing to dig. Giving it something to do is project 23.

   Picking and driving work exactly as they did in projects 19, 20 and
   21. Like ore.ts and build.ts, this file never draws anything.
   ===================================================================== */

import { SPACING, TANK_REACH, TANK_SPEED } from './numbers.ts';
import { middleOf, speedAt } from './map.ts';
import type { Cell, GameMap } from './map.ts';


/* --- The shapes --- */

/* The two kinds of unit the yard can turn out. */
export type UnitKind = 'harvester' | 'tank';

/* What a unit is doing. Only these seven words are allowed.

       'waiting'     nothing to do
       'to ore'      driving out to a patch
       'digging'     standing on a patch, filling up
       'home'        driving back to the refinery, full
       'unloading'   standing at the refinery, tipping its load in
       'no route'    it asked for a route and there was none
       'driving'     going where you sent it, and not to a job of its own

   Project 21's `nextJob` hands back one of the first six, and it is
   only ever asked about a harvester. A tank is 'waiting' or 'driving'. */
export type Job = 'waiting' | 'to ore' | 'digging' | 'home' | 'unloading' | 'no route' | 'driving';

/* One unit on the map. */
export type Unit = {
  name: string;          // what the page calls it, like 'Able'
  kind: UnitKind;        // 'harvester' or 'tank'
  x: number;             // where its middle is, in pixels across the map
  y: number;             // and in pixels down the map
  angle: number;         // which way it faces. 0 is to the right
  selected: boolean;     // is it picked right now?
  moving: boolean;       // does it have somewhere to go?
  goalX: number;         // where it is going, when `moving` is true
  goalY: number;
  route: Cell[];         // the cells still to drive through, nearest first
  load: number;          // ore it is carrying. A tank always carries 0
  job: Job;              // what it is doing
};

export function makeUnit(kind: UnitKind, name: string, x: number, y: number): Unit {
  return {
    name: name, kind: kind, x: x, y: y, angle: 0,
    selected: false, moving: false, goalX: x, goalY: y, route: [],
    load: 0, job: 'waiting'
  };
}

/* The box you drag with the mouse. The same as projects 19 to 21. */
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


/* --- Picking, from project 19 --- */

export function unitAt(units: Unit[], x: number, y: number): Unit | null {
  for (const unit of units) {
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
    if (isInBox(box, unit.x, unit.y)) {
      unit.selected = true;
      count += 1;
    }
  }
  return count;
}


/* --- Orders and driving, from projects 20 and 21 --- */

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
