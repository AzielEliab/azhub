"""Package constants. Import this instead of the package root from engines."""

__version__ = "0.1.0"
IDENTITY = "Aziel Eliab"
SPEC = "AIH-WP-1.0"
PRODUCT = "azhub"
NAME = "AZHub"
LIMITATION = (
    "THIS IS: AZHub — a neutral spatial container / Blank Key (AIH-WP-1.0). "
    "Place, tether, and isolate modules. Declared tethers only (visible corridors). "
    "THIS IS NOT: AZInterface, AZBrowser, AZNet, a recommender, a ranker, a "
    "meaning engine, or activation-by-co-presence. Hub does not decide why "
    "anything matters. Blank Key geometry has no intent. Modules remain complete "
    "if Hub is removed. No helpful auto-wiring. Advisory only. Author: Aziel Eliab only."
)
RUNTIME = "https://aziel-runtime.vibelock.workers.dev"
FRAGGATE = "https://github.com/AzielEliab/fraggate"
FRAGGATE_CALL = "https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call"
FRAGGATE_MCP = "https://aziel-runtime.vibelock.workers.dev/mcp"
HOST = "https://azhub-download-tracker.vibelock.workers.dev"
SIGIL = "https://www.azielcorpuslibrary.net/sigil.png"
AZINTERFACE = "https://github.com/AzielEliab/azinterface"
AZINTERFACE_WORKER = "https://azinterface-download-tracker.vibelock.workers.dev"
AZBROWSER = "https://github.com/AzielEliab/azbrowser"
AZBROWSER_WORKER = "https://azbrowser-download-tracker.vibelock.workers.dev"
AZNET = "https://github.com/AzielEliab/aznet"
AZNET_WORKER = "https://aznet-download-tracker.vibelock.workers.dev"
AZMAIL = "https://github.com/AzielEliab/azmail"
AZMAIL_WORKER = "https://azmail-download-tracker.vibelock.workers.dev"
LIBRARY = "https://www.azielcorpuslibrary.net/"
GODLOCK = "https://godlock.uk/"
AUTHOR_SITE = "https://www.azieleliab.com"
GITHUB = "https://github.com/AzielEliab/azhub"

LIVE_OPS = (
    "health",
    "place",
    "list_modules",
    "tether_declare",
    "tether_list",
    "isolate",
    "blank_key_status",
    "skill",
)

STUB_OPS = (
    "recommend",
    "rank",
    "auto_wire",
    "interpret_meaning",
    "activate_by_copresence",
)

# Home is the everblooming-sigil return to Blank Key. Not a ranking surface.
ALIASES = {
    "home": "blank_key_status",
    "status": "blank_key_status",
    "blank_key": "blank_key_status",
    "modules": "list_modules",
    "list": "list_modules",
    "tether": "tether_declare",
    "bind": "place",
}

OPS = LIVE_OPS + STUB_OPS
