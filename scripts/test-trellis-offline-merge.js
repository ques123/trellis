// Tests for shared/trellis-merge.js (offline edits meet a server that moved on).
// Run: node scripts/test-trellis-offline-merge.js
const assert = require('assert');
const mergeTrellis = require('../public/shared/trellis-merge.js');

const card = (id, extra = {}) => ({ id, title: id, position: 0, labels: [], ...extra });
function mk(lists, extra = {}) {
  return {
    view: 'board', currentBoardId: 'b1', notifications: [], projects: [], collapsedProjects: [],
    boards: [{ id: 'b1', title: 'Board', lists: Object.entries(lists).map(([id, cards], i) => ({ id, title: id, position: i, cards: cards.map((c, j) => ({ ...c, position: j })) })) }],
    ...extra,
  };
}
const ids = (s, lid) => s.boards[0].lists.find(l => l.id === lid).cards.map(c => c.id);
const find = (s, cid) => { for (const l of s.boards[0].lists) for (const c of l.cards) if (c.id === cid) return { list: l.id, c }; return null; };
const C = x => JSON.parse(JSON.stringify(x));
let n = 0; const t = (name, fn) => { fn(); n++; console.log('ok', name); };

const base = mk({ todo: [card('a'), card('b'), card('c')], doing: [], done: [] });

t('server move of a card I did not touch survives', () => {
  const local = C(base); local.boards[0].lists[0].cards[0].title = 'a edited offline';
  const server = C(base);
  const b = server.boards[0].lists[0].cards.splice(1, 1)[0]; server.boards[0].lists[2].cards.push(b);
  const m = mergeTrellis(base, local, server);
  assert.strictEqual(find(m, 'b').list, 'done');
  assert.strictEqual(find(m, 'a').c.title, 'a edited offline');
  assert.deepStrictEqual(ids(m, 'todo'), ['a', 'c']);
});

t('my offline move wins over the server leaving it alone', () => {
  const local = C(base); const a = local.boards[0].lists[0].cards.shift(); local.boards[0].lists[1].cards.push(a);
  const server = C(base); server.boards[0].lists[0].cards[2].title = 'c edited by agent';
  const m = mergeTrellis(base, local, server);
  assert.strictEqual(find(m, 'a').list, 'doing');
  assert.strictEqual(find(m, 'c').c.title, 'c edited by agent');
});

t('cards added on both sides are all kept', () => {
  const local = C(base); local.boards[0].lists[0].cards.unshift(card('mine'));
  const server = C(base); server.boards[0].lists[1].cards.push(card('agent'));
  const m = mergeTrellis(base, local, server);
  assert.deepStrictEqual(ids(m, 'todo'), ['mine', 'a', 'b', 'c']);
  assert.deepStrictEqual(ids(m, 'doing'), ['agent']);
  m.boards[0].lists.forEach(l => l.cards.forEach((c, i) => assert.strictEqual(c.position, i)));
});

t('server-added card lands at its index inside my reordered list', () => {
  const local = C(base); local.boards[0].lists[0].cards.reverse(); // c b a
  const server = C(base); server.boards[0].lists[0].cards.splice(1, 0, card('x')); // a x b c
  const m = mergeTrellis(base, local, server);
  assert.deepStrictEqual(ids(m, 'todo'), ['c', 'x', 'b', 'a']);
});

t('local delete of an untouched card sticks; server delete too', () => {
  const local = C(base); local.boards[0].lists[0].cards.splice(0, 1); // delete a
  const server = C(base); server.boards[0].lists[0].cards.splice(2, 1); // delete c
  const m = mergeTrellis(base, local, server);
  assert.deepStrictEqual(ids(m, 'todo'), ['b']);
});

t('deleted on one side but edited on the other is kept', () => {
  const local = C(base); local.boards[0].lists[0].cards.splice(0, 1); // I delete a
  const server = C(base); server.boards[0].lists[0].cards[0].title = 'a renamed'; // agent edits a
  const m = mergeTrellis(base, local, server);
  assert.strictEqual(find(m, 'a').c.title, 'a renamed');
  const local2 = C(base); local2.boards[0].lists[0].cards[1].title = 'b mine';
  const server2 = C(base); server2.boards[0].lists[0].cards.splice(1, 1);
  assert.strictEqual(find(mergeTrellis(base, local2, server2), 'b').c.title, 'b mine');
});

t('both edit same card: local wins', () => {
  const local = C(base); local.boards[0].lists[0].cards[0].title = 'L';
  const server = C(base); server.boards[0].lists[0].cards[0].title = 'S';
  assert.strictEqual(find(mergeTrellis(base, local, server), 'a').c.title, 'L');
});

t('new board on server and new list locally both appear', () => {
  const local = C(base); local.boards[0].lists.push({ id: 'later', title: 'later', position: 3, cards: [card('z')] });
  const server = C(base); server.boards.push({ id: 'b2', title: 'Agent board', lists: [{ id: 'q', title: 'q', position: 0, cards: [] }] });
  const m = mergeTrellis(base, local, server);
  assert.deepStrictEqual(m.boards.map(b => b.id), ['b1', 'b2']);
  assert.deepStrictEqual(ids(m, 'later'), ['z']);
});

t('card edited locally in a list the server deleted moves to first list', () => {
  const local = C(base); local.boards[0].lists[2].cards.push(card('late'));
  const server = C(base); server.boards[0].lists.splice(2, 1);
  const m = mergeTrellis(base, local, server);
  assert.strictEqual(m.boards[0].lists.length, 2);
  assert.strictEqual(find(m, 'late').list, 'todo');
});

t('notifications union keeps local read flag; view state is local', () => {
  const b2 = C(base); b2.notifications = [{ id: 'n1', read: false, timestamp: 1 }];
  const local = C(b2); local.notifications[0].read = true; local.view = 'dashboard';
  const server = C(b2); server.notifications.unshift({ id: 'n2', read: false, timestamp: 2 });
  const m = mergeTrellis(b2, local, server);
  assert.deepStrictEqual(m.notifications.map(x => [x.id, x.read]), [['n2', false], ['n1', true]]);
  assert.strictEqual(m.view, 'dashboard');
});

t('project folders: server filing a board elsewhere survives', () => {
  const b2 = C(base); b2.projects = [{ id: 'p1', name: 'P' }];
  const local = C(b2); local.boards[0].lists[0].cards[0].title = 'edit';
  const server = C(b2); server.boards[0].projectId = 'p1'; server.projects.push({ id: 'p2', name: 'Q' });
  const m = mergeTrellis(b2, local, server);
  assert.strictEqual(m.boards[0].projectId, 'p1');
  assert.deepStrictEqual(m.projects.map(p => p.id), ['p1', 'p2']);
});

t('no base (first sync) keeps everything from both', () => {
  const local = C(base); local.boards[0].lists[0].cards.push(card('mine'));
  const server = C(base); server.boards[0].lists[0].cards.push(card('theirs'));
  const m = mergeTrellis(null, local, server);
  assert.ok(find(m, 'mine') && find(m, 'theirs'));
});

t('no change on either side is identity on boards', () => {
  const m = mergeTrellis(base, C(base), C(base));
  assert.deepStrictEqual(m.boards, base.boards);
});

console.log(`\n${n} tests passed`);
