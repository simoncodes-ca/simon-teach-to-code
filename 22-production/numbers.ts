/* =====================================================================
   numbers.ts. File 1 of 10.

   Production. The harvesters from project 21 dig ore and bring it
   home on their own. The credits climb, and now you can spend them.

   A build yard stands next to the refinery. You click what you want,
   it joins a queue, it takes time, and then it rolls out.

   This file only remembers. It holds the sizes the page is built
   from, the rates the harvesters work at, and the two numbers the
   yard runs on.
   ===================================================================== */

export const TILE = 48;             // one cell of the map is this many pixels across
export const COLS = 20;             // how many cells fit across the map
export const ROWS = 15;             // and how many fit down it
export const WIDTH = COLS * TILE;   // so the window is 960 pixels wide
export const HEIGHT = ROWS * TILE;  // and 720 pixels tall

export const TANK_SPEED = 90;       // pixels a second, on ground with a speed of 1
export const TANK_REACH = 22;       // a click this close to a unit's middle is a click on it
export const SPACING = 54;          // how far apart units park when they arrive together
export const DRAG_START = 6;        // the mouse must move this far before a click becomes a drag

/* Where the refinery stands. It is the cell the squad started on in
   projects 19, 20 and 21, so every map keeps that corner clear. */
export const BASE_COL = 4;
export const BASE_ROW = 10;

/* The three numbers the ore run needs. Project 21 wrote all of them. */
export const CAPACITY = 100;        // how much ore one harvester can carry
export const DIG_RATE = 25;         // ore a second a harvester digs out of a patch
export const UNLOAD_RATE = 60;      // ore a second it tips into the refinery

/* The two numbers the yard runs on. */
export const START_CREDITS = 500;   // what the refinery already holds when a map begins
export const QUEUE_MAX = 5;         // how many things may wait in the queue at once

/* How many harvesters are already on the map when a run begins. Every
   other unit you have to build. */
export const START_HARVESTERS = 3;
