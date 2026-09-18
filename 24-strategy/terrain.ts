/* =====================================================================
   terrain.ts. File 2 of 12.

   One job: the kinds of ground. It is project 21's table, with one
   number changed.

   Four of its columns are at work in this project, and every one of
   them was earning its keep in an earlier one:

       walkable   rock and water stop a unit, so a route has to go
                    round them. That is project 20's pathfinder
       speed      forest is slow and road is fast
       holds      how much ore one fresh cell of this ground starts
                    with. Project 21's ore run reads it
       picture    what the cell is drawn with

   The number is `holds` on the ore line, and project 21 had it at 240.
   Two armies dig this field instead of one, and a fresh cell has to pay
   for a war as well as a mine, so it holds 480 here.

   That is the whole of the change. One number in one table moved the
   length of a game from three minutes to about six, and no other file
   knows anything about it.

   Seven lines of table, and no other file in the project ever names a
   kind of ground. A map you paint in project 18's editor works here
   with no extra work at all.
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
  ore:    { letter: '*', name: 'Ore',    picture: 'ore.png',    colour: '#c98a2f', walkable: true,  speed: 0.8, holds: 480 },
  water:  { letter: '~', name: 'Water',  picture: 'water.png',  colour: '#3f86b8', walkable: false, speed: 0,   holds: 0 },
  rock:   { letter: '#', name: 'Rock',   picture: 'rock.png',   colour: '#8b8781', walkable: false, speed: 0,   holds: 0 }
} satisfies Record<string, Terrain>;

/* The name of one kind of ground: 'grass', 'road', 'ore' and so on. */
export type TerrainKey = keyof typeof TERRAIN;

/* Every key, in the order the table lists them. */
export const TERRAIN_KEYS = Object.keys(TERRAIN) as TerrainKey[];

/* The ground a brand new map is covered in. */
export const BLANK: TerrainKey = 'grass';
