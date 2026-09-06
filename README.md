# Teach to Code

This is how Simon would teach his kids to code. 

Here you will findd fun coding experiments for somebody new to coding. Every project is a small, real thing that comes to life as you write the code that makes it work.

## How it works

Each project gives you a finished web page. The HTML holds the buttons and layout. The CSS holds the look. You never need to edit those two files.

The JavaScript file is yours. It starts as a skeleton: every function has a name, a plain-language description, and hints. You fill the functions in, one at a time, in file order. Each one you finish makes something new happen on screen.

There is nothing to install. Open the HTML file in a browser and the JavaScript file in a text editor, side by side. Edit the JavaScript, save, and refresh the browser to see your change.

## The projects

### Calculator

A working calculator: digits, a decimal point, `+ - × ÷`, equals, and clear. The page gives you the buttons. You build the memory (what the calculator remembers between presses), the display, and the arithmetic.

Files: `01-calculator/calculator.html`, `01-calculator/styles.css`, `01-calculator/calculator.js`.

There is also a second skin, `calculator-anna.html`, that dresses the same page differently and shares the same JavaScript. It shows how the look and the logic live apart.

### Elevator

A five-floor building with a working elevator. The call buttons light up and stay lit. The car travels between floors and opens its doors. The page gives you the building, the buttons, and a live diagram. You build the queue of floor requests and the state machine that decides what happens next. A state machine is a program that is always in exactly one named state, like `doorsOpen` or `movingUp`.

Files: `02-elevator/elevator.html`, `02-elevator/styles.css`, `02-elevator/elevator.js`.

## Suggested learning path

1. **Start with the calculator.** It is the smaller program. You meet the core ideas one at a time: remembering values, listening for clicks, and updating the screen.
2. **Then move to the elevator.** It is a bigger machine. You combine those ideas, add a queue, and keep a whole machine in a consistent state.

New projects will appear here over time. The path for now is calculator first, elevator second.

## Getting started

1. Open `01-calculator/calculator.html` in your browser.
2. Open `01-calculator/calculator.js` in a text editor.
3. Follow the comments in the file, from the top.
