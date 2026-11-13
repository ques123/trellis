// Three-way merge of Trellis state, used when edits made offline meet a server
// that moved on meanwhile (agents moving cards, another tab, the agent API).
//
//   base   = last state this tab knew was on the server
//   local  = this tab's state, with the offline edits
//   server = the server's state now
//
// Rule for every board, list and card: whoever changed it since `base` wins;
// if both did, this tab wins (it's the edit the user is looking at). Deleted on
// one side and untouched on the other = deleted. Deleted on one side but edited
// on the other = kept (never silently drop someone's edit).
//
// A card's "content" includes which board/list it sits in, but not its index:
// inserting one card shifts every index below it, which is not an edit of
// those cards. List order comes from whichever side reordered that list.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.mergeTrellis = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const clone = x => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  function meta(obj, childKey) {
    if (!obj) return obj;
    const { [childKey]: _drop, ...rest } = obj;
    return rest;
  }
  const cardKey = c => { const { position, ...rest } = c; return rest; };

  // id -> { boardId, listId, idx, card }
  function indexCards(state) {
    const m = new Map();
    for (const b of (state && state.boards) || [])
      for (const l of b.lists || [])
        (l.cards || []).forEach((c, idx) => m.set(c.id, { boardId: b.id, listId: l.id, idx, card: c }));
    return m;
  }
  const loc = e => e && { b: e.boardId, l: e.listId, c: cardKey(e.card) };

  // Pick per id from three id-keyed maps; returns Map id -> chosen value (or
  // absent if deleted). `fingerprint` reduces a value to what counts as a change.
  function pick(bMap, lMap, sMap, fingerprint) {
    const out = new Map();
    const ids = new Set([...lMap.keys(), ...sMap.keys()]);
    for (const id of ids) {
      const b = bMap.get(id), l = lMap.get(id), s = sMap.get(id);
      const fb = b && fingerprint(b), fl = l && fingerprint(l), fs = s && fingerprint(s);
      if (!b) { out.set(id, l || s); continue; }            // new on one side
      const lChanged = !l || !same(fl, fb);
      const sChanged = !s || !same(fs, fb);
      if (!l) { if (s && sChanged) out.set(id, s); continue; } // deleted here
      if (!s) { if (lChanged) out.set(id, l); continue; }      // deleted there
      out.set(id, lChanged ? l : s);
    }
    return out;
  }

  function byId(arr) { return new Map((arr || []).map(x => [x.id, x])); }

  function mergeTrellis(base, local, server) {
    base = base || { boards: [] };
    const result = clone(local);

    // ---- boards (metadata only; lists are rebuilt below) ----
    const bBoards = byId(base.boards), lBoards = byId(local.boards), sBoards = byId(server.boards);
    const boardPick = pick(bBoards, lBoards, sBoards, b => meta(b, 'lists'));

    // ---- lists, per board ----
    const listsByBoard = new Map(); // boardId -> Map listId -> list meta
    for (const [bid] of boardPick) {
      const lists = pick(
        byId(bBoards.get(bid) && bBoards.get(bid).lists),
        byId(lBoards.get(bid) && lBoards.get(bid).lists),
        byId(sBoards.get(bid) && sBoards.get(bid).lists),
        l => meta(l, 'cards'));
      listsByBoard.set(bid, lists);
    }

    // ---- cards, globally (a card can move between boards) ----
    const bCards = indexCards(base), lCards = indexCards(local), sCards = indexCards(server);
    const cardPick = pick(bCards, lCards, sCards, loc);

    // Group chosen cards by target list, remembering which side they came from.
    const target = new Map(); // `${boardId}\u0000${listId}` -> [{ entry, side }]
    for (const [id, entry] of cardPick) {
      const side = lCards.get(id) === entry ? 'l' : 's';
      let { boardId, listId } = entry;
      const lists = listsByBoard.get(boardId);
      if (!lists) continue; // its board was deleted
      if (!lists.has(listId)) {
        // Its list was deleted on the other side while this card was edited:
        // keep the card, in the board's first list.
        const first = [...lists.values()].sort((a, b) => (a.position || 0) - (b.position || 0))[0];
        if (!first) continue;
        listId = first.id;
      }
      const k = boardId + '\u0000' + listId;
      if (!target.has(k)) target.set(k, []);
      target.get(k).push({ entry, side });
    }

    const order = (state, bid, lid) => {
      const b = (state.boards || []).find(x => x.id === bid);
      const l = b && (b.lists || []).find(x => x.id === lid);
      return l ? (l.cards || []).map(c => c.id) : null;
    };

    // Board order: local's, then any server-only boards in server order.
    const boardOrder = [...(local.boards || []).map(b => b.id),
      ...(server.boards || []).map(b => b.id).filter(id => !lBoards.has(id))];

    result.boards = [];
    for (const bid of boardOrder) {
      if (!boardPick.has(bid)) continue;
      const board = clone(boardPick.get(bid));
      const lists = listsByBoard.get(bid);
      const listOrder = [...(lBoards.get(bid) ? lBoards.get(bid).lists || [] : []).map(l => l.id),
        ...(sBoards.get(bid) ? sBoards.get(bid).lists || [] : []).map(l => l.id)];
      const seen = new Set();
      board.lists = [];
      for (const lid of listOrder) {
        if (seen.has(lid) || !lists.has(lid)) continue;
        seen.add(lid);
        const list = clone(meta(lists.get(lid), 'cards'));
        const items = target.get(bid + '\u0000' + lid) || [];
        // Backbone order: the side that reordered this list; else the server's.
        const bo = order(base, bid, lid), lo = order(local, bid, lid), so = order(server, bid, lid);
        const backbone = (lo && !same(lo, bo)) ? lo : (so || lo || []);
        const rank = new Map(backbone.map((id, i) => [id, i]));
        const placed = items.filter(it => rank.has(it.entry.card.id))
          .sort((a, b) => rank.get(a.entry.card.id) - rank.get(b.entry.card.id));
        const extra = items.filter(it => !rank.has(it.entry.card.id))
          .sort((a, b) => a.entry.idx - b.entry.idx);
        const cards = placed.map(it => clone(it.entry.card));
        for (const it of extra) cards.splice(Math.min(it.entry.idx, cards.length), 0, clone(it.entry.card));
        cards.forEach((c, i) => { c.position = i; });
        list.cards = cards;
        board.lists.push(list);
      }
      result.boards.push(board);
    }

    // ---- project folders ----
    const pPick = pick(byId(base.projects), byId(local.projects), byId(server.projects), x => x);
    const pOrder = [...(local.projects || []).map(p => p.id),
      ...(server.projects || []).map(p => p.id).filter(id => !(local.projects || []).some(p => p.id === id))];
    result.projects = pOrder.filter(id => pPick.has(id)).map(id => clone(pPick.get(id)));
    result.collapsedProjects = same(local.collapsedProjects, base.collapsedProjects)
      ? clone(server.collapsedProjects || []) : clone(local.collapsedProjects || []);

    // ---- notifications: union, keep local read flags ----
    const notes = (local.notifications || []).map(clone);
    const have = new Set(notes.map(n => n.id));
    for (const n of server.notifications || []) if (!have.has(n.id)) notes.push(clone(n));
    notes.sort((a, b) => b.timestamp - a.timestamp);
    result.notifications = notes.slice(0, 50);

    return result;
  }

  return mergeTrellis;
});
