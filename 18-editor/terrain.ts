/* =====================================================================
   terrain.ts. File 2 of 5.

   One job: the kinds of ground. This file is a table, and nothing
   else. Nothing in it runs while you paint.

   Read this file first, because it is the big idea of the whole
   project. Every other file asks this table what a kind of ground is
   called, what it looks like, how it is written in a saved map, and
   whether a tank can drive on it. None of them has that written down
   anywhere else.

   So a new kind of ground is one new line in the table. The palette
   gets a new button, the loader loads a new picture, and saved maps
   learn a new letter. No other file changes.
   ===================================================================== */


/* Everything the editor knows about one kind of ground. */
export type Terrain = {
  letter: string;      // how this ground is written in a saved map. One character
  name: string;        // what the page calls it
  picture: string;     // the picture it is drawn with, in the assets folder
  colour: string;      // its colour, for the edge of its palette button
  walkable: boolean;   // can a tank drive on it?
  speed: number;       // how fast a tank drives on it. 1 is normal speed
};

/* The table.

   Each line is one kind of ground. The word at the start of the line,
   like `grass`, is its key. The key is how the rest of the program
   names this ground.

   `satisfies Record<string, Terrain>` at the bottom asks the computer
   to check every line. Leave out `speed` on one line, or spell
   `walkable` wrong, and it tells you which line.

   Nothing reads `walkable` or `speed` to move anything yet. The hover
   panel shows them. The units in project 19 and the route finder in
   project 20 will read them from this same table. */
export const TERRAIN = {
  grass:  { letter: '.', name: 'Grass',  picture: 'grass.png',  colour: '#7aa34a', walkable: true,  speed: 1 },
  road:   { letter: '=', name: 'Road',   picture: 'road.png',   colour: '#b9a27a', walkable: true,  speed: 1.5 },
  sand:   { letter: ':', name: 'Sand',   picture: 'sand.png',   colour: '#e3c98a', walkable: true,  speed: 0.6 },
  forest: { letter: 'T', name: 'Forest', picture: 'forest.png', colour: '#3f6b35', walkable: true,  speed: 0.4 },
  water:  { letter: '~', name: 'Water',  picture: 'water.png',  colour: '#3f86b8', walkable: false, speed: 0 },
  rock:   { letter: '#', name: 'Rock',   picture: 'rock.png',   colour: '#8b8781', walkable: false, speed: 0 }
} satisfies Record<string, Terrain>;

/* The name of one kind of ground: 'grass', 'road', 'sand' and so on.

   Project 17 wrote a type like this by hand: 'blue' | 'red'. This one
   is worked out from the table instead. `keyof typeof TERRAIN` means
   "the keys of the TERRAIN table". Add a line to the table, and the
   new key is allowed everywhere straight away. */
export type TerrainKey = keyof typeof TERRAIN;

/* Every key, in the order the table lists them. The palette uses this
   order for its buttons.

   `Object.keys` hands back plain strings, so `as` tells the computer
   they are really keys of the table. They are, because they came from
   the table itself. */
export const TERRAIN_KEYS = Object.keys(TERRAIN) as TerrainKey[];

/* The ground a brand new map is covered in. */
export const BLANK: TerrainKey = 'grass';
