/* =====================================================================
   numbers.ts. File 1 of 12.

   The small strategy game. This is the last project, and it is every
   project from 18 onwards in one place.

   You have a refinery, a build yard and a side of the map. So does an
   enemy, and its side works exactly like yours. Its harvesters dig, its
   yard builds, and its tanks come for you.

   The part you write is the enemy's commander. It decides what to buy,
   when to save up, and when to send its tanks. Then it decides who has
   won.

   This file only remembers. It holds the sizes the page is built from,
   the rates the harvesters work at, the numbers a fight runs on, and
   the three numbers the commander thinks with.
   ===================================================================== */

export const TILE = 48;             // one cell of the map is this many pixels across
export const COLS = 20;             // how many cells fit across the map
export const ROWS = 15;             // and how many fit down it
export const WIDTH = COLS * TILE;   // so the window is 960 pixels wide
export const HEIGHT = ROWS * TILE;  // and 720 pixels tall

export const TANK_SPEED = 90;       // pixels a second, on ground with a speed of 1
export const INFANTRY_SPEED = 130;  // infantry carry only a rifle, so they are quicker
export const TANK_REACH = 22;       // a click this close to a unit's middle is a click on it
export const SPACING = 54;          // how far apart units park when they arrive together
export const DRAG_START = 6;        // the mouse must move this far before a click becomes a drag


/* --- The two corners -------------------------------------------------

   Your refinery stands in one corner and the enemy's stands in the
   other. Both maps are built so that turning one round gives you the
   other, which is the only way to make a fight fair.

   Your corner is the cell your squad has started on since project 19. */

export const BLUE_BASE = { col: 4, row: 10 };
export const RED_BASE = { col: 15, row: 4 };


/* --- The ore run, from project 21 --- */

export const CAPACITY = 100;        // how much ore one harvester can carry
export const DIG_RATE = 25;         // ore a second a harvester digs out of a patch
export const UNLOAD_RATE = 60;      // ore a second it tips into the refinery


/* --- The build yard, from project 22 --- */

export const START_CREDITS = 600;   // what each refinery holds when a map begins
export const QUEUE_MAX = 5;         // how many things may wait in one queue at once
export const START_HARVESTERS = 3;  // how many harvesters each side starts with


/* --- The fight, from project 23 --- */

export const SEE_RANGE = 250;       // pixels. Closer than this and a tank has spotted you
export const GUN_RANGE = 130;       // pixels. Closer than this and it can hit you

export const MAX_HEALTH = 100;      // how much damage a tank takes before it is wrecked
export const SHOT_DAMAGE = 9;       // how much health one tank shot takes off
export const RELOAD = 0.7;          // seconds a tank waits between shots


/* --- The other thing with a gun ---------------------------------------

   Infantry come out of the barracks for 200 credits in four seconds. A
   tank is 700 credits, twelve seconds, and a 1000-credit war factory
   before you may order one at all.

   So one tank is worth three and a half infantry, and these numbers are
   what you get for the money:

       four infantry     160 health, and 32 damage a second
       one tank          100 health, and 13 damage a second

   Infantry win a straight fight and lose a long one, because a tank
   that shoots one down is still nearly whole. Rush with them or screen
   your harvesters with them; do not besiege a refinery with them.    */

export const INFANTRY_HEALTH = 40;  // infantry are shot down in five tank shots
export const INFANTRY_DAMAGE = 4;   // and a rifle takes off less than half what a shell does
export const INFANTRY_RELOAD = 0.5; // but it fires quicker

export const BEAT = 3;              // how far from its refinery a guard walks, in cells


/* --- A refinery you can shoot ----------------------------------------

   A refinery is a unit, the same as a tank and a harvester. It never
   drives and it never fires, and that is the whole difference.

   It is in the list of units, so project 23's `nearestTarget` finds it
   and project 23's `shootStep` damages it. Neither function had to
   change by one character. That is project 8's lesson paying off for
   the last time: every moving thing is the same shape of object, so a
   thing that does not move fits in the same list.

   Wrecking the enemy refinery is how you win, so it takes a lot of
   punishment. Nine times a tank, which is about eighteen seconds of
   fire from four tanks at once. Long enough to be a siege, and short
   enough that a wave which gets there has something to show for it.  */

export const BASE_HEALTH = 900;


/* --- The three numbers the commander thinks with ---------------------

   These are yours to change once the game works. Each one moves the
   enemy a long way.

       ATTACK_FORCE   fewer, and it attacks early with too little
       ATTACK_EDGE    1 means it attacks an even fight. 1.2 means it
                        waits until it is a fifth stronger than you
       GUARDS         fighters it keeps at home, whatever else happens

   A commander that never waits loses its tanks two at a time. A
   commander that waits for too much never attacks at all, because you
   are building tanks as fast as it is.

   Four is the number because infantry count too. Two riflemen guarding
   the ore are not a wave, and the plan buys them long before the war
   factory. It marches when it has two tanks as well.                */

export const ATTACK_FORCE = 4;      // things with guns it wants before it will attack at all
export const ATTACK_EDGE = 1.2;     // how much stronger than you it wants to be
export const GUARDS = 1;            // fighters that stay at home to guard the refinery

export const THINK_EVERY = 1;       // seconds between one buying decision and the next
export const MARCH_EVERY = 2.5;     // seconds between one wave of orders and the next


/* --- The head start --------------------------------------------------

   The enemy does nothing at all for this long at the start of a map:
   no digging, no buying, no orders. Its harvesters stand by their
   refinery and wait.

   The digging has to stop too. A side that sleeps but keeps mining
   only banks the credits and spends them all in one go the moment it
   wakes, which is no head start at all: measured, that version moved
   its first wave by thirteen seconds instead of the whole of it.

   It is here because the commander is quicker than you are, and always
   will be. It never misclicks, never loses a unit in a corner, and
   never has to read a card to remember what a war factory costs. A
   head start is not the commander playing worse. It is the one honest
   way to hand a person the seconds that the mouse costs them.

   Thirty seconds is about two loads of ore and a power plant for you,
   and nothing at all for the enemy: enough to get your hand in, and
   not so much that the game is over before it starts. Cut it to 0 when
   you want the fight you were losing, and put it up when you want to
   practise a new opening.

   Changing it moves everything the enemy does later by the same amount,
   because a plan is a list and this only decides when the list starts.

   Note that `THINK_EVERY` and `MARCH_EVERY` above are not a second dial
   for this. Making the enemy decide less often barely slows it down: it
   is waiting for credits, not for its next think. Measured, three
   seconds instead of one moved its win by three seconds.             */

export const HEAD_START = 30;       // seconds before the enemy does anything at all
