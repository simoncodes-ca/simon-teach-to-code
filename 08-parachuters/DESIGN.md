---
name: The Field Post
description: A gun post at first light, seen from inside, where the only weather on the page is behind the glass.
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

# Design System: The Field Post

> Recorded from the built Lookout Post page; see `08-parachuters/` for the implementation.

## Overview

The page is one field gun post, seen from inside at first light. A stamped steel name plate runs across the top with a rivet in each corner. A heavy steel window looks out at the ridge. A panel of olive-painted instruments stands to the right of it. Everything a person built is olive drab, canvas cream and gunmetal. Everything with weather in it is behind the glass: the dawn sky, the cloud, the ridge, and the fire of an explosion. Signal red appears exactly once, on Start, the only key that begins a game.

## Layout

The post is a fixed 3:2 frame and every region is placed as a percentage of it, so the whole thing scales as one photograph rather than reflowing. The left 61% is the game: the name plate across the top, the window beneath it, and a chalked status line under that. The right 28% is the instrument rack, a single painted panel holding five stacked groups in the order you reach for them — the trooper states, the post's sandbags, the four list counts, the clock, then the three standing orders, with the two keys pinned to the bottom edge. The window holds a 4:3 aspect and centres itself in whatever space is left, so the canvas is never distorted and its own 1024×768 coordinates never change.

## Materials and depth

The post front is olive paint over a diagonal brushed grain, framed in a lighter olive edge. The name plate is stamped steel: a light-to-dark vertical gradient, a bright top highlight, a dark pool along the bottom, and four rivets. Its two readouts are sunk black wells with amber figures. The window is set into a gunmetal frame with an inner dark rim, and a diagonal glare with a soft vignette lies over the canvas in CSS — deliberately not part of the canvas, so the game's own pixels stay clean. The rack is painted board: a light-to-dark vertical gradient, a pale inner rim, and a dark pool along its bottom edge. Depth is all light: the figure wells and the state bars sit in inset shadow, keys carry a highlight along the top and a shadow below.

## The sky

Everything inside the window is drawn by the game, sixty times a second. A four-stop gradient runs from deep blue at the top through daylight blue to a warm gold horizon. Nine fixed clouds drift across it as pale ellipses. A ridge lies along the horizon in flat silhouette, drawn from two sine waves so it reads as hills rather than a shape. Below it the ground is a short band of earth with a lit top edge and a row of grass strokes. The post stands at the centre: three offset rows of sandbags, a two-tone barrel with a highlight along it, and a hub it turns on. A dashed line runs out of the muzzle along the aim.

## The sprites

Four kinds of thing are drawn, and each one is drawn from the same object. The plane is a hull, a fin, a wing, a glass cockpit and a blurred propeller, mirrored by the sign of its `vx`. The trooper is drawn three ways, one per state: arms and legs thrown out while falling, hanging still under a canopy with two lines to his shoulders, and mid-stride while walking, with the stride taken from his own x so no two troopers are in step. The shell is a short amber tracer along its velocity with a bright head. The explosion is a radial gradient from white through amber to nothing, ringed in cream, fading out with its own life.

## Interaction and states

The cursor over the window is a crosshair. Moving the mouse turns the barrel, and the same angle appears in degrees on the name plate. Clicking fires, at most every 0.2 seconds. The two clock keys invert to near-black with an amber label when chosen. Start becomes Pause while a game runs and disables itself once the post has fallen; Play again is disabled until there has been a game to replay. Before the first game and after the last, a translucent card covers the sky with the title, the orders and the key to press. Motion in the chrome is limited to a hover lift and a press depression, both removed under reduced motion; the game's own movement is the point of the project and is never reduced. Six short sounds mark the moments worth marking: the gun, an explosion, a chute opening, a trooper reaching the post, the post falling, and a fresh watch.

## The trooper states

Three rows at the top of the rack, one per state, each with a name, a bar and a count. It is the state machine, kept where you can watch it. A trooper leaving one row appears in the next in the same frame, so a transition that fires at the wrong height is visible as a number moving early. The bars fill by twenty percent per trooper, so five in one state fills a row.

## The four lists

Four wells on the rack holding the length of each list the game keeps: planes, troopers, shells and explosions. Every one of them is a list that things enter and leave. A list that fills up and never empties is the visible symptom of a missing retirement rule, so these four counters are a debugging tool as much as a scoreboard. The post's three sandbags sit above them, filled while they last and outlined once they are spent.

## Responsive behavior

Below 900px the post stands up into one column and the page scrolls: plate, window, status, then the rack. The window goes full width and stays 4:3, the rack panels keep their order with touch-sized keys at 48px, and the plate's rivets are dropped while its type switches from container units to pixels so it keeps its size. Nothing scrolls horizontally.
