# Simon's Balloon Stall

A shooting stall on the pier at dusk. Balloons float up out of the sea. A brass cannon on the deck follows your mouse.

Click to fire a dart. The dart arcs, because gravity pulls on it all the way. Hit a balloon and it pops. Let three get away and the stall closes.

## The one big idea

**This is the first program that keeps going when you do nothing.**

Every project before this one waited. Hangman waited for a letter. The paint app waited for the mouse. Nothing happened until you did something.

This one does not wait. Sixty times a second, whether you touch anything or not, the game moves everything a little and draws it all again. That is called a **game loop**, and every game you have ever played has one.

The loop hands your functions a single number: `seconds`. It is how long the last frame took, and it is usually about `0.016`. Everything moves by that number.

That is the rule to take away from this project:

```text
distance = speed × time
```

Never move a thing "5 pixels each frame". Move it "300 pixels per second, for `seconds` worth of time". Then the game runs at the same speed on a fast computer and on a slow one, and slow motion becomes one line of code instead of a rewrite.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `balloons.html` | Builds the page: the stall, the awning, the counter, the keys | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `balloons.js` | The balloons, the darts, the aiming and the rules | You |

Double-click `balloons.html` to open it. Change `balloons.js`, save the file, then refresh the browser page.

Nine functions in `balloons.js` are marked `// TODO`. Write them in file order, from the top down. Each one gives you two hints, and all the answers sit in one block at the very bottom of the file.

Press Start now. Nothing rises. That is on purpose.

Check one rule at a time. First watch a balloon rise. Then fire a dart straight up and watch its arc. Finally pop a balloon, let one escape, and press Play again.

## What the stall does

The **sky** is a canvas, the same as the paper in project 6. The cannon, the balloons and the darts are all painted on it, sixty times a second.

The **awning** shows the angle your cannon is pointing, in degrees. Straight right is 0. Straight up is 90. Straight left is 180.

The **Aim dial** on the counter draws that same angle on its own, so you can watch the number and the picture agree.

The **Figures** count what is in the two lists in the memory. "In the sky" is how many balloons. "In the air" is how many darts.

**Slow motion** makes the clock run at a third of its speed. Nothing in your code changes. Only `seconds` gets smaller, and everything slows down together. It is the best proof that you got the movement right.

## What you will learn

- What a game loop is, and why it is nothing like a click handler
- Why everything moves by time, and never by frames
- Velocity: one speed split into a sideways part and an up-and-down part
- How gravity works, in one line
- How to turn a direction into a velocity, with cosine and sine
- How to find the angle from one point to another, with `atan2`
- How to tell whether two things touched
- How to take things out of a list while you are walking through it
- Score, lives, and putting a game back to the start

## Good to know

### What you already know

These all work the same way here. Read `01-calculator/README.md` through `06-paint/README.md` again for the full story.

- Objects hold named parts. `balloon.y` reads one, and `balloon.y = 5` changes it.
- Arrays are ordered lists. `.push(x)` adds to the end. `.length` counts.
- `for (const x of list)` walks a list without counting.
- A canvas is a sheet of pixels that remembers nothing, so the picture is drawn again from the memory every time.
- A canvas has its own numbers. The mouse has screen numbers. Turning one into the other needs `getBoundingClientRect()`, a subtraction and a scale. It is written for you here, as `skyPoint`.
- On a canvas, y counts **downwards**. Up is a smaller y.
- `console.log` shows you what is really happening.

One new way of writing a change to a number turns up all through this project:

```js
balloon.y -= 4;      // the same as balloon.y = balloon.y - 4
dart.x += 12;        // the same as dart.x = dart.x + 12
```

### The game loop

The loop is written for you, in section 3. It is worth reading twice.

```js
function frame(now) {
  requestAnimationFrame(frame);          // do this again before the next frame
  let seconds = (now - previous) / 1000; // how long the last frame took
  previous = now;
  if (phase === 'playing') update(seconds);
  render();
}
```

`requestAnimationFrame` is the same one the elevator used in project 2. There it moved one car. Here it runs the whole game.

The line to notice is the first one inside the function. The loop asks for the next frame straight away, at the top, before it does any work. That is what keeps it going forever.

`now` is a time in thousandths of a second. Take away the last `now` and you have how long that frame took. Divide by 1000 and you have it in seconds.

The loop then does the same two things every frame, in this order:

```text
update    move everything, by that much time
render    draw the whole picture again
```

Those two are kept apart on purpose. `update` never draws. `render` never changes anything. When something is in the wrong place, you know which one to look at.

### Why time, and not frames

A screen usually draws 60 frames a second. Some draw 120. An old laptop with a lot open might manage 30.

So "move 4 pixels per frame" means four different games on four different screens. On the 120 screen everything runs at double speed.

"Move 240 pixels per second" is the same game everywhere:

```js
balloon.y -= balloon.speed * seconds;
```

At 60 frames a second, `seconds` is about 0.016, so the balloon moves about 4 pixels. At 120 frames a second, `seconds` is about 0.008, so it moves about 2 pixels — twice as often. Both add up to 240 pixels in one second.

The loop trims any frame longer than 0.05 seconds. Switch to another tab for a minute and `now - previous` becomes sixty thousand. Without the trim, every balloon would jump straight off the top while you were away.

### Velocity is a speed with a direction

A balloon has one number for its speed, because it only ever goes one way: up.

A dart is different. It can go up and to the left, or flat and to the right, or anywhere between. One number cannot say that. So a dart carries two:

```js
{ x: 571, y: 631, vx: 707, vy: -707 }
```

`vx` is how far it moves sideways in one second. `vy` is how far it moves down in one second. A negative `vy` means it is going up, because up is a smaller y.

Moving it is then the same rule, done twice:

```js
dart.x += dart.vx * seconds;
dart.y += dart.vy * seconds;
```

### Gravity is one line

Gravity does not move the dart. Gravity changes the dart's `vy`:

```js
dart.vy += GRAVITY * seconds;
```

`GRAVITY` is 760, so every second in the air adds 760 to `vy`.

Follow one dart fired straight up. It starts with `vy` of -1000, so it climbs fast. After half a second `vy` is about -620, so it is still climbing, but slower. After 1.3 seconds `vy` passes zero — that is the top of the arc, where it hangs for a moment. Then `vy` goes positive and the dart falls, faster and faster.

Nowhere in your code do you write "go up" or "now come down". You write one line that changes a number, and the curve appears on its own. That is the part worth staring at.

### Angles, cosine and sine

An angle is a direction written as one number.

JavaScript measures angles in **radians**, not degrees. A radian is just a different sized unit, the way a centimetre is a different size from an inch. Half a turn is `Math.PI`, which is about 3.14. A quarter turn is `Math.PI / 2`.

You need angles in two directions, and there is a function for each.

**Two points, and you want the angle between them.** That is `Math.atan2`:

```js
const angle = Math.atan2(to.y - from.y, to.x - from.x);
```

The down distance goes first. Everybody gets that the wrong way round once.

**An angle, and you want to move along it.** That is `Math.cos` and `Math.sin`:

```js
const vx = Math.cos(angle) * speed;
const vy = Math.sin(angle) * speed;
```

`Math.cos(angle)` is how much of the direction is sideways. `Math.sin(angle)` is how much of it is up or down. Both are numbers between -1 and 1. Multiply each by how fast you want to go, and the dart travels exactly along the angle.

These two are opposites. `atan2` turns two distances into one angle. `cos` and `sin` turn one angle back into two distances.

### Did they touch?

A balloon is a circle. A dart is small enough to count as a single point. So there is only one question: is the point inside the circle?

It is inside when the distance between them is less than the balloon's radius. The distance comes from the triangle rule you may have met at school as Pythagoras:

```js
const across = dart.x - balloon.x;
const down = dart.y - balloon.y;
const distance = Math.sqrt(across * across + down * down);
```

That is the whole of collision detection here. Real games use rectangles, or several circles, or shapes made of many points. All of them are this idea, done more times.

### Taking things out of a list

A thing that is finished has to leave its list, or the list grows forever and the game slowly chokes.

Look at how the given wiring removes an escaped balloon:

```js
for (let i = balloons.length - 1; i >= 0; i -= 1) {
  if (hasEscaped(balloons[i]) === true) {
    balloons.splice(i, 1);
  }
}
```

`splice(i, 1)` means "take one item out, starting at position i".

The loop counts **backwards**, and that is not a style choice. Take item 2 out of a list going forwards and everything after it shifts down a place. What used to be item 3 is now item 2, and the loop has already gone past 2. It never gets looked at. Going backwards, the only things that shift are the ones you have already dealt with.

You will get this wrong once in some future game, and every other balloon will survive. Now you know what it looks like.

### Already written for you

Section 3 of `balloons.js` is finished, the same as in the six projects before it.

- `frame()` is the game loop. `update()` is one step of the game, and it is where your functions are called.
- `render()` draws the whole picture again: the sky, the sea, the deck, then every balloon, the cannon, every dart, and the burst marks.
- `skyPoint(event)` turns a mouse position into a place on the sky. It is the `canvasPoint` you wrote in project 6, word for word.
- `randomBetween(low, high)` and `randomColour()` are for `makeBalloon`.
- `muzzlePoint(angle)` is where the end of the barrel is. It is for `makeDart`.
- `clampAim(angle)` stops the cannon pointing down through the deck.
- `loseLife()` and `popBalloon()` keep the score, the lives and the sounds.
- The mouse, the four keys and the **Space** shortcut are all connected.

You can also add `#demo` or `#demo-over` to the end of the address in the browser. The first is the finished game, playable, so you can see what you are building. The second is the closed stall. They fill in your empty functions for themselves, so they are never a way to test your own.

### Finding your mistakes

The status line under the window names the empty function. It is doing real work in this project, so read it first.

| What you see | The function to check |
|---|---|
| The sky stays empty after Start | `makeBalloon` |
| Balloons sit in a row along the bottom | `moveBalloon` |
| "In the sky" climbs and climbs and never falls | `hasEscaped` |
| The barrel will not follow your mouse | `aimAngle` |
| Clicking fires nothing | `makeDart` |
| A dart appears at the muzzle and hangs there | `moveDart` |
| "In the air" only ever goes up | `dartIsGone` |
| Darts pass straight through the balloons | `hits` |
| Play again does nothing | `restartGame` |
| Darts vanish at the top of their arc | `dartIsGone` again |
| The barrel points the opposite way | `aimAngle` again |

That last pair are the two good bugs of this project.

A dart above the top of the sky is not finished. It is at the top of its arc, and it is coming back. Only the bottom and the two sides end a dart.

And `Math.atan2` takes the down distance first, not the across distance. Swap them and the cannon points somewhere strange.

You can also look straight at the memory:

```js
console.log(balloons.length, darts.length);
console.log(darts[0]);
```

Watch `darts[0]` in slow motion. Its `vy` starts negative, climbs through zero, and turns positive. That is the arc, in numbers.

### Try this next

The project stops here on purpose. Each of these is a new rule rather than a new idea, so you already know enough to add them.

- **Wind.** One line in `moveDart`, adding to `vx` instead of `vy`.
- **A balloon that drifts sideways** as it rises, instead of going straight up.
- **Faster balloons as the score climbs**, so the game gets harder.
- **Points by size**, so a small balloon is worth more than a big one.
- **A dart that bounces off the deck** once before it stops.
- **A limited number of darts**, so aiming matters more than clicking.
