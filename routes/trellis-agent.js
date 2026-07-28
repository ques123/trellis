// Token-authenticated, granular Trellis API for programmatic agents (e.g. Claude).
//
// The browser app reads/writes the WHOLE trellis JSONB blob (GET/PUT /api/trellis/state).
// That's fine for a single human in one tab, but an agent doing read-modify-write on the
// full blob would clobber concurrent UI edits. So this router exposes narrow, atomic
// mutations (add/patch/move/comment a single card) layered on db.mutateState's row-locked
// transaction. It bypasses the cookie auth middleware (it's mounted before it in server.js)
// and gates itself with a static bearer token instead.
const express = require('express');
const router = express.Router();
const { getState, mutateState } = require('../db');

const APP_NAME = 'trellis';

// Match the frontend's id scheme (trellis/app.js generateId) so agent-created
// ids are indistinguishable from UI-created ones.
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Each agent identity has its own bearer token (env var) so cards/comments/
// notifications are stamped with WHO acted. Add a new agent by appending here +
// setting its token env var. The frontend (app.js AGENT_USERS) must define a
// matching user id + avatar for it to render with an icon.
const AGENTS = [
  { id: 'claude', name: 'Claude', email: 'claude@trellis', color: '#D97757', tokenEnv: 'TRELLIS_AGENT_TOKEN' },
  { id: 'codex',  name: 'Codex',  email: 'codex@trellis',  color: '#10a37f', tokenEnv: 'TRELLIS_AGENT_TOKEN_CODEX' },
];

// --- auth: resolve the calling agent by its token ----------------------
router.use((req, res, next) => {
  if (!AGENTS.some(a => process.env[a.tokenEnv])) {
    return res.status(503).json({ error: 'Agent API disabled (no agent tokens set)' });
  }
  const header = req.get('authorization') || '';
  const presented = header.startsWith('Bearer ') ? header.slice(7) : null;
  const agent = presented && AGENTS.find(a => process.env[a.tokenEnv] && process.env[a.tokenEnv] === presented);
  if (!agent) {
    return res.status(401).json({ error: 'Invalid or missing bearer token' });
  }
  req.agent = agent;
  next();
});

// --- state helpers ------------------------------------------------------
function projectName(state, projectId) {
  const p = (state.projects || []).find(p => p.id === projectId);
  return p ? p.name : null;
}

function findBoard(state, boardId) {
  return (state.boards || []).find(b => b.id === boardId) || null;
}

// Locate a card anywhere in the state. Returns { board, list, card, index } or null.
function findCard(state, cardId) {
  for (const board of state.boards || []) {
    for (const list of board.lists || []) {
      const index = (list.cards || []).findIndex(c => c.id === cardId);
      if (index !== -1) return { board, list, card: list.cards[index], index };
    }
  }
  return null;
}

// Find a list by id across all boards. Returns { board, list } or null.
function findList(state, listId) {
  for (const board of state.boards || []) {
    const list = (board.lists || []).find(l => l.id === listId);
    if (list) return { board, list };
  }
  return null;
}

function renumber(cards) {
  cards.forEach((c, i) => { c.position = i; });
}

function ensureAgentUser(state, agent) {
  state.users = state.users || [];
  if (!state.users.some(u => u.id === agent.id)) {
    state.users.push({ id: agent.id, name: agent.name, email: agent.email, color: agent.color });
  }
}

// Append a notification authored by `agent`. read:false so it lights the
// browser's bell (the frontend's live poller merges it in within ~4s). Shape
// matches the frontend's addNotification (id/type/userId/boardId/cardId/
// cardTitle/text/suffix/timestamp/read).
function pushNotification(state, agent, { type, boardId, cardId, cardTitle, text, suffix = '' }) {
  ensureAgentUser(state, agent);
  state.notifications = state.notifications || [];
  state.notifications.unshift({
    id: generateId(), type, userId: agent.id,
    boardId, cardId, cardTitle, text, suffix,
    timestamp: Date.now(), read: false,
  });
  if (state.notifications.length > 50) state.notifications = state.notifications.slice(0, 50);
}

// Compact card view for list/board reads (drops bulky attachment blobs).
function cardSummary(c) {
  return {
    id: c.id, title: c.title, description: c.description || '',
    position: c.position, labels: c.labels || [],
    dueDate: c.dueDate || null, dueDone: !!c.dueDone,
    members: c.members || [], origin: c.origin || null, createdAt: c.createdAt || null,
    checklistCount: (c.checklists || []).length,
    commentCount: (c.comments || []).length,
  };
}

function badRequest(res, msg) { return res.status(400).json({ error: msg }); }

// --- reads --------------------------------------------------------------

// GET /boards — compact index of every board with per-list card counts.
router.get('/boards', async (req, res, next) => {
  try {
    const state = await getState(APP_NAME);
    if (!state) return res.json({ boards: [] });
    const boards = (state.boards || []).map(b => ({
      id: b.id, title: b.title, starred: !!b.starred,
      projectId: b.projectId || null, projectName: projectName(state, b.projectId),
      lists: (b.lists || []).map(l => ({ id: l.id, title: l.title, cardCount: (l.cards || []).length })),
    }));
    res.json({ boards });
  } catch (err) { next(err); }
});

// GET /boards/:boardId — full board, lists with summarized cards.
router.get('/boards/:boardId', async (req, res, next) => {
  try {
    const state = await getState(APP_NAME);
    const board = state && findBoard(state, req.params.boardId);
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json({
      id: board.id, title: board.title, starred: !!board.starred,
      projectId: board.projectId || null, projectName: projectName(state, board.projectId),
      lists: (board.lists || []).map(l => ({
        id: l.id, title: l.title, position: l.position,
        cards: (l.cards || []).slice().sort((a, b) => a.position - b.position).map(cardSummary),
      })),
    });
  } catch (err) { next(err); }
});

// GET /assigned — the calling agent's task inbox: every card across all boards
// where THIS agent is a member (i.e. the user dragged this agent onto the card
// in the UI). Optional ?boardId= narrows to one board. Each row carries its
// board/list context so the agent can report "found N cards assigned to me" and
// then move them through the Kanban. Ordered by board, then list, then position.
router.get('/assigned', async (req, res, next) => {
  try {
    const state = await getState(APP_NAME);
    const me = req.agent.id;
    const onlyBoard = req.query.boardId || null;
    const cards = [];
    for (const board of (state && state.boards) || []) {
      if (onlyBoard && board.id !== onlyBoard) continue;
      for (const list of (board.lists || []).slice().sort((a, b) => a.position - b.position)) {
        for (const c of (list.cards || []).slice().sort((a, b) => a.position - b.position)) {
          if ((c.members || []).includes(me)) {
            cards.push({
              boardId: board.id, boardTitle: board.title,
              listId: list.id, listTitle: list.title,
              ...cardSummary(c),
            });
          }
        }
      }
    }
    res.json({ agent: me, count: cards.length, cards });
  } catch (err) { next(err); }
});

// GET /cards/:cardId — full single card (including comments & checklists).
router.get('/cards/:cardId', async (req, res, next) => {
  try {
    const state = await getState(APP_NAME);
    const loc = state && findCard(state, req.params.cardId);
    if (!loc) return res.status(404).json({ error: 'Card not found' });
    res.json({ boardId: loc.board.id, listId: loc.list.id, card: loc.card });
  } catch (err) { next(err); }
});

// --- writes (atomic) ----------------------------------------------------

// POST /cards — create a card at the bottom of a list.
// body: { boardId, listId, title, description?, labels?, dueDate? }
// Provenance marker for cards the agent creates automatically (vs. ones a human
// filed or an agent filed as a suggestion). 'autolog' = created by the worktree →
// deploy convention (feature-card.py). The frontend renders these distinctly.
const CARD_ORIGINS = ['autolog'];

router.post('/cards', async (req, res, next) => {
  const { boardId, listId, title, description, labels, dueDate, origin } = req.body || {};
  if (!boardId || !listId) return badRequest(res, 'boardId and listId are required');
  if (!title || !String(title).trim()) return badRequest(res, 'title is required');
  const cardOrigin = CARD_ORIGINS.includes(origin) ? origin : null;
  const agent = req.agent;
  try {
    const card = await mutateState(APP_NAME, (state) => {
      const board = findBoard(state, boardId);
      if (!board) throw Object.assign(new Error('Board not found'), { status: 404 });
      const list = (board.lists || []).find(l => l.id === listId);
      if (!list) throw Object.assign(new Error('List not found'), { status: 404 });
      list.cards = list.cards || [];
      ensureAgentUser(state, agent);
      const card = {
        id: generateId(), title: String(title).trim(), description: description || '',
        position: list.cards.length, labels: Array.isArray(labels) ? labels : [],
        dueDate: dueDate || null, dueDone: false,
        // createdBy marks agent ownership: the DELETE endpoint only lets the
        // creating agent remove it. members shows that agent's avatar on the card.
        createdBy: agent.id, members: [agent.id],
        // origin distinguishes an auto-logged (worktree→deploy) card from one the
        // agent merely filed; null for ordinary agent-filed cards.
        origin: cardOrigin,
        checklists: [], comments: [], attachments: [], createdAt: Date.now(),
      };
      list.cards.push(card);
      pushNotification(state, agent, { type: 'create', boardId, cardId: card.id, cardTitle: card.title, text: 'added' });
      return card;
    });
    res.status(201).json({ boardId, listId, card });
  } catch (err) { next(err); }
});

// PATCH /cards/:cardId — update mutable fields in place.
// body: any of { title, description, labels, dueDate, dueDone }
router.patch('/cards/:cardId', async (req, res, next) => {
  const patch = req.body || {};
  try {
    const card = await mutateState(APP_NAME, (state) => {
      const loc = findCard(state, req.params.cardId);
      if (!loc) throw Object.assign(new Error('Card not found'), { status: 404 });
      const c = loc.card;
      if (patch.title !== undefined) {
        if (!String(patch.title).trim()) throw Object.assign(new Error('title cannot be empty'), { status: 400 });
        c.title = String(patch.title).trim();
      }
      if (patch.description !== undefined) c.description = patch.description || '';
      if (patch.labels !== undefined) c.labels = Array.isArray(patch.labels) ? patch.labels : [];
      if (patch.dueDate !== undefined) c.dueDate = patch.dueDate || null;
      if (patch.dueDone !== undefined) c.dueDone = !!patch.dueDone;
      return c;
    });
    res.json({ card });
  } catch (err) { next(err); }
});

// DELETE /cards/:cardId — remove a card, but ONLY if the agent created it.
// Cards made by a human in the UI (createdBy != the agent) return 403, so the
// agent can never delete the user's own cards.
router.delete('/cards/:cardId', async (req, res, next) => {
  const agent = req.agent;
  try {
    const result = await mutateState(APP_NAME, (state) => {
      const loc = findCard(state, req.params.cardId);
      if (!loc) throw Object.assign(new Error('Card not found'), { status: 404 });
      if (loc.card.createdBy !== agent.id) {
        throw Object.assign(new Error('Forbidden: an agent can only delete cards it created'), { status: 403 });
      }
      const title = loc.card.title;
      const boardId = loc.board.id;
      loc.list.cards.splice(loc.index, 1);
      renumber(loc.list.cards);
      pushNotification(state, agent, { type: 'delete', boardId, cardId: req.params.cardId, cardTitle: title, text: 'deleted' });
      return { deleted: req.params.cardId };
    });
    res.json(result);
  } catch (err) { next(err); }
});

// POST /cards/:cardId/move — move a card to another list (or reorder within one).
// body: { listId, position? }  position defaults to bottom of the target list.
router.post('/cards/:cardId/move', async (req, res, next) => {
  const { listId, position } = req.body || {};
  if (!listId) return badRequest(res, 'listId is required');
  const agent = req.agent;
  try {
    const result = await mutateState(APP_NAME, (state) => {
      const loc = findCard(state, req.params.cardId);
      if (!loc) throw Object.assign(new Error('Card not found'), { status: 404 });
      const target = findList(state, listId);
      if (!target) throw Object.assign(new Error('Target list not found'), { status: 404 });
      // Pull from source.
      loc.list.cards.splice(loc.index, 1);
      renumber(loc.list.cards);
      // Insert into target. Default to the bottom — EXCEPT a "done"-style list,
      // where freshly-completed cards go to the TOP so the latest finished work
      // is visible without scrolling. An explicit `position` always wins.
      target.list.cards = target.list.cards || [];
      const isDoneList = /done/i.test(target.list.title || '');
      let idx = Number.isInteger(position)
        ? position
        : (isDoneList ? 0 : target.list.cards.length);
      idx = Math.max(0, Math.min(idx, target.list.cards.length));
      target.list.cards.splice(idx, 0, loc.card);
      renumber(target.list.cards);
      pushNotification(state, agent, { type: 'move', boardId: target.board.id, cardId: loc.card.id, cardTitle: loc.card.title, text: 'moved', suffix: ' to ' + target.list.title });
      return { boardId: target.board.id, listId: target.list.id, position: loc.card.position };
    });
    res.json(result);
  } catch (err) { next(err); }
});

// POST /cards/:cardId/comments — append a comment authored by the agent user.
// body: { text }
router.post('/cards/:cardId/comments', async (req, res, next) => {
  const text = (req.body || {}).text;
  if (!text || !String(text).trim()) return badRequest(res, 'text is required');
  const agent = req.agent;
  try {
    const comment = await mutateState(APP_NAME, (state) => {
      const loc = findCard(state, req.params.cardId);
      if (!loc) throw Object.assign(new Error('Card not found'), { status: 404 });
      ensureAgentUser(state, agent);
      const comment = { id: generateId(), userId: agent.id, text: String(text).trim(), timestamp: Date.now() };
      loc.card.comments = loc.card.comments || [];
      loc.card.comments.push(comment);
      pushNotification(state, agent, { type: 'comment', boardId: loc.board.id, cardId: loc.card.id, cardTitle: loc.card.title, text: 'commented on' });
      return comment;
    });
    res.status(201).json({ comment });
  } catch (err) { next(err); }
});

// --- error handler ------------------------------------------------------
router.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error('trellis-agent error:', err);
  res.status(status).json({ error: err.message || 'Internal error' });
});

module.exports = router;
