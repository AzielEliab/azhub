from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_identity_is_aziel_eliab_only():
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
    paper = (ROOT / "docs" / "whitepaper.md").read_text(encoding="utf-8")
    for text in (readme, skill, paper):
        assert "Aziel Eliab" in text
        assert "never collapse" in text.lower() or "Never collapse" in text
        assert "azinterface" in text.lower()
        assert "azbrowser" in text.lower()
        assert "aznet" in text.lower()


def test_worker_name_and_account():
    toml = (ROOT / "workers" / "download-tracker" / "wrangler.toml").read_text(encoding="utf-8")
    assert 'name = "azhub-download-tracker"' in toml
    assert "ac575a9b822bea2bed97d0ab73aed238" in toml
    assert "00000000000000000000000000000000" in toml


def test_readme_cites_download_and_fraggate():
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    assert "azhub-download-tracker.vibelock.workers.dev/download" in readme
    assert "aziel-runtime.vibelock.workers.dev/v1/fraggate/call" in readme
    assert "slug=azhub" in readme or '"slug":"azhub"' in readme
