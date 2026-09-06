import { LIMITATION, SIGIL, VERSION } from "./engine.js";

export function homeHtml({ views = 0, downloads = 0, github = {} } = {}) {
  const stars = github.stars || 0;
  const forks = github.forks || 0;
  const watchers = github.watchers || 0;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AZHub — Blank Key · Aziel Eliab</title>
<link rel="icon" href="${SIGIL}">
<style>
:root{color-scheme:dark;--bg:#0b0b0b;--gold:#c9a227;--trim:#8a7219;--text:#ffffff;--muted:#d8d0c0;--panel:#101010}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:var(--bg);color:var(--text);font:13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif}
#win{display:flex;flex-direction:column;height:100%;border:2px solid var(--gold)}
#bar{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--gold);background:#111;flex-wrap:wrap}
#bar button{background:#161616;color:var(--text);border:1px solid var(--gold);border-radius:8px;min-height:34px;padding:0 12px;cursor:pointer}
#bar button:hover{background:#241c0d;color:var(--gold)}
#homeBtn img{width:22px;height:22px;vertical-align:middle}
h1{font-size:16px;color:var(--gold);font-weight:500;margin:0}
.badge{color:var(--gold);letter-spacing:.08em;text-transform:uppercase;font-size:11px}
#body{flex:1;display:grid;grid-template-columns:220px 1fr 300px;min-height:0}
@media(max-width:900px){#body{grid-template-columns:1fr}}
#palette,#side{overflow:auto;padding:12px;background:var(--panel)}
#palette{border-right:1px solid var(--gold)}
#side{border-left:1px solid var(--gold)}
#surfaceWrap{position:relative;min-height:420px}
#surface{position:absolute;inset:0;background:#0b0b0b;background-image:radial-gradient(circle at 1px 1px,#2a2410 1px,transparent 0);background-size:24px 24px}
#corridors{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.tile{border:1px solid var(--trim);background:#161616;color:var(--text);border-radius:8px;padding:8px 10px;margin:0 0 8px;cursor:grab;user-select:none}
.tile.lock{border-color:var(--gold)}
.tile .k{color:var(--gold);font-size:10px;letter-spacing:.06em;text-transform:uppercase}
.placed{position:absolute;min-width:92px;padding:8px 10px;border:1px solid var(--gold);background:#141414;border-radius:8px;cursor:pointer;text-align:center}
.placed.selected{box-shadow:0 0 0 2px var(--gold)}
.placed.isolated{opacity:.7;border-style:dashed}
h2{color:var(--gold);font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin:14px 0 8px}
.banner{border:1px solid var(--trim);background:#241c0d;color:#f0d78c;padding:10px;border-radius:8px;margin-bottom:12px}
.receipt,.cite{font-family:ui-monospace,monospace;font-size:11px;border-bottom:1px solid #2a2a2a;padding:6px 0;word-break:break-all}
#nodes{display:flex;align-items:center;gap:10px;padding:6px 12px;border-bottom:1px solid var(--gold);background:#0f0f0f;flex-wrap:wrap;color:var(--muted);font-size:12px}
#nodes .off{color:var(--gold)}
#nodes .on{color:var(--gold)}
#nodesList{flex:1;min-width:12rem}
#status{border-top:1px solid var(--gold);padding:6px 10px;font-size:12px;color:var(--muted);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
#modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);align-items:center;justify-content:center;z-index:20}
#modal.on{display:flex}
#sheet{width:min(440px,92vw);background:#0b0b0b;border:1px solid var(--gold);border-radius:12px;padding:16px}
#sheet button{background:#161616;color:var(--text);border:1px solid var(--gold);border-radius:8px;padding:8px 12px;cursor:pointer;margin:4px 6px 0 0}
#sheet button:hover{background:#241c0d;color:var(--gold)}
#sheet button:disabled{opacity:.4;cursor:not-allowed}
.count a,a{color:var(--gold)}
</style>
</head>
<body>
<div id="win">
  <div id="bar">
    <button id="btnHome" type="button" title="Home — everblooming sigil"><span id="homeBtn"><img alt="Home" src="${SIGIL}"></span></button>
    <h1>AZHub</h1>
    <span class="badge">Blank Key</span>
    <button id="btnStatus" type="button">blank_key_status</button>
    <button id="btnList" type="button">list_modules</button>
    <button id="btnTethers" type="button">tether_list</button>
    <button id="btnCut" type="button">tether_cut</button>
  </div>
  <div id="nodes" aria-live="polite">
    <span class="badge">Live Nodes</span>
    <span id="nodesState" class="off">Mesh OFF</span>
    <span id="nodesRollup"></span>
    <span id="nodesList">Default off until runtime enable. Presence only — not anonymity. Anon-broadcast is not a publish path.</span>
  </div>
  <div id="body">
    <aside id="palette">
      <div class="banner">Drag a module or Lock onto the Hub. Drop opens a popup. Declared tethers only. No auto-wiring.</div>
      <h2>Modules</h2>
      <div id="modTiles"></div>
      <h2>Locks</h2>
      <div id="lockTiles"></div>
    </aside>
    <section id="surfaceWrap">
      <div id="surface">
        <svg id="corridors"></svg>
      </div>
    </section>
    <aside id="side">
      <div class="count">Views <strong id="views">${views}</strong> · Downloads <strong id="downloads">${downloads}</strong>
        <a href="/download?asset=azhub-0.1.0.tar.gz">tarball</a>
        <a href="/count">/count</a>
      </div>
      <h2>Placed</h2>
      <div id="placedList" class="cite">None. Geometry without intent.</div>
      <h2>Declared corridors</h2>
      <div id="tetherList" class="cite">None. Co-presence is not a tether.</div>
      <h2>Receipts</h2>
      <div id="receipts"></div>
      <h2>FragGate</h2>
      <div class="cite">
        AI path is FragGate only: <code>POST /v1/fraggate/call</code> slug=<b>azhub</b><br>
        Door paths proxy to aziel-runtime. Local ops are <code>/v1/{op}</code> only.<br>
        Suite mesh <code>/v1/mesh/*</code> PROXIES (AZIEL_RUNTIME or HTTPS). Default OFF. Not a Node Gate. Not a publish path.<br>
        <a href="/openapi.json">OpenAPI</a> · <a href="/mcp">/mcp pointer</a> · <a href="/ai">AI</a> · <a href="/v1/skill">skill</a> · <a href="/v1/mesh">/v1/mesh</a><br>
        Separate software (one FragGate door): <a href="https://github.com/AzielEliab/azinterface">AZInterface</a> ·
        <a href="https://github.com/AzielEliab/azbrowser">AZBrowser</a> ·
        <a href="https://github.com/AzielEliab/aznet">AZNet</a>
      </div>
    </aside>
  </div>
  <div id="status">
    <span>AZHub ${VERSION} · AIH-WP-1.0 · Blank Key · not Interface · No receipt = no action</span>
    <span>GitHub ★ ${stars} · forks ${forks} · watchers ${watchers}</span>
  </div>
</div>
<div id="modal">
  <div id="sheet">
    <h2 id="popTitle">Tile</h2>
    <p id="popBody" class="cite"></p>
    <button type="button" id="actPlace">Place</button>
    <button type="button" id="actTether">Tether to selected</button>
    <button type="button" id="actIsolate">Isolate</button>
    <button type="button" id="actRemove">Remove</button>
    <button type="button" id="actClose">Close</button>
  </div>
</div>
<script>
const SIGIL = ${JSON.stringify(SIGIL)};
const LIMITATION = ${JSON.stringify(LIMITATION)};
let sessionId = "";
let last = {};
let pending = null;
let selectedId = "";
function addReceipt(rec) {
  if (!rec) return;
  const box = document.getElementById("receipts");
  const el = document.createElement("div");
  el.className = "receipt";
  el.textContent = (rec.seq||"") + " " + rec.action + " " + rec.hash;
  box.prepend(el);
}
async function callOp(op, payload) {
  const body = Object.assign({ session_id: sessionId }, payload||{});
  const r = await fetch("/v1/"+op, { method:"POST", headers:{ "content-type":"application/json", "user-agent":"Mozilla/5.0" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (j.session_id) sessionId = j.session_id;
  addReceipt(j.receipt);
  last = j;
  paint(j);
  return j;
}
function paint(j) {
  const placed = j.placed || [];
  const tethers = j.tethers || [];
  document.getElementById("placedList").innerHTML = placed.length
    ? placed.map(p => p.slug + " · " + p.kind + (p.isolated ? " · isolated" : "")).join("<br>")
    : "None. Geometry without intent.";
  document.getElementById("tetherList").innerHTML = tethers.length
    ? tethers.map(t => t.from_slug + " — " + t.to_slug).join("<br>")
    : "None. Co-presence is not a tether.";
  const surf = document.getElementById("surface");
  surf.querySelectorAll(".placed").forEach(n => n.remove());
  placed.forEach(p => {
    const el = document.createElement("div");
    el.className = "placed" + (p.id === selectedId ? " selected" : "") + (p.isolated ? " isolated" : "");
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.textContent = p.label;
    el.title = p.slug;
    el.onclick = () => { selectedId = p.id; paint(last); };
    surf.appendChild(el);
  });
  const svg = document.getElementById("corridors");
  svg.innerHTML = "";
  const byId = Object.fromEntries(placed.map(p => [p.id, p]));
  tethers.forEach(t => {
    const a = byId[t.from], b = byId[t.to];
    if (!a || !b) return;
    const line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1", a.x + 46);
    line.setAttribute("y1", a.y + 16);
    line.setAttribute("x2", b.x + 46);
    line.setAttribute("y2", b.y + 16);
    line.setAttribute("stroke", "#c9a227");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  });
}
function openPopup(tile, x, y) {
  pending = { slug: tile.slug, kind: tile.kind, label: tile.label, x, y };
  document.getElementById("popTitle").textContent = tile.label;
  document.getElementById("popBody").textContent = tile.kind + " · " + tile.slug + " · drop is not a meaning. Choose place, tether, or isolate.";
  document.getElementById("actTether").disabled = !selectedId;
  document.getElementById("modal").className = "on";
}
document.getElementById("actClose").onclick = () => document.getElementById("modal").className = "";
document.getElementById("actPlace").onclick = async () => {
  document.getElementById("modal").className = "";
  if (pending) await callOp("place", pending);
};
document.getElementById("actTether").onclick = async () => {
  if (!pending || !selectedId) return;
  document.getElementById("modal").className = "";
  const placed = await callOp("place", pending);
  const id = (placed.module && placed.module.id) || pending.slug;
  await callOp("tether_declare", { from: selectedId, to: id });
};
document.getElementById("actIsolate").onclick = async () => {
  if (!pending) return;
  document.getElementById("modal").className = "";
  await callOp("place", pending);
  await callOp("isolate", { slug: pending.slug });
};
document.getElementById("actRemove").onclick = async () => {
  if (!pending) return;
  document.getElementById("modal").className = "";
  await callOp("place", pending);
  await callOp("remove_module", { slug: pending.slug });
};
function makeTile(t) {
  const el = document.createElement("div");
  el.className = "tile" + (t.kind === "lock" ? " lock" : "");
  el.draggable = true;
  el.innerHTML = '<div class="k">'+t.kind+'</div>'+t.label;
  el.addEventListener("dragstart", ev => {
    ev.dataTransfer.setData("application/json", JSON.stringify(t));
    ev.dataTransfer.effectAllowed = "copy";
  });
  return el;
}
async function boot() {
  const listed = await callOp("list_modules", {});
  const cat = (listed.catalog && listed.catalog.tiles) || [];
  const mods = document.getElementById("modTiles");
  const locks = document.getElementById("lockTiles");
  cat.forEach(t => (t.kind === "lock" ? locks : mods).appendChild(makeTile(t)));
  const surface = document.getElementById("surface");
  surface.addEventListener("dragover", ev => { ev.preventDefault(); ev.dataTransfer.dropEffect = "copy"; });
  surface.addEventListener("drop", ev => {
    ev.preventDefault();
    let tile;
    try { tile = JSON.parse(ev.dataTransfer.getData("application/json")); } catch { return; }
    const rect = surface.getBoundingClientRect();
    openPopup(tile, ev.clientX - rect.left - 46, ev.clientY - rect.top - 16);
  });
  document.getElementById("btnHome").onclick = () => callOp("blank_key_status", {});
  document.getElementById("btnStatus").onclick = () => callOp("blank_key_status", {});
  document.getElementById("btnList").onclick = () => callOp("list_modules", {});
  document.getElementById("btnTethers").onclick = () => callOp("tether_list", {});
  document.getElementById("btnCut").onclick = () => {
    if (!selectedId) return;
    callOp("tether_cut", { id: selectedId });
  };
  fetch("/v1/fraggate/list", { headers: { "user-agent": "Mozilla/5.0" } }).then(r => r.json()).then(j => {
    const ops = (j.allowlist && j.allowlist.azhub) || (j.result && j.result.allowlist && j.result.allowlist.azhub) || [];
    const el = document.createElement("div");
    el.className = "cite";
    el.textContent = "FragGate door proxied. azhub live ops listed: " + ops.length + " (catalog listing may land in a sibling runtime PR).";
    document.getElementById("side").appendChild(el);
  }).catch(() => {});
  meshBoot();
}
const MESH_PRODUCT = "azhub";
const MESH_LABEL = "AZHub";
let meshNodeId = "";
let meshBeatAt = 0;
function meshRollup(j) {
  if (j && j.rollup && typeof j.rollup === "object") {
    const live = Number(j.rollup.live);
    const locked = Number(j.rollup.locked);
    const isolated = Number(j.rollup.isolated);
    if ([live, locked, isolated].some(Number.isFinite)) {
      return { live: Number.isFinite(live) ? live : 0, locked: Number.isFinite(locked) ? locked : 0, isolated: Number.isFinite(isolated) ? isolated : 0 };
    }
  }
  const nodes = (j && j.nodes) || [];
  if (!nodes.length) return null;
  let live = 0, locked = 0, isolated = 0, tagged = false;
  nodes.forEach(n => {
    const state = String((n && (n.state || n.status || n.mode)) || "").toLowerCase();
    if (!n) return;
    if (n.isolated === true || state === "isolated") { isolated += 1; tagged = true; }
    else if (n.locked === true || n.kind === "lock" || state === "locked") { locked += 1; tagged = true; }
    else if (state === "live" || n.live === true || n.product) { live += 1; tagged = true; }
  });
  return tagged ? { live, locked, isolated } : null;
}
function paintMesh(j) {
  const enabled = !!(j && j.enabled);
  const stateEl = document.getElementById("nodesState");
  const rollEl = document.getElementById("nodesRollup");
  const listEl = document.getElementById("nodesList");
  if (!stateEl || !rollEl || !listEl) return;
  if (!enabled) {
    stateEl.textContent = "Mesh OFF";
    stateEl.className = "off";
    rollEl.textContent = "";
    listEl.textContent = "Default off until runtime enable. Presence only — not anonymity. Anon-broadcast is not a publish path.";
    meshNodeId = "";
    return;
  }
  stateEl.textContent = "Mesh ON";
  stateEl.className = "on";
  const roll = meshRollup(j);
  rollEl.textContent = roll
    ? ("live " + roll.live + " · locked " + roll.locked + " · isolated " + roll.isolated)
    : ((j.live_nodes || 0) + " live");
  const products = j.products_present || j.products || [];
  const nodes = j.nodes || [];
  const labels = nodes.length
    ? nodes.map(n => (n && (n.label || n.product || n.node_id)) || "").filter(Boolean)
    : products;
  listEl.textContent = labels.length ? labels.join(" · ") : "No live nodes.";
}
async function meshJson(path, init) {
  const headers = { "user-agent": "Mozilla/5.0" };
  if (init && init.method && init.method !== "GET") headers["content-type"] = "application/json";
  const r = await fetch(path, Object.assign({ headers }, init || {}));
  return r.json();
}
async function meshTick() {
  let status;
  try { status = await meshJson("/v1/mesh/status"); } catch { return; }
  let view = status;
  try {
    const extra = await meshJson("/v1/mesh/nodes");
    if (extra && extra.nodes) view = Object.assign({}, status, extra);
  } catch { /* status is enough */ }
  paintMesh(view);
  if (!view || !view.enabled) return;
  const now = Date.now();
  if (!meshNodeId) {
    try {
      const joined = await meshJson("/v1/mesh/join", { method: "POST", body: JSON.stringify({ product: MESH_PRODUCT, label: MESH_LABEL }) });
      meshNodeId = (joined.session && joined.session.node_id) || (joined.node && joined.node.node_id) || "";
      meshBeatAt = now;
      if (joined && (joined.nodes || joined.live_nodes != null)) paintMesh(joined);
    } catch { /* no auto-heal */ }
    return;
  }
  if (now - meshBeatAt >= 60000) {
    try {
      const hb = await meshJson("/v1/mesh/heartbeat", { method: "POST", body: JSON.stringify({ node_id: meshNodeId }) });
      meshBeatAt = now;
      if (hb && hb.ok === false && hb.code === "MESH-UNKNOWN-NODE") meshNodeId = "";
      else if (hb && (hb.nodes || hb.live_nodes != null)) paintMesh(hb);
    } catch { /* no auto-heal */ }
  }
}
function meshBoot() {
  meshTick();
  setInterval(meshTick, 20000);
  const leave = () => {
    if (!meshNodeId) return;
    fetch("/v1/mesh/leave", { method: "POST", headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" }, body: JSON.stringify({ node_id: meshNodeId }), keepalive: true }).catch(() => {});
  };
  window.addEventListener("pagehide", leave);
}
boot();
</script>
</body>
</html>`;
}
