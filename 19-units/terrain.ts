/* =====================================================================
   terrain.ts. File 2 of 6.

   One job: the kinds of ground. It is project 18's table, copied here
   line for line. Nothing about it changed.

   What changed is who reads it. In the map editor, `walkable` and
   `speed` were only shown in a panel. Here the tanks obey them. A tank
   on road drives faster than a tank on sand, and no tank drives into
   water or rock.
   ===================================================================== */


/* Everything the program knows about one kind of ground. */
export type Terrain = {
  letter: string;      // how this ground is written in a saved map. One character
  name: string;        // what the page calls it
  picture: string;     // the picture it is drawn with, in the assets folder
  colour: string;      // its colour
  walkable: boolean;   // can a tank drive on it?
  speed: number;       // how fast a tank drives on it. 1 is normal speed
};

/* The table. Read `18-editor/terrain.ts` again for the full story. */
export const TERRAIN = {
  grass:  { letter: '.', name: 'Grass',  picture: 'grass.png',  colour: '#7aa34a', walkable: true,  speed: 1 },
  road:   { letter: '=', name: 'Road',   picture: 'road.png',   colour: '#b9a27a', walkable: true,  speed: 1.5 },
  sand:   { letter: ':', name: 'Sand',   picture: 'sand.png',   colour: '#e3c98a', walkable: true,  speed: 0.6 },
  forest: { letter: 'T', name: 'Forest', picture: 'forest.png', colour: '#3f6b35', walkable: true,  speed: 0.4 },
  water:  { letter: '~', name: 'Water',  picture: 'water.png',  colour: '#3f86b8', walkable: false, speed: 0 },
  rock:   { letter: '#', name: 'Rock',   picture: 'rock.png',   colour: '#8b8781', walkable: false, speed: 0 }
} satisfies Record<string, Terrain>;

/* The name of one kind of ground: 'grass', 'road', 'sand' and so on. */
export type TerrainKey = keyof typeof TERRAIN;

/* Every key, in the order the table lists them. */
export const TERRAIN_KEYS = Object.keys(TERRAIN) as TerrainKey[];

/* The ground a brand new map is covered in. */
export const BLANK: TerrainKey = 'grass';
