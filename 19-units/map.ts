/* =====================================================================
   map.ts. File 3 of 6.

   One job: the map. It is finished.

   The first four functions are yours already. You wrote them in
   project 18, and they are copied here from its answer key.

   The last three are new, and they are the ones the tanks use. They
   answer questions about a spot on the map in pixels, because a tank
   lives at a spot, not in a cell:

       groundAt     which kind of ground is at this spot?
       canDrive     may a tank be at this spot?
       speedAt      how fast does a tank drive at this spot?

   Like project 18's map.ts, this file never draws anything. It imports
   nothing but the table, so the page and the tests can both use it.
   ===================================================================== */

import { BLANK, TERRAIN, TERRAIN_KEYS } from './terrain.ts';
import type { TerrainKey } from './terrain.ts';
import { TILE } from './numbers.ts';


/* A map is one of these. The same shape as project 18. */
export type GameMap = {
  name: string;               // what the map is called, like 'Sandy Island'
  cols: number;               // how many cells across
  rows: number;               // how many cells down
  cells: TerrainKey[][];      // the ground in every cell. cells[row][col]
};


/* --- Your functions from project 18 --- */

export function makeMap(name: string, cols: number, rows: number): GameMap {
  const cells: TerrainKey[][] = [];
  for (let row = 0; row < rows; row += 1) {
    const line: TerrainKey[] = [];
    for (let col = 0; col < cols; col += 1) {
      line.push(BLANK);
    }
    cells.push(line);
  }
  return { name: name, cols: cols, rows: rows, cells: cells };
}

export function isInside(map: GameMap, col: number, row: number): boolean {
  return col >= 0 && row >= 0 && col < map.cols && row < map.rows;
}

export function terrainFor(letter: string): TerrainKey | null {
  for (const key of TERRAIN_KEYS) {
    if (TERRAIN[key].letter === letter) return key;
  }
  return null;
}

export function linesToMap(name: string, lines: string[]): GameMap | null {
  if (lines.length === 0) return null;
  const map = makeMap(name, lines[0].length, lines.length);
  for (let row = 0; row < lines.length; row += 1) {
    if (lines[row].length !== map.cols) return null;
    for (let col = 0; col < map.cols; col += 1) {
      const key = terrainFor(lines[row][col]);
      if (key === null) return null;
      map.cells[row][col] = key;
    }
  }
  return map;
}


/* --- New here: questions about a spot --- */

/* The ground at a spot on the map, in pixels. Off the edge of the map
   there is no ground at all, so it hands back `null`.

   The first two lines are project 11's `cellAt`: divide by the size of
   a cell, and round down. */
export function groundAt(map: GameMap, x: number, y: number): TerrainKey | null {
  const col = Math.floor(x / TILE);
  const row = Math.floor(y / TILE);
  if (!isInside(map, col, row)) return null;
  return map.cells[row][col];
}

/* May a tank be at this spot? Only on the map, and only on ground the
   table calls `walkable`. */
export function canDrive(map: GameMap, x: number, y: number): boolean {
  const ground = groundAt(map, x, y);
  return ground !== null && TERRAIN[ground].walkable;
}

/* How fast a tank drives at this spot. 1 is normal speed, and 0 means
   it cannot drive there at all. */
export function speedAt(map: GameMap, x: number, y: number): number {
  const ground = groundAt(map, x, y);
  return ground === null ? 0 : TERRAIN[ground].speed;
}
