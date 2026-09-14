"""Suite mesh Live Nodes + QNS-CD-1.0 + mesh-law contract.

Default OFF. live|locked|isolated. No Node Gate. No public qnsd proxy.
SPLIT THE WIRES + COLD-COPY SURVIVAL + RE-EXPAND-FROM-ARCHIVE are status/refuse only.
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


def test_mesh_exports_split_the_wires_and_cold_copy_survival() -> None:
    assert 'SPLIT_THE_WIRES_SPEC = "SPLIT-THE-WIRES-1.0"' in MESH
    assert 'SPLIT_THE_WIRES_TITLE = "SPLIT THE WIRES"' in MESH
    assert "export const SPLIT_THE_WIRES" in MESH
    assert "tip-only 0.5–1s tick" in MESH.lower() or "tip-only 0.5-1s tick" in MESH.lower()
    assert "pull-only" in MESH
    assert "update is proof" in MESH.lower() or 'update: "proof"' in MESH
    assert "777s dwell" in MESH
    assert "equivocation ends" in MESH.lower() or 'equivocation: "ends-peer"' in MESH
    assert "emit last locally" in MESH.lower() or 'emit_last: "locally"' in MESH
    assert "phoenix local only" in MESH.lower() or 'phoenix: "local-only"' in MESH
    assert "no-auto-splice" in MESH
    assert "not-poison" in MESH
    assert '"1s"' in MESH and '"777s"' in MESH
    assert 'COLD_COPY_SURVIVAL_SPEC = "COLD-COPY-SURVIVAL-1.0"' in MESH
    assert 'COLD_COPY_SURVIVAL_TITLE = "COLD-COPY SURVIVAL"' in MESH
    assert "export const COLD_COPY_SURVIVAL" in MESH
    assert "multiply_cold_copies: true" in MESH
    assert "live_body_sync: false" in MESH
    assert "tip_expensive_to_erase: true" in MESH
    assert "server_pull_wipes_cold_replicas: false" in MESH
    assert "hash-absolute-refuse" in MESH
    assert "data_outlives_creators: true" in MESH
    assert "export function meshLawRefuse" in MESH
    assert "export function meshLawRefuseFromPath" in MESH
    assert "STW-REFUSE" in MESH
    assert "CCS-REFUSE" in MESH
    assert "SPLIT THE WIRES" in MESH.split("export const MESH_NOTE", 1)[1][:800]
    assert "COLD-COPY SURVIVAL" in MESH.split("export const MESH_NOTE", 1)[1][:800]


def test_mesh_exports_re_expand_from_archive() -> None:
    assert 'RE_EXPAND_FROM_ARCHIVE_SPEC = "RE-EXPAND-FROM-ARCHIVE-1.0"' in MESH
    assert 'RE_EXPAND_FROM_ARCHIVE_TITLE = "RE-EXPAND-FROM-ARCHIVE"' in MESH
    assert "export const RE_EXPAND_FROM_ARCHIVE" in MESH
    assert "export function reExpandFromArchiveRefuse" in MESH
    assert "REA-REFUSE" in MESH
    assert "bytes of chain survive" in MESH.lower()
    assert "not summaries" in MESH.lower()
    assert "archive verify + local node" in MESH.lower()
    assert "not mesh from index" in MESH.lower()
    assert "crawlers do not re-expand" in MESH.lower()
    assert "weights are not a tarball" in MESH.lower()
    assert 'chain_survives: "bytes"' in MESH
    assert "summaries_are_not_chain: true" in MESH
    assert 're_expand: "archive-verify-and-local-node"' in MESH
    assert 're_expand_not: "mesh-from-index"' in MESH
    assert "crawlers_re_expand: false" in MESH
    assert "weights_are_tarball: false" in MESH
    assert "RE-EXPAND-FROM-ARCHIVE" in MESH.split("export const MESH_NOTE", 1)[1][:800]


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
    assert "meshLawRefuseFromPath" in RUNTIME
    assert "QNS-CD-1.0" in RUNTIME
    assert "SPLIT THE WIRES" in RUNTIME
    assert "COLD-COPY SURVIVAL" in RUNTIME
    assert "RE-EXPAND-FROM-ARCHIVE" in RUNTIME
    assert "No public qnsd proxy" in RUNTIME or "no public qnsd proxy" in RUNTIME.lower()


def test_docs_cite_qns_cd() -> None:
    for text in (README, SKILL, WORKER_README, AGENTS, UI):
        assert "QNS-CD-1.0" in text
        assert "/v1/mesh" in text
        assert "SPLIT THE WIRES" in text
        assert "COLD-COPY SURVIVAL" in text
        assert "RE-EXPAND-FROM-ARCHIVE" in text
    assert "photon QNS1 packet transfer" in README
    assert "photon QNS1 packet transfer" in SKILL
    assert "qnm-node" in README
    assert "aziel-runtime" in SKILL
    assert "Not a Softwares-tab product" in README or "not a Softwares-tab product" in README
    assert "no public qnsd proxy" in README.lower()
