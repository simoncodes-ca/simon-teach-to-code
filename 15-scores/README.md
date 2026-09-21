# Star Catch, and the board everybody shares

Stars fall into a meadow for thirty seconds. You move a net along the grass and catch them. Gold stars are worth 1 and blue stars are worth 3.

The game is given to you finished. It is not the project.

The project is what happens when the round ends. Your score leaves this computer and goes to a second program, and that program keeps one list for everybody.

## The big idea

**One program cannot hold a list that two computers share.**

Project 13 saved your best score in the browser's own notebook. That notebook belongs to one browser, on one machine. Nobody else can ever see it, and neither can you from a different computer.

So we write a second program. It is called a server, and it has one job: hold the list and answer questions about it.

```text
   your page  ------ asks ------>  the server  <------ asks ------  my page
              <---- answers ----               ---- answers ---->
```

The server is not a webpage. It has no buttons, no pictures and no screen. It runs in a terminal and waits.

## The two questions

Everything the two programs say to each other is one of these.

| What the page says | What it means | What comes back |
|---|---|---|
| `GET /scores` | Hand me the board, please | The top ten scores |
| `POST /scores` | Here is a new score, keep it | The board with you on it |

A GET asks. A POST carries something.

That is not a rule we invented. It is how your browser talks to every website you have ever opened.

## Start the server first

You need a terminal, in this folder.

```bash
cd 15-scores
node server.js
```

It prints something like this, and then it sits there:

```text
The score server is listening. It knows 3 scores.

  On this computer:  http://localhost:4000
  On your wifi:      http://192.168.1.24:4000
```

Leave that terminal alone. While it is running, the server is listening. Press Ctrl and C together to stop it.

Now open `scores.html` by double-clicking it, the same as every other project.

## The six functions

This is the first project with functions in two different files. Write the server's three first, because the page has nothing to talk to until they exist.

| Order | File | Function | What it does |
|---|---|---|---|
| 1 | `server.js` | `sortedTop` | The list, best first, top ten only |
| 2 | `server.js` | `isGoodScore` | Is this really a score? |
| 3 | `server.js` | `addScore` | Put a new score on the list and save it |
| 4 | `scores.js` | `getScores` | Ask the server for the board |
| 5 | `scores.js` | `showScores` | Put the board on the page |
| 6 | `scores.js` | `sendScore` | Send your own score |

Each file has its own answer key, at its own bottom. Opening one never gives away the other.

**Stop the server and start it again after you change `server.js`.** It read the file once, when it started. It does not notice that you have edited it.

## The files

| File | What it does | Who writes it |
|---|---|---|
| `scores.html` | Builds the page: the board, the screen, the rack | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `phaser.min.js` | The library. The same copy as projects 9 to 14 | Never edit this |
| `scores.js` | The game, and the three functions that talk to the server | You write three |
| `server.js` | The second program. It holds the list | You write three |
| `scores.json` | The list itself, on the disk | The server writes it |

The server stores every accepted score in `scores.json`. `sortedTop` limits the board response to 10 entries.

## What you will learn

- Why some things are impossible for a page on its own
- What a server is, and that it is just another program
- What a request and a response are
- `fetch`, and how a page asks for something
- `async` and `await`, which is how a program waits without freezing
- JSON as the thing two programs send each other
- Why a program must never trust what arrives

## Good to know

### What you already know

These all work the same way here. Read `01-calculator/README.md` through `14-split/README.md` again for the full story.

- `JSON.stringify` turns an object into text, and `JSON.parse` turns it back.
- `localStorage` keeps something in this browser. Your name box uses it.
- A key is a state, so you ask about it on every frame.
- Everything moves by `speed × seconds`.
- A loop that takes things out of a list counts backwards.
- A moving thing is a plain object: `{ worth, x, y, vy }`.
- `sort` with a rule puts a list in order.

The whole game in `scores.js` is given, because every idea in it is one you have already met.

### await, which is the new word

An `async` function is a function that is allowed to wait.

Inside one, you may write `await`. It means: stop here, let the rest of the page carry on, and pick this up again when the answer arrives.

```js
const response = await fetch('http://localhost:4000/scores');
const answer = await response.json();
```

Two `await`s, because two things take time. Getting the answer across the network takes time. Reading the words out of it takes time as well.

Leave out an `await` and you get a promise instead of an answer. A promise is the program saying "this will be something later". Print one and you see `Promise { <pending> }`, which is the clearest sign that an `await` is missing.

Why wait at all? Because the answer might take a second to arrive over wifi. A page that stopped dead for a whole second would look broken every time it asked anything.

### Watch the line

The Line panel on the rack is this project made visible.

The left lamp lights when your page asks. A blip runs along the cable. The right lamp lights when the answer comes back. Underneath, the rack shows what was asked, what came back, and how long it took in thousandths of a second.

Under that is the raw line. That is the exact text the server sent, before anything was done with it. When the board looks wrong, read the raw line first. It tells you whether the trouble is at your end or the server's.

The terminal shows the same conversation from the other side. Play a round, press Send, and a line appears there about you.

### The browser asks first

A browser will not let a page talk to a program somewhere else unless that program says it is allowed.

Your page was opened by double-clicking, so as far as the browser is concerned it comes from nowhere. The server is somewhere else. Different places.

So before your POST is sent at all, the browser sends a small question of its own, and waits for a yes. The server answers that question in `allowTheBrowser`, which is three lines in the given wiring.

Take those three lines out and every single request fails, with an error that never mentions them. It is worth breaking once, so that you recognise it later.

### Two computers, one board

This is the part worth doing with somebody else.

One of you runs the server. That computer prints a wifi address when it starts, something like `http://192.168.1.24:4000`.

The other one types that address into the Server box on the page. Now both pages are talking to one list.

Play a round each. Both names appear on both boards. Nothing you have written before this could do that.

Both computers have to be on the same wifi.

### Never trust what arrives

`isGoodScore` is small, and it is the most serious function in the project.

Everything else you have written could only ever be used by you. This server can be talked to by any program on the network. What arrives might not be a score at all.

So the server checks before it keeps anything. It is an object, the name is real text, the score is a real number, and the score is not below zero.

`addScore` then keeps only what it uses: a name and a number. Never store anything about a person that your program does not need.

### Finding your mistakes

The line under the screen names the empty function. Read it first.

| What you see | The function to check |
|---|---|
| The rack says `stub` and names a function | That function, in `server.js` |
| No answer, and the line goes red | The server is not running |
| The raw line shows scores, and the board is empty | `showScores` |
| The board never changes when you send | `sendScore` |
| The answer says refused | `isGoodScore`, or your Name box is empty |
| The board shows the lowest score first | `sortedTop`, and the order of `a` and `b` |
| The board shows every score ever played | `sortedTop`, and the second `slice` |
| Your score vanishes when the server restarts | `addScore`, which forgot to call `saveScores` |
| `Promise { <pending> }` anywhere | A missing `await` |

The last three are the good bugs of this project.

A board with every score on it is a `sortedTop` that sorted and never cut the list down. It looks fine with four scores and silly with forty.

A score that vanishes on a restart is the difference between the list in memory and the list on the disk. `addScore` changed the first one only. Open `scores.json` in your editor and you can see for yourself which one is true.

A stray `Promise` means you took the envelope and never opened it.

You can also print things:

```js
console.log(await getScores());
console.log(whereTheServerIs());
```

And you can talk to the server without the page at all:

```bash
curl http://localhost:4000/scores
```

### If it will not start

**`EADDRINUSE`** means a server is already running on door 4000. You started it twice. Go to the other terminal and press Ctrl and C.

**`Cannot find module`** means you are in the wrong folder. `cd` into `15-scores` first.

**Nothing happens when you press Send** means the server stopped. Look at the terminal.

### Try this next

- **A round today.** Keep the date with each score, and show a Today board as well as an all-time one.
- **Say how many rounds.** The server already sees every score. Count them, and let the page show the number.
- **Refuse a silly score.** Nobody catches 900 stars in thirty seconds. Add a top limit to `isGoodScore` and try to beat it.
- **One name, one score.** Keep only a person's best, instead of every round they have played.
- **A second game.** Give the server `/scores/star-catch` and `/scores/rooftop`, and put project 13's best score on the same server.

## What comes next

Project 16 is the tank game. You drive, aim and fire, and things get in the way.

It is the last project that opens by double-clicking. After it, project 17 changes the tools.
