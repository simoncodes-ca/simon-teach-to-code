# Simon's Paint

A sheet of paper is taped to a drawing board. Beside it sits a tin with ten paints, four nibs and an eraser.

You draw with the mouse. Then you can take it back. Undo removes the last stroke. Redo puts it back. Clear empties the whole sheet.

## The one big idea

**A canvas forgets everything you draw on it.**

The five projects before this one built the screen out of HTML elements. A hangman letter was a button. A square of sea was a `div`. Each one stayed where you put it, and you could change it later.

A canvas is different. A canvas is a sheet of pixels. You paint on it, and the paint is simply there. The canvas does not know that a stroke happened, so it cannot remove one.

So you have to remember the drawing yourself. That is the job in this project, and it is the idea that stays useful for years.

## The three files

| File | What it does | Who writes it |
|---|---|---|
| `paint.html` | Builds the page: the bench, the paper, the tin, the keys | Finished. Do not edit |
| `styles.css` | Decides how everything looks | Finished. Do not edit |
| `paint.js` | The brush, the memory and the history | You |

Double-click `paint.html` to open it. Change `paint.js`, save the file, then refresh the browser page.

Nine functions in `paint.js` are marked `// TODO`. Write them in file order, from the top down.

Each one gives you two hints. Read the gentle hint first. Read the stronger hint only if you need it. All the answers sit in one block at the very bottom of the file. Scroll down to it when you want it, and only then.

The paper is blank right now. It stays blank however hard you press. That is on purpose.

## What the bench does

The **tin** holds ten pans of paint and four nibs. Pick a pan and a nib. The Brush panel above the tin then shows the exact stroke you are about to make.

The **eraser** is not a special tool. It is the brush, loaded with the colour of the paper. That is why none of your nine functions has to know about it.

The **tape** along the top shows the point under your cursor. It also counts the strokes on the paper.

The **history strip** on the ledge draws one tick per stroke. A solid tick is on the paper. A hollow tick is waiting on the undo pile.

The **keys** run the rest. Undo and Redo also work from the **Z** and **Y** keys. Clear takes everything off, and Redo brings it back. Save downloads your picture.

## What you will learn

- What a canvas is, and why it is nothing like an HTML element
- The three steps of drawing: start a path, trace it, then stroke it
- Why the mouse position and the paper position are different numbers
- How to turn one into the other
- Why a drawing program stores strokes instead of pixels
- How undo and redo work, using two lists and nothing else
- Why redo goes away as soon as you draw something new
- How to turn a canvas into a file you can keep

## Good to know

### What you already know

These all work the same way here. Read `01-calculator/README.md` through `05-battleship/README.md` again for the full story.

- `let` and `const` make labelled boxes. You cannot replace what is in a `const` box.
- Arrays are ordered lists. `.push(x)` adds to the end. `.length` counts. `[0]` reads the first item.
- An object is a value with named parts. You write it inside `{ }` and read a part out with a dot.
- Functions are steps with a name. `return` sends a value back and stops the function at once.
- `for (const x of list)` walks a list without counting.
- `render()` wipes the screen and draws it again from the memory. Change the memory, then call `render()`.
- An event object arrives with every click or move. It carries facts about what happened.
- `console.log` shows you what is really happening.

One list method is new. It is the opposite of `push`:

```js
const last = strokes.pop();    // takes the LAST item off, and hands it to you
```

`push` and `pop` both work on the end of a list. Those two together are the whole of undo.

### A canvas is a sheet of pixels

A canvas is one element with nothing inside it. You do not add things to it. You paint on it.

```js
const paper = document.getElementById("paper");
const pen = paper.getContext("2d");    // the thing that actually draws
```

`pen` is called the context. Think of it as the brush that is held over that canvas. Every drawing instruction goes through it.

Once the paint is down, it stays down. The canvas keeps no list of shapes. You cannot ask it what is there. You cannot take one line off again.

That sounds like a problem. The next section is the answer to it.

### So the drawing lives in a list

The paper cannot remember, so the program remembers instead. Your program keeps every stroke as an object.

```js
{ colour: "#c8402f", size: 10, points: [ {x: 40, y: 90}, {x: 41, y: 92}, ... ] }
```

A stroke holds three things. It holds a colour. It holds a thickness. It holds every point the mouse passed through.

One drag across the paper makes hundreds of points. The program draws a short straight line between each pair of them. Hundreds of tiny straight lines look exactly like one smooth curve.

All the strokes go into one list, in the order you drew them. Then `render()` does two jobs:

```text
1. paint the whole sheet cream again
2. draw every stroke from the list, in order
```

That runs every single time the mouse moves. It sounds like far too much work. It is not. A computer redraws a few hundred lines faster than your eye can notice.

This is the same `render()` you have written since hangman. The rule has never changed. **The screen is a picture of the memory.** Change the memory, then draw it again.

### Two lists make undo

The drawing is a list now, so undo is easy to write.

```text
strokes    what is on the paper       oldest first
undone     what undo has taken off    newest last
```

Undo takes the last stroke off `strokes` and puts it on `undone`. Redo takes it off `undone` and puts it back on `strokes`. Then `render()` draws the picture again.

Notice what is missing. Nothing erases anything. A stroke is only ever in one list or the other.

Lists used this way have a name. They are called **stacks**. You add to the end, and you take from the end. A stack of plates works the same way: the last plate on is the first plate off.

A stack is exactly right for undo. Undo has to take back the newest thing you did, not the oldest.

Watch the history strip on the ledge while you press Undo and Redo. Ticks change from solid to hollow and back. That strip is a picture of the two lists.

### Why redo goes away

Try this. Draw three strokes. Press Undo twice. Now draw something new. The Redo key turns grey, and those two undone strokes are gone for good.

That is not a bug, and every drawing program does it. Redo means "put back the thing I just took off". You drew something new, so those two strokes belong to a picture that no longer exists. There is nowhere sensible to put them back.

So `finishStroke` empties the undo pile. It is one line, and it is the line that keeps the history honest.

### Where the mouse is, and where the paper is

These are two different sets of numbers, and this catches everybody once.

A mouse event knows where the mouse is on the **screen**. It gives you `event.clientX` and `event.clientY`. Both count from the top left corner of the browser window.

The canvas has its own numbers. This canvas is always 1024 across and 768 down. Those numbers never change. The browser stretches the picture to fit the space it has.

So you need two steps to get from one to the other.

1. **Subtract where the paper starts.** `getBoundingClientRect()` tells you where the paper sits on the screen right now.
2. **Scale.** The paper may look 800 pixels wide, but it is really 1024 wide. Every screen pixel is then 1.28 paper pixels.

```js
const box = paper.getBoundingClientRect();
const x = (event.clientX - box.left) * paper.width / box.width;
```

Miss step 2 and your strokes land near the mouse, but never on it. The gap grows the further right you go. Resize the window and the gap changes. It is a very good bug to meet once.

Every game after this one does this same conversion. Project 12 gives it a proper name: world coordinates and screen coordinates. This is the small version.

### Already written for you

Section 3 of `paint.js` is finished, the same as in the five projects before it.

- `render()` clears the sheet. Then it draws every stroke in the list. Then it draws the stroke you are making right now. Then it updates the preview, the history strip, the counters and the keys.
- `paintStroke(target, stroke)` is a small guard around your `drawStroke`. It skips a stroke that is empty or missing, so a half-written function cannot crash the page.
- The `pointerdown`, `pointermove` and `pointerup` handlers are the whole of drawing. Each one turns the event into a point with your `canvasPoint`. Then they call `startStroke`, `extendStroke` and `finishStroke`, in that order. Read them. They are short, and they show you where each of your functions fits.
- `renderPreview()` draws the grey guide squiggle in the Brush panel. Then it asks your `drawStroke` to draw the same squiggle in the paint you picked.
- `buildPans()` and `buildNibs()` build the tin from the `COLOURS` and `SIZES` lists. Add a colour to that list and a new pan appears.
- The two tool keys, the four action keys and the **Z** and **Y** shortcuts are all connected already.

You can also add `#demo` or `#demo-undone` to the end of the address in the browser. The first shows a finished drawing. The second shows one with four strokes waiting on the undo pile. They are there to show you how the page should look. You cannot draw on them.

### Finding your mistakes

Nearly every function you write shows up somewhere on the bench. So look at the bench first.

| What you see | The function to check |
|---|---|
| The tape says `—, —` while your cursor is on the paper | `canvasPoint` |
| The Brush panel shows only the grey squiggle | `drawStroke` |
| Pressing on the paper leaves nothing | `startStroke` |
| A dot never grows into a line as you drag | `extendStroke` |
| A stroke vanishes when you start the next one | `finishStroke` |
| Undo, Redo or Clear does nothing | `undo`, `redo` or `clearPaper` |
| Strokes land near the mouse, and drift further as you go right | `canvasPoint` again |

`drawStroke` is the one to fix first. Nothing can appear anywhere until it works.

That last row has one cause. You subtracted where the paper starts, but you did not scale.

The status line under the paper is doing real work in this project. It names the empty function every time you press a key. Read it.

You can also look at the memory itself:

```js
console.log(strokes.length, undone.length);
console.log(strokes[0]);
```

### Try this next

The project stops here on purpose. Each of these is a new rule rather than a new idea, so you already know enough to add them.

- A **straight-line tool.** Hold Shift, and keep only the first point and the last point.
- A **spray can.** One stroke that draws many small dots instead of a line.
- A **wobbly brush.** Change the thickness along the stroke, so it looks like real paint.
- A **stroke limit**, so a very long drawing stays fast.
- **Save the drawing inside the browser**, so it is still there tomorrow. Project 13 does exactly this for a high score.
