from pathlib import Path

RUNTIME = (Path(__file__).resolve().parents[1] / "workers/download-tracker/src/runtime.js").read_text(
    encoding="utf-8"
)


def test_robots_is_ai_allow_not_directory():
    assert "User-agent: GPTBot" in RUNTIME
    assert "Content-Signal: search=yes, ai-input=yes, ai-train=yes" in RUNTIME
    assert "This is an Allow list, not a directory dump." in RUNTIME
    assert "Index of /" not in RUNTIME
    assert "Disallow: /" not in RUNTIME
