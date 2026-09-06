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
node tests/test_worker_engine.mjs
node tests/test_worker_door.mjs
node tests/test_worker_ui.mjs
```

Python 3.10+. Engine is stdlib only. pytest is the dev extra.

## Ground rules

1. **Hub is SPACE.** Never collapse AZHub into AZInterface.
2. **Blank Key.** Geometry without intent. Co-presence is inert.
3. **Declared wiring only.** Never auto-wire. Tethers are visible,
   cuttable, session-scoped by default.
4. **No unlock by co-presence.** Bound is custody of placement, not an unlock.
5. **No ranking / intent / completeness / Snap.** Those ops stay stub.
6. **Dual surface.** Every canvas action needs a matching FragGate / MCP
   / `/v1` op. Do not gut the human UI. Do not ship UI-only.
7. **UI binds loopback only** for `azhub ui` (`127.0.0.1:8880`).
   No telemetry. No CDN.
8. **Do not mix the download tracker** with any other product's Worker
   or KV. Namespace `AZHUB_DOWNLOADS` only.
9. **Public identity is Aziel Eliab only.**
10. **Door vs local op.** `/v1/fraggate/*` and `/v1/runtime/*` PROXY to
    aziel-runtime. Local ops are `/v1/{op}` only. Never treat
    `fraggate/call` as a local op name.
11. New behavior needs a test that fails without the change.

## Where to change things

- Place / tether / Blank Key / dispatch: `azhub/`
- Door path classifier: `azhub/door.py` + `workers/download-tracker/src/door.js`
- Worker engine (same ops): `workers/download-tracker/src/engine.js`
- OpenAPI / door proxy: `workers/download-tracker/src/runtime.js`
- Hub canvas: `workers/download-tracker/src/ui.js`
- Spec: `docs/whitepaper.md`
- Skill: `SKILL.md` (same text at Worker `GET /v1/skill`)
- Flutter: `mobile/`
- Isolated counter: `workers/download-tracker/`

## License of contributions

By submitting a change you agree it is licensed under Apache-2.0, the
same license as the rest of the tree. Keep the copyright lines honest.
Ship as Aziel Eliab.
