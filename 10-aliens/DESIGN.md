---
name: The Arcade Cabinet
description: A pixel-art invaders machine in a dark room, with a backlit marquee and a rack of readouts down one side.
colors:
  cab: "#2a1e3d"
  cab-lit: "#43305f"
  cab-deep: "#150f1f"
  tube: "#0b0715"
  neon: "#4ee0ff"
  hot: "#ff5fa8"
  acid: "#7ef29a"
  acrylic: "#f6efff"
  gold: "#ffd45e"
typography:
  display: "'Impact', 'Haettenschweiler', 'Arial Narrow', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: The Arcade Cabinet

> Recorded from the built page; see `10-aliens/` for the implementation.

## Overview

The page is one arcade cabinet, seen straight on in a dark room. It is the same frame the last four projects have used — a plate across the top, a window on the left, a rack of readouts on the right, a status line underneath — and nothing else about it is the same.

The room is dark on purpose. A cabinet is the only lit thing in an arcade, so the page glows and the background does not.

## The cabinet

Aubergine, in three tones, with a fine diagonal grain running across it. The corners are rounded harder than the field post's were, because a cabinet is a piece of furniture rather than a piece of equipment.

Every region inside it is placed as a percentage of the cabinet, so the whole machine scales together like one photograph. The cabinet itself is `min(100cqw, 150cqh)` wide with a 3:2 shape, which is what keeps it whole on any screen.

## The marquee

Backlit acrylic: near-white at the top, lilac at the bottom, with a cyan bloom leaking out around it. Two bolts hold it on, one at each end.

**Alien Raid** is set in the display face, uppercase, with **Raid** knocked out of a magenta tab. That tab is the loudest thing on the page and the only place the name is broken in two.

The score and the wave sit in dark wells at the right-hand end, in cyan mono, glowing. They are readouts on a machine, not headings on a page.

## The tube

The screen is a black rectangle sunk into the cabinet, ringed by a dark bezel and a thin cyan line of light. Two layers sit over the picture and neither takes a click.

Scanlines are one dark line every three pixels, multiplied over the picture. The curve is two radial gradients: a soft highlight at the top and a vignette that darkens the corners.

The canvas is `image-rendering: pixelated`. The art is pixel art at four times size, so scaling has to keep the edges hard. A blurred invader is the wrong picture.

When a game starts the canvas takes the keyboard, and it shows a gold focus ring **inside** the glass. Outside it would be clipped by the bezel.

## The art

Every sprite is drawn from a character map and scaled four times, so a sprite's whole design fits in a dozen lines of text.

Colour says what a thing belongs to. Cyan is yours: the ship, and the wedges counting your ships left. Green is the aliens. Yellow is your bolt, magenta is their bomb, and orange is the moment either one lands.

The alien has two frames, swapped twice a second. That is slow enough to read as a march rather than a flicker.

The background is one 1024 by 768 picture: a night gradient, five hundred stars, a purple planet in the top right, and the lit deck the ship flies along. The deck is part of the picture rather than a sprite, because nothing ever touches it.

## The rack

Six panels down the right, each a faint pane with a thin cyan edge and a gold title.

**Ships left** shows wedges in the ship's own colour, dimmed to a ghost when spent. **The swarm** counts what is left and how deep the wave is, then measures the march. **The three groups** counts what Phaser is holding, the way project 9's panel did. **Controls** and **Scoring** are text. The two keys sit at the bottom, pushed there by `margin-top: auto`.

The March speed bar is measured, not claimed. The wiring records how far the block really moved in the last frame and fills the bar from that, so an unwritten `marchAliens` leaves it flat. A bar that reported the intended speed would lie to a learner at exactly the wrong moment.

Its fill runs green to gold to magenta across its length, so a nearly-empty wave reads as dangerous without a word.

## The status line

Chalked under the screen in green mono, at a low glow. Green because that is the aliens' colour and the machine's own voice, and mono because it names functions.

It is a live region, so it is read aloud when it changes.

## Responsive behavior

Below 900px the cabinet stands up into one column and the page scrolls. The marquee, the screen, the status line and the rack stack in that order. The screen holds a 4:3 shape and goes full width.

Every measurement switches from container units to pixels at that point, so nothing shrinks below reading size. The keys grow to a 48px minimum, and the focus ring becomes a 3px outline.

The game itself does not change. It has no touch controls, so a narrow screen shows the machine but cannot play it.
