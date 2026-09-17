/* =====================================================================
   units.ts. File 5 of 8.

   One job: the harvesters. It is finished.

   It is project 20's units.ts, copied from that project's answer key.
   The tanks have a new name and two new things they remember:

       load   how much ore the harvester is carrying now
       job    what it is doing: waiting, digging, driving, unloading

   Nothing in this file changes either one. Picking and driving work
   exactly as they did in project 20. ore.ts is where the jobs are
   decided, and that file is yours.

   Like ore.ts, this file never draws anything.
   ===================================================================== */

import { SPACING, TANK_REACH, TANK_SPEED } from './numbers.ts';
import { middleOf, speedAt } from './map.ts';
import type { Cell, GameMap } from './map.ts';


/* --- The shapes --- */

/* What a harvester is doing. Only these seven words are allowed.

       'waiting'     nothing to do. No ore is left that it can reach
       'to ore'      driving out to a patch
       'digging'     standing on a patch, filling up
       'home'        driving back to the refinery, full
       'unloading'   standing at the refinery, tipping its load in
       'no route'    it asked for a route and there was none
       'driving'     going where you sent it, and not to a job of its own

   Your `nextJob` hands back one of the first six. 'driving' is the page's
   own word, for a harvester you ordered somewhere yourself. */
export type Job = 'waiting' | 'to ore' | 'digging' | 'home' | 'unloading' | 'no route' | 'driving';

/* One harvester. Project 20's tank, with `load` and `job` added. */
export type Harvester = {
  name: string;          // what the page calls it, like 'Able'
  x: number;             // where its middle is, in pixels across the map
  y: number;             // and in pixels down the map
  angle: number;         // which way it faces. 0 is to the right
  selected: boolean;     // is it picked right now?
  moving: boolean;       // does it have somewhere to go?
  goalX: number;         // where it is going, when `moving` is true
  goalY: number;
  route: Cell[];         // the cells still to drive through, nearest first
  load: number;          // how much ore it is carrying, from 0 up to CAPACITY
  job: Job;              // what it is doing
};

export function makeHarvester(name: string, x: number, y: number): Harvester {
  return {
    name: name, x: x, y: y, angle: 0,
    selected: false, moving: false, goalX: x, goalY: y, route: [],
    load: 0, job: 'waiting'
  };
}

/* The box you drag with the mouse. The same as project 20. */
export type Box = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/* What happened when a harvester tried to drive. */
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

export function harvesterAt(harvesters: Harvester[], x: number, y: number): Harvester | null {
  for (const harvester of harvesters) {
    const across = x - harvester.x;
    const down = y - harvester.y;
    const distance = Math.sqrt(across * across + down * down);
    if (distance < TANK_REACH) return harvester;
  }
  return null;
}

export function selectOnly(harvesters: Harvester[], chosen: Harvester | null): number {
  for (const harvester of harvesters) {
    harvester.selected = false;
  }
  if (chosen !== null) {
    chosen.selected = true;
    return 1;
  }
  return 0;
}

export function selectedHarvesters(harvesters: Harvester[]): Harvester[] {
  const picked: Harvester[] = [];
  for (const harvester of harvesters) {
    if (harvester.selected) picked.push(harvester);
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

export function selectInBox(harvesters: Harvester[], box: Box): number {
  selectOnly(harvesters, null);
  let count = 0;
  for (const harvester of harvesters) {
    if (isInBox(box, harvester.x, harvester.y)) {
      harvester.selected = true;
      count += 1;
    }
  }
  return count;
}


/* --- Orders and driving, from project 20 --- */

/* Send every picked harvester to a spot, each one to its own parking
   place. game.ts gives each one its route straight after. */
export function orderMove(harvesters: Harvester[], x: number, y: number): number {
  const picked = selectedHarvesters(harvesters);
  for (let i = 0; i < picked.length; i += 1) {
    const park = parkingSpot(i, picked.length);
    picked[i].goalX = x + park.across;
    picked[i].goalY = y + park.down;
    picked[i].moving = true;
    picked[i].route = [];
  }
  return picked.length;
}

/* Send one harvester to the middle of one cell, along a route. This is
   how the page sends a harvester to a patch or to the refinery. */
export function sendTo(harvester: Harvester, cell: Cell, route: Cell[]): void {
  const middle = middleOf(cell);
  harvester.goalX = middle.x;
  harvester.goalY = middle.y;
  harvester.moving = true;
  harvester.route = route;
}

/* Move a harvester a little way along its route. Project 20's
   `driveTank`, with nothing changed but the name. */
export function driveHarvester(harvester: Harvester, map: GameMap, seconds: number): Drive {
  if (!harvester.moving) return 'still';

  let aimX = harvester.goalX;
  let aimY = harvester.goalY;
  if (harvester.route.length > 0) {
    const middle = middleOf(harvester.route[0]);
    aimX = middle.x;
    aimY = middle.y;
  }

  const across = aimX - harvester.x;
  const down = aimY - harvester.y;
  const distance = Math.sqrt(across * across + down * down);
  const step = TANK_SPEED * speedAt(map, harvester.x, harvester.y) * seconds;

  if (distance > step) {
    harvester.x += across / distance * step;
    harvester.y += down / distance * step;
    harvester.angle = Math.atan2(down, across);
    return 'driving';
  }

  harvester.x = aimX;
  harvester.y = aimY;
  if (distance > 0) harvester.angle = Math.atan2(down, across);
  if (harvester.route.length > 0) {
    harvester.route.shift();
    return 'driving';
  }
  harvester.moving = false;
  return 'arrived';
}
