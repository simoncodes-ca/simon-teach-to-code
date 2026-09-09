# Teach to Code

This is how Simon teaches his kids to code.

Every project here is a small, real program. The page is already built. You write the code that makes it work.

## How it works

Each project gives you a finished web page. The HTML file holds the buttons and the layout. The CSS file decides how everything looks. You never edit those two files.

The JavaScript file is yours. Some of its functions are empty. Each empty function has a name, a description in plain words, and hints.

Write those functions one at a time, in the order they appear in the file. Each function you finish makes something new happen on the screen.

For every project on this page, you install nothing. Open the HTML file in a browser. Open the JavaScript file in a text editor. Put the two windows side by side. Change the JavaScript, save it, then refresh the browser page.

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

## Suggested learning path

1. **Start with the calculator.** It is the smallest program. You meet the main ideas one at a time: remembering values, listening for clicks, and changing the screen.
2. **Then build the elevator.** It is a bigger machine. You use those same ideas, add a queue, and keep the whole machine in one sensible state.
3. **Then build hangman.** You learn strings, loops and true/false values. You also learn the idea under both earlier projects: everything on the screen comes from a small amount of memory.
4. **Then build blackjack.** You learn objects, randomness, and rules with several cases. The program is always in one named phase.
5. **Then build battleship.** You learn maps. A grid is a list of rows, and each row is a list of squares. You also learn how a program keeps a secret from you.
6. **Then build the paint app.** You learn the canvas, and you learn that it forgets everything. You keep the drawing yourself, and undo comes free.
7. **Then build the balloon stall.** You learn the game loop. Everything moves by time, and gravity turns out to be one line.
8. **Then build the lookout post.** You learn sprites. Four kinds of thing move at once, and one of them changes its mind twice on the way down.

More projects will appear here over time. `ROADMAP.md` lists all of them. `showcase.html` shows the same list as a map.

## What comes next

The pictures move now, so the games get bigger.

1. **Phaser remake.** The lookout post again, built with a game library.
2. **Aliens.** The first new game built on that library.
3. **Maze.** A map kept as data, and walls you cannot walk through.

The remake is a comparison, not a bigger game. You will be able to point at every part the library replaced.

The trail then runs to a small strategy game. It has one map, two teams, two unit types, one resource, one building, and one way to win.

### Three moments where the rules change

Three projects on the trail change how you work, not just what you build.

- **Project 14.** You split one finished game into several files. You also learn git.
- **Project 15.** You write a second program, a server, so two computers can share one score table.
- **Project 17.** You move to TypeScript. From here you install things, and the page needs a build step before it runs.

Every project before 14 stays one JavaScript file that you open by double-clicking. That is on purpose. One file is the easiest way to start.

## Getting started

1. Open `01-calculator/calculator.html` in your browser.
2. Open `01-calculator/calculator.js` in a text editor.
3. Follow the comments in the file, from the top.
