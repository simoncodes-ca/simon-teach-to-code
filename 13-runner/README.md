# Rooftop Run

You are a courier running across the city rooftops at sunset. You never stop, and you never slow down. All you can do is jump.

Crates, vents and stacked boxes are in the way, and they keep coming. Touch one and the run is over.

Two things here are new, and they are both big.

## The first big idea

**A world with no end is made a little at a time, just out of sight.**

The cave in project 12 was written down. Eighteen rows of 72 characters, typed out by hand, with an end you could fly to.

This game has no map. There is nothing to write down, because the run never finishes. So the rooftops in front of you do not exist until a moment before you get there.

`growTheWorld` is where that happens, and it runs once every frame:

```text
is the last obstacle still a whole window ahead of me?
    yes  ->  do nothing at all
    no   ->  put one more down, a gap further along
```

One obstacle a frame sounds slow. Frames go past sixty times a second, so it is not. The wiring also calls it forty times before a run starts, which fills the first screen before you ever see it.

The gap and the obstacle are two more of your functions. `nextGap` says how far along, and `pickObstacle` says what. `growTheWorld` puts the two together, which is why it comes after both of them.

## The second big idea

**A game that never ends has to forget.**

Every obstacle you run past is still in the `obstacles` list. You can never jump it again, touch it again, or see it again, and it is still there.

Watch **Obstacles in memory** on the rack while you play without writing `forgetOldObstacles`. It climbs and never comes down. In one test run it had reached 25 by 460 metres, and it was still going up. The screen was showing two of them.

`forgetOldObstacles` throws away anything that is behind the window. Then the number settles at about four, and **behind** underneath it stays at zero or one.

This is the half of the idea that gets left out, because leaving it out costs nothing you can see. That is exactly why the rack counts it out loud.

## The third thing, which you will want anyway

**Your best score is still there tomorrow.**

Every program you have written so far forgets everything the moment you close the page. The calculator's list of sums, the vault's score, the cave's crystals: all gone.

`localStorage` is a small notebook the browser keeps for each page. It holds text, and only text:

```js
localStorage.setItem('name', 'some text');   // writes it down
localStorage.getItem('name');                // reads it back
```

Our record is not text. It is an object with two things in it:

```js
{ best: 812, runs: 14 }
```

`JSON.stringify` turns that object into text, and `JSON.parse` turns the text back into the object. JSON is how programs write objects down, and how they send them to each other. Project 15 uses it again, to talk to a server.

Beat your best, then press refresh. The score is still there.

## The four files

| File | What it does | Who writes it |
|---|---|---|
| `runner.html` | Builds the page: the handheld, the plate, the rack, the keys | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `phaser.min.js` | The library. The same copy as projects 9 to 12 | Never edit this |
| `runner.js` | The speed, the jump, the world, and the saved record | You |

Double-click `runner.html` to open it. Change `runner.js`, save the file, then refresh the browser page.

Eight functions in `runner.js` are marked `// TODO`. Write them in file order, from the top down. Each one gives you two hints. All the answers sit in one block at the very bottom of the file.

Press Start. Nothing moves, and the line under the screen says which function to write first.

## What you will learn

- How a game builds a world that nobody wrote down
- Why a game with no end has to throw things away
- How a difficulty curve can be a formula instead of a plan
- How to save something so it lives through closing the page
- What JSON is for

## Good to know

### What you already know

These all work the same way here. Read `01-calculator/README.md` through `12-cave/README.md` again for the full story.

- Everything moves by `speed × seconds`, never by a fixed number of pixels per frame.
- Gravity is one line that adds to `vy`.
- A loop that takes things out of a list counts backwards.
- A key is a state, so you ask about it on every frame.
- `Math.min` puts a lid on a number, and `Math.max` puts a floor under it.
- `Math.random()` gives a number from 0 up to 1.
- A moving thing is a plain object: `{ kind, x, y, w, h }`.
- x and y are the middle of a sprite.
- Two boxes touch when they overlap across and up and down.
- A world is bigger than the window, and the camera decides which part you see.

Some things arrive already written this time. Gravity and the roof under the runner's feet are given, because projects 7 and 12 made you write them. The rule for two boxes touching is given, because project 8 made you write that.

### Phaser's camera, at last

Project 12 made you write this for every rock in the cave:

```js
screen position = world position - camera position
```

Phaser has a camera that does that subtraction for every sprite, for free. Project 12 left it alone on purpose. Now that you have written it yourself, you are allowed to use it, and `toScreen` is nowhere in this file. One line of given wiring replaces the whole of it:

```js
aScene.cameras.main.setScroll(runner.x - RUNNER_SCREEN_X, 0);
```

The buildings behind the runner are the other thing project 12 suggested you try. The far row slides a quarter as fast as the rooftop, and the near row half as fast. Far things look slower than near things, and that is what makes the city look deep. It is given wiring here, three lines in `drawWorld`.

### Measure a gap in seconds, not in pixels

This is the trap in the whole project, and it is worth walking into once.

A gap of 500 pixels is a comfortable jump at the start of a run. The runner is doing 300 pixels a second, so 500 pixels is about a second and a half of running.

By the end of a run he is doing 700. The same 500 pixels is now three quarters of a second, and he lands on top of the crate.

So `nextGap` works out how many **seconds** of running the gap should be, and turns that into pixels using `runSpeed`. It is `speed × seconds` again, used to build the world instead of to move something through it.

### The difficulty curve is two numbers

Nobody wrote a plan for how hard this game gets. Two formulas do all of it.

`runSpeed` adds 0.01 for every pixel you have run, and stops at 700. That looks far too small to matter. After 10000 pixels it has added 100 pixels a second.

`nextGap` takes a little off the gap for every pixel you have run, and stops at a second. Faster, and closer together, at the same time.

There is a third one you do not write. Look at `KINDS` near the top of the file. Each kind of obstacle has a `from`, which is how many metres into a run it starts turning up. Crates from the start, vents from 250 metres, stacks from 600. Change a number there and the game changes, and no other line moves.

### Already written for you

Section 3 of `runner.js` is finished, the same as in the twelve projects before it.

- The Phaser settings, and the pictures.
- The sky, the two rows of buildings and the rooftop, and the parallax that slides them.
- Gravity, and standing the runner back on the roof when he lands.
- The camera, which is one line now.
- `addObstacle` and `removeObstacle`, which make and destroy the pictures.
- `kindsAllowed`, which says which kinds of obstacle have started turning up.
- `hitsRunner`, the rule for two boxes touching, from project 8.
- `whereTheWindowStarts` and `whereTheWindowEnds`, the two edges of the window in world pixels.
- The dust at a take-off and a landing, the crash, and the card at the end of a run.
- The whole rack, which shows your own functions back to you.

You can also add `#demo` or `#demo-over` to the end of the address in the browser, the same as in projects 8 to 12. `#demo` is the finished game, playable, 400 metres in. `#demo-over` is the card at the end of a run. Both fill your empty functions with answers of their own, so a demo tells you nothing about the code you wrote. Neither one ever touches your real best score.

### Finding your mistakes

The line under the screen names the empty function. Read it first.

| What you see | The function to check |
|---|---|
| The runner runs on the spot and nothing scrolls | `runSpeed` |
| The jump key does nothing | `startJump` |
| Gap on the rack stays a dash | `nextGap` |
| Kind on the rack stays a dash | `pickObstacle` |
| The rooftops are bare | `growTheWorld` |
| Obstacles in memory climbs for ever | `forgetOldObstacles` |
| Best on the plate stays a dash | `loadRecord` |
| Your best score is gone after a refresh | `saveRecord` |
| You can jump again in mid air, for ever | `startJump` again |
| The obstacles get impossible, all at once | `nextGap` again |
| Obstacles appear on top of each other | `growTheWorld` again |
| The rooftops go bare after a few seconds | `forgetOldObstacles` again |

The last four are the good bugs of this project.

A runner who jumps in mid air has a `startJump` with no rule about `runner.onRoof`. Leave it that way for one run on purpose. It is the clearest possible proof of what that one `if` is for.

Obstacles that get impossible all at once is a `nextGap` measured in pixels. Read "Measure a gap in seconds, not in pixels" again.

Obstacles on top of each other means `builtTo` never moved along. `growTheWorld` has to add the gap to `builtTo` before it puts the obstacle down, not after.

Rooftops that go bare is `forgetOldObstacles` throwing away too much. Check the direction of the `<`. Everything **behind** the window goes, and everything ahead of it stays.

You can also print the numbers:

```js
console.log(distance, runSpeed(distance), builtTo, obstacles.length);
console.log(localStorage.getItem(RECORD_KEY));
```

### If the best score will not save

A few browsers refuse to let a page opened by double-clicking save anything. That is a rule of the browser, not a mistake of yours, and the Saved record panel says so when it happens.

Everything else in the game works. Only the record stops living through a refresh.

### Try this next

- **A fourth kind of obstacle.** Add one line to `KINDS`, and draw it in `assets/`. Nothing else changes. That is what a table of content is for.
- **Night falls as you run.** Fade the sky towards dark blue as the metres go up, and turn the windows in the city brighter.
- **A double jump.** Allow one more jump while the runner is in the air, then no more until his feet touch the roof. Count them.
- **A mark where your best run ended.** Your record already knows the number of metres. Draw a line on the rooftop there, and try to run past your own ghost.
- **Three lives.** A crash costs a life instead of ending the run, and the runner starts again a little further back.

## What comes next

Project 14 does not add a game. It takes one you have already written and splits it into several files.

Every project up to here has been one JavaScript file. That stops working when a file gets big, and you will have noticed this one is the longest yet.

You will also learn git, which is how a program remembers every version of itself. You have been working inside a git repository for thirteen projects without hearing about it.
