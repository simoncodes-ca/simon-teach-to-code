# Coding Roadmap

This roadmap leads from the existing calculator and elevator projects toward a small Red Alert-style strategy game.

The sequence moves from webpage programs to grid-based games, then to Canvas, animation, physics, and reusable game systems.

## Current projects

### 1. Calculator

The calculator teaches:

- Variables and data types
- Functions
- Conditionals
- Arrays
- Button events
- Updating the page with JavaScript
- Debugging with `console.log`

### 2. Elevator

The elevator teaches:

- State machines
- Queues
- Timers
- Animation
- Consistent program state
- State transitions
- Smooth movement with `requestAnimationFrame`

### 3. Hangman

Hangman remains a simple webpage while adding richer rules.

It teaches:

- Strings and string methods
- Arrays
- Loops
- Boolean values
- Input validation
- Invalid actions
- Derived display state

Possible extensions include categories, hints, difficulty levels, and keyboard input.

### 4. Blackjack

Blackjack introduces objects and rule modeling without requiring a visual game board.

It teaches:

- Objects representing things
- Arrays of objects
- Creating and shuffling a deck
- Randomness
- Functions that calculate values
- Rules with several cases
- State transitions

The phases are `dealing`, `playerTurn`, `dealerTurn`, and `finished`.

Deferred on purpose: betting, blackjack paying 3:2, splitting, doubling down, insurance, and a multi-deck shoe.

## Recommended project sequence

### 5. Battleship

Battleship is the first important map-based project.

It teaches:

- Two-dimensional arrays
- Rows and columns
- Coordinates
- Nested loops
- Random placement
- Overlap checking
- Turn-taking
- Hidden information
- Game phases

Recommended stages:

1. Display an empty grid.
2. Let the player choose a square.
3. Place one ship manually.
4. Detect hits and misses.
5. Add several ships.
6. Add a computer opponent.
7. Randomly place the computer's ships.
8. Add sinking and win detection.

Battleship introduces maps made from cells. Those cells later become terrain, buildings, units, resources, and movement areas.

### 6. Paint app with undo

The paint app introduces the Canvas API before real-time games begin.

It teaches:

- Canvas drawing
- Pointer events
- Screen and canvas coordinates
- Drawing lines and shapes
- Separating input from rendering
- History stacks
- Undo and redo
- Saving and restoring state

Recommended stages:

1. Draw a dot.
2. Draw while dragging.
3. Change brush size.
4. Change colour.
5. Add an eraser.
6. Clear the canvas.
7. Add undo.
8. Add redo.
9. Save the drawing as an image.

Canvas is the bridge between ordinary webpage programs and game graphics.

### 7. Balloon shooting game

Balloon shooting should be the first fully animated game.

It teaches:

- Game loops
- Time-based movement
- Velocity
- Gravity
- Angles
- Trigonometry
- Collision detection
- Spawning and removing objects
- Score and lives
- Restarting a game

Recommended stages:

1. Draw one balloon.
2. Make the balloon move.
3. Add a projectile.
4. Aim with the mouse.
5. Detect a hit.
6. Add multiple balloons.
7. Add gravity.
8. Add score, lives, and a restart state.

The game should use elapsed time rather than moving a fixed number of pixels per frame.

### 8. Parachuter game

The parachuter game adds several moving entities with different behaviours.

The entities can include an airplane, paratroopers, a turret, bullets, and explosions.

It teaches:

- Lists of entities
- Timed spawning
- Different movement rules
- Ground and landing detection
- Counters
- Simultaneous animations
- Game-over conditions
- Separation of updating and drawing
- Sprites as data: an image, position, size, and movement state
- Drawing the same sprite data in different states

A sprite does not need to be a library object yet. Start with plain objects and a small `drawSprite` function. A parachuter can have an image, `x`, `y`, width, height, velocity, and a state such as `falling` or `landed`.

A possible rule is that 3 paratroopers landing near the turret destroy it.

Recommended structure:

```text
update all objects
check collisions
remove finished objects
draw all sprites
check whether the game has ended
```

The game should make the sprite concept visible before introducing a game library: the same data should drive movement, collision checks, and drawing.

### 9. Game library remake

After the parachuter game, remake the balloon or parachuter game with a game library. This is a comparison project, not a larger game: the child should be able to point to what the library replaces.

It teaches:

- Library timing and the game loop
- Library sprites and asset handling
- Scenes or game states
- Comparing manual code with library code
- Recognising which abstractions are helpful and which are hidden complexity

Use p5.js for the first remake because it keeps the Canvas model visible while removing routine browser plumbing. Phaser is a later option when scenes, cameras, and asset management become the lesson.

The remake should use an existing small game. Do not introduce the library and a larger game at the same time.

### 10. Aliens game

The aliens game develops a reusable small game engine.

It teaches:

- Keyboard input
- Player movement
- Firing
- Multiple enemy objects
- Enemy formations
- Bullets and collisions
- Waves
- Lives and respawning
- Difficulty progression

Recommended stages:

1. Move a player left and right.
2. Fire one bullet.
3. Add one alien.
4. Destroy the alien.
5. Add a row of aliens.
6. Move the aliens as a group.
7. Add alien bullets.
8. Add waves.
9. Add score, lives, and increasing difficulty.

### 11. Tic-tac-toe

Tic-tac-toe is a short state-focused project between animated games. It teaches board state, turn management, win detection, and simple computer decisions.

### 12. Maze game

The maze game teaches grid maps, walls, movement restrictions, tile collision, and maps represented as data.

### 13. 2D helicopter game

The helicopter game adds a moving world and continuous physics.

It teaches:

- Gravity and thrust
- Scrolling
- Camera coordinates
- World coordinates
- Procedurally generated obstacles
- Collision with terrain
- Difficulty curves
- Endless-game design
- High scores and restart flow

A key relationship is:

```text
screen position = world position - camera position
```

Recommended stages:

1. Move the helicopter up and down.
2. Add gravity.
3. Add walls.
4. Make the world scroll.
5. Generate obstacles.
6. Detect crashes.
7. Increase speed gradually.
8. Add a distance score.
9. Add fuel, collectibles, or enemies.

## When to introduce a game library

Introduce the first game library after the parachuter game, once the child has built at least two manual Canvas games and has seen sprites represented as plain data.

The child should first understand what the library replaces. Use the library to remake the balloon or parachuter game before using it for a larger new game.

A useful progression is:

```text
Calculator and elevator
  DOM and browser events

Paint app
  Canvas and pointer events

Balloon shooting
  Manual animation loop and physics

Parachuter
  Manual sprites, entities, and collisions

Game library remake
  Compare library timing, sprites, and asset handling

Aliens and later games
  Build on the library once the comparison is understood
```

A library remake makes the library's value visible. The child can compare the manual version with the library version instead of treating the library as magic.

For browser-based JavaScript, p5.js is a gentle first library. Phaser is a stronger later choice for sprites, scenes, cameras, and asset handling once the student needs a larger game structure.

## Projects needed before a Red Alert-style game

The listed projects teach general game programming. A strategy game also needs maps, units, resources, buildings, and simple artificial intelligence.

### 14. Top-down tank game

The tank game teaches movement, aiming, projectiles, obstacles, health, and damage.

This is the most direct bridge to an RTS game.

### 15. Map editor

The map editor teaches grid editing, terrain types, saving maps, loading maps, and separating map data from presentation.

### 16. Unit selection game

The unit selection game teaches selecting one unit, selecting multiple units, rectangle selection, and click-to-move commands.

### 17. Resource gathering game

The resource game teaches workers, resources, production over time, counters, and progress bars.

### 18. Building and production queue

The production game teaches build times, queues, prerequisites, enabled and disabled buttons, and state-driven interfaces.

### 19. Simple enemy AI

The enemy AI project teaches distance checks, target selection, patrol states, attack states, and basic pathfinding.

## Small RTS target

Do not begin by trying to build all of Red Alert.

The first strategy game should contain:

- 1 small map
- 2 teams
- 2 unit types
- 1 resource
- 1 building
- 1 production queue
- 1 win condition

That small game contains the essential strategy-game ideas without requiring a complete commercial game engine.
