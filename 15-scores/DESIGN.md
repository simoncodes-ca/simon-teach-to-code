---
name: Star Catch
description: A dark green enamel scoreboard bolted to a wall, with a brass nameplate, a night meadow behind glass, and a lit cable running to a server.
colors:
  enamel: "#23483c"
  enamel-lit: "#326353"
  enamel-deep: "#16302a"
  brass: "#d7a94b"
  brass-lit: "#f4dfa4"
  chalk: "#f6f1e4"
  wire: "#ff7a4d"
  live: "#6fe3a6"
  night: "#0a1030"
typography:
  display: "'Impact', 'Haettenschweiler', 'Arial Narrow', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: Star Catch

> Recorded from the built page; see `15-scores/` for the implementation.

## Overview

The page is one enamel scoreboard, seen straight on. It keeps the frame of the last eight projects: a plate across the top, a screen on the left, a rack of readouts on the right, and a status line underneath.

The handheld before it was warm cream plastic. This one is cold dark green enamel with brass fittings, the kind of board that is screwed to a wall and left there.

Three colours carry meaning, and each one carries only its own. Brass is the machine. Mint green is an answer that arrived. Coral is the line to the server, and nothing that is not about the network is ever coral.

## The board

Dark green enamel, lit from the top left, in a brass frame. The corners are barely rounded, because this is bolted metal rather than a moulded toy.

Four brass bolts sit inside the frame, one at each corner, drawn as radial gradients on two full-width pseudo-elements. They are the only ornament on the whole shell.

Every region is placed as a percentage of the board, so the whole thing scales together like one photograph. The board is `min(100cqw, 150cqh)` wide with a 3:2 shape.

## The nameplate

A brass plate, lit from above, with dark ink lettering rather than white. A small tab at its left end carries the night sky as a gradient.

**Star Catch** is set in the display face, uppercase. **Catch** is knocked out in pale brass on a dark blue tab, which is the only place the name is broken in two.

Two dark wells sit at the right-hand end. Caught runs in pale brass. The seconds left run in mint, and turn coral for the last five seconds of a round.

## The screen

A glossy screen in a brown bezel with a bright brass inner edge. Two layers sit over the picture and neither takes a click: a diagonal sheen across the top left corner, and a vignette darkening the outer edge.

The art is drawn at full resolution rather than as pixel art, so the canvas keeps normal smoothing. That is the one visible break from projects 11 to 14.

When a round starts, the canvas takes the keyboard and shows a mint focus ring inside the glass.

## The meadow

Four things, and nothing scrolls. The world is exactly one window wide, which is what keeps the game out of the lesson's way.

The sky is one 1024 by 768 picture: deep blue at the top, lighter towards the horizon, with 260 scattered stars and a hazy moon low and left of centre. Two rows of hills stand along the bottom in flat silhouette.

The grass is one 128 pixel tile repeated across the bottom fifth, with a pale lip along its top edge and blades picked out in a lighter green.

The net is a brass rim over a pale diamond mesh, with a short handle below it. It slides left and right along the grass and never moves up or down.

Gold stars are drawn warm, from cream through amber. Blue stars are drawn cold, from white through ice blue, and are larger, rarer, faster and worth three times as much. Both turn slowly as they fall. A catch makes a cream four-pointed sparkle that grows and fades.

## The rack

Four panels run down the right. Each is a faint pane with a thin brass edge and a brass title.

**The board** is the tallest, and it takes all the space the other three leave. Rows of rank, name and score sit on a dark blue ground. The winner's name is brass, and your own name is mint wherever it appears. Before anything has been asked, one quiet row says so instead of leaving a blank box.

**The line** is the panel this project exists for. A lamp labelled page, a cable, and a lamp labelled server. The page lamp lights coral while a request is out, a blip of coral runs along the cable, and the server lamp answers in mint or in red. Two wells name what was asked and what came back. Under them, in small mono, is the server's exact text and the time it took in milliseconds.

**You** holds the two boxes: Name and Server. Under them are the keys and what each star is worth.

**The keys** are three. Play is coral, Send my score is brass, and Ask for the board is a thin outlined key, because it is the one you can press at any time without consequence.

## The status line

Printed under the screen in a chalk mono. It is a live region, so a screen reader reads it aloud when it changes.

It names the empty function, in either file. When the server reports one of its own, the line says so with the file name in front: `server.js sortedTop() is still empty.`

## Responsive behavior

Below 900px the board stands up into one column and the page scrolls. The plate, the screen, the status line and the rack stack in that order. The bolts are hidden, and the board panel stops competing for height.

Every measurement switches from container units to pixels at that point, so nothing shrinks below reading size. The keys grow to a 48px minimum height, and both text boxes grow with them.

The game itself does not change. It has no touch controls, so a narrow screen shows the meadow but cannot play it.
