---
name: The Green Baize
description: A card table seen from above, where the numbers that matter are struck in brass.
colors:
  felt: "#14614a"
  felt-deep: "#0c3f31"
  felt-lit: "#1d7a5d"
  rail: "#4a2f1c"
  rail-lit: "#7d5330"
  brass: "#dcae55"
  card: "#f7f2e6"
  card-back: "#8d2f2a"
  ink: "#23272b"
  suit-red: "#b3312b"
  cream: "#ece2cc"
typography:
  display: "Georgia, 'Iowan Old Style', 'Times New Roman', serif"
  label: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
---

# Design System: The Green Baize

> Recorded from the built Blackjack page; see `04-blackjack/` for the implementation.

## Overview

The page is one card table photographed from directly above. Green felt fills the frame inside a polished wood rail with a thin brass inlay, and a faint betting arc is painted on the baize behind the player's seat. Cards are cream, carrying a corner rank and one large centre pip. Brass is reserved for numbers that carry meaning — the two hand totals, the count on the shoe, the phase pill — so the eye lands on state rather than decoration. Red appears twice and only twice: on a red suit, and on a hand that has died.

## Layout

Two thirds of the width is the table proper, stacked as a single centre column: title, the dealer's seat, the phase pill, the player's seat, the status line, then three chips. Dealer and player mirror each other exactly — a name in small caps above, cards in the middle, a brass total below — so the two hands are read the same way. The remaining third on the right is the shoe: a stack of face-down cards showing how many remain, the deck-order ribbon beneath it, and the result plaque in the space below that. Every region is placed as a percentage of a fixed 3:2 frame, so the whole table scales as one photograph rather than reflowing.

## Materials and depth

One felt surface, built from a generated fibre-weave plate over a radial gradient that lifts the centre and drops the corners. Depth comes from the light: an inset shadow under the rail, a drop shadow under every card, and a three-card stack effect on the shoe made from offset box shadows. Cards are a soft diagonal gradient from near-white to a warmer edge, never flat. Chips are a radial gradient for the clay with a repeating conic gradient for the edge dashes, masked to the rim so the label stays legible.

## Interaction and states

The phase drives everything. Chips are real buttons that enable and disable on the phase alone: hit and stand live only during `playerTurn`, new deal dies during `dealing` and `dealerTurn`. Hover lifts a chip and deepens its shadow; focus draws a brass ring outside the clay. Cards slide in from the shoe's direction with a slight rotation as they are dealt, and the dealer's hole card turns over once, on the single render where it is revealed. Under every face-up card sits the value it is worth, in small caps — the learner's `cardValue`, said out loud. A hand over 21 turns its total red and appends the word "bust", so the state never depends on colour alone. Reduced-motion users get every card and chip already in place.

## The deck ribbon

A cream strip under the shoe draws one tick per card left in the deck, in the order they will come out, coloured by suit. Suit colour has no effect on blackjack, so the strip shows the shuffle honestly while giving away nothing: four clean stripes before a shuffle, red and black scattered after, and shrinking from the right as cards are dealt. It exists to make randomness — normally the least visible thing a program does — something you can point at.

## Responsive behavior

Below 820px the table stands up into one column: title, phase, dealer, player, status, chips, then the shoe and ribbon last. Cards drop to 17vw and hands wrap rather than shrink, the chips stay comfortably touch-sized, and the result plaque moves to the top where it cannot be missed. Nothing scrolls horizontally.
