// Tests computePatch in routes/trellis.js: the live-update diff must carry a
// board's project folder and the project list, or other open tabs keep a stale
// copy and later save it back over the change.
//   run: node scripts/test-trellis-patch.js
const assert = require('assert');

// computePatch is pure; stub db so requiring the router needs no Postgres.
const dbPath = require.resolve('../db');
require.cache[dbPath] = {
  id: dbPath, filename: dbPath, loaded: true,
  exports: {
    getStateWithVersion: async () => ({ state: null, version: 0 }),
    setState: async () => {},
    setStateIfVersion: async () => ({ ok: true, version: 1 }),
    onStateChange: () => () => {},
  },
};
const { computePatch } = require('../routes/trellis');

let pass = 0;
const ok = n => { console.log(`  ✓ ${n}`); pass++; };
const clone = x => JSON.parse(JSON.stringify(x));

const base = {
  boards: [
    { id: 'b1', title: 'One', projectId: null, lists: [{ id: 'l1', title: 'todo', position: 0, cards: [{ id: 'c1', title: 'x' }] }] },
    { id: 'b2', title: 'Two', projectId: null, lists: [] },
  ],
  projects: [{ id: 'p1', name: 'archived', color: '#d97b1e' }],
  collapsedProjects: [],
  notifications: [],
};

assert.equal(computePatch(base, clone(base)), null);
ok('no change -> no patch');

let next = clone(base);
next.boards[0].projectId = 'p1';
let patch = computePatch(base, next);
assert.equal(patch.boards.length, 1);
assert.equal(patch.boards[0].id, 'b1');
assert.equal(patch.boards[0].projectId, 'p1');
assert.deepEqual(patch.boards[0].lists[0].cards, {}, 'unchanged cards are not resent');
assert.ok(!('projects' in patch) && !('collapsedProjects' in patch));
ok('filing a board patches just that board, with its projectId');

next = clone(base);
next.collapsedProjects = ['p1'];
patch = computePatch(base, next);
assert.ok(patch, 'collapsing a folder alone still produces a patch');
assert.deepEqual(patch.collapsedProjects, ['p1']);
assert.equal(patch.boards.length, 0);
ok('collapsing a folder patches collapsedProjects');

next = clone(base);
next.projects.push({ id: 'p2', name: 'clients', color: '#3b82f6' });
next.boards[1].projectId = 'p2';
patch = computePatch(base, next);
assert.deepEqual(patch.projects.map(p => p.id), ['p1', 'p2']);
assert.equal(patch.boards[0].projectId, 'p2');
ok('new project + board filed into it arrive in one patch');

next = clone(base);
delete next.projects;
patch = computePatch(base, next);
assert.deepEqual(patch.projects, []);
ok('removed project list patches to empty');

console.log(`\nAll ${pass} checks passed.`);
