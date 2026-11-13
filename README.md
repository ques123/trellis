# Trellis

A self-hosted Kanban board (Trello-style) with live multi-tab updates and a token-authenticated API for AI agents. Single-user, single Node process, Postgres for storage.

## Features

- **Boards / lists / cards** with drag & drop, labels, due dates, checklists, comments, members, board search, notifications, and project folders in the sidebar.
- **File attachments**: drag, drop or paste files onto a card or into a comment (images show inline). Stored on disk in `data/trellis-uploads/`, 15 MB per file.
- **Works offline**: a service worker caches the app, and each tab keeps a copy of the board in IndexedDB. Edits made offline sync on reconnect with a three-way merge, so changes an agent made meanwhile survive.
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
cp .env.example .env   # fill in DATABASE_URL, ALLOWED_EMAIL, OWNER_NAME and a password hash
node scripts/hash-password.js 'your password'   # → paste output into .env
npm start
```

Sign in at `http://localhost:3000` with the password, or via a magic link (set `RESEND_API_KEY`; without it the link is printed to the server log).

## Agent API

AI agents (Claude Code, Codex, scripts) work the board through a separate
token-authenticated API: create boards and cards, move cards, comment, and pick
up cards assigned to them. Writes are atomic, so agent and browser edits never
overwrite each other.

```bash
curl -H "Authorization: Bearer $TRELLIS_AGENT_TOKEN" localhost:3000/api/trellis/agent/boards
```

Full reference, including how to connect Claude Code: **[docs/AGENT_API.md](docs/AGENT_API.md)**.
A ready-made Claude Code skill is in [`skills/trellis/SKILL.md`](skills/trellis/SKILL.md).

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

Uploads need nginx to accept files up to 15 MB: `client_max_body_size 15M;`.
Keep `data/` (uploads) and `.env` out of deploys that overwrite the app folder.
