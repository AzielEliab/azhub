/**
 * Suite node mesh — QNM-BUILD-1.0 Live Nodes contract
 * plus QNS-CD-1.0 (photon QNS1 packet transfer) cross-map
 * plus SPLIT THE WIRES and COLD-COPY SURVIVAL status/refuse law.
 *
 * Default OFF. Public rollup is live|locked|isolated counts only.
 * No Node Gate. No auto-heal. Not an anonymity network.
 * No public qnsd proxy. This Worker does not implement qnsd.
 * /v1/mesh/* PROXY to aziel-runtime (AZIEL_RUNTIME or HTTPS fallback).
 * Hub cite / Worker mesh cross-map only — not a Softwares-tab product.
 * SPLIT THE WIRES and COLD-COPY SURVIVAL are mesh status/refuse only.
 * Author: Aziel Eliab only.
 */
import { FRAGGATE_CALL, FRAGGATE_MCP, IDENTITY, RUNTIME } from "./engine.js";

export const QNM_SPEC = "QNM-BUILD-1.0";
export const MESH_KERNEL = "NM-0.1";
export const MESH_DEFAULT_OFF = true;
export const MESH_ANONYMITY_NETWORK = false;
export const MESH_NODE_GATE = false;
export const MESH_AUTO_HEAL = false;
export const MESH_IDENTITY = IDENTITY;
export const MESH_SLUG = "mesh";
export const MESH_PRODUCT = "azhub";
export const MESH_PATH = "/v1/mesh";
export const MESH_STATUS_PATH = "/v1/mesh/status";
export const MESH_NODES_PATH = "/v1/mesh/nodes";
export const MESH_ENABLE_PATH = "/v1/mesh/enable";
export const MESH_DISABLE_PATH = "/v1/mesh/disable";
export const MESH_JOIN_PATH = "/v1/mesh/join";
export const MESH_HEARTBEAT_PATH = "/v1/mesh/heartbeat";
export const MESH_LEAVE_PATH = "/v1/mesh/leave";
export const MESH_BROADCAST_PATH = "/v1/mesh/broadcast";
export const ANON_BROADCAST = "https://github.com/AzielEliab/anon-broadcast";

/** Canonical photon QNS1 packet-transfer design. Not a Softwares-tab product. */
export const QNS_CD_SPEC = "QNS-CD-1.0";

export const QNS_CD = Object.freeze({
  spec: QNS_CD_SPEC,
  title: "photon QNS1 packet transfer",
  kind: "cross-map",
  softwares_tab: false,
  public_qnsd_proxy: false,
  node_gate: false,
  mesh_default: "off",
  local_daemon: {
    name: "qnsd",
    coded_in: "https://github.com/AzielEliab/qnm-node",
    note: "Local qnsd only. This Worker does not implement qnsd and does not proxy it.",
  },
  runtime: {
    cites: "https://github.com/AzielEliab/aziel-runtime",
    catalog: "https://aziel-runtime.vibelock.workers.dev/v1/software",
    designs: "https://github.com/AzielEliab/aziel-runtime/tree/main/docs/designs",
    node_mesh: "https://github.com/AzielEliab/aziel-runtime/blob/main/docs/NODE_MESH.md",
    qnm_wp: "https://github.com/AzielEliab/aziel-runtime/blob/main/docs/designs/QNM-WP-1.0.md",
    node_ops: "https://github.com/AzielEliab/aziel-runtime/blob/main/docs/designs/NODE-OPS-1.0.md",
  },
  pair_custody: "https://github.com/AzielEliab/azinterface",
  author: MESH_IDENTITY,
  identity: MESH_IDENTITY,
  note: "Hub cite / Worker mesh cross-map only. Not a Softwares-tab product. Mesh default OFF. No Node Gate. No public qnsd proxy.",
});

/** SPLIT THE WIRES — mesh status/refuse law. Not a Softwares-tab product. */
export const SPLIT_THE_WIRES_SPEC = "SPLIT-THE-WIRES-1.0";
export const SPLIT_THE_WIRES_TITLE = "SPLIT THE WIRES";
export const SPLIT_THE_WIRES_REFUSE_CODE = "STW-REFUSE";

export const SPLIT_THE_WIRES = Object.freeze({
  spec: SPLIT_THE_WIRES_SPEC,
  title: SPLIT_THE_WIRES_TITLE,
  kind: "mesh-law",
  author: MESH_IDENTITY,
  identity: MESH_IDENTITY,
  softwares_tab: false,
  product_door: false,
  tip_only_tick_s: Object.freeze({ min: 0.5, max: 1 }),
  payload: "pull-only",
  update: "proof",
  update_not: "timer",
  dwell_after_valid_cite_s: 777,
  equivocation: "ends-peer",
  emit_last: "locally",
  phoenix: "local-only",
  partition: "no-auto-splice",
  heartbeat_loss: "not-poison",
  strangers: Object.freeze(["1s", "777s"]),
  refuse: Object.freeze([
    "push_payload",
    "timer_update",
    "auto_splice",
    "phoenix_remote",
    "phoenix_hunt",
    "heartbeat_as_poison",
    "remote_emit",
    "skip_dwell",
    "keep_equivocating_peer",
    "trust_1s_stranger",
    "trust_777s_stranger",
  ]),
  note: "SPLIT THE WIRES. Tip-only 0.5–1s tick. Pull-only payload. Update is proof, not a timer. 777s dwell after a valid cite. Equivocation ends the peer. Emit last locally. Phoenix local only. Partition does not auto-splice. Heartbeat loss is not poison. 1s and 777s strangers. Status/refuse only — not a Softwares-tab product. Author: Aziel Eliab only.",
});

/** COLD-COPY SURVIVAL — mesh status/refuse law. Not a Softwares-tab product. */
export const COLD_COPY_SURVIVAL_SPEC = "COLD-COPY-SURVIVAL-1.0";
export const COLD_COPY_SURVIVAL_TITLE = "COLD-COPY SURVIVAL";
export const COLD_COPY_SURVIVAL_REFUSE_CODE = "CCS-REFUSE";

export const COLD_COPY_SURVIVAL = Object.freeze({
  spec: COLD_COPY_SURVIVAL_SPEC,
  title: COLD_COPY_SURVIVAL_TITLE,
  kind: "mesh-law",
  author: MESH_IDENTITY,
  identity: MESH_IDENTITY,
  softwares_tab: false,
  product_door: false,
  multiply_cold_copies: true,
  live_body_sync: false,
  tip_expensive_to_erase: true,
  server_pull_wipes_cold_replicas: false,
  poison: "hash-absolute-refuse",
  data_outlives_creators: true,
  refuse: Object.freeze([
    "live_body_sync",
    "cheap_tip_erase",
    "server_pull_wipe",
    "wipe_cold_replicas",
    "interpret_poison",
    "poison_forward",
    "creator_death_wipe",
  ]),
  note: "COLD-COPY SURVIVAL. Multiply cold copies. Refuse live body sync. Tip is expensive to erase. Server pull cannot wipe cold replicas. Hash-absolute poison refuse. Data outlives creators. Status/refuse only — not a Softwares-tab product. Author: Aziel Eliab only.",
});

export const MESH_NOTE =
  "QNM-BUILD-1.0 + QNS-CD-1.0 (photon QNS1 packet transfer). SPLIT THE WIRES + COLD-COPY SURVIVAL. Suite mesh default off. Live|locked|isolated counts only. No Node Gate. No public qnsd proxy. No auto-heal. Not an anonymity network. Author: Aziel Eliab only.";

export const MESH_OPS = Object.freeze([
  "status",
  "enable",
  "disable",
  "join",
  "heartbeat",
  "leave",
  "nodes",
  "broadcast",
]);

export const MESH_PROXY_ROUTES = Object.freeze([
  { path: MESH_PATH, methods: ["get", "head"], op: "status", summary: "PROXY to aziel-runtime GET /v1/mesh. Suite mesh status. Default OFF. QNS-CD-1.0 + SPLIT THE WIRES + COLD-COPY SURVIVAL attached. Not a local op. Not a public qnsd proxy." },
  { path: MESH_STATUS_PATH, methods: ["get"], op: "status", summary: "PROXY alias of GET /v1/mesh. QNS-CD-1.0 + SPLIT THE WIRES + COLD-COPY SURVIVAL attached. Not a local op." },
  { path: MESH_NODES_PATH, methods: ["get"], op: "nodes", summary: "PROXY to aziel-runtime GET /v1/mesh/nodes. Live Nodes (5-minute presence). QNS-CD-1.0 + SPLIT THE WIRES + COLD-COPY SURVIVAL attached. Not a local op." },
  { path: MESH_ENABLE_PATH, methods: ["post"], op: "enable", summary: "PROXY to aziel-runtime POST /v1/mesh/enable. Operator bearer required. Rate-limited. Not a local op." },
  { path: MESH_DISABLE_PATH, methods: ["post"], op: "disable", summary: "PROXY to aziel-runtime POST /v1/mesh/disable. Always allowed. Not a local op." },
  { path: MESH_JOIN_PATH, methods: ["post"], op: "join", summary: "PROXY to aziel-runtime POST /v1/mesh/join. Body {product, node_id?, label?, presence?}. Refused while OFF. Not a local op." },
  { path: MESH_HEARTBEAT_PATH, methods: ["post"], op: "heartbeat", summary: "PROXY to aziel-runtime POST /v1/mesh/heartbeat. Body {node_id}. Not a local op." },
  { path: MESH_LEAVE_PATH, methods: ["post"], op: "leave", summary: "PROXY to aziel-runtime POST /v1/mesh/leave. Body {node_id}. Not a local op." },
  { path: MESH_BROADCAST_PATH, methods: ["post"], op: "broadcast", summary: "PROXY to aziel-runtime POST /v1/mesh/broadcast. SHA-256 receipt only. Not AnonBroadcast upload. Not a local op." },
]);

function firstNum(...vals) {
  for (const raw of vals) {
    if (raw == null || raw === "") continue;
    const n = typeof raw === "number" ? raw : Number(String(raw).replace(/,/g, ""));
    if (Number.isFinite(n) && n >= 0) return Math.floor(n);
  }
  return null;
}

function asList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return Object.values(value);
  return [];
}

function truthyEnabled(value) {
  if (value === true || value === 1) return true;
  const s = String(value || "").trim().toLowerCase();
  return s === "on" || s === "enabled" || s === "true" || s === "live";
}

export function emptyRollup() {
  return { live: 0, locked: 0, isolated: 0 };
}

export function meshRollup(mesh) {
  const m = mesh && typeof mesh === "object" ? mesh : {};
  const r = m.rollup && typeof m.rollup === "object" && !Array.isArray(m.rollup) ? m.rollup : {};
  return {
    live: firstNum(r.live, m.live_nodes, m.live) ?? 0,
    locked: firstNum(r.locked, m.locked_nodes, m.locked) ?? 0,
    isolated: firstNum(r.isolated, m.isolated_nodes, m.isolated) ?? 0,
  };
}

function parseRollup(inner, listedLive) {
  const r = inner.rollup && typeof inner.rollup === "object" && !Array.isArray(inner.rollup)
    ? inner.rollup
    : {};
  const live = firstNum(
    r.live,
    r.live_nodes,
    r.live_count,
    inner.live,
    inner.live_nodes,
    inner.mesh_live_nodes,
    inner.live_count,
    inner.count,
    inner.n,
    inner.node_count,
    listedLive,
  );
  const locked = firstNum(r.locked, r.locked_nodes, r.locked_count, inner.locked, inner.locked_nodes, inner.locked_count);
  const isolated = firstNum(r.isolated, r.isolated_nodes, r.isolated_count, inner.isolated, inner.isolated_nodes, inner.isolated_count);
  return {
    live: live != null ? live : 0,
    locked: locked != null ? locked : 0,
    isolated: isolated != null ? isolated : 0,
  };
}

export function meshLawKey(value) {
  return String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function splitTheWiresRefuse(reason, extra = {}) {
  const key = meshLawKey(reason) || "split-the-wires";
  return {
    ok: false,
    refused: true,
    code: SPLIT_THE_WIRES_REFUSE_CODE,
    spec: SPLIT_THE_WIRES_SPEC,
    title: SPLIT_THE_WIRES_TITLE,
    reason: key,
    author: MESH_IDENTITY,
    identity: MESH_IDENTITY,
    split_the_wires: SPLIT_THE_WIRES,
    cold_copy_survival: COLD_COPY_SURVIVAL,
    note: SPLIT_THE_WIRES.note,
    ...extra,
  };
}

export function coldCopySurvivalRefuse(reason, extra = {}) {
  const key = meshLawKey(reason) || "cold-copy-survival";
  return {
    ok: false,
    refused: true,
    code: COLD_COPY_SURVIVAL_REFUSE_CODE,
    spec: COLD_COPY_SURVIVAL_SPEC,
    title: COLD_COPY_SURVIVAL_TITLE,
    reason: key,
    author: MESH_IDENTITY,
    identity: MESH_IDENTITY,
    split_the_wires: SPLIT_THE_WIRES,
    cold_copy_survival: COLD_COPY_SURVIVAL,
    note: COLD_COPY_SURVIVAL.note,
    ...extra,
  };
}

/** Status/refuse: return a refuse envelope for a banned mesh-law verb, else null. */
export function meshLawRefuse(op, extra = {}) {
  const key = meshLawKey(op);
  if (!key) return null;
  if (SPLIT_THE_WIRES.refuse.includes(key)) return splitTheWiresRefuse(key, extra);
  if (COLD_COPY_SURVIVAL.refuse.includes(key)) return coldCopySurvivalRefuse(key, extra);
  return null;
}

export function meshLawOpFromPath(pathname) {
  const path = String(pathname || "").replace(/\/+$/, "") || "/";
  if (path !== MESH_PATH && !path.startsWith(MESH_PATH + "/")) return "";
  const parts = path.split("/").filter(Boolean);
  return parts.length >= 3 ? parts[parts.length - 1] : "";
}

export function meshLawRefuseFromPath(pathname) {
  return meshLawRefuse(meshLawOpFromPath(pathname));
}

/** Attach QNS-CD-1.0 plus SPLIT THE WIRES and COLD-COPY SURVIVAL on status / Live Nodes. */
export function attachQnsCd(doc) {
  const base = doc && typeof doc === "object" && !Array.isArray(doc) ? { ...doc } : {};
  return {
    ...base,
    qns_cd_spec: QNS_CD_SPEC,
    qns_cd: QNS_CD,
    split_the_wires_spec: SPLIT_THE_WIRES_SPEC,
    split_the_wires: SPLIT_THE_WIRES,
    cold_copy_survival_spec: COLD_COPY_SURVIVAL_SPEC,
    cold_copy_survival: COLD_COPY_SURVIVAL,
  };
}

export function isMeshCrossMapPath(pathname) {
  const raw = String(pathname || "");
  const path = raw.replace(/\/+$/, "") || "/";
  return path === MESH_PATH || path === MESH_STATUS_PATH || path === MESH_NODES_PATH;
}

export function emptyMesh(extra = {}) {
  const rollup = extra.rollup && typeof extra.rollup === "object"
    ? { ...emptyRollup(), ...extra.rollup }
    : emptyRollup();
  return attachQnsCd({
    ok: true,
    spec: QNM_SPEC,
    kernel: MESH_KERNEL,
    enabled: false,
    default_off: true,
    live_nodes: 0,
    status: extra.status || "off",
    source: extra.source || "fallback",
    node_gate: false,
    auto_heal: false,
    anonymity_network: false,
    author: MESH_IDENTITY,
    identity: MESH_IDENTITY,
    note: MESH_NOTE,
    door: MESH_PATH,
    ...extra,
    spec: QNM_SPEC,
    rollup,
    node_gate: false,
    auto_heal: false,
    anonymity_network: false,
    author: MESH_IDENTITY,
    identity: MESH_IDENTITY,
    note: extra.note || MESH_NOTE,
  });
}

export function compactMeshNode(raw) {
  if (raw == null) return null;
  if (typeof raw === "string") {
    const id = raw.trim();
    return id ? { id } : null;
  }
  if (typeof raw !== "object") return null;
  const id = String(raw.id || raw.node_id || raw.session_id || raw.peer || raw.name || "").trim();
  const product = String(raw.product || raw.slug || raw.suite || "").trim();
  const seen = raw.last_utc || raw.last_seen || raw.seen_utc || raw.heartbeat_utc || "";
  if (!id && !product && !seen) return null;
  const out = {};
  if (id) out.id = id;
  if (product) out.product = product;
  if (seen) out.last_utc = String(seen);
  return out;
}

export function parseMeshDoc(body) {
  if (body == null) return emptyMesh({ status: "unavailable", source: "empty" });
  if (typeof body !== "object" || Array.isArray(body)) {
    return emptyMesh({ status: "unavailable", source: "empty" });
  }
  const inner = body.result && typeof body.result === "object" && !Array.isArray(body.result)
    ? { ...body, ...body.result }
    : (body.mesh && typeof body.mesh === "object" && !Array.isArray(body.mesh)
      ? { ...body, ...body.mesh }
      : body);
  const listed = asList(inner.nodes || inner.list || inner.peers || inner.live_nodes_list)
    .map(compactMeshNode)
    .filter(Boolean);
  const rollup = parseRollup(inner, listed.length ? listed.length : null);
  const enabled = truthyEnabled(inner.enabled)
    || truthyEnabled(inner.mesh_enabled)
    || String(inner.status || "").toLowerCase() === "on";
  const unavailable = inner.ok === false
    && !enabled
    && (inner.error || inner.status === "unavailable" || inner.status === "not_found");
  const status = enabled ? "on" : (unavailable ? "unavailable" : "off");
  const live = enabled ? rollup.live : 0;
  const locked = enabled ? rollup.locked : 0;
  const isolated = enabled ? rollup.isolated : 0;
  const products = asList(inner.products_present || inner.products)
    .map((p) => (typeof p === "string" ? p : (p && (p.product || p.slug || p.name)) || ""))
    .map((s) => String(s).trim())
    .filter(Boolean);
  return emptyMesh({
    ok: inner.ok !== false,
    enabled,
    default_off: inner.default_off !== false,
    live_nodes: live,
    rollup: { live, locked, isolated },
    products_present: products,
    nodes: listed,
    status,
    source: inner.source || "parsed",
    door: inner.door || MESH_PATH,
    note: enabled
      ? "QNM-BUILD-1.0 + QNS-CD-1.0 (photon QNS1 packet transfer). SPLIT THE WIRES + COLD-COPY SURVIVAL. Suite mesh is on. Live|locked|isolated counts only. No Node Gate. No public qnsd proxy. No auto-heal. Not an anonymity network."
      : MESH_NOTE,
  });
}

export function publicMesh(mesh) {
  const m = mesh && typeof mesh === "object" ? mesh : emptyMesh();
  const enabled = !!m.enabled;
  const rollup = enabled ? meshRollup(m) : emptyRollup();
  return attachQnsCd({
    spec: QNM_SPEC,
    kernel: MESH_KERNEL,
    enabled,
    default_off: m.default_off !== false,
    live_nodes: enabled ? rollup.live : 0,
    rollup,
    status: enabled ? "on" : (m.status === "unavailable" ? "unavailable" : "off"),
    source: m.source || "fallback",
    node_gate: false,
    auto_heal: false,
    anonymity_network: false,
    author: MESH_IDENTITY,
    identity: MESH_IDENTITY,
    door: MESH_PATH,
    status_path: MESH_STATUS_PATH,
    nodes_path: MESH_NODES_PATH,
    join: MESH_JOIN_PATH,
    heartbeat: MESH_HEARTBEAT_PATH,
    enable: MESH_ENABLE_PATH,
    disable: MESH_DISABLE_PATH,
    leave: MESH_LEAVE_PATH,
    broadcast: MESH_BROADCAST_PATH,
    mcp: FRAGGATE_MCP,
    fraggate: FRAGGATE_CALL,
    slug: MESH_SLUG,
    product: MESH_PRODUCT,
    ops: MESH_OPS.slice(),
    origin: RUNTIME + MESH_PATH,
    note: m.note || MESH_NOTE,
  });
}

export function meshStatusLine(mesh) {
  const m = mesh && typeof mesh === "object" ? mesh : emptyMesh();
  if (m.enabled) {
    const r = meshRollup(m);
    return "Suite mesh: on · live " + r.live + " · locked " + r.locked + " · isolated " + r.isolated + ". QNS-CD-1.0. SPLIT THE WIRES + COLD-COPY SURVIVAL. Not an anonymity network.";
  }
  if (m.status === "unavailable") {
    return "Suite mesh: off (unavailable). QNM-BUILD-1.0 + QNS-CD-1.0. SPLIT THE WIRES + COLD-COPY SURVIVAL. Not an anonymity network.";
  }
  return "Suite mesh: off (default). QNM-BUILD-1.0 + QNS-CD-1.0. SPLIT THE WIRES + COLD-COPY SURVIVAL. Not an anonymity network.";
}

/** Public Live Nodes count. Never auto-heal a visiting floor. */
export function alignLiveNodes({ mesh } = {}) {
  if (mesh && mesh.enabled) return meshRollup(mesh).live;
  return 0;
}

export function meshPointer() {
  return attachQnsCd({
    pointer: true,
    path: MESH_PATH,
    enabled_default: false,
    proxy: true,
    spec: QNM_SPEC,
    companion: "AIH-WP-1.1",
    kernel: MESH_KERNEL,
    rollup: "live|locked|isolated",
    node_gate: false,
    auto_heal: false,
    anonymity: false,
    anonymity_network: false,
    author: MESH_IDENTITY,
    identity: MESH_IDENTITY,
    catalog_mcp: FRAGGATE_MCP,
    fraggate_slug: MESH_SLUG,
    origin: RUNTIME + MESH_PATH,
    note: "PROXY to aziel-runtime /v1/mesh/* via AZIEL_RUNTIME or HTTPS fallback. Not a local op. Not AnonBroadcast. Not AZMail's product-local ring. AZHub remains a Blank Key (AIH-WP-1.0). Full node process is local qnm-node/. QNS-CD-1.0 is a hub cite / Worker mesh cross-map only (photon QNS1 packet transfer). SPLIT THE WIRES + COLD-COPY SURVIVAL are mesh status/refuse law — not Softwares-tab products. No public qnsd proxy. " + MESH_NOTE,
    anon_broadcast: "not a publish path",
    anon_broadcast_repo: ANON_BROADCAST,
    anon_broadcast_publish_path: false,
  });
}

export function meshOpenApiPaths() {
  const paths = {};
  for (const route of MESH_PROXY_ROUTES) {
    const entry = paths[route.path] || {};
    for (const method of route.methods) {
      entry[method] = {
        operationId: "azhub_mesh_" + route.op + (method === "head" ? "_head" : "") + "_proxy",
        summary: route.summary,
        tags: ["mesh"],
        responses: { "200": { description: "aziel-runtime mesh envelope + QNS-CD-1.0 + SPLIT THE WIRES + COLD-COPY SURVIVAL on GET status/nodes" } },
      };
      if (method === "post") {
        entry[method].requestBody = { content: { "application/json": { schema: { type: "object" } } } };
      }
    }
    paths[route.path] = entry;
  }
  return paths;
}
