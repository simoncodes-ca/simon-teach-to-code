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

## Suggested learning path

1. **Start with the calculator.** It is the smallest program. You meet the main ideas one at a time: remembering values, listening for clicks, and changing the screen.
2. **Then build the elevator.** It is a bigger machine. You use those same ideas, add a queue, and keep the whole machine in one sensible state.
3. **Then build hangman.** You learn strings, loops and true/false values. You also learn the idea under both earlier projects: everything on the screen comes from a small amount of memory.
4. **Then build blackjack.** You learn objects, randomness, and rules with several cases. The program is always in one named phase.

More projects will appear here over time. `ROADMAP.md` lists all of them. `showcase.html` shows the same list as a map.

## What comes next

The next four projects stay ordinary web pages, then the pictures start to move.

1. **Battleship.** Your first map. You learn grids, coordinates and turns.
2. **Paint app.** Your first canvas. You draw with the mouse, then add undo.
3. **Balloon shooting.** Your first game that animates itself. You learn gravity and collisions.
4. **Parachuter.** Many things moving at once, each one with its own rules.

After those, you rebuild a game you already finished using Phaser, a real game library. You will be able to point at every part the library replaced.

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
