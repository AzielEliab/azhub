from azhub.engine import Engine, STUB_OPS
from azhub.receipts import Ledger


def test_all_stub_ops_refuse():
    eng = Engine(Ledger())
    for op in STUB_OPS:
        out = eng.call(op, {})
        assert out["ok"] is False, op
        assert out["code"] == "FG-STUB", op
        assert out["status"] == "stub", op
        assert out.get("receipt")


def test_copresence_is_not_a_tether():
    eng = Engine(Ledger())
    eng.place({"slug": "azmail", "x": 10, "y": 10})
    eng.place({"slug": "azbrowser", "x": 12, "y": 12})
    listed = eng.tether_list({})
    assert listed["tether_count"] == 0
    refuse = eng.call("activate_by_copresence", {})
    assert refuse["code"] == "FG-STUB"
