# AZHub

Place modules on a blank surface. A corridor appears only when you declare one.

**Author:** Aziel Eliab
**License:** [Apache-2.0](LICENSE)

## Start

1. Install

```bash
python -m venv .venv && source .venv/bin/activate && pip install -e .
```

2. Open the local app

```bash
azhub ui
```

3. Open http://127.0.0.1:8878/ and choose **Place a module**.

People see plain text. Programs add `--json`.

## Commands

```bash
azhub                      # welcome and the next step
azhub ui                   # http://127.0.0.1:8878/
azhub doctor
azhub place azmail --x 80 --y 80
azhub tether azmail peacelock
azhub list
azhub status
azhub --help
```

Advanced commands (`health`, `home`, `skill`, `ops`, `call`) are listed by `azhub --help`.

```bash
azhub call place_module --payload '{"slug":"azmail","x":40,"y":40}'
azhub health --json
```

## Notes

AZHub lists tiles in alphabetical order and records a corridor only when you declare one. Modules remain complete if Hub is removed. Spec: [AIH-WP-1.0](docs/whitepaper.md).

AZHub and AZInterface are **separate software** under one FragGate door. Never collapse Hub into Interface:
https://github.com/AzielEliab/azinterface

AZBrowser is separate software: https://github.com/AzielEliab/azbrowser

AZNet is separate software: https://github.com/AzielEliab/aznet

Forks are welcome and always allowed. How to contribute: [CONTRIBUTING.md](CONTRIBUTING.md).

Refused operations return `FG-STUB` and do not run: `recommend`, `rank`, `auto_wire`, `interpret_meaning`, `activate_by_copresence`, `scorch_remote`, `auto_unlock`, `ranking`, `completeness_detect`, `unlock`, `complete`, `completeness`, `scorch`.

## Dual surface

1. **Human app** — `azhub ui` on 127.0.0.1. Place a module. Drag still works. Tether, isolate, remove, and cut sit under **Advanced**.
2. **Agent path** — FragGate only, via aziel-runtime:

```bash
curl -s -A 'Mozilla/5.0' -X POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call \
  -H 'content-type: application/json' \
  -d '{"slug":"azhub","op":"place_module","payload":{"slug":"azmail","x":80,"y":80}}'
```

MCP clients on aziel-runtime call `fraggate_call` with `slug=azhub`. Catalog MCP: `POST https://aziel-runtime.vibelock.workers.dev/mcp`.

Local `/v1/{op}` is the human app backend (single-segment ops). `/v1/fraggate/*`, `/v1/runtime/*`, and `/v1/mesh/*` proxy to aziel-runtime. **QNS-CD-1.0** (photon QNS1 packet transfer) is a hub cite / Worker mesh cross-map only — not a Softwares-tab product. **SPLIT THE WIRES** + **COLD-COPY SURVIVAL** + **RE-EXPAND-FROM-ARCHIVE** are mesh status/refuse law on `GET /v1/mesh`. Local qnsd is in [qnm-node](https://github.com/AzielEliab/qnm-node). No public qnsd proxy.

Agents can show `display.title`, `display.summary`, and `display.fields`.

## FragGate live ops

| Op | What |
|----|------|
| `health` | Liveness |
| `place_module` | Place a module or Lock tile. Human app: Place → `/v1/place` |
| `region_list` | Placed tiles and the alphabetical catalog. Human app: `list_modules` |
| `tether_declare` | Visible corridor. Both ends are already placed |
| `tether_list` | Declared corridors |
| `tether_cut` | Cut a declared corridor |
| `remove_module` | Take a tile off the surface. The module stays complete |
| `blank_key_status` | Surface status. Home |
| `skill` | Agent skill markdown |

Human `/v1` also keeps `place`, `list_modules`, and `isolate` (same handlers). `isolate` leaves the tile on the surface. Agents send `place_module`, not `place`, through FragGate.

## One-click install

```bash
curl -fsSL https://azhub-download-tracker.vibelock.workers.dev/install.sh | bash
```

Counted tarball: [azhub-0.1.0.tar.gz](https://azhub-download-tracker.vibelock.workers.dev/download?asset=azhub-0.1.0.tar.gz)

Worker `azhub-download-tracker` serves that archive. `/v1` and `/mcp` do not increment the download count.

| Path | What |
|------|------|
| `/` | Worker homepage |
| `/download` | Counted tarball |
| `/count` | `{views, downloads, total}` |
| `/stats` | views / downloads / by_repo / branch / fork |
| `/openapi.json` | OpenAPI 3.1 (docs; agents use FragGate) |
| `/mcp` | Pointer to FragGate (`slug=azhub`) |
| `/v1/{op}` | Human UI backend |
| `/v1/fraggate/*` | Proxy to the aziel-runtime FragGate door |
| `/v1/runtime/*` | Proxy aliases |
| `/v1/mesh/*` | Proxy suite mesh. QNS-CD-1.0 + SPLIT THE WIRES + COLD-COPY SURVIVAL + RE-EXPAND-FROM-ARCHIVE on GET status/nodes |
| `/robots.txt` `/sitemap.xml` `/llms.txt` `/cite.json` | Crawler and citation |

- Homepage: [https://azhub-download-tracker.vibelock.workers.dev/](https://azhub-download-tracker.vibelock.workers.dev/)
- Sigil: [https://azhub-download-tracker.vibelock.workers.dev/sigil.png](https://azhub-download-tracker.vibelock.workers.dev/sigil.png)
- Cite: [cite.json](https://azhub-download-tracker.vibelock.workers.dev/cite.json) — Eliab, Aziel. (2026). AZHub 0.1.0 [Software]. Apache-2.0.

## Prove a local call

```bash
azhub doctor
azhub call place_module --payload '{"slug":"azmail","x":40,"y":40}'
azhub call place --payload '{"slug":"peacelock","x":200,"y":80}'
azhub call tether_declare --payload '{"from":"azmail","to":"peacelock"}'
azhub call isolate --payload '{"slug":"azmail"}'
azhub call tether_cut --payload '{"from":"azmail","to":"peacelock"}'
azhub call remove_module --payload '{"slug":"peacelock"}'
azhub call recommend --payload '{}'
azhub call blank_key_status
```

`recommend` returns `FG-STUB`.

## Tests

```bash
pip install -e ".[dev]"
python -m pytest -q
node tests/test_worker_engine.mjs
node tests/test_worker_door.mjs
node tests/test_worker_mesh.mjs
node tests/test_worker_brand.mjs
azhub doctor
```

## iPhone and Android

Flutter sources: [`mobile/`](mobile/). Application id `com.azieeliab.azhub`. Offline. No analytics.

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
RUN.txt             three steps to the local app
```

## Cross-links

- Runtime / FragGate door: https://github.com/AzielEliab/aziel-runtime · https://aziel-runtime.vibelock.workers.dev/
- Local node / qnsd (QNS-CD-1.0): https://github.com/AzielEliab/qnm-node
- FragGate kernel: https://github.com/AzielEliab/fraggate
- Digital Library: https://www.azielcorpuslibrary.net/
- AZInterface: https://github.com/AzielEliab/azinterface
- AZBrowser: https://github.com/AzielEliab/azbrowser
- AZNet: https://github.com/AzielEliab/aznet
- AZMail: https://github.com/AzielEliab/azmail
- https://godlock.uk
- https://www.azieleliab.com

## License

Apache-2.0. See [LICENSE](LICENSE).

Forks are welcome and always allowed.
