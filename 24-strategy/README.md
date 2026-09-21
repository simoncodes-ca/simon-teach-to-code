# The small strategy game

This is the last project. It is the game the whole list was heading for.

You have a refinery, a build yard and a corner of the map. So has an enemy, and its corner works exactly like yours. Its harvesters dig, its yard builds, and its tanks come for you.

Wreck the enemy refinery to win. Lose yours and you have lost.

Everything on the map is work you have already done. The harvesters are project 21. The yard is project 22. The tanks are project 23. The routes they drive are project 20.

What you write this time is the enemy's commander. Seven functions and two tests.

## The one big idea

**A plan is a list, and a commander walks it.**

Open `catalogue.ts` and look at `RED_PLAN`. Ten lines, in order, and each line says "keep buying this until you have this many".

```text
{ key: 'harvester', upTo: 3 }
{ key: 'power', upTo: 1 }
{ key: 'harvester', upTo: 4 }
{ key: 'barracks', upTo: 1 }
...
```

Your `wantNext` reads that list from the top and hands back the first line the enemy has not finished. Nothing else in the project decides what the enemy buys.

Move a line in that list and the enemy plays a different game. No code changes.

## The other big idea

**Saving up beats buying something cheaper.**

Your `spendStep` asks `wantNext` what the enemy wants, and then asks project 22's `canBuild` about it. If the answer is anything but `'ok'`, it buys nothing.

That sounds lazy. It is the most important line in the file.

A war factory costs 1000 and a harvester costs 400. A commander that spends whatever it has in its pocket buys harvester after harvester, because a harvester is always the affordable one. It ends up with nine harvesters and no army.

Doing nothing on purpose is what gets the factory built. Job 4's test is about exactly that.

## The third idea, and it costs nothing

**A refinery is a unit.**

It sits in the `units` list with the tanks and the harvesters. It has a lot of health, it never drives, and it never fires. That is the whole difference.

Because it is in that list, project 23's `nearestTarget` finds it and project 23's `shootStep` damages it. Neither function changed by one character.

That is project 8's lesson, met for the last time. Every moving thing is the same shape of object, so one set of functions moves all of them. Here a thing that never moves joins the same list, and every function that reads the list gets it free.

It is also where your win condition comes from. `whoWon` counts refineries.

## Getting it running

Two terminals, both in this folder, the same as projects 19 to 23.

The first time only:

```bash
npm install
```

Then start these two, one in each terminal:

| Terminal | Command | What it does |
|---|---|---|
| 1 | `npm run dev` | Opens the war room in the browser, and checks your types |
| 2 | `npm test` | Runs the tests, and runs them again every time you save |

Leave both running while you work.

**Your half of the game works from the first minute.** Your harvesters dig and the Build card spends what they bring home, whatever is still empty in `commander.ts`. So you can play while you write.

## Your nine jobs

Seven jobs are functions in `commander.ts`. Two jobs are tests in `commander.test.ts`. Do them in this order.

| # | File | Your job | What you see afterwards |
|---|---|---|---|
| 1 | `commander.ts` | `countKind` | The Forces card fills in, both columns |
| 2 | `commander.ts` | `armyStrength` | Two strength bars under it |
| 3 | `commander.ts` | `wantNext` | The Enemy card names what it is saving for |
| 4 | `commander.test.ts` | Test: it saves up instead of buying something cheaper | A new red test in terminal 2 |
| 5 | `commander.ts` | `spendStep` | The enemy starts spending. Its corner grows |
| 6 | `commander.ts` | `wantsAttack` | Its orders flip between `massing` and `attack` |
| 7 | `commander.ts` | `attackOrders` | The first wave rolls out |
| 8 | `commander.test.ts` | Test: a game is over when a refinery is gone | Another red test |
| 9 | `commander.ts` | `whoWon` | The game can end |

Job 5 is the one to wait for. Before it, the enemy corner is three harvesters and a shed. After it, the enemy plays the same game you are playing, out of the same table of things to build.

The line under the map names the next job, so you always know where you are.

Each job has two hints next to it. The answers to the functions sit at the bottom of `commander.ts`. The answers to the tests sit at the bottom of `commander.test.ts`.

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

The failed count goes up at jobs 4 and 8. That is correct, the same as the last three projects.

Job 7 is the only one that leaves the test line alone. `attackOrders` has no test of its own. It changes the map instead.

## The files

Twelve source files, and eleven of them are finished. The thirteenth is your test file.

| File | Its one job | Who writes it |
|---|---|---|
| `numbers.ts` | Every number the game runs on | Finished |
| `terrain.ts` | Project 21's table of grounds, with one number changed | Finished |
| `map.ts` | The map, and turning cells into pixels and back | Finished |
| `paths.ts` | Your project 20 pathfinder | Finished |
| `catalogue.ts` | The things a yard can build, and the enemy's plan | Finished |
| `units.ts` | Harvesters, infantry, tanks and refineries | Finished |
| `ore.ts` | Your project 21 ore run | Finished |
| `build.ts` | Your project 22 build yard | Finished |
| `enemy.ts` | Your project 23 tank brain | Finished |
| `commander.ts` | The brain above it: money, plans, waves, winning | **You. Seven functions** |
| `commander.test.ts` | The tests for `commander.ts` | **You. Two tests** |
| `rack.ts` | Everything you read on the page | Finished |
| `game.ts` | Phaser, the mouse, both sides, and every frame | Finished |
| `maps/` | Two new maps, built to be fair | Finished |

`strategy.html`, `styles.css`, `package.json`, `tsconfig.json` and `vite.config.ts` are finished too. Never edit them.

`commander.ts` imports nothing from Phaser and nothing from the page. That is why the tests can check it without a browser.

## What you will learn

- How an opponent that spends money is built out of a list and four questions
- Why saving up is a decision, and why spending everything is a mistake
- How one number in a plan changes a whole game
- Why a thing that never moves still belongs in the list of things that do
- How a game decides that it is over
- Why counting only the living matters when you are deciding to attack

## Good to know

### What you already know

Read `01-calculator/README.md` through `23-enemy/README.md` again for the full story.

- A fixed order of questions is how a thing decides what to do. Projects 21, 22 and 23 all end in one.
- Content belongs in a table, not in code. Project 18 said it about ground, project 22 about things to build.
- `canBuild` hands back one word about one line of the catalogue. You wrote it in project 22.
- `nextJob` runs a harvester for ever. You wrote it in project 21.
- `nextMode` runs a tank. You wrote it in project 23.
- `findRoute` finds a way round rock and water. You wrote it in project 20.
- `includes`, `push`, `shift` and `slice` are all list methods you have used since project 3.
- A test has three steps: make, call, expect. Write it before the function it checks.

### The three numbers the commander thinks with

Open `numbers.ts`. These are the ones worth playing with once the game works.

| | Value | What it means |
|---|---|---|
| `ATTACK_FORCE` | 4 | Things with guns it wants before it will attack at all |
| `ATTACK_EDGE` | 1.2 | How much stronger than you it wants to be |
| `GUARDS` | 1 | Fighters it keeps at home whatever happens |

`ATTACK_FORCE` is the clock on the whole game. At 2 the first wave is three riflemen a minute in, long before you can have a war factory. At 6 you get so long that the enemy never catches up.

It counts guns and not tanks, so three riflemen are a wave. That is `armed` doing the deciding, in `armyStrength` and in `attackOrders`, and it is why neither of those two functions ever names a tank.

`ATTACK_EDGE` is its nerve. At 1 it attacks an even fight and trades its tanks away two at a time. At 2 it waits for a war it will never get, because you are building tanks as fast as it is.

### The head start

`HEAD_START` is 30. The enemy does nothing for the first thirty seconds of a map: no digging, no buying, no orders. Its harvesters stand by its refinery and wait, and yours have the field to themselves.

That is there because the commander is quicker than you are and always will be. It never misclicks, never leaves a tank in a corner, and never has to read the Build card to remember what a war factory costs. Thirty seconds is about two loads of ore and a power plant — enough to get your hand in. Put it to 0 for the fight without it, and up if you are practising an opening.

It is the honest dial, and two things had to be measured before it worked.

`THINK_EVERY` is how often the commander decides, and turning it from 1 up to 3 moved its win by three seconds. It is waiting for credits, not for its next think, so a slow thinker with money is not slow.

Then letting its harvesters dig through the head start moved its win by thirteen seconds instead of the whole of it, because it banked every credit and spent the lot the moment it woke. A sleeping side has to stop mining too, or it is not asleep. That is the line in `takeNextJob` that checks `asleep`.

### Both maps are fair, and here is how

Turn either map through half a turn and you get the same map back. Your corner and the enemy's hold the same ground, the same ore and the same room to build.

That matters more than it sounds. If one corner has more ore, every result you measure is about the corner and not about your commander.

Measured with the stubs still empty, so neither side spends anything. Both refineries held the same number of credits at twenty, thirty, forty and sixty seconds: 1199, 1499, 1799 and 2400. Two runs, the same eight numbers.

A reading taken mid-second can differ by one load, because one harvester tips its load in a moment before the other.

### How a game actually goes

Measured in Chrome with the answer key, on Twin Yards.

**Nobody plays blue.** The enemy sat still for its thirty-second head start, then bought a fourth harvester, a power plant, a barracks, two riflemen to watch its ore, a war factory and two tanks. Then it marched with everything but one guard and wrecked the undefended refinery. The game ended at 2 minutes 54 seconds with `You lost`. With `HEAD_START` at 0 the same run ends at 2 minutes 17 seconds, which is what that dial is worth.

**Blue feeds its army in a few at a time.** Measured with `HEAD_START` at 0, played by a script on the enemy's own plan, sending whatever it had as soon as it had four: the first three died at the enemy's corner, the second wave died on its way, and the refinery fell at 2 minutes 30 seconds. Aiming the waves at the enemy ore field instead made no difference, because the waves were too small to get there.

That is the game in one sentence: **a wave of four is not a wave.** Riflemen are 200 credits and four seconds, so the cheapest way to make a wave big enough is to build some.

**A rifleman rush.** Measured with `HEAD_START` at 0 as well. A barracks, no war factory, and everything spent on infantry: seven of them reached the enemy corner at about a minute. The two riflemen the enemy keeps at home held them long enough for its first tank to roll out, and the game ended at 5 minutes 15 seconds with `You lost`. Move the two infantry lines of `RED_PLAN` down below the war factory and the enemy has nothing at all at home when that rush arrives. The plan is the whole difference, and it is twelve lines of data.

### The order of the questions in spendStep

Three questions, and the second one is the whole lesson.

| Ask | Then |
|---|---|
| What does the plan want? | `null` means the plan is finished |
| What does `canBuild` say about it? | Anything but `'ok'`, and buy nothing |
| Otherwise | Buy it, and say what you bought |

A commander that skips the second question and buys the cheapest thing it can afford looks busy for four minutes and never builds an army. Nothing on the screen tells you that is what happened. The Enemy card says `Saving for: War factory` the whole time, because `wantNext` is right. Only the credits give it away, and they never climb.

### Where the enemy's corner comes from

No map file mentions the enemy. `numbers.ts` holds two cells, `BLUE_BASE` and `RED_BASE`, and `game.ts` slides each one onto ground a unit can drive on. The building plots are the free cells nearest each refinery, and the guard's beat is a square round it.

So any map works. Paint one in project 18's editor, copy the file into `maps/`, and both sides turn up on it. Make it symmetrical if you want it fair.

### Already written for you

- Your ore run, your yard, your pathfinder and your tank brain, copied from the answer keys of projects 20 to 23.
- `howMany`, which turns a catalogue key into a count. It asks your `countKind` about units and project 22's `isBuilt` about buildings, and it counts what is already on order as well. A rifleman takes four seconds, so a plan line for two would buy several if the queue did not count.
- `foeOf`, which hands you the other side. `foeOf('red')` is `'blue'`.
- `wrecked` and `armed`, from project 23.
- `runCommander` in `game.ts`, which calls your functions every few seconds and hands the marching units their routes.
- Four of the six tests.

### Finding your mistakes

| What you see | What went wrong |
|---|---|
| Every number on the Forces card is a dash | `countKind` is still empty |
| A wrecked tank is still counted | `countKind` did not skip the wrecks |
| Both columns show the same number | `countKind` ignored the side it was given |
| The strength bars stay flat | `armyStrength` is still empty |
| Strength counts harvesters | `armyStrength` did not ask `armed` |
| Infantry are worth nothing, however many there are | `armyStrength` asked for `'tank'` instead of asking `armed` |
| The enemy's riflemen stay at home while its tanks march | `attackOrders` asked for `'tank'` instead of asking `armed` |
| Saving for never changes | `wantNext` handed back the first line every time, instead of the first unfinished one |
| Saving for says `nothing` straight away | `wantNext` compared the wrong way round, so every line looked finished |
| The enemy buys harvesters for ever and never a factory | `spendStep` looked for something it could afford instead of obeying the plan |
| The enemy spends credits it has not got | `spendStep` never asked `canBuild` |
| The enemy builds nothing at all | `spendStep` is still empty, or `wantNext` handed back `null` |
| Orders never says `attack` | `wantsAttack` compared strength the wrong way round |
| The enemy attacks with one tank and loses it | `wantsAttack` never checked `ATTACK_FORCE` |
| Its whole army leaves home and its refinery falls to one tank | `attackOrders` forgot the guards |
| Nothing marches | `attackOrders` is still empty, or it handed back an empty list |
| A fight that wrecks both refineries says you won | `whoWon` only looked at the enemy's |
| Losing your last tank ends the game | `whoWon` counted tanks instead of refineries |
| A test says `expected undefined to be ...` | The function it checks is still empty |

The best bug in this project is the first `spendStep` one. Everything works. The Forces card is right, the plan is right, the Enemy card says exactly what the enemy wants. The enemy just never gets an army, and the only clue is a credit counter that never climbs.

## Try this next

- **Move a line in `RED_PLAN`.** Put the war factory before the extra harvesters and see whether an early army beats a bigger mine.
- **An infantry rush.** Move the two infantry lines up above the war factory. The enemy then has three guns a minute into the game, long before you can have one tank. Play against it and see whether you can hold.
- **A second plan.** Write a `RUSH_PLAN` with no harvesters in it at all, and let the enemy pick one at random when a map starts.
- **A leash.** Project 23 offered this and it still applies. A chasing tank that gets too far from home drives back.
- **Defend the harvesters.** The enemy never guards its ore field, which is why starving it works. Give `attackOrders` a second job.
- **A win by wiping out.** Add a second way to win: a side with no units and no credits has lost, even with its refinery standing.
- **Your own map.** Paint one in project 18's editor. Turn it half round on paper first and check both corners match.

## What comes next

Nothing comes next. This was the last project.

You started with a calculator that added two numbers when you clicked a button. You have finished with a strategy game: a map painted in your own editor, two armies, an ore economy, a build queue, tanks that find their way round rock, and an opponent that saves up and picks its moment.

Every function in it is one you wrote.

Go and play it. Then break it, and fix it, and make it yours.
