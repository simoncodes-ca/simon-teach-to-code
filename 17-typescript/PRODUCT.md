# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript, served by Vite. `tanks.html` and `styles.css`, six `.ts` modules, and three settings files: `package.json`, `tsconfig.json` and `vite.config.ts`. Phaser 3.90.0 comes from npm, the same version project 16 vendored.

Four packages, pinned to exact versions:

| Package | Why it is here |
|---|---|
| `phaser` | The game library, now imported instead of vendored |
| `vite` | The development server and the build step that strips the types |
| `typescript` | The type checker. `strict` is on |
| `vite-plugin-checker` | Runs the type checker beside Vite. Prints errors in the terminal and shows a count badge on the page |

`npm install` once, then `npm run dev`. `npm run check` runs `tsc` once, with no server. The page no longer opens by double-clicking, and it does not deploy to GitHub Pages. This is the cutover `ROADMAP.md` records.

`tanks.html` loads one module, `game.ts`. Its `import` lines load the other five. The six script tags of project 16 are gone.

Vite does not check types. It only strips them. The checker plugin is what makes an error visible, so it is part of the product, not a convenience.

## Users

- **Simon (primary learner), 11 years old.** He has finished sixteen projects, and wrote every function in this game one project ago. He writes six types and reads plain-language comments. He has used a terminal once, for project 15's server.
- **The father.** Designs the project, teaches alongside it, and helps with the first `npm install`.

## Product Purpose

Remake a finished game with types, so the types are the only new thing. Project 9 did this for a library, and project 14 did it for several files.

Two ideas earn their place. The first is the reason the project exists.

**A type is the comment that described a thing, turned into code the computer checks.** Project 16 wrote the shape of a tank and a shell in comments, on purpose, so this project could turn them into `type Tank` and `type Shell`. The learner copies the comment's list into a type and watches the error count fall.

**Types catch shape, not meaning.** The README puts project 16's good bugs beside the errors types do catch. A wrong `aimOf` is still a number. A learner who takes away only "types find bugs" has learned the wrong half.

The third lesson is `import` and `export`. They fix the two costs project 14 named: shared names that clash, and names with no visible source. It is taught by reading the given files, and it has no stub.

## Positioning

The stubs are types, not function bodies. Every function body is given, copied from project 16's answer keys.

Six stubs, three per file:

| # | File | Stub | Errors left afterwards |
|---|---|---|---|
| | | Start | 119 |
| 1 | `tank.ts` | `type Point` | 115 |
| 2 | `tank.ts` | `type Tank` | 27 |
| 3 | `tank.ts` | Signatures of `stepAlong`, `turnTank`, `driveTank`, `aimOf` | 18 |
| 4 | `shells.ts` | `type Shell` | 9 |
| 5 | `shells.ts` | `type Hit` | 7 |
| 6 | `shells.ts` | Signatures of `fireShell`, `moveShell`, `shellHitsTank`, `damageTank` | 0 |

A type stub starts as an empty object type, `{}`. A signature stub starts with no annotations, so `strict` reports each input as an implicit `any`. Measured with `tsc`, every stub filled in order makes the count fall.

**The visible payoff is the error count, not the game.** Types are stripped before the browser runs the code, so the game plays identically with 119 errors or none. The checker's badge in the page corner and the `Found N error(s)` line in the terminal are the screen change each stub makes. This is the one project where a completed stub changes nothing in the game itself, and the README explains why in its own section.

`type Name = 'blue' | 'red'` is given, finished, as the worked example. So is every type in `arena.ts`, `rack.ts` and `game.ts`.

## Operating Context

- Run from a terminal with `npm run dev`. Vite opens `tanks.html` in the browser.
- Needs Node, which project 15 already required, and a network connection for the first `npm install`.
- Best in VS Code, which shows type errors as the learner types. The terminal and the page badge show the same list for any other editor.
- Read beside `16-tanks/` for the game, and `14-split/` for the several-files vocabulary.
- Two players on one laptop keyboard, exactly as project 16.

## Capabilities and Constraints

**In scope now:**
- Project 16's duel, unchanged in rules, numbers, art, sounds and page.
- Six `.ts` modules with the same six jobs as project 16's six scripts.
- Six type stubs, each with two hints and an answer key at the bottom of its file.
- A type-error count on the page and in the terminal.

**Changed from project 16, because modules require it:**
- `blocked(tank, others)` takes the tank list as an input. `arena.ts` would otherwise import values from `tank.ts`, which imports from `arena.ts`.
- `blue` and `red` are built when `tank.ts` loads, and `placeTank` moves them at the start of each round. They are never `null`.
- `shells` is a `const` list. An imported binding is read-only, so `game.ts` empties it through `forgetAllShells()`.
- The game's state lives in one `duel` object that `game.ts` owns and `rack.ts` receives.
- `rack.ts` owns every page element lookup, checked for `null` once.
- Phaser's `loader.imageLoadType` setting is gone. It only existed for `file://` pages.

**Removed:**
- The runtime tests that named the first empty function, and the `#demo` and `#demo-over` hashes. Both existed to stand in for empty function bodies, and this project has none.

**Explicitly deferred:** tests (project 18), generic types, classes, `interface`, enums, and a production build. Named in the README as good things to try next: a deliberate misspelling, a third tank colour, a `-1 | 0 | 1` turn, hovering to read an inferred type, and a type for `CONTROLS`.

**Hard constraints:**
- The game does not change. Every difference the learner can see is one the types, modules or tools made.
- Types only as far as `type`, unions of string or number literals, arrays, `Record`, `null` unions, `void` and `as`. Each one is explained where it first appears.
- `as` appears once, on Phaser's `addKeys`, and its comment says it turns checking off.
- No `!` non-null assertions and no optional chaining. A `null` check is written out as an `if`.
- `vite.config.ts` is excluded from `tsconfig.json`, so the learner's error list only contains errors from the six game files.
- The sounds keep the `Audio` pattern every project since the calculator has used.
- Comments use plain language for someone who has never programmed.

## Brand Commitments

Identical to project 16. See `16-tanks/PRODUCT.md` and `DESIGN.md`.

## Evidence on Hand

- `ROADMAP.md` names project 17 as Tank Duel rewritten with types, npm, a build step and `import`.
- Measured with `tsc` 7.0.2: 119 errors with every stub empty, then 115, 27, 25, 22, 19, 18, 9, 7, 6, 4, 2 and 0 as each type and each signature was filled in, in file order.
- Measured with the checker: every error message the README quotes, including the four in "What a type catches", was produced by making that exact mistake.
- Measured in a browser through `npm run dev`, with every stub still empty: no console errors, the badge reads 119, a tank turns and drives, and four hits wreck Red and start round 2.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **One new idea.** The game is held still so the types are all that moves.
3. **The count is the progress bar.** Every stub makes the error count fall, and the README prints the number to expect.
4. **Honest about the cost.** Installing, longer code, `null` checks, and `as` are in the README with equal billing.
5. **Types check shape, not sense.** Project 16's bugs are still bugs, and the README says so.

## Accessibility & Inclusion

The page is project 16's, and so are its accessibility commitments. See `16-tanks/PRODUCT.md`.

The error badge belongs to `vite-plugin-checker` and is not part of the page's own design. The same errors are always printed as text in the terminal.
