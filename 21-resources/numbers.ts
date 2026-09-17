/* =====================================================================
   numbers.ts. File 1 of 8.

   Resources. The six tanks from project 20 have turned into
   harvesters. They drive out to the ore, dig until they are full,
   drive home to the refinery, and tip what they carry into it. The
   credits counter climbs while you watch.

   This file only remembers. It holds the sizes the page is built
   from, and the rates the harvesters work at.
   ===================================================================== */

export const TILE = 48;             // one cell of the map is this many pixels across
export const COLS = 20;             // how many cells fit across the map
export const ROWS = 15;             // and how many fit down it
export const WIDTH = COLS * TILE;   // so the window is 960 pixels wide
export const HEIGHT = ROWS * TILE;  // and 720 pixels tall

export const TANK_SPEED = 90;       // pixels a second, on ground with a speed of 1
export const TANK_REACH = 22;       // a click this close to a harvester's middle is a click on it
export const SPACING = 54;          // how far apart harvesters park when they arrive together
export const DRAG_START = 6;        // the mouse must move this far before a click becomes a drag

/* Where the refinery stands. It is the cell the squad started on in
   projects 19 and 20, so every map keeps that corner clear. */
export const BASE_COL = 4;
export const BASE_ROW = 10;

/* The three numbers the whole economy runs on. */
export const CAPACITY = 100;        // how much ore one harvester can carry
export const DIG_RATE = 25;         // ore a second a harvester digs out of a patch
export const UNLOAD_RATE = 60;      // ore a second it tips into the refinery
