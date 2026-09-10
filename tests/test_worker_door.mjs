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
assert.deepEqual(classifyV1Path("/v1/place_module"), {
  kind: "local",
  path: "/v1/place_module",
  op: "place_module",
});
assert.deepEqual(classifyV1Path("/v1/region_list"), {
  kind: "local",
  path: "/v1/region_list",
  op: "region_list",
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
assert.deepEqual(classifyV1Path("/v1/mesh"), {
  kind: "door",
  path: "/v1/mesh",
  originPath: "/v1/mesh",
});
assert.deepEqual(classifyV1Path("/v1/mesh/status"), {
  kind: "door",
  path: "/v1/mesh/status",
  originPath: "/v1/mesh/status",
});
assert.equal(localOpFromPath("/v1/mesh"), null);
assert.equal(
  doorTargetUrl("/v1/mesh/nodes", "https://azhub-download-tracker.vibelock.workers.dev/v1/mesh/nodes"),
  DEFAULT_RUNTIME_ORIGIN + "/v1/mesh/nodes",
);

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

  const fgReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/v1/place_module", {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" },
    body: JSON.stringify({ slug: "peacelock", x: 80, y: 80, session_id: localBody.session_id }),
  });
  const fgRes = await handleRuntimeApi(fgReq, new URL(fgReq.url), {});
  const fgBody = await fgRes.json();
  assert.equal(fgBody.ok, true);
  assert.equal(fgBody.action, "place");

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

  fetches.length = 0;
  const meshReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/v1/mesh/status", {
    method: "GET",
    headers: { "user-agent": "Mozilla/5.0" },
  });
  const meshRes = await handleRuntimeApi(meshReq, new URL(meshReq.url), {});
  const meshBody = await meshRes.json();
  assert.equal(meshBody.ok, true);
  assert.equal(meshBody.qns_cd_spec, "QNS-CD-1.0");
  assert.equal(meshBody.qns_cd.spec, "QNS-CD-1.0");
  assert.equal(meshBody.qns_cd.public_qnsd_proxy, false);
  assert.equal(meshBody.qns_cd.softwares_tab, false);
  assert.equal(meshRes.headers.get("X-Aziel-Door"), "proxy");
  assert.ok(fetches.some((f) => f.url === DEFAULT_RUNTIME_ORIGIN + "/v1/mesh/status" && f.method === "GET"));

  fetches.length = 0;
  const boundCalls = [];
  const meshBoundReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/v1/mesh/nodes", {
    method: "GET",
    headers: { "user-agent": "Mozilla/5.0" },
  });
  const meshBoundRes = await handleRuntimeApi(meshBoundReq, new URL(meshBoundReq.url), {
    AZIEL_RUNTIME: {
      fetch: async (input, init) => {
        const url = typeof input === "string" ? input : input.url;
        boundCalls.push({ url, method: (init && init.method) || "GET" });
        return new Response(JSON.stringify({ ok: true, enabled: false, live_nodes: 0, via: "binding" }), {
          status: 200,
          headers: { "content-type": "application/json; charset=utf-8" },
        });
      },
    },
  });
  const meshBoundBody = await meshBoundRes.json();
  assert.equal(meshBoundBody.via, "binding");
  assert.equal(meshBoundBody.qns_cd_spec, "QNS-CD-1.0");
  assert.equal(meshBoundBody.qns_cd.local_daemon.coded_in, "https://github.com/AzielEliab/qnm-node");
  assert.equal(fetches.length, 0, "AZIEL_RUNTIME binding must win over HTTPS fallback");
  assert.ok(boundCalls.some((f) => f.url === DEFAULT_RUNTIME_ORIGIN + "/v1/mesh/nodes"));

  const specReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/openapi.json", { method: "GET" });
  const specRes = await handleRuntimeApi(specReq, new URL(specReq.url), {});
  const spec = await specRes.json();
  assert.ok(spec.paths["/v1/mesh"]);
  assert.ok(spec.paths["/v1/mesh/nodes"]);
  assert.match(spec.info.description, /\/v1\/mesh/);

  const mcpReq = new Request("https://azhub-download-tracker.vibelock.workers.dev/mcp", { method: "GET" });
  const mcpRes = await handleRuntimeApi(mcpReq, new URL(mcpReq.url), {});
  const mcp = await mcpRes.json();
  assert.equal(mcp.mesh.path, "/v1/mesh");
  assert.equal(mcp.mesh.enabled_default, false);
  assert.equal(mcp.mesh.node_gate, false);
  assert.equal(mcp.mesh.auto_heal, false);
  assert.equal(mcp.mesh.anonymity, false);
  assert.match(mcp.mesh.anon_broadcast, /not a publish path/);
  assert.equal(mcp.mesh.qns_cd_spec, "QNS-CD-1.0");
  assert.equal(mcp.mesh.qns_cd.spec, "QNS-CD-1.0");
  assert.match(mcp.note, /mesh/);
  assert.match(mcp.note, /QNS-CD-1\.0/);

  for (const path of ["/count", "/stats", "/download", "/"]) {
    const req = new Request("https://azhub-download-tracker.vibelock.workers.dev" + path, { method: "GET" });
    const res = await handleRuntimeApi(req, new URL(req.url), {});
    assert.equal(res, null, path + " must stay on the download tracker, not the runtime router");
  }
} finally {
  globalThis.fetch = previousFetch;
}

console.log("worker door proxy smoke ok");
