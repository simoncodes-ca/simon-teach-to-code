/* =====================================================================
   server.ts. The map server. This is the other program.

   It is project 15's score server again, holding maps instead of
   scores. It is finished, and there is nothing in it for you to write.
   Read it anyway, because one line in it calls your own `linesToMap`.

   It keeps every map as its own file in the `maps` folder. Open one in
   your editor and you can read the map, one row of letters per line.

   It answers three questions:

       GET  /maps          which maps do you have?
       GET  /maps/island   hand me the map in maps/island.json
       POST /maps          here is a map, keep it

   Start it from a terminal, in this folder:

       npm run server

   Leave that terminal running while you use the editor. Press Ctrl and
   C together to stop it. Stop it and start it again after you change
   map.ts, because it only reads your functions when it starts.

   Node runs this file straight from TypeScript. Project 17 needed Vite
   to rub out the types before the browser could run the code. Node
   rubs them out by itself.
   ===================================================================== */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { linesToMap } from './map.ts';


/* ---------------------------------------------------------------------
   THE MEMORY
   --------------------------------------------------------------------- */

const PORT = 4000;              // the door number, the same as project 15
const LONGEST_NAME = 24;        // longer map names are cut down to this
const BIGGEST_BODY = 10000;     // a message longer than this is thrown away

/* The folder the maps live in. `import.meta.dirname` is the folder
   this file is in, so the server finds its maps wherever you start it
   from. Project 15 called this `__dirname`. */
const MAPS_FOLDER = path.join(import.meta.dirname, 'maps');

/* What a saved map file holds. */
type SavedMap = {
  name: string;
  lines: string[];
};

/* One map in the list the editor shows. `file` is the name of its
   file without `.json`, and `name` is the name a person gave it. */
type MapListing = {
  file: string;
  name: string;
};


/* ---------------------------------------------------------------------
   THE MAPS FOLDER
   --------------------------------------------------------------------- */

/* Turn a map's name into a safe name for its file.

   Never trust what arrives, and a name arrives from a stranger. A name
   like `../../secret` would reach outside the maps folder, into files
   the server must never touch. So only lowercase letters, digits and
   dashes are kept. Everything else becomes a dash.

   'Sandy Island' becomes 'sandy-island'. */
function fileNameFor(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, LONGEST_NAME);
}

/* Read one map file. A file that is missing, or is not a map, hands
   back `null` instead of stopping the server. */
function readMapFile(file: string): SavedMap | null {
  try {
    const text = fs.readFileSync(path.join(MAPS_FOLDER, file + '.json'), 'utf8');
    const got: unknown = JSON.parse(text);
    return isSavedMap(got) ? got : null;
  } catch (error) {
    return null;
  }
}

/* Every map in the folder, sorted by name. */
function listMaps(): MapListing[] {
  const listings: MapListing[] = [];
  for (const entry of fs.readdirSync(MAPS_FOLDER)) {
    if (!entry.endsWith('.json')) continue;
    const file = entry.slice(0, -'.json'.length);
    const saved = readMapFile(file);
    if (saved !== null) listings.push({ file: file, name: saved.name });
  }
  return listings.sort((a, b) => a.name.localeCompare(b.name));
}

/* Write a map to its file, as JSON with one row of letters per line. */
function writeMapFile(file: string, saved: SavedMap): void {
  const rows = saved.lines.map((line) => '    ' + JSON.stringify(line));
  const text = '{\n  "name": ' + JSON.stringify(saved.name) + ',\n  "lines": [\n' + rows.join(',\n') + '\n  ]\n}\n';
  fs.writeFileSync(path.join(MAPS_FOLDER, file + '.json'), text);
}


/* ---------------------------------------------------------------------
   NEVER TRUST WHAT ARRIVES

   Before your `linesToMap` sees anything, the server checks the fields.
   A map must be an object with a name that is text, and a list of
   lines that are all text.

   `unknown` is the type for "anything at all". TypeScript will not let
   you use an unknown thing until you have checked what it is, which is
   exactly the rule project 15 taught.
   --------------------------------------------------------------------- */

function isSavedMap(thing: unknown): thing is SavedMap {
  if (thing === null || typeof thing !== 'object') return false;
  if (!('name' in thing) || !('lines' in thing)) return false;
  if (typeof thing.name !== 'string' || thing.name.trim() === '') return false;
  if (!Array.isArray(thing.lines)) return false;
  return thing.lines.every((line) => typeof line === 'string');
}


/* ---------------------------------------------------------------------
   TALKING TO THE BROWSER

   All of this is project 15's wiring, with types added.
   --------------------------------------------------------------------- */

/* The editor page comes from `npm run dev`, on a different door
   number. A browser only lets a page talk to a different address when
   that address says yes, and these three lines are the yes. */
function allowTheBrowser(response: http.ServerResponse): void {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

function sendJson(response: http.ServerResponse, status: number, thing: object): void {
  const text = JSON.stringify(thing);
  allowTheBrowser(response);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(text)
  });
  response.end(text);
}

/* Gather up the message a browser sent, and turn it back into a thing.
   It is `unknown`, because it could be anything at all. */
function readBody(request: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let text = '';
    request.on('data', (piece) => {
      text += piece;
      if (text.length > BIGGEST_BODY) {
        text = '';
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(text));
      } catch (error) {
        resolve(null);
      }
    });
    request.on('error', () => resolve(null));
  });
}

/* A line in the terminal for every request. */
function log(request: http.IncomingMessage, status: number, note: string): void {
  const method = String(request.method).padEnd(5, ' ');
  console.log(method + ' ' + request.url + '   ->   ' + status + '   ' + note);
}


/* ---------------------------------------------------------------------
   THE THREE QUESTIONS
   --------------------------------------------------------------------- */

/* GET /maps. Which maps are there? */
function handleList(request: http.IncomingMessage, response: http.ServerResponse): void {
  const maps = listMaps();
  sendJson(response, 200, { maps: maps });
  log(request, 200, '(' + maps.length + ' maps)');
}

/* GET /maps/island. Hand back one map. */
function handleOne(request: http.IncomingMessage, response: http.ServerResponse, file: string): void {
  const saved = fileNameFor(file) === file ? readMapFile(file) : null;
  if (saved === null) {
    sendJson(response, 404, { error: 'There is no map called ' + file + '.' });
    log(request, 404, 'no such map');
    return;
  }
  sendJson(response, 200, saved);
  log(request, 200, saved.name);
}

/* POST /maps. Keep a map. */
async function handleSave(request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
  const sent = await readBody(request);

  if (!isSavedMap(sent)) {
    sendJson(response, 400, { error: 'That is not shaped like a map.' });
    log(request, 400, 'refused, wrong shape');
    return;
  }

  const name = sent.name.trim().slice(0, LONGEST_NAME);
  const file = fileNameFor(name);
  if (file === '') {
    sendJson(response, 400, { error: 'A map name needs at least one letter or number.' });
    log(request, 400, 'refused, no usable name');
    return;
  }

  /* Here is your function, at work inside a second program. The server
     only keeps a map that `linesToMap` can read back. So the check you
     wrote once protects the editor, the tests and the server. */
  const map = linesToMap(name, sent.lines);

  if (map === undefined) {
    sendJson(response, 200, { stub: 'linesToMap' });
    log(request, 200, 'linesToMap() is still empty, so nothing was saved');
    return;
  }
  if (map === null) {
    sendJson(response, 400, { error: 'Those lines are not a map.' });
    log(request, 400, 'refused by linesToMap');
    return;
  }

  writeMapFile(file, { name: name, lines: sent.lines });
  sendJson(response, 200, { saved: file, maps: listMaps() });
  log(request, 200, 'saved ' + file + '.json');
}


/* ---------------------------------------------------------------------
   THE SERVER ITSELF
   --------------------------------------------------------------------- */

const server = http.createServer(async (request, response) => {
  const where = String(request.url).split('?')[0];

  if (request.method === 'OPTIONS') {
    allowTheBrowser(response);
    response.writeHead(204);
    response.end();
    return;
  }

  if (where === '/maps' && request.method === 'GET') {
    handleList(request, response);
    return;
  }

  if (where.startsWith('/maps/') && request.method === 'GET') {
    handleOne(request, response, where.slice('/maps/'.length));
    return;
  }

  if (where === '/maps' && request.method === 'POST') {
    await handleSave(request, response);
    return;
  }

  sendJson(response, 404, { error: 'This server only knows about /maps.' });
  log(request, 404, 'no idea');
});

fs.mkdirSync(MAPS_FOLDER, { recursive: true });

server.listen(PORT, () => {
  console.log('');
  console.log('The map server is listening. It has ' + listMaps().length + ' maps.');
  console.log('');
  console.log('  http://localhost:' + PORT);
  console.log('');
  console.log('  GET  /maps         the list of maps');
  console.log('  GET  /maps/island  one map');
  console.log('  POST /maps         keep a map');
  console.log('');
  console.log('Press Ctrl and C together to stop.');
  console.log('');
});
