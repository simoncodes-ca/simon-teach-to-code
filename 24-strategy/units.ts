/* =====================================================================
   units.ts. File 6 of 12.

   One job: the things on the map. It is finished.

   Every unit in the game is one of these, on both sides, and there are
   four kinds of them:

       'harvester'   digs ore and brings it home. Project 21
       'infantry'    cheap, quick, and shoots. Out of the barracks
       'tank'        drives, aims and fires. Projects 16 and 23
       'base'        a refinery. It never moves and it never shoots

   Infantry are a tank with four numbers changed, and the four little
   functions below hold all four: how fast it goes, how much punishment
   it takes, how hard it hits, and how long it waits between shots.
   Nothing else in the game asks whether a unit is infantry.

   A refinery in the list of units is the one new idea in this file, and
   it is worth a minute.

   A refinery is a building. It has no engine, no gun and nowhere to be
   except the cell it was put on. So making it the same shape of object
   as a tank looks wasteful, and it buys you the whole win condition for
   nothing. It sits in `units`, so project 23's `nearestTarget` finds
   it, project 23's `shootStep` damages it, and the health bars draw
   themselves. Not one line of either function changed.

   That is project 8's lesson, met for the last time. Every sprite is
   the same shape of object, so one set of functions moves all of them.
   Here a thing that never moves joins the same list, and every function
   that reads the list gets it for free.

   Picking, the drag box, orders and driving have not changed since
   project 19. Like every file so far except game.ts and rack.ts, this
   file never draws anything.
   ===================================================================== */

import {
  BASE_HEALTH, INFANTRY_DAMAGE, INFANTRY_HEALTH, INFANTRY_RELOAD, INFANTRY_SPEED,
  MAX_HEALTH, RELOAD, SHOT_DAMAGE, SPACING, TANK_REACH, TANK_SPEED
} from './numbers.ts';
import { middleOf, speedAt } from './map.ts';
import type { Cell, GameMap } from './map.ts';


/* --- The shapes --- */

/* The two sides. Yours is blue. */
export type Side = 'blue' | 'red';

/* The four kinds of unit. Only the first three are ever built, and
   those three are spelled exactly as catalogue.ts keys them, so what
   rolls out of a yard is named by the table and not here. */
export type UnitKind = 'harvester' | 'infantry' | 'tank' | 'base';

/* What a unit is doing about the ore. Project 21's seven words, and
   `nextJob` still hands back one of the first six.

       'waiting'     nothing to do
       'to ore'      driving out to a patch
       'digging'     standing on a patch, filling up
       'home'        driving back to the refinery, full
       'unloading'   standing at the refinery, tipping its load in
       'no route'    it asked for a route and there was none
       'driving'     going where it was sent, and not to a job of its own  */
export type Job = 'waiting' | 'to ore' | 'digging' | 'home' | 'unloading' | 'no route' | 'driving';

/* What a tank is doing about the fight. Project 23's four words, and
   project 23's `nextMode` still picks one.

       'dead'         it is wrecked. It does nothing ever again
       'attacking'    somebody is close enough to shoot at
       'chasing'      somebody has been spotted, but is still too far
       'patrolling'   nobody in sight                                    */
export type Mode = 'dead' | 'attacking' | 'chasing' | 'patrolling';

/* One unit on the map. It is the longest type in the repository,
   because this is the last project and everything is here at once.

   The comment beside each field says which project put it there. */
export type Unit = {
  name: string;          // what the page calls it, like 'Able'
  side: Side;            // 'blue', which is yours, or 'red', which is not
  kind: UnitKind;        // 'harvester', 'infantry', 'tank' or 'base'
  x: number;             // where its middle is, in pixels across the map
  y: number;             // and in pixels down the map
  angle: number;         // which way it faces. 0 is to the right
  turret: number;        // which way the gun points. 0 is to the right

  selected: boolean;     // is it picked right now?                    19
  moving: boolean;       // does it have somewhere to go?              19
  goalX: number;         // where it is going, when `moving` is true   19
  goalY: number;
  route: Cell[];         // the cells still to drive through           20

  load: number;          // ore it is carrying                         21
  job: Job;              // what it is doing about the ore             21

  health: number;        // damage it has left in it. 0 is wrecked     23
  reload: number;        // seconds until the gun is ready again       23
  mode: Mode;            // what `nextMode` last said about it         23
  target: Unit | null;   // who `nearestTarget` last picked for it      23
  post: Cell;            // the cell it guards                         23
  beat: Cell[];          // the ring of cells a guard walks round       23
  beatAt: number;        // which cell of `beat` it is heading for      23

  marching: boolean;     // has the commander sent it into battle?     24
};

/* The four numbers that tell one kind of unit from another.

   How much punishment it takes. A refinery takes nine times a tank,
   because wrecking one wins the game, and infantry take less than
   half of one. */
export function healthFor(kind: UnitKind): number {
  if (kind === 'base') return BASE_HEALTH;
  return kind === 'infantry' ? INFANTRY_HEALTH : MAX_HEALTH;
}

/* How fast it goes, in pixels a second on ground with a speed of 1. */
export function speedFor(kind: UnitKind): number {
  return kind === 'infantry' ? INFANTRY_SPEED : TANK_SPEED;
}

/* How much health one of its shots takes off. */
export function damageFor(kind: UnitKind): number {
  return kind === 'infantry' ? INFANTRY_DAMAGE : SHOT_DAMAGE;
}

/* How long it waits between two shots. */
export function reloadFor(kind: UnitKind): number {
  return kind === 'infantry' ? INFANTRY_RELOAD : RELOAD;
}

export function makeUnit(side: Side, kind: UnitKind, name: string, x: number, y: number, post: Cell): Unit {
  return {
    name: name, side: side, kind: kind, x: x, y: y, angle: 0, turret: 0,
    selected: false, moving: false, goalX: x, goalY: y, route: [],
    load: 0, job: 'waiting',
    health: healthFor(kind), reload: 0, mode: 'patrolling', target: null,
    post: post, beat: [], beatAt: 0,
    marching: false
  };
}

/* The box you drag with the mouse. The same as projects 19 to 23. */
export type Box = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/* What happened when a unit tried to drive. */
export type Drive = 'still' | 'driving' | 'arrived';

/* The other side. Blue's enemy is red, and red's enemy is blue. */
export function foeOf(side: Side): Side {
  return side === 'blue' ? 'red' : 'blue';
}

/* Every unit on the other side. The page hands this list to project
   23's `nearestTarget`, so that function never has to ask whose side
   anybody is on. */
export function otherSide(units: Unit[], side: Side): Unit[] {
  const others: Unit[] = [];
  for (const unit of units) {
    if (unit.side !== side) others.push(unit);
  }
  return others;
}

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


/* --- Picking, from project 19 ---

   A wreck cannot be picked, and neither can a refinery. Both of them
   would only ignore you. */

export function pickable(unit: Unit): boolean {
  return unit.side === 'blue' && unit.kind !== 'base' && unit.health > 0;
}

export function unitAt(units: Unit[], x: number, y: number): Unit | null {
  for (const unit of units) {
    if (!pickable(unit)) continue;
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
    if (!pickable(unit)) continue;
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

/* Send one unit to a spot that is not the middle of a cell, along a
   route. A wave of tanks parks round its target this way, so the
   tanks do not all drive at one pixel. */
export function sendToSpot(unit: Unit, x: number, y: number, route: Cell[]): void {
  unit.goalX = x;
  unit.goalY = y;
  unit.moving = true;
  unit.route = route;
}

/* Stop where you are. A wrecked unit is stopped this way, and so is a
   tank the moment it gets close enough to shoot. */
export function halt(unit: Unit): void {
  unit.moving = false;
  unit.route = [];
  unit.goalX = unit.x;
  unit.goalY = unit.y;
}

/* Move a unit a little way along its route. Project 20's `driveTank`,
   with the name changed and its speed taken from the kind, so infantry
   outrun tanks on the same ground. A refinery never has anywhere to
   go, so this hands back 'still' for one every time. */
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
  const step = speedFor(unit.kind) * speedAt(map, unit.x, unit.y) * seconds;

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
