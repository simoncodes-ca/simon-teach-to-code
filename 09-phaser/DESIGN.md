---
name: The Field Post, Mark II
description: Project 8's gun post with one panel changed, listing the code the library now writes.
colors:
  olive: "#4a5340"
  olive-lit: "#6b7550"
  olive-deep: "#232a1e"
  steel: "#5d666e"
  steel-lit: "#98a2aa"
  steel-deep: "#23292f"
  canvas: "#ded2ae"
  amber: "#f0a833"
  amber-lit: "#ffd68e"
  signal: "#c8452c"
typography:
  display: "'Stencil', 'Futura', 'Century Gothic', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: The Field Post, Mark II

> Recorded from the built page; see `09-phaser/` for the implementation. The system itself is project 8's, recorded in `08-parachuters/DESIGN.md`. Only the differences are written down here.

## Overview

The page is the same field gun post, and it is meant to be mistaken for project 8 at a glance. That is the point: this project compares two versions of one game, so anything that changed for decoration would be a lie about what the library did.

Three things changed, and nothing else did.

The plate reads **Lookout Post Mk II**. The mark sits on a small olive tab, stamped into the steel, in the display face at eight tenths of the plate's size. It is the only mark on the page saying this is a second version.

The rack gains a panel, **Phaser writes these now**, and loses a counter. The four lists became three groups, because the explosions no longer live in one.

Everything else — the olive frontage, the stamped plate, the steel window, the glare on the glass, the chalked status line, the two clock keys, the signal red on Start — is project 8's, unchanged.

## The crossed-off panel

Five rows, one per function the library replaced. Each row is a struck-out name and the thing that replaced it.

The name is set in the mono face at 0.9cqw, in cream at 45 percent, with the strike itself in signal red. Struck text is the one place on the page where signal red appears twice, and it is the right exception: red means "this is gone" here as it means "this begins a game" on the Start key.

The replacement sits beside it in amber, uppercase, at 0.78cqw, in the same treatment as every other label on the rack. So the eye reads down the dim column of dead names, then across to the live one.

The markup is a real `<del>`, not a line drawn in CSS, so a screen reader hears a deletion.

## The three groups

Three wells instead of four, side by side rather than two by two, and the figures drop from 1.7cqw to 1.5cqw to fit. They count what Phaser is holding: planes, troopers, shells.

The fourth well is gone, and its absence is a teaching point rather than a tidy-up. A tween destroys each explosion when it finishes, so no list exists to count. A group that fills and never empties is still a bug, and these three are still where you catch it.

## The sky

Everything inside the window is a picture now, and every picture is project 8's drawing code, run once and saved. The sky, the ridge, the ground, the sandbag wall, the barrel, the plane, the trooper in all three states, the shell and the explosion all came out of `08-parachuters/parachuters.js` unaltered. Placed side by side the two games are the same photograph.

Two things are still drawn live rather than loaded. The aiming line is a Phaser Graphics object, dashed six pixels on and twelve off, because Phaser has no dashed line of its own. The card between games is a rectangle and three pieces of text, on top of everything else.

The trooper's picture is 56 by 98 and the trooper is 26 by 34, because the canopy has to fit above his head. All three of his pictures are the same size with the man in the same place, so swapping one for another never moves him, and his box sits exactly in the middle of the sheet.

## The walk

Project 8 took a walking trooper's stride from his own x, so no two men were in step. This version has two pictures, at stride 8 and stride -8, swapped six times a second by a Phaser animation.

The animation is slower and more regular than the old wobble, and every trooper is in step. That is a small loss, recorded here as one, and it is the price of using the library's own animation rather than a sum.

## Responsive behavior

Unchanged from project 8. Below 900px the post stands up into one column and the page scrolls, the window goes full width and stays 4:3, and the keys grow to 48px. The new panel follows the same rules: its rows switch from container units to pixels, and the struck names take a fixed 110px column so they stay in one line.
