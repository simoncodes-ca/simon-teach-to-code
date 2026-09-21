# Unit Selection

Six blue tanks wait on a map from the map editor. Click a tank to pick it. Drag a box to pick several at once. Then click the ground, and every picked tank drives there.

This is how you command an army in a strategy game. The game at the end of the trail starts here.

You write eight functions and two tests. Most of them are short. The idea behind them is the part worth taking with you.

## The one big idea

**A click never moves a tank. A click only changes what a tank remembers.**

Here is everything one tank remembers:

```ts
{ name: 'Able', x: 216, y: 504, angle: 0, selected: false, moving: false, goalX: 216, goalY: 504 }
```

Clicking a tank sets `selected` to `true`. That is the whole of picking. The yellow corners on the map and the lit lamp in the squad list only show that `true`.

Clicking the ground sets `goalX`, `goalY` and `moving` on each picked tank. Nothing drives yet. The order is only written down.

Then, sixty times a second, your `driveTank` reads what each tank remembers and moves it a little way. So a click and the driving happen in two different places. The click writes. The frame reads.

You met this split with the lookout post's troopers. One function decided, and a different function moved. Here the mouse decides, and the frame moves.

## The other big idea

**An order to a group is really one order for each tank.**

You click one spot. Six tanks cannot all park on that one spot, or they end up on top of each other.

So `orderMove` walks through the picked tanks and gives each one its own goal. `parkingSpot` works out a neat block of spots with your click in the middle. Every real strategy game does something like this.

## Getting it running

This project uses two terminals, both in this folder. There is no server this time.

The first time only, install what the project needs:

```bash
npm install
```

Then start these two, one in each terminal:

| Terminal | Command | What it does |
|---|---|---|
| 1 | `npm run dev` | Opens the command post in the browser, and checks your types |
| 2 | `npm test` | Runs the tests, and runs them again every time you save |

Leave both running while you work. Press Ctrl and C in a terminal to stop that program.

## Your ten jobs

Eight jobs are functions in `units.ts`. Two jobs are tests in `units.test.ts`. Do them in this order:

| # | File | Your job | What you see afterwards |
|---|---|---|---|
| 1 | `units.ts` | `tankAt` | A thin ring round the tank under the mouse |
| 2 | `units.ts` | `selectOnly` | Click a tank. Yellow corners close round it |
| 3 | `units.ts` | `selectedTanks` | The label across the top counts the picked tanks |
| 4 | `units.test.ts` | Test: a box dragged backwards is the same box | A new red test in terminal 2 |
| 5 | `units.ts` | `boxFrom` | Drag on the ground. A yellow box follows the mouse |
| 6 | `units.ts` | `isInBox` | Tanks inside the box light up while you drag |
| 7 | `units.ts` | `selectInBox` | Let go of the box. Every tank inside is picked |
| 8 | `units.ts` | `orderMove` | Click the ground. A yellow cross marks each tank's goal |
| 9 | `units.test.ts` | Test: a tank stops at the edge of the water | A new red test in terminal 2 |
| 10 | `units.ts` | `driveTank` | The tanks drive, slow down in the forest, and stop at the water |

The line under the map names the next job, so you always know where you are.

Each job has two hints next to it. The answers to the functions sit at the bottom of `units.ts`. The answers to the tests sit at the bottom of `units.test.ts`.

### What the terminals say as you work

Terminal 1 starts with 8 errors, one for each empty function. Terminal 2 starts with `4 failed | 2 todo`.

| After job | Terminal 1 | Terminal 2 |
|---|---|---|
| Start | 8 errors | `4 failed \| 2 todo` |
| 1 | 7 errors | `3 failed \| 1 passed \| 2 todo` |
| 2 | 6 errors | `2 failed \| 2 passed \| 2 todo` |
| 3 | 5 errors | `2 failed \| 2 passed \| 2 todo` |
| 4 | 5 errors | `3 failed \| 2 passed \| 1 todo` |
| 5 | 4 errors | `2 failed \| 3 passed \| 1 todo` |
| 6 | 3 errors | `2 failed \| 3 passed \| 1 todo` |
| 7 | 2 errors | `1 failed \| 4 passed \| 1 todo` |
| 8 | 1 error | `5 passed \| 1 todo` |
| 9 | 1 error | `1 failed \| 5 passed` |
| 10 | No errors | `6 passed` |

The failed count goes up at jobs 4 and 9. That is correct, and project 18 said why: a test you never saw fail might not check anything.

## The files

| File | Its one job | Who writes it |
|---|---|---|
| `numbers.ts` | The size of the map, and the numbers the tanks drive by | Finished |
| `terrain.ts` | Project 18's table of every kind of ground | Finished |
| `map.ts` | The map, and three questions about a spot on it | Finished |
| `units.ts` | Finding, picking, ordering and driving the tanks | **You. Eight functions** |
| `units.test.ts` | The tests for `units.ts` | **You. Two tests** |
| `rack.ts` | Everything you read: the squad, the panels, the maps | Finished |
| `game.ts` | Phaser, the mouse, and every frame | Finished |
| `maps/` | The maps the tanks drive on. Copied from project 18 | Finished |

`units.html`, `styles.css`, `package.json`, `tsconfig.json` and `vite.config.ts` are finished too. Never edit them.

`units.ts` imports nothing from Phaser and nothing from the page. That is why the tests can check it without a browser.

## What you will learn

- How a click becomes something a tank remembers, instead of something it does
- How to find the thing under the mouse
- How to pick one thing, or every thing inside a box
- How a box dragged in any direction still has a left edge and a right edge
- How one order to a group becomes one goal for each tank
- Why a tank that only drives in straight lines gets stuck

## Good to know

### What you already know

Read `01-calculator/README.md` through `18-editor/README.md` again for the full story.

- The distance between two points is `Math.sqrt(across * across + down * down)`.
- `Math.atan2(down, across)` turns two distances into an angle.
- Move a thing by its speed times the time that passed.
- One function decides, and a different function moves.
- `cellAt` divides by `TILE` and rounds down to turn pixels into a cell.
- What a kind of ground is belongs in the terrain table.
- A type like `'still' | 'driving'` allows only those words.
- A test has three steps: make, call, expect. Write it before the function it checks.

### A click or a drag?

A click and a drag start the same way: the mouse button goes down. The page only knows which one it was when the button comes up.

`game.ts` measures how far the mouse moved in between. Less than `DRAG_START`, which is 6 pixels, and it was a click. Further than that, and it was a drag. Without that gap, a hand that wobbles a little would draw a tiny box every time it tried to click.

### Why the tanks get stuck

Send the squad across River Crossing and watch. Every tank drives in a straight line at its goal. When the water is in the way, the tank stops at the edge and its row in the squad list turns red.

That is not a bug in your `driveTank`. A straight line is the only route it knows. Finding a way round the rock and the water is a much harder problem. It is the whole of project 20.

River Crossing has no way across at all, because its road stops at the water. Try Sandy Island for a map where every piece of land joins up.

`canDrive` only checks the middle of the tank. So a tank can stop with half of its picture over the water. Two tanks can also drive through each other. Both are left in on purpose, to keep `driveTank` short.

### Maps from the editor

`game.ts` reads every map file in the `maps` folder when the page starts. River Crossing and Sandy Island are copies of the maps in project 18.

To drive on a map you painted yourself, copy its file from `18-editor/maps` into `19-units/maps`. It turns up in the Maps card. The map must be 20 cells by 15, the editor's size.

### How the page finds every map

`game.ts` uses Vite's `import.meta.glob` to collect every JSON file in `maps/`.
Vite parses those files when it builds the project. The page checks each parsed file before it uses the map.

Keep each file valid JSON so Vite can build the project. The check handles JSON data with the wrong shape. The data might be a number, a list, or an object with wrong fields. The page keeps a file only when it has a name, rows of letters, and the right map size.

### Already written for you

- The terrain table and the map functions, from project 18.
- `canDrive`, `speedAt` and `groundAt` in `map.ts`.
- `makeTank` and `parkingSpot` in `units.ts`.
- Telling a click from a drag, and the Escape key.
- Drawing the rings, the corners, the box and the crosses.
- Four of the six tests.

### Finding your mistakes

| What you see | What went wrong |
|---|---|
| No ring appears over any tank | `tankAt` hands back `null` every time. Check that you compare with `TANK_REACH` |
| The ring appears when the mouse is far from any tank | `tankAt` compares `across` and `down` separately, instead of the distance |
| Clicking a second tank leaves the first one picked too | `selectOnly` forgot to let go of every tank first |
| The picked count always says 6 | `selectedTanks` pushed every tank, and forgot the `if` |
| The box works dragging right and down, but not left or up | `boxFrom` used `fromX` as `left` instead of `Math.min`. Run your first test |
| Letting go of a box adds to the picked tanks instead of starting again | `selectInBox` forgot `selectOnly(tanks, null)` first |
| Every tank's cross is on the same spot | `orderMove` forgot `parkingSpot`, or added it to `goalX` only |
| The tanks shake on their goal and never say arrived | `driveTank` always takes a full step, so it jumps past the goal and back |
| The tanks drive into the water | `driveTank` moved the tank before asking `canDrive` |
| The tanks drive the same speed on road and on sand | `driveTank` forgot to multiply by `speedAt` |
| The tanks face the wrong way while they drive | `Math.atan2` takes `down` first, then `across` |
| A test says `expected undefined to be ...` | The function it checks is still empty |

The best bug in this project is the tank that shakes. Without the check for "closer than one step", a tank a little short of its goal jumps a whole step past it. Next frame it jumps back. It keeps doing that for ever, and its row keeps saying driving.

### Try this next

- **Shift-click.** Hold Shift and click a tank to add it to the picked tanks, or take it away. You will need a new function, and a test for it.
- **Pick them all.** Press A to pick every tank. It is one loop.
- **Drag a box on Sandy Island.** Then send the squad to the sand on the far side. Which tanks arrive first, and why?
- **Faster on roads.** Change the road's `speed` in `terrain.ts` to 3. Nothing else changes, and the tanks race along the roads.
- **A new map.** Paint one in the map editor, copy its file into `maps`, and drive on it.

## What comes next

Project 20 is pathfinding. The tanks stop getting stuck. They find a route round the rock and the water, one cell at a time, or find out that no route exists.
