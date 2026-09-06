---
name: The Sketchbook
description: A pencil-drawn game page that behaves like a real sketchbook spread.
colors:
  paper: "#f4efe4"
  paper-edge: "#e6ddca"
  graphite: "#3a3a3c"
  graphite-soft: "#8b8b8f"
  graphite-faint: "#c9c7c1"
  red-pencil: "#c0392b"
typography:
  display: "'Caveat', 'Segoe Print', 'Bradley Hand', cursive"
  body: "'Architects Daughter', 'Segoe Print', 'Comic Sans MS', cursive"
---

# Design System: The Sketchbook

> Recorded from the built Hangman page; see `hangman/` for the implementation.

## Overview

The page is a sketchbook page lying on a desk. Warm paper holds every element; each is drawn in graphite — headline, word blanks, letter rail, strike tally — as if the player is filling in the page with a pencil. The hangman drawing is the hero and grows one SVG stroke group per wrong guess. Red pencil exists only for interactive truth: a struck wrong letter, keyboard focus, the final APPROVED / SCRAPPED stamp. Nothing glows; nothing is a glossy UI button.

## Layout

Desktop is a two-column spread: the drawing page on the left (roughly 55%), the word, status line and A–Z letter rail on the right, separated by a soft page gutter shadow as if the binding runs down the middle. The strike tally sits as small red hatches in a corner of the drawing page. Narrow screens stack: drawing first, then word, then letter rail, all on one continuous page.

## Materials and depth

One sheet of warm paper with a faint tooth (generated texture plate), a slightly darker gutter at the page center, and a soft edge mask. Depth comes from the paper alone: graphite grades HB for structure, 4B for the figure, 6B for the darkest accents; no true black. SVG strokes use a restrained displacement filter and draw-on dash offsets to stay visibly pencil-made without losing state control.

## Interaction and states

Letters are real buttons drawn as pencil-underlined characters. Untried: graphite, slight lift on hover. Used-correct: filled in slightly darker. Used-wrong: red strike-through, dimmed. Focus: red pencil circle around the letter. Wrong guesses add one SVG stroke group to the drawing with a short pencil-draw animation; reduced-motion users get the stroke without animation. Win shows APPROVED; lose stamps SCRAPPED over the drawing.

## Responsive behavior

Below 720px the spread folds into one column, drawing scales to the top, the letter rail reflows into a compact grid that stays touch-sized, and the strike tally moves above the word. Nothing scrolls horizontally.
