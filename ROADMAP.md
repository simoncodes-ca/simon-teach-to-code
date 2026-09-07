# Coding Roadmap

This roadmap runs from the four finished projects to a small Red Alert-style strategy game.

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

## The sequence

| # | Project | The new idea |
|---|---|---|
| 5 | Battleship | Grids as two-dimensional arrays |
| 6 | Paint app | Canvas and pointer events |
| 7 | Balloon shooting | A game loop and time-based movement |
| 8 | Parachuter | Many entities, and sprites as plain data |
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

### 5. Battleship

Battleship is the first project with a map. It is still an ordinary webpage.

- Two-dimensional arrays
- Rows, columns, and coordinates
- Nested loops
- Random placement
- Overlap checking
- Turn-taking
- Hidden information
- Game phases

Stages:

1. Display an empty grid.
2. Let the player choose a square.
3. Place one ship by hand.
4. Detect hits and misses.
5. Add several ships.
6. Add a computer opponent that picks a square.
7. Place the computer's ships at random.
8. Add sinking and win detection.

Battleship teaches maps made of cells. Later projects turn those cells into terrain, buildings, units, resources, and movement areas.

### 6. Paint app with undo

The paint app teaches Canvas before anything moves on its own.

- Canvas drawing
- Pointer events
- Screen coordinates and canvas coordinates
- Drawing lines and shapes
- Keeping input separate from drawing
- History stacks
- Undo and redo

Stages:

1. Draw a dot.
2. Draw while dragging.
3. Change the brush size.
4. Change the colour.
5. Add an eraser.
6. Clear the canvas.
7. Add undo.
8. Add redo.
9. Save the drawing as an image.

Canvas connects webpage programs to game graphics.

### 7. Balloon shooting game

This is the first game that animates on its own.

- Game loops
- Time-based movement
- Velocity and gravity
- Angles and trigonometry
- Collision detection
- Adding and removing objects
- Score, lives, and restarting

Stages:

1. Draw one balloon.
2. Make the balloon move.
3. Add a projectile.
4. Aim with the mouse.
5. Detect a hit.
6. Add several balloons.
7. Add gravity.
8. Add score, lives, and a restart state.

The game moves things by elapsed time. It does not move things a fixed number of pixels per frame.

### 8. Parachuter game

Several things move at once, and each one moves differently. The game has an airplane, paratroopers, a turret, bullets, and explosions.

- Lists of entities
- Timed spawning
- Different movement rules
- Ground and landing detection
- Several animations at the same time
- Game-over conditions
- Keeping updating separate from drawing
- Sprites as data: an image, a position, a size, and a movement state

A sprite is still a plain object. It has `x`, `y`, a width, a height, a velocity, and a state such as `falling` or `landed`. A small `drawSprite` function draws it.

One possible rule: three paratroopers that land near the turret destroy it.

The loop:

```text
update all objects
check collisions
remove finished objects
draw all sprites
check whether the game has ended
```

This project must make the sprite idea visible before a library hides it. The same data drives movement, collision checks, and drawing.

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
