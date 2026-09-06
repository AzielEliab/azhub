/**
 * Prove FragGate / runtime door paths are proxied — never local ops.
 */
import assert from "node:assert/strict";
import {
  classifyV1Path,
  DEFAULT_RUNTIME_ORIGIN,
  doorTargetUrl,
  localOpFromPath,
  mapDoorPath,
} from "../workers/download-tracker/src/door.js";
import { handleRuntimeApi } from "../workers/download-tracker/src/runtime.js";
import { dispatch } from "../workers/download-tracker/src/engine.js";

assert.deepEqual(classifyV1Path("/v1/fraggate/call"), {
  kind: "door",
  path: "/v1/fraggate/call",
  originPath: "/v1/fraggate/call",
});
assert.deepEqual(classifyV1Path("/v1/runtime/list"), {
  kind: "door",
  path: "/v1/runtime/list",
  originPath: "/v1/fraggate/list",
});
assert.deepEqual(classifyV1Path("/v1/place"), {
  kind: "local",
  path: "/v1/place",
  op: "place",
});
assert.equal(localOpFromPath("/v1/fraggate/call"), null);
assert.equal(localOpFromPath("/v1/blank_key_status"), "blank_key_status");
assert.equal(mapDoorPath("/v1/runtime/list"), "/v1/fraggate/list");
assert.equal(
  doorTargetUrl("/v1/fraggate/call", "https://azhub-download-tracker.vibelock.workers.dev/v1/fraggate/call"),
  DEFAULT_RUNTIME_ORIGIN + "/v1/fraggate/call",
);
assert.equal(classifyV1Path("/v1/not/a/door").kind, "multi");
assert.equal(classifyV1Path("/count").kind, "none");

const engineRefuse = await dispatch("fraggate/call", {});
assert.equal(engineRefuse.code, "FG-HALLUC-TOOL");
assert.equal(engineRefuse.op, "fraggate/call");

const fetches = [];
const previousFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input.url;
  fetches.push({ url, method: (init && init.method) || (input && input.method) || "GET" });
  return new Response(JSON.stringify({ ok: true, door: "fraggate", proxied: true, origin: url }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};

try {
  const callReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/v1/fraggate/call", {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" },
    body: JSON.stringify({ slug: "azhub", op: "health", payload: {} }),
  });
  const callRes = await handleRuntimeApi(callReq, new URL(callReq.url), {});
  assert.ok(callRes, "door path must be handled");
  const callBody = await callRes.json();
  assert.notEqual(callBody.code, "FG-HALLUC-TOOL");
  assert.equal(callBody.ok, true);
  assert.equal(callBody.proxied, true);
  assert.equal(callRes.headers.get("X-Aziel-Door"), "proxy");
  assert.ok(fetches.some((f) => f.url === DEFAULT_RUNTIME_ORIGIN + "/v1/fraggate/call" && f.method === "POST"));

  fetches.length = 0;
  const listReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/v1/runtime/list", {
    method: "GET",
    headers: { "user-agent": "Mozilla/5.0" },
  });
  const listRes = await handleRuntimeApi(listReq, new URL(listReq.url), {});
  const listBody = await listRes.json();
  assert.equal(listBody.ok, true);
  assert.ok(fetches.some((f) => f.url === DEFAULT_RUNTIME_ORIGIN + "/v1/fraggate/list"));

  const localReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/v1/place", {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" },
    body: JSON.stringify({ slug: "azmail", x: 40, y: 40 }),
  });
  const localRes = await handleRuntimeApi(localReq, new URL(localReq.url), {});
  const localBody = await localRes.json();
  assert.equal(localBody.ok, true);
  assert.equal(localBody.action, "place");
  assert.ok(localBody.receipt);

  const stubReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/v1/rank", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const stubRes = await handleRuntimeApi(stubReq, new URL(stubReq.url), {});
  const stubBody = await stubRes.json();
  assert.equal(stubBody.code, "FG-STUB");

  const healthReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/v1/health", {
    method: "GET",
    headers: { "user-agent": "Mozilla/5.0" },
  });
  const healthRes = await handleRuntimeApi(healthReq, new URL(healthReq.url), {});
  const healthBody = await healthRes.json();
  assert.equal(healthBody.ok, true);
  assert.equal(healthBody.product, "azhub");

  const multiReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/v1/not/a/door", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const multiRes = await handleRuntimeApi(multiReq, new URL(multiReq.url), {});
  const multiBody = await multiRes.json();
  assert.equal(multiBody.code, "NOT_LOCAL_OP");

  for (const path of ["/count", "/stats", "/download", "/"]) {
    const req = new Request("https://azhub-download-tracker.vibelock.workers.dev" + path, { method: "GET" });
    const res = await handleRuntimeApi(req, new URL(req.url), {});
    assert.equal(res, null, path + " must stay on the download tracker, not the runtime router");
  }
} finally {
  globalThis.fetch = previousFetch;
}

console.log("worker door proxy smoke ok");
