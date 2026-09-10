# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `vault.html`, `styles.css`, `vault.js`, plus one vendored library, `phaser.min.js` (Phaser 3.90.0), sitting next to the HTML. Art under `assets/` as PNG files, and hand-made sounds as WAV files. One `<canvas>` element, handed to Phaser and drawn with its Canvas renderer. No build step, no npm, no network. Opens by double-clicking `vault.html`.

The two Phaser settings that keep that last sentence true are the ones project 9 introduced, and its `PRODUCT.md` records why they are needed.

The game uses no physics at all. Phaser draws, loads and tweens. Every pixel of movement comes from the learner's own `moveThing`, because a thing that lives on a grid has to be placed on the grid rather than pushed towards it.

The art is pixel art at four times size, drawn from character maps by a throwaway script and saved once. The canvas carries `image-rendering: pixelated`, so a scaled screen keeps hard edges rather than blurring.

## Users

- **Simon (primary learner), 11 years old.** He has finished ten projects. The last two taught him Phaser and the keyboard. This is the first game he meets that has walls in it. He fills in nine stubs and reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and points at the moment the map stops being scenery and becomes a rule.
- **Anyone who picks it up to play.** It has to be a real maze game. The mouse has to run cleanly, the corners have to feel fair, and a cat two cells behind you has to be frightening.

## Product Purpose

The first project where the level is data the program reads, rather than shapes the program draws.

Three ideas earn their place, and the first is the reason the project exists.

**The map is data.** Each level is twelve strings of sixteen characters. `buildVault` reads them and builds what they say. `isWall` looks one up. `countCheese` counts them. `eatCheese` changes one. Every question the game asks is a question about the map, and none of them could be asked of a picture. That idea runs from here to the strategy game at the end of the trail.

**Cells and pixels are two languages, and two functions translate.** `middleOf` multiplies by `TILE`. `cellAt` divides by `TILE` and rounds down. Everything else in the file leans on that pair, so both come first and both show their answer on the rack.

**Deciding and moving are separate jobs.** `startStep` asks the map and never moves anybody. `moveThing` moves and never asks the map. Project 8 made that split with a falling trooper. Walls make the reason plain, and the split is what keeps both functions to five lines.

The fourth thing the project teaches is quieter and lives in a bug. A learner who destroys the crumb sprite without changing the map gets a game that looks perfect and never ends. The README names that bug and explains it, because it is the shortest proof that the picture is not the truth.

## Positioning

The usual maze project checks the pixel the player is walking into and pushes them back out. That teaches collision, and it teaches nothing about maps.

This project moves cell to cell instead. A step is allowed or refused before it begins, so the whole of collision is one `if` around one lookup. What is left over is the thing worth learning: a level written as data, read by a loop, and changed as the game runs.

It is also the first project whose central idea outlives the game. Grid maths, tile lookups and maps as data return at projects 12, 16, 18, 19 and 20. Alien Raid taught a formation, which returns nowhere.

## Operating Context

- Opened directly from the filesystem in a browser. No server, no install, no network.
- Read beside `10-aliens/aliens.js` for the Phaser and keyboard vocabulary, which this file never explains again.
- Keyboard only, on a laptop or desktop. There is no touch control, and that is recorded below as a real limit.
- Sessions are short: one or two stubs at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- Three vaults, each a 16 by 12 grid written as twelve strings of characters.
- A mouse that runs cell to cell on the arrow keys, gliding between cells and stopping at walls.
- Cheese crumbs that are eaten by changing the map, not by hiding a sprite.
- One to three cats per level, using the learner's own `startStep` and `moveThing`.
- Three lives, a flashing restart, and a game over. Eaten cheese stays eaten.
- A level that ends when the map runs out of crumbs, and a win when the third vault empties.
- Nine stubs: `middleOf`, `cellAt`, `buildVault`, `isWall`, `steerMouse`, `startStep`, `moveThing`, `eatCheese`, `chooseCatWay`.
- A rack that shows the learner's own functions back to them: the cell, its middle in pixels, and the four ways out.
- A status line that names the exact stub responsible whenever the game does nothing, covering all nine in order.
- `#demo` and `#demo-over` hashes that fill in unwritten stubs at runtime, exactly as projects 8, 9 and 10 do.
- Graduated hints per stub, and one answer key at the bottom of the file.

**Explicitly deferred (later projects or extensions):** a world larger than the screen and a camera (project 12), generated levels and saved scores (13), free movement and aiming (16), editing and saving a map (18), a route found around walls (20), an enemy that hunts (23). Left out on purpose and named in the README as good things to try next: a fourth vault, a crumb worth more points, a mouse hole, a cat that closes the gap, and a second thing to collect.

**Hard constraints:**
- One library, vendored next to the HTML. No npm, no build step, no bundler, no network. Project 17 is where those arrive.
- No ES modules. `phaser.min.js` and `vault.js` are two ordinary `<script>` tags, because `file://` blocks `import`.
- No physics bodies and no velocities. Grid movement is placement, and handing it to a physics engine would hide the lesson.
- Nothing projects 9 and 10 taught is taught again. Scenes, groups, `create`, `destroy`, tweens, `speed × seconds` and keys as state are named and pointed back at, never re-explained.
- Lives and levels are given rather than asked for, because project 10 already made the learner write both.
- The sounds keep the `Audio` pattern every project since the calculator has used.
- Comments use plain language for someone who has never programmed.
- Every completed stub makes something new visible, and the first one puts the mouse in its square.

## Brand Commitments

A strongroom door, seen straight on. Brushed steel in three tones, a riveted nameplate across the top, a window of wired security glass, and a rack of readouts down the side.

The plate reads **Cheese Vault**, with **Vault** knocked out on a cheese-gold tab. Gold is what you are here for: the crumbs, the readouts, the score, the square on the floor. Red belongs to the cats, to a shut wall on the compass, and to the Start key. Mint green is the machine's own voice: an open way, and the chalked line under the window.

Inside the glass it is dark. The floor is faintly ruled into cells, because the grid is the lesson and the player may as well see it.

## Evidence on Hand

- `ROADMAP.md` names project 11 as the maze and lists what it teaches: grid maps, walls, movement limits, tile collision, and a map stored as data. It also records that tile collision is what the tank game needs at project 16, and that map-as-data returns at project 18.
- `10-aliens/` is the project immediately before it, and its README fixes the keyboard and Phaser vocabulary this file assumes.
- Measured in a browser: every stub, filled in one at a time in file order, changes something visible and moves the status line on to the next one. All nine were checked this way.
- Measured in a browser: the three levels were flood-filled from the mouse's starting cell before they shipped, so no crumb is walled off and no level can be left unfinishable.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **The map is the truth.** Anything the game needs to know, it asks the map. Nothing is kept in a second place.
3. **A stub that changes nothing on screen is a bug.** All nine of them move something visible, and the rack exists to prove it.
4. **The bugs are part of the lesson.** The crumb that vanishes without emptying the vault is in the README by name.
5. **Give back what an earlier project already earned.** Lives and levels are written for him, so the nine stubs are all about the map.

## Accessibility & Inclusion

Every control is a real `<button>` carrying plain text or an `aria-label`. Start doubles as Pause and is reachable with **Enter**, announced with `aria-keyshortcuts`. Play again is disabled before the first game, and Start is disabled once the last life has gone. The status line is a live region and names the responsible function whenever the game does nothing.

The canvas takes `tabindex="0"` and shows its own focus ring inside the glass, so it is clear which part of the page the keyboard is talking to. The game is played entirely from the keyboard, as project 10 was.

The compass carries an `aria-label` and states its two answers with colour and shape together: an open way is green and lit, a shut way is red and dim. The counts on the rack are given as numbers as well as bars, and the lives are labelled. Motion in the door is limited to a hover lift and a press depression, both removed under reduced motion. The game's own movement is the point of the project and stays.

Touch is not supported. There are no on-screen controls, so a tablet can show the vault but cannot play it.

The setting is invented: no real place, no real bank, and nothing on screen but a mouse, some cats and some cheese.

---
