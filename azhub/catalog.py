"""Placeable tiles. Alphabetical. No rank scores. No recommendations.

Hub lists what can be placed. It does not decide what should be placed.
AZInterface, AZBrowser, and AZNet remain separate products — tiles only.
"""

from __future__ import annotations

from typing import Any

# Declaration order is alphabetical by slug. Never sorted by "usefulness".
TILES: tuple[dict[str, str], ...] = (
    {"slug": "ark", "kind": "module", "label": "The ARK"},
    {"slug": "azai", "kind": "module", "label": "AZAI"},
    {"slug": "azbot", "kind": "module", "label": "AZBot"},
    {"slug": "azbrowser", "kind": "module", "label": "AZBrowser"},
    {"slug": "azclce", "kind": "module", "label": "AZ-CLCE"},
    {"slug": "aziel-corpus", "kind": "module", "label": "Aziel Digital Library"},
    {"slug": "azieltether", "kind": "lock", "label": "AzielTether"},
    {"slug": "azinterface", "kind": "module", "label": "AZInterface"},
    {"slug": "azmail", "kind": "module", "label": "AZMail"},
    {"slug": "aznet", "kind": "module", "label": "AZNet"},
    {"slug": "azos", "kind": "module", "label": "AZ-OS"},
    {"slug": "chronolock", "kind": "lock", "label": "ChronoLock"},
    {"slug": "codelock", "kind": "lock", "label": "CodeLock"},
    {"slug": "decisiongate", "kind": "module", "label": "DecisionGATE"},
    {"slug": "employeelock", "kind": "lock", "label": "EmployeeLock"},
    {"slug": "foldlock", "kind": "lock", "label": "FoldLock"},
    {"slug": "forgereceipts", "kind": "module", "label": "ForgeReceipts"},
    {"slug": "glossafilter", "kind": "module", "label": "Glossa Filter"},
    {"slug": "godlock", "kind": "lock", "label": "GodLock"},
    {"slug": "mialock", "kind": "lock", "label": "M.I.A.Lock"},
    {"slug": "miragegrid", "kind": "module", "label": "MirageGrid"},
    {"slug": "peacelock", "kind": "lock", "label": "PeaceLock"},
    {"slug": "postking", "kind": "module", "label": "Post-King Chess"},
    {"slug": "shadowlock", "kind": "lock", "label": "ShadowLock"},
    {"slug": "spectrallock", "kind": "lock", "label": "SpectralLock"},
    {"slug": "staticclock", "kind": "lock", "label": "StaticClock"},
    {"slug": "temporallock", "kind": "lock", "label": "TemporalLock"},
    {"slug": "trajectorylock", "kind": "lock", "label": "TrajectoryLock"},
    {"slug": "veillock", "kind": "lock", "label": "VeilLock"},
    {"slug": "vibelock", "kind": "lock", "label": "VibeLock"},
    {"slug": "whistlelock", "kind": "lock", "label": "WhistleLock"},
    {"slug": "zsolver", "kind": "module", "label": "ZionPattern Solver"},
)

SEPARATE_PRODUCTS = ("azinterface", "azbrowser", "aznet")


def tiles() -> list[dict[str, str]]:
    """Return a copy of the catalog. Order is declaration order (alpha)."""
    return [dict(t) for t in TILES]


def find_tile(slug: str) -> dict[str, str] | None:
    key = str(slug or "").strip().lower()
    for t in TILES:
        if t["slug"] == key:
            return dict(t)
    return None


def catalog_payload() -> dict[str, Any]:
    rows = tiles()
    return {
        "tiles": rows,
        "count": len(rows),
        "modules": [t for t in rows if t["kind"] == "module"],
        "locks": [t for t in rows if t["kind"] == "lock"],
        "ranked": False,
        "recommended": False,
        "order": "alphabetical_slug",
        "separate_products": list(SEPARATE_PRODUCTS),
        "note": "Catalog is a list, not a ranking. Hub does not assign meaning.",
    }
