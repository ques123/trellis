# Trellis agent API

The agent API lets an AI coding agent (Claude Code, Codex, or any script) read
your boards and add, update, move and comment on cards. It is how Claude logs
its work on the board as it goes.

The browser app saves the whole board as one JSON document. An agent doing the
same would overwrite edits you make in the browser at the same time. So agents
get their own small endpoints instead: each one changes a single board, list or
card inside a locked database transaction, and every open browser tab receives
the change live within a second or two.

- Base URL: `https://<your-trellis-host>/api/trellis/agent`
- Format: JSON in, JSON out (`Content-Type: application/json`)
- Auth: a bearer token per agent (below), never the browser login

## 1. Turn it on

Each agent identity has its own token, set in the server's `.env`:

| Agent | Token env var | Shows on the board as |
|---|---|---|
| `claude` | `TRELLIS_AGENT_TOKEN` | Claude, with the Claude logo |
| `codex` | `TRELLIS_AGENT_TOKEN_CODEX` | Codex, with the Codex logo |

Generate a long random token and restart the server:

```bash
openssl rand -hex 32          # paste the output into .env as TRELLIS_AGENT_TOKEN=...
```

With no tokens set the API is off and every call returns `503`.

To add another agent, add an entry to `AGENTS` in `routes/trellis-agent.js`
(id, name, colour, token env var) **and** a matching entry in `AGENT_USERS` in
`public/app.js` (same id, plus an avatar image), then set its token.

## 2. Connect Claude Code

Give Claude the base URL and the token, kept out of any repo:

```bash
mkdir -p ~/.claude/skills/trellis
printf '%s' 'YOUR_TOKEN' > ~/.claude/skills/trellis/.token
chmod 600 ~/.claude/skills/trellis/.token
cp skills/trellis/SKILL.md ~/.claude/skills/trellis/SKILL.md   # from this repo
```

Then edit the `TRELLIS=` line in that `SKILL.md` to your host. Claude loads the
skill whenever you mention Trellis or your board ("put that on the board", "what's
assigned to you?", "move the login bug to QC") and calls the endpoints below.

Any other agent just needs the same two things: the base URL and an
`Authorization: Bearer <token>` header.

## 3. Quick start

```bash
TRELLIS=https://your-trellis-host/api/trellis/agent
TOK=$(cat ~/.claude/skills/trellis/.token)
auth() { curl -fsS -H "Authorization: Bearer $TOK" -H 'Content-Type: application/json' "$@"; }

auth "$TRELLIS/boards"                                    # find board + list ids
auth -X POST "$TRELLIS/cards" -d '{
  "boardId": "<boardId>", "listId": "<listId>",
  "title": "Fix login timeout", "description": "Users are logged out after 5 min", "labels": ["red"]
}'
```

## Endpoints

All paths are relative to `/api/trellis/agent`.

### Reads

#### `GET /boards`
Every board, with its lists and how many cards each holds. Start here to find ids.

```json
{ "boards": [
  { "id": "mwf3u6a5d2yuq", "title": "My Project", "starred": false,
    "projectId": null, "projectName": null,
    "lists": [ { "id": "mwf3u6a50kack", "title": "doing", "cardCount": 2 } ] }
] }
```

#### `GET /boards/:boardId`
One board: each list (column) in order, with its cards summarised.
Card summaries carry `id, title, description, position, labels, dueDate,
dueDone, members, origin, createdAt, createdBy, checklistCount, commentCount,
attachmentCount`. `404` if the board doesn't exist.

#### `GET /cards/:cardId`
One full card, including `comments`, `checklists` and `attachments`, plus where
it lives. The card is nested under `card`:

```json
{ "boardId": "…", "listId": "…", "card": { "id": "…", "title": "…", "comments": [ … ] } }
```

A card link from the browser looks like `https://your-host/?card=<cardId>`; the
id alone is enough to read, move or comment on it.

#### `GET /assigned[?boardId=…]`
The calling agent's inbox: every card where you added this agent as a member in
the browser (drag its avatar onto the card). Each row includes `boardId`,
`boardTitle`, `listId` and `listTitle` as well as the card summary.

```json
{ "agent": "claude", "count": 1, "cards": [ { "boardId": "…", "listTitle": "to do", "id": "…", "title": "…" } ] }
```

### Writes

Every write is atomic and also posts a notification to the owner's bell
(`added`, `moved to <list>`, `commented on`, `deleted`).

#### `POST /boards`
Create a board. Body: `{ "title": "My Project", "lists": ["..."]? }`.
`lists` defaults to `backlog`, `to do`, `doing`, `QC`, `done`.
Matching is by title, ignoring case and spaces: if the board already exists it
is returned unchanged with `200` and `"created": false`; a new one returns `201`.

#### `POST /boards/:boardId/lists`
Add a column. Body: `{ "title": "QC", "position": 3? }` (0-based column index,
default last). Also matched by title: an existing list returns `200`, unchanged.

#### `POST /cards`
Create a card at the bottom of a list.

| Field | Required | Notes |
|---|---|---|
| `boardId`, `listId` | yes | the list must belong to that board |
| `title` | yes | trimmed, can't be empty |
| `description` | no | Markdown |
| `labels` | no | colour names: `green yellow orange red purple blue pink teal` (`red` = bug by convention) |
| `dueDate` | no | milliseconds since epoch |
| `origin` | no | `"autolog"` marks a card an agent logged automatically for its own work |

The agent is recorded as the card's creator (`createdBy`) and added as a member,
so the card shows its logo. Returns `201 { boardId, listId, card }`.

#### `PATCH /cards/:cardId`
Change any of `title`, `description`, `labels`, `dueDate`, `dueDone`. Fields you
leave out are untouched. Returns `{ card }`.

#### `POST /cards/:cardId/move`
Body: `{ "listId": "…", "position": 0? }`. Moves the card to another list (on any
board) or reorders it within its list. Without `position` it goes to the bottom,
except lists whose title contains "done", where it goes to the top so the newest
finished work is visible. Returns `{ boardId, listId, position }`.

#### `POST /cards/:cardId/comments`
Body: `{ "text": "Fixed in a1b2c3d, deployed." }`. Comments as the agent.
Returns `201 { comment }`.

#### `DELETE /cards/:cardId`
Deletes a card, but **only one this agent created**. A card made by a person or
by another agent returns `403`, so an agent can never delete your own cards.
Returns `{ "deleted": "<cardId>" }`.

## Errors

Errors are `{ "error": "message" }` with:

| Status | Meaning |
|---|---|
| `400` | missing or invalid field |
| `401` | missing or wrong bearer token |
| `403` | deleting a card the agent didn't create |
| `404` | board, list or card not found |
| `503` | agent API is off (no tokens set on the server) |

## Suggested workflow for coding agents

This is the loop Claude follows to keep the board in step with its work:

1. **Start of a feature:** create (or reuse) the project's board with
   `POST /boards`, then add a card in `doing` with a plain-English summary.
2. **While working:** comment on the card with progress; file anything spotted
   but not done as a new card in `backlog`.
3. **Built and committed:** move the card to `QC` with a comment on what to check.
4. **Deployed and verified:** move it to `done` with a comment on what shipped.
5. **Assigned work:** check `GET /assigned`, move a card to `doing` when picking
   it up, and comment when it's finished.
