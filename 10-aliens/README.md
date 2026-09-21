# Alien Raid

An arcade cabinet in a dark room. A swarm of aliens marches down the screen. You fly along the deck and shoot up at them.

This is the first **new** game you build on Phaser. Project 9 was a game you had already written, done again with a library. This one has nothing to compare it with.

Two things in it are new. You use the keyboard instead of the mouse. And the enemies move as one block, not as a crowd of separate things.

## The one big idea

**The swarm is one thing, not twenty-four things.**

Every enemy you have written so far moved on its own. A balloon rose at its own speed. A trooper fell, opened his chute, then walked, all by himself. If two of them did the same thing, that was a coincidence.

The aliens are different. They march sideways together. They reach the wall together. They turn round together, and they drop a step together, on the same frame.

Give each alien a velocity of its own and the block falls apart. The alien nearest the wall turns first, then the next one, and after ten seconds it is a mess rather than a block.

So you move the block yourself, every frame, with the rule you learned in project 7:

```js
alien.x += marchDir * speed * seconds;
```

That is a job Phaser will not do for you. Knowing which jobs those are is the skill this project is really about.

## The other big idea

**A game can get harder without anybody writing a difficulty curve.**

Here is the whole of it, one line, inside `marchAliens`:

```js
const speed = Math.min(MARCH_FAST, MARCH_SLOW * blockSize / aliens.getLength());
```

`blockSize` is how many aliens the wave started with. `aliens.getLength()` is how many are still alive.

A full block: 24 divided by 24 is 1, so they march at MARCH_SLOW. Half of them shot away: 24 divided by 12 is 2, so they march twice as fast. One left: 24 times as fast, which is why `Math.min` puts a lid on it.

Nobody decided that the last few aliens should be frightening. It falls out of the sum. Watch the March speed bar on the rack climb as you empty a wave.

## The four files

| File | What it does | Who writes it |
|---|---|---|
| `aliens.html` | Builds the page: the cabinet, the marquee, the rack, the keys | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `phaser.min.js` | The library. The same copy as project 9 | Never edit this |
| `aliens.js` | The ship, the swarm, the bolts, the bombs and the waves | You |

Double-click `aliens.html` to open it. Change `aliens.js`, save the file, then refresh the browser page.

Eight functions in `aliens.js` are marked `// TODO`. Write them in file order, from the top down. Each one gives you two hints. All the answers sit in one block at the very bottom of the file.

Press Start, then hold an arrow key. Nothing moves, and the line under the screen tells you which function to write first.

## What you will learn

- How to read the keyboard, and why a held key is asked about every frame
- How to build a grid of things with a loop inside a loop
- Why a formation has to move as one block
- How a difficulty curve can fall out of a sum instead of a plan
- How to give a player more than one life, and bring the ship back
- How waves work, and how to make each one worse than the last
- Which jobs a library does for you, and which it leaves alone

## Good to know

### What you already know

These all work the same way here. Read `01-calculator/README.md` through `09-phaser/README.md` again for the full story.

- Everything moves by `speed × seconds`, never by a fixed number of pixels per frame.
- A scene is one screen of a game, a sprite is one thing in it, and a group is a list of sprites.
- `group.create(x, y, 'key')` makes a sprite, gives it a picture, and puts it in the group.
- `sprite.setVelocityX(...)` is said once, and Phaser keeps moving the sprite for ever.
- `scene.physics.add.overlap(a, b, whatToDo)` is said once, and Phaser watches every pair from then on.
- x and y are the middle of a sprite.
- An animation is two pictures, swapped over and over, started with `sprite.play(...)`.
- A list that things leave is walked **backwards**, so removing one does not skip the next.
- A grid is built with a loop inside a loop, the way battleship built its sea.

The pictures are loaded for you this time. You wrote those five lines in project 9, so this file spends its stubs on the game instead.

Phaser groups have two useful questions here. `getChildren()` gives the sprites for a loop. `getLength()` gives their count for the rack and the wave rules.

### The keyboard

Every game so far waited for the mouse. This one reads keys, and keys work differently.

A click is a **moment**. It happens, you deal with it, it is over. Phaser told you about it by calling your function.

A key is a **state**. It is either down right now or it is not. Nobody calls you. You ask:

```js
keys.left.isDown
```

That is true while the left arrow is held, and false the rest of the time. So `steerShip` asks again on every frame, sixty times a second, because the answer can change between any two frames.

The wiring makes `keys` for you with one line:

```js
keys = this.input.keyboard.createCursorKeys();
```

That hands back the four arrows in one object: `keys.left`, `keys.right`, `keys.up` and `keys.down`. The space bar is picked out separately, by name.

### Stopping is a decision too

`steerShip` has three cases, and the third one catches everybody out:

```js
else ship.setVelocityX(0);
```

Leave that line out and the ship keeps flying after you let go of the arrow. That is not a bug in Phaser. It is Phaser doing exactly what project 9 taught: a velocity you set once stays set until something changes it.

Which is helpful when a bolt is crossing the screen, and unhelpful when your thumb has come off the key.

### Waves and lives

This is the first game of yours that gives you more than one go, and the first that has more than one round.

Both are small pieces of code, and both are decisions rather than movement.

`loseLife` takes one ship away and asks whether any are left. If none are, the game ends. If some are, a fresh ship flashes back in the middle.

`nextWave` runs every frame and almost always does nothing. Its first line is a **guard**:

```js
if (aliens.getLength() > 0) return;
```

Everything after that line runs only on the frame the last alien dies. That is a pattern worth keeping. A function that runs constantly but acts rarely should say so in its first line.

### Already written for you

Section 3 of `aliens.js` is finished, the same as in the nine projects before it.

- The Phaser settings, the pictures, the three groups and the alien animation.
- `ship`, and the line that stops it flying off the edge of the screen.
- The keyboard, the space bar, and the reload clock that limits your firing.
- `blockAtEdge`, which is true when any alien has reached a wall.
- `startWave`, which calls your `buildWave` and sets the swarm up to march.
- `boltHitsAlien` and `bombHitsShip`, which score the hits and set off the explosions.
- `boom`, the explosion. You wrote it in project 9, so this file gives it to you.
- `respawnShip` and `gameOver`.
- `retire`, which throws away bolts and bombs that have left the screen.
- The swarm reaching the deck, which ends the game whatever your lives say.

You can also add `#demo` or `#demo-over` to the end of the address in the browser, exactly as in projects 8 and 9. `#demo` is the finished game, playable. `#demo-over` is a lost game. Both fill your empty functions with answers of their own, so a demo tells you nothing about the code you wrote.

### Finding your mistakes

The line under the screen names the empty function. Read it first.

| What you see | The function to check |
|---|---|
| The arrow keys do nothing | `steerShip` |
| The space bar fires nothing | `fireBolt` |
| The sky is empty | `buildWave` |
| The swarm hangs there and never moves | `marchAliens` |
| No bombs ever fall | `alienFires` |
| Bolts pass straight through the aliens | `watchForHits` |
| A bomb hits you and costs you nothing | `loseLife` |
| The last alien dies and nothing happens | `nextWave` |
| The ship keeps drifting after you let go | `steerShip` again |
| The block spreads out into a mess | `marchAliens` again |
| The swarm sinks through the floor | `marchAliens` again |
| All three ships go at once | `loseLife` again |

The last four are the good bugs of this project.

A ship that drifts is missing the `else` that sets the velocity to zero.

A block that spreads out is being moved one alien at a time by its own velocity, instead of together by your loop.

A swarm that sinks is turning without dropping, or dropping without turning. Both lines belong inside the same `if`.

And all three ships going at once is the best bug in the file. A bomb got you, and the two bombs behind it were still falling. They found your new ship half a second later. `bombs.clear(true, true)` inside `loseLife` is what clears the sky before you fly again.

You can also print what Phaser is holding:

```js
console.log(aliens.getLength(), bolts.getLength(), bombs.getLength());
console.log(blockSize, marchDir);
```

### Try this next

- **A second kind of alien**, worth more points, in the top row.
- **Bunkers** you can hide behind, that wear away as they are hit.
- **A saucer** that crosses the top of the screen now and then.
- **A bomb that falls from the bottom alien of a column**, instead of from any alien at all.
- **Two bombs at once** by the fifth wave, so the waves get harder in a second way.
- **Sound through Phaser**, instead of the `Audio` objects this project kept from the calculator.

## What comes next

Project 11 is a maze. The map stops being a shape you build in a loop, and becomes **data** you can read, change and save. That idea runs all the way to the strategy game at the end of the trail.
