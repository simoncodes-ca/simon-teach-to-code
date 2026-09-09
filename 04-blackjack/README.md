# Simon's Blackjack

A game of blackjack that runs in your browser, played on a green felt table. You want a total closer to 21 than the dealer, without going past 21. The dealer makes no choices at all. It follows one rule, every time.

This is your fourth project. The calculator taught you variables and functions. The elevator taught you state machines. Hangman taught you that everything on the screen comes from a small amount of memory.

Blackjack takes the object you met once in the calculator and builds the whole game out of it. **A thing in your program can be an object, which is one value with named parts.** A card is not a piece of text. It is a rank and a suit, travelling together.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `blackjack.html` | Builds the page: felt, seats, deck, chips | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `blackjack.js` | The game's rules | You |

Double-click `blackjack.html` to play. After you change `blackjack.js`, save the file and refresh the browser page.

Inside `blackjack.js` twelve functions are marked `// TODO`. Write them in file order, from top to bottom. Each one carries two hints in its comments: a gentle hint first, then a stronger one. Try the gentle hint first. If you are still stuck, the answers are all together in a block at the very bottom of the file — scroll down to it when you want it, and only then.

Right now the page does nothing. The felt is there and the chips are there, but the shoe is blank and no cards come out. The status line asks you to write the first function. That is on purpose.

## The rules of the game

Here is the short version, because the code is the interesting part.

- You want a total as close to 21 as you can get. Go past 21 and you are **bust**. You lose at once, whatever the dealer's hand turns out to be.
- Number cards are worth their number. J, Q and K are worth 10. An ace is worth 11, or 1 if 11 would make you bust.
- You get two cards face up. The dealer gets one card face up and one card face down.
- **Hit** takes another card. **Stand** ends your turn.
- Then the dealer turns its hidden card over. It takes cards until it reaches 17 or more. It cannot stop early, and it cannot carry on past 17.
- The highest total that is not bust wins. Equal totals are a **push**, which means nobody wins.

## What you will learn

- What an object is, and how one value can hold several named parts
- How to go through two lists at once, with a loop inside a loop
- How to shuffle honestly, and how to see that the shuffle worked
- How to write a function whose only job is to calculate a number
- How to write a rule with several cases, and why their order matters
- What a phase is, and how changing one word changes what the whole page allows

## Good to know

### What you already know

These all work exactly the same here. Read `01-calculator/README.md`, `02-elevator/README.md` or `03-hangman/README.md` again for the full story.

- `let` and `const` make labelled boxes. A `const` box cannot be replaced.
- Arrays are ordered lists. `.push(x)` adds to the end, `[0]` reads the first item, `.length` counts.
- `if` and `else` make choices. `===` asks whether two values are exactly equal. `=` puts a value in a box.
- Functions are steps with a name. `return` sends a value back and stops the function immediately.
- `for` loops repeat and count. `for (const x of list)` walks a list without counting.
- A boolean is a value that is only ever `true` or `false`.
- `document.getElementById(id)` finds an element. `.textContent` changes its text.
- `console.log` shows you what is really happening.
- `render()` removes what was on the screen and draws all of it again, from the memory. So your job is never "update the screen". It is "change the memory, then call `render()`".

### The big idea: objects

The calculator kept one object, and you only ever read two parts out of it. Here objects are the material the game is made of.

A card is not one simple thing. It is a rank **and** a suit, and the two only mean something together.

An **object** is a value with named parts. You write it inside curly brackets:

```js
const card = { rank: '7', suit: SUITS[1] };
```

You read a part out with a dot:

```js
card.rank            // '7'
card.suit            // the whole hearts object
card.suit.symbol     // '♥'
card.suit.colour     // 'red'
```

Look at `card.suit.symbol`. The suit is itself an object, so you follow the dots one step at a time. From the card, to its suit, to that suit's symbol. Read it from left to right, like an address.

Why use objects at all? Because the other way is to carry two variables everywhere and hope they stay together:

```js
// without objects: two lists that must never drift apart
const ranks = ['7', 'K', 'A'];
const suits = ['♥', '♠', '♦'];

// with objects: one list, and each item is complete
const hand = [
  { rank: '7', suit: hearts },
  { rank: 'K', suit: spades },
  { rank: 'A', suit: diamonds }
];
```

Sort one list in the first version and the cards silently become nonsense. In the second version a card cannot be separated from its suit, because they are the same value. That is the whole reason objects exist.

`playerHand`, `dealerHand` and `deck` are all **arrays of objects**. They are ordered lists where every item is a card. So `playerHand[0].rank` means "the rank of my first card". And `for (const card of playerHand)` goes through the hand one whole card at a time.

### Loops inside loops

A deck holds every rank in every suit. That is 4 × 13 = 52 cards. One loop can only go through one list, so `buildDeck` needs a loop inside a loop.

```js
for (const suit of SUITS) {
  for (const rank of RANKS) {
    // this line runs 52 times, once for every pairing
  }
}
```

The outer loop takes one suit. Then it waits while the inner loop runs all the way through the ranks.

So the order is: spades, ace to king. Then hearts, ace to king. Then diamonds, then clubs. The inner loop finishes completely, four times over.

`for (const x of list)` is the shorter version of the counting loop you used in hangman. Use it when you want each item and do not care about its position. Use `for (let i = 0; ...)` when you need the position as well.

This shape is worth learning properly. The next project is Battleship, and a grid is a list of rows with the squares inside each row.

### Randomness, and seeing it happen

`Math.random()` returns a different decimal between 0 and 1 every time you call it. On its own that is not very useful. This is the pattern you want:

```js
Math.floor(Math.random() * n)      // a whole number from 0 up to n - 1
```

Multiplying spreads the decimal across the range you care about. `Math.floor` then removes the part after the decimal point. Use `cards.length` as `n` and you get a random position in the array. That is exactly what a shuffle needs.

**Shuffling means swapping.** Go from the last card backwards. For each card, pick a random card at or before it, and trade places.

Trading needs three steps and a spare box. The moment you overwrite the first card, it is gone:

```js
const keep = cards[i];    // save it somewhere safe
cards[i] = cards[j];      // now cards[i] is safe to overwrite
cards[j] = keep;          // and the saved card goes to the other slot
```

Try it with two steps instead. Both slots end up holding the same card. It is worth doing wrong once, so you can watch the ribbon fill with duplicates.

**About that ribbon.** Under the deck is a strip that shows the deck's real order. It draws one tick per card, coloured red or black by suit.

Before you shuffle it shows four clean stripes: all the spades, all the hearts, all the diamonds, all the clubs. After a working shuffle it is scattered, and different on every deal.

The strip is there because randomness is normally the least visible thing a program does. It can only show you the colours, and a suit's colour changes nothing at all in blackjack. So you can watch the shuffle work without learning anything about which cards are coming.

### Functions that calculate

`cardValue`, `sumCards` and `handTotal` are a kind of function you have not written much of yet. They change nothing. They take something, work out a number, and return it. Ask twice and you get the same answer twice.

Keep that true on purpose. `handTotal(playerHand)` is called by `render`, by `isBust`, by `decideWinner` and by the dealer loop. In some places it runs many times a second.

So imagine it quietly changed something each time it ran. The game would then behave differently depending on how often the screen was redrawn. That is a bug you could search for over a week.

**Text is not a number**, and the calculator's `Number()` trap is waiting for you again. `card.rank` is always a piece of text, even for a number card. Forget `Number()` and you get a total like `'05710'` instead of 22. So if a total looks like all the cards joined end to end, that is the reason.

### The one interesting rule: aces

An ace is worth 11 or 1, and the hand decides which. Two aces in one hand can even be worth different amounts:

```
A + K          = 11 + 10   = 21
A + K + 5      = 11+10+5   = 26, too big, so the ace drops to 1  -> 16
A + A + 9      = 11+11+9   = 31, drop one ace -> 21, and stop
```

That last line is the important one. **Drop only as many aces as you must.** Drop both and you get 11, and you have thrown a perfect hand away.

You could work out every combination, but there is a much easier way. Dropping an ace from 11 to 1 takes exactly 10 off the total. So add everything up as 11s first — that is `sumCards`, and it is a whole function on its own. Then take 10 off, once per ace, until the total fits:

```js
while (total > BUST_AT && aces > 0) {
  total = total - 10;
  aces = aces - 1;
}
```

A `while` loop is a `for` loop with only the middle part. It repeats for as long as its question is true.

Both halves of that question matter. Without `total > BUST_AT` it would drop every ace every time. Without `aces > 0` it would keep subtracting 10 forever on a hand with no aces, and the page would freeze.

So whenever you write a `while`, check that something inside it moves the question towards `false`.

That split is worth noticing. `sumCards` does the boring part and `handTotal` does the interesting part, and each is small enough to check on its own. When a total comes out wrong you can ask `sumCards` first: if it says 26 for A + K + 5 it is doing its job, and the mistake is in the aces.

### Rules with several cases, and why order matters

`decideWinner` asks five questions in a fixed order:

```js
if (isBust(playerHand)) return 'dealer';
if (isBust(dealerHand)) return 'player';
if (handTotal(playerHand) > handTotal(dealerHand)) return 'player';
if (handTotal(playerHand) < handTotal(dealerHand)) return 'dealer';
return 'push';
```

Every line is `if ... return`, and none of them needs an `else`. That is because `return` leaves the function immediately.

So reaching line two already proves line one was false. Reaching the last line proves all four were false, which means the totals must be equal.

**The order is the rule.** Put the bust check second and a player on 25 beats a dealer on 20, because 25 is the bigger number. Going bust has to lose *first*, before anyone compares anything. Otherwise the whole point of 21 disappears.

So when you write a chain of cases, ask what happens if two of them are true at once. The one you wrote higher up is the one that wins.

### Phases: one word that decides what is allowed

The elevator had a `state` variable and moved between names like `doorsOpen` and `movingUp`. Blackjack has the same idea under a different word:

```js
let phase = 'finished';   // 'dealing', 'playerTurn', 'dealerTurn' or 'finished'
```

A round moves through those names in order. The phase is printed on the felt, so you can watch it happen:

```text
dealing  ->  playerTurn  ->  dealerTurn  ->  finished
                    \                          /
                     \___ (bust) _____________/
```

`renderActions`, in the given code, is why the phase earns its own variable:

```js
const myTurn = phase === 'playerTurn';
hitBtn.disabled = !myTurn || deck.length === 0;
standBtn.disabled = !myTurn;
```

The chips are not switched on and off by the code that deals, or hits, or settles. They ask the phase instead.

So when your `handleHit` writes `phase = 'finished'`, it never touches a button. Yet both chips go dead, because the next `render()` asks the phase and gets a new answer.

That is why you have one line to get right instead of five. It is the same reason hangman worked the whole screen out from three variables. Set the memory, and let the screen follow.

### Already written for you

Section 3 of `blackjack.js` is already written, like the three projects before it.

- `render()` calls seven smaller drawing functions: the hands, the totals, the shoe, the ribbon, the phase, the status and the chips. Each one reads the memory and redraws its own part. Six of them are written for you; `renderShoe` is yours.
- `handleStand()` is written out in full as an example. It has the same shape as the `handleHit` you have to write. Read it before you start the last function.
- `runDealerTurn()` takes one card every 700 milliseconds, so you can watch it happen. It asks your `dealerShouldHit` before each card.
- `settleRound()` asks your `decideWinner` who won. Then it shows the plaque and plays the sound.
- `startRound()` builds a deck, shuffles it, and deals two cards each, one at a time. The **New deal** chip is already connected to it.
- The chips are connected with arrow functions, so `() => handleHit()` rather than `handleHit`. That looks fussy, but it matters. It means the button finds your function at the moment you click it, so the chip keeps working however you choose to write the function.
- Add `#demo`, `#demo-win`, `#demo-lose` or `#demo-bust` to the end of the address in the browser. Those show the page mid-round, won, lost and bust. They are for checking how the page looks, not for playing.

### The cards, the chips and the sounds

Cards are ordinary page elements, not pictures. `makeCardSlot` builds one from a card object. It makes a corner with the rank and a small suit, a large centre symbol, and the class `red` when `card.suit.colour` is red.

The dealer's hidden card gets the class `back` instead. It also tells a screen reader that it is a face-down card, rather than pretending to be something it is not.

Under every face-up card is a small line that reads `worth 10`. That is your `cardValue`, printed on the table. A real card table has nothing like it.

It is there for two reasons. You can see your own function working on every card at once. And a wrong answer becomes obvious, instead of hiding inside a total.

Sounds work exactly as they did in hangman, and `playSound` is the same function. There are five of them here instead of three: dealing, hitting, winning, losing and busting.

### Finding your mistakes

The console works as it always has. But this table tells you more than the console does, because most of your functions are printed on the felt while you play. Check these six things, in this order:

1. **The shoe and the ribbon** tell you about the deck. Fifty-two ticks in four clean stripes means `buildDeck` works and `shuffleDeck` does not. Fewer than 52 means the loops are missing some pairings. A blank shoe with a full ribbon means `renderShoe`.
2. **A bare felt** means `drawCard`. The deal asks for four cards, and if nothing comes back nothing is dealt.
3. **The `worth` lines** tell you about `cardValue`, one card at a time, and you print nothing yourself.
4. **The dealer's `9 + ?`** tells you about `sumCards`, on a single card where the ace rule cannot get in the way.
5. **The totals** tell you about `handTotal`. Deal until you get an ace, then check the arithmetic by hand.
6. **The phase** tells you where the round thinks it is. A stuck phase is why a chip will not respond.

When the screen still disagrees with you, print the memory:

```js
console.log(phase, playerHand, handTotal(playerHand));
```

Objects print with all their parts, so you see the actual cards instead of a number you have to trust.

Now compare what you see. If the memory is right and the screen is wrong, the bug is in how you called `render()`. If the memory is already wrong, the bug happened before that. Either way you have just halved the amount of the file you need to search.
