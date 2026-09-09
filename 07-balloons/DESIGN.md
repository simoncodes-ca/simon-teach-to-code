---
name: The Pier Stall
description: A fairground shooting stall at dusk, where the only bright things on the page are behind the window.
colors:
  timber: "#4a2f22"
  timber-lit: "#6f4a33"
  timber-deep: "#22140e"
  stripe-a: "#8f2f2c"
  stripe-b: "#f0e2c6"
  board: "#2b3a52"
  board-lit: "#43587a"
  board-deep: "#16202f"
  brass: "#c9922e"
  brass-lit: "#eec870"
  bulb: "#ffd98a"
  go: "#e0562f"
typography:
  display: "'Futura', 'Century Gothic', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: The Pier Stall

> Recorded from the built Balloon Stall page; see `07-balloons/` for the implementation.

## Overview

The page is one fairground shooting stall on a seaside pier, seen head on. A string of bulbs runs along the very top, a striped canvas awning carries the stall's name and its readouts, and a painted timber counter on the right holds every control. Everything built by a person is dark timber, cream canvas and brass. Everything bright is behind the window: the dusk sky, the sun on the water, and seven colours of balloon. Coral appears exactly once, on Start, the only key that begins a game.

## Layout

The stall is a fixed 3:2 frame and every region is placed as a percentage of it, so the whole thing scales as one photograph rather than reflowing. The left 61% is the game: the awning across the top, the window beneath it, and a chalked status line under that. The right 28% is the counter, a single painted panel holding five stacked groups in the order you reach for them — the aim dial, the lives, the figures, the clock, then the stall's three rules, with the two keys pinned to the bottom edge. The window holds a 4:3 aspect and centres itself in whatever space is left, so the canvas is never distorted and its own 1024×768 coordinates never change.

## Materials and depth

The stall front is a vertical plank grain over a warm-to-dark gradient, framed in a lighter timber edge. The awning is a cream signboard with a striped fringe along its bottom edge, in fairground red and canvas cream. The window is set into a raised timber frame with an inner dark rim, and a soft vignette lies over the canvas in CSS — deliberately not part of the canvas, so the game's own pixels stay clean. The counter is painted board: a light-to-dark vertical gradient, a pale inner rim, and a dark pool along its bottom edge. Depth is all light: figure wells sit in inset shadow, keys carry a highlight along the top and a shadow below.

## The sky

Everything inside the window is drawn by the game, sixty times a second. A four-stop gradient runs from near-black at the top through violet to a warm horizon, with seventy fixed stars over it. The sun sits low and right as a radial glow, with eight fading lines of light on the water beneath it. The sea is a narrow dark band, and the pier deck below it is planked with vertical shadows and a lit front edge. The cannon stands at the centre of the deck: a timber mount, a two-tone brass barrel with a highlight along it, and a bright hub it turns on. A dashed line runs out of the muzzle along the aim.

## Interaction and states

The cursor over the window is a crosshair. Moving the mouse turns the barrel, and the same angle appears twice more at once — in degrees on the awning, and as a needle on the counter's dial. Clicking fires, at most every 0.16 seconds. The two clock keys invert to near-black with a warm label when chosen. Start becomes Pause while a game runs and disables itself once the stall has closed; Play again is disabled until there has been a game to replay. Before the first game and after the last, a translucent card covers the sky with the title, the rules and the key to press. Motion in the chrome is limited to a hover lift and a press depression, both removed under reduced motion; the game's own movement is the point of the project and is never reduced. Five short sounds mark the moments worth marking: the cannon, a pop, a balloon getting away, the stall closing, and a fresh game.

## The aim dial

A small canvas at the top of the counter holds a half-circle protractor and one brass needle. It draws the same angle the barrel is holding, on its own, away from the picture. It answers "which way am I actually pointing" as a shape, while the awning answers it as a number, so `Math.atan2` can be checked against something visible. It is `aria-hidden`, because the same angle sits on the awning as text.

## The figures

Four wells on the counter holding the numbers the game keeps: the score, how many balloons are in the sky, how many darts are in the air, and how many balloons got away. The middle two are the lengths of the two lists in the memory, put on the page as text. A list that fills up and never empties is the visible symptom of an unwritten retirement function, so those two counters are a debugging tool as much as a scoreboard. Lives sit above them as three balloons, filled while they last and outlined once they are spent.

## Responsive behavior

Below 900px the stall stands up into one column and the page scrolls: awning, window, status, then the counter. The window goes full width and stays 4:3, the counter panels keep their order with touch-sized keys at 48px, and the awning's stripes and the bulbs switch from container units to pixels so they keep their size. Nothing scrolls horizontally.
