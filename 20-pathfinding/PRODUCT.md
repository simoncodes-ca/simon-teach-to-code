# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript, served by Vite, with Vitest tests. It keeps project 19's toolchain unchanged.

| Package | Why it is here |
|---|---|
| `phaser` | The map window. 3.90.0, the same version as projects 9 to 19 |
| `vite` | The development server, the build step, and `import.meta.glob` for the maps |
| `typescript` | The type checker. `strict` is on |
| `vite-plugin-checker` | Prints type errors in the terminal and shows a count badge on the page |
| `vitest` | The test runner, run with `npm test` |

Two programs run from two terminals: `npm run dev` and `npm test`.

`package.json`, `package-lock.json`, `tsconfig.json` and `vite.config.ts` are project 19's, with the name and the page changed.

`game.ts` reads every `maps/*.json` file with `import.meta.glob`, as in project 19. `crossing.json` and `island.json` are copied from `19-units/maps`. `horseshoe.json` is new. Its rock cup opens towards the squad's home, so it shows A\* taking a wrong turn.

## Users

- **Simon (primary learner), 11 years old.** He has finished nineteen projects. He wrote tests at 18 and 19. He knows queues and `shift` from project 2, `splice` from project 7, grids from projects 5 and 18, and `cellAt` and `middleOf` from project 11. He writes seven functions and two tests, and reads plain-language comments.
- **The father.** Designs the project.

## Product Purpose

Project 19 left the tanks stuck at the water on purpose. This project answers that dead end, and it is the hardest idea in the strategy game.

Two ideas earn their place. The first is the reason the project exists.

**A search is a frontier and one repeated step.** Take a cell out of the frontier. Stop if it is the goal. Otherwise add every walkable neighbour not found yet, with its step count and the cell it came from. An empty frontier proves that no route exists.

**Breadth-first and A\* differ in one choice.** Breadth-first takes the front of the frontier. A\* takes the cell with the smallest steps plus guess. The given `takeNext` holds that choice in one line, so the learner sees the whole difference in one place.

The route is read back from the `came` grid, goal first, with `unshift`. The tanks then follow it cell by cell, through a `driveTank` that is given.

## Positioning

Project 19 commanded six tanks that drove in straight lines. This project keeps the squad, the picking and the orders, all given, and replaces the straight line with a route.

The search counts steps and ignores terrain speed. A cost for each kind of ground is Dijkstra's algorithm, and it is a "try this next".

## Operating Context

- Two terminals in the project folder: `npm run dev` and `npm test`.
- Measured on Node 24.18.1.
- Best in VS Code, which shows type errors as the learner types.
- A mouse or trackpad to pick and order. Escape or the right button lets go of every tank.

## Capabilities and Constraints

**In scope now:**
- A 20 by 15 map of 48-pixel cells, drawn from the terrain table.
- Six tanks, placed as in project 19. Hover ring, click to pick, drag a box, click the ground to order. All given, copied from project 19's answer key.
- On an order, every picked tank calls `findRoute` from its own cell to the cell of its parking spot. A tank with no route stops, reports `no route`, and shows a fading red ring.
- The first picked tank's search plays on the map at `SEARCH_SPEED`, 45 cells a second. Found cells are shaded and numbered with their steps. Frontier cells get a blue square. The found route is a thick orange line.
- A Search card with Breadth-first and A\* buttons, and four wells: Looked at, Frontier, Route, Result. Changing the way replays the last order's search.
- An Under the mouse card with six wells: Cell, Ground, Ways out, Steps, Guess, Total.
- A squad card with one row per tank: a lamp, its name, its report, and the cells left on its route.
- A status line that names the next empty function, found by trying each one on a two-cell map when the page loads. The page uses a function only once its job is done.

**Stubs, in order:**

| # | File | Stub | Checker errors after | Tests after |
|---|---|---|---|---|
| | | Start | 7 | 4 failed, 2 todo |
| 1 | `paths.ts` | `neighbours` | 6 | 3 failed, 1 passed, 2 todo |
| 2 | `paths.ts` | `startSearch` | 5 | 2 failed, 2 passed, 2 todo |
| 3 | `paths.ts` | `searchStep` | 4 | 1 failed, 3 passed, 2 todo |
| 4 | `paths.ts` | `routeBack` | 3 | 4 passed, 2 todo |
| 5 | `paths.test.ts` | no route across a river with no bridge | 3 | 1 failed, 4 passed, 1 todo |
| 6 | `paths.ts` | `findRoute` | 2 | 5 passed, 1 todo |
| 7 | `paths.ts` | `guess` | 1 | 5 passed, 1 todo |
| 8 | `paths.test.ts` | A\* finds as short a route, and looks at fewer cells | 1 | 1 failed, 5 passed |
| 9 | `paths.ts` | `bestIndex` | 0 | 6 passed |

The A\* test is red before `bestIndex` because `splice(undefined, 1)` removes index 0. An empty `bestIndex` makes A\* behave exactly like breadth-first, so the looked counts are equal.

**The tie rule in `bestIndex`.** On equal totals, the cell with fewer steps wins. Measured over 18,000 random 20 by 15 grids: with the first-found cell winning ties, 169 A\* routes were longer than breadth-first's. With fewer steps winning ties, none were. That rule keeps `searchStep` simple, because a found cell never needs its steps replaced.

**Explicitly deferred:** diagonal moves, terrain cost (Dijkstra), tanks that block each other or plan around each other, a priority queue, smoothing the route, and searching in pixels instead of cells. Named in the README as good things to try next: corners, forest costing more, painting a trap for A\*, the route length in the squad list, and a bridge on River Crossing.

**Hard constraints:**
- `paths.ts` imports only `terrain.ts` and `map.ts`. Never Phaser, never the page.
- `units.ts` imports only `numbers.ts` and `map.ts`.
- Tests cover pure logic only: `paths.ts`. Never the DOM or Phaser.
- No kind of ground is named outside `terrain.ts`, except in the test files and their hints and answers.
- Sounds keep the `Audio` pattern every project since the calculator has used.
- Comments use plain language for an 11-year-old.

## Brand Commitments

A scout's route finder: a blue-grey steel desk, a stencilled name plate, the map under a plotting sheet, and graph-paper route cards clipped down the side. See `DESIGN.md`.

## Evidence on Hand

- `ROADMAP.md` names project 20 as pathfinding: the neighbours of a cell, a frontier, breadth-first search then A\*, and why a route can fail.
- Measured with `tsc` 7.0.2 and Vitest 5.0.1, filling the answer key into a throwaway copy one job at a time: the counts in the stub table above.
- Measured in Chromium through `npm run dev`, with no stubs, and after jobs 2, 3, 4, 7 and 9: the status line names the next job, each stage shows its payoff, and no step logs a console error.
- Measured in Chromium with every job done: hover shows neighbour dots and the wells, one tank on Horseshoe Rocks finds a 33-cell route and drives it, A\* replays the search, six tanks sent across River Crossing all report `no route`, and a 390-pixel viewport has no sideways scroll.
- Measured with the answer key, from cell 4, 10, cells looked at by breadth-first and A\*: River Crossing to 2, 1, 119 and 48. Sandy Island to 15, 4, 166 and 113. Horseshoe Rocks to 12, 1, 201 and 78. Horseshoe Rocks to 18, 12, 263 and 198. River Crossing to 16, 10, 123 and 123, with no route.
- `found.wav` was made by a short script that writes three square-wave pips to a WAV file. The other sounds, the tank pictures and the terrain tiles are copied from project 19.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **Show the search, not only the route.** Every found cell carries its number, so the frontier is something you watch.
3. **One choice separates the two ways.** Breadth-first and A\* share every line except `takeNext`.
4. **No route is an answer.** An empty frontier proves it, and the page says so.
5. **Red before green.** A test stub turns the count red before its function turns it green.
6. **Name the next job.** The status line always says which function is next.

## Accessibility & Inclusion

Every squad row is a real `<button>` labelled with the tank's name. The two way buttons and every map button use `aria-pressed`. The status line is a live region.

A tank's report is written as a word, never shown in colour alone. The Search and Under the mouse cards state everything in words and numbers.

Giving an order needs a pointer. There is no keyboard way to choose a spot on the map, which is a real limit, recorded here.

Below 900px the desk stands up into one column, squad buttons grow to 44px tall, and the way and map buttons to 48px.
