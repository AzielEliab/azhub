/**
 * Local Blank Key canvas for verification (loopback).
 * GET / → Worker UI. POST /v1/{op} → engine.dispatch.
 */
import http from "node:http";
import { dispatch } from "../workers/download-tracker/src/engine.js";
import { homeHtml } from "../workers/download-tracker/src/ui.js";
import { handleRuntimeApi } from "../workers/download-tracker/src/runtime.js";

const PORT = Number(process.env.AZHUB_PORT || 8880);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: req.method === "POST" || req.method === "PUT" ? req : undefined,
    duplex: "half",
  });
  if (url.pathname === "/" && req.method === "GET") {
    const html = homeHtml({ views: 1, downloads: 0, github: { stars: 0, forks: 0, watchers: 0 } });
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }
  const runtime = await handleRuntimeApi(request, url, {});
  if (runtime) {
    res.writeHead(runtime.status, Object.fromEntries(runtime.headers.entries()));
    res.end(Buffer.from(await runtime.arrayBuffer()));
    return;
  }
  if (url.pathname === "/count") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ project: "azhub", views: 1, downloads: 0, total: 0 }));
    return;
  }
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not found", hint: await dispatch("health", {}) }));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`AZHub local canvas http://127.0.0.1:${PORT}`);
});
