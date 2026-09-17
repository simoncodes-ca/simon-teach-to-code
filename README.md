# Teach to Code

This is how Simon teaches his kids to code.

Every project here is a small, real program. The page is already built. You write the code that makes it work.

## How it works

Each project gives you a finished web page. The HTML file holds the buttons and the layout. The CSS file decides how everything looks. You never edit those two files.

The JavaScript file is yours. Some of its functions are empty. Each empty function has a name, a description in plain words, and hints.

Write those functions one at a time, in the order they appear in the file. Each function you finish makes something new happen on the screen.

For projects 1 to 16, you install nothing. Open the HTML file in a browser. Open the JavaScript file in a text editor. Put the two windows side by side. Change the JavaScript, save it, then refresh the browser page.

## The projects

### Calculator

A calculator that adds, subtracts, multiplies and divides. It also keeps a list of everything you typed.

The page gives you the buttons. You write three things. You write the memory, which is what the calculator remembers between presses. You write the display. You write the arithmetic.

Files: `01-calculator/calculator.html`, `01-calculator/styles.css`, `01-calculator/calculator.js`.

The project has a second page, `calculator-anna.html`. It looks different but runs the same JavaScript. It shows you that how a page looks and what a page does are two separate things.

### Elevator

A five-floor building with a working elevator. The call buttons light up and stay lit. The car travels between floors and opens its doors.

The page gives you the building, the buttons and a live diagram. You write the queue of floor requests. You also write the state machine that decides what happens next.

A state machine is a program that is always in exactly one named state, such as `doorsOpen` or `movingUp`.

Files: `02-elevator/elevator.html`, `02-elevator/styles.css`, `02-elevator/elevator.js`.

### Hangman

A word game drawn on sketchbook paper. You guess one letter at a time. Every wrong guess adds another pencil stroke to the drawing. After six wrong guesses the round ends.

The page gives you the paper, the drawing and the row of letters. You write the word display, the letter checking, and the decisions about winning and losing.

Files: `03-hangman/hangman.html`, `03-hangman/styles.css`, `03-hangman/hangman.js`.

### Blackjack

A game of blackjack on a green table. You want a total closer to 21 than the dealer, without going past 21.

The page gives you the table, the cards and the chips. You write the deck, the shuffle, the card values and the totals. You also write the dealer's rule and the decision about who won.

Files: `04-blackjack/blackjack.html`, `04-blackjack/styles.css`, `04-blackjack/blackjack.js`.

### Battleship

Two seas on a plotting table. You can see your own fleet. You cannot see theirs. You take it in turns to fire one shot until one fleet is gone.

The page gives you the table, the charts and the pegs. You write the grid, the ship placing, and the firing. You also write the rule for when a ship has sunk, and the enemy's turn.

Files: `05-battleship/battleship.html`, `05-battleship/styles.css`, `05-battleship/battleship.js`.

### Paint

A sheet of paper taped to a drawing board, a tin of ten paints and four nibs. You draw with the mouse. Then you take it back: undo, redo, and clear the whole sheet.

The page gives you the bench, the paints and the keys. You write the drawing itself, and the history that makes undo possible. A canvas remembers nothing, so the program has to remember every stroke.

Files: `06-paint/paint.html`, `06-paint/styles.css`, `06-paint/paint.js`.

### Balloon stall

A shooting stall on the pier at dusk. Balloons float up out of the sea. A brass cannon follows your mouse, and a dart arcs towards whatever you clicked.

The page gives you the stall, the sky and the keys. You write the balloons, the aiming and the darts. You also write the rule for a hit, and what a fresh game looks like.

This is the first program that keeps going when you do nothing. Everything in it moves by the time that passed, not by a fixed number of pixels.

Files: `07-balloons/balloons.html`, `07-balloons/styles.css`, `07-balloons/balloons.js`.

### Parachuter

A gun post on a ridge at first light. Planes cross the sky and drop paratroopers. Each one falls, opens a chute, lands, then walks at your post.

The page gives you the post, the sky and the keys. You write the troopers, their three states, the shells and the explosions. You also write the rule for two boxes touching.

This is the first game with four kinds of thing in it, and each kind moves by its own rule. Every one of them is the same shape of object.

Files: `08-parachuters/parachuters.html`, `08-parachuters/styles.css`, `08-parachuters/parachuters.js`.

### Phaser remake

The lookout post again. Same planes, same troopers, same three sandbags. This time a library called Phaser writes most of it.

The page gives you the post and the library. You write eight small functions. Each one has a bigger one in project 8 to compare it with, and the comparison is the point.

Nine functions become eight, and the eight are a few lines each. The loop, the moving and the collision test all come free. Two things get harder, and the file says which two.

Files: `09-phaser/remake.html`, `09-phaser/styles.css`, `09-phaser/remake.js`, `09-phaser/phaser.min.js`.

### Alien Raid

An arcade cabinet in a dark room. A swarm of aliens marches down the screen. You fly along the deck and shoot up at them.

The page gives you the cabinet, the pictures and the keys. You write the steering, the firing, the swarm and the waves. You also write what happens when a bomb finds your ship.

This is the first game you play with the keyboard. It is also the first one where the enemies move as one block, and moving that block is the one job the library refuses to do for you.

Files: `10-aliens/aliens.html`, `10-aliens/styles.css`, `10-aliens/aliens.js`, `10-aliens/phaser.min.js`.

### The Cheese Vault

A maze in a bank vault. You are a mouse eating the cheese. Cats prowl the corridors.

The page gives you the door, the pictures and the keys. You write the map: how a cell becomes a spot on the screen, how the vault gets built, what counts as a wall, and how the mouse steps from one cell to the next.

This is the first game with walls in it. It is also the first where the level is not a picture. It is twelve lines of characters that the program reads, asks questions of, and changes as you play.

Files: `11-vault/vault.html`, `11-vault/styles.css`, `11-vault/vault.js`, `11-vault/phaser.min.js`.

### Cave Flyer

A little mining ship in a long, dark cave. Gravity pulls it down, and the engine pushes it up. Touch the rock and it breaks.

The page gives you the console, the pictures and the keys. You write the camera: where a rock in the cave shows up in the window, how the camera follows the ship, and how it stops at the ends of the cave. You also write the engine, and the rule for touching rock.

This is the first world bigger than the window. Every picture in it has two positions. One is where it lives in the cave. The other is where it shows up in the window.

Files: `12-cave/cave.html`, `12-cave/styles.css`, `12-cave/cave.js`, `12-cave/phaser.min.js`.

### Rooftop Run

A courier running across city rooftops at sunset. He never stops and never slows down. All you can do is jump.

The page gives you the handheld, the pictures and the keys. You write the speed he runs at and the jump. You write the two functions that decide how far apart the obstacles go and what each one is. You also write the function that builds the rooftops ahead of you, and the one that throws away the rooftops behind you.

This is the first game with no map. The world is made a few steps before you reach it, and forgotten a few steps after you pass it. It is also the first program of yours that remembers anything after the page closes.

Files: `13-runner/runner.html`, `13-runner/styles.css`, `13-runner/runner.js`, `13-runner/phaser.min.js`.

### One program, many files

Rooftop Run again. Same rooftops, same crates, same sunset. Nothing about the game changed at all.

What changed is the code. One file of 1203 lines became six files, and each one has a single job: the numbers, the best score, the rooftops, the runner, the readouts, and the file that starts everything.

There is nothing to write in this project. You read the six files, you see why each line ended up where it did, and you learn git, which is how a program remembers every version of itself.

The rack down the side counts the jobs each file does while you play.

Files: `14-split/split.html`, `14-split/styles.css`, `14-split/numbers.js`, `14-split/record.js`, `14-split/world.js`, `14-split/runner.js`, `14-split/rack.js`, `14-split/game.js`, `14-split/phaser.min.js`.

### Client and server

Stars fall into a meadow at night. You catch them in a net for thirty seconds. Then your score leaves the computer.

This project has two programs in it. The page is the one you know. The second one is a server, and it runs in a terminal instead of a browser. It holds one score board for everybody who plays.

You write six functions this time, three in each program. The server's three sort the board, check that an arriving score is really a score, and add it to the list. The page's three ask for the board, draw it, and send your own score.

Your best score and mine end up on one list, from two computers. Nothing you have written before could do that.

Files: `15-scores/scores.html`, `15-scores/styles.css`, `15-scores/scores.js`, `15-scores/server.js`, `15-scores/scores.json`, `15-scores/phaser.min.js`.

Start the server first. Open a terminal in `15-scores` and run `node server.js`.

### Tank Duel

Two tanks in a sand yard full of concrete blocks. Two players share one keyboard. Blue drives with W A S D, and Red drives with the arrow keys.

The page gives you the console, the arena and the keys. You write the tank: which way it faces, how it drives, how it stops at a wall, and where its gun points. Then you write the shells: firing, flying, bouncing, and what a hit does to a tank.

This is the first game where things move at any angle. It is also the first where walls stop something that is not on a grid. The tank moves first, then takes back the part of the move that hit.

Files: `16-tanks/tanks.html`, `16-tanks/styles.css`, `16-tanks/numbers.js`, `16-tanks/arena.js`, `16-tanks/tank.js`, `16-tanks/shells.js`, `16-tanks/rack.js`, `16-tanks/game.js`, `16-tanks/phaser.min.js`.

You write eight functions: four in `tank.js`, then four in `shells.js`.

### Tank Duel, with types

Tank Duel again. Same tanks, same blocks, same bouncing shells. Nothing about the duel changed.

What changed is the language. The files are TypeScript now, which is JavaScript with types. A type is a written-down shape, and the computer checks every line against it before the game runs.

Every function already works, because you wrote them all in project 16. You write six types: a point, a tank, a shell, a hit, and the signatures of the eight functions. Every type you finish makes the list of errors shorter, until it is empty.

Files: `17-typescript/tanks.html`, `17-typescript/styles.css`, `17-typescript/numbers.ts`, `17-typescript/arena.ts`, `17-typescript/tank.ts`, `17-typescript/shells.ts`, `17-typescript/rack.ts`, `17-typescript/game.ts`, `17-typescript/package.json`.

This one does not open by double-clicking. Open a terminal in `17-typescript`, run `npm install` once, then run `npm run dev`.

### Map editor

A map on a drafting table, under glass. You pick grass, road, sand, forest, water or rock, then click and drag to paint it. Give the map a name and save it.

Every kind of ground is one line in a table. The palette, the pictures and the saved maps all read that table, so a new kind of ground is one new line.

You write seven functions: making a map, painting it, counting it, and turning it into letters and back. You also write your first two tests, which are small programs that check your functions give the right answers. You write each test before the function it checks.

Files: `18-editor/editor.html`, `18-editor/styles.css`, `18-editor/numbers.ts`, `18-editor/terrain.ts`, `18-editor/map.ts`, `18-editor/map.test.ts`, `18-editor/rack.ts`, `18-editor/editor.ts`, `18-editor/server.ts`, `18-editor/package.json`.

Open three terminals in `18-editor`. Run `npm install` once. Then run `npm run dev` in the first, `npm run server` in the second, and `npm test` in the third.

### Unit selection

A command post with six blue tanks on a map from the editor. Click a tank to pick it, or drag a box round several. Then click the ground, and they drive there.

A click never moves a tank. It only changes what the tank remembers: whether it is picked, and where it is going. Every frame, the tanks read that and drive a little way.

You write eight functions: finding the tank under the mouse, picking one, picking every tank in a box, giving an order, and driving. You also write two tests. The tanks drive in straight lines, so the water stops them, and project 20 fixes that.

Files: `19-units/units.html`, `19-units/styles.css`, `19-units/numbers.ts`, `19-units/terrain.ts`, `19-units/map.ts`, `19-units/units.ts`, `19-units/units.test.ts`, `19-units/rack.ts`, `19-units/game.ts`, `19-units/package.json`.

Open two terminals in `19-units`. Run `npm install` once. Then run `npm run dev` in the first and `npm test` in the second.

### Pathfinding

The six tanks again, on a route finder desk. Pick some tanks and click the ground. Each tank searches the map for a route round the rock and the water, then drives along it.

A search keeps a list of cells to look round next, called the frontier. It takes a cell out, and adds the cells next door that nobody has found yet. When the frontier is empty, no route exists. You watch the first tank's search spread across the map, with a number on every cell.

You write seven functions: the cells next door, starting a search, one step of it, following the trail back, the whole route, a guess, and A\*'s choice of the next cell. You also write two tests. Breadth-first and A\* differ in that one choice, and a button lets you compare them.

Files: `20-pathfinding/paths.html`, `20-pathfinding/styles.css`, `20-pathfinding/numbers.ts`, `20-pathfinding/terrain.ts`, `20-pathfinding/map.ts`, `20-pathfinding/paths.ts`, `20-pathfinding/paths.test.ts`, `20-pathfinding/units.ts`, `20-pathfinding/rack.ts`, `20-pathfinding/game.ts`, `20-pathfinding/package.json`.

Open two terminals in `20-pathfinding`. Run `npm install` once. Then run `npm run dev` in the first and `npm test` in the second.

## Suggested learning path

1. **Start with the calculator.** It is the smallest program. You meet the main ideas one at a time: remembering values, listening for clicks, and changing the screen.
2. **Then build the elevator.** It is a bigger machine. You use those same ideas, add a queue, and keep the whole machine in one sensible state.
3. **Then build hangman.** You learn strings, loops and true/false values. You also learn the idea under both earlier projects: everything on the screen comes from a small amount of memory.
4. **Then build blackjack.** You learn objects, randomness, and rules with several cases. The program is always in one named phase.
5. **Then build battleship.** You learn maps. A grid is a list of rows, and each row is a list of squares. You also learn how a program keeps a secret from you.
6. **Then build the paint app.** You learn the canvas, and you learn that it forgets everything. You keep the drawing yourself, and undo comes free.
7. **Then build the balloon stall.** You learn the game loop. Everything moves by time, and gravity turns out to be one line.
8. **Then build the lookout post.** You learn sprites. Four kinds of thing move at once, and one of them changes its mind twice on the way down.
9. **Then build it again with Phaser.** You learn what a library is. You also learn what it takes away, and what it makes harder.
10. **Then build Alien Raid.** You learn the keyboard. You also learn that a formation is one thing, and that a game can get harder without anybody writing a difficulty curve.
11. **Then build the cheese vault.** You learn maps. The level is data you can read and change, and one `if` turns out to be every wall in the game.
12. **Then build the cave flyer.** You learn cameras. Screen position is world position minus camera position, and that one subtraction puts the whole cave in the window.
13. **Then build Rooftop Run.** You learn how a game with no end makes its world as you go, and throws away what you have passed. Your best score is the first thing you write that lives through closing the page.
14. **Then split it into six files.** You write nothing new. You learn where code goes, why the order of the script tags matters, and how git remembers every version of a program.
15. **Then write a server.** You learn that a server is just a second program, and that two programs only ever ask each other for things. You also learn `await`, which is how a program waits for an answer without freezing.
16. **Then build Tank Duel.** You learn to drive at any angle, and to stop at a wall by taking back the part of a move that hit. A bounce turns out to be the same trick with one more line.
17. **Then add types to it.** You learn what a type is, and what it catches before the game runs. You also learn what it cannot catch, and you install your first tools with npm.
18. **Then build the map editor.** You learn to describe things in a table instead of in code. You also write your first tests, and you write each one before the function it checks.
19. **Then command the tanks.** You learn that a click only changes what a tank remembers, and the frame does the driving. One order to a group turns out to be one goal for each tank.
20. **Then teach the tanks to find a way.** You learn how a search spreads from a frontier, and how an empty frontier proves there is no route. Breadth-first and A\* turn out to differ in one choice.

More projects will appear here over time. `ROADMAP.md` lists all of them. `showcase.html` shows the same list as a map.

## What comes next

Resources are next. Workers gather, production takes time, and counters and progress bars show it happening.

The trail then runs to a small strategy game. It has one map, two teams, two unit types, one resource, one building, and one way to win.

### Three moments where the rules change

Three projects on the trail change how you work, not just what you build.

- **Project 14.** You split one finished game into several files. You also learn git.
- **Project 15.** You write a second program, a server, so two computers can share one score table.
- **Project 17.** You move to TypeScript. From here you install things, and the page needs a build step before it runs.

Every project up to 13 is one JavaScript file. That is on purpose. One file is the easiest way to start, and project 14 is where you find out what it costs.

## Getting started

1. Open `01-calculator/calculator.html` in your browser.
2. Open `01-calculator/calculator.js` in a text editor.
3. Follow the comments in the file, from the top.
