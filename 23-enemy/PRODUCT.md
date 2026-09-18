# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript, served by Vite, with Vitest tests. It keeps project 22's toolchain unchanged.

| Package | Why it is here |
|---|---|
| `phaser` | The map window. 3.90.0, the same version as projects 9 to 22 |
| `vite` | The development server, the build step, and `import.meta.glob` for the maps |
| `typescript` | The type checker. `strict` is on |
| `vite-plugin-checker` | Prints type errors in the terminal and shows a count badge on the page |
| `vitest` | The test runner, run with `npm test` |

Two programs run from two terminals: `npm run dev` and `npm test`.

`package.json`, `package-lock.json`, `tsconfig.json` and `vite.config.ts` are project 22's, with the name and the page changed.

`game.ts` reads every `maps/*.json` file with `import.meta.glob`, as in projects 19 to 22. Both map files are new.

## Users

- **Simon (primary learner), 11 years old.** He has finished twenty-two projects. He wrote tests at 18, 19, 20, 21 and 22. He knows a fixed order of questions from projects 21 and 22, Pythagoras from projects 7 and 19, `Math.atan2` from project 16, and `%` from project 4. He writes seven functions and two tests, and reads plain-language comments.
- **The father.** Designs the project.

## Product Purpose

Project 22 turned out a tank with nothing to shoot at. This project gives it something, and two ideas earn their place.

**A brain is a list of questions, asked in a fixed order.** `nextMode` is five lines. It hands back one of four words about one tank, and the page does the one thing that word means. Behaviour that looks planned comes out of questions asked sixty times a second.

**A gun does not reach as far as an eye does.** `SEE_RANGE` is 250 and `GUN_RANGE` is 130. That gap is the only reason a red tank ever drives anywhere. It is also the trap, because every tank inside gun range is inside sight range too.

A third idea runs underneath both. One set of functions moves both sides, because a red tank and a blue tank are the same shape of object. `runTank` is nine lines and the sides differ in one of them.

## Positioning

Project 22 kept the ore run and the build yard. This project drops both, on purpose.

The ore run and the build queue are finished work, and keeping them would have put eleven files of given wiring round seven stubs. Project 24 is where everything comes back together. This project is the brain and nothing else.

## Operating Context

- Two terminals in the project folder: `npm run dev` and `npm test`.
- Measured on Node 24.18.1.
- Best in VS Code, which shows type errors as the learner types.
- A mouse or trackpad. Picking a tank works from the keyboard. Choosing a cell on the map does not.

## Capabilities and Constraints

**In scope now:**

- A 20 by 15 map of 48-pixel cells, drawn from the terrain table. Two new maps, `crossroads.json` and `rock-pass.json`.
- Four blue tanks in the corner at cell 4, 10, and three red tanks on posts of their own.
- Project 19's picking, drag box and group orders, and project 20's `findRoute`, all given. A wreck can no longer be picked, boxed or ordered.
- Red posts taken from three fractions in `numbers.ts`, each slid onto walkable ground. A beat is the four corners of a square `BEAT` cells out, slid the same way. No map file names a red tank, so any map from project 18's editor works.
- One brain, run for both sides. `runTank` calls `nearestTarget`, `nextMode`, `aimAt` and `shootStep` on every tank on every frame. Only a red tank acts on the mode to drive.
- A chasing red tank asks `findRoute` again every 0.5 seconds, because its target keeps moving.
- Health, a reload, gun flashes, wrecks that stay on the map as black hulks, and two new sounds.
- An Enemy card of three rows and a Squad card of four, built by the same function from the same fields.
- A Battle card of three wells: the distance to the nearest red tank, shots fired, and wrecks.
- A status line that names the next empty function, found by trying each one on a pair of tanks when the page loads.

**Stubs, in order:**

| # | File | Stub | Checker errors after | Tests after |
|---|---|---|---|---|
| | | Start | 7 | 4 failed, 2 todo |
| 1 | `enemy.ts` | `farApart` | 6 | 3 failed, 1 passed, 2 todo |
| 2 | `enemy.ts` | `inRange` | 5 | 2 failed, 2 passed, 2 todo |
| 3 | `enemy.ts` | `nearestTarget` | 4 | 1 failed, 3 passed, 2 todo |
| 4 | `enemy.ts` | `aimAt` | 3 | 4 passed, 2 todo |
| 5 | `enemy.test.ts` | a shot takes exactly SHOT_DAMAGE | 3 | 1 failed, 4 passed, 1 todo |
| 6 | `enemy.ts` | `shootStep` | 2 | 5 passed, 1 todo |
| 7 | `enemy.ts` | `nextPost` | 1 | 5 passed, 1 todo |
| 8 | `enemy.test.ts` | nextMode asks in the right order | 1 | 1 failed, 5 passed |
| 9 | `enemy.ts` | `nextMode` | 0 | 6 passed |

Job 7 is the only job that changes no test count. It changes the map more than any other job, because the red tanks stand still until it exists.

`farApart`, `inRange`, `nearestTarget` and `aimAt` have finished tests, so they go green as they are written. `shootStep` and `nextMode` are the two the learner tests, because both are hard to check by clicking and both fail quietly.

**Every job is visible on the map.** Job 1 draws a measuring line with a distance on it. Job 2 lights two rings. Job 3 draws a thread to each target. Job 4 makes every turret track. Job 6 starts the shooting. Job 7 starts the patrols. Job 9 starts the hunting.

**The order of the questions in `nextMode`.** `GUN_RANGE` is smaller than `SEE_RANGE`, so every tank in gun range is in sight range too. Asking about sight first produces a red tank that chases for ever and never fires. Nothing crashes and nothing on screen says why. Job 8's test is what catches it.

**Explicitly deferred:** a leash that sends a chasing tank home, target choice by anything but distance, red tanks that tell each other where you are, per-tank ranges, buildings, ore, a build queue, and a win condition. All of those belong to project 24. Named in the README as good things to try next: a leash, shooting at the weakest, a sniper, calling for help, and a map of the learner's own.

**Hard constraints:**

- `enemy.ts` imports `numbers.ts`, `map.ts` for the `Cell` type, and `units.ts` for two types. Never Phaser, never the page.
- Tests cover pure logic only: `enemy.ts`. Never the DOM or Phaser.
- `terrain.ts` is project 21's file, unchanged. Its `ore` line and `holds` column have no reader here, and editing a table that works would cost more than leaving it.
- Sounds keep the `Audio` pattern every project since the calculator has used. Two new files, `shot.wav` and `boom.wav`, generated the same way as the six that came before them.
- No new art. Both sides use project 17's hull and turret. A coloured disc under each tank says whose it is, because tinting a blue hull red produces mud.
- Comments use plain language for an 11-year-old.

## Brand Commitments

Project 22's build yard desk with the order pad taken off it. Two rosters in its place: the red tanks at the top, because they are the subject, and the blue squad below. See `DESIGN.md`.

## Evidence on Hand

- `ROADMAP.md` names project 23 as distance checks, target selection, patrol states and attack states, using the pathfinding from project 20.
- Project 22's `README.md` promised this project by name: "Tanks that choose a target, patrol a route, and attack when something comes close."
- Project 21's `nextJob` and project 22's `canBuild` set the shape `nextMode` copies: a fixed order of questions where a wrong order fails quietly.
- Project 8 proved that one set of functions moves every kind of sprite when they share a shape. `runTank` is that lesson applied to two sides.
- Measured with `tsc` 7.0.2 and Vitest 5.0.1, filling the answer key into throwaway copies one job at a time: every count in the stub table above, start to finish.
- Measured in Chrome through `npm run dev`, on Crossroads, with every stub filled. Four tanks sent at the middle post: red lost all three in 25 seconds, blue lost one, 64 shots fired. One tank sent alone: it wrecked one red tank and was wrecked itself, then the surviving two lost sight and went back to their beats.
- Measured in Chrome with every stub still empty: the page loads, the tanks drive where they are sent, every well and tag reads a dash, and the only console messages are the two favicon 404s that projects 20 to 22 also produce.
- Measured in Chrome at 430 pixels wide: no horizontal scroll, and every roster column fits.
- Measured on Rock Pass with every stub filled: a patrolling red tank crossed the rock wall through a gap, found the squad without being sent, and opened fire 16 seconds in. Project 20's `findRoute` found the gap without being asked.
- The terrain tiles, the tank pictures and six of the eight sounds are project 22's, unchanged.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **The page shows, and never decides.** Every word on both rosters is one word from `nextMode`.
3. **Behaviour is a list of questions.** Five of them, in one order, in one function.
4. **One brain, both sides.** The sides differ in one line of `runTank`, and nowhere else.
5. **Every job is visible.** A stub whose payoff cannot be seen on the map is a defect.
6. **Name the next job.** The status line always says which function is next.

## Accessibility & Inclusion

Every squad row is a real `<button>`, labelled with its tank's name. The Enemy card's rows are not buttons, because the learner cannot command those tanks. The map buttons use `aria-pressed`.

What a tank is doing is always a word, never a colour alone. Both rosters and the status line are live regions, and so are the blue and red counts on the plate.

Picking a tank works from the keyboard. Sending one needs a pointer, because there is no keyboard way to choose a cell on the map. That is a real limit, carried over from projects 19 to 22, and recorded here.

Below 900px the desk stands up into one column, the roster rows grow to 44px tall and the map buttons to 48px, and both rosters are capped and scroll.
