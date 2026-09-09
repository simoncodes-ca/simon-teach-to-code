/* =====================================================================
   Simon's Lookout Post, Mark II — the same game, built on Phaser.

   You already wrote this game. Project 8 is the same post, the same
   planes, the same troopers and the same sandbags. Nothing about the
   game has changed.

   What changed is who writes the boring parts. Phaser is a **game
   library**: a big pile of code somebody else wrote, that you are
   allowed to use. It brings the game loop, the moving, the collision
   test and the pictures with it.

   So this file is much shorter than parachuters.js, and there are
   eight things to fill in instead of nine.

   Write them in this order:
      1. loadArt         — tell Phaser which pictures to fetch
      2. dropTrooper     — a trooper leaves the plane
      3. openChute       — the cord is pulled
      4. landTrooper     — boots down, and he walks at you
      5. watchTheGate    — notice a trooper reaching the post
      6. fireShell       — send a shell out of the barrel
      7. watchForHits    — notice a shell hitting something
      8. boom            — a bloom of fire that puts itself away

   Keep parachuters.js open in another window while you work. Every
   function here has one in there to compare it with, and the
   comparison is the whole project.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   The numbers are the ones from project 8, unchanged. The lists are
   not lists any more.

   **A group is Phaser's word for a list of sprites.** It does the job
   your four arrays did, and a bit more: it makes the sprites, it keeps
   them, and it hands the whole group to the collision code in one go.

   Three groups here instead of four lists. The explosions have no
   group at all, because each one now puts itself away. You will see
   why in the last function.

   Three other things moved, and they catch everybody out once:

       x and y are the **middle** of a sprite again, not the top left
       corner. Project 8 used a corner because you were doing the box
       sums yourself. Phaser does them for you, so it puts the sprite
       where you would point at it.

       velocity is not yours any more. You set `vx` and `vy` in project
       8 and then moved the sprite by them every frame. Here you say
       `sprite.setVelocityX(90)` **once**, and Phaser moves it from
       then on, on every frame, for ever.

       the state is already there. Every Phaser sprite has a `state` of
       its own, waiting to be used. `trooper.setState('chute')` puts a
       word in it and `trooper.state` reads it back. It is the same
       state machine you built in project 8, in a box the library
       already provided.
   --------------------------------------------------------------------- */

const WIDTH = 1024;              // the sky is always this wide, whatever size it looks
const HEIGHT = 768;              // and always this tall
const GROUND = 662;              // the height of the ground the troopers land on

const POST = { x: 512, y: 620 }; // where the gun turns, on top of the sandbags
const BARREL = 74;               // how long the gun barrel is, in pixels

const GRAVITY = 420;             // how much a falling trooper speeds up each second
const CHUTE_AT = 300;            // a chute opens once the trooper is this far down
const CHUTE_SPEED = 62;          // how fast a trooper drops under an open chute
const WALK_SPEED = 46;           // how fast a landed trooper walks at the post
const REACH = 70;                // how close he has to get to take a sandbag

const SHELL_SPEED = 900;         // how fast a shell leaves the barrel, in pixels per second

const TROOPER_W = 26;            // how wide a trooper's box is
const TROOPER_H = 34;            // how tall a trooper's box is
const SHELL_BOX = 10;            // a shell's box is small and square

const START_BAGS = 3;            // how many sandbags the post has
const PLANE_EVERY = 4.2;         // seconds between one plane and the next

let planes = null;               // the group of planes crossing the sky
let troopers = null;             // the group of troopers in the air or on the ground
let shells = null;               // the group of shells in the air

let score = 0;                   // points for troopers and planes destroyed
let bags = START_BAGS;           // sandbags left on the post
let aim = -Math.PI / 2;          // the angle the gun points, in radians. This is straight up


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Eight small functions. Fill them in from the top down.

   Every one of them is handed `scene` or a sprite to work on. A
   **scene** is Phaser's word for one screen of a game: this whole
   window is one scene. Everything the library can do for you, it does
   through the scene, so `scene` turns up as the first word of a lot of
   these lines.

   Each function gives you two hints. Read the gentle hint first. All
   the answers sit in one block at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * Tell Phaser which pictures this game needs.
 *
 * In project 8 you drew every plane and every trooper yourself, with
 * lines and arcs, sixty times a second. This game does not draw
 * anything. It uses pictures, and the pictures are already made — look
 * in the `assets` folder and open a few.
 *
 * The pictures are exactly the ones project 8 drew. They were made by
 * running that drawing code once and saving what came out.
 *
 * Loading a picture is one line, and it takes two things: a **key**,
 * which is the short name you will call it by, and the path to the
 * file.
 *
 *     scene.load.image('plane', 'assets/plane.png');
 *
 * From then on the word 'plane' means that picture, anywhere in the
 * game. You need five:
 *
 *     'plane'           assets/plane.png
 *     'trooper-fall'    assets/trooper-fall.png
 *     'trooper-chute'   assets/trooper-chute.png
 *     'shell'           assets/shell.png
 *     'boom'            assets/boom.png
 *
 * Phaser fetches all five before the game starts, so nothing ever has
 * to wait for a picture in the middle of a frame. That waiting is most
 * of what a library is for.
 *
 * Gentle hint: five lines, all the same shape. Copy the line above and
 *   change the two words in it.
 * Stronger hint: `scene.load.image('trooper-fall',
 *   'assets/trooper-fall.png');` and four more like it.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Press Start. The green boxes crossing the sky turn into planes. A
 * green box is what Phaser draws when you ask for a picture it has
 * never heard of.
 */
function loadArt(scene) {
  // TODO: load the five pictures, each with its key and its path.
}

/**
 * Drop one trooper out of the belly of this plane. Hand him back.
 *
 * This is `makeTrooper` from project 8, and it is worth putting the
 * two side by side. That one built an object and handed it to the
 * wiring, which pushed it onto an array. This one asks the group to
 * make the sprite, and the group keeps it:
 *
 *     const trooper = troopers.create(x, y, 'trooper-fall');
 *
 * Three things happened in that one line. Phaser made a sprite, gave
 * it the picture, and put it in the group. It also gave it a body,
 * which is the invisible box the collision code uses.
 *
 * Where does he start? Under the middle of the plane. x and y are the
 * middle of a sprite now, so the middle of the plane is simply
 * `plane.x`, with nothing to add or take off. Start him a little below
 * it, about 24 pixels, so he clears the wing.
 *
 * Then two more lines:
 *
 *     he starts in the 'falling' state       trooper.setState('falling')
 *     gravity pulls on him from now on       trooper.setGravityY(GRAVITY)
 *
 * That second line is the one to stop on. In project 8 gravity was a
 * line inside `moveTrooper` that ran sixty times a second. Here you
 * say it **once**, and it is true for the rest of his life.
 *
 * Finish with `return trooper;` so the wiring can see he arrived.
 *
 * Gentle hint: four lines. Make him with `troopers.create`, set his
 *   state, switch his gravity on, then return him.
 * Stronger hint: `const trooper = troopers.create(plane.x, plane.y +
 *   24, 'trooper-fall');` then `trooper.setState('falling');` then
 *   `trooper.setGravityY(GRAVITY);` then `return trooper;`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Troopers drop out of the planes and fall, and they keep falling
 * straight past the ground and out of the bottom of the sky. Nobody
 * has told them when to pull the cord.
 */
function dropTrooper(scene, plane) {
  // TODO: make a trooper under the plane, start him falling, return him.
  return null;
}

/**
 * Pull this trooper's cord. He is under a chute from now on.
 *
 * The wiring watches every trooper and calls this the moment one falls
 * past CHUTE_AT. So this function is only ever asked to make the
 * change. It never has to decide whether the change is due.
 *
 * That is the real difference from project 8. There you wrote
 * `moveTrooper`, which ran every frame and moved him by the rule his
 * state asked for. Here there is no `moveTrooper` at all. You speak
 * once, at the moment things change, and Phaser keeps doing it.
 *
 * Four things change when a chute opens:
 *
 *     the state becomes 'chute'          trooper.setState('chute')
 *     the picture becomes the one with a canopy on it
 *                                        trooper.setTexture('trooper-chute')
 *     gravity stops pulling on him       trooper.setGravityY(0)
 *     he drops at CHUTE_SPEED, and never faster
 *                                        trooper.setVelocityY(CHUTE_SPEED)
 *
 * Turning the gravity off matters. Leave it on and he speeds up under
 * the chute anyway, which is a chute made of nothing.
 *
 * Gentle hint: all four lines are written above. You only have to
 *   choose the order, and any order works.
 * Stronger hint: `trooper.setState('chute');` then
 *   `trooper.setTexture('trooper-chute');` then
 *   `trooper.setGravityY(0);` then `trooper.setVelocityY(CHUTE_SPEED);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Chutes snap open halfway down and the troopers come down slowly.
 * They still walk straight into the ground and keep going, though.
 * Watch the Troopers panel: the count moves from Falling to Chute as
 * it happens.
 */
function openChute(trooper) {
  // TODO: put him under a chute: state, picture, gravity, speed.
}

/**
 * This trooper's boots have touched the ground. Stand him up and start
 * him walking at the post.
 *
 * The wiring has already put him at ground level. Your job is what he
 * does next.
 *
 * A helper you know is written for you further down the file:
 *
 *     towardsPost(x)     -1 if the post is to the left, 1 if it is to
 *                        the right
 *
 * Four things change:
 *
 *     the state becomes 'walking'
 *     he stops going down                   setVelocityY(0)
 *     he walks sideways, the right way      setVelocityX(towardsPost(...) * WALK_SPEED)
 *     the walking picture flips if he is walking left
 *                                           setFlipX(towardsPost(...) < 0)
 *
 * Then one line that is new, and is the reason a library is worth
 * having:
 *
 *     trooper.play('walk');
 *
 * 'walk' is an **animation**: two pictures, swapped over and over, six
 * times a second. It is set up for you further down, next to the two
 * files it uses. One `play` and he keeps marching until something
 * stops him.
 *
 * Gentle hint: five lines. Set the state, stop him falling, send him
 *   sideways, flip the picture if he is going left, then play the
 *   walk.
 * Stronger hint: `trooper.setState('walking');` then
 *   `trooper.setVelocityY(0);` then
 *   `trooper.setVelocityX(towardsPost(trooper.x) * WALK_SPEED);` then
 *   `trooper.setFlipX(towardsPost(trooper.x) < 0);` then
 *   `trooper.play('walk');`
 * Stuck? The answer key is at the bottom of this file.
 *
 * The troopers land on their feet and march at you, arms and legs
 * going. They walk straight through the post and out of the far side,
 * because nothing is watching for them arriving.
 */
function landTrooper(trooper) {
  // TODO: stand him up and walk him at the post.
}

/**
 * Ask Phaser to tell you when a trooper reaches the post.
 *
 * This is the first of two functions that replace `hitsSprite`, and it
 * is worth reading all of the comment before you write the line.
 *
 * In project 8 you wrote the box test yourself, and the wiring called
 * it inside two loops, once per pair, every frame. All of that is
 * gone. You now say what you care about **once**, when the game
 * starts, and Phaser watches for it from then on:
 *
 *     scene.physics.add.overlap(a, b, whatToDo);
 *
 * Read it as a sentence: whenever something in `a` overlaps something
 * in `b`, call `whatToDo`. It takes single sprites or whole groups, so
 * one line covers every pair in two groups.
 *
 * Here, `a` is the `troopers` group. `b` is `gate`, an invisible box
 * standing over the sandbags, made for you further down. And
 * `whatToDo` is `trooperAtPost`, also written for you: it takes the
 * sandbag and plays the sound.
 *
 * Pass the function by name, with no brackets after it. `trooperAtPost`
 * hands Phaser the function. `trooperAtPost()` would run it now, once,
 * which is not what you want at all.
 *
 * Gentle hint: one line. The three things going into it are `troopers`,
 *   `gate` and `trooperAtPost`.
 * Stronger hint: `scene.physics.add.overlap(troopers, gate,
 *   trooperAtPost);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * A trooper who reaches you now takes a sandbag with him, and the post
 * panel loses one. Lose all three and the post is gone. You still have
 * nothing to shoot with.
 */
function watchTheGate(scene) {
  // TODO: watch for a trooper overlapping the gate.
}

/**
 * Fire a shell out of the barrel, along this angle. Hand it back.
 *
 * This is `makeBullet` from project 8. A shell still flies in a
 * straight line and still has no gravity.
 *
 * Two things are written for you further down the file:
 *
 *     muzzlePoint(angle)      where the end of the barrel is
 *     shells                  the group the shell belongs in
 *
 * Start by making it at the muzzle, the same way you made the trooper:
 *
 *     const start = muzzlePoint(angle);
 *     const shell = shells.create(start.x, start.y, 'shell');
 *
 * Then it needs a velocity. You could work it out with `Math.cos` and
 * `Math.sin`, exactly as in project 8, and it would be right. Phaser
 * has the sum in a drawer:
 *
 *     scene.physics.velocityFromRotation(angle, SHELL_SPEED,
 *                                        shell.body.velocity);
 *
 * Read that as: take this angle and this speed, work out the sideways
 * and downwards parts, and put them straight into the shell's
 * velocity. It is the two lines you wrote in project 7, with a name.
 *
 * One line of tidying at the end, because the shell is a picture now
 * and pictures point somewhere:
 *
 *     shell.setRotation(angle);
 *
 * Then `return shell;` so the wiring can see it left the barrel.
 *
 * Gentle hint: five lines, and four of them are written above.
 * Stronger hint: muzzle, create, velocityFromRotation, setRotation,
 *   return.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Click on the sky and a shell streaks out of the barrel. It goes
 * straight through everything it meets.
 */
function fireShell(scene, angle) {
  // TODO: make a shell at the muzzle and send it along the angle.
  return null;
}

/**
 * Ask Phaser to tell you when a shell hits something.
 *
 * Two lines, both the same shape as the one in `watchTheGate`. Two
 * things can be shot:
 *
 *     a shell overlapping a trooper   →   shellHitsTrooper
 *     a shell overlapping a plane     →   shellHitsPlane
 *
 * Both of those functions are written for you further down. They score
 * the hit, destroy what was hit, and set off the explosion.
 *
 * Put the groups in the order the function names read. `overlap(shells,
 * troopers, shellHitsTrooper)` hands the shell to the function first
 * and the trooper second, because that is the order you named them.
 * Swap the groups and the two arrive the wrong way round.
 *
 * Now count what those two lines replaced. In project 8 this was
 * `hitsSprite`, plus two loops running backwards through two lists,
 * plus a `struck` flag to stop one shell hitting two things. Every
 * frame. That is the trade a library offers you, and this is the
 * clearest look at it you will get.
 *
 * Gentle hint: two lines, both `scene.physics.add.overlap(...)`.
 * Stronger hint: `scene.physics.add.overlap(shells, troopers,
 *   shellHitsTrooper);` and `scene.physics.add.overlap(shells, planes,
 *   shellHitsPlane);`
 * Stuck? The answer key is at the bottom of this file.
 *
 * Shells knock troopers out of the sky now, and a plane is worth five.
 * Every hit leaves nothing behind, though, which looks wrong.
 */
function watchForHits(scene) {
  // TODO: watch for a shell overlapping a trooper, then a plane.
}

/**
 * Set off an explosion at this point.
 *
 * The wiring calls this with the middle of whatever was just
 * destroyed.
 *
 * In project 8 an explosion was two functions and a fourth list.
 * `makeBoom` built it, `updateBoom` grew it and burned its life down
 * every frame, and the wiring threw away the dead ones. Here it is one
 * picture and one **tween**.
 *
 * A tween is a change, spread over time. You say what to change, what
 * it should end up as, and how long it may take. Phaser does every
 * frame in between.
 *
 * Start with the picture, small:
 *
 *     const fire = scene.add.image(x, y, 'boom').setScale(0.2);
 *
 * `setScale(0.2)` means a fifth of its real size. Then the tween:
 *
 *     scene.tweens.add({
 *       targets: fire,
 *       scale: 1.1,
 *       alpha: 0,
 *       duration: 450,
 *       onComplete: () => fire.destroy()
 *     });
 *
 * Read the parts. `targets` is what changes. `scale` and `alpha` are
 * where they end up, so it grows and fades at the same time.
 * `duration` is in **milliseconds**, so 450 is 0.45 of a second — the
 * same BOOM_LIFE as project 8. And `onComplete` runs once at the end,
 * where the explosion throws itself away.
 *
 * That last line is why there is no fourth group. A thing that tidies
 * itself up never needs a list to be tidied out of.
 *
 * Gentle hint: two statements. Add the image small, then tween it
 *   bigger and see-through.
 * Stronger hint: both of them are written above, in order.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The explosions bloom and fade, and the game is finished. Eight
 * functions instead of nine, and much shorter ones. Open
 * `08-parachuters/parachuters.js` beside this file and see what you
 * are no longer writing.
 */
function boom(scene, x, y) {
  // TODO: add the picture small, then tween it big and see-through.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is finished already. It sets Phaser up, spawns the planes,
   watches for the two moments a trooper changes state, works the keys
   and keeps the rack up to date.

   Read it, because it shows you where your eight functions get used.
   Do not change it.
   --------------------------------------------------------------------- */

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
const shellCountEl = document.getElementById('shellCount');
const normalBtn = document.getElementById('normalSpeed');
const slowBtn = document.getElementById('slowSpeed');
const startBtn = document.getElementById('start');
const againBtn = document.getElementById('again');
const statusEl = document.getElementById('status');

/* The sounds. Exactly the pattern from every project since the
   calculator: one Audio object per sound, made once and used again.
   Phaser has a sound system of its own, and we are not using it. One
   new idea at a time. */
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

/* Things the game needs that are not part of the game itself. */
const DEMO = location.hash === '#demo' || location.hash === '#demo-over';
let scene = null;               // the one scene, once Phaser has built it
let barrel = null;              // the gun barrel, a picture that turns
let aimLine = null;             // the dashes out along the aim
let gate = null;                // the invisible box over the sandbags
let curtain = null;             // the card before and after a game
let phase = 'waiting';          // 'waiting', 'playing', 'paused' or 'over'
let timeScale = 1;              // 1 is normal. Slow motion makes it 0.3
let planeTimer = 0.8;           // seconds until the next plane
let cooldown = 0;               // seconds until the gun can fire again
let drops = 0;                  // how many troopers have left a plane this game
let message = '';

/* One flag per function you have to write. The wiring sets these as it
   goes, and the status line under the window reads them. */
const missing = {
  loadArt: false,
  dropTrooper: false,
  openChute: false,
  landTrooper: false,
  watchTheGate: false,
  fireShell: false,
  watchForHits: false,
  boom: false
};

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

/* The angle from one point to another. Yours, from project 7. */
function aimAngle(from, to) {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

/* The gun sits on sandbags, so it cannot point down into them. */
function clampAim(angle) {
  const limit = 0.12;
  if (angle > 0) return angle < Math.PI / 2 ? -limit : -Math.PI + limit;
  return Math.max(-Math.PI + limit, Math.min(-limit, angle));
}

/* Did that function really hand back a sprite? An empty one hands back
   null instead, and the status line says so. */
function isSprite(thing) {
  return thing instanceof Phaser.GameObjects.Sprite;
}

/* How many things is Phaser watching for overlaps? The wiring counts
   this before and after your two watch functions, to see whether they
   did anything. */
function watchCount(aScene) {
  aScene.physics.world.colliders.update();
  return aScene.physics.world.colliders.getActive().length;
}

/* --- Setting Phaser up ---

   A Phaser game is a settings object and three functions. `preload`
   fetches the pictures, `create` builds the scene once, and `update`
   runs every frame. Phaser calls all three at the right moment. That
   is the loop you wrote by hand in projects 7 and 8. */
new Phaser.Game({
  /* Phaser draws on the same 2D canvas as projects 6, 7 and 8, and
     that canvas is still the one in remake.html. Handing Phaser a
     canvas of your own means naming the renderer yourself. */
  type: Phaser.CANVAS,
  canvas: document.getElementById('sky'),
  width: WIDTH,
  height: HEIGHT,
  /* Fetch pictures the way an ordinary <img> tag does. Phaser's usual
     way is blocked when a page is opened straight off the disk, and
     this project still has to work by double-clicking the file. */
  loader: { imageLoadType: 'HTMLImageElement' },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } }
  },
  scene: { preload: preload, create: create, update: update }
});

function preload() {
  const before = this.load.list.size;
  loadArt(this);
  missing.loadArt = this.load.list.size === before;

  /* The scenery, and the two pictures the walking animation swaps
     between. These are given so your five stay one shape. */
  this.load.image('sky', 'assets/sky.png');
  this.load.image('post', 'assets/post.png');
  this.load.image('barrel', 'assets/barrel.png');
  this.load.image('trooper-walk-a', 'assets/trooper-walk-a.png');
  this.load.image('trooper-walk-b', 'assets/trooper-walk-b.png');

  if (DEMO && missing.loadArt) {
    standInForArt(this);
    missing.loadArt = false;
  }
}

function create() {
  scene = this;

  /* The sky, the gun and the sandbags, in that order back to front. */
  this.add.image(0, 0, 'sky').setOrigin(0, 0).setDepth(-10);
  aimLine = this.add.graphics().setDepth(2);
  barrel = this.add.image(POST.x, POST.y, 'barrel').setOrigin(0.12, 0.5).setDepth(3);
  this.add.image(POST.x - 100, POST.y - 20, 'post').setOrigin(0, 0).setDepth(4);

  /* The three groups. `physics.add.group` makes a group whose sprites
     all have a body, so every one of them can move and collide.

     A trooper's picture is bigger than the trooper, because the chute
     has to fit on it. `createCallback` runs on every sprite the group
     makes, and gives each one a body the size of the man inside the
     picture. Otherwise a shell would hit the empty air above his
     head. */
  planes = this.physics.add.group();
  troopers = this.physics.add.group({
    createCallback: (trooper) => trooper.body.setSize(TROOPER_W, TROOPER_H)
  });
  shells = this.physics.add.group({
    createCallback: (shell) => shell.body.setSize(SHELL_BOX, SHELL_BOX)
  });

  /* The walking animation: two pictures, swapped six times a second,
     for ever. `landTrooper` starts it with trooper.play('walk'). */
  this.anims.create({
    key: 'walk',
    frames: [{ key: 'trooper-walk-a' }, { key: 'trooper-walk-b' }],
    frameRate: 6,
    repeat: -1
  });

  /* The gate: an invisible box standing over the sandbags. Nothing
     draws it and nothing bounces off it. It is there so `watchTheGate`
     has something to watch.

     It is a group holding one box, rather than a lone box, and that is
     on purpose. Phaser hands an overlap of two groups to your function
     in the order you named them. Pair a group with a lone sprite and
     the two arrive the other way round. Two groups keeps every overlap
     in this game reading the same way. */
  gate = this.physics.add.staticGroup();
  const gateBox = gate.create(POST.x, GROUND - 60, 'post');
  gateBox.setVisible(false);
  gateBox.body.setSize(REACH * 2, 140);

  buildCurtain(this);

  /* The mouse. Phaser hands you a pointer whose x and y are already in
     the sky's own coordinates, so `skyPoint` from projects 6 and 7 is
     one more function you no longer write. */
  this.input.on('pointermove', (pointer) => {
    aim = clampAim(aimAngle(POST, pointer));
  });
  this.input.on('pointerdown', (pointer) => {
    aim = clampAim(aimAngle(POST, pointer));
    fire();
  });

  if (DEMO) standInForEmptyFunctions(this);

  /* Your two watch functions, called once each, here at the start.
     The count before and after says whether they did anything. */
  let watching = watchCount(this);
  watchTheGate(this);
  missing.watchTheGate = watchCount(this) === watching;
  if (DEMO && missing.watchTheGate) {
    this.physics.add.overlap(troopers, gate, trooperAtPost);
    missing.watchTheGate = false;
  }

  watching = watchCount(this);
  watchForHits(this);
  missing.watchForHits = watchCount(this) === watching;
  if (DEMO && missing.watchForHits) {
    this.physics.add.overlap(shells, troopers, shellHitsTrooper);
    this.physics.add.overlap(shells, planes, shellHitsPlane);
    missing.watchForHits = false;
  }

  if (DEMO) setUpDemo(this);
  else say('Press Start. Phaser has no pictures yet. loadArt() changes that.');
}

/* One step of the game.

   Phaser calls this every frame and hands you the time since the last
   one, in milliseconds. Dividing by 1000 gives the `seconds` you used
   in projects 7 and 8.

   Notice how little is left in here. Nothing moves anything. Phaser
   moved every plane, every trooper and every shell before this
   function was called, because you told each one its velocity once.
   What is left is the game's own rules. */
function update(time, delta) {
  const seconds = (delta / 1000) * timeScale;

  barrel.setRotation(aim);
  drawAimLine();
  updateRack();

  if (phase !== 'playing') return;

  planeTimer -= seconds;
  cooldown -= seconds;

  /* A new plane, now and then. */
  if (planeTimer <= 0) {
    planeTimer = PLANE_EVERY;
    if (planes.getLength() < 4) startPlane();
  }

  /* Each plane over the middle of the sky lets a trooper go. */
  for (const plane of planes.getChildren()) {
    if (plane.x < 40 || plane.x > WIDTH - 40) continue;
    plane.dropTimer -= seconds;
    if (plane.dropTimer > 0 || plane.dropsLeft <= 0) continue;
    plane.dropTimer = 0.9;
    plane.dropsLeft -= 1;
    drops += 1;
    missing.dropTrooper = !isSprite(dropTrooper(this, plane));
  }

  /* The two moments a trooper changes state. This is the deciding half
     of project 8's `nextTrooperState`, and it is given because you
     wrote it there. The moving half has gone completely. */
  for (const trooper of troopers.getChildren()) {
    if (trooper.state === 'falling' && trooper.y > CHUTE_AT) {
      openChute(trooper);
      missing.openChute = trooper.state !== 'chute';
      if (!missing.openChute) playSound(chuteSound);
    } else if (trooper.state === 'chute' && trooper.y + TROOPER_H / 2 >= GROUND) {
      trooper.y = GROUND - TROOPER_H / 2;
      landTrooper(trooper);
      missing.landTrooper = trooper.state !== 'walking';
    }
  }

  retire(planes, (plane) => plane.x < -110 || plane.x > WIDTH + 110);
  retire(troopers, (trooper) => trooper.y > HEIGHT + 60 || trooper.x < -60 || trooper.x > WIDTH + 60);

  /* Phaser does not throw a shell away when it leaves the sky, so this
     part is still yours. A library does some of the work, not all of
     it, and knowing which is which is the skill. */
  retire(shells, (shell) =>
    shell.x < -40 || shell.x > WIDTH + 40 || shell.y < -40 || shell.y > HEIGHT + 40);

  reportEmptyFunctions();
}

/* Throw away everything in a group that answers true. The list is
   walked backwards, for the reason project 7 gave: removing one must
   not skip the next. */
function retire(group, finished) {
  const list = group.getChildren();
  for (let i = list.length - 1; i >= 0; i -= 1) {
    if (finished(list[i]) === true) list[i].destroy();
  }
}

/* A plane, built for you. It is the one sprite you do not have to
   make, so read it before you write dropTrooper. */
function startPlane() {
  const fromLeft = Math.random() < 0.5;
  const speed = randomBetween(96, 150);
  const plane = planes.create(fromLeft ? -90 : WIDTH + 90, randomBetween(84, 216), 'plane');
  plane.setState('flying');
  plane.setVelocityX(fromLeft ? speed : -speed);
  plane.setFlipX(!fromLeft);
  plane.dropsLeft = Math.round(randomBetween(1, 3));
  plane.dropTimer = randomBetween(0.5, 1.2);
  return plane;
}

/* --- What happens when things touch ---

   Phaser hands these two the pair it found, in the order you named the
   groups in `watchForHits`. */
function shellHitsTrooper(shell, trooper) {
  shell.destroy();
  trooper.destroy();
  scoreHit(1, trooper.x, trooper.y);
}

function shellHitsPlane(shell, plane) {
  shell.destroy();
  plane.destroy();
  scoreHit(5, plane.x, plane.y);
}

/* A trooper walked into the gate. Only a walking one counts: the gate
   is a box in the air as well as on the ground, and a falling trooper
   passes straight through it. */
function trooperAtPost(trooper, gateBox) {
  if (trooper.state !== 'walking') return;
  trooper.destroy();
  loseBag();
}

function scoreHit(points, x, y) {
  score += points;
  playSound(boomSound);
  const before = scene.children.length;
  boom(scene, x, y);
  missing.boom = scene.children.length === before;
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
  updateCurtain();
}

function fire() {
  if (phase !== 'playing' || cooldown > 0) return;
  const shell = fireShell(scene, aim);
  missing.fireShell = !isSprite(shell);
  if (missing.fireShell) return;
  cooldown = 0.2;
  playSound(fireSound);
}

/* The status line under the window names whichever function is still
   empty. It is the fastest way to see where you are. */
function reportEmptyFunctions() {
  if (missing.loadArt) say('loadArt() is still empty, so Phaser draws a green box for every picture.');
  else if (drops === 0 && score === 0) say('Watch the sky. The next plane is nearly over the post.');
  else if (missing.dropTrooper) say('dropTrooper() is still empty, so the planes drop nothing.');
  else if (missing.openChute) say('openChute() is still empty, so no chute ever opens.');
  else if (missing.landTrooper) say('landTrooper() is still empty, so nobody lands and walks.');
  else if (missing.watchTheGate) say('watchTheGate() is still empty, so nobody ever reaches the post.');
  else if (missing.fireShell) say('fireShell() is still empty, so the gun has nothing to fire.');
  else if (missing.watchForHits) say('watchForHits() is still empty, so the shells pass through everything.');
  else if (missing.boom) say('boom() is still empty, so nothing blows up.');
  else say(scoreLine());
}

function scoreLine() {
  if (score === 0) return 'No hits yet. Aim with the mouse, click to fire.';
  return score === 1 ? '1 point.' : score + ' points.';
}

/* --- Drawing what Phaser does not draw ---

   Only two things: the dashed aiming line, and the card that covers
   the sky between games. Everything else on the screen is a sprite,
   and Phaser draws every sprite for you. */
function drawAimLine() {
  const muzzle = muzzlePoint(aim);
  aimLine.clear();
  aimLine.lineStyle(2, 0xffecbe, 0.3);
  /* Phaser has no dashed line, so the dashes are drawn one at a time:
     6 pixels on, 12 off, the same as project 8. */
  for (let along = 0; along < 450; along += 18) {
    aimLine.lineBetween(
      muzzle.x + Math.cos(aim) * along,
      muzzle.y + Math.sin(aim) * along,
      muzzle.x + Math.cos(aim) * (along + 6),
      muzzle.y + Math.sin(aim) * (along + 6)
    );
  }
}

function buildCurtain(aScene) {
  const display = "'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif";
  const label = "'Trebuchet MS', sans-serif";
  const back = aScene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x0a0e0a, 0.64).setOrigin(0, 0);
  const title = aScene.add.text(WIDTH / 2, 288, '', {
    fontFamily: display, fontSize: '58px', fontStyle: 'bold', color: '#ded2ae'
  }).setOrigin(0.5);
  const lines = aScene.add.text(WIDTH / 2, 382, '', {
    fontFamily: label, fontSize: '26px', color: '#ded2ae', align: 'center'
  }).setOrigin(0.5).setLineSpacing(14);
  const key = aScene.add.text(WIDTH / 2, 470, '', {
    fontFamily: label, fontSize: '26px', color: '#ffd68e'
  }).setOrigin(0.5);

  curtain = { group: aScene.add.container(0, 0, [back, title, lines, key]).setDepth(20), title, lines, key };
  updateCurtain();
}

function updateCurtain() {
  if (!curtain) return;
  curtain.group.setVisible(phase !== 'playing');
  if (phase === 'waiting') {
    curtain.title.setText('LOOKOUT POST MK II');
    curtain.lines.setText('The same post, rebuilt on Phaser.\nAim with the mouse. Click to fire.');
    curtain.key.setText('Press Start');
  } else if (phase === 'paused') {
    curtain.title.setText('PAUSED');
    curtain.lines.setText('');
    curtain.key.setText('');
  } else if (phase === 'over') {
    curtain.title.setText('POST LOST');
    curtain.lines.setText(score === 1 ? '1 point' : score + ' points');
    curtain.key.setText('Press Play again');
  }
}

/* --- The rack beside the window --- */
function updateRack() {
  angleReadEl.textContent = Math.round(-aim * 180 / Math.PI);
  scoreReadEl.textContent = score;
  planeCountEl.textContent = planes.getLength();
  trooperCountEl.textContent = troopers.getLength();
  shellCountEl.textContent = shells.getLength();

  const counts = [countState('falling'), countState('chute'), countState('walking')];
  const els = [[fallCountEl, fallBarEl], [chuteCountEl, chuteBarEl], [walkCountEl, walkBarEl]];
  for (let i = 0; i < 3; i += 1) {
    els[i][0].textContent = counts[i];
    els[i][1].style.width = Math.min(100, counts[i] * 20) + '%';
  }

  if (sandbagsEl.children.length !== START_BAGS) {
    sandbagsEl.textContent = '';
    for (let i = 0; i < START_BAGS; i += 1) {
      sandbagsEl.appendChild(document.createElement('span'));
    }
  }
  for (let i = 0; i < START_BAGS; i += 1) {
    sandbagsEl.children[i].className = i < bags ? 'sandbag' : 'sandbag sandbag-gone';
  }

  startBtn.disabled = phase === 'over';
  startBtn.firstChild.nodeValue = phase === 'playing' ? 'Pause ' : 'Start ';
  againBtn.disabled = phase === 'waiting';
  normalBtn.setAttribute('aria-pressed', String(timeScale === 1));
  slowBtn.setAttribute('aria-pressed', String(timeScale !== 1));
}

function countState(state) {
  let total = 0;
  for (const trooper of troopers.getChildren()) {
    if (trooper.state === state) total += 1;
  }
  return total;
}

/* --- The keys --- */

function resetGame() {
  planes.clear(true, true);
  troopers.clear(true, true);
  shells.clear(true, true);
  score = 0;
  bags = START_BAGS;
  drops = 0;
  planeTimer = 0.8;
  cooldown = 0;
  missing.dropTrooper = false;
  missing.openChute = false;
  missing.landTrooper = false;
  missing.fireShell = false;
  missing.boom = false;
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
  updateCurtain();
});

againBtn.addEventListener('click', () => {
  resetGame();
  phase = 'playing';
  playSound(startSound);
  say('A fresh watch. Aim with the mouse.');
  updateCurtain();
});

/* Slow motion costs more here than it did in project 8.

   There you multiplied one number and every moving thing slowed down,
   because you were moving every one of them yourself. Phaser moves
   them, so Phaser has to be told — and its three clocks are set three
   different ways. The physics one is upside down on purpose: 2 there
   means half speed.

   That is worth remembering about libraries. They take work away, and
   in exchange you have to learn where their switches are. */
function setClock(scale) {
  timeScale = scale;
  scene.physics.world.timeScale = 1 / scale;
  scene.tweens.timeScale = scale;
  scene.time.timeScale = scale;
}

normalBtn.addEventListener('click', () => {
  setClock(1);
  say('Normal speed.');
});

slowBtn.addEventListener('click', () => {
  setClock(0.3);
  say('Slow motion. Phaser has three clocks, and all three had to be told.');
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !startBtn.disabled) {
    event.preventDefault();
    startBtn.click();
  }
});

/* Typing #demo onto a page that is already open changes the address
   only. The script does not run again. So the page reloads itself. */
window.addEventListener('hashchange', () => location.reload());

/* --- The demos ---

   Add #demo or #demo-over to the end of the address in the browser and
   the game plays properly, so you can see what you are building. The
   stand-ins below fill in whichever functions are still empty. They
   are for the demo picture only. They are never for you. */
function standInForArt(aScene) {
  aScene.load.image('plane', 'assets/plane.png');
  aScene.load.image('trooper-fall', 'assets/trooper-fall.png');
  aScene.load.image('trooper-chute', 'assets/trooper-chute.png');
  aScene.load.image('shell', 'assets/shell.png');
  aScene.load.image('boom', 'assets/boom.png');
}

function standInForEmptyFunctions(aScene) {
  const probePlane = planes.create(-500, -500, 'plane');
  const dropped = dropTrooper(aScene, probePlane);
  if (isSprite(dropped)) dropped.destroy();
  else {
    dropTrooper = (scn, plane) => {
      const trooper = troopers.create(plane.x, plane.y + 24, 'trooper-fall');
      trooper.setState('falling');
      trooper.setGravityY(GRAVITY);
      return trooper;
    };
  }
  probePlane.destroy();

  const probeMan = troopers.create(-500, -500, 'trooper-fall');
  probeMan.setState('falling');
  openChute(probeMan);
  if (probeMan.state !== 'chute') {
    openChute = (trooper) => {
      trooper.setState('chute');
      trooper.setTexture('trooper-chute');
      trooper.setGravityY(0);
      trooper.setVelocityY(CHUTE_SPEED);
    };
  }
  probeMan.setState('chute');
  landTrooper(probeMan);
  if (probeMan.state !== 'walking') {
    landTrooper = (trooper) => {
      trooper.setState('walking');
      trooper.setVelocityY(0);
      trooper.setVelocityX(towardsPost(trooper.x) * WALK_SPEED);
      trooper.setFlipX(towardsPost(trooper.x) < 0);
      trooper.play('walk');
    };
  }
  probeMan.destroy();

  const probeShell = fireShell(aScene, -Math.PI / 2);
  if (isSprite(probeShell)) probeShell.destroy();
  else {
    fireShell = (scn, angle) => {
      const start = muzzlePoint(angle);
      const shell = shells.create(start.x, start.y, 'shell');
      scn.physics.velocityFromRotation(angle, SHELL_SPEED, shell.body.velocity);
      shell.setRotation(angle);
      return shell;
    };
  }

  const before = aScene.children.length;
  boom(aScene, -500, -500);
  if (aScene.children.length === before) {
    boom = (scn, x, y) => {
      const fire = scn.add.image(x, y, 'boom').setScale(0.2);
      scn.tweens.add({
        targets: fire,
        scale: 1.1,
        alpha: 0,
        duration: 450,
        onComplete: () => fire.destroy()
      });
    };
  }
}

function setUpDemo(aScene) {
  if (location.hash === '#demo-over') {
    score = 23;
    bags = 0;
    phase = 'over';
    updateCurtain();
    say('Demo: the post fell after three troopers reached it.');
    return;
  }

  const plane = startPlane();
  plane.x = 260;
  plane.y = 118;
  plane.setVelocityX(120);
  plane.setFlipX(false);

  const spots = [
    { x: 316, y: 196, state: 'falling' },
    { x: 748, y: 244, state: 'falling' },
    { x: 192, y: 404, state: 'chute' },
    { x: 872, y: 340, state: 'chute' },
    { x: 122, y: GROUND - TROOPER_H / 2, state: 'walking' }
  ];
  for (const spot of spots) {
    const trooper = troopers.create(spot.x, spot.y, 'trooper-fall');
    trooper.setState('falling');
    trooper.setGravityY(GRAVITY);
    if (spot.state === 'chute') openChute(trooper);
    if (spot.state === 'walking') {
      openChute(trooper);
      landTrooper(trooper);
    }
  }

  boom(aScene, 700, 300);
  score = 9;
  bags = 2;
  drops = 5;
  phase = 'playing';
  updateCurtain();
  say('Demo: the finished game. Aim with the mouse, click to fire.');
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the functions you have to write.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- loadArt(scene) ---

     scene.load.image('plane', 'assets/plane.png');
     scene.load.image('trooper-fall', 'assets/trooper-fall.png');
     scene.load.image('trooper-chute', 'assets/trooper-chute.png');
     scene.load.image('shell', 'assets/shell.png');
     scene.load.image('boom', 'assets/boom.png');


   --- dropTrooper(scene, plane) ---

     const trooper = troopers.create(plane.x, plane.y + 24, 'trooper-fall');
     trooper.setState('falling');
     trooper.setGravityY(GRAVITY);
     return trooper;


   --- openChute(trooper) ---

     trooper.setState('chute');
     trooper.setTexture('trooper-chute');
     trooper.setGravityY(0);
     trooper.setVelocityY(CHUTE_SPEED);


   --- landTrooper(trooper) ---

     trooper.setState('walking');
     trooper.setVelocityY(0);
     trooper.setVelocityX(towardsPost(trooper.x) * WALK_SPEED);
     trooper.setFlipX(towardsPost(trooper.x) < 0);
     trooper.play('walk');


   --- watchTheGate(scene) ---

     scene.physics.add.overlap(troopers, gate, trooperAtPost);


   --- fireShell(scene, angle) ---

     const start = muzzlePoint(angle);
     const shell = shells.create(start.x, start.y, 'shell');
     scene.physics.velocityFromRotation(angle, SHELL_SPEED, shell.body.velocity);
     shell.setRotation(angle);
     return shell;


   --- watchForHits(scene) ---

     scene.physics.add.overlap(shells, troopers, shellHitsTrooper);
     scene.physics.add.overlap(shells, planes, shellHitsPlane);


   --- boom(scene, x, y) ---

     const fire = scene.add.image(x, y, 'boom').setScale(0.2);
     scene.tweens.add({
       targets: fire,
       scale: 1.1,
       alpha: 0,
       duration: 450,
       onComplete: () => fire.destroy()
     });

   --------------------------------------------------------------------- */
