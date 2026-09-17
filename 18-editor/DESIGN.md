---
name: Map Editor
description: A surveyor's drafting table in walnut, with a paper label pinned in brass, the map under glass, and paper index cards for the palette, the pencil, the saved letters and the maps.
colors:
  walnut: "#4a3222"
  walnut-lit: "#6d4b32"
  walnut-deep: "#231710"
  felt: "#1b1712"
  paper: "#f1e6c9"
  paper-deep: "#dccb9f"
  ink: "#2a2017"
  brass: "#e0b154"
  brass-deep: "#9a6d22"
  pencil: "#c9492f"
typography:
  display: "'Georgia', 'Palatino Linotype', 'Book Antiqua', serif"
  label: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: Map Editor

> Recorded from the built page; see `18-editor/` for the implementation.

## Overview

The page is a surveyor's drafting table, seen from above. It keeps the frame every project since 9 has used: a label across the top, a window on the left, a rack down the right, and a line of words under the window.

Project 17 was a painted army console, built to be used in a hurry. This is a desk, built to be worked at slowly. Walnut replaces steel, paper replaces enamel, and a serif face replaces the stencil.

Brass is the table's own colour. Red pencil marks what the learner is doing: the word Editor, the chosen ground, and anything that went wrong.

## The table

Walnut in three tones, lit from the top left, with faint grain running across it. A thin dark border holds a hairline of brass inside it.

Every region is placed as a percentage of the table, so the whole desk scales together like one photograph. The table is `min(100cqw, 150cqh)` wide with a 3:2 shape.

## The label

A strip of cream paper with faint ruled lines, turned a quarter of a degree off square. A brass pin holds each end down.

**Map** is set in bold Georgia, in ink. **Editor** follows in italic, in red pencil, as if written in by hand.

Two dark wells sit at the right-hand end with brass mono digits. One names the map on the table. The other counts the cells changed since the last save.

## The window

The map sits under glass in a 4:3 frame: dark walnut, then a thin brass line. A faint diagonal reflection crosses the glass, and the edges darken slightly.

The canvas is 960 by 720, twenty cells by fifteen at 48 pixels each. Faint dark lines separate the cells. The cell under the mouse carries a cream outline over a dark one, so it reads on every terrain. A painted cell flashes pale cream and fades in a quarter of a second.

With no map, the window is dark felt with **NO MAP YET** in brass mono, and the name of the empty function under it.

The cursor is a crosshair over the map.

## The terrain

Six seamless 48-pixel tiles, drawn by code in a browser canvas and saved once. Every feature near an edge is drawn again on the far side, so tiles meet without a seam. Each is painted from above, lit from the top left.

| Terrain | Picture |
|---|---|
| Grass | Mid green with soft patches and short blades |
| Road | Pale cobbles in offset rows, lit on top and shadowed below |
| Sand | Warm yellow with fine grain and small ripple arcs |
| Forest | Round tree crowns with shadows, over dark grass |
| Water | Mid blue with pale wave marks and a few glints |
| Rock | Grey boulders with a cast shadow and one crack each |

Each terrain's `colour` in the table is the stripe down the left edge of its palette button.

## The cards

Four cards down the right. Each is cream paper with ruled lines, a soft shadow on the walnut, and a Georgia title over a thin ink rule. A small italic note sits at the right end of the title.

**Ground** is two columns of buttons, one for each line of the table. A button shows the tile as a swatch, the name in bold, the letter as a small key cap, and the count in mono. The chosen button turns bright white with an ink outline, and a red pencil mark follows its name.

**Under the pencil** is four dark wells with brass mono values: Cell, Ground, Tanks and Speed.

**Saved map** fills the space left in the rack. The letters of the map are set in bold mono with wide letter spacing, so twenty letters make a square-looking grid. While `mapToLines` is empty, the panel says so in red pencil.

**Maps** holds the name box, two keys, and the list of maps on the server. The name box is italic Georgia on a pale ground with an ink underline. **Save** is a brass key. **New map** is a walnut key. Each map in the list is an italic name with a small outlined Load button, and the map on the table is washed in brass. When the server does not answer, the note turns red and the list offers **Ask again**.

## The status line

Brass mono under the window, with a small dark drop shadow. It is a live region. It names the next job until every function works, then says what just happened.

## Responsive behavior

Below 900px the table stands up into one column and the page scrolls. The label, the window, the status line and the cards stack in that order. The label stops turning, the name takes its own line, and the window holds 4:3 at full width.

Every measurement switches from container units to pixels at that point. Palette buttons and keys grow to 48px tall, Load buttons to 40px, and the focus ring becomes a 3px red outline.

Picking a terrain by its letter needs a keyboard. The palette buttons work without one.
