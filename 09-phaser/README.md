# Simon's Lookout Post, Mark II

The same gun post. The same planes, the same troopers, the same three sandbags.

You built this game in project 8. You are going to build it again, and this time a **library** writes most of it.

Open `08-parachuters/parachuters.js` in one window and `remake.js` in another. Keep them side by side the whole way through. The comparison is the project.

## The one big idea

**A library is code somebody else already wrote, that you are allowed to use.**

Phaser is a game library. It brings a game loop, moving sprites, collision checks and picture loading with it. All four of those are things you wrote by hand in projects 6, 7 and 8.

So this file is shorter. Nine functions became eight, and the eight are much smaller.

That is the trade. You get the work for free, and in exchange you have to learn where somebody else put the switches.

## What each function turned into

| Project 8, by hand | Project 9, with Phaser |
|---|---|
| `frame()`, the loop | Phaser calls `update()` for you |
| four arrays | three **groups** |
| `makeTrooper` | `dropTrooper`, one `create` call |
| `moveTrooper` | gone. You set a velocity once instead |
| `nextTrooperState` | half given, half `openChute` and `landTrooper` |
| `reachedThePost` | `watchTheGate`, one line |
| `makeBullet` | `fireShell` |
| `bulletIsGone` | still yours. Phaser does not do this one |
| `hitsSprite` and two loops | `watchForHits`, two lines |
| `makeBoom` and `updateBoom` | `boom`, one picture and one **tween** |
| `skyPoint` | gone. Phaser hands you `pointer.x` |
| drawing every sprite by hand | pictures, loaded from the `assets` folder |

Those crossed-off names are on the rack beside the window, so you can see them go.

## The four files

| File | What it does | Who writes it |
|---|---|---|
| `remake.html` | Builds the page: the post, the plate, the rack, the keys | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `phaser.min.js` | The library. About a megabyte of somebody else's code | Never edit this |
| `remake.js` | The troopers, the shells, the hits and the explosions | You |

Double-click `remake.html` to open it. Change `remake.js`, save the file, then refresh the browser page.

Eight functions in `remake.js` are marked `// TODO`. Write them in file order, from the top down. Each one gives you two hints. All the answers sit in one block at the very bottom of the file.

Press Start now. Green boxes cross the sky. A green box is what Phaser draws when you ask for a picture it has never heard of, and the first function fixes it.

## What you will learn

- What a game library is, and what it takes off your hands
- How a library loads pictures before the game starts
- What a group is, and why it is better than an array here
- How to set a velocity once instead of moving something every frame
- How one line of `overlap` replaces a collision test and two loops
- What a tween is, and how a thing can tidy itself away
- How to tell a helpful shortcut from hidden complexity
- How to read somebody else's code well enough to use it

## Good to know

### What you already know

These all work the same way here. Read `01-calculator/README.md` through `08-parachuters/README.md` again for the full story.

- A game runs a loop, over and over, whether you touch it or not.
- Everything moves by `speed × seconds`, never by a fixed number of pixels per frame.
- Gravity makes a falling thing speed up.
- An angle plus a speed gives you a sideways part and a downwards part.
- A list that things leave is walked **backwards**, so removing one does not skip the next.
- A state machine is in exactly one named state at a time.
- A trooper is `'falling'`, then `'chute'`, then `'walking'`. Project 8 taught the whole machine.
- Update and draw are separate jobs.

`aimAngle` and `clampAim` are handed to you again. You wrote them in project 7.

### A scene, a sprite, a group

Phaser has three words worth learning on the first day.

A **scene** is one screen of a game. This whole window is one scene. Everything the library can do for you, it does through the scene, which is why `scene` is the first word of so many lines.

A **sprite** is one thing on the screen. It is the same idea as project 8's sprite, and now the library owns it. It carries a picture, a position, a velocity and a body.

A **group** is a list of sprites. It makes them, it keeps them, and it hands the whole list to the collision code in one go.

### You speak once, not every frame

This is the change worth understanding before any other.

In project 8, `moveTrooper` ran sixty times a second. Every frame you asked what state the trooper was in, and moved him by that rule.

Here there is no `moveTrooper` at all. You say this **once**, on the frame his chute opens:

```js
trooper.setVelocityY(CHUTE_SPEED);
```

Phaser moves him at that speed on every frame from then on, for ever, until something else changes it.

So the state machine survives, but only half of it. The half that **decides** is still there, in the given wiring. The half that **moved** him has gone completely.

Look at what that does to your job. Three of the eight functions — `openChute`, `landTrooper` and `dropTrooper` — are nothing but a handful of lines that run at one moment each.

### Overlap replaces the box test

In project 8 you wrote `hitsSprite`, and the wiring called it inside two loops, once per pair, every frame.

Here you say what you care about once, when the game starts:

```js
scene.physics.add.overlap(shells, troopers, shellHitsTrooper);
```

Read it as a sentence. Whenever something in `shells` overlaps something in `troopers`, call `shellHitsTrooper`. Phaser checks every pair, on every frame, for the rest of the game.

Two things about that line catch people out.

Pass the function **by name, with no brackets**. `shellHitsTrooper` hands Phaser the function to keep. `shellHitsTrooper()` runs it now, once, which is not what you want.

And the order matters. Phaser hands the pair to your function in the order you named the groups. Name them the other way round and the shell and the trooper arrive swapped.

### x and y moved back to the middle

Project 8 put x and y at the **top left corner** of a box, because you were doing the edge sums yourself.

Phaser does those sums, so it puts x and y back in the **middle** of a sprite. That is why `dropTrooper` starts a man at `plane.x`, with nothing to add or take away.

The picture and the box are two different things, and they are not always the same size. A trooper's picture is 56 by 98, because the chute has to fit on it. The trooper inside it is 26 by 34. The wiring gives every trooper a body that size, so a shell has to hit the man rather than the air above his head.

### What Phaser did not do

A library takes some work away. Never all of it. Two jobs in this game are still yours, and both are in the given wiring — read them.

A shell that leaves the sky is still thrown away by a loop you can see. Phaser has no opinion about what should happen at the edge of the world.

Slow motion got **harder**, not easier. In project 8 you multiplied one number. Phaser has three clocks, and all three have to be told, and the physics one is upside down: 2 there means half speed.

That is what to watch for when you use anybody's library. Ask what it took away, and then ask what it made more complicated. Both answers are real.

### Already written for you

Section 3 of `remake.js` is finished, the same as in the eight projects before it.

- The Phaser settings, the three groups, and the walking animation.
- `startPlane` builds a plane. Read it before you write `dropTrooper`.
- The two moments a trooper changes state, which call your `openChute` and `landTrooper`.
- `shellHitsTrooper`, `shellHitsPlane` and `trooperAtPost`, which score the hits and take the sandbags.
- `gate`, the invisible box over the sandbags.
- `retire`, which throws away planes, troopers and shells that have left the sky.
- The mouse, the four keys and the **Space** shortcut.
- `towardsPost`, `muzzlePoint`, `aimAngle` and `clampAim`, all from earlier projects.

You can also add `#demo` or `#demo-over` to the end of the address in the browser, exactly as in project 8. `#demo` is the finished game, playable. `#demo-over` is a lost post. Both fill your empty functions with answers of their own, so a demo tells you nothing about the code you wrote.

### Finding your mistakes

The status line under the window names the empty function. Read it first.

| What you see | The function to check |
|---|---|
| Green boxes cross the sky | `loadArt` |
| Planes cross and drop nothing | `dropTrooper` |
| Troopers fall straight through the ground | `openChute` |
| Troopers drift through the ground under a chute | `landTrooper` |
| Troopers walk through the post and out the far side | `watchTheGate` |
| Clicking fires nothing | `fireShell` |
| Shells pass straight through everybody | `watchForHits` |
| Things vanish with no bang | `boom` |
| A trooper speeds up under his chute | `openChute` again |
| Every trooper walks the same way, off the edge | `landTrooper` again |
| Troopers walk backwards | `landTrooper` again |

The last three are the good bugs of this project.

A trooper who speeds up under his chute still has gravity switched on. `setVelocityY` sets his speed for one moment, and gravity goes on adding to it. Turn it off with `setGravityY(0)`.

A trooper who always walks right is missing `towardsPost`. `WALK_SPEED` on its own is always a walk to the right.

A trooper who walks backwards has his picture flipped the wrong way. `setFlipX(true)` faces him left.

You can also print what Phaser is holding:

```js
console.log(planes.getLength(), troopers.getLength(), shells.getLength());
console.log(troopers.getChildren()[0].state);
```

Press Slow motion, then watch one trooper all the way down.

### Try this next

Each of these uses something Phaser gives you that this game does not touch yet.

- **A puff of smoke behind each shell**, with a second, smaller tween.
- **A shell that runs out of range**, by giving it a `lifespan` and retiring it on time instead of at the edge.
- **A trooper who wobbles under his chute**, with a tween on his x.
- **A score that flies up the screen** when you hit something, and fades.
- **Sound through Phaser**, instead of the `Audio` objects this project kept from the calculator.
- **A second scene** for the title card, instead of the one drawn over the sky.

## What comes next

Project 10 is the first game built **on** Phaser rather than translated into it. Nothing to compare it with, and a keyboard instead of a mouse.
