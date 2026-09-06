---
name: AZHub
description: >-
  Use when placing, tethering, or isolating modules on AZHub — the
  Blank Key / neutral spatial container (AIH-WP-1.0). Not AZInterface,
  AZBrowser, or AZNet. Author Aziel Eliab.
---

# AZHub

Neutral spatial container / Blank Key. Place, tether, isolate.
Declared tethers only (visible corridors). Hub does not decide why
anything matters. Modules remain complete if Hub is removed.

Author: **Aziel Eliab** only.

**THIS IS:** a Blank Key surface for app/module tiles and Lock tiles.

**THIS IS NOT:** AZInterface, AZBrowser, AZNet, a recommender, a ranker,
a meaning engine, or activation-by-co-presence. Never collapse Hub into
Interface.

Always send `User-Agent: Mozilla/5.0`. Cloudflare Workers may 403 an empty agent.

**Agent path is FragGate only.** MCP / agents call aziel-runtime.
Prefer:

```
POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call
{"slug":"azhub","op":"<op>","payload":{}}
```

Same door as the `fraggate_call` MCP tool (`slug=azhub`). Kernel:
https://github.com/AzielEliab/fraggate. Catalog listing lands in a
sibling aziel-runtime PR. Human chrome uses this Worker's `/v1/{op}`
(single-segment local ops). `/v1/fraggate/*` and `/v1/runtime/*` PROXY
to aziel-runtime. `GET|POST /mcp` on this host is a **pointer**, not a
second MCP. AI / MCP path is FragGate only.

**Human UI stays on this Worker.** Agents display `display.title`,
`display.summary`, and `display.fields` in the AI client, then take the
next input. No technical MCP UI is required for the human.

## Live ops (UI action = MCP / FragGate op)

| UI chrome | op |
|-----------|-----|
| Drop → Place | `place` |
| Palette / list | `list_modules` |
| Drop → Tether | `tether_declare` |
| Corridor list | `tether_list` |
| Drop → Isolate | `isolate` |
| Home (everblooming sigil) | `blank_key_status` / `home` |
| Liveness / skill | `health` `skill` |

## Stub ops (refuse)

`recommend` `rank` `auto_wire` `interpret_meaning` `activate_by_copresence`

These return `FG-STUB`. Hub will not execute them.

No receipt = no action. Mutating live ops append a hash-chained receipt.

## Human Worker (not a second agent brand)

Host: `https://azhub-download-tracker.vibelock.workers.dev`

| Method | Path | What |
|--------|------|------|
| GET | `/` | Complete Blank Key chrome. Increments views. |
| GET | `/v1/health` | Liveness. Does not increment downloads. |
| GET | `/v1/skill` | This markdown. |
| GET | `/openapi.json` | OpenAPI 3.1 — documents ops; agents use FragGate. |
| GET/POST | `/mcp` | Pointer to FragGate (`slug=azhub`). Not a second MCP. |
| POST | `/v1/{op}` | Human UI backend. Single-segment local ops only. |
| GET | `/v1/fraggate/list` | PROXY to aziel-runtime FragGate list. |
| POST | `/v1/fraggate/call` | PROXY to aziel-runtime FragGate call. |
| GET/POST | `/v1/runtime/*` | PROXY aliases (`list`/`call` → FragGate). |
| GET | `/download` | Counted tarball. |
| GET | `/count` | `{views, downloads, total}` |

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude
(Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot /
Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence
surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other
MCP/OpenAPI-capable assistants — **through FragGate only**.

## How to call (Mozilla/5.0)

```bash
curl -s -A 'Mozilla/5.0' -X POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call \
  -H 'content-type: application/json' \
  -d '{"slug":"azhub","op":"place","payload":{"slug":"azmail","x":80,"y":80}}'
curl -s -A 'Mozilla/5.0' -X POST https://azhub-download-tracker.vibelock.workers.dev/v1/blank_key_status \
  -H 'content-type: application/json' \
  -d '{}'
curl -s -A 'Mozilla/5.0' https://aziel-runtime.vibelock.workers.dev/v1/fraggate/list
curl -s -A 'Mozilla/5.0' -X POST https://azhub-download-tracker.vibelock.workers.dev/v1/fraggate/call \
  -H 'content-type: application/json' \
  -d '{"slug":"azhub","op":"health","payload":{}}'
```

## Local

```bash
curl -fsSL https://azhub-download-tracker.vibelock.workers.dev/install.sh | bash
azhub ui
azhub doctor
```

Then open http://127.0.0.1:8878 (this computer only).

## Honest banner

THIS IS: a Blank Key / neutral spatial container. THIS IS NOT:
AZInterface, AZBrowser, AZNet, a recommender, or a meaning engine.
Author: Aziel Eliab only.

Apache-2.0. Forks are welcome and always allowed.

## Catalog + links

- Product homepage: https://azhub-download-tracker.vibelock.workers.dev/
- Counted download: https://azhub-download-tracker.vibelock.workers.dev/download
- Agent door: `POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call` `{slug:azhub,op,payload}`
- FragGate: https://github.com/AzielEliab/fraggate
- Runtime: https://github.com/AzielEliab/aziel-runtime
- Library: https://www.azielcorpuslibrary.net/
- AZInterface (sibling — never collapse): https://github.com/AzielEliab/azinterface
- AZBrowser (sibling): https://github.com/AzielEliab/azbrowser
- AZNet (sibling): https://github.com/AzielEliab/aznet
- godlock.uk · https://www.azieleliab.com
- GitHub: https://github.com/AzielEliab/azhub
