/* =====================================================================
   world.js. File 3 of 6.

   One job: the rooftops. This file owns the list of obstacles, builds
   the world ahead of the window, and throws away what is behind.

   It does reach outside itself, twice, and both are worth seeing:

       runSpeed(...)   lives in runner.js
       scene           lives in game.js

   That is what several script tags buy you. Every file can see every
   other file's names, with nothing asked for and nothing imported.
   It is handy, and it is the thing to be careful about. Project 17
   is where you start asking for names properly.
   ===================================================================== */

/* Everything in the way, in the order it was made. */
let obstacles = [];

let builtTo = 0;                   // the world x of the last obstacle put down
let ahead = 0;                     // how many obstacles are in front of the window
let behind = 0;                    // and how many are behind it

/* The world x of the two edges of the window. Phaser's camera knows
   where it is looking, and `scrollX` is the world x of its left edge. */
function whereTheWindowStarts() {
  return scene === null ? 0 : scene.cameras.main.scrollX;
}

function whereTheWindowEnds() {
  return whereTheWindowStarts() + WIDTH;
}

/* The kinds of obstacle that have started turning up by now. */
function kindsAllowed(howFar) {
  const metres = howFar / METRE;
  return KINDS.filter((kind) => metres >= kind.from);
}

/* How far along the next obstacle goes, measured in seconds of
   running and handed back in pixels. */
function nextGap(distance) {
  const seconds = Math.max(MIN_GAP_TIME, START_GAP_TIME - distance * GAP_QUICKEN);
  return runSpeed(distance) * (seconds + Math.random() * GAP_SPREAD);
}

/* One obstacle, standing at `worldX`. */
function pickObstacle(worldX, distance) {
  const kind = Phaser.Utils.Array.GetRandom(kindsAllowed(distance));

  return {
    kind: kind.name,
    x: worldX,
    y: GROUND_Y - kind.h / 2,
    w: kind.w,
    h: kind.h
  };
}

/* Keep the world built, just ahead of the window. Called once a frame. */
function growTheWorld() {
  if (builtTo > whereTheWindowEnds() + AHEAD) return;

  builtTo += nextGap(distance);
  addObstacle(pickObstacle(builtTo, distance));
}

/* Throw away the obstacles that are behind you. Counted backwards,
   because taking a thing out moves everything after it down one. */
function forgetOldObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i -= 1) {
    if (obstacles[i].x < whereTheWindowStarts() - BEHIND) removeObstacle(i);
  }
}

/* Put one obstacle into the world, with a picture to match. */
function addObstacle(obstacle) {
  obstacle.sprite = scene.add.image(obstacle.x, obstacle.y, obstacle.kind).setDepth(0);
  obstacles.push(obstacle);
  didWork('world');
  sayEvent('world.js put a ' + obstacle.kind + ' down at ' + Math.round(obstacle.x / METRE) + ' metres.');
}

/* Take obstacle number `i` out of the world. */
function removeObstacle(i) {
  const gone = obstacles[i];
  gone.sprite.destroy();
  obstacles.splice(i, 1);
  didWork('world');
  sayEvent('world.js threw away a ' + gone.kind + ' you had run past.');
}

/* How many obstacles are in front of the window, and how many behind. */
function countTheList() {
  const left = whereTheWindowStarts();
  ahead = 0;
  behind = 0;
  for (const obstacle of obstacles) {
    if (obstacle.x < left) behind += 1;
    else ahead += 1;
  }
}

/* A new run. Clear the rooftops, then build the first screenful
   before anybody sees it happening. */
function startTheWorld(fromX) {
  for (const obstacle of obstacles) obstacle.sprite.destroy();
  obstacles = [];

  builtTo = fromX + WIDTH * 0.8;
  for (let i = 0; i < PRIME; i += 1) growTheWorld();
  countTheList();
}
