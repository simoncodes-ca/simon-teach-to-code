# Simon's Battleship

A game of Battleship played on a wardroom plotting table. Two seas: yours, which you can see, and the enemy's, which you cannot. You take it in turns to fire one shot. The first fleet to lose all five ships loses.

This is your fifth project. The calculator taught you variables and functions. The elevator taught you state machines. Hangman taught you that everything on screen comes from a small amount of memory. Blackjack taught you objects.

Battleship is your first **map**. Up to now every piece of memory has been a single value or a flat list. Here the memory has two directions.

**A grid is a list of rows, and each row is a list of squares.** That one sentence is the project. Terrain, buildings, units and routes all come later, and every one of them sits on the thing you build here.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `battleship.html` | Builds the page: the table, the charts, the buttons | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `battleship.js` | The game's rules | You |

Double-click `battleship.html` to play. After you change `battleship.js`, save the file and refresh the browser page.

Inside `battleship.js` eleven functions are marked `// TODO`. Write them in file order, from top to bottom. Each one carries two hints: a gentle hint first, then a stronger one. Try the gentle hint first. The answers are all together in a block at the very bottom of the file — scroll down to it when you want it, and only then.

Right now the page does nothing. Both charts are empty frames and the status line asks you to write the first function. That is on purpose.

## The rules of the game

- Each side has five ships: a Carrier of 5 squares, a Battleship of 4, a Cruiser of 3, a Submarine of 3 and a Destroyer of 2. Seventeen squares in all.
- Ships lie flat, left to right or top to bottom. They cannot bend, hang off the edge, or overlap.
- You place your fleet first. Click a square to lay a ship down. **Rotate** turns it, and **Scatter** places all five for you.
- Then you take it in turns. One shot each. A shot is a hit or a miss, and the peg tells you which — red for a hit, white for a miss.
- A ship is **sunk** when every one of its squares has been hit. You are told when a ship goes down, but never which square it was on.
- Lose all five ships and you lose the game.

## What you will learn

- What a two-dimensional array is, and why `grid[row][col]` is two steps, not one
- How to build a list of lists, and the trap of building it the quick way
- How to turn a row and a column into a name like `C7`
- Why one map is not enough, and this game needs four grids
- How to keep information hidden from yourself
- How to place things at random by guessing and checking

## Good to know

### What you already know

These all work exactly the same here. Read `01-calculator/README.md` through `04-blackjack/README.md` again for the full story.

- `let` and `const` make labelled boxes. A `const` box cannot be replaced.
- Arrays are ordered lists. `.push(x)` adds to the end, `[0]` reads the first item, `.length` counts.
- An object is a value with named parts, written inside `{ }`, and you read a part out with a dot.
- Functions are steps with a name. `return` sends a value back and stops the function immediately.
- `for` loops repeat and count. `for (const x of list)` walks a list without counting. A loop inside a loop walks two lists at once — that is how you built a deck.
- `Math.floor(Math.random() * n)` gives a whole number from 0 up to n − 1.
- A boolean is only ever `true` or `false`. `!` flips one over.
- A `phase` variable holds one name at a time and decides what the page allows.
- `render()` wipes the screen and draws it all again from the memory. Change the memory, then call `render()`.
- `console.log` shows you what is really happening.

### The big idea: a grid is a list of lists

A list can hold anything. It can hold numbers, it can hold objects — and it can hold other lists. That last one is all a grid is.

```js
const grid = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];
```

That is three rows, each holding three squares. `grid.length` is 3, because the grid holds three things, and each of those things is a row.

To reach one square you take two steps:

```js
grid[2]        // the third row — itself a list
grid[2][0]     // the first square of that row
```

Read `grid[row][col]` from left to right. **Row first, then column.** Always that way round, in every project from here to the end of the trail. Get the two the wrong way round and the program still runs, quite happily, drawing everything sideways.

### Building one, and the trap

`makeGrid` builds a grid full of the same value. The shape is a loop inside a loop, which you already met building the deck. The difference is what you do with it. Building a deck, both loops pushed onto one list. Building a grid, the inner loop fills a row and the outer loop pushes that whole row on.

There is one trap, and it is worth knowing before you fall in it:

```js
const row = [];                       // made ONCE, outside
for (let i = 0; i < SIZE; i += 1) {
  rows.push(row);                     // the same row, ten times
}
```

That looks right and is completely wrong. There is only one row, and it has been added to the list ten times over. Write a ship into `rows[0][3]` and it appears in `rows[1][3]` too, and in all the others, because they are not copies. They are the same row.

So make the row **inside** the outer loop. A new one, every time round.

### null: the word for nothing

You have seen `null` before without being told what it is. It is a value that means "nothing here on purpose".

The ships grid starts out full of `null`, and a square holds `null` until a ship is written into it. That is different from `''`, the empty piece of text the shots grid starts with. Two different kinds of empty, for two different questions:

```js
sea.ships[3][5] === null    // is this water?
sea.shots[3][5] === ''      // has nobody fired here?
```

Using one blank for both would work, and it would also mean that "no ship" and "no shot" were the same fact. They are not, and a bug that mixes them up is very hard to see.

### Two grids, not one

Here is the thing that makes Battleship interesting: a square can hold a ship **and** a shot at the same time. That is exactly what a hit is.

So one grid cannot do it. Each sea keeps two:

```js
const sea = {
  ships: [...],   // a ship's name, or null
  shots: [...]    // 'hit', 'miss', or ''
};
```

And there are two seas, so the game holds four grids in all. That sounds like a lot until you say what each one is for:

| | `yourSea` | `enemySea` |
|---|---|---|
| `.ships` | your fleet — drawn in grey steel | their fleet — never drawn |
| `.shots` | what they have fired at you | what you have fired at them |

A sea owns what is floating in it and what has been fired into it. Once you say it that way round, `fireAt(sea, row, col)` works on either sea without knowing whose it is — which is why you write that function once instead of twice.

### Hidden information

`enemySea.ships` is right there in the memory. Nothing stops you printing it. The only reason the game works is that the drawing code chooses not to show it:

```js
renderBoard(targetGridEl, enemySea, false);   // ships hidden
renderBoard(homeGridEl,   yourSea,  true);    // ships shown
```

One `true` and one `false`, and that is the whole difference between the two charts on the table.

This is a real and slightly uncomfortable idea. **A program keeps a secret by choosing not to show it, not by not knowing it.** Everything the enemy is hiding from you is sitting in a variable you could read at any moment. When you write a game with a computer opponent, you are the one deciding what it is allowed to look at — and it takes real care not to let it peek.

The roster on the right follows the same rule. It can say a ship has gone down, because you would know that anyway. It never says where the ship was.

### Guessing until it fits

`placeFleetAtRandom` has to drop five ships onto a board without any of them overlapping or hanging off the edge. You could work out every legal position first. Almost nobody does.

Instead: **guess, check, and guess again.**

```text
pick a random square and direction
does it fit?    yes -> place it, done
                no  -> throw the guess away and pick again
```

That sounds wasteful. It is not. Seventeen squares on a board of a hundred means almost any guess works, so this finds a spot in a handful of tries, and it is about five lines. That trade — a bit of wasted effort for a lot less code — is one you will make again and again.

It does have one danger. If the check can never say yes, the guessing never stops and the page freezes. So the loop in the file counts its tries and gives up at 400, and that guard is already written for you. `enemyChoice` picks its square the same way, and has the same guard.

### Booleans as directions

`across` is a boolean. `true` means the ship runs left to right, `false` means top to bottom. That is the whole of the Rotate button:

```js
across = !across;
```

Two directions is exactly two, so a boolean is the honest shape for it. If ships could ever lie diagonally you would want a name instead of a yes-or-no, the way `phase` holds a name.

### Already written for you

Section 3 of `battleship.js` is finished, like the four projects before it.

- `render()` draws both charts, the bearing plate, the roster, the log, the phase and the buttons. Every one of them reads the memory.
- `isOnBoard(row, col)` is a small helper written for you, and `canPlace` is the stub that needs it. The wiring keeps three more for its own use — `shipByName`, `inCells` and `fleetIsPlaced` — and none of your eleven functions has to call them.
- `takeShot(row, col)` is your half of a turn, written out in full as an example. `handleEnemyShot` — the last stub — is the same four jobs with the two seas the other way round. Read `takeShot` before you start it.
- `runEnemyTurn()` asks your `enemyChoice` for a square, shows a red ring on it, and fires 850 milliseconds later, so you can see it coming.
- `addShot(...)` writes the log line, plays the sound, and announces any ship that has just gone down. It only announces each one once.
- `handlePlace`, `scatterYourFleet`, `startBattle`, `finish` and `newGame` run a game from beginning to end. The three buttons are already connected, and **R** rotates as well.
- Add `#demo`, `#demo-placing`, `#demo-win` or `#demo-lose` to the end of the address in the browser. Those show the table mid-battle, mid-placement, won and lost. They are for checking how the page looks, not for playing.

### The bearing plate, the pegs and the sounds

The brass plate at the top right reads out the square under your cursor. That is your `cellName`, printed as large as the table will allow. Move the mouse across a chart and watch the letters and numbers change.

Pegs work the way they do in the box game: white for a miss, red for a hit. Your own ships show as grey steel plate, and turn burnt red when they sink.

Sounds work exactly as they did in hangman and blackjack. There are six: placing a ship, a splash, a hit, a ship going down, winning and losing.

### Finding your mistakes

The console works as it always has. But most of your functions are drawn on the table while you play, so check the table first:

1. **Empty charts** mean `makeGrid`. Nothing at all can happen before it.
2. **A blank bearing plate** while your cursor is over a chart means `cellName`.
3. **No ghost** following the cursor while you place means `shipCells`. A ghost that is red everywhere, even in open water, means `canPlace`.
4. **A ghost that goes green but leaves nothing behind** means `placeShip`.
5. **Nothing to shoot at**, so every shot is a miss, means `placeFleetAtRandom` — press Scatter and see whether your own fleet appears.
6. **No pegs** mean `fireAt`.
7. **A ship that never gets crossed off the roster** means `isSunk`. **A game that never ends** means `allSunk`.
8. **No red ring** on your chart means `enemyChoice`. **A ring that never fires** means `handleEnemyShot`.

When the screen still disagrees with you, print a grid:

```js
console.table(enemySea.ships);
```

`console.table` draws a list of lists as an actual table, with the row numbers down the side. It is worth knowing about for the rest of the trail — you will be looking at grids for a long time.

And if a ship comes out sideways, or a shot lands in the wrong place, check the order of your two square brackets before anything else. `grid[col][row]` is the mistake everybody makes once.
