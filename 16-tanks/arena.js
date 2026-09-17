/* =====================================================================
   arena.js. File 2 of 6.

   One job: the yard the tanks fight in. This file owns the map, builds
   the concrete blocks, and answers one question for everybody else:
   is this spot inside something solid?

   Nothing here is new. The map is project 11's idea. Checking the
   four corners of a box is project 12's idea. Both are written for
   you, because you have written them before.

   It uses one name from a later file, and that is allowed:

       tanks     lives in tank.js

   `blocked` only asks for `tanks` while the game runs. By then every
   file has loaded. Project 14 explains the order of the script tags.
   ===================================================================== */

/* The arena being played. One list per row, one character per cell,
   so `grid[row][col]` is one cell. The '1' and the '2' are taken out
   when the arena loads, so this only ever holds '#' and '.'. */
let grid = null;

let blocks = null;               // the group of concrete block sprites


/* Is this spot, in pixels, inside a concrete block?

   The edge of the map counts as a block, the same as the edge of the
   vault did. A spot off the arena is always solid.

   Your `moveShell` in shells.js calls this. */
function isWallAt(x, y) {
  const col = Math.floor(x / TILE);
  const row = Math.floor(y / TILE);
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return true;
  return grid[row][col] === '#';
}

/* Is this tank somewhere it must not be?

   Two things block a tank. One is a concrete block under any of the
   four corners of its box. The other is the other tank's box, because
   two tanks cannot sit on top of each other.

   The box is TANK_SIZE square and it never turns, even when the
   picture of the tank does. That is not exactly the shape of a tank.
   It is close enough, and it keeps the check to four corners.

   Your `driveTank` in tank.js calls this. */
function blocked(tank) {
  const half = TANK_SIZE / 2;
  const left = tank.x - half;
  const right = tank.x + half;
  const top = tank.y - half;
  const bottom = tank.y + half;

  if (isWallAt(left, top) || isWallAt(right, top)) return true;
  if (isWallAt(left, bottom) || isWallAt(right, bottom)) return true;

  for (const other of tanks) {
    if (other === tank) continue;
    const apartX = Math.abs(other.x - tank.x);
    const apartY = Math.abs(other.y - tank.y);
    if (apartX < TANK_SIZE && apartY < TANK_SIZE) return true;
  }
  return false;
}

/* The middle of a cell, in pixels. Project 11's `middleOf`. */
function middleOf(col, row) {
  return { x: col * TILE + TILE / 2, y: row * TILE + TILE / 2 };
}

/* Read one arena out of ARENAS, build its blocks, and say where the
   two tanks start. */
function loadArena(aScene, which) {
  blocks.clear(true, true);

  const lines = ARENAS[which];
  const starts = { blue: middleOf(2, 2), red: middleOf(13, 9) };

  grid = [];
  for (let row = 0; row < ROWS; row += 1) {
    const line = lines[row].split('');
    for (let col = 0; col < COLS; col += 1) {
      if (line[col] === '1') {
        starts.blue = middleOf(col, row);
        line[col] = '.';
      }
      if (line[col] === '2') {
        starts.red = middleOf(col, row);
        line[col] = '.';
      }
      if (line[col] === '#') {
        const spot = middleOf(col, row);
        blocks.create(spot.x, spot.y, 'block');
      }
    }
    grid.push(line);
  }
  return starts;
}
