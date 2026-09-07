# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `blackjack.html`, `styles.css`, `blackjack.js`, with hand-made assets under `assets/`. No build step, no dependencies, no framework. Opens by double-clicking `blackjack.html`. This matches the sibling calculator, elevator and hangman projects, where the source itself is the deliverable and tooling would obscure it.

## Users

- **Simon (primary learner), 11 years old.** He did the calculator, the elevator and hangman. His job is to open `blackjack.js`, read it top to bottom, and fill in the stubbed functions until a round can be played. He reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and explains how what is on screen maps to the code that produces it.
- **The player.** Whoever picks the game up to play a hand. The rules must be correct and the round must be settled honestly.

## Product Purpose

A working game of blackjack that is simultaneously a lesson in objects, arrays of objects, randomness, and rules with several cases. Hangman taught that everything on screen is derived from a little memory. Blackjack keeps that lesson and adds two new ones: **a thing in a program can be an object with named parts**, and **a program can be in exactly one of several named phases** — `dealing`, `playerTurn`, `dealerTurn`, `finished` — with the phase deciding what is allowed to happen next.

## Positioning

Beginner blackjack tutorials teach the arithmetic and skip the two ideas that actually matter: that a card is an object, and that a shuffle is something you can see. This one makes both visible. Every card wears the number your `cardValue` says it is worth, and a ribbon under the shoe draws the deck's real order as red and black ticks — four clean stripes before the shuffle, scattered after — using the one property of a card that changes nothing about the game, so watching the randomness gives away no information.

## Operating Context

- Opened directly from the filesystem in a browser — no server, no install, no network.
- Edited in a text editor beside the running page, likely with both windows visible at once.
- Sessions are short: one or two stub functions at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- A 52-card deck built from `SUITS` and `RANKS` by a nested loop, shuffled fresh each deal.
- A card as an object, `{ rank, suit }`, where the suit is itself an object carrying its symbol, name and colour.
- Two cards each, dealt one at a time, with the dealer's second card face down until the dealer's turn.
- Hit and stand as chip buttons, enabled and disabled purely by the current phase — the same DOM-event pattern as the calculator's keys and hangman's letter rail.
- Ace softening: aces count 11 and drop to 1, one at a time, only as far as the total requires.
- The dealer as a rule rather than an opponent: draw under 17, stand on 17 or more, never look at the player's hand.
- Settlement with five ordered cases, bust first, and a draw called a push.
- Four named phases, with the phase shown on the felt so the state machine is legible while it runs.
- Graduated hints per stub in comments: a gentle nudge, then a stronger hint, then a pointer to the answer key — one comment block at the bottom of `blackjack.js`, grouped by function, so the answers are there without sitting under his nose.

**Explicitly deferred (later projects or extensions):** betting and a chip balance, blackjack paying 3:2, splitting, doubling down, insurance, surrender, a multi-deck shoe with a cut card, more than one player seat, and any running score across rounds. Each is a rule, not an idea, and every extra rule is more source before the interesting part.

**Hard constraints:**
- No dependencies, no build step, no framework, no network requests.
- The whole implementation stays small enough for a beginner to read end to end.
- No abstraction that exists only for elegance. Repetition he can follow beats indirection he cannot.
- Comments use plain language for someone who has never programmed.
- Simon writes the deck building, the shoe count, the shuffle, drawing a card, the card values, the hand sum, the ace-aware total, the hole-card reveal, the dealer's rule, the bust test, the settlement and the hit action. The HTML/CSS, card rendering, dealing animation, dealer loop, phase-driven buttons, result plaque and restart flow are given.
- The initial page is an inert scaffold: an empty felt, a blank shoe, and a status line naming the first stub. Every completed stub makes something new visible on screen.
- Stubs are filled in file order, top to bottom.

## Brand Commitments

"Simon's Blackjack" is one green baize table photographed from above: felt with a real weave, a polished wood rail, cream cards with a single large pip, and moulded clay chips for the actions. Brass is reserved for numbers that carry meaning — the totals, the deck count, the phase. Red appears only where a hand has died or a suit demands it. No neon, no casino glitz, no cartoon dealer.

## Evidence on Hand

- `ROADMAP.md` names Blackjack project 4 and lists what it teaches: objects representing things, arrays of objects, creating and shuffling a deck, randomness, functions that calculate values, rules with several cases, and state transitions, with `dealing`, `playerTurn`, `dealerTurn` and `finished` named as the useful states.
- The sibling projects `01-calculator/`, `02-elevator/` and `03-hangman/` establish the pattern: three files, pre-written wiring, stubbed core with plain-language doc comments, graduated hints, demo URL hashes, and a themed skin that makes the source worth reading. Simon completed and understood all three.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dealer that hits on 18.
2. **The invisible is made visible.** A shuffle, a card's value and the current phase are all normally hidden inside a program. Here each one has a place on the table.
3. **Correctness is non-negotiable.** It is a real game of blackjack before it is a teaching aid; settling the wrong way teaches nothing.
4. **Scope stays small on purpose.** Betting and splitting are rules, not ideas.
5. **Beauty earns the reading.** The page has to feel like a table worth sitting at, or the source will never get read.

## Accessibility & Inclusion

No product-specific requirement beyond the general floor. Every card carries an `aria-label` naming its rank and suit, so the hand is readable without seeing the pips; the face-down card announces itself as face down rather than lying about what it is. Totals, phase and status are live regions, so a change is announced as it happens. The chip buttons are real `<button>` elements, disabled by the phase rather than merely dimmed, and the felt-to-cream and brass-on-felt pairs carry the contrast without relying on colour alone — a burst hand says the word "bust" as well as turning red.

---
