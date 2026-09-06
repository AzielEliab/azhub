from pathlib import Path

from azhub.ui import chrome

ROOT = Path(__file__).resolve().parents[1]


def worker_ui_source() -> str:
    return (ROOT / "workers" / "download-tracker" / "src" / "ui.js").read_text(encoding="utf-8")


def worker_runtime_source() -> str:
    return (ROOT / "workers" / "download-tracker" / "src" / "runtime.js").read_text(encoding="utf-8")


def test_local_chrome_has_wired_popup():
    html = chrome()
    assert "draggable" in html
    assert 'id="actPlace"' in html
    assert 'id="actTether"' in html
    assert 'id="actIsolate"' in html
    assert "blank_key_status" in html
    assert "everblooming" in html.lower() or "sigil" in html
    assert "#0b0b0b" in html
    assert "#c9a227" in html


def test_worker_ui_has_wired_popup():
    html = worker_ui_source()
    assert "draggable" in html
    assert 'id="actPlace"' in html
    assert 'id="actTether"' in html
    assert 'id="actIsolate"' in html
    assert "/v1/place" in html or 'callOp("place"' in html
    assert "azinterface" in html.lower()


def test_worker_html_title_includes_aziel_eliab():
    local = chrome()
    worker = worker_ui_source()
    ai = worker_runtime_source()
    assert "<title>AZHub — Blank Key · Aziel Eliab</title>" in local
    assert "<title>AZHub — Blank Key · Aziel Eliab</title>" in worker
    assert "<title>AZHub — AI / MCP · Aziel Eliab</title>" in ai
    for html in (local, worker, ai):
        assert "Aziel Eliab" in html
        assert "Aziel Elroi" not in html
