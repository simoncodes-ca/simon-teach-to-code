# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Two programs in one folder.

The browser half is plain static HTML/CSS/JS: `scores.html`, `styles.css`, `scores.js`. One vendored library, `phaser.min.js` (Phaser 3.90.0), sits next to the HTML, the same copy as projects 9 to 14. The art is PNG files under `assets/`, and the sounds are hand-made WAV files. The page opens by double-clicking, the same as every project through 16.

The server half is `server.js`, run with `node server.js` from a terminal. It uses four built-in Node modules and nothing else: `node:http`, `node:fs`, `node:os` and `node:path`. There is no npm, no package.json and no dependency of any kind. npm arrives at project 17, and a library must not drag the build step forward.

`server.js` is a classic CommonJS file using `require`. `import` and `export` wait for project 17, on both halves.

The list lives in `scores.json` next to the server, written with `JSON.stringify`. The seed file holds three scores, so the board has something on it the first time anybody looks.

The two Phaser settings that keep the page double-clickable are the ones project 9 introduced. Its `PRODUCT.md` records why they are needed.

The server sends three CORS headers and answers `OPTIONS`. A double-clicked page has an origin of `null`, so without them every request fails. They are given wiring, commented as such, and the README asks for them to be removed once on purpose.

## Users

- **Simon (primary learner), 11 years old.** He has finished fourteen projects. All of them ran alone in one browser. He fills in six stubs across two files and reads plain-language comments, not programmer vocabulary.
- **The father.** Designs the project, runs the server on his own machine for the two-computer lesson, and watches the terminal beside the page.
- **Anyone who picks it up to play.** Thirty seconds, one row of keys, and a board worth getting onto.

## Product Purpose

The first project with two programs in it, and the first that needs a terminal.

Three ideas earn their place.

**A server is just another program, and the two of them only say two things.** `GET /scores` asks for the board. `POST /scores` carries a score to it. Both are two lines of `fetch`, and the POST has an object in the middle. Nothing else passes between them.

**`await` is how a program waits without freezing.** It arrives because the project needs it. Two `await`s per function: one for the answer crossing the network, one for reading the words out of it. A missing one leaves `Promise { <pending> }` on the page, which the README names as a bug to expect.

**Never trust what arrives.** `isGoodScore` is the first function Simon writes that a stranger's program can reach. It is six lines, and the README gives it a section of its own. `addScore` then stores a name and a number, and nothing else about a person.

The game is deliberately small and entirely given. Every idea in it was taught by projects 7 to 12. A round is a fixed thirty seconds so that two scores are comparable, which is what makes one shared board mean anything.

## Positioning

The usual first server project is a tutorial that installs Express, a router and a template engine before anything happens. The learner copies twenty lines and cannot say which of them is the server.

Here the server is 170 lines of given wiring around three functions the learner writes, and it depends on nothing. The whole of HTTP that this project needs is two methods and one path.

The rack makes the conversation visible rather than described. Two lamps and a cable light up in turn, the wells name what was asked and what came back, and the raw line shows the server's exact words before anything is done with them. The terminal shows the same conversation from the other side, one line per request.

Nothing earlier is taught again. JSON, `localStorage`, keys as state, `speed × seconds`, backwards loops over a list and sprite objects are all named and pointed back at.

## Operating Context

- The page opens directly from the filesystem. The server runs from a terminal, in this folder.
- Both halves must be running for the project to do anything. The page says so by name when the server is not answering.
- The two-computer lesson needs both machines on one wifi. `server.js` prints the address to use when it starts.
- Read beside `13-runner/runner.js` for JSON and the saved record, which this project replaces with a shared list.
- Keyboard only, on a laptop or desktop. There is no touch control.
- Sessions are short: the server's three functions one day, the page's three the next.

## Capabilities and Constraints

**In scope now:**
- Star Catch: thirty seconds, falling stars, a net on the arrow keys, gold worth 1 and blue worth 3. Given, finished, and not the lesson.
- A server holding one list for everybody, kept in `scores.json` between runs.
- Two routes and nothing else: `GET /scores` and `POST /scores`, plus the `OPTIONS` the browser asks first.
- Six stubs, three per file: `sortedTop`, `isGoodScore`, `addScore`, then `getScores`, `showScores`, `sendScore`.
- Two answer keys, one at the bottom of each file. Opening one never gives away the other.
- A Line panel showing the request, the answer in words, the time in milliseconds, and the server's raw text.
- A Name box and a Server box, both kept in this browser, so a second computer types an address instead of editing a file.
- A status line that names the responsible function, including the server's, by reading the `stub` the server sends back.
- `#demo` and `#demo-over` hashes that work with no server at all, so the page is inspectable on GitHub Pages.

**Explicitly deferred (later projects or extensions):** logins, two-player over the network, real-time sync, `import` and `export`, npm and a bundler (all project 17), types over the score object (17). Named in the README as good things to try next: a board for today, counting the rounds, refusing an impossible score, one score per person, and a second game on the same server.

**Hard constraints:**
- **No dependencies.** Built-in Node modules only, on a repository with no `package.json`. npm arrives at project 17.
- No ES modules on either half. `require` on the server, two ordinary `<script>` tags on the page.
- The page must still open by double-clicking, and must degrade with no server: it names the address it tried and the command that starts it.
- The server must never keep anything about a person beyond a name and a number.
- The server reports its own empty stubs by name, so a learner never has to guess which half is at fault.
- Comments use plain language for someone who has never programmed.
- Every completed stub makes something new visible, on the page or in the terminal.

## Brand Commitments

A dark green enamel scoreboard, bolted to a wall with four brass bolts. Seen straight on, like the eight consoles before it.

Enamel green is the board. Brass is every fitting: the nameplate, the panel edges, the Play key. Chalk white is what is written on it.

Coral belongs to the network and to nothing else. The asking lamp, the blip running along the cable, the address of the last request, and the Play key are coral. Mint green is a good answer. Red is a bad one.

Inside the screen it is night in a meadow. A deep blue sky, a hazy moon, two rows of hills, and grass along the bottom. The stars are the only bright things in it.

## Evidence on Hand

- `ROADMAP.md` names project 15 as the client and server cutover, with `fetch`, `async` and `await` as the lesson, and one request each way.
- `14-split/README.md` promised a second program that runs in a terminal, and that JSON turns up again as the thing the two programs send.
- Measured in a real browser, 23 checks, all passing: the empty state names `getScores`; a filled page against an empty server names `server.js sortedTop()` and shows `{"stub":"sortedTop"}` raw; a filled pair draws three scores, plays a round, sends a score, and puts it on top of the board.
- Measured in a real browser: a score with an empty name comes back `refused`, and a dead address comes back `no answer` with the command that starts the server.
- Measured in a real browser: `#demo-over` draws a five-name board and a finished round with no server running at all, and logs no errors.
- Measured in the terminal: the server logged `GET /scores -> 200 (3 scores)`, `POST /scores -> 200 Simon 42`, and `POST /scores -> 400 refused`, and `scores.json` held the new score afterwards.
- No public claims, scores, or testimonials exist; none should be fabricated.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **The game is not the lesson.** It is thirty seconds long so that the board means something, and given so that the network is the only new thing.
3. **Show the conversation.** Lamps, a cable, milliseconds and the server's raw words. Two programs talking is invisible unless the page insists on it.
4. **Either half may be at fault, so both say so.** The server names its own empty functions, and the page repeats the name.
5. **A program that strangers can reach checks what arrives.** That rule arrives with the first program that has strangers.

## Accessibility & Inclusion

Every control is a real `<button>` carrying plain text. Play answers **Enter**, announced with `aria-keyshortcuts`, and Enter is ignored while either text box has focus. Send my score is disabled until a round has ended, and again once the score has gone. Ask for the board is disabled while a request is in the air.

The status line is a live region and names the responsible function whenever nothing happens. The Line panel states its answer in words as well as in colour: `3 scores`, `refused`, `stub`, `no answer`. The lamps are decorative and the cable blip is removed under reduced motion.

The canvas takes `tabindex="0"` and shows a mint focus ring inside the glass, so it is clear which part of the page the keyboard is talking to. Both text boxes carry visible labels.

Below 900px the board stands up into one column and the page scrolls. The game itself has no touch controls, so a tablet can show the meadow but cannot play it.

The setting is invented: a meadow, a net and some stars. The seed names on the board are family first names and nothing else.

---
