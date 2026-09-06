"""Local doctor: Blank Key invariants, stubs refuse, receipts chain."""

from __future__ import annotations

from .engine import Engine, LIVE_OPS, STUB_OPS
from .meta import FRAGGATE_LIVE_OPS, LIMITATION, SPEC, __version__
from .receipts import Ledger


def doctor() -> int:
    eng = Engine(Ledger())
    checks = []

    h = eng.health({})
    checks.append(("health", bool(h.get("ok")) and h.get("version") == __version__))
    checks.append(("not_interface", h.get("collapsed_into_interface") is False))
    checks.append(("no_rank", h.get("ranks") is False and h.get("recommends") is False))

    placed = eng.place({"slug": "azmail", "x": 40, "y": 40})
    checks.append(("place_azmail", bool(placed.get("ok")) and placed.get("receipt")))

    iface = eng.place({"slug": "azinterface", "x": 200, "y": 80})
    checks.append(("place_interface_as_tile", bool(iface.get("ok"))))
    checks.append(("interface_not_collapsed", iface.get("collapsed_into_interface") is False))

    brow = eng.place({"slug": "azbrowser", "x": 360, "y": 80})
    net = eng.place({"slug": "aznet", "x": 520, "y": 80})
    checks.append(("siblings_placeable", bool(brow.get("ok") and net.get("ok"))))

    listed = eng.list_modules({})
    checks.append(("list_not_ranked", listed.get("ranked") is False and listed.get("recommended") is False))
    cat = (listed.get("catalog") or {}).get("tiles") or []
    slugs = [t["slug"] for t in cat]
    checks.append(("catalog_alpha", slugs == sorted(slugs)))

    tether = eng.tether_declare({"from": "azmail", "to": "azbrowser"})
    checks.append(("tether_declare", bool(tether.get("ok")) and (tether.get("tether") or {}).get("visible") is True))
    checks.append(("tether_not_auto", (tether.get("tether") or {}).get("auto") is False))

    tlist = eng.tether_list({})
    checks.append(("tether_list", tlist.get("tether_count") == 1))

    iso = eng.isolate({"slug": "azmail"})
    checks.append(("isolate", bool(iso.get("ok")) and (iso.get("module") or {}).get("isolated") is True))
    checks.append(("isolate_drops_tether", len(iso.get("tethers_dropped") or []) == 1))
    checks.append(("module_still_complete", iso.get("modules_remain_complete_if_hub_removed") is True))

    placed_fg = eng.call("place_module", {"slug": "peacelock", "x": 80, "y": 80})
    checks.append(("place_module_alias", bool(placed_fg.get("ok"))))
    listed_fg = eng.call("region_list", {})
    checks.append(("region_list_alias", bool(listed_fg.get("ok")) and listed_fg.get("ranked") is False))
    cut = eng.call("tether_cut", {"from": "azbrowser", "to": "aznet"})
    # siblings were placed earlier; no tether yet — refuse is still a real handler
    checks.append(("tether_cut_handler", cut.get("action") == "tether_cut" or cut.get("error") == "tether_not_declared"))
    removed = eng.call("remove_module", {"slug": "peacelock"})
    checks.append(("remove_module", bool(removed.get("ok")) and removed.get("action") == "remove_module"))
    checks.append(("fraggate_live_ops", set(FRAGGATE_LIVE_OPS) <= set(h.get("fraggate_live_ops") or LIVE_OPS)))

    status = eng.blank_key_status({})
    checks.append(("blank_key", status.get("blank_key") is True and status.get("intent") is None))
    checks.append(("home_sigil", "sigil.png" in str(status.get("sigil"))))

    for op in STUB_OPS:
        refused = eng.call(op, {})
        checks.append((f"stub_{op}", refused.get("code") == "FG-STUB" and refused.get("ok") is False))

    unknown = eng.call("not_a_real_op", {})
    checks.append(("halluc_tool", unknown.get("code") == "FG-HALLUC-TOOL"))

    v = eng.ledger.verify()
    checks.append(("receipt_verify", bool(v.get("ok"))))
    checks.append(("live_ops", set(LIVE_OPS) <= set(h.get("live_ops") or [])))

    ok = all(p for _, p in checks)
    print(f"AZHub doctor {__version__} spec={SPEC}")
    for name, passed in checks:
        print(f"  {'ok' if passed else 'FAIL':<4} {name}")
    print(LIMITATION)
    print("Blank Key. No receipt = no action." if ok else "Doctor failed.")
    return 0 if ok else 1
