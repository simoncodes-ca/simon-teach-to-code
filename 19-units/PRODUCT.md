# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript, served by Vite, with Vitest tests. It keeps project 18's toolchain and drops the server.

| Package | Why it is here |
|---|---|
| `phaser` | The map window. 3.90.0, the same version as projects 9 to 18 |
| `vite` | The development server, the build step, and `import.meta.glob` for the maps |
| `typescript` | The type checker. `strict` is on |
| `vite-plugin-checker` | Prints type errors in the terminal and shows a count badge on the page |
| `vitest` | The test runner, run with `npm test` |

Two programs run from two terminals: `npm run dev` and `npm test`.

`@types/node` is gone, because nothing runs in Node. `tsconfig.json` loads `vite/client` types instead, for `import.meta.glob`. The `.ts` import endings, `allowImportingTsExtensions`, `verbatimModuleSyntax` and `erasableSyntaxOnly` stay, so the files read the same as project 18's.

`vite.config.ts` leaves the checker plugin out when `process.env.VITEST` is set, as in project 18.

`game.ts` reads every `maps/*.json` file with `import.meta.glob` when the page loads. Each file goes through a shape check and the finished `linesToMap`, and only 20 by 15 maps are kept. `island.json` and `crossing.json` are copied from `18-editor/maps`.

## Users

- **Simon (primary learner), 11 years old.** He has finished eighteen projects. He wrote his first tests at 18, and knows `Math.sqrt`, `Math.atan2` and speed times seconds from projects 7 and 16. He writes eight functions and two tests, and reads plain-language comments.
- **The father.** Designs the project.

## Product Purpose

The first project where the player commands units instead of steering one. It is the input half of the strategy game at the end of the trail.

Two ideas earn their place. The first is the reason the project exists.

**A click changes memory, and the frame acts on it.** Picking sets `tank.selected`. An order sets `goalX`, `goalY` and `moving`. Only `driveTank`, called every frame, moves anything. The rings, corners, crosses and squad lamps are all drawn from those fields. This is project 8's split between deciding and moving, applied to the mouse.

**A group order is one goal per unit.** `orderMove` walks the picked list and gives each tank its own spot from the given `parkingSpot`, so the squad arrives as a block instead of a pile.

Terrain from project 18's table now does something. `speedAt` scales every step, and `canDrive` stops a tank at water, rock, or the map's edge. Driving is a straight line. A tank that meets water stops and reports `'blocked'`, which is the problem project 20 solves.

## Positioning

Project 16 steered one tank at a time from the keyboard. This project commands six from the mouse, and nobody steers.

Project 18's `isInside` returns here as `isInBox`, in pixels. Project 18's `makeMap`, `isInside`, `terrainFor` and `linesToMap` are given in `map.ts`, copied from its answer key.

## Operating Context

- Two terminals in the project folder: `npm run dev` and `npm test`.
- Measured on Node 24.18.1.
- Best in VS Code, which shows type errors as the learner types.
- A mouse or trackpad to pick and order. Escape or the right button lets go of every tank.

## Capabilities and Constraints

**In scope now:**
- A 20 by 15 map of 48-pixel cells, drawn from the terrain table.
- Six tanks named Able to Fox, placed on every other drivable cell nearest to cell 4, 10.
- Hover ring, click to pick one, drag a box to pick several, click the ground to order.
- A drag starts after the mouse moves 6 pixels. Letting go outside the window still finishes the box.
- Parking in a square block round the click, 54 pixels apart.
- Driving at `TANK_SPEED` of 90 pixels a second times the terrain `speed` under the tank.
- A squad card with one row per tank: a lamp, its name, its last report, and the ground under it. Clicking a name picks that tank.
- An Under the mouse card, an Orders card with the live box edges, and a Maps card for every file in `maps/`.
- A status line that names the next empty function, found by trying each one on a tiny tank when the page loads.

**Stubs, in order:**

| # | File | Stub | Checker errors after | Tests after |
|---|---|---|---|---|
| | | Start | 8 | 4 failed, 2 todo |
| 1 | `units.ts` | `tankAt` | 7 | 3 failed, 1 passed, 2 todo |
| 2 | `units.ts` | `selectOnly` | 6 | 2 failed, 2 passed, 2 todo |
| 3 | `units.ts` | `selectedTanks` | 5 | 2 failed, 2 passed, 2 todo |
| 4 | `units.test.ts` | a box dragged backwards is the same box | 5 | 3 failed, 2 passed, 1 todo |
| 5 | `units.ts` | `boxFrom` | 4 | 2 failed, 3 passed, 1 todo |
| 6 | `units.ts` | `isInBox` | 3 | 2 failed, 3 passed, 1 todo |
| 7 | `units.ts` | `selectInBox` | 2 | 1 failed, 4 passed, 1 todo |
| 8 | `units.ts` | `orderMove` | 1 | 5 passed, 1 todo |
| 9 | `units.test.ts` | a tank stops at the edge of the water | 1 | 1 failed, 5 passed |
| 10 | `units.ts` | `driveTank` | 0 | 6 passed |

Every stub declares a return type, so the checker reports each empty one as TS2355. `selectOnly` and `selectInBox` return a count for that reason, and the wiring uses the count in its messages.

`driveTank` returns the union `Drive`: `'still' | 'driving' | 'arrived' | 'blocked'`. The squad card shows the last word that was not `'still'`.

**Explicitly deferred:** pathfinding (project 20), tanks blocking each other, a tank's whole box checked against terrain instead of its middle, shift-click to add or remove, control groups on number keys, a selection limit, and enemy units. Named in the README as good things to try next: shift-click, pick all with A, a race on Sandy Island, faster roads from the table, and a map painted in the editor.

**Hard constraints:**
- `units.ts` imports only `numbers.ts` and `map.ts`. Never Phaser, never the page.
- `map.ts` imports only `terrain.ts` and `numbers.ts`.
- Tests cover pure logic only: `units.ts`. Never the DOM or Phaser.
- No kind of ground is named outside `terrain.ts`, except `'water'` in the test stub, its hint, and its answer.
- Sounds keep the `Audio` pattern every project since the calculator has used.
- Comments use plain language for an 11-year-old.

## Brand Commitments

A field command post: an olive steel desk, a stencilled name plate, the map under a plotting sheet, and manila order cards clipped down the side. See `DESIGN.md`.

## Evidence on Hand

- `ROADMAP.md` names project 19 as unit selection: selecting one unit, several units, rectangle selection, and click-to-move.
- Measured with `tsc` 7.0.2 and Vitest 5.0.1, filling the answer key into a throwaway copy one job at a time: the counts in the stub table above.
- Measured in Chromium through `npm run dev`, after jobs 1, 2, 3, 5, 6, 7 and 8: the status line names the next job, and no step logs a console error.
- Measured in Chromium with every job done: hover names Able, a click picks one, a box picks six, an order on River Crossing blocks all six at the river, a single tank sent across grass arrives, Escape lets go, the map switch places a new squad, and a 390-pixel viewport has no sideways scroll.
- The six sounds were made by a short script that writes square waves and noise to WAV files. The two tank pictures and the six terrain tiles are copied from projects 17 and 18.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **Picking is a field, not a picture.** Every mark on the map is drawn from what a tank remembers.
3. **Show the dead end.** A blocked tank turns its row red and says why, because project 20 needs the question.
4. **Red before green.** A test stub turns the count red before its function turns it green.
5. **Name the next job.** The status line always says which function is next.

## Accessibility & Inclusion

Every squad row is a real `<button>` labelled with the tank's name, so a keyboard can pick a tank without the map. Every map in the Maps card is a `<button>` with `aria-pressed`. The status line is a live region.

A tank's report is written as a word, never shown in colour alone. The Under the mouse card and the box readout state everything in words and numbers.

Giving an order needs a pointer. There is no keyboard way to choose a spot on the map, which is a real limit, recorded here.

Below 900px the desk stands up into one column, squad buttons grow to 44px tall, and map buttons to 48px.
