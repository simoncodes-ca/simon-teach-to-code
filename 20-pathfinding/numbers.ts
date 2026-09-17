/* =====================================================================
   numbers.ts. File 1 of 7.

   Pathfinding. The six tanks from project 19 are back, and this time
   they find their own way. Send them across the map, and each one
   searches for a route round the rock and the water before it drives.

   This file only remembers. It holds the sizes the page is built
   from, and the numbers the tanks and the search go by.
   ===================================================================== */

export const TILE = 48;             // one cell of the map is this many pixels across
export const COLS = 20;             // how many cells fit across the map
export const ROWS = 15;             // and how many fit down it
export const WIDTH = COLS * TILE;   // so the window is 960 pixels wide
export const HEIGHT = ROWS * TILE;  // and 720 pixels tall

export const TANK_SPEED = 90;       // pixels a second, on ground with a speed of 1
export const TANK_REACH = 22;       // a click this close to a tank's middle is a click on the tank
export const SPACING = 54;          // how far apart the tanks park when they arrive together
export const DRAG_START = 6;        // the mouse must move this far before a click becomes a drag

export const SEARCH_SPEED = 45;     // how many cells a second the search looks round on the map
