---
name: The Plotting Table
description: A wardroom table seen from above, where two seas sit under glass and the pegs tell the story.
colors:
  sea: "#103c50"
  sea-deep: "#08222f"
  sea-lit: "#17586f"
  teak: "#2c2016"
  teak-lit: "#4d3826"
  brass: "#d6a95c"
  chart: "#e9dfc7"
  steel: "#84949b"
  peg-red: "#cf4438"
  peg-white: "#f4efe3"
  sig: "#86cfc0"
typography:
  display: "'Futura', 'Century Gothic', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: The Plotting Table

> Recorded from the built Battleship page; see `05-battleship/` for the implementation.

## Overview

The page is one wardroom plotting table photographed from directly above. Oiled teak fills the frame inside a brass inlay, and two sea charts sit under glass on it — a large one for enemy waters, a smaller one for your own fleet. Brass is reserved for things that carry meaning: the bearing plate, the chart frames, the phase pill, the ribs down the roster. Red appears only three times — a hit peg, a sunk ship, a lost game — so it always means damage.

## Layout

The table is a fixed 3:2 frame and every region is placed as a percentage of it, so the whole thing scales as one photograph rather than reflowing. The left 46% is enemy waters: a stencilled name, then a square chart large enough to aim at. The right 40% stacks the rest — a brass bearing plate across the top, your own chart with the roster beside it, the signal log beneath, then the phase pill and three keys. The status line runs under the target chart, where the eye already is. Both charts are built the same way: a square frame with column letters along the top and row numbers down the left, so the two are read identically even at different sizes.

## Materials and depth

One teak surface, a fine repeating grain over a radial gradient that lifts the centre and drops the corners, with a single diagonal varnish sheen across everything. The charts are deep water: a radial gradient from a lit north-west to a near-black south-east, a faint diagonal swell, and a glass highlight across the top left. Depth is all light — a brass rim inset into each chart, a drop shadow beneath it, raised highlights on the keys, and a hard shadow under every peg. The bearing plate is machined brass, bright along its top edge and dark along its bottom.

## Interaction and states

The phase drives everything. Squares are real buttons, enabled only in the phase that allows them: your own chart during `placing`, enemy waters during `yourTurn`. Hovering a live chart lightens the square and reads its name onto the bearing plate. While placing, a ghost of the current ship follows the cursor on its own chart only — sea-green where it fits, red where it does not — and Rotate turns it. That button carries an inset key cap reading **R**, because the shortcut belongs where the action is rather than in a help panel; the cap is hidden from screen readers, which are told about the shortcut by `aria-keyshortcuts` instead. The status line names the key too, on every ship. A peg drops in with a short scale-down, white for a miss and red for a hit, and a hit peg carries a faint red glow. Your own ships are grey steel plate that turns burnt red when sunk. When your turn ends, a pulsing red ring appears on the square the enemy has chosen, and holds for 850ms before the shell lands. Reduced-motion users get every peg, ring and plaque already in place.

## The bearing plate

A brass plate across the top right shows the name of the square under the cursor, in large monospace, and two dashes when the cursor is off the charts. It exists because a coordinate is normally the least visible thing on a grid — the program knows it, and the player has to count. Naming it out loud makes `cellName` a function you can watch working, and makes the log lines readable as the same fact.

## The roster

A narrow column beside your chart. While placing, it lists your five ships with the next one lit in sea-green and the placed ones dimmed. Once the battle starts it becomes the enemy fleet, and the only thing it will say is which ships have gone down — struck through, in red, with their ribs darkened. It never says where a ship was, because the player could not know that.

## Responsive behavior

Below 900px the table stands up into one column and the page scrolls: title, bearing plate, enemy waters, your fleet, roster, log, phase, status, then the keys. Both charts go full width and stay square, the roster wraps into a row of cards, the log fixes at 150px, and the keys stay comfortably touch-sized. The result plaque moves to the very top where it cannot be missed. Nothing scrolls horizontally.
