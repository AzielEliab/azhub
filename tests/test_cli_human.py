"""Human CLI contract: welcome, help, plain errors, --json."""

from __future__ import annotations

import json

from azhub.cli import main
from azhub.ui import chrome


def test_bare_command_welcomes(capsys):
    assert main([]) == 0
    out = capsys.readouterr().out
    assert "Place a module" in out
    assert "azhub ui" in out
    assert "arguments are required" not in out
    assert not out.lstrip().startswith("{")


def test_bare_json_is_machine_readable(capsys):
    assert main(["--json"]) == 0
    payload = json.loads(capsys.readouterr().out)
    assert payload["ok"] is True
    assert payload["ui"] == "http://127.0.0.1:8878/"
    assert "azhub ui" in payload["next"]


def test_help_is_short_and_exits_clean(capsys):
    assert main(["--help"]) == 0
    out = capsys.readouterr().out
    assert "azhub ui" in out
    assert "Examples:" in out
    assert "Advanced:" in out
    assert "changelog" not in out.lower()
    assert "arguments are required" not in out


def test_unknown_command_has_a_next_step(capsys):
    assert main(["bogus"]) == 2
    err = capsys.readouterr().err
    assert 'Unknown command "bogus".' in err
    assert "azhub --help" in err
    assert "Traceback" not in err


def test_place_without_a_name_explains(capsys):
    assert main(["place"]) == 2
    err = capsys.readouterr().err
    assert "module name" in err
    assert "azhub place azmail" in err
    assert "Traceback" not in err


def test_bad_payload_explains(capsys):
    assert main(["call", "place_module", "--payload", "{", "--ledger", "/tmp/azhub-cli-test.jsonl"]) == 2
    err = capsys.readouterr().err
    assert "Payload must be JSON." in err
    assert "azhub call place_module" in err


def test_human_place_and_json_roundtrip(tmp_path, capsys):
    ledger = str(tmp_path / "receipts.jsonl")
    assert main(["place", "azmail", "--x", "40", "--y", "40", "--ledger", ledger]) == 0
    human = capsys.readouterr().out
    assert human.lstrip().startswith("Placed")
    assert "azmail" in human
    assert not human.lstrip().startswith("{")

    assert main(["place", "peacelock", "--x", "80", "--y", "40", "--ledger", ledger, "--json"]) == 0
    payload = json.loads(capsys.readouterr().out)
    assert payload["ok"] is True
    assert payload["module"]["slug"] == "peacelock"
    assert payload["display"]["title"] == "Placed"


def test_refused_op_stays_json_and_human(tmp_path, capsys):
    ledger = str(tmp_path / "receipts.jsonl")
    assert main(["call", "recommend", "--ledger", ledger]) == 2
    human = capsys.readouterr().out
    assert "FG-STUB" in human
    assert "Next:" in human
    assert main(["call", "recommend", "--json", "--ledger", ledger]) == 2
    payload = json.loads(capsys.readouterr().out)
    assert payload["ok"] is False
    assert payload["code"] == "FG-STUB"


def test_doctor_human_and_json(capsys):
    assert main(["doctor"]) == 0
    human = capsys.readouterr().out
    assert "pass  health" in human
    assert "All checks passed." in human
    assert "THIS IS NOT" not in human

    assert main(["doctor", "--json"]) == 0
    payload = json.loads(capsys.readouterr().out)
    assert payload["ok"] is True
    assert any(row["name"] == "health" and row["ok"] for row in payload["checks"])


def test_local_chrome_is_calm_and_themeable():
    html = chrome()
    assert "Place a module" in html
    assert "<summary>Advanced</summary>" in html
    assert 'id="advanced"' in html
    assert "open" not in html.split('id="advanced"')[1][:40]
    assert ":focus-visible" in html
    assert "prefers-color-scheme" in html
    assert "THIS IS NOT" not in html
    assert "width=device-width" in html


def test_unknown_tile_is_plain(tmp_path, capsys):
    ledger = str(tmp_path / "receipts.jsonl")
    assert main(["place", "nope", "--ledger", ledger]) == 2
    human = capsys.readouterr().out
    assert "That name is not in the catalog." in human
    assert "Next: azhub list" in human
    assert main(["place", "nope", "--json", "--ledger", ledger]) == 2
    payload = json.loads(capsys.readouterr().out)
    assert payload["error"] == "unknown_tile"


def test_version_is_human(capsys):
    assert main(["version"]) == 0
    out = capsys.readouterr().out
    assert "AZHub 0.1.0" in out
    assert "Aziel Eliab" in out
    assert not out.lstrip().startswith("{")
