# trellis4adam

Standalone Trellis — the Kanban app extracted from pbrain (2026-07-28) as its own product. Private repo `ques123/trellis4adam`.

## Run

- `npm start` (needs `.env`: `DATABASE_URL`, `ALLOWED_EMAIL`, `AUTH_PASSWORD_HASH` — see `.env.example`).
- `npm test` — self-contained route tests, no Postgres needed.
- Postgres tables auto-create on boot (`initDb` in `db.js`).

## Layout

- `server.js` — Express: auth routes → agent API (bearer, pre-cookie-auth) → session-cookie middleware → `/api/trellis` → static `public/`.
- `db.js` — generic versioned JSONB state store (`app_state` + `app_state_history`, LISTEN/NOTIFY pubsub, sessions, magic links). App-agnostic; Trellis uses app name `trellis`.
- `routes/trellis.js` — whole-state GET/PUT with optimistic concurrency + SSE diff stream (`/events`).
- `routes/trellis-agent.js` — granular bearer-token card API for agents (see README table).
- `public/` — the entire frontend: `index.html` + `app.js` (~4k lines vanilla JS) + `style.css`. No build step.

## Gotchas (inherited from pbrain)

- SSE behind nginx needs `proxy_buffering off` + `proxy_http_version 1.1` on `/api/trellis/events`, else clients silently fall back to polling.
- Never run more than one server process against the same DB without understanding the NOTIFY path — cross-process writes drop the diff baseline and force full refetches (by design).
- Card ids must never duplicate across lists; `dedupeCards` in `routes/trellis.js` is the persistence-side guard.
- Agent identities are paired in TWO places: `AGENTS` in `routes/trellis-agent.js` (id + token env var) and `AGENT_USERS` in `public/app.js` (id + avatar). Add both when adding an agent.
- Owner user is hardcoded as `CURRENT_USER` in `public/app.js` (currently "Adam").

## Provenance

Extracted from `~/Code/pbrain` (`trellis/`, `routes/trellis*.js`, `db.js`, auth). Fixes to shared logic worth porting back should be mirrored in pbrain, and vice versa.
