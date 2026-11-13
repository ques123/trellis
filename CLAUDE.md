# trellis

Standalone Trellis: the Kanban app from pbrain, as its own product. Public GitHub repo `ques123/trellis` (was `trellis4adam`, renamed 2026-11-13). Last synced with pbrain's Trellis on 2026-11-13 (pbrain commit `b5a0273`; use it as the merge base next time).

## Run

- `npm start` (needs `.env`: `DATABASE_URL`, `ALLOWED_EMAIL`, `AUTH_PASSWORD_HASH`, `OWNER_NAME`; see `.env.example`).
- `npm test` runs every `scripts/test-*.js`; self-contained, no Postgres needed.
- Postgres tables auto-create on boot (`initDb` in `db.js`). A brand-new database gets the sample boards saved on the first browser load.

## Layout

- `server.js`: Express. Auth routes → agent API (bearer, before cookie auth) → session-cookie middleware → `/api/trellis/attachments`, `/api/trellis`, `/config.js` (owner name/photo from env) → static `public/`.
- `db.js`: generic versioned JSONB state store (`app_state` + `app_state_history`, LISTEN/NOTIFY pubsub, sessions, magic links). Trellis uses app name `trellis`.
- `routes/trellis.js`: whole-state GET/PUT with optimistic concurrency + SSE diff stream (`/events`).
- `routes/trellis-agent.js`: granular bearer-token API for agents. Documented in `docs/AGENT_API.md`; keep that doc in step with any endpoint change.
- `routes/trellis-attachments.js`: uploads to `data/trellis-uploads/` (gitignored, never deploy over it).
- `public/`: the frontend, no build step. `app.js` (vanilla JS), `style.css`, `sw.js` (offline cache; bump `CACHE_NAME` when adding files the app needs offline), `shared/` (offline store, three-way merge, drawer drag).
- `skills/trellis/SKILL.md`: Claude Code skill for users to copy into `~/.claude/skills/trellis/`.

## Public repo: no secrets

This repo is public. Never commit `.env`, tokens, hostnames of private servers, personal emails or photos. Real values live only in the server's `.env`. Owner identity comes from `OWNER_NAME` / `OWNER_AVATAR_URL`, never hardcoded.

## Gotchas (inherited from pbrain)

- SSE behind nginx needs `proxy_buffering off` + `proxy_http_version 1.1` on `/api/trellis/events`, else clients silently fall back to polling. Uploads need `client_max_body_size 15M`.
- Never run more than one server process against the same DB without understanding the NOTIFY path: cross-process writes drop the diff baseline and force full refetches (by design).
- Card ids must never duplicate across lists; `dedupeCards` in `routes/trellis.js` is the persistence-side guard.
- Agent identities are paired in TWO places: `AGENTS` in `routes/trellis-agent.js` (id + token env var) and `AGENT_USERS` in `public/app.js` (id + avatar). Add both when adding an agent.

## Syncing with pbrain

pbrain (`~/Code/pbrain`, private) is where Trellis evolves day to day. To pull its changes in, three-way merge each file (`git merge-file`) with base = the pbrain commit of the last sync, ours = this repo, theirs = pbrain now. Path map: `trellis/*` → `public/*`, `shared/*` → `public/shared/*`. Then re-check for pbrain-specific bits (`/trellis/` URLs, `/icons/chris.jpg`, pbrain names) and run the secret scan before pushing.
