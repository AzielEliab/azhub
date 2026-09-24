/**
 * Homepage Download is a real one-click asset link.
 * /download still counts the canonical tree and a fork on separate keys,
 * and the total includes both.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import worker from "../workers/download-tracker/src/index.js";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../workers/download-tracker/public");
const store = new Map();
const env = {
  DOWNLOADS: {
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async put(key, value) {
      store.set(key, String(value));
    },
    async list() {
      return { keys: [...store.keys()].map((name) => ({ name })), list_complete: true };
    },
  },
  ASSETS: {
    async fetch(request) {
      const name = decodeURIComponent(new URL(request.url).pathname.replace(/^\//, ""));
      try {
        const body = readFileSync(join(publicDir, name));
        return new Response(body, { status: 200, headers: { "Content-Length": String(body.length) } });
      } catch {
        return new Response("missing", { status: 404 });
      }
    },
  },
};

const previousFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input.url;
  if (String(url).includes("api.github.com")) {
    return new Response(JSON.stringify({ stargazers_count: 0, forks_count: 0, subscribers_count: 0 }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
  return previousFetch(input, init);
};

function get(path, method = "GET") {
  return worker.fetch(new Request("https://azhub-download-tracker.vibelock.workers.dev" + path, {
    method,
    headers: { "user-agent": "Mozilla/5.0" },
  }), env);
}

function lin(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrast(a, b) {
  const L1 = lum(a);
  const L2 = lum(b);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

try {
  const home = await get("/");
  assert.equal(home.status, 200);
  const html = await home.text();
  assert.match(html, /id="downloadBtn"[^>]*href="\/download\?asset=azhub-0\.1\.0\.tar\.gz"/);
  assert.match(html, /class="btn block primary"/);
  assert.match(html, />Download</);
  assert.match(html, /<footer class="quiet">/);
  assert.match(html, /:focus-visible/);
  assert.match(html, /prefers-color-scheme:\s*light/);
  assert.match(html, /0 downloads/);
  assert.match(html, /id="views"/);
  assert.match(html, /id="downloads"/);
  assert.equal(store.get("azhub|__total__"), undefined);
  assert.ok(contrast("#ffffff", "#0b0b0b") >= 4.5);
  assert.ok(contrast("#0b0b0b", "#c9a227") >= 4.5);
  assert.ok(contrast("#1a1408", "#fbf8f1") >= 4.5);
  assert.ok(contrast("#fffdf8", "#6b5010") >= 4.5);
  assert.ok(contrast("#6b5010", "#fbf8f1") >= 3);

  const head = await get("/download?asset=azhub-0.1.0.tar.gz", "HEAD");
  assert.equal(head.status, 200);
  assert.equal(store.get("azhub|__total__"), undefined);

  const file = await get("/download?asset=azhub-0.1.0.tar.gz");
  assert.equal(file.status, 200);
  assert.match(file.headers.get("content-type") || "", /gzip/);
  assert.match(file.headers.get("content-disposition") || "", /azhub-0\.1\.0\.tar\.gz/);
  const bytes = new Uint8Array(await file.arrayBuffer());
  assert.equal(bytes[0], 0x1f);
  assert.equal(bytes[1], 0x8b);
  assert.equal(store.get("azhub|AzielEliab|azhub|main|0"), "1");
  assert.equal(store.get("azhub|__total__"), "1");

  const fork = await get("/download?asset=azhub-0.1.0.tar.gz&owner=Someone&repo=azhub&branch=feature&fork=1");
  assert.equal(fork.status, 200);
  assert.equal(store.get("azhub|Someone|azhub|feature|1"), "1");
  assert.equal(store.get("azhub|AzielEliab|azhub|main|0"), "1");
  assert.equal(store.get("azhub|__total__"), "2");

  const counted = await get("/");
  const again = await counted.text();
  assert.match(again, /2 downloads/);
  const count = await get("/count");
  const body = await count.json();
  assert.equal(body.downloads, 2);
  assert.equal(body.total, 2);
  assert.equal(body.project, "azhub");
} finally {
  globalThis.fetch = previousFetch;
}

console.log("worker download landing ok");
