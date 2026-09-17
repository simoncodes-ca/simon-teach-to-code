/* =====================================================================
   numbers.js. File 1 of 6.

   This is Rooftop Run again. Same game, same rules, same pictures,
   same sounds. Project 13 kept all of it in one file of 1203 lines.
   Here it is cut into six.

   Nothing in this file happens. There is not one line in it that runs
   when you play. It is the numbers the game is made of, and the table
   of obstacle kinds.

   A file that only remembers needs nothing from anybody, so it goes
   first. Every other file reads these names.
   ===================================================================== */

const WIDTH = 1024;                // the window is always this wide, whatever size it looks
const HEIGHT = 768;                // and always this tall
const GROUND_Y = 560;              // the top of the rooftop, in world pixels
const RUNNER_SCREEN_X = 250;       // the runner stays this far from the left edge of the window

const RUN_W = 40;                  // the runner's box, for touching an obstacle
const RUN_H = 56;
const ROOF_CENTRE = GROUND_Y - RUN_H / 2;   // the runner's y while his feet are on the roof

const GRAVITY = 2000;              // every second, the runner falls this much faster
const JUMP_SPEED = 900;            // a jump starts by throwing him upwards this fast

const START_SPEED = 300;           // pixels a second at the start of a run
const SPEED_GROWTH = 0.01;         // and this much faster for every pixel he has run
const TOP_SPEED = 700;             // he never goes faster than this

const START_GAP_TIME = 1.55;       // seconds between obstacles at the start of a run
const MIN_GAP_TIME = 1.05;         // they never get closer together than this
const GAP_QUICKEN = 0.0000125;     // and they close up by this much for every pixel run
const GAP_SPREAD = 0.85;           // up to this many seconds of extra gap, picked at random

const AHEAD = WIDTH;               // build the world this far past the right edge of the window
const BEHIND = 200;                // forget an obstacle once it is this far past the left edge

const METRE = 32;                  // 32 pixels of rooftop is one metre on the readout
const FORGIVE = 7;                 // this much of each box is given away, so a near miss is a miss
const PRIME = 40;                  // how many times growTheWorld is called before a run starts

/* The kinds of obstacle, written as data rather than as code. Project
   13 explains this table. It has not changed. */
const KINDS = [
  { name: 'crate', w: 48,  h: 48, from: 0 },     // a single box. Easy.
  { name: 'vent',  w: 112, h: 48, from: 250 },   // low but wide. You have to jump early.
  { name: 'stack', w: 48,  h: 96, from: 600 }    // two boxes. The tall one.
];
