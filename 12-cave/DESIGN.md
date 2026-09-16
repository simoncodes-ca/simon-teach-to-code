---
name: Cave Flyer
description: A mine rescue console in olive-charcoal steel, with a hazard-yellow nameplate, a camera window into the cave, and a rack of instruments down one side.
colors:
  hull: "#2b2f27"
  hull-lit: "#454c3e"
  hull-deep: "#151812"
  glass: "#07090b"
  hazard: "#f5b40a"
  cream: "#f1ead6"
  lava: "#ff6a2b"
  crystal: "#62e8ff"
  go: "#4fe089"
  ink: "#15160f"
typography:
  display: "'Impact', 'Haettenschweiler', 'Arial Narrow', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: Cave Flyer

> Recorded from the built page; see `12-cave/` for the implementation.

## Overview

The page is one mine rescue console, seen straight on. It keeps the frame of the last six projects: a plate across the top, a window on the left, a rack of readouts on the right, and a status line underneath.

The vault before it was cold steel. This console is olive-charcoal and working equipment. Yellow means the machine and the ship. Cyan means crystal. Orange-red means danger.

## The console

Olive-charcoal steel, lighter at the top left and darker at the bottom right, with a faint grid of dots pressed into it. The corners are rounder than the vault door's, because this is a piece of equipment, not a door.

Every region is placed as a percentage of the console, so the whole thing scales together like one photograph. The console is `min(100cqw, 150cqh)` wide with a 3:2 shape.

## The nameplate

A hazard-yellow plate, lit from above. Black and yellow warning stripes fill its left end.

**Cave Flyer** is set in the display face, uppercase, in black. **Flyer** is knocked out in yellow on a black tab. That tab is the only place the name is broken in two.

The lives sit on the plate as three small black ship shapes, faded when spent. The score and the crystal count sit in dark wells at the right-hand end, in yellow mono.

## The window

The window is a camera feed, because the camera is the lesson. It is a black rectangle ringed by a dark frame and a thin yellow line.

Three layers sit over the picture, and none of them takes a click. Faint scan lines run across it every 4 pixels. Four pale corner marks sit inside the edge, like a viewfinder. A vignette darkens the corners.

The canvas is `image-rendering: pixelated`. The art is pixel art at four times size, so scaling has to keep the edges hard.

When a game starts, the canvas takes the keyboard and shows a cyan focus ring inside the glass. Outside the glass, the frame would clip it.

## The cave

The background is one 1024 by 768 picture, stuck to the window. It is a dark blue-grey, a little lighter at the top and darker at the sides.

The rock has two faces. Rock that touches air is warm brown with light speckles, so the tunnel's outline reads at a glance. Rock buried deep is nearly black. Every rock is one 64-pixel tile.

The crystals are cyan with a white glint. The lamps stand on the floor: red when unlit, green once you pass. The gate at the far end has black and yellow striped posts with cyan light between them.

The ship is a small yellow craft with a dark cockpit, seen from the side. It leans up to 8 degrees in the direction it flies. An orange flame flickers under it while the engine is on. A crash is an orange circle that grows and fades.

## The rack

Five panels and the keys run down the right. Each panel is a faint pane with a thin yellow edge and a yellow title.

**Where the ship is** holds three wells: World, Camera and Screen. Screen comes from the learner's `toScreen` and shows a dash until it works. The formula `screen = world − camera` sits under the wells in yellow mono.

**Camera limits** has one track for x and one for y, each labelled with its smallest and biggest value. A yellow marker slides along each track. It turns orange-red if the camera goes past either end.

**The whole cave** is a small map, one 4-pixel square per cell. It shows brown rock, black air, cyan crystals, the lamps, and the gate in cream. A yellow dot marks the ship, and a cream box marks exactly what the camera can see. Under it, a line counts the pictures drawn this frame.

**Instruments** holds three gauges side by side. The Engine lamp glows orange while the engine is on. The climb gauge grows cyan to the left when the ship climbs, and orange-red to the right when it falls. The Corners box holds four lamps: grey until `isRock` works, then green for air and orange-red for rock.

**Controls** lists the keys, then two scoring rows. The two keys sit at the bottom, pushed there by `margin-top: auto`. Start is yellow, and Play again is pale grey.

## The status line

Printed under the window in cyan mono, with a soft glow. It is cyan because the readouts are cyan, and mono because it names functions.

It is a live region, so a screen reader reads it aloud when it changes. It only reports empty functions while a game is running, so an ending has the last word.

## Responsive behavior

Below 900px the console stands up into one column, and the page scrolls. The plate, the window, the status line and the rack stack in that order. The plate wraps onto two lines. The window keeps a 4:3 shape and goes full width.

Every measurement switches from container units to pixels at that point, so nothing shrinks below reading size. The keys grow to a 48px minimum height.

The game itself does not change. It has no touch controls, so a narrow screen shows the cave but cannot play it.
