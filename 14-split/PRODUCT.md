# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS. One page, `split.html`, one stylesheet, and **six** JavaScript files loaded by six `<script>` tags: `numbers.js`, `record.js`, `world.js`, `runner.js`, `rack.js`, `game.js`. One vendored library, `phaser.min.js` (Phaser 3.90.0), sits next to the HTML and loads first.

The six files share one global scope. There is no `import`, no `export`, and no `type="module"`, because `file://` blocks ES modules. That limit ends at project 17.

The art, the sounds and the stylesheet are copies of project 13's, unchanged. The page opens by double-clicking, the same as every project through 16.

## Users

- **Simon (primary learner), 11 years old.** He has finished thirteen projects, all of them one JavaScript file. He wrote project 13's eight functions himself, so he knows this code from the inside. He reads here rather than writes.
- **The father.** Teaches alongside it, and runs the git chapter at a real terminal on this repository.
- **Anyone who picks it up to play.** It is still a real endless runner, and nothing about playing it changed.

## Product Purpose

The same game as project 13, cut into six files. The split is the only thing that changed, so the split is the only thing to think about.

Three ideas earn their place.

**A file is a job, and it owns the memory for that job.** `record.js` holds the record and is the only file that says `localStorage`. `world.js` holds the obstacle list and is the only file that builds or forgets one. A learner who wants to change the saved score opens a forty-line file rather than a 1203-line one.

**Script tags run in order, and order is a real constraint.** `numbers.js` needs nobody, so it goes first. `game.js` needs everybody, so it goes last. The HTML says so in a comment next to the six tags, and swapping two of them breaks the page.

**Names are shared, which is handy and dangerous.** `world.js` calls `runSpeed`, which lives in `runner.js`, and reads `scene`, which lives in `game.js`. Nothing is asked for and nothing is imported. The README names the two costs: two files cannot use the same name, and nothing tells you which file a name came from.

Git is the fourth thing, and it is a chapter in the README rather than a project. Simon has worked inside a git repository for thirteen projects without hearing about it.

## Positioning

The usual advice about file structure is a diagram of folders in a framework the learner has never used.

Here the split is done to a program he wrote himself last week, with the game held still. Every line in the six files was in project 13. He can open both and compare them.

The rack makes the split measurable rather than a matter of taste. It counts the jobs each file does while he plays, so he can see that two files work sixty times a second, two work only at moments, and one never works at all.

## Operating Context

- Opened directly from the filesystem in a browser. No server, no install, no network.
- Read beside `13-runner/runner.js`, which is the same program in one file.
- Keyboard only. There is no touch control, the same as projects 10 to 13.
- The git chapter needs a terminal, and this repository is the thing to practise on.

## Capabilities and Constraints

**In scope now:**
- Rooftop Run, finished and playable, with no stubs anywhere.
- Six JavaScript files, each with one job named at the top of it.
- Six `<script>` tags in dependency order, with the reason in a comment.
- A rack panel counting the jobs each of the six files has done this run, with a lamp that lights when a file works.
- A status line that names the file responsible whenever something happens: `world.js` putting a crate down, `world.js` throwing one away, `runner.js` sending the runner up.
- `#demo` and `#demo-over` hashes, the same as projects 8 to 13.
- A README chapter on git: what a commit is, how to look at history, and how to get back a file you have broken.

**Explicitly deferred:** `import` and `export`, npm, a bundler and a build step (all project 17). A server (project 15). Any change to the game itself.

**Hard constraints:**
- **No stubs, and no answer key.** This is the one project in the repository with neither, and `AGENTS.md` records it as the exception.
- **No new gameplay.** Same rules, same numbers, same art, same sounds. Every difference is a difference the split made.
- One library, vendored next to the HTML. No npm, no build step, no network.
- No ES modules. Six ordinary `<script>` tags and shared globals.
- Comments use plain language for someone who has never programmed.
- Every file starts with a comment saying which number it is and what its one job is.

## Brand Commitments

The same cream plastic handheld as project 13, unchanged: warm shell, coral nameplate, glossy screen, rack of readouts down the side. The screen shows the same sunset city.

One panel on the rack is new. **The six files** lists them in load order, each with a small amber lamp and a count.

The game looking identical is the point. Only the rack knows the program has been cut up.

## Evidence on Hand

- `ROADMAP.md` names project 14 as the many-files cutover, with no new gameplay and a git chapter in the README.
- `13-runner/README.md` promised that project 14 splits a game he has already written, and teaches git.
- Measured in a browser: the page opens with no console errors, a run plays, an obstacle list stays small, and the saved record survives a refresh.
- Measured in a browser: after six seconds of play, `rack.js` and `game.js` had done hundreds of jobs each, `world.js` a handful, and `numbers.js` none.

## Product Principles

1. **The source is a deliverable.** Code an 11-year-old cannot read is a defect of the same severity as a dropped frame.
2. **Hold the game still.** The split is the lesson, so nothing else may move.
3. **A file is a job.** If a file cannot be described in one sentence, it is the wrong file.
4. **The memory goes with the job.** The file that owns a number is the file that changes it.
5. **Show the split, do not only describe it.** The rack counts the files at work.

## Accessibility & Inclusion

Unchanged from project 13. Every control is a real `<button>`. Start doubles as Pause and answers **Enter**. The status line is a live region. The canvas takes `tabindex="0"` and shows a mint focus ring inside the glass.

The file panel adds six rows. Each lamp is decorative and hidden from screen readers, and each count carries an `aria-label` naming its file, so the numbers can be read without the colour.

Touch is not supported. There are no on-screen controls.

The setting is invented: no real city, no real company, and nothing on screen but a runner, some crates and a sunset.

---
