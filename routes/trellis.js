const express = require('express');
const router = express.Router();
const { setState, getStateWithVersion, setStateIfVersion, onStateChange } = require('../db');

const APP_NAME = 'trellis';

// Defense-in-depth against duplicated cards: never PERSIST the same card id twice
// within a board. A buggy or stale client (e.g. one that merged a card which had
// moved lists into its new list without dropping the old copy) could otherwise
// save a duplicate that then sticks. We keep the occurrence in the highest-
// position list (a move's destination, e.g. "done") and drop the rest, so a
// move-to-done wins over a lingering old copy. Mutates the state in place.
function dedupeCards(state) {
  if (!state || !Array.isArray(state.boards)) return state;
  for (const board of state.boards) {
    const lists = Array.isArray(board.lists) ? board.lists : [];
    // Highest-position list wins (sorted ascending → last write to keepList).
    const keepList = new Map();
    const sorted = lists.slice().sort((a, b) => (a.position || 0) - (b.position || 0));
    for (const l of sorted) for (const c of (l.cards || [])) keepList.set(c.id, l.id);
    const placed = new Set();
    for (const l of lists) {
      if (!Array.isArray(l.cards)) continue;
      l.cards = l.cards.filter(c => {
        if (keepList.get(c.id) !== l.id) return false; // belongs in another list
        if (placed.has(c.id)) return false;            // within-list duplicate
        placed.add(c.id);
        return true;
      });
      l.cards.forEach((c, i) => { c.position = i; });
    }
  }
  return state;
}

// GET /state — returns the board state in the body (unchanged shape, so older
// cached frontends keep working) plus the current version in X-State-Version.
router.get('/state', async (req, res) => {
  try {
    const { state, version } = await getStateWithVersion(APP_NAME);
    // Seed the diff baseline so the next write can be pushed as a patch rather
    // than sending everyone back here for the whole blob.
    if (!snapshot || snapshot.version < version) snapshot = { version, state };
    res.set('X-State-Version', String(version));
    res.json(state);
  } catch (err) {
    console.error('GET /api/trellis/state error:', err);
    res.status(500).json({ error: 'Failed to load state' });
  }
});

// GET /version — cheap poll endpoint so the browser can detect an external
// write (e.g. an agent adding a card) and live-refresh without a full reload.
router.get('/version', async (req, res) => {
  try {
    const { version } = await getStateWithVersion(APP_NAME);
    res.json({ version });
  } catch (err) {
    console.error('GET /api/trellis/version error:', err);
    res.status(500).json({ error: 'Failed to load version' });
  }
});

// ===== LIVE UPDATES (SSE) =====
// Boards update the moment anyone writes — another tab, or Claude via the agent
// API — instead of on the next poll tick.
//
// The event carries the CHANGE, not just a "something moved" ping, because the
// whole state is ~330KB (~93KB compressed) and shipping that to a browser on the
// other side of the world costs about a second: 450ms before the first byte and
// another 600ms to download. A card move diffs down to a couple of KB, and the
// stream is already open, so it lands in roughly one one-way trip. When we can't
// produce a cheap diff we send the version alone and the client refetches.
const SSE_HEARTBEAT_MS = 25000;   // < nginx proxy_read_timeout and Cloudflare's idle cap
const SSE_MAX_CLIENTS = 64;       // guard against runaway reconnect loops
const PATCH_MAX_BYTES = 32768;    // past this, refetching the blob is the better deal

const sseClients = new Set();
let snapshot = null;              // { version, state } the last patch was measured from

// Diff two trellis states down to individual cards. Lists are described by their
// card ORDER plus only the cards whose contents actually changed, so a move is a
// couple of id arrays rather than two full lists. Returns null when there is no
// cheap answer — too large, or a shape we don't model — and the client refetches.
function computePatch(prev, next) {
  if (!prev || !next || !Array.isArray(prev.boards) || !Array.isArray(next.boards)) return null;
  const patch = { boards: [], removedBoards: [] };
  const prevBoards = new Map(prev.boards.map(b => [b.id, b]));

  for (const nb of next.boards) {
    const pb = prevBoards.get(nb.id);
    if (!pb) { patch.boards.push({ id: nb.id, full: nb }); continue; }
    if (JSON.stringify(pb) === JSON.stringify(nb)) continue;

    const prevCards = new Map();
    for (const l of pb.lists || []) for (const c of l.cards || []) prevCards.set(c.id, JSON.stringify(c));

    const entry = { ...nb, lists: [] };
    for (const nl of nb.lists || []) {
      const compact = {
        id: nl.id, title: nl.title, position: nl.position,
        cardIds: (nl.cards || []).map(c => c.id),
        cards: {}
      };
      for (const c of nl.cards || []) {
        if (prevCards.get(c.id) !== JSON.stringify(c)) compact.cards[c.id] = c; // new, edited or moved
      }
      entry.lists.push(compact);
    }
    patch.boards.push(entry);
  }

  for (const pb of prev.boards) if (!next.boards.some(b => b.id === pb.id)) patch.removedBoards.push(pb.id);
  if (JSON.stringify(prev.notifications || []) !== JSON.stringify(next.notifications || [])) {
    patch.notifications = next.notifications || [];
  }
  if (!patch.boards.length && !patch.removedBoards.length && !patch.notifications) return null;
  return JSON.stringify(patch).length > PATCH_MAX_BYTES ? null : patch;
}

function broadcast(payload) {
  const frame = `event: version\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    if (payload.version <= client.lastSent) continue; // already told this one
    client.lastSent = payload.version;
    try { client.res.write(frame); } catch { /* dropped connection; cleanup runs on close */ }
  }
}

// One subscription for the whole process: the diff is computed once per write,
// not once per connected board.
onStateChange(APP_NAME, evt => {
  const version = Number(evt.version);
  if (!Number.isFinite(version)) return;
  if (!evt.state) {
    // Came from another process over NOTIFY — we don't have the new state, so we
    // can't diff, and our snapshot is now stale. A version we've already passed
    // is old news and must not cost us a usable baseline.
    if (snapshot && snapshot.version >= version) return;
    snapshot = null;
    broadcast({ version });
    return;
  }
  let patch = null;
  if (snapshot && snapshot.version === version - 1) {
    try { patch = computePatch(snapshot.state, evt.state); }
    catch (err) { console.error('trellis patch failed:', err.message); patch = null; }
  }
  snapshot = { version, state: evt.state };
  broadcast(patch ? { version, base: version - 1, patch } : { version });
});

router.get('/events', async (req, res) => {
  if (sseClients.size >= SSE_MAX_CLIENTS) return res.status(503).json({ error: 'Too many event streams' });

  res.set({
    'Content-Type': 'text/event-stream',
    // no-transform stops Cloudflare/nginx buffering or rewriting the stream;
    // X-Accel-Buffering is nginx's per-response switch for the same thing.
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  res.flushHeaders();

  const client = { res, lastSent: 0 };
  sseClients.add(client);

  // Opening version, so a client that reconnected after missing a write
  // reconciles immediately instead of waiting for the next one.
  try {
    const { state, version } = await getStateWithVersion(APP_NAME);
    if (!snapshot) snapshot = { version, state };
    client.lastSent = version;
    res.write(`event: version\ndata: ${JSON.stringify({ version })}\n\n`);
  } catch (err) {
    console.error('GET /api/trellis/events initial version failed:', err.message);
  }

  const heartbeat = setInterval(() => {
    try { res.write(': ping\n\n'); } catch { /* cleanup runs on close */ }
  }, SSE_HEARTBEAT_MS);

  const cleanup = () => {
    if (!sseClients.has(client)) return;
    sseClients.delete(client);
    clearInterval(heartbeat);
  };
  req.on('close', cleanup);
  res.on('error', cleanup);
});

// PUT /state — optimistic concurrency. The client echoes the X-State-Version it
// last loaded; we only write if nothing newer landed in between (e.g. an agent
// added a card), otherwise 409 with the current state so the client reconciles.
// A client that sends no version (older cached frontend) falls back to the old
// unconditional write — same behaviour as before, no hard break on deploy.
router.put('/state', async (req, res) => {
  try {
    const body = dedupeCards(req.body); // never persist a duplicated card id
    const header = req.get('X-State-Version');
    if (header === undefined || header === '') {
      await setState(APP_NAME, body);
      return res.json({ ok: true });
    }
    const expected = Number(header);
    if (!Number.isFinite(expected)) {
      return res.status(400).json({ error: 'Invalid X-State-Version' });
    }
    const result = await setStateIfVersion(APP_NAME, body, expected);
    if (result.ok) {
      res.set('X-State-Version', String(result.version));
      return res.json({ ok: true, version: result.version });
    }
    // Conflict: hand back the authoritative state so the client can merge + retry.
    res.set('X-State-Version', String(result.current.version));
    res.status(409).json({ error: 'version_conflict', version: result.current.version, state: result.current.state });
  } catch (err) {
    console.error('PUT /api/trellis/state error:', err);
    res.status(500).json({ error: 'Failed to save state' });
  }
});

module.exports = router;
module.exports.dedupeCards = dedupeCards; // exported for tests
