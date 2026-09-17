# The Cheese Vault

You are a mouse in a bank vault. The vault is full of cheese crumbs. Cats prowl the corridors.

Eat every crumb and the next vault opens. Let a cat touch you and you lose a life.

Two things here are new. The vault has walls, and walls change everything. And the vault is not a picture. It is written down.

## The one big idea

**The map is data.**

Here are two rows of the first vault, copied straight out of `vault.js`:

```js
'#....#....#....#',
'#.##.#.##.#.##.#',
```

A `#` is a wall. A `.` is a crumb. A space is bare floor. Twelve rows of that is the whole level.

Nothing in the game draws a maze by hand. `buildVault` reads those characters and puts a steel block wherever it finds a `#`.

Because the map is written down, the game can ask it questions:

- Is that cell a wall? `isWall` looks up one character.
- Which ways lead out of here? `waysOut` asks `isWall` four times.
- Is there any cheese left? `countCheese` counts the dots.

You could not ask a picture any of those. This is why the last five projects put things in an empty sky. A sky has nothing to ask about.

The map is also the thing you change. When you eat a crumb, `eatCheese` writes a space over the `.`. The crumb sprite disappearing is the small part. The map changing is the real part, and everything else follows from it.

## The other big idea

**Cells and pixels are two different languages.**

The map counts in cells. Cell 3,5 is the fourth column and the sixth row.

The screen counts in pixels. A sprite sits at x 224, y 352.

Neither one understands the other. So two small functions translate between them, and every other function in the file leans on those two.

```js
middleOf(3, 5)      // { x: 224, y: 352 }   cells in, pixels out
cellAt(224, 352)    // { col: 3, row: 5 }   pixels in, cells out
```

One number does all the work. `TILE` is 64, and every cell is 64 pixels square. Multiply to go one way. Divide and round down to come back.

You will write this pair again. Project 12 needs it for a world larger than the screen. Project 18 needs it for a map editor. Project 20 needs it to walk a route.

## The four files

| File | What it does | Who writes it |
|---|---|---|
| `vault.html` | Builds the page: the door, the plate, the rack, the keys | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `phaser.min.js` | The library. The same copy as projects 9 and 10 | Never edit this |
| `vault.js` | The map, the mouse, the crumbs and the cats | You |

Double-click `vault.html` to open it. Change `vault.js`, save the file, then refresh the browser page.

Nine functions in `vault.js` are marked `// TODO`. Write them in file order, from the top down. Each one gives you two hints. All the answers sit in one block at the very bottom of the file.

Press Start. The mouse is hiding in the top corner, and the line under the window says which function to write first.

## What you will learn

- How to store a map as data instead of drawing it by hand
- How to turn a cell into a spot on the screen, and back again
- How one `if` becomes every wall in a game
- Why a moving thing has to land exactly on the grid
- How changing the map changes the game
- How an enemy can run on the same code as the player

## Good to know

### What you already know

These all work the same way here. Read `01-calculator/README.md` through `10-aliens/README.md` again for the full story.

- A grid is built with a loop inside a loop, the way battleship built its sea.
- Everything moves by `speed × seconds`, never by a fixed number of pixels per frame.
- A key is a state, so you ask about it on every frame.
- A scene is one screen of a game, and a group is a list of sprites.
- `group.create(x, y, 'key')` makes a sprite, gives it a picture, and keeps it.
- `sprite.destroy()` takes a sprite off the screen for good.
- x and y are the middle of a sprite.
- A function that runs constantly but acts rarely says so in its first line.
- Picking at random is `list[Math.floor(Math.random() * list.length)]`.

Two things arrive already written this time. Lives and levels are given, because project 10 made you write both.

### Deciding and moving are two jobs

Project 8 split a falling trooper into two functions. One decided, and one moved. The same split is here, and this time the walls make the reason obvious.

`startStep` decides. It asks the map whether the next cell is free. It never moves anybody.

`moveThing` moves. It slides a thing towards the cell it is aiming at. It knows nothing about walls, because the decision was already made.

Keep them apart and each one stays four or five lines long. Mix them together and you get a function that asks the map sixty times a second for an answer that only changes at a junction.

### Landing exactly on the grid

`moveThing` has one line that looks fussy and is not:

```js
thing.sprite.x = target.x;
```

When a thing arrives, it is put exactly on the middle of the cell. Not nearly.

Try it without that line and the game works for about twenty seconds. Every frame leaves the mouse a fraction of a pixel out. Those fractions add up. Then `cellAt` starts reporting the cell next door, and the mouse slips through a corner.

A thing that lives on a grid has to be on the grid, exactly, every time it stops.

### The cats run on your code

A cat is the same shape of object as the mouse:

```js
{ sprite, wantX, wantY, goX, goY, toCol, toRow, speed }
```

Because they match, one `startStep` and one `moveThing` move all of them. That is project 8's lesson again, and it is why cats cost you one small function instead of a second game.

The only difference is who chooses. Your thumb chooses for the mouse, in `steerMouse`. `chooseCatWay` chooses for a cat.

The cat's choice is not clever. It looks at the ways out, throws away the way it came from, and picks one of the rest at random. That is enough to be frightening in a corridor. Project 23 is where an enemy starts hunting you on purpose.

### Already written for you

Section 3 of `vault.js` is finished, the same as in the ten projects before it.

- The Phaser settings, the pictures, and the two groups.
- `loadLevel`, which reads a map, takes the `@` and the `C` out of it, and puts the mouse and the cats on those cells.
- `waysOut`, which asks your `isWall` about all four neighbours.
- `crumbAt`, which finds the crumb sprite sitting in one cell.
- `nibble`, which scores a crumb and makes the sound.
- `countCheese`, which counts the dots left on the map.
- `catchCheck`, `loseLife` and `backToTheStart`.
- `clearedCheck`, which opens the next vault when the map runs out of cheese.
- The gold square on the floor, which shows the cell the mouse is heading for.

You can also add `#demo` or `#demo-over` to the end of the address in the browser, exactly as in projects 8, 9 and 10. `#demo` is the finished game, playable. `#demo-over` is a lost game. Both fill your empty functions with answers of their own, so a demo tells you nothing about the code you wrote.

### Finding your mistakes

The line under the window names the empty function. Read it first.

| What you see | The function to check |
|---|---|
| The mouse hides in the top corner | `middleOf` |
| The Cell readout stays a dash | `cellAt` |
| The floor is bare | `buildVault` |
| All four ways stay grey | `isWall` |
| The gold square never appears | `steerMouse` |
| The gold square jumps into walls | `startStep` |
| Nothing ever slides anywhere | `moveThing` |
| You run over crumbs and nothing happens | `eatCheese` |
| The cats stand still for ever | `chooseCatWay` |
| The mouse walks straight through walls | `isWall` again |
| The mouse slips through a corner after a while | `moveThing` again |
| Crumbs vanish, but the vault never empties | `eatCheese` again |
| The cats twitch back and forth on the spot | `chooseCatWay` again |
| The mouse stops dead at every junction | `steerMouse` again |

The last five are the good bugs of this project.

A mouse that walks through walls usually has an `isWall` that forgot the edge of the map. Column 16 is not on the map, so `grid[row][16]` is `undefined`, which is not `'#'`, so the wall is not a wall.

A mouse that slips through a corner is not landing exactly on the middle of a cell. Read "Landing exactly on the grid" again.

Crumbs that vanish while the vault never empties is the best bug in the file. `eatCheese` destroyed the picture and left the map alone. Everything you can see is right, and the game still thinks the cheese is there, because `countCheese` reads the map. The picture is never the truth.

Cats that twitch are keeping the way they came from in the list.

And a mouse that stops at every junction has an `else` in `steerMouse` that sets the wanted way back to zero. Project 10 needed that `else`. This one must not have it.

You can also print what the map says:

```js
console.log(grid[10].join(''));
console.log(countCheese(), walls.getLength());
```

### Try this next

- **A fourth vault.** Add sixteen rows of characters to `LEVELS` and play it. No other line changes, which is the whole point of keeping a map as data.
- **A big crumb** that is worth five points. One new character in the map, and one more `if` in `buildVault`.
- **A mouse hole** the mouse can pass through and a cat cannot.
- **A cat that hunts.** Give `chooseCatWay` the mouse's cell, and let it prefer a way that closes the gap.
- **A second thing to collect**, such as a key that has to be eaten before the vault will open.

## What comes next

Project 12 makes the world bigger than the screen. The map stays data, but only part of it fits in the window, so a camera moves across it.

You will meet one line there, and it is the same idea as `middleOf`:

```text
screen position = world position - camera position
```
