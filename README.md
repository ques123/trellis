# Trellis

A self-hosted Kanban board (Trello-style) with live multi-tab updates and a token-authenticated API for AI agents. Single-user, single Node process, Postgres for storage.

## Features

- **Boards / lists / cards** with drag & drop, labels, due dates, checklists, comments, attachments, members, board search, notifications.
- **Live updates over SSE** — every write is pushed to all open tabs as a small diff (a card move is a couple of KB, not the whole board), with automatic fallback to a full refetch on version skew.
- **Optimistic concurrency** — the whole-state PUT carries a version; a stale tab gets a 409 with the authoritative state and reconciles instead of clobbering.
- **State history** — every write archives the previous state (last 30 kept), so any mistake is a one-query restore.
- **Agent API** — granular, row-locked card mutations (`add / patch / move / comment / delete-own`) behind bearer tokens, so an AI agent (Claude, Codex, …) can work the board without racing the UI. Agent-created cards are stamped with the agent's identity and avatar.

## Stack

- Node + Express (`server.js`), no build step — the frontend is one static page (`public/`).
- PostgreSQL — the whole board state is a JSONB blob in `app_state`, versioned, with a `LISTEN/NOTIFY` channel feeding the SSE stream. Tables are created automatically on boot.

## Setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, ALLOWED_EMAIL, and a password hash
node scripts/hash-password.js 'your password'   # → paste output into .env
npm start
```

Sign in at `http://localhost:3000` with the password, or via a magic link (set `RESEND_API_KEY`; without it the link is printed to the server log).

## Agent API

Set `TRELLIS_AGENT_TOKEN` in `.env`, then:

```bash
curl -H "Authorization: Bearer $TRELLIS_AGENT_TOKEN" localhost:3000/api/trellis/agent/boards
```

| Endpoint | What it does |
|---|---|
| `GET /boards` | Compact index of every board |
| `GET /boards/:id` | One board, lists with summarized cards |
| `GET /cards/:id` | Full card incl. comments & checklists |
| `GET /assigned` | Cards where this agent is a member (its task inbox) |
| `POST /cards` | Create a card (`boardId`, `listId`, `title`, …) |
| `PATCH /cards/:id` | Update title/description/labels/due date |
| `POST /cards/:id/move` | Move to another list (`listId`, `position?`) |
| `POST /cards/:id/comments` | Comment as the agent |
| `DELETE /cards/:id` | Delete — only cards the agent itself created |

All under `/api/trellis/agent`. Writes are atomic (row-locked transaction), so agent and UI edits never clobber each other.

## Tests

```bash
npm test   # self-contained, no Postgres needed
```

## Deploying behind nginx

The SSE stream needs an unbuffered location block, or clients silently fall back to refetching:

```nginx
location /api/trellis/events {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```
