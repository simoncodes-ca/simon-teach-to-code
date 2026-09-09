# Simon's Lookout Post

A gun post on a ridge at first light. Planes cross the sky and drop paratroopers.

Each trooper falls. His chute opens. He lands, and then he walks at your post.

Shoot him before he arrives. Let three reach you and the post is gone.

## The one big idea

**Four kinds of thing move in this window. Every kind moves by a different rule.**

The balloon stall had two kinds. Balloons went up. Darts arced. Two kinds were enough to build a game loop around.

This one has planes, troopers, shells and explosions. A plane crosses in a straight line. A shell crosses in a straight line, much faster. An explosion stays where it is, and only grows.

The trooper is the odd one. He changes his rule twice on the way down.

So the game keeps four lists. Each list fills and empties on its own. All four do it at the same time. Almost every game you have played works this way.

The trooper's three rules go in this order:

```text
falling  →  chute  →  walking
```

One trooper, three rules. A word inside him decides which rule moves him this frame. You built a machine like that in project 2, in the elevator. Here it lives inside a sprite.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `parachuters.html` | Builds the page: the post, the plate, the rack, the keys | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `parachuters.js` | The troopers, the shells, the hits and the explosions | You |

Double-click `parachuters.html` to open it. Change `parachuters.js`, save the file, then refresh the browser page.

Nine functions in `parachuters.js` are marked `// TODO`. Write them in file order, from the top down. Each one gives you two hints. All the answers sit in one block at the very bottom of the file.

Press Start now. Planes cross the sky and drop nothing. That is on purpose.

## What the post does

- The **sky** is a canvas, the same as the last two projects. The game paints all of it, sixty times a second.
- The **plate** at the top holds two numbers. One is the angle the gun points. One is your score.
- The **Troopers panel** counts how many troopers are in each state. It is the state machine, drawn as three bars. Watch it while you play.
- The **four lists** panel counts what is in each list. A list that grows and never shrinks is a bug. This panel is where you catch it.
- **Slow motion** works as it did in project 7. It runs the clock at a third of its speed, and changes nothing else.

## What you will learn

- How a game holds several lists of things at once
- What a sprite is, and why every moving thing is the same shape of object
- How one thing can move by three different rules
- How to change a state at the right moment, and only once
- How to tell whether two boxes overlap
- Why one collision function works for every kind of thing
- How an explosion is two numbers changing
- How update and draw stay apart as a game grows

## Good to know

### What you already know

These all work the same way here. Read `01-calculator/README.md` through `07-balloons/README.md` again for the full story.

- The game loop calls `update()` and then `render()`, sixty times a second.
- Everything moves by `speed × seconds`, never by a fixed number of pixels per frame.
- Gravity is one line that adds to `vy`.
- `Math.cos` and `Math.sin` turn an angle into a velocity. `Math.atan2` turns two points back into an angle.
- A list that things leave is walked **backwards**, so removing one does not skip the next.
- A canvas remembers nothing, so the picture is drawn again from the memory every frame.
- On a canvas, y counts downwards. Up is a smaller y.
- A state machine is in exactly one named state at a time. The elevator taught this.

`aimAngle` and the restart are written for you this time. You wrote both of them in project 7, so neither one holds anything new.

### A sprite is a plain object

Every moving thing in this game is a **sprite**. The word sounds like a special kind of code. It is an ordinary object, with the same parts every time:

```js
{ kind: 'trooper', x: 480, y: 210, w: 26, h: 34,
  vx: 0, vy: 140, state: 'falling' }
```

That is the whole idea. A sprite says where it is, how big it is, how fast it is going, and what it is doing.

Every sprite has the same parts, so one function can work on any of them. `moveSprite` moves planes and shells with the same two lines. `hitsSprite` checks a shell against a trooper. It checks a shell against a plane with the same four comparisons, and never asks which is which.

A sprite carries only what it needs. An explosion has no velocity, because it never moves. It has no state, because it never changes its mind.

### x and y moved to the corner

In the balloon stall, a balloon's x and y were its **middle**. A balloon is a circle, and a circle is easiest to think about from the middle.

Here, x and y are the **top left corner** of the box. Everybody forgets that once, so read it twice.

A corner suits a box better. Take the corner and the size, and one sum gives you any edge you want:

```text
left edge      sprite.x
right edge     sprite.x + sprite.w
top edge       sprite.y
bottom edge    sprite.y + sprite.h
middle across  sprite.x + sprite.w / 2
```

### One thing, three rules

A trooper is `'falling'`, then `'chute'`, then `'walking'`. His `state` is a plain word stored inside him.

Two functions share the work, and keeping them apart is the point.

`moveTrooper` asks what state he is in, then moves him by that rule. It never changes the state.

`nextTrooperState` looks at where he is, then hands back the state he should be in now. It never moves him.

The wiring puts the two together:

```js
for (const trooper of troopers) moveTrooper(trooper, seconds);
for (const trooper of troopers) {
  const next = nextTrooperState(trooper);
  if (next !== trooper.state) changeState(trooper, next);
}
```

`changeState` is written for you. It holds the work that happens **once**, at the moment of the change. That work is the chute sound, and standing the trooper up on the ground.

Copy that split into your own games. Work that happens every frame goes in the movement. Work that happens once goes where the state changes.

### Did two boxes touch?

Project 7 asked whether a point sat inside a circle. This one asks whether two rectangles overlap.

Think about the ways they **miss** instead. It is easier. Two boxes miss each other if any one of these is true:

```text
a is completely left of b
a is completely right of b
a is completely above b
a is completely below b
```

If none of the four is true, the boxes overlap. Write each line the other way round, then join all four with `&&`:

```js
a.x < b.x + b.w      // a's left edge is left of b's right edge
a.x + a.w > b.x      // a's right edge is right of b's left edge
a.y < b.y + b.h      // and the same two again, up and down
a.y + a.h > b.y
```

This is the most common collision test in games. It has a name: AABB, short for axis-aligned bounding box. The name only means "a box that is not turned at an angle".

### A shell has no gravity

A dart in project 7 had gravity, so its velocity changed all the way down. A shell here has none. Its `vx` and `vy` are set when it leaves the barrel, and they never change again.

That one difference decides two things.

First, the plain `moveSprite` can move a shell, the same as it moves a plane. Nothing has to touch a shell's velocity.

Second, a shell that leaves the **top** of the sky never comes back. A dart did come back, because gravity brought it. So `bulletIsGone` checks all four edges, and `dartIsGone` only checked three.

### Already written for you

Section 3 of `parachuters.js` is finished, the same as in the seven projects before it.

- `frame()` is the game loop. `update()` is one step of the game, and it is where your functions are called.
- `render()` draws the whole picture: the sky, the ridge, the ground, then every plane, every trooper, the post, every shell, and every explosion.
- `makePlane()` builds a plane. It is a finished sprite, so read it before you write your own.
- `moveSprite(sprite, seconds)` moves anything by its own velocity.
- `towardsPost(x)` hands back -1 or 1, whichever way the post is.
- `muzzlePoint(angle)` is where the end of the barrel is.
- `aimAngle(from, to)` and `skyPoint(event)` are the ones you wrote in projects 6 and 7.
- `changeState`, `destroy`, `loseBag` and `resetGame` keep the score, the sandbags and the sounds.
- The mouse, the four keys and the **Space** shortcut are all connected.

You can also add `#demo` or `#demo-over` to the end of the address in the browser. `#demo` is the finished game, playable, so you can see what you are building. `#demo-over` is a lost post.

Both demos fill in your empty functions with answers of their own. So a demo tells you nothing about the code you wrote. Use them to look, and nothing else.

### Finding your mistakes

The status line under the window names the empty function. Read it first.

| What you see | The function to check |
|---|---|
| Planes cross and drop nothing | `makeTrooper` |
| Troopers hang in the air in a line | `moveTrooper` |
| Troopers drop straight through the ground | `nextTrooperState` |
| Troopers gather on the post and stand there | `reachedThePost` |
| Clicking fires nothing | `makeBullet` |
| "Shells" climbs and never falls | `bulletIsGone` |
| Shells pass straight through everybody | `hitsSprite` |
| Things vanish with no bang | `makeBoom` |
| The explosions never go out | `updateBoom` |
| A trooper freezes the moment he lands | `moveTrooper` again |
| Every trooper walks the same way, off the edge | `moveTrooper` again |

The last two are the good bugs of this project.

A trooper who freezes on landing has no `'walking'` branch in `moveTrooper`. His state changed, and no rule caught him.

A trooper who walks the wrong way is missing `towardsPost`. `WALK_SPEED` on its own always walks him right, whichever side he landed on.

You can also print the memory:

```js
console.log(troopers.length, bullets.length, booms.length);
console.log(troopers[0].state, troopers[0].y);
```

Press Slow motion, then watch one trooper. His state changes as he passes the halfway line.

### Try this next

The project stops here on purpose. Each of these is a new rule rather than a new idea, so you already know enough to add them.

- **A trooper who fires back** once he lands, so walking towards you costs him something.
- **A shot chute**, so a hit above the head turns a `'chute'` trooper back into a `'falling'` one.
- **Wind**, blowing every trooper under a chute sideways as he comes down.
- **Points for the drop height**, so a trooper caught early is worth more.
- **More planes as the score climbs**, by making `PLANE_EVERY` a variable instead of a constant.
- **A trooper who lands on the sandbags** and has to be shot at close range.
