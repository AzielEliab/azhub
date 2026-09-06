# AIH-WP-1.0 — Aziel Hub & Interface (combined whitepaper)

**Author:** Aziel Eliab only
**Software (this repo):** AZHub 0.1.0
**License:** Apache-2.0
**Date:** September 2026

This paper defines **two products**. They are combined in one
specification so the boundary is law, not a later argument. They must
never be collapsed into one Worker, one slug, or one UI.

| Product | Slug | Role |
|---------|------|------|
| **AZHub** | `azhub` | Neutral spatial container / Blank Key |
| **AZInterface** | `azinterface` | Separate face / lens (sibling repo) |

This repository implements **AZHub only**.

AZInterface: https://github.com/AzielEliab/azinterface
AZBrowser: https://github.com/AzielEliab/azbrowser
AZNet: https://github.com/AzielEliab/aznet

## Abstract

AZHub is a **Blank Key**: a place where complete modules can be
**placed**, **tethered** (declared corridors only), and **isolated**.
The Hub does not decide why anything matters. Geometry has no intent.
Co-presence is not activation. Ranking, recommendation, auto-wiring,
and meaning assignment are **out of scope** and stay stubbed.

If Hub is removed, every module remains complete. Hub owns coordinates
and declared corridors. It does not own module internals.

## Invariants (must not drift)

1. **Hub ≠ Interface.** Never collapse Hub into Interface. Interface
   may appear as a **tile** on the Hub. That is placement, not merger.
2. **Blank Key.** The surface is geometry without intent.
3. **No ranking.** Catalog order is alphabetical slug, not worth.
4. **No recommendations.** Hub does not suggest what to place.
5. **No meaning assignment.** Placement is not interpretation.
6. **No activation by co-presence.** Two tiles near each other do
   nothing until a human or agent **declares** a tether.
7. **Declared tethers only.** Visible corridors. No helpful auto-wiring.
8. **Modules remain complete if Hub is removed.**
9. **Public identity is Aziel Eliab only.**
10. **Dual surface.** Human Worker UI is complete software. Agents use
    FragGate / MCP on aziel-runtime. No technical chrome on the agent path.

## Architecture

```
┌─────────────────────────────────────────────┐
│  Human Worker chrome (black / gold / white) │
│  Drag tiles → drop popup → wired actions    │
├─────────────────────────────────────────────┤
│  Blank Key surface                          │
│  place · isolate · declared tethers         │
├─────────────────────────────────────────────┤
│  Receipt kernel — "No receipt = no action"  │
└─────────────────────────────────────────────┘
         │
         │ never owns
         ▼
   complete modules (AZMail, Locks, AZInterface tile, …)
```

AZBrowser and AZNet stay siblings. They may be placed as tiles. Hub
does not embed their protocols.

## Human chrome

Black background, gold trim, white text. Home is the everblooming
sigil (`https://www.azielcorpuslibrary.net/sigil.png`).

The operator drags **app/module tiles and Lock tiles** onto the Hub
surface. A **drop** opens a **popup** for that tile with wired
buttons: Place, Tether (to the selected placed tile), Isolate. Dead
chrome is a bug.

Declared tethers draw as visible gold corridors. Co-presence without
a declaration draws nothing.

## Agent path

FragGate only:

`POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call`
`{"slug":"azhub","op":"…","payload":{}}`

Kernel: https://github.com/AzielEliab/fraggate

Counted download: https://azhub-download-tracker.vibelock.workers.dev/download

Catalog listing of `azhub` lands in a sibling aziel-runtime PR.

## Live ops

`health` `place` `list_modules` `tether_declare` `tether_list`
`isolate` `blank_key_status` `skill`

## Stub ops

`recommend` `rank` `auto_wire` `interpret_meaning`
`activate_by_copresence`

Stubs refuse with `FG-STUB`. They are named so they cannot be
hallucinated as live.

## Honesty

v0.1 is the Blank Key. It is not a desktop OS, not a store, not a
recommender, and not AZInterface. Parent deploy creates the KV
namespace; this repo may ship a `000…` placeholder.

## Cite

Eliab, Aziel. (2026). AZHub 0.1.0 [Software]. Apache-2.0.
https://azhub-download-tracker.vibelock.workers.dev/

Do not invent a DOI.

Apache-2.0. Forks are welcome and always allowed.
