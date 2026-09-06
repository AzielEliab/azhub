from azhub.engine import Engine
from azhub.receipts import Ledger


def test_refuse_auto_tether():
    eng = Engine(Ledger())
    a = eng.place_module({"slug": "azmail", "region": "east"})
    b = eng.place_module({"slug": "foldlock", "region": "west"})
    out = eng.tether_declare({"from": a["module"]["id"], "to": b["module"]["id"], "auto_wire": True})
    assert out["ok"] is False
    assert out["code"] == "HUB-NO-AUTO"


def test_refuse_auto_place():
    eng = Engine(Ledger())
    out = eng.place_module({"slug": "azbot", "auto_wire": True})
    assert out["ok"] is False
    assert out["code"] == "HUB-NO-AUTO"


def test_tether_requires_both_placed():
    eng = Engine(Ledger())
    a = eng.place_module({"slug": "aznet", "region": "north"})
    out = eng.tether_declare({"from": a["module"]["id"], "to": "mod-missing"})
    assert out["ok"] is False
