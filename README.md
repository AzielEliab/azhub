# AZHub

Open-source **SPACE / Blank Key** — AIH-WP-1.0.
Neutral spatial container. Place, tether, and bound modules.
Never collapse into AZInterface.

**Author:** Aziel Eliab only
**Date:** September 2026 · v0.1.0
**License:** [Apache-2.0](LICENSE)

> Geometry without intent. Co-presence is inert.

See the spec: [docs/whitepaper.md](docs/whitepaper.md).
How to contribute: [CONTRIBUTING.md](CONTRIBUTING.md).

**Forks are welcome and always allowed.**

AZInterface is a **sibling** product from the same whitepaper —
a custodial operating environment. Do not rebuild it here and do not
collapse Hub into it: https://github.com/AzielEliab/azinterface

## Honest scope (read this)

v0.1 is the **Blank Key canvas**. It places App and Lock modules, shows
a custody-of-placement popup on drop, and draws declared tether
corridors. It does **not** rank, detect intent, detect completeness,
Snap-activate, auto-wire, or unlock modules by co-presence.

## Dual surface (mandatory)

1. **Human UI** — Worker homepage is complete software: black / gold /
   white Blank Key canvas, everblooming sigil stamp, drag-and-drop App
   and Lock modules, drop popup (place / bound / optional tether
   declare), visible cuttable corridors, counted download. Humans stay here.
2. **Agent / MCP — FragGate only.** There is no separate AZHub MCP
   outside the door. Parent wires the engine later. Catalog door:

```bash
curl -s -A 'Mozilla/5.0' -X POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call \
  -H 'content-type: application/json' \
  -d '{"slug":"azhub","op":"blank_key_status","payload":{}}'
```

MCP clients already on aziel-runtime call `fraggate_call` with
`slug=azhub`. Catalog MCP: `POST https://aziel-runtime.vibelock.workers.dev/mcp`.
Catalog listing lands in a sibling runtime PR.

Worker `/v1/{op}` is the **human UI backend** (single-segment local ops).
`/v1/fraggate/*` and `/v1/runtime/*` **PROXY** to aziel-runtime
(`/v1/fraggate/list`, `/v1/fraggate/call`, …). They are not local ops.
`GET|POST /mcp` and `/openapi.json` document those ops and **point at
FragGate** — they are not a second agent brand.

Agents display `display.title`, `display.summary`, and `display.fields`
in chat, then take the next input. No technical MCP UI is required for
the human.

## Use with AI assistants

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants.

Import OpenAPI from the Worker or the catalog. Do not treat this as a
Grok / ChatGPT / Venice-only triad.

- ChatGPT — GPT Actions → Import from URL → Worker or catalog `openapi.json`
- Grok — custom tool / OpenAPI / MCP remote → same
- Venice — custom HTTP tools / OpenAPI → same
- Claude Desktop / Cursor / Glama — MCP `POST https://aziel-runtime.vibelock.workers.dev/mcp`

## Quick start

```bash
python -m venv .venv && source .venv/bin/activate && pip install -e ".[dev]"
azhub doctor
azhub ui
```

Open http://127.0.0.1:8880 (loopback only).

## One-click install

```bash
curl -fsSL https://azhub-download-tracker.vibelock.workers.dev/install.sh | bash
```

## Counted download (Cloudflare Worker)

**This is the counted download.** GitHub releases exist as a mirror.
The Worker serves the gzip itself (HTTP 200, no 302 to GitHub).

Worker name: `azhub-download-tracker`

URL pattern (same as sibling Aziel Eliab products):

`https://azhub-download-tracker.vibelock.workers.dev`

| Path | What |
|------|------|
| `/` | Complete Blank Key canvas + views |
| `/download` | Counted tarball |
| `/count` | `{views, downloads, total}` |
| `/openapi.json` | OpenAPI 3.1 (docs; agents use FragGate) |
| `/mcp` | Pointer to FragGate (`slug=azhub`) |
| `/v1/{op}` | Human UI backend — single-segment local ops only |
| `/v1/fraggate/*` | PROXY to aziel-runtime FragGate door |
| `/v1/runtime/*` | PROXY aliases (`list`/`call` → `/v1/fraggate/list`/`call`) |

- Homepage: [https://azhub-download-tracker.vibelock.workers.dev/](https://azhub-download-tracker.vibelock.workers.dev/)
- Direct tarball: [azhub-0.1.0.tar.gz](https://azhub-download-tracker.vibelock.workers.dev/download?asset=azhub-0.1.0.tar.gz)
- Sigil: [https://www.azielcorpuslibrary.net/sigil.png](https://www.azielcorpuslibrary.net/sigil.png)
- Cite: [cite.json](https://azhub-download-tracker.vibelock.workers.dev/cite.json) — Eliab, Aziel. (2026). AZHub 0.1.0 [Software]. Apache-2.0. Do not invent a DOI.

Isolated counter: Worker `azhub-download-tracker`, KV `AZHUB_DOWNLOADS`. `/v1` and `/mcp` do not increment downloads.

## Software tabs (parent listing)

Once this Worker is live, AZHub is listed on:

- https://www.azielcorpuslibrary.net/software
- https://godlock.uk/software
- https://www.azieleliab.com (Software section)

Parent lists after deploy. Expected URL:
`https://azhub-download-tracker.vibelock.workers.dev/`

## Canvas checklist

Every control calls a real `/v1` handler (same op agents call). No dead buttons.

| Control | Handler | Op |
|---------|---------|-----|
| Drag App / Lock chip | drop → popup | — |
| Popup Place | `POST /v1/place_module` | `place_module` |
| Popup Bound | `POST /v1/place_module` `{bound:true}` | `place_module` |
| Popup optional tether | `POST /v1/tether_declare` | `tether_declare` |
| Cut corridor | `POST /v1/tether_cut` | `tether_cut` |
| Blank Key stamp | `POST /v1/blank_key_status` | `blank_key_status` |
| Region map | `POST /v1/region_list` | `region_list` |
| FragGate list | `GET /v1/fraggate/list` | PROXY to aziel-runtime |
| FragGate call | `POST /v1/fraggate/call` | PROXY to aziel-runtime |

Prove locally (after `pip install -e ".[dev]"`):

```bash
azhub doctor
azhub call health
azhub place azmail --region center
azhub place peacelock --region center
azhub blank-key
azhub call snap_activate
```

## CLI

```bash
azhub version
azhub ui                 # 127.0.0.1:8880
azhub doctor
azhub place azmail --region dock --bound
azhub tether <from-id> <to-id>
azhub tethers
azhub cut <tether-id>
azhub blank-key
azhub call region_list
```

## Tests

```bash
pip install -e ".[dev]"
python -m pytest -q
node tests/test_worker_engine.mjs
node tests/test_worker_door.mjs
node tests/test_worker_ui.mjs
azhub doctor
```

## iPhone & Android

Flutter sources: [`mobile/`](mobile/). Application id `com.azieeliab.azhub`.
Offline. No analytics. Black / gold / white.

```bash
cd mobile
flutter create --org com.azieeliab --project-name azhub .
flutter pub get
flutter run
```

## Layout

```
azhub/          library (Blank Key, place, tether, door, cli)
tests/          pytest + Worker smoke
docs/           AIH-WP-1.0 Hub whitepaper
workers/download-tracker/   Cloudflare Worker azhub-download-tracker
mobile/         Flutter scaffold
SKILL.md        agent skill (also GET /v1/skill)
```

## Cross-links (optional, not required)

- Runtime: https://github.com/AzielEliab/aziel-runtime · https://aziel-runtime.vibelock.workers.dev/
- FragGate: https://github.com/AzielEliab/fraggate
- Digital Library: https://www.azielcorpuslibrary.net/
- AZInterface (sibling — never collapse): https://github.com/AzielEliab/azinterface
- godlock.uk
- https://www.azieleliab.com

## License

Apache-2.0. See [LICENSE](LICENSE).

Forks are welcome and always allowed.
