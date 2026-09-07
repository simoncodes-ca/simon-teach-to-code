# Simon & Anna's Calculator

A calculator that runs in your browser. It adds, subtracts, multiplies and divides. It also keeps a list of everything you typed, in the tall column beside it.

The page has two looks. Simon's look is a steel plate on a concrete wall. Anna's look is a white plate on a pink wall. The switch under the title changes between them. That part already works.

The page is finished. The way it looks is finished. What the calculator does is your job.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `calculator.html` | Builds the page: every box and every key | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `calculator.js` | What happens when a key is pressed | You |

Double-click `calculator.html` to open the calculator in your browser. After you change `calculator.js`, save the file. Then refresh the browser page to see your change.

Inside `calculator.js` you will find empty functions marked `// TODO`. Write them in the order listed at the top of the file. Each one is a small puzzle.

## What you will learn

- How a web page is built from boxes, using HTML
- How those boxes get their looks, using CSS
- How JavaScript finds a box on the page and changes it while you watch
- How a program remembers things between button presses
- Why the text `"12"` and the number `12` are different, and what goes wrong when you confuse them
- How to find your own mistakes with `console.log`

## Good to know

### The page is made of boxes

HTML is a set of instructions that builds the page. Each instruction creates one box. A box is called an element.

You will meet two kinds of element here:

- `<div>` is a plain box. Panels, lines and the keypad are all divs.
- `<span>` is a small piece of text that sits inside a box.

One line of the calculator's HTML looks like this:

```html
<div class="readout" id="display">0</div>
```

That line makes one box. Its class is `readout`. Its id is `display`. The text inside it is `0`. That box is the calculator's screen.

### id: a name for one element

An id is a name for one element. Two elements must never share an id. So an id always points to exactly one element.

The calculator already has these ids:

- `display` is the big number at the top of the calculator.
- `buffer` is the tall column beside the calculator.
- `buffer-empty` is the "Nothing entered yet" message inside that column.
- Every key has one: `btn-0` to `btn-9`, `btn-decimal`, `btn-add`, `btn-subtract`, `btn-multiply`, `btn-divide`, `btn-equals` and `btn-clear`.

### class: a label that CSS reads

A class is a label on an element. Many elements can share one class. One element can carry several classes at once. The stylesheet reads the classes and decides how each element looks.

Three classes matter for the column:

- `buffer__line` marks one line in the column. Each thing the user types becomes one line.
- `buffer__line--operator` is an extra class for a line that holds `+`, `-`, `*` or `/`. It makes the line pink.
- `buffer__line--active` is an extra class for the line being typed right now. This one is optional.

### Variables: the program's memory

A variable is a labelled box that holds a value. You put a value in, and it stays there until you replace it.

```js
let current = "12";   // make a box called current, and put "12" in it
current = "123";      // take the old value out, and put "123" in
```

`let` makes a box whose contents can change. `const` makes a box whose value cannot be replaced.

Every value has a type. Three types matter here:

- A **string** is text. It has quotes around it, like `"12"`.
- A **number** is for maths, like `12`.
- A **boolean** is either `true` or `false`.

Two more containers are useful in this project.

An **object** is one value with named parts:

```js
const calculator = {
  left: "",       // the number typed before the operator
  operator: "",   // the operator waiting to be used
};

calculator.left = "12";   // set the left part to "12"
```

An **array** is a numbered list that keeps its order:

```js
const entered = [];       // an empty list
entered.push("12");       // add to the end. The list is now ["12"]
entered.push("+");        // the list is now ["12", "+"]
entered[0];               // the first item, which is "12"
entered.length;           // how many items there are, which is 2
```

### Functions: steps with a name

A function is a set of steps with a name. You write the steps once. Then you run them by calling the name.

```js
function greet(name) {
  return "Hello, " + name;
}

greet("Anna");   // returns "Hello, Anna"
```

- `name` is a **parameter**. The caller passes a value in through the brackets.
- `return` sends a value back to the code that called the function.
- Some functions return nothing. They only do something, such as writing on the screen.

### Decisions: if and else

Programs make choices. `if` runs steps only when a question is true. `else` runs different steps when the question is false.

```js
if (current === "0") {
  current = digit;             // replace a single 0 instead of adding to it
} else {
  current = current + digit;   // add the new digit to the end
}
```

Three equals signs, `===`, ask whether two values are exactly equal. One equals sign, `=`, puts a value into a variable. Beginners confuse these two very often.

### Changing the page from JavaScript

The browser keeps a live list of everything on the page. JavaScript can read that list and change it.

Here are the tools you need. In this code, `document` means the whole page.

```js
const screen = document.getElementById("display");
// find the element whose id is "display"

screen.textContent = "12";
// replace the text inside it

screen.classList.add("buffer__line--operator");
// add another class to it

screen.classList.remove("buffer__line--operator");
// remove that class again

const line = document.createElement("div");
// make a new, empty div. It is not on the page yet.

line.textContent = "12";
line.classList.add("buffer__line");

screen.append(line);
// put the new line inside screen, at the bottom

screen.replaceChildren();
// remove everything inside screen. The element itself stays.
```

### Text and numbers are different

This difference causes more calculator bugs than anything else.

The `+` sign joins two strings end to end. That is exactly what you want while someone is typing a number:

```js
"1" + "2"   // gives "12", not 3. Joining is correct while typing.
```

But joining is wrong once the calculator has to do the maths:

```js
"12" + "3"   // gives "123", not 15
```

`Number()` turns a string of digits into a real number:

```js
Number("12") + Number("3")   // gives 15
```

`calculate()` receives both of its values as strings. Converting them is part of its job.

JavaScript also does something odd when you divide by zero. It does not crash, and it shows no error. It produces the value `Infinity` instead.

Decide what the person using the calculator should see instead. You make that choice inside one of the TODO functions.

### Finding your mistakes

Open the console first. Right-click the page, choose Inspect, then click the Console tab.

- Anything you print with `console.log("current is", current);` appears there.
- Errors appear there too, in red. Each error gives a file name and a line number. Read them, because they tell you more than you expect.

When a function does the wrong thing, add a `console.log` inside it. Print the value you are unsure about. Refresh the page and press a key. Now you can see what the function really received.

### Already written for you

The bottom of `calculator.js` is already written. Read it, but do not change it.

An object called `BUTTONS` has one part for each key id. Each part holds the function that runs when you click that key.

An object called `KEYS` connects keyboard keys to those same buttons. It covers `0` to `9`, `.`, `+`, `-`, `*`, `x`, `/`, `Enter`, `Escape` and `c`. This is why the keyboard works as well as the mouse.

When a key runs, `activate()` does two more things. It plays the click sound, and it flashes that key on the screen.

The flash works through an attribute. `activate()` writes `tile.dataset.pressed`, which sets `data-pressed` on the button. The stylesheet pushes the key down while `data-pressed` is set. After 90 milliseconds the attribute is removed again.

So you never write "when this button is clicked, call my function". That part is already written. You only write what each button does.
