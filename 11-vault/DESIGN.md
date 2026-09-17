---
name: The Cheese Vault
description: A brushed-steel strongroom door with a window of wired glass, a riveted nameplate, and a rack of readouts down one side.
colors:
  steel: "#3b4655"
  steel-lit: "#55637a"
  steel-deep: "#1a212b"
  glass: "#0d1219"
  cheese: "#ffc93c"
  cream: "#fff4dc"
  alarm: "#ff5f4a"
  mint: "#8ef0c9"
  brass: "#d9a441"
  ink: "#161c25"
typography:
  display: "'Impact', 'Haettenschweiler', 'Arial Narrow', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: The Cheese Vault

> Recorded from the built page; see `11-vault/` for the implementation.

## Overview

The page is one strongroom door, seen straight on. It is the same frame the last five projects have used: a plate across the top, a window on the left, a rack of readouts on the right, and a status line underneath.

Everything else is different. The arcade cabinet before it was aubergine and lit from inside. This is cold steel in a cold room, and the only warm thing on the page is the cheese.

## The door

Brushed steel in three tones, with a fine vertical grain. The corners are rounded less than the cabinet's were, because a vault door is heavier than a piece of furniture.

Every region on it is placed as a percentage of the door, so the whole thing scales together like one photograph. The door is `min(100cqw, 150cqh)` wide with a 3:2 shape, which is what keeps it whole on any screen.

## The nameplate

A machined plate, bolted on with one bolt at each end. Pale steel at the top, darker at the bottom, with the letters engraved rather than lit.

**Cheese Vault** is set in the display face, uppercase, with **Vault** knocked out on a cheese-gold tab. That tab is the loudest thing on the page and the only place the name is broken in two.

The score and the level sit in dark wells at the right-hand end, in gold mono. They are readouts on a machine, not headings on a page.

## The window

The screen is a black rectangle sunk into the steel, ringed by a dark frame and a thin gold line. Two layers sit over the picture and neither takes a click.

The wire runs at 45 degrees in both directions, one faint line every 14 pixels, because security glass has mesh in it. A soft highlight sits near the top and a vignette darkens the corners.

The canvas is `image-rendering: pixelated`. The art is pixel art at four times size, so scaling has to keep the edges hard.

When a game starts the canvas takes the keyboard, and it shows a gold focus ring **inside** the glass. Outside it would be clipped by the frame.

## The floor

The vault floor is one 1024 by 768 picture. It is ruled faintly into 64-pixel cells, and the cells alternate by a shade or two.

That ruling is deliberate teaching. The grid is what the whole project is about, so the player can see it without being told about it.

A large ring is drawn on the floor behind everything, at a very low contrast. It reads as the back of the door and gives the empty corridors something to sit on.

## The art

Every sprite is drawn from a character map and scaled four times, so a sprite's whole design fits in a dozen lines of text.

The mouse and the cat are both seen from the front, at 48 pixels inside a 64-pixel cell. A front view is the one picture that works in all four directions, so nothing ever has to be flipped or turned.

Colour says what a thing is. Gold is cheese, and gold is also yours: the crumbs, the score, and the square marking where you are heading. Ginger with gold eyes is a cat. Grey with pink ears is you.

A wall is a steel block with four rivets and a lit top-left edge. Walls are lighter than the floor, so the corridors read as the dark space between them.

## The rack

Six panels down the right, each a faint pane with a thin gold edge and a brass title.

**Lives** shows wedges of cheese, dimmed to a ghost when spent.

**Where you are** is the learner's own two functions, shown back to them. The Cell well is `cellAt` and the Middle well is `middleOf`. Both show a dash until the function behind them works, which is the whole point of the panel.

**The four ways out** is a compass of four keys, one per direction. Green and lit means the cell that way is open. Red and dim means it is a wall. Grey means the map cannot answer yet, because `isWall` or `cellAt` is still empty.

**The map** counts the cheese left, the walls built and the cats prowling, then fills a bar as the vault empties.

**Controls** and **Scoring** are text. The two keys sit at the bottom, pushed there by `margin-top: auto`.

## The status line

Chalked under the window in mint mono, at a low glow. Mint because that is the colour of an open way, and mono because it names functions.

It is a live region, so it is read aloud when it changes. It only speaks while a game is running, so an ending has the last word.

## Responsive behavior

Below 900px the door stands up into one column and the page scrolls. The plate, the window, the status line and the rack stack in that order. The window holds a 4:3 shape and goes full width.

Every measurement switches from container units to pixels at that point, so nothing shrinks below reading size. The keys grow to a 48px minimum, the compass takes a fixed 140px, and the focus ring becomes a 3px outline.

The game itself does not change. It has no touch controls, so a narrow screen shows the vault but cannot play it.
