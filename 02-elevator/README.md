# Simon's Elevator

A five-floor elevator that runs in your browser. A LEGO skyscraper stands on the left, with a real car inside its shaft. The control board on the right shows you what the machine is thinking. It shows which state the machine is in, which floors are waiting, and a log of every decision.

This is your second project. The calculator taught you variables, functions and arrays. The elevator teaches you something bigger. It teaches you how to write a program that does one small thing at a time. That program holds a strict order, for as long as it runs.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `elevator.html` | Builds the page: tower, buttons, readouts, log | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `elevator.js` | The elevator's rules | You |

Double-click `elevator.html` to open the simulator. After you change `elevator.js`, save the file and refresh the browser page.

Inside `elevator.js` six functions are marked `// TODO`. Write them in file order, from top to bottom. Each one you finish makes something new happen on the screen.

Every function carries two hints in its comments: a gentle hint first, then a stronger one. Try the gentle hint first. If you are still stuck, the answers are all together in a block at the very bottom of the file — scroll down to it when you want it, and only then.

## What you will learn

- What a state machine is, and why an elevator is a perfect example
- How a queue works: first in, first out
- What `null` means, and when to use it
- How `data-` attributes let HTML pass information to JavaScript
- How to pause a program with `setTimeout`
- How the browser draws smooth motion, one tiny step at a time

## Good to know

### What you already know from the calculator

These all work exactly the same here. Read `01-calculator/README.md` again if you want the full story.

- `let` and `const` make labelled boxes for values. An object is one value with named parts.
- Arrays are ordered lists. `.push(x)` adds to the end, `[0]` reads the first item, `.length` counts.
- Strings are text in quotes. Numbers are for maths. `Number('12')` converts one into the other.
- `if` and `else` make choices. `===` asks whether two values are exactly equal. `=` puts a value in a box.
- Functions are steps with a name. Parameters come in through the brackets. `return` sends a value back.
- `document.getElementById(id)` finds an element by its id. `.textContent` changes its text. `console.log` shows you what is really happening.

### The big idea: a state machine

An elevator may only do one thing at a time. It is opening its doors, or moving up, or waiting. It is never doing two of those at once.

A state machine is a program built on that rule. It works like this:

1. The program keeps one variable called `state`.
2. `state` always holds one exact name from a fixed list.
3. Nothing happens except by changing state, one name at a time.

The fixed list sits at the top of `elevator.js`, in `STATES`. The machine's whole journey moves from one name to the next:

```text
idle → waitingForRequest → choosingNextStop
  → movingUp or movingDown    (or straight to doorsOpening on the same floor)
  → doorsOpening → doorsOpen → doorsClosing
  → back to choosingNextStop if more floors wait, otherwise idle
```

Each change of name is called a transition. The page shows you every one of them. The LIVE STATE chip shows the current name. The diagram lights up the matching node. The transition log gains one new line. So you can watch your own program think.

### The elevator's memory

The `elevator` object holds everything the machine remembers. Each part has one job:

- `currentFloor` is where the car is standing right now.
- `state` is which of the eight names the machine is in.
- `waitingList` is the queue of floors that called, in the order they were pressed.
- `nextFloor` is the floor the car is travelling toward.
- `lastTime` is the time of the previous animation frame. Smooth motion needs it.

### New tool: arrays as queues

A queue is an array used in a fair way: first in, first out. People queue for a real lift the same way. The person who arrived first is served first.

```js
const waitingList = [];
waitingList.push(4);        // 4 joins the back of the queue
waitingList.push(2);        // the queue is now [4, 2]
waitingList.shift();        // 4 leaves from the FRONT. The queue is now [2]
waitingList.includes(2);    // true. It asks whether 2 is already in the queue.
```

- `.push(x)` puts a new request at the back.
- `.shift()` serves the front request and removes it.
- `.includes(x)` asks whether a floor is already waiting. Use it so a second press does not add the same floor twice.

### New tool: null, the deliberately empty box

`null` means "this box holds nothing yet, and that is on purpose". It is different from zero, and different from empty text.

```js
let nextFloor = null;        // no destination chosen yet
if (nextFloor === null) {
  // the car has nowhere to go
}
```

Watch for `null` in `elevator.js`. `nextFloor` starts as `null`. One of your TODO functions should return `null` when the queue is empty.

### New tool: data- attributes

The calculator found elements by id. This project adds a second way.

Any HTML attribute that starts with `data-` is a note attached to an element. JavaScript can read that note.

```html
<button class="floor-call" data-floor="5">5</button>
```

```js
const note = button.dataset.floor;   // the string '5'
const floor = Number(note);          // the number 5
```

Every floor button carries its own `data-floor`. The diagram nodes carry `data-state-node`. That is how the page knows which node to light up.

### New tool: template strings

A template string builds text out of pieces. Use backticks instead of quotes. Put any value inside `${ }`:

```js
const floor = 4;
const message = `Floor ${floor} is waiting.`;   // 'Floor 4 is waiting.'
```

The transition log builds its lines this way.

### New tool: time, for pauses and smooth motion

This project uses two kinds of timing. Both are measured in milliseconds. One thousand milliseconds is one second.

`setTimeout(steps, ms)` waits, then runs the steps once:

```js
setTimeout(function () {
  // this runs once, after the wait
}, 800);
```

The door states need `setTimeout`. They show a state, wait a moment, then move to the next state.

Smooth motion works differently. The bottom of `elevator.js` contains a loop. That loop asks the browser to call your function again the next time it draws a picture. The browser redraws about 60 times every second, and it passes your function the current time in milliseconds.

So your job inside that function is small. Compare the time with `elevator.lastTime`. Move the car a small step. Stop when the car arrives.

The car's position is a percentage. `FLOOR_TOPS`, at the top of the file, gives the `top` value that parks the car on each floor. Floor 5 sits at `12.0`, which is a small number near the top of the shaft. Floor 1 sits at `85.7`, near the bottom. To draw one position, call the helper `showCarAtTop(topPercent)`.

### The helpers you are given

Section 2 of `elevator.js` is complete. Read it, but do not rewrite it.

- `showText`, `showFloor` and `showCarAtTop` write values onto the readouts and the car.
- `showPendingButtons` and `showSafeRequestFeedback` light the buttons and show the practice message.
- `explainState` and `renderStateDiagram` keep the diagram and its sentence up to date.
- `addLogLine` adds one line to the top of the transition log.

`setState(nextState, reason)` is the important one. It is the only way your code should change state. It checks that the name is real, records it, redraws the diagram, and writes the log line. If you call it with the name the machine already has, it does nothing. That keeps the log honest.

So your TODO functions decide **when** to change state. `setState` decides **how** that change is drawn.

### Already written for you

Section 5 of `elevator.js` is already written, like the bottom of the calculator file.

- `registerFloorButtons` finds every button with a `data-floor` attribute. It connects each click to `requestFloor`.
- `flashButton` runs the short button animation with a `setTimeout`.
- `init` parks the car on a random floor, then starts the animation loop. It picks the floor with `Math.floor(Math.random() * 5) + 1`, which gives a whole number from 1 to 5.
- `animationLoop` runs forever. It calls your `moveElevator` only while the state says the car should be travelling.

The practice buttons light up, and the request counter counts, even before your queue exists. That feedback uses a separate list called `previewRequests`. So it never touches your `waitingList`.

### Finding your mistakes

The console works exactly as it did in the calculator, so open it the same way.

What is new here is that the page keeps a log of its own. When the car does the wrong thing, read the transition log before you print anything. It shows you the exact path your machine took, one state at a time, which is usually the answer already.
