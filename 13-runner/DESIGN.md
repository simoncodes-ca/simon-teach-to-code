---
name: Rooftop Run
description: A cream plastic handheld with a coral nameplate, a glossy screen onto a sunset city, and a rack of readouts down one side.
colors:
  shell: "#e6d8bd"
  shell-lit: "#f8f1e2"
  shell-deep: "#b9a684"
  coral: "#e8552f"
  coral-deep: "#a8331a"
  sun: "#ffb03a"
  mint: "#2fd4c9"
  night: "#1b1030"
  ink: "#2b2118"
typography:
  display: "'Impact', 'Haettenschweiler', 'Arial Narrow', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: Rooftop Run

> Recorded from the built page; see `13-runner/` for the implementation.

## Overview

The page is one handheld games console, seen straight on. It keeps the frame of the last seven projects: a plate across the top, a screen on the left, a rack of readouts on the right, and a status line underneath.

The cave console before it was olive steel in a mine. This one is warm cream plastic, the colour of a toy that has been carried around for a year. Coral is the machine. Mint is what is happening now. Amber is the sunset and the record.

## The shell

Cream plastic, lighter at the top left, with a faint grid of light dots pressed into it. The corners are much rounder than the mine console's, and the border is a paler cream, so the whole thing reads as moulded rather than bolted.

Every region is placed as a percentage of the shell, so the whole console scales together like one photograph. The shell is `min(100cqw, 150cqh)` wide with a 3:2 shape.

## The nameplate

A coral plate, lit from above. A small tab at its left end carries the sunset as a gradient: deep violet at the top, amber at the bottom.

**Rooftop Run** is set in the display face, uppercase, in cream. **Run** is knocked out in amber on a dark violet tab. That tab is the only place the name is broken in two.

Two dark wells sit at the right-hand end. The metres run in mint, and the best ever in amber. There are no lives on the plate, because a run has only one.

## The screen

A glossy plastic screen, not a camera feed. It is a dark violet rectangle in a brown bezel with a bright cream inner edge.

Two layers sit over the picture, and neither takes a click. A soft diagonal sheen crosses the top left corner, the way light falls on plastic. A vignette darkens the outer edge.

The canvas is `image-rendering: pixelated`. The art is pixel art at four times size, so scaling has to keep the edges hard.

When a run starts, the canvas takes the keyboard and shows a mint focus ring inside the glass. Outside the glass, the bezel would clip it.

## The city

Four layers, and none of them scrolls by itself. Each is stuck to the window and slid along by hand, which is what makes the parallax.

The sky is one 1024 by 768 picture: deep violet at the top, through plum and red, to amber at the horizon. A hazy sun sits low and right of centre, with a few faint stars near the top.

Two rows of buildings stand in front of it, both in flat silhouette with scattered lit windows in amber. The far row is violet-grey and slides a quarter as fast as the rooftop. The near row is darker and slides half as fast. Far looks slower than near, and that is what gives the city depth.

The rooftop is one 64-pixel tile repeated: a pale lilac top edge, then cool grey brick with courses picked out in a darker grey. It fills the bottom quarter of the screen and slides at full speed.

## The runner and the obstacles

The runner is a small figure in a mint jacket and dark trousers, with coral shoes. Two pictures swap over to make him run, and the swap gets quicker as he speeds up. A third picture, arms and legs out, is used the whole time his feet are off the roof. A puff of cream dust appears at every take-off and every landing, and drifts backwards as it fades.

Three obstacles stand on the roof. A crate is a single amber wooden box with a dark X across it. A stack is two of them. A vent is a wide, low, blue-grey metal box with a grille.

A crash is a coral ring that grows and fades, and the camera shakes for a quarter of a second.

## The rack

Five panels and the keys run down the right. Each panel is a pale pane with a thin coral edge and a coral title.

**This run** holds two wells, Metres and Speed, then a track running from 300 to 700 with a marker on it. The marker is mint while the runner is still speeding up, and turns coral once he has reached the top speed and has nothing left to give. Two lamps under it say where his feet are: mint on the roof, amber in the air.

**The next piece** holds Gap and Kind. Both are samples, taken twice a second from the learner's own `nextGap` and `pickObstacle`, and both show a dash until those functions exist.

**Obstacles in memory** is the one number the project is really about. It is set large, in amber, with the list split into ahead and behind underneath it.

**Saved record** holds Best and Runs, with a line saying the record is kept in this browser. If the browser refuses to save on a double-clicked page, that line says so instead.

**Controls** lists the keys, then two scoring rows. The two keys sit at the bottom, pushed there by `margin-top: auto`. Start is coral, and Run again is pale cream.

## The status line

Printed under the screen in a warm brown mono. It is quieter than the cyan line on the mine console, because this shell is light and a glow would look wrong on it.

It is a live region, so a screen reader reads it aloud when it changes. It only reports empty functions while a run is going, so the end of a run has the last word.

## Responsive behavior

Below 900px the console stands up into one column, and the page scrolls. The plate, the screen, the status line and the rack stack in that order. The plate wraps onto two lines. The screen keeps a 4:3 shape and goes full width.

Every measurement switches from container units to pixels at that point, so nothing shrinks below reading size. The keys grow to a 48px minimum height.

The game itself does not change. It has no touch controls, so a narrow screen shows the rooftops but cannot play them.
