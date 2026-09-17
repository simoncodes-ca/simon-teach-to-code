# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML, CSS and JavaScript. `tanks.html` and `styles.css`, six script files, and one vendored library, `phaser.min.js` (Phaser 3.90.0), next to the HTML. No build step, no npm, no network. Opens by double-clicking `tanks.html`.

The six scripts are ordinary `<script>` tags, loaded in this order: `numbers.js`, `arena.js`, `tank.js`, `shells.js`, `rack.js`, `game.js`. Project 14 introduced several script tags, and this is the first project with stubs in more than one of them.

The two Phaser settings that keep the page double-clickable are the ones project 9 introduced. Its `PRODUCT.md` records why they are needed.

The game uses no physics. Phaser loads, draws and tweens. Every tank and every shell is a plain object, moved by the learner's own functions. The pictures copy their numbers once a frame. That keeps the eight stubs pure logic, which is what project 17 adds types to.

The art is drawn in a browser canvas by a throwaway script and saved once. It is smooth rather than pixel art, because the tanks rotate to any angle. The arena floor is a JPEG, and the sprites are PNG. The sounds are made by a second throwaway script and saved as WAV files.

## Users

- **Simon (primary learner), 11 years old.** He has finished fifteen projects. The last two taught him several files and a server. This is the first game he builds that two people play at once. He fills in eight stubs and reads plain-language comments.
- **The father.** Designs the project, teaches alongside it, and is the obvious second player.
- **Anyone who picks it up to play.** It has to be a real two-player game. The tanks have to slide cleanly along walls, a bounced shot has to feel clever, and a hit has to feel like a hit.

## Product Purpose

The first game where things move at any angle, and where walls stop them without a grid.

Two ideas earn their place. The first is the reason the project exists.

**Move first, then take back the part that hit.** The cheese vault refused a step before it began, because the mouse lived on a grid. A tank does not, so it moves, asks `blocked`, and takes the move back. It moves across and down separately, so a slanting tank loses only the half that points into the wall, and slides. That is the "push back out of a wall" lesson projects 11 and 12 deferred to this project.

**A tank is one angle.** `stepAlong` turns an angle and a distance into a step. Driving, the end of the barrel, a shell's speed and the gun sight are all one call to it. The turret adds the second half of the idea: the way a gun points is the tank's angle plus the turret's.

The third lesson lives in the second file of stubs. `moveShell` has the same shape as `driveTank`, with one extra line that turns the blocked half round. A bounce off a block needs no angle maths, and the README says so.

Health is the fourth and smallest. The bars are drawn from `tank.health`, so the number is the truth and the bars are pictures of it. That is project 11's lesson about the map, pointed at a new thing.

## Positioning

The usual first tank game uses a physics engine, which does the sliding and the bouncing out of sight. Nothing here does. The learner writes both in about ten lines, and sees that they are one trick.

It is also the last project before TypeScript. Every entity is a plain object with a comment above it listing its fields. Project 17 turns those comments into types, so this project is written with that rewrite in mind.

There is no computer opponent. Enemy AI is project 23. Two players on one keyboard give a real opponent now, and need no AI at all.

## Operating Context

- Opened directly from the filesystem in a browser. No server, no install, no network.
- Read beside `14-split/` for the several-files vocabulary, which this project never explains again.
- Two players on one laptop keyboard. Blue sits on the left, Red on the right. There is no touch control, and that is recorded below as a real limit.
- Sessions are short: one or two stubs at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- Two tanks, Blue on W A S D with Q and E for the turret and Space to fire, Red on the arrows with , and . for the turret and / to fire.
- Tanks that turn and drive at any angle, slide along blocks, and cannot drive through each other.
- A turret that turns separately from the hull, and a dotted gun sight.
- Shells that bounce off blocks twice and end at the third, with a reload between shots.
- A shell cannot hurt its own tank until it has bounced.
- 100 health, 25 damage a hit, a wreck at 0, and small health bars over the tanks.
- Rounds across three arenas. The first tank to win three rounds wins the duel. A round where both tanks are wrecked at once is played again.
- Eight stubs, four in `tank.js` (`stepAlong`, `turnTank`, `driveTank`, `aimOf`) and four in `shells.js` (`fireShell`, `moveShell`, `shellHitsTank`, `damageTank`). Each file carries its own answer key.
- A rack that shows the learner's own numbers back to them: heading, aim, health, reload, shells flying, bounces and hits.
- A status line that tests all eight functions on every frame and names the first one that is still empty.
- `#demo` and `#demo-over` hashes that fill in unwritten stubs at runtime, the same as earlier projects.

**Explicitly deferred (later projects or extensions):** types, npm and `import` (project 17), editing and saving an arena (18), selecting and commanding several units (19), a route around walls (20), a computer opponent (23). Named in the README as good things to try next: a fourth arena, pushing a tank exactly up to the edge of a block, crates a shell can break, a repair kit, and armour that takes more damage from behind.

**Hard constraints:**
- One library, vendored next to the HTML. No npm, no build step, no bundler, no network. Project 17 is where those arrive.
- Classic scripts only. No `import`, no `export`, no `type="module"`.
- No physics bodies. Sliding and bouncing are the lesson, and a physics engine would hide them.
- A tank's box for walls is a square that never rotates. It is close enough for play, and it keeps `blocked` to four corners. The README says so.
- Nothing earlier projects taught is taught again. `cos` and `sin`, radians, speed times seconds, keys as state, maps as rows of characters, corner checks, distance, and several script tags are named and pointed back at.
- The map and the four-corner check are given, because projects 11 and 12 made the learner write both.
- The sounds keep the `Audio` pattern every project since the calculator has used.
- Comments use plain language for someone who has never programmed.
- Every completed stub makes something new visible.

## Brand Commitments

An army field console, painted olive, seen straight on. A stencilled sand-coloured plate across the top, a camera window onto the yard, and a rack of readouts down the side.

The plate reads **Tank Duel**, with **Duel** on a strip of hazard tape. Hazard yellow is the machine's own voice: the status line, the readouts, the Start key and the round cards. Blue and red belong to the two tanks, and to nothing else on the page.

Inside the window it is daylight. Sand, concrete blocks with a hazard band, and a faint grid, because the arena is still a map.

## Evidence on Hand

- `ROADMAP.md` names project 16 as the tank game: top-down movement, aiming, projectiles, obstacles, health and damage. It also records that pushing a thing back out of a wall was held back from projects 11 and 12 for this project.
- Measured in a browser: every stub, filled in one at a time in file order, moves the status line on to the next one. The same run drove a tank at a slant into a block and watched it slide.
- Measured in a browser: a full round played through with both tanks firing. Four hits wrecked Red, Blue took the round, and round 2 loaded the second arena with the wins kept.
- The three arenas are the same when turned upside down, so neither starting corner is better.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **One trick, used twice.** Driving and bouncing are the same five lines. The files are laid out so that is easy to see.
3. **A stub that changes nothing on screen is a bug.** All eight move something visible, and the rack exists to prove it.
4. **The bugs are part of the lesson.** The tank that sticks to walls and the shell that comes straight back are in the README by name.
5. **Plain objects, ready for types.** A tank and a shell hold numbers and names only. Their pictures live elsewhere.

## Accessibility & Inclusion

Every control is a real `<button>` carrying plain text. Start doubles as Pause and is reachable with **Enter**, announced with `aria-keyshortcuts`. Play again is disabled before the first game. Start is disabled between rounds and after a duel. The status line is a live region and names the responsible function whenever the game does nothing.

The canvas takes `tabindex="0"` and shows its own focus ring inside the frame. The game is played entirely from the keyboard.

The two tanks differ by colour, and also by name on every readout, by panel position, and by starting corner. The health bars show a number beside them. Motion on the console is limited to a hover lift and a press on the keys, and both are removed under reduced motion. The game's own movement is the point of the project and stays.

Touch is not supported. There are no on-screen controls, so a tablet can show the arena but cannot play it. Some laptop keyboards cannot report many held keys at once, so two players holding several keys each may lose a key press.

The setting is invented. The tanks are toys in a sand yard, and a wrecked tank turns dark and smokes. Nobody is shown being hurt.
