"""Local doctor: Blank Key, place/tether, stubs, co-presence inert."""

from __future__ import annotations

from .engine import LIVE_OPS, STUB_OPS, Engine, dispatch
from .meta import LIMITATION, SPEC, __version__
from .receipts import Ledger


def doctor() -> int:
    eng = Engine(Ledger())
    checks: list[tuple[str, bool]] = []

    h = eng.health({})
    checks.append(("health", bool(h.get("ok")) and h.get("version") == __version__))
    checks.append(("hub_is_space", h.get("hub_is") == "SPACE"))
    checks.append(("never_interface", h.get("never_collapse_into") == "AZInterface"))

    regions = eng.region_list({})
    checks.append(("region_list", bool(regions.get("ok")) and len(regions.get("regions") or []) >= 7))
    checks.append(("no_ranking", regions.get("ranking") is False))

    a = eng.place_module({"slug": "azmail", "kind": "app", "region": "center"})
    checks.append(("place_app", bool(a.get("ok")) and a.get("unlocked") is False))
    b = eng.place_module({"slug": "peacelock", "kind": "lock", "region": "center"})
    checks.append(("place_lock", bool(b.get("ok"))))

    status = eng.blank_key_status({})
    bk = status.get("blank_key") or {}
    checks.append(("blank_key", bool(bk.get("blank_key")) and bool(bk.get("copresence_inert"))))
    checks.append(("copresence_inert", bool(status.get("copresence")) and status.get("unlocks") == []))
    checks.append(("no_snap", status.get("snap") is False))

    auto = eng.place_module({"slug": "azbrowser", "auto_wire": True})
    checks.append(("refuse_auto_wire", auto.get("code") == "HUB-NO-AUTO"))

    t = eng.tether_declare({"from": a["module"]["id"], "to": b["module"]["id"]})
    checks.append(("tether_declare", bool(t.get("ok")) and t["tether"]["corridor"] == "visible"))
    checks.append(("tether_session", t["tether"]["scope"] == "session"))

    listed = eng.tether_list({})
    checks.append(("tether_list", listed.get("count") == 1))

    cut = eng.tether_cut({"id": t["tether"]["id"]})
    checks.append(("tether_cut", bool(cut.get("ok"))))

    stub = dispatch("snap_activate", {}, eng.session["id"])
    checks.append(("stub_snap", stub.get("code") == "HUB-STUB"))

    halluc = dispatch("not_real", {}, eng.session["id"])
    checks.append(("halluc", halluc.get("code") == "FG-HALLUC-TOOL"))

    checks.append(("ops_count", len(LIVE_OPS) == 9))
    checks.append(("stubs_present", "unlock" in STUB_OPS and "rank" in STUB_OPS))

    ok = all(p for _, p in checks)
    print(f"AZHub doctor {__version__} spec={SPEC}")
    for name, passed in checks:
        print(f"  {'ok' if passed else 'FAIL':<4} {name}")
    print(LIMITATION)
    print("Blank Key holds." if ok else "Doctor failed.")
    return 0 if ok else 1
