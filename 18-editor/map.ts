/* =====================================================================
   map.ts. File 3 of 5.

   One job: the map itself. Making one, painting on it, counting it,
   and turning it into text and back again.

   This file never draws anything. It does not know Phaser exists, or
   that there is a page at all. Every function takes values and hands
   values back. That is on purpose, and three different programs use
   this one file:

       the editor      draws what these functions hand back
       the server      checks every map it is sent with linesToMap
       the tests       check that these functions give the right answers

   Your jobs, in this order. Two of them are tests, in map.test.ts:

      1. makeMap        a brand new map, covered in grass
      2. isInside       is this cell on the map at all?
      3. a test         painting outside the map changes nothing
      4. paintCell      change the ground in one cell
      5. countTerrain   how many cells of one kind of ground
      6. mapToLines     the map as rows of letters, ready to save
      7. terrainFor     which kind of ground a letter stands for
      8. a test         linesToMap undoes mapToLines
      9. linesToMap     rows of letters back into a map

   Before you start, the checker shows 7 errors. There is one for each
   empty function below, because each one promises to hand something
   back and does not. The count goes down as you fill them in.

   Keep `npm test` running in a second terminal while you work. The
   tests go from red to green as your functions start working.
   ===================================================================== */

import { BLANK, TERRAIN, TERRAIN_KEYS } from './terrain.ts';
import type { TerrainKey } from './terrain.ts';


/* ---------------------------------------------------------------------
   1. THE SHAPE

   A map is one of these. It is finished.
   --------------------------------------------------------------------- */

export type GameMap = {
  name: string;               // what the map is called, like 'Sandy Island'
  cols: number;               // how many cells across
  rows: number;               // how many cells down
  cells: TerrainKey[][];      // the ground in every cell. cells[row][col]
};

/* Look at `cells`. It holds keys from the table, like 'grass' and
   'water'. It does not hold pictures, and it does not hold colours.

   That is the second idea of this project. The map is only data. The
   editor turns that data into pictures, and the saved-map panel turns
   the same data into letters. Neither of them is the map. */


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Seven functions and two tests. Each one has two hints next to it.
   The answers sit at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * 1. A brand new map, covered in grass.
 *
 * `cells` is a list of rows. Each row is a list of keys, one for each
 * cell in that row. For a map 3 cells across and 2 down it looks like
 * this:
 *
 *     [
 *       ['grass', 'grass', 'grass'],
 *       ['grass', 'grass', 'grass']
 *     ]
 *
 * You built a grid exactly like this for battleship, with one loop
 * inside another. Fill every cell with BLANK, which is 'grass'.
 *
 * Then hand back the whole map: its name, its size, and its cells.
 *
 * Gentle hint: an outer loop for the rows. Inside it, make a new empty
 *   row, fill it with an inner loop, then push the row onto `cells`.
 * Stronger hint: `const cells: TerrainKey[][] = [];` before the loops,
 *   and `return { name: name, cols: cols, rows: rows, cells: cells };`
 *   after them.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The window fills with grass, and the grid appears.
 */
export function makeMap(name: string, cols: number, rows: number): GameMap {
  // TODO: a list of rows, every cell BLANK, then hand back the map.
}

/**
 * 2. Is this cell on the map at all?
 *
 * The first column is 0, and so is the first row. So on a map 20 cells
 * across, the last column is 19. Column 20 is off the edge.
 *
 * Hand back `true` when the column and the row are both on the map.
 * Hand back `false` when either one is off it, on any side.
 *
 * Gentle hint: four things must all be true. Too far left, too far
 *   up, too far right and too far down are the four ways to be off.
 * Stronger hint: `col >= 0 && row >= 0 && ...` and then two more,
 *   using `map.cols` and `map.rows`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The panel called Under the pencil starts showing
 * which cell your mouse is over.
 */
export function isInside(map: GameMap, col: number, row: number): boolean {
  // TODO: true only when the column and the row are both on the map.
}

/**
 * 3. Write a test first. See map.test.ts.
 */

/**
 * 4. Change the ground in one cell.
 *
 * Write its test first. See map.test.ts.
 *
 * `terrain` is a key from the table, like 'water'. Put it in the cell
 * at `col` and `row`.
 *
 * Two times it must do nothing at all:
 *
 *     the cell is off the map, because there is no cell to change
 *     the cell already has that ground, because nothing would change
 *
 * Hand back `true` when you really changed the cell, and `false` when
 * you did nothing. The editor only plays the paint sound and counts a
 * change when you say `true`.
 *
 * Gentle hint: ask your `isInside` first. Then compare the cell with
 *   `terrain`. Only then change it.
 * Stronger hint: the change itself is `map.cells[row][col] = terrain;`
 *   Row first, then column.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Pick Water on the palette, then click and drag on the
 * map. You are painting.
 */
export function paintCell(map: GameMap, col: number, row: number, terrain: TerrainKey): boolean {
  // TODO: off the map or already that ground? false. Otherwise change it, and true.
}

/**
 * 5. How many cells have this kind of ground?
 *
 * Walk every cell of the map, and count the ones that match `terrain`.
 *
 * The palette calls this once for each button, and shows the number
 * on the button. A new map has 300 cells of grass and 0 of everything
 * else, because 20 times 15 is 300.
 *
 * Gentle hint: start a count at 0. One loop over the rows, one loop
 *   over the cells in each row.
 * Stronger hint: `for (const line of map.cells)` then
 *   `for (const cell of line)` inside it.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Every palette button shows how many cells it covers.
 */
export function countTerrain(map: GameMap, terrain: TerrainKey): number {
  // TODO: count the cells that hold this terrain.
}

/**
 * 6. The map as rows of letters.
 *
 * This is how a map is saved. Every kind of ground has a letter in the
 * table: grass is '.', water is '~', rock is '#'. So a map 3 across
 * and 2 down, with water in one corner, is saved as two strings:
 *
 *     [
 *       '~..',
 *       '...'
 *     ]
 *
 * You read maps like this in the cheese vault and in Tank Duel. This
 * time you write them.
 *
 * Look each letter up in the table. Never write '.' or '~' in this
 * function yourself. `TERRAIN[cell].letter` is the letter for a cell.
 *
 * Gentle hint: one string for each row. Start it as '', add one
 *   letter for each cell, then push it onto a list.
 * Stronger hint: `line += TERRAIN[cell].letter;` inside the inner loop.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. The Saved map panel shows your map as letters, and
 * the letters change while you paint.
 */
export function mapToLines(map: GameMap): string[] {
  // TODO: one string per row, one letter per cell, from the table.
}

/**
 * 7. Which kind of ground does this letter stand for?
 *
 * The other way round from `mapToLines`. Hand in '~', and get back
 * 'water'.
 *
 * The table knows. Walk through TERRAIN_KEYS, and hand back the key
 * whose letter matches.
 *
 * A letter that matches nothing hands back `null`. A saved map might
 * have a '?' in it, or a letter from a terrain somebody deleted. That
 * is not a kind of ground, and saying so is part of the answer.
 *
 * Gentle hint: a loop over TERRAIN_KEYS, an `if` inside it, and
 *   `return null;` after the loop ends.
 * Stronger hint: `if (TERRAIN[key].letter === letter) return key;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Press a letter key over the map, like ~ or #. The
 * palette picks the ground that letter stands for.
 */
export function terrainFor(letter: string): TerrainKey | null {
  // TODO: the key whose letter matches, or null.
}

/**
 * 8. Write a test first. See map.test.ts.
 */

/**
 * 9. Rows of letters, back into a map.
 *
 * Write its test first. See map.test.ts.
 *
 * This is how a map is loaded. It undoes `mapToLines`.
 *
 * The lines arrive from a file, or from another computer, so they
 * might be wrong. Project 15 said it: never trust what arrives. Hand
 * back `null` for any of these:
 *
 *     there are no lines at all
 *     one line is a different length from the first line
 *     one letter is not in the table
 *
 * Otherwise, build a map the size of the lines with your `makeMap`,
 * and put the right ground in every cell with your `terrainFor`.
 *
 * The map server uses this function too. It refuses to save a map
 * that this function says `null` to.
 *
 * Gentle hint: check for no lines first. Make the map. Then one loop
 *   for the rows and one for the letters, giving up as soon as
 *   anything is wrong.
 * Stronger hint: the map is `makeMap(name, lines[0].length,
 *   lines.length)`, and `lines[row][col]` is one letter.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save the file. Load a map from the Maps panel, and it appears. Save
 * your own, and the server keeps it.
 */
export function linesToMap(name: string, lines: string[]): GameMap | null {
  // TODO: null for anything wrong, otherwise a map built from the letters.
}


/* ---------------------------------------------------------------------
   3. THE ANSWER KEY

   These are the lines that go inside the seven functions in this file.

   The answers to the two tests are at the bottom of map.test.ts. One
   file never gives away the other.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- makeMap(name, cols, rows) ---

     const cells: TerrainKey[][] = [];
     for (let row = 0; row < rows; row += 1) {
       const line: TerrainKey[] = [];
       for (let col = 0; col < cols; col += 1) {
         line.push(BLANK);
       }
       cells.push(line);
     }
     return { name: name, cols: cols, rows: rows, cells: cells };


   --- isInside(map, col, row) ---

     return col >= 0 && row >= 0 && col < map.cols && row < map.rows;


   --- paintCell(map, col, row, terrain) ---

     if (!isInside(map, col, row)) return false;
     if (map.cells[row][col] === terrain) return false;
     map.cells[row][col] = terrain;
     return true;


   --- countTerrain(map, terrain) ---

     let count = 0;
     for (const line of map.cells) {
       for (const cell of line) {
         if (cell === terrain) count += 1;
       }
     }
     return count;


   --- mapToLines(map) ---

     const lines: string[] = [];
     for (const row of map.cells) {
       let line = '';
       for (const cell of row) {
         line += TERRAIN[cell].letter;
       }
       lines.push(line);
     }
     return lines;


   --- terrainFor(letter) ---

     for (const key of TERRAIN_KEYS) {
       if (TERRAIN[key].letter === letter) return key;
     }
     return null;


   --- linesToMap(name, lines) ---

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

   --------------------------------------------------------------------- */
