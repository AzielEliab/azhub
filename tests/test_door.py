from azhub.door import classify_v1_path, door_target_url, local_op_from_path


def test_door_vs_local():
    assert classify_v1_path("/v1/fraggate/call")["kind"] == "door"
    assert classify_v1_path("/v1/place_module") == {
        "kind": "local",
        "path": "/v1/place_module",
        "op": "place_module",
    }
    assert local_op_from_path("/v1/fraggate/call") is None
    assert local_op_from_path("/v1/blank_key_status") == "blank_key_status"
    assert classify_v1_path("/v1/not/a/door")["kind"] == "multi"
    assert door_target_url("/v1/runtime/list").endswith("/v1/fraggate/list")
