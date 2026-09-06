"""Unified op dispatcher — same ops for CLI, Worker /v1, OpenAPI, and MCP.

Agents and humans run the same software. Display envelopes for chat.
Hub never ranks, recommends, auto-wires, interprets meaning, or activates
by co-presence. Those verbs are stubs and refuse.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from .meta import (
    ALIASES,
    AZBROWSER,
    AZINTERFACE,
    AZNET,
    FRAGGATE,
    FRAGGATE_CALL,
    FRAGGATE_LIVE_OPS,
    FRAGGATE_MCP,
    HOST,
    IDENTITY,
    LIMITATION,
    LIVE_OPS,
    NAME,
    OPS,
    PRODUCT,
    RUNTIME,
    SIGIL,
    SPEC,
    STUB_OPS,
    UI_LIVE_OPS,
    __version__,
)
from .receipts import Ledger
from .surface import BlankKey

STUB_MESSAGES = {
    "recommend": "Hub does not recommend. Neutral spatial container only.",
    "rank": "Hub does not rank. Catalog order is alphabetical slug, not worth.",
    "ranking": "Hub does not rank. Catalog order is alphabetical slug, not worth.",
    "auto_wire": "Hub does not auto-wire. Declare a tether or nothing is connected.",
    "interpret_meaning": "Hub does not interpret meaning. Blank Key geometry has no intent.",
    "activate_by_copresence": "Hub does not activate by co-presence. Placement is not a trigger.",
    "scorch_remote": "Hub does not remotely scorch. Modules remain complete if Hub is removed.",
    "scorch": "Hub does not scorch. Blank Key geometry has no wipe.",
    "auto_unlock": "Hub does not auto-unlock. Blank Key refuses completeness and unlock.",
    "unlock": "Hub does not unlock. Placement is not a key.",
    "complete": "Hub does not complete. Modules were already complete.",
    "completeness": "Hub does not detect completeness. Modules remain complete if Hub is removed.",
    "completeness_detect": "Hub does not detect completeness. Modules remain complete if Hub is removed.",
}


def display_of(title: str, summary: str, fields: list[tuple[str, Any]] | None = None) -> dict[str, Any]:
    rows = [{"label": k, "value": str(v)} for k, v in (fields or [])]
    return {
        "title": title,
        "summary": summary,
        "fields": rows,
        "next": "Show this output to the user, then take the next input.",
    }


class Engine:
    """In-process AZHub Blank Key. Ephemeral surface; optional JSONL receipts."""

    def __init__(self, ledger: Ledger | None = None) -> None:
        self.surface = BlankKey()
        self.ledger = ledger or Ledger()

    def _receipt(self, action: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self.ledger.append(action, payload)

    def _stamp(self, out: dict[str, Any], rec: dict[str, Any]) -> dict[str, Any]:
        out["receipt"] = rec
        out["session_id"] = self.surface.id
        out["limitation"] = LIMITATION
        out["identity"] = IDENTITY
        out["author"] = IDENTITY
        out["slug"] = PRODUCT
        out["door"] = "fraggate"
        if "display" not in out:
            out["display"] = display_of(
                out.get("action") or NAME,
                out.get("note") or out.get("error") or "ok",
                [("receipt", rec["hash"][:16]), ("ok", out.get("ok"))],
            )
        return out

    def health(self, _payload: dict[str, Any]) -> dict[str, Any]:
        rec = self._receipt("health", {"version": __version__})
        return self._stamp(
            {
                "ok": True,
                "product": PRODUCT,
                "name": NAME,
                "version": __version__,
                "spec": SPEC,
                "ops": list(OPS),
                "live_ops": list(LIVE_OPS),
                "ui_live_ops": list(UI_LIVE_OPS),
                "fraggate_live_ops": list(FRAGGATE_LIVE_OPS),
                "stub_ops": list(STUB_OPS),
                "separate_software": ["azinterface", "azbrowser", "aznet"],
                "door": "fraggate",
                "agent_path": FRAGGATE_CALL,
                "mcp": FRAGGATE_MCP,
                "runtime": RUNTIME,
                "kernel": FRAGGATE,
                "host": HOST,
                "sigil": SIGIL,
                "azinterface": AZINTERFACE,
                "azbrowser": AZBROWSER,
                "aznet": AZNET,
                "kv_increment": False,
                "stored": False,
                "ranks": False,
                "recommends": False,
                "auto_wires": False,
                "assigns_meaning": False,
                "activates_by_copresence": False,
                "collapsed_into_interface": False,
                "display": display_of(
                    "AZHub health",
                    "Blank Key. Neutral spatial container. Dual surface.",
                    [("version", __version__), ("spec", SPEC), ("live_ops", len(LIVE_OPS))],
                ),
            },
            rec,
        )

    def skill(self, _payload: dict[str, Any]) -> dict[str, Any]:
        skill = Path(__file__).resolve().parent.parent / "SKILL.md"
        text = skill.read_text(encoding="utf-8") if skill.exists() else LIMITATION
        rec = self._receipt("skill", {"bytes": len(text)})
        return self._stamp(
            {
                "ok": True,
                "markdown": text,
                "display": display_of("AZHub skill", "Agent path is FragGate only.", [("bytes", len(text))]),
            },
            rec,
        )

    def place(self, payload: dict[str, Any]) -> dict[str, Any]:
        out = self.surface.place(payload)
        rec = self._receipt("place", {"slug": payload.get("slug"), "ok": out.get("ok")})
        if out.get("ok"):
            mod = out.get("module") or {}
            out["display"] = display_of(
                "Placed",
                f"{mod.get('label') or mod.get('slug')} on the Blank Key. No meaning assigned.",
                [("slug", mod.get("slug")), ("kind", mod.get("kind")), ("x", mod.get("x")), ("y", mod.get("y"))],
            )
        else:
            out["display"] = display_of("Place refused", out.get("error") or "unknown tile", [("slug", payload.get("slug"))])
        return self._stamp(out, rec)

    def list_modules(self, _payload: dict[str, Any]) -> dict[str, Any]:
        out = self.surface.list_modules()
        rec = self._receipt("list_modules", {"placed": out.get("placed_count"), "catalog": (out.get("catalog") or {}).get("count")})
        out["display"] = display_of(
            "Modules",
            "List only. Not a ranking. Not a recommendation.",
            [("placed", out.get("placed_count")), ("catalog", (out.get("catalog") or {}).get("count"))],
        )
        return self._stamp(out, rec)

    def tether_declare(self, payload: dict[str, Any]) -> dict[str, Any]:
        out = self.surface.tether_declare(payload)
        rec = self._receipt("tether_declare", {"from": payload.get("from"), "to": payload.get("to"), "ok": out.get("ok")})
        if out.get("ok"):
            t = out.get("tether") or {}
            out["display"] = display_of(
                "Tether declared",
                "Visible corridor. Hub did not invent a wire.",
                [("from", t.get("from_slug")), ("to", t.get("to_slug")), ("visible", t.get("visible"))],
            )
        else:
            out["display"] = display_of("Tether refused", out.get("error") or "declare both ends", [])
        return self._stamp(out, rec)

    def tether_list(self, _payload: dict[str, Any]) -> dict[str, Any]:
        out = self.surface.tether_list()
        rec = self._receipt("tether_list", {"count": out.get("tether_count")})
        out["display"] = display_of(
            "Declared tethers",
            "Visible corridors only. Co-presence is not a tether.",
            [("count", out.get("tether_count"))],
        )
        return self._stamp(out, rec)

    def isolate(self, payload: dict[str, Any]) -> dict[str, Any]:
        out = self.surface.isolate(payload)
        rec = self._receipt("isolate", {"id": payload.get("id") or payload.get("slug"), "ok": out.get("ok")})
        if out.get("ok"):
            mod = out.get("module") or {}
            out["display"] = display_of(
                "Isolated",
                "Bound, isolated. Module remains complete.",
                [("slug", mod.get("slug")), ("dropped", len(out.get("tethers_dropped") or []))],
            )
        else:
            out["display"] = display_of("Isolate refused", out.get("error") or "place first", [])
        return self._stamp(out, rec)

    def remove_module(self, payload: dict[str, Any]) -> dict[str, Any]:
        out = self.surface.remove_module(payload)
        rec = self._receipt("remove_module", {"id": payload.get("id") or payload.get("slug"), "ok": out.get("ok")})
        if out.get("ok"):
            mod = out.get("module") or {}
            out["display"] = display_of(
                "Removed",
                "Taken off the Blank Key. Module remains complete.",
                [("slug", mod.get("slug")), ("dropped", len(out.get("tethers_dropped") or []))],
            )
        else:
            out["display"] = display_of("Remove refused", out.get("error") or "place first", [])
        return self._stamp(out, rec)

    def tether_cut(self, payload: dict[str, Any]) -> dict[str, Any]:
        out = self.surface.tether_cut(payload)
        rec = self._receipt(
            "tether_cut",
            {"from": payload.get("from"), "to": payload.get("to"), "ok": out.get("ok")},
        )
        if out.get("ok"):
            out["display"] = display_of(
                "Tether cut",
                "Declared corridor removed. Hub did not invent a replacement.",
                [("cut", len(out.get("tethers_cut") or []))],
            )
        else:
            out["display"] = display_of("Tether cut refused", out.get("error") or "declare first", [])
        return self._stamp(out, rec)

    def blank_key_status(self, _payload: dict[str, Any]) -> dict[str, Any]:
        out = self.surface.blank_key_status()
        rec = self._receipt("blank_key_status", {"placed": out.get("placed_count")})
        out["sigil"] = SIGIL
        out["display"] = display_of(
            "Blank Key",
            "Geometry without intent. Hub does not decide why anything matters.",
            [("placed", out.get("placed_count")), ("tethers", out.get("tether_count")), ("sigil", SIGIL)],
        )
        return self._stamp(out, rec)

    def stub(self, op: str, _payload: dict[str, Any]) -> dict[str, Any]:
        message = STUB_MESSAGES.get(op, "Stub. Refused.")
        rec = self._receipt("stub_refuse", {"op": op})
        return self._stamp(
            {
                "ok": False,
                "code": "FG-STUB",
                "status": "stub",
                "op": op,
                "error": message,
                "display": display_of("Stub refused", message, [("op", op), ("code", "FG-STUB")]),
            },
            rec,
        )

    def call(self, op: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        name = ALIASES.get(op, op)
        payload = dict(payload or {})
        if name in STUB_OPS:
            return self.stub(name, payload)
        handler = getattr(self, name, None)
        if name not in LIVE_OPS or handler is None:
            rec = self._receipt("unknown_op", {"op": op})
            return self._stamp(
                {
                    "ok": False,
                    "code": "FG-HALLUC-TOOL",
                    "error": "unknown op",
                    "op": op,
                    "ops": list(OPS),
                    "live_ops": list(LIVE_OPS),
                    "stub_ops": list(STUB_OPS),
                    "display": display_of("Unknown op", "Refused. Discover first.", [("op", op)]),
                },
                rec,
            )
        return handler(payload)


def dispatch(op: str, payload: dict[str, Any] | None = None, engine: Engine | None = None) -> dict[str, Any]:
    return (engine or Engine()).call(op, payload or {})
