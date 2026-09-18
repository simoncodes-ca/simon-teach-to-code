# Enemy AI

Three red tanks guard a map. You have four blue ones.

The red tanks walk a beat. When one of them spots a tank of yours, it turns, works out a route round the rock, drives until it is close enough, stops, and opens fire. Lose it and it goes back to its beat.

You write the brain that does all of that. Seven functions and two tests.

## The one big idea

**A brain is a list of questions, asked in a fixed order.**

`nextMode` is five lines long. It asks five questions about one tank and hands back one word: `'dead'`, `'attacking'`, `'chasing'` or `'patrolling'`.

That word is the whole of the enemy. The page reads it and does the one thing it means. Nothing else in the project decides anything.

Nobody wrote "hunt the player". Five questions, asked sixty times a second, look exactly like hunting.

## The other big idea

**A gun does not reach as far as an eye does.**

```text
SEE_RANGE   250 pixels.  Closer than this and a tank has spotted you
GUN_RANGE   130 pixels.  Closer than this and it can hit you
```

Those two numbers are why a red tank has anything to do. It has seen you, and it cannot shoot you yet. So it drives.

They are also the trap. Anybody close enough to shoot is also close enough to see, every time. Ask about seeing before shooting and the red tanks chase you for ever without firing once. Job 9 has the whole story.

## Getting it running

Two terminals, both in this folder, the same as projects 19 to 22.

The first time only:

```bash
npm install
```

Then start these two, one in each terminal:

| Terminal | Command | What it does |
|---|---|---|
| 1 | `npm run dev` | Opens the forward post in the browser, and checks your types |
| 2 | `npm test` | Runs the tests, and runs them again every time you save |

Leave both running while you work.

## Your nine jobs

Seven jobs are functions in `enemy.ts`. Two jobs are tests in `enemy.test.ts`. Do them in this order.

| # | File | Your job | What you see afterwards |
|---|---|---|---|
| 1 | `enemy.ts` | `farApart` | A measuring line to every red tank, with the distance on it |
| 2 | `enemy.ts` | `inRange` | Two rings on each red tank, and they light up |
| 3 | `enemy.ts` | `nearestTarget` | A thread to whoever each tank has picked |
| 4 | `enemy.ts` | `aimAt` | Every turret swings round and tracks |
| 5 | `enemy.test.ts` | Test: a shot takes exactly the damage it should | A new red test in terminal 2 |
| 6 | `enemy.ts` | `shootStep` | The guns go off. Health bars fall |
| 7 | `enemy.ts` | `nextPost` | The red tanks get up and walk their beats |
| 8 | `enemy.test.ts` | Test: the questions in `nextMode`, asked in order | Another red test |
| 9 | `enemy.ts` | `nextMode` | They come for you |

Job 1 is the one to notice. It is three lines of Pythagoras, and every job after it is measured with the ruler it makes.

The line under the map names the next job, so you always know where you are.

Each job has two hints next to it. The answers to the functions sit at the bottom of `enemy.ts`. The answers to the tests sit at the bottom of `enemy.test.ts`.

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

The failed count goes up at jobs 5 and 8. That is correct, the same as the last two projects.

Job 7 is the only one that leaves the test line alone. `nextPost` has no test of its own. It changes the map instead, and it changes it more than any other job.

## The files

| File | Its one job | Who writes it |
|---|---|---|
| `numbers.ts` | The sizes, the speeds, and the five numbers a fight runs on | Finished |
| `terrain.ts` | Project 21's table of grounds, unchanged | Finished |
| `map.ts` | The map, and turning cells into pixels and back | Finished |
| `paths.ts` | Your project 20 pathfinder | Finished |
| `units.ts` | Your project 19 and 20 units, with five fields added | Finished |
| `enemy.ts` | Looking, aiming, firing, patrolling, and deciding | **You. Seven functions** |
| `enemy.test.ts` | The tests for `enemy.ts` | **You. Two tests** |
| `rack.ts` | Everything you read: the two rosters, the wells, the bars | Finished |
| `game.ts` | Phaser, the mouse, the tanks, and every frame | Finished |
| `maps/` | Two new maps, made for a fight | Finished |

`enemy.html`, `styles.css`, `package.json`, `tsconfig.json` and `vite.config.ts` are finished too. Never edit them.

`enemy.ts` imports nothing from Phaser and nothing from the page. That is why the tests can check it without a browser.

## What you will learn

- How a short list of questions turns into behaviour that looks planned
- Why the order of those questions decides what a tank does
- What a distance check is, and how many things it can answer
- Why seeing further than you can shoot is what gives an enemy a job
- How to point one thing at another with `Math.atan2`
- Why a gun needs a reload, and where that number lives
- How `%` turns a list into a ring that never ends

## Good to know

### What you already know

Read `01-calculator/README.md` through `22-production/README.md` again for the full story.

- A fixed order of questions is how a thing decides what to do. Project 21's `nextJob` and project 22's `canBuild` are both this shape.
- A type like `'ok' | 'busy'` allows only those words. Project 17 named them.
- Pythagoras gives the distance between two points. Projects 7 and 19 both used it.
- `Math.atan2(down, across)` gives the angle from one point to another. Project 16's tanks drove along one.
- `Math.max` and `Math.min` hold a number inside a limit. Project 21 ended three functions that way.
- `%` wraps a number round. Project 4 dealt cards with it.
- `findRoute` finds a way round rock and water. You wrote it in project 20, and it is given here.
- A test has three steps: make, call, expect. Write it before the function it checks.

### The five numbers a fight runs on

Open `numbers.ts`. Every one of them is a number you can change.

| | Value | What it means |
|---|---|---|
| `SEE_RANGE` | 250 | Spot somebody this close or closer |
| `GUN_RANGE` | 130 | Hit somebody this close or closer |
| `MAX_HEALTH` | 100 | How much damage a tank takes before it is wrecked |
| `SHOT_DAMAGE` | 9 | How much one shot takes off |
| `RELOAD` | 0.7 | Seconds between shots |

Those last three decide how long a fight lasts. 100 health at 9 damage a shot is 12 shots. At 0.7 seconds a shot, that is 7.7 seconds of somebody shooting at you without a break.

So a tank in trouble has about eight seconds to drive out of range. That is long enough to notice and act, and short enough to matter.

### Both sides use the same seven functions

`runTank` in `game.ts` is worth opening. It is nine lines, and it is the same nine lines for a red tank and a blue one.

```text
pick a target        your nearestTarget
decide a mode        your nextMode
point the gun        your aimAt
fire                 your shootStep
drive                only if it is red
```

A blue tank and a red tank are the same shape of object, so one set of functions moves both. That is project 8's lesson about sprites, met again.

The sides differ in one line only. A red tank drives itself where `nextMode` says. A blue tank goes where you sent it, and nowhere else. Both sides shoot at whatever comes close.

### The order of the questions in nextMode

Five questions, and the first one that says yes wins.

| Ask | Answer |
|---|---|
| Is it wrecked? | `'dead'` |
| Is there nobody to pick? | `'patrolling'` |
| Is the target inside `GUN_RANGE`? | `'attacking'` |
| Is the target inside `SEE_RANGE`? | `'chasing'` |
| Otherwise | `'patrolling'` |

Swap the middle two and nothing crashes. The guns simply never go off.

Here is why. `GUN_RANGE` is 130 and `SEE_RANGE` is 250, so a tank 100 pixels away is inside both. Ask about seeing first and the answer is `'chasing'`, so the red tank drives instead of shooting. It gets closer. The answer is still `'chasing'`. It drives right through you and out the other side.

Job 8's test is the one that catches it, which is why you write that test first.

Project 21's `nextJob` and project 22's `canBuild` had the same trap. Three projects in a row, because this is the mistake that costs the most and shows the least.

### Where the posts and the beats come from

No map file mentions a red tank. `numbers.ts` holds three posts as fractions of the map, and `game.ts` slides each one onto ground a tank can drive on.

A beat is the four corners of a square round a post, slid the same way. `BEAT` is 3, so each corner is three cells out.

That means any map works. Paint one in project 18's editor, copy the file into `maps/`, and three red tanks turn up on it with beats of their own.

### Already written for you

- Your picking, your drag box, your orders and your pathfinder, from projects 19 and 20.
- `wrecked`, which says whether a tank has reached 0 health.
- `otherSide`, which hands your functions the list of tanks on the other side. Your `nearestTarget` never has to ask whose side anybody is on.
- The two rosters, drawn from the word your `nextMode` handed back.
- Four of the six tests.

### Finding your mistakes

| What you see | What went wrong |
|---|---|
| Every well and every tag says a dash | `farApart` is still empty |
| The rings never light up | `inRange` compared the wrong way round |
| Every gun points east and stays there | `aimAt` is still empty |
| A gun points the wrong way by a quarter turn | `aimAt` gave `Math.atan2` the two numbers the wrong way round |
| A tank shoots at a burnt-out wreck for ever | `nearestTarget` did not skip the wrecks |
| A tank picks the furthest enemy, not the closest | `nearestTarget` used `>` where it needed `<` |
| The guns fire once and never again | `shootStep` never set the reload back to `RELOAD` |
| Every tank is wrecked in a fraction of a second | `shootStep` fired every frame, because it forgot the reload |
| A health bar draws off the wrong end of its track | `shootStep` forgot `Math.max`, so health went below 0 |
| A tank shoots something on the far side of the map | `shootStep` never checked `GUN_RANGE` |
| The red tanks stand still for ever | `nextPost` is still empty |
| A red tank walks to one corner and stops | `nextPost` forgot `%`, so `beatAt` ran off the end of the list |
| The red tanks drive at you and never fire | `nextMode` asked about `SEE_RANGE` before `GUN_RANGE` |
| A wreck goes on shooting | `nextMode` asked about the wreck last instead of first |
| The red tanks ignore you completely | `nextMode` is still empty, or it always says `'patrolling'` |
| A test says `expected undefined to be ...` | The function it checks is still empty |

The best bug in this project is the one in `nextMode`. Everything works. Every ring lights up, every turret tracks, every red tank comes straight for you. It just never fires, and there is nothing on the screen to tell you why.

### Two fights, measured

Measured in Chrome with the answer key, on Crossroads. Both fights started by sending tanks at the middle post.

**All four tanks at once.** Red lost all three in 25 seconds. You lost one. 64 shots.

| | Blue | Red | Wrecks |
|---|---|---|---|
| Start | 4 | 3 | 0 |
| 10 seconds | 4 | 2 | 1 |
| 20 seconds | 3 | 1 | 3 |
| 25 seconds | 3 | 0 | 4 |

**One tank alone.** It killed one red tank and died doing it. Then the fight stopped.

The other two red tanks had come part of the way, lost sight of everybody, and gone back to their beats. Nobody wrote "give up and go home". It is what `'patrolling'` means when `nearestTarget` is a long way off.

## Try this next

- **A leash.** A red tank that chases too far from its post drives back to it. That is a fifth question in `nextMode`, and it changes the whole feel of the map.
- **Shoot at the weakest.** `nearestTarget` takes the closest. Make a second one that takes the one with the least health left, and see which wins.
- **A sniper.** Give one red tank a bigger `GUN_RANGE` and a slower `RELOAD`. The numbers are in `numbers.ts`, but only one of them is per tank so far.
- **Call for help.** A red tank that starts shooting tells the other two where you are. One line, and the map gets much harder.
- **Your own map.** Paint one in project 18's editor and drop the file into `maps/`. Build a corner the red tanks cannot get round.

## What comes next

Project 24 is the last one. It puts every piece together: one map, two teams, two kinds of unit, ore, a build queue, and something to win.

You have written all of it already. Project 24 is where it becomes one game.
