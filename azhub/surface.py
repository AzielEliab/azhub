"""Blank Key geometry. Place / tether / isolate. No intent.

Hub records where tiles sit and which corridors the human declared.
It does not infer meaning from co-presence. Tethers are never invented.
Modules remain complete if this surface is discarded.
"""

from __future__ import annotations

import uuid
from typing import Any

from .catalog import SEPARATE_PRODUCTS, catalog_payload, find_tile


def _id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:10]}"


def clamp_coord(value: Any, default: float = 80.0) -> float:
    try:
        n = float(value)
    except (TypeError, ValueError):
        n = default
    return max(8.0, min(n, 920.0))


class BlankKey:
    """Neutral spatial container. Geometry without intent."""

    def __init__(self) -> None:
        self.id = _id("sess")
        self.placed: dict[str, dict[str, Any]] = {}
        self.tethers: dict[str, dict[str, Any]] = {}

    def _tile_complete(self) -> dict[str, Any]:
        return {
            "modules_remain_complete_if_hub_removed": True,
            "hub_does_not_own_module_internals": True,
            "hub_assigns_no_meaning": True,
            "co_presence_does_not_activate": True,
        }

    def snapshot(self) -> dict[str, Any]:
        placed = sorted(self.placed.values(), key=lambda r: r["slug"])
        tethers = sorted(self.tethers.values(), key=lambda r: (r["from"], r["to"]))
        return {
            "session_id": self.id,
            "placed": placed,
            "tethers": tethers,
            "placed_count": len(placed),
            "tether_count": len(tethers),
            "ranked": False,
            "recommended": False,
            "auto_wired": False,
            "intent": None,
            "meaning": None,
            "blank_key": True,
            "separate_from": list(SEPARATE_PRODUCTS),
            **self._tile_complete(),
        }

    def place(self, payload: dict[str, Any]) -> dict[str, Any]:
        slug = str(payload.get("slug") or payload.get("module") or payload.get("id") or "").strip().lower()
        tile = find_tile(slug)
        if not tile:
            return {"ok": False, "error": "unknown_tile", "slug": slug}
        existing = None
        for row in self.placed.values():
            if row["slug"] == slug:
                existing = row
                break
        x = clamp_coord(payload.get("x"), 80)
        y = clamp_coord(payload.get("y"), 80)
        if existing:
            existing["x"] = x
            existing["y"] = y
            row = existing
            created = False
        else:
            row = {
                "id": _id("mod"),
                "slug": tile["slug"],
                "kind": tile["kind"],
                "label": tile["label"],
                "x": x,
                "y": y,
                "isolated": False,
                "bound": True,
            }
            self.placed[row["id"]] = row
            created = True
        return {
            "ok": True,
            "action": "place",
            "created": created,
            "module": dict(row),
            "collapsed_into_interface": False,
            "note": "Placed on Blank Key. Hub assigned no meaning.",
            **self.snapshot(),
        }

    def list_modules(self) -> dict[str, Any]:
        cat = catalog_payload()
        return {
            "ok": True,
            "action": "list_modules",
            "catalog": cat,
            "note": "List only. Not a ranking. Not a recommendation.",
            **self.snapshot(),
        }

    def _resolve(self, token: Any) -> dict[str, Any] | None:
        key = str(token or "").strip()
        if not key:
            return None
        if key in self.placed:
            return self.placed[key]
        low = key.lower()
        for row in self.placed.values():
            if row["slug"] == low or row["id"] == key:
                return row
        return None

    def tether_declare(self, payload: dict[str, Any]) -> dict[str, Any]:
        src = self._resolve(payload.get("from") or payload.get("source") or payload.get("a"))
        dst = self._resolve(payload.get("to") or payload.get("target") or payload.get("b"))
        if not src or not dst:
            return {"ok": False, "error": "both_ends_must_be_placed", "from": payload.get("from"), "to": payload.get("to")}
        if src["id"] == dst["id"]:
            return {"ok": False, "error": "tether_needs_two_tiles"}
        if src.get("isolated") or dst.get("isolated"):
            return {"ok": False, "error": "isolated_tile_refuses_tether", "from": src["slug"], "to": dst["slug"]}
        pair = tuple(sorted((src["id"], dst["id"])))
        for row in self.tethers.values():
            if tuple(sorted((row["from"], row["to"]))) == pair:
                return {
                    "ok": True,
                    "action": "tether_declare",
                    "created": False,
                    "tether": dict(row),
                    "note": "Declared corridor already visible. Hub did not invent a new wire.",
                    **self.snapshot(),
                }
        row = {
            "id": _id("tether"),
            "from": src["id"],
            "to": dst["id"],
            "from_slug": src["slug"],
            "to_slug": dst["slug"],
            "visible": True,
            "declared": True,
            "auto": False,
        }
        self.tethers[row["id"]] = row
        return {
            "ok": True,
            "action": "tether_declare",
            "created": True,
            "tether": dict(row),
            "note": "Declared corridor only. No helpful auto-wiring.",
            **self.snapshot(),
        }

    def tether_list(self) -> dict[str, Any]:
        return {
            "ok": True,
            "action": "tether_list",
            "note": "Visible declared corridors only. Co-presence is not a tether.",
            **self.snapshot(),
        }

    def isolate(self, payload: dict[str, Any]) -> dict[str, Any]:
        row = self._resolve(payload.get("id") or payload.get("slug") or payload.get("module"))
        if not row:
            return {"ok": False, "error": "tile_not_placed"}
        row["isolated"] = True
        dropped = []
        for tid, tether in list(self.tethers.items()):
            if tether["from"] == row["id"] or tether["to"] == row["id"]:
                dropped.append(self.tethers.pop(tid))
        return {
            "ok": True,
            "action": "isolate",
            "module": dict(row),
            "tethers_dropped": dropped,
            "note": "Isolated on the Blank Key. Module remains complete. Hub assigned no meaning.",
            **self.snapshot(),
        }

    def remove_module(self, payload: dict[str, Any]) -> dict[str, Any]:
        row = self._resolve(payload.get("id") or payload.get("slug") or payload.get("module"))
        if not row:
            return {"ok": False, "error": "tile_not_placed"}
        dropped = []
        for tid, tether in list(self.tethers.items()):
            if tether["from"] == row["id"] or tether["to"] == row["id"]:
                dropped.append(self.tethers.pop(tid))
        removed = self.placed.pop(row["id"])
        return {
            "ok": True,
            "action": "remove_module",
            "module": dict(removed),
            "tethers_dropped": dropped,
            "note": "Removed from the Blank Key. Module remains complete. Hub assigned no meaning.",
            **self.snapshot(),
        }

    def tether_cut(self, payload: dict[str, Any]) -> dict[str, Any]:
        tid = str(payload.get("id") or payload.get("tether") or "").strip()
        if tid and tid in self.tethers:
            cut = [self.tethers.pop(tid)]
            return {
                "ok": True,
                "action": "tether_cut",
                "tethers_cut": cut,
                "note": "Declared corridor cut. Hub did not invent a replacement.",
                **self.snapshot(),
            }
        src = self._resolve(payload.get("from") or payload.get("source") or payload.get("a"))
        dst = self._resolve(payload.get("to") or payload.get("target") or payload.get("b"))
        if src and dst:
            pair = tuple(sorted((src["id"], dst["id"])))
            cut = []
            for key, row in list(self.tethers.items()):
                if tuple(sorted((row["from"], row["to"]))) == pair:
                    cut.append(self.tethers.pop(key))
            if cut:
                return {
                    "ok": True,
                    "action": "tether_cut",
                    "tethers_cut": cut,
                    "note": "Declared corridor cut. Hub did not invent a replacement.",
                    **self.snapshot(),
                }
            return {"ok": False, "error": "tether_not_declared", "from": src["slug"], "to": dst["slug"], **self.snapshot()}
        row = self._resolve(payload.get("slug") or payload.get("module") or payload.get("id"))
        if row:
            cut = []
            for key, tether in list(self.tethers.items()):
                if tether["from"] == row["id"] or tether["to"] == row["id"]:
                    cut.append(self.tethers.pop(key))
            return {
                "ok": True,
                "action": "tether_cut",
                "tethers_cut": cut,
                "note": "Declared corridors cut for that tile. Hub did not invent a replacement.",
                **self.snapshot(),
            }
        return {"ok": False, "error": "tether_not_declared", **self.snapshot()}

    def blank_key_status(self) -> dict[str, Any]:
        return {
            "ok": True,
            "action": "blank_key_status",
            "spec": "AIH-WP-1.0",
            "geometry_without_intent": True,
            "sigil_home": True,
            "note": "Blank Key. Hub does not decide why anything matters.",
            **self.snapshot(),
        }
