/**
 * AZHub engine — SPACE / Blank Key (AIH-WP-1.0).
 * Same ops as Python / MCP / FragGate slug=azhub (parent wires later).
 * Neutral spatial container. No ranking, intent, completeness, or Snap.
 * Co-presence is inert. Declared wiring only. Hub does not unlock.
 * Author: Aziel Eliab only.
 */

export const VERSION = "0.1.0";
export const SPEC = "AIH-WP-1.0";
export const PRODUCT = "azhub";
export const IDENTITY = "Aziel Eliab";
export const RUNTIME = "https://aziel-runtime.vibelock.workers.dev";
export const FRAGGATE = "https://github.com/AzielEliab/fraggate";
export const FRAGGATE_CALL = "https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call";
export const FRAGGATE_MCP = "https://aziel-runtime.vibelock.workers.dev/mcp";
export const HOST = "https://azhub-download-tracker.vibelock.workers.dev";
export const SIGIL = "https://www.azielcorpuslibrary.net/sigil.png";
export const AZINTERFACE = "https://github.com/AzielEliab/azinterface";
export const LIMITATION =
  "THIS IS: AZHub (AIH-WP-1.0) — SPACE / Blank Key, a neutral spatial container that places, tethers, and bounds modules. Geometry without intent. Co-presence is inert. Declared wiring only; never auto-wire. Tether corridors are visible, cuttable, and session-scoped by default. THIS IS NOT: AZInterface (custodial operating environment — sibling, never collapse Hub into Interface), a ranking engine, an intent detector, a completeness detector, a Snap activation event, or a module unlocker. Hub does not unlock modules by co-presence. Parent wires the FragGate engine later. Advisory only. Author: Aziel Eliab only.";

export const LIVE_OPS = [
  "health",
  "skill",
  "region_list",
  "place_module",
  "remove_module",
  "tether_declare",
  "tether_cut",
  "tether_list",
  "blank_key_status",
];

export const OPS = LIVE_OPS;

export const ALIASES = {
  regions: "region_list",
  place: "place_module",
  remove: "remove_module",
  tether: "tether_declare",
  cut: "tether_cut",
  tethers: "tether_list",
  blank_key: "blank_key_status",
  status: "blank_key_status",
};

export const STUB_OPS = [
  "snap",
  "snap_activate",
  "snap_event",
  "activate",
  "auto_wire",
  "auto_unlock",
  "unlock",
  "rank",
  "intent",
  "completeness",
  "completeness_detect",
  "decide",
  "centralize",
  "wire",
  "fuse",
  "collapse_interface",
  "collapse",
  "copresence_unlock",
];

export const REGIONS = [
  { id: "center", label: "Center", kind: "geometry" },
  { id: "north", label: "North", kind: "geometry" },
  { id: "south", label: "South", kind: "geometry" },
  { id: "east", label: "East", kind: "geometry" },
  { id: "west", label: "West", kind: "geometry" },
  { id: "dock", label: "Dock", kind: "geometry" },
  { id: "margin", label: "Margin", kind: "geometry" },
];

export const CATALOG = [
  { slug: "azmail", kind: "app", name: "AZMail" },
  { slug: "azbrowser", kind: "app", name: "AZBrowser" },
  { slug: "azos", kind: "app", name: "AZ-OS" },
  { slug: "azai", kind: "app", name: "AZAI" },
  { slug: "azbot", kind: "app", name: "AZBot" },
  { slug: "aznet", kind: "app", name: "AZNet" },
  { slug: "postking", kind: "app", name: "Post-King Chess" },
  { slug: "peacelock", kind: "lock", name: "PeaceLock" },
  { slug: "vibelock", kind: "lock", name: "VibeLock" },
  { slug: "godlock", kind: "lock", name: "GodLock" },
  { slug: "foldlock", kind: "lock", name: "FoldLock" },
  { slug: "whistlelock", kind: "lock", name: "WhistleLock" },
  { slug: "decisiongate", kind: "lock", name: "DecisionGATE" },
  { slug: "shadowlock", kind: "lock", name: "ShadowLock" },
  { slug: "temporallock", kind: "lock", name: "TemporalLock" },
];

const REGION_IDS = new Set(REGIONS.map((r) => r.id));
const CATALOG_BY_SLUG = Object.fromEntries(CATALOG.map((c) => [c.slug, c]));
const ZERO = "0".repeat(64);
const SESSIONS = new Map();

export function blankKey() {
  return {
    blank_key: true,
    geometry_without_intent: true,
    copresence_inert: true,
    ranking: false,
    intent: false,
    completeness_detector: false,
    snap_activation: false,
    auto_wire: false,
    unlock_by_copresence: false,
    interface_collapse: false,
    hub_is: "SPACE",
    never: "AZInterface",
    spec: SPEC,
  };
}

function displayOf(title, summary, fields) {
  return {
    title,
    summary,
    fields: (fields || []).map(([label, value]) => ({ label, value: String(value) })),
    next: "Show this output to the user, then take the next input.",
  };
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(text)));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function createSession() {
  return {
    id: "sess-" + crypto.randomUUID().replace(/-/g, "").slice(0, 12),
    modules: {},
    tethers: {},
    receipts: [],
    scope: "session",
  };
}

export function getSession(id) {
  if (id && SESSIONS.has(id)) return SESSIONS.get(id);
  const s = createSession();
  SESSIONS.set(s.id, s);
  if (SESSIONS.size > 32) {
    const first = SESSIONS.keys().next().value;
    if (first !== s.id) SESSIONS.delete(first);
  }
  return s;
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

function occupancy(session) {
  const occ = {};
  for (const r of REGIONS) occ[r.id] = [];
  for (const mod of Object.values(session.modules)) {
    const region = mod.region || "center";
    if (!occ[region]) occ[region] = [];
    occ[region].push(mod.id);
  }
  return occ;
}

export function copresencePairs(session) {
  const pairs = [];
  const occ = occupancy(session);
  for (const [region, ids] of Object.entries(occ)) {
    if (ids.length < 2) continue;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        pairs.push({
          region,
          a: ids[i],
          b: ids[j],
          inert: true,
          unlocks: false,
          auto_wire: false,
          note: "Co-presence is inert. Blank Key does not unlock or wire.",
        });
      }
    }
  }
  return pairs;
}

function catalogKind(slug, kind) {
  const item = CATALOG_BY_SLUG[slug];
  if (item) return item.kind;
  if (kind === "app" || kind === "lock") return kind;
  return null;
}

function nameOf(slug) {
  return (CATALOG_BY_SLUG[slug] && CATALOG_BY_SLUG[slug].name) || slug;
}

export async function dispatch(op, payload, sessionId) {
  const name = ALIASES[op] || op;
  const session = getSession(sessionId || (payload && payload.session_id));
  const body = payload || {};

  if (STUB_OPS.includes(name) || STUB_OPS.includes(op)) {
    const rec = await appendReceipt(session, "stub_refuse", { op });
    return {
      ok: false,
      code: "HUB-STUB",
      error: "stub — Hub does not centralize decision logic or auto-unlock",
      op,
      stub: true,
      receipt: rec,
      session_id: session.id,
      limitation: LIMITATION,
      display: displayOf("Stub refused", "No Snap, rank, intent, completeness, or auto-unlock.", [["op", op]]),
    };
  }

  if (!LIVE_OPS.includes(name)) {
    return {
      ok: false,
      code: "FG-HALLUC-TOOL",
      error: "unknown op",
      op,
      ops: LIVE_OPS,
      stub_ops: STUB_OPS,
      door: "fraggate",
      slug: "azhub",
      session_id: session.id,
      display: displayOf("Unknown op", "Refused. Discover first.", [["op", op]]),
      limitation: LIMITATION,
    };
  }

  if (name === "health") {
    return {
      ok: true,
      product: PRODUCT,
      name: "AZHub",
      version: VERSION,
      spec: SPEC,
      identity: IDENTITY,
      author: IDENTITY,
      ops: LIVE_OPS,
      stub_ops: STUB_OPS,
      door: "fraggate",
      slug: "azhub",
      agent_path: FRAGGATE_CALL,
      mcp: FRAGGATE_MCP,
      runtime: RUNTIME,
      kernel: FRAGGATE,
      host: HOST,
      sigil: SIGIL,
      azinterface: AZINTERFACE,
      kv_increment: false,
      stored: false,
      blank_key: blankKey(),
      hub_is: "SPACE",
      never_collapse_into: "AZInterface",
      session_id: session.id,
      limitation: LIMITATION,
      display: displayOf("AZHub health", "SPACE / Blank Key. Dual surface. Parent wires FragGate later.", [["version", VERSION], ["ops", LIVE_OPS.length], ["hub", "SPACE"]]),
    };
  }

  if (name === "skill") {
    return {
      ok: true,
      product: PRODUCT,
      skill: SKILL_MD,
      session_id: session.id,
      display: displayOf("AZHub skill", "Blank Key skill markdown.", [["slug", "azhub"]]),
      limitation: LIMITATION,
    };
  }

  if (name === "region_list") {
    const occ = occupancy(session);
    const regions = REGIONS.map((r) => ({ ...r, occupancy: occ[r.id] || [], ranked: false }));
    return {
      ok: true,
      action: "region_list",
      regions,
      catalog: CATALOG,
      modules: Object.values(session.modules),
      occupancy: occ,
      copresence: copresencePairs(session),
      ranking: false,
      session_id: session.id,
      limitation: LIMITATION,
      display: displayOf("Hub regions", "Geometry only. Occupancy is inert.", [["regions", regions.length], ["modules", Object.keys(session.modules).length]]),
    };
  }

  if (name === "place_module") {
    if (body.auto_wire || body.unlock || body.snap) {
      const rec = await appendReceipt(session, "place_refuse_auto", { reason: "declared wiring only; never auto-wire / unlock / snap" });
      return {
        ok: false,
        code: "HUB-NO-AUTO",
        error: "Hub never auto-wires, unlocks, or Snap-activates. Use place + optional tether_declare.",
        receipt: rec,
        session_id: session.id,
        limitation: LIMITATION,
        display: displayOf("Placement refused", "Declared wiring only.", [["code", "HUB-NO-AUTO"]]),
      };
    }
    const slug = String(body.slug || body.module || "").trim().toLowerCase();
    if (!slug) return { ok: false, error: "slug required", limitation: LIMITATION, session_id: session.id };
    const kind = catalogKind(slug, String(body.kind || "").trim().toLowerCase() || null);
    if (kind !== "app" && kind !== "lock") {
      return { ok: false, error: "kind must be app or lock (or a catalog slug)", limitation: LIMITATION, session_id: session.id };
    }
    const region = String(body.region || "center").trim().toLowerCase();
    if (!REGION_IDS.has(region)) {
      return { ok: false, error: "unknown region", regions: REGIONS.map((r) => r.id), session_id: session.id };
    }
    const z = Number.isFinite(Number(body.z)) ? Number(body.z) : 0;
    const x = body.x == null || body.x === "" ? null : Number(body.x);
    const y = body.y == null || body.y === "" ? null : Number(body.y);
    const bound = !!body.bound;
    const mid = String(body.id || "").trim() || ("mod-" + crypto.randomUUID().replace(/-/g, "").slice(0, 10));
    const existing = session.modules[mid];
    const module = {
      id: mid,
      slug,
      name: nameOf(slug),
      kind,
      region,
      z,
      x: Number.isFinite(x) ? x : null,
      y: Number.isFinite(y) ? y : null,
      bound,
      unlocked: false,
      auto_wired: false,
      note: "Custody of placement only. Bound is a declared placement, not an unlock.",
    };
    session.modules[mid] = module;
    const rec = await appendReceipt(session, "place_module", { id: mid, slug, kind, region, z, bound, moved: !!existing });
    return {
      ok: true,
      action: "place_module",
      module,
      modules: Object.values(session.modules),
      copresence: copresencePairs(session),
      unlocked: false,
      auto_wired: false,
      receipt: rec,
      session_id: session.id,
      limitation: LIMITATION,
      blank_key: blankKey(),
      display: displayOf("Module placed", "Custody of placement. Co-presence is inert.", [["id", mid], ["region", region], ["bound", bound], ["receipt", rec.hash.slice(0, 16)]]),
    };
  }

  if (name === "remove_module") {
    const mid = String(body.id || body.module_id || "").trim();
    if (!mid || !session.modules[mid]) return { ok: false, error: "unknown module", session_id: session.id };
    const removed = session.modules[mid];
    delete session.modules[mid];
    const cut = [];
    for (const [tid, t] of Object.entries(session.tethers)) {
      if (t.from === mid || t.to === mid) {
        cut.push(t);
        delete session.tethers[tid];
      }
    }
    const rec = await appendReceipt(session, "remove_module", { id: mid, tethers_cut: cut.map((t) => t.id) });
    return {
      ok: true,
      action: "remove_module",
      removed,
      tethers_cut: cut,
      modules: Object.values(session.modules),
      receipt: rec,
      session_id: session.id,
      limitation: LIMITATION,
      display: displayOf("Module removed", "Placement withdrawn. Attached tethers cut.", [["id", mid]]),
    };
  }

  if (name === "tether_declare") {
    if (body.auto || body.auto_wire) {
      const rec = await appendReceipt(session, "tether_refuse_auto", { reason: "declared wiring only" });
      return {
        ok: false,
        code: "HUB-NO-AUTO",
        error: "Tethers must be declared. Hub never auto-wires.",
        receipt: rec,
        session_id: session.id,
        display: displayOf("Tether refused", "Declared wiring only.", [["code", "HUB-NO-AUTO"]]),
      };
    }
    const src = String(body.from || body.src || "").trim();
    const dst = String(body.to || body.dst || "").trim();
    if (!src || !dst) return { ok: false, error: "from and to required", session_id: session.id };
    if (src === dst) return { ok: false, error: "tether cannot be reflexive", session_id: session.id };
    if (!session.modules[src] || !session.modules[dst]) {
      return { ok: false, error: "both ends must be placed first", session_id: session.id };
    }
    for (const t of Object.values(session.tethers)) {
      const ends = new Set([t.from, t.to]);
      if (ends.has(src) && ends.has(dst) && ends.size === 2) {
        return { ok: false, error: "tether already declared", tether: t, session_id: session.id };
      }
    }
    const tid = String(body.id || "").trim() || ("tether-" + crypto.randomUUID().replace(/-/g, "").slice(0, 10));
    const scope = String(body.scope || "session").trim() || "session";
    const tether = {
      id: tid,
      from: src,
      to: dst,
      corridor: "visible",
      scope,
      cuttable: body.cuttable == null ? true : !!body.cuttable,
      declared: true,
      auto: false,
      format: "AIH-WP-1.0",
      note: "Visible corridor. Session-scoped by default. Cuttable. Never an unlock.",
    };
    session.tethers[tid] = tether;
    const rec = await appendReceipt(session, "tether_declare", { id: tid, from: src, to: dst, scope });
    return {
      ok: true,
      action: "tether_declare",
      tether,
      tethers: Object.values(session.tethers),
      receipt: rec,
      session_id: session.id,
      limitation: LIMITATION,
      display: displayOf("Tether declared", "Visible corridor. Cuttable. Session-scoped by default.", [["id", tid], ["from", src], ["to", dst], ["receipt", rec.hash.slice(0, 16)]]),
    };
  }

  if (name === "tether_cut") {
    const tid = String(body.id || body.tether_id || "").trim();
    if (!tid || !session.tethers[tid]) return { ok: false, error: "unknown tether", session_id: session.id };
    const t = session.tethers[tid];
    if (t.cuttable === false) return { ok: false, error: "tether is not cuttable", tether: t, session_id: session.id };
    delete session.tethers[tid];
    const rec = await appendReceipt(session, "tether_cut", { id: tid });
    return {
      ok: true,
      action: "tether_cut",
      cut: t,
      tethers: Object.values(session.tethers),
      receipt: rec,
      session_id: session.id,
      limitation: LIMITATION,
      display: displayOf("Tether cut", "Corridor withdrawn.", [["id", tid]]),
    };
  }

  if (name === "tether_list") {
    const rows = Object.values(session.tethers);
    return {
      ok: true,
      action: "tether_list",
      tethers: rows,
      count: rows.length,
      scope_default: "session",
      session_id: session.id,
      limitation: LIMITATION,
      display: displayOf("Tethers", rows.length + " declared corridor(s).", [["count", rows.length]]),
    };
  }

  if (name === "blank_key_status") {
    const pairs = copresencePairs(session);
    return {
      ok: true,
      action: "blank_key_status",
      blank_key: blankKey(),
      modules: Object.values(session.modules),
      tethers: Object.values(session.tethers),
      copresence: pairs,
      unlocks: [],
      snap: false,
      ranking: false,
      session_id: session.id,
      limitation: LIMITATION,
      display: displayOf("Blank Key", "Geometry without intent. Co-presence is inert.", [["modules", Object.keys(session.modules).length], ["tethers", Object.keys(session.tethers).length], ["copresence_pairs", pairs.length], ["unlocks", 0]]),
    };
  }

  return { ok: false, error: "unhandled", op: name, session_id: session.id };
}

export const SKILL_MD = `---
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

Always send \`User-Agent: Mozilla/5.0\`.

**Agent path is FragGate only.** MCP / agents call aziel-runtime — parent
wires the engine later. Until then, this Worker \`/v1/{op}\` is the human
UI backend and the documented OpenAPI/MCP surface.

\`POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call\`
body \`{"slug":"azhub","op":"<op>","payload":{}}\`

Same door as MCP \`fraggate_call\` (\`slug=azhub\`). Kernel:
https://github.com/AzielEliab/fraggate. Catalog listing lands in a
sibling aziel-runtime PR. Human chrome uses this Worker \`/v1/{op}\`
(single-segment local ops only). \`/v1/fraggate/*\` and \`/v1/runtime/*\`
PROXY to aziel-runtime. \`GET|POST /mcp\` here is a pointer, not a second MCP.
Catalog MCP: \`POST https://aziel-runtime.vibelock.workers.dev/mcp\`.

**Human UI stays on this Worker.** AI path is FragGate + this OpenAPI.

## Safe public ops (advisory)

| UI chrome | op |
|-----------|-----|
| Region map | \`region_list\` |
| Drop popup → Place | \`place_module\` |
| Remove chip | \`remove_module\` |
| Drop popup → Tether / corridor | \`tether_declare\` |
| Cut corridor | \`tether_cut\` |
| Corridor list | \`tether_list\` |
| Blank Key stamp | \`blank_key_status\` |
| Liveness / skill | \`health\` \`skill\` |

Stubs (refuse): snap, snap_activate, activate, auto_wire, auto_unlock,
unlock, rank, intent, completeness, decide, centralize, wire, fuse,
collapse_interface, copresence_unlock.

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants — **through FragGate only**.

Agents display \`display.title\`, \`display.summary\`, and
\`display.fields\` in chat, then take the next input. No technical MCP
UI is required for the human.

## How to call

\`\`\`bash
curl -s -A 'Mozilla/5.0' -X POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call \\
  -H 'content-type: application/json' \\
  -d '{"slug":"azhub","op":"blank_key_status","payload":{}}'
curl -s -A 'Mozilla/5.0' -X POST https://azhub-download-tracker.vibelock.workers.dev/v1/place_module \\
  -H 'content-type: application/json' \\
  -d '{"slug":"azmail","kind":"app","region":"center"}'
curl -s -A 'Mozilla/5.0' https://aziel-runtime.vibelock.workers.dev/v1/fraggate/list
curl -s -A 'Mozilla/5.0' -X POST https://azhub-download-tracker.vibelock.workers.dev/v1/fraggate/call \\
  -H 'content-type: application/json' \\
  -d '{"slug":"azhub","op":"health","payload":{}}'
\`\`\`

Apache-2.0. Forks are welcome and always allowed.
`;
