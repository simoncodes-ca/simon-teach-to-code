/* =====================================================================
   Simon's Hangman — the game's brain.

   This file is a learning scaffold. The page is ready and the drawing is
   ready, but nothing happens until you fill in the TODO functions below.

   A good order to work in:
     1. pickRandomWord          — choose the secret word
     2. buildWordDisplay        — show blanks, then fill them in
     3. isLetterAlreadyGuessed  — spot a letter pressed twice
     4. drawNextPart            — add one pencil stroke per mistake
     5. isWordComplete          — decide when the round is won
     6. isGameOver              — decide when the round is lost
     7. handleGuess             — put all six together

   Each one you finish makes something new happen on screen.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   The whole game is three pieces of memory. Everything you can see —
   the blanks, the letter rail, the red strike marks, the drawing — is
   worked out from these three. Nothing else is remembered anywhere.
   --------------------------------------------------------------------- */

const WORDS = [
  "ELEPHANT", "GUITAR", "WINDOW", "BICYCLE", "DRAGON",
  "MONKEY", "PLANET", "ROCKET", "WINTER", "ORANGE",
  "CASTLE", "SPIDER", "FLOWER", "BRIDGE", "THUNDER",
  "JUNGLE", "PIRATE", "GALAXY", "MAGNET", "VOLCANO",
  "PENGUIN", "LAPTOP", "SANDWICH", "PUZZLE"
];

let secretWord = "";        // the word being guessed, in CAPITALS
let guessedLetters = [];    // every letter pressed this round, right or wrong
let mistakes = 0;           // how many wrong guesses so far

const MAX_MISTAKES = 6;     // six wrong guesses and the round is lost


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Seven small functions. Fill them in from the top down. Each comment
   gives you two hints — read only as far as you need. The answers are
   in one block at the very bottom of this file, when you want them.
   --------------------------------------------------------------------- */

/**
 * Pick one word at random from the WORDS list.
 *
 * Gentle hint: WORDS is an array, and arrays are numbered from zero.
 * Stronger hint: Math.random() gives a decimal between 0 and 1. Multiply
 *   it by WORDS.length to spread it across the whole list, then use
 *   Math.floor() to chop off the decimal part.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Return the word as a string. While this returns "", the page shows a
 * reminder instead of a round.
 */
function pickRandomWord() {
  // TODO: return one random word from WORDS.
  return "";
}

/**
 * Build the row of blanks, with the guessed letters filled in.
 *
 * For the word "DRAGON" with ["A", "R", "S"] guessed, return "_RA___".
 * Every letter of the word gets exactly one character in the result, so
 * the string you return is always the same length as the word.
 *
 * Gentle hint: the loop already walks through the word one letter at a
 *   time. word[i] is the letter at position i.
 * Stronger hint: guessedLetters.includes(word[i]) is true or false. Use
 *   an if/else to decide what to glue onto display.
 * Stuck? The answer key is at the bottom of this file.
 *
 * This is the function the page reads to draw the word, so the moment it
 * works you will see letters appear in the blanks.
 */
function buildWordDisplay(word, guessedLetters) {
  let display = "";
  for (let i = 0; i < word.length; i = i + 1) {
    // TODO: replace "_" with the right character for this position.
    display = display + "_";
  }
  return display;
}

/**
 * Has this letter already been pressed this round?
 *
 * Gentle hint: guessedLetters remembers every press, right or wrong.
 * Stronger hint: arrays can answer this question themselves.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Return true or false. A value that is only ever true or false is called
 * a boolean. handleGuess uses this to refuse a repeat press without
 * punishing the player for it.
 */
function isLetterAlreadyGuessed(letter) {
  // TODO: return whether letter is already in guessedLetters.
  return false;
}

/**
 * Draw the next piece of the hangman.
 *
 * PART_IDS lists the six pieces in drawing order: head, body, left arm,
 * right arm, left leg, right leg. showPart(id) makes one of them appear.
 *
 * Gentle hint: mistakeCount counts from 1, but arrays count from 0.
 * Stronger hint: the first mistake should draw PART_IDS[0], the second
 *   PART_IDS[1], and so on.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Careful: reading past the end of an array gives undefined, not an
 * error. showPart ignores an id it cannot find, so a seventh mistake
 * quietly draws nothing rather than crashing.
 */
function drawNextPart(mistakeCount) {
  // TODO: show the part that matches this mistake number.
}

/**
 * Has the whole word been guessed?
 *
 * Gentle hint: the word is complete when there is no letter left hiding.
 * Stronger hint: walk through secretWord one letter at a time and ask
 *   whether guessedLetters contains it. If you find one that is missing
 *   you can stop straight away — return false from inside the loop.
 * Stuck? The answer key is at the bottom of this file.
 *
 * A word with a repeated letter, like "PUZZLE", still works: guessing "Z"
 * once satisfies both positions, because both ask the same question.
 */
function isWordComplete() {
  // TODO: return true only when every letter of secretWord is guessed.
  return false;
}

/**
 * Have all six wrong guesses been used up?
 *
 * Gentle hint: mistakes counts the wrong guesses, MAX_MISTAKES is the limit.
 * Stronger hint: comparing two numbers gives you a boolean directly — you
 *   do not need an if.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Use >= rather than ===. They behave the same if the counting is
 * perfect, but >= still ends the round if a bug ever pushes the count
 * past six.
 */
function isGameOver() {
  // TODO: return true once six wrong guesses have happened.
  return false;
}

/**
 * Handle one press of a letter button. This is the whole game in one
 * function, and it uses all six functions above.
 *
 * It has four jobs, in this order:
 *   1. If the letter was already guessed, set statusMessage to say so,
 *      call render(), and stop. No penalty — a repeat press is an
 *      invalid action, not a mistake.
 *   2. Remember the letter in guessedLetters.
 *   3. If the word does NOT contain the letter, add one to mistakes and
 *      draw the next part of the hangman.
 *   4. Redraw the page, then check whether the round has ended.
 *
 * Gentle hint: secretWord.includes(letter) tells you whether the guess
 *   was right. guessedLetters.push(letter) adds to the end of an array.
 * Stronger hint: `return` on its own leaves a function immediately —
 *   that is how job 1 stops the rest from running. Setting statusMessage
 *   to a sentence makes it appear in red under the word.
 * Stuck? The answer key is at the bottom of this file.
 *
 * render() repaints everything from memory. finishIfNeeded() asks your
 * isWordComplete and isGameOver whether the round is over, and shows the
 * stamp if it is. Both are already written for you.
 */
function handleGuess(letter) {
  // TODO: do the four jobs listed above.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is deliberately finished. It builds the letter rail, draws
   the page from memory, and starts each round. Read it — it shows how
   your seven functions get used — but leave it alone.
   --------------------------------------------------------------------- */

let roundActive = false;
let statusMessage = "";
const wordEl = document.getElementById("word");
const statusEl = document.getElementById("status");
const railEl = document.getElementById("rail");
const tallyEl = document.getElementById("tally");
const stampWin = document.getElementById("stampWin");
const stampLose = document.getElementById("stampLose");
const newWordBtn = document.getElementById("newWord");
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PART_IDS = ["part-head", "part-body", "part-arm-left", "part-arm-right", "part-leg-left", "part-leg-right"];

/* The sounds. One Audio element is made for each, once, and reused —
   calling play() again just restarts it from the beginning. */
const newGameSound = new Audio("assets/new-game.wav");
const winSound = new Audio("assets/win.wav");
const loseSound = new Audio("assets/lose.wav");

function playSound(sound) {
  sound.currentTime = 0;
  // Browsers refuse to play sound before the first real click on the
  // page. .catch swallows that harmless refusal instead of logging it.
  sound.play().catch(() => {});
}

for (const letter of LETTERS) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = letter;
  button.addEventListener("click", () => {
    statusMessage = "";
    handleGuess(letter);
  });
  railEl.appendChild(button);
}

function showPart(id) {
  const part = document.getElementById(id);
  if (!part) return;
  part.classList.add("drawn");
}

function resetDrawing() {
  for (const id of PART_IDS) document.getElementById(id).classList.remove("drawn");
}

function render() {
  renderWord();
  renderRail();
  renderTally();
  renderStatus();
}

function renderWord() {
  wordEl.textContent = "";
  const display = buildWordDisplay(secretWord, guessedLetters);
  const roundLost = !roundActive && isGameOver();
  for (let i = 0; i < secretWord.length; i = i + 1) {
    const slot = document.createElement("span");
    slot.className = "slot";
    const revealed = display[i] !== undefined && display[i] !== "_";
    if (revealed || roundLost) {
      const visible = document.createElement("span");
      visible.className = revealed ? "letter" : "letter missed";
      visible.textContent = secretWord[i];
      slot.appendChild(visible);
    }
    wordEl.appendChild(slot);
  }
  wordEl.setAttribute("aria-label", "The hidden word: " + display.split("").join(" "));
}

function renderRail() {
  for (const button of railEl.children) {
    const letter = button.textContent;
    button.classList.toggle("hit", guessedLetters.includes(letter) && secretWord.includes(letter));
    button.classList.toggle("miss", guessedLetters.includes(letter) && !secretWord.includes(letter));
    button.disabled = !roundActive;
  }
  railEl.classList.toggle("done", !roundActive);
}

function renderTally() {
  tallyEl.textContent = "";
  for (let i = 1; i <= mistakes; i = i + 1) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    if (i === 5) path.setAttribute("d", "M6 38 Q60 20 132 6");
    else {
      const x = 12 + (i - 1) * 32;
      path.setAttribute("d", `M${x} 6 Q${x + 2} 24 ${x - 1} 40`);
    }
    path.setAttribute("pathLength", "1");
    tallyEl.appendChild(path);
    requestAnimationFrame(() => path.classList.add("drawn"));
  }
}

function renderStatus() {
  statusEl.textContent = statusMessage || (roundActive ? `${mistakes} wrong guesses` : "");
  statusEl.classList.toggle("bad", Boolean(statusMessage));
}

function finishIfNeeded() {
  if (!roundActive) return;
  if (isWordComplete()) {
    roundActive = false;
    statusMessage = "You got it! New word?";
    stampWin.hidden = false;
    playSound(winSound);
    render();
  } else if (isGameOver()) {
    roundActive = false;
    statusMessage = `No more guesses — the word was ${secretWord}`;
    stampLose.hidden = false;
    playSound(loseSound);
    render();
  }
}

function startRound() {
  secretWord = pickRandomWord();
  guessedLetters = [];
  mistakes = 0;
  roundActive = secretWord !== "";
  statusMessage = roundActive ? "" : "Fill in STUB 1 in hangman.js!";
  stampWin.hidden = true;
  stampLose.hidden = true;
  resetDrawing();
  playSound(newGameSound);
  render();
}

newWordBtn.addEventListener("click", startRound);

// Demo states keep the visual comp inspectable before the learner fills
// stubs. The word row is drawn from buildWordDisplay and isGameOver, so
// the demo needs working ones — these stand-ins are for the comp only,
// never for the game.
if (["#demo", "#demo-win", "#demo-lose"].includes(location.hash)) {
  if (buildWordDisplay("AB", ["A"]) !== "A_") {
    buildWordDisplay = (word, guessed) =>
      word.split("").map((ch) => (guessed.includes(ch) ? ch : "_")).join("");
  }
  mistakes = MAX_MISTAKES;               // probe: does isGameOver notice?
  const gameOverWorks = isGameOver() === true;
  mistakes = 0;
  if (!gameOverWorks) {
    isGameOver = () => mistakes >= MAX_MISTAKES;
  }
  secretWord = "ELEPHANT";
  guessedLetters = ["R", "S", "O", "E", "P", "H", "N", "T"];
  mistakes = 3;
  roundActive = true;
  for (let i = 0; i < mistakes; i = i + 1) showPart(PART_IDS[i]);
  if (location.hash === "#demo-win") {
    guessedLetters = ["R", "E", "L", "P", "H", "A", "N", "T"];
    roundActive = false;
    statusMessage = "You got it! New word?";
    stampWin.hidden = false;
  }
  if (location.hash === "#demo-lose") {
    guessedLetters = ["R", "S", "O", "I", "U", "M"];
    mistakes = 6;
    for (const id of PART_IDS) showPart(id);
    stampLose.hidden = false;
    roundActive = false;
    statusMessage = `No more guesses — the word was ${secretWord}`;
  }
  render();
} else {
  startRound();
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   Only worth reading once you have tried. Each block is one function,
   in the same order as the TODOs above.


   --- pickRandomWord() ---

     return WORDS[Math.floor(Math.random() * WORDS.length)];


   --- buildWordDisplay(word, guessedLetters) ---

     inside the loop, instead of display = display + "_":

     if (guessedLetters.includes(word[i])) display = display + word[i];
     else display = display + "_";


   --- isLetterAlreadyGuessed(letter) ---

     return guessedLetters.includes(letter);


   --- drawNextPart(mistakeCount) ---

     showPart(PART_IDS[mistakeCount - 1]);


   --- isWordComplete() ---

     for (let i = 0; i < secretWord.length; i = i + 1) {
       if (!guessedLetters.includes(secretWord[i])) return false;
     }
     return true;


   --- isGameOver() ---

     return mistakes >= MAX_MISTAKES;


   --- handleGuess(letter) ---

     if (isLetterAlreadyGuessed(letter)) {
       statusMessage = "You already tried " + letter;
       render();
       return;
     }

     guessedLetters.push(letter);

     if (!secretWord.includes(letter)) {
       mistakes = mistakes + 1;
       drawNextPart(mistakes);
     }

     render();
     finishIfNeeded();

   --------------------------------------------------------------------- */
