/* =====================================================================
   rack.js. File 5 of 6.

   One job: everything you read. The plate, the readouts down the
   side, the line under the screen, and the card that covers the
   screen between runs.

   No rule of the game is decided in here. This file only says out
   loud what the other files have already worked out. That is worth
   keeping separate: when a number on the rack looks wrong, either
   this file is printing it wrong or the file that owns it is wrong,
   and the two are never mixed up.
   ===================================================================== */

/* --- The bits of the page this file writes into --- */

const distReadEl = document.getElementById('distRead');
const bestReadEl = document.getElementById('bestRead');
const metreReadEl = document.getElementById('metreRead');
const speedReadEl = document.getElementById('speedRead');
const speedMarkEl = document.getElementById('speedMark');
const roofLampEl = document.getElementById('roofLamp');
const airLampEl = document.getElementById('airLamp');
const memReadEl = document.getElementById('memRead');
const aheadReadEl = document.getElementById('aheadRead');
const behindReadEl = document.getElementById('behindRead');
const recBestEl = document.getElementById('recBest');
const recRunsEl = document.getElementById('recRuns');
const recNoteEl = document.getElementById('recNote');
const startBtn = document.getElementById('start');
const againBtn = document.getElementById('again');
const statusEl = document.getElementById('status');

/* --- The line under the screen --- */

let message = '';
let eventText = '';
let eventLeft = 0;                 // seconds of this event still worth showing

function say(text) {
  if (text === message) return;
  message = text;
  statusEl.textContent = text;
}

/* A file has just done something. Hold it on the line for a moment,
   then let the run line come back. The other files call this, and
   every sentence they hand over starts with the name of the file. */
function sayEvent(text) {
  eventText = text;
  eventLeft = 0.9;
}

function runLine() {
  const metres = metresNow();
  if (metres < 5) return 'Up or space to jump.';
  return metres + ' metres. Best ' + record.best + '.';
}

function updateStatus(seconds) {
  if (eventLeft > 0) {
    eventLeft -= seconds;
    say(eventText);
    return;
  }
  say(runLine());
}

/* --- The panel that counts the six files ---

   Each file gets a lamp and a number. The number is how many jobs
   that file has done since the run started.

   Two of them work every single frame, two work only at moments, and
   numbers.js never works at all, because all it does is remember. */

const FILES = ['numbers', 'record', 'world', 'runner', 'rack', 'game'];

const fileLampEl = {};
const fileCountEl = {};
const fileGlow = {};               // seconds of lamp left
const fileCount = {};

for (const name of FILES) {
  const capital = name[0].toUpperCase() + name.slice(1);
  fileLampEl[name] = document.getElementById('lamp' + capital);
  fileCountEl[name] = document.getElementById('count' + capital);
  fileGlow[name] = 0;
  fileCount[name] = 0;
}

/* numbers.js is read on every line of every other file, so its lamp
   never goes out. */
fileGlow.numbers = Infinity;

function didWork(name) {
  fileCount[name] += 1;
  fileGlow[name] = 0.35;
}

function resetFileCounts() {
  for (const name of FILES) fileCount[name] = 0;
}

function updateFiles(seconds) {
  for (const name of FILES) {
    if (fileGlow[name] !== Infinity) fileGlow[name] = Math.max(0, fileGlow[name] - seconds);
    fileLampEl[name].className = fileGlow[name] > 0 ? 'lamp lamp-file lamp-on' : 'lamp lamp-file';
    fileCountEl[name].textContent = name === 'numbers' ? '—' : fileCount[name];
  }
}

/* --- The rack itself, once a frame --- */

function updateRack(seconds) {
  didWork('rack');

  const metres = metresNow();
  distReadEl.textContent = metres;
  metreReadEl.textContent = metres;
  bestReadEl.textContent = record.best;
  recBestEl.textContent = record.best;
  recRunsEl.textContent = record.runs;

  const speed = runSpeed(distance);
  speedReadEl.textContent = Math.round(speed);
  showSpeed(speed);

  roofLampEl.className = runner.onRoof ? 'lamp lamp-roof' : 'lamp';
  airLampEl.className = runner.onRoof ? 'lamp' : 'lamp lamp-air';

  memReadEl.textContent = obstacles.length;
  aheadReadEl.textContent = ahead;
  behindReadEl.textContent = behind;

  if (!storageWorks) {
    recNoteEl.textContent = 'This browser will not let a double-clicked page save anything, so the best score only lasts while the page is open.';
  }

  startBtn.disabled = phase === 'over';
  startBtn.firstChild.nodeValue = phase === 'playing' ? 'Pause ' : 'Start ';
  againBtn.disabled = phase === 'waiting';

  updateFiles(seconds);
  if (phase === 'playing') updateStatus(seconds);
}

/* The speed marker slides from the starting speed to the top speed,
   and turns coral once there is nothing left to give. */
function showSpeed(speed) {
  const share = Phaser.Math.Clamp((speed - START_SPEED) / (TOP_SPEED - START_SPEED), 0, 1);
  speedMarkEl.className = speed >= TOP_SPEED ? 'flat-out' : 'going';
  speedMarkEl.style.left = share * 100 + '%';
}

/* --- The card over the screen ---

   It is drawn by Phaser rather than by the page, so it needs the
   scene handed to it once, when the game is built. */

let curtain = null;

function buildCurtain(aScene) {
  const display = "'Impact', 'Haettenschweiler', 'Trebuchet MS', sans-serif";
  const label = "'Trebuchet MS', sans-serif";
  const back = aScene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x1b1030, 0.74)
    .setOrigin(0, 0).setScrollFactor(0);
  const title = aScene.add.text(WIDTH / 2, 286, '', {
    fontFamily: display, fontSize: '62px', color: '#ffb03a'
  }).setOrigin(0.5).setScrollFactor(0);
  const lines = aScene.add.text(WIDTH / 2, 382, '', {
    fontFamily: label, fontSize: '26px', color: '#fff3df', align: 'center'
  }).setOrigin(0.5).setLineSpacing(14).setScrollFactor(0);
  const key = aScene.add.text(WIDTH / 2, 476, '', {
    fontFamily: label, fontSize: '26px', color: '#2fd4c9'
  }).setOrigin(0.5).setScrollFactor(0);

  curtain = {
    group: aScene.add.container(0, 0, [back, title, lines, key]).setDepth(20).setScrollFactor(0),
    title: title,
    lines: lines,
    key: key
  };
  updateCurtain();
}

function updateCurtain() {
  if (curtain === null) return;
  curtain.group.setVisible(phase !== 'playing');
  if (phase === 'waiting') {
    curtain.title.setText('ROOFTOP RUN');
    curtain.lines.setText('The same game as project 13, cut into six files.\nUp or space to jump. You never stop running.');
    curtain.key.setText('Press Enter');
  } else if (phase === 'paused') {
    curtain.title.setText('PAUSED');
    curtain.lines.setText('');
    curtain.key.setText('');
  } else if (phase === 'over') {
    curtain.title.setText(newBest ? 'NEW BEST' : 'YOU TRIPPED');
    curtain.lines.setText(metresNow() + ' metres\nbest ' + record.best + ' · run ' + record.runs);
    curtain.key.setText('Press Run again');
  }
}
