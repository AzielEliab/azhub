---
name: AZHub
description: >-
  Use when placing or tethering modules in AZHub / Blank Key (AIH-WP-1.0).
  Neutral spatial container. Never collapse into AZInterface. Author Aziel Eliab.
---

# AZHub

SPACE / Blank Key — a **neutral spatial container**. Place, tether, and
bound App and Lock modules. Geometry without intent.

Author: **Aziel Eliab** only.

**THIS IS:** Hub canvas (SPACE). Custody-of-placement. Declared tethers
with visible, cuttable, session-scoped corridors. Blank Key: co-presence
is inert.

**THIS IS NOT:** AZInterface (sibling custodial environment — never
collapse Hub into Interface). Not a ranking engine, intent detector,
completeness detector, Snap activation event, or module unlocker. Hub
does **not** unlock modules by co-presence. Never auto-wire.

Always send `User-Agent: Mozilla/5.0`. Cloudflare Workers may 403 an empty agent.

**Agent path is FragGate only.** MCP / agents call aziel-runtime.
Parent wires the engine later. Prefer:

```
POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call
{"slug":"azhub","op":"<op>","payload":{}}
```

Same door as the `fraggate_call` MCP tool (`slug=azhub`). Kernel:
https://github.com/AzielEliab/fraggate. Catalog listing lands in a
sibling aziel-runtime PR. Human chrome uses this Worker's `/v1/{op}`
(single-segment local ops). `/v1/fraggate/*` and `/v1/runtime/*` PROXY
to aziel-runtime. `GET|POST /mcp` on this host is a **pointer**, not a
second MCP. Catalog MCP: `POST https://aziel-runtime.vibelock.workers.dev/mcp`.
AI / MCP path is FragGate only.

**Human UI stays on this Worker.** Agents display `display.title`,
`display.summary`, and `display.fields` in the AI client, then take the
next input. No technical MCP UI is required for the human.

## Safe public ops (advisory)

| UI chrome | op |
|-----------|-----|
| Region map | `region_list` |
| Drop popup → Place | `place_module` |
| Remove chip | `remove_module` |
| Drop popup → Tether / corridor | `tether_declare` |
| Cut corridor | `tether_cut` |
| Corridor list | `tether_list` |
| Blank Key stamp | `blank_key_status` |
| Liveness / skill | `health` `skill` |

Stubs (refuse): snap, snap_activate, activate, auto_wire, auto_unlock,
unlock, rank, intent, completeness, decide, centralize, wire, fuse,
collapse_interface, copresence_unlock.

## Human Worker (not a second agent brand)

Host: `https://azhub-download-tracker.vibelock.workers.dev`

| Method | Path | What |
|--------|------|------|
| GET | `/` | Complete Blank Key canvas. Increments views. |
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

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants — **through FragGate only**.

## How to call (Mozilla/5.0)

```bash
curl -s -A 'Mozilla/5.0' -X POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call \
  -H 'content-type: application/json' \
  -d '{"slug":"azhub","op":"blank_key_status","payload":{}}'
curl -s -A 'Mozilla/5.0' -X POST https://azhub-download-tracker.vibelock.workers.dev/v1/place_module \
  -H 'content-type: application/json' \
  -d '{"slug":"azmail","kind":"app","region":"center"}'
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

Then open http://127.0.0.1:8880 (this computer only).

## Honest banner

THIS IS: SPACE / Blank Key. THIS IS NOT: AZInterface, a ranker, an
intent detector, a completeness detector, or a Snap unlock. Author:
Aziel Eliab only.

Apache-2.0. Forks are welcome and always allowed.

## Catalog + links

- Product homepage: https://azhub-download-tracker.vibelock.workers.dev/
- Counted download: https://azhub-download-tracker.vibelock.workers.dev/download
- Agent door: `POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call` `{slug:azhub,op,payload}`
- Catalog MCP: `POST https://aziel-runtime.vibelock.workers.dev/mcp`
- FragGate: https://github.com/AzielEliab/fraggate
- Runtime: https://github.com/AzielEliab/aziel-runtime
- Library: https://www.azielcorpuslibrary.net/
- AZInterface (sibling — never collapse): https://github.com/AzielEliab/azinterface
- godlock.uk · https://www.azieleliab.com
- GitHub: https://github.com/AzielEliab/azhub
