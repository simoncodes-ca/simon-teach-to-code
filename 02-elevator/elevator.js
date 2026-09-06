/* =====================================================================
   Simon's Elevator — the brain.

   This file is a learning scaffold. The page is ready, but the elevator
   does not travel until you fill in the TODO functions below.

   A good order to work in:
     1. addFloorRequest   — remember one request
     2. chooseNextStop     — choose the next request from the queue
     3. setState           — name each change the machine makes
     4. openDoors          — pause at a floor
     5. closeDoors         — leave a floor safely
     6. moveElevator       — animate the car one frame at a time
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE MEMORY

   A state machine keeps a small amount of memory. It needs to know:
     - where the car is now
     - what state it is in
     - which floors are waiting in the queue
     - where it is going next
   --------------------------------------------------------------------- */

const STATES = [
  'idle',
  'waitingForRequest',
  'choosingNextStop',
  'doorsOpening',
  'doorsOpen',
  'doorsClosing',
  'movingUp',
  'movingDown'
];

const FLOOR_TOPS = {
  1: 85.7,
  2: 63.8,
  3: 46.4,
  4: 29.3,
  5: 12.0
};

const elevator = {
  currentFloor: null,
  state: 'idle',
  waitingList: [],
  nextFloor: null,
  lastTime: null
};

/* The safe preview is separate from waitingList. It lets the buttons
   teach the input idea before you write the real queue code. */
const previewRequests = [];


/* ---------------------------------------------------------------------
   2. SHOWING THINGS

   These helpers are complete. The interesting decisions belong in the
   TODO functions later. Keeping page updates here gives one place to
   look when a readout is wrong.
   --------------------------------------------------------------------- */

function showText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function showFloor(floor) {
  showText('floor-readout', floor);
  showText('queue-readout', elevator.waitingList.length);
}

function showCarAtTop(topPercent) {
  const car = document.getElementById('elevator-car');
  if (car) car.style.top = `${topPercent}%`;
}

function showPendingButtons() {
  document.querySelectorAll('[data-floor]').forEach((button) => {
    const floor = Number(button.dataset.floor);
    button.dataset.pending = previewRequests.includes(floor) ? 'true' : 'false';
  });
}

function showSafeRequestFeedback(floor) {
  if (!previewRequests.includes(floor)) previewRequests.push(floor);
  showPendingButtons();
  showText('queue-readout', elevator.waitingList.length + previewRequests.length);
  showText('request-feedback', `Floor ${floor} is marked as a practice request. Fill addFloorRequest to make the car act on it.`);
}

function explainState(state) {
  const explanations = {
    idle: 'The car is waiting for its next instruction.',
    waitingForRequest: 'The machine has work to do and is checking the queue.',
    choosingNextStop: 'The machine is choosing which waiting floor comes next.',
    doorsOpening: 'The car reached a floor and the doors are opening.',
    doorsOpen: 'The doors are open. The car pauses here for a moment.',
    doorsClosing: 'The doors are closing before the car moves again.',
    movingUp: 'The car is travelling toward a higher floor.',
    movingDown: 'The car is travelling toward a lower floor.'
  };
  return explanations[state] || 'This state needs a sentence in the explanation list.';
}

function renderStateDiagram() {
  document.querySelectorAll('[data-state-node]').forEach((node) => {
    const isActive = node.dataset.stateNode === elevator.state;
    node.dataset.active = isActive ? 'true' : 'false';
    if (isActive) node.setAttribute('aria-current', 'true');
    else node.removeAttribute('aria-current');
  });
  showText('state-chip', elevator.state);
  showText('state-explanation', explainState(elevator.state));
}

function addLogLine(message) {
  const log = document.getElementById('event-log');
  if (!log) return;

  const empty = log.querySelector('.event-log__empty');
  if (empty) empty.remove();

  const line = document.createElement('li');
  line.textContent = message;
  log.prepend(line);
}

/**
 * Paint one state change on the screen.
 *
 * This helper does not decide WHEN to change state. Your TODO functions
 * make those decisions. They call setState('movingUp') or another name.
 *
 * Look up: if statements, function parameters, and template strings.
 */
function setState(nextState, reason) {
  if (!STATES.includes(nextState)) return;
  if (elevator.state === nextState) return;

  const oldState = elevator.state;
  elevator.state = nextState;
  renderStateDiagram();
  addLogLine(`${oldState} → ${nextState}${reason ? ` · ${reason}` : ''}`);
}


/* ---------------------------------------------------------------------
   3. THE REQUEST QUEUE

   The five buttons call requestFloor. The preview feedback above works
   now, even though the real queue is still your job to build.
   --------------------------------------------------------------------- */

/**
 * Remember a floor request in waitingList.
 *
 * Gentle hint: an array can remember more than one floor.
 * Stronger hint: use waitingList.includes(floor) before waitingList.push(floor).
 * Answer if you want it: only push the floor when it is not already waiting.
 *
 * A second click on a floor should not create a duplicate request.
 * Keep the queue in FIFO order: the first new floor pressed is served first.
 */
function addFloorRequest(floor) {
  // TODO: write the deduplication rule here.
  // The safe scaffold intentionally leaves the real waitingList unchanged.
}

/**
 * Choose the next floor from waitingList.
 *
 * Gentle hint: FIFO means "first in, first out".
 * Stronger hint: the first item is at position zero.
 * Answer if you want it: remove the first item with shift().
 *
 * Return the floor you chose. Return null when there is no work.
 */
function chooseNextStop() {
  // TODO: choose one floor and remove it from waitingList.
  return null;
}

function requestFloor(floor) {
  showSafeRequestFeedback(floor);
  addFloorRequest(floor);
}


/* ---------------------------------------------------------------------
   4. THE STATE MACHINE

   The timing loop below is already written. Your functions decide which
   state comes next. Each state should do one small, visible job.
   --------------------------------------------------------------------- */

/**
 * Start the next trip after a request arrives.
 *
 * Gentle hint: check whether waitingList has any items.
 * Stronger hint: chooseNextStop gives you a floor to compare with
 * currentFloor. Then choose movingUp, movingDown, or doorsOpening.
 * Answer if you want it: call setState with the name that matches.
 */
function startNextTrip() {
  // TODO: move the machine from idle to its next useful state.
}

/**
 * Open the doors after the car reaches nextFloor.
 *
 * Gentle hint: a door-opening state should be visible before doorsOpen.
 * Stronger hint: setState can name both transitions and set nextFloor as
 * the current floor.
 * Answer if you want it: change currentFloor, then set doorsOpening.
 */
function openDoors() {
  // TODO: show doorsOpening, then doorsOpen after a short pause.
}

/**
 * Close the doors and decide what happens after the pause.
 *
 * Gentle hint: the next state depends on whether waitingList has work.
 * Stronger hint: doorsClosing normally comes before movingUp, movingDown,
 * or idle.
 * Answer if you want it: setState('doorsClosing'), then choose the next job.
 */
function closeDoors() {
  // TODO: show doorsClosing, then send the machine to its next job.
}

/**
 * Move the car a little bit on every animation frame.
 *
 * Gentle hint: the browser gives you time in milliseconds.
 * Stronger hint: compare nextFloor with currentFloor and change a position
 * number by a small amount each frame. Use showCarAtTop to draw it.
 * Answer if you want it: requestAnimationFrame calls this function again.
 * Stop when the position reaches FLOOR_TOPS[nextFloor].
 *
 * This is where smooth motion belongs. Do not jump straight to a floor.
 */
function moveElevator(time) {
  // TODO: write the per-frame motion here.
}


/* ---------------------------------------------------------------------
   5. THE GIVEN WIRING

   This part is deliberately finished. It connects real buttons to the
   small functions above, just like the calculator project.
   --------------------------------------------------------------------- */

function randomStartingFloor() {
  return Math.floor(Math.random() * 5) + 1;
}

function flashButton(button) {
  if (!button) return;
  button.dataset.pressed = 'true';
  setTimeout(() => delete button.dataset.pressed, 110);
}

/* The button beep. Real elevators confirm a floor request with a
   short tone, so each press here plays one. One Audio element is
   made once and reused; calling play() again just restarts it. */
const beepSound = new Audio('assets/button-beep.wav');

function playBeepSound() {
  beepSound.currentTime = 0;
  // Some browsers refuse to play before the first real interaction;
  // .catch swallows that harmless refusal instead of logging an error.
  beepSound.play().catch(() => {});
}


function registerFloorButtons() {
  document.querySelectorAll('[data-floor]').forEach((button) => {
    button.addEventListener('click', () => {
      const floor = Number(button.dataset.floor);
      playBeepSound();
      requestFloor(floor);
      flashButton(button);
    });
  });
}

function animationLoop(time) {
  if (elevator.state === 'movingUp' || elevator.state === 'movingDown') {
    moveElevator(time);
  }
  requestAnimationFrame(animationLoop);
}

function init() {
  elevator.currentFloor = randomStartingFloor();
  showCarAtTop(FLOOR_TOPS[elevator.currentFloor]);
  showFloor(elevator.currentFloor);
  renderStateDiagram();
  showPendingButtons();
  registerFloorButtons();
  requestAnimationFrame(animationLoop);
}

document.addEventListener('DOMContentLoaded', init);
