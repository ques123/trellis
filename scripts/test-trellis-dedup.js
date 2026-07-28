// Tests the duplicate-card defenses:
//   A) server-side dedupeCards() (routes/trellis.js) — never PERSIST a dup.
//   B) the frontend mergeServerAdditions logic — never CREATE a dup when a card
//      moved lists on the server (the root cause). Replicated here since app.js
//      is browser code, not a module.
//   run: node scripts/test-trellis-dedup.js
const assert = require('assert');
const { dedupeCards } = require('../routes/trellis');

let pass = 0;
const ok = (n) => { console.log(`  ✓ ${n}`); pass++; };

// ---- A) server-side dedupeCards -------------------------------------------
// Same card id in two lists (doing + done) -> kept only in the highest-position
// list (done), positions renumbered.
{
  const state = { boards: [{ id: 'b', lists: [
    { id: 'todo',  position: 0, cards: [{ id: 'x', position: 0 }] },
    { id: 'doing', position: 1, cards: [{ id: 'dup', position: 0 }] },
    { id: 'done',  position: 2, cards: [{ id: 'dup', position: 0 }, { id: 'y', position: 1 }] },
  ] }] };
  dedupeCards(state);
  const byList = Object.fromEntries(state.boards[0].lists.map(l => [l.id, l.cards.map(c => c.id)]));
  assert.deepEqual(byList.doing, [], 'dup removed from the lower (doing) list');
  assert.deepEqual(byList.done, ['dup', 'y'], 'dup kept in the higher (done) list');
  assert.deepEqual(byList.todo, ['x'], 'untouched list intact');
  ok('dedupeCards keeps a cross-list dup only in the highest-position list');
}
// Within-list duplicate -> collapsed to one.
{
  const state = { boards: [{ id: 'b', lists: [
    { id: 'l', position: 0, cards: [{ id: 'a', position: 0 }, { id: 'a', position: 1 }, { id: 'b', position: 2 }] },
  ] }] };
  dedupeCards(state);
  assert.deepEqual(state.boards[0].lists[0].cards.map(c => c.id), ['a', 'b']);
  assert.deepEqual(state.boards[0].lists[0].cards.map(c => c.position), [0, 1], 'renumbered');
  ok('dedupeCards collapses a within-list duplicate');
}
// Clean state -> unchanged (no false removals).
{
  const state = { boards: [{ id: 'b', lists: [
    { id: 'l1', position: 0, cards: [{ id: 'a', position: 0 }, { id: 'b', position: 1 }] },
    { id: 'l2', position: 1, cards: [{ id: 'c', position: 0 }] },
  ] }] };
  dedupeCards(state);
  assert.equal(state.boards[0].lists[0].cards.length, 2);
  assert.equal(state.boards[0].lists[1].cards.length, 1);
  ok('dedupeCards leaves a clean board untouched');
}
// Robust to malformed input.
{
  assert.doesNotThrow(() => dedupeCards(null));
  assert.doesNotThrow(() => dedupeCards({}));
  assert.doesNotThrow(() => dedupeCards({ boards: [{ id: 'b' }] }));
  ok('dedupeCards tolerates missing boards/lists/cards');
}

// ---- B) frontend mergeServerAdditions (board-wide "present" check) ----------
// Replicates the fixed function over a local `state`. The bug: a card that moved
// doing->done on the server got appended to done locally while still in doing.
function mergeServerAdditions(state, server) {
  const clone = x => JSON.parse(JSON.stringify(x));
  state.boards = state.boards || [];
  for (const sb of server.boards) {
    const lb = state.boards.find(b => b.id === sb.id);
    if (!lb) { state.boards.push(clone(sb)); continue; }
    lb.lists = lb.lists || [];
    const present = new Set();
    for (const l of lb.lists) for (const c of (l.cards || [])) present.add(c.id);
    for (const sl of sb.lists || []) {
      const ll = lb.lists.find(l => l.id === sl.id);
      if (!ll) {
        const nl = clone(sl);
        nl.cards = (nl.cards || []).filter(c => !present.has(c.id));
        nl.cards.forEach(c => present.add(c.id));
        lb.lists.push(nl);
        continue;
      }
      ll.cards = ll.cards || [];
      for (const sc of sl.cards || []) {
        if (!present.has(sc.id)) { ll.cards.push(clone(sc)); present.add(sc.id); }
      }
    }
  }
}
// local: card "m" still in doing; server: "m" moved to done (+ a genuinely new agent card "n")
{
  const local = { boards: [{ id: 'b', lists: [
    { id: 'doing', cards: [{ id: 'm', position: 0 }] },
    { id: 'done',  cards: [] },
  ] }] };
  const server = { boards: [{ id: 'b', lists: [
    { id: 'doing', cards: [] },
    { id: 'done',  cards: [{ id: 'm', position: 0 }, { id: 'n', position: 1 }] },
  ] }] };
  mergeServerAdditions(local, server);
  const ids = local.boards[0].lists.flatMap(l => l.cards.map(c => c.id));
  assert.equal(ids.filter(i => i === 'm').length, 1, 'moved card "m" not duplicated');
  assert.ok(ids.includes('n'), 'genuinely-new agent card "n" still pulled in');
  ok('mergeServerAdditions does not duplicate a card that moved lists');
}
// genuinely-new card in an existing list is still added
{
  const local = { boards: [{ id: 'b', lists: [{ id: 'todo', cards: [{ id: 'a' }] }] }] };
  const server = { boards: [{ id: 'b', lists: [{ id: 'todo', cards: [{ id: 'a' }, { id: 'b' }] }] }] };
  mergeServerAdditions(local, server);
  assert.deepEqual(local.boards[0].lists[0].cards.map(c => c.id), ['a', 'b']);
  ok('mergeServerAdditions still adds a genuinely-new card');
}

console.log(`\nAll ${pass} checks passed.`);
