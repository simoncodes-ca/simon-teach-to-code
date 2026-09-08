# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `elevator.html`, `styles.css`, `elevator.js`. No build step, no dependencies, no framework. Opens by double-clicking `elevator.html`. This matches the sibling calculator project, where the source itself is the deliverable and tooling would obscure it.

## Users

- **Simon (primary learner), 11 years old.** New to programming; the calculator was his first project. His job is to open `elevator.js`, read it top to bottom, and fill in the stubbed functions until the elevator works. He reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and explains how what is on screen maps to the code that produces it.

## Product Purpose

A working five-floor elevator is simultaneously a lesson in state machines. The elevator is always in exactly one named state (`idle`, `waitingForRequest`, `choosingNextStop`, `doorsOpening`, `doorsOpen`, `doorsClosing`, `movingUp`, or `movingDown`). The visible car motion, lit buttons, readouts, and diagram show the output of that machine.

## Positioning

Most programming tutorials for children are either toy scripts with no product, or products too large to read. This is a genuinely well-made elevator whose entire implementation an 11-year-old can hold in his head, where the state machine — usually an invisible abstraction — is made visible by a live state readout and diagram.

## Operating Context

- Opened directly from the filesystem in a browser — no server, no install, no network.
- Edited in a text editor beside the running page, likely with both windows visible at once.
- Sessions are short: one or two stub functions at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- Five floors numbered 1 through 5; the car starts on a random floor at page load.
- Five lobby call buttons on the teaching rail; buttons remain usable while the car moves.
- A queue (`waitingList` array): Simon implements one pending request per floor, and distinct stops are served in press order.
- A same-floor call opens the doors without pointless travel.
- One named `state` variable holding exactly the eight states above; every transition is one visible line in the event log.
- A visible state-and-floor readout, live state-machine diagram, pending-request feedback, and transition log.
- Smooth car motion belongs in a per-frame JavaScript stub. The supplied car image moves as one piece; CSS door-panel animation is deferred.
- Graduated hints per stub in comments: a gentle nudge, then a stronger hint, then a pointer to the answer key — one comment block at the bottom of `elevator.js`, grouped by function, so the answers are there without sitting under his nose.

**Explicitly deferred:** direction-aware pickup, door sensors, CSS door-panel animation, more floors, and theming beyond the LEGO construction control board.

**Hard constraints:**
- No dependencies, no build step, no framework.
- The whole implementation stays small enough for a beginner to read end to end.
- No abstraction that exists only for elegance. Repetition he can follow beats indirection he cannot.
- Comments use plain language for someone who has never programmed.
- Simon writes the queue rule, state decisions, door timing, and per-frame motion functions. The HTML/CSS, page wiring, safe request feedback, diagram rendering, and timing loop are given.
- The initial page is an inert scaffold with safe request feedback. The car does not move until Simon fills the behavior stubs.
- Stubs are filled in file order, top to bottom; every completed stub makes something new visible on screen.

## Brand Commitments

"Simon's Elevator" uses a LEGO construction control board. The skyscraper remains the visual hero on the left. The right rail uses sturdy teaching instruments for the live diagram, status readouts, call buttons, and transition log. Desktop uses a 55/45 tower-to-rail split; narrow screens keep the two-column lesson visible.

## Evidence on Hand

The sibling project `~/git/simonj/calculator` is the established pattern: three files, pre-written wiring (`BUTTONS`/`KEYS` maps, `registerClickHandlers`, `init`), stubbed core with plain-language doc comments, and a themed sibling skin (`calculator-anna.html`) sharing the same JS. Simon completed and understood it.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as an elevator that stops between floors.
2. **The invisible is made visible.** The state variable, the queue, and the current floor all have on-screen readouts; no lesson should depend on imagining what the code is doing.
3. **Correctness is non-negotiable.** It is a real elevator before it is a teaching aid.
4. **Scope stays small on purpose.** Every extra rule is more source before the interesting part.
5. **Beauty earns the reading.** The interface has to be good enough that he wants to know how it works.

## Accessibility & Inclusion

No product-specific requirement beyond the general floor. The markup being semantically honest (real `<button>` elements, sensible labels) serves both accessibility and the teaching purpose, since he reads the HTML too.
