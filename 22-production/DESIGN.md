---
name: Build Yard
description: Project 21's refinery weighbridge office with the weigh tickets swapped for an order pad, a price list you click, and a docket queue under it.
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

# Design System: Build Yard

> Recorded from the built page; see `22-production/` for the implementation.

## Overview

The page is project 21's weighbridge office, given an order pad. The furniture does not move: a plate across the top, a window on the left, a rack of cards down the right, and a line of words under the window.

Two cards are new and they sit at the top of the rack, because they are what the project is about. **Build** is a price list. **Queue** is the dockets under it. The Field card is gone, and Under the mouse is gone with it — both belonged to project 21's lesson, and keeping them would have buried this one.

Ore amber still marks ore, loads and credits. Route orange still marks routes, goals, picked units, the drag box and the chosen map. The catalogue adds five tints of its own, one per line of the table, and they appear in exactly two places: a stripe down the left of each button, and the pad the building lands on.

## The desk

Unchanged from project 21. Blue-grey steel in three tones, lit from the top left, with faint horizontal brush marks, a near-black border and a hairline of orange inside it.

Every region is placed as a percentage of the desk, so the whole desk scales together like one photograph. The desk is `min(100cqw, 150cqh)` wide with a 3:2 shape.

## The plate

**BUILD** in Impact, uppercase, pale blue-white. **YARD** follows in route orange.

Three black wells at the right-hand end: the map name, the credits, and the unit count. Credits are amber mono at 1.6cqw, half as big again as their neighbours, and a live region. The others are orange mono.

## The window

The map sits in a 4:3 frame of near-black steel behind a faint diagonal shine. The canvas is 960 by 720, twenty cells by fifteen at 48 pixels each, drawn with the terrain table's seven tiles.

Every mark carries a dark shadow under a bright line or fill, so it reads on grass, sand and ore alike. Project 21's marks all stay. Two are new, and one is gone:

| Mark | Drawn as |
|---|---|
| The refinery | A near-black pad, an amber outline, and an amber hopper |
| **A finished building** | A near-black pad, an outline and a 25% wash in its own catalogue colour |
| **Its name** | Its three letters in 11px bold, in the same colour, in the middle of the pad |
| A harvester | Project 17's blue hull, turret tinted amber, at 70% |
| A tank | The same hull and turret, tinted pale blue |
| Load of a harvester | A 28 by 5 amber bar above it. A tank has none |
| Patch with ore left | An amber fill and outline, from 12% to 42%, by how full it is |
| Spent patch | A 42% dark shade over the tile, and no number |
| Route of a driving unit | A thin orange line, ending in a small orange X |
| Picked unit | Four orange corner brackets |
| Drag box | An orange outline over a 10% orange fill |
| Unit with no route | A red ring that fades over 1.4 seconds |

Gone: the amber ring on the nearest patch, which belonged to project 21's `nearestOre`.

## The cards

Five graph-paper cards down the right, each held by a steel clip at the top centre, with faint blue ruled lines and an Impact title over a thin ink rule.

**Build** is the new centre of the page. Five buttons, one per line of the catalogue, in the table's own order. Each is a two-row grid: the name in Impact on the left, the price and build time in small mono on the right, and one line of state under both.

A 0.3cqw stripe of the item's own colour runs down the left edge. A live button sits on white at 50%, lifts to warm amber on hover, and its state line reads **BUILD** in deep orange. A dead button is a real `disabled` button on white at 20%, with its state line in one of four words:

| Word | Colour | It means |
|---|---|---|
| BUILD | Deep orange | Click it |
| BUILT | Green | You own one |
| ON ORDER | Slate blue | One is in the queue now |
| NEEDS ‹THING› | Ink, faded | Build that first |
| TOO DEAR | Deep red | Save up |
| YARD BUSY | Ink, faded | Five things are queued |

The reason is always a word. Colour never carries it alone.

**Queue** holds two black wells — what is being built, and a countdown to an empty queue in `m:ss` — over a stack of dockets. Each docket is a white strip with its place in the line, its name, and a bar. The front docket is amber, because it is the only one being worked on. An empty queue reads *Nothing on order.* in small italics.

**Refinery** is three black wells with amber mono values: Ore a minute, Ore left and Harvesters.

**Squad** takes whatever room is left and scrolls, because the list grows every time a unit rolls out. Each strip is project 21's exactly: a lamp, the name in Impact, the job in a black mono tag, the load in italic, and a bar. A tank's load column reads *tank* instead of a number.

**Maps** is a two-column grid of steel keys, one per map file. The map on the board is an orange key.

## The bars

Every bar is the same part: a dark track with an inset shadow, and an amber fill running `#ffe0a8` to `#b3761a`, eased over 0.1 seconds. Squad and docket bars are 0.9cqh.

All of them are set from `fullness(part, whole)`, the function written in project 21 and given here.

## The status line

Orange mono under the window, a live region. It names the next job until every function works, then says what just happened: what was ordered, what it cost, what rolled out, and how many units there are now.

## Sounds

The same six as projects 20 and 21, and no new files. The order pip plays on a purchase, project 20's found pips on a finished build, and the blocked buzz on a click the yard refuses.

## Responsive behavior

Below 900px the desk stands up into one column and the page scrolls: plate, window, status line, cards.

Every measurement switches from container units to pixels. Catalogue buttons grow to 44px tall, map buttons to 48px, and the squad list is capped at 320px and scrolls. The focus ring becomes a 3px red outline.
