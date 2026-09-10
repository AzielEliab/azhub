/**
 * QNS-CD-1.0 / QNM Live Nodes cross-map on the AZHub Worker.
 * Mesh stays default OFF. No Node Gate. No public qnsd proxy.
 */
import assert from "node:assert/strict";
import {
  alignLiveNodes,
  attachQnsCd,
  emptyMesh,
  isMeshCrossMapPath,
  MESH_DEFAULT_OFF,
  MESH_NOTE,
  MESH_NODE_GATE,
  MESH_PRODUCT,
  meshPointer,
  meshStatusLine,
  parseMeshDoc,
  publicMesh,
  QNM_SPEC,
  QNS_CD,
  QNS_CD_SPEC,
} from "../workers/download-tracker/src/mesh.js";

assert.equal(QNS_CD_SPEC, "QNS-CD-1.0");
assert.equal(QNS_CD.spec, "QNS-CD-1.0");
assert.match(QNS_CD.title, /photon QNS1 packet transfer/);
assert.equal(QNS_CD.softwares_tab, false);
assert.equal(QNS_CD.public_qnsd_proxy, false);
assert.equal(QNS_CD.node_gate, false);
assert.equal(QNS_CD.mesh_default, "off");
assert.equal(QNS_CD.local_daemon.name, "qnsd");
assert.equal(QNS_CD.local_daemon.coded_in, "https://github.com/AzielEliab/qnm-node");
assert.equal(QNS_CD.runtime.cites, "https://github.com/AzielEliab/aziel-runtime");
assert.equal(QNS_CD.pair_custody, "https://github.com/AzielEliab/azinterface");
assert.equal(QNS_CD.author, "Aziel Eliab");
assert.equal(QNS_CD.identity, "Aziel Eliab");
assert.match(MESH_NOTE, /QNS-CD-1\.0/);
assert.match(MESH_NOTE, /photon QNS1 packet transfer/);
assert.equal(QNM_SPEC, "QNM-BUILD-1.0");
assert.equal(MESH_DEFAULT_OFF, true);
assert.equal(MESH_NODE_GATE, false);
assert.equal(MESH_PRODUCT, "azhub");

assert.equal(isMeshCrossMapPath("/v1/mesh"), true);
assert.equal(isMeshCrossMapPath("/v1/mesh/status/"), true);
assert.equal(isMeshCrossMapPath("/v1/mesh/nodes"), true);
assert.equal(isMeshCrossMapPath("/v1/mesh/join"), false);
assert.equal(isMeshCrossMapPath("/v1/place"), false);

const empty = emptyMesh();
assert.equal(empty.enabled, false);
assert.equal(empty.default_off, true);
assert.equal(empty.live_nodes, 0);
assert.equal(empty.qns_cd_spec, QNS_CD_SPEC);
assert.equal(empty.qns_cd.spec, QNS_CD_SPEC);
assert.match(empty.note, /QNS-CD-1\.0/);

const decorated = attachQnsCd({ ok: true, enabled: false, via: "binding", live_nodes: 0 });
assert.equal(decorated.ok, true);
assert.equal(decorated.via, "binding");
assert.equal(decorated.enabled, false);
assert.equal(decorated.qns_cd_spec, "QNS-CD-1.0");
assert.equal(decorated.qns_cd.public_qnsd_proxy, false);

const pub = publicMesh({ enabled: false });
assert.equal(pub.enabled, false);
assert.equal(pub.live_nodes, 0);
assert.equal(pub.qns_cd_spec, "QNS-CD-1.0");
assert.equal(pub.product, "azhub");

const pointer = meshPointer();
assert.equal(pointer.enabled_default, false);
assert.equal(pointer.proxy, true);
assert.equal(pointer.node_gate, false);
assert.equal(pointer.anonymity, false);
assert.match(pointer.anon_broadcast, /not a publish path/);
assert.equal(pointer.qns_cd_spec, "QNS-CD-1.0");
assert.equal(pointer.qns_cd.softwares_tab, false);
assert.match(pointer.note, /QNS-CD-1\.0/);
assert.match(pointer.note, /qnm-node/);

assert.equal(alignLiveNodes({ mesh: { enabled: false, live_nodes: 9 } }), 0);
assert.match(meshStatusLine({ enabled: false }), /QNS-CD-1\.0/);

const parsed = parseMeshDoc({ ok: true, enabled: false, live_nodes: 3, rollup: { live: 3, locked: 1, isolated: 0 } });
assert.equal(parsed.enabled, false);
assert.equal(parsed.live_nodes, 0);
assert.equal(parsed.qns_cd.spec, "QNS-CD-1.0");

console.log("worker mesh QNS-CD-1.0 cross-map ok");
