---
name: War Room
description: Project 22's build yard desk with a second army on it, a Forces card at the top of the rack, and a banner that comes down once.
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
  sky: "#8fb7e8"
  sky-deep: "#3f6ea8"
  alarm: "#e04a3a"
  alarm-deep: "#8e2618"
typography:
  stencil: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'Arial Black', sans-serif"
  label: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: War Room

> Recorded from the built page; see `24-strategy/` for the implementation.

## Overview

The page is the desk projects 19 to 23 all used. A plate across the top, a window on the left, a rack of cards down the right, and a line of words under the window. The furniture does not move.

This is the first project whose rack carries six cards. Project 22 had five and project 23 had four, and this one has both projects' cards at once, because it has both projects' games at once.

**Forces** sits at the top, above the order pad, and that placement is the whole design decision. The game is the two columns in that card. Everything else on the page is how you change them.

Three colours carry meaning, and they never overlap.

| Colour | What it always means |
|---|---|
| Sky blue | Yours |
| Alarm red | Theirs |
| Route orange | Something you did: a picked unit, its route, the drag box, the chosen map |

Amber stays the colour of ore, as it has been since project 21: the patches, the load bars, the credits and the queue.

## The desk

Unchanged from projects 19 to 23. Blue-grey steel in three tones, lit from the top left, with faint horizontal brush marks, a near-black border and a hairline of orange inside it.

The desk is one box with a 1536 by 1024 aspect ratio, and every region on it is placed as a percentage of that box. So the whole page scales like one photograph.

| Region | Left | Top | Width | Height |
|---|---|---|---|---|
| Plate | 3% | 4% | 65.4% | 7.4% |
| Window | 3% | 13.2% | 65.4% | 73.6% |
| Status line | 3% | 88.6% | 65.4% | 7.4% |
| Rack | 70.6% | 4% | 26.4% | 92% |

## The plate

Dark steel, stencilled, a bolt at each end. `WAR ROOM`, with `ROOM` in route orange.

Four reads sit along it: the map name, your credits in amber, your living units in sky blue, and theirs in alarm red. The last three are live regions.

The plate is the only place on the page where the two sides appear as bare numbers with no words. That is why the Forces card exists directly below it.

## The rack

Six cards, each one a sheet of graph paper under a steel clip. Card padding and the gap between cards are tighter than project 22's, because six cards have to fit where five did.

| Card | What it holds | Which job fills it |
|---|---|---|
| Forces | Four rows by two columns, and two strength bars | 1 and 2 |
| Build | One button for each line of the catalogue | Given, works from the start |
| Queue | Two wells and a docket list | Given, works from the start |
| Enemy | Four wells: credits, saving for, orders, marching | 3, 6 and 7 |
| Squad | One row for each of your units | Given |
| Maps | One button per map file | Given |

### The Forces card

A real table, with a row header and two column headers, so a screen reader can say "Tanks, theirs, 3". The Yours column is sky blue and the Theirs column is alarm red.

The refinery row says `standing` or `wrecked` rather than 1 or 0, because that is what the number means.

Under the table sit two bars, yours above theirs, scaled against the stronger army so the longer bar is always full. They repeat numbers the table already gives, so they are `aria-hidden`. They answer one question at a glance: who would win a fight right now.

### The Enemy card

Four wells in two rows. Its numbers are alarm red, which is the only card where that is true.

The Orders well is the one to watch. `massing` is quiet, and `attack` turns the well into solid alarm red with white letters, which is the loudest thing on the rack. It is loud because it is the moment the game changes.

## The window

A 960 by 720 canvas in a steel frame with an orange hairline, under a plotting-sheet shine.

| Thing on the map | How it is drawn |
|---|---|
| Ground | One 48-pixel tile per cell, from the terrain table |
| Ore left | The cell's number in amber, over an amber wash that fades as it empties |
| A spent patch | A dark wash, and no number |
| A refinery | A dark pad with a hopper in its side's colour, and `YOURS` or `THEIRS` over it |
| A building | A dark pad edged in the catalogue's colour, holding its own picture, inside a ring in its side's colour, with its three letters over the top |
| A tank | Project 17's hull and turret, over a disc in its side's colour |
| A harvester | A blue truck with an amber load in its bed, over the same disc, whichever side it belongs to |
| A wreck | Both pictures tinted near-black, the turret knocked askew, the disc faded |
| Health | A bar over the unit. A refinery's is wider, because it matters more |
| A load | An amber bar under the harvester, and only while it is carrying |
| A route | Orange for yours, thin red for theirs |
| A shot | A pale line from barrel to target, for seventy milliseconds |
| A guard's beat | A red dotted ring round the enemy refinery |
| Your gun's reach | An orange circle, and only round a unit you have picked |

A disc under every unit does the work that tinting cannot. Both sides drive the same pictures, because a blue hull tinted red comes out the colour of mud.

## The banner

The one thing on the page that appears once. A near-opaque night wash over the whole window, a stencilled line in the winner's colour, and a quiet line of monospace under it saying how to start again.

Blue for a win, red for a loss, route orange for the draw where both refineries fall together. It is a live region, and the status line says the same thing in longer words.

## Type

| Where | Face |
|---|---|
| Plate, card titles, unit names, building tags, banner | Stencil |
| Card notes, table headers, map buttons | Label |
| Every number, verdict, status line and banner note | Mono |

Numbers are always monospace, everywhere, in every project since the calculator. A number that changes sixty times a second must not move the words next to it.

## Narrow screens

Below 900px the desk stands up into one column: plate, window, status line, rack. The container switches from being measured by height to being measured by width, so every height in that block is given in pixels.

Squad rows grow to 44px tall, map buttons to 48px, and the squad list is capped at 320px and scrolls. Measured at 430 pixels wide: no horizontal scroll, and all six cards fit.
