/* =====================================================================
   numbers.ts. File 1 of 5.

   The Map Editor. You paint ground onto a grid, give the map a name,
   and save it. Later you load it back. The maps you make here are the
   maps the strategy game at the end of the trail is played on.

   This file only remembers. It holds the sizes the editor is built
   from, and the address of the map server.
   ===================================================================== */

export const TILE = 48;          // one cell of the map is this many pixels across
export const COLS = 20;          // how many cells fit across the map
export const ROWS = 15;          // and how many fit down it
export const WIDTH = COLS * TILE;   // so the window is 960 pixels wide
export const HEIGHT = ROWS * TILE;  // and 720 pixels tall

/* Where the map server listens. It is the same kind of address as
   project 15's score server, on the same door number. */
export const SERVER = 'http://localhost:4000';
