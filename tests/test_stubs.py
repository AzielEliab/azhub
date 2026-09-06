from azhub.engine import STUB_OPS, dispatch


def test_stubs_refuse():
    for op in ("snap", "snap_activate", "unlock", "rank", "intent", "completeness", "auto_wire", "collapse_interface"):
        out = dispatch(op, {})
        assert out["ok"] is False
        assert out["code"] == "HUB-STUB"
        assert out["stub"] is True
        assert op in STUB_OPS


def test_unknown_op_halluc():
    out = dispatch("not_a_real_op", {})
    assert out["code"] == "FG-HALLUC-TOOL"
