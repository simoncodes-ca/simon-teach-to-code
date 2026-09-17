# Building and production

The harvesters from project 21 are still digging. The credits still climb. This time you can spend them.

A build yard stands beside the refinery. You click what you want, it costs money, it takes time, and then it rolls out: another harvester, a power plant, a barracks, a war factory, a tank.

You write seven functions and two tests. The last one makes the queue move, and after that the yard runs without you.

## The one big idea

**The page shows what your function said. It decides nothing itself.**

`canBuild` looks at one thing in the catalogue and hands back one word: `'ok'`, `'built'`, `'ordered'`, `'locked'`, `'too dear'` or `'busy'`.

That is the whole Build card. Every button that is grey is grey because of that word. Every line of small print under a button is that word written out. Nothing on the page checks a price, and nothing on the page knows what a power plant is.

This is what people mean when they say an interface is **driven by state**. Write the answer once, in one function, and let the page be a window onto it.

The proof is easy to see. Write `canBuild` and five dead buttons wake up at the same moment.

## The other big idea

**A queue is a list you join at the back and leave from the front.**

```text
push    puts a thing on the back
shift   takes the front thing off
```

That is all a queue is, and you met it in project 2, where the lift kept a list of the floors people had asked for. Here it holds the things you have paid for, and the yard works on the front one only.

Two words worth keeping: **first in, first out**. Click a war factory and then a harvester, and the harvester waits eighteen seconds, however much you want it.

## Getting it running

Two terminals, both in this folder, the same as projects 19 to 21.

The first time only:

```bash
npm install
```

Then start these two, one in each terminal:

| Terminal | Command | What it does |
|---|---|---|
| 1 | `npm run dev` | Opens the build yard in the browser, and checks your types |
| 2 | `npm test` | Runs the tests, and runs them again every time you save |

Leave both running while you work.

The ore run works from the moment the page opens. You will have credits to spend before you have written anything.

## Your nine jobs

Seven jobs are functions in `build.ts`. Two jobs are tests in `build.test.ts`. Do them in this order:

| # | File | Your job | What you see afterwards |
|---|---|---|---|
| 1 | `build.ts` | `isBuilt` | Nothing yet. The first test goes green |
| 2 | `build.ts` | `needsMet` | Still nothing. The next test goes green |
| 3 | `build.ts` | `canBuild` | Every button on the Build card wakes up |
| 4 | `build.test.ts` | Test: buying charges exactly the price | A new red test in terminal 2 |
| 5 | `build.ts` | `startBuild` | Clicking buys. The credits drop, and a docket appears |
| 6 | `build.ts` | `buildStep` | The front docket's bar fills up |
| 7 | `build.ts` | `waitTime` | The Ready in well counts down |
| 8 | `build.test.ts` | Test: the queue builds one at a time, in order | Another red test |
| 9 | `build.ts` | `takeFinished` | Things roll out. The yard runs on its own |

Jobs 1 and 2 change nothing on the screen, and that is on purpose. They are small, they are quick, and job 3 pays for all three at once.

The line under the map names the next job, so you always know where you are.

Each job has two hints next to it. The answers to the functions sit at the bottom of `build.ts`. The answers to the tests sit at the bottom of `build.test.ts`.

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
| 7 | 1 error | `5 passed \| 1 todo` |
| 8 | 1 error | `1 failed \| 5 passed` |
| 9 | No errors | `6 passed` |

The failed count goes up at jobs 4 and 8. That is correct, the same as last project.

Job 7 is the only one that leaves the test line alone. `waitTime` has no test of its own, because job 8's test asks it four questions on the way past.

## The files

| File | Its one job | Who writes it |
|---|---|---|
| `numbers.ts` | The sizes, the rates, and the two numbers the yard runs on | Finished |
| `terrain.ts` | Project 18's table of grounds | Finished |
| `map.ts` | The map, and turning cells into pixels and back | Finished |
| `paths.ts` | Your project 20 pathfinder | Finished |
| `units.ts` | Your project 19 and 20 units | Finished |
| `ore.ts` | Your whole project 21 ore run | Finished |
| `catalogue.ts` | The table of things the yard can build | Finished |
| `build.ts` | Prices, prerequisites, the queue, and what rolls out | **You. Seven functions** |
| `build.test.ts` | The tests for `build.ts` | **You. Two tests** |
| `rack.ts` | Everything you read: the cards, the buttons, the bars | Finished |
| `game.ts` | Phaser, the mouse, the yard, and every frame | Finished |
| `maps/` | Project 21's two maps | Finished |

`build.html`, `styles.css`, `package.json`, `tsconfig.json` and `vite.config.ts` are finished too. Never edit them.

`build.ts` imports nothing from Phaser and nothing from the page. That is why the tests can check it without a browser.

## What you will learn

- How one function's answer can drive every button on a page
- Why a disabled button and a reason are better than a click that quietly fails
- How a queue works, and what `push` and `shift` really do
- How prerequisites become a column in a table instead of code
- Why the order of the questions inside a check decides what the page says
- Where money is allowed to move, and why that should be one place

## Good to know

### What you already know

Read `01-calculator/README.md` through `21-resources/README.md` again for the full story.

- A queue is joined at the back and left from the front. The lift in project 2 kept one.
- A table describes content, so the code never has to. Project 18's `terrain.ts` was the first.
- A type like `'ok' | 'busy'` allows only those words. Project 17 named them, project 19 used one for driving.
- A rate times the seconds is how anything grows over time. Projects 7 and 21.
- `Math.min` keeps a number from going past a limit. Project 21 ended three functions with it.
- Arrays have methods that answer a question in one line.
- A test has three steps: make, call, expect. Write it before the function it checks.
- `fullness(part, whole)` is your own, from last project. Every bar here reads it too.

### The catalogue is five lines of data

Open `catalogue.ts`. The whole build chain is there:

| | Cost | Seconds | Needs |
|---|---|---|---|
| Harvester | 400 | 8 | — |
| Power plant | 300 | 6 | — |
| Barracks | 500 | 10 | Power plant |
| War factory | 1000 | 18 | Barracks |
| Tank | 700 | 12 | War factory |

Nowhere in `build.ts`, `rack.ts` or `game.ts` is there a line that says a barracks needs a power plant. There is only a `needs` column, and your `needsMet` reading it.

A sixth thing to build is a sixth line in that table, and no other change anywhere. That is the promise project 18 made about grounds, kept for a different kind of content.

### Two kinds of thing

| | Built | Where it goes |
|---|---|---|
| A **building** | Once | A plot beside the refinery |
| A **unit** | As often as you like | Out of the gate and onto the map |

That difference shows up twice in your code, and both times it is the `kind` column doing the work.

In `canBuild`, only a building can answer `'built'` or `'ordered'`. You can queue three harvesters at once and nobody minds.

In `takeFinished`, only a building goes into `yard.built`. Put a unit in there and the next harvester would say "Built" for ever, and you could never make another one. Job 8's test checks that line on purpose.

### The order of the questions in canBuild

Five questions, and the first one that says yes wins. It is the same shape as `nextJob` last project, but the wrong order does something different here: the button still works, it just tells you a lie.

| If you ask | before | A barracks with 100 credits and no power plant says |
|---|---|---|
| `too dear` | `locked` | "Too dear" — but money was never the problem |
| `locked` | `too dear` | "Needs power plant" — which is the truth |

The same again with a finished power plant and no money. Ask `too dear` first and it says "Too dear", about a thing you already own.

Getting this right costs nothing. Getting it wrong costs an hour of somebody wondering why saving up does not help.

### One place money moves

`startBuild` is the only function in the whole project that changes `refinery.credits`, apart from a harvester tipping ore in.

That is worth doing on purpose. When the credits go wrong, there is one function to read.

It is also why the first line of `startBuild` matters so much:

```text
if (canBuild(yard, key, refinery.credits) !== 'ok') return false;
```

Take that line out and the yard still looks fine, because the buttons are already grey. Then one day something calls `startBuild` another way, and you are buying tanks with no money. Job 4's test is the one that catches it.

### Already written for you

- Your whole project 21 ore run, so the credits climb while you work.
- Your picking, your drag box, your orders and your pathfinder, from projects 19 and 20.
- `makeYard`, which hands back an empty yard.
- `queued`, which says whether something is in the queue right now.
- The Build card drawing itself from your `canBuild`, and the page doing whatever `takeFinished` hands it.
- Four of the six tests.

### Finding your mistakes

| What you see | What went wrong |
|---|---|
| Every button says a dash and stays grey | `canBuild` is still empty |
| A locked thing says "Too dear" | `canBuild` asked about the money before the padlock |
| A power plant you own says "Too dear" | `canBuild` asked about the money before `isBuilt` |
| Nothing ever unlocks, however much you build | `takeFinished` never put the building into `yard.built` |
| You can only ever build one harvester | `takeFinished` put a unit into `yard.built` as well |
| You can queue five power plants | `canBuild` never asked `queued` |
| Clicking takes the money and queues nothing | `startBuild` charged before it checked `canBuild` |
| The credits go down twice for one click | `startBuild` took the cost off more than once |
| The front bar runs past the end of its track | `buildStep` forgot `Math.min` |
| The Ready in well counts up, not down | `waitTime` added `done` instead of taking it away |
| Everything is built the instant you click | `buildStep` added a fixed amount instead of `seconds` |
| The queue fills up and never moves | `takeFinished` is still empty, or it never calls `shift` |
| The same thing rolls out over and over | `takeFinished` handed the key back without taking it off the queue |
| A test says `expected undefined to be ...` | The function it checks is still empty |

The best bug in this project is `takeFinished` that forgets `shift`. Everything looks right for six seconds. Then the power plant finishes, and finishes, and finishes, and the map fills with power plants faster than you can read them.

### The numbers a run makes

Measured in Chrome with the answer key, on Ore Valley, buying whatever was affordable:

| | Units | Ore a minute | Ore left |
|---|---|---|---|
| Start | 3 | — | 3600 |
| After 30 seconds | 4 | 998 | 3000 |
| After 1 minute | 5 | 1097 | 2500 |
| After 1½ minutes | 6 | 1227 | 1385 |

The rate climbs because you spent 400 credits on something that earns more than 400 credits. That is the whole point of the first thing on the list, and it is worth watching happen.

The field does run out. Ore that grows back is in "try this next".

### What a tank is for

Nothing, yet. A tank drives, you can pick it, box it and send it, and that is all it does.

That is honest rather than unfinished. Something for it to shoot at is project 23, and giving it one now would mean building target selection early and badly.

## Try this next

- **A sixth line.** Add something to `catalogue.ts` — a repair bay, a radar, a second kind of harvester. One line, and the card draws itself.
- **Cancel an order.** Right-click a docket, take it off the queue, and give the credits back. Careful: how much do you give back for one that is half built?
- **A price that climbs.** Make each harvester cost a little more than the one before. `canBuild` would need to ask how many you have.
- **A second queue.** Buildings in one, units in the other, both building at once. Two `yard.queue`s, and `buildStep` called twice.
- **A tank that follows.** Pick a tank, click a harvester, and have it drive to wherever that harvester is, over and over.

## What comes next

Project 23 is the enemy. Tanks that choose a target, patrol a route, and attack when something comes close. Your pathfinder from project 20 does the driving, and your tanks finally have a reason to exist.
