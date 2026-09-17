# Pathfinding

The six tanks from project 19 are back. In project 19 they drove in a straight line and stopped at the water. Now they find their own way round.

Pick some tanks and click the ground. Each tank searches the map for a route, then drives along it. You watch the first tank's search spread across the map, one cell at a time, with a number on every cell it finds.

You write seven functions and two tests. Together they make a real pathfinder, the same kind that strategy games use.

## The one big idea

**A search keeps a list of cells to look round next. That list is called the frontier.**

At the start, the frontier holds one cell: the tank's own cell. Then the search repeats one small job again and again:

1. Take a cell out of the frontier.
2. Is it the goal? Then the search is done.
3. Otherwise, find the cells next door that nobody has found yet. Write down how many steps away each one is, and which cell it came from. Put them in the frontier.

That is the whole search. On the map, the frontier is the blue squares. Every shaded cell with a number is a cell the search has found.

When the frontier is empty, there is nowhere left to look. The goal was never found, so no route exists. The search does not guess. It proves there is no way.

## The other big idea

**The only difference between breadth-first and A\* is which cell comes out of the frontier next.**

Breadth-first takes the cell at the front of the list. You met that in the elevator: a queue, first in, first out. The search spreads out evenly, like a ripple on a pond.

A\* (say "A star") takes the cell that looks best. For each cell it adds two numbers:

```text
total = steps from the start + guess to the goal
```

The cell with the smallest total comes out first. So the search heads towards the goal, and only spreads out when something is in the way.

Both ways find a route of the same length. A\* usually looks at far fewer cells to find it. Press the two buttons on the Search card and watch the Looked at number.

## Getting it running

This project uses two terminals, both in this folder, the same as project 19.

The first time only, install what the project needs:

```bash
npm install
```

Then start these two, one in each terminal:

| Terminal | Command | What it does |
|---|---|---|
| 1 | `npm run dev` | Opens the route finder in the browser, and checks your types |
| 2 | `npm test` | Runs the tests, and runs them again every time you save |

Leave both running while you work.

## Your nine jobs

Seven jobs are functions in `paths.ts`. Two jobs are tests in `paths.test.ts`. Do them in this order:

| # | File | Your job | What you see afterwards |
|---|---|---|---|
| 1 | `paths.ts` | `neighbours` | Blue dots mark the cells next door to the mouse |
| 2 | `paths.ts` | `startSearch` | Send a tank. A 0 appears on its cell, in a blue square |
| 3 | `paths.ts` | `searchStep` | The search spreads out from the tank, with a number on every cell |
| 4 | `paths.ts` | `routeBack` | When the search finds the goal, an orange line draws the route |
| 5 | `paths.test.ts` | Test: no route across a river with no bridge | A new red test in terminal 2 |
| 6 | `paths.ts` | `findRoute` | The tanks drive along their routes, round the rock and the water |
| 7 | `paths.ts` | `guess` | The Guess and Total wells fill in under the mouse |
| 8 | `paths.test.ts` | Test: A\* finds as short a route, and looks at fewer cells | A new red test in terminal 2 |
| 9 | `paths.ts` | `bestIndex` | The A\* button works. The search heads straight for the goal |

The line under the map names the next job, so you always know where you are.

Each job has two hints next to it. The answers to the functions sit at the bottom of `paths.ts`. The answers to the tests sit at the bottom of `paths.test.ts`.

### What the terminals say as you work

| After job | Terminal 1 | Terminal 2 |
|---|---|---|
| Start | 7 errors | `4 failed \| 2 todo` |
| 1 | 6 errors | `3 failed \| 1 passed \| 2 todo` |
| 2 | 5 errors | `2 failed \| 2 passed \| 2 todo` |
| 3 | 4 errors | `1 failed \| 3 passed \| 2 todo` |
| 4 | 3 errors | `4 passed \| 2 todo` |
| 5 | 3 errors | `1 failed \| 4 passed \| 1 todo` |
| 6 | 2 errors | `5 passed \| 1 todo` |
| 7 | 1 error | `5 passed \| 1 todo` |
| 8 | 1 error | `1 failed \| 5 passed` |
| 9 | No errors | `6 passed` |

The failed count goes up at jobs 5 and 8. That is correct. A test you never saw fail might not check anything.

## The files

| File | Its one job | Who writes it |
|---|---|---|
| `numbers.ts` | The size of the map, and the speeds of the tanks and the search | Finished |
| `terrain.ts` | Project 18's table of every kind of ground | Finished |
| `map.ts` | The map, and turning cells into pixels and back | Finished |
| `paths.ts` | Searching the map for a route | **You. Seven functions** |
| `paths.test.ts` | The tests for `paths.ts` | **You. Two tests** |
| `units.ts` | Your project 19 tanks, now driving along a route | Finished |
| `rack.ts` | Everything you read: the squad, the cards, the maps | Finished |
| `game.ts` | Phaser, the mouse, the search you watch, and every frame | Finished |
| `maps/` | The maps the tanks drive on | Finished |

`paths.html`, `styles.css`, `package.json`, `tsconfig.json` and `vite.config.ts` are finished too. Never edit them.

`paths.ts` imports nothing from Phaser and nothing from the page. That is why the tests can check it without a browser.

## What you will learn

- How to find the cells next door, and leave out the edge and the water
- How a frontier works, and why a search needs one
- How to remember where every cell came from, and follow that trail back
- Why an empty frontier proves that no route exists
- How breadth-first search spreads out evenly
- How A\* uses a guess to head for the goal, and why it still finds the shortest route

## Good to know

### What you already know

Read `01-calculator/README.md` through `19-units/README.md` again for the full story.

- A queue is a list where the first in is the first out. `shift` takes from the front.
- `splice(i, 1)` takes one thing out of a list at index `i`.
- A grid is a list of rows, and you build it with one loop inside another.
- `cellAt` divides by `TILE` and rounds down. `middleOf` goes the other way.
- A click only changes what a tank remembers. The frame does the driving.
- The terrain table says which ground is `walkable`.
- A type like `'searching' | 'found' | 'stuck'` allows only those words.
- A test has three steps: make, call, expect. Write it before the function it checks.

### Row first, then column

The grids in a search are the same shape as `map.cells`. So you read them row first: `search.steps[row][col]`.

A `Cell` says it the other way round: `{ col: 3, row: 5 }`. Mixing the two up is the easiest mistake in this project. When a number lands on the wrong cell, check the order first.

### Why a search must write "found" on every cell

Every cell starts with steps of -1, which means "not found yet". `searchStep` only adds a neighbour to the frontier while its steps are still -1.

Leave that check out, and two cells next door keep finding each other. The frontier grows for ever, and the page freezes. The -1 is what makes the search finish.

### Why the guess never says too much

`guess` counts the steps across plus the steps down. A tank can only drive up, down, left and right, so no route is ever shorter than that. Rock and water only make it longer.

That matters. A guess that can say too much makes A\* skip past the shortest route. A guess that is never too big keeps A\* honest.

### What the numbers on the map show

These come from the first tank's search, measured with the answer key filled in, from cell 4, 10:

| Map | Goal | Breadth-first looked at | A\* looked at | Route |
|---|---|---|---|---|
| River Crossing | 2, 1 | 119 cells | 48 cells | 14 cells |
| Sandy Island | 15, 4 | 166 cells | 113 cells | 20 cells |
| Horseshoe Rocks | 12, 1 | 201 cells | 78 cells | 18 cells |
| Horseshoe Rocks | 18, 12 | 263 cells | 198 cells | 33 cells |
| River Crossing | 16, 10 | 123 cells | 123 cells | No route |

Look at the last two rows.

Horseshoe Rocks has a wall of rock shaped like a cup, with its open side facing the tanks. Send a tank to the far side, and A\* heads straight into the cup. It has to fill the cup before it finds the way over the top. A\* still wins, but by much less.

River Crossing has no bridge. When there is no route, both searches look at every cell the tank could ever reach. A failed search is the most expensive search there is.

### Already written for you

- The terrain table and the map functions, from projects 18 and 19.
- `cellAt`, `middleOf` and `sameCell` in `map.ts`.
- `takeNext` in `paths.ts`. It takes the next cell out of the frontier, and it calls your `bestIndex` for A\*.
- Your project 19 tanks in `units.ts`. `driveTank` now follows a route one cell at a time.
- Playing the first tank's search slowly on the map, 45 cells a second.
- Four of the six tests.

### Finding your mistakes

| What you see | What went wrong |
|---|---|
| Blue dots appear on the water | `neighbours` forgot to check `walkable` |
| The page shows an error when the mouse is at the edge | `neighbours` looked up the ground before asking `isInside` |
| Numbers land on the wrong cells | A grid was read as `[col][row]` instead of `[row][col]` |
| The page freezes when you send a tank | `searchStep` adds neighbours that were already found. Check for -1 |
| Every number on the map is 1, except the 0 | `searchStep` set steps to 1, instead of this cell's steps plus 1 |
| A tank drives straight over the water to the far end, then all the way back | `routeBack` used `push` instead of `unshift`, so the route is back to front |
| A tank says no route when there clearly is one | `findRoute` stopped after one `searchStep` instead of looping |
| A\* spreads out just like breadth-first | `bestIndex` always hands back 0, or never compares totals |
| A\* goes the wrong way | `guess` forgot `Math.abs`, so cells to the left seemed very close |
| A test says `expected undefined to be ...` | The function it checks is still empty |

The best bug in this project is the missing `Math.abs`. Without it, a cell below the goal or to its right gets a guess below zero. A\* thinks it is the best cell on the map, and runs off in the wrong direction. It still finds the route in the end, because it never stops until the goal comes out of the frontier.

### Try this next

- **Corners.** Let tanks drive corner to corner too. `neighbours` gets eight cells instead of four. What must `guess` change to, so it never says too much?
- **Forest costs more.** Make a step into the forest cost 3 instead of 1. The steps grid becomes a cost grid, and the search must let a cheaper route replace a dearer one. This is called Dijkstra's algorithm.
- **Paint a trap.** Paint a map in the editor that makes A\* look at more cells than breadth-first. Is it possible?
- **Count the route.** Show the route length next to each tank's name in the squad list.
- **Bridge the river.** Copy `crossing.json`, add one road cell across the river, and watch every tank use it.

## What comes next

Project 21 is resources. Workers gather, production takes time, and counters and progress bars show it happening.
