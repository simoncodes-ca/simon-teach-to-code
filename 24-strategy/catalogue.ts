/* =====================================================================
   catalogue.ts. File 5 of 12.

   One job: the things a yard can build, and the order the enemy buys
   them in. It is finished.

   The table is project 22's, with one word changed in the tank's note.
   Both sides build from it. Your Build card draws a button for every
   line, and the enemy commander reads the same five lines.

   What is new here is the second list at the bottom of the file. It is
   the enemy's shopping list, and your `wantNext` walks it.
   ===================================================================== */


/* The two kinds of thing.

       'building'   built once, and then it is there for good. What it
                      does is unlock the next thing in the table
       'unit'       built as often as you like. It rolls out of the
                      yard and drives onto the map */
export type ItemKind = 'building' | 'unit';

/* Everything the program knows about one thing you can build. */
export type Item = {
  name: string;        // what the page calls it
  kind: ItemKind;      // 'building' or 'unit'
  cost: number;        // credits it takes off the refinery
  seconds: number;     // how long it takes to build
  needs: string | null;  // the key of the thing you must build first, or null
  tag: string;         // the three letters drawn on it when it is on the map
  colour: string;      // its colour on the cards and on the map
  note: string;        // one line the card says about it
};

/* The table. Five lines, and the `needs` column is the chain:

       Harvester    needs nothing
       Power plant  needs nothing
       Barracks     needs the power plant
       War factory  needs the barracks
       Tank         needs the war factory                                */
export const CATALOGUE = {
  harvester: {
    name: 'Harvester', kind: 'unit', cost: 400, seconds: 8, needs: null,
    tag: 'HRV', colour: '#ffbe5c', note: 'Digs ore and brings it home'
  },
  power: {
    name: 'Power plant', kind: 'building', cost: 300, seconds: 6, needs: null,
    tag: 'PWR', colour: '#6fd3c7', note: 'The first building. It opens the barracks'
  },
  barracks: {
    name: 'Barracks', kind: 'building', cost: 500, seconds: 10, needs: 'power',
    tag: 'BKS', colour: '#8fb7e8', note: 'Opens the war factory'
  },
  factory: {
    name: 'War factory', kind: 'building', cost: 1000, seconds: 18, needs: 'barracks',
    tag: 'FAC', colour: '#c79ae8', note: 'Opens the tank'
  },
  tank: {
    name: 'Tank', kind: 'unit', cost: 700, seconds: 12, needs: 'factory',
    tag: 'TNK', colour: '#7fa8d8', note: 'Drives, aims and fires on its own'
  }
} satisfies Record<string, Item>;

/* The name of one line of the table: 'harvester', 'power' and so on. */
export type ItemKey = keyof typeof CATALOGUE;

/* Every key, in the order the table lists them. The Build card draws
   its buttons in exactly this order. */
export const ITEM_KEYS = Object.keys(CATALOGUE) as ItemKey[];


/* --- The enemy's shopping list ---------------------------------------

   One line of the plan says "keep buying this until you have `upTo` of
   them". A building is only ever wanted once, so its `upTo` is 1.

   Your `wantNext` reads the list from the top and hands back the first
   line the enemy has not finished yet. Nothing else in the project
   decides what the enemy buys.

   Read the list from the top and you can see the whole game the
   commander intends to play:

       two more harvesters, because ore pays for everything
       a power plant, then a barracks, then a war factory, because
         nothing opens the tank but those three in that order
       four tanks, and then more harvesters and more tanks for ever

   A plan is data, the same as a kind of ground and a thing to build.
   Move a line and the enemy plays differently, and no code changes.  */

export type PlanLine = {
  key: ItemKey;        // which line of the catalogue it wants
  upTo: number;        // how many of them it wants altogether
};

export const RED_PLAN: PlanLine[] = [
  { key: 'harvester', upTo: 3 },
  { key: 'power', upTo: 1 },
  { key: 'harvester', upTo: 4 },
  { key: 'barracks', upTo: 1 },
  { key: 'factory', upTo: 1 },
  { key: 'tank', upTo: 2 },
  { key: 'harvester', upTo: 5 },
  { key: 'tank', upTo: 4 },
  { key: 'harvester', upTo: 6 },
  { key: 'tank', upTo: 12 }
];
