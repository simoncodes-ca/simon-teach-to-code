---
version: 1
slug: "calculator-html"
primary_target: "calculator.html"
related_targets: []
---

# Surface brief — calculator.html

Scope: the single self-contained calculator page. Visitor mode: Operate.

Audience: an 11-year-old boy doing quick arithmetic, and his father reading the source with him. Task: enter numbers and one of + - x /, get a correct answer, clear. Constraint: all HTML and CSS live inside `calculator.html` and are not to be edited by the learner; `calculator.js` holds stubs only, no implemented logic.

Memorable moment: the buffer strip. Toggling it on turns the calculator into a visible record of what was entered, which is exactly the state a beginner has to reason about when writing the logic.

Unresolved: none blocking. Whether the buffer defaults to on is set to off, so the toggle is a discovery.

## Direction contract

THESIS: Every key is a periodic-table element tile — corner index, monumental glyph, small name. Refuses the rounded dark keypad with an orange operator column that this category always ships.

OWN-WORLD: Cool chart paper #EDF0F7, ink #10131C. Cobalt #1B47E0 digits, magenta #E8258E operators, lime #B8E62A equals, tangerine #FF6B18 hazard-banded clear. Chunky grotesk, ruled cells, flat silkscreen fills, true key travel and cast shadow.

STORY: He sees a science chart, not a phone app; believes this is a real instrument worth decoding; enters a calculation and clears it.

FIRST VIEWPORT: Centred column. Masthead "SIMON'S CALCULATOR" in monumental caps over a rule; one wide readout tile, the largest object on screen; the togglable buffer strip of pinned cells beneath; then a 4-column tile keypad. Primary action is the keypad.

FORM: Element Tile Chart, candidate 7 of 7, seed key 2543848d.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
