# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `remake.html`, `styles.css`, `remake.js`, plus one vendored library, `phaser.min.js` (Phaser 3.90.0), sitting next to the HTML. Art under `assets/` as PNG files, and the same hand-made sounds as project 8 as WAV files. One `<canvas>` element, handed to Phaser and drawn with its Canvas renderer. No build step, no npm, no network. Opens by double-clicking `remake.html`.

Two settings in the Phaser config exist only to keep that last sentence true. `type: Phaser.CANVAS` is required because Phaser refuses to guess a renderer when it is handed a canvas of our own. `loader: { imageLoadType: 'HTMLImageElement' }` is required because Phaser's usual image loading uses XHR, which a browser blocks on a `file://` page.

## Users

- **Simon (primary learner), 11 years old.** He has finished eight projects, the last two of them games he wrote frame by frame. His job here is to open `remake.js` beside `08-parachuters/parachuters.js` and fill in eight stubs, each of which has a counterpart in the older file. He reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and points at each part the library replaced.
- **Anyone who picks it up to play.** It is the same game as project 8 and has to play like it. A shell that visibly crossed a trooper has to destroy him.

## Product Purpose

The first project that uses somebody else's code, and the only way to show what that is worth.

The game is deliberately one Simon has already written. Nothing about the rules, the art, the sounds or the difficulty has changed, so every difference he can see is a difference the library made. Introducing a library and a new game at the same time would hide exactly the thing this project exists to teach.

The lesson has two halves, and the second half matters as much as the first.

**What the library takes away.** The `requestAnimationFrame` loop, `moveSprite`, `hitsSprite` and its two loops, `updateBoom`, `skyPoint`, and every line of canvas drawing. Nine functions become eight, and the eight are a handful of lines each. The rack beside the window crosses five of them off by name.

**What it costs.** Slow motion got harder, not easier: project 8 multiplied one number, and Phaser has three clocks set three different ways, one of them inverted. Retiring a shell that leaves the sky is still a hand-written loop, because Phaser has no opinion about the edge of the world. Both are in the given wiring, both are commented as such, and the README names them. A learner who takes away only "libraries do the work" has learned the wrong half.

The third idea is smaller and runs through every stub. **You speak once, at the moment things change, instead of every frame.** `moveTrooper` ran sixty times a second; `openChute` runs once and Phaser carries the result forward. That is the same split project 8 taught between per-frame work and transition work, now enforced by the tool rather than by a comment.

## Positioning

Most Phaser tutorials start at Phaser. The learner types `this.physics.add.overlap` on day one, it works, and he never finds out what it replaced or what it cost. He can build a game and cannot debug one.

The opposite mistake is to teach the library as a translation exercise, function by function, with no game at the end.

This project takes the first route and closes the loop: he built the game by hand a week ago, so `overlap` lands as an answer to a question he actually asked. The comparison is made concrete in three places — the crossed-off list on the rack, the table at the top of the README, and a comment in every stub naming the project 8 function it replaces.

It also refuses to pretend the trade is free. The two places Phaser made things worse are pointed at rather than smoothed over, because telling a helpful abstraction from hidden complexity is a named goal of this project in `ROADMAP.md`.

## Operating Context

- Opened directly from the filesystem in a browser — no server, no install, no network.
- Read beside `08-parachuters/parachuters.js`, most likely in two windows at once. The README says so in its third line.
- Mouse or trackpad on a laptop, or a finger on a tablet. Phaser's pointer covers all three, and the canvas keeps `touch-action: none`.
- Sessions are short: one or two stubs at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- The whole of project 8's game, rebuilt: planes, troopers in three states, shells, explosions, three sandbags, score, slow motion, pause and restart.
- Art loaded from PNG files instead of drawn with 2D context calls. The PNGs were made by running project 8's own drawing code once and saving what came out, so the two games look identical on purpose.
- Three Phaser groups instead of four arrays. The explosions lose their list, because a tween destroys each one.
- A two-frame walking animation, which project 8 faked from the trooper's x.
- Eight stubs: `loadArt`, `dropTrooper`, `openChute`, `landTrooper`, `watchTheGate`, `fireShell`, `watchForHits`, `boom`.
- A status line that names the exact stub responsible whenever the game does nothing, covering all eight in order.
- A rack panel listing the five project 8 functions Phaser now writes, crossed out.
- `#demo` and `#demo-over` hashes that fill in unwritten stubs at runtime, exactly as project 8 does.
- Graduated hints per stub, and one answer key at the bottom of the file.

**Explicitly deferred (later projects or extensions):** keyboard control, waves and rising difficulty (project 10), tile collision (11), a camera and a world larger than the screen (12), saved high scores (13). Left out on purpose and named in the README as good things to try next: Phaser's own sound system, a second scene for the title card, a shell `lifespan`, and tweens on anything other than the explosion.

**Hard constraints:**
- One library, vendored next to the HTML. No npm, no build step, no bundler, no network. Project 17 is where those arrive.
- No ES modules. `phaser.min.js` and `remake.js` are two ordinary `<script>` tags, because `file://` blocks `import`.
- The game must be identical to project 8's. Any change to a rule, a number or a picture weakens the comparison, which is the whole product.
- The sounds keep the `Audio` pattern every project since the calculator has used. Phaser's sound system is a second new idea and is deferred to the "try this next" list.
- Comments use plain language for someone who has never programmed.
- Nothing project 8 taught is taught again. The trooper state machine, the box test, gravity, velocity and backwards removal are all named and pointed back at, never re-explained.
- Every completed stub makes something new visible, and the first one turns green boxes into planes.

## Brand Commitments

The frontage is project 8's, unchanged: olive drab, canvas cream, gunmetal, signal red on Start alone. The plate reads **Lookout Post Mk II**, with the mark stamped on an olive tab, and that mark is the only thing on the page that says this is a second version.

The one new panel on the rack is the crossed-off list. Its struck-through names are set in the mono face at low contrast, with the replacement named beside each in amber. It reads as a work order, not as a scoreboard.

## Evidence on Hand

- `ROADMAP.md` names project 9 as a Phaser remake of the parachuter game and lists what it teaches: library timing and the game loop, library sprites and asset handling, scenes, comparing hand-written code with library code, and telling a helpful abstraction from hidden complexity. It also fixes two decisions this project keeps: Phaser rather than p5, and a vendored copy of `phaser.min.js` so the build step does not arrive early.
- `08-parachuters/` is the game being rebuilt. Its `PRODUCT.md` records the rules, the numbers and the deferred features, all of which are unchanged here.
- Measured in a browser: with `type: Phaser.AUTO` and a supplied canvas, Phaser 3.90 throws "Must set explicit renderType in custom environment". With the default loader, every image fetch on a `file://` page fails CORS. Both settings in the config are there because of those two results.
- Measured in a browser: Phaser hands an overlap of a group and a lone game object to the callback in the opposite order from the one written. The gate is therefore a static group holding one invisible box, so all three overlaps in the game read the same way.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **Change one thing.** The game is identical, so every difference is the library's doing.
3. **Name the cost as loudly as the saving.** A library that only ever looks free teaches nothing about choosing one.
4. **You speak once, not every frame.** Every stub in the file is an example of it.
5. **A fair shot must hit.** The picture is bigger than the trooper, so the wiring gives him a body the size of the man.

## Accessibility & Inclusion

The floor is project 8's, unchanged, and the page is the same markup. Every control is a real `<button>` carrying an `aria-label` or plain text, with `aria-pressed` on the two clock keys. Start doubles as Pause and is reachable with **Space**, announced with `aria-keyshortcuts`. Play again is disabled before the first game, and Start is disabled once the post has fallen. The status line is a live region and names the responsible function whenever the game does nothing. The trooper states are given as text counts as well as bars, and the sandbags are labelled.

The crossed-off panel uses `<del>`, so the strike-through reaches a screen reader as a real deletion rather than as styling.

Aiming and firing are pointer gestures and are not reachable by keyboard. That is inherited from project 8 and is a real limit, recorded here rather than papered over. Motion in the chrome is limited to a hover lift and a press depression, both removed under reduced motion; the game's own movement is the point of the project and stays. The setting is a generic field post: no real army, no insignia, no casualties on screen.

---
