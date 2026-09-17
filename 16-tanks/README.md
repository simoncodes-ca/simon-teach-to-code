# Tank Duel

Two tanks in a yard full of concrete blocks. Two players share one keyboard. Blue drives with W A S D, and Red drives with the arrow keys.

Hit the other tank four times and you take the round. Take three rounds and you win the duel.

Every game so far moved things left, right, up or down. A tank can face any way at all, and it drives the way it faces. It also has to stop at a wall without being on a grid. Those two things are this project.

## The one big idea

**Move first. Then take back the part that hit.**

The mouse in project 11 lived on a grid. Before every step it asked the map about the next cell, and a wall meant no step. The wall was a rule checked before anything moved.

A tank is not on a grid. It can be at x 213.7, facing 37 degrees. There is no "next cell" to ask about.

So a tank does it the other way round:

1. Move.
2. Ask: am I inside something now?
3. If yes, take the move back.

And here is the trick that makes it feel right. Move across and move down **separately**, and check after each one:

```js
tank.x += step.x;
if (blocked(tank)) tank.x -= step.x;

tank.y += step.y;
if (blocked(tank)) tank.y -= step.y;
```

Drive into a wall at a slant. The half of the move that points into the wall is taken back. The other half still happens. So the tank slides along the wall instead of sticking to it.

## The other big idea

**A tank is one angle, and everything starts from it.**

`tank.angle` is the way the tank faces, in radians. 0 is right. `Math.PI` is half a turn, so it faces left.

Your `stepAlong` turns an angle into a step across and a step down. You met the two lines inside it in project 7:

```js
stepAlong(0, 10)            // { x: 10, y: 0 }     facing right
stepAlong(Math.PI / 2, 10)  // { x: 0, y: 10 }     facing down
```

After that, everything in the game is one call to `stepAlong`:

| What you need | How you get it |
|---|---|
| How far to drive this frame | `stepAlong(tank.angle, drive * TANK_SPEED * seconds)` |
| Where the barrel ends | `stepAlong(aim, BARREL)` |
| How fast a shell flies across and down | `stepAlong(aim, SHELL_SPEED)` |
| Where to draw each dot of the gun sight | `stepAlong(aim, along)` |

The gun adds one more idea. The turret sits on top of the tank and turns by itself. So the way the gun points is two angles added together:

```js
aim = tank.angle + tank.turret
```

Turn the tank, and the gun turns with it. Turn the turret, and only the gun moves.

## The seven files

The game is split into files, the way project 14 taught. Each file has one job.

| File | Its one job | Who writes it |
|---|---|---|
| `numbers.js` | The numbers, the three arenas, and the keys | Finished |
| `arena.js` | The map, the blocks, and `blocked` | Finished |
| `tank.js` | Turning, driving, stopping at walls, and aiming | **You. Functions 1 to 4** |
| `shells.js` | Firing, flying, bouncing, hitting and damage | **You. Functions 5 to 8** |
| `rack.js` | Everything you read: readouts, the status line, the cards | Finished |
| `game.js` | Phaser, the keys, the clock, rounds and drawing | Finished |
| `phaser.min.js` | The library. The same copy as projects 9 to 15 | Never edit this |

`tanks.html` and `styles.css` are finished too.

Double-click `tanks.html` to open it. No server this time. Change a file, save it, then refresh the browser page.

Eight functions are marked `// TODO`. Write the four in `tank.js` first, from the top down. Then write the four in `shells.js`. Each function gives you two hints. The answers sit at the very bottom of each file. The answers for `tank.js` are at the bottom of `tank.js`. The answers for `shells.js` are at the bottom of `shells.js`.

Press Start. The line under the window names the function to write first.

## What you will learn

- How one angle tells a tank which way to drive
- How to stop at a wall when you are not on a grid
- Why moving across and down separately makes a tank slide
- How a bounce is the same trick, with one extra line
- How an angle added to an angle aims a gun
- How health goes down without ever going below zero

## Good to know

### What you already know

These all work the same way here. Read `01-calculator/README.md` through `15-scores/README.md` again for the full story.

- `Math.cos(angle)` is the across part of an angle, and `Math.sin(angle)` is the down part.
- Angles are in radians. Half a turn is `Math.PI`.
- Everything moves by `speed × seconds`, never by a fixed number of pixels per frame.
- A key is a state, so you ask about it on every frame.
- A moving thing is a plain object, like `{ x, y, vx, vy }`.
- A map is rows of characters, and `#` is a wall.
- A box touches a wall if one of its four corners is in the wall.
- `Phaser.Math.Distance.Between` gives the gap between two points.
- `Math.max` puts a floor under a number.
- A loop that takes things out of a list counts backwards.
- Several script files share one set of names, and the order of the script tags matters.

Three things arrive already written. The map and the four-corner check are given, because projects 11 and 12 made you write both. The script tags are given, because project 14 was about them.

### Deciding first, or moving first

Two projects, two ways to stop at a wall.

| | The cheese vault | Tank Duel |
|---|---|---|
| Where things live | On a grid of cells | Anywhere, to a fraction of a pixel |
| When the wall is checked | Before the step | After the move |
| What a wall does | The step never starts | The move is taken back |
| What you get at a slant | Nothing. There is no slant | A slide along the wall |

Neither way is better. A grid game should decide first, because it can. A tank cannot, so it moves first.

### A bounce is the same trick

Read your `moveShell` next to your `driveTank`. They have the same shape: move across, check, move down, check.

The only difference is what happens on a hit. A tank takes the move back and stops that half. A shell takes the move back and turns that half round:

```js
shell.vx = -shell.vx;
```

A shell that hits the side of a block flips `vx` and keeps `vy`. So it leaves at the same slant it arrived at, like a snooker ball off a cushion. Nobody wrote any bouncing maths. It comes free from doing across and down separately.

### The health bar is not the health

`tank.health` is a number. The bars on the rack and over the tank are drawn from that number on every frame.

That is project 11's lesson again. The cheese vault's crumbs were pictures, and the map was the truth. Here the bar is a picture, and `tank.health` is the truth. Your `damageTank` changes the number, and the bars follow on their own.

The number must never go below 0. A tank with -25 health would draw its bar backwards, so `Math.max(0, ...)` keeps a floor under it.

### Already written for you

- The three arenas, and `loadArena`, which reads one and builds its blocks.
- `isWallAt(x, y)`, which says whether a spot is inside a block. Your `moveShell` uses it.
- `blocked(tank)`, which checks the four corners of a tank's box, and the other tank. Your `driveTank` uses it.
- Reading the keys, and turning them into -1, 0 or 1.
- Swinging the turret with Q and E. Your `aimOf` turns that into the way the gun points.
- Counting the reload down to 0.
- Throwing away a shell that has bounced too often, in `forgetSpentShells`.
- Asking your `shellHitsTank` about every shell and every tank, in `landHits`.
- Rounds, wins, the cards, the sounds, and the smoke.

You can also add `#demo` or `#demo-over` to the end of the address, exactly as in the projects before. `#demo` is the finished duel, playable by two people. `#demo-over` is the end of a duel. Both fill your empty functions with answers of their own, so a demo tells you nothing about the code you wrote.

### Finding your mistakes

The line under the window names the first empty function. Read it first.

| What you see | The function to check |
|---|---|
| No small arrow in front of the tanks | `stepAlong` |
| A and D do nothing | `turnTank` |
| W and S do nothing | `driveTank` |
| Q and E do nothing, and there is no gun sight | `aimOf` |
| Space does nothing | `fireShell` |
| Shells hang in the air | `moveShell` |
| Shells fly straight through tanks | `shellHitsTank` |
| Hits burst, but nobody loses health | `damageTank` |
| D turns the tank the wrong way | `turnTank` again |
| The tank drives through blocks | `driveTank` again |
| The tank sticks to a wall instead of sliding along it | `driveTank` again |
| The gun stays still when the tank turns | `aimOf` again |
| Holding Space fires a solid stream of shells | `fireShell` again |
| A shell hits a wall and comes straight back the way it came | `moveShell` again |
| Your own shell bounces back into you and does nothing | `shellHitsTank` again |
| Health reaches 0, but the round never ends | `damageTank` again |

The last seven are the good bugs of this project.

A tank that sticks to walls moved across and down together, then checked once. When the check says "blocked", it takes back the whole move, including the half that was fine. Split it in two.

A tank that drives through blocks is checking before it moves, or not taking the move back.

A gun that stays still when the tank turns is handing back `tank.turret` on its own. That number is how far the turret has turned **on top of** the tank. Add the tank's own angle.

A solid stream of shells is a missing reload. The wiring calls `fireShell` on every frame the key is down. That is sixty times a second, so the gun has to say no most of the time.

A shell that comes straight back forgot to take its move back before turning round. It is still inside the block. So when the down half is checked, it is still in a wall, and it turns that half round as well. Both halves flip, and it goes back the way it came.

A shell that bounces back into you and does nothing has the owner rule the wrong way round. The rule is: your own shell cannot hurt you **until it has bounced**. After one bounce it is as dangerous as anybody's.

A round that never ends has health at 0 and `wrecked` still false. The wiring only ever looks at `wrecked`.

You can also print what a tank holds. Type this into the console while you play:

```js
console.log(blue);
console.log(shells);
```

### Try this next

- **A fourth arena.** Add twelve rows of characters to `ARENAS`. No other line changes.
- **Push right up to the wall.** A fast tank stops a few pixels short of a block, because the move is taken back whole. Instead, work out exactly where the edge of the block is and put the tank there.
- **Crates that break.** Add a new character to the map for a crate. A shell that hits one changes that cell to `.`, the way `eatCheese` changed the map.
- **A repair kit** that appears in the middle of the arena and gives back 25 health, up to `MAX_HEALTH`.
- **Armour.** A hit from behind does double damage. You will need `Math.atan2` from project 7 to find which side the shell came from.

## What comes next

Project 17 is this same game again, rewritten in TypeScript.

Nothing about the duel changes. What changes is that every tank and every shell gets a written-down shape, called a type. Then the computer checks every line against it before the game even starts.

Look at the comment above `let blue` in `tank.js`. It lists what a tank holds. In project 17, that comment becomes code the computer can read.
