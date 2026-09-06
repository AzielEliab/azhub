"""AZHub engine — SPACE / Blank Key (AIH-WP-1.0).

Neutral spatial container. Place / tether / bound modules.
No ranking, no intent, no completeness detector, no Snap activation.
Co-presence is inert. Declared wiring only — never auto-wire.
Hub does not unlock modules.

Author: Aziel Eliab only.
"""

from __future__ import annotations

import uuid
from typing import Any

from .meta import (
    AZINTERFACE,
    FRAGGATE,
    FRAGGATE_CALL,
    FRAGGATE_MCP,
    HOST,
    IDENTITY,
    LIMITATION,
    PRODUCT,
    RUNTIME,
    SIGIL,
    SPEC,
    __version__,
)
from .receipts import Ledger

LIVE_OPS = (
    "health",
    "skill",
    "region_list",
    "place_module",
    "remove_module",
    "tether_declare",
    "tether_cut",
    "tether_list",
    "blank_key_status",
)

# Aliases stay live and map to listed ops.
ALIASES = {
    "regions": "region_list",
    "place": "place_module",
    "remove": "remove_module",
    "tether": "tether_declare",
    "cut": "tether_cut",
    "tethers": "tether_list",
    "blank_key": "blank_key_status",
    "status": "blank_key_status",
}

# Anything that centralizes decision logic or auto-unlocks stays stub.
STUB_OPS = (
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
)

OPS = LIVE_OPS

REGIONS = (
    {"id": "center", "label": "Center", "kind": "geometry"},
    {"id": "north", "label": "North", "kind": "geometry"},
    {"id": "south", "label": "South", "kind": "geometry"},
    {"id": "east", "label": "East", "kind": "geometry"},
    {"id": "west", "label": "West", "kind": "geometry"},
    {"id": "dock", "label": "Dock", "kind": "geometry"},
    {"id": "margin", "label": "Margin", "kind": "geometry"},
)

CATALOG = (
    {"slug": "azmail", "kind": "app", "name": "AZMail"},
    {"slug": "azbrowser", "kind": "app", "name": "AZBrowser"},
    {"slug": "azos", "kind": "app", "name": "AZ-OS"},
    {"slug": "azai", "kind": "app", "name": "AZAI"},
    {"slug": "azbot", "kind": "app", "name": "AZBot"},
    {"slug": "aznet", "kind": "app", "name": "AZNet"},
    {"slug": "postking", "kind": "app", "name": "Post-King Chess"},
    {"slug": "peacelock", "kind": "lock", "name": "PeaceLock"},
    {"slug": "vibelock", "kind": "lock", "name": "VibeLock"},
    {"slug": "godlock", "kind": "lock", "name": "GodLock"},
    {"slug": "foldlock", "kind": "lock", "name": "FoldLock"},
    {"slug": "whistlelock", "kind": "lock", "name": "WhistleLock"},
    {"slug": "decisiongate", "kind": "lock", "name": "DecisionGATE"},
    {"slug": "shadowlock", "kind": "lock", "name": "ShadowLock"},
    {"slug": "temporallock", "kind": "lock", "name": "TemporalLock"},
)

REGION_IDS = {r["id"] for r in REGIONS}
CATALOG_BY_SLUG = {c["slug"]: c for c in CATALOG}

SESSIONS: dict[str, dict[str, Any]] = {}


def display_of(title: str, summary: str, fields: list[tuple[str, Any]] | None = None) -> dict[str, Any]:
    return {
        "title": title,
        "summary": summary,
        "fields": [{"label": label, "value": str(value)} for label, value in (fields or [])],
        "next": "Show this output to the user, then take the next input.",
    }


def blank_key() -> dict[str, Any]:
    return {
        "blank_key": True,
        "geometry_without_intent": True,
        "copresence_inert": True,
        "ranking": False,
        "intent": False,
        "completeness_detector": False,
        "snap_activation": False,
        "auto_wire": False,
        "unlock_by_copresence": False,
        "interface_collapse": False,
        "hub_is": "SPACE",
        "never": "AZInterface",
        "spec": SPEC,
    }


def new_session() -> dict[str, Any]:
    sid = "sess-" + uuid.uuid4().hex[:12]
    session = {
        "id": sid,
        "modules": {},
        "tethers": {},
        "ledger": Ledger(),
        "scope": "session",
    }
    SESSIONS[sid] = session
    if len(SESSIONS) > 32:
        first = next(iter(SESSIONS))
        if first != sid:
            del SESSIONS[first]
    return session


def get_session(session_id: str | None) -> dict[str, Any]:
    if session_id and session_id in SESSIONS:
        return SESSIONS[session_id]
    return new_session()


def _catalog_kind(slug: str, kind: str | None) -> str | None:
    item = CATALOG_BY_SLUG.get(slug)
    if item:
        return item["kind"]
    if kind in ("app", "lock"):
        return kind
    return None


def _name_of(slug: str) -> str:
    item = CATALOG_BY_SLUG.get(slug)
    return item["name"] if item else slug


def occupancy(session: dict[str, Any]) -> dict[str, list[str]]:
    occ: dict[str, list[str]] = {r["id"]: [] for r in REGIONS}
    for mod in session["modules"].values():
        region = mod.get("region") or "center"
        occ.setdefault(region, []).append(mod["id"])
    return occ


def copresence_pairs(session: dict[str, Any]) -> list[dict[str, Any]]:
    """Inert pairs — listed so callers can see they do nothing."""
    pairs = []
    occ = occupancy(session)
    for region, ids in occ.items():
        if len(ids) < 2:
            continue
        for i, a in enumerate(ids):
            for b in ids[i + 1 :]:
                pairs.append(
                    {
                        "region": region,
                        "a": a,
                        "b": b,
                        "inert": True,
                        "unlocks": False,
                        "auto_wire": False,
                        "note": "Co-presence is inert. Blank Key does not unlock or wire.",
                    }
                )
    return pairs


class Engine:
    def __init__(self, ledger: Ledger | None = None, session_id: str | None = None) -> None:
        self.session = get_session(session_id)
        if ledger is not None:
            self.session["ledger"] = ledger

    def _receipt(self, action: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self.session["ledger"].append(action, payload)

    def health(self, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        return {
            "ok": True,
            "product": PRODUCT,
            "name": "AZHub",
            "version": __version__,
            "spec": SPEC,
            "identity": IDENTITY,
            "author": IDENTITY,
            "ops": list(LIVE_OPS),
            "stub_ops": list(STUB_OPS),
            "door": "fraggate",
            "slug": "azhub",
            "agent_path": FRAGGATE_CALL,
            "mcp": FRAGGATE_MCP,
            "runtime": RUNTIME,
            "kernel": FRAGGATE,
            "host": HOST,
            "sigil": SIGIL,
            "azinterface": AZINTERFACE,
            "kv_increment": False,
            "stored": False,
            "blank_key": blank_key(),
            "hub_is": "SPACE",
            "never_collapse_into": "AZInterface",
            "session_id": self.session["id"],
            "limitation": LIMITATION,
            "display": display_of(
                "AZHub health",
                "SPACE / Blank Key. Dual surface. Parent wires FragGate later.",
                [("version", __version__), ("ops", len(LIVE_OPS)), ("hub", "SPACE")],
            ),
        }

    def skill(self, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        from .skill_text import SKILL_MD

        return {
            "ok": True,
            "product": PRODUCT,
            "skill": SKILL_MD,
            "session_id": self.session["id"],
            "display": display_of("AZHub skill", "Blank Key skill markdown.", [("slug", "azhub")]),
            "limitation": LIMITATION,
        }

    def region_list(self, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        occ = occupancy(self.session)
        regions = [{**r, "occupancy": list(occ.get(r["id"], [])), "ranked": False} for r in REGIONS]
        return {
            "ok": True,
            "action": "region_list",
            "regions": regions,
            "catalog": [dict(c) for c in CATALOG],
            "modules": list(self.session["modules"].values()),
            "occupancy": occ,
            "copresence": copresence_pairs(self.session),
            "ranking": False,
            "session_id": self.session["id"],
            "limitation": LIMITATION,
            "display": display_of(
                "Hub regions",
                "Geometry only. Occupancy is inert.",
                [("regions", len(regions)), ("modules", len(self.session["modules"]))],
            ),
        }

    def place_module(self, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        p = dict(payload or {})
        if p.get("auto_wire") or p.get("unlock") or p.get("snap"):
            rec = self._receipt(
                "place_refuse_auto",
                {"reason": "declared wiring only; never auto-wire / unlock / snap"},
            )
            return {
                "ok": False,
                "code": "HUB-NO-AUTO",
                "error": "Hub never auto-wires, unlocks, or Snap-activates. Use place + optional tether_declare.",
                "receipt": rec,
                "session_id": self.session["id"],
                "limitation": LIMITATION,
                "display": display_of("Placement refused", "Declared wiring only.", [("code", "HUB-NO-AUTO")]),
            }
        slug = str(p.get("slug") or p.get("module") or "").strip().lower()
        if not slug:
            return {"ok": False, "error": "slug required", "limitation": LIMITATION, "session_id": self.session["id"]}
        kind = _catalog_kind(slug, str(p.get("kind") or "").strip().lower() or None)
        if kind not in ("app", "lock"):
            return {
                "ok": False,
                "error": "kind must be app or lock (or a catalog slug)",
                "limitation": LIMITATION,
                "session_id": self.session["id"],
            }
        region = str(p.get("region") or "center").strip().lower()
        if region not in REGION_IDS:
            return {"ok": False, "error": "unknown region", "regions": [r["id"] for r in REGIONS], "session_id": self.session["id"]}
        try:
            z = int(p.get("z") if p.get("z") is not None else 0)
        except (TypeError, ValueError):
            z = 0
        try:
            x = float(p["x"]) if p.get("x") is not None else None
            y = float(p["y"]) if p.get("y") is not None else None
        except (TypeError, ValueError):
            x = y = None
        bound = bool(p.get("bound"))
        mid = str(p.get("id") or "").strip() or ("mod-" + uuid.uuid4().hex[:10])
        existing = self.session["modules"].get(mid)
        module = {
            "id": mid,
            "slug": slug,
            "name": _name_of(slug),
            "kind": kind,
            "region": region,
            "z": z,
            "x": x,
            "y": y,
            "bound": bound,
            "unlocked": False,
            "auto_wired": False,
            "note": "Custody of placement only. Bound is a declared placement, not an unlock.",
        }
        self.session["modules"][mid] = module
        rec = self._receipt(
            "place_module",
            {"id": mid, "slug": slug, "kind": kind, "region": region, "z": z, "bound": bound, "moved": bool(existing)},
        )
        return {
            "ok": True,
            "action": "place_module",
            "module": module,
            "modules": list(self.session["modules"].values()),
            "copresence": copresence_pairs(self.session),
            "unlocked": False,
            "auto_wired": False,
            "receipt": rec,
            "session_id": self.session["id"],
            "limitation": LIMITATION,
            "blank_key": blank_key(),
            "display": display_of(
                "Module placed",
                "Custody of placement. Co-presence is inert.",
                [("id", mid), ("region", region), ("bound", bound), ("receipt", rec["hash"][:16])],
            ),
        }

    def remove_module(self, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        p = dict(payload or {})
        mid = str(p.get("id") or p.get("module_id") or "").strip()
        if not mid or mid not in self.session["modules"]:
            return {"ok": False, "error": "unknown module", "session_id": self.session["id"]}
        removed = self.session["modules"].pop(mid)
        cut = []
        for tid, t in list(self.session["tethers"].items()):
            if t["from"] == mid or t["to"] == mid:
                cut.append(self.session["tethers"].pop(tid))
        rec = self._receipt("remove_module", {"id": mid, "tethers_cut": [t["id"] for t in cut]})
        return {
            "ok": True,
            "action": "remove_module",
            "removed": removed,
            "tethers_cut": cut,
            "modules": list(self.session["modules"].values()),
            "receipt": rec,
            "session_id": self.session["id"],
            "limitation": LIMITATION,
            "display": display_of("Module removed", "Placement withdrawn. Attached tethers cut.", [("id", mid)]),
        }

    def tether_declare(self, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        p = dict(payload or {})
        if p.get("auto") or p.get("auto_wire"):
            rec = self._receipt("tether_refuse_auto", {"reason": "declared wiring only"})
            return {
                "ok": False,
                "code": "HUB-NO-AUTO",
                "error": "Tethers must be declared. Hub never auto-wires.",
                "receipt": rec,
                "session_id": self.session["id"],
                "display": display_of("Tether refused", "Declared wiring only.", [("code", "HUB-NO-AUTO")]),
            }
        src = str(p.get("from") or p.get("src") or "").strip()
        dst = str(p.get("to") or p.get("dst") or "").strip()
        if not src or not dst:
            return {"ok": False, "error": "from and to required", "session_id": self.session["id"]}
        if src == dst:
            return {"ok": False, "error": "tether cannot be reflexive", "session_id": self.session["id"]}
        if src not in self.session["modules"] or dst not in self.session["modules"]:
            return {"ok": False, "error": "both ends must be placed first", "session_id": self.session["id"]}
        for t in self.session["tethers"].values():
            if {t["from"], t["to"]} == {src, dst}:
                return {
                    "ok": False,
                    "error": "tether already declared",
                    "tether": t,
                    "session_id": self.session["id"],
                }
        tid = str(p.get("id") or "").strip() or ("tether-" + uuid.uuid4().hex[:10])
        scope = str(p.get("scope") or "session").strip() or "session"
        tether = {
            "id": tid,
            "from": src,
            "to": dst,
            "corridor": "visible",
            "scope": scope,
            "cuttable": True if p.get("cuttable") is None else bool(p.get("cuttable")),
            "declared": True,
            "auto": False,
            "format": "AIH-WP-1.0",
            "note": "Visible corridor. Session-scoped by default. Cuttable. Never an unlock.",
        }
        self.session["tethers"][tid] = tether
        rec = self._receipt("tether_declare", {"id": tid, "from": src, "to": dst, "scope": scope})
        return {
            "ok": True,
            "action": "tether_declare",
            "tether": tether,
            "tethers": list(self.session["tethers"].values()),
            "receipt": rec,
            "session_id": self.session["id"],
            "limitation": LIMITATION,
            "display": display_of(
                "Tether declared",
                "Visible corridor. Cuttable. Session-scoped by default.",
                [("id", tid), ("from", src), ("to", dst), ("receipt", rec["hash"][:16])],
            ),
        }

    def tether_cut(self, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        p = dict(payload or {})
        tid = str(p.get("id") or p.get("tether_id") or "").strip()
        if not tid or tid not in self.session["tethers"]:
            return {"ok": False, "error": "unknown tether", "session_id": self.session["id"]}
        t = self.session["tethers"][tid]
        if not t.get("cuttable", True):
            return {"ok": False, "error": "tether is not cuttable", "tether": t, "session_id": self.session["id"]}
        cut = self.session["tethers"].pop(tid)
        rec = self._receipt("tether_cut", {"id": tid})
        return {
            "ok": True,
            "action": "tether_cut",
            "cut": cut,
            "tethers": list(self.session["tethers"].values()),
            "receipt": rec,
            "session_id": self.session["id"],
            "limitation": LIMITATION,
            "display": display_of("Tether cut", "Corridor withdrawn.", [("id", tid)]),
        }

    def tether_list(self, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        rows = list(self.session["tethers"].values())
        return {
            "ok": True,
            "action": "tether_list",
            "tethers": rows,
            "count": len(rows),
            "scope_default": "session",
            "session_id": self.session["id"],
            "limitation": LIMITATION,
            "display": display_of("Tethers", f"{len(rows)} declared corridor(s).", [("count", len(rows))]),
        }

    def blank_key_status(self, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        pairs = copresence_pairs(self.session)
        status = blank_key()
        return {
            "ok": True,
            "action": "blank_key_status",
            "blank_key": status,
            "modules": list(self.session["modules"].values()),
            "tethers": list(self.session["tethers"].values()),
            "copresence": pairs,
            "unlocks": [],
            "snap": False,
            "ranking": False,
            "session_id": self.session["id"],
            "limitation": LIMITATION,
            "display": display_of(
                "Blank Key",
                "Geometry without intent. Co-presence is inert.",
                [
                    ("modules", len(self.session["modules"])),
                    ("tethers", len(self.session["tethers"])),
                    ("copresence_pairs", len(pairs)),
                    ("unlocks", 0),
                ],
            ),
        }

    def stub(self, op: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        rec = self._receipt("stub_refuse", {"op": op})
        return {
            "ok": False,
            "code": "HUB-STUB",
            "error": "stub — Hub does not centralize decision logic or auto-unlock",
            "op": op,
            "stub": True,
            "receipt": rec,
            "session_id": self.session["id"],
            "limitation": LIMITATION,
            "display": display_of("Stub refused", "No Snap, rank, intent, completeness, or auto-unlock.", [("op", op)]),
        }


def dispatch(op: str, payload: dict[str, Any] | None = None, session_id: str | None = None) -> dict[str, Any]:
    payload = dict(payload or {})
    name = ALIASES.get(op, op)
    eng = Engine(session_id=session_id or payload.get("session_id"))
    if name in STUB_OPS or op in STUB_OPS:
        return eng.stub(op)
    if name not in LIVE_OPS:
        return {
            "ok": False,
            "code": "FG-HALLUC-TOOL",
            "error": "unknown op",
            "op": op,
            "ops": list(LIVE_OPS),
            "stub_ops": list(STUB_OPS),
            "door": "fraggate",
            "slug": "azhub",
            "session_id": eng.session["id"],
            "display": display_of("Unknown op", "Refused. Discover first.", [("op", op)]),
            "limitation": LIMITATION,
        }
    fn = getattr(eng, name)
    return fn(payload)
