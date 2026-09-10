# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `aliens.html`, `styles.css`, `aliens.js`, plus one vendored library, `phaser.min.js` (Phaser 3.90.0), sitting next to the HTML. Art under `assets/` as PNG files, and hand-made sounds as WAV files. One `<canvas>` element, handed to Phaser and drawn with its Canvas renderer. No build step, no npm, no network. Opens by double-clicking `aliens.html`.

The two Phaser settings that keep that last sentence true are the ones project 9 introduced, and its `PRODUCT.md` records why they are needed.

The art is pixel art at four times size, drawn from character maps by a throwaway script and saved once. The canvas carries `image-rendering: pixelated`, so a scaled screen keeps hard edges rather than blurring.

## Users

- **Simon (primary learner), 11 years old.** He has finished nine projects. The last one taught him Phaser by rebuilding a game he already had. This is the first game he meets only as a scaffold. He fills in eight stubs and reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and points at the two places the library stops helping.
- **Anyone who picks it up to play.** It has to be a real arcade game. Holding an arrow flies the ship, space fires, and the last few aliens of a wave have to be frightening.

## Product Purpose

The first game built **on** the library rather than translated into it, and the first one driven by the keyboard.

Three ideas earn their place, and the first is the reason the project exists.

**A formation is one thing.** Every enemy in projects 7 and 8 moved on its own. The swarm does not. It marches, turns and drops in lock-step, so `marchAliens` moves all of them by hand, every frame, with project 7's `speed × seconds`. Giving each alien its own velocity looks right for ten seconds and then falls apart. This is where Phaser stops helping, and the failure is visible rather than argued.

**Difficulty can fall out of a sum.** The march speed is `MARCH_SLOW * blockSize / aliens.getLength()`, capped. Nobody writes a curve. Each wave gets frightening on its own as it empties, and the March speed bar on the rack shows it happening.

**A key is a state, not a moment.** Every project so far waited for a click, which Phaser delivered by calling a function. `keys.left.isDown` has to be asked, on every frame, because the answer changes between frames. The `else` that sets the velocity back to zero is the line that teaches it, because leaving it out makes the ship drift.

Waves and lives arrive alongside, both as small decision functions rather than movement: a guard clause that acts on one frame in a thousand, and a branch that either ends the game or brings the ship back.

## Positioning

The usual next step after a first library project is a bigger version of the same game. That teaches nothing new about the library and hides how much of a game is still hand-written.

This project goes the other way. It is a new game, so nothing can be copied, and the one piece Phaser refuses to do — moving a formation as a unit — sits in the middle of it.

It is also the point where the learner's hands leave the mouse. Every earlier project pointed at something. This one is played with two hands on the keys, which is what makes it feel like a machine in an arcade rather than a page in a browser.

## Operating Context

- Opened directly from the filesystem in a browser — no server, no install, no network.
- Read beside `09-phaser/remake.js` for the Phaser vocabulary, which this file never explains again.
- Keyboard only, on a laptop or desktop. There is no touch control, and that is recorded below as a real limit.
- Sessions are short: one or two stubs at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- A ship on a deck, flown with the arrow keys and fired with the space bar, on a reload clock.
- A block of aliens, 8 columns wide and 3 to 5 rows deep, marching in lock-step, turning at both walls and dropping a step each turn.
- March speed that rises as the block empties, capped, and shown on the rack as a measured bar rather than a claimed one.
- Bombs dropped from a random alien on a timer.
- Three ships, a respawn that flashes the new ship in, and a game over.
- Waves that grow one row deeper each time, up to a ceiling, with a wave card and a fanfare.
- The swarm reaching the deck, which ends the game whatever the lives say.
- Eight stubs: `steerShip`, `fireBolt`, `buildWave`, `marchAliens`, `alienFires`, `watchForHits`, `loseLife`, `nextWave`.
- A status line that names the exact stub responsible whenever the game does nothing, covering all eight in order.
- `#demo` and `#demo-over` hashes that fill in unwritten stubs at runtime, exactly as projects 8 and 9 do.
- Graduated hints per stub, and one answer key at the bottom of the file.

**Explicitly deferred (later projects or extensions):** tile collision and a map as data (project 11), a world larger than the screen (12), saved high scores (13). Left out on purpose and named in the README as good things to try next: a second kind of alien, bunkers, a passing saucer, bombs from the bottom of a column only, more than one bomb at a time, and Phaser's own sound system.

**Hard constraints:**
- One library, vendored next to the HTML. No npm, no build step, no bundler, no network. Project 17 is where those arrive.
- No ES modules. `phaser.min.js` and `aliens.js` are two ordinary `<script>` tags, because `file://` blocks `import`.
- Nothing project 9 taught is taught again. Scenes, sprites, groups, `create`, `setVelocity`, `overlap`, animations and tweens are named and pointed back at, never re-explained. `loadArt` and the explosion tween are given rather than asked for a second time.
- The sounds keep the `Audio` pattern every project since the calculator has used.
- Comments use plain language for someone who has never programmed.
- Every completed stub makes something new visible, and the first one makes the ship move.
- The march is hand-written on purpose. Any change that hands the formation to Phaser's own velocity destroys the lesson.

## Brand Commitments

An arcade cabinet, seen straight on in a dark room. Aubergine woodwork, a backlit acrylic marquee, a curved tube behind glass, and a rack of readouts down the side.

The marquee reads **Alien Raid**, with **Raid** knocked out in magenta. Cyan is the machine's own colour: the readouts, the ship, the bezel glow. Green belongs to the aliens and to the chalked status line, so the line under the screen reads as the machine talking. Magenta belongs to the bombs and to the Start key, which are the two things that can end a game.

The screen keeps its scanlines and its darkened corners. Pixel art stays pixel art at any size.

## Evidence on Hand

- `ROADMAP.md` names project 10 as the first new game built on Phaser and lists what it teaches: keyboard input, player movement and firing, several enemies and enemy formations, bullets and collisions, waves, lives and respawning, and rising difficulty.
- `09-phaser/` is the project immediately before it, and its README fixes the vocabulary this file assumes.
- Measured in a browser: Phaser ignores keyboard input while the game does not have focus. Clicking Start leaves the keyboard on the Start button, where the space bar presses the button again instead of firing. The wiring therefore moves focus to the canvas when a game begins, and the canvas carries `tabindex="0"`.
- Measured in a browser: an overlap between a group and a lone sprite reaches the callback in whichever order Phaser chooses, so `bombHitsShip` asks which of its two arguments is the ship rather than trusting the order.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **Show where the library stops.** The one hand-written loop in the game is the most important thing in it.
3. **Let the rules produce the feeling.** The difficulty curve is a sum, not a table of numbers.
4. **A stub that changes nothing on screen is a bug.** All eight of them move something visible.
5. **The bugs are part of the lesson.** The drifting ship and the three lives lost at once are in the README by name.

## Accessibility & Inclusion

Every control is a real `<button>` carrying plain text or an `aria-label`. Start doubles as Pause and is reachable with **Enter**, announced with `aria-keyshortcuts`. Play again is disabled before the first game, and Start is disabled once the last ship has gone. The status line is a live region and names the responsible function whenever the game does nothing.

The canvas takes `tabindex="0"` and shows its own focus ring inside the glass, so it is clear which part of the page the keyboard is talking to. The game itself is played entirely from the keyboard, which is the first project on the trail where that is true.

The counts on the rack are given as numbers as well as bars, and the ships left are labelled. Motion in the cabinet is limited to a hover lift and a press depression, both removed under reduced motion; the game's own movement is the point of the project and stays.

Touch is not supported. There are no on-screen controls, so a tablet cannot play it. That is a real limit, recorded here rather than papered over.

The setting is invented: no real place, no real conflict, and nothing on screen but shapes and sparks.

---
