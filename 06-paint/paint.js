/* =====================================================================
   Simon's Paint — the brush, the paper, and the memory of every stroke.

   This file is where you work. The bench is built. The paints are in
   the tin. The buttons are connected. But nothing can appear on the
   paper until you fill in the TODO functions below.

   Write them in this order:
      1. canvasPoint   — where on the paper is the mouse?
      2. drawStroke    — draw one stroke onto a canvas
      3. startStroke   — begin a new stroke where you pressed
      4. extendStroke  — add the next point as you drag
      5. finishStroke  — keep the stroke when you let go
      6. undo          — take the last stroke off the paper
      7. redo          — put it back
      8. clearPaper    — take them all off
      9. saveDrawing   — turn the paper into a picture file

   Each one you finish makes something new happen on the bench.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   Your whole drawing lives in these few variables. The paper itself
   remembers nothing at all.

   That is the surprise of this project. Until now the screen was made
   of HTML elements. An element stays where you put it. A canvas does
   not work that way. A canvas is a sheet of pixels. You paint on it,
   and the paint is simply there. The canvas does not know that a
   stroke happened, so it cannot take one off again.

   So the program keeps the strokes instead. Whenever anything changes,
   it draws the whole picture again from the list. That is `render()`,
   the same render you have written since hangman.

   Undo is then very simple. Take the last stroke out of the list.
   Draw the picture again.

   One stroke is an object:

       { colour: '#c8402f', size: 10, points: [ {x: 40, y: 90}, ... ] }

   The history is two lists:

       strokes   what is on the paper, oldest first
       undone    what undo has taken off, waiting for redo
   --------------------------------------------------------------------- */

const PAPER = '#f6f0e2';     // the colour of the paper. The eraser paints with it

/* The pans of paint in the tin. Each one has a name, so the page can
   say which paint you picked. */
const COLOURS = [
  { name: 'Ink',     value: '#2a2622' },
  { name: 'Crimson', value: '#c8402f' },
  { name: 'Orange',  value: '#e0842c' },
  { name: 'Yellow',  value: '#ecc23f' },
  { name: 'Leaf',    value: '#4f8f4a' },
  { name: 'Teal',    value: '#2f8b86' },
  { name: 'Sky',     value: '#3a72b8' },
  { name: 'Violet',  value: '#6f4c9b' },
  { name: 'Rose',    value: '#d3689a' },
  { name: 'Chalk',   value: '#fbfaf6' }
];

const SIZES = [4, 10, 22, 44];    // how thick each of the four nibs is, in paper pixels

let strokes = [];            // every stroke on the paper, in the order you drew them
let undone = [];             // strokes undo has taken off, newest last
let current = null;          // the stroke you are drawing right now, or null
let colour = COLOURS[0].value;   // the paint on the brush
let size = SIZES[1];             // the nib you are using
let tool = 'brush';              // 'brush' or 'eraser'


/* ---------------------------------------------------------------------
   2. YOUR JOB

   Nine small functions. Fill them in from the top down.

   Each one gives you two hints. Read the gentle hint first. Read the
   stronger hint only if you need it. All the answers sit in one block
   at the very bottom of this file.
   --------------------------------------------------------------------- */

/**
 * Work out where the mouse is on the paper. Hand that back as a point,
 * which is an object like { x: 512, y: 384 }.
 *
 * Careful here. Where the mouse is on the screen and where it is on the
 * paper are two different numbers.
 *
 * A mouse event knows `event.clientX` and `event.clientY`. Those count
 * from the top left corner of the browser window.
 *
 * The paper has its own numbers. They count from the top left corner of
 * the paper. There are always 1024 of them across and 768 down, however
 * large or small the paper looks.
 *
 * So you have two jobs. First subtract where the paper starts. Then
 * scale from screen pixels to paper pixels.
 *
 * This line is written for you already:
 *
 *     const box = paper.getBoundingClientRect();
 *
 * It gives you `box.left`, `box.top`, `box.width` and `box.height`.
 * Together they say where the paper sits on the screen right now, and
 * how big it looks. `paper.width` and `paper.height` are the paper's
 * own 1024 and 768.
 *
 * Gentle hint: `event.clientX - box.left` is how far across the paper
 *   the mouse is, counted in screen pixels. Now turn that into paper
 *   pixels. The paper looks `box.width` wide, but it is really
 *   `paper.width` wide.
 * Stronger hint: subtract the box position first, then multiply by the
 *   paper-to-screen scale. Return one object with the scaled x and y.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The tape along the top shows the point under your cursor. It shows
 * two dashes until this works. Finish it, then move the mouse across
 * the paper. The numbers run 0 to 1024 across and 0 to 768 down, at any
 * window size.
 */
function canvasPoint(event) {
  const box = paper.getBoundingClientRect();
  // TODO: turn the screen point in `event` into a point on the paper.
  return null;
}

/**
 * Draw one stroke onto a canvas.
 *
 * `pen` is the thing that actually draws. It is called a 2D context.
 * `stroke` is one of the objects described up in the memory: a colour,
 * a size, and a list of points.
 *
 * Drawing on a canvas always takes the same three steps. Start a path.
 * Say where the path goes. Then stroke it.
 *
 *     pen.beginPath();                  // start a new shape
 *     pen.moveTo(x, y);                 // put the pen down here
 *     pen.lineTo(x, y);                 // trace across to there
 *     pen.stroke();                     // now draw the line you traced
 *
 * Say what the line should look like before you stroke it.
 * `pen.lineWidth` is how thick it is. `pen.strokeStyle` is its colour.
 * Set `pen.lineCap` and `pen.lineJoin` to 'round' as well. That gives
 * you a brush with a round tip instead of a flat one.
 *
 * Gentle hint: move to the first point. Then run a loop that traces a
 *   line to every point in the list. Then stroke once at the end.
 * Stronger hint: read the first point for moveTo, then visit every point
 *   with lineTo. Set the brush style before one final stroke call.
 *   You trace the first point twice, and that is on purpose. A stroke
 *   with one point becomes a line that goes nowhere. A round tip turns
 *   that into a dot.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Look at the Brush panel on the ledge. It holds a faint grey squiggle
 * and nothing else. Finish this function and your brush appears along
 * that squiggle. Change the pan or the nib and the squiggle changes
 * with them. Pick the eraser and watch it wipe a gap through the grey.
 */
function drawStroke(pen, stroke) {
  // TODO: trace the stroke's points and draw them in its colour and size.
}

/**
 * Start a new stroke where the mouse went down. Hand that new stroke
 * back.
 *
 * You build one object here. It holds what the tin says right now: the
 * colour on the brush, and the nib you picked. It also holds a list of
 * points with the single point you were given. The other points arrive
 * later.
 *
 * Gentle hint: build the object described up in the memory, then return
 *   it. The `colour` and `size` it needs are the variables with those
 *   same names.
 * Stronger hint: make an object with colour and size, and make points a
 *   one-item list containing the point.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Now press on the paper. A dot lands where you pressed, in your colour
 * and your size. It disappears again as soon as you press somewhere
 * else, because nothing keeps it yet. That job belongs to finishStroke,
 * two functions below.
 */
function startStroke(point) {
  // TODO: build a new stroke that starts at this point, and return it.
  return null;
}

/**
 * Add one more point to a stroke you are still drawing.
 *
 * The page calls this every time the mouse moves with the button held
 * down. One drag therefore adds hundreds of points.
 *
 * drawStroke joins each point to the one before it. Hundreds of tiny
 * straight lines look exactly like one curve.
 *
 * Gentle hint: the stroke's points are a list. You already know how to
 *   put something on the end of a list.
 * Stronger hint: use the list method that adds one item to its end.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Now drag the mouse. The dot stretches into a line that follows it.
 */
function extendStroke(stroke, point) {
  // TODO: put this point on the end of the stroke's list of points.
}

/**
 * Keep a stroke, now that it is finished.
 *
 * Two things happen when you let go of the mouse. The stroke moves onto
 * the paper's list, so it stays there while you draw the next one. The
 * undo pile also becomes empty again.
 *
 * Every drawing program empties the undo pile here, and it is worth
 * understanding why. Redo means "put back the thing I just took off".
 * You have now drawn something new. The strokes waiting in `undone`
 * belong to a picture that no longer exists. There is nowhere sensible
 * to put them back.
 *
 * Gentle hint: `strokes` is the list of what is on the paper. Add to
 *   it, then make `undone` empty again.
 * Stronger hint: add the stroke to the paper list, then replace the undo
 *   list with a new empty list.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Now the paper keeps everything you draw. The tape counts your strokes
 * as they land, so you can draw a whole picture. The three functions
 * below let you change your mind about it.
 */
function finishStroke(stroke) {
  // TODO: move this stroke onto the paper, and empty the undo pile.
}

/**
 * Take the last stroke off the paper. Keep it, in case of a redo.
 *
 * This is the reason the strokes live in a list. The canvas cannot
 * remove paint. But you are not removing paint. You are removing a
 * stroke from a list, and the page then draws the picture again from
 * whatever is left.
 *
 * Do nothing at all when the paper is empty. `.pop()` on an empty list
 * hands you `undefined`. Push that onto the undo pile and you leave a
 * hole in your history.
 *
 * Gentle hint: `.pop()` takes the last item off a list and hands it to
 *   you. The stroke comes off `strokes` and goes onto `undone`.
 * Stronger hint: return when the paper list is empty. Otherwise remove its
 *   last item and add that item to the undo list.
 * Stuck? The answer key is at the bottom of this file.
 *
 * The Undo key now works. The tape starts counting what is waiting.
 */
function undo() {
  // TODO: move the last stroke from the paper onto the undo pile.
}

/**
 * Put back the stroke that undo took off last.
 *
 * This is undo, backwards. The pile is already the right way round.
 * Undo puts strokes on the end, and redo takes them off the end. So the
 * last stroke off the paper is the first one back on.
 *
 * Gentle hint: the same two lines as undo, with the two lists swapped
 *   over.
 * Stronger hint: return when the undo list is empty. Otherwise remove its
 *   last item and add that item to the paper list.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Undo and Redo now move back and forth through your drawing. Draw
 * something new after an undo and the Redo key turns grey. That is
 * finishStroke emptying the pile, exactly as it should.
 */
function redo() {
  // TODO: move the last stroke from the undo pile back onto the paper.
}

/**
 * Take everything off the paper.
 *
 * There is no new idea here, and that is why you write it last.
 * Clearing the paper means undoing, over and over, until nothing is
 * left.
 *
 * You get something for free by writing it that way. Redo brings your
 * drawing back one stroke at a time, and no line of code has to know
 * what Clear is.
 *
 * Gentle hint: use a `while` loop. Keep going while the paper still has
 *   something on it, and call the function you already wrote.
 * Stronger hint: keep calling undo while the paper list still has items.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Clear now empties the sheet. Press Redo afterwards and watch the
 * picture come back, stroke by stroke, in the order you drew it.
 */
function clearPaper() {
  // TODO: undo strokes until the paper is empty.
}

/**
 * Turn the paper into a picture file. Hand back the address of it.
 *
 * A canvas can give you its pixels as one very long piece of text. That
 * text is called a data URL. It starts with `data:image/png;base64,`
 * and then runs for several hundred thousand letters. Those letters are
 * the picture.
 *
 * A browser can open that text as if it were a file. That is how Save
 * works. The page makes a link pointing at the text, then clicks the
 * link for you.
 *
 * Gentle hint: the canvas is the `paper` variable. The method you want
 *   is called toDataURL. Ask it for 'image/png'.
 * Stronger hint: ask paper for a data URL using the PNG image type, then
 *   return the text it gives you.
 * Stuck? The answer key is at the bottom of this file.
 *
 * Save now downloads your drawing as `painting.png`. Open the file and
 * look closely. The paper's grain is missing, because that grain is a
 * CSS layer sitting over the canvas. It was never paint.
 */
function saveDrawing() {
  // TODO: return the paper's pixels as a PNG data URL.
  return '';
}


/* ---------------------------------------------------------------------
   3. THE GIVEN WIRING

   This part is finished already. It builds the tin. It listens to the
   mouse. It draws the picture again whenever anything changes. It also
   works the keys.

   Read it, because it shows you how your nine functions get used. Do
   not change it.
   --------------------------------------------------------------------- */

const paper = document.getElementById('paper');
const pen = paper.getContext('2d');
const preview = document.getElementById('preview');
const previewPen = preview.getContext('2d');
const pansEl = document.getElementById('pans');
const nibsEl = document.getElementById('nibs');
const brushToolBtn = document.getElementById('brushTool');
const eraserToolBtn = document.getElementById('eraserTool');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const pointXEl = document.getElementById('pointX');
const pointYEl = document.getElementById('pointY');
const strokeCountEl = document.getElementById('strokeCount');
const undoneCountEl = document.getElementById('undoneCount');
const ticksEl = document.getElementById('ticks');
const statusEl = document.getElementById('status');

/* The sounds. The page makes one Audio object for each sound, once,
   and then uses it again every time. */
const pickSound = new Audio('assets/pick.wav');
const undoSound = new Audio('assets/undo.wav');
const redoSound = new Audio('assets/redo.wav');
const clearSound = new Audio('assets/clear.wav');
const saveSound = new Audio('assets/save.wav');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

let lastBrushColour = colour;   // so the Brush key can give your paint back
let movesThisStroke = 0;        // how many times the mouse moved during this drag
let statusMessage = 'Press on the paper. Nothing happens yet. Writing canvasPoint() changes that.';

function say(message) {
  statusMessage = message;
  statusEl.textContent = message;
}

/* Is this really a point? An empty function hands back null instead. */
function isPoint(point) {
  return point !== null && typeof point === 'object'
    && typeof point.x === 'number' && typeof point.y === 'number';
}

/* Is this really a stroke? The same question, asked about startStroke. */
function isStroke(stroke) {
  return stroke !== null && typeof stroke === 'object' && Array.isArray(stroke.points);
}

/* --- Drawing the picture again, from the memory --- */

/* Draw one stroke, but only if there is something there to draw. */
function paintStroke(target, stroke) {
  if (isStroke(stroke) && stroke.points.length > 0) drawStroke(target, stroke);
}

/* The whole picture, in three steps. Start with a clean sheet. Draw
   every stroke in order. Then draw the stroke you are making right now.

   This runs on every mouse move. The strokes list is the only place a
   drawing lives. */
function render() {
  pen.fillStyle = PAPER;
  pen.fillRect(0, 0, paper.width, paper.height);
  for (const stroke of strokes) paintStroke(pen, stroke);
  paintStroke(pen, current);
  renderPreview();
  renderTicks();
  renderCounts();
  renderKeys();
}

/* The sample squiggle in the Brush panel, in paper pixels. */
const SAMPLE_POINTS = [
  { x: 40, y: 84 }, { x: 78, y: 44 }, { x: 116, y: 30 }, { x: 152, y: 44 },
  { x: 176, y: 76 }, { x: 208, y: 92 }, { x: 244, y: 76 }, { x: 280, y: 38 }
];

/* The Brush panel. It draws a grey guide squiggle first. Then it draws
   the same squiggle in the paint you picked.

   The guide is there so the eraser has something to wipe. An eraser
   stroke on bare paper is invisible, and that is the whole trick of how
   the eraser works. */
function renderPreview() {
  previewPen.fillStyle = PAPER;
  previewPen.fillRect(0, 0, preview.width, preview.height);

  previewPen.save();
  previewPen.beginPath();
  previewPen.moveTo(SAMPLE_POINTS[0].x, SAMPLE_POINTS[0].y);
  for (const point of SAMPLE_POINTS) previewPen.lineTo(point.x, point.y);
  previewPen.lineWidth = 58;
  previewPen.lineCap = 'round';
  previewPen.lineJoin = 'round';
  previewPen.strokeStyle = 'rgba(42, 38, 34, .12)';
  previewPen.stroke();
  previewPen.restore();

  paintStroke(previewPen, { colour: colour, size: size, points: SAMPLE_POINTS });
}

/* One tick per stroke. A solid tick is on the paper. A hollow tick is
   one that undo took off. The strip shows the last 48 of each, so a
   long drawing still fits on the ledge. */
function renderTicks() {
  ticksEl.textContent = '';
  const shown = strokes.slice(-48);
  for (const stroke of shown) {
    const tick = document.createElement('span');
    tick.className = 'tick';
    tick.style.setProperty('--tick', stroke.colour);
    ticksEl.appendChild(tick);
  }
  const waiting = undone.slice(-48).reverse();
  for (const stroke of waiting) {
    const tick = document.createElement('span');
    tick.className = 'tick tick-gone';
    tick.style.setProperty('--tick', stroke.colour);
    ticksEl.appendChild(tick);
  }
}

function renderCounts() {
  strokeCountEl.textContent = strokes.length;
  undoneCountEl.textContent = undone.length;
}

function renderKeys() {
  undoBtn.disabled = strokes.length === 0;
  redoBtn.disabled = undone.length === 0;
  clearBtn.disabled = strokes.length === 0;
  saveBtn.disabled = strokes.length === 0;
}

function renderReadout(point) {
  if (isPoint(point)) {
    pointXEl.textContent = Math.round(point.x);
    pointYEl.textContent = Math.round(point.y);
  } else {
    pointXEl.textContent = '—';
    pointYEl.textContent = '—';
  }
}

/* --- The tin: the pans, the nibs and the two tools --- */

function buildPans() {
  for (const paint of COLOURS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pan';
    button.style.setProperty('--pan', paint.value);
    button.title = paint.name;
    button.setAttribute('aria-label', paint.name);
    button.setAttribute('aria-pressed', String(paint.value === colour));
    button.addEventListener('click', () => {
      colour = paint.value;
      lastBrushColour = paint.value;
      tool = 'brush';
      playSound(pickSound);
      renderTin();
      render();
      say(paint.name + ' on the brush.');
    });
    pansEl.appendChild(button);
  }
}

function buildNibs() {
  for (const nibSize of SIZES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nib';
    button.title = nibSize + ' across';
    button.setAttribute('aria-label', 'Nib ' + nibSize);
    button.setAttribute('aria-pressed', String(nibSize === size));
    const dot = document.createElement('i');
    dot.style.setProperty('--dot', Math.max(4, nibSize * 0.62) + 'px');
    button.appendChild(dot);
    button.addEventListener('click', () => {
      size = nibSize;
      playSound(pickSound);
      renderTin();
      render();
      say('Nib ' + nibSize + ' picked.');
    });
    nibsEl.appendChild(button);
  }
}

/* Show which pan, nib and tool are pressed in. */
function renderTin() {
  const pans = pansEl.querySelectorAll('.pan');
  COLOURS.forEach((paint, i) => {
    pans[i].setAttribute('aria-pressed', String(tool === 'brush' && paint.value === colour));
  });
  const nibs = nibsEl.querySelectorAll('.nib');
  SIZES.forEach((nibSize, i) => {
    nibs[i].setAttribute('aria-pressed', String(nibSize === size));
  });
  brushToolBtn.setAttribute('aria-pressed', String(tool === 'brush'));
  eraserToolBtn.setAttribute('aria-pressed', String(tool === 'eraser'));
}

/* The eraser is not a special kind of stroke. It is the brush, loaded
   with the colour of the paper. Everything else about it is the same.
   That is why none of the functions above has to know it exists. */
brushToolBtn.addEventListener('click', () => {
  tool = 'brush';
  colour = lastBrushColour;
  playSound(pickSound);
  renderTin();
  render();
  say('Brush.');
});

eraserToolBtn.addEventListener('click', () => {
  if (tool === 'brush') lastBrushColour = colour;
  tool = 'eraser';
  colour = PAPER;
  playSound(pickSound);
  renderTin();
  render();
  say("Eraser. It is a brush loaded with the paper's own colour.");
});

/* --- The mouse --- */

paper.addEventListener('pointerdown', (event) => {
  const point = canvasPoint(event);
  renderReadout(point);
  if (!isPoint(point)) {
    say('canvasPoint() is still empty, so nothing knows where you pressed.');
    return;
  }
  const stroke = startStroke(point);
  if (!isStroke(stroke)) {
    say('startStroke() is still empty, so there is no stroke to draw.');
    return;
  }
  paper.setPointerCapture(event.pointerId);
  current = stroke;
  movesThisStroke = 0;
  render();
});

paper.addEventListener('pointermove', (event) => {
  const point = canvasPoint(event);
  renderReadout(point);
  if (current === null || !isPoint(point)) return;
  movesThisStroke += 1;
  extendStroke(current, point);
  render();
});

paper.addEventListener('pointerleave', () => renderReadout(null));

function endStroke() {
  if (current === null) return;
  const stretched = current.points.length > 1;
  const before = strokes.length;
  finishStroke(current);
  current = null;
  render();

  if (strokes.length === before) {
    say('finishStroke() is still empty, so the stroke was thrown away.');
  } else if (movesThisStroke > 2 && !stretched) {
    say('extendStroke() is still empty. The stroke never grew past its first point.');
  } else {
    say(strokes.length === 1 ? 'One stroke on the paper.' : strokes.length + ' strokes on the paper.');
  }
}

paper.addEventListener('pointerup', endStroke);
paper.addEventListener('pointercancel', endStroke);

/* --- The keys --- */

undoBtn.addEventListener('click', () => {
  const before = strokes.length;
  undo();
  render();
  if (strokes.length === before) {
    say('undo() is still empty, so nothing came off the paper.');
  } else {
    playSound(undoSound);
    say('Undone. ' + undone.length + ' waiting to come back.');
  }
});

redoBtn.addEventListener('click', () => {
  const before = strokes.length;
  redo();
  render();
  if (strokes.length === before) {
    say('redo() is still empty, so nothing went back on.');
  } else {
    playSound(redoSound);
    say('Redone.');
  }
});

clearBtn.addEventListener('click', () => {
  const before = strokes.length;
  clearPaper();
  render();
  if (strokes.length === before) {
    say('clearPaper() is still empty, so the paper is untouched.');
  } else {
    playSound(clearSound);
    say('Cleared. Press Redo to bring it back, stroke by stroke.');
  }
});

saveBtn.addEventListener('click', () => {
  const address = saveDrawing();
  if (typeof address !== 'string' || !address.startsWith('data:image')) {
    say('saveDrawing() is still empty, so there is no picture to save.');
    return;
  }
  const link = document.createElement('a');
  link.href = address;
  link.download = 'painting.png';
  link.click();
  playSound(saveSound);
  say('Saved as painting.png.');
});

/* Z undoes and Y redoes. Both work with or without Ctrl or Cmd. */
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'z' && !undoBtn.disabled) {
    event.preventDefault();
    undoBtn.click();
  } else if (key === 'y' && !redoBtn.disabled) {
    event.preventDefault();
    redoBtn.click();
  }
});

/* Typing #demo onto a page that is already open changes the address
   only. The script does not run again. So the page reloads itself here.
   The demos then work whether you edit the address bar or open a fresh
   link. */
window.addEventListener('hashchange', () => location.reload());

buildPans();
buildNibs();
renderTin();

/* The demos show you the finished look before you fill the functions
   in. drawStroke draws the picture, so a demo needs a working one. The
   stand-in below is for the demo picture only. It is never for you. */
if (location.hash === '#demo' || location.hash === '#demo-undone') {
  const scratch = document.createElement('canvas').getContext('2d');
  const probe = { colour: '#000000', size: 4, points: [{ x: 0, y: 0 }, { x: 4, y: 4 }] };
  drawStroke(scratch, probe);
  if (scratch.getImageData(0, 0, 4, 4).data[3] === 0) {
    drawStroke = (target, stroke) => {
      target.beginPath();
      target.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (const point of stroke.points) target.lineTo(point.x, point.y);
      target.lineWidth = stroke.size;
      target.strokeStyle = stroke.colour;
      target.lineCap = 'round';
      target.lineJoin = 'round';
      target.stroke();
    };
  }

  const line = (x1, y1, x2, y2) => [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  const arc = (cx, cy, r, from, to) => {
    const points = [];
    for (let i = 0; i <= 24; i += 1) {
      const angle = from + (to - from) * (i / 24);
      points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return points;
  };
  const put = (paint, thickness, points) => strokes.push({ colour: paint, size: thickness, points: points });

  put('#3a72b8', 16, arc(230, 160, 62, Math.PI, Math.PI * 2));
  put('#3a72b8', 16, arc(320, 160, 44, Math.PI, Math.PI * 2));
  put('#3a72b8', 16, line(168, 160, 364, 160));
  put('#ecc23f', 16, arc(880, 150, 64, 0, Math.PI * 2));
  put('#ecc23f', 10, line(880, 44, 880, 12));
  put('#ecc23f', 10, line(966, 74, 994, 56));
  put('#4f8f4a', 44, arc(300, 900, 260, Math.PI, Math.PI * 2));
  put('#4f8f4a', 44, arc(760, 940, 300, Math.PI, Math.PI * 2));
  put('#2a2622', 10, [{ x: 360, y: 640 }, { x: 360, y: 430 }, { x: 620, y: 430 }, { x: 620, y: 640 }, { x: 360, y: 640 }]);
  put('#c8402f', 22, [{ x: 330, y: 434 }, { x: 490, y: 322 }, { x: 650, y: 434 }]);
  put('#e0842c', 10, [{ x: 450, y: 640 }, { x: 450, y: 520 }, { x: 530, y: 520 }, { x: 530, y: 640 }]);
  put('#6f4c9b', 22, [{ x: 856, y: 660 }, { x: 856, y: 520 }]);
  put('#4f8f4a', 22, arc(856, 470, 62, 0, Math.PI * 2));
  put('#2a2622', 4, [{ x: 110, y: 706 }, { x: 152, y: 650 }, { x: 190, y: 712 }, { x: 236, y: 646 }, { x: 282, y: 708 }]);

  if (location.hash === '#demo-undone') {
    undone = strokes.splice(strokes.length - 4, 4).reverse();
  }
  render();
  say(location.hash === '#demo-undone'
    ? 'Demo: four strokes are waiting on the undo pile.'
    : 'Demo: a finished drawing, drawn from the strokes list.');
} else {
  render();
  say(statusMessage);
}


/* ---------------------------------------------------------------------
   4. THE ANSWER KEY

   These are the lines that go inside the functions you have to write.

   Read the hints first. The ten minutes you spend working it out are
   worth much more than the answer.


   --- canvasPoint(event) ---

     return {
       x: (event.clientX - box.left) * paper.width / box.width,
       y: (event.clientY - box.top) * paper.height / box.height
     };


   --- drawStroke(pen, stroke) ---

     pen.beginPath();
     pen.moveTo(stroke.points[0].x, stroke.points[0].y);
     for (const point of stroke.points) {
       pen.lineTo(point.x, point.y);
     }
     pen.lineWidth = stroke.size;
     pen.strokeStyle = stroke.colour;
     pen.lineCap = 'round';
     pen.lineJoin = 'round';
     pen.stroke();


   --- startStroke(point) ---

     return { colour: colour, size: size, points: [point] };


   --- extendStroke(stroke, point) ---

     stroke.points.push(point);


   --- finishStroke(stroke) ---

     strokes.push(stroke);
     undone = [];


   --- undo() ---

     if (strokes.length === 0) return;
     undone.push(strokes.pop());


   --- redo() ---

     if (undone.length === 0) return;
     strokes.push(undone.pop());


   --- clearPaper() ---

     while (strokes.length > 0) {
       undo();
     }


   --- saveDrawing() ---

     return paper.toDataURL('image/png');

   --------------------------------------------------------------------- */
