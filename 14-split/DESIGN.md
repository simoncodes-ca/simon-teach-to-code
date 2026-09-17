---
name: Rooftop Run, in six files
description: Project 13's cream plastic handheld, unchanged, with one new panel on the rack that counts the six files at work.
colors:
  shell: "#e6d8bd"
  shell-lit: "#f8f1e2"
  shell-deep: "#b9a684"
  coral: "#e8552f"
  coral-deep: "#a8331a"
  sun: "#ffb03a"
  mint: "#2fd4c9"
  night: "#1b1030"
  ink: "#2b2118"
typography:
  display: "'Impact', 'Haettenschweiler', 'Arial Narrow', 'Trebuchet MS', system-ui, sans-serif"
  mono: "'Courier New', Consolas, monospace"
---

# Design System: Rooftop Run, in six files

> Recorded from the built page; see `14-split/` for the implementation.

## Overview

The look is project 13's, copied without a change. `13-runner/DESIGN.md` records the shell, the nameplate, the screen, the city, the runner, the obstacles and the status line, and all of it holds here.

That is the point of the project. The game is held still so the split is the only difference, and a console that looked new would break the comparison.

`styles.css` is project 13's file with one block added at the end.

## What is different

One panel on the rack, and nothing else.

**The six files** sits second in the rack, where project 13 kept its Gap and Kind samples. Those samples reported on stubs, and this project has none, so the space went to the split.

The panel is a list of six rows in load order: `numbers.js`, `record.js`, `world.js`, `runner.js`, `rack.js`, `game.js`. Each row is a dark violet well holding three things: a small lamp, the file name in mono, and a count in mint.

The lamp is the same amber as the In the air lamp, at about half the size. It lights for a third of a second whenever that file does a job, so world and runner blink and rack and game hold steady. The lamp on `numbers.js` never goes out, because that file is read on every line of every other file.

The count is jobs done since the run started. It sits right aligned in mono, the same face as every other number on the console. `numbers.js` shows a dash, because it never does a job at all.

A caption under the panel says what the numbers mean.

## The status line

Project 13 used the line under the screen to name the empty function. There are no empty functions here, so it names the file at work instead.

Each sentence starts with a file name and says what that file just did. A line holds for nine tenths of a second, then the metres and the best score come back.

The line stays in the same warm brown mono, and stays a live region.

## The two other small changes

The Gap and Kind wells are gone with their panel.

The Controls panel lost its scoring rows. The only thing worth scoring is metres, and the plate already shows those.

## Responsive behavior

Unchanged from project 13. Below 900px the console stands up into one column and every measurement switches from container units to pixels.

The file rows switch with it: a 14px lamp, 13px text, and the same three columns.
