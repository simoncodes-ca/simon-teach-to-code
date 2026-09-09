# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `balloons.html`, `styles.css`, `balloons.js`, with hand-made sounds under `assets/`. One `<canvas>` element, drawn with the 2D context, driven by a `requestAnimationFrame` loop. No build step, no dependencies, no framework, no network. Opens by double-clicking `balloons.html`. This matches the six sibling projects, where the source itself is the deliverable and tooling would obscure it.

## Users

- **Simon (primary learner), 11 years old.** He did the calculator, the elevator, hangman, blackjack, battleship and the paint app. His job is to open `balloons.js`, read it top to bottom, and fill in the stubbed functions until balloons rise, darts arc and the score counts. He reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and explains how what is on screen maps to the code that produces it.
- **Anyone who picks it up to play.** The cannon has to follow the mouse without lag, and a dart that visibly touched a balloon has to pop it. A shooting game that eats a fair shot is not a teaching aid, it is a broken toy.

## Product Purpose

The first game that runs on its own, and the first lesson in moving things by time.

Every earlier project waited for an event. This one has a game loop, and the loop is the thing every project from here to the strategy game is built on. But the idea worth the project is smaller and sharper than `requestAnimationFrame`: **a thing moves by its speed multiplied by the time that passed, never by a fixed number of pixels per frame.**

Once movement is time-based, three things fall out at no extra cost. Gravity becomes one line that changes `vy`. Slow motion becomes one multiplier on `seconds`, with no change to any of the nine functions. And the game runs identically on a 60Hz laptop and a 120Hz screen, which the frame-counting version does not.

The second lesson is that a game is two lists that things enter and leave. Balloons arrive on a timer and leave at the top. Darts arrive on a click and leave at the bottom. Deciding when a thing is finished is a real job with a real function name, and the backwards removal loop is a bug the learner meets here rather than in a game he cares about.

## Positioning

Most beginner shooting-game tutorials move sprites a fixed number of pixels per frame, because it is one character shorter. That works on the machine it was written on and nowhere else, and it makes gravity a special case rather than a consequence. Those tutorials also tend to reach for a physics library the moment an arc is wanted, which hides the three lines that are the entire lesson.

This project moves everything by `seconds`, and hands that number to the learner's own functions. Gravity is then `dart.vy += GRAVITY * seconds`, written by the learner, in a stub whose payoff is watching a dart slow, stop and fall. The Slow motion key exists to prove the point: it multiplies one number in the wiring, and nothing the learner wrote has to know.

It also puts the angle on the page. The awning reads the cannon's angle in degrees and the counter draws the same angle as a dial, so `Math.atan2` stops being a spell and becomes a number that visibly agrees with the barrel.

## Operating Context

- Opened directly from the filesystem in a browser — no server, no install, no network.
- Edited in a text editor beside the running page, likely with both windows visible at once.
- Mouse or trackpad on a laptop, or a finger on a tablet: pointer events cover all three, and the canvas sets `touch-action: none` so a drag aims instead of scrolling.
- Sessions are short: one or two stub functions at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- A 1024×768 canvas holding a dusk sky, a sea, a pier deck and a brass cannon, scaling to the window without changing its own coordinates.
- A `requestAnimationFrame` loop that measures each frame in seconds, trims any frame longer than 0.05 seconds, and separates `update()` from `render()`.
- Balloons that arrive every 1.15 seconds with a random place, size, speed and colour, and rise until they leave the top.
- A cannon that follows the mouse, clamped to the half turn above the deck, and fires a dart every 0.16 seconds at most.
- Darts that carry a velocity, fly by it, and are pulled down by a gravity constant — a real arc, not a scripted one.
- Circle-to-point collision, a burst mark where a balloon popped, and a score.
- Three lives, one per escaped balloon, a closed-stall card, and Play again.
- A Slow motion key that scales time to 0.3 and changes nothing else.
- An angle readout in degrees on the awning, and an aim dial on the counter, so the angle is visible before a shot is fired.
- Counts of both lists — "In the sky" and "In the air" — so a list that never empties is visible as a number.
- A status line that names the exact stub responsible whenever the game does nothing, including the `aimAngle` stub that returns a valid number and still cannot be right.
- Graduated hints per stub in comments: a gentle nudge, then a stronger hint, then a pointer to the answer key — one comment block at the bottom of `balloons.js`, grouped by function.
- `#demo` and `#demo-over` hashes that fill in unwritten stubs at runtime, so the finished game is inspectable from the first minute.

**Explicitly deferred (later projects or extensions):** several kinds of entity with different movement rules (project 8), sprites loaded from images (project 8), a game library (project 9), waves and rising difficulty (project 10), a scrolling world (project 12), and a high score that survives a refresh (project 13). Also left out on purpose: wind, bouncing darts, a dart limit, points that vary by balloon size, and balloons that drift sideways — all named in the README as the good things to try next.

**Hard constraints:**
- No dependencies, no build step, no framework, no network requests.
- One canvas, one `.js` file, one loop. No physics library, no sprite sheets, no offscreen buffers.
- The whole implementation stays small enough for a beginner to read end to end.
- No abstraction that exists only for elegance. Repetition he can follow beats indirection he cannot.
- Comments use plain language for someone who has never programmed.
- Simon writes making a balloon, moving it, retiring it, the aim angle, making a dart, flying it, retiring it, the hit test, and the restart. The HTML/CSS, the loop, the drawing, the tin of helpers, the mouse handlers and the keys are given.
- The initial page is an inert scaffold: an empty sky, a cannon pointing straight up, and a status line naming the first stub. Every completed stub makes something new visible.
- Stubs are filled in file order, top to bottom.
- Every idea project 6 taught is assumed, not repeated. `skyPoint` is handed over as "the `canvasPoint` you wrote, word for word".

## Brand Commitments

"Simon's Balloon Stall" is one fairground shooting stall on a seaside pier, seen head on at dusk. A string of bulbs runs along the top, a striped canvas awning carries the name, and a painted timber counter holds the controls. The sky behind the window is the only place anything is bright: the balloons, the sun on the water, and the brass of the cannon. The stall itself is dark timber and cream canvas. Coral marks the one key that starts a game. No arcade neon, no drop shadows on the chrome, no cartoon outlines.

## Evidence on Hand

- `ROADMAP.md` names the balloon game project 7 and lists what it teaches: game loops, time-based movement, velocity and gravity, angles and trigonometry, collision detection, adding and removing objects, and score, lives and restarting. Its eight stages run draw a balloon → move it → add a projectile → aim with the mouse → detect a hit → several balloons → gravity → score, lives and restart. The nine stubs cover all eight. It also records the rule this project exists to establish: "The game moves things by elapsed time. It does not move things a fixed number of pixels per frame."
- `06-paint/` established the canvas, the 2D context, the screen-to-canvas conversion, and drawing the picture again from the memory every time. All four are assumed here, and `skyPoint` is handed over rather than taught.
- `02-elevator/` established `requestAnimationFrame` for one moving car. This project widens it from one animation to a whole game.
- The sibling projects establish the shape: three files, pre-written wiring, stubbed core with plain-language doc comments, graduated hints, an answer key at the bottom, demo URL hashes, and a themed skin that makes the source worth reading.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **The invisible is made visible.** The angle, the length of both lists, and the frame's own clock all have a place on the stall.
3. **Time is the unit.** Nothing anywhere in this project moves by frames.
4. **A fair shot must pop.** The hit test is generous rather than clever, and the whole sky is within range of the cannon.
5. **Scope stays small on purpose.** More entity types and a library are the next two projects, not this one.

## Accessibility & Inclusion

No product-specific requirement beyond the general floor. Every control is a real `<button>` carrying an `aria-label` or plain text, with `aria-pressed` on the two clock keys. The Start key doubles as Pause and is reachable with **Space**, announced with `aria-keyshortcuts`. Play again is disabled before the first game, and Start is disabled once the stall has closed, so a key never lies about what it would do. The status line is a live region and names the responsible function whenever the game does nothing. Lives are drawn as balloons and also stated in the "Escaped" figure as text, so the count is never colour or shape alone. The aim dial is decorative and marked `aria-hidden`, because the same angle sits on the awning as a number. Aiming and firing are pointer gestures and are not reachable by keyboard; that is a real limit of this project, recorded here rather than papered over. Motion is limited to a hover lift and a press depression on the keys, both removed under reduced motion — the game's own movement is the point of the project and stays.

---
