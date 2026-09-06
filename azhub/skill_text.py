"""Skill markdown — keep in sync with SKILL.md / Worker GET /v1/skill."""

from pathlib import Path

_FALLBACK = """---
name: AZHub
description: >-
  Use when placing or tethering modules in AZHub / Blank Key (AIH-WP-1.0).
  Neutral spatial container. Never collapse into AZInterface. Author Aziel Eliab.
---

# AZHub

SPACE / Blank Key. See SKILL.md at the repository root.
Author: Aziel Eliab only.
"""


def _load() -> str:
    here = Path(__file__).resolve()
    for candidate in (here.parents[1] / "SKILL.md", here.parent / "SKILL.md"):
        if candidate.is_file():
            return candidate.read_text(encoding="utf-8")
    return _FALLBACK


SKILL_MD = _load()
