/**
 * QNS-CD-1.0 / QNM Live Nodes cross-map on the AZHub Worker
 * plus SPLIT THE WIRES, COLD-COPY SURVIVAL, and RE-EXPAND-FROM-ARCHIVE.
 * Mesh stays default OFF. No Node Gate. No public qnsd proxy.
 */
import assert from "node:assert/strict";
import {
  alignLiveNodes,
  attachQnsCd,
  COLD_COPY_SURVIVAL,
  COLD_COPY_SURVIVAL_SPEC,
  emptyMesh,
  isMeshCrossMapPath,
  MESH_DEFAULT_OFF,
  MESH_NOTE,
  MESH_NODE_GATE,
  MESH_PRODUCT,
  meshLawRefuse,
  meshLawRefuseFromPath,
  meshPointer,
  meshStatusLine,
  parseMeshDoc,
  publicMesh,
  QNM_SPEC,
  QNS_CD,
  QNS_CD_SPEC,
  RE_EXPAND_FROM_ARCHIVE,
  RE_EXPAND_FROM_ARCHIVE_SPEC,
  SPLIT_THE_WIRES,
  SPLIT_THE_WIRES_SPEC,
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
assert.match(MESH_NOTE, /SPLIT THE WIRES/);
assert.match(MESH_NOTE, /COLD-COPY SURVIVAL/);
assert.match(MESH_NOTE, /RE-EXPAND-FROM-ARCHIVE/);
assert.equal(QNM_SPEC, "QNM-BUILD-1.0");
assert.equal(MESH_DEFAULT_OFF, true);
assert.equal(MESH_NODE_GATE, false);
assert.equal(MESH_PRODUCT, "azhub");
assert.equal(SPLIT_THE_WIRES_SPEC, "SPLIT-THE-WIRES-1.0");
assert.equal(SPLIT_THE_WIRES.title, "SPLIT THE WIRES");
assert.equal(SPLIT_THE_WIRES.payload, "pull-only");
assert.equal(SPLIT_THE_WIRES.update, "proof");
assert.equal(SPLIT_THE_WIRES.update_not, "timer");
assert.equal(SPLIT_THE_WIRES.dwell_after_valid_cite_s, 777);
assert.equal(SPLIT_THE_WIRES.equivocation, "ends-peer");
assert.equal(SPLIT_THE_WIRES.emit_last, "locally");
assert.equal(SPLIT_THE_WIRES.phoenix, "local-only");
assert.equal(SPLIT_THE_WIRES.partition, "no-auto-splice");
assert.equal(SPLIT_THE_WIRES.heartbeat_loss, "not-poison");
assert.deepEqual(SPLIT_THE_WIRES.tip_only_tick_s, { min: 0.5, max: 1 });
assert.deepEqual(SPLIT_THE_WIRES.strangers, ["1s", "777s"]);
assert.equal(COLD_COPY_SURVIVAL_SPEC, "COLD-COPY-SURVIVAL-1.0");
assert.equal(COLD_COPY_SURVIVAL.title, "COLD-COPY SURVIVAL");
assert.equal(COLD_COPY_SURVIVAL.multiply_cold_copies, true);
assert.equal(COLD_COPY_SURVIVAL.live_body_sync, false);
assert.equal(COLD_COPY_SURVIVAL.tip_expensive_to_erase, true);
assert.equal(COLD_COPY_SURVIVAL.server_pull_wipes_cold_replicas, false);
assert.equal(COLD_COPY_SURVIVAL.poison, "hash-absolute-refuse");
assert.equal(COLD_COPY_SURVIVAL.data_outlives_creators, true);
assert.equal(COLD_COPY_SURVIVAL.softwares_tab, false);
assert.equal(SPLIT_THE_WIRES.softwares_tab, false);
assert.equal(RE_EXPAND_FROM_ARCHIVE_SPEC, "RE-EXPAND-FROM-ARCHIVE-1.0");
assert.equal(RE_EXPAND_FROM_ARCHIVE.title, "RE-EXPAND-FROM-ARCHIVE");
assert.equal(RE_EXPAND_FROM_ARCHIVE.chain_survives, "bytes");
assert.equal(RE_EXPAND_FROM_ARCHIVE.summaries_are_not_chain, true);
assert.equal(RE_EXPAND_FROM_ARCHIVE.re_expand, "archive-verify-and-local-node");
assert.equal(RE_EXPAND_FROM_ARCHIVE.re_expand_not, "mesh-from-index");
assert.equal(RE_EXPAND_FROM_ARCHIVE.crawlers_re_expand, false);
assert.equal(RE_EXPAND_FROM_ARCHIVE.weights_are_tarball, false);
assert.equal(RE_EXPAND_FROM_ARCHIVE.softwares_tab, false);

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
assert.equal(empty.split_the_wires_spec, SPLIT_THE_WIRES_SPEC);
assert.equal(empty.cold_copy_survival_spec, COLD_COPY_SURVIVAL_SPEC);
assert.equal(empty.re_expand_from_archive_spec, RE_EXPAND_FROM_ARCHIVE_SPEC);
assert.match(empty.note, /QNS-CD-1\.0/);
assert.match(empty.note, /SPLIT THE WIRES/);
assert.match(empty.note, /COLD-COPY SURVIVAL/);
assert.match(empty.note, /RE-EXPAND-FROM-ARCHIVE/);

const decorated = attachQnsCd({ ok: true, enabled: false, via: "binding", live_nodes: 0 });
assert.equal(decorated.ok, true);
assert.equal(decorated.via, "binding");
assert.equal(decorated.enabled, false);
assert.equal(decorated.qns_cd_spec, "QNS-CD-1.0");
assert.equal(decorated.qns_cd.public_qnsd_proxy, false);
assert.equal(decorated.split_the_wires.title, "SPLIT THE WIRES");
assert.equal(decorated.cold_copy_survival.title, "COLD-COPY SURVIVAL");
assert.equal(decorated.re_expand_from_archive.title, "RE-EXPAND-FROM-ARCHIVE");

const pub = publicMesh({ enabled: false });
assert.equal(pub.enabled, false);
assert.equal(pub.live_nodes, 0);
assert.equal(pub.qns_cd_spec, "QNS-CD-1.0");
assert.equal(pub.split_the_wires_spec, "SPLIT-THE-WIRES-1.0");
assert.equal(pub.cold_copy_survival_spec, "COLD-COPY-SURVIVAL-1.0");
assert.equal(pub.re_expand_from_archive_spec, "RE-EXPAND-FROM-ARCHIVE-1.0");
assert.equal(pub.product, "azhub");

const pointer = meshPointer();
assert.equal(pointer.enabled_default, false);
assert.equal(pointer.proxy, true);
assert.equal(pointer.node_gate, false);
assert.equal(pointer.anonymity, false);
assert.match(pointer.anon_broadcast, /not a publish path/);
assert.equal(pointer.qns_cd_spec, "QNS-CD-1.0");
assert.equal(pointer.qns_cd.softwares_tab, false);
assert.equal(pointer.split_the_wires.softwares_tab, false);
assert.equal(pointer.cold_copy_survival.softwares_tab, false);
assert.equal(pointer.re_expand_from_archive.softwares_tab, false);
assert.match(pointer.note, /QNS-CD-1\.0/);
assert.match(pointer.note, /SPLIT THE WIRES/);
assert.match(pointer.note, /COLD-COPY SURVIVAL/);
assert.match(pointer.note, /RE-EXPAND-FROM-ARCHIVE/);
assert.match(pointer.note, /qnm-node/);

assert.equal(alignLiveNodes({ mesh: { enabled: false, live_nodes: 9 } }), 0);
assert.match(meshStatusLine({ enabled: false }), /QNS-CD-1\.0/);
assert.match(meshStatusLine({ enabled: false }), /SPLIT THE WIRES/);
assert.match(meshStatusLine({ enabled: false }), /COLD-COPY SURVIVAL/);
assert.match(meshStatusLine({ enabled: false }), /RE-EXPAND-FROM-ARCHIVE/);

const parsed = parseMeshDoc({ ok: true, enabled: false, live_nodes: 3, rollup: { live: 3, locked: 1, isolated: 0 } });
assert.equal(parsed.enabled, false);
assert.equal(parsed.live_nodes, 0);
assert.equal(parsed.qns_cd.spec, "QNS-CD-1.0");
assert.equal(parsed.split_the_wires.spec, "SPLIT-THE-WIRES-1.0");
assert.equal(parsed.cold_copy_survival.spec, "COLD-COPY-SURVIVAL-1.0");
assert.equal(parsed.re_expand_from_archive.spec, "RE-EXPAND-FROM-ARCHIVE-1.0");

assert.equal(meshLawRefuse("status"), null);
assert.equal(meshLawRefuse("join"), null);
assert.equal(meshLawRefuse("heartbeat"), null);
assert.equal(meshLawRefuseFromPath("/v1/mesh/status"), null);
assert.equal(meshLawRefuseFromPath("/v1/mesh/nodes"), null);

const stw = meshLawRefuse("auto-splice");
assert.equal(stw.ok, false);
assert.equal(stw.refused, true);
assert.equal(stw.code, "STW-REFUSE");
assert.equal(stw.reason, "auto_splice");
assert.equal(stw.split_the_wires.partition, "no-auto-splice");

const push = meshLawRefuse("push payload");
assert.equal(push.code, "STW-REFUSE");
assert.equal(push.reason, "push_payload");

const phoenix = meshLawRefuseFromPath("/v1/mesh/phoenix-hunt");
assert.equal(phoenix.code, "STW-REFUSE");
assert.equal(phoenix.reason, "phoenix_hunt");

const ccs = meshLawRefuse("live_body_sync");
assert.equal(ccs.ok, false);
assert.equal(ccs.code, "CCS-REFUSE");
assert.equal(ccs.reason, "live_body_sync");
assert.equal(ccs.cold_copy_survival.live_body_sync, false);

const wipe = meshLawRefuseFromPath("/v1/mesh/server-pull-wipe/");
assert.equal(wipe.code, "CCS-REFUSE");
assert.equal(wipe.reason, "server_pull_wipe");
assert.equal(wipe.cold_copy_survival.server_pull_wipes_cold_replicas, false);

const poison = meshLawRefuse("interpret poison");
assert.equal(poison.code, "CCS-REFUSE");
assert.equal(poison.cold_copy_survival.poison, "hash-absolute-refuse");

const rea = meshLawRefuse("re-expand-from-index");
assert.equal(rea.ok, false);
assert.equal(rea.code, "REA-REFUSE");
assert.equal(rea.reason, "re_expand_from_index");
assert.equal(rea.re_expand_from_archive.re_expand, "archive-verify-and-local-node");
assert.equal(rea.re_expand_from_archive.re_expand_not, "mesh-from-index");
assert.equal(rea.re_expand_from_archive.chain_survives, "bytes");
assert.equal(rea.re_expand_from_archive.crawlers_re_expand, false);
assert.equal(rea.re_expand_from_archive.weights_are_tarball, false);

const crawler = meshLawRefuseFromPath("/v1/mesh/crawler-re-expand");
assert.equal(crawler.code, "REA-REFUSE");
assert.equal(crawler.reason, "crawler_re_expand");

const weights = meshLawRefuse("weights as tarball");
assert.equal(weights.code, "REA-REFUSE");
assert.equal(weights.reason, "weights_as_tarball");

console.log("worker mesh QNS-CD-1.0 + SPLIT THE WIRES + COLD-COPY SURVIVAL + RE-EXPAND-FROM-ARCHIVE ok");
