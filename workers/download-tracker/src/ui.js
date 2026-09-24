import { HOST, IDENTITY, LIMITATION, SIGIL, VERSION } from "./engine.js";

const ASSET = "azhub-0.1.0.tar.gz";

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
<link rel="icon" type="image/png" href="/sigil.png">
<meta name="description" content="AZHub is a Blank Key. Place modules and locks, declare the corridors, and download the package.">
<meta name="author" content="Aziel Eliab">
<meta name="color-scheme" content="dark light">
<style>
:root{color-scheme:dark;--bg:#0b0b0b;--gold:#c9a227;--gold-fill:#c9a227;--on-fill:#0b0b0b;--trim:#c9a227;--text:#ffffff;--muted:#d8d0c0;--panel:#101010;--bar:#111111;--tile:#161616;--line:#3a3118;--banner-bg:#241c0d;--banner-text:#f0d78c;--focus:#ffffff;--dot:#2a2410;--hover:#241c0d;--sheet:#0b0b0b;--placed:#141414;--corridor:#c9a227;--nodes:#0f0f0f;--overlay:rgba(0,0,0,.65)}
@media (prefers-color-scheme: light){
  :root{color-scheme:light;--bg:#fbf8f1;--gold:#6b5010;--gold-fill:#6b5010;--on-fill:#fffdf8;--trim:#6b5010;--text:#1a1408;--muted:#3f3422;--panel:#ffffff;--bar:#f3efe4;--tile:#ffffff;--line:#d9cdb4;--banner-bg:#f6edd4;--banner-text:#3d3010;--focus:#1a1408;--dot:#e4d9c0;--hover:#f6edd4;--sheet:#ffffff;--placed:#fffdf8;--corridor:#6b5010;--nodes:#f3efe4;--overlay:rgba(26,20,8,.45)}
}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,"Segoe UI",sans-serif}
html{overflow-x:clip}
body{overflow-x:clip}
a.skip{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
a.skip:focus{left:1rem;top:1rem;width:auto;height:auto;margin:0;padding:.4rem .7rem;overflow:visible;clip:auto;white-space:normal;background:var(--gold-fill);color:var(--on-fill);z-index:40;text-decoration:none}
.hero,.shell-wrap,footer.quiet{max-width:72rem;margin:0 auto}
.hero{padding:1.4rem 1.2rem .2rem}
.brandrow{display:flex;align-items:center;gap:12px;margin:0 0 12px}
.hero h1{font-size:2rem;font-weight:650;letter-spacing:.02em;margin:0 0 .2rem;line-height:1.15;color:var(--text)}
.motto{color:var(--gold);font-style:italic;margin:0 0 .7rem;font-size:1.08rem;max-width:46rem}
.lede{color:var(--muted);margin:0 0 1rem;max-width:46rem}
.kicker{display:block;margin:0 0 .45rem;font:.68rem/1.2 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
a.btn.block.primary{display:block;width:100%;max-width:40rem;margin:0 0 .7rem;padding:1.05rem 1.2rem;border:1px solid transparent;border-radius:9px;background:var(--gold-fill);color:var(--on-fill);text-align:center;text-decoration:none;font:700 1.25rem/1.1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.03em}
a.btn.block.primary:hover{filter:brightness(1.08)}
.asset-note{color:var(--muted);font-size:.9rem;margin:0 0 1rem;max-width:46rem}
.features{display:grid;grid-template-columns:1fr;gap:.75rem 1.2rem;margin:0 0 1.2rem;padding:0;list-style:none;max-width:46rem}
.features li{margin:0}
.shell-wrap{padding:0 1.2rem}
footer.quiet{padding:1.15rem 1.2rem 2.8rem;color:var(--muted);font-size:.9rem}
footer.quiet p{margin:.35rem 0}
footer.quiet a{color:var(--text)}
code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.92em}
#win{display:flex;flex-direction:column;height:min(640px,72vh);min-height:420px;background:var(--bg);border:1px solid var(--line);border-radius:14px;overflow:hidden}
#bar{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--line);background:var(--bar);flex-wrap:wrap}
#bar button,#sheet button{background:var(--tile);color:var(--text);border:1px solid var(--gold);border-radius:8px;min-height:34px;padding:0 12px;cursor:pointer;font:inherit}
#bar button:hover,#sheet button:hover{background:var(--hover);color:var(--gold)}
#homeBtn img,.brandmark{width:40px;height:40px;border-radius:10px;object-fit:cover;vertical-align:middle;box-shadow:0 0 0 1px var(--line)}
.bar-name{font-size:16px;color:var(--gold);font-weight:500;margin:0}
.badge{color:var(--gold);letter-spacing:.08em;text-transform:uppercase;font-size:11px}
#body{flex:1;display:grid;grid-template-columns:minmax(0,1fr);min-height:0;overflow:auto}
#palette,#side{overflow:auto;padding:12px;background:var(--panel);min-width:0}
#palette{border-top:1px solid var(--line)}
#side{border-top:1px solid var(--line)}
#surfaceWrap{position:relative;height:300px;min-height:300px;min-width:0}
#surface{position:absolute;inset:0;background:var(--bg);background-image:radial-gradient(circle at 1px 1px,var(--dot) 1px,transparent 0);background-size:24px 24px}
#corridors{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;color:var(--corridor)}
.tile{border:1px solid var(--trim);background:var(--tile);color:var(--text);border-radius:8px;padding:8px 10px;margin:0 0 8px;cursor:grab;user-select:none}
.tile.lock{border-color:var(--gold)}
.tile .k{color:var(--gold);font-size:10px;letter-spacing:.06em;text-transform:uppercase}
.placed{position:absolute;min-width:92px;max-width:calc(100% - 16px);padding:8px 10px;border:1px solid var(--gold);background:var(--placed);color:var(--text);border-radius:8px;cursor:pointer;text-align:center}
.placed.selected{box-shadow:0 0 0 2px var(--gold)}
.placed.isolated{opacity:.7;border-style:dashed}
h2{color:var(--gold);font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin:14px 0 8px}
.banner{border:1px solid var(--trim);background:var(--banner-bg);color:var(--banner-text);padding:10px;border-radius:8px;margin-bottom:12px}
.receipt,.cite{font-family:ui-monospace,monospace;font-size:11px;border-bottom:1px solid var(--line);padding:6px 0;overflow-wrap:anywhere}
#nodes{display:flex;align-items:center;gap:10px;padding:6px 12px;border-bottom:1px solid var(--line);background:var(--nodes);flex-wrap:wrap;color:var(--muted);font-size:12px}
#nodes .off,#nodes .on{color:var(--gold)}
#nodesList{flex:1 1 12rem;min-width:0;overflow-wrap:anywhere}
#status{border-top:1px solid var(--line);padding:6px 10px;font-size:12px;color:var(--muted);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
#modal{display:none;position:fixed;inset:0;background:var(--overlay);align-items:center;justify-content:center;z-index:20;padding:1rem}
#modal.on{display:flex}
#sheet{width:min(440px,100%);background:var(--sheet);color:var(--text);border:1px solid var(--gold);border-radius:12px;padding:16px}
#sheet button{margin:4px 6px 0 0;max-width:100%}
#sheet button:disabled{opacity:.45;cursor:not-allowed}
a{color:var(--gold)}
a:not(.btn){text-underline-offset:.15em}
.lede,.asset-note,.banner,#status,footer.quiet{overflow-wrap:anywhere}
button:focus-visible,a:focus-visible,.placed:focus-visible,a.skip:focus{outline:3px solid var(--focus);outline-offset:3px}
@media (min-width:900px){
  .features{grid-template-columns:repeat(3,minmax(0,1fr));max-width:46rem}
  #win{height:min(720px,78vh);min-height:520px}
  #body{overflow:hidden;grid-template-columns:220px minmax(0,1fr) 300px}
  #palette{border-top:0;border-right:1px solid var(--line)}
  #side{border-top:0;border-left:1px solid var(--line)}
  #surfaceWrap{height:auto;min-height:0}
  #nodesList{max-height:4.8rem;overflow:auto}
}
</style>
</head>
<body>
<a class="skip" href="#win">Skip to the Hub</a>
<header class="hero">
  <div class="brandrow">
    <img class="brandmark" src="/sigil.png" width="40" height="40" alt="" decoding="async">
  </div>
  <h1>AZHub</h1>
  <p class="motto">Blank Key. Place a module. Declare the corridor.</p>
  <p class="lede">v${VERSION} software by ${IDENTITY}. A neutral spatial container for modules and locks.</p>
  <a class="btn block primary" id="downloadBtn" href="/download?asset=${ASSET}" aria-describedby="downloadNote">Download</a>
  <p class="asset-note" id="downloadNote">${downloads} downloads · ${ASSET} · counted on this Worker for every branch and fork</p>
  <ul class="features">
    <li>Drag a module or Lock onto the Hub</li>
    <li>A declared tether draws the corridor</li>
    <li>Place, tether, isolate, and remove stay on this page</li>
  </ul>
  <p class="lede">In a terminal: <code>curl -fsSL ${HOST}/install.sh | bash</code> then <code>azhub ui</code> at http://127.0.0.1:8878.</p>
</header>
<div class="shell-wrap">
  <p class="kicker">Blank Key</p>
<div id="win">
  <div id="bar">
    <button id="btnHome" type="button" title="Home"><span id="homeBtn"><img class="brandmark" src="/sigil.png" width="40" height="40" alt="" decoding="async"></span></button>
    <p class="bar-name">AZHub</p>
    <span class="badge">Blank Key</span>
    <button id="btnStatus" type="button">blank_key_status</button>
    <button id="btnList" type="button">list_modules</button>
    <button id="btnTethers" type="button">tether_list</button>
    <button id="btnCut" type="button">tether_cut</button>
  </div>
  <div id="nodes" aria-live="polite">
    <span class="badge">Live Nodes</span>
    <span id="nodesState" class="on">Mesh ON</span>
    <span id="nodesRollup"></span>
    <span id="nodesList">Live Nodes from runtime. QNS-CD-1.0 cross-map only. SPLIT THE WIRES + COLD-COPY SURVIVAL + RE-EXPAND-FROM-ARCHIVE status/refuse. Presence only — not anonymity. Anon-broadcast is not a publish path.</span>
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
        <a href="/download?asset=${ASSET}">tarball</a>
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
        Suite mesh <code>/v1/mesh/*</code> PROXIES (AZIEL_RUNTIME or HTTPS). Read-only Live Nodes from runtime status. QNS-CD-1.0 (photon QNS1 packet transfer) hub cite / Worker mesh cross-map only. SPLIT THE WIRES + COLD-COPY SURVIVAL + RE-EXPAND-FROM-ARCHIVE are mesh status/refuse law — not Softwares-tab products. No public qnsd proxy. Not a Node Gate. Not a publish path.<br>
        <a href="/openapi.json">OpenAPI</a> · <a href="/mcp">/mcp pointer</a> · <a href="/ai">AI</a> · <a href="/v1/skill">skill</a> · <a href="/v1/mesh">/v1/mesh</a><br>
        Separate software (one FragGate door): <a href="https://github.com/AzielEliab/azinterface">AZInterface</a> ·
        <a href="https://github.com/AzielEliab/azbrowser">AZBrowser</a> ·
        <a href="https://github.com/AzielEliab/aznet">AZNet</a>
      </div>
    </aside>
  </div>
  <div id="status">
    <span>AZHub ${VERSION} · AIH-WP-1.0 · Blank Key · No receipt = no action</span>
    <span>GitHub ★ ${stars} · forks ${forks} · watchers ${watchers}</span>
  </div>
</div>
</div>
<footer class="quiet">
  <p>Apache-2.0 · ${IDENTITY} · AZHub v${VERSION}</p>
  <p><a href="https://github.com/AzielEliab/azhub">GitHub</a> · <a href="/openapi.json">OpenAPI</a> · <a href="/mcp">MCP</a> · <a href="/cite.json">Cite</a></p>
</footer>
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
    line.setAttribute("stroke", "currentColor");
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
function meshView(j) {
  if (!j || typeof j !== "object") return {};
  if (j.result && typeof j.result === "object" && !Array.isArray(j.result)) {
    return Object.assign({}, j, j.result);
  }
  if (j.mesh && typeof j.mesh === "object" && !Array.isArray(j.mesh)) {
    return Object.assign({}, j, j.mesh);
  }
  return j;
}
function paintMesh(j) {
  const view = meshView(j);
  const stateEl = document.getElementById("nodesState");
  const rollEl = document.getElementById("nodesRollup");
  const listEl = document.getElementById("nodesList");
  if (!stateEl || !rollEl || !listEl) return;
  stateEl.textContent = "Mesh ON";
  stateEl.className = "on";
  const roll = meshRollup(view);
  const live = (roll && Number.isFinite(roll.live) ? roll.live : 0) || Number(view.live_nodes) || 0;
  rollEl.textContent = roll
    ? ("live " + roll.live + " · locked " + roll.locked + " · isolated " + roll.isolated)
    : (live ? (live + " live") : "");
  const products = view.products_present || view.products || [];
  const nodes = view.nodes || [];
  const labels = nodes.length
    ? nodes.map(n => (n && (n.label || n.product || n.node_id)) || "").filter(Boolean)
    : products;
  listEl.textContent = labels.length
    ? labels.join(" · ")
    : (live
      ? (live + " Live Nodes. QNS-CD-1.0 cross-map only. SPLIT THE WIRES + COLD-COPY SURVIVAL + RE-EXPAND-FROM-ARCHIVE status/refuse. Presence only — not anonymity. Anon-broadcast is not a publish path.")
      : "Live Nodes from runtime. QNS-CD-1.0 cross-map only. SPLIT THE WIRES + COLD-COPY SURVIVAL + RE-EXPAND-FROM-ARCHIVE status/refuse. Presence only — not anonymity. Anon-broadcast is not a publish path.");
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
  let view = meshView(status);
  try {
    const extra = await meshJson("/v1/mesh/nodes");
    const extraView = meshView(extra);
    if (extraView && extraView.nodes) view = Object.assign({}, view, extraView);
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
