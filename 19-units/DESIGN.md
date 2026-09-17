---
name: Command Post
description: A field command post in olive steel, with a stencilled name plate, the map under a plotting sheet, and manila order cards clipped down the side.
colors:
  olive: "#4a5132"
  olive-lit: "#69714a"
  olive-deep: "#22261a"
  night: "#14160d"
  manila: "#e6d6a6"
  manila-deep: "#cdb982"
  ink: "#23261a"
  signal: "#f3c62b"
  signal-deep: "#a9841a"
  alarm: "#d64a2e"
  lamp: "#8fdc5c"
typography:
  stencil: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'Arial Black', sans-serif"
  label: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: Command Post

> Recorded from the built page; see `19-units/` for the implementation.

## Overview

The page is a field command post, seen from the officer's chair. It keeps the frame every project since 9 has used: a plate across the top, a window on the left, a rack down the right, and a line of words under the window.

Project 18 was a drafting table for making maps slowly. This is the desk where those maps are used. Olive steel replaces walnut, stencil replaces the serif, and manila order cards replace the index cards.

Signal yellow means picked. It marks the word Post, the corners round a picked tank, the drag box, the goal crosses, the lit squad lamps and the chosen map. Alarm red means blocked.

## The desk

Olive steel in three tones, lit from the top left, with faint horizontal brush marks. A thin near-black border holds a hairline of yellow inside it.

Every region is placed as a percentage of the desk, so the whole desk scales together like one photograph. The desk is `min(100cqw, 150cqh)` wide with a 3:2 shape.

## The plate

A strip of dark steel with a bolt at each end and a faint yellow inner line.

**COMMAND** is set in Impact, uppercase, with wide letter spacing, in pale cream. **POST** follows in signal yellow.

Two black wells sit at the right-hand end with yellow mono values. One names the map. The other counts the picked tanks, and shows a dash while `selectedTanks` is empty.

## The window

The map sits in a 4:3 frame of near-black steel, then a thin yellow line. A faint diagonal shine crosses it, and the edges darken slightly.

The canvas is 960 by 720, twenty cells by fifteen at 48 pixels each, drawn with project 18's six terrain tiles. Faint dark lines separate the cells. The cursor is a crosshair.

Each tank is project 17's blue hull and turret at 70% scale, both turned to the tank's `angle`.

Every mark on the map has a dark shadow line under a bright line, so it reads on grass, sand and water alike:

| Mark | Drawn as |
|---|---|
| Tank under the mouse | A thin white ring |
| Picked tank | Four yellow corner brackets |
| Drag box | A yellow outline over a 10% yellow fill |
| Tank inside the drag box | A soft yellow disc |
| Goal of a moving tank | A yellow X, joined to the tank by a faint yellow line |
| Blocked tank | A red ring that fades over 1.4 seconds |

## The cards

Four manila cards down the right, each held by a steel clip at the top centre. Each card has faint ruled lines, a soft shadow on the steel, and an Impact title over a thin ink rule. A small italic note can sit at the right end of the title.

**Squad** fills the space left in the rack. It holds six strips, one per tank. A strip shows a lamp, the name in Impact, the last report in a black mono tag, and the ground under the tank in italic. A picked strip turns yellow with an ink outline, and its lamp glows. The tag is yellow for ordered and driving, green for arrived, and white on red for blocked.

**Under the mouse** is four black wells with yellow mono values: Cell, Ground, Tank and Speed.

**Orders** lists the four controls, each with a small key cap and an italic result. A black well under them shows the drag box's edges while a drag is in progress.

**Maps** is a two-column grid of olive keys, one per map file. The map on the board is a yellow key.

## The status line

Yellow mono under the window, with a small dark drop shadow. It is a live region. It names the next job until every function works, then says what just happened.

## Sounds

Six short synthesised sounds: two rising pips for a pick, a rising sweep for a box, radio squelch and three pips for an order, a low double thump for an arrival, a low buzz for a blocked tank, and a clack with a chord for a new map.

## Responsive behavior

Below 900px the desk stands up into one column and the page scrolls. The plate, the window, the status line and the cards stack in that order. The name takes its own line, and the window holds 4:3 at full width.

Every measurement switches from container units to pixels at that point. Squad buttons grow to 44px tall, map buttons to 48px, and the focus ring becomes a 3px red outline.

Giving an order needs a pointer. The squad buttons pick tanks without one.
