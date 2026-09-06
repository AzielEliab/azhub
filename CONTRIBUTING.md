# Contributing to AZHub

**Forks are first-class.** This project is Apache-2.0; you do not need
permission to fork, patch, or redistribute.

**Forks are welcome and always allowed.**

## How to run tests

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
python -m pytest -q
azhub doctor
```

Python 3.10+. Engine is stdlib only. pytest is the dev extra.

## Ground rules

1. **Not Interface.** Do not collapse Hub into AZInterface, AZBrowser,
   or AZNet. Those stay siblings. Tiles may be placed; products stay
   complete without Hub.
2. **Dual surface.** Every chrome action needs a matching FragGate / MCP
   / `/v1` op. Do not gut the human UI. Do not ship UI-only.
3. **No receipt = no action.** Mutating live ops append a hash-chained receipt.
4. **No ranking / recommend / auto-wire / meaning / co-presence activation.**
   Those verbs are stubs and must refuse (`FG-STUB`).
5. **Declared tethers only.** Visible corridors. No helpful auto-wiring.
6. **UI binds loopback only** for `azhub ui` (`127.0.0.1:8878`).
   No telemetry. No CDN.
7. **Do not mix the download tracker** with any other product's Worker
   or KV. Namespace `AZHUB_DOWNLOADS` only.
8. **Public identity is Aziel Eliab only.**
9. **Door vs local op.** `/v1/fraggate/*`, `/v1/runtime/*`, and
   `/v1/mesh/*` PROXY to aziel-runtime. Local ops are `/v1/{op}` only.
   Never treat `fraggate/call` or `mesh` as a local op name. Suite mesh
   stays OFF until runtime enable. No Node Gate. No auto-heal.
   Anon-broadcast is not a publish path.
10. New behavior needs a test that fails without the change.

## Where to change things

- Catalog / surface / dispatch: `azhub/`
- Door path classifier: `azhub/door.py` + `workers/download-tracker/src/door.js`
- Worker engine (same ops): `workers/download-tracker/src/engine.js`
- OpenAPI / door proxy: `workers/download-tracker/src/runtime.js`
- Blank Key chrome: `workers/download-tracker/src/ui.js`
- Spec: `docs/whitepaper.md`
- Skill: `SKILL.md` (same text at Worker `GET /v1/skill`)
- Flutter: `mobile/`
- Isolated counter: `workers/download-tracker/`

## License of contributions

By submitting a change you agree it is licensed under Apache-2.0, the
same license as the rest of the tree. Keep the copyright lines honest.
Ship as Aziel Eliab.
