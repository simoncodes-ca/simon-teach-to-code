# Simon & Anna's Calculator

A calculator that runs in your browser. It adds, subtracts, multiplies and divides, and it keeps a list of everything you typed in the tall column beside it.

The page has two looks. Simon's is a steel plate bolted to a concrete wall. Anna's is a white plate on a pink wall. The switch under the title changes between them. That part already works.

Your job is the thinking. The page and its looks are finished. The calculator's brain is not.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `calculator.html` | Builds the page: every box and every key | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `calculator.js` | What happens when a key is pressed | You |

Double-click `calculator.html` to open the calculator in your browser. After you change `calculator.js`, save the file and refresh the browser page to see the change.

Inside `calculator.js` you will find empty functions with `// TODO` in them. Work through them in the order listed at the top of the file. Each one is a small puzzle.

## What you will learn

- How a web page is built from boxes (HTML)
- How boxes get their looks (CSS)
- How JavaScript finds a box on the page and changes it while you watch
- How a program remembers things between button presses
- The difference between the text `"12"` and the number `12`, and the classic bug it causes
- How to hunt down your own mistakes with `console.log`

## Good to know

### The page is made of boxes

HTML is a set of instructions that builds the page. Each instruction creates one box, called an element. The two kinds you will meet here:

- `<div>` — a plain box. Panels, lines and keypads are divs.
- `<span>` — a small piece of text that sits inside a box.

One line of the calculator's HTML looks like this:

```html
<div class="readout" id="display">0</div>
```

That line makes one box. Its class is `readout`, its name tag says `display`, and the words inside it are `0`. That box is the calculator's screen.

### id: a name tag

An id is like a name tag pinned to one element. No two elements may share an id, so an id always points at exactly one thing.

The calculator already wears these name tags:

- `display` — the big number at the top of the calculator
- `buffer` — the tall column beside the calculator
- `buffer-empty` — the "Nothing entered yet" message inside the column
- Every key: `btn-0` to `btn-9`, `btn-decimal`, `btn-add`, `btn-subtract`, `btn-multiply`, `btn-divide`, `btn-equals`, `btn-clear`

### class: a sticker that CSS reads

A class is a sticker stuck on an element. Many elements can wear the same sticker. One element can wear several stickers at once. The stylesheet reads the stickers and decides how each element looks.

The stickers that matter for the column:

- `buffer__line` — one line in the column. Each thing the user types becomes one line.
- `buffer__line--operator` — an extra sticker for a line holding `+ - * /`. It colours the line pink.
- `buffer__line--active` — an extra sticker for the line being typed right now. Optional.

### Variables: the program's memory

A variable is a labelled box that holds a value. Put a value in and it stays there until you replace it.

```js
let current = "12";   // make a box called current, put "12" in it
current = "123";      // take the old value out, put "123" in
```

`let` makes a box whose contents can change. `const` makes one that cannot be replaced. Values come in types:

- Text, called a string: `"12"` — the quotes are the clue
- Numbers: `12`
- Booleans, which are yes/no values: `true` or `false`

Two containers are useful for this project.

An object is like a backpack with labelled pockets:

```js
const calculator = {
  left: "",       // pocket for the number typed before the operator
  operator: "",   // pocket for the operator waiting to be used
};

calculator.left = "12";   // put "12" in the left pocket
```

An array is a numbered list that keeps its order:

```js
const entered = [];       // an empty list
entered.push("12");       // add to the end. Now: ["12"]
entered.push("+");        // now: ["12", "+"]
entered[0];               // the first item: "12"
entered.length;           // how many items: 2
```

### Functions: recipes with a name

A function is a recipe. Give it a name, write the steps once, then call it by name whenever you want those steps to run.

```js
function greet(name) {
  return "Hello, " + name;
}

greet("Anna");   // gives back "Hello, Anna"
```

- `name` is a parameter: a value the caller hands in through the brackets.
- `return` hands a value back to whoever called the function.
- Some functions return nothing. They just do things, like writing on the screen.

### Decisions: if and else

Programs choose. `if` runs steps only when a question is true. `else` runs different steps when it is false.

```js
if (current === "0") {
  current = digit;             // replace a lonely 0 instead of stacking onto it
} else {
  current = current + digit;   // glue the new digit onto the end
}
```

Three equals signs, `===`, ask "are these exactly equal?". One equals sign, `=`, puts a value into a variable. Mixing those two up is the classic beginner bug.

### Changing the page from JavaScript

The browser keeps a live list of everything on the page. JavaScript can read that list and change it. These are the tools. `document` means "the whole page".

```js
const screen = document.getElementById("display");
// find the element whose name tag is "display"

screen.textContent = "12";
// replace the words inside it

screen.classList.add("buffer__line--operator");
// stick an extra sticker on it

screen.classList.remove("buffer__line--operator");
// peel the sticker off again

const line = document.createElement("div");
// make a brand new, empty div. It is not on the page yet.

line.textContent = "12";
line.classList.add("buffer__line");

screen.append(line);
// put the new line inside screen, at the bottom

screen.replaceChildren();
// remove everything inside screen. The box itself stays.
```

### Text and numbers are different

This is the one that bites every calculator.

Joining strings with `+` glues them together. That is exactly what you want while someone types a number:

```js
"1" + "2"   // gives "12", not 3. Gluing is what typing needs.
```

But gluing is wrong when it is time to do the maths:

```js
"12" + "3"   // gives "123". Not 15. Not 9. A three-digit surprise.
```

`Number()` turns a string of digits into a real number:

```js
Number("12") + Number("3")   // gives 15
```

`calculate()` receives its two values as strings, so converting them is part of its job.

One more surprise: dividing by zero in JavaScript does not crash and does not show an error. It quietly produces `Infinity`. What should the person using the calculator see instead? That decision is yours, inside one of the TODOs.

### Finding your mistakes

Open the console: right-click the page, choose Inspect, then click the Console tab.

- Anything you print with `console.log("current is", current);` appears there.
- Mistakes appear there too, in red, with a file name and a line number. Read them. They are more helpful than they look.

When a function misbehaves, put a `console.log` inside it. Print the value you are unsure about, refresh the page, press a key, and see what the function really received.

### Already done for you

The bottom of `calculator.js` is finished wiring. Read it, but leave it alone.

- An object called `BUTTONS` has one pocket per key id. Each pocket holds the function to run when that key is clicked.
- An object called `KEYS` maps keyboard keys — `0`–`9`, `.`, `+ - * x /`, `Enter`, `Escape`, `c` — onto the same buttons, so typing on the keyboard works too.
- When a key runs, `activate()` also flashes the keycap on screen. It sets `data-pressed` on the button, and the stylesheet sinks the cap down while that is set.

So you never need to write "when this button is clicked, call my function". The wiring does that. You only write what each button does.
