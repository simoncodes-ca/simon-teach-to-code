# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `cave.html`, `styles.css`, `cave.js`. One vendored library, `phaser.min.js` (Phaser 3.90.0), sits next to the HTML. The art is PNG files under `assets/`, and the sounds are hand-made WAV files. One `<canvas>` element is handed to Phaser and drawn with its Canvas renderer. There is no build step, no npm and no network. The page opens by double-clicking `cave.html`.

The two Phaser settings that keep the page double-clickable are the ones project 9 introduced. Its `PRODUCT.md` records why they are needed. A third setting, `roundPixels`, stops thin gaps opening between rock tiles.

The game uses no physics system and no Phaser camera. Phaser draws, loads and tweens. The ship moves by the learner's own `flyShip`. Every picture reaches the window through the learner's own `toScreen`. Phaser's camera does that subtraction for free, and using it here would hide the one idea the project exists to teach.

The art is pixel art at four times size. A throwaway script drew it from character maps and saved it once. The canvas carries `image-rendering: pixelated`, so a scaled window keeps hard edges.

## Users

- **Simon (primary learner), 11 years old.** He has finished eleven projects. The last three taught him Phaser, the keyboard, and a map stored as data. This is the first world he meets that is bigger than the window. He fills in seven stubs and reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and points at the three wells on the rack, where world minus camera equals screen on every frame.
- **Anyone who picks it up to play.** It has to be a real flying game. The engine has to feel responsive, the cave has to be fair, and a crash has to be the pilot's fault.

## Product Purpose

The first project where the world is larger than the window, so every thing in it has two positions.

Three ideas earn their place, and the first is the reason the project exists.

**Screen position is world position minus camera position.** `toScreen` is that one line, and it is the first stub. Every rock, crystal, lamp and the ship reach the window through it. An empty `toScreen` leaves the window dark, so the idea cannot be skipped.

**A camera follows the player, and it has edges.** `aimCamera` centres the ship, then clamps `camera.x` between 0 and `WORLD_WIDTH - WIDTH`. The two unclamped lines work for a moment, then show black space past the end of the cave. The README names that as a bug to expect.

**A big world only draws what the window can see.** `isOnScreen` is built from `toScreen`. The rack counts the pictures drawn each frame, so the saving is a number the learner watches fall from about 900 to about 130.

The fourth thing the project teaches lives in a bug. An `isRock` fed screen pixels instead of world pixels works perfectly near the start, where the camera sits at 0,0. Further along it crashes the ship in open air. The README explains that bug by name, because it proves that the rock lives in the world.

## Positioning

The usual scrolling tutorial calls `camera.startFollow(player)` and moves on. That gives a scrolling game and teaches nothing about coordinates.

This project leaves the library's camera alone, the way project 10 left the swarm to the learner. The learner writes the subtraction, the follow and the clamp. Project 13 can then use Phaser's camera, and the learner will know what it does.

Terrain collision stays simple on purpose. Four corners of a box are checked against the map, and touching rock is a crash. Nothing is pushed back out of a wall. That lesson belongs to the tank game at project 16.

## Operating Context

- Opened directly from the filesystem in a browser. No server, no install, no network.
- Read beside `11-vault/vault.js` for the map and cell vocabulary, and beside `10-aliens/aliens.js` for keys. Neither is explained again.
- Keyboard only, on a laptop or desktop. There is no touch control, and that is recorded below as a real limit.
- Sessions are short: one or two stubs at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- One cave, 72 cells by 18, written as 18 strings of characters. The window shows 16 by 12.
- A ship with gravity, an engine on the up arrow, and a fixed sideways speed on left and right.
- A camera that follows the ship in both directions and stops at the edges of the cave.
- Culling: pictures outside the window are hidden and not moved.
- Twelve crystals, two lamps that set where the next ship appears, and a gate at the far end.
- Three ships, a crash on touching rock, and a game over.
- Seven stubs: `toScreen`, `steerShip`, `flyShip`, `aimCamera`, `isOnScreen`, `isRock`, `shipHitsRock`.
- A rack that shows the learner's functions back to them: the ship's world, camera and screen positions, the camera's position against its two limits, a map of the whole cave with the camera's box on it, a count of pictures drawn, an engine lamp, a climb gauge, and four corner lamps.
- A status line that names the exact stub responsible whenever the game does nothing, covering all seven in order.
- `#demo` and `#demo-over` hashes that fill in unwritten stubs at runtime, the same as projects 8 to 11.
- Graduated hints per stub, and one answer key at the bottom of the file.

**Explicitly deferred (later projects or extensions):** a world generated as you play and a saved best score (project 13), Phaser's own camera (13), pushing a moving thing out of a wall (16), turning a click into a world position for editing (18). Left out on purpose and named in the README as good things to try next: fuel, a second cave, a background layer that scrolls slower than the rock, a camera that looks ahead, and a click that marks a spot in the cave.

**Hard constraints:**
- One library, vendored next to the HTML. No npm, no build step, no bundler, no network. Project 17 is where those arrive.
- No ES modules. `phaser.min.js` and `cave.js` are two ordinary `<script>` tags, because `file://` blocks `import`.
- No Phaser camera and no physics bodies. Both would do the stubs' work invisibly.
- Nothing earlier projects taught is taught again. Gravity, `speed × seconds`, keys as state, the steering `else`, cells from pixels and the edge of the map as a wall are named and pointed back at.
- Lives and the map-building loop are given, because projects 10 and 11 already made the learner write both.
- The sounds keep the `Audio` pattern every project since the calculator has used.
- Comments use plain language for someone who has never programmed.
- Every completed stub makes something new visible, and the first one lights the window.

## Brand Commitments

A mine rescue console, seen straight on. Olive-charcoal steel, a hazard-yellow nameplate with warning stripes, a camera window with scan lines and viewfinder corners, and a rack of instruments down the side.

The plate reads **Cave Flyer**, with **Flyer** knocked out in yellow on a black tab. Yellow is the ship and the machine: the plate, the score, the ship's dot on the cave map, the Start key. Cyan is crystal: the crystals themselves, the readouts, the status line. Orange-red is danger: the engine flame, a falling ship on the gauge, a corner inside the rock, and the crash.

Inside the window the cave is dark. Rock that touches air has a lit face, and rock buried deep is nearly black, so the tunnel reads clearly at a glance.

## Evidence on Hand

- `ROADMAP.md` names project 12 as the scrolling world. It lists gravity and thrust, scrolling, world and camera coordinates, and collision with terrain.
- `11-vault/README.md` promised that the cell-and-pixel pair returns here, and that the screen formula is the same idea as `middleOf`.
- Measured by a script before the map shipped: every column of the cave has at least 3 cells of air, every join between columns overlaps by at least 3 cells, and every crystal, lamp and the gate can be reached from the start.
- Measured in a browser: every stub, filled in one at a time in file order, changes something visible and moves the status line on to the next one.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **The rock lives in the world.** Anything the game asks about the cave, it asks in world pixels. Screen pixels are only for drawing.
3. **A stub that changes nothing on screen is a bug.** All seven of them move something visible, and the rack exists to prove it.
4. **The bugs are part of the lesson.** The ship that crashes in open air is in the README by name.
5. **Write the thing once before the library does it.** Phaser's camera is left alone here so that it means something at project 13.

## Accessibility & Inclusion

Every control is a real `<button>` carrying plain text or an `aria-label`. Start doubles as Pause and is reachable with **Enter**, announced with `aria-keyshortcuts`. Play again is disabled before the first game, and Start is disabled once the last ship has gone. The status line is a live region and names the responsible function whenever the game does nothing.

The canvas takes `tabindex="0"` and shows its own focus ring inside the glass, so it is clear which part of the page the keyboard is talking to. The game is played entirely from the keyboard, as projects 10 and 11 were.

The instruments carry `aria-label`s. The corner lamps state their answer with colour and glow together: green for air, orange-red and brighter for rock. The positions and the drawn count are given as numbers. Motion in the console is limited to a hover lift and a press depression, both removed under reduced motion. The game's own movement is the point of the project and stays.

Touch is not supported. There are no on-screen controls, so a tablet can show the cave but cannot play it.

The setting is invented: no real mine, no real company, and nothing on screen but a small ship, some rock and some crystals.

---
