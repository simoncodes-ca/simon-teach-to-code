# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `runner.html`, `styles.css`, `runner.js`. One vendored library, `phaser.min.js` (Phaser 3.90.0), sits next to the HTML. The art is PNG files under `assets/`, and the sounds are hand-made WAV files. One `<canvas>` element is handed to Phaser and drawn with its Canvas renderer. There is no build step, no npm and no network. The page opens by double-clicking `runner.html`.

The two Phaser settings that keep the page double-clickable are the ones project 9 introduced. Its `PRODUCT.md` records why they are needed. A third setting, `roundPixels`, stops thin gaps opening between roof tiles.

Phaser's camera is used here, for the first time. Project 12 made the learner write `screen = world - camera` for every picture in the cave, so the library may now do it in one line. The four layers behind the runner are tile sprites stuck to the window and slid along by hand, which is what makes the parallax.

The browser's `localStorage` holds one record, under the key `rooftop-run`. Some browsers refuse storage on a `file://` page. The page checks at load and says so on the rack rather than failing quietly.

The art is pixel art at four times size. A throwaway script drew it from character maps and saved it once. The canvas carries `image-rendering: pixelated`, so a scaled window keeps hard edges.

## Users

- **Simon (primary learner), 11 years old.** He has finished twelve projects. The last four taught him Phaser, the keyboard, a map stored as data, and a camera. This is the first world he meets that nobody wrote down. He fills in eight stubs and reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and points at the obstacle count on the rack, which climbs for ever until the sixth function exists.
- **Anyone who picks it up to play.** It has to be a real endless runner. One key, a fair first minute, and a death that is always the player's fault.

## Product Purpose

The first game that builds its own world, and the first program that remembers anything after the page closes.

Three ideas earn their place.

**A world with no end is made just out of sight.** `growTheWorld` runs once a frame. It stops early while the last obstacle is still a window ahead, and otherwise puts down one more. The wiring calls it forty times before a run starts, so the first screen is ready before anybody sees it. An empty `growTheWorld` leaves bare rooftops, so the idea cannot be skipped.

**A game that never ends has to forget.** `forgetOldObstacles` drops what is behind the window. Leaving it empty costs nothing the player can see, which is exactly why the rack counts the list out loud. Measured in a browser, it had reached 25 by 460 metres and was still climbing, while the screen held two.

**A best score is worth having only if it survives a refresh.** `loadRecord` and `saveRecord` are five lines together. The record is an object, so `JSON.parse` and `JSON.stringify` earn their place rather than being demonstrated.

The difficulty curve is the fourth thing, and it is two formulas rather than a script. `runSpeed` grows with distance and stops at a ceiling. `nextGap` measures a gap in seconds and turns it into pixels with that same speed. The bug that teaches it is a gap measured in pixels: fair at 300 pixels a second, impossible at 700.

## Positioning

The usual endless-runner tutorial ships a finished generator and asks the learner to change a number in it. That teaches the number.

Here the generator is the deliverable. Three of the eight stubs are the world being made, one is the world being thrown away, and the rack shows each one's answer back to the learner while they work.

Nothing earlier is taught again. Gravity, `speed × seconds`, keys as state, a backwards loop over a list, box-to-box collision and the camera are all named and pointed back at. The lesson is what is genuinely new.

## Operating Context

- Opened directly from the filesystem in a browser. No server, no install, no network.
- Read beside `12-cave/cave.js` for the camera and the given wiring, and `08-parachuters/parachuters.js` for the shape of a sprite object. Neither is explained again.
- Keyboard only, on a laptop or desktop. There is no touch control, and that is recorded below as a real limit.
- Sessions are short: one or two stubs at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- A rooftop that never ends, made one obstacle at a time as the runner reaches it.
- Three kinds of obstacle in a table, each with a box and a distance at which it starts turning up.
- A runner who only ever jumps, with gravity and a roof given in the wiring.
- A difficulty curve in two parts: a speed that grows to a ceiling, and a gap measured in seconds.
- A distance score in metres, and one record saved in the browser holding the best run and how many runs there have been.
- One life. A run ends the first time the runner touches anything.
- Eight stubs: `runSpeed`, `startJump`, `nextGap`, `pickObstacle`, `growTheWorld`, `forgetOldObstacles`, `loadRecord`, `saveRecord`.
- A rack that shows the learner's functions back to them: metres and speed, a speed marker between the starting speed and the ceiling, two lamps for the runner's feet, a sample of the next gap and the next kind taken twice a second, the length of the obstacle list split into ahead and behind, and the saved record.
- A status line that names the exact stub responsible whenever the game does nothing, covering all eight in order.
- `#demo` and `#demo-over` hashes that fill in unwritten stubs at runtime, the same as projects 8 to 12. Neither ever writes to the saved record.
- Graduated hints per stub, and one answer key at the bottom of the file.

**Explicitly deferred (later projects or extensions):** a score table shared between two computers (project 15), types over the entity table (17), a terrain table edited by hand (18). Left out on purpose and named in the README as good things to try next: a fourth kind of obstacle, night falling as the run goes on, a double jump, and a mark on the rooftop where the best run ended.

**Hard constraints:**
- One library, vendored next to the HTML. No npm, no build step, no bundler, no network. Project 17 is where those arrive.
- No ES modules. `phaser.min.js` and `runner.js` are two ordinary `<script>` tags, because `file://` blocks `import`.
- No Phaser physics bodies. Gravity and the roof are four given lines, and a physics body would hide them.
- `growTheWorld` puts down one obstacle per call rather than looping. A `while` loop written by a learner whose `nextGap` returns zero locks the browser, and no wiring can rescue it.
- Nothing earlier projects taught is taught again.
- The sounds keep the `Audio` pattern every project since the calculator has used.
- Comments use plain language for someone who has never programmed.
- Every completed stub makes something new visible, and the first one starts the runner moving.

## Brand Commitments

A cream plastic handheld, seen straight on. Warm shell, a coral nameplate, a glossy screen and a rack of readouts down the side.

The plate reads **Rooftop Run**, with **Run** knocked out in amber on a dark tab. Coral is the machine: the plate, the panel edges, the Start key. Mint is the live readout: metres, speed, the roof lamp. Amber is the record and the sunset: the best score, the air lamp, the sun behind the city.

Inside the screen it is dusk. The sky runs from deep violet to amber, two rows of buildings sit behind the runner at different speeds, and the rooftop itself is cool grey brick. The runner is small and bright against all of it.

## Evidence on Hand

- `ROADMAP.md` names project 13 as the endless runner. It lists generated obstacles, difficulty curves, a game with no end, and saving with `localStorage` and `JSON`.
- `12-cave/README.md` promised that project 13 builds the world ahead of the camera and saves a best score.
- Measured in a browser: every stub, filled in one at a time in file order, changes something visible and moves the status line on to the next one.
- Measured in a browser: with all eight filled in, a script that jumps at the right moment ran 790 metres without crashing, all three kinds of obstacle appeared, and the obstacle list stayed between three and six with at most two on screen.
- Measured in a browser: a run ended on purpose wrote `{"best":334,"runs":2}` to the browser's storage, and the plate read 334 back after a refresh.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **The world is made, not written down.** Nothing in the file describes a level, and there is no level to describe.
3. **A stub that changes nothing on screen is a bug.** All eight change something, and the rack exists to prove it.
4. **The bugs are part of the lesson.** A gap measured in pixels and a jump with no rule about the roof are both in the README by name.
5. **Save something worth saving.** The record is saved because the learner minds about losing it, not because saving was the topic.

## Accessibility & Inclusion

Every control is a real `<button>` carrying plain text or an `aria-label`. Start doubles as Pause and is reachable with **Enter**, announced with `aria-keyshortcuts`. Run again is disabled before the first run, and Start is disabled once a run has ended. The status line is a live region and names the responsible function whenever the game does nothing.

The canvas takes `tabindex="0"` and shows its own focus ring inside the glass, so it is clear which part of the page the keyboard is talking to. The game is played entirely from the keyboard, as projects 10 to 12 were. Both the up arrow and the space bar jump, and the page stops the space bar scrolling.

The instruments carry `aria-label`s. The two foot lamps state their answer with colour and glow together: mint on the roof, amber in the air. Metres, speed, gap and the list length are all given as numbers. Motion in the console is limited to a hover lift and a press depression, both removed under reduced motion. The game's own movement is the point of the project and stays.

Touch is not supported. There are no on-screen controls, so a tablet can show the rooftops but cannot play them.

The setting is invented: no real city, no real company, and nothing on screen but a runner, some crates and a sunset.

---
