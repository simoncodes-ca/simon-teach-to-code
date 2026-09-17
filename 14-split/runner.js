/* =====================================================================
   runner.js. File 4 of 6.

   One job: the courier. How fast he is going, how he jumps, how
   gravity brings him down, and what counts as touching something.

   He is the only thing in the game that the player moves, so he gets
   a file to himself. Notice how small it is once the rooftops, the
   readouts and the setting up have gone somewhere else.
   ===================================================================== */

/* The runner. x and y are the middle of him, in world pixels. */
const runner = { x: 0, y: ROOF_CENTRE, vy: 0, onRoof: true };

let distance = 0;                  // how far this run has gone, in world pixels

let stepTimer = 0;                 // swaps the two running pictures over
let stepFrame = true;

/* How fast he is going by now. The difficulty curve, in one line. */
function runSpeed(distance) {
  return Math.min(START_SPEED + distance * SPEED_GROWTH, TOP_SPEED);
}

/* The jump key has just been pressed. He may only jump from the roof. */
function startJump() {
  if (!runner.onRoof) return;
  runner.vy = -JUMP_SPEED;
  didWork('runner');
  sayEvent('runner.js sent you up.');
}

/* One frame of running: forwards by speed times seconds, then
   gravity, then the roof under his feet.

   It hands back true on the frame he lands, so game.js knows when to
   put a puff of dust there. */
function moveRunner(seconds) {
  const speed = runSpeed(distance);
  runner.x += speed * seconds;
  distance += speed * seconds;

  stepTimer += seconds * speed / START_SPEED;
  if (stepTimer > 0.16) {
    stepTimer = 0;
    stepFrame = !stepFrame;
  }

  const wasInTheAir = !runner.onRoof;
  runner.vy += GRAVITY * seconds;
  runner.y += runner.vy * seconds;

  if (runner.y >= ROOF_CENTRE) {
    runner.y = ROOF_CENTRE;
    runner.vy = 0;
    runner.onRoof = true;
    if (wasInTheAir) {
      didWork('runner');
      return true;
    }
  } else {
    runner.onRoof = false;
  }

  return false;
}

/* Two boxes touching, which is project 8's rule and has not changed. */
function hitsRunner(obstacle) {
  return Math.abs(runner.x - obstacle.x) * 2 < RUN_W + obstacle.w - FORGIVE * 2
    && Math.abs(runner.y - obstacle.y) * 2 < RUN_H + obstacle.h - FORGIVE * 2;
}

/* The obstacle he is touching, or null if he is in the clear. */
function whatTheRunnerHit() {
  for (const obstacle of obstacles) {
    if (hitsRunner(obstacle)) return obstacle;
  }
  return null;
}

function metresNow() {
  return Math.floor(distance / METRE);
}

/* A new run. Back to the left-hand end, on his feet, at zero metres. */
function putTheRunnerBack() {
  runner.x = 0;
  runner.y = ROOF_CENTRE;
  runner.vy = 0;
  runner.onRoof = true;
  distance = 0;
  stepTimer = 0;
  stepFrame = true;
}
