# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `hangman.html`, `styles.css`, `hangman.js`, with hand-made assets under `assets/`. No build step, no dependencies, no framework. Opens by double-clicking `hangman.html`. This matches the sibling calculator and elevator projects, where the source itself is the deliverable and tooling would obscure it.

## Users

- **Simon (primary learner), 11 years old.** He did the calculator and the elevator. His job is to open `hangman.js`, read it top to bottom, and fill in the stubbed functions until the game works. He reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and explains how what is on screen maps to the code that produces it.
- **The player.** Whoever picks the game up to play a round. The rules must be correct and the round must end honestly.

## Product Purpose

A working hangman game that is simultaneously a lesson in strings, arrays, loops, and booleans. The game is always in exactly one situation — a secret word, a set of guessed letters, a number of wrong guesses — and the visible word display, the letter rail, the strike tally, and the pencil drawing are all derived from that one state.

## Positioning

Most beginner hangman tutorials are either ugly or unreadable. This one is neither: it is a genuinely well-made game whose entire implementation an 11-year-old can hold in his head, where "derived display state" — usually an invisible idea — is made visible by a drawing that appears stroke by stroke exactly as the state says it should.

## Operating Context

- Opened directly from the filesystem in a browser — no server, no install, no network.
- Edited in a text editor beside the running page, likely with both windows visible at once.
- Sessions are short: one or two stub functions at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- A fixed list of words (`WORDS` array) chosen at random each round.
- The word shown as hand-drawn blanks; guessed letters fill in; unguessed letters stay hidden.
- An A–Z letter rail of on-screen buttons — the same DOM-event pattern as the calculator. No keyboard listener.
- A `guessedLetters` array as the single source of truth; every visible thing derives from it.
- Wrong guesses add one pencil stroke group to the drawing, in order, up to a fixed limit of 6.
- Guessing the same letter twice is an invalid action: honest feedback, no penalty, no state change.
- Win when every letter of the word is guessed; lose when 6 wrong guesses are reached. Either way the round ends with a visible result and a working restart.
- Graduated hints per stub in comments: a gentle nudge, then a stronger hint, then the answer if he chooses to read it — all in the single `hangman.js`.

**Explicitly deferred (roadmap extensions):** categories, hints, difficulty levels, keyboard input, two-player word entry, score across rounds.

**Hard constraints:**
- No dependencies, no build step, no framework, no network requests.
- The whole implementation stays small enough for a beginner to read end to end.
- No abstraction that exists only for elegance. Repetition he can follow beats indirection he cannot.
- Comments use plain language for someone who has never programmed.
- Simon writes the word picking, the word display, the letter checking, the move handling, the drawing steps, and the win/lose decisions. The HTML/CSS, page wiring, letter-rail rendering, feedback lines, result screens, and restart flow are given.
- The initial page is an inert scaffold: a word of blank underlines with no letters revealed and no way to lose until the stubs work. Every completed stub makes something new visible on screen.
- Stubs are filled in file order, top to bottom.

## Brand Commitments

"Simon's Hangman" is drawn like a real pencil sketchbook: warm paper, everything drawn in soft graphite strokes, and one red pencil reserved for interactive truth — wrong-guess strikes, the focused letter, the final result stamp. The drawing is the hero; the instruments stay quiet. No digital glow, no glossy buttons, no cartoon mascot.

## Evidence on Hand

- `ROADMAP.md` names Hangman project 3 and lists what it teaches: strings and string methods, arrays, loops, booleans, input validation, invalid actions, derived display state.
- The sibling projects `01-calculator/` and `02-elevator/` establish the pattern: three files, pre-written wiring, stubbed core with plain-language doc comments, graduated hints, and a themed skin that makes the source worth reading. Simon completed and understood both.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a hangman that lets a seventh wrong guess pass.
2. **The derived is made visible.** Every visible change is the direct output of the one game state; no lesson should depend on imagining what the code is doing.
3. **Correctness is non-negotiable.** It is a real hangman before it is a teaching aid; a game that lies about winning teaches nothing.
4. **Scope stays small on purpose.** Every extra rule is more source before the interesting part.
5. **Beauty earns the reading.** The page has to feel like a sketchbook worth drawing in, or the source will never get read.

## Accessibility & Inclusion

No product-specific requirement beyond the general floor. The markup being semantically honest (real `<button>` elements, labelled regions, visible focus) serves both accessibility and the teaching purpose, since he reads the HTML too. The drawing carries `aria-hidden` decoration plus a text status line, so the game is fully playable without seeing it.

---

