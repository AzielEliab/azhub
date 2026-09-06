"""Loopback Blank Key canvas. 127.0.0.1 only. No telemetry."""

from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from .door import classify_v1_path, door_target_url
from .engine import CATALOG, REGIONS, dispatch
from .meta import LIMITATION, SIGIL, __version__

PORT = 8880


def _chrome() -> str:
    """Serve a local twin of the Worker canvas (same drag-drop + popup)."""
    apps = [c for c in CATALOG if c["kind"] == "app"]
    locks = [c for c in CATALOG if c["kind"] == "lock"]
    chip = (
        lambda m: f'<button type="button" class="chip {m["kind"]}" draggable="true" '
        f'data-slug="{m["slug"]}" data-kind="{m["kind"]}" data-name="{m["name"]}">{m["name"]}</button>'
    )
    zones = "".join(
        f'<div class="zone" data-region="{r["id"]}" data-label="{r["label"]}">'
        f'<span class="zone-label">{r["label"]}</span></div>'
        for r in REGIONS
    )
    opts = "".join(f'<option value="{r["id"]}">{r["label"]}</option>' for r in REGIONS)
    return f"""<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AZHub — local Blank Key</title>
<style>
:root {{ color-scheme: dark; --bg:#000; --gold:#c9a227; --trim:#8a7219; --text:#fff; }}
* {{ box-sizing: border-box; }}
html,body {{ margin:0; height:100%; background:var(--bg); color:var(--text); font:13px/1.4 system-ui,sans-serif; }}
#win {{ display:flex; flex-direction:column; height:100%; border:2px solid var(--gold); }}
#brand {{ display:flex; align-items:center; gap:12px; padding:10px 14px; border-bottom:1px solid var(--gold); }}
#brand img {{ width:40px; height:40px; border:1px solid var(--gold); border-radius:50%; }}
#brand h1 {{ margin:0; color:var(--gold); font-weight:500; }}
#body {{ flex:1; display:grid; grid-template-columns:200px 1fr 280px; min-height:0; }}
#rail,#side {{ overflow:auto; padding:12px; background:#0a0a0a; }}
#rail {{ border-right:1px solid var(--gold); }}
#side {{ border-left:1px solid var(--gold); }}
#canvas {{ position:relative; height:100%; min-height:480px; background:#000; }}
#zones {{ position:absolute; inset:0; display:grid; grid-template-columns:1fr 1.2fr 1fr; grid-template-rows:1fr 1.4fr 1fr; gap:8px; padding:12px; }}
.zone {{ border:1px dashed var(--trim); border-radius:10px; position:relative; }}
.zone.over {{ border-style:solid; border-color:var(--gold); }}
.zone-label {{ position:absolute; top:6px; left:8px; color:var(--gold); font-size:11px; text-transform:uppercase; }}
.chip,.module {{ border:1px solid var(--trim); background:#111; color:#fff; border-radius:8px; padding:8px; cursor:grab; }}
.chip {{ display:block; width:100%; margin:0 0 6px; text-align:left; }}
.module {{ position:absolute; min-width:90px; text-align:center; z-index:2; }}
#corridors {{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }}
#corridors line {{ stroke:var(--gold); stroke-width:2; stroke-dasharray:6 4; }}
h2 {{ color:var(--gold); font-size:12px; text-transform:uppercase; }}
#popup {{ display:none; position:fixed; inset:0; background:#000000aa; align-items:center; justify-content:center; }}
#popup.open {{ display:flex; }}
#popup .sheet {{ width:min(420px,92vw); background:#000; border:2px solid var(--gold); padding:16px; border-radius:12px; }}
a {{ color:var(--gold); }}
</style>
<div id="win">
  <header id="brand"><img alt="sigil" src="{SIGIL}"><div><h1>AZHub</h1><div>local SPACE / Blank Key · never Interface</div></div></header>
  <div id="body">
    <aside id="rail"><h2>App modules</h2>{"".join(chip(m) for m in apps)}<h2>Lock modules</h2>{"".join(chip(m) for m in locks)}</aside>
    <section id="canvas"><svg id="corridors"></svg><div id="zones">{zones}</div><div id="placed"></div></section>
    <aside id="side"><p>AZHub {__version__} loopback. Drag a chip, drop, confirm popup.</p><div id="blank"></div><div id="receipts"></div></aside>
  </div>
</div>
<div id="popup"><form class="sheet" id="placeForm">
  <h3>Custody of placement</h3>
  <p id="popupMod"></p>
  <label>Region</label><select id="regionSel">{opts}</select>
  <label>Z-order</label><input id="zSel" type="number" value="0">
  <label><input id="boundSel" type="checkbox"> Bound (does not unlock)</label>
  <label>Optional tether</label><select id="tetherSel"><option value="">None — do not auto-wire</option></select>
  <p>Declared wiring only. Co-presence is inert.</p>
  <button type="button" id="popupCancel">Cancel</button>
  <button type="submit">Place</button>
</form></div>
<script>
let sessionId = "";
let pending = null;
const placedEls = {{}};
async function callOp(op, payload) {{
  const r = await fetch("/v1/"+op, {{ method:"POST", headers:{{"content-type":"application/json","user-agent":"Mozilla/5.0"}}, body: JSON.stringify(Object.assign({{session_id:sessionId}}, payload||{{}})) }});
  const j = await r.json();
  if (j.session_id) sessionId = j.session_id;
  return j;
}}
function zoneCenter(region) {{
  const z = document.querySelector('.zone[data-region="'+region+'"]');
  const c = document.getElementById("canvas").getBoundingClientRect();
  const r = z.getBoundingClientRect();
  return {{ x: r.left - c.left + r.width/2, y: r.top - c.top + r.height/2 }};
}}
function paintModule(mod) {{
  let el = placedEls[mod.id];
  if (!el) {{
    el = document.createElement("div");
    el.className = "module";
    el.textContent = mod.name;
    document.getElementById("placed").appendChild(el);
    placedEls[mod.id] = el;
  }}
  const pt = zoneCenter(mod.region);
  el.style.left = (pt.x-46)+"px";
  el.style.top = (pt.y-18)+"px";
}}
async function refresh() {{
  const s = await callOp("blank_key_status", {{}});
  (s.modules||[]).forEach(paintModule);
  document.getElementById("blank").textContent = "copresence_inert=" + !!(s.blank_key&&s.blank_key.copresence_inert);
  const sel = document.getElementById("tetherSel");
  sel.innerHTML = '<option value="">None — do not auto-wire</option>' + (s.modules||[]).map(m => '<option value="'+m.id+'">'+m.name+'</option>').join("");
}}
function openPopup(data, region) {{
  pending = Object.assign({{region:region||"center"}}, data);
  document.getElementById("popupMod").textContent = data.name || data.slug;
  document.getElementById("regionSel").value = pending.region;
  document.getElementById("popup").classList.add("open");
}}
document.getElementById("popupCancel").onclick = () => document.getElementById("popup").classList.remove("open");
document.getElementById("placeForm").onsubmit = async (ev) => {{
  ev.preventDefault();
  const placed = await callOp("place_module", {{ slug: pending.slug, kind: pending.kind, region: document.getElementById("regionSel").value, z: Number(document.getElementById("zSel").value||0), bound: document.getElementById("boundSel").checked }});
  const tetherTo = document.getElementById("tetherSel").value;
  if (placed.ok && tetherTo) await callOp("tether_declare", {{ from: placed.module.id, to: tetherTo }});
  document.getElementById("popup").classList.remove("open");
  refresh();
}};
document.querySelectorAll(".chip").forEach(el => el.addEventListener("dragstart", ev => ev.dataTransfer.setData("application/json", JSON.stringify({{slug:el.dataset.slug,kind:el.dataset.kind,name:el.dataset.name}}))));
document.querySelectorAll(".zone").forEach(zone => {{
  zone.addEventListener("dragover", ev => {{ ev.preventDefault(); zone.classList.add("over"); }});
  zone.addEventListener("dragleave", () => zone.classList.remove("over"));
  zone.addEventListener("drop", ev => {{
    ev.preventDefault(); zone.classList.remove("over");
    openPopup(JSON.parse(ev.dataTransfer.getData("application/json")||"{{}}"), zone.dataset.region);
  }});
}});
refresh();
</script>
"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args: object) -> None:
        return

    def _send(self, status: int, body: bytes, ctype: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Cache-Control", "private, no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path in ("/", "/index.html"):
            self._send(200, _chrome().encode("utf-8"), "text/html; charset=utf-8")
            return
        classified = classify_v1_path(path)
        if classified["kind"] == "door":
            self._proxy(classified)
            return
        if path == "/v1/health":
            self._send(200, json.dumps(dispatch("health", {})).encode(), "application/json")
            return
        if path == "/v1/skill":
            from .skill_text import SKILL_MD

            self._send(200, SKILL_MD.encode(), "text/markdown; charset=utf-8")
            return
        self._send(404, b'{"error":"not found"}', "application/json")

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        classified = classify_v1_path(path)
        if classified["kind"] == "door":
            self._proxy(classified)
            return
        if classified["kind"] == "local":
            n = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(n) if n else b"{}"
            try:
                body = json.loads(raw.decode() or "{}")
            except json.JSONDecodeError:
                body = {}
            out = dispatch(classified["op"], body, body.get("session_id"))
            self._send(200, json.dumps(out).encode(), "application/json")
            return
        self._send(404, b'{"error":"not found"}', "application/json")

    def _proxy(self, classified: dict[str, str]) -> None:
        dest = door_target_url(classified["path"])
        if not dest:
            self._send(404, b'{"error":"not a door path"}', "application/json")
            return
        n = int(self.headers.get("Content-Length") or 0)
        data = self.rfile.read(n) if n and self.command != "GET" else None
        req = Request(dest, data=data, method=self.command)
        req.add_header("User-Agent", self.headers.get("User-Agent") or "Mozilla/5.0")
        if data:
            req.add_header("Content-Type", "application/json")
        try:
            with urlopen(req, timeout=20) as res:
                body = res.read()
                self._send(res.status, body, res.headers.get("Content-Type") or "application/json")
        except (HTTPError, URLError) as exc:
            self._send(502, json.dumps({"error": "fraggate_proxy_failed", "detail": str(exc)[:240]}).encode(), "application/json")


def serve(port: int = PORT) -> int:
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"AZHub Blank Key on http://127.0.0.1:{port} (loopback only)")
    print(LIMITATION)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("stopped")
    return 0
