# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `battleship.html`, `styles.css`, `battleship.js`, with hand-made assets under `assets/`. No build step, no dependencies, no framework, no network. Opens by double-clicking `battleship.html`. This matches the four sibling projects, where the source itself is the deliverable and tooling would obscure it.

## Users

- **Simon (primary learner), 11 years old.** He did the calculator, the elevator, hangman and blackjack. His job is to open `battleship.js`, read it top to bottom, and fill in the stubbed functions until a game can be played end to end. He reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and explains how what is on screen maps to the code that produces it.
- **The player.** Whoever picks the game up to play a round. The rules must be correct and the enemy must never cheat.

## Product Purpose

A working game of Battleship that is simultaneously the first lesson in maps. Blackjack taught that a thing in a program can be an object. Battleship keeps that and adds the idea the rest of the trail is built on: **a map is a list of rows, and each row is a list of squares**, reached as `grid[row][col]` in that order, every time.

It also teaches a second idea that no earlier project could: **a program keeps a secret by choosing not to show it, not by not knowing it.** `enemySea.ships` is sitting in memory the whole time. One `false` passed to the drawing code is the only thing between the player and the answer.

## Positioning

Most beginner Battleship tutorials store the board as one grid of letters — `"S"` for ship, `"X"` for hit, `"O"` for miss — and quietly teach that a square holds one fact. It does not: a hit square holds a ship *and* a shot. This project keeps `ships` and `shots` as separate grids from the first line, which makes `fireAt` three honest cases instead of a tangle, lets the same function serve both sides, and makes hidden information a decision the learner can see being made rather than an accident of storage.

## Operating Context

- Opened directly from the filesystem in a browser — no server, no install, no network.
- Edited in a text editor beside the running page, likely with both windows visible at once.
- Sessions are short: one or two stub functions at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- Two 10×10 seas, each holding a `ships` grid and a `shots` grid, all four built by the learner's `makeGrid`.
- A five-ship fleet — Carrier 5, Battleship 4, Cruiser 3, Submarine 3, Destroyer 2 — as an array of objects with a name and a length.
- Manual placement by clicking, with a live ghost of the ship under the cursor that turns green where it fits and red where it does not, a Rotate button (and the **R** key) for direction, and a Scatter button that places the whole fleet at random.
- Random fleet placement by guess-and-check, with a counted try limit so a mistake upstream cannot freeze the page.
- Firing with three ordered cases — already fired, miss, hit — recorded in `shots` and reported as text.
- Sinking detected by counting hit squares against `ship.length`, so an unplaced ship is never reported sunk.
- A random enemy that never fires at the same square twice, choosing its square a beat before it fires so the choice is visible as a ring on the player's chart.
- Four named phases — `placing`, `yourTurn`, `enemyTurn`, `finished` — with the phase shown on the table and driving every button.
- A brass bearing plate reading out the square under the cursor, a roster that crosses ships off as they go down, and a signal log of every shot.
- Graduated hints per stub in comments: a gentle nudge, then a stronger hint, then a pointer to the answer key — one comment block at the bottom of `battleship.js`, grouped by function.

**Explicitly deferred (later projects or extensions):** an enemy that hunts around its last hit, ships placed diagonally or adjacent-forbidden, a salvo variant firing one shot per surviving ship, a two-player hot-seat mode, a running score across games, drag-and-drop placement, and any animation of the shell in flight. The clever enemy is named in the source as the good thing to try next, because it is a rule the learner can add without touching anything else.

**Hard constraints:**
- No dependencies, no build step, no framework, no network requests.
- The whole implementation stays small enough for a beginner to read end to end.
- No abstraction that exists only for elegance. Repetition he can follow beats indirection he cannot.
- Comments use plain language for someone who has never programmed.
- Simon writes the grid builder, the square names, the ship footprint, the fit test, the placement, the random fleet, firing, sinking, fleet destruction, the enemy's choice, and the enemy's turn. The HTML/CSS, both charts, the ghost preview, the log, the roster, the enemy timer, the phase-driven buttons and the restart flow are given.
- The initial page is an inert scaffold: two empty chart frames, a blank bearing plate, and a status line naming the first stub. Every completed stub makes something new visible on screen.
- Stubs are filled in file order, top to bottom.

## Brand Commitments

"Simon's Battleship" is one wardroom plotting table seen from directly above: oiled teak with a brass inlay, two sea charts under glass, and moulded pegs in the board. Brass is reserved for things that carry meaning — the bearing plate, the chart frames, the phase pill, the roster ribs. Red appears only for a hit, a sunk ship or a loss. No radar sweep, no camouflage stencil, no explosions drawn on the water.

## Evidence on Hand

- `ROADMAP.md` names Battleship project 5 and lists what it teaches: two-dimensional arrays, rows, columns and coordinates, nested loops, random placement, overlap checking, turn-taking, hidden information and game phases. It also records why this project matters later: "Battleship teaches maps made of cells. Later projects turn those cells into terrain, buildings, units, resources, and movement areas."
- The sibling projects `01-calculator/` through `04-blackjack/` establish the pattern: three files, pre-written wiring, stubbed core with plain-language doc comments, graduated hints, an answer key at the bottom, demo URL hashes, and a themed skin that makes the source worth reading. Simon completed and understood all four.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as an enemy that fires twice.
2. **The invisible is made visible.** Where a ship would land, which square the enemy has chosen, and the name of the square under the cursor are all normally hidden inside a program. Here each one has a place on the table.
3. **Correctness is non-negotiable.** It is a real game of Battleship before it is a teaching aid.
4. **Scope stays small on purpose.** A cleverer enemy is a rule, not an idea.
5. **Beauty earns the reading.** The page has to feel like a table worth standing at, or the source will never get read.

## Accessibility & Inclusion

No product-specific requirement beyond the general floor. Every square is a real `<button>` carrying an `aria-label` that names it — "C7", plus its ship and any peg — so a chart is playable without seeing it; a square in enemy waters never names a ship, because the sighted player cannot see one either. Squares are disabled outside the phase that allows them, rather than merely dimmed. Phase, status and the signal log are live regions. Hits and misses differ in colour and in position — a red peg and a white peg are told apart by the log line as well — and a sunk ship is struck through on the roster rather than only recoloured. Reduced-motion users get the pegs and the plaque already in place, and the enemy's ring holds still.

---
