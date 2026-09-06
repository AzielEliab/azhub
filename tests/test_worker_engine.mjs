import assert from "node:assert/strict";
import { catalogPayload, dispatch, LIVE_OPS, OPS, STUB_OPS, TILES } from "../workers/download-tracker/src/engine.js";

assert.ok(LIVE_OPS.includes("place") && LIVE_OPS.includes("blank_key_status"));
assert.ok(STUB_OPS.includes("recommend") && STUB_OPS.includes("activate_by_copresence"));
assert.equal(OPS.length, LIVE_OPS.length + STUB_OPS.length);

const slugs = TILES.map((t) => t.slug);
assert.deepEqual(slugs, [...slugs].sort());
assert.equal(catalogPayload().ranked, false);

const home = await dispatch("home", {});
assert.equal(home.ok, true);
assert.match(home.sigil, /sigil\.png/);
assert.ok(home.receipt.hash);
assert.equal(home.intent, null);

const sid = home.session_id;
const a = await dispatch("place", { slug: "azmail", x: 40, y: 40, session_id: sid }, sid);
const b = await dispatch("place", { slug: "peacelock", x: 200, y: 80, session_id: sid }, sid);
assert.equal(a.ok, true);
assert.equal(b.ok, true);
assert.equal(a.collapsed_into_interface, false);

const t = await dispatch("tether_declare", { from: "azmail", to: "peacelock", session_id: sid }, sid);
assert.equal(t.ok, true);
assert.equal(t.tether.visible, true);
assert.equal(t.tether.auto, false);

const iso = await dispatch("isolate", { slug: "azmail", session_id: sid }, sid);
assert.equal(iso.ok, true);
assert.equal(iso.modules_remain_complete_if_hub_removed, true);

const stub = await dispatch("recommend", { session_id: sid }, sid);
assert.equal(stub.code, "FG-STUB");
assert.equal(stub.ok, false);

const bad = await dispatch("not_real", {});
assert.equal(bad.code, "FG-HALLUC-TOOL");

console.log("worker engine smoke ok", OPS.length, "ops");
