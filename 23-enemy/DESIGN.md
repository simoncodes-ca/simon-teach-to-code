---
name: Forward Post
description: Project 22's build yard desk with the order pad taken off it, and two tank rosters in its place, the enemy at the top.
colors:
  steel: "#3b4a55"
  steel-lit: "#5b6d7a"
  steel-deep: "#1b242b"
  night: "#0d1216"
  paper: "#eef1ea"
  paper-deep: "#d3dbd2"
  ink: "#1d2830"
  signal: "#ff9a2e"
  signal-deep: "#b3621a"
  amber: "#ffbe5c"
  amber-deep: "#b3761a"
  friend: "#8fb7e8"
  alarm: "#e04a3a"
typography:
  stencil: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'Arial Black', sans-serif"
  label: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: Forward Post

> Recorded from the built page; see `23-enemy/` for the implementation.

## Overview

The page is project 22's desk with two cards swapped out. The furniture does not move. A plate across the top, a window on the left, a rack of cards down the right, and a line of words under the window.

Two cards are gone. **Build** and **Queue** belonged to project 22's lesson, and keeping them would have buried this one. The **Refinery** card went with them, because there is no ore here.

Three cards are in their place. **Enemy** sits at the top of the rack, because the red tanks are what the project is about. **Battle** holds the three numbers the learner's own functions produce. **Squad** is the same card, for the other side.

Two colours carry the sides. Alarm red is the enemy: their discs, their routes, their rings, their lamps, their health bars. Friend blue is yours. Route orange keeps its old job and marks only what you did: picked tanks, their routes, the drag box and the chosen map.

## The desk

Unchanged from projects 19 to 22. Blue-grey steel in three tones, lit from the top left, with faint horizontal brush marks, a near-black border and a hairline of orange inside it.

Every region is placed as a percentage of the desk, so the whole desk scales together like one photograph. The desk is `min(100cqw, 150cqh)` wide with a 3:2 shape.

## The plate

**FORWARD** in Impact, uppercase, pale blue-white. **POST** follows in route orange.

Three black wells at the right-hand end: the map name in orange mono, the blue count in friend blue, and the red count in alarm red. Both counts are live regions, and both count only tanks still fighting.

## The window

The map sits in a 4:3 frame of near-black steel behind a faint diagonal shine. The canvas is 960 by 720, twenty cells by fifteen at 48 pixels each, drawn with the terrain table's seven tiles.

Every mark carries a dark shadow under a bright line or fill, so it reads on grass, sand and rock alike.

| Mark | Drawn as |
|---|---|
| Whose tank it is | A disc under it, radius 28, in its side's colour at 55% behind a 2px ring |
| A tank | Project 17's blue hull at 70%, untinted on both sides |
| Its gun | The same turret picture, tinted friend blue or alarm red, turned to `unit.turret` |
| A wreck | Hull and gun both slate grey, the gun knocked a fraction off true, the disc down to 15% |
| Health | A 28 by 5 bar above it, in its side's colour, turning amber below 35% |
| What a red tank can see | A circle of `SEE_RANGE`, 1.5px alarm red, 14% until something is inside it, then 50% |
| What a red tank can hit | A circle of `GUN_RANGE`, 2px alarm red, 22% until something is inside it, then 85% over a 6% fill |
| A red tank's beat | Its four cells ringed in alarm red, joined by an alarm red dashed line |
| Who a tank has picked | A 1px thread to its target, in its own side's colour at 40% |
| A shot | A 2px cream line from barrel to target for 70 milliseconds, over a dark edge |
| A measuring line | An amber dashed line from the one picked tank to every red tank, with the distance in amber mono at the middle |
| Route of a driving tank | A thin line. Orange at 50% for yours, ending in a small orange X. Alarm red at 35% for theirs, with no X |
| Picked tank | Four orange corner brackets |
| Drag box | An orange outline over a 10% orange fill |
| No route | A red ring that fades over 1.4 seconds |
| A wreck happening | An amber ring that grows and fades over 1.2 seconds |

The tank pictures are project 17's, and neither side's hull is tinted. Multiplying a blue hull by red gives mud, so the side is carried by the disc under the tank and the colour of its gun.

Two marks appear only once a job is done. The measuring line waits for `farApart`, and the two rings wait for `inRange`. That is what makes those two jobs visible.

## The cards

Four graph-paper cards down the right, each held by a steel clip at the top centre, with faint blue ruled lines and an Impact title over a thin ink rule. The Maps card is pinned to the foot of the rack, so the empty desk sits between it and the rosters.

**Enemy** and **Squad** are the same card, built by one function. Each row is a four-column grid: a lamp and the name on the left, then the mode tag, then the target's name, then a health bar.

A red row's lamp is always lit in alarm red. A blue row's lamp is dark until you pick that tank, when it turns orange and the whole row goes orange. A wrecked row drops to 50% opacity and its lamp goes dark.

The mode tag is a black mono chip holding one word. The word is the learner's own, translated once for the reader, because the two sides act on different halves of the same four answers:

| `nextMode` said | A red row reads | A blue row reads | Colour |
|---|---|---|---|
| `'patrolling'` | on patrol | clear | Pale, on black |
| `'chasing'` | chasing | spotted | Route orange |
| `'attacking'` | firing | firing | White on alarm red |
| `'dead'` | wrecked | wrecked | Ink on pale grey |
| nothing yet | — | — | Pale, on black |

The word always carries the meaning. Colour never carries it alone.

**Battle** is three black wells with amber mono values: Nearest red, Shots fired and Wrecks. All three come from the learner's functions, and the card's note says so.

**Maps** is a two-column grid of steel keys, one per map file. The map on the board is an orange key.

## The bars

Every bar is the same part: a dark track with an inset shadow, and a fill eased over 0.1 seconds. Roster bars are 0.9cqh.

A health bar on the map takes its side's colour, and turns amber below 35%. The bars in the rosters keep the house amber fill, because the row's lamp and tag already say which side it is.

## The status line

Orange mono under the window, a live region. It names the next job until every function works. After that it says what just happened: who was picked, how many were sent, and who was wrecked, with both counts after it.

## Sounds

Project 22's six, and two new files. The `Audio` pattern is unchanged: build it once, rewind with `currentTime = 0`, and swallow the autoplay refusal with `.catch(() => {})`.

| Sound | When |
|---|---|
| `select.wav` | You pick a tank |
| `box.wav` | A drag box picks some |
| `order.wav` | You send them |
| `arrive.wav` | One of yours arrives |
| `blocked.wav` | No route, or you click a wreck |
| `map.wav` | You change map |
| `shot.wav` | A shot leaves a barrel. New |
| `boom.wav` | A tank reaches 0 health. New |

`shot.wav` is a noise crack over a falling square wave, 0.18 seconds. `boom.wav` is a filtered noise rumble under a falling sine, 0.62 seconds. Both are 22,050 Hz mono, like the six before them.

## Responsive behavior

Below 900px the desk stands up into one column and the page scrolls: plate, window, status line, cards.

Every measurement switches from container units to pixels. Roster rows grow to 44px tall, map buttons to 48px, and both rosters are capped at 320px and scroll. The name column shrinks before the other three, and a long name ends in an ellipsis. The focus ring becomes a 3px red outline.
