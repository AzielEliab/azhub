# AZHub download tracker

Cloudflare Worker `azhub-download-tracker`.

URL pattern after deploy (workers.dev + account subdomain, same as sibling products):

`https://azhub-download-tracker.vibelock.workers.dev`

- `GET /` — complete Blank Key UI (drag module/Lock tiles, drop popup, declared corridors) + counted views
- `GET /download` — counted tarball (HTTP 200 gzip, no 302)
- `GET /count` — `{views, downloads, total}`
- `GET /stats` — views/downloads/by_repo/branch/fork
- `GET /openapi.json` — documents ops; agents use FragGate
- `GET|POST /mcp` — pointer to FragGate (`slug=azhub`)
- `GET /v1/*` — health/skill (does **not** increment downloads)
- `POST /v1/{op}` — human UI backend; single-segment local ops only
- `/v1/fraggate/*` and `/v1/runtime/*` — PROXY to aziel-runtime FragGate door
- `/v1/mesh/*` — PROXY suite node mesh (AZIEL_RUNTIME or HTTPS fallback). Default OFF. Live Nodes strip on `/`. Not a Node Gate. Anon-broadcast is not a publish path.
- `/robots.txt` `/sitemap.xml` `/llms.txt` `/cite.json`

KV binding `DOWNLOADS` (create `AZHUB_DOWNLOADS` on first deploy; placeholder `000…` is OK until parent deploys). Account `ac575a9b822bea2bed97d0ab73aed238`.

Human UI is this Worker. Agent / MCP path is FragGate via aziel-runtime:

`POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call` with
`{"slug":"azhub","op":"…","payload":{}}`

Catalog MCP: `POST https://aziel-runtime.vibelock.workers.dev/mcp`.
This host `/mcp` is a pointer, not a second MCP. Catalog listing of
`azhub` lands in a sibling aziel-runtime PR.

Author: Aziel Eliab. Apache-2.0.
