from azhub.engine import Engine, LIVE_OPS, dispatch
from azhub.receipts import Ledger


def test_health_space():
    out = dispatch("health", {})
    assert out["ok"] is True
    assert out["hub_is"] == "SPACE"
    assert out["never_collapse_into"] == "AZInterface"
    assert out["identity"] == "Aziel Eliab"
    assert set(LIVE_OPS) <= set(out["ops"])


def test_place_and_copresence_inert():
    eng = Engine(Ledger())
    a = eng.place_module({"slug": "azmail", "region": "center"})
    b = eng.place_module({"slug": "peacelock", "region": "center"})
    assert a["ok"] and b["ok"]
    assert a["unlocked"] is False
    status = eng.blank_key_status({})
    assert status["blank_key"]["copresence_inert"] is True
    assert status["unlocks"] == []
    assert status["snap"] is False
    assert any(p["inert"] for p in status["copresence"])


def test_tether_declare_and_cut():
    eng = Engine(Ledger())
    a = eng.place_module({"slug": "azbrowser", "region": "north"})
    b = eng.place_module({"slug": "godlock", "region": "south"})
    t = eng.tether_declare({"from": a["module"]["id"], "to": b["module"]["id"]})
    assert t["ok"] is True
    assert t["tether"]["corridor"] == "visible"
    assert t["tether"]["scope"] == "session"
    assert t["tether"]["cuttable"] is True
    assert t["tether"]["auto"] is False
    listed = eng.tether_list({})
    assert listed["count"] == 1
    cut = eng.tether_cut({"id": t["tether"]["id"]})
    assert cut["ok"] is True
    assert eng.tether_list({})["count"] == 0


def test_remove_cuts_tethers():
    eng = Engine(Ledger())
    a = eng.place_module({"slug": "azai", "region": "dock"})
    b = eng.place_module({"slug": "vibelock", "region": "margin"})
    eng.tether_declare({"from": a["module"]["id"], "to": b["module"]["id"]})
    rm = eng.remove_module({"id": a["module"]["id"]})
    assert rm["ok"] is True
    assert len(rm["tethers_cut"]) == 1
    assert eng.tether_list({})["count"] == 0
