/**
 * Official rose-star brand mark is local /sigil.png with empty alt.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SIGIL } from "../workers/download-tracker/src/engine.js";
import { homeHtml } from "../workers/download-tracker/src/ui.js";
import worker from "../workers/download-tracker/src/index.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const PNG_PATH = join(HERE, "../workers/download-tracker/public/sigil.png");
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const HOST = "https://azhub-download-tracker.vibelock.workers.dev";

assert.equal(SIGIL, "/sigil.png");
assert.equal(existsSync(PNG_PATH), true);
const onDisk = readFileSync(PNG_PATH);
assert.deepEqual(onDisk.subarray(0, 8), PNG_MAGIC);
assert.equal(onDisk.length, 75035);

const html = homeHtml({ views: 1, downloads: 2, github: { stars: 0, forks: 0, watchers: 0 } });
assert.match(
  html,
  /<img class="brandmark" src="\/sigil\.png" width="40" height="40" alt="" decoding="async">/,
);
assert.match(html, /rel="icon" type="image\/png" href="\/sigil\.png"/);
assert.match(html, /title="Home"/);
assert.doesNotMatch(html, /everblooming/i);
assert.doesNotMatch(html, /alt="Home"/);
assert.doesNotMatch(html, /azielcorpuslibrary\.net\/sigil\.png/);
assert.match(html, /Aziel Eliab/);

function mockEnv(png) {
  const store = {};
  return {
    store,
    DOWNLOADS: {
      async get(key) {
        return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
      },
      async put(key, value) {
        store[key] = String(value);
      },
      async list() {
        return { keys: Object.keys(store).map((name) => ({ name })), list_complete: true };
      },
    },
    ASSETS: {
      async fetch(req) {
        const path = new URL(typeof req === "string" ? req : req.url).pathname;
        if (path === "/sigil.png") {
          return new Response(png, {
            status: 200,
            headers: { "Content-Type": "image/png", "Content-Length": String(png.byteLength) },
          });
        }
        return new Response(null, { status: 404 });
      },
    },
  };
}

const env = mockEnv(onDisk);
const before = { ...env.store };
const res = await worker.fetch(new Request(HOST + "/sigil.png"), env);
assert.equal(res.status, 200);
assert.match(res.headers.get("Content-Type") || "", /image\/png/);
const body = Buffer.from(await res.arrayBuffer());
assert.deepEqual(body, onDisk);

const head = await worker.fetch(new Request(HOST + "/sigil.png", { method: "HEAD" }), env);
assert.equal(head.status, 200);
assert.match(head.headers.get("Content-Type") || "", /image\/png/);
assert.deepEqual(env.store, before);

const home = await worker.fetch(new Request(HOST + "/"), env);
assert.equal(home.status, 200);
const homeText = await home.text();
assert.match(homeText, /src="\/sigil\.png"/);
assert.match(homeText, /alt=""/);
assert.doesNotMatch(homeText, /everblooming/i);

console.log("worker brand mark ok", onDisk.length, "bytes");
