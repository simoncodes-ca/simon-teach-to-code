---
version: 1
slug: "hangman-hangman-html"
primary_target: "hangman/hangman.html"
related_targets: []
---

---
version: 1
slug: "hangman-html"
primary_target: "hangman/hangman.html"
related_targets: []
---

# Hangman surface

## Scope & mode

`hangman/hangman.html`; Operate surface — a real hangman game Simon plays, and whose stubbed functions he fills in to make it work.

## Audience, job, action, proof, constraints

Simon (11) guesses letters to reveal the word; the action is pressing a letter button. Proof is the honest derived state: word display, rail, tally, and drawing all come from one game state. Must stay three plain files, offline, readable end to end.

## Direction contract

**THESIS:** A real pencil sketchbook page — the round is played by writing on paper; it refuses glossy game UI.

**OWN-WORLD:** Warm sketchbook paper; every mark in graphite grades HB–6B; a spiral gutter splits the drawing page from the play page; one red pencil owns wrong-guess strikes, the tally, focus, and the final stamp.

**STORY:** Simon guesses letters; every wrong guess is literally another pencil pass on the drawing; used letters stay crossed out in red; the round ends APPROVED or SCRAPPED.

**FIRST VIEWPORT:** Open sketchbook spread: title top of left page, large drawing left, gutter center, right page holds the word row, status line, A–Z rail (7x4), New word bottom right, red tally bottom left. Approved comp: `.impeccable/mocks/hangman-comp-a-spread.png`.

**FORM:** Measured comp build; signature interaction is the pencil stroke draw-on for each new figure part and tally hatch; reduced motion shows strokes instantly.

**RISK:** The drawing must stay state-driven SVG stroke groups, never a static picture; the sketch style must reach the comp's craft, not read as a filter doodle.

## Unresolved decisions

Exact graphite tone values and the win/lose stamp placement are implementation decisions.
