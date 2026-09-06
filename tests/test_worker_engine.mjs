import assert from "node:assert/strict";
import { blankKey, dispatch, LIVE_OPS, STUB_OPS } from "../workers/download-tracker/src/engine.js";

assert.ok(LIVE_OPS.includes("place_module") && LIVE_OPS.includes("tether_declare") && LIVE_OPS.includes("blank_key_status"));
assert.ok(STUB_OPS.includes("snap_activate") && STUB_OPS.includes("unlock"));

const bk = blankKey();
assert.equal(bk.blank_key, true);
assert.equal(bk.copresence_inert, true);
assert.equal(bk.hub_is, "SPACE");

const health = await dispatch("health", {});
assert.equal(health.ok, true);
assert.equal(health.product, "azhub");
assert.equal(health.hub_is, "SPACE");

const a = await dispatch("place_module", { slug: "azmail", region: "center" });
assert.equal(a.ok, true);
assert.equal(a.unlocked, false);
const sid = a.session_id;
const b = await dispatch("place_module", { slug: "peacelock", region: "center" }, sid);
assert.equal(b.ok, true);

const status = await dispatch("blank_key_status", {}, sid);
assert.equal(status.blank_key.copresence_inert, true);
assert.deepEqual(status.unlocks, []);
assert.ok(status.copresence.length >= 1);

const auto = await dispatch("place_module", { slug: "azbrowser", auto_wire: true }, sid);
assert.equal(auto.code, "HUB-NO-AUTO");

const t = await dispatch("tether_declare", { from: a.module.id, to: b.module.id }, sid);
assert.equal(t.ok, true);
assert.equal(t.tether.corridor, "visible");
assert.equal(t.tether.scope, "session");

const cut = await dispatch("tether_cut", { id: t.tether.id }, sid);
assert.equal(cut.ok, true);

const stub = await dispatch("snap_activate", {}, sid);
assert.equal(stub.code, "HUB-STUB");

const bad = await dispatch("not_real", {});
assert.equal(bad.code, "FG-HALLUC-TOOL");

console.log("worker engine smoke ok", LIVE_OPS.length, "ops");
