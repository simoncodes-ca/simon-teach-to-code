/* =====================================================================
   Simon's Balloon Stall — the first game that moves on its own.

   This file is where you work. The stall is built. The sky is drawn.
   The cannon is bolted to the deck. But nothing rises, nothing flies
   and nothing pops until you fill in the TODO functions below.

   Write them in this order:
      1. makeBalloon   — build one balloon
      2. moveBalloon   — float it upwards, by the time that passed
      3. hasEscaped    — has it gone off the top?
      4. aimAngle      — which way is the mouse from the cannon?
      5. makeDart      — turn that angle into a dart with a speed
      6. moveDart      — fly it, and let gravity pull it down
      7. dartIsGone    — has the dart left the sky for good?
      8. hits          — did that dart touch that balloon?
      9. restartGame   — put the memory back to the start

   Each one you finish makes something new happen in the window.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   Everything the game knows sits in these variables.

   This is the same rule as every project before it. The screen is a
   picture of the memory. The difference here is that the picture is
   drawn again about sixty times a second, whether you do anything or
   not. That is called a game loop, and you can read it in section 3.

   The loop hands your functions one number: `seconds`. It is how long
   the last frame took. Everything moves by that number, so the game
   runs at the same speed on a fast computer and a slow one.

   One balloon is an object:

       { x: 300, y: 800, radius: 34, speed: 110, colour: '#ef5b52' }

   One dart is an object too. It carries a speed of its own, split into
   a sideways part and an up-and-down part:

       { x: 571, y: 631, vx: 707, vy: -707 }

   `vx` and `vy` are called the velocity. `vx` is how many pixels the
   dart moves sideways in one second. `vy` is how many it moves down in
   one second. A negative `vy` means it is going up.
   --------------------------------------------------------------------- */

const WIDTH = 1024;              // the sky is always this wide, whatever size it looks
const HEIGHT = 768;              // and always this tall
const DECK = 690;                // the height of the pier deck the cannon stands on

const CANNON = { x: 512, y: DECK };   // where the cannon is bolted down
const BARREL = 84;                    // how long the barrel is, in pixels

const DART_SPEED = 1000;         // how fast a dart leaves the barrel, in pixels per second
const GRAVITY = 760;             // how much `vy` grows every second the dart is in the air

const START_LIVES = 3;           // how many balloons may escape before the game ends
const SPAWN_EVERY = 1.15;        // seconds between one balloon and the next

/* The balloons come in seven colours. */
const BALLOON_COLOURS = [
  '#ef5b52', '#f59433', '#f4d248', '#45b98a', '#4aa8e0', '#a06bd0', '#ec7aa8'
];

let balloons = [];               // every balloon in the sky right now
let darts = [];                  // every dart in the air right now
let score = 0;                   // balloons popped
let escaped = 0;                 // balloons that got away
let lives = START_LIVES;         // lives left
let aim = -Math.PI / 2;          // the angle the cannon points, in radians. This is straight up


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Nine small functions. Fill them in from the top down.

   Each one gives you two hints. Read the gentle hint first. Read the
   stronger hint only if you need it. All the answers sit in one block
   at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * Build one new balloon, down below the bottom edge, and hand it back.
 *
 * The game asks for a new balloon every second or so. Each one should
 * be different: a different place along the bottom, a different size, a
 * different speed, a different colour. That is what makes the sky look
 * alive instead of printed.
 *
 * Two helpers are written for you further down the file:
 *
 *     randomBetween(low, high)   a random number between the two
 *     randomColour()             one colour out of BALLOON_COLOURS
 *
 * The balloon starts below the bottom edge, so it floats into view
 * rather than appearing out of nowhere. The sky is HEIGHT tall, so a
 * y of `HEIGHT + radius` is just under it.
 *
 * Gentle hint: build the balloon object described up in the memory. It
 *   needs x, y, radius, speed and colour. Work out the radius first,
 *   because y depends on it.
 * Stronger hint: `const radius = randomBetween(24, 44);` then
 *   `return { x: randomBetween(90, WIDTH - 90), y: HEIGHT + radius,
 *   radius: radius, speed: randomBetween(70, 150), colour: randomColour() };`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press Start and one balloon appears at the bottom of the sky, then
 * another, then another. They sit there in a row. Moving them is the
 * next function.
 */
function makeBalloon() {
  // TODO: build a new balloon below the bottom edge, and return it.
  return null;
}

/**
 * Float one balloon upwards, for `seconds` worth of time.
 *
 * Here is the idea the whole project is built on. You do not move a
 * balloon by a fixed number of pixels each frame. You move it by its
 * speed, multiplied by the time that passed.
 *
 *     distance = speed * time
 *
 * The balloon's `speed` is in pixels per second. `seconds` is how long
 * this frame took, and it is a small number like 0.016. So a balloon at
 * speed 120 moves about two pixels this frame.
 *
 * Do it the other way — move every balloon 2 pixels per frame — and the
 * game runs twice as fast on a 120 frames-per-second screen. That is a
 * real bug in real games.
 *
 * Careful with the direction. On a canvas, y counts downwards from the
 * top. A balloon going up is a balloon whose y gets smaller.
 *
 * Gentle hint: one line. Take the distance away from `balloon.y`,
 *   because up means less.
 * Stronger hint: `balloon.y -= balloon.speed * seconds;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * The balloons rise now. Press Slow motion on the counter and watch
 * them crawl. Nothing in this function changed, and that is the point:
 * the clock got slower, so `seconds` got smaller.
 */
function moveBalloon(balloon, seconds) {
  // TODO: move the balloon up by its speed, for this much time.
}

/**
 * Has this balloon floated off the top of the sky? Answer true or false.
 *
 * A game holds lists of things that come and go. Something has to
 * decide when a thing is finished, or the list grows forever and the
 * game slowly chokes. This function makes that decision for balloons.
 *
 * The top edge of the sky is y = 0. The balloon is only truly gone once
 * its whole body is past that edge, not just its middle. Its body
 * reaches `radius` pixels above its middle.
 *
 * Gentle hint: the bottom of the balloon is at `balloon.y`, and its top
 *   is `radius` higher up. Higher up means a smaller y.
 * Stronger hint: `return balloon.y + balloon.radius < 0;`
 *   Notice you write `return` on a comparison. A comparison is already
 *   true or false, so there is nothing to add.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Balloons now leave at the top instead of piling up above the sky, and
 * each one that gets away costs you a life. Let three go and the game
 * ends. Now you need a way to stop them.
 */
function hasEscaped(balloon) {
  // TODO: say whether the whole balloon is above the top edge.
  return false;
}

/**
 * Work out the angle from one point to another. Hand back the angle.
 *
 * The game calls this with the cannon and the mouse, and uses the
 * answer to point the barrel.
 *
 * An angle is a direction written as one number. `Math.atan2` works it
 * out for you from two distances: how far across, and how far down.
 *
 *     Math.atan2(down, across)
 *
 * Watch the order. Down comes first. Every programmer gets this the
 * wrong way round once.
 *
 * The answer comes back in radians, not degrees. Radians are the units
 * every maths function in JavaScript uses. Straight right is 0. A
 * quarter turn is `Math.PI / 2`. Half a turn is `Math.PI`.
 *
 * Gentle hint: how far across is one x take away the other. How far
 *   down is one y take away the other. Take `from` away from `to`.
 * Stronger hint: `return Math.atan2(to.y - from.y, to.x - from.x);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * The barrel follows your mouse now, and the Aim panel on the counter
 * draws the same angle on its own. The number on the awning is that
 * angle turned into degrees: 0 to the right, 90 straight up, 180 to the
 * left.
 */
function aimAngle(from, to) {
  // TODO: return the angle from the `from` point to the `to` point.
  return 0;
}

/**
 * Build a dart leaving the barrel at this angle. Hand it back.
 *
 * An angle says which way. A speed says how fast. A dart needs both,
 * kept as two numbers: `vx` for sideways and `vy` for up and down.
 *
 * Turning an angle into those two numbers is what cosine and sine are
 * for. That is their whole job.
 *
 *     across = Math.cos(angle)      a number between -1 and 1
 *     down   = Math.sin(angle)      a number between -1 and 1
 *
 * Multiply each one by how fast you want to go, and you have a velocity
 * pointing exactly along the angle.
 *
 * A helper is written for you further down the file:
 *
 *     muzzlePoint(angle)     where the end of the barrel is, at that angle
 *
 * `DART_SPEED` up in the memory is how fast a dart leaves the barrel.
 *
 * Gentle hint: start the dart at the muzzle. Then work out vx from the
 *   cosine and vy from the sine, each one times DART_SPEED.
 * Stronger hint: `const start = muzzlePoint(angle);` then
 *   `return { x: start.x, y: start.y, vx: Math.cos(angle) * DART_SPEED,
 *   vy: Math.sin(angle) * DART_SPEED };`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Click on the sky. A dart appears at the end of the barrel and hangs
 * there. It has a velocity, but nothing is using it yet.
 */
function makeDart(angle) {
  // TODO: build a dart at the muzzle, moving along this angle.
  return null;
}

/**
 * Fly one dart for `seconds` worth of time, and let gravity pull on it.
 *
 * Three lines, in this order.
 *
 * First move the dart by its velocity. That is the same
 * `distance = speed * time` you used on the balloons, done twice: once
 * for x with vx, once for y with vy.
 *
 * Then change the velocity itself. Gravity does not move the dart. It
 * makes the dart's `vy` bigger every second, and a bigger `vy` means
 * falling faster. `GRAVITY` up in the memory is how much bigger, per
 * second.
 *
 * That is the whole of gravity, in one line. A dart fired upwards has a
 * negative vy. Gravity keeps adding to it. The vy passes through zero
 * at the top of the arc, then turns positive, and the dart comes down.
 * You never write "go up" or "come down" anywhere. The curve falls out
 * of the numbers.
 *
 * Gentle hint: move x by vx, move y by vy, then add gravity to vy.
 *   Every one of the three is multiplied by `seconds`.
 * Stronger hint: `dart.x += dart.vx * seconds;` then
 *   `dart.y += dart.vy * seconds;` then `dart.vy += GRAVITY * seconds;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Darts fly in a curve now. Aim straight up and watch one slow, stop,
 * and fall back onto the deck. Aim sideways and watch it arc.
 */
function moveDart(dart, seconds) {
  // TODO: move the dart by its velocity, then let gravity pull on vy.
}

/**
 * Has this dart left the sky for good? Answer true or false.
 *
 * This is `hasEscaped`, for darts. Something has to take finished darts
 * out of the list, or the list grows forever.
 *
 * One trap here, and it is worth meeting. A dart above the top of the
 * sky is not finished. It is at the top of its arc, and it is coming
 * back down. Only three edges end a dart: below the bottom, off the
 * left, and off the right.
 *
 * Use a margin of about 40 pixels past each edge, so a dart disappears
 * out of sight rather than in front of you.
 *
 * Gentle hint: three comparisons joined by `||`, which means "or". Do
 *   not write one for the top edge.
 * Stronger hint: `return dart.y > HEIGHT + 40 || dart.x < -40 ||
 *   dart.x > WIDTH + 40;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Watch "In the air" on the counter. It went up and stayed up. Now it
 * climbs while you fire and falls back to zero when the darts land.
 */
function dartIsGone(dart) {
  // TODO: say whether the dart has gone past the bottom or the sides.
  return false;
}

/**
 * Did this dart touch this balloon? Answer true or false.
 *
 * A balloon is a circle. A dart is close enough to a point. So the
 * question is only this: is the point inside the circle?
 *
 * It is inside if the distance between the two is less than the
 * balloon's radius. Distance between two points comes from Pythagoras,
 * which you may have met at school as the triangle rule:
 *
 *     distance = the square root of (across × across + down × down)
 *
 * `Math.sqrt` is the square root.
 *
 * Gentle hint: work out how far apart they are across, and how far
 *   apart they are down. Then use those two for the distance, and
 *   compare it with `balloon.radius`.
 * Stronger hint: `const across = dart.x - balloon.x;` then
 *   `const down = dart.y - balloon.y;` then
 *   `return Math.sqrt(across * across + down * down) < balloon.radius;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Balloons pop now, and the score counts them. This is the last piece
 * of the game itself. One function left, and it is the one that lets
 * you play a second time.
 */
function hits(dart, balloon) {
  // TODO: say whether the dart is inside the balloon's circle.
  return false;
}

/**
 * Put the memory back exactly as it was before the first game.
 *
 * The Play again key calls this. There is no new idea here, and that is
 * why it comes last. Every variable in section 1 that changed during a
 * game has to go back to where it started.
 *
 * Look at the memory again and ask of each variable: does a game change
 * this? The two lists change. The score changes. The count of escaped
 * balloons changes. The lives change. Those five go back.
 *
 * `WIDTH`, `GRAVITY` and the rest never change, so they are `const` and
 * there is nothing to do about them.
 *
 * Gentle hint: five lines. Two empty lists, two zeros, and the lives
 *   back up to START_LIVES.
 * Stronger hint: `balloons = [];` `darts = [];` `score = 0;`
 *   `escaped = 0;` `lives = START_LIVES;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Play again works. Lose all three lives, press it, and the stall opens
 * for a fresh game. The game is finished.
 */
function restartGame() {
  // TODO: put balloons, darts, score, escaped and lives back to the start.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is finished already. It runs the game loop, draws the sky,
   listens to the mouse and works the keys.

   Read it, because it shows you where your nine functions get used. Do
   not change it.
   --------------------------------------------------------------------- */

const sky = document.getElementById('sky');
const pen = sky.getContext('2d');
const dial = document.getElementById('dial');
const dialPen = dial.getContext('2d');
const angleReadEl = document.getElementById('angleRead');
const scoreReadEl = document.getElementById('scoreRead');
const escapedReadEl = document.getElementById('escapedRead');
const scoreBigEl = document.getElementById('scoreBig');
const balloonCountEl = document.getElementById('balloonCount');
const dartCountEl = document.getElementById('dartCount');
const escapedBigEl = document.getElementById('escapedBig');
const heartsEl = document.getElementById('hearts');
const normalBtn = document.getElementById('normalSpeed');
const slowBtn = document.getElementById('slowSpeed');
const startBtn = document.getElementById('start');
const againBtn = document.getElementById('again');
const statusEl = document.getElementById('status');

/* The sounds. One Audio object per sound, made once and used again. */
const fireSound = new Audio('assets/fire.wav');
const popSound = new Audio('assets/pop.wav');
const escapeSound = new Audio('assets/escape.wav');
const overSound = new Audio('assets/over.wav');
const startSound = new Audio('assets/start.wav');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* Things the loop needs that are not part of the game itself. */
let phase = 'waiting';        // 'waiting', 'playing', 'paused' or 'over'
let timeScale = 1;            // 1 is normal. Slow motion makes it 0.3
let previous = 0;             // the time the last frame happened
let spawnTimer = SPAWN_EVERY; // seconds until the next balloon
let cooldown = 0;             // seconds until the cannon can fire again
let bursts = [];              // the marks a popped balloon leaves behind
let darted = 0;               // how many darts have been fired this game
let stillBalloons = 0;        // how long the balloons have sat still
let stillDarts = 0;           // how long the darts have sat still
let message = '';

function say(text) {
  if (text === message) return;
  message = text;
  statusEl.textContent = text;
}

/* --- Small helpers your functions can use --- */

function randomBetween(low, high) {
  return low + Math.random() * (high - low);
}

function randomColour() {
  return BALLOON_COLOURS[Math.floor(Math.random() * BALLOON_COLOURS.length)];
}

/* Where the end of the barrel is, when the cannon points this way. */
function muzzlePoint(angle) {
  return {
    x: CANNON.x + Math.cos(angle) * BARREL,
    y: CANNON.y + Math.sin(angle) * BARREL
  };
}

/* Is this really a balloon? An empty function hands back null instead. */
function isBalloon(thing) {
  return thing !== null && typeof thing === 'object'
    && typeof thing.x === 'number' && typeof thing.y === 'number'
    && typeof thing.radius === 'number';
}

/* Is this really a dart? The same question, asked about makeDart. */
function isDart(thing) {
  return thing !== null && typeof thing === 'object'
    && typeof thing.x === 'number' && typeof thing.y === 'number'
    && typeof thing.vx === 'number' && typeof thing.vy === 'number';
}

/* The cannon is bolted to the deck, so it cannot point downwards. This
   folds any angle back into the half turn above the deck. */
function clampAim(angle) {
  const limit = 0.1;
  if (angle > 0) return angle < Math.PI / 2 ? -limit : -Math.PI + limit;
  return Math.max(-Math.PI + limit, Math.min(-limit, angle));
}

/* --- The game loop ---

   This is the new machine in this project. It asks the browser to call
   it again before every single frame it draws, about sixty times a
   second, for as long as the page is open.

   Each time round it works out how long the last frame took, in
   seconds. That number goes to update(), and update() hands it to your
   functions. Nothing in this game moves by frames. Everything moves by
   time.

   A frame that took too long is trimmed to 0.05 seconds. Switch tabs
   for a minute and `now - previous` becomes sixty thousand. Without the
   trim, every balloon would jump straight off the top. */
function frame(now) {
  requestAnimationFrame(frame);
  if (previous === 0) previous = now;
  let seconds = (now - previous) / 1000;
  previous = now;
  if (seconds > 0.05) seconds = 0.05;
  if (phase === 'playing') update(seconds * timeScale);
  render();
}

/* One step of the game. Everything that changes, changes here. */
function update(seconds) {
  spawnTimer -= seconds;
  cooldown -= seconds;

  /* New balloons, unless the sky is already jammed full. */
  if (spawnTimer <= 0) {
    spawnTimer = SPAWN_EVERY;
    if (balloons.length < 40) {
      const balloon = makeBalloon();
      if (isBalloon(balloon)) balloons.push(balloon);
      else say('makeBalloon() is still empty, so the sky stays empty.');
    }
  }

  /* Move everything. Your two functions do the moving. */
  const watchedBalloon = balloons[0];
  const balloonWasAt = watchedBalloon ? watchedBalloon.y : 0;
  for (const balloon of balloons) moveBalloon(balloon, seconds);

  const watchedDart = darts[0];
  const dartWasAt = watchedDart ? watchedDart.x + watchedDart.y : 0;
  for (const dart of darts) moveDart(dart, seconds);

  /* Take out the balloons that got away. Walk the list backwards, so
     removing one does not skip the next. */
  for (let i = balloons.length - 1; i >= 0; i -= 1) {
    if (hasEscaped(balloons[i]) === true) {
      balloons.splice(i, 1);
      loseLife();
    }
  }

  /* Every dart against every balloon. The first touch pops. */
  for (let i = darts.length - 1; i >= 0; i -= 1) {
    for (let j = balloons.length - 1; j >= 0; j -= 1) {
      if (hits(darts[i], balloons[j]) === true) {
        popBalloon(balloons[j]);
        balloons.splice(j, 1);
        darts.splice(i, 1);
        break;
      }
    }
  }

  /* Take out the darts that are finished. */
  for (let i = darts.length - 1; i >= 0; i -= 1) {
    if (dartIsGone(darts[i]) === true) darts.splice(i, 1);
  }

  /* The burst marks fade on their own. They are decoration. */
  for (const burst of bursts) burst.life -= seconds;
  bursts = bursts.filter((burst) => burst.life > 0);

  reportEmptyFunctions(seconds, watchedBalloon, balloonWasAt, watchedDart, dartWasAt);
}

/* The status line under the window names whichever function is still
   empty. It is the fastest way to see where you are. */
function reportEmptyFunctions(seconds, watchedBalloon, balloonWasAt, watchedDart, dartWasAt) {
  if (watchedBalloon && watchedBalloon.y === balloonWasAt) stillBalloons += seconds;
  else stillBalloons = 0;

  if (watchedDart && watchedDart.x + watchedDart.y === dartWasAt) stillDarts += seconds;
  else stillDarts = 0;

  if (stillBalloons > 0.7) {
    say('moveBalloon() is still empty, so the balloons are stuck at the bottom.');
  } else if (balloons.length >= 40) {
    say('hasEscaped() is still empty, so nothing ever leaves the sky.');
  } else if (stillDarts > 0.7) {
    say('moveDart() is still empty, so the darts hang at the muzzle.');
  } else if (darts.length >= 30) {
    say('dartIsGone() is still empty, so the darts are never taken away.');
  } else if (darted >= 8 && score === 0) {
    say('Darts going straight through the balloons? hits() is still empty.');
  } else if (score > 0 || balloons.length > 0) {
    say(scoreLine());
  }
}

function scoreLine() {
  if (score === 0) return 'No pops yet. Aim with the mouse, click to fire.';
  return score === 1 ? 'One balloon popped.' : score + ' balloons popped.';
}

function loseLife() {
  escaped += 1;
  lives -= 1;
  playSound(escapeSound);
  if (lives <= 0) {
    lives = 0;
    phase = 'over';
    playSound(overSound);
    say('All three got away. Press Play again.');
  }
}

function popBalloon(balloon) {
  score += 1;
  bursts.push({ x: balloon.x, y: balloon.y, radius: balloon.radius, colour: balloon.colour, life: 0.3 });
  playSound(popSound);
}

/* --- Drawing the sky --- */

/* The stars never move, so their places are worked out once. */
const STARS = [];
for (let i = 0; i < 70; i += 1) {
  STARS.push({ x: Math.random() * WIDTH, y: Math.random() * (DECK - 180), size: Math.random() * 1.6 + 0.5 });
}

function drawBackdrop() {
  const dusk = pen.createLinearGradient(0, 0, 0, DECK);
  dusk.addColorStop(0, '#161f3d');
  dusk.addColorStop(0.55, '#3c3f6b');
  dusk.addColorStop(0.86, '#a8567a');
  dusk.addColorStop(1, '#e8894a');
  pen.fillStyle = dusk;
  pen.fillRect(0, 0, WIDTH, DECK);

  pen.fillStyle = 'rgba(255, 246, 224, .7)';
  for (const star of STARS) {
    pen.beginPath();
    pen.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    pen.fill();
  }

  /* The sun, low over the sea. */
  const glow = pen.createRadialGradient(760, DECK - 40, 10, 760, DECK - 40, 220);
  glow.addColorStop(0, 'rgba(255, 214, 150, .85)');
  glow.addColorStop(1, 'rgba(255, 214, 150, 0)');
  pen.fillStyle = glow;
  pen.beginPath();
  pen.arc(760, DECK - 40, 220, 0, Math.PI * 2);
  pen.fill();

  /* The sea, and the light lying on it. */
  const sea = pen.createLinearGradient(0, DECK - 96, 0, DECK);
  sea.addColorStop(0, '#20395c');
  sea.addColorStop(1, '#122238');
  pen.fillStyle = sea;
  pen.fillRect(0, DECK - 96, WIDTH, 96);
  pen.lineWidth = 2;
  for (let i = 0; i < 8; i += 1) {
    const y = DECK - 88 + i * 12;
    const half = 16 + i * 7;
    pen.strokeStyle = 'rgba(255, 206, 150, ' + (0.20 - i * 0.02) + ')';
    pen.beginPath();
    pen.moveTo(760 - half, y);
    pen.lineTo(760 + half, y);
    pen.stroke();
  }

  /* The deck of the pier. */
  pen.fillStyle = '#3b2718';
  pen.fillRect(0, DECK, WIDTH, HEIGHT - DECK);
  pen.strokeStyle = 'rgba(0, 0, 0, .35)';
  pen.lineWidth = 3;
  for (let x = 0; x <= WIDTH; x += 64) {
    pen.beginPath();
    pen.moveTo(x, DECK);
    pen.lineTo(x, HEIGHT);
    pen.stroke();
  }
  pen.fillStyle = 'rgba(255, 214, 150, .16)';
  pen.fillRect(0, DECK, WIDTH, 5);
}

function drawBalloon(balloon) {
  if (!isBalloon(balloon)) return;
  const r = balloon.radius;

  /* The string, trailing below. */
  pen.strokeStyle = 'rgba(255, 246, 224, .5)';
  pen.lineWidth = 1.6;
  pen.beginPath();
  pen.moveTo(balloon.x, balloon.y + r);
  pen.quadraticCurveTo(balloon.x + r * 0.5, balloon.y + r * 2, balloon.x, balloon.y + r * 2.6);
  pen.stroke();

  /* The knot. */
  pen.fillStyle = balloon.colour;
  pen.beginPath();
  pen.moveTo(balloon.x - r * 0.16, balloon.y + r * 0.96);
  pen.lineTo(balloon.x + r * 0.16, balloon.y + r * 0.96);
  pen.lineTo(balloon.x, balloon.y + r * 1.2);
  pen.closePath();
  pen.fill();

  /* The body, a little taller than it is wide. */
  pen.fillStyle = balloon.colour;
  pen.beginPath();
  pen.ellipse(balloon.x, balloon.y, r * 0.88, r, 0, 0, Math.PI * 2);
  pen.fill();

  /* The shine on it. */
  pen.fillStyle = 'rgba(255, 255, 255, .34)';
  pen.beginPath();
  pen.ellipse(balloon.x - r * 0.3, balloon.y - r * 0.34, r * 0.2, r * 0.3, -0.5, 0, Math.PI * 2);
  pen.fill();
}

function drawCannon(angle) {
  const muzzle = muzzlePoint(angle);

  /* The aiming line, from the muzzle out along the barrel. */
  pen.save();
  pen.setLineDash([6, 12]);
  pen.strokeStyle = 'rgba(255, 217, 138, .32)';
  pen.lineWidth = 2;
  pen.beginPath();
  pen.moveTo(muzzle.x, muzzle.y);
  pen.lineTo(CANNON.x + Math.cos(angle) * 480, CANNON.y + Math.sin(angle) * 480);
  pen.stroke();
  pen.restore();

  /* The mount it is bolted to, drawn first so the barrel sits over it. */
  pen.fillStyle = '#5a3b16';
  pen.beginPath();
  pen.moveTo(CANNON.x - 52, CANNON.y + 40);
  pen.lineTo(CANNON.x + 52, CANNON.y + 40);
  pen.lineTo(CANNON.x + 26, CANNON.y);
  pen.lineTo(CANNON.x - 26, CANNON.y);
  pen.closePath();
  pen.fill();
  pen.fillStyle = 'rgba(255, 226, 168, .18)';
  pen.fillRect(CANNON.x - 52, CANNON.y + 36, 104, 4);

  /* The barrel. */
  pen.save();
  pen.lineCap = 'round';
  pen.strokeStyle = '#8a5f1a';
  pen.lineWidth = 30;
  pen.beginPath();
  pen.moveTo(CANNON.x, CANNON.y);
  pen.lineTo(muzzle.x, muzzle.y);
  pen.stroke();
  pen.strokeStyle = '#c9922e';
  pen.lineWidth = 22;
  pen.beginPath();
  pen.moveTo(CANNON.x, CANNON.y);
  pen.lineTo(muzzle.x, muzzle.y);
  pen.stroke();
  pen.strokeStyle = 'rgba(255, 240, 196, .5)';
  pen.lineWidth = 5;
  pen.beginPath();
  pen.moveTo(CANNON.x + Math.cos(angle) * 22, CANNON.y + Math.sin(angle) * 22);
  pen.lineTo(muzzle.x - Math.cos(angle) * 10, muzzle.y - Math.sin(angle) * 10);
  pen.stroke();
  pen.restore();

  /* The hub the barrel turns on. */
  pen.fillStyle = '#eec870';
  pen.beginPath();
  pen.arc(CANNON.x, CANNON.y, 19, 0, Math.PI * 2);
  pen.fill();
  pen.fillStyle = '#7d5713';
  pen.beginPath();
  pen.arc(CANNON.x, CANNON.y, 7, 0, Math.PI * 2);
  pen.fill();
}

function drawDart(dart) {
  if (!isDart(dart)) return;
  const along = Math.atan2(dart.vy, dart.vx);
  const tailX = dart.x - Math.cos(along) * 20;
  const tailY = dart.y - Math.sin(along) * 20;

  pen.strokeStyle = '#efe3c8';
  pen.lineWidth = 4;
  pen.lineCap = 'round';
  pen.beginPath();
  pen.moveTo(tailX, tailY);
  pen.lineTo(dart.x, dart.y);
  pen.stroke();

  pen.fillStyle = '#ffd98a';
  pen.beginPath();
  pen.arc(dart.x, dart.y, 4, 0, Math.PI * 2);
  pen.fill();
}

function drawBursts() {
  for (const burst of bursts) {
    const grown = burst.radius * (1 + (0.3 - burst.life) * 3);
    pen.strokeStyle = burst.colour;
    pen.globalAlpha = Math.max(0, burst.life / 0.3);
    pen.lineWidth = 5;
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      pen.beginPath();
      pen.moveTo(burst.x + Math.cos(angle) * grown * 0.5, burst.y + Math.sin(angle) * grown * 0.5);
      pen.lineTo(burst.x + Math.cos(angle) * grown, burst.y + Math.sin(angle) * grown);
      pen.stroke();
    }
    pen.globalAlpha = 1;
  }
}

/* The card that covers the sky before the game and after it. */
function drawCurtain() {
  pen.fillStyle = 'rgba(12, 10, 20, .62)';
  pen.fillRect(0, 0, WIDTH, HEIGHT);
  pen.textAlign = 'center';
  pen.fillStyle = '#efe3c8';
  pen.font = "600 66px 'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif";

  if (phase === 'waiting') {
    pen.fillText('BALLOON STALL', WIDTH / 2, 300);
    pen.font = "26px 'Trebuchet MS', sans-serif";
    pen.fillText('Aim with the mouse. Click to fire.', WIDTH / 2, 360);
    pen.fillText('Three balloons may escape. Then the stall closes.', WIDTH / 2, 400);
    pen.fillStyle = '#ffd98a';
    pen.fillText('Press Start', WIDTH / 2, 470);
  } else if (phase === 'paused') {
    pen.fillText('PAUSED', WIDTH / 2, 360);
  } else {
    pen.fillText('STALL CLOSED', WIDTH / 2, 300);
    pen.font = "34px 'Trebuchet MS', sans-serif";
    pen.fillStyle = '#ffd98a';
    pen.fillText(score === 1 ? '1 balloon popped' : score + ' balloons popped', WIDTH / 2, 372);
    pen.font = "26px 'Trebuchet MS', sans-serif";
    pen.fillStyle = '#efe3c8';
    pen.fillText('Press Play again', WIDTH / 2, 440);
  }
  pen.textAlign = 'left';
}

/* The whole picture, drawn again from the memory, every frame. */
function render() {
  drawBackdrop();
  for (const balloon of balloons) drawBalloon(balloon);
  drawCannon(aim);
  for (const dart of darts) drawDart(dart);
  drawBursts();
  if (phase !== 'playing') drawCurtain();
  drawDial();
  renderFigures();
  renderHearts();
  renderKeys();
}

/* The Aim panel: the same angle, drawn on its own. */
function drawDial() {
  dialPen.fillStyle = '#101827';
  dialPen.fillRect(0, 0, dial.width, dial.height);

  const cx = dial.width / 2;
  const cy = dial.height - 22;
  dialPen.strokeStyle = 'rgba(239, 227, 200, .22)';
  dialPen.lineWidth = 2;
  dialPen.beginPath();
  dialPen.arc(cx, cy, 96, Math.PI, Math.PI * 2);
  dialPen.stroke();
  dialPen.beginPath();
  dialPen.moveTo(cx - 108, cy);
  dialPen.lineTo(cx + 108, cy);
  dialPen.stroke();

  dialPen.strokeStyle = '#ffd98a';
  dialPen.lineWidth = 7;
  dialPen.lineCap = 'round';
  dialPen.beginPath();
  dialPen.moveTo(cx, cy);
  dialPen.lineTo(cx + Math.cos(aim) * 92, cy + Math.sin(aim) * 92);
  dialPen.stroke();

  dialPen.fillStyle = '#c9922e';
  dialPen.beginPath();
  dialPen.arc(cx, cy, 9, 0, Math.PI * 2);
  dialPen.fill();
}

function renderFigures() {
  const degrees = Math.round(-aim * 180 / Math.PI);
  angleReadEl.textContent = degrees;
  scoreReadEl.textContent = score;
  escapedReadEl.textContent = escaped;
  scoreBigEl.textContent = score;
  balloonCountEl.textContent = balloons.length;
  dartCountEl.textContent = darts.length;
  escapedBigEl.textContent = escaped;
}

function renderHearts() {
  if (heartsEl.children.length !== START_LIVES) {
    heartsEl.textContent = '';
    for (let i = 0; i < START_LIVES; i += 1) {
      heartsEl.appendChild(document.createElement('span'));
    }
  }
  for (let i = 0; i < START_LIVES; i += 1) {
    heartsEl.children[i].className = i < lives ? 'heart' : 'heart heart-gone';
  }
}

function renderKeys() {
  startBtn.disabled = phase === 'over';
  startBtn.firstChild.nodeValue = phase === 'playing' ? 'Pause ' : 'Start ';
  againBtn.disabled = phase === 'waiting';
  normalBtn.setAttribute('aria-pressed', String(timeScale === 1));
  slowBtn.setAttribute('aria-pressed', String(timeScale !== 1));
}

/* --- The mouse --- */

/* Where on the sky is the mouse? The sky is always 1024 by 768 in its
   own numbers, however large the window draws it, so the screen point
   has to be moved and scaled. This is the canvasPoint you wrote in
   project 6, word for word. */
function skyPoint(event) {
  const box = sky.getBoundingClientRect();
  return {
    x: (event.clientX - box.left) * sky.width / box.width,
    y: (event.clientY - box.top) * sky.height / box.height
  };
}

sky.addEventListener('pointermove', (event) => {
  const point = skyPoint(event);
  const angle = aimAngle(CANNON, point);
  /* An empty aimAngle hands back 0 whatever you do, so the barrel never
     moves. That is worth saying out loud. */
  if (typeof angle !== 'number' || !isFinite(angle) || (angle === 0 && point.y !== CANNON.y)) {
    say('aimAngle() is still empty, so the cannon cannot follow you.');
    return;
  }
  aim = clampAim(angle);
});

sky.addEventListener('pointerdown', (event) => {
  const angle = aimAngle(CANNON, skyPoint(event));
  if (typeof angle === 'number' && isFinite(angle)) aim = clampAim(angle);
  fire();
});

function fire() {
  if (phase !== 'playing' || cooldown > 0) return;
  const dart = makeDart(aim);
  if (!isDart(dart)) {
    say('makeDart() is still empty, so the cannon has nothing to fire.');
    return;
  }
  darts.push(dart);
  darted += 1;
  cooldown = 0.16;
  playSound(fireSound);
}

/* --- The keys --- */

startBtn.addEventListener('click', () => {
  if (phase === 'playing') {
    phase = 'paused';
    say('Paused.');
  } else {
    if (phase === 'waiting') playSound(startSound);
    phase = 'playing';
    say('Aim with the mouse. Click to fire.');
  }
});

againBtn.addEventListener('click', () => {
  restartGame();
  if (lives !== START_LIVES || score !== 0 || balloons.length !== 0) {
    say('restartGame() is still empty, so nothing was put back.');
    return;
  }
  bursts = [];
  darted = 0;
  spawnTimer = SPAWN_EVERY;
  phase = 'playing';
  playSound(startSound);
  say('A fresh game. Aim with the mouse.');
});

normalBtn.addEventListener('click', () => {
  timeScale = 1;
  say('Normal speed.');
});

slowBtn.addEventListener('click', () => {
  timeScale = 0.3;
  say('Slow motion. Nothing in your code changed, only the clock.');
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !startBtn.disabled) {
    event.preventDefault();
    startBtn.click();
  }
});

/* Typing #demo onto a page that is already open changes the address
   only. The script does not run again. So the page reloads itself here. */
window.addEventListener('hashchange', () => location.reload());

/* --- The demos ---

   Add #demo or #demo-over to the end of the address in the browser and
   the game plays properly, so you can see what you are building. The
   stand-ins below fill in whichever functions are still empty. They are
   for the demo picture only. They are never for you. */
if (location.hash === '#demo' || location.hash === '#demo-over') {
  const testBalloon = { x: 10, y: 100, radius: 10, speed: 100, colour: '#fff' };
  moveBalloon(testBalloon, 1);
  const testDart = { x: 0, y: 0, vx: 100, vy: 100 };
  moveDart(testDart, 1);

  if (!isBalloon(makeBalloon())) {
    makeBalloon = () => {
      const radius = randomBetween(24, 44);
      return {
        x: randomBetween(90, WIDTH - 90),
        y: HEIGHT + radius,
        radius: radius,
        speed: randomBetween(70, 150),
        colour: randomColour()
      };
    };
  }
  if (testBalloon.y === 100) moveBalloon = (b, s) => { b.y -= b.speed * s; };
  if (hasEscaped({ x: 0, y: -100, radius: 10 }) !== true) {
    hasEscaped = (b) => b.y + b.radius < 0;
  }
  const testAngle = aimAngle({ x: 0, y: 0 }, { x: 0, y: -1 });
  if (typeof testAngle !== 'number' || Math.abs(testAngle + Math.PI / 2) > 0.001) {
    aimAngle = (from, to) => Math.atan2(to.y - from.y, to.x - from.x);
  }
  if (!isDart(makeDart(-Math.PI / 2))) {
    makeDart = (angle) => {
      const start = muzzlePoint(angle);
      return {
        x: start.x, y: start.y,
        vx: Math.cos(angle) * DART_SPEED,
        vy: Math.sin(angle) * DART_SPEED
      };
    };
  }
  if (testDart.x === 0) {
    moveDart = (d, s) => { d.x += d.vx * s; d.y += d.vy * s; d.vy += GRAVITY * s; };
  }
  if (dartIsGone({ x: 0, y: HEIGHT + 200, vx: 0, vy: 0 }) !== true) {
    dartIsGone = (d) => d.y > HEIGHT + 40 || d.x < -40 || d.x > WIDTH + 40;
  }
  if (hits({ x: 0, y: 0 }, { x: 0, y: 0, radius: 10 }) !== true) {
    hits = (dart, balloon) => {
      const across = dart.x - balloon.x;
      const down = dart.y - balloon.y;
      return Math.sqrt(across * across + down * down) < balloon.radius;
    };
  }

  if (location.hash === '#demo-over') {
    score = 14;
    escaped = 3;
    lives = 0;
    phase = 'over';
    say('Demo: the stall closed after three balloons got away.');
  } else {
    for (let i = 0; i < 5; i += 1) {
      const balloon = makeBalloon();
      balloon.y = 200 + i * 110;
      balloons.push(balloon);
    }
    score = 6;
    escaped = 1;
    lives = 2;
    phase = 'playing';
    say('Demo: the finished game. Aim with the mouse, click to fire.');
  }
} else {
  say('Press Start. Nothing rises yet. Writing makeBalloon() changes that.');
}

requestAnimationFrame(frame);


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the functions you have to write.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- makeBalloon() ---

     const radius = randomBetween(24, 44);
     return {
       x: randomBetween(90, WIDTH - 90),
       y: HEIGHT + radius,
       radius: radius,
       speed: randomBetween(70, 150),
       colour: randomColour()
     };


   --- moveBalloon(balloon, seconds) ---

     balloon.y -= balloon.speed * seconds;


   --- hasEscaped(balloon) ---

     return balloon.y + balloon.radius < 0;


   --- aimAngle(from, to) ---

     return Math.atan2(to.y - from.y, to.x - from.x);


   --- makeDart(angle) ---

     const start = muzzlePoint(angle);
     return {
       x: start.x,
       y: start.y,
       vx: Math.cos(angle) * DART_SPEED,
       vy: Math.sin(angle) * DART_SPEED
     };


   --- moveDart(dart, seconds) ---

     dart.x += dart.vx * seconds;
     dart.y += dart.vy * seconds;
     dart.vy += GRAVITY * seconds;


   --- dartIsGone(dart) ---

     return dart.y > HEIGHT + 40 || dart.x < -40 || dart.x > WIDTH + 40;


   --- hits(dart, balloon) ---

     const across = dart.x - balloon.x;
     const down = dart.y - balloon.y;
     return Math.sqrt(across * across + down * down) < balloon.radius;


   --- restartGame() ---

     balloons = [];
     darts = [];
     score = 0;
     escaped = 0;
     lives = START_LIVES;

   --------------------------------------------------------------------- */
