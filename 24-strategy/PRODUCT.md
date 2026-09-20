# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript, served by Vite, with Vitest tests. It keeps project 23's toolchain unchanged.

| Package | Why it is here |
|---|---|
| `phaser` | The map window. 3.90.0, the same version as projects 9 to 23 |
| `vite` | The development server, the build step, and `import.meta.glob` for the maps |
| `typescript` | The type checker. `strict` is on |
| `vite-plugin-checker` | Prints type errors in the terminal and shows a count badge on the page |
| `vitest` | The test runner, run with `npm test` |

Two programs run from two terminals: `npm run dev` and `npm test`.

`package.json`, `package-lock.json`, `tsconfig.json` and `vite.config.ts` are project 23's, with the name and the page changed.

`game.ts` reads every `maps/*.json` file with `import.meta.glob`, as in projects 19 to 23. Both map files are new.

## Users

- **Simon (primary learner), 11 years old.** He has finished twenty-three projects. He wrote the ore run at 21, the build yard at 22 and the tank brain at 23, and all three arrive here finished. He knows a fixed order of questions, content held in a table, and tests. He writes seven functions and two tests, and reads plain-language comments.
- **The father.** Designs the project.

## Product Purpose

This is the destination of the whole roadmap: one small strategy game, with every part of it work the learner has already done.

Three ideas earn their place, and none of them has appeared before.

**A plan is a list, and a commander walks it.** `RED_PLAN` in `catalogue.ts` is ten lines, and `wantNext` is three. Move a line and the enemy plays a different game with no code change. That is project 18's content-as-data promise, kept for behaviour rather than for things.

**Saving up is a decision.** `spendStep` asks `canBuild` and buys nothing at all when the answer is not `'ok'`. A commander that always spends its credits ends with nine harvesters and no army, because the cheapest thing is always affordable. Doing nothing on purpose is what builds the war factory.

**A game can be over.** `whoWon` is the last stub in the repository. It counts refineries, and a refinery is a unit in the same list as the tanks, so project 23's targeting and shooting wreck one with no change at all.

## Positioning

Projects 21, 22 and 23 each dropped what came before to keep the given wiring small. This project puts all three back and keeps them, because being the whole game is the point of it.

The cost is eleven finished files around one stub file. That is accepted here and would not be accepted anywhere else in the list.

## Operating Context

- Two terminals in the project folder: `npm run dev` and `npm test`.
- Measured on Node 24.18.1, with `tsc` 7.0.2, Vitest 5.0.1 and Chrome through Playwright.
- Best in VS Code, which shows type errors as the learner types.
- A mouse or trackpad. Picking a unit works from the keyboard. Choosing a cell on the map does not.

## Capabilities and Constraints

**In scope now:**

- A 20 by 15 map of 48-pixel cells, drawn from the terrain table. Two new maps, `twin-yards.json` and `two-bridges.json`, each one unchanged by half a turn, so the two corners are provably equal.
- Two sides with the same shape: a refinery on the map, credits, a build yard, a plot list, and three harvesters. Blue is worked by the Build card. Red is worked by `commander.ts`.
- One ore field, dug by both sides. Project 21's run, finished, for six harvesters at the start and more as they are built.
- Project 22's catalogue and queue, finished, for both yards, including the infantry line the barracks opens. Nothing outside `catalogue.ts` names a power plant.
- Two things with guns, not one. Infantry cost 200 credits and four seconds, go at 130 pixels a second, take 40 damage and fire 4 every half second. A tank costs 700 and twelve, goes at 90, takes 100 and fires 9 every seven tenths. `armed` in `enemy.ts` is the one place that says which kinds shoot, and `armyStrength` and `attackOrders` ask it rather than naming a kind.
- Project 23's tank brain, finished, for both sides. `runUnit` is project 23's nine lines.
- A refinery as a unit of kind `'base'`: 900 health, never drives, never fires, and a target like anything else.
- Marching orders: red re-issues them every 2.5 seconds, and a marching tank still stops to fight whatever comes into range.
- A banner over the map for a win, a loss, and the draw where both refineries fall together.
- Six rack cards: Forces, Build, Queue, Enemy, Squad, Maps. The Forces card counts harvesters, infantry, tanks and the refinery, all four from `countKind`.
- A status line that names the next empty function, found by trying each one on a yard and a pair of tanks when the page loads.

**Stubs, in order:**

| # | File | Stub | Checker errors after | Tests after |
|---|---|---|---|---|
| | | Start | 7 | 4 failed, 2 todo |
| 1 | `commander.ts` | `countKind` | 6 | 3 failed, 1 passed, 2 todo |
| 2 | `commander.ts` | `armyStrength` | 5 | 2 failed, 2 passed, 2 todo |
| 3 | `commander.ts` | `wantNext` | 4 | 1 failed, 3 passed, 2 todo |
| 4 | `commander.test.ts` | it saves up instead of buying something cheaper | 4 | 2 failed, 3 passed, 1 todo |
| 5 | `commander.ts` | `spendStep` | 3 | 1 failed, 4 passed, 1 todo |
| 6 | `commander.ts` | `wantsAttack` | 2 | 5 passed, 1 todo |
| 7 | `commander.ts` | `attackOrders` | 1 | 5 passed, 1 todo |
| 8 | `commander.test.ts` | a game is over when a refinery is gone | 1 | 1 failed, 5 passed |
| 9 | `commander.ts` | `whoWon` | 0 | 6 passed |

Job 7 is the only job that changes no test count, the same as project 22's job 7 and project 23's.

`countKind`, `armyStrength`, `wantNext` and `wantsAttack` have finished tests, so they go green as they are written. `spendStep` and `whoWon` are the two the learner tests, because both fail quietly and neither is quick to check by clicking.

**Every job is visible on the page.** Job 1 fills both columns of the Forces card. Job 2 lights the two strength bars. Job 3 names what the enemy is saving for. Job 5 starts the enemy's economy, which is the largest single change in the project. Job 6 gives its orders a word. Job 7 sends the first wave. Job 9 lets the game end.

**The order of the questions in `spendStep`.** Asking "what can I afford?" instead of "what does the plan want?" produces a commander with nine harvesters and no army. Nothing crashes, and the Enemy card goes on naming the right thing to save for, because `wantNext` is correct. Only a credit counter that never climbs gives it away. Job 4's test is what catches it. It is the same shape of trap as project 21's `nextJob`, project 22's `canBuild` and project 23's `nextMode`, and it is the fourth in a row on purpose.

**Explicitly deferred:** a second way to win, cancelling an order, placing a building by hand, a unit that is strong against one kind and weak against another, ore that grows back, a leash on a chasing tank, an enemy that defends its own ore field, more than one enemy plan, fog of war, and saving a game. All are named in the README as things to try next.

**Hard constraints:**

- `howMany`, which is given, counts a side's units on the map **and** the matching jobs in its queue. Without that a four-second rifleman and a once-a-second decision turn a plan line of two into five, and the plan stops meaning what it says.
- `commander.ts` imports `numbers.ts`, `catalogue.ts`, `build.ts`, `ore.ts` for one type, `units.ts` for types and `foeOf`, and `enemy.ts` for `wrecked` and `armed`. Never Phaser, never the page.
- Tests cover pure logic only: `commander.ts`. Never the DOM or Phaser.
- `ore.ts`, `build.ts` and `enemy.ts` are projects 21, 22 and 23 copied from their answer keys. `ore.ts` takes a cell in `makeRefinery` because there are two refineries now; `enemy.ts` gains `armed`, which says whether a unit has a gun, and its `shootStep` asks the kind for its damage and its reload. Those are the only changes across the three files.
- `terrain.ts` changes exactly one number from project 21: ore `holds` goes from 240 to 480, because two armies dig one field. It is recorded in that file's header.
- Sounds keep the `Audio` pattern every project since the calculator has used. Nine files, all of them from projects 22 and 23.
- Both sides drive project 17's hull and turret for tanks and project 21's truck for harvesters, told apart by a coloured disc, because tinting a blue hull red produces mud. Infantry are project 22's two new pictures, `soldier-blue.png` and `rifle-blue.png`. The buildings are project 22's three pictures, and a ring in each side's colour tells whose they are. A unit rolls out at the building it needed, so each side's tanks appear at its own war factory and its riflemen at its own barracks.
- Comments use plain language for an 11-year-old.

## Brand Commitments

Project 22's build yard desk, with a Forces card added at the top of the rack and the Enemy card where the Refinery card was. Blue is yours everywhere, red is theirs, and no state on either side is told apart by colour alone. See `DESIGN.md`.

## Evidence on Hand

- `ROADMAP.md` names project 24 as one small map, two teams, two unit types, one resource, one building, one production queue and one win condition. All seven are present, and the build chain runs to three buildings rather than one.
- Project 23's `README.md` promised this project by name: "one map, two teams, two kinds of unit, ore, a build queue, and something to win."
- Projects 21, 22 and 23 each set the shape `spendStep` copies: a fixed order of questions where the wrong order fails quietly.
- Project 8 proved that one set of functions moves every kind of sprite when they share a shape. A refinery in the units list is that lesson applied to a thing that cannot move.
- Measured with `tsc` 7.0.2 and Vitest 5.0.1, filling the answer key into throwaway copies one job at a time: every count in the stub table above, start to finish.
- Measured in Chrome with every stub filled, on Twin Yards, with nobody touching the keyboard: the enemy bought a fourth harvester, a power plant, a barracks, two riflemen, a war factory and two tanks, marched with all but one guard, and wrecked the undefended refinery. The banner read `You lost` at 2 minutes 17 seconds, over two runs that differed by four seconds.
- Measured in Chrome with every stub filled, on Twin Yards, played through Playwright on the enemy's own plan, sending whatever it had as soon as it had four: blue lost at 2 minutes 30 seconds, aiming at the refinery and at the enemy ore field alike. The script attacks in fours, which is the mistake the README names; no scripted line has beaten the commander since infantry arrived, and the dials that move that are `ATTACK_FORCE`, `ATTACK_EDGE` and where the two infantry lines sit in `RED_PLAN`.
- Measured in Chrome, played through Playwright as a rifleman rush — a barracks, no war factory, seven infantry: the two riflemen `RED_PLAN` keeps at home held the rush until the first enemy tank rolled out, and blue lost at 5 minutes 15 seconds. With those two lines moved below the war factory the enemy has nothing at home when the rush lands. That is the plan deciding a game, and it is the claim project 22 made about a table being the strategy.
- Measured in Chrome with every stub still empty: the page loads, your harvesters dig, your Build card spends, every enemy well reads a dash, and the console holds nothing but the two favicon 404s that projects 20 to 23 also produce.
- Measured in Chrome with the stubs empty, so neither side spends: both refineries held equal credits at twenty, thirty, forty and sixty seconds, over two runs, at 1199, 1499, 1799 and 2400. That is the fairness of the two corners, measured rather than asserted. A reading taken between those points can differ by one load, because the two sides do not tip their loads in the same instant.
- Measured in Chrome at 430 pixels wide: no horizontal scroll, and all six cards fit.
- Measured in Chrome at 1600 by 1000: the rack ends 56 pixels inside the desk, and all three starting squad rows are visible without scrolling.
- The terrain tiles, the unit pictures and all nine sounds are projects 22 and 23's, unchanged.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **The page shows, and never decides.** Every word on the Enemy card is one word from a function the learner wrote.
3. **Both sides play the same game.** One catalogue, one ore field, one set of unit functions, two equal corners.
4. **Behaviour is data.** The enemy's whole strategy is ten lines of table.
5. **Every job is visible.** A stub whose payoff cannot be seen on the page is a defect.
6. **Name the next job.** The status line always says which function is next.

## Accessibility & Inclusion

Every squad row is a real `<button>`, labelled with its unit's name and kind. The Build card's buttons carry their verdict in their label, so "Barracks. Needs power plant" is read out rather than implied by grey. The map buttons use `aria-pressed`.

The Forces card is a real table with row and column headers, so a screen reader can say "Tanks, theirs, 3". Its two strength bars repeat numbers that are already in the table, so they are `aria-hidden`.

What a unit is doing is always a word, never a colour alone. The plate, both rosters, the queue and the banner are live regions.

Picking a unit works from the keyboard. Sending one needs a pointer, because there is no keyboard way to choose a cell on the map. That is a real limit, carried over from projects 19 to 23, and recorded here.

Below 900px the desk stands up into one column, the squad rows grow to 44px tall and the map buttons to 48px, and the squad list is capped and scrolls.
