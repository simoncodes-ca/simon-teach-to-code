# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `parachuters.html`, `styles.css`, `parachuters.js`, with hand-made sounds under `assets/`. One `<canvas>` element, drawn with the 2D context, driven by a `requestAnimationFrame` loop. No build step, no dependencies, no framework, no network. Opens by double-clicking `parachuters.html`. This matches the seven sibling projects, where the source itself is the deliverable and tooling would obscure it.

## Users

- **Simon (primary learner), 11 years old.** He did the calculator, the elevator, hangman, blackjack, battleship, the paint app and the balloon stall. His job is to open `parachuters.js`, read it top to bottom, and fill in the stubbed functions until troopers drop, chutes open, shells fly and things blow up. He reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and explains how what is on screen maps to the code that produces it.
- **Anyone who picks it up to play.** The gun has to follow the mouse without lag, and a shell that visibly crossed a trooper has to destroy him. A shooting game that eats a fair shot is not a teaching aid, it is a broken toy.

## Product Purpose

The first game with more than one kind of thing in it, and the first lesson in sprites and entity states.

Project 7 established the loop and time-based movement with two lists that moved by two rules. This one holds four lists, and the four rules are deliberately different from each other: a plane crosses in a straight line, a shell crosses far faster and never falls, an explosion never moves at all, and a trooper changes his rule twice on the way down.

The idea worth the project is that **a sprite is a plain object, and every moving thing is the same shape of object.** `{ kind, x, y, w, h, vx, vy, state }`. Because they all match, one `moveSprite` moves planes and shells, and one `hitsSprite` checks a shell against a trooper and against a plane without ever asking which is which. That payoff has to be visible before project 9 hides it behind Phaser's sprite class.

The second lesson is the state inside the sprite. A trooper is `falling`, then `chute`, then `walking`, and one word decides which rule moves him this frame. That is the elevator's state machine from project 2, now living in a list of many small objects instead of one building. The project splits it deliberately across two functions the learner writes: `moveTrooper` moves and never decides, `nextTrooperState` decides and never moves.

The third lesson is quieter. Things that happen every frame and things that happen once at a transition belong in different places. `changeState` is given, and it holds the once-only work.

## Positioning

Most beginner "many objects" tutorials give each entity type its own class, its own update method and its own file, and the learner ends up with inheritance before he has ended up with a game. Others go the opposite way and hard-code four separate loops that share nothing, so the moment a fifth entity arrives the whole update function is rewritten.

This project sits between the two. Every entity is a plain object literal with the same named parts, and the shared behaviour lives in two small given helpers rather than in a base class. The learner can see why the parts match, because he writes two constructors that produce matching objects and one collision test that consumes both.

It also puts the state machine on the page. The Troopers panel counts `falling`, `chute` and `walking` and draws each as a bar, so a transition that fires at the wrong moment is visible as a number moving between rows. The four list lengths sit beside it, so a list that fills and never empties is visible before the frame rate suffers for it.

## Operating Context

- Opened directly from the filesystem in a browser — no server, no install, no network.
- Edited in a text editor beside the running page, likely with both windows visible at once.
- Mouse or trackpad on a laptop, or a finger on a tablet: pointer events cover all three, and the canvas sets `touch-action: none` so a drag aims instead of scrolling.
- Sessions are short: one or two stub functions at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- A 1024×768 canvas holding a first-light sky, drifting cloud, a ridge in silhouette, a grass ground line and a sandbagged gun post, scaling to the window without changing its own coordinates.
- The same `requestAnimationFrame` loop as project 7, with the same 0.05 second frame trim and the same `update()` and `render()` split.
- Four entity lists — planes, troopers, shells, explosions — each spawning and retiring on its own schedule.
- Planes that cross the sky from either side, carry one to three troopers, and drop them over the middle.
- Troopers with three states: `falling` under gravity, `chute` at a fixed rate, `walking` towards the post.
- A gun that follows the mouse, clamped to the half turn above the sandbags, and fires a shell every 0.2 seconds at most.
- Shells that fly in a straight line at a constant velocity, with no gravity anywhere in the project.
- Box-to-box collision, used for shell against trooper and shell against plane from the same function.
- Explosions as the smallest sprite in the game: a point, a radius that grows, and a life that counts down.
- Three sandbags, one lost per trooper who reaches the post, a lost-post card, and Play again.
- A Slow motion key that scales time to 0.3 and changes nothing else.
- An angle readout in degrees and a score on the name plate.
- A Troopers panel counting each state, with a bar per state, so the state machine is watchable.
- Counts of all four lists, so a list that never empties is visible as a number.
- A status line that names the exact stub responsible whenever the game does nothing, covering all nine.
- Graduated hints per stub in comments: a gentle nudge, then a stronger hint, then a pointer to the answer key — one comment block at the bottom of `parachuters.js`, grouped by function.
- `#demo` and `#demo-over` hashes that fill in unwritten stubs at runtime, so the finished game is inspectable from the first minute.

**Explicitly deferred (later projects or extensions):** a game library and sprites loaded from image files (project 9), keyboard control and waves (project 10), tile collision (project 11), a scrolling world (project 12), and a high score that survives a refresh (project 13). Also left out on purpose: troopers who shoot back, a chute that can be shot away, wind, points that vary by drop height, and rising difficulty — all named in the README as the good things to try next.

**Hard constraints:**
- No dependencies, no build step, no framework, no network requests.
- One canvas, one `.js` file, one loop. No physics library, no sprite sheets, no offscreen buffers, no image files — every sprite is drawn with 2D context calls, so the drawing stays readable source rather than an asset.
- The whole implementation stays small enough for a beginner to read end to end.
- No abstraction that exists only for elegance. No classes, no inheritance, no base entity. Repetition he can follow beats indirection he cannot.
- Comments use plain language for someone who has never programmed.
- Simon writes making a trooper, moving him, changing his state, arriving at the post, making a shell, retiring it, the box hit test, making an explosion and updating it. The HTML/CSS, the loop, the drawing, the plane, the tin of helpers, the mouse handlers, the keys and the restart are given.
- Nothing project 7 taught is taught again. `aimAngle` and the restart are handed over as finished, named as the learner's own work from that project.
- The initial page is an inert scaffold: planes crossing an empty sky and a status line naming the first stub. Every completed stub makes something new visible.
- Stubs are filled in file order, top to bottom.

## Brand Commitments

"Simon's Lookout Post" is one field gun post seen from inside, at first light. A stamped steel name plate runs across the top, a heavy steel window looks out at the ridge, and a panel of olive-painted instruments stands beside it. Everything built by a person is olive drab, canvas cream and gunmetal. Everything with weather in it is behind the glass: the dawn sky, the cloud, the ridge and the fire of an explosion. Signal red appears exactly once, on Start, the only key that begins a game. No arcade neon, no cartoon outlines, no blood, no flags, no insignia of any real army.

## Evidence on Hand

- `ROADMAP.md` names the parachuter game project 8 and lists what it teaches: lists of entities, timed spawning, different movement rules, ground and landing detection, several animations at the same time, game-over conditions, keeping updating separate from drawing, and sprites as data. It also names the rule this game is built around: three paratroopers that land near the turret destroy it. The nine stubs cover all of it.
- `07-balloons/` established the game loop, `seconds`, velocity, gravity, `atan2`, `cos`, `sin`, backwards removal from a list, and the restart. All are assumed here and none are re-taught.
- `02-elevator/` established the state machine. This project puts one inside a sprite and multiplies it by the length of a list.
- The sibling projects establish the shape: three files, pre-written wiring, stubbed core with plain-language doc comments, graduated hints, an answer key at the bottom, demo URL hashes, and a themed skin that makes the source worth reading.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **The invisible is made visible.** The three trooper states and all four list lengths have a place on the rack.
3. **Every sprite is the same shape of object.** That is what lets one function serve every kind of thing, and it is the whole lesson.
4. **A fair shot must hit.** The boxes are generous rather than clever, and the whole sky is within range of the gun.
5. **Scope stays small on purpose.** A library is the next project, not this one.

## Accessibility & Inclusion

No product-specific requirement beyond the general floor. Every control is a real `<button>` carrying an `aria-label` or plain text, with `aria-pressed` on the two clock keys. The Start key doubles as Pause and is reachable with **Space**, announced with `aria-keyshortcuts`. Play again is disabled before the first game, and Start is disabled once the post has fallen, so a key never lies about what it would do. The status line is a live region and names the responsible function whenever the game does nothing. The trooper states are given as text counts as well as bars, and the sandbags are labelled, so no count is colour or shape alone. Aiming and firing are pointer gestures and are not reachable by keyboard; that is a real limit of this project, recorded here rather than papered over. Motion is limited to a hover lift and a press depression on the keys, both removed under reduced motion — the game's own movement is the point of the project and stays. The setting is a generic field post: no real army, no insignia, no casualties on screen. A destroyed trooper becomes a puff of fire and is gone.

---
