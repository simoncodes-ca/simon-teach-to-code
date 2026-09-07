# Simon's Blackjack

A game of blackjack that runs in your browser, played on a green felt table. Get closer to 21 than the dealer without going past it. The dealer has no choices to make at all — it follows one rule, every time.

This is your fourth project. The calculator taught you variables and functions. The elevator taught you state machines. Hangman taught you that everything on screen is worked out from a little memory. Blackjack keeps all of that and adds the idea underneath most real programs: **a thing in your program can be an object — one value with named parts.** A card is not a piece of text. It is a rank and a suit, travelling together.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `blackjack.html` | Builds the page: felt, seats, shoe, chips | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `blackjack.js` | The game's rules | You |

Double-click `blackjack.html` to play. After you change `blackjack.js`, save and refresh the browser page.

Inside `blackjack.js` eight functions have `// TODO` in them. Work through them in file order, top to bottom. Each one carries three levels of help in its comments: a gentle hint, a stronger hint, and the answer if you choose to read it. Try the gentle hint first.

Right now the page is a scaffold. The felt is there, the chips are there, but the shoe says 0 and the status line asks you to fill in STUB 1. That is on purpose.

## The rules of the game

Short version, because the code is the interesting part.

- You want a total as close to 21 as you can get. Go past 21 and you are **bust** — you lose at once, however the dealer's hand turns out.
- Number cards are worth their number. J, Q and K are worth 10. An ace is worth 11, or 1 if 11 would bust you.
- You get two cards face up. The dealer gets one face up and one face down.
- **Hit** takes another card. **Stand** ends your turn.
- Then the dealer turns its hidden card over and takes cards until it reaches 17 or more. It cannot choose to stop early and it cannot choose to carry on.
- Highest total that is not bust wins. Equal totals are a **push** — nobody wins.

## What you will learn

- What an object is, and how one value can hold several named parts
- How to walk two lists at once with a loop inside a loop
- How to shuffle honestly, and how to see that the shuffle worked
- How to write a function whose whole job is to calculate a number
- How to write a rule with several cases, and why the order of the cases matters
- What a phase is, and how changing one word can change what the whole page allows

## Good to know

### What you already know

These still work exactly the same. Flip back to `01-calculator/README.md`, `02-elevator/README.md` or `03-hangman/README.md` for the full story.

- `let` and `const` make labelled boxes. `const` cannot be replaced.
- Arrays are ordered lists. `.push(x)` adds to the end, `[0]` reads the first item, `.length` counts.
- `if` and `else` choose. `===` asks "exactly equal?" and `=` puts a value in a box.
- Functions are named recipes. `return` hands a value back and stops the function dead.
- `for` loops repeat and count. `while` loops repeat for as long as a question stays true.
- A boolean is a value that is only ever `true` or `false`.
- `document.getElementById(id)` finds an element; `.textContent` changes its words.
- `console.log` is your torch for finding mistakes.
- `render()` throws away what was on screen and redraws all of it from the memory. Your job is never "update the screen". It is "change the memory, then call `render()`".

### The big idea: objects

Up to now every value you have used has been one simple thing: a number, a piece of text, `true` or `false`, or a list of those. A card is not one simple thing. It is a rank *and* a suit, and the two only mean something together.

An **object** is a value with named parts, written inside curly brackets:

```js
const card = { rank: "7", suit: SUITS[1] };
```

You read a part out with a dot:

```js
card.rank            // "7"
card.suit            // the whole hearts object
card.suit.symbol     // "♥"
card.suit.colour     // "red"
```

Notice `card.suit.symbol`. The suit is itself an object, so you follow the dots one step at a time: from the card, to its suit, to that suit's symbol. Read it left to right like an address.

Why bother? Because the alternative is carrying two variables everywhere and hoping they stay together:

```js
// without objects — two lists that must never drift apart
const ranks = ["7", "K", "A"];
const suits = ["♥", "♠", "♦"];

// with objects — one list, and each item is complete
const hand = [
  { rank: "7", suit: hearts },
  { rank: "K", suit: spades },
  { rank: "A", suit: diamonds }
];
```

In the first version, sort one list and the cards silently become nonsense. In the second, a card cannot be separated from its suit because they are the same value. That is the whole reason objects exist.

`playerHand`, `dealerHand` and `deck` are all **arrays of objects** — ordered lists where every item is a card. So `playerHand[0].rank` means "the rank of my first card", and `for (const card of playerHand)` walks the hand one whole card at a time.

### Loops inside loops

A deck is every rank in every suit: 4 × 13 = 52. One loop can only walk one list, so `buildDeck` needs a loop inside a loop.

```js
for (const suit of SUITS) {
  for (const rank of RANKS) {
    // this line runs 52 times: once for every pairing
  }
}
```

The outer loop takes one suit and then holds still while the inner loop runs all the way through the ranks. Spades, ace to king. Then hearts, ace to king. Then diamonds, then clubs. The inner loop finishes completely, four times over.

`for (const x of list)` is the shorter cousin of the counting loop you used in hangman. Use it when you want each item and do not care what position it is in. Use `for (let i = 0; ...)` when you need the position too.

This shape is worth getting comfortable with, because the next project is Battleship, and a grid is rows inside columns.

### Randomness, and seeing it happen

`Math.random()` gives back a different decimal between 0 and 1 every time you call it. On its own that is not much use. The pattern you want is:

```js
Math.floor(Math.random() * n)      // a whole number from 0 up to n - 1
```

Multiplying spreads the decimal across the range you care about, and `Math.floor` chops the fractional part off. With `n` as `cards.length` you get a random position in the array — exactly what a shuffle needs.

**Shuffling is swapping.** Walk from the last card backwards, and for each one, pick a random card at or before it and trade places. Trading needs three steps and a spare box, because the moment you overwrite the first card it is gone:

```js
const keep = cards[i];    // hold on to it
cards[i] = cards[j];      // now cards[i] is safe to overwrite
cards[j] = keep;          // and the held one goes to the other slot
```

Try it with two steps instead and both slots end up holding the same card. It is worth doing wrong once and watching the ribbon fill up with duplicates.

**About that ribbon.** Under the shoe is a strip showing the deck's real order: one tick per card, red or black by suit. Before you shuffle it is four clean stripes — all the spades, all the hearts, all the diamonds, all the clubs. After a working shuffle it is scattered, and different every deal.

That strip is there because randomness is normally the least visible thing a program does. It can only show you the colours, and a suit's colour changes nothing whatsoever in blackjack — so you can watch the shuffle work without learning a single thing about what is coming.

### Functions that calculate

`cardValue` and `handTotal` are a kind of function you have not written much of yet. They change nothing. They take something, work out a number, and hand it back. Ask twice and you get the same answer twice.

That is worth keeping true on purpose. `handTotal(playerHand)` is called by `render`, by `isBust`, by `decideWinner` and by the dealer loop, many times a second in places. If it quietly changed something each time it ran, the game would behave differently depending on how often the screen was redrawn — and that is a bug you could hunt for a week.

**Text is not a number.** `card.rank` is always a piece of text, even for a number card:

```js
"7" + 1        // "71"  — glued together, because "7" is text
Number("7") + 1 // 8    — added, because Number() converts it first
```

Forgetting `Number()` gives you a total like `"05710"` instead of 22. If a total looks like all the cards stuck end to end, that is the reason.

### The one interesting rule: aces

An ace is worth 11 or 1, and the hand decides which. Two aces in one hand can even be worth different amounts:

```
A + K          = 11 + 10   = 21
A + K + 5      = 11+10+5   = 26, too big, so the ace drops to 1  -> 16
A + A + 9      = 11+11+9   = 31, drop one ace -> 21, and stop
```

That last line is the important one. **Drop only as many aces as you must.** Drop both and you get 11, and you have thrown away a perfect hand.

You could work out every combination, but there is a much easier way. Dropping an ace from 11 to 1 takes exactly 10 off the total. So add everything up as 11s first, then take 10 off, once per ace, until it fits:

```js
while (total > BUST_AT && aces > 0) {
  total = total - 10;
  aces = aces - 1;
}
```

A `while` loop is a `for` loop with only the middle part — it repeats for as long as its question is true. Both halves of that question matter. Without `total > BUST_AT` it would drop every ace every time. Without `aces > 0` it would keep subtracting 10 forever on a hand with no aces, and the page would freeze. Whenever you write a `while`, check that something inside it moves the question towards `false`.

### Rules with several cases, and why order matters

`decideWinner` is five questions asked in a fixed order:

```js
if (isBust(playerHand)) return "dealer";
if (isBust(dealerHand)) return "player";
if (handTotal(playerHand) > handTotal(dealerHand)) return "player";
if (handTotal(playerHand) < handTotal(dealerHand)) return "dealer";
return "push";
```

Every line is `if ... return`, and none of them needs an `else`, because `return` leaves the function immediately. Reaching line two already proves line one was false. Reaching the last line proves all four were false, so the totals must be equal.

**The order is the rule.** Put the bust check second and a player on 25 beats a dealer on 20, because 25 is the bigger number. Bursting has to lose *first*, before anyone compares anything, or the whole point of 21 disappears. When you write a chain of cases, ask what happens if two of them are true at once — the one you wrote higher up is the one that wins.

### Phases: one word that decides what is allowed

The elevator had a `state` variable and moved between names like `doorsOpen` and `movingUp`. Blackjack has the same idea under a different word:

```js
let phase = "finished";   // "dealing", "playerTurn", "dealerTurn" or "finished"
```

A round walks through them in order, and the phase is printed on the felt so you can watch it happen:

```text
dealing  ->  playerTurn  ->  dealerTurn  ->  finished
                    \                          /
                     \___ (bust) _____________/
```

The reason it earns its own variable is `renderActions`, in the wiring:

```js
const myTurn = phase === "playerTurn";
hitBtn.disabled = !myTurn || deck.length === 0;
standBtn.disabled = !myTurn;
```

The chips are not switched on and off by the code that deals, or hits, or settles. They ask the phase. So when your `handleHit` writes `phase = "finished"`, it never touches a button — and yet both chips go dead, because the next `render()` asks the phase and gets a new answer.

That is why there is one line to get right instead of five, and it is the same reason hangman derived the whole screen from three variables. Set the memory; let the screen follow.

### Already done for you

Section 3 of `blackjack.js` is finished wiring, like the three projects before it.

- `drawCard()` takes the top card off the deck and hands it back, using `deck.pop()`. Because `pop` **removes** the card, the same one can never come out twice.
- `render()` calls seven smaller painters — the hands, the totals, the shoe, the ribbon, the phase, the status and the chips. Each reads the memory and redraws its own part.
- `handleStand()` is written out in full as a worked example, and it is the same shape as the `handleHit` you have to write. Read it before you start stub 8.
- `runDealerTurn()` takes one card every 700ms so you can watch it, asking your `dealerShouldHit` before each one.
- `settleRound()` asks your `decideWinner` who won, shows the plaque and plays the sound.
- `startRound()` builds a deck, shuffles it, and deals two cards each one at a time. The **New deal** chip is already connected to it.
- The chips are connected with arrow functions — `() => handleHit()` rather than `handleHit`. That looks fussy, but it means the button looks your function up at the moment it is clicked, so it keeps working however you choose to write it.
- Adding `#demo`, `#demo-win`, `#demo-lose` or `#demo-bust` to the end of the address in the browser shows the page mid-round, won, lost and bust. That is for checking how it looks, not for playing.

### The cards, the chips and the sounds

Cards are ordinary page elements, not pictures. `makeCardSlot` builds one from a card object: a corner with the rank and a small suit, a large centre pip, and the class `red` when `card.suit.colour` is red. The dealer's hidden card gets the class `back` instead and is told to say "a face-down card" out loud rather than pretending to be something it is not.

Under every face-up card is a small line reading `worth 10`. That is your `cardValue`, printed. It is not something a real card table has — it is there so you can see your own function working on every card at once, and so a wrong answer is obvious instead of hidden inside a total.

Sounds work exactly as they did in hangman. Five of them are made once, near the top of the given wiring, and reused:

```js
const dealSound = new Audio("assets/deal.wav");

function playSound(sound) {
  sound.currentTime = 0;      // rewind, in case it is still playing
  sound.play().catch(() => {});
}
```

`currentTime = 0` rewinds, so the same sound can fire twice in a row as cards come out. The `.catch` swallows the browser's refusal to play sound before you have clicked the page once.

### Finding your mistakes

Same trick as the last three projects. Right-click the page, choose Inspect, click the Console tab.

Four things to reach for, in the order they usually help:

1. **The shoe and the ribbon** tell you about the deck. 52 and four clean stripes means `buildDeck` works and `shuffleDeck` does not. Fewer than 52 means the loops are not pairing everything.
2. **The `worth` lines** tell you about `cardValue`, one card at a time, without you printing anything.
3. **The totals** tell you about `handTotal`. Deal until you get an ace and check the arithmetic by hand.
4. **The phase pill** tells you where the round thinks it is. A stuck phase is why a chip will not respond.

When the screen still disagrees with you, print the memory:

```js
console.log(phase, playerHand, handTotal(playerHand));
```

Objects print out with all their parts, so you will see the actual cards rather than a number you have to trust. If the memory is right and the screen is wrong, the bug is in how you called `render()`. If the memory is already wrong, the bug happened before that — and you have just halved the size of the file you need to search.
