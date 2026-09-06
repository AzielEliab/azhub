"""AZHub 0.1.0 — Blank Key / neutral spatial container (AIH-WP-1.0).

Author: Aziel Eliab only. Apache-2.0.
This is not AZInterface, AZBrowser, or AZNet.
Hub does not rank, recommend, auto-wire, interpret meaning, or activate
by co-presence. Modules remain complete if Hub is removed.
"""

from .engine import LIVE_OPS, OPS, STUB_OPS, dispatch
from .meta import (
    AUTHOR_SITE,
    AZBROWSER,
    AZBROWSER_WORKER,
    AZINTERFACE,
    AZINTERFACE_WORKER,
    AZMAIL,
    AZMAIL_WORKER,
    AZNET,
    AZNET_WORKER,
    FRAGGATE,
    FRAGGATE_CALL,
    FRAGGATE_LIVE_OPS,
    FRAGGATE_MCP,
    GITHUB,
    GODLOCK,
    HOST,
    IDENTITY,
    LIBRARY,
    LIMITATION,
    RUNTIME,
    SIGIL,
    SPEC,
    UI_LIVE_OPS,
    __version__,
)
from .receipts import Ledger, receipt_hash
from .surface import BlankKey

__author__ = IDENTITY

__all__ = [
    "AUTHOR_SITE",
    "AZBROWSER",
    "AZBROWSER_WORKER",
    "AZINTERFACE",
    "AZINTERFACE_WORKER",
    "AZMAIL",
    "AZMAIL_WORKER",
    "AZNET",
    "AZNET_WORKER",
    "BlankKey",
    "FRAGGATE",
    "FRAGGATE_CALL",
    "FRAGGATE_LIVE_OPS",
    "FRAGGATE_MCP",
    "GITHUB",
    "GODLOCK",
    "HOST",
    "IDENTITY",
    "LIBRARY",
    "LIMITATION",
    "LIVE_OPS",
    "Ledger",
    "OPS",
    "RUNTIME",
    "SIGIL",
    "SPEC",
    "STUB_OPS",
    "UI_LIVE_OPS",
    "__author__",
    "__version__",
    "dispatch",
    "receipt_hash",
]
