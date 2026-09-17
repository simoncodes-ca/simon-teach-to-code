# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript, served by Vite, with a Node server and Vitest tests. It keeps project 17's toolchain and adds two packages.

| Package | Why it is here |
|---|---|
| `phaser` | The map window. 3.90.0, the same version as projects 9 to 17 |
| `vite` | The development server and the build step that strips the types |
| `typescript` | The type checker. `strict` is on |
| `vite-plugin-checker` | Prints type errors in the terminal and shows a count badge on the page |
| `vitest` | **New.** The test runner, run with `npm test`. No configuration file |
| `@types/node` | **New.** Types for `node:http`, `node:fs` and `node:path` in `server.ts` |

Three programs run from three terminals: `npm run dev`, `npm run server` and `npm test`.

`server.ts` runs with `node server.ts`, using Node's built-in type stripping. Node needs full file names in imports, so every import in the project ends in `.ts`. `tsconfig.json` sets `allowImportingTsExtensions`, `verbatimModuleSyntax` and `erasableSyntaxOnly`, which together keep every file runnable by Node, Vite and Vitest alike.

`vite.config.ts` leaves the checker plugin out when `process.env.VITEST` is set, so `npm test` does not start a second type checker.

The server keeps each map as its own file in `maps/`, written with one row of letters per line so the file reads as a map. Two seed maps ship with the project: `island.json` and `crossing.json`.

## Users

- **Simon (primary learner), 11 years old.** He has finished seventeen projects. He wrote a server at 15, and types at 17. He writes seven functions and his first two tests, and reads plain-language comments.
- **The father.** Designs the project, and helps start three terminals the first time.

## Product Purpose

A map editor for the strategy game at the end of the trail, and the first project with tests.

Three ideas earn their place. The first is the reason the project exists.

**Content as data.** `terrain.ts` is one table. Each line holds a kind of ground's letter, name, picture, colour, `walkable` and `speed`. The palette, the loader, the hover panel and the learner's save and load functions all read the table, and none of them names a kind of ground. A new terrain is one line and one picture. `TerrainKey` is `keyof typeof TERRAIN`, so the type follows the table too.

**Map data kept apart from its drawing.** `map.cells` holds terrain keys only. The window draws them as pictures, and the Saved map panel draws the same data as letters. Both change on every stroke. `map.ts` imports nothing from Phaser or the page, which is what lets three programs use it.

**Tests.** Four finished tests and two stubs in `map.test.ts`. The learner writes each test stub before the function it checks, and watches the failed count go up before it goes down. The README carries a fifteen-line `test` and `expect`, so Vitest is shown as a tool that does a job, rather than as magic.

Saving and loading go through the server shape from project 15. The server calls the learner's `linesToMap` before it writes a file, so one function guards the editor, the server and the tests.

## Positioning

Project 11 read a map written as rows of characters. Project 16 read three. This project writes them, and reads them back, and the round trip is the second test stub.

The server is given in full. Every idea in it was taught by project 15, and the three routes differ from project 15's two only in their paths. The one new lesson inside it is `unknown`, which makes the checker enforce project 15's "never trust what arrives".

## Operating Context

- Three terminals in the project folder: `npm run dev`, `npm run server`, `npm test`.
- Needs Node 22.18 or later for type stripping. Measured on Node 24.18.1.
- Best in VS Code, which shows type errors as the learner types.
- Mouse or trackpad to paint, keyboard letters to pick a terrain.

## Capabilities and Constraints

**In scope now:**
- A 20 by 15 map of 48-pixel cells, painted by click and drag.
- Six terrains: grass, road, sand, forest, water, rock.
- A palette built from the table, with each terrain's letter and a live cell count.
- A hover panel showing the cell, its terrain, whether tanks can drive on it, and its speed.
- A Saved map panel showing `mapToLines` live.
- Save and load through a server that keeps one JSON file per map.
- New map, which asks twice when there are unsaved changes.
- A status line that names the next empty function, found by trying each one on a tiny map of its own when the page loads.

**Stubs, in order:**

| # | File | Stub | Checker errors after | Tests after |
|---|---|---|---|---|
| | | Start | 7 | 4 failed, 2 todo |
| 1 | `map.ts` | `makeMap` | 6 | 3 failed, 1 passed, 2 todo |
| 2 | `map.ts` | `isInside` | 5 | 2 failed, 2 passed, 2 todo |
| 3 | `map.test.ts` | painting outside the map changes nothing | 5 | 3 failed, 2 passed, 1 todo |
| 4 | `map.ts` | `paintCell` | 4 | 2 failed, 3 passed, 1 todo |
| 5 | `map.ts` | `countTerrain` | 3 | 2 failed, 3 passed, 1 todo |
| 6 | `map.ts` | `mapToLines` | 2 | 1 failed, 4 passed, 1 todo |
| 7 | `map.ts` | `terrainFor` | 1 | 5 passed, 1 todo |
| 8 | `map.test.ts` | linesToMap undoes mapToLines | 1 | 1 failed, 5 passed |
| 9 | `map.ts` | `linesToMap` | 0 | 6 passed |

Each empty function has a declared return type, so the checker reports it as TS2355. The count doubles as a to-do list, as it did in project 17.

Test stubs are `test.todo`, which Vitest lists without passing or failing. An empty `test` body would pass silently, which would make the stub's payoff invisible.

**Explicitly deferred:** undo (project 6 taught it), flood fill (a frontier search, which is project 20), maps of other sizes, a map larger than the window, deleting and renaming maps on the server, units and buildings on the map (projects 19 and 22), and `#demo` hashes. The demos stood in for empty stubs in projects 3 to 16. With modules, a stand-in would have to live in a file the learner can open, and it would give the answers away. Named in the README as good things to try next: snow, a bridge, a test for `countTerrain`, a deliberately broken map file, and a border function written test first.

**Hard constraints:**
- `map.ts` imports only `terrain.ts`. Never Phaser, never the page, never Node.
- Tests cover pure logic only: `map.ts`. Never the DOM, Phaser or the server.
- No kind of ground is named outside `terrain.ts`, except `'water'` as the starting brush in `editor.ts`, and the literal keys in the tests and hints.
- The server never writes outside `maps/`. File names keep only lowercase letters, digits and dashes.
- The server keeps a map only when the learner's `linesToMap` accepts it.
- Sounds keep the `Audio` pattern every project since the calculator has used.
- Comments use plain language for an 11-year-old.

## Brand Commitments

A surveyor's drafting table: walnut, a paper label pinned with brass, the map under glass, and paper index cards down the side. See `DESIGN.md`.

## Evidence on Hand

- `ROADMAP.md` names project 18 as the map editor, with content as data, saving through project 15's server, map data apart from drawing, and the first tests.
- Measured with `tsc` 7.0.2 and Vitest 5.0.1, filling the answer key in a throwaway copy one job at a time: the checker and test counts in the stub table above.
- Measured in a browser through `npm run dev`, after each job: the status line names the next job, and nothing logs a console error.
- Measured in a browser with every job done: painting, counts, letters, letter keys, loading Sandy Island, saving a new map, refusing an empty name, and New map asking twice.
- Measured with `curl`: the server refuses a map with an unknown letter, answers `{"stub":"linesToMap"}` while that function is empty, and turns the name `../../etc` into the file `etc.json`.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **Say what a thing is once.** Every fact about a terrain lives on its line of the table.
3. **Show the data twice.** Pictures and letters, side by side, so the map is visibly neither.
4. **Red before green.** A test stub turns the count red before its function turns it green.
5. **Name the next job.** The status line always says which function is next.

## Accessibility & Inclusion

Every palette entry is a real `<button>` with `aria-pressed` and `aria-keyshortcuts` carrying its letter. The name box has a visible label. The status line is a live region.

The terrain counts, the hover panel and the Saved map panel state everything in words and letters, never in colour alone.

The canvas takes focus on click and shows a brass focus ring. Painting needs a pointer. There is no keyboard way to move the pencil, which is a real limit, recorded here.

Below 900px the table stands up into one column, and every control grows to at least 40px tall.
