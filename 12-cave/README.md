# Cave Flyer

You fly a little mining ship through a long, dark cave. Gravity pulls it down the whole time. The engine pushes it up while you hold the up arrow.

Pick up the crystals on the way, and reach the gate at the far end. Touch the rock and the ship breaks.

One thing here is new, and it is a big one. The cave does not fit in the window.

## The one big idea

**Screen position = world position − camera position.**

The cave is 4608 pixels long. The window is 1024 pixels wide. So the window can only show one piece of the cave at a time.

Every rock, every crystal and the ship has a **world position**, which is where it lives in the cave. A rock's world position never changes. The rock stays where it is, however far you fly.

The **camera** has a world position too. It is the spot in the cave that the window's top left corner is showing.

Take the camera away from the world position, and you get the **screen position**. That is where the thing shows up in the window:

```text
a crystal lives at world x              1300
the camera is at world x                1000
so the crystal is in the window at x     300
```

That subtraction is `toScreen`, the first function you write. Every picture in the cave goes into the window through it. Until it works, the window stays dark.

The rack shows all three numbers for the ship while you fly. World minus camera equals screen, on every frame. Watch it happen.

## The other big idea

**Gravity pulls, the engine pushes, and the ship never stops on its own.**

Project 7 gave the darts gravity in one line:

```js
ship.vy += GRAVITY * seconds;
```

The engine is the same line, pointing the other way. y grows downwards on a screen, so pushing up means taking away:

```js
if (ship.thrust) ship.vy -= THRUST * seconds;
```

`THRUST` is bigger than `GRAVITY`. Hold the engine on and the ship slows its fall, stops for a moment, and then climbs. Let go and gravity wins again.

So the ship is always speeding up, one way or the other. You fly it by tapping the up arrow, not by holding it down. That takes a minute of practice, and it is what makes the game fun.

## The four files

| File | What it does | Who writes it |
|---|---|---|
| `cave.html` | Builds the page: the console, the plate, the rack, the keys | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `phaser.min.js` | The library. The same copy as projects 9, 10 and 11 | Never edit this |
| `cave.js` | The camera, the ship, and the rule for touching rock | You |

Double-click `cave.html` to open it. Change `cave.js`, save the file, then refresh the browser page.

Seven functions in `cave.js` are marked `// TODO`. Write them in file order, from the top down. Each one gives you two hints. All the answers sit in one block at the very bottom of the file.

Press Start. The window stays dark, and the line under it says which function to write first.

## What you will learn

- How a world can be bigger than the window
- How to turn a world position into a screen position
- How a camera follows the player, and why it has to stop at the edges
- Why a game skips the things the window cannot see
- How an engine fights gravity
- How to tell when a moving thing touches the map

## Good to know

### What you already know

These all work the same way here. Read `01-calculator/README.md` through `11-vault/README.md` again for the full story.

- Everything moves by `speed × seconds`, never by a fixed number of pixels per frame.
- Gravity is one line that adds to `vy`.
- A loop that takes things out of a list counts backwards.
- A key is a state, so you ask about it on every frame.
- Steering needs an `else` that sets the speed back to zero, or the ship drifts.
- `Math.min` puts a lid on a number.
- `&&` means "and", and `||` means "or".
- x and y are the middle of a sprite.
- A map can be rows of characters, and `grid[row][col]` is one cell of it.
- Divide by `TILE` and round down to find the cell a pixel is in.
- A cell off the edge of the map counts as a wall.

Some things arrive already written this time. Lives are given, because project 10 made you write them. The loop that builds the cave from the map is given, because project 11 made you write that.

### The camera has edges

`aimCamera` starts with two lines that put the ship in the middle of the window:

```js
camera.x = ship.x - WIDTH / 2;
camera.y = ship.y - HEIGHT / 2;
```

Write only those two, and fly back to the start. The window shows black space to the left of the cave. The camera has gone to a part of the world where there is no cave. The Camera limits markers on the rack turn red at the same moment.

So the camera needs limits. `camera.x` can be no smaller than 0. It can be no bigger than `WORLD_WIDTH - WIDTH`, because the right edge of the window is at `camera.x + WIDTH`, and that edge has to stop at the end of the cave.

`Phaser.Math.Clamp` keeps a number between a smallest and a biggest value. It is `Math.min` and `Math.max` in one go.

Near the ends of the cave, the ship stops being in the middle of the window. That is correct. The camera stops, and the ship carries on.

### Only draw what the window can see

The cave holds about 900 pictures. The window shows about 130 of them.

A game with a big world does not bother moving the pictures nobody can see. `isOnScreen` answers one question: would this spot land inside the window? The wiring asks it before every picture, and skips the ones outside.

Watch Pictures drawn on the rack. Before `isOnScreen` works, it counts every picture in the cave. Afterwards, it only counts the ones in the window.

The check leaves a margin of one `TILE` on every side. A rock whose middle is just past the edge still has half of itself in the window. Without the margin, rocks pop in late at the edges.

### Four corners are enough

`shipHitsRock` asks `isRock` about the four corners of the ship's box. It does not check every pixel of the ship.

That works because the ship is smaller than a cell. A cell of rock is 64 pixels square, and the ship's box is 44 by 28. A square that big cannot touch the ship without covering at least one corner.

A ship bigger than a cell would need more points checked along its edges. Keep that in mind for project 16.

### Stuck to the window

Two things on the screen never go through `toScreen`. One is the dark background. The other is the card that says Press Enter.

Both are stuck to the window, not to the cave. They stay in the same place when the camera moves. Anything that should scroll with the cave has a world position. Anything that should stay still in the window does not.

### Already written for you

Section 3 of `cave.js` is finished, the same as in the eleven projects before it.

- The Phaser settings, and the pictures.
- `buildCave`, which reads the map and makes a picture for every rock, crystal and lamp.
- `middleOf`, which you wrote in project 11.
- `drawWorld`, which puts every picture in the window using your `isOnScreen` and your `toScreen`.
- A new ship hangs still until you press an arrow key, so you have a moment to find it.
- `grabCrystals`, which picks up a crystal when the ship flies close to it.
- `passLamps`, which lights a lamp when you fly past it. After a crash, the next ship appears at the last lamp you lit.
- `crash`, the lives, and the gate at the far end.
- The cave map on the rack. The white box on it is the camera.
- The Camera limits on the rack, which turn red when the camera leaves the cave.
- The four corner lamps on the rack, which use your `isRock`.

You can also add `#demo` or `#demo-over` to the end of the address in the browser, the same as in projects 8 to 11. `#demo` is the finished game, playable. `#demo-over` is a lost game. Both fill your empty functions with answers of their own, so a demo tells you nothing about the code you wrote.

### Finding your mistakes

The line under the window names the empty function. Read it first.

| What you see | The function to check |
|---|---|
| The window stays dark | `toScreen` |
| The Engine lamp never lights | `steerShip` |
| The ship hangs in the air for ever | `flyShip` |
| The ship flies out of the window and never comes back | `aimCamera` |
| Pictures drawn counts every picture in the cave | `isOnScreen` |
| The corner lamps stay grey | `isRock` |
| The ship flies straight through rock | `shipHitsRock` |
| The cave scrolls the wrong way, twice as fast | `toScreen` again |
| The ship drifts sideways after you let go | `steerShip` again |
| Black space shows past the ends of the cave | `aimCamera` again |
| Rocks pop into view late at the edges of the window | `isOnScreen` again |
| The ship crashes in open air, far from the start | `isRock` again |

The last five are the good bugs of this project.

A cave that scrolls the wrong way has a `toScreen` that adds the camera instead of taking it away. Fly right, and the rock rushes towards you.

Black space past the ends is a camera with no limits. Read "The camera has edges" again.

Rocks that pop in late are an `isOnScreen` with no margin.

A ship that crashes in open air is the best bug in the file. `isRock` was given a screen position instead of a world position. Near the start, the camera is at 0,0, so the two are the same and everything works. Fly further and they stop being the same. Now `isRock` checks a part of the cave you are not in. The rock lives in the world, so always ask about the world.

You can also print the numbers:

```js
console.log(ship.x, ship.y, camera.x, camera.y);
console.log(toScreen(ship.x, ship.y));
```

### Try this next

- **Fuel.** The engine burns fuel while it is on, and a crystal fills the tank back up. Add a bar for it on the rack.
- **A second cave.** Write 18 more rows of 72 characters. Nothing else in the file has to change.
- **A background that moves slower than the rock.** Put a second layer of rock behind the cave, at `worldX - camera.x * 0.5`. Far things seem to move slower, so the cave looks deep.
- **A camera that looks ahead.** Aim the camera a little in front of the ship, in the direction it is flying, so you can see what is coming.
- **Click to mark a spot.** Write `toWorld`, which is `toScreen` backwards: add the camera instead of taking it away. Then a click in the window can drop a marker in the cave, and the marker stays put when you fly on.

## What comes next

Project 13 is an endless runner. The cave is no longer written by hand. The game builds it just ahead of the camera as you fly, so it never ends.

It also saves your best score, so it is still there after you refresh the page.
