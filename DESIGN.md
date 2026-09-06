---
name: The Coding Trail
description: A storybook route map for a family learning to code.
colors:
  night: "#17282b"
  paper: "#f8e8c8"
  coral: "#e86848"
  gold: "#d8b888"
  sage: "#9db8a4"
typography:
  display: "Georgia, 'Times New Roman', serif"
  body: "'Trebuchet MS', 'Segoe UI', sans-serif"
---

# Design System: The Coding Trail

## Overview

The showcase is an illustrated storybook map, not a conventional dashboard. A deep blue-green field holds a single winding parchment route. Project landmarks are cream paper cards with warm offset depth, placed along the route like stops on a hand-drawn journey. Coral marks work that can be entered now; muted gold marks future work.

The map keeps the learning sequence visible while the cards carry the practical information: project number, state, short teaching description, and topic tags. The first two cards are real links to the existing projects. Future cards are honest disabled articles with a visible Coming Soon state.

## Layout

Desktop uses a large introduction, a fixed vertical table of contents on the right, and a 12-column winding trail. Compact landmark cards alternate across the route, keeping the full sequence scannable without excessive vertical travel. The final small-strategy-game destination is wider. Mobile collapses the route into a single readable column while alternating cards left and right. The map surface remains bounded by an irregular rounded frame.

The table of contents stays fixed as a narrow vertical rail on the right side of desktop screens and anchors directly to every landmark, including the final RTS destination. On narrow screens it returns to a sticky horizontal strip so the full list remains accessible without covering the cards.

## Materials and depth

The night ground is quiet and flat; the paper cards provide the main depth through a warm offset shadow and a softer cast shadow. Card corners vary slightly between 16–24px to keep the paper feeling placed rather than factory-perfect. The route is authored as a crisp SVG geometry layer with a dark under-stroke and a dotted parchment over-stroke.

## Interaction and states

Available cards are links with lift-on-hover and keyboard focus. Their status is Ready and their action is Open project. Future cards are not links, use a muted paper state, dashed edge, and Coming Soon status. Focus uses the coral ring; reduced-motion users receive no animated transition.

## Responsive behavior

At 760px and below, the 12-column map becomes a vertical flex trail. Cards alternate alignment, use the compact density, and the route scales to a narrow winding spine. The sticky table of contents remains a single horizontal strip with touch-sized links. Text remains readable without horizontal scrolling. The first viewport retains the title, explanatory copy, legend, table of contents, and first landmark.
