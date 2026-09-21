/* =====================================================================
   tank.js. File 3 of 6.

   One job: a tank. Which way it faces, how it drives, how it stops at
   a wall, and where its gun is pointing.

   Every game so far moved things in four directions, or up and down.
   A tank moves along the way it is facing, and it can face any way at
   all. So a tank carries one angle, and every move it makes starts
   from that angle.

   Write the functions in this file first, in this order:
      1. stepAlong   an angle and a distance, turned into a step
      2. turnTank    turn the tank round
      3. driveTank   drive forward or back, and stop at walls
      4. aimOf       the way the gun points

   Then go on to shells.js. Each function changes something you can
   see. Do them in order and watch the tanks come alive.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   Two tanks, and a list that holds both of them.
   --------------------------------------------------------------------- */

/* Every tank is one of these:

       {
         name,        'blue' or 'red'
         x, y,        the middle of the tank, in pixels
         angle,       the way the tank faces, in radians. 0 is right
         turret,      how far the gun is turned away from the front
         health,      from MAX_HEALTH down to 0
         reload,      seconds until it can fire again. 0 means ready
         wrecked,     true once its health has run out
         wins         rounds won so far
       }

   There is no picture in it. The pictures live in game.js, and they
   copy x, y and the angles from here on every frame. So everything a
   tank is sits in this one plain object. */
let blue = null;
let red = null;
let tanks = [];


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Four small functions, top to bottom.

   Each one gives you two hints. Read the gentle one first. All the
   answers sit in one block at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * Turn an angle and a distance into a step across and a step down.
 *
 * A tank facing right moves across. A tank facing down moves down. A
 * tank facing somewhere in between moves a bit of each. This function
 * works out how much of each.
 *
 * You already know how. Project 7 aimed a dart with these two:
 *
 *     Math.cos(angle)     how much of the way is across
 *     Math.sin(angle)     how much of the way is down
 *
 * Both give a number between -1 and 1. Multiply each one by the
 * distance, and hand them back as an object:
 *
 *     { x: 30, y: 0 }
 *
 * You will use this function four times: to drive, to find the end of
 * the barrel, to aim a shell, and to draw the gun sight.
 *
 * Gentle hint: one line for x, one line for y, each one a cos or a
 *   sin times the distance.
 * Stronger hint: return an object. Multiply `Math.cos(angle)` by the
 *   distance for x, and `Math.sin(angle)` by it for y.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press Start. A small arrow appears in front of each tank. It shows
 * the way the tank will drive.
 */
function stepAlong(angle, distance) {
  // TODO: an angle and a distance in, a step across and down out.
}

/**
 * Turn the tank.
 *
 * `turn` is -1, 0 or 1, and the given wiring works it out from the
 * keys:
 *
 *     -1     the left key is held. Turn one way
 *      0     neither key is held. Do not turn
 *      1     the right key is held. Turn the other way
 *
 * A tank turns at TURN_SPEED radians every second. So in `seconds`
 * seconds it turns TURN_SPEED times `seconds`. That is project 7's
 * speed times time, used on an angle instead of a position.
 *
 * Multiply by `turn` as well, and the sign takes care of the
 * direction. A -1 turns left, a 1 turns right, and a 0 stays still.
 * No `if` needed.
 *
 * Change `tank.angle`. Nothing else.
 *
 * Gentle hint: one line that adds to `tank.angle`.
 * Stronger hint: add `turn * TURN_SPEED * seconds` to the current angle.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Hold A or D. Blue spins on the spot. Red spins with the left and
 * right arrows. The Heading readout on the rack follows.
 */
function turnTank(tank, turn, seconds) {
  // TODO: turn by speed, times time, times the way.
}

/**
 * Drive the tank forward or back, and stop it at walls.
 *
 * This is the big one. It is two ideas, and the second is new.
 *
 * The first idea is the drive. `drive` is 1 for forward, -1 for back,
 * and 0 for still. The distance to go this frame is:
 *
 *     drive * TANK_SPEED * seconds
 *
 * Hand that and `tank.angle` to your `stepAlong`, and you get a step
 * across and a step down.
 *
 * The second idea is the wall. The cheese vault asked the map before
 * the mouse moved, and refused a step into a wall. A tank cannot do
 * that. It is not on a grid, so there is no "next cell" to ask about.
 *
 * So a tank moves first and checks after. If the move put it inside
 * something, it takes the move back. `blocked(tank)` is given in
 * arena.js. It answers true if the tank is in a block or in the other
 * tank.
 *
 * Here is the part that makes it feel good. Do the across half and the
 * down half separately:
 *
 *     1. Move across. If that is blocked, take the across move back.
 *     2. Move down. If that is blocked, take the down move back.
 *
 * Drive into a wall at a slant, and only the half that points into
 * the wall is taken back. The other half still happens, so the tank
 * slides along the wall instead of sticking to it.
 *
 * Gentle hint: get the step, then two moves. Each move is one line to
 *   add and one `if` to take it back.
 * Stronger hint: add the x step, undo it if blocked, then do the same
 *   with the y step. Check after each separate move.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Hold W. Blue drives. Point it at a block at a slant and it slides
 * along the side.
 */
function driveTank(tank, drive, seconds) {
  // TODO: work out the step, then move across and down, one at a time.
}

/**
 * Which way does the gun point?
 *
 * The turret sits on top of the tank and turns by itself. The given
 * wiring turns it with Q and E, or with , and . for Red. It changes
 * `tank.turret`, and that number is how far the gun has turned away
 * from the front of the tank.
 *
 * So `tank.turret` on its own is not the way the gun points. When the
 * tank turns, the turret turns with it. The way the gun really points
 * is the tank's angle, plus how far the turret has turned on top of
 * it.
 *
 * Hand back that one number.
 *
 * Gentle hint: two angles, added together.
 * Stronger hint: return the hull angle plus the turret angle.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The turrets swing round with Q and E. A dotted gun sight appears in
 * front of each barrel, and the Aim readout on the rack starts
 * working.
 */
function aimOf(tank) {
  // TODO: the tank's angle, plus the turret's.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is finished. It makes a tank, and puts it back at the
   start of each round.
   --------------------------------------------------------------------- */

function makeTank(name, start, angle) {
  return {
    name: name,
    x: start.x,
    y: start.y,
    angle: angle,
    turret: 0,
    health: MAX_HEALTH,
    reload: 0,
    wrecked: false,
    wins: 0
  };
}

/* A new round. Everything goes back to the start except the wins. */
function placeTank(tank, start, angle) {
  tank.x = start.x;
  tank.y = start.y;
  tank.angle = angle;
  tank.turret = 0;
  tank.health = MAX_HEALTH;
  tank.reload = 0;
  tank.wrecked = false;
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the functions in this file.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- stepAlong(angle, distance) ---

     return {
       x: Math.cos(angle) * distance,
       y: Math.sin(angle) * distance
     };


   --- turnTank(tank, turn, seconds) ---

     tank.angle += turn * TURN_SPEED * seconds;


   --- driveTank(tank, drive, seconds) ---

     const step = stepAlong(tank.angle, drive * TANK_SPEED * seconds);

     tank.x += step.x;
     if (blocked(tank)) tank.x -= step.x;

     tank.y += step.y;
     if (blocked(tank)) tank.y -= step.y;


   --- aimOf(tank) ---

     return tank.angle + tank.turret;

   --------------------------------------------------------------------- */
