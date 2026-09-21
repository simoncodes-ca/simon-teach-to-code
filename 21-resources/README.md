# Resources

The six tanks from project 20 have a new job. They are harvesters now, and there is ore on the map.

A harvester drives out to a patch, digs until it is full, drives home to the refinery, and tips its load in. The credits counter climbs. Then it goes back out and does it again, for as long as there is ore left.

You write seven functions and two tests. The last one closes the loop, and after that the whole run goes round on its own.

## The one big idea

**A number that grows over time grows by a rate times the seconds.**

A harvester digs 25 ore a second. So in one frame, which might be a sixtieth of a second, it digs `25 * seconds` ore. That is the rule project 7 taught with the balloons, moved from pixels to ore.

Never dig a fixed amount each frame. On a fast screen that would dig twice as fast, and the whole economy would depend on the computer.

Both of your digging functions end the same way, and the ending matters as much as the rate:

```text
never take more than is there
```

A patch with 12 ore left gives 12, however much you ask for. A harvester with room for 8 takes 8, however long the frame was. Both limits are `Math.min`.

## The other big idea

**A bar is one number between 0 and 1.**

`fullness(part, whole)` is the first thing you write, and it is three lines. Then every bar on the page is drawn from it: the six load bars in the squad list, the bar over each harvester on the map, the refinery's bar, the Field card's bar, and the glow on each patch.

Eight places, one function. That is why an empty `fullness` leaves the whole page flat, and why filling it in changes so much at once.

## Getting it running

This project uses two terminals, both in this folder, the same as projects 19 and 20.

The first time only, install what the project needs:

```bash
npm install
```

Then start these two, one in each terminal:

| Terminal | Command | What it does |
|---|---|---|
| 1 | `npm run dev` | Opens the ore run in the browser, and checks your types |
| 2 | `npm test` | Runs the tests, and runs them again every time you save |

Leave both running while you work.

## Your nine jobs

Seven jobs are functions in `ore.ts`. Two jobs are tests in `ore.test.ts`. Do them in this order:

| # | File | Your job | What you see afterwards |
|---|---|---|---|
| 1 | `ore.ts` | `fullness` | Every bar on the page stops being flat |
| 2 | `ore.ts` | `oreAt` | Each patch shows how much ore is left in it |
| 3 | `ore.ts` | `nearestOre` | An amber ring marks the closest patch to the mouse |
| 4 | `ore.test.ts` | Test: a cell never gives up more ore than it holds | A new red test in terminal 2 |
| 5 | `ore.ts` | `takeOre` | That test goes green |
| 6 | `ore.ts` | `digStep` | Send a harvester to a patch. Its load bar fills up |
| 7 | `ore.test.ts` | Test: unloading moves the whole load, and never more | Another red test |
| 8 | `ore.ts` | `unloadStep` | Send a full harvester home. The credits counter climbs |
| 9 | `ore.ts` | `nextJob` | Every harvester picks its own job. The run never stops |

The line under the map names the next job, so you always know where you are.

Each job has two hints next to it. The answers to the functions sit at the bottom of `ore.ts`. The answers to the tests sit at the bottom of `ore.test.ts`.

### What the terminals say as you work

| After job | Terminal 1 | Terminal 2 |
|---|---|---|
| Start | 7 errors | `4 failed \| 2 todo` |
| 1 | 6 errors | `3 failed \| 1 passed \| 2 todo` |
| 2 | 5 errors | `2 failed \| 2 passed \| 2 todo` |
| 3 | 4 errors | `1 failed \| 3 passed \| 2 todo` |
| 4 | 4 errors | `2 failed \| 3 passed \| 1 todo` |
| 5 | 3 errors | `1 failed \| 4 passed \| 1 todo` |
| 6 | 2 errors | `5 passed \| 1 todo` |
| 7 | 2 errors | `1 failed \| 5 passed` |
| 8 | 1 error | `6 passed` |
| 9 | No errors | `6 passed` |

The failed count goes up at jobs 4 and 7. That is correct. A test you never saw fail might not check anything.

## The files

| File | Its one job | Who writes it |
|---|---|---|
| `numbers.ts` | The sizes, and the three rates the economy runs on | Finished |
| `terrain.ts` | Project 18's table, with ore added to it | Finished |
| `map.ts` | The map, and turning cells into pixels and back | Finished |
| `paths.ts` | Your project 20 pathfinder | Finished |
| `units.ts` | Your project 19 and 20 harvesters | Finished |
| `ore.ts` | The ore, the loads, the credits, and the jobs | **You. Seven functions** |
| `ore.test.ts` | The tests for `ore.ts` | **You. Two tests** |
| `rack.ts` | Everything you read: the squad, the cards, the bars | Finished |
| `game.ts` | Phaser, the mouse, the jobs, and every frame | Finished |
| `maps/` | The two maps the harvesters work | Finished |

`ore.html`, `styles.css`, `package.json`, `tsconfig.json` and `vite.config.ts` are finished too. Never edit them.

`ore.ts` imports nothing from Phaser and nothing from the page. That is why the tests can check it without a browser.

## What you will learn

- How a number grows over time, by a rate times the seconds
- Why every function that moves a resource ends in `Math.min`
- How one small function draws every bar on a page
- How to search a grid for the closest thing
- How a state machine sends a worker round a loop, for ever
- Why the order of the questions in that state machine matters

## Good to know

### What you already know

Read `01-calculator/README.md` through `20-pathfinding/README.md` again for the full story.

- A rate times the seconds is how anything moves. Project 7 wrote it first.
- `Math.min` picks the smaller of two numbers. `Math.max` picks the larger.
- A grid is rows of columns, so you read it `[row][col]`.
- `cellAt` says which cell a spot is in. `middleOf` goes the other way.
- A type like `'waiting' | 'digging'` allows only those words.
- A state machine is one word that says what a thing is doing now. The lift in project 2 had four.
- A test has three steps: make, call, expect. Write it before the function it checks.
- `findRoute` finds a way round the rock and the water. You wrote it last project.

### Two grids, one map

The map says where ore grows. The ore field says how much is left. They are two grids of the same shape, laid over each other.

```text
map.cells[row][col]      'ore', 'grass', 'water', and so on. It never changes
field.amount[row][col]   240, 215, 0. It changes every frame somebody digs
```

That is the pair from Battleship, where a sea kept its ships in one grid and the shots at them in another. One grid of letters could not have held both facts.

It is also why an emptied patch still looks like ore ground. The ground was never the ore. The page draws a spent patch grey, and the number on it disappears.

### Why both take functions end in Math.min

`takeOre` and `digStep` each move ore from one place to another, and each of them can be asked for more than exists.

| Function | It can never give | So it ends in |
|---|---|---|
| `takeOre` | more than the cell holds | `Math.min(wanted, oreAt(field, cell))` |
| `digStep` | more than the harvester has room for | `Math.min(DIG_RATE * seconds, room)` |
| `unloadStep` | more than the harvester is carrying | `Math.min(UNLOAD_RATE * seconds, load)` |

Leave one out and nothing crashes. A load bar draws past the end of its track, or a patch goes below zero and hands out ore that was never in the ground. Both are in the table of mistakes below.

### The order of the questions in nextJob

`nextJob` asks four questions, and it must ask them in the right order. The first one that says yes wins.

A full harvester standing on a patch answers yes to two of them. It is full, and there is ore under it. Ask "is there ore here?" first, and it digs a patch it has no room for, for ever. Ask "am I full?" first, and it drives home.

This is the shortest lesson in the project, and it is the one an hour goes into.

### The numbers the run makes

Measured in Chrome, with the answer key filled in, from the moment the map appears:

| | Ore Valley | River Mine |
|---|---|---|
| Patches | 15 | 17 |
| Ore on the map | 3600 | 4080 |
| Credits after one minute | 1600 | 1199 |
| Credits after two minutes | 2938 | 2751 |
| Ore a minute, steady | about 1450 | about 1380 |

One patch holds 240 ore. A harvester carries 100, digs 25 a second, and tips 60 a second. So one full load is four seconds of digging and under two seconds of tipping, and everything else in that minute is driving.

River Mine keeps all its ore on the far side of a river, and there is one bridge. The run still works, because `findRoute` finds the bridge. It is slower, and the Ore a minute number shows that difference.

Watch what the six of them do. They all head for the same patch, because they all ask `nearestOre` from the same place at the same time. Nothing tells a harvester that another one is already on its way. That is a real limit, and it is in "try this next".

### Already written for you

- The terrain table, the map functions, and your pathfinder from project 20.
- `makeField`, which reads the table's `holds` column and builds the ore grid.
- `makeRefinery`, which stands the refinery on cell 4, 10.
- Picking, the drag box, orders and driving, all from projects 19 and 20.
- The page doing what your `nextJob` says: a driving word turns into a route, and the other words leave the harvester where it is.
- Four of the six tests.

### Finding your mistakes

| What you see | What went wrong |
|---|---|
| Every bar stays flat | `fullness` is still empty, or it never returns |
| A load bar runs past the end of its track | `fullness` forgot `Math.min(1, ...)` |
| The page shows an error when the mouse leaves the map | `oreAt` looked the cell up before asking `isInside` |
| The numbers land on the wrong cells | A grid was read as `[col][row]` instead of `[row][col]` |
| A harvester drives to the far side of the map for ore | `nearestOre` compared the wrong cells, or never kept the best one |
| A patch goes below 0, and the ore never runs out | `takeOre` wrote to the cell before checking what was in it |
| A harvester fills up in a single frame | `digStep` forgot `seconds`, so it dug 25 ore sixty times a second |
| The load bar fills past 100 | `digStep` asked for the rate without taking the room left into account |
| The credits climb faster than the harvesters empty | `unloadStep` added more to the credits than it took off the load |
| A full harvester sits on a patch and never leaves | `nextJob` asked about the ore before asking whether it was full |
| Every harvester says `waiting` and nothing happens | `nextJob` is still empty, or it never reaches the last `return` |
| A test says `expected undefined to be ...` | The function it checks is still empty |

The best bug in this project is `digStep` without its `seconds`. The run looks wonderful. Every harvester fills up the instant it stops, the credits pour in, and the field is empty in ten seconds. It is the same bug project 7 named, and it is worth writing once on purpose to watch it happen.

### Try this next

- **Ore that grows back.** Give each spent patch a little ore every second, up to what it started with. Then the field never runs out, and the six harvesters settle into a rhythm.
- **A bigger bed.** Give one harvester a `capacity` of its own instead of using `CAPACITY` for all six. Is a bigger truck always better?
- **One patch each.** Stop two harvesters heading for the same patch. `nearestOre` would need to know which cells are already claimed.
- **A second refinery.** Put another one on the map, and send each harvester to the nearer one.
- **Paint your own field.** Add the `ore` line from `terrain.ts` to `18-editor/terrain.ts`, draw a map, and copy the file into `21-resources/maps`.

## What comes next

Project 22 is the production queue. The credits finally buy something, building takes time, and a button stays grey until you can afford what is on it.
