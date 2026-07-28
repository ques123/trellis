// Tests routes/trellis.js optimistic-concurrency behaviour with an in-memory db
// stub that mirrors db.js's version contract (no Postgres needed).
//   run: node scripts/test-trellis-concurrency.js
const assert = require('assert');
const http = require('http');
const express = require('express');

// --- in-memory db stub mirroring getStateWithVersion/setState/setStateIfVersion ---
const store = { trellis: { state: { boards: [] }, version: 0 } };
const dbPath = require.resolve('../db');
require.cache[dbPath] = {
  id: dbPath, filename: dbPath, loaded: true,
  exports: {
    getStateWithVersion: async (app) => store[app] ? { state: store[app].state, version: store[app].version } : { state: null, version: 0 },
    setState: async (app, s) => { store[app] = { state: s, version: (store[app]?.version || 0) + 1 }; },
    setStateIfVersion: async (app, s, expected) => {
      const cur = store[app] || { state: null, version: 0 };
      if (cur.version === expected) { store[app] = { state: s, version: cur.version + 1 }; return { ok: true, version: store[app].version }; }
      return { ok: false, current: cur };
    },
    onStateChange: () => () => {},
  },
};

const router = require('../routes/trellis');
const app = express();
app.use(express.json());
app.use('/api/trellis', router);

let base, server;
const call = (method, path, body, headers = {}) => fetch(`${base}${path}`, {
  method, headers: { 'Content-Type': 'application/json', ...headers },
  body: body ? JSON.stringify(body) : undefined,
});

(async () => {
  server = http.createServer(app);
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  let pass = 0; const ok = n => { console.log(`  ✓ ${n}`); pass++; };

  // GET exposes version in header
  let r = await call('GET', '/api/trellis/state');
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('X-State-Version'), '0');
  ok('GET /state returns X-State-Version header');

  // PUT with matching version succeeds + bumps
  r = await call('PUT', '/api/trellis/state', { boards: [{ id: 'b1', lists: [] }] }, { 'X-State-Version': '0' });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).version, 1);
  assert.equal(store.trellis.version, 1);
  ok('PUT with matching version writes + bumps to 1');

  // Simulate an AGENT write bumping the version behind a stale tab (tab still thinks v1)
  store.trellis = { state: { boards: [{ id: 'b1', lists: [{ id: 'l1', cards: [{ id: 'agentcard', title: 'from agent' }] }] }] }, version: 2 };

  // Stale PUT (expects v1) -> 409 with current state so the client can merge
  r = await call('PUT', '/api/trellis/state', { boards: [{ id: 'b1', lists: [] }] }, { 'X-State-Version': '1' });
  assert.equal(r.status, 409);
  const conflict = await r.json();
  assert.equal(conflict.version, 2);
  assert.equal(conflict.state.boards[0].lists[0].cards[0].id, 'agentcard');
  assert.equal(store.trellis.version, 2); // not clobbered
  ok('stale PUT -> 409 returning current state (agent card preserved)');

  // Retry at the now-correct version succeeds
  r = await call('PUT', '/api/trellis/state', { boards: [{ id: 'b1', lists: [{ id: 'l1', cards: [{ id: 'agentcard' }, { id: 'usercard' }] }] }] }, { 'X-State-Version': '2' });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).version, 3);
  ok('retry at correct version succeeds');

  // Legacy client (no version header) -> unconditional write, no 409
  r = await call('PUT', '/api/trellis/state', { boards: [] });
  assert.equal(r.status, 200);
  const legacy = await r.json();
  assert.equal(legacy.ok, true);
  assert.equal(legacy.version, undefined); // legacy path doesn't echo version
  ok('legacy PUT without version header still works (unconditional)');

  // Bad version header -> 400
  r = await call('PUT', '/api/trellis/state', { boards: [] }, { 'X-State-Version': 'abc' });
  assert.equal(r.status, 400);
  ok('PUT with non-numeric version -> 400');

  console.log(`\nAll ${pass} checks passed.`);
  server.close(); process.exit(0);
})().catch(err => { console.error('\nTEST FAILED:', err.message); if (server) server.close(); process.exit(1); });
