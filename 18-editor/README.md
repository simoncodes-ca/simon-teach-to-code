# The Map Editor

A map lies on a drafting table under a sheet of glass. You pick a kind of ground from the palette, then click and drag to paint it onto the map. Give the map a name, press Save, and the map server keeps it.

This is not a game. It is the tool that makes maps for games. The strategy game at the end of the trail is played on maps you draw here.

Two things in this project are new. The first is a table that describes every kind of ground. The second is tests, which are small programs that check your functions for you.

## The one big idea

**What a thing is belongs in a table, not in the code.**

Open `terrain.ts`. Here are two lines of it:

```ts
grass: { letter: '.', name: 'Grass', picture: 'grass.png', colour: '#7aa34a', walkable: true,  speed: 1 },
water: { letter: '~', name: 'Water', picture: 'water.png', colour: '#3f86b8', walkable: false, speed: 0 },
```

Everything the editor knows about grass is on that first line. Its letter in a saved map is there. Its name on the page is there. Its picture and whether a tank can drive on it are there too.

No other file says any of that again. The palette makes one button for each line. The loader loads one picture for each line. Your `mapToLines` looks up each letter in the table.

So a new kind of ground is one new line. Add a line for snow, draw a picture for it, and the palette gets a Snow button. Saved maps learn a new letter, and the hover panel knows whether tanks can drive on snow. Nobody touches any other file.

Programmers call this **content as data**. The code says how things work. The table says what the things are. The strategy game needs this idea more than any other, because it will have many kinds of ground, units and buildings.

## The other big idea

**The map is only data. Pictures and letters are two ways to show it.**

This is what the map looks like in memory:

```ts
cells: [
  ['water', 'water', 'grass'],
  ['grass', 'grass', 'rock']
]
```

It holds keys from the table. It holds no pictures and no colours.

The window turns those keys into pictures. The Saved map panel turns the same keys into letters. Paint a cell and both of them change, because both of them read the same map.

Neither one is the map. You met this in the cheese vault, where the map was the truth and the sprites only showed it. Here there are two drawings, and you can watch them agree.

## Getting it running

This project uses three terminals, all in this folder. Each one runs a different program.

The first time only, install what the project needs:

```bash
npm install
```

Then start these three, one in each terminal:

| Terminal | Command | What it does |
|---|---|---|
| 1 | `npm run dev` | Opens the editor in the browser, and checks your types |
| 2 | `npm run server` | Starts the map server, which keeps the maps |
| 3 | `npm test` | Runs the tests, and runs them again every time you save |

Leave all three running while you work. Press Ctrl and C in a terminal to stop that program.

**Stop the server and start it again after you change `map.ts`.** The server reads your functions once, when it starts. The editor and the tests notice your changes by themselves.

## Your nine jobs

Seven jobs are functions in `map.ts`. Two jobs are tests in `map.test.ts`. Do them in this order:

| # | File | Your job | What you see afterwards |
|---|---|---|---|
| 1 | `map.ts` | `makeMap` | The window fills with grass |
| 2 | `map.ts` | `isInside` | Under the pencil shows the cell under your mouse |
| 3 | `map.test.ts` | Test: painting outside the map changes nothing | A new red test in terminal 3 |
| 4 | `map.ts` | `paintCell` | Click and drag to paint. The red test turns green |
| 5 | `map.ts` | `countTerrain` | Every palette button counts its cells |
| 6 | `map.ts` | `mapToLines` | The Saved map panel shows your map as letters |
| 7 | `map.ts` | `terrainFor` | Press `~` or `#` over the map to pick that ground |
| 8 | `map.test.ts` | Test: `linesToMap` undoes `mapToLines` | A new red test in terminal 3 |
| 9 | `map.ts` | `linesToMap` | Load a map from the list. Save your own |

The line under the map names the next job, so you always know where you are.

Each job has two hints next to it. The answers to the functions sit at the bottom of `map.ts`. The answers to the tests sit at the bottom of `map.test.ts`.

## Tests

**A test is a small program that checks one of your functions.**

Until now you checked your work by playing. You clicked, looked at the screen, and decided whether it was right. That works, but it is slow, and you have to do it all again after every change.

A test does the checking for you. Here is one of the four finished tests:

```ts
test('isInside says no to every edge of the map', () => {
  const map = makeMap('Test', 3, 2);

  expect(isInside(map, 0, 0)).toBe(true);
  expect(isInside(map, 3, 0)).toBe(false);
});
```

It makes a tiny map. It calls `isInside` with a cell that is on the map, and with a cell that is one step off the right edge. Then it says what the answer should be each time.

`npm test` runs every test and prints a line for each one. A green tick means the function gave the right answer. A red cross means it did not, and the terminal prints what it expected and what it got.

### What the terminal says as you work

Before you start, terminal 3 ends like this:

```text
 Tests  4 failed | 2 todo (6)
```

Four tests fail because the functions they check are empty. The two `todo` lines are your two tests, still waiting to be written.

| After job | Tests line |
|---|---|
| Start | `4 failed \| 2 todo` |
| 1 | `3 failed \| 1 passed \| 2 todo` |
| 2 | `2 failed \| 2 passed \| 2 todo` |
| 3 | `3 failed \| 2 passed \| 1 todo` |
| 4 | `2 failed \| 3 passed \| 1 todo` |
| 5 | `2 failed \| 3 passed \| 1 todo` |
| 6 | `1 failed \| 4 passed \| 1 todo` |
| 7 | `5 passed \| 1 todo` |
| 8 | `1 failed \| 5 passed` |
| 9 | `6 passed` |

Look at jobs 3 and 8. The number of failed tests goes **up**. That is correct.

### Write the test first

You write each test before the function it checks. The test is red at first, because the function is still empty. Then you write the function, and the test turns green.

That order matters. A test that was never red might not check anything. You only know a test works once you have seen it fail.

### What a test runner does

`npm test` runs a tool called **Vitest**. It is not magic. Here is a small `test` and `expect` of your own, in about fifteen lines:

```ts
function test(sentence: string, check: () => void): void {
  try {
    check();
    console.log('✓ ' + sentence);
  } catch (error) {
    console.log('✗ ' + sentence + ': ' + String(error));
  }
}

function expect(actual: unknown) {
  return {
    toBe(wanted: unknown): void {
      if (actual !== wanted) throw new Error('expected ' + String(wanted) + ' but got ' + String(actual));
    }
  };
}
```

`expect` throws an error when the answer is wrong. `test` catches the error and prints a cross. Vitest does the same job. It also finds every test file, runs them again when you save, and prints the result in colour.

## The files

| File | Its one job | Who writes it |
|---|---|---|
| `numbers.ts` | The size of the map, and the server's address | Finished |
| `terrain.ts` | The table of every kind of ground | Finished. Read it first |
| `map.ts` | Making, painting, counting, saving and loading a map | **You. Seven functions** |
| `map.test.ts` | The tests for `map.ts` | **You. Two tests** |
| `rack.ts` | Everything you read: the palette, the panels, the list of maps | Finished |
| `editor.ts` | Phaser, the mouse, the keys, and talking to the server | Finished |
| `server.ts` | The map server. It keeps each map as a file | Finished |
| `maps/` | The saved maps. Open one and read it | The server writes these |

`editor.html`, `styles.css`, `package.json`, `tsconfig.json` and `vite.config.ts` are finished too. Never edit them.

`map.ts` imports nothing from Phaser and nothing from the page. That is on purpose, and it is why three programs can use it. The editor draws what it hands back. The server checks maps with it. The tests check it.

## What you will learn

- What content as data means, and why a table beats code for describing things
- How to keep a map's data apart from the pictures that show it
- How to turn a map into text and back again
- What a test is, and how to read what `npm test` prints
- Why you write a test before the function it checks
- How one file can be used by a page, a server and a set of tests

## Good to know

### What you already know

Read `01-calculator/README.md` through `17-typescript/README.md` again for the full story.

- A grid is a list of rows, and you build it with one loop inside another.
- A map written as rows of characters is data you can read and change.
- `cellAt` divides by `TILE` and rounds down to turn pixels into a cell.
- A server is a second program, and `fetch` with `await` talks to it.
- Never trust what arrives from another program.
- A type is a written-down shape, and the checker counts every mismatch.
- `import` and `export` connect the files, and `npm run dev` rubs out the types.

### The checker starts at 7

Terminal 1 starts with 7 errors, and the badge on the page says 7. Each error points at one empty function in `map.ts`:

```text
TS2355: A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.
```

That sentence means: "this function promises to hand something back, and it does not." Every function you finish removes one error. When all seven are done, terminal 1 says `No errors`.

### Three small things TypeScript adds here

**`keyof typeof TERRAIN`** means "the keys of the TERRAIN table". In project 17 you wrote `'blue' | 'red'` by hand. `TerrainKey` is worked out from the table instead, so a new line in the table is a new key everywhere.

**`satisfies Record<string, Terrain>`** asks the checker to check every line of the table. If one line has no `speed`, the checker names that line.

**`unknown`** is the type for "anything at all". The server gives this type to every message that arrives. TypeScript will not let the server use an `unknown` thing until it has checked what the thing is. That is project 15's rule, and now the checker enforces it.

### Why the imports end in .ts

The imports in this project look like this:

```ts
import { makeMap } from './map.ts';
```

Project 17 left the `.ts` off. Here the server needs it. Node runs `server.ts` without Vite, and Node only finds a file by its full name.

### Letters in a saved map

Open `maps/island.json` in your editor. Each row of the map is one string:

```json
"~~::...TTTT..##..:~~",
```

That is water, sand, grass, forest, grass, rock, grass, sand, water. You can edit a map by typing in that file, the same way you read the vault's levels in project 11.

Try typing a `?` into one row, then load that map in the editor. Your `linesToMap` refuses it, because `?` is not in the table.

### Already written for you

- The table in `terrain.ts`, and every picture it names.
- The type `GameMap` at the top of `map.ts`.
- The server, and its check that incoming data has the expected fields.
- The palette, which builds one button per line of the table.
- Painting with the mouse, and picking with the keys.
- Four of the six tests.

### Finding your mistakes

| What you see | What went wrong |
|---|---|
| The window says NO MAP YET | `makeMap` hands back nothing |
| The pencil panel shows dashes over the map | `isInside` hands back nothing, or `false` everywhere |
| The pencil panel works on some edges but not others | One of the four checks in `isInside` uses `<=` where it needs `<` |
| Clicking paints nothing | `paintCell` never changes `map.cells`, or hands back `false` every time |
| The letters change somewhere you did not paint, or the right side of the map will not paint | `map.cells[col][row]`. It is row first, then column |
| The counts are all 300 | `countTerrain` counts every cell, and forgot to compare it with `terrain` |
| The letters are all the same | `mapToLines` wrote one letter itself, instead of `TERRAIN[cell].letter` |
| The server refuses every map | `linesToMap` hands back `null` for a good map. Run your round-trip test |
| The server says `linesToMap() is still empty` after job 9 | The server is still running your old file. Stop it and start it again |
| `Maps: server not running` | Terminal 2 is not running `npm run server` |
| `EADDRINUSE` in terminal 2 | Another server is already on door 4000. Project 15's server, maybe |
| A test says `expected undefined to be ...` | The function it checks is still empty |

The best bug in this project is the swapped row and column. The picture looks right, because the editor draws the cell under your mouse. The map itself changed a different cell, and the Saved map panel shows it in the wrong place. Paint near the right side and it stops working altogether. The map has 20 columns but only 15 rows, so `cells[19]` does not exist.

Your round-trip test is the fastest way to find a mistake in `mapToLines` or `linesToMap`. It checks both functions against each other, and against every letter in the table.

### Try this next

- **Add snow.** Copy `sand.png` to `snow.png` and make it paler. Add one line to the table, with the letter `*`. Count how many other files you had to change.
- **Add a bridge.** River Crossing has a road that stops at the water. A bridge is walkable ground over water, and it is one line in the table.
- **A test for countTerrain.** It is the one function with no test. Paint three cells of rock on a small map, then expect a count of 3.
- **Refuse a letter on purpose.** Put a `?` in `maps/crossing.json` and load it. Then write a test that `linesToMap` hands back `null` for it.
- **A map with a border.** Write a function that paints rock all the way round the edge of a map. Then write its test first.

## What comes next

Project 19 is unit selection. You click a tank to select it, drag a box to select several, then click somewhere to send them there.

The tanks drive on a map made in this editor. The `walkable` and `speed` values in your table are what they read.
