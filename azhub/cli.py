"""AZHub CLI — local Blank Key canvas, place / tether, loopback UI."""

from __future__ import annotations

import argparse
import json
import os
import sys

from .doctor import doctor
from .engine import LIVE_OPS, STUB_OPS, dispatch
from .meta import HOST, LIMITATION, __version__


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
    p.add_argument("--session", default=os.environ.get("AZHUB_SESSION", ""))
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("version")
    sub.add_parser("doctor")
    sub.add_parser("ui")
    sub.add_parser("health")
    sub.add_parser("ops")
    sub.add_parser("regions")
    sub.add_parser("blank-key")
    sub.add_parser("tethers")

    pl = sub.add_parser("place")
    pl.add_argument("slug")
    pl.add_argument("--kind", default="")
    pl.add_argument("--region", default="center")
    pl.add_argument("--z", type=int, default=0)
    pl.add_argument("--bound", action="store_true")
    pl.add_argument("--id", default="")

    rm = sub.add_parser("remove")
    rm.add_argument("id")

    td = sub.add_parser("tether")
    td.add_argument("src")
    td.add_argument("dst")

    tc = sub.add_parser("cut")
    tc.add_argument("id")

    c = sub.add_parser("call")
    c.add_argument("op")
    c.add_argument("--payload", default="{}")

    args = p.parse_args(argv)
    sid = args.session or None

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
    if args.cmd == "health":
        return _print(dispatch("health", {}, sid))
    if args.cmd == "ops":
        print("live:", ", ".join(LIVE_OPS))
        print("stub:", ", ".join(STUB_OPS))
        return 0
    if args.cmd == "regions":
        return _print(dispatch("region_list", {}, sid))
    if args.cmd == "blank-key":
        return _print(dispatch("blank_key_status", {}, sid))
    if args.cmd == "tethers":
        return _print(dispatch("tether_list", {}, sid))
    if args.cmd == "place":
        payload = {"slug": args.slug, "region": args.region, "z": args.z, "bound": args.bound}
        if args.kind:
            payload["kind"] = args.kind
        if args.id:
            payload["id"] = args.id
        return _print(dispatch("place_module", payload, sid))
    if args.cmd == "remove":
        return _print(dispatch("remove_module", {"id": args.id}, sid))
    if args.cmd == "tether":
        return _print(dispatch("tether_declare", {"from": args.src, "to": args.dst}, sid))
    if args.cmd == "cut":
        return _print(dispatch("tether_cut", {"id": args.id}, sid))
    if args.cmd == "call":
        try:
            payload = json.loads(args.payload)
        except json.JSONDecodeError:
            print("payload must be JSON", file=sys.stderr)
            return 2
        return _print(dispatch(args.op, payload, sid))
    return 2
