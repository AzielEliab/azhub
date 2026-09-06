from azhub.engine import Engine
from azhub.receipts import Ledger


def test_interface_is_a_tile_not_a_collapse():
    eng = Engine(Ledger())
    out = eng.place({"slug": "azinterface", "x": 100, "y": 100})
    assert out["ok"]
    assert out["collapsed_into_interface"] is False
    assert out["modules_remain_complete_if_hub_removed"] is True


def test_siblings_placeable():
    eng = Engine(Ledger())
    for slug in ("azbrowser", "aznet", "azmail"):
        assert eng.place({"slug": slug, "x": 20, "y": 20})["ok"]


def test_isolate_drops_tether_keeps_module():
    eng = Engine(Ledger())
    eng.place({"slug": "azmail", "x": 10, "y": 10})
    eng.place({"slug": "godlock", "x": 80, "y": 80})
    eng.tether_declare({"from": "azmail", "to": "godlock"})
    iso = eng.isolate({"slug": "azmail"})
    assert iso["ok"]
    assert iso["module"]["isolated"] is True
    assert len(iso["tethers_dropped"]) == 1
    assert iso["tether_count"] == 0
    assert iso["modules_remain_complete_if_hub_removed"] is True


def test_isolated_refuses_new_tether():
    eng = Engine(Ledger())
    eng.place({"slug": "azmail", "x": 10, "y": 10})
    eng.place({"slug": "azbrowser", "x": 80, "y": 80})
    eng.isolate({"slug": "azmail"})
    out = eng.tether_declare({"from": "azmail", "to": "azbrowser"})
    assert out["ok"] is False
    assert out["error"] == "isolated_tile_refuses_tether"


def test_blank_key_has_no_intent():
    eng = Engine(Ledger())
    st = eng.blank_key_status({})
    assert st["intent"] is None
    assert st["meaning"] is None
    assert st["auto_wired"] is False
    assert st["geometry_without_intent"] is True
