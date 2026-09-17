/* =====================================================================
   map.ts. File 3 of 7.

   One job: the map. It is finished.

   Most of it is project 19's map.ts, copied line for line. Two things
   are new, because the search works in cells, and the tanks live at
   spots in pixels:

       Cell         one square of the map, named by its column and row
       cellAt       which cell is this spot in?
       middleOf     where is the middle of this cell, in pixels?

   Like project 19's map.ts, this file never draws anything. The page
   and the tests can both use it.
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

/* One cell of the map. `col` counts across from 0, and `row` counts
   down from 0. So the top left cell is { col: 0, row: 0 }. */
export type Cell = {
  col: number;
  row: number;
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


/* --- From project 19: questions about a spot --- */

/* The ground at a spot on the map, in pixels. Off the edge of the map
   there is no ground at all, so it hands back `null`. */
export function groundAt(map: GameMap, x: number, y: number): TerrainKey | null {
  const cell = cellAt(x, y);
  if (!isInside(map, cell.col, cell.row)) return null;
  return map.cells[cell.row][cell.col];
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


/* --- New here: cells and pixels --- */

/* The cell a spot is in. Project 11's `cellAt`: divide by the size of
   a cell, and round down. */
export function cellAt(x: number, y: number): Cell {
  return { col: Math.floor(x / TILE), row: Math.floor(y / TILE) };
}

/* The middle of a cell, in pixels. Project 11's `middleOf`. */
export function middleOf(cell: Cell): { x: number; y: number } {
  return { x: cell.col * TILE + TILE / 2, y: cell.row * TILE + TILE / 2 };
}

/* Are these two the same cell? Two objects are never `===` each other,
   even when everything inside them matches, so compare the numbers. */
export function sameCell(a: Cell, b: Cell): boolean {
  return a.col === b.col && a.row === b.row;
}
