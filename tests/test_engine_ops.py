from azhub.engine import Engine, dispatch
from azhub.receipts import Ledger


def test_unknown_op_refuses():
    out = dispatch("not_a_real_op", {}, Engine(Ledger()))
    assert out["ok"] is False
    assert out["code"] == "FG-HALLUC-TOOL"


def test_place_and_tether():
    eng = Engine(Ledger())
    a = eng.place({"slug": "azmail", "x": 40, "y": 40})
    b = eng.place({"slug": "peacelock", "x": 200, "y": 80})
    assert a["ok"] and b["ok"]
    assert a.get("receipt")
    t = eng.tether_declare({"from": "azmail", "to": "peacelock"})
    assert t["ok"]
    assert t["tether"]["visible"] is True
    assert t["tether"]["auto"] is False


def test_home_alias_and_display():
    eng = Engine(Ledger())
    out = eng.call("home", {})
    assert out["ok"]
    assert out["blank_key"] is True
    assert "sigil.png" in str(out.get("sigil"))
    assert out["display"]["title"]
    assert out["display"]["summary"]


def test_list_not_ranked():
    eng = Engine(Ledger())
    listed = eng.list_modules({})
    slugs = [t["slug"] for t in listed["catalog"]["tiles"]]
    assert slugs == sorted(slugs)
    assert listed["ranked"] is False
    assert listed["recommended"] is False
