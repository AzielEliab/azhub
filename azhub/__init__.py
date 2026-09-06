"""AZHub 0.1.0 — SPACE / Blank Key (AIH-WP-1.0).

Author: Aziel Eliab only. Apache-2.0.
Neutral spatial container. Never collapse into AZInterface.
"""

from .door import classify_v1_path
from .engine import CATALOG, LIVE_OPS, OPS, REGIONS, STUB_OPS, dispatch
from .meta import (
    AZINTERFACE,
    FRAGGATE,
    FRAGGATE_CALL,
    FRAGGATE_MCP,
    GITHUB,
    HOST,
    IDENTITY,
    LIBRARY,
    LIMITATION,
    RUNTIME,
    SIGIL,
    SPEC,
    __version__,
)
from .receipts import Ledger

__author__ = IDENTITY

__all__ = [
    "AZINTERFACE",
    "CATALOG",
    "FRAGGATE",
    "FRAGGATE_CALL",
    "FRAGGATE_MCP",
    "GITHUB",
    "HOST",
    "IDENTITY",
    "LIBRARY",
    "LIMITATION",
    "LIVE_OPS",
    "OPS",
    "REGIONS",
    "RUNTIME",
    "SIGIL",
    "SPEC",
    "STUB_OPS",
    "__author__",
    "__version__",
    "classify_v1_path",
    "dispatch",
    "Ledger",
]
