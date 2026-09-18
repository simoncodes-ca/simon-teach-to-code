/* =====================================================================
   numbers.ts. File 1 of 8.

   The enemy. Your tanks are blue. Three red tanks sit out on the map,
   each one guarding a post of its own.

   A red tank walks its beat, looks around, and when it spots one of
   yours it comes after it and opens fire. You write the part that
   decides which of those it is doing.

   This file only remembers. It holds the sizes the page is built
   from, the speeds the tanks drive at, and the five numbers a fight
   runs on.
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

/* Where your tanks start. It is the cell the squad has started on
   since project 19, so every map keeps that corner clear. */
export const BASE_COL = 4;
export const BASE_ROW = 10;

/* How many tanks each side has when a map begins. */
export const BLUE_TANKS = 4;
export const RED_TANKS = 3;


/* --- The five numbers a fight runs on ---------------------------------

   The two reaches are the heart of this project, so look at them
   together.

       SEE_RANGE   how far a tank can spot somebody
       GUN_RANGE   how close it has to be to hit them

   A gun does not reach as far as an eye does. That is true of every
   strategy game ever made, and it is what gives a red tank something
   to do: it has seen you, and it cannot shoot you yet, so it drives.

   Because GUN_RANGE is the smaller of the two, anybody close enough
   to shoot is also close enough to see. That one sentence is why the
   order of the questions in `nextMode` matters, and job 9 is where it
   bites.                                                              */

export const SEE_RANGE = 250;       // pixels. Closer than this and a tank has spotted you
export const GUN_RANGE = 130;       // pixels. Closer than this and it can hit you

export const MAX_HEALTH = 100;      // how much damage a tank takes before it is wrecked
export const SHOT_DAMAGE = 9;       // how much health one shot takes off
export const RELOAD = 0.7;          // seconds a tank waits between shots

/* The three posts the red tanks guard, as a fraction of the map. The
   given wiring slides each one to the nearest cell a tank can drive
   on, so these work on any map you paint in project 18's editor. */
export const RED_POSTS = [
  { acrossPart: 0.78, downPart: 0.20 },
  { acrossPart: 0.58, downPart: 0.50 },
  { acrossPart: 0.80, downPart: 0.80 }
];

/* How far from its post a red tank walks its beat, in cells. It goes
   round a square of this size, for ever. */
export const BEAT = 3;
