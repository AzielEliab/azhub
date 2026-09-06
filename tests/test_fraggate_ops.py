"""FragGate catalog names must dispatch locally. Agent docs must not lie."""

from pathlib import Path

from azhub.engine import Engine, dispatch
from azhub.meta import FRAGGATE_LIVE_OPS
from azhub.receipts import Ledger

ROOT = Path(__file__).resolve().parents[1]


def test_fraggate_catalog_names_are_live():
    eng = Engine(Ledger())
    health = eng.health({})
    assert set(FRAGGATE_LIVE_OPS) <= set(health["fraggate_live_ops"])
    placed = eng.call("place_module", {"slug": "azmail", "x": 40, "y": 40})
    assert placed["ok"] and placed["action"] == "place"
    other = eng.call("place_module", {"slug": "peacelock", "x": 200, "y": 80})
    assert other["ok"]
    listed = eng.call("region_list", {})
    assert listed["ok"] and listed["ranked"] is False
    tethered = eng.call("tether_declare", {"from": "azmail", "to": "peacelock"})
    assert tethered["ok"]
    cut = eng.call("tether_cut", {"from": "azmail", "to": "peacelock"})
    assert cut["ok"] and cut["action"] == "tether_cut"
    assert cut["tether_count"] == 0
    removed = eng.call("remove_module", {"slug": "azmail"})
    assert removed["ok"] and removed["action"] == "remove_module"
    slugs = [row["slug"] for row in removed["placed"]]
    assert "azmail" not in slugs
    assert removed["modules_remain_complete_if_hub_removed"] is True


def test_isolate_is_not_remove():
    eng = Engine(Ledger())
    eng.place({"slug": "azmail", "x": 10, "y": 10})
    iso = eng.isolate({"slug": "azmail"})
    assert iso["ok"]
    assert iso["module"]["isolated"] is True
    assert any(row["slug"] == "azmail" for row in iso["placed"])


def test_agent_docs_use_place_module_not_place():
    banned = '"op":"place"'
    required = '"op":"place_module"'
    for rel in ("README.md", "SKILL.md", "workers/download-tracker/src/engine.js", "workers/download-tracker/src/runtime.js"):
        text = (ROOT / rel).read_text(encoding="utf-8")
        assert banned not in text, rel
        assert required in text, rel
    paper = (ROOT / "docs" / "whitepaper.md").read_text(encoding="utf-8")
    assert "separate software" in (ROOT / "README.md").read_text(encoding="utf-8")
    assert "separate software" in paper
    assert "FragGate door" in paper


def test_fraggate_stub_names_refuse():
    out = dispatch("auto_unlock", {}, Engine(Ledger()))
    assert out["ok"] is False
    assert out["code"] == "FG-STUB"
