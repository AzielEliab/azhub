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
Interface. AZHub and AZInterface are **separate software** under **one
FragGate door**.

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
(single-segment local ops). `/v1/fraggate/*`, `/v1/runtime/*`, and
`/v1/mesh/*` PROXY to aziel-runtime (AZIEL_RUNTIME or HTTPS fallback).
Suite mesh default OFF until runtime enable. **QNS-CD-1.0** (photon
QNS1 packet transfer) is a hub cite / Worker mesh cross-map only —
not a Softwares-tab product. Local qnsd lives in
[qnm-node](https://github.com/AzielEliab/qnm-node). Runtime cites live
in [aziel-runtime](https://github.com/AzielEliab/aziel-runtime)
(`docs/NODE_MESH.md`, `docs/designs/QNM-WP-1.0.md`). Pair custody is
AZInterface. No public qnsd proxy. Not a Node Gate. Not
anonymity. Anon-broadcast is not a publish path. `GET|POST /mcp` on
this host is a **pointer**, not a second MCP. AI / MCP path is FragGate
only.

**Human UI stays on this Worker.** Agents display `display.title`,
`display.summary`, and `display.fields` in the AI client, then take the
next input. No technical MCP UI is required for the human.

## FragGate live ops (agents — use these names)

| FragGate op | Worker UI chrome | `/v1` |
|-------------|------------------|-------|
| `place_module` | Drop → Place | `/v1/place` (alias) |
| `region_list` | Palette / list_modules | `/v1/list_modules` (alias) |
| `tether_declare` | Drop → Tether | `/v1/tether_declare` |
| `tether_list` | tether_list | `/v1/tether_list` |
| `tether_cut` | tether_cut | `/v1/tether_cut` |
| `remove_module` | Drop → Remove | `/v1/remove_module` |
| `blank_key_status` | Home (everblooming sigil) | `/v1/blank_key_status` |
| `health` `skill` | Liveness / skill | `/v1/health` `/v1/skill` |

Human chrome also keeps `isolate` on `/v1/isolate` (tile stays; bound and
isolated). `remove_module` takes the tile off. Do **not** send
`op: "place"` through FragGate — that is `FG-UNKNOWN-OP`. Use
`place_module`.

## Stub ops (refuse)

`recommend` `rank` `auto_wire` `interpret_meaning` `activate_by_copresence`
`scorch_remote` `auto_unlock` `ranking` `completeness_detect` `unlock`
`complete` `completeness` `scorch`

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
| GET | `/v1/mesh` `/v1/mesh/status` `/v1/mesh/nodes` | PROXY suite mesh (default OFF). GET status/nodes attach the QNS-CD-1.0 cross-map for peers. |
| POST | `/v1/mesh/*` | PROXY join/heartbeat/leave/enable/disable/broadcast (hash receipt only; not a publish path). |
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
  -d '{"slug":"azhub","op":"place_module","payload":{"slug":"azmail","x":80,"y":80}}'
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
- Local node / qnsd: https://github.com/AzielEliab/qnm-node
- QNS-CD-1.0: photon QNS1 packet transfer (hub cite / Worker mesh cross-map only; not a Softwares-tab product)
- Library: https://www.azielcorpuslibrary.net/
- AZInterface (sibling — pair custody; never collapse): https://github.com/AzielEliab/azinterface
- AZBrowser (sibling): https://github.com/AzielEliab/azbrowser
- AZNet (sibling): https://github.com/AzielEliab/aznet
- godlock.uk · https://www.azieleliab.com
- GitHub: https://github.com/AzielEliab/azhub
