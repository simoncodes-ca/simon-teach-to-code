/* =====================================================================
   numbers.ts. File 1 of 6.

   Tank Duel again. Two tanks, one keyboard, and a yard full of
   concrete blocks. Blue drives with W A S D. Red drives with the arrow
   keys. Hit the other tank four times and you take the round. Take
   three rounds and you win the duel.

   This file only remembers. Nothing in it runs while you play. It is
   the numbers the game is made of, the three arenas, and the keys
   each tank listens to.

   Every name here starts with `export`. That word lets another file
   use the name. A file that wants one asks for it by name at its top:

       import { TILE, COLS, ROWS } from './numbers';

   This file needs nobody, so it has no `import` lines at all.
   ===================================================================== */

export const WIDTH = 1024;       // the window is always this wide, whatever size it looks
export const HEIGHT = 768;       // and always this tall
export const TILE = 64;          // one cell of the arena is this many pixels across
export const COLS = 16;          // how many cells fit across the arena
export const ROWS = 12;          // and how many fit down it

export const TANK_SIZE = 40;     // a tank's box, for bumping into walls. It never turns
export const TANK_RADIUS = 24;   // a shell this close to the middle of a tank has hit it
export const TANK_SPEED = 150;   // how fast a tank drives, in pixels per second
export const TURN_SPEED = 2.6;   // how fast a tank turns, in radians per second
export const TURRET_SPEED = 2.2; // how fast a turret swings round, in radians per second
export const BARREL = 36;        // from the middle of the tank to the end of the barrel

export const SHELL_SPEED = 380;  // how fast a shell flies, in pixels per second
export const RELOAD_TIME = 0.7;  // seconds between two shots from the same tank
export const MAX_BOUNCES = 2;    // a shell can bounce this many times. The next wall ends it

export const MAX_HEALTH = 100;   // a tank starts every round with this much health
export const SHELL_DAMAGE = 25;  // and loses this much for every shell that hits it
export const WINS_NEEDED = 3;    // take this many rounds to win the duel

/* The three arenas, drawn as rows of characters. You met this idea in
   project 11, and nothing about it has changed.

      #  a concrete block
      .  open sand
      1  where Blue starts
      2  where Red starts

   Every arena is the same if you turn it upside down, so neither tank
   gets the better side. The given wiring in arena.ts reads these. */
export const ARENAS = [
  [
    '################',
    '#..............#',
    '#.1....#.......#',
    '#......#...##..#',
    '#..##..........#',
    '#......##......#',
    '#......##......#',
    '#..........##..#',
    '#..##...#......#',
    '#.......#....2.#',
    '#..............#',
    '################'
  ],
  [
    '################',
    '#......#.......#',
    '#.1....#...##..#',
    '#..............#',
    '#..###....#....#',
    '#.........#....#',
    '#....#.........#',
    '#....#....###..#',
    '#..............#',
    '#..##...#....2.#',
    '#.......#......#',
    '################'
  ],
  [
    '################',
    '#.1.....#......#',
    '#.......#..#...#',
    '#..##.......#..#',
    '#...#..##......#',
    '#.........#....#',
    '#....#.........#',
    '#......##..#...#',
    '#..#.......##..#',
    '#...#..#.......#',
    '#......#.....2.#',
    '################'
  ]
];

/* The keys each tank listens to. These are Phaser's names for the keys.
   Red's turret and fire keys sit just above the arrow keys, so Red can
   play with two hands on that side of the keyboard. */
export const CONTROLS = {
  blue: {
    forward: 'W', back: 'S', left: 'A', right: 'D',
    turretLeft: 'Q', turretRight: 'E', fire: 'SPACE'
  },
  red: {
    forward: 'UP', back: 'DOWN', left: 'LEFT', right: 'RIGHT',
    turretLeft: 'COMMA', turretRight: 'PERIOD', fire: 'FORWARD_SLASH'
  }
};
