/* =====================================================================
   catalogue.ts. File 7 of 10.

   One job: the things the yard can build. It is finished.

   This is project 18's terrain table again, for a different kind of
   content. One line describes one thing you can buy, and no other file
   in the project ever names a power plant or a tank.

   Want a sixth thing to build? Add a line. The buttons, the prices,
   the padlocks and the queue all follow the table, so nothing else has
   to change.
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
  picture: string | null;  // the file in assets/ drawn on its plot, or null for a unit
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
    tag: 'HRV', picture: null, colour: '#ffbe5c', note: 'Digs ore and brings it home'
  },
  power: {
    name: 'Power plant', kind: 'building', cost: 300, seconds: 6, needs: null,
    tag: 'PWR', picture: 'power-plant.png', colour: '#6fd3c7', note: 'The first building. It opens the barracks'
  },
  barracks: {
    name: 'Barracks', kind: 'building', cost: 500, seconds: 10, needs: 'power',
    tag: 'BKS', picture: 'barracks.png', colour: '#8fb7e8', note: 'Opens the war factory'
  },
  factory: {
    name: 'War factory', kind: 'building', cost: 1000, seconds: 18, needs: 'barracks',
    tag: 'FAC', picture: 'war-factory.png', colour: '#c79ae8', note: 'Opens the tank'
  },
  tank: {
    name: 'Tank', kind: 'unit', cost: 700, seconds: 12, needs: 'factory',
    tag: 'TNK', picture: null, colour: '#7fa8d8', note: 'Drives about. It has nothing to shoot at yet'
  }
} satisfies Record<string, Item>;

/* The name of one line of the table: 'harvester', 'power' and so on. */
export type ItemKey = keyof typeof CATALOGUE;

/* Every key, in the order the table lists them. The Build card draws
   its buttons in exactly this order. */
export const ITEM_KEYS = Object.keys(CATALOGUE) as ItemKey[];
