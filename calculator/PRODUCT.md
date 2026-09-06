# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS. No build step, no dependencies, no framework. The project must open by double-clicking `index.html`. Chosen by the user because the source is part of the deliverable and any tooling between the file and the result would obscure it.

## Users

Two users with different jobs, both real:

- **The son (primary learner).** A total beginner to programming. His job is to open the source, read it top to bottom, understand it, and change things to see what happens. He has no prior vocabulary for abstractions, build tools, or indirection.
- **The father (the user of this request).** Uses the project as a teaching artifact — he opens it alongside his son to explain how the thing on screen maps to the code that produces it.
- **The everyday operator.** Whoever picks the calculator up to do quick arithmetic. The result must be correct and the interaction must need no explanation.

## Product Purpose

A working calculator that is simultaneously a legible first program. Success is not "the arithmetic is right" alone — success is a beginner reading the source and recognising, without help, which lines produce which behaviour on screen.

## Positioning

Most beginner calculator tutorials are either ugly or unreadable. This one is neither: it is a genuinely well-made calculator whose entire implementation a first-time reader can hold in their head. The craft of the interface is what makes the source worth reading; the legibility of the source is what makes the interface worth teaching from.

## Operating Context

- Opened directly from the filesystem in a browser — no server, no install, no network.
- Read and edited in a text editor side by side with the running page, likely with the two windows visible at once.
- Sessions are short: a few calculations, or one explanation of one behaviour.

## Capabilities and Constraints

**In scope now:** addition, subtraction, multiplication, division, and a clear button. Digit entry and a decimal point are implied by "everyday quick math" and are in scope.

**Explicitly deferred:** history/tape, keyboard shortcuts beyond the obvious, scientific functions, memory, percentage, sign flip, persistence, sharing. These are not "missing" — they are held back so the source stays short enough to read in one sitting.

**Hard constraints:**
- No dependencies, no build step, no package manager, no framework.
- The whole implementation must stay small enough for a beginner to read end to end.
- No abstraction that exists only for elegance. Repetition a beginner can follow beats indirection they cannot.
- Comments are written in plain language for someone who has never programmed.
- Division by zero must produce a comprehensible on-screen result, not a crash or `Infinity` with no explanation.

**Undecided:** whether the source stays in a single `index.html` or splits into `.html`/`.css`/`.js` files is a teaching-sequence decision to make at build time, not a settled product fact.

## Brand Commitments

None. There is no existing name, logo, palette, or voice to preserve.

## Evidence on Hand

None. There are no customers, testimonials, benchmarks, screenshots, or prior versions. The repository is empty apart from Impeccable's own config. Future work must not fabricate any.

## Product Principles

1. **The source is a deliverable.** Code a beginner cannot read is a defect, of the same severity as arithmetic that returns the wrong number.
2. **Correctness is non-negotiable.** It is a real calculator before it is a teaching aid; a lesson built on a tool that lies is worse than no lesson.
3. **Scope stays small on purpose.** Every feature added is source a beginner has to get through before reaching the part that matters.
4. **Beauty earns the reading.** The interface has to be good enough that he wants to know how it works. A drab teaching example teaches nothing but that programming is drab.
5. **Nothing hidden between the file and the screen.** No tooling, no transpilation, no magic — what he reads is exactly what runs.

## Accessibility & Inclusion

No product-specific requirement was established beyond the general floor. Note that a beginner reading the source will also read the markup, so the HTML being semantically honest (real `<button>` elements, sensible labels) serves both accessibility and the teaching purpose at once.
