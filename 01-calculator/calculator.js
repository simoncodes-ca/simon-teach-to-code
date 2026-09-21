/* =====================================================================
   Simon's Calculator — the brain.

   Right now this file is a skeleton. Every function below has a name,
   a description of the job it has to do, and some questions to think
   about. None of them actually do anything yet. That part is yours.

   The page is already finished: calculator.html holds the markup and
   styles.css holds the look. You never need to edit either of them.
   The page gives you buttons with names (ids) that you can find from
   here, and this file is where all the thinking happens.

   A good order to work in:
     1. add the four memory values
     2. showOnDisplay  — get a number onto the screen
     3. renderBuffer   — show the working out in the column
     4. pressDigit          — enter a digit
     5. pressDecimal        — enter a decimal point
     6. pressOperator       — remember + - x /
     7. calculate           — do the maths
     8. pressEquals         — show the answer
     9. pressClear          — start over
    10. init                — connect the controls
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   A calculator has to remember things between button presses. When you
   press 1, then 2, it shows 12 — so something remembered the 1.

   Think about what it needs to remember:
     - the number being typed right now
     - the number typed before it, if there was one
     - which operator is waiting to be used
     - whether the next digit should start a brand new number
       (after you press = or an operator, the next digit starts fresh)

   Add those below as you work out that you need them.
   --------------------------------------------------------------------- */

const calculator = {
  // TODO: add current, left, operator, and startNew.
  // Gentle hint: current begins as '0'; the other two text values begin empty.
  // Stronger hint: startNew begins true so the first digit replaces the zero.
  // Stuck? The answer key is at the bottom of this file.
};


/* Everything the user has entered, in order, for the buffer column to
   show — one line per item, top to bottom.
   Example: after typing 12 + 8 this might hold: ['12', '+', '8'] */
const entered = [];


/* ---------------------------------------------------------------------
   2. SHOWING THINGS

   These two put things on the screen. Nothing else in this file should
   touch the page directly — if a function wants something shown, it
   calls one of these. That way there is only one place to look when the
   screen is wrong.
   --------------------------------------------------------------------- */

/**
 * Put a value into the big number at the top of the card.
 *
 * The element you want is the one with id 'display'.
 * Look up: document.getElementById  and  .textContent
 *
 * @param {string} value  what to show, for example '12' or '0'
 */
function showOnDisplay(value) {
  // TODO: put value into the display element.
  // Gentle hint: find the element whose id is 'display'.
  // Stronger hint: give that element the value through its textContent.
  // Stuck? The answer key is at the bottom of this file.
}

/**
 * Redraw the buffer column so it matches the `entered` array.
 *
 * The column is the element with id 'buffer' — the tall panel standing
 * beside the calculator. It is always visible. Each thing in `entered`
 * becomes its own LINE inside it, stacked top to bottom in the order
 * it was typed.
 *
 * A line is a <div> with the class 'buffer__line'. Operators get an
 * extra class, 'buffer__line--operator', which colours them pink.
 * There is also 'buffer__line--active' for the term being typed right
 * now, if you want to show that.
 *
 * Questions to think about:
 *   - How do you empty the column before you refill it?
 *   - How do you tell a number apart from an operator?
 *   - What should it show when nothing has been entered yet?
 *     (there is already a "Nothing entered yet" span with the id
 *      'buffer-empty' — you could keep it, or replace it)
 *   - If the list gets longer than the panel, what should happen?
 *     (the panel already scrolls; is scrolling enough?)
 *
 * Look up: document.createElement, element.append, element.classList,
 * element.replaceChildren   (given no arguments, it empties the element)
 */
function renderBuffer() {
  // TODO: rebuild the buffer from entered.
  // Gentle hint: clear the buffer, then make one line for each item.
  // Stronger hint: create a div, set its text, add buffer__line, and append it.
  // Stuck? The answer key is at the bottom of this file.
}


/* ---------------------------------------------------------------------
   3. WHAT HAPPENS WHEN A KEY IS PRESSED

   Each of these is called when the user presses one kind of key. They
   are the interesting part. Take them one at a time.
   --------------------------------------------------------------------- */

/**
 * A number key (0-9) was pressed.
 *
 * Usually this adds the digit onto the end of the number being typed.
 * But not always — think about these cases:
 *   - the display shows 0 and you press 5. Should it show 05 or 5?
 *   - you just pressed +. The next digit should start a NEW number,
 *     not get stuck on the end of the old one.
 *
 * @param {string} digit  a single character, '0' through '9'
 */
function pressDigit(digit) {
  // TODO: add this digit to the number being typed.
  // Gentle hint: use calculator.current and calculator.startNew.
  // Stronger hint: replace the starting zero or old answer; otherwise join the digit, then call showOnDisplay.
  // Stuck? The answer key is at the bottom of this file.
}

/**
 * The decimal point was pressed.
 *
 * Mostly the same as pressDigit, with one extra rule:
 *   - what should happen if the number already has a point in it?
 *     3.1.4 is not a number.
 *
 * Look up: string.includes
 */
function pressDecimal() {
  // TODO: add one decimal point when the current number has none.
  // Gentle hint: treat a fresh number like pressDigit does, then inspect its text.
  // Stronger hint: use includes('.') to reject a second point, then call showOnDisplay.
  // Stuck? The answer key is at the bottom of this file.
}

/**
 * An operator key was pressed: + - x or /
 *
 * This one is trickier than it looks, because pressing an operator does
 * not do the maths — it gets ready to.
 *
 * Think about:
 *   - where does the number currently on screen need to be put, so it
 *     is not lost when the user starts typing the next one?
 *   - what if there is ALREADY a waiting number and operator?
 *     (try 2 + 3 + on a real calculator and watch what the screen does)
 *   - what if the user presses + and then changes their mind and
 *     presses - instead?
 *
 * @param {string} operator  one of '+', '-', '*', '/'
 */
function pressOperator(operator) {
  // TODO: remember the number and the operator.
  // Gentle hint: save the current text with entered.push before you start a new number.
  // Stronger hint: if a new number has started, call pressEquals; otherwise replace the waiting operator, then call renderBuffer.
  // Stuck? The answer key is at the bottom of this file.
}

/**
 * Actually do the arithmetic.
 *
 * This is the only function here that does maths, and it is the easiest
 * one to test: give it two numbers and an operator, check what comes back.
 *
 * Think about:
 *   - the two values arrive as text ('12'), not as numbers (12).
 *     '12' + '3' is '123' in JavaScript, which is not what you want.
 *     Look up: Number()  or  parseFloat()
 *   - dividing by zero. JavaScript will happily hand you Infinity.
 *     What should the person using the calculator see instead?
 *
 * @param   {string} left      the number entered first
 * @param   {string} operator  '+', '-', '*' or '/'
 * @param   {string} right     the number entered second
 * @returns {string}           the answer, ready to show
 */
function calculate(left, operator, right) {
  // TODO: convert the two text values, then apply the chosen operator.
  // Gentle hint: use a separate case for '+', '-', '*', and '/'.
  // Stronger hint: use Number() for the inputs, guard division by zero, and use String() for each answer.
  // Stuck? The answer key is at the bottom of this file.
}

/**
 * The equals key was pressed. Work out the answer and show it.
 *
 * Think about:
 *   - what do you need in memory before this can work at all?
 *   - what should happen if the user presses = with nothing waiting?
 *   - after showing the answer, what should the next digit typed do?
 *
 * Do the actual arithmetic in calculate() above, not in here. This
 * function's job is deciding WHEN to calculate; that one's job is HOW.
 */
function pressEquals() {
  // TODO: calculate only when a left value and operator are ready.
  // Gentle hint: check the memory before calling calculate.
  // Stronger hint: call calculate, save its answer with entered.push, then call showOnDisplay and renderBuffer.
  // Stuck? The answer key is at the bottom of this file.
}

/**
 * The clear key was pressed. Everything goes back to how it started.
 *
 * Think about: what counts as "everything"? The display, the memory,
 * and the buffer are three separate things. Missing one is the most
 * common bug in a calculator.
 */
function pressClear() {
  // TODO: restore every piece of memory and both visible areas.
  // Gentle hint: clear the calculator object, entered, display, and buffer.
  // Stronger hint: use the same starting values as the memory answer key, then call showOnDisplay and renderBuffer.
  // Stuck? The answer key is at the bottom of this file.
}

/** Set the calculator up when the page has finished loading. */
function init() {
  registerClickHandlers();
  registerKeyHandler();

  // TODO: put the calculator into its starting state.
  // Gentle hint: use pressClear after the handlers are ready.
  // Stronger hint: the clear action already knows how to reset memory and the page.
  // Stuck? The answer key is at the bottom of this file.
}

/* ---------------------------------------------------------------------
   4. WIRING IT UP

   The functions above will never run on their own. Something has to
   listen for the user pressing a button and then call the right one.
   That is what this section does.

   This wiring is already sketched out for you, because it is fiddly and
   it is not the interesting part. Read it, but the TODOs above are the
   real work.
   --------------------------------------------------------------------- */

/* Which button id goes with which action.
   The page gives every button an id, and this is the list of them. */
const BUTTONS = {
  'btn-0': () => pressDigit('0'),
  'btn-1': () => pressDigit('1'),
  'btn-2': () => pressDigit('2'),
  'btn-3': () => pressDigit('3'),
  'btn-4': () => pressDigit('4'),
  'btn-5': () => pressDigit('5'),
  'btn-6': () => pressDigit('6'),
  'btn-7': () => pressDigit('7'),
  'btn-8': () => pressDigit('8'),
  'btn-9': () => pressDigit('9'),
  'btn-decimal':  () => pressDecimal(),
  'btn-add':      () => pressOperator('+'),
  'btn-subtract': () => pressOperator('-'),
  'btn-multiply': () => pressOperator('*'),
  'btn-divide':   () => pressOperator('/'),
  'btn-equals':   () => pressEquals(),
  'btn-clear':    () => pressClear()
};

/* Which key on the keyboard does the same thing as which button.
   Notice that several keys can point at the same button: Enter and =
   both mean equals, Escape and c both mean clear. */
const KEYS = {
  '0': 'btn-0', '1': 'btn-1', '2': 'btn-2', '3': 'btn-3', '4': 'btn-4',
  '5': 'btn-5', '6': 'btn-6', '7': 'btn-7', '8': 'btn-8', '9': 'btn-9',
  '.': 'btn-decimal',
  '+': 'btn-add',
  '-': 'btn-subtract',
  '*': 'btn-multiply', 'x': 'btn-multiply', 'X': 'btn-multiply',
  '/': 'btn-divide',
  '=': 'btn-equals', 'Enter': 'btn-equals',
  'Escape': 'btn-clear', 'c': 'btn-clear', 'C': 'btn-clear'
};

/* The click sound. One Audio element is made once and reused for
   every press; calling play() again just restarts it, so fast
   typing still hears one click per press. */
const clickSound = new Audio('assets/click.wav');

function playClickSound() {
  clickSound.currentTime = 0;
  // Some browsers refuse to play before the first real interaction;
  // .catch swallows that harmless refusal instead of logging an error.
  clickSound.play().catch(() => {});
}


/**
 * Run the action for a button id, play the click sound, and make
 * the tile look pressed.
 *
 * @param {string} id  a button id, for example 'btn-7'
 */
function activate(id) {
  const action = BUTTONS[id];
  if (!action) return;

  playClickSound();
  action();

  // Flash the tile so a key press looks the same as a click.
  const tile = document.getElementById(id);
  if (!tile) return;
  tile.dataset.pressed = 'true';
  setTimeout(() => delete tile.dataset.pressed, 90);
}

/** Listen for clicks on every button. */
function registerClickHandlers() {
  Object.keys(BUTTONS).forEach((id) => {
    const button = document.getElementById(id);
    if (button) button.addEventListener('click', () => activate(id));
  });
}

/** Listen for the keyboard. */
function registerKeyHandler() {
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const id = KEYS[event.key];
    if (!id) return;

    // Stop the browser doing its own thing with the key, such as
    // scrolling or re-triggering the button that currently has focus.
    event.preventDefault();
    activate(id);
  });
}

document.addEventListener('DOMContentLoaded', init);

/* ---------------------------------------------------------------------
   5. THE ANSWER KEY

   Try the functions first. The key is here when you want to check one.
   The memory comes first, then the functions in the order above.
   ---------------------------------------------------------------------

   --- calculator memory ---

     current: '0',
     left: '',
     operator: '',
     startNew: true

   --- showOnDisplay(value) ---

     document.getElementById('display').textContent = value;

   --- renderBuffer() ---

     const buffer = document.getElementById('buffer');
     buffer.replaceChildren();
     for (const item of entered) {
       const line = document.createElement('div');
       line.textContent = item;
       line.classList.add('buffer__line');
       if (item === '+' || item === '-' || item === '*' || item === '/') {
         line.classList.add('buffer__line--operator');
       }
       buffer.append(line);
     }

   --- pressDigit(digit) ---

     if (calculator.startNew || calculator.current === '0') {
       calculator.current = digit;
       calculator.startNew = false;
     } else {
       calculator.current += digit;
     }
     showOnDisplay(calculator.current);

   --- pressDecimal() ---

     if (calculator.startNew) {
       calculator.current = '0';
       calculator.startNew = false;
     }
     if (!calculator.current.includes('.')) calculator.current += '.';
     showOnDisplay(calculator.current);

   --- pressOperator(operator) ---

     if (calculator.operator && calculator.startNew) {
       calculator.operator = operator;
       entered[entered.length - 1] = operator;
       renderBuffer();
       return;
     }
     if (calculator.operator && calculator.left !== '') pressEquals();
     calculator.left = calculator.current;
     calculator.operator = operator;
     calculator.startNew = true;
     entered.push(calculator.left, operator);
     renderBuffer();

   --- calculate(left, operator, right) ---

     const a = Number(left);
     const b = Number(right);
     if (operator === '/' && b === 0) return 'Cannot divide by 0';
     if (operator === '+') return String(a + b);
     if (operator === '-') return String(a - b);
     if (operator === '*') return String(a * b);
     if (operator === '/') return String(a / b);
     return '0';

   --- pressEquals() ---

     if (!calculator.operator || calculator.left === '') return;
     const answer = calculate(calculator.left, calculator.operator, calculator.current);
     calculator.current = answer;
     calculator.left = '';
     calculator.operator = '';
     calculator.startNew = true;
     entered.push(answer);
     showOnDisplay(answer);
     renderBuffer();

   --- pressClear() ---

     calculator.current = '0';
     calculator.left = '';
     calculator.operator = '';
     calculator.startNew = true;
     entered.length = 0;
     showOnDisplay(calculator.current);
     renderBuffer();

   --- init() ---

     pressClear();

   --------------------------------------------------------------------- */
