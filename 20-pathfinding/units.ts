/* =====================================================================
   units.ts. File 5 of 7.

   One job: the tanks. It is finished.

   Most of it is your project 19, copied from its answer key: finding
   the tank under the mouse, picking, the drag box, and orders.

   One thing changed. A tank now carries a route, and `driveTank`
   follows it one cell at a time instead of driving in a straight line.
   So a tank never meets the water, as long as its route goes round it.

   Like paths.ts, this file never draws anything.
   ===================================================================== */

import { SPACING, TANK_REACH, TANK_SPEED } from './numbers.ts';
import { middleOf, speedAt } from './map.ts';
import type { Cell, GameMap } from './map.ts';


/* --- The shapes --- */

/* One tank. The same as project 19, with a route added. */
export type Tank = {
  name: string;          // what the page calls it, like 'Able'
  x: number;             // where its middle is, in pixels across the map
  y: number;             // and in pixels down the map
  angle: number;         // which way it faces. 0 is to the right
  selected: boolean;     // is it picked right now?
  moving: boolean;       // does it have somewhere to go?
  goalX: number;         // where it is going, when `moving` is true
  goalY: number;
  route: Cell[];         // the cells still to drive through, nearest first
};

export function makeTank(name: string, x: number, y: number): Tank {
  return { name: name, x: x, y: y, angle: 0, selected: false, moving: false, goalX: x, goalY: y, route: [] };
}

/* The box you drag with the mouse. The same as project 19. */
export type Box = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/* What happened when a tank tried to drive. 'blocked' from project 19
   is gone, because a route never runs into water or rock. */
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


/* --- Your functions from project 19 --- */

export function tankAt(tanks: Tank[], x: number, y: number): Tank | null {
  for (const tank of tanks) {
    const across = x - tank.x;
    const down = y - tank.y;
    const distance = Math.sqrt(across * across + down * down);
    if (distance < TANK_REACH) return tank;
  }
  return null;
}

export function selectOnly(tanks: Tank[], chosen: Tank | null): number {
  for (const tank of tanks) {
    tank.selected = false;
  }
  if (chosen !== null) {
    chosen.selected = true;
    return 1;
  }
  return 0;
}

export function selectedTanks(tanks: Tank[]): Tank[] {
  const picked: Tank[] = [];
  for (const tank of tanks) {
    if (tank.selected) picked.push(tank);
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

export function selectInBox(tanks: Tank[], box: Box): number {
  selectOnly(tanks, null);
  let count = 0;
  for (const tank of tanks) {
    if (isInBox(box, tank.x, tank.y)) {
      tank.selected = true;
      count += 1;
    }
  }
  return count;
}

/* Project 19's `orderMove`, with one line added: an order throws away
   the old route. game.ts gives each tank its new route straight after. */
export function orderMove(tanks: Tank[], x: number, y: number): number {
  const picked = selectedTanks(tanks);
  for (let i = 0; i < picked.length; i += 1) {
    const park = parkingSpot(i, picked.length);
    picked[i].goalX = x + park.across;
    picked[i].goalY = y + park.down;
    picked[i].moving = true;
    picked[i].route = [];
  }
  return picked.length;
}


/* --- Changed here: driving along a route --- */

/* Move a tank a little way along its route.

   The tank drives at the middle of the first cell in its route. When
   it gets there, that cell comes off the front of the route, and it
   drives at the next one. When the route is empty, it drives the last
   little way to its goal.

   Everything else is project 19's `driveTank`: speed times the
   terrain's speed times the seconds, and the check for "closer than
   one step". */
export function driveTank(tank: Tank, map: GameMap, seconds: number): Drive {
  if (!tank.moving) return 'still';

  let aimX = tank.goalX;
  let aimY = tank.goalY;
  if (tank.route.length > 0) {
    const middle = middleOf(tank.route[0]);
    aimX = middle.x;
    aimY = middle.y;
  }

  const across = aimX - tank.x;
  const down = aimY - tank.y;
  const distance = Math.sqrt(across * across + down * down);
  const step = TANK_SPEED * speedAt(map, tank.x, tank.y) * seconds;

  if (distance > step) {
    tank.x += across / distance * step;
    tank.y += down / distance * step;
    tank.angle = Math.atan2(down, across);
    return 'driving';
  }

  tank.x = aimX;
  tank.y = aimY;
  if (distance > 0) tank.angle = Math.atan2(down, across);
  if (tank.route.length > 0) {
    tank.route.shift();
    return 'driving';
  }
  tank.moving = false;
  return 'arrived';
}
