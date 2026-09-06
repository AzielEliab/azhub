# AZHub — SPACE / Blank Key (AIH-WP-1.0)

**Authority:** Aziel Hub & Interface Combined Final (AIH-WP-1.0), Hub sections.
**Product:** AZHub · slug `azhub` · Worker `azhub-download-tracker`
**Author:** Aziel Eliab only
**Version:** 0.1.0 · September 2026
**License:** Apache-2.0

Hub is **SPACE**. Interface is a **sibling**. They share a whitepaper and
must never collapse into one product.

## What Hub is

A neutral spatial container. The operator places App modules and Lock
modules onto a canvas. Placement is custody of geometry: region, z-order,
optional bound declare, optional tether declare. Nothing else happens.

Blank Key: **geometry without intent**.

## What Hub is not

- Not AZInterface (custodial operating environment — sibling repo).
- Not a ranking engine.
- Not an intent detector.
- Not a completeness detector.
- Not a Snap activation event.
- Not a module unlocker. Co-presence does not unlock.
- Not an auto-wiring fabric.

## Dual surface

1. Human Worker UI is complete software (black background, gold trim,
   white text, everblooming sigil stamp, drag-and-drop, drop popup,
   counted `/download`). Flutter `mobile/` stubs are allowed.
2. Agent / MCP traffic goes through **aziel-runtime FragGate only**.
   Parent wires the engine later. This repo documents OpenAPI and MCP
   for the full AI client list — never a Grok / ChatGPT / Venice triad.

## Place / bound / tether

On drop, the canvas shows a **popup**. The popup is custody-of-placement
UI only:

- **Place** — choose a geometric region and z-order.
- **Bound** — declare bound placement. This is not an unlock.
- **Tether** — optionally declare a corridor to an already-placed module.

Never auto-wire. If the operator does not declare a tether, none exists.

### Tether format (AIH-WP-1.0)

```json
{
  "id": "tether-…",
  "from": "mod-…",
  "to": "mod-…",
  "corridor": "visible",
  "scope": "session",
  "cuttable": true,
  "declared": true,
  "auto": false,
  "format": "AIH-WP-1.0"
}
```

Corridors are **visible** when declared, **cuttable**, and
**session-scoped by default**.

## Co-presence is inert

Two modules in the same region are an inert pair. Blank Key reports
them so a caller can see they do nothing. `unlocks` is always empty.
`snap_activation` is always false.

## Safe public ops

`health`, `skill`, `region_list`, `place_module`, `remove_module`,
`tether_declare`, `tether_cut`, `tether_list`, `blank_key_status`.

Anything that centralizes decision logic or auto-unlocks is a **stub**
and refuses (`HUB-STUB`): snap, activate, auto_wire, unlock, rank,
intent, completeness, decide, centralize, wire, fuse, collapse_interface,
copresence_unlock.

## Regions

Geometry labels only: center, north, south, east, west, dock, margin.
No rank order is implied by the names.

## Identity

Public identity is **Aziel Eliab** only (also known as Aziel Elroi Eliab,
alternateName only). Do not invent a DOI.
