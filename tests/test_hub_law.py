"""Hub must not collapse into Interface or grow decision logic."""

from pathlib import Path

from azhub.engine import LIVE_OPS, STUB_OPS

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "workers/download-tracker/src/engine.js").read_text(encoding="utf-8")
UI = (ROOT / "workers/download-tracker/src/ui.js").read_text(encoding="utf-8")
README = (ROOT / "README.md").read_text(encoding="utf-8")


def test_live_ops_are_advisory_only():
    forbidden = {"rank", "intent", "completeness", "snap", "unlock", "auto_wire", "activate"}
    assert not (set(LIVE_OPS) & forbidden)
    assert "place_module" in LIVE_OPS
    assert "tether_declare" in LIVE_OPS
    assert "blank_key_status" in LIVE_OPS


def test_stubs_cover_decision_and_unlock():
    for op in ("snap_activate", "unlock", "rank", "intent", "completeness", "auto_wire", "collapse_interface"):
        assert op in STUB_OPS


def test_copy_refuses_collapse():
    for text in (ENGINE, UI, README):
        assert "never" in text.lower()
        assert "AZInterface" in text
        assert "co-presence is inert" in text.lower() or "Co-presence is inert" in text
