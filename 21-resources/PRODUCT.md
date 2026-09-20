# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript, served by Vite, with Vitest tests. It keeps project 20's toolchain unchanged.

| Package | Why it is here |
|---|---|
| `phaser` | The map window. 3.90.0, the same version as projects 9 to 20 |
| `vite` | The development server, the build step, and `import.meta.glob` for the maps |
| `typescript` | The type checker. `strict` is on |
| `vite-plugin-checker` | Prints type errors in the terminal and shows a count badge on the page |
| `vitest` | The test runner, run with `npm test` |

Two programs run from two terminals: `npm run dev` and `npm test`.

`package.json`, `package-lock.json`, `tsconfig.json` and `vite.config.ts` are project 20's, with the name and the page changed.

`game.ts` reads every `maps/*.json` file with `import.meta.glob`, as in projects 19 and 20. Both map files are new, because a map now needs ore on it.

## Users

- **Simon (primary learner), 11 years old.** He has finished twenty projects. He wrote tests at 18, 19 and 20. He knows grids from projects 5, 18 and 20, `Math.min` and `Math.max` from projects 12 and 16, and per-second movement from project 7. He writes seven functions and two tests, and reads plain-language comments.
- **The father.** Designs the project.

## Product Purpose

Project 20 gave the tanks a route. They drove it, they arrived, and then they stopped. Nothing in the first twenty projects produces anything.

This project is the first economy. Two ideas earn their place.

**A number that grows over time grows by a rate times the seconds.** A harvester digs `DIG_RATE` ore a second. It tips `UNLOAD_RATE` ore a second into the refinery. Both are project 7's `speed × seconds`, moved from pixels to ore. Neither one may take more than is there, so both end in `Math.min`.

**A bar is one number between 0 and 1.** `fullness(part, whole)` is the first function in the file. The load bars, the refinery bar and the shading on each patch all read it. One function, eight places on the page.

The run itself is a state machine. A harvester is `waiting`, then `to ore`, then `digging`, then `home`, then `unloading`, and then round again. That is the lift from project 2, running for ever. `nextJob` asks four questions in a fixed order, and asking them out of order leaves a full harvester digging a patch it has no room for.

## Positioning

Project 20 commanded six tanks that found a route and drove it. This project keeps the map, the picking, the orders and the pathfinding, all given. It replaces the arrival with a job.

The harvesters spend the credits on nothing. Buying things is project 22, and a build time is its lesson.

## Operating Context

- Two terminals in the project folder: `npm run dev` and `npm test`.
- Measured on Node 24.18.1.
- Best in VS Code, which shows type errors as the learner types.
- A mouse or trackpad to pick a harvester and send it. Escape or the right button lets go of every harvester.

## Capabilities and Constraints

**In scope now:**

- A 20 by 15 map of 48-pixel cells, drawn from the terrain table. Two maps, `ore-valley.json` and `river-mine.json`. River Mine keeps every patch on the far side of a river, with one bridge.
- A seventh kind of ground, `ore`, added to the terrain table as one line. It is walkable, at a speed of 0.8. Its tile is new, written by a script.
- An eighth column in the terrain table, `holds`. It says how much ore one fresh cell of that ground holds. Ore ground holds 240. Every other ground holds 0.
- An ore field: a grid of numbers over the map, the same shape as `map.cells`. `field.amount[row][col]` is the ore left in a cell. A patch that reaches 0 keeps its ground, loses its number, and is drawn grey.
- A refinery at cell 4, 10 on every map, where project 20's squad started. The six harvesters start around it.
- Six harvesters, named as in projects 19 and 20. Hover ring, click to pick, drag a box, click the ground to send. All given, copied from project 20.
- A harvester carries `load` and `job`. `CAPACITY` is 100 ore. `DIG_RATE` is 25 ore a second. `UNLOAD_RATE` is 60 ore a second. A patch holds 240, so one patch is a little under two and a half loads.
- Seven job words, six of which `nextJob` hands back. The seventh, `driving`, is the page's own word for a harvester the player sent somewhere.
- Once `nextJob` works, every idle harvester chooses its own job and the run goes round on its own. An order from the player interrupts it, and the harvester takes a new job when it arrives.
- A harvester with no route to any patch reports `no route` and waits. Project 20's failed search, reused.
- A Refinery card: the ore a minute, the loads tipped in, the harvester at the hopper, and a bar for how full it still is. The rate is every credit so far, shared out over the minutes the run has lasted, so it holds steady instead of jumping between bursts.
- The credits counter itself sits on the plate, in amber, half as big again as its neighbours.
- A Field card: patches left, ore left on the map, and a bar for the ore taken out of the field so far.
- A squad card with one row per harvester: a lamp, its name, its job as a word, and its load bar.
- An Under the mouse card with six wells: Cell, Ground, Ore, Full, Nearest patch, and Steps to it.
- A status line that names the next empty function, found by trying each one on a two-cell field when the page loads. The page uses a function only once its job is done.

**Stubs, in order:**

| # | File | Stub | Checker errors after | Tests after |
|---|---|---|---|---|
| | | Start | 7 | 4 failed, 2 todo |
| 1 | `ore.ts` | `fullness` | 6 | 3 failed, 1 passed, 2 todo |
| 2 | `ore.ts` | `oreAt` | 5 | 2 failed, 2 passed, 2 todo |
| 3 | `ore.ts` | `nearestOre` | 4 | 1 failed, 3 passed, 2 todo |
| 4 | `ore.test.ts` | a cell never gives up more ore than it holds | 4 | 2 failed, 3 passed, 1 todo |
| 5 | `ore.ts` | `takeOre` | 3 | 1 failed, 4 passed, 1 todo |
| 6 | `ore.ts` | `digStep` | 2 | 5 passed, 1 todo |
| 7 | `ore.test.ts` | unloading moves the whole load, and never more | 2 | 1 failed, 5 passed |
| 8 | `ore.ts` | `unloadStep` | 1 | 6 passed |
| 9 | `ore.ts` | `nextJob` | 0 | 6 passed |

`nextJob` has no test. It reads the map and the refinery and returns a word, and every part it stands on is tested already.

**The two clamps.** `takeOre` hands back the smaller of what was asked for and what the cell holds. `digStep` asks for the smaller of `DIG_RATE × seconds` and the room left in the harvester. Remove either one and the load bar runs off the end of its track, which the README names as a bug to expect.

**Explicitly deferred:** spending credits, which is project 22, ore that grows back, more than one refinery, harvesters that queue at the refinery, a second resource, and a harvester that picks a patch another harvester has already claimed. Named in the README as good things to try next: ore that grows back, a bigger bed for one harvester, stopping two harvesters heading for the same patch, a second refinery, and a field painted in project 18's editor.

**Hard constraints:**

- `ore.ts` imports `numbers.ts`, `terrain.ts`, `map.ts`, `paths.ts`, and `units.ts` for the `Harvester` and `Job` types. Never Phaser, never the page. `nearestOre` reuses project 20's `guess`.
- `units.ts` imports only `numbers.ts` and `map.ts`. `paths.ts` imports only `terrain.ts` and `map.ts`.
- Tests cover pure logic only: `ore.ts`. Never the DOM or Phaser.
- No kind of ground is named outside `terrain.ts`, except in the test files and their hints and answers. `makeField` reads the table's `holds` column, so it never says the word.
- Sounds keep the `Audio` pattern every project since the calculator has used.
- Comments use plain language for an 11-year-old.

## Brand Commitments

A refinery weighbridge office: dark steel, amber lamps, a brass ore counter, and dusty weigh tickets clipped down the side. It is projects 19 and 20's desk again, in the colours of the mine. See `DESIGN.md`.

## Evidence on Hand

- `ROADMAP.md` names project 21 as resources: workers, resources, production over time, counters, and progress bars.
- Project 20's `PRODUCT.md`, `paths.ts` and `README.md` set the shape this project copies: seven function stubs, two test stubs, an answer key per file, and a status line that names the next job.
- Project 18's `terrain.ts` was built so a new kind of ground is one line and one picture. This project is the first to add one.
- Project 20's `game.ts` places the squad around cell 4, 10, so the refinery stands there and no placement code changes.
- Measured with `tsc` 7.0.2 and Vitest 5.0.1, filling the answer key into a throwaway copy one job at a time: every count in the stub table above, start to finish.
- Measured in Chrome through `npm run dev`, with every stub filled, from the moment a map appears. Ore Valley: 15 patches, 3600 ore, 1600 credits after a minute, 2938 after two, about 1450 ore a minute. River Mine: 17 patches, 4080 ore, 1199 credits after a minute, 2751 after two, about 1380 ore a minute.
- Measured in Chrome: the run starts itself, a squad click then a map click sends one harvester, the only console messages are two favicon 404s that project 20's page also produces, and a 390px viewport has no sideways scroll with 44px squad buttons and 48px map buttons.
- All six harvesters head for the same patch, because each asks `nearestOre` from the same place at the same time. Recorded as a deferred limit, and named in the README.
- The terrain tiles and the six sounds are copied from project 20. `ore.png` is new, written by a short script that deflates a PNG by hand. The harvester is new art: `truck-blue.png`, a top-down truck in project 20's blue, and `load-ore.png`, the amber ore sitting in its bed.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **One rate, times the seconds.** Digging and unloading are the same line, and project 7 wrote it first.
3. **Never take more than is there.** Both stubs that move ore end in `Math.min`.
4. **A bar is a number.** One `fullness` feeds every bar on the page.
5. **The run goes round on its own.** The last stub closes the loop, and nothing after it needs a click.
6. **Name the next job.** The status line always says which function is next.

## Accessibility & Inclusion

Every squad row is a real `<button>` labelled with the harvester's name. The map buttons use `aria-pressed`. The status line and the credits counter are live regions.

A harvester's job is written as a word, never shown in colour alone. Every bar states its number next to it.

Sending a harvester needs a pointer. There is no keyboard way to choose a cell on the map, which is a real limit, recorded here.

Below 900px the desk stands up into one column, squad buttons grow to 44px tall, and the map buttons to 48px.
