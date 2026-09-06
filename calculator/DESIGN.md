---
name: Simon's Calculator
description: A steel plate bolted to a floodlit concrete wall at night.
colors:
  wall: "#0e0f12"
  flood: "#ffb020"
  steel: "#2a2d33"
  steel-hi: "#4b5058"
  steel-lo: "#14161a"
  well: "#0a0b0d"
  green: "#35ff6b"
  green-lo: "#17a840"
  pink: "#ff2e88"
  pink-lo: "#ab1855"
  cyan: "#00d4ff"
  cyan-lo: "#0088a6"
  orange: "#ff6b18"
  orange-lo: "#a83c00"
  chalk: "#f2f2f0"
  ink: "#0d0f12"
typography:
  display:
    fontFamily: "Haettenschweiler, \"Arial Narrow\", Impact, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(30px, 6.6vw, 62px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
  readout:
    fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif"
    fontSize: "clamp(44px, 9vw, 68px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.02em"
    fontFeature: "tabular-nums"
  glyph:
    fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif"
    fontSize: "clamp(22px, 4.4vw, 30px)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.02em"
  term:
    fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 800
    lineHeight: 1.2
    fontFeature: "tabular-nums"
  label:
    fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.12em"
  caption:
    fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  plate: "16px"
  panel: "9px"
  well: "6px"
  chip: "4px"
  bolt: "3px"
spacing:
  key-gap: "11px"
  travel: "7px"
  plate-pad: "16px"
  inner-pad: "12px"
  yard-gap: "42px"
components:
  plate:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.plate}"
    padding: "{spacing.plate-pad}"
  plate-inner:
    backgroundColor: "#1a1c20"
    rounded: "{rounded.panel}"
    padding: "{spacing.inner-pad}"
  readout:
    backgroundColor: "{colors.well}"
    textColor: "{colors.chalk}"
    typography: "{typography.readout}"
    rounded: "{rounded.well}"
    padding: "14px 18px 16px"
  key-digit:
    backgroundColor: "{colors.green}"
    textColor: "{colors.ink}"
    typography: "{typography.glyph}"
    rounded: "{rounded.panel}"
    padding: "6px 8px 7px"
    height: "72px"
  key-operator:
    backgroundColor: "{colors.pink}"
    textColor: "#ffffff"
    typography: "{typography.glyph}"
    rounded: "{rounded.panel}"
    padding: "6px 8px 7px"
    height: "72px"
  key-equals:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.ink}"
    typography: "{typography.glyph}"
    rounded: "{rounded.panel}"
    padding: "6px 8px 7px"
    height: "72px"
  key-clear:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "6px 8px 7px"
    height: "50px"
  buffer-line:
    backgroundColor: "{colors.well}"
    textColor: "{colors.chalk}"
    typography: "{typography.term}"
    padding: "7px 14px"
  buffer-line-operator:
    backgroundColor: "{colors.well}"
    textColor: "{colors.pink}"
    typography: "{typography.term}"
    padding: "7px 14px"
  buffer-line-active:
    backgroundColor: "rgba(53, 255, 107, 0.14)"
    textColor: "{colors.green}"
    typography: "{typography.term}"
    padding: "7px 14px"
---

# Design System: Simon's Calculator

## Overview

**Creative North Star: "The Floodlit Yard / Bolted Plate"**

The page is a dark concrete wall at night with one sodium floodlight aimed high on it. Everything the user touches is a heavy steel plate bolted to that wall at four corners, standing off it far enough to throw a real shadow. The calculator is one plate; the buffer is a second plate of the same kind, standing on its own across a gap of bare wall. Nothing floats, nothing is a card: every object is fixed to something and lit from one direction.

Depth is the whole language. Objects are either raised (lit top edge, dark under edge, cast shadow down and to the right) or recessed (deep inset shadow with the light lip on the **bottom** edge, because a hole catches light on its far wall). The keys are extruded blocks with coloured side walls you can see, and pressing one sinks the cap into its own side wall. The colour is sprayed on — saturated green, pink, cyan and orange keycaps against gunmetal — so the instrument reads as workshop equipment rather than a phone app.

The wall is authored, not photographed: layered radial gradients for the flood pool and the falloff, plus an inline SVG `feTurbulence` data URI for grain. There is a raster wall plate on disk at `assets/plates/wall.png`, and the approved comp's wall region is real, but embedding it would have cost roughly 98KB of base64 inside a file written to be read end to end by a beginner. The procedural wall is a stated scope decision made against that product constraint, not a silent flattening; if the file ever stops being a teaching artifact, the raster is the upgrade path.

**Key Characteristics:**
- One light source, high and centre, warm sodium (`#ffb020`); every highlight and shadow obeys it.
- Two material states only: raised steel and recessed well.
- Four spray colours, each with a darker `-lo` riser that is the object's visible side wall.
- Saturated colour appears only on keycaps and buffer states; the chrome is gunmetal.
- Hard geometry, small radii (9-16px), no soft or glassy surfaces.

## Where things live

Three files, and the split is itself a product decision — the learner reads and edits `calculator.js` only.

- `calculator.html` — markup only. Every button carries an `id`; that id is the contract `calculator.js` binds to. The page also carries both wall-art sets (stencils and doodles), both title spellings, and the theme switch.
- `styles.css` — every token, component and rule in this document, in four labelled parts: the tokens, the shared skeleton, Simon's world, Anna's world. Nothing here needs editing for the calculator to work.
- `calculator.js` — the logic, deliberately left as stubs. It knows nothing about themes.

The CSS was inline in `calculator.html` for the first two builds and was extracted on request. Keep it extracted: `calculator.html` is short enough to read in one sitting precisely because the styling is not in it.

## Two worlds

One page, two complete looks. **Simon's world** (this document, the default) is the floodlit steel plate; **Anna's world** is the same machine dressed for her: a pink polka-dot wall, soft white plates with candy studs, everything round, everything pink.

The switch under the title is two radio buttons (`#theme-simon`, `#theme-anna`) that never show themselves — you click the labels, or arrow between them once a label has focus. No JavaScript is involved. Part 4 of `styles.css` is one big rule, `html:has(#theme-anna:checked) { … }`, holding Anna's tokens and skin; because its selector carries an id, every rule inside beats its default twin. A browser without `:has()` support simply never applies Anna's world — the page stays Simon's and still works.

**The Skeleton Rule.** Size and position are decided once, in the shared skeleton, and no theme changes them. A theme dresses the machine: colours, materials, corner radii, fonts, the wall backdrop, which wall art shows, which title spelling shows. Anna's structural overrides are exactly two tokens: `--travel: 6px` (5px in the 520px breakpoint, declared inside her own block) and `--radius: 18px`.

**The Restore Rule.** Each world hides the other's wall art (`display: none` on `.stencil` or `.doodle`) and the other's title span — and each world must explicitly restore its own (Anna's block re-declares `display` for `.doodle` and `.title__anna`). Add a new per-world hiding rule and you own its counterpart's restore.

### Anna's world in brief

- **Wall** `#ffd3e8` with a soft white glow high on the wall, deeper pink at the edges, and a 96px white polka-dot tile; white doodles (bow, kitty, heart, star, flower, sparkle, cloud) at 55% opacity with a candy drop-shadow.
- **Plates** white (`#ffffff → #fff9fc → #ffeaf4`), 28px radius, a 2px candy rim `rgba(255,143,191,.55)`, and a soft berry cast shadow; four 14px round candy studs instead of hex bolts. Tray 20px, wells 14px.
- **Keys** 18px radius: pale squishy digits, pink operators (white text, berry text-shadow), lavender equals, and clear as a red-and-white candy stripe whose label sits in a white pill. Risers: `#f0a8cd`, `--pink-lo`, `--lavender-lo`, `--red-lo`.
- **Text** reads in deep berry `#7a2e55` on white; selection is pink, focus ring is the bow red; the buffer's divider is dashed pink; the typeface is the round stack ("Comic Sans MS", "Chalkboard SE", …) everywhere, title included.
- **Material language unchanged.** Raised objects carry a lit top edge, recessed ones a lit bottom lip; the key travel is the riser; nothing floats. Only the materials and the rounding differ.

## Colors

A near-black gunmetal world lit warm from above, with four industrial spray colours doing all the signalling.

### Primary
- **Spray Green** (`#35ff6b`): the digit keycaps, the active buffer line, and text selection. Green is "input you are giving the machine".
- **Riser Green** (`#17a840`): the side wall under a digit key. Never a face colour.

### Secondary
- **Spray Pink** (`#ff2e88`): operator keycaps and operator lines in the buffer. Pink is "the thing that joins two numbers".
- **Riser Pink** (`#ab1855`): the operator key's side wall.
- **Signal Cyan** (`#00d4ff`): equals only, and the global focus ring. Cyan is the resolution colour and appears at most once in the keypad.
- **Riser Cyan** (`#0088a6`): the equals key's side wall.

### Tertiary
- **Hazard Orange** (`#ff6b18`): clear, and only clear. Carried with black 45-degree banding because the key throws work away.
- **Riser Orange** (`#a83c00`): the clear key's side wall.

### Neutral
- **Wall** (`#0e0f12`): the page ground, the concrete.
- **Flood** (`#ffb020`): not a fill — the tint of the wall's radial light pool at 34% and 13% alpha.
- **Steel** (`#2a2d33`), **Steel Highlight** (`#4b5058`), **Steel Shadow** (`#14161a`): the three stops of the plate's 160-degree brushed gradient, and the scrollbar thumb colour.
- **Well** (`#0a0b0d`): the bottom of every recessed surface — readout and buffer column, both gradient-filled from `#06070a` down to it.
- **Chalk** (`#f2f2f0`): readout digits, buffer terms, the white lozenge behind the clear label.
- **Ink** (`#0d0f12`): text on any spray-coloured surface.
- Muted grey (`#767d87`) carries the buffer's empty caption.

### Named Rules
**The Riser Rule.** Every spray colour ships as a pair: the face and its `-lo` riser. The `-lo` value is only ever a side wall or a border — never a background face, never text.

**The One Light Rule.** Warm light comes from the top centre. A raised object gets a white inset on its **top** edge; a recessed object gets its white inset on its **bottom** edge. Reversing that flips the object inside out.

**The No Glow Rule.** No zero-offset coloured glows. The title and the plate once carried them and they were removed; the floodlight is produced by the wall's own radial gradients and by the plate's cast shadow, never by a halo painted around an element. The single permitted soft light is the readout's `text-shadow: 0 0 16px rgba(242,242,240,.32)` — a phosphor on a recessed surface, not an aura around a raised one.

## Typography

**Display Font:** condensed system stack — Haettenschweiler / Arial Narrow / Impact, falling back to Helvetica Neue and Arial.
**Body / Panel Font:** Helvetica Neue, Helvetica, Arial, sans-serif.

**Character:** stencilled and industrial at the top of the page, plain equipment-panel sans everywhere else. `font-synthesis-weight: none` is set globally so no browser fakes a weight the installed face does not have.

The display face is a **system stack, not a self-hosted file**, because the product must open from the filesystem with zero external requests and its source must stay readable end to end by a beginner. The stencil character is not typographic: it comes from a three-band `mask-image` linear-gradient that cuts transparent bridges across the letterforms at 30-34% and 64-68% of their height, the way a spray stencil holds itself together. Any future display face must survive that mask.

### Hierarchy
- **Display** (700, `clamp(30px, 6.6vw, 62px)`, `line-height: 1`, `.1em`, uppercase): the page title only, masked with stencil bridges.
- **Readout** (800, `clamp(44px, 9vw, 68px)`, tabular figures, right-aligned): the number the calculator is showing. The largest object on screen.
- **Glyph** (900, `clamp(22px, 4.4vw, 30px)`, `-.02em`): the operator or digit on a keycap.
- **Term** (800, 21px, tabular): one entered term per buffer line.
- **Label** (800, 10-11px, `.1em`, uppercase): the buffer's empty caption and the keycap corner hint.
- **Caption** (800, 10px, `.08em`, **lowercase**): the spelled-out key name under each glyph, in Spanish ("siete", "entre", "igual").

### Named Rules
**The Tabular Rule.** Anything that shows a number the user typed — readout, buffer line, keycap hint — carries `font-variant-numeric: tabular-nums` so digits never shuffle as they change.

**The Spoken Name Rule.** A keycap carries three registers at once: the keyboard character in the corner (hint), the mathematical glyph in the centre, and the spoken name in lowercase at the foot. All three or none; the lowercase name is what makes the keypad teachable.

The spoken names are in **Spanish** (`siete`, `por`, `entre`, `más`, `igual`). The glyph and the corner hint stay language-neutral — a digit and a keyboard character mean the same thing in any language — so translating the keypad only ever touches the caption row. Keep accents (`más`); the page is UTF-8 and they are not optional in Spanish.

## Layout

One centred flex row, `.yard`, wrapping, with a 42px gap of bare wall between the calculator and the buffer — the gap is a material, not a margin. The page centres vertically in a `min-height: 100vh` body with `28px 20px` padding.

- **Calculator plate:** fixed `356px`. **Buffer plate:** fixed `236px`. Neither is fluid at desktop; the plates are objects with a size.
- **Keypad:** `grid-template-columns: repeat(4, 1fr)`, five rows, `gap: var(--gap)` (11px). Clear spans 3 columns on the top row beside divide; equals spans 2 on the bottom row. Digits fill 7-8-9 / 4-5-6 / 1-2-3 / 0-decimal, with the operator column on the right.
- **Buffer column:** no fixed height. `.yard` is `align-items: stretch` and the buffer plate, its tray and the column are each `flex: 1; min-height: 0`, so the column resolves to exactly the calculator's height whatever the keypad grows to. Never reintroduce a `min-height` here — it would break the pairing the moment the keypad changes.

**Breakpoints.**
- `max-width: 720px` — yard gap drops to 22px, both plates go `width: 100%; max-width: 380px` and stack. Stacked, the plates no longer pair by height, so the buffer column takes `min-height: 128px` to stay a usable panel.
- `max-width: 520px` — the token values themselves change: `--gap: 8px`, `--travel: 6px`. Body padding 18px/12px, plate padding 12px, inner padding 9px, readout padding `10px 13px 12px`, key min-height 58px, glyph 22px.

### Named Rules
**The Token Breakpoint Rule.** The small breakpoint re-declares `:root` custom properties rather than overriding individual components. Density changes are made once, at the token, and every surface inherits them.

## Elevation & Depth

This system is entirely depth. There is no flat surface on the page. Every element is either **raised** off the wall or **recessed** into a plate, and the shadow stack tells you which.

### Shadow Vocabulary
- **Bolted plate** (`inset 0 1px 0 rgba(255,255,255,.22), inset 0 -2px 0 rgba(0,0,0,.55), 0 2px 0 #0b0c0e, 22px 26px 44px rgba(0,0,0,.62)`): the standoff. A lit top edge, a dark under edge, a hard 2px body edge, then a long soft cast shadow down-right from the flood.
- **Recessed panel** (`inset 0 2px 5px rgba(0,0,0,.8), inset 0 -1px 0 rgba(255,255,255,.05)`): the `.plate__inner` tray milled into the plate face.
- **Well** (`inset 0 4px 10px rgba(0,0,0,.95), inset 0 -1px 0 rgba(255,255,255,.09)`): the deepest recess — readout and buffer column. Same stack for both; they are the same hole.
- **Extruded key at rest** (`inset 0 1px 0 rgba(255,255,255,.5), 0 var(--travel) 0 var(--<colour>-lo), 0 calc(var(--travel) + 4px) 10px rgba(0,0,0,.65)`): the visible side wall plus a shadow on the plate below it.
- **Extruded key pressed** (`inset 0 1px 0 rgba(255,255,255,.3), 0 0 0 var(--<colour>-lo), 0 1px 3px rgba(0,0,0,.7)`): the wall collapses to zero and the cap sits on the plate.
- **Bolt** (`inset 0 1px 0 rgba(255,255,255,.35), 0 1px 2px rgba(0,0,0,.8)`): a 13px hex head, `radial-gradient(circle at 34% 30%, #6d737c, #23262b 70%)`.

### Named Rules
**The Travel Rule.** A key's rest-state side wall and its press distance are the same number, `--travel`. Pressing translates the cap down by exactly `--travel` while the `0 var(--travel) 0` riser goes to `0 0 0`. Change one and you change the other; they are one variable on purpose.

**The Recess Lip Rule.** Raised objects take their white 1px inset on the top edge; recessed objects take it on the bottom. This is the single tell that separates a plate from a well and it is never violated.

**The Bolted Rule.** Any new object at plate scale gets four bolts and a cast shadow, or it does not belong on this wall. Nothing is allowed to float.

## Shapes

Hard-edged industrial geometry with small, consistent radii. Nothing is pill-shaped, nothing is circular except the bolt's highlight gradient.

- **Plate:** 16px. **Milled inner tray and keycaps:** 9px (`--radius`). **Wells:** 6px. **Clear's white lozenge:** 4px. **Bolt heads:** 3px on a 13px square — a hex head read at small scale, not a circle.
- Borders are rare and structural only: a hairline `rgba(255,255,255,.07)` divider between buffer lines.
- The only patterned fill in the system is clear's `repeating-linear-gradient(-45deg, rgba(0,0,0,.82) 0 12px, transparent 12px 28px)` hazard banding.

## Components

### Plate (signature)
The system's only container. Brushed 160-degree steel gradient, 16px radius, 16px padding, four 13px hex bolts pinned 9px in from each corner — two drawn by `::before` / `::after`, two by `<span class="bolt-b">` / `<span class="bolt-c">` because CSS gives an element only two pseudo-elements. Both the calculator and the buffer use it unchanged; the calculator plate is `356px`, the buffer plate fills its `236px` column.

### Recessed Tray
`.plate__inner`, a `#1a1c20` tray milled into the plate face at 9px radius and 12px padding. Everything interactive sits inside a tray, never directly on the plate.

### Readout
The deepest well in the system: a `#06070a` → well gradient, right-aligned, tabular, chalk on near-black with a soft phosphor `text-shadow`. Horizontally scrollable (`overflow-x: auto`) with a thin `steel-hi` thumb so long numbers never wrap or clip.

### Keys
- **Shape:** 9px radius, 72px minimum height, three-row internal grid (hint / glyph / name) with the hint left-aligned at the top and the name centred at the foot.
- **Digit** — green face (`linear-gradient(#4bff7d, var(--green) 58%)`), ink text, green riser.
- **Operator** — pink face (`linear-gradient(#ff5ba3, var(--pink) 58%)`), white text, pink riser. Right-hand column.
- **Equals** — cyan face (`linear-gradient(#4ce6ff, var(--cyan) 58%)`), ink text, cyan riser, spans 2 columns.
- **Clear** — orange with black hazard banding, spans 3 columns, shorter (50px) and single-row: its label sits in a chalk lozenge (`Clear` + a `#5a5f68` `esc` hint) so the banding never runs under the text.
- **Hover:** `translateY(-2px)` — the key lifts slightly off its wall.
- **Press** (`:active` **and** `[data-pressed="true"]`): `translateY(var(--travel))` with the riser collapsed. The data attribute exists so keyboard input can drive the same visual press the mouse does; every key state must be authored for both selectors together.
- **Transition:** `transform .07s ease-out, box-shadow .07s ease-out` — fast enough to feel mechanical, not animated.

### Buffer Column
A well identical to the readout's, always visible, holding one entered term per line at 15px, top to bottom, each separated by a hairline. Three line states: default (chalk), operator (pink text), and active — the term being typed right now — which takes a `rgba(53,255,107,.14)` wash, an `inset 3px 0 0 var(--green)` left bar and green text. The empty state is a 10px uppercase `#767d87` caption. There is no on/off control: the column is a permanent second instrument standing beside the calculator, and its type is set smaller than the readout's so it reads as the working-out, never as the answer.

### Focus & Selection
Global, deliberately themed rather than left to the browser: `:focus-visible { outline: 3px solid var(--cyan); outline-offset: 4px }` and `::selection { background: var(--green); color: var(--ink) }`. Scrollbars are `scrollbar-width: thin` with a `steel-hi` thumb on a transparent track.

### Reduced Motion
`prefers-reduced-motion: reduce` removes the key transition and the hover lift. The **press** displacement is kept: it is state feedback, not decoration.

## Do's and Don'ts

### Do:
- **Do** build any new container as a `.plate`: brushed steel, 16px radius, four hex bolts, cast shadow. Nothing floats on this wall.
- **Do** put interactive content inside a recessed tray or well, never straight onto the plate face.
- **Do** pair every spray colour with its `-lo` riser and drive the press with `--travel` on both the transform and the shadow.
- **Do** author the light from the top centre: white inset on the top edge for raised objects, on the bottom edge for recessed ones.
- **Do** author new density at `:root` in the 520px breakpoint rather than overriding components one by one.
- **Do** style every key state for `:active` and `[data-pressed="true"]` together.
- **Do** keep `font-variant-numeric: tabular-nums` on anything showing typed numbers.

### Don't:
- **Don't** add zero-offset coloured glows to the title, the plate, or any raised element. The floodlight lives in the wall's radial gradients.
- **Don't** use a `-lo` riser colour as a background face or as text.
- **Don't** put spray colour on chrome. Green, pink, cyan and orange belong to keycaps, buffer states, focus and selection — the plates and trays stay gunmetal.
- **Don't** use cyan for anything but equals and the focus ring, or orange for anything but clear.
- **Don't** introduce a second light direction, a second cast-shadow angle, or a soft/glassy surface treatment.
- **Don't** literalize the approved comp's keypad: it renders garbled keys (ORC / MRFE / MRU), duplicate divide keys, and is missing 7, 8, 9 and 0. The shipped grid is 4 columns x 5 rows with equals spanning 2 and clear spanning 3.
- **Don't** add a web font, an icon font, or any external request. Everything the page needs is in the file.
