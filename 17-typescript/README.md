# Tank Duel, with types

This is Tank Duel again.

Same tanks. Same blocks. Same bouncing shells, same health bars, same three arenas. Play it and you cannot tell it apart from project 16.

The difference is in the code. The files end in `.ts` now, not `.js`. That stands for **TypeScript**, which is JavaScript with one thing added: types.

**Every function in this project already works.** You wrote them all in project 16. What is missing this time is the types, and those are your job.

## The one big idea

**A type is a written-down shape. The computer checks every line against it before the game starts.**

In project 16, the shape of a tank lived in a comment above `let blue`:

```js
/* Every tank is one of these:
     x, y        the middle of the tank, in pixels
     health      from MAX_HEALTH down to 0
     wrecked     true once its health has run out
     ...
*/
```

You could read that comment. The computer could not. So nothing stopped you from typing `tank.helth` by mistake. The game ran, and `tank.helth` was simply `undefined`. The bug showed up much later, somewhere else, as a tank that never lost health.

In this project the comment becomes code:

```ts
type Tank = {
  x: number;
  y: number;
  health: number;
  wrecked: boolean;
  // ...
};
```

Now the computer knows what a tank holds. Type `tank.helth` and it answers straight away:

```text
Property 'helth' does not exist on type 'Tank'. Did you mean 'health'?
```

That message arrives before you press Start. It names the file and the line. The bug never gets as far as the game.

## Getting it running

This is the first project that does not open by double-clicking. You need a terminal in this folder, the same as the server in project 15.

The first time only, install what the project needs:

```bash
npm install
```

That downloads three tools and Phaser into a folder called `node_modules`. It takes a minute. You never open that folder, and git ignores it.

Then, every time you work on the project:

```bash
npm run dev
```

The browser opens the game by itself. Leave the terminal running while you work. Save a file, and the page reloads on its own. Press Ctrl and C together in the terminal to stop.

## Where the errors show up

You will see every type error in three places. They are the same list.

| Where | What it looks like |
|---|---|
| The terminal running `npm run dev` | Each error in red, with the line of code under it, then `Found 119 error(s)` |
| The game page | A red badge in the bottom right corner with the number of errors. Click it to read the list |
| Your editor | A red wavy line under the code, if your editor understands TypeScript. VS Code does |

`npm run check` prints the same list once, without starting the game.

**The first time you run it, there are 119 errors.** That is not a broken project. It is your job, counted. Every type you finish makes the number smaller. When all six are done, the terminal says `No errors`.

The game still plays while there are errors. Read "Types vanish before the game runs" below to see why.

## Your six jobs

Six things are marked `// TODO`, three in `tank.ts` and three in `shells.ts`. Do them in this order:

| # | File | Your job | Errors afterwards |
|---|---|---|---|
| 1 | `tank.ts` | `type Point`. A spot, or a step, across and down | 115 |
| 2 | `tank.ts` | `type Tank`. Everything a tank holds | 27 |
| 3 | `tank.ts` | The signatures of `stepAlong`, `turnTank`, `driveTank` and `aimOf` | 18 |
| 4 | `shells.ts` | `type Shell`. Everything a shell holds | 9 |
| 5 | `shells.ts` | `type Hit`. A shell that reached a tank | 7 |
| 6 | `shells.ts` | The signatures of `fireShell`, `moveShell`, `shellHitsTank` and `damageTank` | 0 |

The last column is how you check your work. If the number did not drop, read the first error.

Each job has two hints next to it. The answers sit at the very bottom of each file.

Number 2 is the big drop. `game.ts` and `rack.ts` use tanks on almost every line, so one type fixes about ninety errors at once.

## Three words for the three kinds of job

**A type** for an object lists its parts. Each part is a name, a colon, what kind of value it is, and a semicolon:

```ts
type Point = {
  x: number;
  y: number;
};
```

The kinds you need this project:

| Type | What it allows |
|---|---|
| `number` | Any number: `3`, `-1`, `0.7`, `Math.PI` |
| `boolean` | `true` or `false` |
| `string` | Any text |
| `'blue' \| 'red'` | Exactly `'blue'`, or exactly `'red'`. Nothing else. The `\|` means "or" |
| `Tank` | A whole tank. A type can hold another type |
| `Tank[]` | A list of tanks |

**A signature** is the first line of a function, with types added. Every input gets a type. The function gets one more type after its brackets, for what it hands back:

```ts
function isWallAt(x: number, y: number): boolean {
```

Read that as: "isWallAt takes two numbers and hands back true or false".

**`void`** means a function hands back nothing. `turnTank` changes a tank and hands nothing back, so its signature ends in `: void`.

## Types vanish before the game runs

Here is the strange part. **The browser cannot read TypeScript.** It only understands JavaScript.

So `npm run dev` does two jobs at once. It checks your types and prints the errors. It also rubs out every type and hands the browser plain JavaScript. Taking out the types before the page runs is called a **build step**.

That is why the game plays with 119 errors. The browser never sees the types, so it never sees a problem with them. The errors are a message for you, not for the browser.

It is also why a double-click stopped working. A double-clicked page goes straight to the browser, with no build step on the way, and the browser does not understand the `.ts` file.

## What a type catches, and what it does not

Types catch mistakes about **shape**. Here are four the computer now stops for you:

| The mistake | What the computer says |
|---|---|
| `tank.helth -= 25` | `Property 'helth' does not exist on type 'Tank'` |
| `owner: 'green'` in a shell | `Type '"green"' is not assignable to type 'Name'` |
| `turnTank(blue, 'left', seconds)` | `Argument of type 'string' is not assignable to parameter of type 'number'` |
| A new tank with `wins` left out | `Property 'wins' is missing` |

Types do not catch mistakes about **meaning**. Remember the good bugs from project 16:

- An `aimOf` that hands back `tank.turret` on its own still hands back a number. The type is right, and the gun is still wrong.
- A `turnTank` that turns the wrong way still changes a number by a number.
- A `driveTank` that sticks to walls has the right types in every line.

Types make sure the pieces fit together. Whether the game plays correctly is still up to you, and to playing it.

## import and export

Project 14 gave you several files, and two problems came with them. Two files could not use the same name. And nothing in a file said where a name came from.

Both are fixed now. Look at the top of `shells.ts`:

```ts
import { isWallAt } from './arena';
import { aimOf, stepAlong, tanks } from './tank';
```

A file only sees the names it imports. So two files can each have a function called `update`, and they never clash. And every name has a line at the top saying which file it came from.

The other half is `export`. A name is private to its file unless `export` stands in front of it:

```ts
export function isWallAt(x: number, y: number): boolean {
```

`import type` brings in a type and nothing else:

```ts
import type { Name, Tank } from './tank';
```

The script tags are gone too. `tanks.html` loads one file, `game.ts`. Its `import` lines load the rest, and those files' imports load theirs. The order is written in the files themselves.

## The files

| File | Its one job | Who writes the types |
|---|---|---|
| `numbers.ts` | The numbers, the three arenas, and the keys | Finished |
| `arena.ts` | The map, the blocks, and `blocked`. Fully typed. Read it as your example | Finished |
| `tank.ts` | Turning, driving, stopping at walls, and aiming | **You. Jobs 1 to 3** |
| `shells.ts` | Firing, flying, bouncing, hitting and damage | **You. Jobs 4 to 6** |
| `rack.ts` | Everything you read: readouts, the status line, the cards | Finished |
| `game.ts` | Phaser, the keys, the clock, rounds and drawing | Finished |
| `package.json` | The list of tools and libraries `npm install` fetches | Never edit this |
| `tsconfig.json` | The settings for the type checker | Never edit this |
| `vite.config.ts` | The settings for `npm run dev` | Never edit this |

`tanks.html` and `styles.css` are finished too, and nearly the same as project 16's.

`phaser.min.js` is gone. Phaser now comes from npm, and a file asks for it like any other:

```ts
import Phaser from 'phaser';
```

## What you will learn

- What a type is, and how to write one for an object
- How to write a signature, and what `void` means
- How a type can be built from other types
- Why `'blue' | 'red'` is stricter than `string`
- What a type catches, and what it cannot catch
- How `import` and `export` replace a list of script tags
- What npm, a build step and a development server are for

## Good to know

### What you already know

The game is project 16's, line for line. Read `16-tanks/README.md` again for how it plays. Read `01-calculator/README.md` through `15-scores/README.md` for everything before that.

- A tank moves first, then takes back the part of the move that hit.
- `stepAlong` turns an angle and a distance into a step across and down.
- The way the gun points is `tank.angle + tank.turret`.
- A moving thing is a plain object, like `{ x, y, vx, vy }`.
- Several files each have one job, and the file that owns a job owns its memory.
- A terminal runs a program that is not a webpage, and Ctrl and C stops it.
- `null` means "nothing here yet".

### Reading an error

Here is the first error the terminal shows when you start:

```text
 ERROR(TypeScript)  TS2339: Property 'x' does not exist on type 'Tank'.
 FILE  .../17-typescript/arena.ts:76:21
```

- `TS2339` is the error's number. You can ignore it.
- The sentence is what went wrong.
- `arena.ts:76:21` is the file, the line, and how far along the line.
- Under that, the terminal prints the line of code, with a `^` under the exact spot.

**An error shows where a shape is used, not where it is missing.** The error above is in `arena.ts`, and `arena.ts` is fine. The problem is that `type Tank` in `tank.ts` has no `x` yet. So read the sentence first, and then decide which file to open.

Always fix the **first** error, then save. One missing part of a type can cause twenty errors further down.

### Finding your mistakes

| What you see | What went wrong |
|---|---|
| `Property 'x' does not exist on type 'Point'` | `type Point` is still empty, or `x` is spelled differently |
| `Property 'wins' does not exist on type 'Tank'` | `type Tank` is missing a part. Check the list in the comment above it |
| `Parameter 'tank' implicitly has an 'any' type` | That input has no type yet. Add `: Tank` after it |
| `Type 'boolean' is not assignable to type 'number'` | A part has the wrong type. `wrecked` is a `boolean`, not a `number` |
| `Cannot find name 'Tank'` in `shells.ts` | Types from another file need importing. Check the `import type` line at the top |
| `A function whose declared type is neither 'undefined', 'void' nor 'any' must return a value` | You gave a function a return type, and it hands nothing back. Use `: void` |
| The number of errors went up | A spelling mistake in a type. Read the first error |
| `npm: command not found` | Node is not installed. Project 15 needed it too |
| An error that says it cannot find `phaser` | You have not run `npm install` in this folder yet |
| The page is blank, and the terminal says nothing | `npm run dev` is not running. Start it again |

### The costs

Types are worth it for the strategy game ahead, which has many kinds of thing to keep straight. They are not free.

- **You install things now.** The folder needs `npm install` and a terminal before it runs at all.
- **The code gets longer.** `rack.ts` checks that every element it looks for is really on the page. JavaScript let you skip that check, and crashed later when an id was wrong.
- **`null` has to be dealt with.** A value that might be `null` must be checked before it is used. `game.ts` has several `if (stage === null) return;` lines for this reason.
- **`as` lets you lie.** `game.ts` says `keyboard.addKeys(CONTROLS.blue) as Pad`. That tells the computer "trust me". It believes you and checks nothing. If you were wrong, the game breaks at run time, the same as plain JavaScript.
- **It checks shape, not sense.** A game with no type errors can still drive backwards.

### Already written for you

- Every function body, in every file. Leave the insides alone.
- `type Name`, the finished example in `tank.ts`.
- `type Starts` in `arena.ts`, which is two Points in one type.
- `type Phase`, `type Duel`, `type Pad` and `type Look` in `game.ts`.
- The signatures of every function outside your six jobs.
- The npm settings, the type checker's settings, and `npm run dev`.

Three small changes from project 16 make the code fit modules. `blocked` takes the list of tanks as a second input. `blue` and `red` are built straight away instead of starting as `null`. The sky is emptied with `forgetAllShells()`, because another file cannot replace the `shells` list.

The `#demo` addresses are gone. They filled in empty functions, and this project has none.

### Try this next

- **Make a mistake on purpose.** Change `tank.health` to `tank.helth` in `damageTank`. Read the error, then put it back.
- **Try a third tank colour.** Add `'green'` to `type Name`. Count the errors that appear, and read why each one is there.
- **A stricter turn.** `turn` is only ever -1, 0 or 1. Change its type from `number` to `-1 | 0 | 1` and see what the checker says about `game.ts`.
- **Hover to read a type.** In VS Code, rest the mouse on `step` inside `driveTank`. The editor shows `const step: Point`, because it worked that out from your signature.
- **Type the controls.** `CONTROLS` in `numbers.ts` has no written type. Write `type Controls` for it.

## What comes next

Project 18 is the map editor. It is a new program, written in TypeScript from the first line.

Its terrain lives in a table, so adding a new kind of ground is one line of data. That project also brings your first tests, which are small programs that check your functions give the right answers.
