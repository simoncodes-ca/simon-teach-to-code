# Simon's Hangman

A game of hangman that runs in your browser, drawn on a sheet of sketchbook paper. Guess the word one letter at a time. Every wrong guess adds another pencil stroke to the drawing, and after six the round is over.

This is your third project. The calculator taught you variables, functions and arrays. The elevator taught you state machines and animation. Hangman teaches you the idea underneath both: **everything you see on the page is worked out from a tiny amount of memory.** Change the memory, redraw the page, and the two can never disagree.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `hangman.html` | Builds the page: paper, drawing, word, letter rail | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `hangman.js` | The game's rules | You |

Double-click `hangman.html` to play. After you change `hangman.js`, save and refresh the browser page.

Inside `hangman.js` seven functions have `// TODO` in them. Work through them in file order, top to bottom. Each one carries three levels of help in its comments: a gentle hint, a stronger hint, and the answer if you choose to read it. Try the gentle hint first.

Right now the page is a scaffold. The gallows is drawn, the letters are there, but nothing works and the status line asks you to fill in STUB 1. That is on purpose.

## What you will learn

- How to look inside a string one character at a time
- What a boolean is, and how a function can hand one back
- How to walk through a word with a loop and stop early when you find your answer
- What "derived display state" means, and why it stops bugs before they happen
- The difference between a wrong move and an invalid move
- How to build one big function out of six small ones you already trust

## Good to know

### What you already know

These still work exactly the same. Flip back to `01-calculator/README.md` or `02-elevator/README.md` for the full story.

- `let` and `const` make labelled boxes. `const` cannot be replaced.
- Arrays are ordered lists. `.push(x)` adds to the end, `[0]` reads the first item, `.length` counts, `.includes(x)` asks whether something is in there.
- `if` and `else` choose. `===` asks "exactly equal?" and `=` puts a value in a box.
- Functions are named recipes. Parameters come in through the brackets, `return` hands a value back.
- `document.getElementById(id)` finds an element; `.textContent` changes its words; `.classList.add("name")` sticks a sticker on it.
- `console.log` is your torch for finding mistakes.
- Template strings use backticks: `` `${mistakes} wrong guesses` ``.

### The big idea: derived display state

The elevator had one `state` variable and you watched it move from name to name. Hangman has three pieces of memory, and no state names at all:

```js
let secretWord = "";        // the word being guessed
let guessedLetters = [];    // every letter pressed this round
let mistakes = 0;           // how many were wrong
```

That is the entire game. Everything on screen is **derived** from those three — worked out fresh, every time, from the memory:

| What you see | Where it comes from |
|---|---|
| The blanks and the filled-in letters | `secretWord` + `guessedLetters` |
| A letter marked correct or struck out in red | `guessedLetters` + `secretWord` |
| The red strike marks in the corner | `mistakes` |
| How much of the hangman is drawn | `mistakes` |
| "You got it!" or "No more guesses" | all three |

Nothing on the page remembers anything of its own. This is why `render()` exists: it throws away what was on screen and redraws all of it from the three variables. Your job is never "update the screen". Your job is "change the memory, then call `render()`".

The alternative — telling each part of the page to update itself, one instruction at a time — is how games end up showing seven body parts for six mistakes. When the screen is derived, that bug cannot happen.

### Strings: text you can look inside

A string is text in quotes. It is more than a lump of letters: you can reach into it.

```js
const word = "DRAGON";

word.length          // 6 — how many characters
word[0]              // "D" — characters are numbered from ZERO
word[5]              // "N" — the last one is length - 1
word.includes("A")   // true — is this character anywhere inside?
word.includes("Z")   // false
```

Strings glue together with `+`, exactly like they did in the calculator:

```js
let display = "";
display = display + "_";   // "_"
display = display + "R";   // "_R"
```

That is how `buildWordDisplay` grows its answer: start with nothing, add one character per letter of the word.

Every word in `WORDS` is in CAPITALS, and so is every letter on the rail. That is a deliberate choice. `"a" === "A"` is `false` in JavaScript, so keeping everything in one case saves you from a bug that is very annoying to find.

### Loops: doing the same thing to every letter

A `for` loop repeats a block of steps, counting as it goes.

```js
for (let i = 0; i < word.length; i = i + 1) {
  console.log(word[i]);
}
```

Read it as three instructions separated by semicolons:

- `let i = 0` — start counting at zero
- `i < word.length` — keep going while this is true
- `i = i + 1` — after each pass, add one

So `i` takes the values 0, 1, 2, 3, 4, 5 for a six-letter word, and `word[i]` is a different letter each time. The counter stops *before* `length`, because position 6 does not exist in a six-letter word.

**Stopping early.** A loop does not have to finish. `return` inside a loop leaves the whole function immediately:

```js
for (let i = 0; i < secretWord.length; i = i + 1) {
  if (!guessedLetters.includes(secretWord[i])) {
    return false;      // found a hidden letter — no need to check the rest
  }
}
return true;           // got all the way through, so nothing was hidden
```

That is `isWordComplete` in full. Notice where the `return true` sits: **after** the loop, not inside it. Putting it inside would answer "true" the moment the first letter matched, and you would win on your first correct guess. It is a classic bug and worth making on purpose once, just to see it happen.

### Booleans: functions that answer yes or no

A boolean is a value that is only ever `true` or `false`. Four of your seven functions hand one back.

The `!` mark flips a boolean over:

```js
const found = word.includes("Z");   // false
if (!found) {
  // runs when found is false
}
```

A comparison already *is* a boolean, so you rarely need an `if` to make one:

```js
// long way
function isGameOver() {
  if (mistakes >= MAX_MISTAKES) { return true; } else { return false; }
}

// same thing, said once
function isGameOver() {
  return mistakes >= MAX_MISTAKES;
}
```

Both are correct. The second is the one to reach for.

Functions named `is...` are a convention: the name tells the reader it answers a yes/no question and changes nothing. `isWordComplete()` should never add a letter or count a mistake — it only looks.

### Wrong moves and invalid moves

These are not the same, and a good game treats them differently.

- Guessing **Z** when the word has no Z is a **wrong** move. It is a legal thing to do, and it costs you a stroke of the drawing.
- Guessing **Z** again, when you already guessed Z, is an **invalid** move. It is not a play at all. It must not cost anything, must not change the memory, and must not redraw the hangman — but the player still deserves to be told what happened.

`handleGuess` deals with the invalid case first, before anything else:

```js
if (isLetterAlreadyGuessed(letter)) {
  statusMessage = "You already tried that one.";
  render();
  return;                // leave now — none of the rest should run
}
```

A bare `return;` with no value means "this function is finished". Everything below it is skipped. This shape — check the impossible cases first and leave — is called an early return, and it keeps the interesting part of a function from being buried inside layers of `if`.

Checking this is called **input validation**: never trust that what arrived is sensible, decide what to do when it is not.

### Building the big function last

`handleGuess` is the whole game, and it is the last stub for a reason. By the time you reach it, the six functions above it already work and you have watched each one do its job on screen. So `handleGuess` does not have to be clever — it just calls them in order:

1. Is this letter already guessed? Say so and leave.
2. Remember the letter.
3. Was it wrong? Count it and draw the next part.
4. Redraw, then check whether the round has ended.

That is what "build a big thing out of small trusted things" looks like in practice. It is also why a bug is easy to find: each of the four steps is one line, and you can `console.log` between any two of them.

### The drawing, the stamps and the sounds

The hangman is an SVG — a picture made of instructions rather than pixels, written directly in `hangman.html`. Each body part is a group with its own id:

```html
<g id="part-head" class="part"><path class="stroke heavy" d="..."/></g>
```

Every stroke is on the page from the very first moment. What hides them is a trick in the stylesheet: each line is given a dashed pattern with one enormous gap, and then shoved along by exactly that much, so the whole line sits in the gap and nothing shows. Adding the sticker `drawn` slides it back to zero, and because the slide is animated the line appears to be drawn by a pencil, from one end to the other.

That is all `showPart(id)` does — add one sticker:

```js
part.classList.add("drawn");
```

So "drawing the hangman" is not drawing at all. The picture is already complete and always was; the game only chooses how much of it has slid into view. `PART_IDS` lists the six in the order they should appear, and `drawNextPart` picks the right one out of the list.

Watch the numbering. `mistakes` counts 1, 2, 3; arrays count 0, 1, 2. Mistake number 1 needs `PART_IDS[0]`, so the sum is `mistakeCount - 1`. Being off by one here is the most common mistake in the whole project, and it is easy to spot: your first wrong guess draws the body instead of the head, or nothing at all.

The `APPROVED` and `SCRAPPED` stamps are ordinary elements that start with `hidden` set. Showing one is `stampWin.hidden = false;`.

Sounds work the same way as the elevator's button beep. Three of them are made once, near the top of the given wiring, and reused:

```js
const winSound = new Audio("assets/win.wav");

function playSound(sound) {
  sound.currentTime = 0;      // rewind, in case it is still playing
  sound.play().catch(() => {});
}
```

`currentTime = 0` rewinds to the start, so the same sound can fire twice in a row. The `.catch` is there because browsers refuse to play any sound until the person has clicked the page at least once — a refusal, not a bug, so it is swallowed on purpose. A new round plays one sound, winning plays another, and losing plays a third. All three are wired up for you.

### Already done for you

Section 3 of `hangman.js` is finished wiring, like the calculator's and the elevator's.

- The A–Z letter rail is **built by a loop**, not written out in the HTML. Twenty-six buttons are created, given their letter, connected to `handleGuess`, and added to the page. Read that loop — it is the shortest piece of real code in the project.
- `render()` calls four smaller painters: `renderWord`, `renderRail`, `renderTally`, `renderStatus`. Each one reads the memory and redraws its own part of the page.
- `finishIfNeeded()` asks your `isWordComplete` and `isGameOver` whether the round is over, and shows the stamp, message and sound if it is. Your `handleGuess` has to call it — nothing else does.
- `startRound()` clears the memory, resets the drawing, and calls your `pickRandomWord`. The **New word** button is already connected to it.
- Adding `#demo`, `#demo-win` or `#demo-lose` to the end of the address in the browser shows the page mid-game, won and lost. That is for checking how it looks, not for playing.

### Finding your mistakes

Same trick as the last two projects. Right-click the page, choose Inspect, click the Console tab.

- Anything you print with `console.log("guessedLetters is", guessedLetters);` appears there.
- Mistakes appear in red, with a file name and a line number. Read them.

The three variables are your best torch here. When something looks wrong on screen, print all three at the top of `handleGuess` and press a letter:

```js
console.log(secretWord, guessedLetters, mistakes);
```

If the memory is right and the screen is wrong, the bug is in how you called `render`. If the memory is already wrong, the bug happened before that, and you have just saved yourself from searching the whole file.
