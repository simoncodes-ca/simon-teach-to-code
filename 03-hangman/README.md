# Simon's Hangman

A game of hangman that runs in your browser, drawn on a sheet of sketchbook paper. You guess the word one letter at a time. Every wrong guess adds another pencil stroke to the drawing. After six wrong guesses the round is over.

This is your third project. The calculator taught you variables, functions and arrays. The elevator taught you state machines and animation.

Hangman teaches you the idea under both of them. **Everything you see on the page is worked out from a tiny amount of memory.** Change the memory, redraw the page, and the two can never disagree.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `hangman.html` | Builds the page: paper, drawing, word, letter row | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `hangman.js` | The game's rules | You |

Double-click `hangman.html` to play. After you change `hangman.js`, save the file and refresh the browser page.

Inside `hangman.js` seven functions are marked `// TODO`. Write them in file order, from top to bottom. Each one carries three levels of help in its comments. First a gentle hint, then a stronger hint, then the answer if you choose to read it. Try the gentle hint first.

Right now the page does nothing. The gallows is drawn and the letters are there, but no round can be played. The status line asks you to write the first function. That is on purpose.

## What you will learn

- How to look inside a string, one character at a time
- What a boolean is, and how a function can return one
- How to go through a word with a loop, and stop early when you find your answer
- What "derived display state" means, and why it prevents bugs
- The difference between a wrong move and an invalid move
- How to build one big function out of six small ones you already trust

## Good to know

### What you already know

These all work exactly the same here. Read `01-calculator/README.md` or `02-elevator/README.md` again for the full story.

- `let` and `const` make labelled boxes. A `const` box cannot be replaced.
- Arrays are ordered lists. `.push(x)` adds to the end, `[0]` reads the first item, `.length` counts, and `.includes(x)` asks whether something is in the list.
- `if` and `else` make choices. `===` asks whether two values are exactly equal. `=` puts a value in a box.
- Functions are steps with a name. Parameters come in through the brackets. `return` sends a value back.
- `document.getElementById(id)` finds an element. `.textContent` changes its text. `.classList.add("name")` adds a class to it.
- `console.log` shows you what is really happening.
- Template strings use backticks, like `` `${mistakes} wrong guesses` ``.

### The big idea: derived display state

The elevator had one `state` variable, and you watched it move from name to name. Hangman has three pieces of memory, and no state names at all:

```js
let secretWord = "";        // the word being guessed
let guessedLetters = [];    // every letter pressed this round
let mistakes = 0;           // how many of those were wrong
```

That is the entire game. Everything on the screen is **derived** from those three. The word "derived" means the page works it out again, from the memory, every single time:

| What you see | Where it comes from |
|---|---|
| The blanks and the filled-in letters | `secretWord` and `guessedLetters` |
| A letter marked correct, or crossed out in red | `guessedLetters` and `secretWord` |
| The red strike marks in the corner | `mistakes` |
| How much of the hangman is drawn | `mistakes` |
| "You got it!" or "No more guesses" | all three |

Nothing on the page remembers anything of its own. That is why `render()` exists. It removes what was on the screen and draws all of it again, from the three variables.

So your job is never "update the screen". Your job is "change the memory, then call `render()`".

There is another way to write this kind of game. You tell each part of the page to update itself, one instruction at a time. That way is how games end up showing seven body parts for six mistakes. When the screen is derived, that bug cannot happen.

### Strings: text you can look inside

A string is text in quotes. It is more than a single lump of letters. You can reach inside it.

```js
const word = "DRAGON";

word.length          // 6, which is how many characters it has
word[0]              // "D". Characters are numbered from ZERO.
word[5]              // "N". The last one is always at length - 1.
word.includes("A")   // true. It asks whether that character is anywhere inside.
word.includes("Z")   // false
```

Strings join together with `+`, exactly as they did in the calculator:

```js
let display = "";
display = display + "_";   // "_"
display = display + "R";   // "_R"
```

`buildWordDisplay` grows its answer that way. It starts with nothing, then adds one character for each letter of the word.

Every word in `WORDS` is in CAPITALS. Every letter in the row is a capital too. That is a deliberate choice. In JavaScript `"a" === "A"` is `false`, so keeping everything in one case saves you from a bug that is very annoying to find.

### Loops: doing the same thing to every letter

A `for` loop repeats a block of steps, and counts as it goes.

```js
for (let i = 0; i < word.length; i = i + 1) {
  console.log(word[i]);
}
```

Read the three instructions between the semicolons:

- `let i = 0` means start counting at zero.
- `i < word.length` means keep going while this is true.
- `i = i + 1` means add one after each pass.

So for a six-letter word, `i` takes the values 0, 1, 2, 3, 4 and 5. Each time, `word[i]` is a different letter. The counter stops *before* `length`, because position 6 does not exist in a six-letter word.

**A loop does not have to finish.** `return` inside a loop leaves the whole function immediately:

```js
for (let i = 0; i < secretWord.length; i = i + 1) {
  if (!guessedLetters.includes(secretWord[i])) {
    return false;      // a hidden letter. No need to check the rest.
  }
}
return true;           // every letter was checked, so nothing is hidden
```

That is `isWordComplete` in full. Look at where `return true` sits. It is **after** the loop, not inside it.

Put it inside and the function answers "true" the moment the first letter matches. Then you win on your first correct guess. It is a classic bug, and it is worth making on purpose once, so you can see it happen.

### Booleans: functions that answer yes or no

A boolean is a value that is only ever `true` or `false`. Four of your seven functions return one.

The `!` mark reverses a boolean:

```js
const found = word.includes("Z");   // false
if (!found) {
  // this runs when found is false
}
```

A comparison **is** already a boolean. So you rarely need an `if` to make one:

```js
// the long way
function isGameOver() {
  if (mistakes >= MAX_MISTAKES) { return true; } else { return false; }
}

// the same thing, said once
function isGameOver() {
  return mistakes >= MAX_MISTAKES;
}
```

Both are correct. Prefer the second.

Functions named `is...` follow a convention. The name tells the reader that the function answers a yes/no question and changes nothing. So `isWordComplete()` must never add a letter or count a mistake. It only looks.

### Wrong moves and invalid moves

These two are different, and a good game treats them differently.

Guessing **Z** when the word has no Z is a **wrong** move. It is a legal thing to do. It costs you one stroke of the drawing.

Guessing **Z** again, when you already guessed Z, is an **invalid** move. It is not a play at all. It must cost nothing, change no memory, and draw nothing. But the player still deserves to be told what happened.

`handleGuess` deals with the invalid case first, before anything else:

```js
if (isLetterAlreadyGuessed(letter)) {
  statusMessage = "You already tried that one.";
  render();
  return;                // leave now, so none of the rest runs
}
```

A bare `return;` with no value means "this function is finished". Everything below it is skipped.

This shape has a name. Check the impossible cases first, then leave. It is called an early return, and it keeps the interesting part of a function out of layers of `if`.

Checking what arrived is called **input validation**. Never trust that a value is sensible. Decide what to do when it is not.

### Building the big function last

`handleGuess` is the whole game, and it is the last function for a reason. By the time you reach it, the six functions above it already work. You have watched each one do its job on the screen.

So `handleGuess` does not need to be clever. It only calls them in order:

1. Is this letter already guessed? Say so, then leave.
2. Remember the letter.
3. Was the guess wrong? Count it, then draw the next part.
4. Redraw the page, then check whether the round has ended.

That is what "build a big thing out of small, trusted things" looks like. It is also why a bug is easy to find here. Each of the four steps is one line, and you can put a `console.log` between any two of them.

### The drawing, the stamps and the sounds

The hangman is an SVG. An SVG is a picture made of instructions instead of pixels, and this one is written directly in `hangman.html`. Each body part is a group with its own id:

```html
<g id="part-head" class="part"><path class="stroke heavy" d="..."/></g>
```

Every stroke is on the page from the very first moment. The stylesheet is what hides them.

Each line is given a dashed pattern with one enormous gap. Then the line is pushed along by exactly that much. So the whole line sits inside the gap, and nothing shows. Adding the class `drawn` slides it back to zero. The slide is animated, so the line looks like a pencil is drawing it, from one end to the other.

That is all `showPart(id)` does. It adds one class:

```js
part.classList.add("drawn");
```

So "drawing the hangman" is not drawing at all. The picture is already complete, and always was. The game only chooses how much of it has slid into view.

`PART_IDS` lists the six parts in the order they should appear. `drawNextPart` picks the right one out of that list.

Watch the numbering carefully. `mistakes` counts 1, 2, 3. Arrays count 0, 1, 2. So mistake number 1 needs `PART_IDS[0]`, and the sum is `mistakeCount - 1`.

Getting that sum wrong is the most common mistake in the whole project. It is also easy to spot. Your first wrong guess draws the body instead of the head, or it draws nothing.

The `APPROVED` and `SCRAPPED` stamps are ordinary elements. They start with `hidden` set. To show one, write `stampWin.hidden = false;`.

Sounds work the same way as the elevator's button beep. Three of them are made once, near the top of the given code, then reused:

```js
const winSound = new Audio("assets/win.wav");

function playSound(sound) {
  sound.currentTime = 0;      // rewind, in case it is still playing
  sound.play().catch(() => {});
}
```

`currentTime = 0` rewinds to the start, so the same sound can play twice in a row.

The `.catch` is there for a reason. Browsers refuse to play any sound until the person has clicked the page at least once. That refusal is normal, so the code ignores it on purpose.

A new round plays one sound. Winning plays another. Losing plays a third. All three are already connected.

### Already written for you

Section 3 of `hangman.js` is already written, like the calculator's and the elevator's.

- The A to Z letter row is **built by a loop**, not written out in the HTML. The loop creates 26 buttons, gives each one its letter, connects it to `handleGuess`, and adds it to the page. Read that loop. It is the shortest piece of real code in the project.
- `render()` calls four smaller drawing functions: `renderWord`, `renderRail`, `renderTally` and `renderStatus`. Each one reads the memory and redraws its own part of the page.
- `finishIfNeeded()` asks your `isWordComplete` and `isGameOver` whether the round is over. If it is, the function shows the stamp, the message and the sound. Your `handleGuess` has to call it, because nothing else does.
- `startRound()` clears the memory, resets the drawing, and calls your `pickRandomWord`. The **New word** button is already connected to it.
- Add `#demo`, `#demo-win` or `#demo-lose` to the end of the address in the browser. Those show the page mid-game, won, and lost. They are for checking how the page looks, not for playing.

### Finding your mistakes

The console works as it always has. What helps you most in this project is the three variables. When something looks wrong on the screen, print all three at the top of `handleGuess`, then press a letter:

```js
console.log(secretWord, guessedLetters, mistakes);
```

Now compare what you see. If the memory is right and the screen is wrong, the bug is in how you called `render`. If the memory is already wrong, the bug happened before that. Either way you have just saved yourself from searching the whole file.
