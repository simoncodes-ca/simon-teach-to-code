# Coding Roadmap

This roadmap runs from the twenty finished projects to a small Red Alert-style strategy game.

The order moves through five kinds of work. Webpage programs come first. Then grid games. Then Canvas and animation. Then a game library. Then the parts a strategy game needs: maps, units, resources, buildings, and a simple computer opponent.

## How to read this

The strategy game is the real destination.

Simon finishes one or two small projects a week. A big project takes one or two weeks. The whole list is about a year of work at that pace.

Three projects in the list are **cutovers** (a project that changes how we work, not just what we build). Each cutover is marked. Each one arrives because the next project needs it.

`AGENTS.md` still holds the rule that matters most. The stubs are the deliverable, and Simon fills them in.

### Numbering

**A project number never changes.** Every later README points back at earlier projects by folder name. Those pointers add up, and renaming a folder breaks all of them.

Give an inserted project a letter suffix instead. A project between 07 and 08 becomes `07b-something`. It sorts correctly, and it breaks nothing.

### What still opens by double-clicking

Every project through 16 opens by double-clicking the HTML file. Every project through 16 also deploys to GitHub Pages. Project 15 has one exception: its server half runs from a terminal.

From project 17 onward, we use npm and a development server. Those projects run on the computer instead of on GitHub Pages.

## Finished projects

### 1. Calculator

- Variables and data types
- Functions
- Conditionals
- Arrays
- Button events
- Updating the page with JavaScript
- Debugging with `console.log`

### 2. Elevator

- State machines
- Queues
- Timers
- Animation
- Consistent program state
- State transitions
- Smooth movement with `requestAnimationFrame`

### 3. Hangman

Hangman stays a simple webpage and adds richer rules.

- Strings and string methods
- Arrays
- Loops
- Boolean values
- Input validation
- Invalid actions
- Derived display state

Later additions could include categories, hints, difficulty levels, and keyboard input.

### 4. Blackjack

Blackjack teaches objects and rules without a visual game board.

- Objects that represent things
- Arrays of objects
- Building and shuffling a deck
- Randomness
- Functions that calculate values
- Rules with several cases
- State transitions

The phases are `dealing`, `playerTurn`, `dealerTurn`, and `finished`.

We left these out on purpose: betting, blackjack paying 3:2, splitting, doubling down, insurance, and a multi-deck shoe.

### 5. Battleship

Battleship is the first project with a map. It is still an ordinary webpage.

- Two-dimensional arrays
- Rows, columns, and coordinates
- Nested loops that build data
- Random placement by guessing and checking
- Overlap checking
- Turn-taking
- Hidden information
- Game phases

Each sea keeps two grids, `ships` and `shots`, because a hit square holds a ship and a shot at the same time. One grid of letters would have made that one fact instead of two.

Hidden information is the second lesson. `enemySea.ships` sits in memory the whole game. One `false` passed to the drawing code is the only thing keeping it off the screen.

We left these out on purpose: an enemy that hunts around its last hit, diagonal ships, a salvo variant, hot-seat two-player, and a score across games.

Battleship teaches maps made of cells. Later projects turn those cells into terrain, buildings, units, resources, and movement areas.

### 6. Paint app with undo

The paint app is the first project that draws. It is still an ordinary webpage.

- Canvas drawing
- Pointer events
- Screen coordinates and canvas coordinates
- Drawing lines and shapes
- Keeping input separate from drawing
- History stacks
- Undo and redo

A canvas is a sheet of pixels, and it remembers nothing. Paint on it and the paint is simply there — so the program keeps every stroke in a list of its own and draws the whole picture again on every mouse move. That is the same `render()` as every project before it, and it is what makes undo possible at all.

Undo and redo are then two lists and four lines. Clear is undo in a loop, which is why a cleared sheet can be brought back stroke by stroke. The eraser is the brush loaded with the paper's own colour, so none of the nine stubs has to know an eraser exists.

We left these out on purpose: layers, a fill tool, shapes and straight lines, zoom and pan, pressure-sensitive width, and saving a drawing so it survives a refresh — that last one is project 13's lesson.

Canvas connects webpage programs to game graphics.

### 7. Balloon shooting game

The balloon stall is the first game that runs on its own. It is still an ordinary webpage.

- Game loops
- Time-based movement
- Velocity and gravity
- Angles and trigonometry
- Collision detection
- Adding and removing objects
- Score, lives, and restarting

Every project before this one waited for a click. This one does not wait. A `requestAnimationFrame` loop measures how long the last frame took, hands that number to the game, and draws everything again — sixty times a second, whether anyone touches the page or not.

The rule the project exists to teach is one line long. **Move a thing by its speed multiplied by the time that passed.** Never move it a fixed number of pixels per frame. That version runs at double speed on a 120Hz screen, and it makes gravity a special case instead of a consequence.

Time-based movement then buys three things at once. Gravity is one line that adds to `vy`. Slow motion is one multiplier on `seconds`, and none of the nine stubs has to know. And the game plays the same on every machine.

The second lesson is that a game is two lists that things enter and leave. Balloons arrive on a timer and leave at the top. Darts arrive on a click and leave at the bottom. Deciding when a thing is finished is a real function with a real name, and the loop that removes them counts backwards for a reason.

We left these out on purpose: wind, bouncing darts, a limited number of darts, points that vary by balloon size, and rising difficulty. Several kinds of entity moving by different rules is project 8, and it is the next thing this game wants.

### 8. Parachuter game

The lookout post is the first game with more than one kind of thing in it. It is still an ordinary webpage.

- Lists of entities
- Sprites as plain data
- Timed spawning
- Different movement rules
- A state machine inside a sprite
- Ground and landing detection
- Box-to-box collision
- Several animations at the same time
- Game-over conditions

Project 7 held two lists that moved by two rules. This one holds four, and the four rules are deliberately unlike each other. A plane crosses in a straight line. A shell crosses far faster and never falls. An explosion never moves at all, it only grows. And a trooper changes his rule twice on the way down.

The idea the project exists to teach is that **a sprite is a plain object, and every moving thing is the same shape of object**: `{ kind, x, y, w, h, vx, vy, state }`. Because they all match, one `moveSprite` moves planes and shells, and one `hitsSprite` checks a shell against a trooper and against a plane without asking which is which. That has to be visible before Phaser hides it at project 9.

The second lesson is the state inside the sprite. A trooper is `falling`, then `chute`, then `walking`, and one word decides which rule moves him this frame. It is the elevator's state machine from project 2, multiplied by the length of a list. The learner writes it as two functions on purpose: `moveTrooper` moves and never decides, `nextTrooperState` decides and never moves.

The third lesson is quieter, and the wiring holds it. Work that happens every frame and work that happens once at a transition belong in different places.

x and y move from the middle of a circle to the top left corner of a box here, which catches everybody out once. The collision test changes with it, from a distance to a rectangle overlap.

We left these out on purpose: troopers who shoot back, a chute that can be shot away, wind, points that vary by drop height, and rising difficulty. Sprites loaded from image files wait for project 9, where the library loads them.

### 9. Phaser remake

The lookout post again, rebuilt on Phaser. It is the first project that uses a library, and the first that loads its pictures from files.

- Library timing and the game loop
- Library sprites and asset handling
- Groups, overlaps and tweens
- Comparing hand-written code with library code
- Telling a helpful abstraction from hidden complexity

The game is one Simon had already finished, and nothing in it changed. Same rules, same numbers, same sounds, same art — the PNG files were made by running project 8's own drawing code once and saving what came out. Every difference he can see is a difference the library made, because nothing else was allowed to move.

Nine functions became eight, and the eight are a few lines each. `frame()`, `moveSprite`, `hitsSprite` and its two loops, `updateBoom` and `skyPoint` are all gone. The rack beside the window crosses them off by name, so the saving is on the page rather than only in the README.

The idea that runs through every stub is that **you speak once, at the moment things change, instead of every frame.** `moveTrooper` ran sixty times a second. `openChute` runs once, and Phaser carries the result forward for ever. That is project 8's split between per-frame work and transition work, now enforced by the tool.

The second lesson is the cost, and it gets equal billing. Slow motion got harder: one multiplier became three clocks set three different ways, one of them inverted. Retiring a shell that has left the sky is still a hand-written loop, because Phaser has no opinion about the edge of the world. Both sit in the given wiring, commented as such. A learner who takes away only "libraries do the work" has learned the wrong half.

**Phaser, not p5.** p5 removes browser plumbing that Simon had already written twice by this point. That comparison is real, but it is small, and he would leave p5 as soon as he needed scenes, cameras and asset loading. One library, learned once, lasting to the end of the list.

`phaser.min.js` is vendored next to the HTML. A library must not drag the build step forward, and the build step arrives at project 17.

Two settings in the Phaser config exist only to keep the page double-clickable. Phaser refuses to guess a renderer when handed a canvas of our own, and its usual image loading uses XHR, which a browser blocks on a `file://` page. Both are commented in the file.

We left these out on purpose: Phaser's own sound system, a second scene for the title card, and tweens on anything but the explosion. All three are in the README as the good things to try next.

### 10. Alien Raid

An arcade cabinet. The first new game built on Phaser, and the first one played with the keyboard.

- Keyboard input
- Player movement and firing
- Several enemies, and enemy formations
- Bullets and collisions
- Waves
- Lives and respawning
- Rising difficulty

Project 9 was a translation, so nothing in it could surprise him. This one has no older version to copy from, and its centre is the one job the library refuses.

The idea the project exists to teach is that **a formation is one thing, not twenty-four things.** The swarm marches, turns at the wall and drops a step in lock-step. Give each alien a velocity of its own and it looks right for ten seconds, then falls apart, because each one turns as it personally reaches the wall. So `marchAliens` moves all of them by hand, every frame, with project 7's `speed × seconds`. It is the clearest example yet of a library doing most of a game and then stopping.

The second lesson is that a difficulty curve can be a sum. The march speed is `MARCH_SLOW * blockSize / aliens.getLength()`, capped. Nobody wrote a curve, and every wave gets frightening on its own as it empties. The bar on the rack measures how far the block really moved, rather than reporting the speed it was asked for, so an empty `marchAliens` leaves it flat.

The third is smaller and is about input. A click is a moment and Phaser delivers it. A key is a state, and has to be asked about on every frame. The `else` that sets the ship's velocity back to zero is the whole lesson, because leaving it out makes the ship drift.

Two things measured in a browser shaped the wiring. Phaser ignores the keyboard while the game lacks focus, and clicking Start leaves the keyboard on the Start button, where the space bar presses it again instead of firing. The canvas therefore takes `tabindex` and the focus when a game begins.

We left these out on purpose: a second kind of alien, bunkers, a passing saucer, bombs from the bottom of a column only, and more than one bomb at a time. All five are in the README as the good things to try next.

The game is keyboard-only. There are no touch controls, so a tablet can show the cabinet but cannot play it.

### 11. The Cheese Vault

A maze in a bank vault. You are a mouse eating the cheese. Cats prowl the corridors.

- A map stored as data
- Grid coordinates, and the two functions that translate them
- Tile collision
- Movement limits
- Changing the map as the game runs

Every game so far had a sky. Anything could be anywhere in it, and nothing was ever in the way. This one has walls.

The idea the project exists to teach is that **the map is data**. A level is twelve strings of sixteen characters. A `#` is a wall, a `.` is a crumb, and a space is bare floor. `buildVault` reads those characters and builds what they say.

Because the map is written down, the game can ask it questions. `isWall` looks up one character. `waysOut` asks `isWall` four times. `countCheese` counts the dots. None of those questions can be put to a picture, which is why the five projects before this one used an empty sky.

The map is also the thing that changes. Eating a crumb writes a space over the `.`, and everything else follows from that one line: the counter, the bar, the level ending. A learner who destroys the crumb sprite and leaves the map alone gets a game that looks perfect and never ends. That bug is in the README by name, because it is the shortest proof that the picture is not the truth.

The second lesson is that cells and pixels are two different languages. `middleOf` multiplies by `TILE`. `cellAt` divides by `TILE` and rounds down. Both come first, both are four lines, and the rack shows each one's answer back to the learner. That pair returns at projects 12, 16, 18 and 20.

The third is the split between deciding and moving, which project 8 made with a falling trooper. `startStep` asks the map whether the next cell is free and never moves anybody. `moveThing` slides a thing towards the cell it is aiming at and knows nothing about walls. Walls are what make that split obvious rather than tidy.

**Movement is cell to cell, not pixel by pixel.** The mouse always heads for one neighbouring cell and glides there. A step is allowed or refused before it begins, so the whole of collision is one `if` around one lookup. Pushing a box out of a wall after it has entered one is a different lesson, and the tank game at project 16 is where it belongs.

The cats cost one small function. A cat is the same shape of object as the mouse, so the learner's own `startStep` and `moveThing` move it. Only the chooser differs. `chooseCatWay` throws away the way the cat came from and picks one of the rest at random. An enemy that hunts on purpose waits for project 23.

Lives and levels are given rather than asked for, because project 10 made him write both. All nine stubs are about the map.

We left these out on purpose: a world larger than the screen, generated levels, saved scores, a map the player can edit, and a route found around walls. All five are later projects. Named in the README as good things to try next: a fourth vault, a crumb worth more, a mouse hole, a cat that closes the gap, and a second thing to collect.

### 12. Cave Flyer

A little mining ship in a long cave. It is the first world bigger than the window.

- World coordinates and screen coordinates
- A camera that follows the player
- Keeping the camera inside the world
- Drawing only what the window can see
- Gravity and thrust
- Collision with terrain

The cave is 72 cells by 18. The window shows 16 by 12. So every picture in the game has two positions: where it lives in the cave, and where it lands in the window.

The idea the project exists to teach is one line long. **Screen position is world position minus camera position.** `toScreen` is that line, and it is the first stub. Every rock, crystal and lamp reaches the window through it, so an empty `toScreen` leaves the window dark.

Phaser has a camera that does this subtraction for every sprite. This project leaves it unused on purpose, the way project 10 left the swarm to the learner. Project 13 can use Phaser's camera, and by then Simon knows what it does.

The second lesson is that a camera has edges. `aimCamera` centres the ship, and the two obvious lines show black space past the ends of the cave. Clamping `camera.x` between 0 and `WORLD_WIDTH - WIDTH` fixes it. The README names the black space as a bug to expect.

The third is culling, which means skipping the work for things the window cannot see. The cave holds about 900 pictures, and the window shows about 130. `isOnScreen` is built from `toScreen`. The rack counts the pictures drawn each frame, so the saving is a number Simon watches fall.

Gravity is project 7's line again. Thrust is the same line pointing the other way, and `Phaser.Math.Clamp` limits the result. The ship never stops on its own, and that is what makes it take practice.

Collision with terrain is `isRock`, which is project 11's `cellAt` and `isWall` in one function, fed world pixels. `shipHitsRock` asks it about the four corners of the ship's box. Four corners are enough only because the ship is smaller than a cell, and the README says so.

The best bug in the project is an `isRock` given screen pixels. It works near the start, where the camera sits at 0,0, and crashes the ship in open air further along. The README explains it by name.

The map stays hand-written, and there is only one cave. Generating the world as the game runs is project 13's lesson. Touching rock is a crash, and nothing is pushed back out of a wall. That belongs to the tank game at project 16.

Lives and the loop that builds the cave are given, because projects 10 and 11 made Simon write both.

We left these out on purpose: fuel, a second cave, a background that scrolls slower than the rock, a camera that looks ahead, and a click that marks a spot in the cave. All five are in the README as good things to try next. The last one needs `toWorld`, the reverse of `toScreen`, which the map editor at project 18 uses for every click.

### 13. Rooftop Run

A courier running across the rooftops at sunset. It is the first game that builds its own world, and the first that remembers anything after the page closes.

- Making a world just ahead of the window
- Throwing away what is behind
- A difficulty curve written as a formula
- A distance score
- Saving with `localStorage` and `JSON`

The cave at project 12 was 72 columns of characters, typed out by hand, with an end you could fly to. This game has no map at all, because there is no end to write down.

The idea the project exists to teach is that **a world with no end is made a little at a time, just out of sight.** `growTheWorld` runs once a frame. If the last obstacle is still a window ahead, it does nothing. Otherwise it puts one more down, at a distance the learner's own `nextGap` chooses. Forty calls before the run starts fill the first screen, and after that the player never catches it happening.

The second lesson is the half that gets forgotten: a game that never ends has to forget. `forgetOldObstacles` drops what is behind the window. Leave it empty and the game still plays perfectly, so the rack counts the list out loud instead. Measured in a browser, it had reached 25 by 460 metres and was still climbing, while the screen held two.

The third is the difficulty curve, and it is two formulas rather than a script. `runSpeed` adds 0.01 for every pixel run and stops at 700. `nextGap` measures the gap in seconds and turns it into pixels with that same speed. Spacing obstacles in pixels is the bug that proves the point, because a gap that is fair at 300 pixels a second is impossible at 700. The README names it.

Saving arrives last, because this is the first project where Simon wants it. A best score that disappears on a refresh is annoying in a way no explanation of `localStorage` could be. `loadRecord` and `saveRecord` are five lines together, and JSON earns its place because the record is an object rather than a number.

Phaser's camera does the subtraction Simon wrote by hand at project 12. `toScreen` is nowhere in the file, and one line of given wiring stands in for all of it. Parallax was a good thing to try at the end of project 12, and here it is given: two rows of buildings slide at a quarter and a half of the rooftop's speed.

The kinds of obstacle sit in a table, and each one carries a `from` field saying how far into a run it starts turning up. A fourth kind is one more line and no other change. That is the content-as-data idea project 18 is built on, met early and in small.

We left these out on purpose: gaps in the rooftop to fall through, a slide as well as a jump, things to collect, more than one life, and a score table shared between two computers, which is project 15. Named in the README as good things to try next: a fourth kind of obstacle, night falling as you run, a double jump, and a mark on the rooftop where your best run ended.

### 14. Cutover: many files

Rooftop Run again, cut into six files. It is the first project with no stubs, and the first that adds no gameplay at all.

- Why one file stops working
- Several `<script>` tags, in order
- What each file is responsible for
- Names shared between files
- Git: commits, history, and getting back a file you broke

The game is held still on purpose, the same way project 9 held the lookout post still. Same rules, same numbers, same art, same sounds, same stylesheet. Every difference Simon can see is a difference the split made.

Nothing is missing from the six files, and there is no answer key, because there is nothing to answer. He reads a program he wrote himself last week, in a shape he has never seen.

The idea the project exists to teach is that **a file is a job, and it owns the memory for that job.** `record.js` holds the record and is the only file that says `localStorage`. `world.js` holds the obstacle list and is the only file that makes or destroys an obstacle. A wrong best score is now 63 lines to read instead of 1203, and that number is the whole argument.

The second lesson is that the order of the script tags is a real constraint. `numbers.js` needs nobody, so it loads first. `game.js` needs everybody, so it loads last. Moving one tag breaks the page, and the README asks him to do it once.

The third is the cost of shared globals, and it gets equal billing. Two files cannot use one name, and nothing in a file says which other file a name came from. Both are in the README by name, and both are what `import` fixes at project 17. A learner who takes away only "many files are tidier" has learned the wrong half.

The rack makes the split measurable rather than a matter of taste. It counts the jobs each file does, and the counts are unequal on purpose. Measured in a browser over a 25 second run: `rack.js` 1604 jobs and `game.js` 1540, because they work every frame. `world.js` 26 and `runner.js` 24, because they work at moments. `record.js` twice a run. `numbers.js` never, because all it does is remember.

**Git is a chapter in the README, not a project.** Five commands: `git status`, `git diff`, `git add` with `git commit`, `git log --oneline`, and `git restore`. Branches, remotes and merges wait. The point is that a working program is worth a commit, and a broken file can be put back.

We left these out on purpose: `import` and `export`, npm and a bundler, which all arrive together at project 17, and any change whatsoever to the game. Named in the README as good things to try next: breaking the script order, giving two files one name, moving a function to the wrong file, and adding a seventh file for the sounds.

### 15. Cutover: client and server

Star Catch, a thirty-second catching game, and a score board that two computers share. It is the first project with two programs in it, and the first that needs a terminal to play properly.

- Why a page cannot do some things alone
- A server as a second program
- Requests and responses, as `GET` and `POST`
- `fetch`, plus `async` and `await`, taught here as the lesson
- JSON as the thing the two programs send each other
- Never trusting what arrives

Project 13 saved a best score in the browser's notebook. That notebook belongs to one browser on one machine, and nobody else can ever see it. This project is the smallest thing that genuinely needs a second program.

The idea it exists to teach is that **a server is just another program, and the two of them only ever say two things to each other.** `GET /scores` asks for the board. `POST /scores` carries a score to it. Both are the same two lines of `fetch`, and the second one has an object in the middle.

The second lesson is `await`, and it arrives because the project needs it rather than to be demonstrated. Two `await`s per function: one for the answer crossing the network, one for reading the words out of it. A missing one leaves `Promise { <pending> }` on the page, which the README names as a bug to expect.

The third is the one that only appears once strangers can talk to your program. `isGoodScore` is six lines, and it is the most serious function in the repository so far. `addScore` then stores a name and a number, and nothing else about a person.

The game is deliberately small and entirely given. Stars fall, a net catches them, gold is worth 1 and blue 3, and a round is thirty seconds so that two scores are comparable. Every idea in it was taught by projects 7 to 12.

The rack makes the conversation visible rather than described. Two lamps and a cable light up in turn, the wells name what was asked and what came back, and the raw line shows the server's exact words before anything is done with them. The terminal shows the same conversation from the other side.

The browser's own permission question earns a section. A double-clicked page counts as coming from nowhere, so every request needs the three lines in `allowTheBrowser`. Removing them breaks everything with an error that never mentions them, which is why the README asks for it to be broken once.

Six stubs, split three and three across two files, and each file carries its own answer key. The server's three come first, because the page has nothing to talk to until they exist.

We left these out on purpose: logins, two-player over the network, and real-time sync. Network multiplayer is a much larger lesson than this project. Named in the README as good things to try next: a board for today, counting the rounds, refusing an impossible score, keeping one score per person, and a second game on the same server.

The browser half still opens by double-clicking. The server runs from a terminal, and it is the one thing in the first sixteen projects that does.

### 16. Tank Duel

Two tanks in a sand yard full of concrete blocks, and two players on one keyboard. It is the first game where things move at any angle, and the last project before the tools change.

- Heading as one angle, and driving along it
- A turret that turns separately from the hull
- Stopping at walls without a grid
- Projectiles that bounce
- Health and damage
- Rounds, and a two-player duel

Every game since project 7 moved things across, down, or by a velocity nobody steered. A tank faces a way and drives that way. `stepAlong` turns an angle and a distance into a step, and after that, driving, the end of the barrel, a shell's speed and the gun sight are each one call to it.

The idea the project exists to teach is that **a thing that is not on a grid moves first, then takes back the part that hit.** The cheese vault refused a step before it began, because the mouse lived in cells. A tank lives anywhere, so `driveTank` moves across and asks `blocked`, then moves down and asks again. Each half that hit is taken back. A tank driven into a block at a slant loses only the half pointing into the block, and slides along it. That is the push-back-out-of-a-wall lesson that projects 11 and 12 held back for this one.

The second lesson is that a bounce is the same trick. `moveShell` has the shape of `driveTank`, with one extra line that turns the blocked half round. A shell off the side of a block flips `vx` and keeps `vy`, and no angle maths is written anywhere. The README puts the two functions side by side.

The third is that an angle can be built from angles. The turret turns on top of the hull, so `aimOf` is `tank.angle + tank.turret`. Hand back the turret alone and the gun stays still while the tank turns, which the README names as a bug to expect.

Health is the smallest lesson and borrows project 11's. The bars are drawn from `tank.health` on every frame, so the number is the truth and the bars are pictures. `Math.max` keeps the number off the floor, and `wrecked` is the only thing the rounds ever look at.

**Two players, not a computer opponent.** Enemy AI is project 23, and any enemy that aims at you is target selection arriving early. A second player on the same keyboard is a real opponent with no AI in it.

**Eight stubs across two files.** `tank.js` holds `stepAlong`, `turnTank`, `driveTank` and `aimOf`. `shells.js` holds `fireShell`, `moveShell`, `shellHitsTank` and `damageTank`, and each file carries its own answer key. The game is six script files, following project 14, so that project 17 has real files to connect with `import`.

Every tank and every shell is a plain object with a comment above it listing its fields, and no picture inside it. `game.js` copies the numbers onto the sprites once a frame. That keeps all eight stubs pure logic, which is what project 17 adds types to.

The map and the four-corner check are given, because projects 11 and 12 made Simon write both. A tank's box for walls is a square that never rotates. It is close enough to play, and the README says so.

We left these out on purpose: a computer opponent, a physics engine, a map the player can edit, and power-ups. Named in the README as good things to try next: a fourth arena, pushing a tank exactly to the edge of a block, crates that shells break, a repair kit, and armour that takes more damage from behind.

### 17. Cutover: TypeScript

Tank Duel again, rewritten in TypeScript. It is the first project that needs an install, and the first whose stubs are types instead of function bodies.

- What a type is, and what it catches
- Types for the tank and the shell from project 16
- Signatures, `void`, and unions like `'blue' | 'red'`
- npm, a build step, and a development server
- `import` and `export`, which the build step now allows

The game is held still, the same way projects 9 and 14 held theirs still. Same rules, same numbers, same art, same page. Every function body is given, copied from project 16's answer keys. Every difference Simon can see is one the types or the tools made.

The idea the project exists to teach is that **a type is the comment that described a thing, turned into code the computer checks.** Project 16 described a tank and a shell in comments, on purpose. Here Simon turns those comments into `type Tank` and `type Shell`, and misspelling `tank.helth` stops being a bug that shows up later somewhere else.

The second lesson is the limit, and it gets equal billing. Types check shape, not sense. An `aimOf` that hands back the turret alone is still a number. The README puts project 16's good bugs next to the mistakes types do catch.

**Six stubs, three per file.** `tank.ts` holds `type Point`, `type Tank`, and the signatures of the four tank functions. `shells.ts` holds `type Shell`, `type Hit`, and the signatures of the four shell functions. Each file carries its own answer key.

**The payoff is the error count, not the game.** Vite strips the types before the browser runs anything, so the duel plays the same with every stub empty. `vite-plugin-checker` prints the errors in the terminal and puts a count badge on the page. Measured with `tsc`: 119 errors to start, 27 after `type Tank`, and 0 when all six are done. The README prints the number to expect after each stub.

`import` and `export` fix the two costs project 14 named: names that clash between files, and names with no visible source. `tanks.html` loads one module, and its imports load the rest. Three small changes to the wiring come from modules. `blocked` takes the tank list as an input, the tanks are never `null`, and the shell list is emptied by the file that owns it.

Phaser moves from a vendored file to npm, at the same version. One of project 9's two double-click settings is gone, because the page is now served.

We left these out on purpose: tests, which start at project 18, and classes, `interface`, generics, enums and a production build. Named in the README as good things to try next: a deliberate misspelling, a third tank colour, a turn typed as `-1 | 0 | 1`, hovering to read a type, and a type for `CONTROLS`.

Every project from here on uses TypeScript.

### 18. Map editor

A surveyor's drafting table. You paint six kinds of ground onto a 20 by 15 map, name it, and save it to a server. It is the first project with tests.

- Content as data: a table that describes every kind of ground
- Map data kept apart from the pictures that show it
- Turning a map into rows of letters, and back again
- Saving and loading through a server, the same shape as project 15's
- Tests with Vitest, and writing a test before its function

Project 11 read a map written as rows of characters, and project 16 read three. This project writes them and reads them back, so every map the strategy game uses can come from here.

The idea the project exists to teach is that **what a thing is belongs in a table, not in the code.** `terrain.ts` is one table, and each line holds a terrain's letter, name, picture, colour, `walkable` and `speed`. The palette, the picture loader, the hover panel and the learner's own save and load functions all read that table. None of them names a kind of ground. A new terrain is one line and one picture, and `TerrainKey` is `keyof typeof TERRAIN`, so the type follows the table as well.

The second lesson is that the map is only data. `map.cells` holds terrain keys and nothing else. The window draws them as pictures, and the Saved map panel draws the same cells as letters, live. Paint one cell and both change. `map.ts` imports nothing but the table, which is what lets the editor, the server and the tests all use it.

The third is tests, and they answer a question Simon already has. Checking a grid function by clicking is slow. `map.test.ts` holds four finished tests and two `test.todo` stubs. He writes each test before the function it checks, so the failed count goes up at jobs 3 and 8 before it comes down. The README shows a fifteen-line `test` and `expect`, so the runner is a tool doing a job he could do himself.

**Seven function stubs and two test stubs.** In order: `makeMap`, `isInside`, the painting-outside test, `paintCell`, `countTerrain`, `mapToLines`, `terrainFor`, the round-trip test, and `linesToMap`. Measured in a throwaway copy, the checker counts 7 errors at the start and 0 at the end, and Vitest goes from 4 failed and 2 todo to 6 passed. The README prints both counts after every job.

The server is given in full, because project 15 taught every idea in it. It keeps one JSON file per map, one row of letters per line, so a saved map is readable in an editor. It calls the learner's `linesToMap` before it writes anything, so one function guards all three programs. Node runs `server.ts` directly with its own type stripping, which is why every import in the project ends in `.ts`.

The page names the next empty function by trying each one on a tiny map of its own when it loads. The `#demo` hashes stay retired. With modules, a stand-in for an empty function would sit in a file the learner can open, and it would give the answer away.

We left these out on purpose: undo, flood fill, which is project 20's frontier, maps of other sizes, a map larger than the window, deleting maps, and units or buildings on the map. Named in the README as good things to try next: snow, a bridge, a test for `countTerrain`, a broken map file, and a border function written test first.

### 19. Unit selection

A field command post. Six blue tanks wait on a map from the editor. You click one to pick it, drag a box round several, and click the ground to send them.

- Finding the thing under the mouse
- Picking one unit, and picking every unit inside a box
- A box dragged in any direction
- One order to a group, turned into one goal per unit
- Driving at the speed the terrain table gives
- Tests, a second time

The idea the project exists to teach is that **a click never moves a tank, it only changes what the tank remembers.** Picking sets `tank.selected`. An order sets `goalX`, `goalY` and `moving`. Only `driveTank`, called every frame, moves anything. Every ring, corner, cross and squad lamp is drawn from those fields. It is project 8's split between deciding and moving, with the mouse doing the deciding.

The second lesson is that a group order is one goal per unit. Six tanks sent to one spot would stack on it. `orderMove` walks the picked list and gives each tank its own spot from the given `parkingSpot`, so the squad arrives as a block.

Project 18's table starts to matter. A step is `TANK_SPEED` times `speedAt` the tank times the seconds, so road is fast and forest is slow. `canDrive` stops a tank at water, rock or the edge. Driving is a straight line, so a tank sent across River Crossing stops at the river and its squad row turns red. That dead end is on screen on purpose, because it is the question project 20 answers.

**Eight function stubs and two test stubs.** In order: `tankAt`, `selectOnly`, `selectedTanks`, the dragged-backwards test, `boxFrom`, `isInBox`, `selectInBox`, `orderMove`, the stops-at-water test, and `driveTank`. Measured in a throwaway copy, the checker counts 8 errors at the start and 0 at the end, and Vitest goes from 4 failed and 2 todo to 6 passed. `driveTank` returns the union `'still' | 'driving' | 'arrived' | 'blocked'`, which the squad card shows.

**Tests here, not only at 18 and 20.** Selection is pure logic that is slow to check by clicking, and a box dragged backwards is exactly the case a hand forgets to try.

**No server.** The maps are copies of project 18's files, read by Vite's `import.meta.glob`. A map painted in the editor turns up when its file is copied into `19-units/maps`.

The page tells a click from a drag by distance: 6 pixels. Project 18's map functions are given in `map.ts`, copied from its answer key.

We left these out on purpose: pathfinding, which is project 20, tanks that block each other, checking a tank's whole box against terrain, shift-click, control groups and enemies. Named in the README as good things to try next: shift-click, pick all with A, a race on Sandy Island, faster roads from the table, and a map painted in the editor.

### 20. Pathfinding

A scout's route finder. The six tanks from project 19 wait on a map again. You pick some and click the ground, and each tank searches for a route round the rock and the water before it drives.

- The neighbours of a cell
- A frontier of cells still to try
- Remembering where each cell came from, and reading the route back
- Breadth-first search, then A\*
- Why a route can fail
- Tests, a third time

Project 19 left the tanks stuck at the river on purpose. This project answers that dead end. It is the hardest idea in the strategy game, and also the easiest to test.

The idea the project exists to teach is that **a search is a frontier and one repeated step.** `searchStep` takes a cell out of the frontier and stops if it is the goal. Otherwise it gives every walkable neighbour not found yet a step count and the cell it came from, and puts it in the frontier. An empty frontier proves no route exists. The first tank's search plays on the map at 45 cells a second, with its step count on every found cell and a blue square on every frontier cell.

The second lesson is that **breadth-first and A\* differ in one choice.** The given `takeNext` takes index 0, the queue from project 2, or asks the learner's `bestIndex` for the cell with the smallest steps plus guess. Two buttons on the Search card replay the same search both ways, and the Looked at well counts the difference.

The third is that a failed search costs the most. Measured from cell 4, 10 with the answer key: breadth-first looks at 119 cells and A\* at 48 to reach 2, 1 on River Crossing. A\* heads into the rock cup on Horseshoe Rocks, a map made for this project, and looks at 198 cells to breadth-first's 263. With no route across River Crossing, both look at all 123 cells the tank could reach.

**Seven function stubs and two test stubs.** In order: `neighbours`, `startSearch`, `searchStep`, `routeBack`, the no-bridge test, `findRoute`, `guess`, the A\*-is-cheaper test, and `bestIndex`. Measured in a throwaway copy, the checker counts 7 errors at the start and 0 at the end, and Vitest goes from 4 failed and 2 todo to 6 passed.

**Ties go to fewer steps.** On equal totals, `bestIndex` takes the cell with fewer steps. Measured over 18,000 random grids, letting the first-found cell win ties gave 169 routes longer than breadth-first's, and this rule gave none. It keeps `searchStep` simple, because a found cell never needs its steps replaced.

The search counts steps and ignores terrain speed. The tanks still drive at the table's speed. Picking, boxes and orders are given, copied from project 19's answer key, and `driveTank` is given, rewritten to follow a route one cell at a time.

We left these out on purpose: diagonal moves, terrain cost, tanks that block each other, a priority queue, and smoothing the route. Named in the README as good things to try next: corners, forest costing more, painting a trap for A\*, the route length in the squad list, and a bridge on River Crossing.

## The sequence

| # | Project | The new idea |
|---|---|---|
| 21 | Resources | Production over time |
| 22 | Production queue | Build times and prerequisites |
| 23 | Enemy AI | Choosing a target, patrolling, and attacking |
| 24 | Small strategy game | All of it, kept small |

### 21. Resources

This project teaches workers, resources, production over time, counters, and progress bars.

### 22. Building and production queue

This project teaches build times, queues, prerequisites, enabled and disabled buttons, and an interface driven by state.

### 23. Enemy AI

This project teaches distance checks, target selection, patrol states, and attack states. It uses the pathfinding from project 20.

### 24. Small strategy game

Do not try to build all of Red Alert. The first strategy game contains:

- 1 small map
- 2 teams
- 2 unit types
- 1 resource
- 1 building
- 1 production queue
- 1 win condition

That game holds every important strategy-game idea. It needs no commercial engine.

## The three cutovers

The cutovers are ordered by cost. Each one adds a single new idea, and the free one comes first.

| Cutover | Project | It brings | It costs |
|---|---|---|---|
| Many files | 14 | Several `<script>` tags, and git | Nothing. The page still double-clicks |
| Client and server | 15 | A terminal, a second program, `await` | The server half stops being a webpage |
| TypeScript | 17 | Types, npm, a build step, `import` | The double-click rule ends |

Two of the three remake a finished project. That is deliberate. Simon can see what changed, because nothing else changed.

## Testing

Testing starts after TypeScript, and it stays small.

**Runner: Vitest.** It runs TypeScript with no configuration, and npm already arrived at project 17. Put a fifteen-line `expect` helper in the README, so Simon can see what a runner does. Do not make that helper a project. Projects 9 and 17 already taught him to compare hand-written code with a tool.

**Where: projects 18, 19 and 20.** All three are pure logic, and checking that logic by clicking is slow. The tests answer a question Simon already has. Tests in every later project are optional.

Project 17 is the wrong place, because it already introduces types.

**What we test: pure logic only.** Test functions that take values and return values. Do not test the DOM, Phaser, or drawing. This avoids a second round of new tools. It also rewards keeping the game rules separate from the drawing code.

**Shape of a project with tests.** It has an eighth file, `NN.test.ts`. That file holds three or four finished tests and two stubbed ones. The test file carries its own answer key at its own bottom. Opening one file never gives away the other.

Simon writes the two test stubs before he writes the functions they test. The hint at the implementation stub says so:

```text
Write its test first — see NN.test.ts
```

## What we cut, and why

**Tic-tac-toe.** Battleship already teaches board state, turn management, win detection, and a computer opponent. A tic-tac-toe project about minimax would earn a place, but that project belongs much later.

**p5.js.** See project 9. Simon learns one library, once, and it lasts to the end of the list.

**A testing project.** Tests attach to the two projects that need them instead.

**An async project.** We teach `async` inside project 15, where it appears for a reason.
