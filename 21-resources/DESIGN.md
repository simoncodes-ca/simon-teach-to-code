---
name: Ore Run
description: A refinery weighbridge office in blue-grey steel, with a stencilled name plate, a credits counter on the plate, the yard under a plotting sheet, and graph-paper weigh tickets clipped down the side.
colors:
  steel: "#3b4a55"
  steel-lit: "#5b6d7a"
  steel-deep: "#1b242b"
  night: "#0d1216"
  paper: "#eef1ea"
  paper-deep: "#d3dbd2"
  ink: "#1d2830"
  signal: "#ff9a2e"
  signal-deep: "#b3621a"
  amber: "#ffbe5c"
  amber-deep: "#b3761a"
  alarm: "#e04a3a"
typography:
  stencil: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'Arial Black', sans-serif"
  label: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: Ore Run

> Recorded from the built page; see `21-resources/` for the implementation.

## Overview

The page is a refinery weighbridge office. It keeps project 20's furniture exactly: a plate across the top, a window on the left, a rack of four cards down the right, and a line of words under the window.

Project 20's desk was a scout's planning table. This one is the same steel repainted for the mine. Route orange stays, and search blue is gone.

Two colours carry meaning. Ore amber marks ore, loads, credits, and every bar. Route orange marks routes, goals, picked harvesters, the drag box and the chosen map. Alarm red still means no route.

## The desk

Blue-grey steel in three tones, lit from the top left, with faint horizontal brush marks. A thin near-black border holds a hairline of orange inside it.

Every region is placed as a percentage of the desk, so the whole desk scales together like one photograph. The desk is `min(100cqw, 150cqh)` wide with a 3:2 shape.

## The plate

A strip of dark steel with a bolt at each end and a faint orange inner line.

**ORE** is set in Impact, uppercase, with wide letter spacing, in pale blue-white. **RUN** follows in route orange.

Three black wells sit at the right-hand end. The map name and the working count are orange mono. Credits sit between them, in amber mono at 1.6cqw, half as big again as its neighbours, because it is the number the project is about. It is a live region.

## The window

The map sits in a 4:3 frame of near-black steel, then a thin orange line. A faint diagonal shine crosses it, and the edges darken slightly.

The canvas is 960 by 720, twenty cells by fifteen at 48 pixels each, drawn with the terrain table's seven tiles. The ore tile is new: brown dirt with amber crystals, made by a short script. Each harvester is project 17's blue hull with the turret tinted amber, at 70% scale.

Every mark on the map has a dark shadow under a bright line or fill, so it reads on grass, sand and ore alike:

| Mark | Drawn as |
|---|---|
| Patch with ore left | An amber fill and outline, from 12% to 42%, by how full it is |
| Ore left in a patch | Its number in bold amber mono, low in the cell |
| Spent patch | A 42% dark shade over the tile, and no number |
| The refinery | A near-black pad, an amber outline, and an amber hopper |
| Refinery label | REFINERY in 11px bold, amber, above the pad |
| Load of a harvester | A 28 by 5 amber bar above it, on a dark track |
| Route of a driving harvester | A thin orange line, ending in a small orange X |
| Cell under the mouse | A thin white square |
| Closest patch to the mouse | An amber ring |
| Harvester under the mouse | A thin white ring |
| Picked harvester | Four orange corner brackets |
| Drag box | An orange outline over a 10% orange fill |
| Harvester with no route | A red ring that fades over 1.4 seconds |

## The cards

Four graph-paper cards down the right, each held by a steel clip at the top centre. Each card has faint blue ruled lines, a soft shadow on the steel, and an Impact title over a thin ink rule. A small italic note can sit at the right end of the title.

**Squad** fills the space left in the rack. It holds six strips, one per harvester. A strip shows a lamp, the name in Impact, the job in a black mono tag, the load in italic, and a bar. A picked strip turns orange with an ink outline, and its lamp glows. The tag is amber while the harvester digs or unloads, orange while it drives, and white on red for no route.

**Refinery** is three black wells with amber mono values, three across: Ore a minute, Loads tipped and Tipping now. A wide bar under them shows how full the harvester at the hopper still is.

**Field** is three black wells with orange mono values: Patches, Ore left and Taken. A wide bar under them shows the share of the field already dug out.

**Under the mouse** is six black wells with orange mono values, three across: Cell, Ground, Ore, Full, Nearest and Steps to it.

**Maps** is a two-column grid of steel keys, one per map file. The map on the board is an orange key.

## The bars

Every bar on the page is the same part: a dark track with an inset shadow, and an amber fill that runs from `#ffe0a8` to `#b3761a`. The fill's width is a percentage, set from the learner's own `fullness`, and it eases over 0.1 seconds.

Squad bars are 0.9cqh tall. The Refinery and Field bars are 1.2cqh and full width. Nothing else on the page draws a bar.

## The status line

Orange mono under the window, with a small dark drop shadow. It is a live region. It names the next job until every function works, then says what just happened.

## Sounds

Six short synthesised sounds, all from project 20: a pick, a box, an order, an arrival, a low buzz for no route, and a new map. Project 20's found pips are reused here for a load tipped into the refinery.

## Responsive behavior

Below 900px the desk stands up into one column and the page scrolls. The plate, the window, the status line and the cards stack in that order. The name and the credits take their own line, and the window holds 4:3 at full width.

Every measurement switches from container units to pixels at that point. Squad buttons grow to 44px tall and map buttons to 48px, bars to 10px and 14px, and the focus ring becomes a 3px red outline. Measured at 390px wide, the page has no sideways scroll.
