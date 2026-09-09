# Coding Roadmap

This roadmap runs from the eight finished projects to a small Red Alert-style strategy game.

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

## The sequence

| # | Project | The new idea |
|---|---|---|
| 9 | Phaser remake | What a game library replaces |
| 10 | Aliens | A game built on the library |
| 11 | Maze | Tile collision |
| 12 | Scrolling world | Camera and world coordinates |
| 13 | Endless runner | Generated obstacles, and saved high scores |
| 14 | **Cutover: many files** | One program in several files, and git |
| 15 | **Cutover: client and server** | Two programs that talk, and `await` |
| 16 | Tank game | The last step before a strategy game |
| 17 | **Cutover: TypeScript** | Types, npm, and a build step |
| 18 | Map editor | Content as data, and the first tests |
| 19 | Unit selection | Selecting units and commanding them |
| 20 | Pathfinding | Finding a route around walls |
| 21 | Resources | Production over time |
| 22 | Production queue | Build times and prerequisites |
| 23 | Enemy AI | Choosing a target, patrolling, and attacking |
| 24 | Small strategy game | All of it, kept small |

### 9. Phaser remake

Remake the parachuter game with Phaser. This project compares two versions of one game. Simon should be able to point at each part the library replaced.

- Library timing and the game loop
- Library sprites and asset handling
- Scenes
- Comparing hand-written code with library code
- Telling a helpful abstraction from hidden complexity

**Use Phaser, not p5.** p5 removes browser plumbing that Simon will have written twice by project 9. That comparison is real, but it is small. He would then leave p5 as soon as he needs scenes, cameras, and asset loading. Phaser means he learns one library instead of two.

Keep a copy of `phaser.min.js` next to the HTML file. The library must not force the build step to arrive early. The build step arrives at project 17.

Remake a game Simon has already finished. Never introduce a library and a new game at the same time.

### 10. Aliens game

This is the first new game built on Phaser.

- Keyboard input
- Player movement and firing
- Several enemies, and enemy formations
- Bullets and collisions
- Waves
- Lives and respawning
- Rising difficulty

Stages:

1. Move a player left and right.
2. Fire one bullet.
3. Add one alien.
4. Destroy the alien.
5. Add a row of aliens.
6. Move the aliens as a group.
7. Add alien bullets.
8. Add waves.
9. Add score, lives, and rising difficulty.

### 11. Maze game

The maze teaches grid maps, walls, movement limits, tile collision, and a map stored as data.

Tile collision is what the tank game needs at project 16. The map-as-data idea returns at project 18.

### 12. Scrolling world

The world is larger than the screen.

- Gravity and thrust
- Scrolling
- World coordinates and camera coordinates
- Collision with terrain

Memorise this relationship:

```text
screen position = world position - camera position
```

Stages:

1. Move the vehicle up and down.
2. Add gravity.
3. Add walls.
4. Make the world scroll.
5. Detect crashes.

### 13. Endless runner

The same world now generates itself and never ends. We split this from project 12 because generation and difficulty are their own lesson.

- Generating obstacles as the game runs
- Difficulty curves
- Designing a game with no end
- Saving data with `localStorage` and `JSON`
- High scores and the restart flow

Stages:

1. Generate obstacles ahead of the camera.
2. Raise the speed gradually.
3. Add a distance score.
4. Save the best score, so it survives a refresh.
5. Add fuel, collectibles, or enemies.

A high score that survives a refresh is the first time Simon wants to save data. Every earlier project would have saved data because we told him to.

### 14. Cutover: many files

Split a game Simon has already written. Add no new gameplay. The split is the only thing to think about.

- Why one file stops working
- Several `<script>` tags, in order
- What each file is responsible for
- Names shared between files

Every project up to here uses one `.js` file. Every project from here on uses several.

`file://` blocks ES modules, so this project uses `<script>` tags and shared globals. It does not use `import`. That limit ends at project 17.

**Git belongs here too.** Put it in the README as a short chapter, not as a project. Cover commits, history, and getting back a file you broke. Simon will have worked inside a git repository for thirteen projects without hearing about it.

This project has no stubs. `AGENTS.md` should record it as the one exception.

### 15. Cutover: client and server

Build a shared high-score table. It holds Simon's scores and yours, on one list, from two computers.

- Why a page cannot do some things alone
- A server as a second program
- Requests and responses
- `fetch`, plus **`async` and `await`**, taught here as the lesson
- JSON as the thing the two programs send each other

This is the smallest thing that truly needs a server. It is one request each way.

We leave these out on purpose: logins, two-player over the network, and real-time sync. Network multiplayer is a much larger lesson than this project.

The browser half still opens by double-clicking. The server runs from a terminal.

### 16. Tank game

The tank game teaches top-down movement, aiming, projectiles, obstacles, health, and damage.

It is the project closest to a strategy game. It is also the last project before the tools change.

### 17. Cutover: TypeScript

Rewrite the tank game with types. This works the same way as project 9. Remake something finished, so the new idea is the only thing that changed.

- What a type is, and what it catches
- Adding types to the entities from project 16
- npm, a build step, and a development server
- `import` and `export`, which the build step now allows

Types arrive here, before the strategy projects. Those projects have many kinds of entity to keep straight. Types help across all of them, not only at the end.

Every project from here on uses TypeScript.

### 18. Map editor

- Grid editing and terrain types
- Saving and loading maps through the server from project 15
- Map data kept separate from how the map is drawn
- **Content as data**: terrain types, and later unit stats, live in a table instead of in code

Content as data is the idea the whole strategy game depends on.

The first tests live here. See "Testing" below.

### 19. Unit selection

This project teaches selecting one unit, selecting several units, rectangle selection, and click-to-move commands.

### 20. Pathfinding

Find a route from one cell to another, around walls.

- The neighbours of a cell
- A frontier of cells still to try
- Breadth-first search, then A\*
- Why a route can fail

This is the hardest idea in the strategy game. It is also the easiest to test, so **the second set of tests lives here**.

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

**Where: projects 18 and 20.** Both are pure grid logic, and checking that logic by clicking is slow. The tests answer a question Simon already has. Tests in every later project are optional.

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
