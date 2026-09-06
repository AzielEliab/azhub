# AZHub

Public identity: **Aziel Eliab** only.

This is the Blank Key / neutral spatial container (AIH-WP-1.0).
It is not AZInterface, not AZBrowser, and not AZNet.
Never collapse Hub into Interface.

**Dual surface is mandatory.** Human Worker chrome stays complete.
Backend MCP / OpenAPI / FragGate ops stay first-class. Do not ship UI-only.

Agent path is FragGate only via aziel-runtime:
`POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call`
with `slug=azhub`. Catalog MCP:
`POST https://aziel-runtime.vibelock.workers.dev/mcp`.
This Worker's `/mcp` is a pointer, not a second MCP. Human chrome uses
`/v1/{op}` (single-segment local ops). `/v1/fraggate/*` and
`/v1/runtime/*` PROXY to aziel-runtime — they are not local op names.

Live: place, list_modules, tether_declare, tether_list, isolate,
blank_key_status, health, skill.

Stub (refuse): recommend, rank, auto_wire, interpret_meaning,
activate_by_copresence.

Hub must not decide why anything matters. Blank Key geometry without
intent. Modules remain complete if Hub is removed. Declared tethers
only. No helpful auto-wiring.

Forks are welcome and always allowed. Apache-2.0.
