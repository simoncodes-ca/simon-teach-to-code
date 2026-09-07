/* =====================================================================
   Simon's Blackjack — the game's brain.

   This file is a learning scaffold. The table is ready and the cards
   know how to fly out of the shoe, but no round can be played until
   you fill in the TODO functions below.

   A good order to work in:
     1. buildDeck         — make all 52 cards
     2. shuffleDeck       — put them in a random order
     3. cardValue         — say what one card is worth
     4. handTotal         — add up a hand, and be kind about aces
     5. dealerShouldHit   — the dealer's one and only rule
     6. isBust            — decide when a hand has gone too far
     7. decideWinner      — compare the two hands
     8. handleHit         — take a card, and end the round if it burst

   Each one you finish makes something new happen on the table.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   The whole game is four pieces of memory. The cards on the felt, the
   totals, the chip buttons that are alive or dead, the number on the
   shoe — every one of them is worked out from these four.
   --------------------------------------------------------------------- */

/* A suit is an object: a thing with named parts, written inside { }.
   These four are the only suits there will ever be. */
const SUITS = [
  { symbol: "♠", name: "spades",   colour: "black" },
  { symbol: "♥", name: "hearts",   colour: "red" },
  { symbol: "♦", name: "diamonds", colour: "red" },
  { symbol: "♣", name: "clubs",    colour: "black" }
];

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

/* A card is an object too, and it is made of exactly two parts:
     { rank: "7", suit: SUITS[1] }
   That card is the seven of hearts. card.rank is "7", card.suit is the
   whole hearts object, and card.suit.symbol is the little heart shape. */

let deck = [];              // the cards not dealt yet, top card at the END
let playerHand = [];        // your cards, an array of card objects
let dealerHand = [];        // the dealer's cards
let phase = "finished";     // "dealing", "playerTurn", "dealerTurn" or "finished"

const BUST_AT = 21;         // go past this and the hand is dead
const DEALER_STANDS_ON = 17; // the dealer takes cards until it reaches this


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Eight small functions. Fill them in from the top down. Each comment
   gives you three levels of help — read only as far as you need.
   --------------------------------------------------------------------- */

/**
 * Build a full deck: every rank, in every suit. 4 x 13 = 52 cards.
 *
 * Put them in `cards` in a sensible order — all the spades, then all the
 * hearts, and so on. Do not try to shuffle here; that is the next job.
 *
 * Gentle hint: you need every combination of a suit and a rank. One loop
 *   can only walk through one list, so you need a loop inside a loop.
 * Stronger hint: `for (const suit of SUITS)` on the outside, and
 *   `for (const rank of RANKS)` on the inside. Inside both, build one
 *   card object and cards.push(...) it onto the end.
 * Answer if you want it: cards.push({ rank: rank, suit: suit });
 *
 * The moment this works the shoe shows 52, and the ribbon underneath it
 * draws one tick per card: thirteen black, thirteen red, thirteen red,
 * thirteen black. That striped pattern is your deck, in order.
 */
function buildDeck() {
  const cards = [];
  // TODO: add all 52 cards to `cards`.
  return cards;
}

/**
 * Put the cards into a random order.
 *
 * This one changes the array it is given instead of returning a new one,
 * so there is no `return` at the end. Move the cards around inside
 * `cards` and the deck outside changes with it.
 *
 * The method is: walk from the last card back to the second, and for
 * each one pick a random card at or before it and swap the two.
 *
 * Gentle hint: Math.random() gives a decimal between 0 and 1.
 *   Math.floor(Math.random() * n) gives a whole number from 0 to n - 1.
 * Stronger hint: to swap two things you need a third box to hold one of
 *   them for a moment, or the first one is lost:
 *     const keep = cards[i]; cards[i] = cards[j]; cards[j] = keep;
 * Answer if you want it:
 *     for (let i = cards.length - 1; i > 0; i = i - 1) {
 *       const j = Math.floor(Math.random() * (i + 1));
 *       const keep = cards[i];
 *       cards[i] = cards[j];
 *       cards[j] = keep;
 *     }
 *
 * You can see this one work. The ribbon under the shoe shows the deck's
 * order: four clean stripes before you shuffle, red and black scattered
 * all the way along afterwards. Press New deal a few times and watch it
 * come out different every time.
 */
function shuffleDeck(cards) {
  // TODO: put the cards into a random order.
}

/**
 * How much is one card worth?
 *
 *   A               is worth 11 (handTotal drops it to 1 later if it has to)
 *   J, Q and K      are worth 10
 *   2 to 10         are worth the number printed on them
 *
 * Gentle hint: card.rank is a piece of text like "A", "10" or "K", never
 *   a number. Three cases, so two ifs and a last line for the rest.
 * Stronger hint: "7" is text and 7 is a number, and they are not the
 *   same thing. Number("7") turns the text into the number.
 * Answer if you want it:
 *     if (card.rank === "A") return 11;
 *     if (card.rank === "J" || card.rank === "Q" || card.rank === "K") return 10;
 *     return Number(card.rank);
 *
 * Every card on the table has a small line under it saying what it is
 * worth, so you will see all of them light up at once.
 */
function cardValue(card) {
  // TODO: return the value of this card.
  return 0;
}

/**
 * Add up a whole hand and return one number.
 *
 * This is where the one interesting rule in blackjack lives. An ace is
 * worth 11, unless that would burst the hand — then it is worth 1. A
 * hand can hold more than one ace, and each one drops on its own:
 *
 *   A + K         = 11 + 10 = 21
 *   A + K + 5     = 26, too big, so the ace drops to 1  -> 16
 *   A + A + 9     = 21, then one ace drops               -> 21
 *
 * Dropping an ace from 11 to 1 takes 10 off the total. So instead of
 * working out every combination, add everything up as 11s and then take
 * 10 off, once per ace, until the total fits.
 *
 * Gentle hint: `for (const card of hand)` walks a hand one card at a
 *   time. Use cardValue — you have already written it.
 * Stronger hint: count the aces as you go. Then a `while` loop: while
 *   the total is too big AND there is still an ace left at 11, take off
 *   10 and one from the ace count.
 * Answer if you want it:
 *     for (const card of hand) {
 *       total = total + cardValue(card);
 *       if (card.rank === "A") aces = aces + 1;
 *     }
 *     while (total > BUST_AT && aces > 0) {
 *       total = total - 10;
 *       aces = aces - 1;
 *     }
 *
 * A `while` loop is a `for` loop with only the middle part: it repeats
 * for as long as its question stays true. Make sure something inside it
 * moves towards making that question false, or it never stops.
 *
 * When this works, both totals appear on the felt in brass.
 */
function handTotal(hand) {
  let total = 0;
  let aces = 0;
  // TODO: add up the cards, then bring the aces down while the total is too big.
  return total;
}

/**
 * Should the dealer take another card?
 *
 * The dealer has no choices to make. It has one rule: keep taking cards
 * while the total is under 17, then stop. It does not look at your hand
 * and it never changes its mind.
 *
 * Gentle hint: DEALER_STANDS_ON is 17, and handTotal gives you a number.
 * Stronger hint: "under 17" is `< DEALER_STANDS_ON`, not `<=`. On
 *   exactly 17 the dealer stops.
 * Answer if you want it: return handTotal(hand) < DEALER_STANDS_ON;
 *
 * runDealerTurn, in the wiring below, asks this over and over, one card
 * at a time with a pause between. Until you write it the dealer always
 * says no and sits on two cards. When it works, press Stand and watch
 * the dealer turn its hidden card over and play its hand out.
 */
function dealerShouldHit(hand) {
  // TODO: return whether the dealer's total is still under 17.
  return false;
}

/**
 * Has this hand gone past 21?
 *
 * Gentle hint: you already have a function that adds a hand up.
 * Stronger hint: a comparison is already true or false, so you do not
 *   need an if.
 * Answer if you want it: return handTotal(hand) > BUST_AT;
 *
 * Use BUST_AT, not 21. The name says why the number is there, and if the
 * rule ever changed there would be one place to change it.
 *
 * You can watch this one work without writing another line. Press Stand
 * straight away on a low hand, a few deals in a row. The dealer has to
 * keep taking cards until it reaches 17, so before long it will sail
 * past 21 — and the moment it does, its total turns red and says bust.
 * Until this function works, a dealer on 24 looks exactly like a dealer
 * on 20, which is how a game ends up paying out the wrong player.
 */
function isBust(hand) {
  // TODO: return whether this hand is over 21.
  return false;
}

/**
 * Who won? Return one of exactly three pieces of text:
 *   "player", "dealer" or "push"   ("push" means a draw — nobody wins)
 *
 * The cases, in this order:
 *   1. You went bust             -> "dealer" (even if the dealer also went bust)
 *   2. The dealer went bust      -> "player"
 *   3. Your total is higher      -> "player"
 *   4. The dealer's is higher    -> "dealer"
 *   5. The totals are equal      -> "push"
 *
 * The order matters. Case 1 has to come first, because a burst hand
 * loses even if its number is bigger — that is the whole point of
 * bursting. Get the order wrong and the game will hand you wins you did
 * not earn, which is the least fun kind of bug.
 *
 * Gentle hint: you have isBust and handTotal already. Read the five
 *   cases as five lines, from the top.
 * Stronger hint: an early `return` inside a function stops it dead, so
 *   each case can be one line and none of them need an `else`.
 * Answer if you want it:
 *     if (isBust(playerHand)) return "dealer";
 *     if (isBust(dealerHand)) return "player";
 *     if (handTotal(playerHand) > handTotal(dealerHand)) return "player";
 *     if (handTotal(playerHand) < handTotal(dealerHand)) return "dealer";
 *     return "push";
 *
 * This one reads the memory directly instead of taking a hand, because
 * it is about the round rather than about one pile of cards.
 *
 * settleRound, in the wiring, calls this and puts the answer on the
 * plaque in the middle of the table.
 */
function decideWinner() {
  // TODO: return "player", "dealer" or "push".
  return "";
}

/**
 * Take one card, and end the round if it burst the hand. This runs every
 * time the red Hit chip is pressed.
 *
 * Three jobs, in this order:
 *   1. Take the top card off the deck with drawCard() and push it onto
 *      the end of playerHand.
 *   2. Call render() so the new card appears.
 *   3. If playerHand is now bust, move phase to "finished" and call
 *      settleRound(). Standing is not the only way a round can end.
 *
 * Gentle hint: handleStand, a little way down in the wiring, is the same
 *   shape as this and is already written. Read it first.
 * Stronger hint: phase is just a variable holding a piece of text.
 *   Changing the round from your turn to over is one line:
 *   phase = "finished";
 * Answer if you want it:
 *     playerHand.push(drawCard());
 *     render();
 *     if (isBust(playerHand)) {
 *       phase = "finished";
 *       settleRound();
 *     }
 *
 * drawCard() takes the top card off the deck and hands it to you — it
 * removes it, so the same card can never come out twice. render()
 * repaints the whole table from the four variables. settleRound() works
 * out who won, shows the plaque and plays the sound. All three are
 * already written for you.
 *
 * Notice you never touch the chip buttons here. render() switches them
 * on and off by looking at phase, so setting phase is the only thing you
 * have to get right.
 */
function handleHit() {
  // TODO: do the three jobs listed above.
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is deliberately finished. It deals the cards, paints the
   table from memory, runs the dealer, and starts each round. Read it —
   it shows how your eight functions get used — but leave it alone.
   --------------------------------------------------------------------- */

let statusMessage = "";
let holeHidden = true;          // is the dealer's second card still face down?
let holeWasHidden = true;       // was it face down on the previous render?
let flippedThisRender = false;  // true for the one render that turns it over
let dealtCounts = { player: 0, dealer: 0 };
let dealerTimer = null;

const dealerHandEl = document.getElementById("dealerHand");
const playerHandEl = document.getElementById("playerHand");
const dealerTotalEl = document.getElementById("dealerTotal");
const playerTotalEl = document.getElementById("playerTotal");
const deckCountEl = document.getElementById("deckCount");
const ribbonEl = document.getElementById("ribbon");
const phaseEl = document.getElementById("phase");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const dealBtn = document.getElementById("deal");

const PHASE_LABELS = {
  dealing: "Dealing",
  playerTurn: "Your turn",
  dealerTurn: "Dealer's turn",
  finished: "Round over"
};

/* The sounds. One Audio element is made for each, once, and reused —
   calling play() again just restarts it from the beginning. */
const shuffleSound = new Audio("assets/shuffle.wav");
const dealSound = new Audio("assets/deal.wav");
const winSound = new Audio("assets/win.wav");
const loseSound = new Audio("assets/lose.wav");
const pushSound = new Audio("assets/push.wav");

function playSound(sound) {
  sound.currentTime = 0;
  // Browsers refuse to play sound before the first real click on the
  // page. .catch swallows that harmless refusal instead of logging it.
  sound.play().catch(() => {});
}

/* Takes the top card off the deck and hands it back. `pop` removes the
   last item of an array and returns it, so a card that has been dealt is
   no longer in the deck and cannot come out a second time. */
function drawCard() {
  if (deck.length === 0) return null;
  return deck.pop();
}

function revealHoleCard() {
  holeHidden = false;
}

/* --- Painting the table --- */

function render() {
  // Notice the single moment the hole card turns over, so it can be
  // animated, then forget it again.
  flippedThisRender = holeWasHidden && !holeHidden;
  holeWasHidden = holeHidden;
  renderHand(dealerHandEl, dealerHand, "dealer", holeHidden);
  renderHand(playerHandEl, playerHand, "player", false);
  renderTotals();
  renderShoe();
  renderRibbon();
  renderPhase();
  renderStatus();
  renderActions();
  flippedThisRender = false;
}

function makeCardSlot(card, faceDown) {
  const slot = document.createElement("div");
  slot.className = "card-slot";
  const el = document.createElement("div");
  el.className = "card";
  if (faceDown) {
    el.classList.add("back");
    el.setAttribute("aria-label", "a face-down card");
  } else {
    if (card.suit.colour === "red") el.classList.add("red");
    const corner = document.createElement("span");
    corner.className = "corner";
    corner.innerHTML = card.rank + "<span class='s'>" + card.suit.symbol + "</span>";
    const pip = document.createElement("span");
    pip.className = "pip";
    pip.textContent = card.suit.symbol;
    el.append(corner, pip);
    el.setAttribute("aria-label", card.rank + " of " + card.suit.name);
  }
  slot.appendChild(el);
  const worth = document.createElement("span");
  worth.className = "worth";
  // The little line under each card is your cardValue, shown out loud.
  worth.textContent = faceDown ? " " : "worth " + cardValue(card);
  slot.appendChild(worth);
  return slot;
}

function renderHand(el, hand, seat, hideSecond) {
  const alreadyShown = dealtCounts[seat];
  el.textContent = "";
  hand.forEach((card, index) => {
    if (!card) return;                       // a gap can only appear mid-deal
    const faceDown = hideSecond && index === 1;
    const slot = makeCardSlot(card, faceDown);
    if (index >= alreadyShown) slot.classList.add("dealing");
    else if (seat === "dealer" && index === 1 && !faceDown && flippedThisRender) {
      slot.classList.add("flipping");
    }
    el.appendChild(slot);
  });
  dealtCounts[seat] = hand.length;
}

/* A total, plus the word "bust" when your isBust says the hand is dead. */
function showTotal(el, hand) {
  const dead = isBust(hand);
  el.textContent = handTotal(hand) + (dead ? " — bust" : "");
  el.classList.toggle("bust", dead);
}

function renderTotals() {
  if (playerHand.length) showTotal(playerTotalEl, playerHand);
  else { playerTotalEl.textContent = ""; playerTotalEl.classList.remove("bust"); }
  if (!dealerHand.length) {
    dealerTotalEl.textContent = "";
    dealerTotalEl.classList.remove("bust");
  } else if (holeHidden) {
    // Hidden information: with a card face down, only the up card counts.
    dealerTotalEl.textContent = handTotal(dealerHand.slice(0, 1)) + " + ?";
    dealerTotalEl.classList.remove("bust");
  } else {
    showTotal(dealerTotalEl, dealerHand);
  }
}

function renderShoe() {
  deckCountEl.textContent = String(deck.length);
}

/* One tick per card still in the deck, in the order they will come out.
   Colour comes from the suit, and a suit's colour changes nothing in
   blackjack — so this shows you the shuffle without giving anything
   away. */
function renderRibbon() {
  ribbonEl.textContent = "";
  const width = 520 / 52;
  deck.forEach((card, index) => {
    const tick = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    tick.setAttribute("x", String(index * width + 0.8));
    tick.setAttribute("y", "4");
    tick.setAttribute("width", String(width - 1.6));
    tick.setAttribute("height", "26");
    tick.setAttribute("rx", "1.4");
    tick.setAttribute("fill", card.suit.colour === "red" ? "#b3312b" : "#23272b");
    ribbonEl.appendChild(tick);
  });
}

function renderPhase() {
  phaseEl.innerHTML = "";
  const label = document.createElement("span");
  label.textContent = "phase";
  const value = document.createElement("b");
  value.textContent = PHASE_LABELS[phase] || phase;
  phaseEl.append(label, value);
}

function renderStatus() {
  statusEl.textContent = statusMessage;
  statusEl.classList.toggle("bad", statusMessage.startsWith("Fill in"));
}

function renderActions() {
  const myTurn = phase === "playerTurn";
  hitBtn.disabled = !myTurn || deck.length === 0;
  standBtn.disabled = !myTurn;
  dealBtn.disabled = phase === "dealing" || phase === "dealerTurn";
}

/* --- Running a round --- */

/* The other half of handleHit, written out as an example. Standing ends
   your turn, turns the dealer's hidden card over, and hands the round to
   the dealer. */
function handleStand() {
  phase = "dealerTurn";
  revealHoleCard();
  render();
  runDealerTurn();
}

/* The dealer takes one card every 700ms so you can watch it happen,
   asking your dealerShouldHit before each one. */
function runDealerTurn() {
  clearTimeout(dealerTimer);
  dealerTimer = setTimeout(() => {
    if (phase !== "dealerTurn") return;
    if (dealerShouldHit(dealerHand) && deck.length > 0) {
      dealerHand.push(drawCard());
      playSound(dealSound);
      render();
      runDealerTurn();
    } else {
      phase = "finished";
      settleRound();
    }
  }, 700);
}

function settleRound() {
  revealHoleCard();
  const winner = decideWinner();
  if (winner === "player") {
    resultEl.textContent = isBust(dealerHand) ? "Dealer bust — you win" : "You win";
    resultEl.className = "t-result win";
    playSound(winSound);
  } else if (winner === "dealer") {
    resultEl.textContent = isBust(playerHand) ? "Bust — dealer wins" : "Dealer wins";
    resultEl.className = "t-result lose";
    playSound(loseSound);
  } else if (winner === "push") {
    resultEl.textContent = "Push — nobody wins";
    resultEl.className = "t-result";
    playSound(pushSound);
  } else {
    resultEl.textContent = "Fill in STUB 7 to find out who won";
    resultEl.className = "t-result";
  }
  resultEl.hidden = false;
  statusMessage = "Press New deal to play again.";
  render();
}

function startRound() {
  clearTimeout(dealerTimer);
  deck = buildDeck();
  shuffleDeck(deck);
  playerHand = [];
  dealerHand = [];
  holeHidden = true;
  holeWasHidden = true;
  dealtCounts = { player: 0, dealer: 0 };
  resultEl.hidden = true;

  if (deck.length < 4) {
    phase = "finished";
    statusMessage = "Fill in STUB 1 in blackjack.js!";
    render();
    return;
  }

  phase = "dealing";
  statusMessage = "";
  playSound(shuffleSound);
  render();

  // Two cards each, one at a time, the way a real dealer does it.
  const order = [playerHand, dealerHand, playerHand, dealerHand];
  order.forEach((hand, step) => {
    setTimeout(() => {
      hand.push(drawCard());
      playSound(dealSound);
      if (step === order.length - 1) {
        phase = "playerTurn";
        statusMessage = "Hit for another card, or stand to stop.";
      }
      render();
    }, 260 * (step + 1));
  });
}

/* The arrows matter: they look your function up at the moment of the
   click, so a chip keeps working however you choose to write its
   function. Handing the name straight to addEventListener would freeze
   whichever version existed when the page loaded. */
hitBtn.addEventListener("click", () => handleHit());
standBtn.addEventListener("click", () => handleStand());
dealBtn.addEventListener("click", () => startRound());

/* Typing a #demo hash onto an already-open page only changes the address;
   the script does not run again. Reloading makes the demos work whether
   you edit the address bar or open the link fresh. */
window.addEventListener("hashchange", () => location.reload());

/* Demo states keep the finished look inspectable before the stubs are
   filled in. The cards and totals are drawn from buildDeck, cardValue
   and handTotal, so the demo needs working ones — these stand-ins are
   for the picture only, never for the game. */
if (["#demo", "#demo-win", "#demo-lose", "#demo-bust"].includes(location.hash)) {
  const demoSuits = { S: SUITS[0], H: SUITS[1], D: SUITS[2], C: SUITS[3] };
  const card = (rank, suit) => ({ rank: rank, suit: demoSuits[suit] });

  if (buildDeck().length !== 52) {
    buildDeck = () => SUITS.flatMap((suit) => RANKS.map((rank) => ({ rank, suit })));
  }
  if (cardValue(card("K", "S")) !== 10) {
    cardValue = (c) => (c.rank === "A" ? 11 : "JQK".includes(c.rank) ? 10 : Number(c.rank));
  }
  if (handTotal([card("A", "S"), card("K", "H")]) !== 21) {
    handTotal = (hand) => {
      let total = 0, aces = 0;
      for (const c of hand) { total += cardValue(c); if (c.rank === "A") aces += 1; }
      while (total > BUST_AT && aces > 0) { total -= 10; aces -= 1; }
      return total;
    };
  }
  if (isBust([card("K", "S"), card("Q", "H"), card("5", "D")]) !== true) {
    isBust = (hand) => handTotal(hand) > BUST_AT;
  }

  deck = buildDeck();
  shuffleDeck(deck);
  if (deck[0] === deck[1] || deck.slice(0, 13).every((c) => c.suit === deck[0].suit)) {
    shuffleDeck = (cards) => {
      for (let i = cards.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    };
    shuffleDeck(deck);
  }
  deck.length = 38;                           // as if a few hands had been played
  playerHand = [card("A", "S"), card("7", "H")];
  dealerHand = [card("9", "D"), card("4", "C")];
  phase = "playerTurn";
  statusMessage = "Hit for another card, or stand to stop.";

  if (location.hash === "#demo-win") {
    playerHand = [card("K", "S"), card("9", "H")];
    dealerHand = [card("10", "D"), card("7", "C")];
    phase = "finished";
    holeHidden = false;
    resultEl.textContent = "You win";
    resultEl.className = "t-result win";
    resultEl.hidden = false;
    statusMessage = "Press New deal to play again.";
  }
  if (location.hash === "#demo-lose") {
    playerHand = [card("8", "S"), card("9", "H")];
    dealerHand = [card("10", "D"), card("9", "C")];
    phase = "finished";
    holeHidden = false;
    resultEl.textContent = "Dealer wins";
    resultEl.className = "t-result lose";
    resultEl.hidden = false;
    statusMessage = "Press New deal to play again.";
  }
  if (location.hash === "#demo-bust") {
    playerHand = [card("K", "S"), card("Q", "H"), card("5", "D")];
    dealerHand = [card("10", "D"), card("6", "C")];
    phase = "finished";
    holeHidden = false;
    resultEl.textContent = "Bust — dealer wins";
    resultEl.className = "t-result lose";
    resultEl.hidden = false;
    statusMessage = "Press New deal to play again.";
  }
  holeWasHidden = holeHidden;
  render();
} else {
  startRound();
}
