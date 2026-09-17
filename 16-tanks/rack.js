/* =====================================================================
   rack.js. File 5 of 6.

   One job: everything you read. The readouts down the side, the line
   under the window, and the cards that cover the arena between games.

   It never changes a tank or a shell. It only looks at them. That is
   why it can show your own functions back to you: the Heading and Aim
   wells, the health bars and the reload bars all come from the numbers
   your functions change.

   It uses names from game.js, which loads after it. That is allowed,
   because nothing here runs until game.js has loaded.
   ===================================================================== */

const blueWinsEl = document.getElementById('blueWins');
const redWinsEl = document.getElementById('redWins');
const roundReadEl = document.getElementById('roundRead');
const shellCountEl = document.getElementById('shellCount');
const bounceCountEl = document.getElementById('bounceCount');
const hitCountEl = document.getElementById('hitCount');
const statusEl = document.getElementById('status');

/* The four readouts for each tank, found by the tank's name. */
function readoutsFor(name) {
  return {
    healthBar: document.getElementById(name + 'HealthBar'),
    health: document.getElementById(name + 'Health'),
    heading: document.getElementById(name + 'Heading'),
    aim: document.getElementById(name + 'Aim'),
    reload: document.getElementById(name + 'Reload')
  };
}
const readouts = { blue: readoutsFor('blue'), red: readoutsFor('red') };

let curtain = null;              // the card before and after a duel
let roundCard = null;            // the words in the middle between rounds
let message = '';

/* One flag per function you have to write. game.js tries each of your
   functions with a small test on every frame and sets these. */
const missing = {
  stepAlong: false,
  turnTank: false,
  driveTank: false,
  aimOf: false,
  fireShell: false,
  moveShell: false,
  shellHitsTank: false,
  damageTank: false
};

function say(text) {
  if (text === message) return;
  message = text;
  statusEl.textContent = text;
}

/* --- Checks for the shape of an answer ---

   An empty function hands back nothing at all, so these ask whether a
   function handed back the kind of thing it was asked for. */
function isPoint(thing) {
  return thing !== null && typeof thing === 'object'
    && Number.isFinite(thing.x) && Number.isFinite(thing.y);
}

function isAngle(thing) {
  return Number.isFinite(thing);
}

/* An angle in radians, written as whole degrees from 0 to 359. */
function degrees(angle) {
  const whole = Math.round(angle * 180 / Math.PI) % 360;
  return (whole + 360) % 360 + '°';
}

/* --- The line under the window --- */

function reportEmptyFunctions() {
  if (missing.stepAlong) say('stepAlong() is still empty, so nothing knows which way is forward.');
  else if (missing.turnTank) say('turnTank() is still empty, so the tanks cannot turn.');
  else if (missing.driveTank) say('driveTank() is still empty, so the tanks cannot drive.');
  else if (missing.aimOf) say('aimOf() is still empty, so the guns only point straight ahead.');
  else if (missing.fireShell) say('fireShell() is still empty, so nothing comes out of the barrel.');
  else if (missing.moveShell) say('moveShell() is still empty, so the shells hang in the air.');
  else if (missing.shellHitsTank) say('shellHitsTank() is still empty, so shells fly through the tanks.');
  else if (missing.damageTank) say('damageTank() is still empty, so a hit does no damage.');
  else say(duelLine());
}

function duelLine() {
  if (blue.wins === 0 && red.wins === 0) return 'Round ' + round + '. First to ' + WINS_NEEDED + ' rounds wins.';
  return 'Round ' + round + '. Blue ' + blue.wins + ', Red ' + red.wins + '.';
}

/* --- The rack down the side --- */

function updateRack() {
  blueWinsEl.textContent = blue === null ? 0 : blue.wins;
  redWinsEl.textContent = red === null ? 0 : red.wins;
  roundReadEl.textContent = round;
  shellCountEl.textContent = shells.length;
  bounceCountEl.textContent = bounceTotal;
  hitCountEl.textContent = hitTotal;

  for (const tank of tanks) {
    const read = readouts[tank.name];
    read.health.textContent = Math.round(tank.health);
    read.healthBar.style.width = Math.max(0, tank.health) / MAX_HEALTH * 100 + '%';
    read.healthBar.parentNode.classList.toggle('bar-low', tank.health <= SHELL_DAMAGE);

    /* Heading is the angle your `turnTank` changes. Aim is your
       `aimOf`, asked directly, so it shows a dash until it works. */
    read.heading.textContent = degrees(tank.angle);
    const aim = aimOf(tank);
    read.aim.textContent = isAngle(aim) ? degrees(aim) : '—';

    read.reload.style.width = (1 - tank.reload / RELOAD_TIME) * 100 + '%';
  }

  startBtn.disabled = phase === 'between' || phase === 'over';
  startBtn.firstChild.nodeValue = phase === 'playing' ? 'Pause ' : 'Start ';
  againBtn.disabled = phase === 'waiting';
}

/* --- The cards over the arena --- */

const DISPLAY_FONT = "'Impact', 'Haettenschweiler', 'Arial Narrow', sans-serif";
const LABEL_FONT = "'Trebuchet MS', sans-serif";
const COLOUR_OF = { blue: '#6cc0ff', red: '#ff7a6b' };

function buildCurtain(aScene) {
  const back = aScene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x15190f, 0.78).setOrigin(0, 0);
  const title = aScene.add.text(WIDTH / 2, 270, '', {
    fontFamily: DISPLAY_FONT, fontSize: '68px', color: '#ffc53d'
  }).setOrigin(0.5);
  const lines = aScene.add.text(WIDTH / 2, 385, '', {
    fontFamily: LABEL_FONT, fontSize: '26px', color: '#f3e6c4', align: 'center'
  }).setOrigin(0.5).setLineSpacing(14);
  const key = aScene.add.text(WIDTH / 2, 500, '', {
    fontFamily: LABEL_FONT, fontSize: '26px', color: '#ffc53d'
  }).setOrigin(0.5);

  curtain = { group: aScene.add.container(0, 0, [back, title, lines, key]).setDepth(20), title, lines, key };
  updateCurtain();
}

function updateCurtain() {
  if (curtain === null) return;
  curtain.group.setVisible(phase === 'waiting' || phase === 'paused' || phase === 'over');

  if (phase === 'waiting') {
    curtain.title.setText('TANK DUEL');
    curtain.lines.setText('Blue drives with W A S D. Red drives with the arrows.\nHit the other tank four times to take the round.');
    curtain.key.setText('Press Enter');
  } else if (phase === 'paused') {
    curtain.title.setText('PAUSED');
    curtain.lines.setText('');
    curtain.key.setText('');
  } else if (phase === 'over') {
    const winner = blue.wins > red.wins ? blue : red;
    curtain.title.setText(winner.name.toUpperCase() + ' WINS THE DUEL');
    curtain.title.setColor(COLOUR_OF[winner.name]);
    curtain.lines.setText('Blue ' + blue.wins + ', Red ' + red.wins);
    curtain.key.setText('Press Play again');
    return;
  }
  curtain.title.setColor('#ffc53d');
}

function buildRoundCard(aScene) {
  roundCard = aScene.add.text(WIDTH / 2, HEIGHT / 2, '', {
    fontFamily: DISPLAY_FONT, fontSize: '64px', color: '#ffc53d',
    stroke: '#15190f', strokeThickness: 8
  }).setOrigin(0.5).setDepth(15).setVisible(false);
}

/* Words in the middle of the arena that fade away by themselves. */
function showRoundCard(aScene, text, colour) {
  roundCard.setText(text);
  roundCard.setColor(colour);
  roundCard.setAlpha(1);
  roundCard.setVisible(true);
  aScene.tweens.killTweensOf(roundCard);
  aScene.tweens.add({
    targets: roundCard,
    alpha: 0,
    delay: 900,
    duration: 700,
    onComplete: () => roundCard.setVisible(false)
  });
}
