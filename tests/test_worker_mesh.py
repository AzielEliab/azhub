"""Suite mesh Live Nodes + QNS-CD-1.0 cross-map contract.

Default OFF. live|locked|isolated. No Node Gate. No public qnsd proxy.
Hub cite / Worker mesh cross-map only — not a Softwares-tab product.
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MESH = (ROOT / "workers/download-tracker/src/mesh.js").read_text(encoding="utf-8")
RUNTIME = (ROOT / "workers/download-tracker/src/runtime.js").read_text(encoding="utf-8")
UI = (ROOT / "workers/download-tracker/src/ui.js").read_text(encoding="utf-8")
README = (ROOT / "README.md").read_text(encoding="utf-8")
SKILL = (ROOT / "SKILL.md").read_text(encoding="utf-8")
WORKER_README = (ROOT / "workers/download-tracker/README.md").read_text(encoding="utf-8")
AGENTS = (ROOT / "AGENTS.md").read_text(encoding="utf-8")


def test_mesh_exports_qns_cd_cross_map() -> None:
    assert 'QNS_CD_SPEC = "QNS-CD-1.0"' in MESH
    assert "export const QNS_CD" in MESH
    assert "photon QNS1 packet transfer" in MESH
    assert "https://github.com/AzielEliab/qnm-node" in MESH
    assert "https://github.com/AzielEliab/aziel-runtime" in MESH
    assert "softwares_tab: false" in MESH
    assert "public_qnsd_proxy: false" in MESH
    assert "export function attachQnsCd" in MESH
    assert "QNS-CD-1.0" in MESH
    assert 'MESH_NOTE =' in MESH
    assert "QNS-CD-1.0" in MESH.split("export const MESH_NOTE", 1)[1][:800]


def test_mesh_contract_default_off_qnm_law() -> None:
    assert 'QNM_SPEC = "QNM-BUILD-1.0"' in MESH
    assert "MESH_DEFAULT_OFF = true" in MESH
    assert "MESH_ANONYMITY_NETWORK = false" in MESH
    assert "MESH_NODE_GATE = false" in MESH
    assert "MESH_AUTO_HEAL = false" in MESH
    assert 'MESH_PRODUCT = "azhub"' in MESH
    assert 'MESH_PATH = "/v1/mesh"' in MESH
    assert "live|locked|isolated" in MESH
    assert "enabled_default: false" in MESH
    assert "anon_broadcast_publish_path: false" in MESH
    assert "Aziel Eliab" in MESH
    assert "qnsd" in MESH
    assert "This Worker does not implement qnsd" in MESH


def test_runtime_attaches_qns_cd_on_live_nodes() -> None:
    assert 'from "./mesh.js"' in RUNTIME
    assert "meshPointer" in RUNTIME
    assert "meshOpenApiPaths" in RUNTIME
    assert "meshOpenApiPaths()" in RUNTIME
    assert "mesh: meshPointer()" in RUNTIME
    assert "attachQnsCd" in RUNTIME
    assert "isMeshCrossMapPath" in RUNTIME
    assert "QNS-CD-1.0" in RUNTIME
    assert "No public qnsd proxy" in RUNTIME or "no public qnsd proxy" in RUNTIME.lower()


def test_docs_cite_qns_cd() -> None:
    for text in (README, SKILL, WORKER_README, AGENTS, UI):
        assert "QNS-CD-1.0" in text
        assert "/v1/mesh" in text
    assert "photon QNS1 packet transfer" in README
    assert "photon QNS1 packet transfer" in SKILL
    assert "qnm-node" in README
    assert "aziel-runtime" in SKILL
    assert "Not a Softwares-tab product" in README or "not a Softwares-tab product" in README
    assert "no public qnsd proxy" in README.lower()
