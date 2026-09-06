from azhub.engine import blank_key, dispatch


def test_blank_key_flags():
    bk = blank_key()
    assert bk["blank_key"] is True
    assert bk["geometry_without_intent"] is True
    assert bk["copresence_inert"] is True
    assert bk["ranking"] is False
    assert bk["intent"] is False
    assert bk["completeness_detector"] is False
    assert bk["snap_activation"] is False
    assert bk["auto_wire"] is False
    assert bk["unlock_by_copresence"] is False
    assert bk["interface_collapse"] is False
    assert bk["hub_is"] == "SPACE"
    assert bk["never"] == "AZInterface"


def test_region_list_unranked():
    out = dispatch("region_list", {})
    assert out["ranking"] is False
    ids = [r["id"] for r in out["regions"]]
    assert "center" in ids and "dock" in ids
    assert all(r.get("ranked") is False for r in out["regions"])
