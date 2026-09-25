"""AZHub CLI — human text by default, JSON with --json."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys

from .doctor import doctor
from .engine import Engine
from .meta import HOST, IDENTITY, OPS, __version__
from .receipts import Ledger
from .ui import PORT

LEDGER_DEFAULT = "./azhub_receipts.jsonl"
UI_URL = f"http://127.0.0.1:{PORT}/"

HELP = f"""azhub — place modules on a blank surface

Author: {IDENTITY}

Usage:
  azhub
  azhub ui
  azhub <command> [--json]

Start here:
  azhub                  Welcome and the next step
  azhub ui               Local app at {UI_URL}

Common commands:
  doctor                 Check the local Blank Key
  place <slug>           Place a module (--x and --y)
  list                   Show what is placed
  tether <from> <to>     Declare a corridor between two placed modules
  tethers                List declared corridors
  isolate <slug>         Isolate a placed module
  status                 Show the surface
  version                Show the version

Advanced:
  home                   Same as status
  health                 Health record
  skill                  Agent skill text
  ops                    Operation names
  call <op>              Call an operation (--payload JSON)
  --ledger PATH          Receipt file (default {LEDGER_DEFAULT})
  --json                 Machine-readable JSON

Examples:
  azhub ui
  azhub place azmail --x 80 --y 80
  azhub tether azmail peacelock
  azhub doctor
  azhub health --json
"""

WELCOME = f"""AZHub places modules on a blank surface. A corridor appears only when you declare one.

Open the local app:
  azhub ui

Then open {UI_URL} and choose Place a module.

Other starts:
  azhub doctor
  azhub --help

Author: {IDENTITY}
"""

_NEXT = {
    "unknown_tile": "Next: azhub list",
    "both_ends_must_be_placed": "Next: place both modules, then azhub tether <from> <to>",
    "tile_not_placed": "Next: azhub place <slug>",
    "tether_not_declared": "Next: azhub tether <from> <to>",
    "tether_needs_two_tiles": "Next: azhub tether <from> <to>",
    "isolated_tile_refuses_tether": "Next: azhub status",
    "FG-HALLUC-TOOL": "Next: azhub ops",
    "FG-STUB": "Next: azhub --help",
}

_PLAIN = {
    "unknown_tile": "That name is not in the catalog.",
    "both_ends_must_be_placed": "Both modules need to be placed first.",
    "tile_not_placed": "That module is not on the surface yet.",
    "tether_not_declared": "There is no corridor between those modules.",
    "tether_needs_two_tiles": "A corridor needs two different modules.",
    "isolated_tile_refuses_tether": "An isolated module cannot take a new corridor.",
    "unknown op": "That operation is not available.",
}


class Parser(argparse.ArgumentParser):
    def format_help(self) -> str:
        if self.prog == "azhub":
            return HELP if HELP.endswith("\n") else HELP + "\n"
        return super().format_help()

    def error(self, message: str) -> None:
        prog = self.prog
        choice = re.search(r"invalid choice: '([^']*)'", message)
        if choice and "argument cmd" in message:
            print(f'Unknown command "{choice.group(1)}".', file=sys.stderr)
            print("Try: azhub ui   or   azhub --help", file=sys.stderr)
            raise SystemExit(2)
        if message.startswith("the following arguments are required:"):
            hints = {
                "azhub place": (
                    "Place needs a module name.",
                    "Try: azhub place azmail --x 80 --y 80",
                ),
                "azhub isolate": (
                    "Isolate needs a module name.",
                    "Try: azhub isolate azmail",
                ),
                "azhub tether": (
                    "Tether needs two placed module names.",
                    "Try: azhub tether azmail peacelock",
                ),
                "azhub call": (
                    "Call needs an operation name.",
                    "Try: azhub call place_module --payload '{\"slug\":\"azmail\",\"x\":80,\"y\":80}'",
                ),
            }
            title, nxt = hints.get(prog, (f"Missing {message.split(':', 1)[1].strip()}.", "Try: azhub --help"))
            print(title, file=sys.stderr)
            print(nxt, file=sys.stderr)
            raise SystemExit(2)
        if choice:
            print(f'Unknown value "{choice.group(1)}".', file=sys.stderr)
            print("Try: azhub --help", file=sys.stderr)
            raise SystemExit(2)
        plain = message[:1].upper() + message[1:] if message else "That command could not be read."
        if plain and not plain.endswith("."):
            plain += "."
        print(plain, file=sys.stderr)
        print("Try: azhub --help", file=sys.stderr)
        raise SystemExit(2)


def _engine(args: argparse.Namespace) -> Engine:
    path = getattr(args, "ledger", None) or os.environ.get("AZHUB_LEDGER") or LEDGER_DEFAULT
    return Engine(Ledger(path))


def _human(obj: dict) -> None:
    display = obj.get("display") if isinstance(obj.get("display"), dict) else {}
    print(display.get("title") or "AZHub")
    summary = display.get("summary") or ""
    summary = _PLAIN.get(summary, summary)
    if summary:
        print(summary)
    for row in display.get("fields") or []:
        if isinstance(row, dict):
            print(f"  {row.get('label')}: {row.get('value')}")
    action = obj.get("action")
    placed = obj.get("placed") if isinstance(obj.get("placed"), list) else []
    tethers = obj.get("tethers") if isinstance(obj.get("tethers"), list) else []
    if action in ("list_modules", "blank_key_status"):
        if placed:
            print("Placed:")
            for row in placed:
                if not isinstance(row, dict):
                    continue
                label = row.get("label") or row.get("slug")
                mark = " · isolated" if row.get("isolated") else ""
                print(f"  {label}{mark}")
        else:
            print("Placed: none yet")
    if action in ("tether_list", "blank_key_status"):
        if tethers:
            print("Corridors:")
            for row in tethers:
                if isinstance(row, dict):
                    print(f"  {row.get('from_slug')} — {row.get('to_slug')}")
        elif action == "tether_list":
            print("Corridors: none yet")
    if obj.get("ok") is False:
        code = str(obj.get("code") or obj.get("error") or "")
        print(_NEXT.get(code, "Next: azhub --help"))


def emit(obj: object, as_json: bool) -> int:
    ok = (not isinstance(obj, dict)) or bool(obj.get("ok", True))
    if as_json:
        print(json.dumps(obj, indent=2, ensure_ascii=False))
        return 0 if ok else 2
    if isinstance(obj, dict) and isinstance(obj.get("ops"), list) and "display" not in obj:
        print("Operations")
        for name in obj["ops"]:
            print(f"  {name}")
        return 0 if ok else 2
    if isinstance(obj, dict) and obj.get("markdown"):
        display = obj.get("display") if isinstance(obj.get("display"), dict) else {}
        print(display.get("title") or "AZHub skill")
        if display.get("summary"):
            print(display["summary"])
        for row in display.get("fields") or []:
            if isinstance(row, dict):
                print(f"  {row.get('label')}: {row.get('value')}")
        print("Full text: SKILL.md")
        print("Machine copy: azhub skill --json")
        return 0 if ok else 2
    if isinstance(obj, dict):
        _human(obj)
    else:
        print(obj)
    return 0 if ok else 2


def _build() -> Parser:
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--json", action="store_true", help="print machine JSON")
    common.add_argument("--ledger", default=os.environ.get("AZHUB_LEDGER", LEDGER_DEFAULT))

    parser = Parser(prog="azhub", parents=[common])
    sub = parser.add_subparsers(dest="cmd", parser_class=Parser)

    sub.add_parser("version", parents=[common], help="Show the version")
    sub.add_parser("doctor", parents=[common], help="Check the local Blank Key")
    sub.add_parser("ui", parents=[common], help=f"Open the local app at {UI_URL}")
    sub.add_parser("health", parents=[common], help="Health record")
    sub.add_parser("ops", parents=[common], help="Operation names")
    sub.add_parser("skill", parents=[common], help="Agent skill text")
    sub.add_parser("status", parents=[common], help="Show the surface")
    sub.add_parser("home", parents=[common], help="Same as status")
    sub.add_parser("list", parents=[common], help="Show what is placed")

    place = sub.add_parser("place", parents=[common], help="Place a module")
    place.add_argument("slug")
    place.add_argument("--x", type=float, default=80)
    place.add_argument("--y", type=float, default=80)

    tether = sub.add_parser("tether", parents=[common], help="Declare a corridor")
    tether.add_argument("source")
    tether.add_argument("target")
    sub.add_parser("tethers", parents=[common], help="List declared corridors")

    isolate = sub.add_parser("isolate", parents=[common], help="Isolate a placed module")
    isolate.add_argument("slug")

    call = sub.add_parser("call", parents=[common], help="Call an operation")
    call.add_argument("op")
    call.add_argument("--payload", default="{}")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = _build()
    try:
        args = parser.parse_args(argv)
    except SystemExit as exc:
        code = exc.code
        return int(code) if isinstance(code, int) else (0 if code is None else 2)

    if args.cmd is None:
        if args.json:
            print(
                json.dumps(
                    {
                        "ok": True,
                        "name": "AZHub",
                        "version": __version__,
                        "author": IDENTITY,
                        "ui": UI_URL,
                        "next": ["azhub ui", "azhub doctor", "azhub --help"],
                    },
                    indent=2,
                )
            )
        else:
            print(WELCOME, end="" if WELCOME.endswith("\n") else "\n")
        return 0

    if args.cmd == "version":
        if args.json:
            print(
                json.dumps(
                    {"name": "AZHub", "version": __version__, "author": IDENTITY, "host": HOST},
                    indent=2,
                )
            )
        else:
            print(f"AZHub {__version__}")
            print(f"Author: {IDENTITY}")
        return 0
    if args.cmd == "doctor":
        return doctor(as_json=bool(args.json))
    if args.cmd == "ui":
        from .ui import serve

        return serve()

    eng = _engine(args)
    if args.cmd == "ops":
        return emit({"ok": True, "ops": list(OPS)}, args.json)
    if args.cmd == "health":
        return emit(eng.health({}), args.json)
    if args.cmd == "skill":
        return emit(eng.skill({}), args.json)
    if args.cmd in ("status", "home"):
        return emit(eng.blank_key_status({}), args.json)
    if args.cmd == "list":
        return emit(eng.list_modules({}), args.json)
    if args.cmd == "place":
        return emit(eng.place({"slug": args.slug, "x": args.x, "y": args.y}), args.json)
    if args.cmd == "tether":
        return emit(eng.tether_declare({"from": args.source, "to": args.target}), args.json)
    if args.cmd == "tethers":
        return emit(eng.tether_list({}), args.json)
    if args.cmd == "isolate":
        return emit(eng.isolate({"slug": args.slug}), args.json)
    if args.cmd == "call":
        try:
            payload = json.loads(args.payload)
        except json.JSONDecodeError:
            print("Payload must be JSON.", file=sys.stderr)
            print(
                'Try: azhub call place_module --payload \'{"slug":"azmail","x":80,"y":80}\'',
                file=sys.stderr,
            )
            return 2
        if not isinstance(payload, dict):
            print("Payload must be a JSON object.", file=sys.stderr)
            print(
                'Try: azhub call place_module --payload \'{"slug":"azmail","x":80,"y":80}\'',
                file=sys.stderr,
            )
            return 2
        return emit(eng.call(args.op, payload), args.json)
    print(f'Unknown command "{args.cmd}".', file=sys.stderr)
    print("Try: azhub ui   or   azhub --help", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
