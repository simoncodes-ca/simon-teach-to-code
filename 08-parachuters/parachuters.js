/* =====================================================================
   Simon's Lookout Post — many things moving at once.

   This file is where you work. The post is built. The sky is drawn.
   The gun turns with your mouse. But no planes drop anything, nothing
   falls, nothing fires and nothing blows up until you fill in the TODO
   functions below.

   Write them in this order:
      1. makeTrooper       — a trooper drops out of a plane
      2. moveTrooper       — move him, by whichever rule he is under
      3. nextTrooperState  — chute open, boots down
      4. reachedThePost    — has he walked all the way to you?
      5. makeBullet        — load a shell and send it out the barrel
      6. bulletIsGone      — has the shell left the sky?
      7. hitsSprite        — did those two boxes touch?
      8. makeBoom          — start an explosion
      9. updateBoom        — grow it and fade it out

   Each one you finish makes something new happen in the window.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   Everything the game knows sits in these variables.

   This game keeps four lists instead of two. A plane is a thing. A
   trooper is a thing. A shell is a thing. An explosion is a thing. Each
   list fills and empties on its own, all four at the same time.

   Every thing in those lists is a **sprite**, and a sprite is a plain
   object. Nothing clever. It carries where it is, how big it is, how
   fast it is going, and what it is doing:

       { kind: 'trooper', x: 480, y: 210, w: 26, h: 34,
         vx: 0, vy: 140, state: 'falling' }

   Read those parts one at a time.

       kind    which sort of thing it is, so the drawing code knows
               what to paint
       x, y    the **top left corner** of the sprite. This is new. In
               the balloon stall, x and y were the middle of a balloon.
               Here they are a corner, because a sprite is a box.
       w, h    how wide and how tall the box is
       vx, vy  the velocity, the same as project 7. Pixels per second
               sideways, and pixels per second downwards
       state   what this thing is doing right now, as a word

   `state` is the part this project is really about. A trooper is
   'falling', then 'chute', then 'walking'. One word decides which rule
   moves him. That is a state machine, the same idea as the elevator in
   project 2, living inside a sprite.

   An explosion is a sprite too, but a smaller one. It has no velocity
   and no state, because it never moves and never changes its mind:

       { kind: 'boom', x: 480, y: 210, radius: 14, life: 0.45 }

   A sprite only carries what it needs.
   --------------------------------------------------------------------- */

const WIDTH = 1024;              // the sky is always this wide, whatever size it looks
const HEIGHT = 768;              // and always this tall
const GROUND = 662;              // the height of the ground the troopers land on

const POST = { x: 512, y: 620 }; // where the gun turns, on top of the sandbags
const BARREL = 74;               // how long the gun barrel is, in pixels

const GRAVITY = 420;             // how much a falling trooper's vy grows each second
const CHUTE_AT = 300;            // a chute opens once the trooper is this far down
const CHUTE_SPEED = 62;          // how fast a trooper drops under an open chute
const WALK_SPEED = 46;           // how fast a landed trooper walks at the post
const REACH = 70;                // how close he has to get to take a sandbag

const BULLET_SPEED = 900;        // how fast a shell leaves the barrel, in pixels per second

const BOOM_LIFE = 0.45;          // how long an explosion lasts, in seconds
const BOOM_GROWTH = 150;         // how many pixels an explosion grows each second

const TROOPER_W = 26;            // how wide a trooper's box is
const TROOPER_H = 34;            // how tall a trooper's box is
const BULLET_W = 9;              // a shell's box is small and square
const BULLET_H = 9;

const START_BAGS = 3;            // how many sandbags the post has
const PLANE_EVERY = 4.2;         // seconds between one plane and the next

let planes = [];                 // every plane crossing the sky right now
let troopers = [];               // every trooper in the air or on the ground
let bullets = [];                // every shell in the air right now
let booms = [];                  // every explosion still burning

let score = 0;                   // points for troopers and planes destroyed
let bags = START_BAGS;           // sandbags left on the post
let aim = -Math.PI / 2;          // the angle the gun points, in radians. This is straight up


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Nine small functions. Fill them in from the top down.

   Each one gives you two hints. Read the gentle hint first. Read the
   stronger hint only if you need it. All the answers sit in one block
   at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * Build one trooper, dropping out of the belly of this plane.
 *
 * The plane is a sprite, so you already know where it is and how wide
 * it is. The trooper starts under the middle of it.
 *
 * Remember that x and y are the **top left corner** of a box. So to put
 * the trooper under the middle of the plane, start at the plane's left
 * edge, go half the plane's width across, then come back half the
 * trooper's width. `TROOPER_W` and `TROOPER_H` up in the memory are the
 * size of his box.
 *
 * He leaves the plane with no speed of his own. Gravity gives him all
 * of it, one frame at a time, so `vx` and `vy` both start at 0.
 *
 * He starts in the 'falling' state. His chute is still packed.
 *
 * Gentle hint: build the trooper object described up in the memory. It
 *   needs kind, x, y, w, h, vx, vy and state. Work out x from the
 *   plane's middle.
 * Stronger hint: `return { kind: 'trooper',
 *   x: plane.x + plane.w / 2 - TROOPER_W / 2, y: plane.y + plane.h,
 *   w: TROOPER_W, h: TROOPER_H, vx: 0, vy: 0, state: 'falling' };`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press Start. Planes cross the sky and troopers appear under them.
 * They hang in the air in a line, because nothing moves them yet.
 */
function makeTrooper(plane) {
  // TODO: build a trooper under the middle of the plane, and return it.
  return null;
}

/**
 * Move one trooper for `seconds` worth of time.
 *
 * This is the function the whole project is built around, so read all
 * of this before you write any of it.
 *
 * A plane always moves the same way. A shell always moves the same way.
 * A trooper does not. He falls like a stone, then he drifts under a
 * chute, then he walks along the ground. Same trooper, three rules.
 *
 * His `state` says which rule he is under right now, so this function
 * asks that first and then does one of three things:
 *
 *     'falling'   gravity pulls on him, and he speeds up
 *     'chute'     he comes down at CHUTE_SPEED, and never faster
 *     'walking'   he walks sideways, at the post
 *
 * The falling rule is the dart from project 7. Add gravity to `vy`, and
 * move `y` by `vy`.
 *
 * The chute rule is simpler. He falls at exactly CHUTE_SPEED, whatever
 * he was doing before, so `vy` does not come into it at all.
 *
 * The walking rule needs to know which way to turn. A helper is written
 * for you further down the file:
 *
 *     towardsPost(x)     -1 if the post is to the left, 1 if it is to
 *                        the right
 *
 * Nothing here changes the state. Changing it is the next function.
 *
 * Gentle hint: `if (trooper.state === 'falling') { ... } else if
 *   (trooper.state === 'chute') { ... } else if (trooper.state ===
 *   'walking') { ... }`. Two lines in the first, one in each of the
 *   others.
 * Stronger hint: falling is `trooper.vy += GRAVITY * seconds;` then
 *   `trooper.y += trooper.vy * seconds;`. Chute is
 *   `trooper.y += CHUTE_SPEED * seconds;`. Walking is
 *   `trooper.x += towardsPost(trooper.x) * WALK_SPEED * seconds;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * The troopers drop now, and they keep dropping straight past the
 * ground and out of the bottom of the sky. Nobody has told them when to
 * pull the cord.
 */
function moveTrooper(trooper, seconds) {
  // TODO: move the trooper by the rule his state asks for.
}

/**
 * Work out which state this trooper should be in now. Hand back the word.
 *
 * The game calls this every frame, for every trooper, and puts your
 * answer back into `trooper.state`. So this function decides when a
 * chute opens and when a pair of boots hits the ground.
 *
 * There are two changes to look for, and they only happen in one
 * direction:
 *
 *     'falling' turns into 'chute'     once he is past CHUTE_AT
 *     'chute'   turns into 'walking'   once his feet touch GROUND
 *
 * His feet are at the bottom of his box, which is `trooper.y +
 * trooper.h`. His head is at `trooper.y`.
 *
 * If neither change applies, hand back the state he already has. A
 * function like this one must always answer something, or the trooper
 * ends up in the state `undefined` and no rule moves him at all.
 *
 * Gentle hint: two `if` lines, each one checking the state and the
 *   height together with `&&`. Then `return trooper.state;` at the end
 *   for every other case.
 * Stronger hint: `if (trooper.state === 'falling' && trooper.y >
 *   CHUTE_AT) return 'chute';` then `if (trooper.state === 'chute' &&
 *   trooper.y + trooper.h >= GROUND) return 'walking';` then
 *   `return trooper.state;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Chutes snap open halfway down and the troopers land on their feet and
 * start walking at you. Watch the Troopers panel on the rack: the count
 * moves from one state to the next as it happens.
 */
function nextTrooperState(trooper) {
  // TODO: return the state this trooper should be in now.
}

/**
 * Has this trooper walked all the way to the post? Answer true or false.
 *
 * Only a walking trooper can take a sandbag. One in the air is not a
 * problem yet, however close to the post he looks.
 *
 * So this is two questions joined by `&&`. Is he walking? And is the
 * middle of him within REACH pixels of the post?
 *
 * "Within REACH" means the gap between them is smaller than REACH,
 * whether he came from the left or from the right. `Math.abs` throws
 * away the minus sign, so one comparison covers both sides.
 *
 *     Math.abs(-40)   is 40
 *     Math.abs(40)    is 40
 *
 * The middle of his box is `trooper.x + trooper.w / 2`. The post is at
 * `POST.x`.
 *
 * Gentle hint: check the state first, then the distance. Use Math.abs
 *   so it works from either side.
 * Stronger hint: `return trooper.state === 'walking' &&
 *   Math.abs(trooper.x + trooper.w / 2 - POST.x) < REACH;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * A trooper who reaches you now takes a sandbag with him. Lose all
 * three and the post is gone. You need something to shoot with.
 */
function reachedThePost(trooper) {
  // TODO: say whether this trooper is walking and has arrived.
  return false;
}

/**
 * Build a shell leaving the barrel at this angle. Hand it back.
 *
 * This is `makeDart` from project 7, with one difference worth stopping
 * on: **a shell does not fall.** No gravity touches it. It goes in a
 * straight line at the same speed until it leaves the sky.
 *
 * That is not a smaller amount of code in this function. It is a
 * smaller amount of code later, because nothing ever changes a shell's
 * velocity. So the plain `moveSprite` in the wiring can move it, and
 * moves every plane with the same two lines.
 *
 * Two things are written for you further down the file:
 *
 *     muzzlePoint(angle)   where the end of the barrel is
 *     moveSprite(s, secs)  moves any sprite by its own velocity
 *
 * A shell is a box like everything else, so its x and y are its top
 * left corner. The muzzle point is the middle of it, so take half the
 * width and half the height back off.
 *
 * Gentle hint: start at the muzzle, then turn the angle into vx and vy
 *   with cosine and sine, each times BULLET_SPEED. That part is
 *   exactly project 7.
 * Stronger hint: `const start = muzzlePoint(angle);` then
 *   `return { kind: 'bullet', x: start.x - BULLET_W / 2,
 *   y: start.y - BULLET_H / 2, w: BULLET_W, h: BULLET_H,
 *   vx: Math.cos(angle) * BULLET_SPEED, vy: Math.sin(angle) *
 *   BULLET_SPEED, state: 'flying' };`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Click on the sky and a shell streaks out of the barrel in a straight
 * line. It goes off the edge and keeps going forever.
 */
function makeBullet(angle) {
  // TODO: build a shell at the muzzle, flying straight along this angle.
  return null;
}

/**
 * Has this shell left the sky? Answer true or false.
 *
 * Every list needs something that takes finished things out of it, or
 * the list grows forever and the game slowly chokes.
 *
 * Here is the difference from project 7, and it is the whole reason
 * this stub exists. A dart above the top of the sky was **not**
 * finished, because gravity was going to bring it back. A shell has no
 * gravity, so a shell that leaves the top is gone for good.
 *
 * That means all four edges count this time, not three.
 *
 * Use a margin of about 40 pixels past each edge, so a shell disappears
 * out of sight rather than in front of you.
 *
 * Gentle hint: four comparisons joined by `||`, which means "or". One
 *   for the top, one for the bottom, one for each side.
 * Stronger hint: `return bullet.y < -40 || bullet.y > HEIGHT + 40 ||
 *   bullet.x < -40 || bullet.x > WIDTH + 40;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Watch "Shells" on the rack. It climbed and stayed climbed. Now it
 * rises while you fire and falls back to zero on its own.
 */
function bulletIsGone(bullet) {
  // TODO: say whether the shell has gone past any of the four edges.
  return false;
}

/**
 * Did these two sprites touch? Answer true or false.
 *
 * Both of them are boxes, so this is the box question: do the two
 * rectangles overlap anywhere at all?
 *
 * It is easier to ask the opposite. Two boxes miss each other if any
 * one of these is true:
 *
 *     a is completely to the left of b
 *     a is completely to the right of b
 *     a is completely above b
 *     a is completely below b
 *
 * If none of those four is true, they overlap. Written the positive way
 * round, that is four comparisons joined by `&&`:
 *
 *     a's left edge is left of b's right edge, and
 *     a's right edge is right of b's left edge, and
 *     the same two again, for top and bottom
 *
 * Remember that a's right edge is `a.x + a.w`, and its bottom edge is
 * `a.y + a.h`.
 *
 * This one function does every collision in the game. Shell against
 * trooper, shell against plane. It never asks what kind of thing it was
 * handed, and that is exactly why sprites are all the same shape of
 * object.
 *
 * Gentle hint: four comparisons with `&&` between them. Compare each
 *   edge of a with the opposite edge of b.
 * Stronger hint: `return a.x < b.x + b.w && a.x + a.w > b.x &&
 *   a.y < b.y + b.h && a.y + a.h > b.y;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Shells knock troopers out of the sky now, and a plane is worth five.
 * The score counts them. Every hit leaves nothing behind, though, which
 * looks wrong. The last two functions are the bang.
 */
function hitsSprite(a, b) {
  // TODO: say whether box a and box b overlap.
  return false;
}

/**
 * Start an explosion at this point. Hand it back.
 *
 * The game calls this with the middle of whatever was just destroyed.
 *
 * An explosion is the smallest sprite in the game. It never moves, so
 * it has no velocity. It never changes its mind, so it has no state. It
 * only needs to know where it is, how big it is now, and how much
 * longer it has:
 *
 *     { kind: 'boom', x: 480, y: 210, radius: 14, life: BOOM_LIFE }
 *
 * `radius` starts small and gets bigger. `life` starts at BOOM_LIFE and
 * counts down to zero, and the wiring throws the boom away when it gets
 * there.
 *
 * The x and y here are the middle, not a corner. A circle has no
 * corners, and nothing ever collides with an explosion, so a corner
 * would be no use to anybody.
 *
 * Gentle hint: one return, with the four parts above in it. Start the
 *   radius at about 14 so the first frame is already visible.
 * Stronger hint: `return { kind: 'boom', x: x, y: y, radius: 14,
 *   life: BOOM_LIFE };`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Every hit leaves a ring of fire behind now. The rings never go out,
 * and the "Booms" count climbs and climbs. One function left.
 */
function makeBoom(x, y) {
  // TODO: build an explosion at this point, and return it.
  return null;
}

/**
 * Grow one explosion and burn a little of its life away.
 *
 * Two lines, and they are the same `speed × time` rule you have used on
 * everything else. Nothing here is different because it is an
 * explosion. It is a number going up and a number going down.
 *
 *     the radius grows by BOOM_GROWTH pixels every second
 *     the life shrinks by one second, every second
 *
 * "Every second" is the part that matters. Take `seconds` off the life
 * and a boom always lasts BOOM_LIFE, on any computer. Take a fixed
 * amount off each frame and it lasts twice as long on a slow one.
 *
 * The wiring throws away every boom whose life has reached zero, and
 * fades each one out as its life runs down. You do not have to do
 * either.
 *
 * Gentle hint: add to the radius, take away from the life. Both are
 *   multiplied by `seconds`.
 * Stronger hint: `boom.radius += BOOM_GROWTH * seconds;` then
 *   `boom.life -= seconds;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * The explosions bloom and fade. Four kinds of thing are now moving in
 * the same window, each one by its own rule, and the game is finished.
 */
function updateBoom(boom, seconds) {
  // TODO: grow the radius, and count the life down.
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
const angleReadEl = document.getElementById('angleRead');
const scoreReadEl = document.getElementById('scoreRead');
const fallCountEl = document.getElementById('fallCount');
const chuteCountEl = document.getElementById('chuteCount');
const walkCountEl = document.getElementById('walkCount');
const fallBarEl = document.getElementById('fallBar');
const chuteBarEl = document.getElementById('chuteBar');
const walkBarEl = document.getElementById('walkBar');
const sandbagsEl = document.getElementById('sandbags');
const planeCountEl = document.getElementById('planeCount');
const trooperCountEl = document.getElementById('trooperCount');
const bulletCountEl = document.getElementById('bulletCount');
const boomCountEl = document.getElementById('boomCount');
const normalBtn = document.getElementById('normalSpeed');
const slowBtn = document.getElementById('slowSpeed');
const startBtn = document.getElementById('start');
const againBtn = document.getElementById('again');
const statusEl = document.getElementById('status');

/* The sounds. One Audio object per sound, made once and used again. */
const fireSound = new Audio('assets/fire.wav');
const boomSound = new Audio('assets/boom.wav');
const chuteSound = new Audio('assets/chute.wav');
const breachSound = new Audio('assets/breach.wav');
const overSound = new Audio('assets/over.wav');
const startSound = new Audio('assets/start.wav');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* Things the loop needs that are not part of the game itself. */
let phase = 'waiting';          // 'waiting', 'playing', 'paused' or 'over'
let timeScale = 1;              // 1 is normal. Slow motion makes it 0.3
let previous = 0;               // the time the last frame happened
let planeTimer = 0.8;           // seconds until the next plane
let cooldown = 0;               // seconds until the gun can fire again
let fired = 0;                  // how many shells have been fired this game
let stillTroopers = 0;          // how long the troopers have hung still
let fellThrough = 0;            // troopers who dropped straight through the ground
let troopersMissing = false;    // true once a plane tried to drop nothing
let bulletsMissing = false;     // true once the gun tried to fire nothing
let boomsMissing = false;       // true once a hit happened with no explosion
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

/* Which way is the post from here? -1 for left, 1 for right. */
function towardsPost(x) {
  return x < POST.x ? 1 : -1;
}

/* Where the end of the gun barrel is, when it points this way. */
function muzzlePoint(angle) {
  return {
    x: POST.x + Math.cos(angle) * BARREL,
    y: POST.y + Math.sin(angle) * BARREL
  };
}

/* Move any sprite by its own velocity. Planes and shells both use this,
   because both of them move by one rule that never changes. Troopers
   cannot, and that is why they have moveTrooper of their own. */
function moveSprite(sprite, seconds) {
  sprite.x += sprite.vx * seconds;
  sprite.y += sprite.vy * seconds;
}

/* The angle from one point to another. This is the aimAngle you wrote
   in project 7, word for word. */
function aimAngle(from, to) {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

/* The gun sits on sandbags, so it cannot point down into them. This
   folds any angle back into the half turn above the post. */
function clampAim(angle) {
  const limit = 0.12;
  if (angle > 0) return angle < Math.PI / 2 ? -limit : -Math.PI + limit;
  return Math.max(-Math.PI + limit, Math.min(-limit, angle));
}

/* Is this really a sprite? An empty function hands back null instead. */
function isSprite(thing) {
  return thing !== null && typeof thing === 'object'
    && typeof thing.x === 'number' && typeof thing.y === 'number'
    && typeof thing.w === 'number' && typeof thing.h === 'number';
}

/* Is this really an explosion? The same question, asked about makeBoom. */
function isBoom(thing) {
  return thing !== null && typeof thing === 'object'
    && typeof thing.x === 'number' && typeof thing.y === 'number'
    && typeof thing.radius === 'number' && typeof thing.life === 'number';
}

/* A plane, built for you. It is the one sprite you do not have to make,
   and it is here so you can read a finished one before you write your
   own. It carries two extra parts of its own: how many troopers it
   still has on board, and how long until the next one goes out. */
function makePlane() {
  const fromLeft = Math.random() < 0.5;
  const speed = randomBetween(96, 150);
  const w = 132;
  return {
    kind: 'plane',
    x: fromLeft ? -w : WIDTH,
    y: randomBetween(74, 208),
    w: w,
    h: 38,
    vx: fromLeft ? speed : -speed,
    vy: 0,
    state: 'flying',
    dropsLeft: Math.round(randomBetween(1, 3)),
    dropTimer: randomBetween(0.5, 1.2)
  };
}

/* --- The game loop ---

   The same loop as project 7. It asks the browser for the next frame
   before it does anything else, works out how long the last frame took,
   and hands that number to update() in seconds.

   A frame that took too long is trimmed to 0.05 seconds, so a game left
   in a background tab does not lurch when you come back. */
function frame(now) {
  requestAnimationFrame(frame);
  if (previous === 0) previous = now;
  let seconds = (now - previous) / 1000;
  previous = now;
  if (seconds > 0.05) seconds = 0.05;
  if (phase === 'playing') update(seconds * timeScale);
  render();
}

/* One step of the game. Everything that changes, changes here.

   Read the order. It is the same order in every game ever written:
   move everything, check what touched what, throw away what is
   finished. Drawing happens afterwards, in render(), and never here. */
function update(seconds) {
  planeTimer -= seconds;
  cooldown -= seconds;

  /* A new plane, now and then. */
  if (planeTimer <= 0) {
    planeTimer = PLANE_EVERY;
    if (planes.length < 4) planes.push(makePlane());
  }

  /* The planes fly, and drop troopers out over the middle of the sky. */
  for (const plane of planes) moveSprite(plane, seconds);
  for (const plane of planes) {
    if (plane.x < -10 || plane.x + plane.w > WIDTH + 10) continue;
    plane.dropTimer -= seconds;
    if (plane.dropTimer > 0 || plane.dropsLeft <= 0) continue;
    plane.dropTimer = 0.9;
    plane.dropsLeft -= 1;
    const trooper = makeTrooper(plane);
    troopersMissing = !isSprite(trooper);
    if (isSprite(trooper)) troopers.push(trooper);
  }

  /* Planes that have crossed the sky are finished. */
  for (let i = planes.length - 1; i >= 0; i -= 1) {
    if (planes[i].x > WIDTH + 60 || planes[i].x + planes[i].w < -60) planes.splice(i, 1);
  }

  /* Move every trooper, then ask every trooper what he should be doing
     now. Your two functions do both jobs. */
  const watched = troopers[0];
  const watchedWasAt = watched ? watched.y : 0;
  for (const trooper of troopers) moveTrooper(trooper, seconds);
  for (const trooper of troopers) {
    const next = nextTrooperState(trooper);
    if (typeof next === 'string' && next !== trooper.state) changeState(trooper, next);
  }

  /* Troopers who made it to the post take a sandbag with them. */
  for (let i = troopers.length - 1; i >= 0; i -= 1) {
    if (reachedThePost(troopers[i]) === true) {
      troopers.splice(i, 1);
      loseBag();
    }
  }

  /* Anybody who fell out of the bottom of the sky is finished. A
     trooper should never get there, so we count it as a symptom. */
  for (let i = troopers.length - 1; i >= 0; i -= 1) {
    if (troopers[i].y > HEIGHT + 60) {
      troopers.splice(i, 1);
      fellThrough += 1;
    }
  }

  /* The shells fly straight, by the same moveSprite as the planes. */
  for (const bullet of bullets) moveSprite(bullet, seconds);
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    if (bulletIsGone(bullets[i]) === true) bullets.splice(i, 1);
  }

  /* Every shell against every trooper, then against every plane. One
     hitsSprite does both, because both of them are boxes. */
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    let struck = false;
    for (let j = troopers.length - 1; j >= 0; j -= 1) {
      if (hitsSprite(bullets[i], troopers[j]) === true) {
        destroy(troopers[j], 1);
        troopers.splice(j, 1);
        struck = true;
        break;
      }
    }
    if (!struck) {
      for (let j = planes.length - 1; j >= 0; j -= 1) {
        if (hitsSprite(bullets[i], planes[j]) === true) {
          destroy(planes[j], 5);
          planes.splice(j, 1);
          struck = true;
          break;
        }
      }
    }
    if (struck) bullets.splice(i, 1);
  }

  /* The explosions grow and burn down. The dead ones leave the list. */
  for (const boom of booms) updateBoom(boom, seconds);
  booms = booms.filter((boom) => typeof boom.life === 'number' && boom.life > 0);

  reportEmptyFunctions(seconds, watched, watchedWasAt);
}

/* A trooper has just changed state. Everything that happens once, at
   the moment of the change, happens here rather than in your movement
   function. That keeps moveTrooper to one job. */
function changeState(trooper, next) {
  trooper.state = next;
  fellThrough = 0;
  if (next === 'chute') {
    trooper.vy = 0;
    playSound(chuteSound);
  } else if (next === 'walking') {
    trooper.vx = 0;
    trooper.vy = 0;
    trooper.y = GROUND - trooper.h;
  }
}

/* Something was destroyed. Count it, bang it, and light it up. */
function destroy(sprite, points) {
  score += points;
  playSound(boomSound);
  const boom = makeBoom(sprite.x + sprite.w / 2, sprite.y + sprite.h / 2);
  boomsMissing = !isBoom(boom);
  if (isBoom(boom)) booms.push(boom);
}

function loseBag() {
  bags -= 1;
  playSound(breachSound);
  if (bags <= 0) {
    bags = 0;
    phase = 'over';
    playSound(overSound);
    say('The post is gone. Press Play again.');
  }
}

/* The status line under the window names whichever function is still
   empty. It is the fastest way to see where you are. */
function reportEmptyFunctions(seconds, watched, watchedWasAt) {
  if (watched && watched.y === watchedWasAt && watched.state !== 'walking') stillTroopers += seconds;
  else stillTroopers = 0;

  if (troopersMissing) {
    say('makeTrooper() is still empty, so the planes drop nothing.');
  } else if (stillTroopers > 0.7) {
    say('moveTrooper() is still empty, so the troopers hang in the air.');
  } else if (fellThrough > 0) {
    say('nextTrooperState() is still empty, so no chute ever opens.');
  } else if (countAtThePost() >= 2 && bags === START_BAGS) {
    say('reachedThePost() is still empty, so nobody ever arrives.');
  } else if (bulletsMissing) {
    say('makeBullet() is still empty, so the gun has nothing to fire.');
  } else if (bullets.length >= 16) {
    say('bulletIsGone() is still empty, so the shells are never taken away.');
  } else if (fired >= 10 && score === 0) {
    say('Shells going straight through? hitsSprite() is still empty.');
  } else if (boomsMissing) {
    say('makeBoom() is still empty, so nothing blows up.');
  } else if (booms.length >= 5) {
    say('updateBoom() is still empty, so the explosions never go out.');
  } else if (score > 0 || troopers.length > 0) {
    say(scoreLine());
  }
}

function countAtThePost() {
  let total = 0;
  for (const trooper of troopers) {
    if (trooper.state === 'walking' && Math.abs(trooper.x + trooper.w / 2 - POST.x) < REACH) total += 1;
  }
  return total;
}

function countState(state) {
  let total = 0;
  for (const trooper of troopers) {
    if (trooper.state === state) total += 1;
  }
  return total;
}

function scoreLine() {
  if (score === 0) return 'No hits yet. Aim with the mouse, click to fire.';
  return score === 1 ? '1 point.' : score + ' points.';
}

/* --- Drawing the sky ---

   Nothing below this line changes the game. It only paints it. That
   split is worth keeping in every game you write: update() moves, and
   render() draws, and neither one does the other's job. */

/* The clouds never move, so their places are worked out once. */
const CLOUDS = [];
for (let i = 0; i < 9; i += 1) {
  CLOUDS.push({
    x: Math.random() * WIDTH,
    y: 60 + Math.random() * 300,
    size: 30 + Math.random() * 44,
    alpha: 0.06 + Math.random() * 0.1
  });
}

function drawBackdrop() {
  const dawn = pen.createLinearGradient(0, 0, 0, GROUND);
  dawn.addColorStop(0, '#1d2b52');
  dawn.addColorStop(0.42, '#5c7ba6');
  dawn.addColorStop(0.78, '#d59a68');
  dawn.addColorStop(1, '#f6dca6');
  pen.fillStyle = dawn;
  pen.fillRect(0, 0, WIDTH, GROUND);

  for (const cloud of CLOUDS) {
    pen.fillStyle = 'rgba(255, 250, 240, ' + cloud.alpha + ')';
    pen.beginPath();
    pen.ellipse(cloud.x, cloud.y, cloud.size * 2.1, cloud.size * 0.5, 0, 0, Math.PI * 2);
    pen.fill();
    pen.beginPath();
    pen.ellipse(cloud.x + cloud.size * 0.5, cloud.y - cloud.size * 0.28, cloud.size, cloud.size * 0.42, 0, 0, Math.PI * 2);
    pen.fill();
  }

  /* The far ridge, in silhouette. */
  pen.fillStyle = '#3b4a4a';
  pen.beginPath();
  pen.moveTo(0, GROUND);
  pen.lineTo(0, GROUND - 46);
  for (let x = 0; x <= WIDTH; x += 64) {
    pen.lineTo(x, GROUND - 46 - Math.sin(x / 118) * 26 - Math.sin(x / 47) * 9);
  }
  pen.lineTo(WIDTH, GROUND);
  pen.closePath();
  pen.fill();

  /* The ground the troopers land on. */
  const earth = pen.createLinearGradient(0, GROUND, 0, HEIGHT);
  earth.addColorStop(0, '#4f5b34');
  earth.addColorStop(1, '#28301c');
  pen.fillStyle = earth;
  pen.fillRect(0, GROUND, WIDTH, HEIGHT - GROUND);
  pen.fillStyle = 'rgba(255, 238, 190, .2)';
  pen.fillRect(0, GROUND, WIDTH, 3);
  pen.strokeStyle = 'rgba(24, 30, 16, .5)';
  pen.lineWidth = 2;
  for (let x = 12; x < WIDTH; x += 27) {
    const tall = 6 + (x % 13);
    pen.beginPath();
    pen.moveTo(x, GROUND + 8);
    pen.lineTo(x + 3, GROUND + 8 - tall);
    pen.stroke();
  }
}

/* The post itself: a wall of sandbags with the gun on top. */
function drawPost(angle) {
  const muzzle = muzzlePoint(angle);

  /* The aiming line, out along the barrel. */
  pen.save();
  pen.setLineDash([6, 12]);
  pen.strokeStyle = 'rgba(255, 236, 190, .3)';
  pen.lineWidth = 2;
  pen.beginPath();
  pen.moveTo(muzzle.x, muzzle.y);
  pen.lineTo(POST.x + Math.cos(angle) * 520, POST.y + Math.sin(angle) * 520);
  pen.stroke();
  pen.restore();

  /* The barrel, drawn before the bags so it sits behind the front row. */
  pen.save();
  pen.lineCap = 'round';
  pen.strokeStyle = '#2f3729';
  pen.lineWidth = 20;
  pen.beginPath();
  pen.moveTo(POST.x, POST.y);
  pen.lineTo(muzzle.x, muzzle.y);
  pen.stroke();
  pen.strokeStyle = '#59634a';
  pen.lineWidth = 13;
  pen.beginPath();
  pen.moveTo(POST.x, POST.y);
  pen.lineTo(muzzle.x, muzzle.y);
  pen.stroke();
  pen.strokeStyle = 'rgba(255, 244, 214, .38)';
  pen.lineWidth = 3;
  pen.beginPath();
  pen.moveTo(POST.x + Math.cos(angle) * 20, POST.y + Math.sin(angle) * 20);
  pen.lineTo(muzzle.x - Math.cos(angle) * 8, muzzle.y - Math.sin(angle) * 8);
  pen.stroke();
  pen.restore();

  /* Three rows of sandbags, stacked and offset. */
  const rows = [
    { y: POST.y + 2, half: 62 },
    { y: POST.y + 20, half: 78 },
    { y: POST.y + 38, half: 92 }
  ];
  for (const row of rows) {
    for (let x = POST.x - row.half; x < POST.x + row.half; x += 34) {
      pen.fillStyle = '#a08e5d';
      roundedBox(x, row.y, 32, 17, 8);
      pen.fill();
      pen.fillStyle = 'rgba(255, 244, 206, .22)';
      roundedBox(x + 2, row.y + 2, 28, 5, 3);
      pen.fill();
    }
  }

  /* The hub the gun turns on. */
  pen.fillStyle = '#78826a';
  pen.beginPath();
  pen.arc(POST.x, POST.y, 15, 0, Math.PI * 2);
  pen.fill();
  pen.fillStyle = '#2f3729';
  pen.beginPath();
  pen.arc(POST.x, POST.y, 6, 0, Math.PI * 2);
  pen.fill();
}

function roundedBox(x, y, w, h, r) {
  pen.beginPath();
  pen.moveTo(x + r, y);
  pen.arcTo(x + w, y, x + w, y + h, r);
  pen.arcTo(x + w, y + h, x, y + h, r);
  pen.arcTo(x, y + h, x, y, r);
  pen.arcTo(x, y, x + w, y, r);
  pen.closePath();
}

/* One sprite, drawn by its kind. Every moving thing in the game goes
   through this one function. */
function drawSprite(sprite) {
  if (!isSprite(sprite)) return;
  if (sprite.kind === 'plane') drawPlane(sprite);
  else if (sprite.kind === 'trooper') drawTrooper(sprite);
  else if (sprite.kind === 'bullet') drawBullet(sprite);
}

function drawPlane(plane) {
  const facing = plane.vx < 0 ? -1 : 1;
  const cx = plane.x + plane.w / 2;
  const cy = plane.y + plane.h / 2;

  pen.save();
  pen.translate(cx, cy);
  pen.scale(facing, 1);

  /* The tail fin. */
  pen.fillStyle = '#3f4a38';
  pen.beginPath();
  pen.moveTo(-66, 2);
  pen.lineTo(-52, -20);
  pen.lineTo(-40, 2);
  pen.closePath();
  pen.fill();

  /* The body. */
  pen.fillStyle = '#5b6650';
  roundedBox(-66, -8, 128, 18, 9);
  pen.fill();
  pen.fillStyle = 'rgba(255, 246, 214, .22)';
  roundedBox(-62, -6, 118, 5, 3);
  pen.fill();

  /* The wing, under the body. */
  pen.fillStyle = '#414c3a';
  roundedBox(-16, 6, 56, 9, 4);
  pen.fill();

  /* The cockpit glass. */
  pen.fillStyle = '#bcd6e2';
  roundedBox(34, -6, 20, 9, 4);
  pen.fill();

  /* The propeller, spinning too fast to see. */
  pen.strokeStyle = 'rgba(230, 236, 220, .45)';
  pen.lineWidth = 3;
  pen.beginPath();
  pen.ellipse(64, 1, 3, 20, 0, 0, Math.PI * 2);
  pen.stroke();

  pen.restore();
}

function drawTrooper(trooper) {
  const cx = trooper.x + trooper.w / 2;
  const top = trooper.y;

  if (trooper.state === 'chute') {
    /* The canopy, and the lines down to his shoulders. */
    pen.fillStyle = '#d8cba6';
    pen.beginPath();
    pen.arc(cx, top - 6, 30, Math.PI, Math.PI * 2);
    pen.closePath();
    pen.fill();
    pen.fillStyle = 'rgba(120, 96, 60, .3)';
    pen.beginPath();
    pen.arc(cx, top - 6, 30, Math.PI * 1.5, Math.PI * 2);
    pen.closePath();
    pen.fill();
    pen.strokeStyle = 'rgba(232, 224, 198, .8)';
    pen.lineWidth = 1.4;
    for (const side of [-1, 1]) {
      pen.beginPath();
      pen.moveTo(cx + side * 29, top - 6);
      pen.lineTo(cx + side * 6, top + 12);
      pen.stroke();
    }
  }

  /* The body. */
  pen.fillStyle = '#54603f';
  roundedBox(trooper.x + 4, top + 12, trooper.w - 8, trooper.h - 14, 4);
  pen.fill();

  /* The helmet and the face under it. */
  pen.fillStyle = '#c9a97e';
  pen.beginPath();
  pen.arc(cx, top + 9, 6, 0, Math.PI * 2);
  pen.fill();
  pen.fillStyle = '#3f4a30';
  pen.beginPath();
  pen.arc(cx, top + 8, 7.5, Math.PI, Math.PI * 2);
  pen.fill();

  pen.strokeStyle = '#3f4a30';
  pen.lineWidth = 3.5;
  pen.lineCap = 'round';

  if (trooper.state === 'falling') {
    /* Arms and legs thrown out, because nothing is holding him up. */
    for (const side of [-1, 1]) {
      pen.beginPath();
      pen.moveTo(cx + side * 5, top + 16);
      pen.lineTo(cx + side * 15, top + 6);
      pen.stroke();
      pen.beginPath();
      pen.moveTo(cx + side * 4, top + 30);
      pen.lineTo(cx + side * 12, top + 38);
      pen.stroke();
    }
  } else if (trooper.state === 'chute') {
    /* Hanging in the harness, legs together. */
    for (const side of [-1, 1]) {
      pen.beginPath();
      pen.moveTo(cx + side * 5, top + 16);
      pen.lineTo(cx + side * 11, top + 8);
      pen.stroke();
      pen.beginPath();
      pen.moveTo(cx + side * 3, top + 30);
      pen.lineTo(cx + side * 4, top + 38);
      pen.stroke();
    }
  } else {
    /* Walking. The stride comes from where he is, so every trooper is
       out of step with the one beside him. */
    const stride = Math.sin(trooper.x / 7) * 8;
    pen.beginPath();
    pen.moveTo(cx, top + 28);
    pen.lineTo(cx + stride, top + 38);
    pen.stroke();
    pen.beginPath();
    pen.moveTo(cx, top + 28);
    pen.lineTo(cx - stride, top + 38);
    pen.stroke();
    pen.beginPath();
    pen.moveTo(cx, top + 16);
    pen.lineTo(cx + towardsPost(trooper.x) * 13, top + 20);
    pen.stroke();
  }
}

function drawBullet(bullet) {
  const along = Math.atan2(bullet.vy, bullet.vx);
  const cx = bullet.x + bullet.w / 2;
  const cy = bullet.y + bullet.h / 2;

  pen.strokeStyle = 'rgba(255, 214, 142, .8)';
  pen.lineWidth = 3;
  pen.lineCap = 'round';
  pen.beginPath();
  pen.moveTo(cx - Math.cos(along) * 22, cy - Math.sin(along) * 22);
  pen.lineTo(cx, cy);
  pen.stroke();

  pen.fillStyle = '#fff2cf';
  pen.beginPath();
  pen.arc(cx, cy, 3.5, 0, Math.PI * 2);
  pen.fill();
}

function drawBoom(boom) {
  if (!isBoom(boom)) return;
  const left = Math.max(0, Math.min(1, boom.life / BOOM_LIFE));

  pen.save();
  pen.globalAlpha = left;
  const fire = pen.createRadialGradient(boom.x, boom.y, 0, boom.x, boom.y, boom.radius);
  fire.addColorStop(0, 'rgba(255, 246, 214, .95)');
  fire.addColorStop(0.45, 'rgba(255, 176, 62, .75)');
  fire.addColorStop(1, 'rgba(190, 62, 26, 0)');
  pen.fillStyle = fire;
  pen.beginPath();
  pen.arc(boom.x, boom.y, boom.radius, 0, Math.PI * 2);
  pen.fill();

  pen.strokeStyle = 'rgba(255, 226, 168, .7)';
  pen.lineWidth = 2.5;
  pen.beginPath();
  pen.arc(boom.x, boom.y, boom.radius * 0.92, 0, Math.PI * 2);
  pen.stroke();
  pen.restore();
}

/* The card that covers the sky before the game and after it. */
function drawCurtain() {
  pen.fillStyle = 'rgba(10, 14, 10, .64)';
  pen.fillRect(0, 0, WIDTH, HEIGHT);
  pen.textAlign = 'center';
  pen.fillStyle = '#ded2ae';
  pen.font = "700 60px 'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif";

  if (phase === 'waiting') {
    pen.fillText('LOOKOUT POST', WIDTH / 2, 296);
    pen.font = "26px 'Trebuchet MS', sans-serif";
    pen.fillText('Aim with the mouse. Click to fire.', WIDTH / 2, 358);
    pen.fillText('Three troopers reaching the post takes it.', WIDTH / 2, 398);
    pen.fillStyle = '#ffd68e';
    pen.fillText('Press Start', WIDTH / 2, 468);
  } else if (phase === 'paused') {
    pen.fillText('PAUSED', WIDTH / 2, 360);
  } else {
    pen.fillText('POST LOST', WIDTH / 2, 296);
    pen.font = "34px 'Trebuchet MS', sans-serif";
    pen.fillStyle = '#ffd68e';
    pen.fillText(score === 1 ? '1 point' : score + ' points', WIDTH / 2, 368);
    pen.font = "26px 'Trebuchet MS', sans-serif";
    pen.fillStyle = '#ded2ae';
    pen.fillText('Press Play again', WIDTH / 2, 438);
  }
  pen.textAlign = 'left';
}

/* The whole picture, drawn again from the memory, every frame. */
function render() {
  drawBackdrop();
  for (const plane of planes) drawSprite(plane);
  for (const trooper of troopers) drawSprite(trooper);
  drawPost(aim);
  for (const bullet of bullets) drawSprite(bullet);
  for (const boom of booms) drawBoom(boom);
  if (phase !== 'playing') drawCurtain();
  renderStates();
  renderFigures();
  renderBags();
  renderKeys();
}

/* The Troopers panel: the state machine, counted and drawn as bars. */
function renderStates() {
  const counts = [countState('falling'), countState('chute'), countState('walking')];
  const els = [[fallCountEl, fallBarEl], [chuteCountEl, chuteBarEl], [walkCountEl, walkBarEl]];
  for (let i = 0; i < 3; i += 1) {
    els[i][0].textContent = counts[i];
    els[i][1].style.width = Math.min(100, counts[i] * 20) + '%';
  }
}

function renderFigures() {
  angleReadEl.textContent = Math.round(-aim * 180 / Math.PI);
  scoreReadEl.textContent = score;
  planeCountEl.textContent = planes.length;
  trooperCountEl.textContent = troopers.length;
  bulletCountEl.textContent = bullets.length;
  boomCountEl.textContent = booms.length;
}

function renderBags() {
  if (sandbagsEl.children.length !== START_BAGS) {
    sandbagsEl.textContent = '';
    for (let i = 0; i < START_BAGS; i += 1) {
      sandbagsEl.appendChild(document.createElement('span'));
    }
  }
  for (let i = 0; i < START_BAGS; i += 1) {
    sandbagsEl.children[i].className = i < bags ? 'sandbag' : 'sandbag sandbag-gone';
  }
}

function renderKeys() {
  startBtn.disabled = phase === 'over';
  startBtn.firstChild.nodeValue = phase === 'playing' ? 'Pause ' : 'Start ';
  againBtn.disabled = phase === 'waiting';
  normalBtn.setAttribute('aria-pressed', String(timeScale === 1));
  slowBtn.setAttribute('aria-pressed', String(timeScale !== 1));
}

/* --- The mouse ---

   Where on the sky is the mouse? This is the canvasPoint you wrote in
   project 6 and used again in project 7, word for word. */
function skyPoint(event) {
  const box = sky.getBoundingClientRect();
  return {
    x: (event.clientX - box.left) * sky.width / box.width,
    y: (event.clientY - box.top) * sky.height / box.height
  };
}

sky.addEventListener('pointermove', (event) => {
  aim = clampAim(aimAngle(POST, skyPoint(event)));
});

sky.addEventListener('pointerdown', (event) => {
  aim = clampAim(aimAngle(POST, skyPoint(event)));
  fire();
});

function fire() {
  if (phase !== 'playing' || cooldown > 0) return;
  const bullet = makeBullet(aim);
  bulletsMissing = !isSprite(bullet);
  if (bulletsMissing) {
    say('makeBullet() is still empty, so the gun has nothing to fire.');
    return;
  }
  bullets.push(bullet);
  fired += 1;
  cooldown = 0.2;
  playSound(fireSound);
}

/* --- The keys --- */

/* Putting the memory back to the start. You wrote this one yourself in
   project 7, so here it is finished. Four lists emptied, two numbers
   put back. */
function resetGame() {
  planes = [];
  troopers = [];
  bullets = [];
  booms = [];
  score = 0;
  bags = START_BAGS;
  fired = 0;
  fellThrough = 0;
  troopersMissing = false;
  bulletsMissing = false;
  boomsMissing = false;
  planeTimer = 0.8;
}

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
  resetGame();
  phase = 'playing';
  playSound(startSound);
  say('A fresh watch. Aim with the mouse.');
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
  const testPlane = { kind: 'plane', x: 100, y: 100, w: 132, h: 38, vx: 0, vy: 0, state: 'flying' };
  const testTrooper = { kind: 'trooper', x: 100, y: 100, w: TROOPER_W, h: TROOPER_H, vx: 0, vy: 0, state: 'falling' };
  moveTrooper(testTrooper, 1);
  const testBoom = { kind: 'boom', x: 0, y: 0, radius: 14, life: BOOM_LIFE };
  updateBoom(testBoom, 0.1);

  if (!isSprite(makeTrooper(testPlane))) {
    makeTrooper = (plane) => ({
      kind: 'trooper',
      x: plane.x + plane.w / 2 - TROOPER_W / 2,
      y: plane.y + plane.h,
      w: TROOPER_W,
      h: TROOPER_H,
      vx: 0,
      vy: 0,
      state: 'falling'
    });
  }
  if (testTrooper.y === 100) {
    moveTrooper = (trooper, seconds) => {
      if (trooper.state === 'falling') {
        trooper.vy += GRAVITY * seconds;
        trooper.y += trooper.vy * seconds;
      } else if (trooper.state === 'chute') {
        trooper.y += CHUTE_SPEED * seconds;
      } else if (trooper.state === 'walking') {
        trooper.x += towardsPost(trooper.x) * WALK_SPEED * seconds;
      }
    };
  }
  if (nextTrooperState({ state: 'falling', y: CHUTE_AT + 10, h: TROOPER_H }) !== 'chute') {
    nextTrooperState = (trooper) => {
      if (trooper.state === 'falling' && trooper.y > CHUTE_AT) return 'chute';
      if (trooper.state === 'chute' && trooper.y + trooper.h >= GROUND) return 'walking';
      return trooper.state;
    };
  }
  if (reachedThePost({ state: 'walking', x: POST.x, w: 0 }) !== true) {
    reachedThePost = (trooper) =>
      trooper.state === 'walking' && Math.abs(trooper.x + trooper.w / 2 - POST.x) < REACH;
  }
  if (!isSprite(makeBullet(-Math.PI / 2))) {
    makeBullet = (angle) => {
      const start = muzzlePoint(angle);
      return {
        kind: 'bullet',
        x: start.x - BULLET_W / 2,
        y: start.y - BULLET_H / 2,
        w: BULLET_W,
        h: BULLET_H,
        vx: Math.cos(angle) * BULLET_SPEED,
        vy: Math.sin(angle) * BULLET_SPEED,
        state: 'flying'
      };
    };
  }
  if (bulletIsGone({ x: 0, y: -200, w: 9, h: 9 }) !== true) {
    bulletIsGone = (bullet) =>
      bullet.y < -40 || bullet.y > HEIGHT + 40 || bullet.x < -40 || bullet.x > WIDTH + 40;
  }
  if (hitsSprite({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }) !== true) {
    hitsSprite = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }
  if (!isBoom(makeBoom(0, 0))) {
    makeBoom = (x, y) => ({ kind: 'boom', x: x, y: y, radius: 14, life: BOOM_LIFE });
  }
  if (testBoom.radius === 14) {
    updateBoom = (boom, seconds) => {
      boom.radius += BOOM_GROWTH * seconds;
      boom.life -= seconds;
    };
  }

  if (location.hash === '#demo-over') {
    score = 23;
    bags = 0;
    phase = 'over';
    say('Demo: the post fell after three troopers reached it.');
  } else {
    planes.push(makePlane());
    planes[0].x = 120;
    planes[0].y = 110;
    planes[0].vx = 120;
    const placed = [
      { x: 300, y: 150, state: 'falling' },
      { x: 742, y: 196, state: 'falling' },
      { x: 178, y: 372, state: 'chute' },
      { x: 866, y: 316, state: 'chute' },
      { x: 108, y: GROUND - TROOPER_H, state: 'walking' }
    ];
    for (const spot of placed) {
      const trooper = makeTrooper(planes[0]);
      trooper.x = spot.x;
      trooper.y = spot.y;
      trooper.state = spot.state;
      troopers.push(trooper);
    }
    booms.push(makeBoom(700, 300));
    score = 9;
    bags = 2;
    phase = 'playing';
    say('Demo: the finished game. Aim with the mouse, click to fire.');
  }
} else {
  say('Press Start. The planes drop nothing yet. makeTrooper() changes that.');
}

requestAnimationFrame(frame);


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the functions you have to write.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- makeTrooper(plane) ---

     return {
       kind: 'trooper',
       x: plane.x + plane.w / 2 - TROOPER_W / 2,
       y: plane.y + plane.h,
       w: TROOPER_W,
       h: TROOPER_H,
       vx: 0,
       vy: 0,
       state: 'falling'
     };


   --- moveTrooper(trooper, seconds) ---

     if (trooper.state === 'falling') {
       trooper.vy += GRAVITY * seconds;
       trooper.y += trooper.vy * seconds;
     } else if (trooper.state === 'chute') {
       trooper.y += CHUTE_SPEED * seconds;
     } else if (trooper.state === 'walking') {
       trooper.x += towardsPost(trooper.x) * WALK_SPEED * seconds;
     }


   --- nextTrooperState(trooper) ---

     if (trooper.state === 'falling' && trooper.y > CHUTE_AT) return 'chute';
     if (trooper.state === 'chute' && trooper.y + trooper.h >= GROUND) return 'walking';
     return trooper.state;


   --- reachedThePost(trooper) ---

     return trooper.state === 'walking'
       && Math.abs(trooper.x + trooper.w / 2 - POST.x) < REACH;


   --- makeBullet(angle) ---

     const start = muzzlePoint(angle);
     return {
       kind: 'bullet',
       x: start.x - BULLET_W / 2,
       y: start.y - BULLET_H / 2,
       w: BULLET_W,
       h: BULLET_H,
       vx: Math.cos(angle) * BULLET_SPEED,
       vy: Math.sin(angle) * BULLET_SPEED,
       state: 'flying'
     };


   --- bulletIsGone(bullet) ---

     return bullet.y < -40 || bullet.y > HEIGHT + 40
       || bullet.x < -40 || bullet.x > WIDTH + 40;


   --- hitsSprite(a, b) ---

     return a.x < b.x + b.w
       && a.x + a.w > b.x
       && a.y < b.y + b.h
       && a.y + a.h > b.y;


   --- makeBoom(x, y) ---

     return { kind: 'boom', x: x, y: y, radius: 14, life: BOOM_LIFE };


   --- updateBoom(boom, seconds) ---

     boom.radius += BOOM_GROWTH * seconds;
     boom.life -= seconds;

   --------------------------------------------------------------------- */
