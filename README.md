# AZHub

Open-source **Aziel Hub** — a **neutral spatial container / Blank Key**
from [AIH-WP-1.0](docs/whitepaper.md). Place, tether, and isolate
modules. Declared tethers only (visible corridors). Hub does not decide
why anything matters.

**Author:** Aziel Eliab only
**Date:** September 2026 · v0.1.0
**License:** [Apache-2.0](LICENSE)
**Spec:** AIH-WP-1.0

> Blank Key geometry without intent. Modules remain complete if Hub is removed.

See the spec: [docs/whitepaper.md](docs/whitepaper.md).
How to contribute: [CONTRIBUTING.md](CONTRIBUTING.md).

**Forks are welcome and always allowed.**

AZInterface is a **sibling** product — never collapse Hub into Interface:
https://github.com/AzielEliab/azinterface

AZBrowser is a **sibling**: https://github.com/AzielEliab/azbrowser

AZNet is a **sibling**: https://github.com/AzielEliab/aznet

## Honest scope (read this)

AZHub is a **Blank Key**. It lists tiles alphabetically. It does **not**
rank, recommend, auto-wire, interpret meaning, or activate anything
because two tiles sit near each other. Tethers exist only when a human
(or agent) **declares** them. Those corridors are visible. There is no
helpful auto-wiring.

v0.1 is the spatial container. It is not AZInterface (the face/lens),
not AZBrowser, and not AZNet.

## Dual surface (mandatory)

1. **Human UI** — Worker homepage is complete software: drag-and-drop
   module tiles **and** Lock tiles onto the Hub surface. Drop opens a
   **popup** with wired Place / Tether / Isolate buttons. Home is the
   everblooming sigil. Black / gold / white. Counted download.
2. **Agent / MCP — FragGate only** via aziel-runtime:

```bash
curl -s -A 'Mozilla/5.0' -X POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call \
  -H 'content-type: application/json' \
  -d '{"slug":"azhub","op":"place","payload":{"slug":"azmail","x":80,"y":80}}'
```

MCP clients already on aziel-runtime call `fraggate_call` with
`slug=azhub`. Catalog MCP: `POST https://aziel-runtime.vibelock.workers.dev/mcp`.
Catalog listing lands in a sibling runtime PR.

Worker `/v1/{op}` is the **human UI backend** (single-segment local ops).
`/v1/fraggate/*` and `/v1/runtime/*` **PROXY** to aziel-runtime.
`GET|POST /mcp` and `/openapi.json` document those ops and **point at
FragGate** — they are not a second agent brand.

Agents display `display.title`, `display.summary`, and `display.fields`
in chat, then take the next input. No technical MCP UI is required for
the human.

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude
(Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot /
Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence
surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other
MCP/OpenAPI-capable assistants.

## Live ops

| Op | What |
|----|------|
| `health` | Liveness. Dual-surface banner. |
| `place` | Bind a module or Lock tile at (x, y). No meaning. |
| `list_modules` | Placed tiles + alphabetical catalog. Not a ranking. |
| `tether_declare` | Visible corridor. Both ends must already be placed. |
| `tether_list` | Declared corridors only. |
| `isolate` | Bound, isolated. Drops tethers. Module stays complete. |
| `blank_key_status` | Geometry without intent. Home / sigil. |
| `skill` | This skill markdown. |

## Stub ops (refuse)

`recommend` · `rank` · `auto_wire` · `interpret_meaning` · `activate_by_copresence`

These return `FG-STUB`. They do not execute.

## Quick start

```bash
python -m venv .venv && source .venv/bin/activate && pip install -e ".[dev]"
azhub doctor
azhub ui
```

Open http://127.0.0.1:8878 (loopback only). Drag a tile onto the surface.

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
| `/` | Complete Blank Key chrome + views |
| `/download` | Counted tarball |
| `/count` | `{views, downloads, total}` |
| `/stats` | views / downloads / by_repo / branch / fork |
| `/openapi.json` | OpenAPI 3.1 (docs; agents use FragGate) |
| `/mcp` | Pointer to FragGate (`slug=azhub`) |
| `/v1/{op}` | Human UI backend — single-segment local ops only |
| `/v1/fraggate/*` | PROXY to aziel-runtime FragGate door |
| `/v1/runtime/*` | PROXY aliases (`list`/`call` → `/v1/fraggate/list`/`call`) |
| `/robots.txt` `/sitemap.xml` `/llms.txt` `/cite.json` | Crawler + citation |

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

## Chrome button checklist

Every control calls a real `/v1` handler (same op agents call). No dead buttons.

| Chrome | Handler | Op |
|--------|---------|-----|
| Home (sigil) | `POST /v1/blank_key_status` | `blank_key_status` / `home` |
| Drop → Place | `POST /v1/place` | `place` |
| Drop → Tether | `POST /v1/tether_declare` | `tether_declare` |
| Drop → Isolate | `POST /v1/isolate` | `isolate` |
| list_modules | `POST /v1/list_modules` | `list_modules` |
| tether_list | `POST /v1/tether_list` | `tether_list` |
| FragGate list | `GET /v1/fraggate/list` | PROXY to aziel-runtime |
| FragGate call | `POST /v1/fraggate/call` | PROXY to aziel-runtime |

Prove locally (after `pip install -e ".[dev]"`):

```bash
azhub doctor
azhub call place --payload '{"slug":"azmail","x":40,"y":40}'
azhub call place --payload '{"slug":"peacelock","x":200,"y":80}'
azhub call tether_declare --payload '{"from":"azmail","to":"peacelock"}'
azhub call isolate --payload '{"slug":"azmail"}'
azhub call recommend --payload '{}'
azhub call blank_key_status
```

`recommend` must refuse with `FG-STUB`.

## CLI

```bash
azhub version
azhub ui                 # 127.0.0.1:8878
azhub doctor
azhub place azmail --x 80 --y 80
azhub place peacelock --x 240 --y 80
azhub tether azmail peacelock
azhub isolate azmail
azhub list
azhub status
```

## Tests

```bash
pip install -e ".[dev]"
python -m pytest -q
node tests/test_worker_engine.mjs
node tests/test_worker_door.mjs
azhub doctor
```

## iPhone & Android

Flutter sources: [`mobile/`](mobile/). Application id `com.azieeliab.azhub`.
Offline. No analytics. Dark matte / gold.

```bash
cd mobile
flutter create --org com.azieeliab --project-name azhub .
flutter pub get
flutter run
```

## Layout

```
azhub/              library (catalog, surface, engine, cli, door)
tests/              pytest + Worker door/engine
docs/               AIH-WP-1.0 whitepaper
workers/download-tracker/   Cloudflare Worker azhub-download-tracker
mobile/             Flutter scaffold
SKILL.md            agent skill (also GET /v1/skill)
```

## Cross-links (optional, not required)

- Runtime / FragGate door: https://github.com/AzielEliab/aziel-runtime · https://aziel-runtime.vibelock.workers.dev/
- FragGate kernel: https://github.com/AzielEliab/fraggate
- Digital Library: https://www.azielcorpuslibrary.net/
- AZInterface (sibling — never collapse): https://github.com/AzielEliab/azinterface
- AZBrowser (sibling): https://github.com/AzielEliab/azbrowser
- AZNet (sibling): https://github.com/AzielEliab/aznet
- AZMail (sibling): https://github.com/AzielEliab/azmail
- godlock.uk
- https://www.azieleliab.com

## License

Apache-2.0. See [LICENSE](LICENSE).

Forks are welcome and always allowed.
