/* =====================================================================
   terrain.ts. File 2 of 8.

   One job: the kinds of ground. It is project 18's table, with two
   changes. Both of them are what that table was built for.

   A new line: `ore`. Project 18 promised that a new kind of ground is
   one line and one picture. This is the first project to take it up.
   The palette, the map files and the pictures all follow the table, so
   nothing else had to change.

   A new column: `holds`. It says how much ore one fresh cell of that
   ground starts with. Ore ground holds 240. Every other ground holds
   nothing, so its number is 0.

   `holds` is what the ore field is built from. That is why no file
   outside this one ever names a kind of ground.
   ===================================================================== */


/* Everything the program knows about one kind of ground. */
export type Terrain = {
  letter: string;      // how this ground is written in a saved map. One character
  name: string;        // what the page calls it
  picture: string;     // the picture it is drawn with, in the assets folder
  colour: string;      // its colour
  walkable: boolean;   // can a harvester drive on it?
  speed: number;       // how fast it drives on it. 1 is normal speed
  holds: number;       // how much ore one fresh cell of it starts with
};

/* The table. Read `18-editor/terrain.ts` again for the full story. */
export const TERRAIN = {
  grass:  { letter: '.', name: 'Grass',  picture: 'grass.png',  colour: '#7aa34a', walkable: true,  speed: 1,   holds: 0 },
  road:   { letter: '=', name: 'Road',   picture: 'road.png',   colour: '#b9a27a', walkable: true,  speed: 1.5, holds: 0 },
  sand:   { letter: ':', name: 'Sand',   picture: 'sand.png',   colour: '#e3c98a', walkable: true,  speed: 0.6, holds: 0 },
  forest: { letter: 'T', name: 'Forest', picture: 'forest.png', colour: '#3f6b35', walkable: true,  speed: 0.4, holds: 0 },
  ore:    { letter: '*', name: 'Ore',    picture: 'ore.png',    colour: '#c98a2f', walkable: true,  speed: 0.8, holds: 240 },
  water:  { letter: '~', name: 'Water',  picture: 'water.png',  colour: '#3f86b8', walkable: false, speed: 0,   holds: 0 },
  rock:   { letter: '#', name: 'Rock',   picture: 'rock.png',   colour: '#8b8781', walkable: false, speed: 0,   holds: 0 }
} satisfies Record<string, Terrain>;

/* The name of one kind of ground: 'grass', 'road', 'ore' and so on. */
export type TerrainKey = keyof typeof TERRAIN;

/* Every key, in the order the table lists them. */
export const TERRAIN_KEYS = Object.keys(TERRAIN) as TerrainKey[];

/* The ground a brand new map is covered in. */
export const BLANK: TerrainKey = 'grass';
