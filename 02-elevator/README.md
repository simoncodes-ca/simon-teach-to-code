# Simon's Elevator

A five-floor elevator simulator that runs in your browser. A LEGO skyscraper stands on the left with a real car inside its shaft. The control board on the right shows the machine's brain: which state it is in, which floors are waiting, and a log of every decision.

This is your second project. The calculator taught you variables, functions and arrays. The elevator teaches you something bigger: how to write a program that does one small thing at a time, in a strict order, for as long as it runs.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `elevator.html` | Builds the page: tower, buttons, readouts, log | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `elevator.js` | The elevator's brain | You |

Double-click `elevator.html` to open the simulator. After you change `elevator.js`, save and refresh the browser page.

Inside `elevator.js` six functions have `// TODO` in them. Work through them in file order, top to bottom. Every one you finish makes something new happen on screen. Each one carries three levels of help in its comments: a gentle hint, a stronger hint, and the answer if you choose to read it. Try the gentle hint first.

## What you will learn

- What a state machine is, and why an elevator is a perfect one
- How a queue works: first in, first out
- What `null` means and when to use it
- How `data-` attributes let HTML hand information to JavaScript
- How to pause a program with `setTimeout`
- How the browser draws smooth motion, one tiny step at a time

## Good to know

### What you already know from the calculator

These still work exactly the same. Flip back to `01-calculator/README.md` if you want the full story.

- `let` and `const` make labelled boxes for values. Objects are backpacks with labelled pockets.
- Arrays are ordered lists. `.push(x)` adds to the end, `[0]` reads the first item, `.length` counts.
- Strings are text in quotes; numbers are for maths; `Number("12")` converts.
- `if` and `else` choose. `===` asks "exactly equal?" and `=` puts a value in a box.
- Functions are named recipes. Parameters come in through the brackets, `return` hands a value back.
- `document.getElementById(id)` finds an element by its name tag; `.textContent` changes its words; `console.log` is your torch for finding mistakes.

### The big idea: a state machine

An elevator may only do one thing at a time. It is opening its doors, or moving up, or waiting — never two of those at once. A state machine is a program built on that rule:

1. The program keeps one variable called `state`.
2. `state` always holds one exact name from a fixed list.
3. Nothing real happens except by changing state, one name at a time.

The fixed list lives at the top of `elevator.js` as `STATES`. The machine's whole journey is just walking from name to name:

```text
idle → waitingForRequest → choosingNextStop
  → movingUp or movingDown    (or straight to doorsOpening on the same floor)
  → doorsOpening → doorsOpen → doorsClosing
  → back to choosingNextStop if more floors wait, otherwise idle
```

Every change of name is called a transition. The page shows the machine's current name in the LIVE STATE chip, lights the matching node in the diagram, and writes one line in the transition log. So you can watch your own program think.

### The elevator's memory

The `elevator` object is the machine's backpack. Each pocket has a job:

- `currentFloor` — where the car is standing right now
- `state` — which of the eight names the machine is in
- `waitingList` — the queue of floors that called, in press order
- `nextFloor` — the floor the car is travelling toward
- `lastTime` — the time of the previous animation frame, used for smooth motion

### New tool: arrays as queues

A queue is an array used in a fair way: first in, first out. People queue for a lift the same way. The person who arrived first is served first.

```js
const waitingList = [];
waitingList.push(4);        // 4 joins the back of the queue
waitingList.push(2);        // now [4, 2]
waitingList.shift();        // 4 leaves from the FRONT. Now [2]
waitingList.includes(2);    // true — is 2 already in the queue?
```

- `.push(x)` — a new request joins at the back.
- `.shift()` — the front request is served and removed.
- `.includes(x)` — ask whether a floor is already waiting, so a second press does not queue it twice.

### New tool: null, the empty pocket

`null` means "this pocket deliberately holds nothing yet". It is different from zero and different from an empty string.

```js
let nextFloor = null;        // no destination chosen yet
if (nextFloor === null) {
  // then the car has nowhere to go
}
```

Watch for it in `elevator.js`: `nextFloor` starts as `null`, and one of your TODO functions should return `null` when the queue is empty.

### New tool: data- attributes

The calculator found things by id. This project adds a second way: any HTML attribute starting with `data-` is a note pinned to an element, and JavaScript can read it.

```html
<button class="floor-call" data-floor="5">5</button>
```

```js
const note = button.dataset.floor;   // the string "5"
const floor = Number(note);          // the number 5
```

Every floor button carries its own `data-floor`. The state diagram nodes carry `data-state-node`, which is how the page knows which node to light up.

### New tool: template strings

A template string builds text out of pieces. Use backticks instead of quotes, and put any value inside `${ }`:

```js
const floor = 4;
const message = `Floor ${floor} is waiting.`;   // "Floor 4 is waiting."
```

The transition log lines are built this way.

### New tool: time — pauses and smooth motion

Two kinds of timing, measured in milliseconds. One thousand milliseconds is one second.

`setTimeout(recipe, ms)` waits, then runs the recipe once:

```js
setTimeout(function () {
  // runs once, after the wait
}, 800);
```

The door states need this: show a state, wait a moment, then move to the next.

Smooth motion is different. The wiring at the bottom of `elevator.js` contains a loop that asks the browser: "call my function again next time you draw a picture". The browser redraws about 60 times every second and hands your function the current time in milliseconds. Your job inside that function: each time it is called, compare the time with `elevator.lastTime`, nudge the car's position a small step, and stop when it arrives.

The car's position is a percentage. `FLOOR_TOPS` at the top of the file maps each floor to the `top` value that parks the car there. Floor 5 sits at `12.0` — a small number, near the top of the shaft. Floor 1 sits at `85.7`, near the bottom. Drawing one position is the given helper `showCarAtTop(topPercent)`.

### The helpers you are given

Section 2 of `elevator.js` is complete. Read it, but do not rewrite it:

- `showText`, `showFloor`, `showCarAtTop` — write values onto the readouts and the car
- `showPendingButtons`, `showSafeRequestFeedback` — light the buttons and show the practice message
- `explainState`, `renderStateDiagram` — keep the diagram and its sentence up to date
- `addLogLine` — add one line to the top of the transition log
- `setState(nextState, reason)` — the only way your code should change state. It checks the name is real, records it, repaints the diagram, and writes the log line. Called with the name the machine already has, it does nothing, so the log stays honest.

Your TODO functions decide WHEN to change state. `setState` decides HOW it gets painted.

### Already done for you

Section 5 of `elevator.js` is finished wiring, like the calculator's:

- `registerFloorButtons` finds every button with a `data-floor` attribute and connects its click to `requestFloor`.
- `flashButton` presses the keycap animation with a short `setTimeout`.
- `init` parks the car on a random floor using `Math.floor(Math.random() * 5) + 1`, which gives a whole number from 1 to 5, then starts the animation loop.
- `animationLoop` runs forever and calls your `moveElevator` only while the state says the car should be travelling.
- The practice buttons light up and the request counter counts even before your queue exists. That feedback uses a separate list, `previewRequests`, so it never touches your `waitingList`.

### Finding your mistakes

Same trick as the calculator. Right-click the page, choose Inspect, click the Console tab.

- Anything you print with `console.log("waitingList is", waitingList);` appears there.
- Mistakes appear in red, with a file name and a line number. Read them.

The transition log on the page is a second torch. If the car misbehaves, read the log: it shows the exact path your machine walked, one state at a time.
