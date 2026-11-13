// Self-contained test for routes/trellis-agent.js.
// Stubs the db layer with an in-memory trellis state (no Postgres needed),
// spins the router on an ephemeral port, and exercises every endpoint.
//   run: TRELLIS_AGENT_TOKEN=test-token node scripts/test-trellis-agent.js
const assert = require('assert');
const http = require('http');
const express = require('express');

process.env.TRELLIS_AGENT_TOKEN = 'test-token';
process.env.TRELLIS_AGENT_TOKEN_CODEX = 'codex-token';

// --- in-memory state + db stub (injected before the router is required) ---
function sampleState() {
  return {
    users: [{ id: 'u1', name: 'Owner' }],
    projects: [{ id: 'p1', name: 'Engineering' }],
    boards: [{
      id: 'b1', title: 'pbrain', projectId: 'p1', starred: true,
      lists: [
        { id: 'l1', title: 'To Do', position: 0, cards: [
          { id: 'c1', title: 'Existing task', description: '', position: 0, labels: ['red'], dueDate: null, dueDone: false, members: [], checklists: [], comments: [], attachments: [], createdAt: 1 },
        ] },
        { id: 'l2', title: 'In Progress', position: 1, cards: [] },
        { id: 'l3', title: 'Done', position: 2, cards: [] },
      ],
    }],
  };
}

let STATE = sampleState();
const dbPath = require.resolve('../db');
require.cache[dbPath] = {
  id: dbPath, filename: dbPath, loaded: true,
  exports: {
    getState: async () => STATE,
    mutateState: async (app, fn) => fn(STATE),
  },
};

const router = require('../routes/trellis-agent');

const app = express();
app.use(express.json());
app.use('/api/trellis/agent', router);

let base, server;
const H = { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' };
const CODEX_H = { Authorization: 'Bearer codex-token', 'Content-Type': 'application/json' };
const call = async (method, path, body, headers = H) => {
  const res = await fetch(`${base}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch (_) {}
  return { status: res.status, json };
};

(async () => {
  server = http.createServer(app);
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  let pass = 0;
  const ok = (name) => { console.log(`  ✓ ${name}`); pass++; };

  // auth
  assert.equal((await call('GET', '/api/trellis/agent/boards', null, {})).status, 401);
  ok('rejects missing token (401)');
  assert.equal((await call('GET', '/api/trellis/agent/boards', null, { Authorization: 'Bearer wrong' })).status, 401);
  ok('rejects wrong token (401)');

  // reads
  let r = await call('GET', '/api/trellis/agent/boards');
  assert.equal(r.status, 200);
  assert.equal(r.json.boards.length, 1);
  assert.equal(r.json.boards[0].projectName, 'Engineering');
  assert.equal(r.json.boards[0].lists[0].cardCount, 1);
  ok('GET /boards returns index with counts + projectName');

  r = await call('GET', '/api/trellis/agent/boards/b1');
  assert.equal(r.status, 200);
  assert.equal(r.json.lists.length, 3);
  ok('GET /boards/:id returns full board');

  assert.equal((await call('GET', '/api/trellis/agent/boards/nope')).status, 404);
  ok('GET /boards/:id 404s unknown board');

  // create
  r = await call('POST', '/api/trellis/agent/cards', { boardId: 'b1', listId: 'l1', title: '  New feature  ', labels: ['blue'] });
  assert.equal(r.status, 201);
  assert.equal(r.json.card.title, 'New feature'); // trimmed
  assert.equal(r.json.card.position, 1); // appended after existing
  const newId = r.json.card.id;
  assert.equal(STATE.boards[0].lists[0].cards.length, 2);
  ok('POST /cards creates + trims + appends');
  assert.equal(r.json.card.createdBy, 'claude');
  assert.deepEqual(r.json.card.members, ['claude']);
  ok('POST /cards stamps createdBy + claude member');
  assert.equal(r.json.card.origin, null); // no origin given → null (ordinary agent-filed card)
  ok('POST /cards defaults origin to null');
  // create pushes an unread agent notification with the card id
  assert.ok(Array.isArray(STATE.notifications) && STATE.notifications.length >= 1);
  assert.equal(STATE.notifications[0].userId, 'claude');
  assert.equal(STATE.notifications[0].read, false);
  assert.equal(STATE.notifications[0].type, 'create');
  assert.equal(STATE.notifications[0].cardId, newId);
  ok('POST /cards adds unread claude notification (with cardId)');

  // origin: auto-logged cards carry a provenance marker; unknown values are ignored
  let ro = await call('POST', '/api/trellis/agent/cards', { boardId: 'b1', listId: 'l1', title: 'autolog card', origin: 'autolog' });
  assert.equal(ro.json.card.origin, 'autolog');
  ok('POST /cards accepts origin:"autolog"');
  ro = await call('POST', '/api/trellis/agent/cards', { boardId: 'b1', listId: 'l1', title: 'bogus origin', origin: 'whatever' });
  assert.equal(ro.json.card.origin, null); // whitelist rejects unknown origins
  ok('POST /cards ignores an unknown origin (whitelist)');

  assert.equal((await call('POST', '/api/trellis/agent/cards', { boardId: 'b1', listId: 'l1' })).status, 400);
  ok('POST /cards 400s without title');
  assert.equal((await call('POST', '/api/trellis/agent/cards', { boardId: 'b1', listId: 'bad', title: 'x' })).status, 404);
  ok('POST /cards 404s unknown list');

  // assigned inbox: the just-created card (member=claude) shows up for claude
  r = await call('GET', '/api/trellis/agent/assigned');
  assert.equal(r.status, 200);
  assert.equal(r.json.agent, 'claude');
  const inbox = r.json.cards.find(c => c.id === newId);
  assert.ok(inbox, 'newId present in claude inbox');
  assert.equal(inbox.boardId, 'b1');
  assert.equal(inbox.listId, 'l1');
  assert.equal(inbox.listTitle, 'To Do');
  ok('GET /assigned returns the agent\'s member cards with board/list context');
  // ...but not for a different agent identity
  r = await call('GET', '/api/trellis/agent/assigned', null, CODEX_H);
  assert.equal(r.status, 200);
  assert.ok(!r.json.cards.some(c => c.id === newId));
  ok('GET /assigned is per-agent (codex does not see claude\'s card)');
  // ?boardId scopes to one board
  r = await call('GET', '/api/trellis/agent/assigned?boardId=nope');
  assert.equal(r.status, 200);
  assert.equal(r.json.count, 0);
  ok('GET /assigned ?boardId filters by board');

  // patch
  r = await call('PATCH', `/api/trellis/agent/cards/${newId}`, { description: 'details', dueDone: true });
  assert.equal(r.status, 200);
  assert.equal(r.json.card.description, 'details');
  assert.equal(r.json.card.dueDone, true);
  ok('PATCH /cards/:id updates fields');
  assert.equal((await call('PATCH', `/api/trellis/agent/cards/${newId}`, { title: '   ' })).status, 400);
  ok('PATCH /cards/:id 400s on empty title');

  // move c1 from l1 -> l2
  r = await call('POST', '/api/trellis/agent/cards/c1/move', { listId: 'l2' });
  assert.equal(r.status, 200);
  assert.equal(r.json.listId, 'l2');
  assert.equal(STATE.boards[0].lists[0].cards.find(c => c.id === 'c1'), undefined);
  assert.equal(STATE.boards[0].lists[1].cards[0].id, 'c1');
  // source renumbered: remaining card now position 0
  assert.equal(STATE.boards[0].lists[0].cards[0].position, 0);
  ok('POST /move relocates card + renumbers both lists');
  assert.equal(STATE.notifications[0].type, 'move');
  assert.ok(STATE.notifications[0].suffix.startsWith(' to '));
  ok('POST /move adds a move notification with destination suffix');

  // move with explicit position
  r = await call('POST', `/api/trellis/agent/cards/${newId}/move`, { listId: 'l2', position: 0 });
  assert.equal(r.status, 200);
  assert.equal(STATE.boards[0].lists[1].cards[0].id, newId);
  assert.equal(STATE.boards[0].lists[1].cards[0].position, 0);
  ok('POST /move honors explicit position');

  assert.equal((await call('POST', '/api/trellis/agent/cards/c1/move', { listId: 'ghost' })).status, 404);
  ok('POST /move 404s unknown target list');

  // move-to-done lands at the TOP (latest finished work first)
  const dA = (await call('POST', '/api/trellis/agent/cards', { boardId: 'b1', listId: 'l3', title: 'done-A' })).json.card.id;
  const dB = (await call('POST', '/api/trellis/agent/cards', { boardId: 'b1', listId: 'l1', title: 'to-be-done-B' })).json.card.id;
  r = await call('POST', `/api/trellis/agent/cards/${dB}/move`, { listId: 'l3' });
  assert.equal(r.status, 200);
  assert.equal(r.json.position, 0);
  assert.equal(STATE.boards[0].lists[2].cards[0].id, dB); // moved to the top
  assert.equal(STATE.boards[0].lists[2].cards[1].id, dA); // existing card pushed down
  ok('POST /move into a "Done" list defaults to the TOP');
  // an explicit position still wins over the done-top default
  const dC = (await call('POST', '/api/trellis/agent/cards', { boardId: 'b1', listId: 'l1', title: 'C' })).json.card.id;
  r = await call('POST', `/api/trellis/agent/cards/${dC}/move`, { listId: 'l3', position: 2 });
  assert.equal(r.status, 200);
  assert.equal(STATE.boards[0].lists[2].cards[2].id, dC);
  ok('POST /move explicit position overrides the done-top default');

  // comments
  r = await call('POST', '/api/trellis/agent/cards/c1/comments', { text: 'Working on this now' });
  assert.equal(r.status, 201);
  assert.equal(r.json.comment.userId, 'claude');
  assert.ok(STATE.users.some(u => u.id === 'claude')); // agent user injected
  const c1 = STATE.boards[0].lists[1].cards.find(c => c.id === 'c1');
  assert.equal(c1.comments.length, 1);
  ok('POST /comments appends + injects claude user');
  assert.equal(STATE.notifications[0].type, 'comment');
  assert.equal(STATE.notifications[0].cardId, 'c1');
  ok('POST /comments adds a comment notification');
  assert.equal((await call('POST', '/api/trellis/agent/cards/c1/comments', { text: '' })).status, 400);
  ok('POST /comments 400s on empty text');

  // get single card
  r = await call('GET', '/api/trellis/agent/cards/c1');
  assert.equal(r.status, 200);
  assert.equal(r.json.listId, 'l2');
  ok('GET /cards/:id returns card + location');

  // delete: agent CANNOT delete a human-made card (c1 has no createdBy)
  assert.equal((await call('DELETE', '/api/trellis/agent/cards/c1')).status, 403);
  ok('DELETE 403s on a card the agent did not create');
  // delete: agent CAN delete a card it created (newId, createdBy=claude)
  r = await call('DELETE', `/api/trellis/agent/cards/${newId}`);
  assert.equal(r.status, 200);
  assert.equal(r.json.deleted, newId);
  assert.equal((await call('GET', `/api/trellis/agent/cards/${newId}`)).status, 404);
  ok('DELETE removes an agent-created card');
  assert.equal(STATE.notifications[0].type, 'delete');
  assert.equal(STATE.notifications[0].cardId, newId);
  ok('DELETE adds a delete notification');
  assert.equal((await call('DELETE', '/api/trellis/agent/cards/ghost')).status, 404);
  ok('DELETE 404s unknown card');

  // --- board creation ---
  assert.equal((await call('POST', '/api/trellis/agent/boards', {})).status, 400);
  assert.equal((await call('POST', '/api/trellis/agent/boards', { title: 'x', lists: [] })).status, 400);
  ok('POST /boards 400s without a title or with empty lists');
  r = await call('POST', '/api/trellis/agent/boards', { title: 'New Project' });
  assert.equal(r.status, 201);
  assert.equal(r.json.created, true);
  assert.deepEqual(r.json.board.lists.map(l => l.title), ['backlog', 'to do', 'doing', 'QC', 'done']);
  assert.equal(STATE.boards[0].id, r.json.board.id);
  assert.deepEqual(STATE.boards[0].members, []);
  const newBoardId = r.json.board.id;
  ok('POST /boards creates a board with backlog / to do / doing / QC / done at the top');
  r = await call('POST', '/api/trellis/agent/boards', { title: '  new project ' });
  assert.equal(r.status, 200);
  assert.equal(r.json.created, false);
  assert.equal(r.json.board.id, newBoardId);
  assert.equal(STATE.boards.filter(b => b.title.toLowerCase() === 'new project').length, 1);
  ok('POST /boards is idempotent by title (case/space-insensitive)');
  r = await call('POST', '/api/trellis/agent/boards', { title: 'Custom', lists: ['Backlog', 'Doing', 'Done'] });
  assert.equal(r.status, 201);
  assert.deepEqual(r.json.board.lists.map(l => l.title), ['Backlog', 'Doing', 'Done']);
  ok('POST /boards accepts custom list titles');
  r = await call('POST', '/api/trellis/agent/cards', { boardId: newBoardId, listId: r.json.board.lists[0].id, title: 'wrong board' });
  assert.equal(r.status, 404);
  ok('a new board\'s lists are scoped to it');

  // --- list creation (backfilling backlog / QC on an existing board) ---
  assert.equal((await call('POST', '/api/trellis/agent/boards/ghost/lists', { title: 'QC' })).status, 404);
  assert.equal((await call('POST', '/api/trellis/agent/boards/b1/lists', {})).status, 400);
  assert.equal((await call('POST', '/api/trellis/agent/boards/b1/lists', { title: 'QC', position: -1 })).status, 400);
  ok('POST /boards/:id/lists 404s unknown board, 400s bad input');
  const titles = () => STATE.boards.find(b => b.id === 'b1').lists.slice().sort((a, b) => a.position - b.position).map(l => l.title);
  const before = titles();
  r = await call('POST', '/api/trellis/agent/boards/b1/lists', { title: 'QC', position: before.length - 1 });
  assert.equal(r.status, 201);
  assert.deepEqual(titles(), [...before.slice(0, -1), 'QC', before[before.length - 1]]);
  assert.deepEqual(r.json.board.lists.map(l => l.title), titles());
  ok('POST /boards/:id/lists inserts QC before the last column and renumbers');
  r = await call('POST', '/api/trellis/agent/boards/b1/lists', { title: 'Backlog', position: 0 });
  assert.equal(r.status, 201);
  assert.equal(titles()[0], 'Backlog');
  assert.deepEqual(STATE.boards.find(b => b.id === 'b1').lists.map(l => l.position).sort(), titles().map((_, i) => i));
  ok('POST /boards/:id/lists puts backlog first');
  r = await call('POST', '/api/trellis/agent/boards/b1/lists', { title: 'qc', position: 0 });
  assert.equal(r.status, 200);
  assert.equal(r.json.created, false);
  assert.equal(titles().filter(t => t.toLowerCase() === 'qc').length, 1);
  ok('POST /boards/:id/lists is idempotent by title');
  r = await call('POST', '/api/trellis/agent/boards/b1/lists', { title: 'Later' });
  assert.equal(titles()[titles().length - 1], 'Later');
  ok('POST /boards/:id/lists defaults to the end');

  // --- multi-agent identity (Codex) ---
  // a different token resolves to a different agent identity
  r = await call('POST', '/api/trellis/agent/cards', { boardId: 'b1', listId: 'l1', title: 'codex card' }, CODEX_H);
  assert.equal(r.status, 201);
  assert.equal(r.json.card.createdBy, 'codex');
  assert.deepEqual(r.json.card.members, ['codex']);
  assert.equal(STATE.notifications[0].userId, 'codex');
  const codexCardId = r.json.card.id;
  ok('Codex token stamps createdBy/member/notification as codex');
  // cross-agent delete is forbidden: Claude cannot delete Codex's card
  assert.equal((await call('DELETE', `/api/trellis/agent/cards/${codexCardId}`, null, H)).status, 403);
  ok('Claude cannot delete a Codex-created card (403)');
  // Codex can delete its own card
  assert.equal((await call('DELETE', `/api/trellis/agent/cards/${codexCardId}`, null, CODEX_H)).status, 200);
  ok('Codex can delete its own card');
  // an unknown token is rejected
  assert.equal((await call('GET', '/api/trellis/agent/boards', null, { Authorization: 'Bearer nope-token' })).status, 401);
  ok('unknown token -> 401');

  console.log(`\nAll ${pass} checks passed.`);
  server.close();
  process.exit(0);
})().catch(err => {
  console.error('\nTEST FAILED:', err.message);
  if (server) server.close();
  process.exit(1);
});
