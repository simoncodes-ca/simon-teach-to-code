# One program, many files

This is Rooftop Run again.

Same rooftops. Same crates. Same sunset, same jump, same best score. Play it and you cannot tell it apart from project 13.

The difference is in the folder. Project 13 was one file of 1203 lines. This is the same program cut into six.

**There is nothing to write in this project.** Every other project in this repository hands you empty functions. This one hands you a finished game and asks you to read it. The lesson is where the code went, and why.

This project uses classic script tags. Shared names and script order are part of the lesson. `import` and `export` arrive in project 17.

## Why one file stops working

Open `13-runner/runner.js` and scroll. It is a long way from the jump to the rooftops, and neither of them is near the saved score.

One file was fine for the calculator. It is starting to hurt here, in four ways.

- **Finding things takes scrolling.** You know the name of the function. You still have to hunt for it.
- **Everything can touch everything.** Any line in the file can change any number in it. When a number goes wrong, every line is a suspect.
- **Two people cannot work at once.** You and I both editing one file means one of us loses work.
- **You cannot reuse a piece.** The record code is good. Getting it into another game means picking it out of 1203 lines by hand.

Six files fix all four, and they cost you one new thing to keep straight. That is the trade, and it is the project.

## The six files

Each file has one job. You should be able to say what it is in a sentence, and if you cannot, the file is wrong.

| File | Its one job | Lines |
|---|---|---|
| `numbers.js` | The numbers the game is made of, and the table of obstacle kinds | 50 |
| `record.js` | The best score, and the only file that touches the browser's notebook | 63 |
| `world.js` | The rooftops. It builds them ahead of you and throws them away behind you | 114 |
| `runner.js` | The courier. Speed, jumping, gravity, and what counts as touching something | 95 |
| `rack.js` | Everything you read. The readouts, the line under the screen, and the card | 203 |
| `game.js` | Starting everything, and running the clock sixty times a second | 304 |

Open them in that order. It is also the order the page loads them in, and that is not a coincidence.

## The order matters

Look at the bottom of `split.html`:

```html
<script src="numbers.js"></script>
<script src="record.js"></script>
<script src="world.js"></script>
<script src="runner.js"></script>
<script src="rack.js"></script>
<script src="game.js"></script>
```

The browser reads those in order, top to bottom, as if they were one long file.

`numbers.js` goes first because it needs nobody. `game.js` goes last because it needs everybody. The moment `game.js` is read, it builds the Phaser game, and everything it calls has to exist by then.

Try it. Move the `game.js` line to the top, save, refresh, and read the error in the console.

## Names are shared, and that is the catch

The six files are not sealed off from each other. They share one set of names, exactly as if you had pasted them into one file.

That is what makes this work at all. `world.js` calls `runSpeed`, which lives in `runner.js`:

```js
function nextGap(distance) {
  const seconds = Math.max(MIN_GAP_TIME, START_GAP_TIME - distance * GAP_QUICKEN);
  return runSpeed(distance) * (seconds + Math.random() * GAP_SPREAD);
}
```

Nothing is asked for, and nothing is imported. It just works.

It costs you two things, and both bite eventually.

**Two files cannot use the same name.** Add `let speed` to `world.js` while `runner.js` already has one, and the page stops with an error. In a program this size you can keep every name in your head. In a big one you cannot.

**Nothing tells you where a name came from.** Reading `world.js`, there is no clue that `runSpeed` lives in another file. That is why every file here starts with a comment saying what it owns, and why `game.js` names the file beside each call.

Project 17 fixes both, with `import` and `export`. You cannot have them yet, because a page opened by double-clicking refuses to load a module. That is a rule of the browser, and the way past it is a build step, which arrives in project 17.

## The memory goes with the job

This is the part worth copying into every program you write from now on.

**The file that owns a job owns the memory for that job.**

- `record.js` holds `record`, and it is the only file that says `localStorage`.
- `world.js` holds `obstacles` and `builtTo`, and it is the only file that makes or destroys an obstacle.
- `runner.js` holds `runner` and `distance`, and it is the only file that moves him.
- `numbers.js` holds numbers that never change, so everybody may read them.

Now think about a bug. The best score is wrong, so you open `record.js`. It is 66 lines, and the whole story is in it. In project 13 that same bug meant reading 1203 lines to be sure nothing else had touched the record.

## The rack counts the files

The new panel on the right lists the six files, and counts the jobs each one does while you run.

Play for ten seconds and look at it.

`rack.js` and `game.js` are in the hundreds, because they work on every frame. `world.js` is in the tens, because it only works when an obstacle arrives or leaves. `runner.js` counts your jumps and landings. `record.js` moves twice a run.

`numbers.js` shows a dash. It never does a job at all, because it only remembers. A file like that is the easiest kind to trust.

The line under the screen names the file too. It used to say which function was empty. Here it says what just happened and who did it.

## Git

You have been working inside a git repository for thirteen projects without hearing about it.

**Git is a program that remembers every version of your code.** Not the last one. All of them, for ever, with a note from you about each.

That buys you two things worth having today. You can break a file on purpose and put it back. You can look at what you changed last Tuesday.

You need a terminal for this chapter, in the folder that holds this repository.

### Look at where you are

```bash
git status
```

That lists the files you have changed since the last saved version. A clean list means the folder matches what git has written down.

```bash
git diff
```

That shows the changes themselves, line by line. Lines with a `-` are gone. Lines with a `+` are new.

### Save a version

Saving a version is two steps, and the two steps confuse everybody at first.

```bash
git add 14-split/world.js
git commit -m 'Make the gaps a little wider'
```

`git add` chooses what goes in. `git commit` writes it down. The message after `-m` is a note to yourself, so write what you did, not what the file is called.

Two steps sound like one too many. They are there so you can save half your work. You changed four files, two of them are finished, so you add those two and commit them on their own.

A saved version is called a **commit**. It is the whole project at one moment, with your note attached.

### Look at the history

```bash
git log --oneline
```

That is every commit, newest first, one to a line:

```text
99bddd5 Add the rooftop runner as project 13
c762a1e Add the cave flyer as project 12
b42f881 Add the cheese vault as project 11
```

The short code at the front is the name of that commit. Git made it up, and it is how you point at one.

### Get back a file you have broken

This is the one that saves your afternoon.

You have changed `world.js`, the game will not start, and you cannot remember what you changed.

```bash
git restore 14-split/world.js
```

The file goes back to the last committed version. Your broken changes are gone, and they are gone for good, so only do this when you mean it.

That is why committing often is worth the trouble. Every commit is a spot you can get back to. A program that is working is worth a commit, even a small one.

### The four commands

| Command | What it does |
|---|---|
| `git status` | What have I changed? |
| `git diff` | Show me those changes |
| `git add` then `git commit -m '...'` | Write this version down |
| `git log --oneline` | What have I done before? |
| `git restore <file>` | Put that file back, I have broken it |

There is much more to git. Branches, remotes, merges and the rest can all wait. These five are what you need this year.

## What you will learn

- Why a program outgrows one file
- What a good file boundary looks like, and why memory goes with the job
- Why script tags load in order
- What it means for files to share one set of names, and what that costs
- Enough git to save your work and get it back

## Good to know

### What you already know

Everything in these six files is code you have already met. It is project 13's code, moved.

Read `13-runner/README.md` again for the game itself. Nothing about how it plays has changed, so nothing about it is explained twice here.

### Already written for you

All of it. There are no `// TODO` comments in this project, and no answer key at the bottom of any file, because there is nothing to answer.

This is the only project in the repository like that.

You can still add `#demo` or `#demo-over` to the end of the address, the same as projects 8 to 13.

### Finding your mistakes

The mistakes in this project are all mistakes about files, so the console is where they show up.

| What you see | What went wrong |
|---|---|
| `runSpeed is not defined` | A file used a name before the file holding it was loaded |
| `Identifier 'x' has already been declared` | Two files gave two different things the same name |
| The whole page is blank | One file has a mistake in it, so the browser gave up on that file. Read the first error only |
| Nothing at all happens, and no error | A script tag is missing, or the file name in it is spelled wrong |

Always read the **first** error. The ones under it are usually the first one's fault.

### Try this next

- **Break the order on purpose.** Move the `game.js` script tag to the top and read the error. Then put it back.
- **Give two files the same name.** Add `let distance = 0;` to the top of `world.js` and see what the browser says about it.
- **Move a function.** Take `metresNow` out of `runner.js` and put it in `rack.js`. It still works, and it is in a worse place. Say out loud why.
- **Add a seventh file.** Put the sounds in `sounds.js`, and work out where its script tag goes.
- **Commit it.** Make one change you like, then `git add` and `git commit` it with a message you would understand next month.

## What comes next

Project 15 is the next cutover, and it is a bigger one.

You write a second program. It is not a webpage, and it runs in a terminal instead of a browser. The two programs talk to each other, so your best score and mine can sit on one list.

That project teaches `fetch`, `async` and `await`, and JSON turns up again as the thing the two programs send each other.
