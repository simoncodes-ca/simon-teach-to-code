// ============================================================
// SIMON'S HANGMAN
// Read this file top to bottom. Fill the stubs in order.
// The page wiring at the bottom is already written.
// ============================================================

const WORDS = [
  "ELEPHANT", "GUITAR", "WINDOW", "BICYCLE", "DRAGON",
  "MONKEY", "PLANET", "ROCKET", "WINTER", "ORANGE",
  "CASTLE", "SPIDER", "FLOWER", "BRIDGE", "THUNDER",
  "JUNGLE", "PIRATE", "GALAXY", "MAGNET", "VOLCANO",
  "PENGUIN", "LAPTOP", "SANDWICH", "PUZZLE"
];

let secretWord = "";
let guessedLetters = [];
let mistakes = 0;
const MAX_MISTAKES = 6;

// STUB 1 — return a random word from WORDS.
// Hint: WORDS[Math.floor(Math.random() * WORDS.length)]
function pickRandomWord() {
  return "";
}

// STUB 2 — reveal guessed letters and keep the rest as underscores.
// The loop is supplied; change the value added to display.
// Hint: guessedLetters.includes(word[i]) is a boolean.
function buildWordDisplay(word, guessedLetters) {
  let display = "";
  for (let i = 0; i < word.length; i = i + 1) {
    display = display + "_";
  }
  return display;
}

// STUB 3 — handle one click: record it, count a miss, draw, render.
// Hint: guessedLetters.push(letter), secretWord.includes(letter).
function handleGuess(letter) {
}

// STUB 4 — reveal the next SVG group.
// Arrays start at zero, so mistake 1 uses PART_IDS[0].
function drawNextPart(mistakeCount) {
}

// STUB 5 — return true when this letter is already in the array.
// Hint: return guessedLetters.includes(letter)
function isLetterAlreadyGuessed(letter) {
  return false;
}

// STUB 6 — return true when every word letter has been guessed.
function isWordComplete() {
  return false;
}

// STUB 7 — return true once six wrong guesses have happened.
function isGameOver() {
  return false;
}

// ============================================================
// GIVEN WIRING
// ============================================================
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
  for (let i = 0; i < secretWord.length; i = i + 1) {
    const slot = document.createElement("span");
    slot.className = "slot";
    const letter = secretWord[i];
    const guessed = guessedLetters.includes(letter);
    if (guessed || (!roundActive && isGameOver())) {
      const visible = document.createElement("span");
      visible.className = guessed ? "letter" : "letter missed";
      visible.textContent = letter;
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
    render();
  } else if (isGameOver()) {
    roundActive = false;
    statusMessage = `No more guesses — the word was ${secretWord}`;
    stampLose.hidden = false;
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
  render();
}

newWordBtn.addEventListener("click", startRound);

// Demo states keep the visual comp inspectable before the learner fills stubs.
if (["#demo", "#demo-win", "#demo-lose"].includes(location.hash)) {
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
