---
name: The Studio Bench
description: A drawing board seen from above, where the only bright colour on the page is the paint.
colors:
  bench: "#3a2b21"
  bench-lit: "#5b4335"
  bench-deep: "#1d1610"
  board: "#c6a880"
  board-lit: "#e3c69c"
  board-deep: "#93744c"
  paper: "#f6f0e2"
  tape: "#efd49a"
  ink: "#2a2622"
  zinc: "#b3ada1"
  zinc-dark: "#6e6960"
  go: "#2f8b86"
typography:
  display: "'Futura', 'Century Gothic', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: The Studio Bench

> Recorded from the built Paint page; see `06-paint/` for the implementation.

## Overview

The page is one studio bench photographed from directly above. A birch drawing board fills the frame inside a walnut edge, with a single sheet of cream cartridge paper taped down at its four corners and a zinc tin of paints on the ledge beside it. Every material is muted — wood, masking tape, zinc, paper — so that the ten pans of gouache are the only saturated colour anywhere. Teal appears exactly once, on Save, the only key that produces something you keep.

## Layout

The bench is a fixed 3:2 frame and every region is placed as a percentage of it, so the whole thing scales as one photograph rather than reflowing. The left 61% is the work: a strip of masking tape across the top, the sheet of paper beneath it, and a pencilled status line under that. The right 28% is the ledge, a single zinc panel holding five stacked groups in the order you reach for them — the brush preview, the paints, the nibs, the two tools, then the history strip, with the four action keys pinned to the bottom edge. The paper holds a 4:3 aspect and centres itself in whatever space is left, so the canvas is never distorted and its own 1024×768 coordinates never change.

## Materials and depth

The board is a fine vertical grain over a radial gradient that lifts the upper left and drops the corners, with one diagonal wash of window light across everything. The tape is a warm ochre with a shallow weave, rotated a quarter of a degree so it reads as laid down by hand. The paper is flat cream with its tooth painted on in CSS above the canvas — two fine crosshatched gradients under `mix-blend-mode: multiply` — deliberately not part of the canvas, so a saved PNG comes out clean. The ledge is brushed zinc: a light-to-dark vertical gradient, a bright inner rim, and a dark pool along its bottom edge. Depth is all light: pans sit in wells with an inner shadow, keys carry a highlight along the top and a shadow below.

## Interaction and states

The cursor over the paper is a crosshair. Hovering the sheet reads the point under it onto the tape in large monospace, in paper pixels, and shows two dashes when the cursor is away. Pans lift on hover and, when chosen, lift further and take a pale ring of paper colour; nibs invert to paper white; the two tool keys invert to near-black. The four action keys disable themselves the moment they would do nothing — Undo and Clear with nothing on the paper, Redo with nothing on the pile, Save with an empty sheet — so the state of the history is legible before it is pressed. Motion is limited to a hover lift and a press depression, both removed under reduced motion. Five short sounds mark the moments worth marking: picking up paint, undo, redo, the paper sweep of a clear, and a two-note save.

## The brush preview

A small canvas at the top of the ledge holds a fixed squiggle drawn twice: once in pale grey at 58px as a guide, then again in the paint and nib currently chosen. It answers "what am I about to draw" before a mark is made, and it is the reason the eraser is legible — an eraser stroke on bare paper is invisible, so the guide gives it something to wipe, and the gap it leaves is the whole explanation of how the tool works.

## The history strip

A paper-coloured well on the ledge holding one tick per stroke, in that stroke's own colour: solid for what is on the paper, hollow for what undo has taken off, capped at 48 of each. It is the `strokes` and `undone` lists drawn as an object, so pressing Undo and Redo moves a tick between two states on screen. It is `aria-hidden`, because the same two counts sit on the tape as text.

## Responsive behavior

Below 900px the bench stands up into one column and the page scrolls: tape, paper, status, then the ledge. The paper goes full width and stays 4:3, the ledge panels keep their order with touch-sized pans, nibs and keys at 48px, and the history strip fixes at a 60px minimum. Nothing scrolls horizontally.
