---
name: Tank Duel
description: An olive army field console with a stencilled sand plate, a camera window onto a sand yard, and a rack of readouts for two tanks.
colors:
  olive: "#4c5a39"
  olive-lit: "#6a7b4f"
  olive-deep: "#1f2616"
  scope: "#15190f"
  hazard: "#ffc53d"
  sand: "#f3e6c4"
  stencil: "#d7c79a"
  blue: "#6cc0ff"
  red: "#ff7a6b"
  go: "#7ee07a"
  ink: "#141a10"
typography:
  display: "'Impact', 'Haettenschweiler', 'Arial Narrow', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: Tank Duel

> Recorded from the built page; see `16-tanks/` for the implementation.

## Overview

The page is one army field console, seen straight on. It uses the same frame as the projects before it: a plate across the top, a window on the left, a rack of readouts on the right, and a status line underneath.

The vault before it was cold steel. This is painted olive with faint horizontal brush marks, lit from the top left. Hazard yellow is the console's own colour. Blue and red belong to the two tanks only.

## The console

Olive paint in three tones, with a thin dark border and a soft highlight in the top-left corner. The corners are rounder than the vault's, because this is a box that gets carried around.

Every region is placed as a percentage of the console, so the whole thing scales together like one photograph. The console is `min(100cqw, 150cqh)` wide with a 3:2 shape.

## The plate

A sand-coloured plate with a rivet at each end. The letters are set in the display face, uppercase, in dark ink.

**Duel** sits on a strip of hazard tape: yellow, with faint diagonal stripes. It is the loudest thing on the page and the only place the name is broken in two.

Three dark wells sit at the right-hand end. Blue's win count has a blue edge and blue digits. Red's has red. The round number between them is hazard yellow.

## The window

A dark frame with a thin yellow line inside it. Two layers sit over the canvas and neither takes a click.

Faint horizontal scan lines, one every 4 pixels, suggest the yard is watched through a camera. A darkened inner edge and a soft vignette sink the picture into the frame.

The canvas renders smoothly, not pixelated. The tanks rotate to any angle, and smooth art survives rotation where pixel art does not.

When a duel starts, the canvas takes the keyboard and shows a yellow focus ring inside the frame.

## The yard

One 1024 by 768 picture of warm sand. It is ruled faintly into 64-pixel cells, with alternate cells a shade darker, because the arena is still a map.

Grit, a few darker patches and two pairs of old tyre tracks keep the sand from reading as a flat colour. All of them sit at very low contrast.

A concrete block is a pale grey square with a lit top-left edge, a shadow on the sand to the bottom right, and a yellow and black hazard band across its middle. The band is what makes a block read as an obstacle at a glance.

## The art

The tanks are seen from above and drawn facing right, which is angle 0.

A hull is two dark tracks with tread marks, a body in the tank's colour lit from the top, a pale front plate on the right, and an engine grille at the back. The turret is a separate picture: a domed circle with a hatch, and a grey barrel reaching right. It turns around the middle of its dome.

Blue is `#3f8fd9` with pale and dark tones. Red is `#d9483a` in the same way. A wrecked tank is tinted to a dark brown-grey and trails smoke.

A shell is a small glowing ball, white in the middle and orange at the edge. A hit is a yellow and orange starburst that grows and fades.

Three things are drawn by code every frame. A small cream arrow sits in front of each tank. A dotted gun sight in the tank's own colour runs out from the barrel. A small health bar floats over each tank, and it turns red at one hit left.

## The rack

Five panels down the right, each a faint pane with a thin sand edge and a stencil-coloured title.

**Blue tank** and **Red tank** carry their colour as a thick stripe down the left edge and in the title. Each holds a health bar with the number beside it, two wells for Heading and Aim, and a thin reload bar. The health bar is green, and red once one more hit would wreck the tank.

Heading and Aim are the learner's own functions shown back to them. Aim shows a dash until `aimOf` works.

**Shells** counts the shells flying, the bounces and the hits.

**Controls** is a small table: one row for each action, one column for each tank, with the keys as little yellow-edged caps.

The two keys sit at the bottom, pushed there by `margin-top: auto`. Start is hazard yellow. Play again is sand.

## The status line

Stencilled under the window in hazard-yellow mono, with a low glow. Mono because it names functions.

It is a live region, so it is read aloud when it changes. It only speaks while a round is running, so the end of a round has the last word.

## The cards

The cards over the arena use the display face. The title card and the pause card darken the whole yard. A round card appears in the middle of the arena, outlined in dark ink, and fades by itself. The end card names the winner in that tank's colour.

## Responsive behavior

Below 900px the console stands up into one column and the page scrolls. The plate, the window, the status line and the rack stack in that order. The name takes its own line on the plate, and the window holds a 4:3 shape at full width.

Every measurement switches from container units to pixels at that point, so nothing shrinks below reading size. The keys grow to a 48px minimum and the focus ring becomes a 3px outline.

The game itself does not change. It has no touch controls, so a narrow screen shows the arena but cannot play it.
