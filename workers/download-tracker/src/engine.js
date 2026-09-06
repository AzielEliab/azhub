/**
 * AZHub Blank Key engine — same ops as Python / MCP / FragGate slug=azhub.
 * Dual surface: Worker UI and agents call these verbs. Not Interface.
 */

export const VERSION = "0.1.0";
export const SPEC = "AIH-WP-1.0";
export const PRODUCT = "azhub";
export const NAME = "AZHub";
export const IDENTITY = "Aziel Eliab";
export const RUNTIME = "https://aziel-runtime.vibelock.workers.dev";
export const FRAGGATE = "https://github.com/AzielEliab/fraggate";
export const FRAGGATE_CALL = "https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call";
export const FRAGGATE_MCP = "https://aziel-runtime.vibelock.workers.dev/mcp";
export const HOST = "https://azhub-download-tracker.vibelock.workers.dev";
export const SIGIL = "https://www.azielcorpuslibrary.net/sigil.png";
export const AZINTERFACE = "https://github.com/AzielEliab/azinterface";
export const AZBROWSER = "https://github.com/AzielEliab/azbrowser";
export const AZNET = "https://github.com/AzielEliab/aznet";
export const LIMITATION =
  "THIS IS: AZHub — a neutral spatial container / Blank Key (AIH-WP-1.0). Place, tether, and isolate modules. Declared tethers only (visible corridors). THIS IS NOT: AZInterface, AZBrowser, AZNet, a recommender, a ranker, a meaning engine, or activation-by-co-presence. Hub does not decide why anything matters. Blank Key geometry has no intent. Modules remain complete if Hub is removed. No helpful auto-wiring. Advisory only. Author: Aziel Eliab only.";

export const UI_LIVE_OPS = Object.freeze([
  "health",
  "place",
  "list_modules",
  "tether_declare",
  "tether_list",
  "isolate",
  "blank_key_status",
  "skill",
]);

/** Public FragGate door allowlist. One door; AZHub is software under it. */
export const FRAGGATE_LIVE_OPS = Object.freeze([
  "health",
  "skill",
  "region_list",
  "place_module",
  "remove_module",
  "tether_declare",
  "tether_cut",
  "tether_list",
  "blank_key_status",
]);

export const LIVE_OPS = Object.freeze([...new Set([...UI_LIVE_OPS, ...FRAGGATE_LIVE_OPS])]);

export const UI_STUB_OPS = Object.freeze([
  "recommend",
  "rank",
  "auto_wire",
  "interpret_meaning",
  "activate_by_copresence",
]);

export const FRAGGATE_STUB_OPS = Object.freeze([
  "scorch_remote",
  "auto_unlock",
  "ranking",
  "completeness_detect",
  "unlock",
  "complete",
  "completeness",
  "rank",
  "scorch",
]);

export const STUB_OPS = Object.freeze([...new Set([...UI_STUB_OPS, ...FRAGGATE_STUB_OPS])]);

export const OPS = Object.freeze([...LIVE_OPS, ...STUB_OPS]);

export const ALIASES = Object.freeze({
  home: "blank_key_status",
  status: "blank_key_status",
  blank_key: "blank_key_status",
  modules: "list_modules",
  list: "list_modules",
  region_list: "list_modules",
  tether: "tether_declare",
  bind: "place",
  place_module: "place",
  cut: "tether_cut",
});

export const STUB_MESSAGES = Object.freeze({
  recommend: "Hub does not recommend. Neutral spatial container only.",
  rank: "Hub does not rank. Catalog order is alphabetical slug, not worth.",
  ranking: "Hub does not rank. Catalog order is alphabetical slug, not worth.",
  auto_wire: "Hub does not auto-wire. Declare a tether or nothing is connected.",
  interpret_meaning: "Hub does not interpret meaning. Blank Key geometry has no intent.",
  activate_by_copresence: "Hub does not activate by co-presence. Placement is not a trigger.",
  scorch_remote: "Hub does not remotely scorch. Modules remain complete if Hub is removed.",
  scorch: "Hub does not scorch. Blank Key geometry has no wipe.",
  auto_unlock: "Hub does not auto-unlock. Blank Key refuses completeness and unlock.",
  unlock: "Hub does not unlock. Placement is not a key.",
  complete: "Hub does not complete. Modules were already complete.",
  completeness: "Hub does not detect completeness. Modules remain complete if Hub is removed.",
  completeness_detect: "Hub does not detect completeness. Modules remain complete if Hub is removed.",
});

export const SEPARATE_PRODUCTS = Object.freeze(["azinterface", "azbrowser", "aznet"]);

export const TILES = Object.freeze([
  { slug: "ark", kind: "module", label: "The ARK" },
  { slug: "azai", kind: "module", label: "AZAI" },
  { slug: "azbot", kind: "module", label: "AZBot" },
  { slug: "azbrowser", kind: "module", label: "AZBrowser" },
  { slug: "azclce", kind: "module", label: "AZ-CLCE" },
  { slug: "aziel-corpus", kind: "module", label: "Aziel Digital Library" },
  { slug: "azieltether", kind: "lock", label: "AzielTether" },
  { slug: "azinterface", kind: "module", label: "AZInterface" },
  { slug: "azmail", kind: "module", label: "AZMail" },
  { slug: "aznet", kind: "module", label: "AZNet" },
  { slug: "azos", kind: "module", label: "AZ-OS" },
  { slug: "chronolock", kind: "lock", label: "ChronoLock" },
  { slug: "codelock", kind: "lock", label: "CodeLock" },
  { slug: "decisiongate", kind: "module", label: "DecisionGATE" },
  { slug: "employeelock", kind: "lock", label: "EmployeeLock" },
  { slug: "foldlock", kind: "lock", label: "FoldLock" },
  { slug: "forgereceipts", kind: "module", label: "ForgeReceipts" },
  { slug: "glossafilter", kind: "module", label: "Glossa Filter" },
  { slug: "godlock", kind: "lock", label: "GodLock" },
  { slug: "mialock", kind: "lock", label: "M.I.A.Lock" },
  { slug: "miragegrid", kind: "module", label: "MirageGrid" },
  { slug: "peacelock", kind: "lock", label: "PeaceLock" },
  { slug: "postking", kind: "module", label: "Post-King Chess" },
  { slug: "shadowlock", kind: "lock", label: "ShadowLock" },
  { slug: "spectrallock", kind: "lock", label: "SpectralLock" },
  { slug: "staticclock", kind: "lock", label: "StaticClock" },
  { slug: "temporallock", kind: "lock", label: "TemporalLock" },
  { slug: "trajectorylock", kind: "lock", label: "TrajectoryLock" },
  { slug: "veillock", kind: "lock", label: "VeilLock" },
  { slug: "vibelock", kind: "lock", label: "VibeLock" },
  { slug: "whistlelock", kind: "lock", label: "WhistleLock" },
  { slug: "zsolver", kind: "module", label: "ZionPattern Solver" },
]);

const ZERO = "0".repeat(64);
const SESSIONS = new Map();

export function findTile(slug) {
  const key = String(slug || "").trim().toLowerCase();
  return TILES.find((t) => t.slug === key) || null;
}

export function catalogPayload() {
  const tiles = TILES.map((t) => ({ ...t }));
  return {
    tiles,
    count: tiles.length,
    modules: tiles.filter((t) => t.kind === "module"),
    locks: tiles.filter((t) => t.kind === "lock"),
    ranked: false,
    recommended: false,
    order: "alphabetical_slug",
    separate_products: [...SEPARATE_PRODUCTS],
    note: "Catalog is a list, not a ranking. Hub does not assign meaning.",
  };
}

function clampCoord(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(8, Math.min(n, 920));
}

function nid(prefix) {
  return prefix + "-" + crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

function displayOf(title, summary, fields) {
  return {
    title,
    summary,
    fields: (fields || []).map(([label, value]) => ({ label, value: String(value) })),
    next: "Show this output to the user, then take the next input.",
  };
}

function createSession() {
  return {
    id: nid("sess"),
    placed: {},
    tethers: {},
    receipts: [],
  };
}

export function getSession(id) {
  if (id && SESSIONS.has(id)) return SESSIONS.get(id);
  const s = createSession();
  SESSIONS.set(s.id, s);
  if (SESSIONS.size > 32) {
    const first = SESSIONS.keys().next().value;
    SESSIONS.delete(first);
  }
  return s;
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(text)));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function appendReceipt(session, action, payload) {
  const ts = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const seq = session.receipts.length + 1;
  const prev = session.receipts.length ? session.receipts[session.receipts.length - 1].hash : ZERO;
  const payloadHash = await sha256Hex(JSON.stringify(payload || {}));
  const hash = await sha256Hex(`${seq}|${prev}|${action}|${payloadHash}|${ts}`);
  const row = {
    kind: "azhub.receipt",
    seq,
    ts,
    action,
    prev,
    payload_hash: payloadHash,
    hash,
    payload,
    author: IDENTITY,
  };
  session.receipts.push(row);
  if (session.receipts.length > 64) session.receipts.shift();
  return row;
}

function complete() {
  return {
    modules_remain_complete_if_hub_removed: true,
    hub_does_not_own_module_internals: true,
    hub_assigns_no_meaning: true,
    co_presence_does_not_activate: true,
  };
}

function snapshot(session) {
  const placed = Object.values(session.placed).sort((a, b) => a.slug.localeCompare(b.slug));
  const tethers = Object.values(session.tethers).sort((a, b) => (a.from + a.to).localeCompare(b.from + b.to));
  return {
    session_id: session.id,
    placed,
    tethers,
    placed_count: placed.length,
    tether_count: tethers.length,
    ranked: false,
    recommended: false,
    auto_wired: false,
    intent: null,
    meaning: null,
    blank_key: true,
    separate_from: [...SEPARATE_PRODUCTS],
    ...complete(),
  };
}

function resolve(session, token) {
  const key = String(token || "").trim();
  if (!key) return null;
  if (session.placed[key]) return session.placed[key];
  const low = key.toLowerCase();
  return Object.values(session.placed).find((r) => r.slug === low || r.id === key) || null;
}

function placeOn(session, payload) {
  const tile = findTile(payload.slug || payload.module || payload.id);
  if (!tile) return { ok: false, error: "unknown_tile", slug: payload.slug };
  const x = clampCoord(payload.x, 80);
  const y = clampCoord(payload.y, 80);
  let row = Object.values(session.placed).find((r) => r.slug === tile.slug);
  let created = false;
  if (row) {
    row.x = x;
    row.y = y;
  } else {
    row = { id: nid("mod"), slug: tile.slug, kind: tile.kind, label: tile.label, x, y, isolated: false, bound: true };
    session.placed[row.id] = row;
    created = true;
  }
  return {
    ok: true,
    action: "place",
    created,
    module: { ...row },
    collapsed_into_interface: false,
    note: "Placed on Blank Key. Hub assigned no meaning.",
    ...snapshot(session),
  };
}

export const SKILL_MD = `---
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

Always send \`User-Agent: Mozilla/5.0\`.

**Agent path is FragGate only.** MCP / agents call aziel-runtime.

\`POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call\`
body \`{"slug":"azhub","op":"<op>","payload":{}}\`

Same door as MCP \`fraggate_call\` (\`slug=azhub\`). Kernel:
https://github.com/AzielEliab/fraggate. Catalog listing lands in a
sibling aziel-runtime PR. Human chrome uses this Worker \`/v1/{op}\`
(single-segment local ops only). \`/v1/fraggate/*\` and \`/v1/runtime/*\`
PROXY to aziel-runtime. \`GET|POST /mcp\` here is a pointer, not a second MCP.

**Human UI stays on this Worker.** AI path is FragGate + this OpenAPI.

AZHub and AZInterface are **separate software** under **one FragGate door**.
Never collapse them into one engine.

## FragGate live ops (agents)

| op | UI chrome |
|----|-----------|
| \`place_module\` | Drop → Place (\`/v1/place\`) |
| \`region_list\` | Palette / list (\`/v1/list_modules\`) |
| \`tether_declare\` | Drop → Tether |
| \`tether_list\` | Corridor list |
| \`tether_cut\` | Cut a declared corridor |
| \`remove_module\` | Take a tile off the Blank Key |
| \`blank_key_status\` | Home (everblooming sigil) |
| \`health\` \`skill\` | Liveness / skill |

Human chrome also keeps \`place\`, \`list_modules\`, and \`isolate\`
on \`/v1\` (same handlers via aliases). \`isolate\` stays on the tile;
\`remove_module\` takes it off. Agents must use the FragGate names.

## Stub ops (refuse)

\`recommend\` \`rank\` \`auto_wire\` \`interpret_meaning\` \`activate_by_copresence\`
\`scorch_remote\` \`auto_unlock\` \`ranking\` \`completeness_detect\` \`unlock\`
\`complete\` \`completeness\` \`scorch\`

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude
(Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot /
Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence
surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other
MCP/OpenAPI-capable assistants — **through FragGate only**.

Agents display \`display.title\`, \`display.summary\`, and
\`display.fields\` in chat, then take the next input. No technical MCP
UI is required for the human.

## How to call

\`\`\`bash
curl -s -A 'Mozilla/5.0' -X POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call \\
  -H 'content-type: application/json' \\
  -d '{"slug":"azhub","op":"place_module","payload":{"slug":"azmail","x":80,"y":80}}'
curl -s -A 'Mozilla/5.0' -X POST https://azhub-download-tracker.vibelock.workers.dev/v1/blank_key_status \\
  -H 'content-type: application/json' \\
  -d '{}'
curl -s -A 'Mozilla/5.0' https://aziel-runtime.vibelock.workers.dev/v1/fraggate/list
\`\`\`

Apache-2.0. Forks are welcome and always allowed.
`;

export async function dispatch(op, payload, sessionId) {
  const name = ALIASES[op] || op;
  const session = getSession(sessionId || (payload && payload.session_id));
  const body = payload || {};

  const stamp = async (out, action, recPayload, display) => {
    const rec = await appendReceipt(session, action, recPayload);
    out.receipt = rec;
    out.session_id = session.id;
    out.limitation = LIMITATION;
    out.identity = IDENTITY;
    out.author = IDENTITY;
    out.slug = PRODUCT;
    out.door = "fraggate";
    if (display) out.display = display;
    if (!out.display) {
      out.display = displayOf(out.action || NAME, out.note || out.error || "ok", [["receipt", rec.hash.slice(0, 16)], ["ok", out.ok]]);
    }
    return out;
  };

  if (STUB_OPS.includes(name)) {
    const message = STUB_MESSAGES[name] || "Stub. Refused.";
    return stamp(
      {
        ok: false,
        code: "FG-STUB",
        status: "stub",
        op: name,
        error: message,
      },
      "stub_refuse",
      { op: name },
      displayOf("Stub refused", message, [["op", name], ["code", "FG-STUB"]]),
    );
  }

  if (!LIVE_OPS.includes(name)) {
    return stamp(
      {
        ok: false,
        code: "FG-HALLUC-TOOL",
        error: "unknown op",
        op,
        ops: [...OPS],
        live_ops: [...LIVE_OPS],
        stub_ops: [...STUB_OPS],
      },
      "unknown_op",
      { op },
      displayOf("Unknown op", "Refused. Discover first.", [["op", op]]),
    );
  }

  if (name === "health") {
    return stamp(
      {
        ok: true,
        product: PRODUCT,
        name: NAME,
        version: VERSION,
        spec: SPEC,
        ops: [...OPS],
        live_ops: [...LIVE_OPS],
        ui_live_ops: [...UI_LIVE_OPS],
        fraggate_live_ops: [...FRAGGATE_LIVE_OPS],
        stub_ops: [...STUB_OPS],
        separate_software: [...SEPARATE_PRODUCTS],
        agent_path: FRAGGATE_CALL,
        mcp: FRAGGATE_MCP,
        runtime: RUNTIME,
        kernel: FRAGGATE,
        host: HOST,
        sigil: SIGIL,
        azinterface: AZINTERFACE,
        azbrowser: AZBROWSER,
        aznet: AZNET,
        kv_increment: false,
        stored: false,
        ranks: false,
        recommends: false,
        auto_wires: false,
        assigns_meaning: false,
        activates_by_copresence: false,
        collapsed_into_interface: false,
      },
      "health",
      { version: VERSION },
      displayOf("AZHub health", "Blank Key. Neutral spatial container. Dual surface.", [["version", VERSION], ["spec", SPEC], ["live_ops", LIVE_OPS.length]]),
    );
  }

  if (name === "skill") {
    return stamp(
      { ok: true, markdown: SKILL_MD },
      "skill",
      { bytes: SKILL_MD.length },
      displayOf("AZHub skill", "Agent path is FragGate only.", [["bytes", SKILL_MD.length]]),
    );
  }

  if (name === "place") {
    const out = placeOn(session, body);
    const mod = out.module || {};
    return stamp(
      out,
      "place",
      { slug: body.slug, ok: out.ok },
      out.ok
        ? displayOf("Placed", (mod.label || mod.slug) + " on the Blank Key. No meaning assigned.", [["slug", mod.slug], ["kind", mod.kind], ["x", mod.x], ["y", mod.y]])
        : displayOf("Place refused", out.error || "unknown tile", [["slug", body.slug]]),
    );
  }

  if (name === "list_modules") {
    const cat = catalogPayload();
    const snap = snapshot(session);
    return stamp(
      {
        ok: true,
        action: "list_modules",
        catalog: cat,
        note: "List only. Not a ranking. Not a recommendation.",
        ...snap,
      },
      "list_modules",
      { placed: snap.placed_count, catalog: cat.count },
      displayOf("Modules", "List only. Not a ranking. Not a recommendation.", [["placed", snap.placed_count], ["catalog", cat.count]]),
    );
  }

  if (name === "tether_declare") {
    const src = resolve(session, body.from || body.source || body.a);
    const dst = resolve(session, body.to || body.target || body.b);
    if (!src || !dst) {
      return stamp(
        { ok: false, error: "both_ends_must_be_placed", from: body.from, to: body.to, ...snapshot(session) },
        "tether_declare",
        { ok: false },
        displayOf("Tether refused", "declare both ends", []),
      );
    }
    if (src.id === dst.id) {
      return stamp({ ok: false, error: "tether_needs_two_tiles", ...snapshot(session) }, "tether_declare", { ok: false }, displayOf("Tether refused", "tether needs two tiles", []));
    }
    if (src.isolated || dst.isolated) {
      return stamp({ ok: false, error: "isolated_tile_refuses_tether", from: src.slug, to: dst.slug, ...snapshot(session) }, "tether_declare", { ok: false }, displayOf("Tether refused", "isolated tile refuses tether", []));
    }
    const pair = [src.id, dst.id].sort().join("|");
    const existing = Object.values(session.tethers).find((t) => [t.from, t.to].sort().join("|") === pair);
    if (existing) {
      return stamp(
        { ok: true, action: "tether_declare", created: false, tether: { ...existing }, note: "Declared corridor already visible. Hub did not invent a new wire.", ...snapshot(session) },
        "tether_declare",
        { from: src.slug, to: dst.slug, ok: true },
        displayOf("Tether declared", "Visible corridor. Hub did not invent a wire.", [["from", existing.from_slug], ["to", existing.to_slug]]),
      );
    }
    const row = {
      id: nid("tether"),
      from: src.id,
      to: dst.id,
      from_slug: src.slug,
      to_slug: dst.slug,
      visible: true,
      declared: true,
      auto: false,
    };
    session.tethers[row.id] = row;
    return stamp(
      { ok: true, action: "tether_declare", created: true, tether: { ...row }, note: "Declared corridor only. No helpful auto-wiring.", ...snapshot(session) },
      "tether_declare",
      { from: src.slug, to: dst.slug, ok: true },
      displayOf("Tether declared", "Visible corridor. Hub did not invent a wire.", [["from", row.from_slug], ["to", row.to_slug], ["visible", true]]),
    );
  }

  if (name === "tether_list") {
    const snap = snapshot(session);
    return stamp(
      { ok: true, action: "tether_list", note: "Visible declared corridors only. Co-presence is not a tether.", ...snap },
      "tether_list",
      { count: snap.tether_count },
      displayOf("Declared tethers", "Visible corridors only. Co-presence is not a tether.", [["count", snap.tether_count]]),
    );
  }

  if (name === "isolate") {
    const row = resolve(session, body.id || body.slug || body.module);
    if (!row) {
      return stamp({ ok: false, error: "tile_not_placed", ...snapshot(session) }, "isolate", { ok: false }, displayOf("Isolate refused", "place first", []));
    }
    row.isolated = true;
    const dropped = [];
    for (const [tid, tether] of Object.entries(session.tethers)) {
      if (tether.from === row.id || tether.to === row.id) {
        dropped.push(session.tethers[tid]);
        delete session.tethers[tid];
      }
    }
    return stamp(
      { ok: true, action: "isolate", module: { ...row }, tethers_dropped: dropped, note: "Isolated on the Blank Key. Module remains complete. Hub assigned no meaning.", ...snapshot(session) },
      "isolate",
      { id: row.id, ok: true },
      displayOf("Isolated", "Bound, isolated. Module remains complete.", [["slug", row.slug], ["dropped", dropped.length]]),
    );
  }

  if (name === "remove_module") {
    const row = resolve(session, body.id || body.slug || body.module);
    if (!row) {
      return stamp({ ok: false, error: "tile_not_placed", ...snapshot(session) }, "remove_module", { ok: false }, displayOf("Remove refused", "place first", []));
    }
    const dropped = [];
    for (const [tid, tether] of Object.entries(session.tethers)) {
      if (tether.from === row.id || tether.to === row.id) {
        dropped.push(session.tethers[tid]);
        delete session.tethers[tid];
      }
    }
    delete session.placed[row.id];
    return stamp(
      { ok: true, action: "remove_module", module: { ...row }, tethers_dropped: dropped, note: "Removed from the Blank Key. Module remains complete. Hub assigned no meaning.", ...snapshot(session) },
      "remove_module",
      { id: row.id, ok: true },
      displayOf("Removed", "Taken off the Blank Key. Module remains complete.", [["slug", row.slug], ["dropped", dropped.length]]),
    );
  }

  if (name === "tether_cut") {
    const tid = String(body.id || body.tether || "").trim();
    if (tid && session.tethers[tid]) {
      const cut = [session.tethers[tid]];
      delete session.tethers[tid];
      return stamp(
        { ok: true, action: "tether_cut", tethers_cut: cut, note: "Declared corridor cut. Hub did not invent a replacement.", ...snapshot(session) },
        "tether_cut",
        { id: tid, ok: true },
        displayOf("Tether cut", "Declared corridor removed. Hub did not invent a replacement.", [["cut", cut.length]]),
      );
    }
    const src = resolve(session, body.from || body.source || body.a);
    const dst = resolve(session, body.to || body.target || body.b);
    if (src && dst) {
      const pair = [src.id, dst.id].sort().join("|");
      const cut = [];
      for (const [key, tether] of Object.entries(session.tethers)) {
        if ([tether.from, tether.to].sort().join("|") === pair) {
          cut.push(tether);
          delete session.tethers[key];
        }
      }
      if (cut.length) {
        return stamp(
          { ok: true, action: "tether_cut", tethers_cut: cut, note: "Declared corridor cut. Hub did not invent a replacement.", ...snapshot(session) },
          "tether_cut",
          { from: src.slug, to: dst.slug, ok: true },
          displayOf("Tether cut", "Declared corridor removed. Hub did not invent a replacement.", [["cut", cut.length]]),
        );
      }
      return stamp({ ok: false, error: "tether_not_declared", from: src.slug, to: dst.slug, ...snapshot(session) }, "tether_cut", { ok: false }, displayOf("Tether cut refused", "declare first", []));
    }
    const row = resolve(session, body.slug || body.module || body.id);
    if (row) {
      const cut = [];
      for (const [key, tether] of Object.entries(session.tethers)) {
        if (tether.from === row.id || tether.to === row.id) {
          cut.push(tether);
          delete session.tethers[key];
        }
      }
      return stamp(
        { ok: true, action: "tether_cut", tethers_cut: cut, note: "Declared corridors cut for that tile. Hub did not invent a replacement.", ...snapshot(session) },
        "tether_cut",
        { slug: row.slug, ok: true },
        displayOf("Tether cut", "Declared corridor removed. Hub did not invent a replacement.", [["cut", cut.length]]),
      );
    }
    return stamp({ ok: false, error: "tether_not_declared", ...snapshot(session) }, "tether_cut", { ok: false }, displayOf("Tether cut refused", "declare first", []));
  }

  if (name === "blank_key_status") {
    const snap = snapshot(session);
    return stamp(
      { ok: true, action: "blank_key_status", spec: SPEC, geometry_without_intent: true, sigil_home: true, sigil: SIGIL, note: "Blank Key. Hub does not decide why anything matters.", ...snap },
      "blank_key_status",
      { placed: snap.placed_count },
      displayOf("Blank Key", "Geometry without intent. Hub does not decide why anything matters.", [["placed", snap.placed_count], ["tethers", snap.tether_count], ["sigil", SIGIL]]),
    );
  }

  return { ok: false, error: "unhandled", op: name, session_id: session.id };
}
