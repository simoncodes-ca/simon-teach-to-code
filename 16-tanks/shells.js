/* =====================================================================
   shells.js. File 4 of 6.

   One job: shells. This file owns the list of shells in the air. It
   fires them, flies them, bounces them off the blocks, and works out
   what a hit does to a tank.

   Write tank.js first. Every function here leans on it.

   Then write these, in this order:
      5. fireShell       a new shell leaves the end of the barrel
      6. moveShell       fly, and bounce off blocks
      7. shellHitsTank   has this shell reached this tank?
      8. damageTank      a hit takes health away

   The numbers carry on from tank.js, because it is one list of eight
   functions split across two files.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY
   --------------------------------------------------------------------- */

/* Every shell in the air is one of these:

       {
         x, y,        where it is, in pixels
         vx, vy,      how fast it goes across and down, in pixels per second
         bounces,     how many blocks it has bounced off so far
         owner        the name of the tank that fired it, 'blue' or 'red'
       }

   Like a tank, a shell is a plain object with no picture in it.
   game.js draws one shell picture for each object in this list. */
let shells = [];


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Four more functions, top to bottom.
   --------------------------------------------------------------------- */

/**
 * Fire a shell from a tank.
 *
 * The wiring calls this on every frame the fire key is held. So the
 * first job is to say no most of the time. `tank.reload` counts down
 * to 0 by itself. While it is above 0, the gun is still reloading, so
 * leave without doing anything.
 *
 * If the gun is ready, build one shell and `push` it onto `shells`.
 * Every number it needs comes from your own functions in tank.js:
 *
 *     aimOf(tank)                      the way the gun points
 *     stepAlong(aim, BARREL)           from the middle of the tank to
 *                                      the end of the barrel
 *     stepAlong(aim, SHELL_SPEED)      the shell's vx and vy
 *
 * The shell starts at the end of the barrel, not in the middle of the
 * tank. So its x is `tank.x` plus the barrel step's x. The same goes
 * for y.
 *
 * It starts with 0 bounces, and its owner is `tank.name`.
 *
 * Last of all, set `tank.reload` to RELOAD_TIME. That line is what
 * stops a held key from firing sixty shells a second.
 *
 * Gentle hint: a guard, then the aim, two steps, one `push`, and one
 *   line for the reload.
 * Stronger hint: return while reload is positive. Find aim, barrel, and
 *   speed with the helpers, then push one shell object and reset reload.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press Space. A glowing shell appears at the end of Blue's barrel,
 * and it hangs there in the air. The reload bar on the rack empties
 * and fills.
 */
function fireShell(tank) {
  // TODO: reloading? Leave. Ready? Build a shell, push it, start the reload.
}

/**
 * Move a shell, and bounce it off blocks.
 *
 * This works like `driveTank`, and that is on purpose. Move across,
 * check, then move down, check.
 *
 * The move is project 7's, speed times time:
 *
 *     shell.x += shell.vx * seconds;
 *
 * The check asks about one spot, because a shell is tiny.
 * `isWallAt(x, y)` is given in arena.js.
 *
 * The difference is what happens on a hit. A tank takes its move back
 * and stops. A shell takes its move back, and then it turns round:
 *
 *     shell.vx = -shell.vx;
 *
 * Only the half that hit the block turns round. A shell that hits the
 * side of a block flips its vx and keeps its vy. That is a real
 * bounce, the same as a snooker ball off a cushion.
 *
 * Every bounce adds 1 to `shell.bounces`. The wiring throws a shell
 * away once it has bounced more than MAX_BOUNCES times.
 *
 * Gentle hint: two halves. Each half is a move, then an `if` with
 *   three lines inside: take it back, turn round, count it.
 * Stronger hint: move x, test the wall, and undo x before flipping
 *   `vx` and counting. Repeat the same steps for y and `vy`.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The shells fly. They bounce off the blocks with a ping, and vanish
 * after their third wall. But they fly straight through the tanks.
 */
function moveShell(shell, seconds) {
  // TODO: across and check, then down and check. Turn round on a hit.
}

/**
 * Has this shell hit this tank?
 *
 * A hit is a matter of distance. If the middle of the shell is closer
 * to the middle of the tank than TANK_RADIUS, it has hit. Project 11
 * caught the mouse with this:
 *
 *     Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y)
 *
 * There is one rule before that. A shell cannot hit the tank that
 * fired it until it has bounced at least once. Without that rule,
 * a tank driving forward could run into its own shell. With it, a
 * shell that bounces back at you is a real danger, and that is half
 * the fun.
 *
 * `shell.owner` is the name of the tank that fired it, and `tank.name`
 * is the name of this tank.
 *
 * Hand back true or false. The wiring does the rest. It bursts the
 * shell, plays the sound, and calls `damageTank`.
 *
 * Gentle hint: one `if` for the owner rule, then one line that
 *   compares a distance with TANK_RADIUS.
 * Stronger hint: reject the owner's shell only when its bounce count is
 *   zero. Otherwise compare the shell-to-tank distance with the radius.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Shells burst when they reach a tank. Nobody loses any health yet.
 */
function shellHitsTank(shell, tank) {
  // TODO: its own shell, not bounced yet? No. Otherwise, close enough?
}

/**
 * A hit takes health away.
 *
 * Take `amount` away from `tank.health`.
 *
 * Health must never go below 0. A tank with -25 health would show a
 * health bar pointing backwards. `Math.max` puts a floor under a
 * number, the way it did in project 12.
 *
 * Then decide. If the health is now 0, the tank is wrecked. Set
 * `tank.wrecked` to true. The wiring sees that. It stops the tank,
 * turns it black, and gives the round to the other tank.
 *
 * The health bars on the rack and over the tanks are not the health.
 * They are drawn from `tank.health` on every frame. Change the number,
 * and the bars follow.
 *
 * Gentle hint: one line to take the health away with a floor at 0,
 *   and one `if` to wreck the tank.
 * Stronger hint: subtract `amount` with `Math.max(0, ...)`. If health
 *   reaches zero, set `tank.wrecked` to true.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Hits count. The health bars drop, the fourth hit wrecks a tank, and
 * the round goes to the other side. The duel is playable.
 */
function damageTank(tank, amount) {
  // TODO: take it away, never below 0, and wreck the tank at 0.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   Two loops that game.js calls on every frame. Both take things out of
   a list, so both count backwards, the way project 7 explains.
   --------------------------------------------------------------------- */

/* Throw away every shell that has bounced too often. */
function forgetSpentShells() {
  for (let i = shells.length - 1; i >= 0; i -= 1) {
    if (shells[i].bounces > MAX_BOUNCES) shells.splice(i, 1);
  }
}

/* Ask your `shellHitsTank` about every shell and every tank that is
   still fighting. A shell that hits is taken out of the list, and
   `damageTank` is called for the tank.

   Hands back a list of the hits, so game.js can draw a burst at each
   one. */
function landHits() {
  const hits = [];
  for (let i = shells.length - 1; i >= 0; i -= 1) {
    for (const tank of tanks) {
      if (tank.wrecked) continue;
      if (shellHitsTank(shells[i], tank) !== true) continue;
      hits.push({ x: shells[i].x, y: shells[i].y, tank: tank });
      shells.splice(i, 1);
      damageTank(tank, SHELL_DAMAGE);
      break;
    }
  }
  return hits;
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the functions in this file. The
   answers for tank.js are at the bottom of tank.js.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- fireShell(tank) ---

     if (tank.reload > 0) return;

     const aim = aimOf(tank);
     const barrel = stepAlong(aim, BARREL);
     const speed = stepAlong(aim, SHELL_SPEED);

     shells.push({
       x: tank.x + barrel.x,
       y: tank.y + barrel.y,
       vx: speed.x,
       vy: speed.y,
       bounces: 0,
       owner: tank.name
     });

     tank.reload = RELOAD_TIME;


   --- moveShell(shell, seconds) ---

     shell.x += shell.vx * seconds;
     if (isWallAt(shell.x, shell.y)) {
       shell.x -= shell.vx * seconds;
       shell.vx = -shell.vx;
       shell.bounces += 1;
     }

     shell.y += shell.vy * seconds;
     if (isWallAt(shell.x, shell.y)) {
       shell.y -= shell.vy * seconds;
       shell.vy = -shell.vy;
       shell.bounces += 1;
     }


   --- shellHitsTank(shell, tank) ---

     if (shell.owner === tank.name && shell.bounces === 0) return false;

     const gap = Phaser.Math.Distance.Between(shell.x, shell.y, tank.x, tank.y);
     return gap < TANK_RADIUS;


   --- damageTank(tank, amount) ---

     tank.health = Math.max(0, tank.health - amount);
     if (tank.health === 0) tank.wrecked = true;

   --------------------------------------------------------------------- */
