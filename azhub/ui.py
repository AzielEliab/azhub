"""Loopback Blank Key chrome. 127.0.0.1 only. No telemetry."""

from __future__ import annotations

import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from .door import classify_v1_path, door_target_url
from .engine import Engine
from .meta import IDENTITY, __version__
from .receipts import Ledger

PORT = 8878
ENGINE = Engine(Ledger("./azhub_receipts.jsonl"))
_SIGIL_FILE = Path(__file__).resolve().parents[1] / "workers" / "download-tracker" / "public" / "sigil.png"

_PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AZHub — Blank Key · Aziel Eliab</title>
<link rel="icon" type="image/png" href="/sigil.png">
<style>
:root {
  color-scheme: light dark;
  --gold: #c9a227;
  --bg: #f6f3ec;
  --text: #1c1914;
  --muted: #5c564c;
  --panel: #fffcf7;
  --line: #8d8476;
  --surface: #fbf8f2;
  --dot: #e4dcc4;
  --primary: #1c1914;
  --primary-text: #ffffff;
  --shadow: 0 8px 28px rgba(28, 25, 20, .08);
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0b0b0b;
    --text: #f5f2ea;
    --muted: #c8c0b0;
    --panel: #141414;
    --line: #7a705c;
    --surface: #0b0b0b;
    --dot: #2a2410;
    --primary: #c9a227;
    --primary-text: #1a1408;
    --shadow: none;
  }
}
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; background: var(--bg); color: var(--text); }
body {
  font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif;
  overflow-x: hidden;
}
:focus { outline: none; }
:focus-visible {
  outline: 2px solid #c9a227;
  outline-offset: 2px;
}
button, summary, .tile, .placed { font: inherit; }
button { cursor: pointer; }
#app { min-height: 100vh; display: flex; flex-direction: column; }
#bar {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
  background: var(--panel);
}
#btnHome {
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 4px;
  line-height: 0;
}
#homeBtn img, .brandmark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  vertical-align: middle;
}
.titles { flex: 1; min-width: 0; }
h1 { font-size: 22px; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
.lede { margin: 4px 0 0; color: var(--muted); max-width: 62ch; }
.actions { display: flex; gap: 8px; flex-wrap: wrap; }
button.tile, button.placed { appearance: none; -webkit-appearance: none; }
button.primary, button.ghost {
  min-height: 40px;
  border-radius: 8px;
  padding: 0 16px;
}
button.primary { background: var(--primary); color: var(--primary-text); border: 1px solid var(--primary); }
button.ghost { background: transparent; color: var(--text); border: 1px solid var(--line); }
button:disabled { opacity: .45; cursor: not-allowed; }
#notice {
  margin: 0;
  padding: 8px 20px;
  color: var(--muted);
  min-height: 1.5em;
}
#stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 280px);
  gap: 16px;
  padding: 16px 20px;
  align-items: start;
}
#picker[hidden] { display: none !important; }
#picker {
  grid-column: 1 / -1;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow);
}
#picker h2, #side h2, details h2 { font-size: 13px; font-weight: 600; margin: 12px 0 8px; color: var(--muted); }
#modTiles, #lockTiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}
.tile {
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  text-align: left;
  min-height: 44px;
}
.tile.lock { border-color: var(--gold); }
.tile .k { color: var(--muted); font-size: 12px; display: block; }
#surfaceWrap {
  position: relative;
  min-height: 420px;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: auto;
  background: var(--surface);
}
#surface {
  position: relative;
  min-height: 420px;
  background-color: var(--surface);
  background-image: radial-gradient(circle at 1px 1px, var(--dot) 1px, transparent 0);
  background-size: 24px 24px;
}
#corridors { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
#emptyHint {
  position: absolute;
  left: 20px;
  top: 20px;
  margin: 0;
  color: var(--muted);
  max-width: 36ch;
}
.placed {
  position: absolute;
  min-width: 92px;
  max-width: calc(100% - 16px);
  padding: 8px 10px;
  border: 1px solid var(--gold);
  background: var(--panel);
  color: var(--text);
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
}
.placed.selected { box-shadow: 0 0 0 2px var(--gold); }
.placed.isolated { opacity: .72; border-style: dashed; }
#side {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px 16px;
  min-width: 0;
}
.cite, .receipt {
  overflow-wrap: anywhere;
  color: var(--text);
  white-space: pre-line;
}
.receipt {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  border-bottom: 1px solid var(--line);
  padding: 6px 0;
}
#nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: baseline;
  padding: 8px 0 12px;
  color: var(--muted);
}
.badge { color: var(--text); font-size: 13px; font-weight: 600; }
#nodes .on { color: var(--text); }
#nodesList { flex: 1 1 12rem; min-width: 0; }
details {
  margin: 0 20px 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
}
summary { cursor: pointer; padding: 12px 14px; font-weight: 600; }
details .pad { padding: 0 14px 14px; }
.row { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 12px; }
.prose { max-width: 68ch; color: var(--text); }
.prose p { margin: 0 0 10px; }
#status {
  margin-top: auto;
  padding: 10px 20px 16px;
  color: var(--muted);
  font-size: 14px;
}
#modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.45); align-items: center; justify-content: center; z-index: 20; padding: 16px; }
#modal.on { display: flex; }
#sheet {
  width: min(420px, 100%);
  background: var(--panel);
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow);
}
#sheet h2 { margin: 0 0 8px; font-size: 18px; color: var(--text); }
#sheet .row button { margin: 0; }
a { color: var(--text); }
@media (max-width: 800px) {
  #stage { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  #bar { flex-direction: column; padding: 16px; }
  .actions, .actions button, .row button { width: 100%; }
  #stage, details, #notice, #status { margin-left: 0; }
  details { margin: 0 16px 12px; }
  #stage { padding: 16px; }
  #surfaceWrap, #surface { min-height: 300px; }
}
</style>
</head>
<body>
<div id="app">
  <header id="bar">
    <button id="btnHome" type="button" title="Home"><span id="homeBtn"><img class="brandmark" src="/sigil.png" width="40" height="40" alt="" decoding="async"></span></button>
    <div class="titles">
      <h1>AZHub</h1>
      <p class="lede" id="lede">A blank surface for modules you place. A corridor appears only when you declare one.</p>
    </div>
    <div class="actions">
      <button id="btnPlace" class="primary" type="button">Place a module</button>
      <button id="btnHelp" class="ghost" type="button">Help</button>
    </div>
  </header>
  <p id="notice" role="status"></p>
  <div id="stage">
    <div id="picker" hidden>
      <p class="prose">Choose a module, or drag it onto the surface.</p>
      <h2>Modules</h2>
      <div id="modTiles"></div>
      <h2>Locks</h2>
      <div id="lockTiles"></div>
      <div class="row"><button type="button" id="pickerClose" class="ghost">Close</button></div>
    </div>
    <section id="surfaceWrap">
      <div id="surface">
        <svg id="corridors"></svg>
        <p id="emptyHint">Nothing placed yet.</p>
      </div>
    </section>
    <aside id="side">
      <h2>Placed</h2>
      <div id="placedList" class="cite">Nothing placed yet.</div>
      <p id="selectedLine" class="cite">Nothing selected.</p>
      <h2>Corridors</h2>
      <div id="tetherList" class="cite">No corridors yet.</div>
    </aside>
  </div>
  <details id="advanced">
    <summary>Advanced</summary>
    <div class="pad">
      <div class="row">
        <button id="btnStatus" class="ghost" type="button">Show surface</button>
        <button id="btnList" class="ghost" type="button">Refresh list</button>
        <button id="btnTethers" class="ghost" type="button">Refresh corridors</button>
        <button id="btnCut" class="ghost" type="button">Cut corridor</button>
      </div>
      <div id="nodes" aria-live="polite">
        <span class="badge">Live Nodes</span>
        <span id="nodesState" class="on">Mesh ON</span>
        <span id="nodesRollup"></span>
        <span id="nodesList">Names appear when the runtime sends them.</span>
      </div>
      <h2>Receipts</h2>
      <div id="receipts"></div>
    </div>
  </details>
  <details id="about">
    <summary>About</summary>
    <div class="pad prose">
      <p>AZHub keeps a blank surface. You place a module, and you declare a corridor when you want one. Author: Aziel Eliab.</p>
      <p>From a terminal, <code>azhub doctor</code> checks this copy and <code>azhub --help</code> lists commands. Use <code>--json</code> when a program should read the result.</p>
      <p>The agent path is FragGate. This page is the human app on 127.0.0.1. Suite mesh <code>/v1/mesh/*</code> proxies to aziel-runtime. Read-only Live Nodes come from runtime status. QNS-CD-1.0 is a cross-map cite. SPLIT THE WIRES, COLD-COPY SURVIVAL, and RE-EXPAND-FROM-ARCHIVE are status and refuse rules. No public qnsd proxy. Not a Node Gate. Presence is listed here — not anonymity. Anon-broadcast is not a publish path.</p>
    </div>
  </details>
  <footer id="status">AZHub __VERSION__ · 127.0.0.1:__PORT__ · __IDENTITY__</footer>
</div>
<div id="modal">
  <div id="sheet" role="dialog" aria-modal="true" aria-labelledby="popTitle">
    <h2 id="popTitle">Tile</h2>
    <p id="popBody" class="cite"></p>
    <div class="row">
      <button type="button" id="actPlace" class="primary">Place</button>
      <button type="button" id="actTether" class="ghost">Tether to selected</button>
      <button type="button" id="actIsolate" class="ghost">Isolate</button>
      <button type="button" id="actRemove" class="ghost">Remove</button>
      <button type="button" id="actClose" class="ghost">Close</button>
    </div>
  </div>
</div>
<script>
let last = {};
let pending = null;
let selectedId = "";
const PLAIN = {
  unknown_tile: "That name is not in the catalog.",
  both_ends_must_be_placed: "Both modules need to be placed first.",
  tile_not_placed: "That module is not on the surface yet.",
  tether_not_declared: "There is no corridor between those modules.",
  tether_needs_two_tiles: "A corridor needs two different modules.",
  isolated_tile_refuses_tether: "An isolated module cannot take a new corridor.",
  "unknown op": "That operation is not available."
};
function say(text) {
  const n = document.getElementById("notice");
  if (n) n.textContent = PLAIN[text] || text || "";
}
function addReceipt(rec) {
  if (!rec) return;
  const box = document.getElementById("receipts");
  const el = document.createElement("div");
  el.className = "receipt";
  el.textContent = (rec.seq || "") + " " + rec.action + " " + rec.hash;
  box.prepend(el);
}
async function callOp(op, payload, quiet) {
  let r;
  try {
    r = await fetch("/v1/" + op, { method: "POST", headers: {"content-type": "application/json", "user-agent": "Mozilla/5.0"}, body: JSON.stringify(payload || {}) });
  } catch (err) {
    say("That did not reach the local app. Try again.");
    return {};
  }
  const j = await r.json();
  addReceipt(j.receipt);
  last = j;
  paint(j);
  if (!quiet) {
    if (j && j.display && j.display.summary) say(j.display.summary);
    else if (j && j.ok === false) say(j.error || "That was refused.");
  }
  return j;
}
function paint(j) {
  const placed = j.placed || [];
  const tethers = j.tethers || [];
  document.getElementById("placedList").textContent = placed.length
    ? placed.map(p => (p.label || p.slug) + (p.isolated ? " · isolated" : "")).join("\\n")
    : "Nothing placed yet.";
  document.getElementById("tetherList").textContent = tethers.length
    ? tethers.map(t => t.from_slug + " — " + t.to_slug).join("\\n")
    : "No corridors yet.";
  const selected = placed.find(p => p.id === selectedId);
  document.getElementById("selectedLine").textContent = selected
    ? ("Selected: " + (selected.label || selected.slug))
    : "Nothing selected.";
  const hint = document.getElementById("emptyHint");
  if (hint) hint.hidden = placed.length > 0;
  const surf = document.getElementById("surface");
  surf.querySelectorAll(".placed").forEach(n => n.remove());
  placed.forEach(p => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "placed" + (p.id === selectedId ? " selected" : "") + (p.isolated ? " isolated" : "");
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.textContent = p.label;
    el.title = p.slug;
    el.onclick = () => { selectedId = p.id; paint(last); say("Selected " + (p.label || p.slug) + "."); };
    surf.appendChild(el);
  });
  const svg = document.getElementById("corridors");
  svg.innerHTML = "";
  const byId = Object.fromEntries(placed.map(p => [p.id, p]));
  tethers.forEach(t => {
    const a = byId[t.from], b = byId[t.to];
    if (!a || !b) return;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", a.x + 46);
    line.setAttribute("y1", a.y + 16);
    line.setAttribute("x2", b.x + 46);
    line.setAttribute("y2", b.y + 16);
    line.setAttribute("stroke", "#c9a227");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  });
}
function closeSheet() {
  document.getElementById("modal").className = "";
}
function openPopup(tile, x, y) {
  pending = { slug: tile.slug, kind: tile.kind, label: tile.label, x, y };
  document.getElementById("popTitle").textContent = tile.label;
  document.getElementById("popBody").textContent = selectedId
    ? "Place it on the surface, or tether it to the module you already selected."
    : "Place it on the surface. Select a placed module first if you want a corridor.";
  document.getElementById("actTether").disabled = !selectedId;
  document.getElementById("modal").className = "on";
  document.getElementById("actPlace").focus();
}
document.getElementById("actClose").onclick = closeSheet;
document.getElementById("actPlace").onclick = async () => {
  closeSheet();
  document.getElementById("picker").hidden = true;
  if (pending) await callOp("place", pending);
};
document.getElementById("actTether").onclick = async () => {
  if (!pending || !selectedId) return;
  closeSheet();
  document.getElementById("picker").hidden = true;
  const placed = await callOp("place", pending);
  const id = (placed.module && placed.module.id) || pending.slug;
  await callOp("tether_declare", { from: selectedId, to: id });
};
document.getElementById("actIsolate").onclick = async () => {
  if (!pending) return;
  closeSheet();
  document.getElementById("picker").hidden = true;
  await callOp("place", pending);
  await callOp("isolate", { slug: pending.slug });
};
document.getElementById("actRemove").onclick = async () => {
  if (!pending) return;
  closeSheet();
  document.getElementById("picker").hidden = true;
  await callOp("place", pending);
  await callOp("remove_module", { slug: pending.slug });
};
function makeTile(t) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "tile" + (t.kind === "lock" ? " lock" : "");
  el.draggable = true;
  el.innerHTML = '<span class="k">' + t.kind + '</span>' + t.label;
  el.addEventListener("dragstart", ev => {
    ev.dataTransfer.setData("application/json", JSON.stringify(t));
    ev.dataTransfer.effectAllowed = "copy";
  });
  el.addEventListener("click", () => {
    const n = document.querySelectorAll(".placed").length;
    openPopup(t, 24, 24 + n * 64);
  });
  return el;
}
function showPicker() {
  const picker = document.getElementById("picker");
  picker.hidden = false;
  const first = picker.querySelector(".tile");
  if (first) first.focus();
}
async function boot() {
  const listed = await callOp("list_modules", {}, true);
  if (!listed || listed.ok === false) say("The module list did not load. Open Advanced and choose Refresh list.");
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
    const maxX = Math.max(8, rect.width - 110);
    const maxY = Math.max(8, rect.height - 48);
    const x = Math.min(Math.max(8, ev.clientX - rect.left - 46), maxX);
    const y = Math.min(Math.max(8, ev.clientY - rect.top - 16), maxY);
    openPopup(tile, x, y);
  });
  document.getElementById("btnPlace").onclick = showPicker;
  document.getElementById("pickerClose").onclick = () => { document.getElementById("picker").hidden = true; };
  document.getElementById("picker").addEventListener("keydown", ev => {
    if (ev.key === "Escape") document.getElementById("picker").hidden = true;
  });
  document.getElementById("btnHelp").onclick = () => {
    const about = document.getElementById("about");
    about.open = true;
    about.scrollIntoView();
  };
  document.getElementById("modal").addEventListener("keydown", ev => {
    if (ev.key === "Escape") closeSheet();
  });
  document.getElementById("btnHome").onclick = () => callOp("blank_key_status", {});
  document.getElementById("btnStatus").onclick = () => callOp("blank_key_status", {});
  document.getElementById("btnList").onclick = () => callOp("list_modules", {});
  document.getElementById("btnTethers").onclick = () => callOp("tether_list", {});
  document.getElementById("btnCut").onclick = () => {
    if (!selectedId) {
      say("Select a placed module, then cut its corridor.");
      return;
    }
    callOp("tether_cut", { id: selectedId });
  };
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
    : (live ? (live + " live") : "Names appear when the runtime sends them.");
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
</html>
"""


def chrome() -> str:
    return (
        _PAGE.replace("__VERSION__", __version__)
        .replace("__PORT__", str(PORT))
        .replace("__IDENTITY__", IDENTITY)
    )


def _wants_json(header: str | None) -> bool:
    accept = (header or "").lower()
    if "text/html" in accept:
        return False
    return "application/json" in accept


def serve(host: str = "127.0.0.1", port: int = PORT) -> int:
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt: str, *args: object) -> None:
            return

        def _send(self, status: int, body: bytes, ctype: str) -> None:
            self.send_response(status)
            self.send_header("Content-Type", ctype)
            self.send_header("Cache-Control", "private, no-store")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)

        def _json(self, obj: object, status: int = 200) -> None:
            self._send(status, json.dumps(obj, indent=2).encode("utf-8"), "application/json; charset=utf-8")

        def do_OPTIONS(self) -> None:  # noqa: N802
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept, User-Agent, Authorization")
            self.end_headers()

        def do_GET(self) -> None:  # noqa: N802
            path = urlparse(self.path).path
            if path in ("/", "/index.html"):
                if _wants_json(self.headers.get("Accept")):
                    self._json(ENGINE.blank_key_status({}))
                    return
                self._send(200, chrome().encode("utf-8"), "text/html; charset=utf-8")
                return
            if path == "/sigil.png":
                if _SIGIL_FILE.is_file():
                    self._send(200, _SIGIL_FILE.read_bytes(), "image/png")
                    return
                self._json({"error": "sigil not hosted"}, 404)
                return
            if path == "/v1/health":
                self._json(ENGINE.health({}))
                return
            if path == "/v1/skill":
                self._send(200, ENGINE.skill({})["markdown"].encode("utf-8"), "text/markdown; charset=utf-8")
                return
            hit = classify_v1_path(path)
            if hit["kind"] == "door":
                self._proxy(path)
                return
            self._json({"error": "not found", "path": path}, 404)

        def do_POST(self) -> None:  # noqa: N802
            path = urlparse(self.path).path
            hit = classify_v1_path(path)
            if hit["kind"] == "door":
                self._proxy(path)
                return
            if hit["kind"] == "local":
                n = int(self.headers.get("Content-Length") or 0)
                raw = self.rfile.read(n) if n else b"{}"
                try:
                    payload = json.loads(raw.decode("utf-8") or "{}")
                except json.JSONDecodeError:
                    payload = {}
                if not isinstance(payload, dict):
                    payload = {}
                out = ENGINE.call(hit["op"], payload)
                status = 404 if out.get("code") == "FG-HALLUC-TOOL" else 200
                self._json(out, status)
                return
            self._json({"error": "not found", "path": path}, 404)

        def _proxy(self, path: str) -> None:
            dest = door_target_url(path)
            if not dest:
                self._json({"error": "not a door path"}, 404)
                return
            n = int(self.headers.get("Content-Length") or 0)
            data = self.rfile.read(n) if n and self.command != "GET" else None
            req = Request(dest, data=data, method=self.command)
            req.add_header("User-Agent", self.headers.get("User-Agent") or "Mozilla/5.0")
            if self.headers.get("Content-Type"):
                req.add_header("Content-Type", self.headers["Content-Type"])
            try:
                with urlopen(req, timeout=20) as res:
                    body = res.read()
                    self._send(res.status, body, res.headers.get("Content-Type") or "application/json")
            except HTTPError as exc:
                self._send(exc.code, exc.read(), "application/json; charset=utf-8")
            except URLError as exc:
                self._json({"ok": False, "error": "fraggate_proxy_failed", "detail": str(exc)[:240]}, 502)

    try:
        httpd = ThreadingHTTPServer((host, port), Handler)
    except OSError:
        print(f"{host}:{port} is already in use.", file=sys.stderr)
        print(f"If AZHub is already open, use http://{host}:{port}/", file=sys.stderr)
        return 1
    print(f"Open http://{host}:{port}/")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        return 0
    return 0
