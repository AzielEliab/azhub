"""Worker hosts the official rose-star brand mark at /sigil.png."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PNG = ROOT / "workers" / "download-tracker" / "public" / "sigil.png"
PNG_MAGIC = b"\x89PNG\r\n\x1a\n"


def test_official_rose_star_png_is_hosted():
    assert PNG.is_file()
    data = PNG.read_bytes()
    assert data[:8] == PNG_MAGIC
    assert 70_000 < len(data) < 80_000
    assert len(data) == 75035


def test_worker_serves_local_sigil_route():
    index = (ROOT / "workers" / "download-tracker" / "src" / "index.js").read_text(encoding="utf-8")
    wrangler = (ROOT / "workers" / "download-tracker" / "wrangler.toml").read_text(encoding="utf-8")
    engine = (ROOT / "workers" / "download-tracker" / "src" / "engine.js").read_text(encoding="utf-8")
    assert 'const BRAND_MARK_PATH = "/sigil.png"' in index
    assert "async function serveBrandMark" in index
    assert '"/sigil.png"' in wrangler
    assert 'export const SIGIL = "/sigil.png"' in engine
    assert "azielcorpuslibrary.net/sigil.png" not in engine


def test_public_help_scrubs_everblooming_mark_wording():
    ui = (ROOT / "workers" / "download-tracker" / "src" / "ui.js").read_text(encoding="utf-8")
    skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
    engine = (ROOT / "workers" / "download-tracker" / "src" / "engine.js").read_text(encoding="utf-8")
    runtime = (ROOT / "workers" / "download-tracker" / "src" / "runtime.js").read_text(encoding="utf-8")
    for text in (ui, skill, engine, runtime):
        assert "everblooming" not in text.lower()
    assert 'alt=""' in ui
    assert 'src="/sigil.png"' in ui
    assert "Home / sigil" in skill
    assert "Home / sigil" in engine


def test_non_ui_verify_strings_still_name_sigil():
    meta = (ROOT / "azhub" / "meta.py").read_text(encoding="utf-8")
    doctor = (ROOT / "azhub" / "doctor.py").read_text(encoding="utf-8")
    ops = (ROOT / "tests" / "test_engine_ops.py").read_text(encoding="utf-8")
    assert "everblooming-sigil" in meta
    assert 'SIGIL = "/sigil.png"' in meta
    assert '"sigil.png" in str(status.get("sigil"))' in doctor
    assert '"sigil.png" in str(out.get("sigil"))' in ops
