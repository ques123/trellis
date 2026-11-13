---
name: trellis
description: Read and write the user's Trellis Kanban boards: list boards, read a board's lists and cards, create cards, move cards between lists, update card fields, and comment. Use when the user mentions Trellis, "the board", "my board", "the kanban", asks what to work on, or asks to log a task, bug or idea as a card.
allowed-tools: Bash(curl:*), Bash(cat:*), Bash(jq:*)
---

# Trellis agent API

Trellis is a self-hosted Kanban app: `projects → boards → lists → cards`. Lists
are the Kanban columns (default `backlog / to do / doing / QC / done`). The `red`
label means bug.

Full reference: `docs/AGENT_API.md` in the Trellis repo.

## Setup (once per shell)

```bash
TRELLIS=https://your-trellis-host/api/trellis/agent   # <- set to your host
TOK=$(cat ~/.claude/skills/trellis/.token)
auth() { curl -fsS -H "Authorization: Bearer $TOK" -H 'Content-Type: application/json' "$@"; }
```

`503` means the server has no agent token set: tell the user, don't retry.

## Read

```bash
auth "$TRELLIS/boards" | jq                       # start here: board + list ids
auth "$TRELLIS/boards/<boardId>" | jq             # lists with card summaries
auth "$TRELLIS/cards/<cardId>" | jq '.card'       # full card (fields are under .card)
auth "$TRELLIS/assigned" | jq                     # cards the user assigned to you
```

If the user pastes a card link (`…/?card=<id>`) or id, go straight to
`GET /cards/<id>` and confirm "Board ▸ List ▸ Title" back before acting.

## Write

```bash
auth -X POST "$TRELLIS/boards" -d '{"title":"My Project"}'               # idempotent by title
auth -X POST "$TRELLIS/boards/<boardId>/lists" -d '{"title":"QC","position":3}'
auth -X POST "$TRELLIS/cards" -d '{"boardId":"…","listId":"…","title":"…","description":"…","labels":["red"]}'
auth -X PATCH "$TRELLIS/cards/<cardId>" -d '{"description":"…"}'
auth -X POST "$TRELLIS/cards/<cardId>/move" -d '{"listId":"…"}'
auth -X POST "$TRELLIS/cards/<cardId>/comments" -d '{"text":"…"}'
auth -X DELETE "$TRELLIS/cards/<cardId>"         # only cards you created
```

## Rules

- Never delete or rewrite the user's own cards; comment instead.
- Card titles are short and plain, no emoji (the board already shows a robot
  badge on agent cards).
- Finished and committed → `QC`. Deployed and verified → `done`. Never `done`
  for work that isn't live.
