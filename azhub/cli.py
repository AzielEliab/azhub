"""AZHub CLI — Blank Key place / tether / isolate, loopback UI."""

from __future__ import annotations

import argparse
import json
import os
import sys

from .engine import Engine, OPS
from .doctor import doctor
from .meta import HOST, LIMITATION, __version__
from .receipts import Ledger


def _engine(args: argparse.Namespace) -> Engine:
    path = getattr(args, "ledger", None) or os.environ.get("AZHUB_LEDGER") or "./azhub_receipts.jsonl"
    return Engine(Ledger(path))


def _print(obj: object) -> int:
    if isinstance(obj, dict) and obj.get("display"):
        d = obj["display"]
        print(d.get("title") or "AZHub")
        print(d.get("summary") or "")
        for row in d.get("fields") or []:
            print(f"  {row.get('label')}: {row.get('value')}")
        print()
    print(json.dumps(obj, indent=2, ensure_ascii=False))
    return 0 if (not isinstance(obj, dict) or obj.get("ok", True)) else 2


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="azhub", description="AZHub Blank Key. Author Aziel Eliab.")
    p.add_argument("--ledger", default=os.environ.get("AZHUB_LEDGER", "./azhub_receipts.jsonl"))
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("version")
    sub.add_parser("doctor")
    sub.add_parser("ui")
    sub.add_parser("health")
    sub.add_parser("ops")
    sub.add_parser("skill")
    sub.add_parser("status")
    sub.add_parser("home")
    sub.add_parser("list")

    pl = sub.add_parser("place")
    pl.add_argument("slug")
    pl.add_argument("--x", type=float, default=80)
    pl.add_argument("--y", type=float, default=80)

    td = sub.add_parser("tether")
    td.add_argument("source")
    td.add_argument("target")
    sub.add_parser("tethers")

    iso = sub.add_parser("isolate")
    iso.add_argument("slug")

    c = sub.add_parser("call")
    c.add_argument("op")
    c.add_argument("--payload", default="{}")

    args = p.parse_args(argv)
    if args.cmd == "version":
        print(f"AZHub {__version__}")
        print(LIMITATION)
        print("Worker:", HOST)
        return 0
    if args.cmd == "doctor":
        return doctor()
    if args.cmd == "ui":
        from .ui import serve

        return serve()

    eng = _engine(args)
    if args.cmd == "ops":
        return _print({"ok": True, "ops": list(OPS)})
    if args.cmd == "health":
        return _print(eng.health({}))
    if args.cmd == "skill":
        return _print(eng.skill({}))
    if args.cmd == "status" or args.cmd == "home":
        return _print(eng.blank_key_status({}))
    if args.cmd == "list":
        return _print(eng.list_modules({}))
    if args.cmd == "place":
        return _print(eng.place({"slug": args.slug, "x": args.x, "y": args.y}))
    if args.cmd == "tether":
        return _print(eng.tether_declare({"from": args.source, "to": args.target}))
    if args.cmd == "tethers":
        return _print(eng.tether_list({}))
    if args.cmd == "isolate":
        return _print(eng.isolate({"slug": args.slug}))
    if args.cmd == "call":
        try:
            payload = json.loads(args.payload)
        except json.JSONDecodeError:
            print("payload must be JSON", file=sys.stderr)
            return 2
        return _print(eng.call(args.op, payload if isinstance(payload, dict) else {}))
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
