---
name: Route Finder
description: A scout's route finder in blue-grey steel, with a stencilled name plate, the map under a plotting sheet, and graph-paper route cards clipped down the side.
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
  search: "#57d0e0"
  alarm: "#e04a3a"
  lamp: "#8fdc5c"
typography:
  stencil: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'Arial Black', sans-serif"
  label: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: Route Finder

> Recorded from the built page; see `20-pathfinding/` for the implementation.

## Overview

The page is a scout's route finder. It keeps project 19's frame exactly: a plate across the top, a window on the left, a rack down the right, and a line of words under the window.

Project 19 was an olive command post. This desk is the same furniture repainted for planning. Blue-grey steel replaces olive, and graph-paper cards replace manila.

Two colours carry meaning. Route orange marks routes, goals, picked tanks, the drag box and the chosen map. Search blue marks the frontier, the neighbour dots, the chosen way to search, and the Search card's numbers. Alarm red means no route.

## The desk

Blue-grey steel in three tones, lit from the top left, with faint horizontal brush marks. A thin near-black border holds a hairline of orange inside it.

Every region is placed as a percentage of the desk, so the whole desk scales together like one photograph. The desk is `min(100cqw, 150cqh)` wide with a 3:2 shape.

## The plate

A strip of dark steel with a bolt at each end and a faint orange inner line.

**ROUTE** is set in Impact, uppercase, with wide letter spacing, in pale blue-white. **FINDER** follows in route orange.

Three black wells sit at the right-hand end with orange mono values. They name the map, count the picked tanks, and name the way to search.

## The window

The map sits in a 4:3 frame of near-black steel, then a thin orange line. A faint diagonal shine crosses it, and the edges darken slightly.

The canvas is 960 by 720, twenty cells by fifteen at 48 pixels each, drawn with project 18's six terrain tiles. Faint dark lines separate the cells. Each tank is project 17's blue hull and turret at 70% scale.

Every mark on the map has a dark shadow under a bright line or fill, so it reads on grass, sand and water alike:

| Mark | Drawn as |
|---|---|
| Cell under the mouse | A thin white square |
| Cells next door to the mouse | Small blue dots on a dark ring |
| Cell the search found | A 40% dark shade, with its steps in bold white mono, outlined in dark |
| Frontier cell | A blue square, inset 3 pixels, over a 22% blue fill |
| Route the search found | A thick orange line through the cell middles |
| Route of a moving tank | A thin orange line, ending in a small orange X |
| Goal of the search | A large orange X, red when there is no route |
| Tank under the mouse | A thin white ring |
| Picked tank | Four orange corner brackets |
| Drag box | An orange outline over a 10% orange fill |
| Tank with no route | A red ring that fades over 1.4 seconds |

## The cards

Four graph-paper cards down the right, each held by a steel clip at the top centre. Each card has faint blue ruled lines, a soft shadow on the steel, and an Impact title over a thin ink rule. A small italic note can sit at the right end of the title.

**Squad** fills the space left in the rack. It holds six strips, one per tank. A strip shows a lamp, the name in Impact, the last report in a black mono tag, and the cells left on its route in italic. A picked strip turns orange with an ink outline, and its lamp glows. The tag is orange for driving, green for arrived, and white on red for no route.

**Search** has two steel keys, Breadth-first and A\*. The chosen key turns search blue. Under them sit four black wells with blue mono values: Looked at, Frontier, Route and Result.

**Under the mouse** is six black wells with orange mono values, three across: Cell, Ground, Ways out, Steps, Guess and Total.

**Maps** is a two-column grid of steel keys, one per map file. The map on the board is an orange key.

## The status line

Orange mono under the window, with a small dark drop shadow. It is a live region. It names the next job until every function works, then says what just happened.

## Sounds

Seven short synthesised sounds. Six come from project 19: a pick, a box, an order, an arrival, a low buzz for no route, and a new map. The seventh is new: three rising square-wave pips when the search finds the goal.

## Responsive behavior

Below 900px the desk stands up into one column and the page scrolls. The plate, the window, the status line and the cards stack in that order. The name takes its own line, and the window holds 4:3 at full width.

Every measurement switches from container units to pixels at that point. Squad buttons grow to 44px tall, the way and map buttons to 48px, and the focus ring becomes a 3px red outline.
