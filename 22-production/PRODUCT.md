# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript, served by Vite, with Vitest tests. It keeps project 21's toolchain unchanged.

| Package | Why it is here |
|---|---|
| `phaser` | The map window. 3.90.0, the same version as projects 9 to 21 |
| `vite` | The development server, the build step, and `import.meta.glob` for the maps |
| `typescript` | The type checker. `strict` is on |
| `vite-plugin-checker` | Prints type errors in the terminal and shows a count badge on the page |
| `vitest` | The test runner, run with `npm test` |

Two programs run from two terminals: `npm run dev` and `npm test`.

`package.json`, `package-lock.json`, `tsconfig.json` and `vite.config.ts` are project 21's, with the name and the page changed.

`game.ts` reads every `maps/*.json` file with `import.meta.glob`, as in projects 19 to 21. Both map files are project 21's, unchanged.

## Users

- **Simon (primary learner), 11 years old.** He has finished twenty-one projects. He wrote tests at 18, 19, 20 and 21. He knows queues from project 2, content-as-data tables from project 18, unions from projects 17 and 19, and a rate times the seconds from projects 7 and 21. He writes seven functions and two tests, and reads plain-language comments.
- **The father.** Designs the project.

## Product Purpose

Project 21 made credits. They bought nothing. This project spends them, and two ideas earn their place.

**A queue is a list you join at the back and leave from the front.** `push` puts a thing on, `shift` takes it off, and nobody is ever built at the same time as anybody else. That is project 2's lift queue, with a progress bar on the front item and money at stake.

**An interface driven by state shows what a function said, and decides nothing itself.** `canBuild` hands back one word about one thing, and the Build card is drawn from five of those words. Every grey button, every reason line and every padlock is that one function's answer. Nothing on the page knows what a power plant costs.

A third idea runs underneath both: prerequisites are a column in a table. `catalogue.ts` has a `needs` column, and the whole build chain — power plant, barracks, war factory, tank — is five lines of data. A sixth thing to build is a sixth line.

## Positioning

Project 21 gave six harvesters an ore run that goes round for ever. This project keeps all of it, given, and starts with three harvesters instead of six, so the first thing worth buying is a fourth.

The tanks it turns out drive, and nothing more. An enemy to point them at is project 23.

## Operating Context

- Two terminals in the project folder: `npm run dev` and `npm test`.
- Measured on Node 24.18.1.
- Best in VS Code, which shows type errors as the learner types.
- A mouse or trackpad. The Build card's buttons are reachable by keyboard; choosing a cell on the map is not.

## Capabilities and Constraints

**In scope now:**

- A 20 by 15 map of 48-pixel cells, drawn from the terrain table. Project 21's two maps, `ore-valley.json` and `river-mine.json`, unchanged.
- Project 21's whole ore run, given in full and running from the moment the page opens: harvesters, patches, loads, the refinery and the credits. `ore.ts` is project 21's answer key, with `Harvester` renamed `Unit`.
- A refinery at cell 4, 10 that starts with `START_CREDITS`, 500, so the first build needs no waiting.
- Three harvesters at the start, not six.
- A build catalogue of five things in one table, `catalogue.ts`, each with a cost, a build time, a prerequisite, a kind, three letters and a colour. Nothing outside that table names a power plant.
- Two kinds of thing. A `building` is built once, unlocks the next line, and lands on a plot near the refinery. A `unit` is built over and over, and rolls out onto the map.
- A queue of at most `QUEUE_MAX`, 5. Only the front one is ever worked on.
- A Build card of five buttons, each showing its price, its build time, and one word from `canBuild`. A button whose word is not 'ok' is a disabled `<button>`, so the browser itself refuses the click.
- A Queue card: what is being built, a countdown to an empty queue, and one docket per job with a bar on the front one.
- A Refinery card: ore a minute, ore left in the ground, and how many harvesters are out.
- A squad card that grows as units roll out, and scrolls once it is taller than its space.
- A status line that names the next empty function, found by trying each one on a yard of its own when the page loads.

**Stubs, in order:**

| # | File | Stub | Checker errors after | Tests after |
|---|---|---|---|---|
| | | Start | 7 | 4 failed, 2 todo |
| 1 | `build.ts` | `isBuilt` | 6 | 3 failed, 1 passed, 2 todo |
| 2 | `build.ts` | `needsMet` | 5 | 2 failed, 2 passed, 2 todo |
| 3 | `build.ts` | `canBuild` | 4 | 1 failed, 3 passed, 2 todo |
| 4 | `build.test.ts` | buying charges exactly the price | 4 | 2 failed, 3 passed, 1 todo |
| 5 | `build.ts` | `startBuild` | 3 | 1 failed, 4 passed, 1 todo |
| 6 | `build.ts` | `buildStep` | 2 | 5 passed, 1 todo |
| 7 | `build.ts` | `waitTime` | 1 | 5 passed, 1 todo |
| 8 | `build.test.ts` | the queue builds one at a time, in order | 1 | 1 failed, 5 passed |
| 9 | `build.ts` | `takeFinished` | 0 | 6 passed |

Job 7 is the only job that changes no count but its own error. It changes the page instead: the Ready in well starts counting down.

`isBuilt`, `needsMet`, `canBuild` and `buildStep` have finished tests, so they go green as they are written. `waitTime` has none of its own — job 8's test leans on it in four places.

**The order of the questions in `canBuild`.** Five checks, and the order decides which reason a button gives. `too dear` before `locked` tells a learner that a barracks they cannot build yet is a money problem. `too dear` before `built` says a finished power plant is unaffordable. Both are visible on the page in one click, and both are in the README.

**Explicitly deferred:** cancelling a build and getting the credits back, placing a building by clicking a cell (project 24), buildings that block a harvester's path, power as a resource, more than one thing built at a time, repairing, selling, and anything for a tank to shoot at, which is project 23. Named in the README as good things to try next: a sixth line in the catalogue, cancelling an order, a second queue, a price that rises with each one built, and a tank that follows a harvester about.

**Hard constraints:**

- `build.ts` imports `numbers.ts`, `catalogue.ts`, and `ore.ts` for the `Refinery` type. Never Phaser, never the page.
- `catalogue.ts` imports nothing at all.
- Tests cover pure logic only: `build.ts`. Never the DOM or Phaser.
- No thing you can build is named outside `catalogue.ts`, except in the test files and their hints and answers, and in `game.ts` where a tank is told apart from a harvester at the moment it rolls out.
- Sounds keep the `Audio` pattern every project since the calculator has used. No new sound files: a purchase reuses the order pip, a finished build reuses project 20's found pips, and a refused click reuses the blocked buzz.
- No new art. A building is drawn as a coloured pad with the three letters from its table line. A tank is project 17's hull and turret; a harvester is the same two pictures with the turret tinted amber.
- Comments use plain language for an 11-year-old.

## Brand Commitments

Project 21's refinery weighbridge office, with the weigh tickets down the side swapped for an order pad: a price list you click, and a docket queue under it. See `DESIGN.md`.

## Evidence on Hand

- `ROADMAP.md` names project 22 as build times, queues, prerequisites, enabled and disabled buttons, and an interface driven by state.
- Project 21's `PRODUCT.md`, `ore.ts` and `README.md` set the shape this project copies: seven function stubs, two test stubs, an answer key per file, and a status line that names the next job.
- Project 18's `terrain.ts` proved that content belongs in a table. `catalogue.ts` is the same idea for a different kind of content, and `needs` is the column the whole build chain lives in.
- Project 2 taught a queue. This is the first project since that has one with a cost attached.
- Measured with `tsc` 7.0.2 and Vitest 5.0.1, filling the answer key into a throwaway copy one job at a time: every count in the stub table above, start to finish.
- Measured in Chrome through `npm run dev`, with every stub filled, on Ore Valley: the yard starts with 500 credits and 3 harvesters; buying a harvester leaves 100 and the Ready in well reads 0:08; it rolls out on time and the squad grows to 4. A power plant in the queue reads "On order", and reads "Built" the moment it lands, at which point the barracks stops saying "Needs power plant".
- Measured in Chrome over a two-minute run, buying whatever was affordable: ore a minute climbed from 998 at four units to 1227 at six, and the field fell from 3600 to 1385.
- Measured in Chrome: the ore run starts itself with every stub still empty, and the only console messages are the two favicon 404s that projects 20 and 21 also produce.
- The maps, the terrain tiles, the unit pictures and the six sounds are all project 21's, unchanged.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **The page shows, and never decides.** Every grey button on the Build card is one word from `canBuild`.
3. **Content lives in a table.** A sixth thing to build is a sixth line and no other change.
4. **A queue is joined at the back and left from the front.** One `push`, one `shift`, and nothing built in parallel.
5. **Money only moves in one function.** `startBuild` is the only place credits leave the refinery.
6. **Name the next job.** The status line always says which function is next.

## Accessibility & Inclusion

Every catalogue entry is a real `<button>`, labelled with its name and the reason it is grey, and genuinely `disabled` rather than only styled grey. Every squad row is a `<button>` labelled with its unit's name and kind. The map buttons use `aria-pressed`.

The reason a button is grey is always a word, never a colour alone. The queue and the status line are live regions.

Buying and choosing units work from the keyboard. Sending a unit needs a pointer, because there is no keyboard way to choose a cell on the map. That is a real limit, carried over from projects 19 to 21, and recorded here.

Below 900px the desk stands up into one column, the catalogue buttons grow to 44px tall and the map buttons to 48px, and the squad list is capped and scrolls.
