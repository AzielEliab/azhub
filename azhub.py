"""AZHub shim. Prefer `python -m azhub` or the `azhub` console script."""

from azhub.cli import main

if __name__ == "__main__":
    raise SystemExit(main())
