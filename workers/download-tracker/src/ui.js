import { CATALOG, LIMITATION, REGIONS, SIGIL, VERSION } from "./engine.js";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function homeHtml({ views = 0, downloads = 0, github = {} } = {}) {
  const stars = github.stars || 0;
  const forks = github.forks || 0;
  const watchers = github.watchers || 0;
  const apps = CATALOG.filter((c) => c.kind === "app");
  const locks = CATALOG.filter((c) => c.kind === "lock");
  const chip = (m) =>
    `<button type="button" class="chip ${m.kind}" draggable="true" data-slug="${esc(m.slug)}" data-kind="${esc(m.kind)}" data-name="${esc(m.name)}">${esc(m.name)}</button>`;
  const zones = REGIONS.map(
    (r) => `<div class="zone" data-region="${esc(r.id)}" data-label="${esc(r.label)}"><span class="zone-label">${esc(r.label)}</span></div>`,
  ).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index,follow">
<title>AZHub — SPACE / Blank Key</title>
<link rel="icon" href="${SIGIL}">
<style>
:root{color-scheme:dark;--bg:#000000;--gold:#c9a227;--trim:#8a7219;--text:#ffffff;--muted:#d8d0c0;--panel:#0a0a0a}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:var(--bg);color:var(--text);font:13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif}
#win{display:flex;flex-direction:column;height:100%;border:2px solid var(--gold);background:var(--bg)}
#brand{display:flex;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid var(--gold);background:#050505}
#brand img{width:44px;height:44px;border:1px solid var(--gold);border-radius:50%}
#brand h1{margin:0;color:var(--gold);font-weight:500;font-size:20px;letter-spacing:.08em}
#brand .sub{color:var(--muted);font-size:12px}
#body{flex:1;display:grid;grid-template-columns:220px 1fr 320px;min-height:0}
@media(max-width:980px){#body{grid-template-columns:1fr}}
#rail,#side{overflow:auto;padding:12px;background:var(--panel)}
#rail{border-right:1px solid var(--gold)}
#side{border-left:1px solid var(--gold)}
#stage-wrap{position:relative;min-height:420px;background:#000}
#canvas{position:relative;height:100%;min-height:520px;background:
  radial-gradient(circle at 50% 50%,#1a1508 0%,#000 62%);
  overflow:hidden}
#zones{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1.2fr 1fr;grid-template-rows:1fr 1.4fr 1fr;gap:8px;padding:12px}
.zone{border:1px dashed var(--trim);border-radius:10px;position:relative;min-height:80px}
.zone.over{border-style:solid;border-color:var(--gold);background:#241c0d44}
.zone-label{position:absolute;top:6px;left:8px;color:var(--gold);font-size:11px;letter-spacing:.08em;text-transform:uppercase;pointer-events:none}
#corridors{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
#corridors line{stroke:var(--gold);stroke-width:2;stroke-dasharray:6 4}
.module{position:absolute;min-width:92px;padding:8px 10px;border:1px solid var(--gold);border-radius:8px;background:#111;color:#fff;cursor:grab;z-index:2;text-align:center}
.module.lock{border-style:double}
.module .kind{display:block;color:var(--gold);font-size:10px;letter-spacing:.08em;text-transform:uppercase}
h2{color:var(--gold);font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin:16px 0 8px}
.chip{display:block;width:100%;margin:0 0 6px;padding:8px 10px;border:1px solid var(--trim);border-radius:8px;background:#111;color:#fff;cursor:grab;text-align:left}
.chip.lock{border-style:double}
.chip:hover,.chip:focus{border-color:var(--gold);color:var(--gold)}
.banner{border:1px solid var(--trim);background:#241c0d;color:#f0d78c;padding:10px 12px;border-radius:8px;margin-bottom:14px}
.card{border:1px solid #3a3014;background:#141414;padding:12px;border-radius:10px;margin:0 0 10px}
.card a,.count a{color:var(--gold)}
.cite{font-size:11px;color:var(--muted)}
.receipt{font-family:ui-monospace,monospace;font-size:11px;border-bottom:1px solid #2a2a2a;padding:6px 0;word-break:break-all}
#status{border-top:1px solid var(--gold);padding:6px 10px;font-size:12px;color:var(--muted);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
#popup{display:none;position:fixed;inset:0;background:#000000aa;z-index:20;align-items:center;justify-content:center}
#popup.open{display:flex}
#popup .sheet{width:min(440px,92vw);background:#000;border:2px solid var(--gold);border-radius:12px;padding:18px;color:#fff}
#popup h3{margin:0 0 8px;color:var(--gold)}
#popup label{display:block;margin:10px 0 4px;color:var(--gold);font-size:11px;letter-spacing:.06em;text-transform:uppercase}
#popup select,#popup input[type=number]{width:100%;background:#0b0b0b;color:#fff;border:1px solid var(--gold);border-radius:8px;padding:8px}
#popup .row{display:flex;gap:8px;margin-top:16px}
#popup button{flex:1;background:#161616;color:#fff;border:1px solid var(--gold);border-radius:8px;padding:10px;cursor:pointer}
#popup button.primary{background:#241c0d;color:var(--gold)}
#popup .warn{font-size:12px;color:var(--muted);margin:10px 0 0}
.cut{margin-left:8px;border:1px solid var(--gold);background:transparent;color:var(--gold);border-radius:6px;cursor:pointer;font-size:11px}
</style>
</head>
<body>
<div id="win">
  <header id="brand">
    <img alt="everblooming sigil" src="${SIGIL}">
    <div>
      <h1>AZHub</h1>
      <div class="sub">SPACE / Blank Key · AIH-WP-1.0 · never AZInterface</div>
    </div>
  </header>
  <div id="body">
    <aside id="rail">
      <h2>App modules</h2>
      ${apps.map(chip).join("")}
      <h2>Lock modules</h2>
      ${locks.map(chip).join("")}
      <p class="cite">Drag onto the canvas. Drop opens custody-of-placement popup. Never auto-wire.</p>
    </aside>
    <section id="stage-wrap">
      <div id="canvas">
        <svg id="corridors" aria-hidden="true"></svg>
        <div id="zones">${zones}</div>
        <div id="placed"></div>
      </div>
    </section>
    <aside id="side">
      <div class="count">Views <strong id="views">${views}</strong> · Downloads <strong id="downloads">${downloads}</strong>
        <a href="/download?asset=azhub-0.1.0.tar.gz">tarball</a>
        <a href="/count">/count</a>
      </div>
      <div class="banner" id="limitation">${esc(LIMITATION)}</div>
      <h2>Blank Key</h2>
      <div id="blank" class="card cite">Geometry without intent. Co-presence is inert.</div>
      <h2>Declared tethers</h2>
      <div id="tetherPanel" class="cite">None. Corridors appear only when declared.</div>
      <h2>Receipts</h2>
      <div id="receipts"></div>
      <h2>FragGate</h2>
      <div class="card cite">
        AI path is FragGate only: <code>POST /v1/fraggate/call</code> slug=<b>azhub</b><br>
        Door paths proxy to aziel-runtime. Local ops are <code>/v1/{op}</code> only.<br>
        <a href="/openapi.json">OpenAPI</a> · <a href="/mcp">/mcp pointer</a> · <a href="/ai">AI</a> · <a href="/v1/skill">skill</a><br>
        Sibling (never collapse): <a href="https://github.com/AzielEliab/azinterface">AZInterface</a>
      </div>
    </aside>
  </div>
  <div id="status">
    <span>AZHub ${VERSION} · SPACE / Blank Key · declared wiring only · not Interface</span>
    <span>GitHub ★ ${stars} · forks ${forks} · watchers ${watchers}</span>
  </div>
</div>
<div id="popup" role="dialog" aria-modal="true" aria-labelledby="popupTitle">
  <form class="sheet" id="placeForm">
    <h3 id="popupTitle">Custody of placement</h3>
    <p class="cite" id="popupMod">Module</p>
    <label for="regionSel">Region</label>
    <select id="regionSel">${REGIONS.map((r) => `<option value="${esc(r.id)}">${esc(r.label)}</option>`).join("")}</select>
    <label for="zSel">Z-order</label>
    <input id="zSel" type="number" value="0" step="1">
    <label><input id="boundSel" type="checkbox"> Bound (declared placement — does <b>not</b> unlock)</label>
    <label for="tetherSel">Optional tether declare</label>
    <select id="tetherSel"><option value="">None — do not auto-wire</option></select>
    <p class="warn">Declared wiring only. Co-presence is inert. Hub does not unlock modules. This popup is custody-of-placement UI, not Snap.</p>
    <div class="row">
      <button type="button" id="popupCancel">Cancel</button>
      <button type="submit" class="primary" id="popupPlace">Place</button>
    </div>
  </form>
</div>
<script>
const SIGIL = ${JSON.stringify(SIGIL)};
let sessionId = "";
let pending = null;
const placedEls = {};

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
  return j;
}
function zoneEl(region) {
  return document.querySelector('.zone[data-region="'+region+'"]');
}
function zoneCenter(region) {
  const z = zoneEl(region);
  const c = document.getElementById("canvas").getBoundingClientRect();
  if (!z) return { x: c.width/2, y: c.height/2 };
  const r = z.getBoundingClientRect();
  return { x: r.left - c.left + r.width/2, y: r.top - c.top + r.height/2 };
}
function paintModule(mod) {
  let el = placedEls[mod.id];
  if (!el) {
    el = document.createElement("div");
    el.className = "module " + mod.kind;
    el.dataset.id = mod.id;
    el.draggable = true;
    el.innerHTML = '<span class="kind">'+mod.kind+'</span>'+mod.name;
    el.addEventListener("dragstart", (ev) => {
      ev.dataTransfer.setData("application/json", JSON.stringify({ id: mod.id, slug: mod.slug, kind: mod.kind, name: mod.name, move: true }));
    });
    document.getElementById("placed").appendChild(el);
    placedEls[mod.id] = el;
  }
  const pt = (mod.x != null && mod.y != null) ? { x: mod.x, y: mod.y } : zoneCenter(mod.region);
  el.style.left = (pt.x - 46) + "px";
  el.style.top = (pt.y - 18) + "px";
  el.style.zIndex = String(2 + (mod.z||0));
  el.dataset.region = mod.region;
}
function clearGone(modules) {
  const ids = new Set((modules||[]).map(m => m.id));
  for (const id of Object.keys(placedEls)) {
    if (!ids.has(id)) { placedEls[id].remove(); delete placedEls[id]; }
  }
}
function paintCorridors(tethers, modules) {
  const svg = document.getElementById("corridors");
  const byId = Object.fromEntries((modules||[]).map(m => [m.id, m]));
  svg.innerHTML = "";
  (tethers||[]).forEach(t => {
    const a = byId[t.from], b = byId[t.to];
    if (!a || !b) return;
    const pa = zoneCenter(a.region), pb = zoneCenter(b.region);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", pa.x); line.setAttribute("y1", pa.y);
    line.setAttribute("x2", pb.x); line.setAttribute("y2", pb.y);
    svg.appendChild(line);
  });
}
function paintTetherPanel(tethers) {
  const box = document.getElementById("tetherPanel");
  if (!tethers || !tethers.length) {
    box.innerHTML = "None. Corridors appear only when declared.";
    return;
  }
  box.innerHTML = tethers.map(t =>
    '<div class="receipt">'+t.from+' → '+t.to+' <button type="button" class="cut" data-cut="'+t.id+'">cut</button></div>'
  ).join("");
  box.querySelectorAll("[data-cut]").forEach(btn => {
    btn.onclick = async () => { await callOp("tether_cut", { id: btn.dataset.cut }); refresh(); };
  });
}
function paintBlank(j) {
  const bk = (j && j.blank_key) || {};
  document.getElementById("blank").innerHTML =
    "blank_key="+!!bk.blank_key
    +" · copresence_inert="+!!bk.copresence_inert
    +" · ranking="+!!bk.ranking
    +" · snap="+!!bk.snap_activation
    +" · unlocks=0";
}
async function refresh() {
  const regions = await callOp("region_list", {});
  const status = await callOp("blank_key_status", {});
  const tethers = status.tethers || regions.tethers || [];
  const modules = status.modules || regions.modules || [];
  clearGone(modules);
  modules.forEach(paintModule);
  paintCorridors(tethers, modules);
  paintTetherPanel(tethers);
  paintBlank(status);
  const sel = document.getElementById("tetherSel");
  const keep = sel.value;
  sel.innerHTML = '<option value="">None — do not auto-wire</option>'
    + modules.map(m => '<option value="'+m.id+'">'+m.name+' ('+m.id+')</option>').join("");
  sel.value = keep;
}
function openPopup(data, region, xy) {
  pending = Object.assign({ region: region || "center", x: xy && xy.x, y: xy && xy.y }, data);
  document.getElementById("popupMod").textContent = (data.name||data.slug) + " · " + (data.kind||"");
  document.getElementById("regionSel").value = pending.region;
  document.getElementById("zSel").value = "0";
  document.getElementById("boundSel").checked = false;
  document.getElementById("popup").classList.add("open");
}
function closePopup() {
  document.getElementById("popup").classList.remove("open");
  pending = null;
}
document.getElementById("popupCancel").onclick = closePopup;
document.getElementById("placeForm").onsubmit = async (ev) => {
  ev.preventDefault();
  if (!pending) return;
  const region = document.getElementById("regionSel").value;
  const z = Number(document.getElementById("zSel").value||0);
  const bound = document.getElementById("boundSel").checked;
  const tetherTo = document.getElementById("tetherSel").value;
  const placed = await callOp("place_module", {
    slug: pending.slug, kind: pending.kind, id: pending.id || undefined,
    region, z, bound, x: pending.x, y: pending.y
  });
  if (placed.ok && tetherTo && placed.module) {
    await callOp("tether_declare", { from: placed.module.id, to: tetherTo });
  }
  closePopup();
  refresh();
};
function bindDrag(el) {
  el.addEventListener("dragstart", (ev) => {
    ev.dataTransfer.setData("application/json", JSON.stringify({
      slug: el.dataset.slug, kind: el.dataset.kind, name: el.dataset.name
    }));
  });
}
document.querySelectorAll(".chip").forEach(bindDrag);
document.querySelectorAll(".zone").forEach(zone => {
  zone.addEventListener("dragover", (ev) => { ev.preventDefault(); zone.classList.add("over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("over"));
  zone.addEventListener("drop", (ev) => {
    ev.preventDefault();
    zone.classList.remove("over");
    let data = {};
    try { data = JSON.parse(ev.dataTransfer.getData("application/json")||"{}"); } catch(e) { data = {}; }
    const c = document.getElementById("canvas").getBoundingClientRect();
    openPopup(data, zone.dataset.region, { x: ev.clientX - c.left, y: ev.clientY - c.top });
  });
});
refresh();
</script>
</body>
</html>`;
}
