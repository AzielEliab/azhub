import assert from "node:assert/strict";
import { homeHtml } from "../workers/download-tracker/src/ui.js";
import { robotsTxt } from "../workers/download-tracker/src/runtime.js";

const html = homeHtml({ views: 3, downloads: 7 });
assert.match(html, /draggable="true"/);
assert.match(html, /id="popup"/);
assert.match(html, /Custody of placement/);
assert.match(html, /Optional tether declare/);
assert.match(html, /does <b>not<\/b> unlock/);
assert.match(html, /data-kind="app"/);
assert.match(html, /data-kind="lock"/);
assert.match(html, /id="corridors"/);
assert.match(html, /everblooming sigil/);
assert.match(html, /background:#000000|#000/);
assert.match(html, /#c9a227/);
assert.match(html, /color:#ffffff|#fff/);
assert.match(html, /azhub-0.1.0.tar.gz/);
assert.match(html, /place_module/);
assert.match(html, /tether_declare/);
assert.match(html, /tether_cut/);
assert.doesNotMatch(html, /callOp\("snap/);
assert.doesNotMatch(html, /id="snapBtn"/);
assert.match(html, /never AZInterface|never collapse/i);
assert.match(html, /THIS IS NOT:[\s\S]*Snap activation event/);

const robots = robotsTxt("https://azhub-download-tracker.vibelock.workers.dev");
assert.match(robots, /User-agent: GPTBot/);
assert.match(robots, /Allow: \//);
assert.match(robots, /Content-Signal: search=yes, ai-input=yes, ai-train=yes/);
assert.doesNotMatch(robots, /Disallow: \//);
assert.doesNotMatch(robots, /Index of/);
assert.match(robots, /Sitemap: https:\/\/azhub-download-tracker\.vibelock\.workers\.dev\/sitemap\.xml/);

console.log("worker ui + robots smoke ok");
