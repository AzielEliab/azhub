from azhub.door import classify_v1_path, door_target_url, local_op_from_path, map_door_path
from azhub.engine import Engine
from azhub.meta import RUNTIME
from azhub.receipts import Ledger


def test_fraggate_call_is_door_not_local_op():
    hit = classify_v1_path("/v1/fraggate/call")
    assert hit["kind"] == "door"
    assert hit["originPath"] == "/v1/fraggate/call"
    assert local_op_from_path("/v1/fraggate/call") is None


def test_runtime_aliases_map_to_fraggate():
    assert map_door_path("/v1/runtime/list") == "/v1/fraggate/list"
    assert map_door_path("/v1/runtime/call") == "/v1/fraggate/call"
    assert classify_v1_path("/v1/runtime/list")["kind"] == "door"
    assert local_op_from_path("/v1/runtime/list") is None


def test_mesh_is_door_not_local_op():
    for path in ("/v1/mesh", "/v1/mesh/status", "/v1/mesh/nodes", "/v1/mesh/join"):
        hit = classify_v1_path(path)
        assert hit["kind"] == "door", path
        assert hit["originPath"] == path.rstrip("/")
        assert local_op_from_path(path) is None
    assert map_door_path("/v1/mesh/status") == "/v1/mesh/status"
    assert door_target_url("/v1/mesh/status") == RUNTIME.rstrip("/") + "/v1/mesh/status"
    assert local_op_from_path("/v1/mesh") is None


def test_local_ops_are_single_segment_only():
    assert classify_v1_path("/v1/place") == {
        "kind": "local",
        "path": "/v1/place",
        "op": "place",
    }
    assert classify_v1_path("/v1/blank_key_status")["op"] == "blank_key_status"
    assert classify_v1_path("/v1/tether_list")["op"] == "tether_list"
    assert classify_v1_path("/v1/not/a/door")["kind"] == "multi"


def test_counters_are_not_v1_ops():
    for path in ("/count", "/stats", "/download", "/"):
        assert classify_v1_path(path)["kind"] == "none"


def test_door_target_url():
    assert door_target_url("/v1/fraggate/call") == RUNTIME.rstrip("/") + "/v1/fraggate/call"
    assert door_target_url("/v1/runtime/list") == RUNTIME.rstrip("/") + "/v1/fraggate/list"


def test_engine_still_refuses_fraggate_slash_call_as_op():
    out = Engine(Ledger()).call("fraggate/call", {})
    assert out["code"] == "FG-HALLUC-TOOL"
    assert out["op"] == "fraggate/call"


def test_fraggate_live_op_aliases():
    eng = Engine(Ledger())
    assert eng.call("home", {})["ok"] is True
    assert eng.call("modules", {})["ok"] is True
