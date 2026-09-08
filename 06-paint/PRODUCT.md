# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in three files: `paint.html`, `styles.css`, `paint.js`, with hand-made sounds under `assets/`. One `<canvas>` element, drawn with the 2D context. No build step, no dependencies, no framework, no network. Opens by double-clicking `paint.html`. This matches the five sibling projects, where the source itself is the deliverable and tooling would obscure it.

## Users

- **Simon (primary learner), 11 years old.** He did the calculator, the elevator, hangman, blackjack and battleship. His job is to open `paint.js`, read it top to bottom, and fill in the stubbed functions until he can draw, undo, redo, clear and save. He reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, teaches alongside it, and explains how what is on screen maps to the code that produces it.
- **Anyone who picks it up to draw.** The brush has to feel immediate, and Undo has to be trustworthy. A drawing program that loses a stroke is not a teaching aid, it is a broken toy.

## Product Purpose

A drawing program that is also the first lesson in Canvas, and the first lesson in keeping a history.

Canvas is the tool the rest of the trail is built on — every game from project 7 draws into one. But the idea worth the project is smaller and sharper than the API: **a canvas is a sheet of pixels and remembers nothing, so the program has to remember the drawing itself.** Undo is then not a feature bolted on at the end. It is what falls out for free once the strokes live in a list and the picture is drawn again from that list on every frame.

That is also the last step in the argument this repo has been making since hangman: the screen is a picture of the memory. Here the screen is literally incapable of being anything else.

## Positioning

Most beginner Canvas tutorials draw the segment straight onto the canvas as the mouse moves and never look back. That is fewer lines, it is what "draw a line with the mouse" tutorials teach, and it makes undo impossible — which is why those tutorials never have undo, and why the ones that do bolt on `getImageData` snapshots, teaching that history means storing pictures.

This project stores strokes instead, and redraws the whole picture on every mouse move. It costs a `render()` the learner has already written five times, and it buys undo, redo, clear-then-redo, and a history strip that shows the two lists on screen. It also makes the eraser a brush loaded with the paper's colour rather than a special case, so nothing in the learner's nine functions has to know an eraser exists.

## Operating Context

- Opened directly from the filesystem in a browser — no server, no install, no network.
- Edited in a text editor beside the running page, likely with both windows visible at once.
- Mouse or trackpad on a laptop, or a finger on a tablet: pointer events cover all three, and the canvas sets `touch-action: none` so a drag draws instead of scrolling.
- Sessions are short: one or two stub functions at a time, with the father nearby.

## Capabilities and Constraints

**In scope now:**
- A 1024×768 canvas drawn as a cream sheet taped to a drawing board, scaling to the window without changing its own coordinates.
- Freehand strokes: press, drag, release. A stroke is `{ colour, size, points }` and a press without a drag is a dot.
- Ten pans of gouache and four nibs, both built from lists in the source, so adding a colour is one line.
- An eraser that is the brush loaded with `PAPER`, and a Brush panel that previews the current stroke over a grey guide squiggle so the eraser's effect is visible.
- Undo and redo over two stacks, `strokes` and `undone`, with the redo pile emptied whenever a new stroke lands.
- Clear implemented as repeated undo, so a cleared sheet can be redone stroke by stroke.
- A history strip on the ledge drawing one tick per stroke — solid for on the paper, hollow for waiting on the undo pile.
- A coordinate readout on the masking tape, in paper pixels, proving `canvasPoint` works before anything is drawn.
- Save as PNG via a data URL and a synthetic download link.
- **Z** and **Y** shortcuts, keys that disable themselves when they would do nothing, and a status line that names the exact stub responsible whenever an action does nothing.
- Graduated hints per stub in comments: a gentle nudge, then a stronger hint, then a pointer to the answer key — one comment block at the bottom of `paint.js`, grouped by function.

**Explicitly deferred (later projects or extensions):** layers, a fill/bucket tool, shapes and straight lines, a spray or textured brush, pressure or velocity-varying width, zoom and pan, a colour picker beyond the ten pans, a stroke cap for very long drawings, and saving the drawing so it survives a refresh — that last one is project 13's lesson, and is named in the source as the good thing to try next.

**Hard constraints:**
- No dependencies, no build step, no framework, no network requests.
- One canvas. No offscreen buffers, no `getImageData` snapshots — the strokes list is the only history.
- The whole implementation stays small enough for a beginner to read end to end.
- No abstraction that exists only for elegance. Repetition he can follow beats indirection he cannot.
- Comments use plain language for someone who has never programmed.
- Simon writes the coordinate conversion, the stroke drawing, the three parts of making a stroke, undo, redo, clear and save. The HTML/CSS, the render loop, the tin, the preview, the history strip, the pointer handlers and the keys are given.
- The initial page is an inert scaffold: a blank sheet, a grey guide squiggle in the Brush panel, and a status line naming the first stub. Every completed stub makes something new visible.
- Stubs are filled in file order, top to bottom.

## Brand Commitments

"Simon's Paint" is one studio bench seen from directly above: a birch drawing board, a sheet of cream cartridge paper held down by four corners of masking tape, and a zinc tin of paints on the ledge beside it. The bench, the board and the tin are all muted — wood, tape, zinc, paper. **The only saturated colour on the page is the paint itself**, in the pans, in the preview and on the paper. Teal marks the one key that produces something to keep. No spatter, no palette-knife texture, no drop-shadowed toolbar chrome.

## Evidence on Hand

- `ROADMAP.md` names the paint app project 6 and lists what it teaches: Canvas drawing, pointer events, screen and canvas coordinates, drawing lines and shapes, keeping input separate from drawing, history stacks, undo and redo. Its stages run dot → drag → size → colour → eraser → clear → undo → redo → save, and the scaffold's nine stubs cover all nine. It also records why the project matters later: "Canvas connects webpage programs to game graphics."
- The sibling projects `01-calculator/` through `05-battleship/` establish the pattern: three files, pre-written wiring, stubbed core with plain-language doc comments, graduated hints, an answer key at the bottom, demo URL hashes, and a themed skin that makes the source worth reading. Simon completed and understood all five.
- Battleship established the coordinate readout as a device — a fact the program normally keeps to itself, put on the page where it can be watched. The masking-tape readout here is the same idea for canvas coordinates.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a lost stroke.
2. **The invisible is made visible.** The point under the cursor, the stroke about to be made, and the two history lists all have a place on the bench.
3. **Undo is sacred.** A history that drops or duplicates a stroke breaks the one idea the project exists to teach.
4. **Scope stays small on purpose.** Layers and shapes are more of the same. They are not another idea.
5. **Beauty earns the reading.** The page has to feel like a bench worth sitting at, or the source will never get read.

## Accessibility & Inclusion

No product-specific requirement beyond the general floor. Every pan, nib and tool is a real `<button>` carrying an `aria-label` and an `aria-pressed` state, so the tin can be read and operated without seeing it. Keys disable themselves rather than dimming silently, so Undo, Redo, Clear and Save all report honestly whether they would do anything. The status line is a live region and names the responsible function whenever an action does nothing. The **Z** and **Y** shortcuts are announced with `aria-keyshortcuts` and shown as key caps that are hidden from screen readers. The history strip is decorative and marked `aria-hidden`, because the same two numbers are on the tape as text. Selected state is never colour alone — a pressed pan lifts and takes a pale ring, a pressed nib turns to paper white, a pressed tool inverts. Drawing itself is a pointer gesture and is not reachable by keyboard; that is a real limit of this project, recorded here rather than papered over.

---
